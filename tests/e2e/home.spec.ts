import { expect, test } from "@playwright/test";

test("a Home entrega a origem e os dois caminhos oficiais", async ({
  page,
}) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/W_Flyer/u);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

  const main = page.getByRole("main");

  await expect(main).toBeVisible();
  await expect(main).toHaveAttribute("data-branch", "origin");
  await expect(main).toHaveAttribute("data-coordinate", "0");
  await expect(main).toHaveAttribute("data-entry-edge", "center");
  await expect(main).toHaveAttribute("data-exit-edge", "center");
  await expect(main).toHaveAttribute("data-terminal", "false");
  await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(main.getByRole("heading", { level: 2 })).toHaveCount(2);

  const applicationPath = page.getByRole("link", {
    name: "Saiba mais",
  });
  const applicationAccess = page.getByRole("link", {
    name: /Acessar aplicação/u,
  });
  const servicesPath = page.getByRole("link", {
    name: "Conheça nossos serviços",
  });
  const companyPath = page.getByRole("link", {
    name: "Conhecer a empresa",
  });

  await expect(applicationPath).toHaveAttribute("href", "/aplicacao-wflyer");
  await expect(applicationAccess).toHaveAttribute(
    "href",
    "https://app.wflyer.com.br",
  );
  await expect(applicationAccess).toHaveAttribute("target", "_blank");
  await expect(servicesPath).toHaveAttribute("href", "/servicos");
  await expect(companyPath).toHaveAttribute("href", "/sobre");

  await expect(page.locator("[data-narrative-clef]")).toBeVisible();
  await expect(page.locator("[data-origin-score]")).toBeVisible();
  await expect(
    page.locator('[data-origin-score-layout="desktop"] [data-score-branch]'),
  ).toHaveCount(2);
  await expect(
    page.locator('[data-origin-score-layout="desktop"] [data-origin-staff-line]'),
  ).toHaveCount(10);
  await expect(
    page.locator(
      '[data-narrative-clef] [data-asset-name="wflyer-header-symbol"]',
    ),
  ).toHaveCount(0);
});

test("foco enfatiza somente a pauta do ramo selecionado", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1024 });
  await page.goto("/");

  const applicationScore = page.locator(
    '[data-origin-score-layout="desktop"] [data-score-branch="application"]',
  );
  const institutionalScore = page.locator(
    '[data-origin-score-layout="desktop"] [data-score-branch="institutional"]',
  );
  const applicationPath = applicationScore.locator("path").first();
  const pathBeforeFocus = await applicationPath.getAttribute("d");

  await page.getByRole("link", { name: /Acessar aplicação/u }).focus();

  await expect(applicationScore).toHaveCSS("opacity", "1");
  await expect(institutionalScore).toHaveCSS("opacity", "0.28");
  expect(await applicationPath.getAttribute("d")).toBe(pathBeforeFocus);

  await page.getByRole("link", { name: "Conheça nossos serviços" }).focus();

  await expect(institutionalScore).toHaveCSS("opacity", "1");
  await expect(applicationScore).toHaveCSS("opacity", "0.28");
  expect(await applicationPath.getAttribute("d")).toBe(pathBeforeFocus);
});
