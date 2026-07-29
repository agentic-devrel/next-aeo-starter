import Link from "next/link";

import { EvidenceBadge } from "@/components/evidence-badge";
import type { DocumentationPage } from "@/lib/content";

export function DocsContent({ page }: { page: DocumentationPage }) {
  return (
    <>
      <section aria-labelledby="prerequisites" className="doc-section">
        <h2 id="prerequisites">Prerequisites</h2>
        <ul>
          {page.prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      {page.sections.map((section) => (
        <section
          aria-labelledby={section.id}
          className="doc-section"
          key={section.id}
        >
          <h2 id={section.id}>{section.heading}</h2>
          {section.blocks.map((block, index) => {
            const key = `${section.id}-${block.type}-${index}`;

            if (block.type === "paragraph")
              return <p key={key}>{block.text}</p>;

            if (block.type === "list") {
              return (
                <ul key={key}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === "code") {
              return (
                <figure className="code-figure" key={key}>
                  <figcaption>{block.label}</figcaption>
                  <pre tabIndex={0}>
                    <code className={`language-${block.language}`}>
                      {block.code}
                    </code>
                  </pre>
                </figure>
              );
            }

            return (
              <aside className="doc-note" key={key}>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="doc-note-title">{block.title}</p>
                  {block.evidence ? (
                    <EvidenceBadge level={block.evidence} />
                  ) : null}
                </div>
                <p>{block.text}</p>
              </aside>
            );
          })}
        </section>
      ))}
      <section aria-labelledby="related-links" className="doc-section">
        <h2 id="related-links">Related links</h2>
        <ul>
          {page.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
