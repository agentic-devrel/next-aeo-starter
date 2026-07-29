import { load } from "cheerio";

import { canonicalUrl, isLocalhostUrl } from "@/lib/urls";

export type AuditSeverity = "error" | "warning" | "informational";
export type AuditStatus = "pass" | "fail" | "info";

export type AuditResult = {
  id: string;
  label: string;
  path: string;
  severity: AuditSeverity;
  status: AuditStatus;
  message: string;
};

export type AuditResource = {
  path: string;
  status: number;
  contentType: string;
  body: string;
};

type EndpointExpectation = {
  contentTypes: readonly string[];
  requiredText?: readonly string[];
  parseJson?: boolean;
};

function result(
  passed: boolean,
  input: Omit<AuditResult, "status">,
): AuditResult {
  return { ...input, status: passed ? "pass" : "fail" };
}

function getJsonLdErrors(html: string) {
  const $ = load(html);
  const scripts = $('script[type="application/ld+json"]');
  const errors: string[] = [];

  scripts.each((_index, element) => {
    try {
      JSON.parse($(element).text());
    } catch {
      errors.push("invalid JSON-LD");
    }
  });

  if (scripts.length === 0) errors.push("missing JSON-LD");

  return errors;
}

export function inspectHtmlDocument(
  resource: AuditResource,
  canonicalOrigin: string,
): AuditResult[] {
  const $ = load(resource.body);
  const expectedCanonical = canonicalUrl(resource.path, canonicalOrigin);
  const canonicalValues = $('link[rel="canonical"]')
    .map((_index, element) => $(element).attr("href")?.trim())
    .get()
    .filter(Boolean);
  const robotsContent = $('meta[name="robots"], meta[name="googlebot"]')
    .map((_index, element) => $(element).attr("content") ?? "")
    .get()
    .join(",")
    .toLowerCase();
  const jsonLdErrors = getJsonLdErrors(resource.body);
  const results = [
    result(resource.status >= 200 && resource.status < 300, {
      id: "html-status",
      label: "Successful HTML response",
      path: resource.path,
      severity: "error",
      message: `HTTP ${resource.status || "request failed"}`,
    }),
    result(resource.contentType.toLowerCase().includes("text/html"), {
      id: "html-content-type",
      label: "HTML content type",
      path: resource.path,
      severity: "error",
      message: resource.contentType || "Content-Type header missing",
    }),
    result($("title").first().text().trim().length > 0, {
      id: "title",
      label: "Document title",
      path: resource.path,
      severity: "error",
      message: $("title").first().text().trim() || "Title is missing",
    }),
    result(
      ($('meta[name="description"]').attr("content") ?? "").trim().length > 0,
      {
        id: "meta-description",
        label: "Meta description",
        path: resource.path,
        severity: "warning",
        message:
          $('meta[name="description"]').attr("content")?.trim() ||
          "Description is missing",
      },
    ),
    result(
      canonicalValues.length === 1 && canonicalValues[0] === expectedCanonical,
      {
        id: "canonical",
        label: "Deterministic canonical URL",
        path: resource.path,
        severity: "error",
        message:
          canonicalValues.length === 1
            ? `Expected ${expectedCanonical}; received ${canonicalValues[0]}`
            : `Expected one canonical; received ${canonicalValues.length}`,
      },
    ),
    result(
      canonicalValues.every((value) => !isLocalhostUrl(value)),
      {
        id: "canonical-localhost",
        label: "No localhost production canonical",
        path: resource.path,
        severity: "error",
        message:
          canonicalValues.join(", ") || "No canonical available to inspect",
      },
    ),
    result(!robotsContent.includes("noindex"), {
      id: "noindex",
      label: "No accidental noindex",
      path: resource.path,
      severity: "error",
      message: robotsContent || "No page-level noindex directive",
    }),
    result($("h1").length === 1, {
      id: "h1",
      label: "One visible H1",
      path: resource.path,
      severity: "error",
      message: `Found ${$("h1").length} H1 elements`,
    }),
    result(jsonLdErrors.length === 0, {
      id: "json-ld",
      label: "Valid structured data",
      path: resource.path,
      severity: "error",
      message:
        jsonLdErrors.length === 0
          ? "JSON-LD present and parseable"
          : jsonLdErrors.join(", "),
    }),
  ];

  if (resource.path === "/") {
    const hasSkipLink = $('a[href="#main-content"]').length > 0;
    const hasMain = $("main#main-content").length === 1;
    const hasNavigation =
      $('nav[aria-label="Primary navigation"]').length === 1;

    results.push(
      result(hasSkipLink && hasMain && hasNavigation, {
        id: "homepage-landmarks",
        label: "Homepage navigation landmarks",
        path: resource.path,
        severity: "error",
        message: `skip link: ${hasSkipLink}; main: ${hasMain}; primary nav: ${hasNavigation}`,
      }),
    );
  }

  return results;
}

