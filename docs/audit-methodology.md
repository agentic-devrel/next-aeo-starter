# AEO audit methodology

`npm run audit:aeo` reports objective implementation conditions. It does not assign authority, predict rankings, test every accessibility criterion, or measure whether an AI system will retrieve or cite a page.

## Running the audit

Audit the current production build:

```bash
npm run build
npm run audit:aeo
```

The command finds an available local port, starts `next start`, waits for a successful response, runs the checks, and terminates the child process. A missing production build is a critical command error.

Audit an existing target:

```bash
npm run audit:aeo -- --url https://www.example.com
npm run audit:aeo -- --url https://preview.example --canonical-origin https://www.example.com
npm run audit:aeo -- --url http://localhost:3000 --verbose
```

A non-local target URL becomes the expected canonical origin by default. Local targets keep the configured production origin so a local server does not make localhost canonicals appear acceptable.

## Sampled HTML pages

The audit uses the canonical route inventory in `lib/routes.ts`. For each page it checks:

| Check             | Failure class | Condition                                                       |
| ----------------- | ------------- | --------------------------------------------------------------- |
| HTTP response     | Error         | Status is not 2xx                                               |
| Content type      | Error         | Response is not HTML                                            |
| Title             | Error         | `<title>` is missing or empty                                   |
| Description       | Warning       | Meta description is missing or empty                            |
| Canonical         | Error         | Not exactly one expected canonical URL                          |
| Production origin | Error         | Canonical points to localhost or loopback                       |
| Robots metadata   | Error         | Page contains `noindex`                                         |
| Heading           | Error         | Page does not contain exactly one H1                            |
| Structured data   | Error         | JSON-LD is absent or invalid JSON                               |
| Home landmarks    | Error         | Skip link, main target, or labeled primary navigation is absent |

These rules test syntax and structure. They do not prove that metadata is persuasive, schema is eligible for a particular rich result, a heading is well written, or a page meets full WCAG conformance.

## Machine-readable endpoints

The command verifies response status, expected content type, and small deterministic markers for:

- robots and sitemap;
- concise and full `llms.txt` files;
- site profile JSON, including JSON parsing;
- generated documentation Markdown;
- Atom feed.

Expected markers catch accidentally empty or misrouted responses without relying on large snapshots.

## Internal links

The audit extracts same-origin links from sampled HTML, removes fragments, deduplicates targets, and requests each unique path. Mail, telephone, fragment-only, and external links are excluded. A target below 200 or at least 400 fails the check; redirects are followed by the request client.

This is a sampled application link check, not an Internet-wide external-link monitor.

## Result classes and exit status

- **Error**: a critical implementation failure, such as a bad response, missing canonical, invalid structured data, accidental `noindex`, or broken internal target. Any error produces a nonzero exit status.
- **Warning**: a non-critical implementation gap that needs review. Warnings do not currently fail the command.
- **Informational**: context that should remain visible but has no objective pass/fail answer, such as the crawler-policy legal caveat.

The summary reports counts. It intentionally does not produce a ranking or AI visibility score. A future percentage, if added, must be called an implementation-readiness result and remain bounded to documented checks.

## Extending checks

Deterministic rules belong in `lib/aeo-audit.ts` and require unit fixtures. Network orchestration and endpoint inventory belong in `scripts/audit-aeo.ts`. Keep each result falsifiable: identify the exact response, selector, header, or value that passes and fails.

When adding a critical rule:

1. add one passing and one failing unit fixture;
2. classify severity explicitly;
3. verify the terminal message contains the affected path and observed value;
4. run the rule against production output;
5. document false positives and what the rule cannot conclude.

## Limitations

The audit does not replace:

- a full WCAG accessibility evaluation;
- browser performance lab and field data;
- Search Console or index inspection;
- Schema.org semantic and rich-result eligibility validation;
- external broken-link monitoring;
- crawler log analysis;
- content accuracy, originality, licensing, or editorial review;
- controlled retrieval, mention, or citation experiments;
- legal or privacy review.
