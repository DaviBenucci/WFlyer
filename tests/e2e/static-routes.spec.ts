import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/aplicacao-wflyer",
  "/aplicacao-wflyer/como-funciona",
  "/aplicacao-wflyer/beneficios",
  "/sobre",
  "/servicos",
  "/processo",
  "/portfolio",
  "/contato",
  "/servicos/criacao-de-sites",
  "/servicos/criacao-de-aplicacoes",
  "/servicos/integracoes",
  "/servicos/solucoes-sob-medida",
  "/portfolio/w-flyer",
  "/portfolio/msn-distribuidora",
  "/portfolio/msn-suprimentos",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
  "/acessibilidade",
] as const;

async function releaseRetainedHomeIntro(page: Page) {
  await page.waitForFunction(() => {
    const home = document.querySelector<HTMLElement>(
      "[data-brand-intro-home-state]",
    );

    return (
      home?.dataset.brandIntroHomeState === "ready" ||
      document.documentElement.dataset.brandIntroActive === "true"
    );
  });

  if (
    (await page.locator("html").getAttribute("data-brand-intro-active")) ===
    "true"
  ) {
    await page.keyboard.press("Escape");
  }

  await expect(
    page.locator('[data-brand-intro-home-state="ready"]'),
  ).toHaveCount(1);
}

for (const route of routes) {
  test(`${route} renderiza diretamente com SEO e navegação por teclado`, async ({
    page,
  }) => {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });

    expect(response?.ok()).toBe(true);
    if (route === "/") await releaseRetainedHomeIntro(page);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toBeAttached();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      route === "/"
        ? "https://wflyer.com.br"
        : new URL(route, "https://wflyer.com.br").toString(),
    );

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", {
      name: "Pular para o conteúdo principal",
    });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
  });
}

test("sitemap e robots expõem somente a superfície pública esperada", async ({
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  const sitemap = await sitemapResponse.text();

  expect(sitemapResponse.ok()).toBe(true);
  for (const route of routes) {
    expect(sitemap).toContain(
      new URL(route, "https://wflyer.com.br").toString(),
    );
  }
  expect(sitemap).not.toContain("/api/contact");
  expect(sitemap).not.toContain("app.wflyer.com.br");

  const robotsResponse = await request.get("/robots.txt");
  const robots = await robotsResponse.text();

  expect(robotsResponse.ok()).toBe(true);
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain(
    "Sitemap: https://wflyer.com.br/sitemap.xml",
  );
});

test("uma rota inexistente apresenta 404 acessível e não indexável", async ({
  page,
}) => {
  const response = await page.goto("/rota-que-nao-existe", {
    waitUntil: "domcontentloaded",
  });

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/u,
  );
  await expect(
    page.getByRole("link", {
      name: "Voltar à página inicial",
      exact: true,
    }),
  ).toHaveAttribute("href", "/");
});
