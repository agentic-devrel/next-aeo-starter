import { expect, test } from "@playwright/test";

const htmlRoutes = [
  "/",
  "/product",
  "/docs",
  "/docs/getting-started",
  "/docs/machine-readable-docs",
  "/faq",
  "/about",
  "/changelog",
  "/contact",
];

test("homepage has usable navigation, one H1, and no console errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");

  await expect(page).toHaveTitle(/SignalThread/);
  await expect(
    page.getByRole("heading", { level: 1, name: "SignalThread" }),
  ).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  expect(consoleErrors).toEqual([]);
});

test("primary navigation reaches the documentation index", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Docs" })
    .click();

  await expect(page).toHaveURL(/\/docs$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build a repeatable documentation release check",
    }),
  ).toBeVisible();
});

test("core HTML routes return one H1 and an indexable canonical", async ({
  page,
}) => {
  for (const route of htmlRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("h1"), route).toHaveCount(1);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical, route).toMatch(/^https:\/\/example\.com(?:\/|$)/);
    expect(canonical, route).not.toMatch(/localhost|127\.0\.0\.1/);
    expect(
      await page.locator('meta[name="robots"][content*="noindex"]').count(),
      route,
    ).toBe(0);
  }
});

test("custom not-found page returns 404 with useful navigation", async ({
  page,
}) => {
  const response = await page.goto("/this-route-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "This path is not part of the published graph",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse documentation" }),
  ).toBeVisible();
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[name="googlebot"]')).toHaveCount(0);
});

test.describe("server-rendered documentation", () => {
  test.use({ javaScriptEnabled: false });

  test("guide content and code remain visible without client JavaScript", async ({
    page,
  }) => {
    await page.goto("/docs/getting-started");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Get started with SignalThread",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Prerequisites" }),
    ).toBeVisible();
    await expect(page.getByText("npx signalthread check")).toBeVisible();
    await expect(
      page.getByText(/cannot prove that search engines or AI systems/i),
    ).toBeVisible();
  });
});

test("machine-readable endpoints return expected formats", async ({
  request,
}) => {
  const expectations = [
    ["/robots.txt", "text/plain", "Sitemap:"],
    ["/sitemap.xml", "application/xml", "<urlset"],
    ["/llms.txt", "text/plain", "emerging convention"],
    ["/llms-full.txt", "text/plain", "# Full documentation"],
    ["/ai/site.json", "application/json", '"limitations"'],
    ["/docs/getting-started/markdown", "text/markdown", "Canonical source:"],
    ["/feed.xml", "application/atom+xml", "<feed"],
  ] as const;

  for (const [path, contentType, marker] of expectations) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain(contentType);
    expect(await response.text(), path).toContain(marker);
  }
});
