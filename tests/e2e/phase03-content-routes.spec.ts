import { expect, test } from "@playwright/test";

const projectRoutes = [
  "/portfolio/w-flyer",
  "/portfolio/msn-distribuidora",
  "/portfolio/msn-suprimentos",
] as const;

test("the project allowlist does not expose browsing pages before approval", async ({
  request,
}) => {
  for (const route of ["/portfolio", ...projectRoutes]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});

test("invalid project and service slugs fail closed as non-indexable 404s", async ({
  page,
}) => {
  for (const route of [
    "/portfolio/projeto-interno",
    "/servicos/servico-nao-publicado",
  ]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(404);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/u,
    );
    await expect(page.locator("main [data-project-list]")).toHaveCount(0);
  }
});

test("services expose four categories and the four approved process stages", async ({
  page,
}) => {
  await page.goto("/servicos");

  await expect(
    page.locator('main a[href^="/servicos/"]'),
  ).toHaveCount(4);
  await expect(page.locator("main #processo article")).toHaveCount(4);
});

test("sitemap excludes deferred project browsing and private or lab paths", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  const sitemap = await response.text();

  expect(response.ok()).toBe(true);
  for (const route of projectRoutes) {
    expect(sitemap).not.toContain(new URL(route, "https://wflyer.com.br").toString());
  }
  expect(sitemap).not.toContain("https://wflyer.com.br/portfolio");
  expect(sitemap).not.toContain("projeto-interno");
  expect(sitemap).not.toContain("servico-nao-publicado");
  expect(sitemap).not.toContain("__visual-lab");
});

test("Phase-3 pages remain usable on narrow reduced-motion viewports", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 320 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });

  for (const route of ["/servicos", "/processo", "/contato"]) {
    await page.goto(route);
    await page.evaluate(() => localStorage.setItem("wf-theme", "dark"));
    await page.reload();

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      route,
    ).toBe(true);
  }
});
