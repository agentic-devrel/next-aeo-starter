import { resolveSiteOrigin } from "@/lib/urls";

export type SocialProfile = {
  label: string;
  url: string;
};

export type SiteConfig = {
  siteName: string;
  legalOrganizationName: string;
  siteUrl: string;
  description: string;
  defaultTitle: string;
  locale: string;
  socialProfiles: readonly SocialProfile[];
  logoPath: string;
  socialImagePath: string;
  contact: {
    email: string;
    location: string;
  };
  publisher: {
    name: string;
    type: "Organization";
  };
  author: {
    name: string;
    type: "Organization";
    url: string;
  };
  product: {
    name: string;
    category: string;
    version: string;
  };
  documentationUrl: string;
  repositoryUrl: string;
  supportUrl: string;
  isFictionalExample: true;
};

const siteUrl = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);

export const siteConfig = {
  siteName: "SignalThread",
  legalOrganizationName: "SignalThread Labs",
  siteUrl,
  description:
    "A fictional developer tool that checks documentation releases for broken references, stale version notes, and canonical URL drift.",
  defaultTitle: "SignalThread | Documentation release checks",
  locale: "en_US",
  socialProfiles: [
    {
      label: "GitHub",
      url: "https://github.com/agentic-devrel/next-aeo-starter",
    },
  ],
  logoPath: "/icon",
  socialImagePath: "/opengraph-image",
  contact: {
    email: "hello@example.com",
    location: "Remote",
  },
  publisher: {
    name: "SignalThread Labs",
    type: "Organization",
  },
  author: {
    name: "SignalThread Documentation Team",
    type: "Organization",
    url: `${siteUrl}/about`,
  },
  product: {
    name: "SignalThread",
    category: "DeveloperApplication",
    version: "0.4.0-example",
  },
  documentationUrl: `${siteUrl}/docs`,
  repositoryUrl: "https://github.com/agentic-devrel/next-aeo-starter",
  supportUrl: `${siteUrl}/contact`,
  isFictionalExample: true,
} as const satisfies SiteConfig;