export function inspectMachineEndpoint(
  resource: AuditResource,
  expectation: EndpointExpectation,
): AuditResult[] {
  const normalizedType = resource.contentType.toLowerCase();
  const contentTypeMatches = expectation.contentTypes.some((type) =>
    normalizedType.includes(type),
  );
  const missingText =
    expectation.requiredText?.filter((text) => !resource.body.includes(text)) ??
    [];
  let jsonIsValid = true;

  if (expectation.parseJson) {
    try {
      JSON.parse(resource.body);
    } catch {
      jsonIsValid = false;
    }
  }

  return [
    result(resource.status >= 200 && resource.status < 300, {
      id: "endpoint-status",
      label: "Machine endpoint status",
      path: resource.path,
      severity: "error",
      message: `HTTP ${resource.status || "request failed"}`,
    }),
    result(contentTypeMatches, {
      id: "endpoint-content-type",
      label: "Machine endpoint content type",
      path: resource.path,
      severity: "error",
      message: resource.contentType || "Content-Type header missing",
    }),
    result(missingText.length === 0, {
      id: "endpoint-required-content",
      label: "Machine endpoint required content",
      path: resource.path,
      severity: "warning",
      message:
        missingText.length === 0
          ? "Expected markers present"
          : `Missing: ${missingText.join(", ")}`,
    }),
    ...(expectation.parseJson
      ? [
          result(jsonIsValid, {
            id: "endpoint-json",
            label: "Machine endpoint valid JSON",
            path: resource.path,
            severity: "error" as const,
            message: jsonIsValid
              ? "JSON parsed successfully"
              : "Response is not valid JSON",
          }),
        ]
      : []),
  ];
}

export function extractInternalPaths(html: string, requestOrigin: string) {
  const $ = load(html);
  const origin = new URL(requestOrigin).origin;
  const paths = new Set<string>();

  $("a[href]").each((_index, element) => {
    const href = $(element).attr("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;

    try {
      const url = new URL(href, origin);
      if (url.origin !== origin) return;
      paths.add(`${url.pathname}${url.search}`);
    } catch {
      return;
    }
  });

  return [...paths].sort();
}

export function inspectInternalLinkStatuses(
  resources: readonly AuditResource[],
): AuditResult {
  const failures = resources.filter(
    (resource) => resource.status < 200 || resource.status >= 400,
  );

  return result(failures.length === 0, {
    id: "internal-links",
    label: "Sampled internal-link integrity",
    path: "sampled pages",
    severity: "error",
    message:
      failures.length === 0
        ? `${resources.length} unique internal targets resolved`
        : failures
            .map(
              (resource) =>
                `${resource.path} (${resource.status || "request failed"})`,
            )
            .join(", "),
  });
}

export function summarizeAudit(results: readonly AuditResult[]) {
  return {
    passed: results.filter((item) => item.status === "pass").length,
    errors: results.filter(
      (item) => item.status === "fail" && item.severity === "error",
    ).length,
    warnings: results.filter(
      (item) => item.status === "fail" && item.severity === "warning",
    ).length,
    informational: results.filter((item) => item.severity === "informational")
      .length,
  };
}
