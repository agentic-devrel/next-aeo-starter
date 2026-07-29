import { describe, expect, it } from "vitest";

import {
  extractInternalPaths,
  inspectHtmlDocument,
  inspectInternalLinkStatuses,
  inspectMachineEndpoint,
  summarizeAudit,
  type AuditResource,
} from "@/lib/aeo-audit";

const validHtml = `<!doctype html>
<html lang="en">
  <head>
    <title>SignalThread</title>
    <meta name="description" content="A useful description." />
    <link rel="canonical" href="https://example.com" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite"}</script>
  </head>
  <body>
    <a href="#main-content">Skip to content</a>
    <nav aria-label="Primary navigation"><a href="/docs">Docs</a></nav>
    <main id="main-content"><h1>SignalThread</h1><a href="/faq#answer">FAQ</a></main>
  </body>
</html>`;

function resource(overrides: Partial<AuditResource> = {}): AuditResource {
  return {
    path: "/",
    status: 200,
    contentType: "text/html; charset=utf-8",
    body: validHtml,
    ...overrides,
  };
}

describe("AEO audit rules", () => {
  it("passes deterministic checks for a complete HTML page", () => {
    const results = inspectHtmlDocument(resource(), "https://example.com");

    expect(results.every((item) => item.status === "pass")).toBe(true);
  });

  it("classifies localhost canonicals, noindex, invalid JSON-LD, and multiple H1s as errors", () => {
    const html = validHtml
      .replace("https://example.com", "http://localhost:3000")
      .replace("</head>", '<meta name="robots" content="noindex" /></head>')
      .replace(
        '{"@context":"https://schema.org","@type":"WebSite"}',
        "{invalid",
      )
      .replace("</main>", "<h1>Second heading</h1></main>");
    const failures = inspectHtmlDocument(
      resource({ body: html }),
      "https://example.com",
    ).filter((item) => item.status === "fail");

    expect(failures.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        "canonical",
        "canonical-localhost",
        "noindex",
        "h1",
        "json-ld",
      ]),
    );
    expect(failures.every((item) => item.severity === "error")).toBe(true);
  });

  it("checks machine content types, required markers, and JSON validity", () => {
    const results = inspectMachineEndpoint(
      resource({
        path: "/ai/site.json",
        contentType: "application/json",
        body: '{"name":"SignalThread"}',
      }),
      {
        contentTypes: ["application/json"],
        requiredText: ["SignalThread"],
        parseJson: true,
      },
    );

    expect(results.every((item) => item.status === "pass")).toBe(true);
  });

  it("extracts unique same-origin links without fragments", () => {
    expect(extractInternalPaths(validHtml, "http://127.0.0.1:3210")).toEqual([
      "/docs",
      "/faq",
    ]);
  });

  it("reports broken sampled links and summarizes severity", () => {
    const linkResult = inspectInternalLinkStatuses([
      resource({ path: "/docs" }),
      resource({ path: "/missing", status: 404 }),
    ]);
    const summary = summarizeAudit([linkResult]);

    expect(linkResult.status).toBe("fail");
    expect(linkResult.message).toContain("/missing (404)");
    expect(summary).toEqual({
      passed: 0,
      errors: 1,
      warnings: 0,
      informational: 0,
    });
  });
});
