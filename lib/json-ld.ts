import type { DocumentationPage } from "@/lib/content";
import type { SiteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

type Reference = { "@id": string };

type JsonLdEntity = {
  "@type": string;
  "@id": string;
  [key: string]: unknown;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

function ids(config: SiteConfig) {
  return {
    organization: `${canonicalUrl("/", config.siteUrl)}#organization`,
    website: `${canonicalUrl("/", config.siteUrl)}#website`,
    product: `${canonicalUrl("/product", config.siteUrl)}#software`,
  };
}

export function buildOrganizationSchema(config: SiteConfig): JsonLdEntity {
  const entityIds = ids(config);

  return {
    "@type": "Organization",
    "@id": entityIds.organization,
    name: config.legalOrganizationName,
    url: canonicalUrl("/", config.siteUrl),
    logo: canonicalUrl(config.logoPath, config.siteUrl),
    sameAs: config.socialProfiles.map((profile) => profile.url),
    email: config.contact.email,
  };
}

export function buildWebsiteSchema(config: SiteConfig): JsonLdEntity {
  const entityIds = ids(config);

  return {
    "@type": "WebSite",
    "@id": entityIds.website,
    name: config.siteName,
    url: canonicalUrl("/", config.siteUrl),
    description: config.description,
    inLanguage: config.locale.replace("_", "-"),
    publisher: { "@id": entityIds.organization } satisfies Reference,
  };
}

export function buildSoftwareApplicationSchema(
  config: SiteConfig,
): JsonLdEntity {
  const entityIds = ids(config);

  return {
    "@type": "SoftwareApplication",
    "@id": entityIds.product,
    name: config.product.name,
    applicationCategory: config.product.category,
    softwareVersion: config.product.version,
    operatingSystem: "Any",
    url: canonicalUrl("/product", config.siteUrl),
    description: config.description,
    publisher: { "@id": entityIds.organization } satisfies Reference,
  };
}

export function buildGlobalGraph(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(config),
      buildWebsiteSchema(config),
      buildSoftwareApplicationSchema(config),
    ],
  };
}

export function buildTechArticleSchema(
  page: DocumentationPage,
  config: SiteConfig,
): JsonLdEntity {
  const url = canonicalUrl(`/docs/${page.slug}`, config.siteUrl);

  return {
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: page.title,
    description: page.description,
    dateModified: page.lastUpdated,
    mainEntityOfPage: url,
    inLanguage: config.locale.replace("_", "-"),
    author: { "@id": ids(config).organization } satisfies Reference,
    publisher: { "@id": ids(config).organization } satisfies Reference,
  };
}

export function buildBreadcrumbSchema(
  items: readonly BreadcrumbItem[],
  config: SiteConfig,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path, config.siteUrl),
    })),
  };
}

export function buildFaqSchema(items: readonly FaqItem[], config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl("/faq", config.siteUrl)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
