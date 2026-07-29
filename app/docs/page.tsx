import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { documentationPages } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Documentation",
  description:
    "Task-oriented SignalThread example documentation with prerequisites, code, expected results, and explicit limitations.",
  path: "/docs",
});

export default function DocumentationPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Docs", path: "/docs" },
            ]}
          />
          <p className="eyebrow mt-12">SignalThread documentation</p>
          <h1 className="page-title">
            Build a repeatable documentation release check
          </h1>
          <p className="page-lead">
            These pages are concise, versioned, and generated from the same
            records as their Markdown representations.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20" aria-labelledby="guides">
        <div className="page-shell">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="guides" className="section-title">
                Guides
              </h2>
              <p className="section-copy">
                Start with setup, then add machine-readable representations.
              </p>
            </div>
            <p className="font-mono text-xs text-muted">
              VERSION 0.4.0-EXAMPLE
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {documentationPages.map((page, index) => (
              <article className="doc-card" key={page.slug}>
                <p className="font-mono text-xs text-accent">
                  GUIDE {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-bold">
                  <Link className="card-link" href={`/docs/${page.slug}`}>
                    {page.title}
                  </Link>
                </h3>
                <p className="mt-3 leading-7 text-muted">{page.description}</p>
                <div className="mt-6 flex flex-wrap gap-5 border-t border-[var(--line)] pt-4 text-xs text-muted">
                  <span>Updated {page.lastUpdated}</span>
                  <a
                    className="underline underline-offset-4"
                    href={`/docs/${page.slug}/markdown`}
                  >
                    Markdown
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
