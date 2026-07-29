import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvidenceBadge } from "@/components/evidence-badge";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Product",
  description:
    "See how the fictional SignalThread product models deterministic documentation release checks and explicit limitations.",
  path: "/product",
});

const capabilities = [
  [
    "Reachability",
    "Confirm required pages return successful HTTP status codes.",
  ],
  [
    "Canonical URLs",
    "Compare one declared canonical per page against the production origin.",
  ],
  [
    "Reference graph",
    "Resolve sampled internal links and report the page where a failure starts.",
  ],
  [
    "Release context",
    "Check for visible version and last-updated information on task documentation.",
  ],
] as const;

export default function ProductPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Product", path: "/product" },
            ]}
          />
          <p className="eyebrow mt-12">Example developer tooling</p>
          <h1 className="page-title">
            Release checks that report evidence, not promises
          </h1>
          <p className="page-lead">
            SignalThread is a fictional command-line product used to show how
            concise technical claims, stable documentation, and honest
            limitations can fit together.
          </p>
        </div>
      </section>

      <section
        className="bg-white py-16 sm:py-20"
        aria-labelledby="capabilities"
      >
        <div className="page-shell">
          <div className="max-w-2xl">
            <h2 id="capabilities" className="section-title">
              Objective checks in the example scope
            </h2>
            <p className="section-copy">
              Each result points to a URL and a condition that another developer
              can reproduce.
            </p>
          </div>
          <div className="mt-10 grid border-t border-[var(--line)] md:grid-cols-2">
            {capabilities.map(([title, description]) => (
              <article
                className="border-b border-[var(--line)] py-7 md:odd:pr-8 md:even:border-l md:even:pl-8"
                key={title}
              >
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-[var(--line)] bg-surface py-16 sm:py-20"
        aria-labelledby="boundaries"
      >
        <div className="page-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Product boundaries</p>
            <h2 id="boundaries" className="section-title">
              What a passing check does not establish
            </h2>
          </div>
          <div className="space-y-5">
            <div className="boundary-row">
              <EvidenceBadge level="standard" />
              <p>
                Correct status codes and canonical links are established web
                mechanisms.
              </p>
            </div>
            <div className="boundary-row">
              <EvidenceBadge level="practice" />
              <p>
                Task-oriented headings and stable examples are widely adopted
                documentation practices.
              </p>
            </div>
            <div className="boundary-row">
              <EvidenceBadge level="emerging" />
              <p>
                Publishing llms.txt may help some tools discover context, but
                support is not standardized.
              </p>
            </div>
            <div className="boundary-row">
              <EvidenceBadge level="experiment" />
              <p>
                Citation and retrieval outcomes must be tested with named
                systems, prompts, dates, and controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="product-next-step">
        <div className="page-shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="product-next-step" className="text-2xl font-bold">
              Inspect the example configuration
            </h2>
            <p className="mt-2 text-muted">
              The quickstart keeps setup, expected output, and limitations
              together.
            </p>
          </div>
          <Link className="button button-primary" href="/docs/getting-started">
            Open the quickstart
          </Link>
        </div>
      </section>
    </>
  );
}
