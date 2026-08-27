import { expect, test, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const MOTION_PATH = "/__visual-lab/story/motion";
const BOOTSTRAP_ROOT = "[data-story-bootstrap]";
const MOTION_ROOT = "main[data-motion-lab]";

async function openMotionLab(page: Page, suffix = "") {
  const response = await page.goto(`${MOTION_PATH}${suffix}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);
  await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-lifecycle",
    "mounted",
  );
}

async function motionSnapshot(page: Page) {
  return page.evaluate(() => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (controller === undefined) {
      throw new Error("The Phase-5 Motion Lab controller is unavailable.");
    }
    return controller.snapshot();
  });
}

test("the Phase-5 Motion Lab remains development-only", async ({
  page,
  request,
}) => {
  const response = await page.goto(MOTION_PATH, {
    waitUntil: "domcontentloaded",
  });

  if (!productionServer) {
    expect(response?.ok()).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/u,
    );
    return;
  }

  expect(response?.status()).toBe(404);
  await expect(page.locator(MOTION_ROOT)).toHaveCount(0);
  expect(await page.locator("body").innerText()).not.toContain(
    "Desktop Motion Lab",
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("__visual-lab");
});

test.describe("Phase-5 native-scroll master story", () => {
  test.skip(productionServer, "Development-only Phase-5 review surface");

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
  });

  test("maps direct Home under the cover from measured asymmetric geometry", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const observation = {
        activeChapterId: "unobserved",
        progress: Number.NaN,
        scrollY: Number.NaN,
      };
      Object.defineProperty(window, "__WFLYER_PHASE5_COVER_RELEASE__", {
        configurable: true,
        value: observation,
        writable: true,
      });

      const installObserver = () => {
        const observer = new MutationObserver(() => {
          const hadBootstrap = document.querySelector("[data-story-bootstrap]");
          const cover = document.querySelector("[data-bootstrap-cover]");
          if (hadBootstrap === null || cover !== null) return;
          const snapshot = window.__WFLYER_PHASE5_MOTION__?.snapshot();
          observation.activeChapterId = snapshot?.activeChapterId ?? "missing";
          observation.progress = snapshot?.progress ?? Number.NaN;
          observation.scrollY = window.scrollY;
          observer.disconnect();
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      };

      if (document.documentElement !== null) installObserver();
      else document.addEventListener("DOMContentLoaded", installObserver, { once: true });
    });

    await openMotionLab(page);
    const result = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>("main[data-motion-lab]");
      const stage = root?.querySelector<HTMLElement>("[data-motion-stage]");
      const track = root?.querySelector<HTMLElement>("[data-motion-track]");
      const home = root?.querySelector<HTMLElement>('[data-chapter-id="home"]');
      const snapshot = window.__WFLYER_PHASE5_MOTION__?.snapshot();
      const observation = (
        window as typeof window & {
          __WFLYER_PHASE5_COVER_RELEASE__?: {
            activeChapterId: string;
            progress: number;
            scrollY: number;
          };
        }
      ).__WFLYER_PHASE5_COVER_RELEASE__;

      if (!stage || !track || !home || !snapshot || !observation) {
        throw new Error("Motion Lab geometry is incomplete.");
      }
      const travel = track.scrollWidth - stage.clientWidth;
      const derivedHome =
        Math.min(
          travel,
          Math.max(0, home.offsetLeft + home.offsetWidth / 2 - stage.clientWidth / 2),
        ) / travel;

      return {
        derivedHome,
        observation,
        renderCount: root?.dataset.motionLabRenderCount,
        snapshot,
      };
    });

    expect(result.snapshot.projectionMode).toBe("horizontal-enhanced");
    expect(result.snapshot.activeChapterId).toBe("home");
    expect(result.snapshot.homeProgress).toBeCloseTo(result.derivedHome, 6);
    expect(result.snapshot.homeProgress).not.toBeCloseTo(0.5, 3);
    expect(result.observation.activeChapterId).toBe("home");
    expect(result.observation.progress).toBeCloseTo(result.derivedHome, 5);
    expect(result.observation.scrollY).toBeGreaterThan(1_000);
    expect(result.renderCount).toBeDefined();
  });

  test("uses native scroll for both branches, exact labels, and keyboard extremes without React frame renders", async ({
    page,
  }) => {
    await openMotionLab(page);
    const baseline = await page.locator(MOTION_ROOT).getAttribute(
      "data-motion-lab-render-count",
    );
    const expectedLabels = [
      "app-terminal",
      "app-access",
      "app-demo",
      "app-benefits",
      "app-how",
      "app-overview",
      "home",
      "pro-about",
      "pro-services",
      "pro-process",
      "pro-projects",
      "pro-contact",
      "pro-terminal",
    ];

    expect((await motionSnapshot(page)).labelOrder).toEqual(expectedLabels);
    await page.locator(MOTION_ROOT).focus();
    await page.keyboard.press("Home");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeLessThan(0.001);
    expect((await motionSnapshot(page)).activeChapterId).toBe(
      "application-terminal",
    );

    await page.keyboard.press("End");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeGreaterThan(0.999);
    expect((await motionSnapshot(page)).activeChapterId).toBe(
      "professional-terminal",
    );

    await page.evaluate(async () => {
      await window.__WFLYER_PHASE5_MOTION__?.position("home");
    });
    const homeProgress = (await motionSnapshot(page)).progress;
    await page.keyboard.press("PageDown");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeGreaterThan(homeProgress);
    const afterPageDown = (await motionSnapshot(page)).progress;
    await page.keyboard.press("PageUp");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeLessThan(afterPageDown);

    await page.evaluate(async () => {
      await window.__WFLYER_PHASE5_MOTION__?.position("home");
    });
    const beforeSpace = (await motionSnapshot(page)).progress;
    await page.keyboard.press("Space");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeGreaterThan(beforeSpace);
    const afterSpace = (await motionSnapshot(page)).progress;
    await page.keyboard.press("Shift+Space");
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeLessThan(afterSpace);

    await page.evaluate(async () => {
      await window.__WFLYER_PHASE5_MOTION__?.position("home");
    });
    await page.waitForTimeout(150);
    const wheelStart = (await motionSnapshot(page)).progress;
    await page.mouse.move(1_000, 700);
    await page.mouse.wheel(0, 900);
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeGreaterThan(wheelStart);

    const wheelWasCancelled = await page.evaluate(() => {
      const event = new WheelEvent("wheel", { cancelable: true, deltaY: 1 });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(wheelWasCancelled).toBe(false);
    expect(
      await page.locator(MOTION_ROOT).getAttribute(
        "data-motion-lab-render-count",
      ),
    ).toBe(baseline);
    expect((await motionSnapshot(page)).ownedScrollTriggerCount).toBe(1);
  });

  test("allows a literal headed native-scrollbar drag without React frame renders", async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium" ||
        process.env.WFLYER_PHASE5_HEADED_INTERACTION !== "1",
      "Runs once in headed Chromium where the native scrollbar gutter exists.",
    );

    await openMotionLab(page);
    await page.evaluate(async () => {
      await window.__WFLYER_PHASE5_MOTION__?.position("home");
    });
    const renderCount = await page
      .locator(MOTION_ROOT)
      .getAttribute("data-motion-lab-render-count");
    const before = await motionSnapshot(page);
    const scrollbar = await page.evaluate(() => {
      const documentHeight = document.documentElement.scrollHeight;
      const maximumScroll = documentHeight - window.innerHeight;
      const thumbHeight = Math.max(
        30,
        (window.innerHeight * window.innerHeight) / documentHeight,
      );

      return {
        gutterWidth:
          window.innerWidth - document.documentElement.clientWidth,
        thumbCenter:
          (window.scrollY / maximumScroll) *
            (window.innerHeight - thumbHeight) +
          thumbHeight / 2,
        x: window.innerWidth - 2,
      };
    });

    expect(scrollbar.gutterWidth).toBeGreaterThan(0);
    await page.mouse.move(scrollbar.x, scrollbar.thumbCenter);
    await page.mouse.down();
    await page.mouse.move(
      scrollbar.x,
      Math.min(850, scrollbar.thumbCenter + 250),
      { steps: 15 },
    );
    await page.mouse.up();
    await expect
      .poll(async () => (await motionSnapshot(page)).progress)
      .toBeGreaterThan(before.progress + 0.05);
    expect(
      await page
        .locator(MOTION_ROOT)
        .getAttribute("data-motion-lab-render-count"),
    ).toBe(renderCount);
  });

  test("positions both branch deep links and retains Phase-4 Back/Forward semantics", async ({
    page,
  }) => {
    await openMotionLab(page, "#beneficios");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("application-benefits");
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-source",
      "explicit-hash",
    );

    await page.evaluate(() => {
      document.querySelector<HTMLAnchorElement>('header a[href="#projetos"]')?.click();
    });
    await expect
      .poll(async () => {
        const snapshot = await motionSnapshot(page);
        return {
          activeChapterId: snapshot.activeChapterId,
          traversalStatus: snapshot.lastTraversalStatus,
        };
      })
      .toEqual({
        activeChapterId: "professional-projects",
        traversalStatus: "completed",
      });
    expect(new URL(page.url()).hash).toBe("#projetos");

    await page.goBack();
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("application-benefits");
    expect(new URL(page.url()).hash).toBe("#beneficios");

    await page.goForward();
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("professional-projects");
  });

  test("preserves the active semantic chapter across capacity and orientation rebuilds", async ({
    page,
  }) => {
    await openMotionLab(page, "#beneficios");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("application-benefits");

    await page.setViewportSize({ height: 900, width: 700 });
    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("vertical-compact");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId, {
        timeout: 5_000,
      })
      .toBe("application-benefits");
    expect((await motionSnapshot(page)).ownedScrollTriggerCount).toBe(0);

    await page.setViewportSize({ height: 1536, width: 900 });
    await page.evaluate(() => {
      window.dispatchEvent(new Event("orientationchange"));
    });
    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("vertical-wide");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId, {
        timeout: 5_000,
      })
      .toBe("application-benefits");

    await page.setViewportSize({ height: 900, width: 1536 });
    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("horizontal-enhanced");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId, {
        timeout: 5_000,
      })
      .toBe("application-benefits");
    const rebuilt = await motionSnapshot(page);
    expect(rebuilt.activeChapterId).toBe("application-benefits");
    expect(rebuilt.ownedScrollTriggerCount).toBe(1);
    expect(rebuilt.rebuildCount).toBeGreaterThanOrEqual(3);
    expect(rebuilt.scrollTriggerDestroyCount).toBe(
      rebuilt.timelineDestroyCount,
    );
    expect(rebuilt.scrollTriggerDestroyCount).toBeGreaterThan(0);
  });

  test("falls back at a 200% effective visual viewport and restores the chapter", async ({
    browserName,
    context,
    page,
  }) => {
    await openMotionLab(page, "#projetos");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("professional-projects");

    if (browserName === "chromium") {
      const session = await context.newCDPSession(page);
      await session.send("Emulation.setPageScaleFactor", {
        pageScaleFactor: 2,
      });
    } else {
      // Half the CSS viewport is the deterministic layout-capacity equivalent
      // of 200% desktop zoom for engines without a page-scale protocol hook.
      await page.setViewportSize({ height: 450, width: 768 });
    }

    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("vertical-wide");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId, {
        timeout: 5_000,
      })
      .toBe("professional-projects");
    expect((await motionSnapshot(page)).ownedScrollTriggerCount).toBe(0);

    if (browserName === "chromium") {
      const session = await context.newCDPSession(page);
      await session.send("Emulation.setPageScaleFactor", {
        pageScaleFactor: 1,
      });
    } else {
      await page.setViewportSize({ height: 900, width: 1536 });
    }

    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("horizontal-enhanced");
    expect((await motionSnapshot(page)).activeChapterId).toBe(
      "professional-projects",
    );
  });

  test("keeps reduced, compact, and driver-failure paths vertical and usable", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openMotionLab(page, "#projetos");
    let snapshot = await motionSnapshot(page);
    expect(snapshot.projectionMode).toBe("static");
    expect(snapshot.activeChapterId).toBe("professional-projects");
    expect(snapshot.ownedScrollTriggerCount).toBe(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("horizontal-enhanced");
    expect((await motionSnapshot(page)).activeChapterId).toBe(
      "professional-projects",
    );

    await page.setViewportSize({ height: 844, width: 390 });
    await page.goto(`${MOTION_PATH}#beneficios`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    await expect
      .poll(async () => (await motionSnapshot(page)).projectionMode, {
        timeout: 5_000,
      })
      .toBe("vertical-compact");
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId, {
        timeout: 5_000,
      })
      .toBe("application-benefits");
    snapshot = await motionSnapshot(page);
    expect(snapshot.projectionMode).toBe("vertical-compact");
    expect(snapshot.activeChapterId).toBe("application-benefits");
    expect(snapshot.ownedScrollTriggerCount).toBe(0);
    expect(
      await page.locator(`${MOTION_ROOT} [data-chapter-id]`).evaluateAll(
        (chapters) => chapters.map((chapter) => chapter.getAttribute("data-chapter-id")),
      ),
    ).toEqual([
      "home",
      "professional-about",
      "professional-services",
      "professional-process",
      "professional-projects",
      "professional-contact",
      "professional-terminal",
      "application-overview",
      "application-how-it-works",
      "application-benefits",
      "application-demo",
      "application-access",
      "application-terminal",
    ]);
    expect(
      await page.evaluate(() => {
        const event = new Event("touchmove", { bubbles: true, cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
      }),
    ).toBe(false);

    await page.setViewportSize({ height: 900, width: 1536 });
    await page.goto(`${MOTION_PATH}?scenario=motion-failure`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    snapshot = await motionSnapshot(page);
    expect(snapshot.projectionMode).toBe("vertical-wide");
    expect(snapshot.projectionReason).toBe("driver-failure");
    expect(snapshot.ownedScrollTriggerCount).toBe(0);
    await expect(page.locator('[data-chapter-id="home"]')).toBeInViewport();
  });

  test("survives visibility changes and performs exact-once remount cleanup", async ({
    page,
  }) => {
    await openMotionLab(page);
    const before = await motionSnapshot(page);
    expect(before.ownedScrollTriggerCount).toBe(1);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    let hidden = await motionSnapshot(page);
    expect(hidden.visibility).toBe("hidden");
    expect(hidden.ownedScrollTriggerCount).toBe(1);
    expect(hidden.ownedTimelineCount).toBe(1);

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "visible",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    hidden = await motionSnapshot(page);
    expect(hidden.visibility).toBe("visible");
    expect(hidden.ownedScrollTriggerCount).toBe(1);

    await page.evaluate(() => {
      window.__WFLYER_PHASE5_MOTION__?.remountForReview();
    });
    await expect
      .poll(async () => (await motionSnapshot(page)).mountCount)
      .toBeGreaterThan(before.mountCount);
    await page.waitForTimeout(250);
    const replaced = await motionSnapshot(page);
    const remountCount = replaced.mountCount - before.mountCount;
    expect(replaced.destroyed).toBe(false);
    expect(remountCount).toBeGreaterThanOrEqual(1);
    // Development Strict Mode may replay the new effect. Every additional
    // mount still has one matching destroy and one cleanup before settling.
    expect(replaced.destroyCount - before.destroyCount).toBe(remountCount);
    expect(replaced.totalCleanupCount - before.totalCleanupCount).toBe(
      remountCount,
    );
    expect(replaced.scrollTriggerDestroyCount).toBe(
      before.scrollTriggerDestroyCount + remountCount,
    );
    expect(replaced.timelineDestroyCount).toBe(
      before.timelineDestroyCount + remountCount,
    );
    expect(replaced.ownedScrollTriggerCount).toBe(1);
    expect(replaced.ownedTimelineCount).toBe(1);

    const destroyed = await page.evaluate(() => {
      const controller = window.__WFLYER_PHASE5_MOTION__;
      if (controller === undefined) {
        throw new Error("The replacement controller is unavailable.");
      }
      const once = controller.destroyForReplacement();
      const twice = controller.destroyForReplacement();
      return {
        controllerReleased: window.__WFLYER_PHASE5_MOTION__ === undefined,
        once,
        twice,
      };
    });
    expect(destroyed.controllerReleased).toBe(true);
    expect(destroyed.once.destroyed).toBe(true);
    expect(destroyed.once.ownedScrollTriggerCount).toBe(0);
    expect(destroyed.once.ownedTimelineCount).toBe(0);
    expect(destroyed.once.cleanupCount).toBe(1);
    expect(destroyed.twice.cleanupCount).toBe(1);
    expect(destroyed.twice.destroyCount).toBe(destroyed.once.destroyCount);
    expect(destroyed.twice.scrollTriggerDestroyCount).toBe(
      destroyed.once.scrollTriggerDestroyCount,
    );
    expect(destroyed.twice.timelineDestroyCount).toBe(
      destroyed.once.timelineDestroyCount,
    );
  });
});
