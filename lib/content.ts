import type { EvidenceLevel } from "@/lib/evidence";

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "code"; language: string; code: string; label: string }
  | { type: "note"; title: string; text: string; evidence?: EvidenceLevel };

export type DocumentationPage = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  version?: string;
  prerequisites: readonly string[];
  sections: readonly {
    id: string;
    heading: string;
    blocks: readonly ContentBlock[];
  }[];
  relatedLinks: readonly {
    label: string;
    href: string;
  }[];
};

export const documentationPages = [
  {
    slug: "getting-started",
    title: "Get started with SignalThread",
    description:
      "Install the example CLI, create a documentation policy, and run a repeatable local release check.",
    lastUpdated: "2026-07-29",
    version: "0.4.0-example",
    prerequisites: [
      "Node.js 22 or later",
      "A project with public HTML documentation",
    ],
    sections: [
      {
        id: "what-you-will-do",
        heading: "What will you do?",
        blocks: [
          {
            type: "paragraph",
            text: "You will configure a small set of canonical documentation URLs and run a local check before publishing. SignalThread is a fictional product used to demonstrate this starter's content model; the commands are illustrative and are not a published package.",
          },
        ],
      },
      {
        id: "install",
        heading: "Install the example CLI",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Terminal",
            code: "npm install --save-dev @example/signalthread\nnpx signalthread init",
          },
          {
            type: "note",
            title: "Example command",
            text: "The package name is intentionally reserved for demonstration and should be replaced when adapting the starter.",
          },
        ],
      },
      {
        id: "configure",
        heading: "Define the pages that must stay stable",
        blocks: [
          {
            type: "paragraph",
            text: "Keep the policy short. Start with the pages that explain installation, authentication, version support, and breaking changes.",
          },
          {
            type: "code",
            language: "json",
            label: "signalthread.config.json",
            code: '{\n  "origin": "https://docs.example.com",\n  "requiredPaths": ["/", "/docs/install", "/changelog"]\n}',
          },
        ],
      },
      {
        id: "run",
        heading: "Run the release check",
        blocks: [
          {
            type: "code",
            language: "bash",
            label: "Terminal",
            code: "npx signalthread check",
          },
          {
            type: "paragraph",
            text: "Expected result: the command reports reachable pages, one canonical URL per page, and any references that resolve outside the configured origin.",
          },
          {
            type: "note",
            title: "Limitation",
            text: "A passing structural check cannot prove that search engines or AI systems will index, rank, recommend, or cite a page.",
            evidence: "standard",
          },
        ],
      },
    ],
    relatedLinks: [
      {
        label: "Publish machine-readable documentation",
        href: "/docs/machine-readable-docs",
      },
      { label: "Review the example changelog", href: "/changelog" },
    ],
  },
  {
    slug: "machine-readable-docs",
    title: "Publish machine-readable documentation",
    description:
      "Serve stable HTML first, then provide generated Markdown and discovery files from the same content source.",
    lastUpdated: "2026-07-29",
    version: "0.4.0-example",
    prerequisites: [
      "Canonical, server-rendered HTML documentation",
      "A deterministic production site URL",
    ],
    sections: [
      {
        id: "html-first",
        heading: "Keep canonical HTML as the primary source",
        blocks: [
          {
            type: "paragraph",
            text: "HTML pages with useful headings, links, status codes, and metadata remain the primary public documents. Machine-readable mirrors should point back to those canonical pages.",
          },
          {
            type: "note",
            title: "Evidence",
            text: "Crawlable HTML, canonical links, robots policy, and sitemaps use established web mechanisms.",
            evidence: "standard",
          },
        ],
      },
      {
        id: "generated-markdown",
        heading: "Generate Markdown from the content model",
        blocks: [
          {
            type: "paragraph",
            text: "This starter serializes the same typed records used by the React page. The Markdown response includes its canonical source URL, prerequisites, code, expected results, limitations, and related links.",
          },
          {
            type: "code",
            language: "text",
            label: "Endpoint",
            code: "GET /docs/getting-started/markdown\nAccept: text/markdown",
          },
        ],
      },
      {
        id: "llms-txt",
        heading: "Treat llms.txt as optional discovery context",
        blocks: [
          {
            type: "paragraph",
            text: "The llms.txt file summarizes the site and links to canonical resources. It complements normal navigation and crawl controls; it does not replace them.",
          },
          {
            type: "note",
            title: "Evidence",
            text: "llms.txt is an emerging convention. Support and interpretation vary by tool and may change.",
            evidence: "emerging",
          },
        ],
      },
      {
        id: "measure",
        heading: "Measure retrieval behavior directly",
        blocks: [
          {
            type: "list",
            items: [
              "Record the prompts and systems used for each test.",
              "Check whether retrieved passages preserve their original meaning.",
              "Track citations and factual errors separately from mentions.",
              "Re-run the same test after content or endpoint changes.",
            ],
          },
          {
            type: "note",
            title: "Evidence",
            text: "Retrieval and citation testing is an experiment, not a universal ranking recipe.",
            evidence: "experiment",
          },
        ],
      },
    ],
    relatedLinks: [
      { label: "Get started", href: "/docs/getting-started" },
      { label: "Read the FAQ", href: "/faq" },
    ],
  },
] as const satisfies readonly DocumentationPage[];

export const faqItems = [
  {
    question: "Does this starter guarantee citations from AI systems?",
    answer:
      "No. It implements testable web foundations and optional discovery formats, but no markup, file, or content pattern can guarantee indexing, ranking, recommendation, or citation.",
  },
  {
    question: "Is llms.txt a web standard?",
    answer:
      "No. It is an emerging convention. This starter publishes it as supplementary context while keeping normal HTML, robots rules, sitemaps, and internal links authoritative.",
  },
  {
    question: "Why generate Markdown from typed content?",
    answer:
      "A shared source keeps the HTML and Markdown representations aligned. It also lets tests verify canonical links, headings, code examples, and limitations without maintaining a second document by hand.",
  },
  {
    question: "Can the crawler policy be used as legal advice?",
    answer:
      "No. Crawler identities and behavior change, and robots directives are voluntary controls. Review the policy for your licensing, privacy, contractual, and business requirements with qualified counsel where appropriate.",
  },
] as const;

export const changelogEntries = [
  {
    version: "0.4.0-example",
    date: "2026-07-29",
    title: "Machine-readable release notes",
    summary:
      "Added generated Markdown, a site profile, and explicit evidence labels to the fictional product documentation.",
    changes: [
      "Added canonical source links to documentation mirrors.",
      "Documented crawler-policy assumptions and limitations.",
      "Added deterministic release checks for metadata and links.",
    ],
  },
  {
    version: "0.3.0-example",
    date: "2026-06-18",
    title: "Canonical drift checks",
    summary:
      "Introduced a local check for missing canonicals, cross-origin references, and accidental noindex directives.",
    changes: [
      "Reported failures with source URLs.",
      "Separated errors from advisory warnings.",
    ],
  },
] as const;

export function getDocumentationPage(slug: string) {
  return documentationPages.find((page) => page.slug === slug);
}
