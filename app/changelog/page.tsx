import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { changelogEntries } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Changelog",
  description:
    "Versioned example release notes for the fictional SignalThread developer product.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Changelog", path: "/changelog" },
            ]}
          />
          <p className="eyebrow mt-12">Release history</p>
          <h1 className="page-title">Changelog</h1>
          <p className="page-lead">
            Dated, versioned changes with a generated Atom representation.
          </p>
          <a
            className="text-link mt-6 inline-block text-sm font-bold"
            href="/feed.xml"
          >
            Subscribe to the Atom feed
          </a>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20" aria-label="Release notes">
        <div className="page-shell max-w-4xl">
          {changelogEntries.map((entry) => (
            <article
              className="grid gap-5 border-t border-[var(--line)] py-10 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_1fr]"
              id={entry.version}
              key={entry.version}
            >
              <div>
                <p className="font-mono text-sm font-bold text-accent">
                  {entry.version}
                </p>
                <time
                  className="mt-2 block text-sm text-muted"
                  dateTime={entry.date}
                >
                  {entry.date}
                </time>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{entry.title}</h2>
                <p className="mt-3 leading-7 text-muted">{entry.summary}</p>
                <ul className="mt-5 list-disc space-y-2 pl-5 leading-7">
                  {entry.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
