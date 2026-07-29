import { documentationPages, getDocumentationPage } from "@/lib/content";
import { serializeDocumentationMarkdown } from "@/lib/generators";
import { siteConfig } from "@/lib/site-config";
import { canonicalUrl } from "@/lib/urls";

type MarkdownRouteContext = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return documentationPages.map((page) => ({ slug: page.slug }));
}

export async function GET(_request: Request, { params }: MarkdownRouteContext) {
  const { slug } = await params;
  const page = getDocumentationPage(slug);

  if (!page) {
    return new Response("Documentation page not found.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(serializeDocumentationMarkdown(page, siteConfig), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${canonicalUrl(`/docs/${page.slug}`, siteConfig.siteUrl)}>; rel="canonical"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
