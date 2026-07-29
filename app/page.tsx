import Link from "next/link";

import { EvidenceBadge } from "@/components/evidence-badge";
import { changelogEntries } from "@/lib/content";
import { evidenceLevels, type EvidenceLevel } from "@/lib/evidence";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

const checks = [
  {
    title: "Reference integrity",
    description:
      "Resolve required pages and internal links before a documentation release ships.",
    state: "passed",
  },
  {
    title: "Canonical consistency",
    description:
      "Compare declared canonical URLs with the configured production origin.",
    state: "passed",
  },
  {
    title: "Version context",
    description:
      "Flag task pages that omit the product version or last-updated date.",
    state: "review",
  },
] as const;

const workflow = [
  [
    "01",
    "Define",
    "Choose the public pages and version notes that must remain stable.",
  ],
  [
    "02",
    "Check",
    "Run deterministic structural checks in local development and CI.",
  ],
  ["03", "Review", "Treat warnings as editorial prompts, not automated truth."],
] as const;

export default function Home() {
  return (
    <>
      <section className="hero-grid overflow-hidden border-b border-[var(--line)]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="reveal">
            <p className="eyebrow">
              Fictional example product · v0.4.0-example
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl leading-[1.05] font-bold sm:text-6xl">
              SignalThread
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-muted">
              Documentation release checks for teams that need stable
              references, explicit versions, and canonical URLs before they
              publish.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="button button-primary"
                href="/docs/getting-started"
              >
                Read the quickstart
              </Link>
              <Link className="button button-secondary" href="/product">
                Explore the workflow
              </Link>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              Demonstration content only. The CLI commands are illustrative and
              no package is published.
            </p>
          </div>
          <div
            className="audit-window reveal reveal-delay-1"
            aria-label="Example SignalThread check report"
          >
            <div className="audit-window-bar">
              <span />
              <span />
              <span />
              <p>release-check · docs.example.com</p>
            </div>
            <div className="space-y-1 p-5 sm:p-7">
              <p className="font-mono text-xs text-white/55">
                SIGNALTHREAD / CHECK 0.4.0-EXAMPLE
              </p>
              <p className="pt-4 font-mono text-sm text-white">
                Inspecting 9 canonical pages
              </p>
              <div className="audit-rule" />
              {checks.map((check) => (
                <div
                  className="grid grid-cols-[1fr_auto] gap-4 py-3"
                  key={check.title}
                >
                  <div>
                    <p className="font-mono text-sm text-white">
                      {check.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/55">
                      {check.description}
                    </p>
                  </div>
                  <span className={`audit-state audit-state-${check.state}`}>
                    {check.state}
                  </span>
                </div>
              ))}
              <div className="audit-rule" />
              <p className="pt-2 font-mono text-xs text-white/60">
                2 passed · 1 editorial review
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white py-16 sm:py-20"
        aria-labelledby="built-for-release"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">A narrow, testable job</p>
            <h2 id="built-for-release" className="section-title">
              Make documentation drift visible before release
            </h2>
            <p className="section-copy">
              SignalThread models a developer tool that checks objective page
              structure. Editorial quality and external discovery still require
              human review and measurement.
            </p>
          </div>
          <div className="mt-10 grid border-y border-[var(--line)] md:grid-cols-3">
            {checks.map((check, index) => (
              <article
                className="border-[var(--line)] py-7 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                key={check.title}
              >
                <p className="font-mono text-xs text-accent">
                  CHECK {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-bold">{check.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {check.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-y border-[var(--line)] bg-surface py-16 sm:py-20"
        aria-labelledby="workflow"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Workflow</p>
            <h2 id="workflow" className="section-title">
              Small checks, clear boundaries
            </h2>
            <p className="section-copy">
              Structural diagnostics are useful when they say exactly what they
              observed and what they cannot conclude.
            </p>
          </div>
          <ol className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {workflow.map(([number, title, description]) => (
              <li
                className="grid gap-3 py-6 sm:grid-cols-[3rem_8rem_1fr] sm:items-baseline"
                key={number}
              >
                <span className="font-mono text-sm text-accent">{number}</span>
                <span className="font-bold">{title}</span>
                <span className="leading-7 text-muted">{description}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="bg-white py-16 sm:py-20"
        aria-labelledby="evidence-model"
      >
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Evidence model</p>
            <h2 id="evidence-model" className="section-title">
              Label what is established, adopted, emerging, or experimental
            </h2>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {(
              Object.entries(evidenceLevels) as [
                EvidenceLevel,
                (typeof evidenceLevels)[EvidenceLevel],
              ][]
            ).map(([level, evidence]) => (
              <article
                className="border-l-2 border-[var(--line)] pl-5"
                key={level}
              >
                <EvidenceBadge level={level} />
                <p className="mt-3 leading-7 text-muted">
                  {evidence.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--line)] bg-signal py-12"
        aria-labelledby="latest-release"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold">
              Latest example release · {changelogEntries[0].date}
            </p>
            <h2 id="latest-release" className="mt-2 text-2xl font-bold">
              {changelogEntries[0].version}: {changelogEntries[0].title}
            </h2>
          </div>
          <Link className="button button-dark" href="/changelog">
            Read the changelog
          </Link>
        </div>
      </section>
    </>
  );
}
