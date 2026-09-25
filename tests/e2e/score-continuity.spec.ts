import { expect, test } from "@playwright/test";

const chapters = [
  { id: "company", route: "/sobre", entryAnchorY: "0.46", exitAnchorY: "0.68", terminal: false },
  { id: "services", route: "/servicos", entryAnchorY: "0.68", exitAnchorY: "0.74", terminal: false },
  { id: "process", route: "/processo", entryAnchorY: "0.74", exitAnchorY: "0.72", terminal: false },
  { id: "contact", route: "/contato", entryAnchorY: "0.72", exitAnchorY: "0.64", terminal: true },
] as const;

for (const chapter of chapters) {
  test(`${chapter.route} expõe continuidade e término normativos`, async ({ page }) => {
    await page.goto(chapter.route);
    const main = page.getByRole("main");
    const score = main.locator(`[data-score-chapter="${chapter.id}"]`).first();

    await expect(main).toHaveAttribute("data-route-kind", "chapter");
    await expect(main).toHaveAttribute("data-chapter", chapter.id);
    await expect(main).toHaveAttribute("data-branch", "institutional");
    await expect(main).toHaveAttribute("data-entry-anchor-y", chapter.entryAnchorY);
    await expect(main).toHaveAttribute("data-entry-edge", "left");
    await expect(main).toHaveAttribute("data-exit-anchor-y", chapter.exitAnchorY);
    await expect(main).toHaveAttribute("data-exit-edge", "right");
    await expect(main).toHaveAttribute("data-terminal", chapter.terminal ? "true" : "false");
    await expect(score).toHaveAttribute("data-terminal", "false");
    await expect(score.locator("[data-chapter-staff-line]")).toHaveCount(5);

    const finalBarline = main.locator("[data-final-barline]");
    await expect(finalBarline).toHaveCount(chapter.terminal ? 1 : 0);
    if (chapter.terminal) await expect(finalBarline).toHaveAttribute("data-side", "end");
  });
}

test("navegação preserva o sentido progressivo do portfólio", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1024 });
  for (const route of ["/sobre", "/servicos", "/processo"]) {
    await page.goto(route);
    const previousBox = await page.locator('[data-navigation-role="previous"]').boundingBox();
    const nextBox = await page.locator('[data-navigation-role="next"]').boundingBox();
    expect(previousBox, route).not.toBeNull();
    expect(nextBox, route).not.toBeNull();
    expect(previousBox!.x, route).toBeLessThan(nextBox!.x);
  }
});

test("detalhe de serviço mantém contexto sem criar capítulo falso", async ({ page }) => {
  await page.goto("/servicos/criacao-de-sites");
  const main = page.getByRole("main");
  await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
  await expect(main).toHaveAttribute("data-parent-chapter", "services");
  await expect(main).not.toHaveAttribute("data-chapter", /.+/u);
  await expect(main.locator('[data-score-variant="auxiliary"]')).toHaveCount(1);
  await expect(main.locator("[data-score-segment]")).toHaveCount(0);
  await expect(main.locator("[data-final-barline]")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Voltar aos serviços" })).toHaveAttribute("href", "/servicos");
});

for (const route of ["/politica-de-privacidade", "/politica-de-cookies", "/termos-de-uso", "/acessibilidade"]) {
  test(`${route} usa pauta auxiliar sem inventar capítulo`, async ({ page }) => {
    await page.goto(route);
    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("data-route-kind", "auxiliary");
    await expect(main).toHaveAttribute("data-branch", "origin");
    await expect(main).not.toHaveAttribute("data-chapter", /.+/u);
    await expect(main).not.toHaveAttribute("data-parent-chapter", /.+/u);
    await expect(main.locator('[data-score-variant="auxiliary"]')).toHaveCount(1);
    await expect(main.locator("[data-score-segment]")).toHaveCount(0);
    await expect(main.locator("[data-final-barline]")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Voltar ao site" })).toHaveAttribute("href", "/");
  });
}

test("conteúdo e pautas permanecem disponíveis sem JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(1);
  await expect(page.locator("[data-origin-score]")).toBeVisible();
  await expect(page.getByRole("link", { name: "Conheça meus serviços" })).toHaveAttribute("href", "/servicos");

  await page.goto("/contato");
  await expect(page.getByRole("main")).toHaveAttribute("data-terminal", "true");
  await expect(page.locator("[data-final-barline]")).toHaveCount(1);
  await context.close();
});
