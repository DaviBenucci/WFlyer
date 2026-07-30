import { expect, test } from "@playwright/test";

const chapters = [
  {
    branch: "application",
    entryAnchorY: "0.46",
    entryEdge: "right",
    exitAnchorY: "0.68",
    exitEdge: "left",
    id: "application",
    route: "/aplicacao-wflyer",
    terminal: false,
  },
  {
    branch: "application",
    entryAnchorY: "0.68",
    entryEdge: "right",
    exitAnchorY: "0.56",
    exitEdge: "left",
    id: "application-how-it-works",
    route: "/aplicacao-wflyer/como-funciona",
    terminal: false,
  },
  {
    branch: "application",
    entryAnchorY: "0.56",
    entryEdge: "right",
    exitAnchorY: "0.64",
    exitEdge: "left",
    id: "application-benefits",
    route: "/aplicacao-wflyer/beneficios",
    terminal: true,
  },
  {
    branch: "institutional",
    entryAnchorY: "0.46",
    entryEdge: "left",
    exitAnchorY: "0.68",
    exitEdge: "right",
    id: "company",
    route: "/sobre",
    terminal: false,
  },
  {
    branch: "institutional",
    entryAnchorY: "0.68",
    entryEdge: "left",
    exitAnchorY: "0.74",
    exitEdge: "right",
    id: "services",
    route: "/servicos",
    terminal: false,
  },
  {
    branch: "institutional",
    entryAnchorY: "0.74",
    entryEdge: "left",
    exitAnchorY: "0.56",
    exitEdge: "right",
    id: "process",
    route: "/processo",
    terminal: false,
  },
  {
    branch: "institutional",
    entryAnchorY: "0.56",
    entryEdge: "left",
    exitAnchorY: "0.72",
    exitEdge: "right",
    id: "portfolio",
    route: "/portfolio",
    terminal: false,
  },
  {
    branch: "institutional",
    entryAnchorY: "0.72",
    entryEdge: "left",
    exitAnchorY: "0.64",
    exitEdge: "right",
    id: "contact",
    route: "/contato",
    terminal: true,
  },
] as const;

for (const chapter of chapters) {
  test(`${chapter.route} expõe continuidade e término normativos`, async ({
    page,
  }) => {
    await page.goto(chapter.route);

    const main = page.getByRole("main");
    const score = main
      .locator(`[data-score-chapter="${chapter.id}"]`)
      .first();

    await expect(main).toHaveAttribute("data-route-kind", "chapter");
    await expect(main).toHaveAttribute("data-chapter", chapter.id);
    await expect(main).toHaveAttribute("data-branch", chapter.branch);
    await expect(main).toHaveAttribute(
      "data-entry-anchor-y",
      chapter.entryAnchorY,
    );
    await expect(main).toHaveAttribute("data-entry-edge", chapter.entryEdge);
    await expect(main).toHaveAttribute(
      "data-exit-anchor-y",
      chapter.exitAnchorY,
    );
    await expect(main).toHaveAttribute("data-exit-edge", chapter.exitEdge);
    await expect(main).toHaveAttribute(
      "data-terminal",
      chapter.terminal ? "true" : "false",
    );
    await expect(score).toHaveAttribute("data-terminal", "false");
    await expect(
      score.locator("[data-chapter-staff-line]"),
    ).toHaveCount(5);

    const finalBarline = main.locator("[data-final-barline]");

    await expect(finalBarline).toHaveCount(chapter.terminal ? 1 : 0);

    if (chapter.terminal) {
      await expect(finalBarline).toHaveAttribute(
        "data-side",
        chapter.branch === "application" ? "start" : "end",
      );
    }
  });
}

test("navegação preserva o sentido espacial de cada ramo", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1024 });

  for (const route of [
    "/aplicacao-wflyer",
    "/aplicacao-wflyer/como-funciona",
    "/sobre",
    "/servicos",
    "/processo",
    "/portfolio",
  ]) {
    await page.goto(route);

    const main = page.getByRole("main");
    const branch = await main.getAttribute("data-branch");
    const previous = page.locator('[data-navigation-role="previous"]');
    const next = page.locator('[data-navigation-role="next"]');
    const previousBox = await previous.boundingBox();
    const nextBox = await next.boundingBox();

    expect(previousBox).not.toBeNull();
    expect(nextBox).not.toBeNull();

    if (!previousBox || !nextBox) {
      continue;
    }

    if (branch === "application") {
      expect(nextBox.x).toBeLessThan(previousBox.x);
    } else {
      expect(previousBox.x).toBeLessThan(nextBox.x);
    }
  }
});

test("detalhe de serviço mantém contexto sem criar capítulo falso", async ({
  page,
}) => {
  await page.goto("/servicos/criacao-de-sites");

  const main = page.getByRole("main");

  await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
  await expect(main).toHaveAttribute("data-parent-chapter", "services");
  await expect(main).not.toHaveAttribute("data-chapter", /.+/u);
  await expect(main.locator('[data-score-variant="auxiliary"]')).toHaveCount(1);
  await expect(main.locator("[data-score-segment]")).toHaveCount(0);
  await expect(main.locator("[data-final-barline]")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Voltar aos serviços" }),
  ).toHaveAttribute("href", "/servicos");
});

for (const route of [
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
  "/acessibilidade",
]) {
  test(`${route} usa pauta auxiliar sem inventar capítulo`, async ({
    page,
  }) => {
    await page.goto(route);

    const main = page.getByRole("main");

    await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
    await expect(main).toHaveAttribute("data-branch", "origin");
    await expect(main).not.toHaveAttribute("data-chapter", /.+/u);
    await expect(main).not.toHaveAttribute("data-parent-chapter", /.+/u);
    await expect(
      main.locator('[data-score-variant="auxiliary"]'),
    ).toHaveCount(1);
    await expect(main.locator("[data-score-segment]")).toHaveCount(0);
    await expect(main.locator("[data-final-barline]")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Voltar ao site" }),
    ).toHaveAttribute("href", "/");
  });
}

test("conteúdo e pautas permanecem disponíveis sem JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  await page.goto("/");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 2 }),
  ).toHaveCount(2);
  await expect(page.locator("[data-origin-score]")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Conheça nossos serviços" }),
  ).toHaveAttribute("href", "/servicos");

  await page.goto("/aplicacao-wflyer/beneficios");
  await expect(page.getByRole("main")).toHaveAttribute(
    "data-terminal",
    "true",
  );
  await expect(page.locator("[data-final-barline]")).toHaveCount(1);

  await context.close();
});
