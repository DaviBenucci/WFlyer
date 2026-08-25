import { expect, test } from "@playwright/test";

const projectRoutes = [
  "/portfolio/w-flyer",
  "/portfolio/msn-distribuidora",
  "/portfolio/msn-suprimentos",
] as const;

const applicationRoutes = [
  "/aplicacao-wflyer",
  "/aplicacao-wflyer/como-funciona",
  "/aplicacao-wflyer/beneficios",
] as const;

test("the project allowlist exposes exactly three detailed public records", async ({
  page,
  request,
}) => {
  await page.goto("/portfolio");

  const projectLinks = page.locator(
    'main [data-project-list] a[href^="/portfolio/"]',
  );
  await expect(projectLinks).toHaveCount(projectRoutes.length);
  for (const [index, route] of projectRoutes.entries()) {
    await expect(projectLinks.nth(index)).toHaveAttribute("href", route);
  }

  for (const route of projectRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
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

test("application detail routes keep access terminal-only and omit the retired tablet", async ({
  page,
}) => {
  for (const route of applicationRoutes) {
    await page.goto(route);
    const main = page.getByRole("main");

    await expect(main.locator('a[href="https://app.wflyer.com.br"]')).toHaveCount(
      0,
    );
    await expect(main.locator("[data-application-demo-tablet]")).toHaveCount(0);
    await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
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

test("sitemap publishes allowlisted projects and excludes private or lab paths", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  const sitemap = await response.text();

  expect(response.ok()).toBe(true);
  for (const route of projectRoutes) {
    expect(sitemap).toContain(new URL(route, "https://wflyer.com.br").toString());
  }
  expect(sitemap).not.toContain("projeto-interno");
  expect(sitemap).not.toContain("servico-nao-publicado");
  expect(sitemap).not.toContain("__visual-lab");
});

test("Phase-3 pages remain usable on narrow reduced-motion viewports", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 320 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });

  for (const route of ["/servicos", "/portfolio/w-flyer", "/contato"]) {
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
