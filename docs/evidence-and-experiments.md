# Evidence and experiments

Technical discoverability work mixes stable web behavior with changing platform behavior. The evidence model keeps those claims separate so a recommendation does not become stronger merely by being repeated.

## Evidence classifications

| Label                   | Meaning                                                    | Example in this starter                                                   |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| Web standard            | Established technical behavior or a published standard     | HTTP status codes, HTML headings, robots syntax, Atom, XML sitemaps       |
| Widely adopted practice | Common implementation behavior with broad operational use  | Canonical metadata, descriptive docs, JSON-LD entity descriptions         |
| Emerging convention     | Developing format without standards-track guarantees       | `llms.txt`                                                                |
| Experiment              | Hypothesis requiring measurement in the target environment | Whether a generated Markdown route changes retrieval or citation outcomes |

Classify the claim, not only the technology. JSON is standardized, while a custom JSON profile can still be an experiment.

## Claim template

Document material recommendations with:

1. **Observation**: the directly observed condition.
2. **Classification**: standard, practice, convention, or experiment.
3. **Change**: the smallest implementation being tested.
4. **Expected result**: the measurable behavior, not a vague visibility improvement.
5. **Failure condition**: what result would disconfirm the hypothesis.
6. **Method and date**: tools, versions, prompts, routes, and test period.
7. **Limitations**: confounders, missing data, and scope boundaries.

Example:

> On 2026-07-29, the test crawler could not retrieve code prerequisites from the existing alternate format. We will generate Markdown from the canonical docs record and test whether the named crawler retrieves the complete task section in at least 18 of 20 fixed queries. No change, lower completeness, or increased factual errors will disconfirm the hypothesis. This experiment cannot establish behavior for other crawlers or dates.

## AI visibility experiment design

1. Name the system, product mode, model or version when available, account state, region, and date.
2. Freeze a representative prompt set before making the change.
3. Record baseline mentions, retrieved source URLs, passage completeness, citations, and factual errors.
4. Change one material variable where practical.
5. Keep canonical HTML available; do not make an experimental endpoint the only source.
6. Repeat enough trials to expose response variability.
7. Separate a brand mention from a source retrieval and from a visible citation.
8. Review whether cited passages support the generated answer accurately.
9. Compare against a control page or unchanged period where feasible.
10. Publish methodology, sample size, dates, negative results, and limitations with any claim.

Do not infer causation from a single before-and-after prompt. Search indexes, model versions, personalization, location, browsing modes, and source availability can change during the same period.

## Useful measures

- correct source URL retrieved;
- relevant passage retrieved completely;
- visible citation present;
- citation supports the associated statement;
- factual error count;
- unsupported claim count;
- response variance across repeated prompts;
- crawl status and last successful fetch from server logs;
- conventional search impressions and clicks from first-party tools.

These are experiment measures, not universal ranking factors. Define denominators and keep platform-specific results separate.

## Publishing results responsibly

- Avoid “guarantees,” “proven ranking factor,” or “AI preferred” unless the evidence truly supports that scope.
- Distinguish vendor documentation from independent observation.
- Link source material and preserve access dates.
- Keep raw prompts and anonymized outputs where licensing and privacy permit.
- Remove personal, confidential, or customer data before sharing.
- Re-test after material content, model, crawler, or index changes.
- Correct or retire stale claims.

The starter cannot guarantee AI citations or rankings, and no combination of `llms.txt`, JSON-LD, Markdown, keyword placement, or metadata changes that boundary.
