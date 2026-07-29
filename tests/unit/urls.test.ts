import { describe, expect, it } from "vitest";

import { canonicalUrl, isLocalhostUrl, resolveSiteOrigin } from "@/lib/urls";

describe("canonical URL helpers", () => {
  it("normalizes paths and removes queries and hashes", () => {
    expect(
      canonicalUrl(
        "docs/getting-started/?source=test#install",
        "https://example.dev",
      ),
    ).toBe("https://example.dev/docs/getting-started");
  });

  it("uses a non-local production fallback", () => {
    expect(resolveSiteOrigin(undefined, "production")).toBe(
      "https://example.com",
    );
  });

  it("rejects localhost production origins", () => {
    expect(() =>
      resolveSiteOrigin("http://localhost:3000", "production"),
    ).toThrow(/cannot use a localhost origin/i);
  });

  it.each([
    "https://example.com/docs",
    "https://example.com?preview=true",
    "https://example.com#configuration",
    "https://user:password@example.com",
  ])("rejects values that are not bare origins: %s", (value) => {
    expect(() => resolveSiteOrigin(value, "production")).toThrow(
      /must be an origin/i,
    );
  });

  it("detects local URLs", () => {
    expect(isLocalhostUrl("http://127.0.0.1:3000/docs")).toBe(true);
    expect(isLocalhostUrl("https://docs.example.com/docs")).toBe(false);
  });
});
