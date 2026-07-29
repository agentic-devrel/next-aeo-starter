import type { MetadataRoute } from "next";

import { buildSitemapEntries } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries().map((entry) => ({
    url: canonicalUrl(entry.path, siteConfig.siteUrl),
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
