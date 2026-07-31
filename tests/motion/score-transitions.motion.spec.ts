import { expect, test } from "@playwright/test";

import {
  chapterControl,
  expectSafeSettledDocument,
  expectTransitionMetadata,
  experience,
  failNextTransition,
  holdAt,
  interruptTransition,
  overlay,
  releaseTransition,
  timeoutNextTransition,
  visibleHeaderLink,
  waitForCheckpoint,
  waitForSettledTransition,
  warmRoute,
} from "../helpers/transition";

test.describe.configure({ mode: "serial" });

test("an interrupted midpoint releases its timeline, overlay, and content", async ({
  page,
}) => {
  await page.goto("/sobre");
  await warmRoute(page, "/aplicacao-wflyer");
  await holdAt(page, "midpoint");
  await visibleHeaderLink(page, "/aplicacao-wflyer").click();
  await waitForCheckpoint(page, "midpoint");
  await expect(experience(page)).toHaveAttribute("data-active-timelines", "1");

  await interruptTransition(page);

  await waitForSettledTransition(page, "/aplicacao-wflyer", "cancelled");
  await expectSafeSettledDocument(page);
  await expect(page.getByRole("main")).toBeFocused();
});

test("the 1,100 ms safety deadline recovers a timed-out transition", async ({
  page,
}) => {
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  await timeoutNextTransition(page);
  const startedAt = Date.now();

  await chapterControl(page, "next").click();

  await expect(experience(page)).toHaveAttribute(
    "data-transition-destination",
    "/servicos",
  );
  await waitForSettledTransition(page, "/servicos", "recovered");
  expect(Date.now() - startedAt).toBeLessThan(2_500);
  await expectSafeSettledDocument(page);
  await expect(page.getByRole("main")).toBeFocused();
});

test("an injected animation failure uses the operable fallback", async ({
  page,
}) => {
  await page.goto("/servicos");
  await warmRoute(page, "/processo");
  await failNextTransition(page);

  await chapterControl(page, "next").click();

  await waitForSettledTransition(page, "/processo", "animation-error");
  await expectSafeSettledDocument(page);
  await expect(
    page.locator('header a[href="/servicos"][aria-current="step"]:visible'),
  ).toHaveCount(1);
});

test("reduced motion keeps route semantics without score drawing or lateral travel", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/sobre");
  await warmRoute(page, "/aplicacao-wflyer");
  await page.evaluate(() => {
    interface TimedWindow extends Window {
      __phase05ReducedElapsed?: number;
    }

    const shell = document.querySelector("[data-site-experience]");

    if (!shell) {
      throw new Error("The experience shell is unavailable.");
    }

    let startedAt: number | null = null;
    shell.addEventListener(
      "click",
      () => {
        startedAt = performance.now();
      },
      { capture: true, once: true },
    );
    const observer = new MutationObserver(() => {
      if (
        startedAt !== null &&
        shell.getAttribute("data-transition-phase") === "idle" &&
        shell.getAttribute("data-transition-result") === "success"
      ) {
        (window as TimedWindow).__phase05ReducedElapsed =
          performance.now() - startedAt;
        observer.disconnect();
      }
    });
    observer.observe(shell, {
      attributeFilter: ["data-transition-phase", "data-transition-result"],
      attributes: true,
    });
  });

  await visibleHeaderLink(page, "/aplicacao-wflyer").click();

  await expectTransitionMetadata(page, {
    destination: "/aplicacao-wflyer",
    direction: "left",
    mode: "home-pivot",
    source: "/sobre",
    sourceKind: "link",
  });
  await expect(experience(page)).toHaveAttribute(
    "data-transition-reduced-motion",
    "true",
  );
  await expect(overlay(page)).toHaveAttribute("data-active", "false");
  await expect(
    overlay(page).locator("[data-transition-segment]"),
  ).toHaveCount(0);
  await waitForSettledTransition(page, "/aplicacao-wflyer");
  const elapsed = await page.evaluate(() => {
    interface TimedWindow extends Window {
      __phase05ReducedElapsed?: number;
    }

    return (window as TimedWindow).__phase05ReducedElapsed;
  });
  expect(elapsed).toBeDefined();
  expect(elapsed).toBeLessThan(1_100);

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(({ playState }) => playState === "running").length,
      ),
    )
    .toBe(0);
  await expectSafeSettledDocument(page);
});

test("a runtime reduced-motion change reverts incompatible active work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/sobre");
  await warmRoute(page, "/aplicacao-wflyer");
  await holdAt(page, "midpoint");
  await visibleHeaderLink(page, "/aplicacao-wflyer").click();
  await waitForCheckpoint(page, "midpoint");

  await page.emulateMedia({ reducedMotion: "reduce" });

  await waitForSettledTransition(page, "/aplicacao-wflyer", "recovered");
  await expect(experience(page)).toHaveAttribute(
    "data-transition-reduced-motion",
    "true",
  );
  await expectSafeSettledDocument(page);
});

