import { describe, expect, it } from "vitest";

import { changelogEntries, documentationPages } from "@/lib/content";
import {
  generateChangelogFeed,
  generateLlmsTxt,
  serializeDocumentationMarkdown,
} from "@/lib/generators";
import { buildSitemapEntries } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

describe("machine-readable generators", () => {
  it("generates llms.txt with canonical resources and a convention warning", () => {
    const output = generateLlmsTxt(siteConfig);

    expect(output).toContain("https://example.com/docs/getting-started");
    expect(output).toContain("emerging convention, not a web standard");
    expect(output).toContain(
      "cannot guarantee indexing, ranking, recommendation, or citation",
    );
  });

  it("serializes docs with source, prerequisites, code, and limitations", () => {
    const output = serializeDocumentationMarkdown(
      documentationPages[0],
      siteConfig,
    );

    expect(output).toContain(
      "Canonical source: https://example.com/docs/getting-started",
    );
    expect(output).toContain("## Prerequisites");
    expect(output).toContain("```bash");
    expect(output).toContain("**Limitation:**");
  });

  it("includes each canonical HTML page once in sitemap records", () => {
    const entries = buildSitemapEntries();
    const paths = entries.map((entry) => entry.path);

    expect(paths).toContain("/docs/getting-started");
    expect(paths).toContain("/docs/machine-readable-docs");
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.some((path) => path.endsWith("/markdown"))).toBe(false);
  });

  it("emits a valid Atom document shape without unescaped text", () => {
    const output = generateChangelogFeed(siteConfig);
    const entryIds = changelogEntries.map(
      (entry) => `https://example.com/changelog#${entry.version}`,
    );

    expect(output).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(output).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(output).toContain("https://example.com/feed.xml");
    entryIds.forEach((entryId) => {
      expect(output).toContain(`<id>${entryId}</id>`);
      expect(output).toContain(`<link href="${entryId}" />`);
    });
  });
});
