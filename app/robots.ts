import type { MetadataRoute } from "next";

import { crawlerPolicy } from "@/lib/crawler-policy";
import { siteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlerPolicy.rules.map((rule) => ({
      userAgent: [...rule.userAgents],
      allow: rule.allow ? [...rule.allow] : undefined,
      disallow: rule.disallow ? [...rule.disallow] : undefined,
    })),
    sitemap: canonicalUrl("/sitemap.xml", siteConfig.siteUrl),
  };
}
