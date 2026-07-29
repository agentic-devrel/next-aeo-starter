import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DocsContent } from "@/components/docs-content";
import { JsonLd } from "@/components/json-ld";
import { documentationPages, getDocumentationPage } from "@/lib/content";
import { buildTechArticleSchema } from "@/lib/json-ld";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

type DocumentationRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return documentationPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: DocumentationRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocumentationPage(slug);

  if (!page) return {};

  return createPageMetadata({
    title: page.title,
    description: page.description,
    path: `/docs/${page.slug}`,
  });
}

export default async function DocumentationDetailPage({
  params,
}: DocumentationRouteProps) {
  const { slug } = await params;
  const page = getDocumentationPage(slug);

  if (!page) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Docs", path: "/docs" },
    { name: page.title, path: `/docs/${page.slug}` },
  ];

  return (
    <article>
      <header className="page-hero">
        <div className="page-shell">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="eyebrow mt-12">Documentation guide</p>
          <h1 className="page-title">{page.title}</h1>
          <p className="page-lead">{page.description}</p>
          <dl className="doc-meta">
            <div>
              <dt>Version</dt>
              <dd>{page.version ?? "Unversioned"}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>
                <time dateTime={page.lastUpdated}>{page.lastUpdated}</time>
              </dd>
            </div>
            <div>
              <dt>Representation</dt>
              <dd>
                <a href={`/docs/${page.slug}/markdown`}>Markdown</a>
              </dd>
            </div>
          </dl>
        </div>
      </header>
      <div className="page-shell grid gap-12 py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:py-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page">
            <p className="text-sm font-bold">On this page</p>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a className="toc-link" href="#prerequisites">
                  Prerequisites
                </a>
              </li>
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a className="toc-link" href={`#${section.id}`}>
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a className="toc-link" href="#related-links">
                  Related links
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="prose-doc max-w-3xl min-w-0">
          <DocsContent page={page} />
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          ...buildTechArticleSchema(page, siteConfig),
        }}
      />
    </article>
  );
}
