import { expect, test, type Page } from "@playwright/test";

const routes = [
  { route: "/sobre", selector: "[data-editorial-pillars]" },
  { route: "/servicos", selector: "[data-service-grid]" },
  {
    route: "/processo",
    selector: '[data-step-sequence="institutional"]',
  },
  { route: "/contato", selector: "[data-contact-workspace]" },
  {
    route: "/servicos/criacao-de-sites",
    selector: "[data-service-detail-mark]",
  },
  {
    route: "/servicos/criacao-de-aplicacoes",
    selector: "[data-service-detail-mark]",
  },
  {
    route: "/servicos/integracoes",
    selector: "[data-service-detail-mark]",
  },
  {
    route: "/servicos/solucoes-sob-medida",
    selector: "[data-service-detail-mark]",
  },
  {
    route: "/politica-de-privacidade",
    selector: "article",
  },
  { route: "/politica-de-cookies", selector: "article" },
  { route: "/termos-de-uso", selector: "article" },
  { route: "/acessibilidade", selector: "article" },
] as const;

const viewports = [
  { height: 844, name: "mobile", width: 390 },
  { height: 1024, name: "desktop", width: 1536 },
] as const;

async function documentWidths(page: Page) {
  return page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
}

function expectInsideViewport(
  box: null | { readonly height: number; readonly y: number },
  viewportHeight: number,
) {
  expect(box).not.toBeNull();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight);
}

test("Serviços mantém CTA e quatro cards no primeiro viewport normativo", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.goto("/servicos");

  const cta = page.getByRole("link", { name: "Ver todos os serviços" });
  const grid = page.locator("[data-service-grid]");
  const score = page.locator(
    '[data-score-chapter="services"][data-score-placement="after-content"]',
  );

  await expect(cta).toBeVisible();
  await expect(grid.locator(":scope > li")).toHaveCount(4);
  const ctaBox = await cta.boundingBox();
  const gridBox = await grid.boundingBox();
  const scoreBox = await score.boundingBox();

  expectInsideViewport(gridBox, 1024);
  expectInsideViewport(ctaBox, 1024);
  expectInsideViewport(scoreBox, 1024);
  expect(ctaBox!.y).toBeGreaterThan(gridBox!.y + gridBox!.height);
  expect(scoreBox!.y).toBeGreaterThan(ctaBox!.y + ctaBox!.height);
});

for (const route of [
  "/sobre",
  "/processo",
] as const) {
  test(`${route} mantém a pauta do hero fora do texto legível`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1024, width: 1536 });
    await page.goto(route);

    const description = page.locator("main > div > header p").filter({
      hasNot: page.locator("[data-status]"),
    }).last();
    const score = page.locator(
      'main > div > header [data-score-placement="hero"]',
    );
    const descriptionBox = await description.boundingBox();
    const scoreBox = await score.boundingBox();

    expect(descriptionBox).not.toBeNull();
    expect(scoreBox).not.toBeNull();
    expect(scoreBox!.y).toBeGreaterThanOrEqual(
      descriptionBox!.y + descriptionBox!.height,
    );
  });
}

for (const composition of [
  { route: "/sobre", selector: "[data-editorial-pillars]" },
  {
    route: "/processo",
    selector: '[data-step-sequence="institutional"]',
  },
] as const) {
  test(`${composition.route} mantém o bloco canônico no primeiro viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 1024, width: 1536 });
    await page.goto(composition.route);

    expectInsideViewport(
      await page.locator(composition.selector).boundingBox(),
      1024,
    );
  });
}

for (const { route, selector } of routes) {
  for (const viewport of viewports) {
    test(`${route} preserva ${viewport.name} em claro e escuro`, async ({
      page,
    }) => {
      await page.setViewportSize({
        height: viewport.height,
        width: viewport.width,
      });
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(route);

      const main = page.getByRole("main");
      const archetypeBlock = page.locator(selector).first();
      await expect(main).toBeVisible();
      await expect(archetypeBlock).toBeVisible();
      await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
      if (route === "/contato") {
        await expect(page.locator("[data-verification-state]")).not.toHaveAttribute(
          "data-verification-state",
          "loading",
        );
      }

      const lightGeometry = {
        archetype: await archetypeBlock.boundingBox(),
        main: await main.boundingBox(),
      };
      const lightWidths = await documentWidths(page);

      expect(lightWidths.scrollWidth).toBeLessThanOrEqual(
        lightWidths.clientWidth,
      );

      await page.getByRole("button", { name: "Tema escuro" }).click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        "dark",
      );

      const darkGeometry = {
        archetype: await archetypeBlock.boundingBox(),
        main: await main.boundingBox(),
      };
      const darkWidths = await documentWidths(page);

      expect(darkWidths.scrollWidth).toBeLessThanOrEqual(
        darkWidths.clientWidth,
      );
      expect(darkGeometry).toEqual(lightGeometry);
    });
  }
}

for (const width of [767, 768, 1023, 1024, 1199, 1200]) {
  test(`arquétipos representativos não criam overflow em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width });

    for (const route of [
      "/sobre",
      "/servicos",
      "/processo",
      "/contato",
    ]) {
      await page.goto(route);
      const widths = await documentWidths(page);

      expect(widths.scrollWidth, route).toBeLessThanOrEqual(
        widths.clientWidth,
      );
    }
  });
}
