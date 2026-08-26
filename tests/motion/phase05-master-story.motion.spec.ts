import { expect, test } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";

test.describe("Phase-5 master-story motion budget", () => {
  test.skip(productionServer, "Development-only Phase-5 motion surface");

  test("keeps native partial progress imperative and free of material layout shift", async ({
    browserName,
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
    await page.goto(MOTION_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    const root = page.locator("main[data-motion-lab]");
    const renderCount = await root.getAttribute("data-motion-lab-render-count");

    const metrics = await page.evaluate(async () => {
      const longTasks: number[] = [];
      const layoutShifts: number[] = [];
      const frameDurations: number[] = [];
      let partialProgressObserved = false;
      const supported = PerformanceObserver.supportedEntryTypes;
      const observers: PerformanceObserver[] = [];
      const stage = document.querySelector<HTMLElement>("[data-motion-stage]");
      const track = document.querySelector<HTMLElement>("[data-motion-track]");
      if (stage === null || track === null) {
        throw new Error("Motion story geometry is unavailable.");
      }
      const geometryBefore = {
        stageHeight: stage.offsetHeight,
        stageWidth: stage.offsetWidth,
        trackHeight: track.offsetHeight,
        trackWidth: track.scrollWidth,
      };

      if (supported.includes("longtask")) {
        const observer = new PerformanceObserver((list) => {
          longTasks.push(...list.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ["longtask"] });
        observers.push(observer);
      }
      if (supported.includes("layout-shift")) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              hadRecentInput: boolean;
              value: number;
            };
            if (!shift.hadRecentInput) layoutShifts.push(shift.value);
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });
        observers.push(observer);
      }

      const maximumScroll = document.documentElement.scrollHeight - innerHeight;
      let previous = performance.now();
      for (let step = 1; step <= 72; step += 1) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame((timestamp) => {
            frameDurations.push(timestamp - previous);
            previous = timestamp;
            scrollTo(0, (maximumScroll * step) / 72);
            const progress = Number(
              document
                .querySelector<HTMLElement>("main[data-motion-lab]")
                ?.dataset.motionProgress,
            );
            if (progress > 0.05 && progress < 0.95) {
              partialProgressObserved = true;
            }
            resolve();
          });
        });
      }
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      for (const observer of observers) observer.disconnect();

      const sortedFrames = frameDurations.slice(3).sort((left, right) => left - right);
      const percentileIndex = Math.min(
        sortedFrames.length - 1,
        Math.floor(sortedFrames.length * 0.95),
      );
      const snapshot = window.__WFLYER_PHASE5_MOTION__?.snapshot();
      const geometryAfter = {
        stageHeight: stage.offsetHeight,
        stageWidth: stage.offsetWidth,
        trackHeight: track.offsetHeight,
        trackWidth: track.scrollWidth,
      };

      return {
        cumulativeLayoutShift: layoutShifts.reduce((sum, value) => sum + value, 0),
        geometryAfter,
        geometryBefore,
        longTaskMaximum: Math.max(0, ...longTasks),
        mediaCount: document.querySelectorAll("video, audio").length,
        partialProgressObserved:
          partialProgressObserved && snapshot !== undefined,
        percentile95Frame: sortedFrames[percentileIndex] ?? 0,
        supported,
      };
    });

    expect(metrics.partialProgressObserved).toBe(true);
    expect(metrics.mediaCount).toBe(0);
    expect(metrics.geometryAfter).toEqual(metrics.geometryBefore);
    if (metrics.supported.includes("longtask")) {
      expect(metrics.longTaskMaximum).toBeLessThan(50);
    }
    // Headless WebKit's video-backed runner is scheduler-throttled in this
    // environment; geometry/render invariants remain deterministic there.
    if (browserName !== "webkit") {
      expect(metrics.percentile95Frame).toBeLessThan(34);
    } else {
      test.info().annotations.push({
        description: `Headless WebKit rAF p95: ${metrics.percentile95Frame.toFixed(2)} ms.`,
        type: "performance-observation",
      });
    }
    expect(await root.getAttribute("data-motion-lab-render-count")).toBe(
      renderCount,
    );
  });
});
