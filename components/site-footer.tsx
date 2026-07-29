import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-canvas">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-bold">SignalThread</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            A fictional developer product demonstrating standards-based
            technical discoverability and measured AI visibility experiments.
          </p>
        </div>
        <nav aria-label="Footer product links">
          <p className="text-sm font-bold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <Link className="footer-link" href="/docs">
                Documentation
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/changelog">
                Changelog
              </Link>
            </li>
            <li>
              <Link className="footer-link" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Machine-readable resources">
          <p className="text-sm font-bold">For machines</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <a className="footer-link" href="/llms.txt">
                llms.txt
              </a>
            </li>
            <li>
              <a className="footer-link" href="/ai/site.json">
                Site profile
              </a>
            </li>
            <li>
              <a className="footer-link" href="/feed.xml">
                Atom feed
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Fictional example content. Starter source licensed under MIT.</p>
          <a
            className="footer-link"
            href={siteConfig.repositoryUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            View repository
          </a>
        </div>
      </div>
    </footer>
  );
}
