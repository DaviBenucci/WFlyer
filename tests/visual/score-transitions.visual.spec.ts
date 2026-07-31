import { expect, test, type Page, type TestInfo } from "@playwright/test";

import {
  chapterControl,
  experience,
  holdAt,
  interruptTransition,
  overlay,
  releaseTransition,
  visibleHeaderLink,
  waitForCheckpoint,
  waitForSettledTransition,
  warmRoute,
} from "../helpers/transition";

test.describe.configure({ mode: "serial" });

async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<void> {
  const path = testInfo.outputPath(`${name}.png`);

  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    path,
  });
  await testInfo.attach(name, { contentType: "image/png", path });
}

test("captures the deterministic transition start checkpoint", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.goto("/aplicacao-wflyer");
  await holdAt(page, "start");

  await visibleHeaderLink(page, "/sobre").click();
  await waitForCheckpoint(page, "start");

  await expect(experience(page)).toHaveAttribute(
    "data-transition-mode",
    "home-pivot",
  );
  await expect(
    overlay(page).locator("[data-transition-segment]"),
  ).toHaveCount(2);
  await captureEvidence(page, testInfo, "phase05-transition-start");

  await interruptTransition(page);
  await waitForSettledTransition(page, "/aplicacao-wflyer", "cancelled");
});

test("captures the deterministic transition midpoint checkpoint", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.addInitScript(() => {
    window.localStorage.setItem("wf-theme", "dark");
  });
  await page.goto("/aplicacao-wflyer");
  await warmRoute(page, "/sobre");
  await holdAt(page, "midpoint");

  await visibleHeaderLink(page, "/sobre").click();
  await waitForCheckpoint(page, "midpoint");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(overlay(page)).toHaveAttribute("data-active", "true");
  await captureEvidence(page, testInfo, "phase05-transition-midpoint-dark");

  await releaseTransition(page);
  await waitForSettledTransition(page, "/sobre");
});

test("captures the deterministic transition completion checkpoint", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  await holdAt(page, "completion");

  await chapterControl(page, "next").click();
  await waitForCheckpoint(page, "completion");

  await expect(page).toHaveURL(/\/servicos$/u);
  await expect(experience(page)).toHaveAttribute("data-active-timelines", "0");
  await captureEvidence(page, testInfo, "phase05-transition-completion");

  await releaseTransition(page);
  await waitForSettledTransition(page, "/servicos");
});

test("captures both final barlines in light and dark desktop states", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 1024, width: 1536 });

  for (const terminal of [
    {
      name: "benefits",
      route: "/aplicacao-wflyer/beneficios",
      side: "start",
    },
    { name: "contact", route: "/contato", side: "end" },
  ] as const) {
    for (const theme of ["light", "dark"] as const) {
      await page.goto(terminal.route);
      await page.evaluate((nextTheme) => {
        window.localStorage.setItem("wf-theme", nextTheme);
        window.dispatchEvent(new StorageEvent("storage", {
          key: "wf-theme",
          newValue: nextTheme,
        }));
      }, theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const finalBarline = page.locator("[data-final-barline]");
      await expect(finalBarline).toHaveCount(1);
      await expect(finalBarline).toHaveAttribute("data-side", terminal.side);
      const path = testInfo.outputPath(
        `phase05-${terminal.name}-barline-${theme}.png`,
      );
      await finalBarline.screenshot({
        animations: "disabled",
        caret: "hide",
        path,
      });
      await testInfo.attach(
        `${terminal.name}-barline-${theme}`,
        { contentType: "image/png", path },
      );
    }
  }
});

test("captures reduced-motion completion without a decorative score segment", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");

  await chapterControl(page, "next").click();
  await waitForSettledTransition(page, "/servicos");

  await expect(experience(page)).toHaveAttribute(
    "data-transition-reduced-motion",
    "true",
  );
  await expect(
    overlay(page).locator("[data-transition-segment]"),
  ).toHaveCount(0);
  await captureEvidence(page, testInfo, "phase05-reduced-motion-completion");
});

test("captures mobile completion with zero horizontal overflow", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");

  await chapterControl(page, "next").click();
  await waitForSettledTransition(page, "/servicos");

  const widths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth);
  await expect(experience(page)).toHaveAttribute("data-scroll-locked", "false");
  await captureEvidence(page, testInfo, "phase05-mobile-completion");
});
