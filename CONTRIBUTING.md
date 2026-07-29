# Contributing

Thank you for improving `next-aeo-starter`. Contributions should make the starter easier to verify, adapt, and maintain without turning uncertain AI visibility ideas into product claims.

## Before opening a change

1. Search existing issues and discussions.
2. For substantial behavior or architecture changes, open an issue describing the use case and alternatives first.
3. Keep examples vendor-neutral and usable without API keys.
4. Label recommendations as a web standard, widely adopted practice, emerging convention, or experiment.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to a real HTTPS origin before testing production metadata. The committed fallback is `https://example.com`, never localhost in a production build.

## Quality gates

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

`npm run check` runs formatting verification, ESLint, strict TypeScript, unit tests, a production build, and the AEO implementation audit. Playwright is separate because its browser binary is an additional local download.

## Content changes

- Put documentation source in `lib/content.ts`; do not maintain a separate Markdown copy.
- Keep prerequisites, commands, expected results, and limitations together.
- Use stable slugs and descriptive headings.
- Do not add ratings, customers, certifications, testimonials, performance figures, or adoption claims without verifiable project evidence.
- Treat community-supplied links and code as untrusted until reviewed. The renderer intentionally supports controlled content records rather than arbitrary HTML.

## Pull requests

Keep pull requests focused. Explain the observed problem, the chosen behavior, the evidence classification, and the command that falsifies the change if it is wrong. Add focused tests for behavior changes and update documentation when a public contract changes.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
