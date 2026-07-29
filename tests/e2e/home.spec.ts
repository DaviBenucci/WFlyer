import { expect, test } from "@playwright/test";

test("a Home entrega conteúdo e os dois caminhos principais", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/W_Flyer/u);
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const applicationPath = page.locator('a[href="/aplicacao-wflyer"]');
  const institutionalPath = page.locator('a[href="/sobre"]');

  await expect(applicationPath).toBeVisible();
  await expect(institutionalPath).toBeVisible();
  await expect(applicationPath).not.toHaveAccessibleName("");
  await expect(institutionalPath).not.toHaveAccessibleName("");
});
