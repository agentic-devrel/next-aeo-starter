import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About the fictional SignalThread organization and the standards-first methodology demonstrated by next-aeo-starter.",
  path: "/about",
});

const principles = [
  [
    "Standards before experiments",
    "Start with accessible HTML, correct status codes, canonical URLs, and stable links.",
  ],
  [
    "One source per claim",
    "Generate alternate representations from shared records and preserve canonical attribution.",
  ],
  [
    "Reproducible language",
    "State the observed condition, date, method, expected result, and known limitation.",
  ],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]}
          />
          <p className="eyebrow mt-12">Example organization</p>
          <h1 className="page-title">SignalThread Labs</h1>
          <p className="page-lead">
            A fictional organization created for this starter. It has no
            customers, certifications, operating history, or independent product
            claims.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20" aria-labelledby="method">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Method</p>
            <h2 id="method" className="section-title">
              Credible technical discoverability
            </h2>
          </div>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {principles.map(([title, description]) => (
              <article className="py-6" key={title}>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="border-y border-[var(--line)] bg-surface py-16"
        aria-labelledby="playbook"
      >
        <div className="page-shell max-w-3xl">
          <h2 id="playbook" className="text-2xl font-bold">
            Playbook acknowledgement
          </h2>
          <p className="mt-4 leading-8 text-muted">
            The project draws on the open-source{" "}
            <a
              className="text-link"
              href="https://github.com/agentic-devrel/awesome-ai-visibility"
              target="_blank"
              rel="noreferrer noopener"
            >
              Awesome AI Visibility
            </a>{" "}
            playbook: publish usable documentation, improve technical
            discoverability, keep entity information consistent, make claims
            reproducible, and measure outcomes instead of assuming them.
          </p>
        </div>
      </section>
    </>
  );
}
