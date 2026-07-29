# Deployment

Correct canonical URLs are a build-time contract. Set the public origin before generating static pages and metadata files, then validate the deployed site after platform redirects and proxies are active.

## Build-time environment

```bash
NEXT_PUBLIC_SITE_URL=https://www.example.com npm run build
```

The value must:

- be an absolute HTTP or HTTPS URL;
- represent the final public canonical origin;
- exclude usernames and passwords;
- exclude a path, query, and fragment;
- not use localhost, loopback, or a preview host for a production build.

Production rejects explicit localhost values. When the variable is absent, the build uses `https://example.com`. That fallback prevents accidental localhost publication but is still incorrect for a real deployment and must be replaced.

Because the pages and metadata routes are static, setting the variable only during `next start` does not change an existing build.

## Generic Node.js deployment

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://www.example.com npm run build
npm run audit:aeo
npm run start
```

The runtime needs no API keys, database, writable content directory, or remote image service. Use a supported Node.js release; CI tests Node.js 24 and the package requires Node.js 22 or later.

## Reverse proxies and adapters

- Preserve the original path and correct status code.
- Redirect alternate hosts and HTTP to the canonical HTTPS origin consistently.
- Do not derive canonical metadata from untrusted incoming `Host` or forwarded headers.
- Preserve endpoint content types and the `Link` header on Markdown responses.
- Do not rewrite unknown routes to a 200 response; the custom page must remain a 404.
- Confirm the platform supports Next.js 16 metadata routes and `ImageResponse`.
- Review cache behavior for static text, JSON, XML, images, and HTML separately.

If using static export or a non-Node adapter, verify every route handler and generated image in the adapter’s compatibility documentation and tests. The included configuration targets a normal Next.js server build.

## Security headers

`next.config.ts` adds:

- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- a Permissions Policy disabling camera, microphone, and geolocation.

Test whether the deployment platform preserves or overrides them. Add a Content Security Policy only after inventorying the final scripts, styles, fonts, images, frames, and network destinations. A copied CSP that breaks Next.js or silently allows broad sources is not a security improvement.

## Post-deployment validation

```bash
npm run audit:aeo -- --url https://www.example.com
PLAYWRIGHT_BASE_URL=https://www.example.com npm run test:e2e
```

Use `--canonical-origin` when the request target is a preview or internal host but the page intentionally declares another canonical origin:

```bash
npm run audit:aeo -- \
  --url https://preview.example.net \
  --canonical-origin https://www.example.com
```

Also inspect:

1. HTTP-to-HTTPS and alternate-host redirects.
2. Home, product, docs, FAQ, changelog, contact, and 404 status codes.
3. One canonical and one H1 on each canonical page.
4. `/robots.txt`, `/sitemap.xml`, `/llms.txt`, Markdown, JSON profile, and feed content types.
5. Open Graph image rendering and icon responses.
6. Browser console errors on desktop and mobile.
7. Search engine webmaster tools after ownership is configured.
8. Server logs for crawler access and repeated failures.

Passing these checks confirms the documented implementation at that moment. It does not guarantee indexing, rankings, rich results, AI visibility, recommendations, or citations.
