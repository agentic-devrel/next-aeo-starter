import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = canonicalUrl(path, siteConfig.siteUrl);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      images: [
        {
          url: siteConfig.socialImagePath,
          width: 1200,
          height: 630,
          alt: `${siteConfig.siteName} developer documentation release checks`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.socialImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
