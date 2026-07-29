import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { faqItems } from "@/lib/content";
import { buildFaqSchema } from "@/lib/json-ld";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Frequently asked questions",
  description:
    "Answers about SignalThread, llms.txt, generated Markdown, structured data, crawler controls, and AI visibility limitations.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]}
          />
          <p className="eyebrow mt-12">Direct answers</p>
          <h1 className="page-title">Frequently asked questions</h1>
          <p className="page-lead">
            Practical boundaries for the starter’s web standards, emerging
            conventions, and experiments.
          </p>
        </div>
      </section>
      <section
        className="bg-white py-16 sm:py-20"
        aria-label="Questions and answers"
      >
        <div className="page-shell max-w-4xl divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {faqItems.map((item, index) => (
            <details
              className="faq-item"
              key={item.question}
              open={index === 0}
            >
              <summary>
                <span>{item.question}</span>
                <span className="faq-indicator" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <JsonLd data={buildFaqSchema(faqItems, siteConfig)} />
    </>
  );
}
