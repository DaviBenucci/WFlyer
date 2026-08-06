import { expect, test, type Locator, type Page } from "@playwright/test";

import {
  prepareVisualCapture,
  stabilizeVisualCapture,
  waitForStableFrames,
  waitForVisualDocument,
} from "../helpers/visual";

const desktopViewport = { height: 720, width: 1280 } as const;
const mobileViewport = { height: 844, width: 390 } as const;

interface BrandIntroTimelineHandle {
  readonly pause: (at: number, suppressEvents?: boolean) => void;
  readonly paused: () => boolean;
  readonly time: () => number;
  readonly totalTime: (
    at: number,
    suppressEvents?: boolean,
  ) => BrandIntroTimelineHandle;
}

interface CheckpointCaptureOptions {
  readonly colorScheme?: "dark" | "light";
  readonly theme?: "dark" | "light";
  readonly viewport?: { readonly height: number; readonly width: number };
}

async function readTimelineState(page: Page) {
  return page.evaluate(() => {
    const timeline = (
      window as typeof window & {
        __wfBrandIntroTimeline: BrandIntroTimelineHandle;
      }
    ).__wfBrandIntroTimeline;

    return { paused: timeline.paused(), time: timeline.time() };
  });
}

async function expectCheckpointState(
  page: Page,
  overlay: Locator,
  at: number,
): Promise<void> {
  const home = page.locator("[data-brand-intro-home-state]");
  const homeActions = page
    .locator("[data-brand-intro-home-actions]")
    .first();
  const homeCue = page.locator("[data-brand-intro-home-cue]");
  const introLockup = overlay.locator("[data-intro-lockup]");
  const introOrigin = overlay.locator("[data-intro-origin]");

  await expect(overlay).toHaveAttribute("data-brand-intro", "playing");
  await expect(overlay).not.toHaveAttribute("aria-hidden");
  await expect(overlay).not.toHaveAttribute("inert");
  await expect(home).toHaveAttribute("data-brand-intro-home-state", "pending");
  await expect(page.locator("html")).toHaveAttribute(
    "data-brand-intro-active",
    "true",
  );
  if (at > 0) {
    await expect(homeActions).toHaveCSS("opacity", "0");
    await expect(homeCue).toHaveCSS("opacity", "0");
  }

  if (at <= 4.05) {
    await expect(overlay).toHaveCSS("opacity", "1");
  } else {
    await expect(overlay).toHaveCSS("opacity", "0");
    await expect(introLockup).toHaveCSS("opacity", "0");
    await expect(
      page.locator("[data-brand-intro-header-pivot]:visible"),
    ).toHaveCSS("opacity", "1");
    await expect(page.locator("[data-brand-intro-home-origin]")).toHaveCSS(
      "opacity",
      "1",
    );
  }

  if (at === 0) {
    await expect(introOrigin).toHaveCSS("opacity", "0");
  } else if (at <= 2.5) {
    await expect(introOrigin).toHaveCSS("opacity", "1");
  } else {
    await expect(introOrigin).toHaveCSS("opacity", "0");
  }

  if (at < 3.3) {
    await expect(introLockup).toHaveCSS("opacity", "0");
  } else if (at <= 4.05) {
    await expect(introLockup).toHaveCSS("opacity", "1");
  }
}

async function openCheckpoint(
  page: Page,
  at: number,
  options: CheckpointCaptureOptions = {},
) {
  const colorScheme = options.colorScheme ?? "light";
  await prepareVisualCapture(page, {
    colorScheme,
    reducedMotion: "no-preference",
    theme: options.theme ?? colorScheme,
    viewport: options.viewport ?? desktopViewport,
  });
  await page.goto("/?intro=1&introCheckpoint=1");

  const overlay = page.locator("[data-brand-intro]");
  await expect(overlay).toHaveAttribute("data-brand-intro", "playing");
  await expect(
    page.getByRole("button", { name: "Pular introdução" }),
  ).toHaveCSS("opacity", "1");
  await waitForVisualDocument(page);
  await waitForStableFrames(page);

  await page.waitForFunction(
    () =>
      Boolean(
        (window as typeof window & { __wfBrandIntroTimeline?: unknown })
          .__wfBrandIntroTimeline,
      ),
  );
  const pausedState = await page.evaluate((time) => {
    const timeline = (
      window as typeof window & {
        __wfBrandIntroTimeline: BrandIntroTimelineHandle;
      }
    ).__wfBrandIntroTimeline;
    if (time === 0) {
      // Prime zero-position sets, then return to the exact authored checkpoint.
      timeline.totalTime(0.001, true).totalTime(0, true);
    }
    timeline.pause(time, true);

    return { paused: timeline.paused(), time: timeline.time() };
  }, at);

  expect(pausedState.paused).toBe(true);
  expect(pausedState.time).toBeCloseTo(at, 6);
  await waitForStableFrames(page);

  const stableState = await readTimelineState(page);
  expect(stableState.paused).toBe(true);
  expect(stableState.time).toBeCloseTo(at, 6);
  await expectCheckpointState(page, overlay, at);

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
    await expect(overlay).toHaveScreenshot(`${checkpoint.name}.png`);
  });
}

