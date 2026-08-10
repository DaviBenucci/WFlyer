import { expect, test, type Locator, type Page } from "@playwright/test";

import { stabilizeVisualCapture } from "../helpers/visual";

async function openTablet(
  page: Page,
  options: {
    readonly colorScheme?: "dark" | "light";
    readonly reducedMotion?: "no-preference" | "reduce";
    readonly width?: number;
  } = {},
) {
  await page.setViewportSize({
    height: options.width === 390 ? 1100 : 1024,
    width: options.width ?? 1536,
  });
  await page.emulateMedia({
    colorScheme: options.colorScheme ?? "light",
    reducedMotion: options.reducedMotion ?? "no-preference",
  });
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem("wf-theme", selectedTheme);
  }, options.colorScheme ?? "light");
  await page.goto("/aplicacao-wflyer");
  const demo = page.locator("[data-application-demo]");
  await expect(demo).toBeVisible();
  await stabilizeVisualCapture(page, { stateLocator: demo });
  return demo;
}

async function settleTabletTilt(page: Page, demo: Locator): Promise<void> {
  const shell = demo.locator("[data-tablet-shell]");

  await page.mouse.move(0, 0);
  await expect
    .poll(() =>
      shell.evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(element).transform,
        );
        return Math.abs(matrix.m13) + Math.abs(matrix.m23);
      }),
    )
    .toBe(0);
  await expect
    .poll(() =>
      shell.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          x: style.getPropertyValue("--wf-tablet-glare-x").trim(),
          y: style.getPropertyValue("--wf-tablet-glare-y").trim(),
        };
      }),
    )
    .toEqual({ x: "50%", y: "14%" });
  await stabilizeVisualCapture(page, { stateLocator: demo });
}

test("tablet idle light evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await expect(demo).toHaveScreenshot("tablet-idle-light.png");
});

test("tablet idle dark evidence", async ({ page }) => {
  const demo = await openTablet(page, { colorScheme: "dark" });
  await expect(demo).toHaveScreenshot("tablet-idle-dark.png");
});

test("tablet focused control evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await demo.getByLabel("Instrumento de origem").focus();
  await stabilizeVisualCapture(page, { stateLocator: demo });
  await expect(demo).toHaveScreenshot("tablet-focus-control.png");
});

test("tablet processing evidence", async ({ page }) => {
  const demo = await openTablet(page);
  const destinationKey = demo.getByLabel("Tom de destino");
  await destinationKey.selectOption("g-major");
  await expect(demo).toHaveAttribute("data-demo-state", "configured");
  await destinationKey.selectOption("bb-major");
  await page.evaluate(() => {
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, timeout?: number) => {
      if (timeout === 650) return 1;
      return originalSetTimeout(handler, timeout);
    }) as typeof window.setTimeout;
  });
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "processing");
  await settleTabletTilt(page, demo);
  await expect(demo).toHaveScreenshot("tablet-processing.png");
});

test("tablet result evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await stabilizeVisualCapture(page, { stateLocator: demo });
  await expect(demo).toHaveScreenshot("tablet-result.png");
});

test("tablet reduced motion evidence", async ({ page }) => {
  const demo = await openTablet(page, { reducedMotion: "reduce" });
  await expect(demo).toHaveScreenshot("tablet-reduced-motion.png");
});

test("tablet mobile evidence", async ({ page }) => {
  const demo = await openTablet(page, { width: 390 });
  await expect(demo).toHaveScreenshot("tablet-mobile.png");
});
