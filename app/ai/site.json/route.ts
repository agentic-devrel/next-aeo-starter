import { generateSiteProfile } from "@/lib/generators";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export function GET() {
  return Response.json(generateSiteProfile(siteConfig), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
