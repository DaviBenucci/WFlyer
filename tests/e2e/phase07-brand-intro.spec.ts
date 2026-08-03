import { expect, test, type Page } from "@playwright/test";

interface BrandIntroTimelineHandle {
  readonly duration: () => number;
  readonly pause: (at: number) => void;
  readonly progress: (value: number) => void;
}

async function waitForBrandIntroTimeline(page: Page): Promise<void> {
  await page.waitForFunction(
    () =>
      Boolean(
        (window as typeof window & { __wfBrandIntroTimeline?: unknown })
          .__wfBrandIntroTimeline,
      ),
  );
}

async function pauseBrandIntroAt(page: Page, at: number): Promise<void> {
  await page.evaluate((time) => {
    (
      window as typeof window & {
        __wfBrandIntroTimeline: BrandIntroTimelineHandle;
      }
    ).__wfBrandIntroTimeline.pause(time);
  }, at);
}

test("eligible Home exposes skip, completes the session, and does not replay", async ({
  page,
}) => {
  await page.goto("/?intro=1");

  const skip = page.getByRole("button", { name: "Pular introdução" });
  await expect(skip).toBeVisible();
  await expect(skip).toHaveCSS("min-height", "44px");
  await skip.click();

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).toBeVisible();

  await page.reload();
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
});

test("skip is the only keyboard-operable surface while the overlay is active", async ({
  page,
}) => {
  await page.goto("/?intro=1&introCheckpoint=1");

  const skip = page.getByRole("button", { name: "Pular introdução" });
  const transitionLayer = page.locator("[data-score-transition-layer]");
  const isolatedSurfaces = [
    page.locator(".wf-skip-link"),
    page.locator("[data-brand-intro-header]"),
    page.locator("main"),
    page.locator("footer"),
  ];

  await expect(skip).toBeVisible();
  for (const surface of isolatedSurfaces) {
    await expect(surface).toHaveAttribute("aria-hidden", "true");
    await expect(surface).toHaveAttribute("inert", "");
  }
  await expect(transitionLayer).toHaveAttribute("aria-hidden", "true");
  await expect(transitionLayer).toHaveAttribute("inert", "");

  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await skip.click();

  for (const surface of isolatedSurfaces) {
    await expect(surface).not.toHaveAttribute("aria-hidden");
    await expect(surface).not.toHaveAttribute("inert");
  }
  await expect(transitionLayer).toHaveAttribute("aria-hidden", "true");
  await expect(transitionLayer).toHaveAttribute("inert", "");
});

test("Escape applies the same fail-open final state without moving focus", async ({
  page,
}) => {
  await page.goto("/?intro=1");
  const skip = page.getByRole("button", { name: "Pular introdução" });
  await skip.focus();
  await page.keyboard.press("Escape");

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).not.toBeFocused();
  await expect(page.getByRole("link", { name: "Acessar aplicação" })).toBeVisible();
});

test("reduced motion uses the direct final Home state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?intro=1");
  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).toBeVisible();
  await expect.poll(() =>
    page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
});

test("asset failure releases Home without waiting for the deadline", async ({
  page,
}) => {
  await page.route("**/brand/wflyer-intro-master.svg", (route) => route.abort());
  await page.goto("/?intro=1");

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).not.toHaveAttribute("aria-hidden");
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");
});

test("hard deadline releases Home when the asset request stalls", async ({ page }) => {
  await page.route("**/brand/wflyer-intro-master.svg", async () => {
    await new Promise<void>(() => undefined);
  });
  await page.goto("/?intro=1");
  await expect(page.locator("[data-brand-intro]")).toBeVisible();

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0, {
    timeout: 8_500,
  });
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.locator("main")).not.toHaveAttribute("aria-hidden");
  await expect(page.locator("main")).not.toHaveAttribute("inert");
  await expect.poll(() =>
    page.evaluate(() =>
      sessionStorage.getItem("wflyer.brand-intro.completed.v1"),
    ),
  ).toBe("1");
});

test("viewport changes fail open without leaving a page lock", async ({ page }) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await expect(page.locator("[data-brand-intro]")).toBeVisible();
  await waitForBrandIntroTimeline(page);
  await pauseBrandIntroAt(page, 5.2);
  await expect(
    page.locator('[data-brand-intro-home-copy="application"]').first(),
  ).toHaveAttribute("style", /opacity/u);

  await page.setViewportSize({ height: 800, width: 1200 });

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.locator('[data-brand-intro-home-copy="application"]').first(),
  ).not.toHaveAttribute("style");
});

