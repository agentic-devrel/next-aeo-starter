# Crawler policy

`robots.txt` implements the Robots Exclusion Protocol, a voluntary crawl preference mechanism. It is not authentication, authorization, rate limiting, a contractual license, or legal advice.

## Starter default

The centralized policy in `lib/crawler-policy.ts`:

- allows public paths for the general `*` group, including conventional search and indexing crawlers;
- disallows selected named model-training or product-control tokens by default;
- records a purpose category, rationale, source URL, and review date for each named rule;
- emits the canonical sitemap and host through `app/robots.ts`.

The current example names GPTBot, ClaudeBot, CCBot, and Google-Extended. Google documents Google-Extended as a product token rather than a conventional search-ranking crawler. These names and purposes can change; the list is an editable example, not a permanent taxonomy.

## Search, indexing, and training

Some vendors document separate crawlers or control tokens for search indexing, answer retrieval, user-triggered fetching, model improvement, or model training. Others reuse infrastructure or change documentation over time. A token’s name alone is not enough to infer its current behavior.

The starter therefore uses two maintainable categories:

- `search-and-general`: public crawling and conventional indexing allowed by the default group;
- `model-training-or-control`: separately named controls disallowed by the conservative starter policy.

This classification records the intended policy. It does not prove how a remote service uses a request.

## Review checklist

Before deployment and on a regular schedule:

1. Open every source URL in `crawlerPolicy.rules`.
2. Confirm the token spelling, current purpose, and whether robots rules are honored.
3. Decide whether search, user-triggered retrieval, grounding, model improvement, and training should have different policies for your content.
4. Review content licenses, privacy obligations, contracts, and business requirements.
5. Confirm that private or sensitive content is protected by access control, not robots rules.
6. Rebuild and inspect `/robots.txt`.
7. Test important public paths with the target crawler or its official inspection tooling where available.
8. Update `reviewedAt`, rationale, and source when a decision changes.

## Customization

Each rule supports one or more user agents plus `allow` or `disallow` paths. Keep the broad `*` rule first for readability and add named rules only when their purpose is documented. Avoid copying long third-party crawler lists without ownership, sources, and a review process.

After a change:

```bash
npm run build
npm run audit:aeo
curl http://localhost:3000/robots.txt
```

The audit confirms status, content type, sitemap reference, and policy notice. It cannot determine whether a crawler obeys the file or whether the policy is legally sufficient.
