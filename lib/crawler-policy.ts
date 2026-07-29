export type CrawlerPolicyRule = {
  userAgents: readonly string[];
  allow?: readonly string[];
  disallow?: readonly string[];
  category: "search-and-general" | "model-training-or-control";
  rationale: string;
  source?: string;
};

/**
 * Verify named tokens against current vendor documentation before each release.
 * User-agent names, product controls, and crawler behavior can change independently.
 */
export const crawlerPolicy = {
  reviewedAt: "2026-07-29",
  defaultPosture:
    "Allow public search, indexing, and general crawling; disallow selected model-training or product-control tokens.",
  legalNotice:
    "Robots directives are voluntary controls, not access control or legal advice. Review licensing, privacy, contractual, and business requirements independently.",
  rules: [
    {
      userAgents: ["*"],
      allow: ["/"],
      category: "search-and-general",
      rationale:
        "Public pages and machine-readable resources are crawlable by default, including conventional search crawlers.",
    },
    {
      userAgents: ["GPTBot"],
      disallow: ["/"],
      category: "model-training-or-control",
      rationale:
        "Conservative starter default for OpenAI's separately documented GPTBot control.",
      source: "https://platform.openai.com/docs/bots",
    },
    {
      userAgents: ["ClaudeBot"],
      disallow: ["/"],
      category: "model-training-or-control",
      rationale:
        "Conservative starter default for Anthropic's documented crawler token.",
      source:
        "https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler",
    },
    {
      userAgents: ["CCBot"],
      disallow: ["/"],
      category: "model-training-or-control",
      rationale: "Conservative starter default for Common Crawl collection.",
      source: "https://commoncrawl.org/ccbot",
    },
    {
      userAgents: ["Google-Extended"],
      disallow: ["/"],
      category: "model-training-or-control",
      rationale:
        "Google documents this as a product token rather than a conventional search-ranking crawler.",
      source:
        "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended",
    },
  ] satisfies readonly CrawlerPolicyRule[],
} as const;
