import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";

import {
  extractInternalPaths,
  inspectHtmlDocument,
  inspectInternalLinkStatuses,
  inspectMachineEndpoint,
  summarizeAudit,
  type AuditResource,
  type AuditResult,
} from "@/lib/aeo-audit";
import { crawlerPolicy } from "@/lib/crawler-policy";
import { buildSitemapEntries } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

function getMachineEndpoints(canonicalOrigin: string) {
  return [
    {
      path: "/robots.txt",
      contentTypes: ["text/plain"],
      requiredText: ["User-Agent: *", "Sitemap:"],
    },
    {
      path: "/sitemap.xml",
      contentTypes: ["application/xml", "text/xml"],
      requiredText: ["<urlset", canonicalOrigin],
    },
    {
      path: "/llms.txt",
      contentTypes: ["text/plain"],
      requiredText: ["emerging convention", "cannot guarantee"],
    },
    {
      path: "/llms-full.txt",
      contentTypes: ["text/plain"],
      requiredText: ["# Full documentation", "Canonical source:"],
    },
    {
      path: "/ai/site.json",
      contentTypes: ["application/json"],
      requiredText: ["canonicalUrl", "limitations"],
      parseJson: true,
    },
    {
      path: "/docs/getting-started/markdown",
      contentTypes: ["text/markdown"],
      requiredText: [
        "Canonical source:",
        "## Prerequisites",
        "**Limitation:**",
      ],
    },
    {
      path: "/feed.xml",
      contentTypes: ["application/atom+xml"],
      requiredText: ["<feed", "<entry>"],
    },
  ] as const;
}

function parseArgument(name: string) {
  const args = process.argv.slice(2);
  const flag = `--${name}`;
  const inline = args.find((argument) => argument.startsWith(`${flag}=`));
  const flagIndex = args.indexOf(flag);

  return (
    inline?.slice(`${flag}=`.length) ||
    (flagIndex >= 0 ? args[flagIndex + 1] : undefined)
  );
}

function normalizeTargetUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Audit target must use http or https.");
  }
  return url.toString().replace(/\/$/, "");
}

