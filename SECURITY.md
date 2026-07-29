# Security Policy

## Supported versions

Security fixes target the latest commit on the default branch and the latest published release, when releases exist. This starter has not yet established long-term support branches.

## Report a vulnerability

Use GitHub’s private vulnerability reporting feature or open a private security advisory in this repository. Do not report an exploitable vulnerability in a public issue and do not send sensitive details to the fictional example address shown on the demo site.

Include:

- affected route, module, or version;
- reproduction steps or a minimal proof of concept;
- likely impact and required preconditions;
- any known mitigation.

Maintainers will acknowledge a complete report as soon as practical, investigate it, and coordinate disclosure after a fix is available. Please avoid accessing data that is not yours, degrading shared services, or using social engineering while researching.

## Content security

The included content renderer accepts controlled TypeScript records and does not render arbitrary HTML. Projects that add MDX, a CMS, user submissions, or third-party scripts must review sanitization, authorization, Content Security Policy, dependency trust, and secret handling for their own threat model.

## Dependency advisory status

As of 2026-07-29, `npm audit` reports 12 high-severity findings: three in the production tree and nine in development tooling. No compatible remediation is currently available.

- Next.js 16.2.12, the latest published release at review time, pins PostCSS 8.4.31 and accepts Sharp only below 0.35. npm reports three PostCSS advisories and inherited libvips vulnerabilities in that tree. The starter only processes repository-controlled CSS and does not configure remote or user-supplied image sources.
- ESLint 9 and its plugins resolve `minimatch` 3 to `brace-expansion` 1.1.16. The accepted 1.x line has no patched release. This path runs in development and CI against trusted repository files; it is not part of the application runtime.
- npm's forced remediation would cross declared compatibility boundaries, including a Next.js downgrade and an ESLint major upgrade, so it is intentionally not applied.

Dependabot checks npm dependencies weekly. Maintainers should update when Next.js publishes compatible PostCSS and Sharp ranges and when the lint stack accepts a patched glob implementation, then rerun the complete test and audit suite. Reassess these mitigations before accepting untrusted styles, source maps, images, file patterns, or build inputs.
