import { generateChangelogFeed } from "@/lib/generators";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateChangelogFeed(siteConfig), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/atom+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