async function fetchResource(
  origin: string,
  path: string,
): Promise<AuditResource> {
  try {
    const response = await fetch(new URL(path, `${origin}/`), {
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

    return {
      path,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      body: await response.text(),
    };
  } catch (error) {
    return {
      path,
      status: 0,
      contentType: "",
      body: error instanceof Error ? error.message : "Request failed",
    };
  }
}

async function findAvailablePort(startAt: number) {
  for (let port = startAt; port < startAt + 20; port += 1) {
    const available = await new Promise<boolean>((resolveAvailability) => {
      const server = createServer();
      server.once("error", () => resolveAvailability(false));
      server.listen(port, "127.0.0.1", () => {
        server.close(() => resolveAvailability(true));
      });
    });

    if (available) return port;
  }

  throw new Error(
    "Could not find an available local port for the audit server.",
  );
}

async function waitForServer(
  origin: string,
  child: ChildProcess,
  output: () => string,
) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(
        `Next.js server exited before it was ready.\n${output()}`,
      );
    }

    try {
      const response = await fetch(origin, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }

  throw new Error(`Timed out waiting for ${origin}.\n${output()}`);
}

async function startBuiltServer() {
  if (!existsSync(resolve(process.cwd(), ".next/BUILD_ID"))) {
    throw new Error(
      "No production build found. Run `npm run build` before `npm run audit:aeo`.",
    );
  }

  const requestedPort = Number.parseInt(
    process.env.AEO_AUDIT_PORT ?? "3210",
    10,
  );
  const port = await findAvailablePort(
    Number.isFinite(requestedPort) ? requestedPort : 3210,
  );
  const origin = `http://127.0.0.1:${port}`;
  const nextBin = resolve(process.cwd(), "node_modules/next/dist/bin/next");
  const child = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let serverOutput = "";
  const capture = (chunk: Buffer) => {
    serverOutput = `${serverOutput}${chunk.toString()}`.slice(-4_000);
  };
  child.stdout?.on("data", capture);
  child.stderr?.on("data", capture);

  await waitForServer(origin, child, () => serverOutput);
  return { child, origin };
}

async function stopServer(child: ChildProcess) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolveClose) =>
      child.once("close", () => resolveClose()),
    ),
    new Promise<void>((resolveDelay) => setTimeout(resolveDelay, 2_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

function formatResult(result: AuditResult) {
  const labels = {
    pass: "PASS",
    error: "ERROR",
    warning: "WARN",
    informational: "INFO",
  } as const;
  const label =
    result.status === "pass" ? labels.pass : labels[result.severity];
  return `[${label.padEnd(5)}] ${result.path} · ${result.label} · ${result.message}`;
}

async function runAudit(origin: string, canonicalOrigin: string) {
  const pagePaths = buildSitemapEntries().map((entry) => entry.path);
  const pages = await Promise.all(
    pagePaths.map((path) => fetchResource(origin, path)),
  );
  const machineEndpoints = getMachineEndpoints(canonicalOrigin);
  const endpoints = await Promise.all(
    machineEndpoints.map((endpoint) => fetchResource(origin, endpoint.path)),
  );
  const results = pages.flatMap((page) =>
    inspectHtmlDocument(page, canonicalOrigin),
  );

  endpoints.forEach((endpoint, index) => {
    results.push(...inspectMachineEndpoint(endpoint, machineEndpoints[index]));
  });

  const internalPaths = new Set(
    pages.flatMap((page) => extractInternalPaths(page.body, origin)),
  );
  const internalResources = await Promise.all(
    [...internalPaths].map((path) => fetchResource(origin, path)),
  );
  results.push(inspectInternalLinkStatuses(internalResources));
  results.push({
    id: "crawler-policy-notice",
    label: "Crawler policy review notice",
    path: "/robots.txt",
    severity: "informational",
    status: "info",
    message: `Policy reviewed ${crawlerPolicy.reviewedAt}. ${crawlerPolicy.legalNotice}`,
  });

  return results;
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log(
      "Usage: npm run audit:aeo -- [--url https://example.com] [--canonical-origin https://example.com] [--verbose]",
    );
    return;
  }

  const explicitUrl = parseArgument("url") || process.env.AEO_AUDIT_URL;
  const explicitCanonical = parseArgument("canonical-origin");
  let server: Awaited<ReturnType<typeof startBuiltServer>> | undefined;
  const origin = explicitUrl
    ? normalizeTargetUrl(explicitUrl)
    : (server = await startBuiltServer()).origin;
  const targetHostname = new URL(origin).hostname;
  const targetIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(
    targetHostname,
  );
  const canonicalOrigin = explicitCanonical
    ? normalizeTargetUrl(explicitCanonical)
    : explicitUrl && !targetIsLocal
      ? new URL(origin).origin
      : siteConfig.siteUrl;

  try {
    console.log(
      `\nAEO implementation-readiness audit\nTarget: ${origin}\nCanonical origin: ${canonicalOrigin}\n`,
    );
    const results = await runAudit(origin, canonicalOrigin);
    const verbose = process.argv.includes("--verbose");
    const visibleResults = verbose
      ? results
      : results.filter(
          (item) => item.status !== "pass" || item.id === "internal-links",
        );

    visibleResults.forEach((item) => console.log(formatResult(item)));
    const summary = summarizeAudit(results);
    console.log(
      `\nSummary: ${summary.passed} passed, ${summary.errors} errors, ${summary.warnings} warnings, ${summary.informational} informational.`,
    );
    console.log(
      "This report covers only the documented implementation checks. It is not an AI ranking, citation, or visibility score.\n",
    );

    if (summary.errors > 0) process.exitCode = 1;
  } finally {
    if (server) await stopServer(server.child);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
