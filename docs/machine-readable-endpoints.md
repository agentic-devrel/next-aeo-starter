# Machine-readable endpoints

Machine-readable formats supplement canonical HTML. They can reduce parsing ambiguity for tools that choose to use them, but they do not guarantee discovery, indexing, ranking, retrieval, recommendation, or citation.

## Endpoint inventory

| Path                    | Content type                | Source                           | Status                        |
| ----------------------- | --------------------------- | -------------------------------- | ----------------------------- |
| `/llms.txt`             | `text/plain`                | site config and docs records     | Emerging convention           |
| `/llms-full.txt`        | `text/plain`                | concise file plus generated docs | Emerging convention           |
| `/ai/site.json`         | `application/json`          | site config and docs records     | Project-defined experiment    |
| `/docs/:slug/markdown`  | `text/markdown`             | the canonical docs record        | Widely adopted representation |
| `/feed.xml`             | `application/atom+xml`      | changelog records                | Web standard                  |
| `/robots.txt`           | `text/plain`                | crawler policy                   | Web standard                  |
| `/sitemap.xml`          | `application/xml`           | canonical route inventory        | Web standard                  |
| `/manifest.webmanifest` | `application/manifest+json` | site config                      | Web standard                  |

Static GET handlers include explicit content types, `nosniff`, and cache headers. Native Next.js metadata files use framework-managed response behavior.

## `llms.txt`

The concise file identifies the fictional example, describes the site, links canonical product and documentation pages, and points to machine-readable resources. It closes with an explicit status statement:

- `llms.txt` is an emerging convention, not a web standard;
- it does not replace crawlable HTML, internal navigation, robots policy, canonical metadata, or sitemaps;
- its presence cannot guarantee AI-system behavior.

`llms-full.txt` begins with the same discovery context and appends generated documentation. Both use `lib/generators.ts`; neither maintains an independent copy of article content.

## Markdown representations

Each docs record is available at `/docs/:slug/markdown`. The serializer preserves:

- title and description;
- canonical HTML source URL;
- last-updated date and version;
- prerequisites;
- section headings and coherent task boundaries;
- code labels, languages, and examples;
- expected results and limitations in source order;
- absolute related links.

The response includes an HTTP `Link` header whose canonical target is the HTML page. Markdown representations are not added to the XML sitemap because the HTML page remains the preferred indexed document.

## Site profile

`/ai/site.json` is a deliberately small, project-defined format. It describes the site, organization, product, documentation URLs, alternate Markdown URLs, discovery endpoints, fictional status, and limitations.

The `schemaVersion` only versions this project’s profile contract. It is not a Schema.org type or an Internet standard. If another system consumes the profile, version and test that integration explicitly rather than assuming broad support.

## Feed, robots, and sitemap

The Atom feed is generated from the same changelog entries as the visible page. Robots rules come from the reviewed crawler-policy configuration. Sitemap entries come from `lib/routes.ts` and only include canonical HTML pages.

Keep dates deterministic. Avoid generating `lastModified` from the build clock when the underlying content did not change; that creates noisy crawl signals and non-reproducible output.

## Adding an endpoint

1. Identify the canonical human-readable source.
2. Add a pure serializer when the output is not a direct JSON object.
3. Add unit tests for deterministic fields, escaping, links, and limitations.
4. Create a thin static route handler with an explicit content type.
5. Decide whether the endpoint belongs in `llms.txt`, the site profile, the sitemap, or none of them.
6. Add an endpoint expectation to `scripts/audit-aeo.ts`.
7. Add a Playwright response assertion.
8. Document whether the format is a standard, practice, convention, or experiment.

Do not expose environment secrets, internal identifiers, unpublished routes, private content, or user data in a machine-readable response.
