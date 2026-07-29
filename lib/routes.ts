import { documentationPages } from "@/lib/content";

export type SitemapEntry = {
  path: string;
  lastModified: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const staticSitemapEntries = [
  {
    path: "/",
    lastModified: "2026-07-29",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/product",
    lastModified: "2026-07-29",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/docs",
    lastModified: "2026-07-29",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/faq",
    lastModified: "2026-07-29",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/about",
    lastModified: "2026-07-29",
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    path: "/changelog",
    lastModified: "2026-07-29",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    path: "/contact",
    lastModified: "2026-07-29",
    changeFrequency: "yearly",
    priority: 0.5,
  },
] as const satisfies readonly SitemapEntry[];

export function buildSitemapEntries(): SitemapEntry[] {
  return [
    ...staticSitemapEntries,
    ...documentationPages.map((page) => ({
      path: `/docs/${page.slug}`,
      lastModified: page.lastUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
