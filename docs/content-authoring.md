# Content authoring

The local content system uses typed TypeScript records in `lib/content.ts`. One record renders to canonical HTML and generated Markdown, preventing an independently maintained mirror from silently drifting.

## Documentation record

Each page includes:

- a stable canonical slug;
- title and description;
- ISO last-updated date;
- optional version;
- prerequisites;
- coherent task sections;
- paragraph, list, code, and note blocks;
- related internal links.

Add a record to `documentationPages`:

```ts
{
  slug: "verify-a-release",
  title: "Verify a documentation release",
  description: "Check public routes and review the report before deployment.",
  lastUpdated: "2026-07-29",
  version: "1.0.0",
  prerequisites: ["A production build", "A configured canonical origin"],
  sections: [
    {
      id: "run-the-check",
      heading: "Run the check",
      blocks: [
        {
          type: "code",
          language: "bash",
          label: "Terminal",
          code: "npm run audit:aeo",
        },
        {
          type: "paragraph",
          text: "Expected result: no critical errors and a zero exit status.",
        },
      ],
    },
  ],
  relatedLinks: [{ label: "Audit methodology", href: "/docs/audit-methodology" }],
}
```

Then add the canonical HTML path to `lib/routes.ts`. The dynamic page and Markdown route receive static params from the content collection automatically.

## Authoring rules

1. Give each page one task or primary question.
2. Put prerequisites before commands.
3. Keep each command with its explanation and expected result.
4. State version and date context where behavior can change.
5. Add a limitation when the result could be overgeneralized.
6. Use explicit subjects instead of pronouns whose meaning may be lost when a section is retrieved alone.
7. Split at conceptual boundaries, not arbitrary word or token counts.
8. Use stable internal links and avoid changing published slugs without a redirect plan.

## Evidence notes

Notes can attach one of the evidence keys from `lib/evidence.ts`:

- `standard`;
- `practice`;
- `emerging`;
- `experiment`.

Use the label that describes the recommendation, not the file format. For example, JSON syntax is standardized, but a project-defined site profile remains an experiment unless a consuming contract establishes otherwise.

## Markdown behavior

`serializeDocumentationMarkdown` includes the canonical source URL, update date, version, prerequisites, section headings, code labels, code fences, notes, and absolute related links. The route returns `text/markdown` and an HTTP `Link` header with `rel="canonical"` pointing to the HTML page.

The Markdown URL is an alternate representation, not a second canonical page. It is omitted from the XML sitemap.

## Community-supplied content

The default renderer accepts text records and never injects content as HTML. If a project adds Markdown, MDX, CMS data, or user submissions:

- parse with a maintained structured parser;
- disable or sanitize raw HTML;
- restrict imported components and executable expressions;
- validate links and media origins;
- review code examples for secrets and destructive commands;
- preserve attribution and licensing metadata;
- add malicious-content fixtures to tests.
