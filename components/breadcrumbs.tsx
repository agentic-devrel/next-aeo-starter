import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/json-ld";
import { siteConfig } from "@/lib/site-config";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <li className="flex items-center gap-2" key={item.path}>
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isCurrent ? (
                  <span aria-current="page" className="font-semibold text-ink">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    className="focus-ring rounded-sm underline-offset-4 hover:underline"
                    href={item.path}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={buildBreadcrumbSchema(items, siteConfig)} />
    </>
  );
}
