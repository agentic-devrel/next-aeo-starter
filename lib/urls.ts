const DEVELOPMENT_ORIGIN = "http://localhost:3000";
const PRODUCTION_FALLBACK_ORIGIN = "https://example.com";

export type RuntimeEnvironment = "development" | "production" | "test";

function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]"
  );
}

export function resolveSiteOrigin(
  configuredOrigin: string | undefined,
  environment: RuntimeEnvironment = process.env.NODE_ENV === "development"
    ? "development"
    : process.env.NODE_ENV === "production"
      ? "production"
      : "test",
) {
  const fallback =
    environment === "development"
      ? DEVELOPMENT_ORIGIN
      : PRODUCTION_FALLBACK_ORIGIN;
  const rawOrigin = configuredOrigin?.trim() || fallback;

  let url: URL;

  try {
    url = new URL(rawOrigin);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL. Received: ${rawOrigin}`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  if (environment === "production" && isLocalHostname(url.hostname)) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL cannot use a localhost origin in production.",
    );
  }

  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an origin without credentials, a path, query parameters, or a fragment.",
    );
  }

  return url.origin;
}

export function canonicalUrl(
  path = "/",
  origin = resolveSiteOrigin(undefined, "test"),
) {
  const base = new URL(origin);
  const normalizedPath =
    path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, `${base.origin}/`);

  if (url.origin !== base.origin) {
    throw new Error(`Canonical paths must stay on ${base.origin}.`);
  }

  url.hash = "";
  url.search = "";

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/$/, "");
  }

  return url.pathname === "/" ? url.origin : url.toString();
}

export function isLocalhostUrl(value: string) {
  try {
    return isLocalHostname(new URL(value).hostname);
  } catch {
    return false;
  }
}
