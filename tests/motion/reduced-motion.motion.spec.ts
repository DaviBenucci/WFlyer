import { expect, test } from "@playwright/test";

test("reduced motion mantém a Home disponível e encerra animações", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.locator('a[href="/aplicacao-wflyer"]')).toBeVisible();
  await expect(page.locator('a[href="/sobre"]')).toBeVisible();

  expect(
    await page.evaluate(() =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);

  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            document
              .getAnimations()
              .filter(({ playState }) => playState === "running").length,
        ),
      {
        message: "animações devem alcançar o estado final no modo reduzido",
        timeout: 500,
      },
    )
    .toBe(0);
});
