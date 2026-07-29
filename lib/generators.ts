import type { DocumentationPage } from "@/lib/content";
import { changelogEntries, documentationPages } from "@/lib/content";
import type { SiteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

export function serializeDocumentationMarkdown(
  page: DocumentationPage,
  config: SiteConfig,
) {
  const lines = [
    `# ${page.title}`,
    "",
    page.description,
    "",
    `Canonical source: ${canonicalUrl(`/docs/${page.slug}`, config.siteUrl)}`,
    `Last updated: ${page.lastUpdated}`,
  ];

  if (page.version) {
    lines.push(`Version: ${page.version}`);
  }

  lines.push(
    "",
    "## Prerequisites",
    "",
    ...page.prerequisites.map((item) => `- ${item}`),
  );

  for (const section of page.sections) {
    lines.push("", `## ${section.heading}`, "");

    for (const block of section.blocks) {
      if (block.type === "paragraph") {
        lines.push(block.text, "");
      }

      if (block.type === "list") {
        lines.push(...block.items.map((item) => `- ${item}`), "");
      }

      if (block.type === "code") {
        lines.push(
          `### ${block.label}`,
          "",
          `\`\`\`${block.language}`,
          block.code,
          "\`\`\`",
          "",
        );
      }

      if (block.type === "note") {
        lines.push(`> **${block.title}:** ${block.text}`, "");
      }
    }
  }

  lines.push(
    "## Related links",
    "",
    ...page.relatedLinks.map(
      (link) => `- [${link.label}](${canonicalUrl(link.href, config.siteUrl)})`,
    ),
  );

  return `${lines.join("\n").trim()}\n`;
}

export function generateLlmsTxt(config: SiteConfig) {
  const docs = documentationPages.map(
    (page) =>
      `- [${page.title}](${canonicalUrl(`/docs/${page.slug}`, config.siteUrl)}): ${page.description}`,
  );

  return `${[
    `# ${config.siteName}`,
    "",
    `> ${config.description}`,
    "",
    `${config.siteName} is a fictional example product included with next-aeo-starter.`,
    "",
    "## Canonical resources",
    "",
    `- [Home](${canonicalUrl("/", config.siteUrl)}): Product summary and primary navigation.`,
    `- [Product](${canonicalUrl("/product", config.siteUrl)}): Capabilities, workflow, and limitations.`,
    `- [Documentation](${config.documentationUrl}): Task-oriented technical documentation.`,
    `- [Changelog](${canonicalUrl("/changelog", config.siteUrl)}): Versioned example release notes.`,
    "",
    "## Documentation",
    "",
    ...docs,
    "",
    "## Machine-readable resources",
    "",
    `- [Full documentation context](${canonicalUrl("/llms-full.txt", config.siteUrl)})`,
    `- [Site profile](${canonicalUrl("/ai/site.json", config.siteUrl)})`,
    `- [Sitemap](${canonicalUrl("/sitemap.xml", config.siteUrl)})`,
    `- [Changelog feed](${canonicalUrl("/feed.xml", config.siteUrl)})`,
    "",
    "## Status of this file",
    "",
    "llms.txt is an emerging convention, not a web standard. It supplements, and does not replace, crawlable HTML, internal links, robots policy, canonical metadata, or XML sitemaps. Its presence cannot guarantee indexing, ranking, recommendation, or citation by an AI system.",
  ].join("\n")}\n`;
}

export function generateLlmsFullTxt(config: SiteConfig) {
  const documents = documentationPages.map((page) =>
    serializeDocumentationMarkdown(page, config),
  );

  return `${generateLlmsTxt(config)}\n---\n\n# Full documentation\n\n${documents.join("\n---\n\n")}`;
}

export function generateSiteProfile(config: SiteConfig) {
  return {
    schemaVersion: "1.0",
    generatedAt: "2026-07-29",
    canonicalUrl: canonicalUrl("/ai/site.json", config.siteUrl),
    site: {
      name: config.siteName,
      description: config.description,
      url: canonicalUrl("/", config.siteUrl),
      locale: config.locale.replace("_", "-"),
      fictionalExample: config.isFictionalExample,
    },
    organization: {
      name: config.legalOrganizationName,
      url: canonicalUrl("/about", config.siteUrl),
    },
    product: {
      name: config.product.name,
      category: config.product.category,
      version: config.product.version,
      url: canonicalUrl("/product", config.siteUrl),
    },
    documentation: documentationPages.map((page) => ({
      title: page.title,
      description: page.description,
      version: page.version,
      lastUpdated: page.lastUpdated,
      canonicalUrl: canonicalUrl(`/docs/${page.slug}`, config.siteUrl),
      markdownUrl: canonicalUrl(`/docs/${page.slug}/markdown`, config.siteUrl),
    })),
    discovery: {
      llmsTxt: canonicalUrl("/llms.txt", config.siteUrl),
      llmsFullTxt: canonicalUrl("/llms-full.txt", config.siteUrl),
      sitemap: canonicalUrl("/sitemap.xml", config.siteUrl),
      robots: canonicalUrl("/robots.txt", config.siteUrl),
      changelogFeed: canonicalUrl("/feed.xml", config.siteUrl),
    },
    limitations: [
      "This profile is a project-defined format, not a web standard.",
      "Machine-readable metadata cannot guarantee indexing, ranking, recommendation, or citation.",
    ],
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function generateChangelogFeed(config: SiteConfig) {
  const items = changelogEntries
    .map((entry) => {
      const entryUrl = `${canonicalUrl("/changelog", config.siteUrl)}#${encodeURIComponent(entry.version)}`;

      return `  <entry>
    <title>${escapeXml(entry.version)}: ${escapeXml(entry.title)}</title>
    <id>${escapeXml(entryUrl)}</id>
    <link href="${escapeXml(entryUrl)}" />
    <updated>${entry.date}T00:00:00Z</updated>
    <summary>${escapeXml(entry.summary)}</summary>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(config.siteName)} changelog</title>
  <id>${canonicalUrl("/changelog", config.siteUrl)}</id>
  <link href="${canonicalUrl("/feed.xml", config.siteUrl)}" rel="self" />
  <link href="${canonicalUrl("/changelog", config.siteUrl)}" />
  <updated>${changelogEntries[0].date}T00:00:00Z</updated>
${items}
</feed>
`;
}
