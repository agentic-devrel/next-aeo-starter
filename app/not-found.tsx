import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero-grid flex min-h-[65vh] items-center border-b border-[var(--line)]">
      <div className="page-shell py-20">
        <p className="eyebrow">404 · Reference not found</p>
        <h1 className="page-title">
          This path is not part of the published graph
        </h1>
        <p className="page-lead">
          The URL may have changed, or the link may be incomplete. Start from
          the documentation index and follow a stable route.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="button button-primary" href="/docs">
            Browse documentation
          </Link>
          <Link className="button button-secondary" href="/">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