test("theme changes at midpoint preserve deterministic Home-pivot geometry", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/aplicacao-wflyer");
  await warmRoute(page, "/sobre");
  await holdAt(page, "midpoint");
  await visibleHeaderLink(page, "/sobre").click();
  await waitForCheckpoint(page, "midpoint");
  const pathsBefore = await overlay(page)
    .locator("[data-transition-staff-line]")
    .evaluateAll((paths) => paths.map((path) => path.getAttribute("d")));

  await page.locator('button[aria-label="Tema escuro"]:visible').click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const pathsAfter = await overlay(page)
    .locator("[data-transition-staff-line]")
    .evaluateAll((paths) => paths.map((path) => path.getAttribute("d")));
  expect(pathsAfter).toEqual(pathsBefore);
  await expect(overlay(page)).toHaveAttribute("data-checkpoint", "midpoint");

  await releaseTransition(page);
  await waitForSettledTransition(page, "/sobre");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile motion stays within 16 px and never creates overflow or scroll lock", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  await holdAt(page, "midpoint");

  await chapterControl(page, "next").click();
  await waitForCheckpoint(page, "midpoint");

  await expectTransitionMetadata(page, {
    destination: "/servicos",
    direction: "right",
    mode: "adjacent-score",
    source: "/sobre",
    sourceKind: "link",
  });
  await expect(experience(page)).toHaveAttribute("data-transition-active", "false");
  await expect(
    overlay(page).locator("[data-transition-segment]"),
  ).toHaveCount(0);

  const midpointGeometry = await page.getByRole("main").evaluate((main) => {
    const matrix = new DOMMatrix(window.getComputedStyle(main).transform);
    return {
      translationX: matrix.m41,
      translationY: matrix.m42,
      viewportHeight: window.visualViewport?.height ?? window.innerHeight,
    };
  });

  expect(Math.abs(midpointGeometry.translationX)).toBeLessThanOrEqual(16);
  expect(Math.abs(midpointGeometry.translationY)).toBeLessThanOrEqual(16);
  expect(midpointGeometry.viewportHeight).toBeGreaterThanOrEqual(800);

  await releaseTransition(page);
  await waitForSettledTransition(page, "/servicos");
  await expectSafeSettledDocument(page);
});

test("a touch-enabled mobile context navigates with a real tap", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    hasTouch: true,
    reducedMotion: "no-preference",
    viewport: { height: 844, width: 390 },
  });

  try {
    const touchPage = await context.newPage();
    await touchPage.goto("/sobre");
    await warmRoute(touchPage, "/servicos");

    await chapterControl(touchPage, "next").tap();

    await waitForSettledTransition(touchPage, "/servicos");
    await expectSafeSettledDocument(touchPage);
    await expect(experience(touchPage)).toHaveAttribute(
      "data-transition-active",
      "false",
    );
  } finally {
    await context.close();
  }
});

test("repeated navigation leaves one shell and no active GSAP or ScrollTrigger work", async ({
  page,
}) => {
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  await warmRoute(page, "/processo");

  for (const step of [
    { destination: "/servicos", role: "next" as const },
    { destination: "/processo", role: "next" as const },
    { destination: "/servicos", role: "previous" as const },
    { destination: "/sobre", role: "previous" as const },
  ]) {
    await chapterControl(page, step.role).click();
    await waitForSettledTransition(page, step.destination, [
      "success",
      "recovered",
    ]);
    await expectSafeSettledDocument(page);
  }

  await expect(experience(page)).toHaveCount(1);
  await expect(overlay(page)).toHaveCount(1);
  await expect(experience(page)).toHaveAttribute("data-active-timelines", "0");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(({ playState }) => playState === "running").length,
      ),
    )
    .toBe(0);

  const activeWork = await page.evaluate(() => {
    interface AnimationGlobals extends Window {
      ScrollTrigger?: { getAll(): readonly unknown[] };
      gsap?: {
        globalTimeline: {
          getChildren(
            nested?: boolean,
            tweens?: boolean,
            timelines?: boolean,
          ): readonly unknown[];
        };
      };
    }

    const globals = window as AnimationGlobals;

    return {
      globalGsapChildren:
        globals.gsap?.globalTimeline.getChildren(true, true, true).length ?? 0,
      scrollTriggers: globals.ScrollTrigger?.getAll().length ?? 0,
    };
  });

  expect(activeWork.globalGsapChildren).toBe(0);
  expect(activeWork.scrollTriggers).toBe(0);
});