test("hero opening follows the approved target order and bounded branch travel", async ({
  page,
}) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await waitForBrandIntroTimeline(page);

  const timelineDuration = await page.evaluate(
    () =>
      (
        window as typeof window & {
          __wfBrandIntroTimeline: BrandIntroTimelineHandle;
        }
      ).__wfBrandIntroTimeline.duration(),
  );
  expect(timelineDuration).toBeCloseTo(5.6, 5);

  const inspect = async (at: number) => {
    await pauseBrandIntroAt(page, at);

    return page.evaluate(() => {
      const firstVisible = <T extends Element>(selector: string): T => {
        const target = Array.from(document.querySelectorAll<T>(selector)).find(
          (candidate) => {
            const bounds = candidate.getBoundingClientRect();
            return bounds.width > 0 || bounds.height > 0;
          },
        );
        if (!target) throw new Error(`Missing visible intro target: ${selector}`);
        return target;
      };
      const opacity = (element: Element): number =>
        Number.parseFloat(getComputedStyle(element).opacity);
      const translateX = (element: Element): number => {
        const transform = getComputedStyle(element).transform;
        return transform === "none" ? 0 : new DOMMatrix(transform).m41;
      };
      const applicationCopy = firstVisible<HTMLElement>(
        '[data-brand-intro-home-copy="application"]',
      );
      const institutionalCopy = firstVisible<HTMLElement>(
        '[data-brand-intro-home-copy="institutional"]',
      );

      return {
        applicationActions: opacity(
          firstVisible('[data-brand-intro-home-actions="application"]'),
        ),
        applicationCopy: opacity(applicationCopy),
        applicationX: translateX(applicationCopy),
        cue: opacity(firstVisible("[data-brand-intro-home-cue]")),
        headerLine: opacity(
          firstVisible(
            "[data-brand-intro-header-score-lines] [data-staff-line]",
          ),
        ),
        homeLine: opacity(
          firstVisible(
            "[data-brand-intro-home-score] [data-origin-staff-line]",
          ),
        ),
        institutionalCopy: opacity(institutionalCopy),
        institutionalX: translateX(institutionalCopy),
        origin: opacity(firstVisible("[data-brand-intro-home-origin]")),
      };
    });
  };

  const scoreOpening = await inspect(4.4);
  expect(scoreOpening.headerLine).toBeGreaterThan(0);
  expect(scoreOpening.homeLine).toBeGreaterThan(0);
  expect(scoreOpening.origin).toBe(0);
  expect(scoreOpening.applicationCopy).toBe(0);

  const originOpening = await inspect(4.75);
  expect(originOpening.origin).toBeGreaterThan(0);
  expect(originOpening.applicationCopy).toBe(0);
  expect(originOpening.applicationActions).toBe(0);

  const copyOpening = await inspect(5.1);
  expect(copyOpening.applicationCopy).toBeGreaterThan(0);
  expect(copyOpening.institutionalCopy).toBeGreaterThan(0);
  expect(copyOpening.applicationX).toBeGreaterThanOrEqual(-20);
  expect(copyOpening.applicationX).toBeLessThan(0);
  expect(copyOpening.institutionalX).toBeGreaterThan(0);
  expect(copyOpening.institutionalX).toBeLessThanOrEqual(20);
  expect(copyOpening.applicationActions).toBe(0);
  expect(copyOpening.cue).toBe(0);

  const actionsOpening = await inspect(5.38);
  expect(actionsOpening.applicationActions).toBeGreaterThan(0);
  expect(actionsOpening.cue).toBe(0);

  const cueOpening = await inspect(5.52);
  expect(cueOpening.cue).toBeGreaterThan(0);
});

test("normal completion restores siblings and every owned Home/header property", async ({
  page,
}) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await waitForBrandIntroTimeline(page);
  await pauseBrandIntroAt(page, 5.59);

  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.evaluate(() => {
    (
      window as typeof window & {
        __wfBrandIntroTimeline: BrandIntroTimelineHandle;
      }
    ).__wfBrandIntroTimeline.progress(1);
  });

  await expect(page.locator("[data-brand-intro]")).toHaveCount(0);
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");
  await expect(page.getByRole("main")).not.toHaveAttribute("aria-hidden");

  const residue = await page.evaluate(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement | SVGElement>(
        [
          "[data-brand-intro-header-pivot]",
          "[data-brand-intro-header-score-lines] [data-staff-line]",
          "[data-brand-intro-header-score-detail]",
          "[data-brand-intro-header-label]",
          "[data-brand-intro-home-score] [data-origin-staff-line]",
          "[data-brand-intro-home-score] [data-origin-note]",
          "[data-brand-intro-home-origin]",
          "[data-brand-intro-home-copy]",
          "[data-brand-intro-home-actions]",
          "[data-brand-intro-home-cue]",
        ].join(","),
      ),
    );
    const ownedProperties = [
      "opacity",
      "rotate",
      "scale",
      "stroke-dasharray",
      "stroke-dashoffset",
      "transform",
      "transform-origin",
      "translate",
      "visibility",
    ];

    return {
      dirtyInline: targets
        .filter((target) =>
          ownedProperties.some((property) =>
            Boolean(target.style.getPropertyValue(property)),
          ),
        )
        .map((target) => target.outerHTML.slice(0, 120)),
      svgOrigins: targets.filter((target) =>
        target.hasAttribute("data-svg-origin"),
      ).length,
      transformedScoreLines: targets.filter(
        (target) =>
          target.hasAttribute("data-staff-line") ||
          target.hasAttribute("data-origin-staff-line"),
      ).filter((target) => target.hasAttribute("transform")).length,
    };
  });

  expect(residue).toEqual({
    dirtyInline: [],
    svgOrigins: 0,
    transformedScoreLines: 0,
  });
});

test("handoff converges on the visible Home header pivot", async ({ page }) => {
  await page.goto("/?intro=1&introCheckpoint=1");
  await waitForBrandIntroTimeline(page);
  const centers = await page.evaluate(() => {
    (
      window as typeof window & {
        __wfBrandIntroTimeline: { pause: (at: number) => void };
      }
    ).__wfBrandIntroTimeline.pause(4.84);
    const symbol = document.querySelector<SVGSVGElement>("[data-intro-symbol]")!;
    const pivot = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-pivot]"),
    ).find((candidate) => candidate.getBoundingClientRect().width > 0)!;
    const from = symbol.getBoundingClientRect();
    const to = pivot.getBoundingClientRect();
    return {
      symbol: { x: from.left + from.width / 2, y: from.top + from.height / 2 },
      target: { x: to.left + to.width / 2, y: to.top + to.height / 2 },
    };
  });

  expect(Math.abs(centers.symbol.x - centers.target.x)).toBeLessThan(8);
  expect(Math.abs(centers.symbol.y - centers.target.y)).toBeLessThan(8);
});
