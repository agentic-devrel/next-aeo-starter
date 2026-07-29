# Metadata and structured data

Metadata and structured data make page identity more explicit to browsers, crawlers, link unfurlers, and retrieval systems. They do not guarantee rich results, indexing, ranking, recommendation, or AI citation.

## Central configuration

`lib/site-config.ts` is the source for:

- site and legal organization names;
- canonical site origin;
- description and default title;
- locale and social profiles;
- logo and social image paths;
- contact, author, and publisher identity;
- product name, category, and version;
- documentation, repository, and support URLs.

Do not duplicate these values in page files. Add fields to the typed configuration when a new cross-cutting identity value is needed.

## Canonical URL rules

`canonicalUrl` accepts an internal path and an origin. It:

- requires absolute HTTP or HTTPS origins;
- keeps generated URLs on the configured origin;
- removes queries and fragments;
- removes non-root trailing slashes;
- serializes the root as the origin;
- rejects localhost origins in production configuration.

Canonical URLs describe the preferred public source. They should not be derived from incoming request hosts behind arbitrary proxies.

## Next.js metadata

The root layout defines a title template, default description, metadata base, authorship, canonical, Open Graph, social-card metadata, robots directives, manifest, and feed alternative. `createPageMetadata` supplies route-specific title, description, canonical, Open Graph URL, and social card values.

Static metadata is preferred because the example content is local and build-time deterministic. If metadata later depends on data, keep it server-side and use the same validated record as the visible page.

## JSON-LD graph

The root graph includes:

- `Organization` at `#organization`;
- `WebSite` at `#website`;
- `SoftwareApplication` at `/product#software`.

Documentation pages add `TechArticle`; breadcrumb UI adds `BreadcrumbList`; the FAQ page adds `FAQPage` from the exact visible questions and answers.

Stable `@id` values let page-specific entities reference the global organization without repeating the full global graph. Keep an entity’s name, URL, description, version, and publisher consistent across HTML, JSON-LD, feeds, profiles, and repository metadata.

## Safe serialization

`serializeJsonLd` uses `JSON.stringify` and escapes `<`, `>`, `&`, and Unicode line separators before insertion into a script element. React renders visible content as text. Never concatenate untrusted strings into a JSON-LD script or use raw user HTML as structured-data content.

## Accuracy rules

- Structured data must match visible page content.
- Do not add aggregate ratings, reviews, offers, prices, customers, certifications, or awards without current verifiable evidence.
- Use FAQPage only when the same questions and answers are visible on the page.
- Update `dateModified` when the document meaningfully changes.
- Keep page type accurate; a product landing page is not automatically an Article.
- Validate syntax and eligibility separately. Parseable JSON-LD can still be semantically wrong.

The unit suite covers builder output, stable IDs, visible FAQ parity, absent commerce claims, and HTML-safe serialization. The local audit verifies that each sampled HTML page contains parseable JSON-LD.
