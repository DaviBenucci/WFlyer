import { expect, test, type Page } from "@playwright/test";

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
  await page.goto("/aplicacao-wflyer");
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.evaluate(() => document.fonts.ready);
  const demo = page.locator("[data-application-demo]");
  await expect(demo).toBeVisible();
  return demo;
}

test("tablet idle light evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await expect(demo).toHaveScreenshot("tablet-idle-light.png", {
    animations: "disabled",
  });
});

test("tablet idle dark evidence", async ({ page }) => {
  const demo = await openTablet(page, { colorScheme: "dark" });
  await expect(demo).toHaveScreenshot("tablet-idle-dark.png", {
    animations: "disabled",
  });
});

test("tablet focused control evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await demo.getByLabel("Instrumento de origem").focus();
  await expect(demo).toHaveScreenshot("tablet-focus-control.png", {
    animations: "disabled",
  });
});

test("tablet processing evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await page.addStyleTag({
    content: "[data-tablet-shell] { transform: none !important; }",
  });
  await page.evaluate(() => {
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, timeout?: number) => {
      if (timeout === 650) return 1;
      return originalSetTimeout(handler, timeout);
    }) as typeof window.setTimeout;
  });
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "processing");
  await expect(demo).toHaveScreenshot("tablet-processing.png", {
    animations: "disabled",
  });
});

test("tablet result evidence", async ({ page }) => {
  const demo = await openTablet(page);
  await demo.getByRole("button", { name: "Transpor" }).click();
  await expect(demo).toHaveAttribute("data-demo-state", "result");
  await expect(demo).toHaveScreenshot("tablet-result.png", {
    animations: "disabled",
  });
});

test("tablet reduced motion evidence", async ({ page }) => {
  const demo = await openTablet(page, { reducedMotion: "reduce" });
  await expect(demo).toHaveScreenshot("tablet-reduced-motion.png", {
    animations: "disabled",
  });
});

test("tablet mobile evidence", async ({ page }) => {
  const demo = await openTablet(page, { width: 390 });
  await expect(demo).toHaveScreenshot("tablet-mobile.png", {
    animations: "disabled",
  });
});
