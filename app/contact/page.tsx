import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact and support paths for the fictional SignalThread example product and starter repository.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="page-shell">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />
          <p className="eyebrow mt-12">Contact</p>
          <h1 className="page-title">Choose the path that preserves context</h1>
          <p className="page-lead">
            SignalThread is fictional. Use these example channels as
            placeholders when adapting the starter.
          </p>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20" aria-label="Contact options">
        <div className="page-shell grid gap-6 md:grid-cols-2">
          <article className="contact-panel">
            <p className="eyebrow">Project questions</p>
            <h2 className="mt-4 text-xl font-bold">
              Open a repository discussion
            </h2>
            <p className="mt-3 leading-7 text-muted">
              Include the route, expected behavior, observed behavior, and a
              minimal reproduction.
            </p>
            <a
              className="text-link mt-6 inline-block font-bold"
              href={`${siteConfig.repositoryUrl}/discussions`}
              target="_blank"
              rel="noreferrer noopener"
            >
              Repository discussions
            </a>
          </article>
          <article className="contact-panel">
            <p className="eyebrow">Example email</p>
            <h2 className="mt-4 text-xl font-bold">
              Send maintainable feedback
            </h2>
            <p className="mt-3 leading-7 text-muted">
              Replace the example.com address with a monitored project address
              before deployment.
            </p>
            <a
              className="text-link mt-6 inline-block font-bold"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
