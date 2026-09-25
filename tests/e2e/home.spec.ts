import { expect, test } from "@playwright/test";

test("a Home entrega a origem única do portfólio profissional", async ({
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
  await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(main.getByRole("heading", { level: 2 })).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Conheça meus serviços" }),
  ).toHaveAttribute("href", "/servicos");
  await expect(
    page.getByRole("link", { name: "Conhecer meu trabalho" }),
  ).toHaveAttribute("href", "/sobre");

  await expect(page.locator("[data-narrative-clef]")).toBeVisible();
  await expect(page.locator("[data-origin-score]")).toBeVisible();
  await expect(
    page.locator('[data-origin-score-layout="desktop"] [data-score-branch]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-origin-score-layout="desktop"] [data-origin-staff-line]'),
  ).toHaveCount(5);
  await expect(page.locator('[data-home-branch="professional"]')).toHaveCount(1);
  await expect(page.locator('[data-home-branch="application"]')).toHaveCount(0);
  await expect(page.locator('a[href^="/aplicacao-wflyer"]')).toHaveCount(0);
  await expect(page.locator('a[href="https://app.wflyer.com.br"]')).toHaveCount(0);
});
