import { expect, test, type Page } from "@playwright/test";

async function openCheckpoint(page: Page, at: number) {
  await page.goto("/?intro=1&introCheckpoint=1");
  await page.evaluate(() => {
    document
      .querySelector("nextjs-portal")
      ?.setAttribute("style", "display: none !important");
  });
  const overlay = page.locator("[data-brand-intro]");
  await expect(overlay).toHaveAttribute("data-brand-intro", "playing");
  await expect(overlay).not.toHaveAttribute("aria-hidden");
  await expect(overlay).not.toHaveAttribute("inert");
  await expect(
    page.getByRole("button", { name: "Pular introdução" }),
  ).toHaveCSS("opacity", "1");
  await page.waitForFunction(
    () =>
      Boolean(
        (window as typeof window & { __wfBrandIntroTimeline?: unknown })
          .__wfBrandIntroTimeline,
      ),
  );
  await page.evaluate((time) => {
    (
      window as typeof window & {
        __wfBrandIntroTimeline: { pause: (at: number) => void };
      }
    ).__wfBrandIntroTimeline.pause(time === 0 ? 0.001 : time);
  }, at);
  if (at === 0) {
    await expect(overlay).toHaveCSS("opacity", "1");
    await expect(
      page.getByRole("button", { name: "Pular introdução" }),
    ).toBeVisible();
  }
  return overlay;
}

for (const checkpoint of [
  { at: 0, name: "intro-start" },
  { at: 0.3, name: "intro-seed" },
  { at: 0.7, name: "intro-expand" },
  { at: 1.5, name: "intro-lock" },
  { at: 2.5, name: "intro-wordmark" },
  { at: 3.3, name: "intro-hold" },
  { at: 4.05, name: "intro-handoff" },
] as const) {
  test(`${checkpoint.name} checkpoint`, async ({ page }) => {
    const overlay = await openCheckpoint(page, checkpoint.at);
    await expect(overlay).toHaveScreenshot(`${checkpoint.name}.png`, {
      animations: "disabled",
    });
  });
}

test("intro dark checkpoint", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    window.localStorage.setItem("wf-theme", "dark");
  });
  const overlay = await openCheckpoint(page, 3.3);
  await expect(overlay).toHaveScreenshot("intro-dark.png", {
    animations: "disabled",
  });
});

test("intro mobile checkpoint", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  const overlay = await openCheckpoint(page, 2.5);
  await expect(overlay).toHaveScreenshot("intro-mobile.png", {
    animations: "disabled",
  });
});

test("intro hero-opening checkpoint", async ({ page }) => {
  await openCheckpoint(page, 5.2);
  await expect(page).toHaveScreenshot("intro-hero-opening.png", {
    animations: "disabled",
    fullPage: false,
  });
});

test("intro hero-opening dark mobile checkpoint", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    window.localStorage.setItem("wf-theme", "dark");
  });
  await openCheckpoint(page, 5.2);
  await expect(page).toHaveScreenshot("intro-hero-opening-dark-mobile.png", {
    animations: "disabled",
    fullPage: false,
  });
});

test("intro reduced-motion final Home", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?intro=1");
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page).toHaveScreenshot("intro-reduced-home.png", {
    animations: "disabled",
    fullPage: false,
  });
});