test("intro dark checkpoint", async ({ page }) => {
  const overlay = await openCheckpoint(page, 3.3, {
    colorScheme: "dark",
    theme: "dark",
  });
  await expect(overlay).toHaveScreenshot("intro-dark.png");
});

test("intro mobile checkpoint", async ({ page }) => {
  const overlay = await openCheckpoint(page, 2.5, {
    viewport: mobileViewport,
  });
  await expect(overlay).toHaveScreenshot("intro-mobile.png");
});

test("intro hero-opening checkpoint", async ({ page }) => {
  await openCheckpoint(page, 5.2);
  await expect(page).toHaveScreenshot("intro-hero-opening.png", {
    fullPage: false,
  });
});

test("intro hero-opening dark mobile checkpoint", async ({ page }) => {
  await openCheckpoint(page, 5.2, {
    colorScheme: "dark",
    theme: "dark",
    viewport: mobileViewport,
  });
  await expect(page).toHaveScreenshot("intro-hero-opening-dark-mobile.png", {
    fullPage: false,
  });
});

test("intro reduced-motion final Home", async ({ page }) => {
  await prepareVisualCapture(page, {
    colorScheme: "light",
    reducedMotion: "reduce",
    theme: "light",
    viewport: desktopViewport,
  });
  await page.goto("/?intro=1");

  const experience = page.locator("[data-site-experience]");
  const home = page.locator("main[data-brand-intro-home-state]");
  const homeActions = page.locator("[data-brand-intro-home-actions]");
  const homeCue = page.locator("[data-brand-intro-home-cue]");
  const homeOrigin = page.locator("[data-brand-intro-home-origin]");

  await stabilizeVisualCapture(page, {
    readyAttribute: {
      name: "data-brand-intro-home-state",
      value: "ready",
    },
    stateLocator: home,
  });

  expect(page.viewportSize()).toEqual(desktopViewport);
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-brand-intro-active",
  );
  expect(
    await page.evaluate(
      () =>
        Boolean(
          (window as typeof window & { __wfBrandIntroTimeline?: unknown })
            .__wfBrandIntroTimeline,
        ),
    ),
  ).toBe(false);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(home).toHaveAttribute("data-chapter", "home");
  await expect(home).not.toHaveAttribute("aria-hidden");
  await expect(home).not.toHaveAttribute("inert");
  await expect(experience).toHaveAttribute(
    "data-transition-reduced-motion",
    "true",
  );
  await expect(experience).toHaveAttribute("data-transition-phase", "idle");
  await expect(experience).toHaveAttribute("data-active-timelines", "0");
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");

  await expect(
    page.getByRole("link", { exact: true, name: "Acessar aplicação" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      exact: true,
      name: "Conheça nossos serviços",
    }),
  ).toBeVisible();
  await expect(homeActions).toHaveCount(2);
  for (const actions of await homeActions.all()) {
    await expect(actions).toHaveCSS("opacity", "1");
    await expect(actions).toHaveCSS("transform", "none");
  }
  await expect(homeOrigin).toHaveCSS("opacity", "1");
  await expect(homeOrigin).toHaveCSS("transform", "none");
  await expect(homeCue).toBeVisible();
  await expect(homeCue).toHaveCSS("opacity", "1");
  await expect(homeCue).toHaveCSS("transform", "none");
  await expect(page.locator("nextjs-portal")).toHaveCount(0);

  expect(
    await page.evaluate(() => ({
      fonts: document.fonts.status,
      readyState: document.readyState,
    })),
  ).toEqual({ fonts: "loaded", readyState: "complete" });
  await waitForStableFrames(page);
  await expect(home).toHaveAttribute("data-brand-intro-home-state", "ready");
  await expect(homeCue).toHaveCSS("opacity", "1");
  await expect(page).toHaveScreenshot("intro-reduced-home.png", {
    fullPage: false,
  });
});
