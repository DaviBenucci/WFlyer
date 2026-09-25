import { expect, test } from "@playwright/test";

const motionLab = "/__visual-lab/story/motion";

test("1366 desktop fallback keeps the score clear of primary reading areas", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(motionLab, { waitUntil: "domcontentloaded" });

  const root = page.locator("main[data-motion-lab]:not([inert])");
  await expect(root).toHaveAttribute("data-motion-lifecycle", "mounted", {
    timeout: 30_000,
  });
  await expect(root).toHaveAttribute(
    "data-motion-projects-capacity",
    "INSUFFICIENT_CAPACITY",
    { timeout: 40_000 },
  );
  await expect(root).toHaveAttribute("data-projection-mode", "vertical-wide");
  await expect(root).toHaveAttribute("data-story-presentation", "COMPACT_LANDSCAPE");
  await expect(root).toHaveAttribute(
    "data-motion-projects-capacity-reasons",
    "projects-protected-clearance-or-clip",
  );
  await expect(page.locator("[data-story-score-layer]")).toHaveAttribute(
    "data-score-projection",
    "vertical-wide",
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });

  const layout = await page.evaluate(() => {
    const score = document.querySelector<SVGSVGElement>(
      '[data-integrated-score="professional"]',
    );
    const matrix = score?.getScreenCTM();
    if (!score || !matrix) throw new Error("Settled score is unavailable");
    const lines = score.querySelectorAll<SVGPolylineElement>(
      '[data-score-role="staff-line"]',
    );
    const events = score.querySelectorAll<SVGGraphicsElement>(
      '[data-score-role]:not([data-score-role="staff-line"])',
    );
    const readingAreas = ["about", "process", "contact"].map((chapter) => {
      const scene = document.querySelector<HTMLElement>(
        `[data-professional-scene="${chapter}"]`,
      );
      const introduction = scene?.querySelector<HTMLElement>(
        '[data-score-content-exclusion="heading-and-body"]',
      );
      if (!scene || !introduction) throw new Error(`Missing ${chapter} scene`);
      const reading = introduction.getBoundingClientRect();
      const protectedLeft = reading.left - 12;
      const protectedRight = reading.right + 12;
      const protectedTop = reading.top - 12;
      const protectedBottom = reading.bottom + 12;
      let staffSegmentsInside = 0;
      let eventInkInside = 0;

      for (const line of lines) {
        for (let index = 1; index < line.points.numberOfItems; index += 1) {
          const a = line.points.getItem(index - 1).matrixTransform(matrix);
          const b = line.points.getItem(index).matrixTransform(matrix);
          if (
            Math.max(a.x, b.x) >= protectedLeft &&
            Math.min(a.x, b.x) <= protectedRight &&
            Math.max(a.y, b.y) >= protectedTop &&
            Math.min(a.y, b.y) <= protectedBottom
          ) {
            staffSegmentsInside += 1;
          }
        }
      }

      for (const event of events) {
        const ink = event.getBoundingClientRect();
        if (
          ink.right >= protectedLeft &&
          ink.left <= protectedRight &&
          ink.bottom >= protectedTop &&
          ink.top <= protectedBottom
        ) {
          eventInkInside += 1;
        }
      }

      return {
        chapter,
        eventInkInside,
        readingLeft: reading.left,
        sceneLeft: scene.getBoundingClientRect().left,
        staffSegmentsInside,
      };
    });

    return {
      areas: readingAreas,
      eventCount: events.length,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      scale: window.visualViewport?.scale ?? 1,
      staffLineCount: lines.length,
    };
  });

  expect(layout.scale).toBe(1);
  expect(layout.horizontalOverflow).toBe(false);
  expect(layout.staffLineCount).toBeGreaterThan(0);
  expect(layout.eventCount).toBeGreaterThan(0);
  for (const area of layout.areas) {
    expect(area.readingLeft).toBeGreaterThanOrEqual(area.sceneLeft);
    expect(area.staffSegmentsInside, area.chapter).toBe(0);
    expect(area.eventInkInside, area.chapter).toBe(0);
  }
});

test("horizontal, wide touch and compact controls retain their presentation", async ({
  browser,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Focused controls run once in Chromium");
  test.setTimeout(90_000);

  for (const state of [
    {
      width: 1536,
      height: 900,
      touch: false,
      mode: "horizontal-enhanced",
      presentation: "EXPANDED_LANDSCAPE",
    },
    {
      width: 900,
      height: 1024,
      touch: true,
      mode: "vertical-wide",
      presentation: "PORTRAIT_TRAVERSE",
    },
    {
      width: 390,
      height: 844,
      touch: true,
      mode: "vertical-compact",
      presentation: "PORTRAIT_TRAVERSE",
    },
  ] as const) {
    const page = await browser.newPage({
      hasTouch: state.touch,
      viewport: { width: state.width, height: state.height },
    });
    try {
      await page.goto(motionLab, { waitUntil: "domcontentloaded" });
      const root = page.locator("main[data-motion-lab]:not([inert])");
      await expect(root).toHaveAttribute("data-motion-lifecycle", "mounted", {
        timeout: 30_000,
      });
      await expect(root).toHaveAttribute(
        "data-projection-mode",
        state.mode,
        { timeout: 40_000 },
      );
      await expect(root).toHaveAttribute(
        "data-story-presentation",
        state.presentation,
      );
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        ),
      ).toBe(false);
    } finally {
      await page.close();
    }
  }
});
