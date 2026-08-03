import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1536, height: 1024 },
] as const;
const themes = ["light", "dark"] as const;

for (const viewport of viewports) {
  for (const theme of themes) {
    test(`a Home permanece legível e sem overflow em ${viewport.name} (${theme})`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("wf-theme", selectedTheme);
      }, theme);
      await page.goto("/");

      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const main = page.getByRole("main");

      await expect(main).toBeVisible();
      await expect(main.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(main.getByRole("heading", { level: 2 })).toHaveCount(2);

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));

      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    });
  }
}

for (const width of [767, 768, 1023, 1024, 1199, 1200]) {
  test(`a Home preserva reflow e largura útil em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
    await expect(page.locator('[data-home-branch="application"]')).toBeVisible();
    await expect(
      page.locator('[data-home-branch="institutional"]'),
    ).toBeVisible();
  });
}

test("a troca de tema preserva a geometria da bifurcação", async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1024 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const selectors = [
    "[data-home-origin]",
    '[data-home-branch="application"]',
    '[data-home-branch="institutional"]',
    "[data-origin-score]",
  ] as const;
  const geometryBefore = await Promise.all(
    selectors.map((selector) => page.locator(selector).boundingBox()),
  );

  await page.getByRole("button", { name: "Tema escuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const geometryAfter = await Promise.all(
    selectors.map((selector) => page.locator(selector).boundingBox()),
  );

  expect(geometryAfter).toEqual(geometryBefore);
});
