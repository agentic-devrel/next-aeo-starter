import { describe, expect, it } from "vitest";

import { documentationPages, faqItems } from "@/lib/content";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildGlobalGraph,
  buildTechArticleSchema,
  serializeJsonLd,
} from "@/lib/json-ld";
import { siteConfig } from "@/lib/site-config";

describe("JSON-LD builders", () => {
  it("uses stable references for global entities", () => {
    const graph = buildGlobalGraph(siteConfig);
    const ids = graph["@graph"].map((entity) => entity["@id"]);

    expect(ids).toEqual([
      "https://example.com#organization",
      "https://example.com#website",
      "https://example.com/product#software",
    ]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("builds article and breadcrumb entities from canonical content", () => {
    const article = buildTechArticleSchema(documentationPages[0], siteConfig);
    const breadcrumbs = buildBreadcrumbSchema(
      [
        { name: "Home", path: "/" },
        { name: "Docs", path: "/docs" },
      ],
      siteConfig,
    );

    expect(article.mainEntityOfPage).toBe(
      "https://example.com/docs/getting-started",
    );
    expect(breadcrumbs.itemListElement[1].position).toBe(2);
    expect(breadcrumbs.itemListElement[1].item).toBe(
      "https://example.com/docs",
    );
  });

  it("uses the visible FAQ records without fabricated claims", () => {
    const schema = buildFaqSchema(faqItems, siteConfig);

    expect(schema.mainEntity).toHaveLength(faqItems.length);
    expect(schema.mainEntity[0].name).toBe(faqItems[0].question);
    expect(JSON.stringify(schema)).not.toMatch(
      /"(aggregateRating|review|offers|price)":/i,
    );
  });

  it("escapes HTML-significant content during serialization", () => {
    const serialized = serializeJsonLd({
      value: "</script><script>alert(1)</script>",
    });

    expect(serialized).not.toContain("<script>");
    expect(() => JSON.parse(serialized)).not.toThrow();
  });
});
