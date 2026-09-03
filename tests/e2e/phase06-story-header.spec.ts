import { expect, test, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";
const BOOTSTRAP_ROOT = "[data-story-bootstrap]";
const MOTION_ROOT = "main[data-motion-lab]";
const STORY_HEADER = "header[data-story-v2-header]";

const HEADER_TARGETS = [
  ["application-overview", "#aplicacao", "Aplicação", '[data-application-scene="overview"]'],
  ["application-how-it-works", "#como-funciona", "Como funciona", '[data-application-scene="how-it-works"]'],
  ["application-benefits", "#beneficios", "Benefícios", '[data-application-scene="benefits"]'],
  ["application-access", "#lancamento", "Lançamento", '[data-application-scene="access"]'],
  ["home", "#home", "W_Flyer", '[data-structural-placeholder="home"]'],
  ["professional-about", "#sobre", "Sobre", '[data-professional-scene="about"]'],
  ["professional-services", "#servicos", "Serviços", '[data-professional-scene="services"]'],
  ["professional-process", "#processo", "Processo", '[data-professional-scene="process"]'],
  ["professional-projects", "#projetos", "Projetos", '[data-professional-scene="projects"]'],
  ["professional-contact", "#contato", "Contato", '[data-professional-scene="contact"]'],
] as const;

async function openMotionLab(page: Page) {
  const response = await page.goto(MOTION_PATH, {
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
      throw new Error("The story motion controller is unavailable.");
    }
    return controller.snapshot();
  });
}

async function positionImmediately(page: Page, chapterId: string) {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (controller === undefined) throw new Error("Missing motion controller.");
    await controller.position(
      requestedChapterId as Parameters<typeof controller.position>[0],
    );
  }, chapterId);
}

async function waitForTraversalCompletion(
  page: Page,
  chapterId: string,
) {
  await expect
    .poll(async () => {
      const snapshot = await motionSnapshot(page);
      return {
        activeChapterId: snapshot.activeChapterId,
        ownedTraversalCount: snapshot.ownedTraversalCount,
        status: snapshot.lastTraversalStatus,
      };
    }, { timeout: 5_000 })
    .toEqual({
      activeChapterId: chapterId,
      ownedTraversalCount: 0,
      status: "completed",
    });
}

test.describe("Phase-6 story header traversal", () => {
  test.skip(productionServer, "Development-only Phase-6 review surface");

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
  });

  test("uses only canonical targets and traverses from Home in both directions", async ({
    page,
  }) => {
    await openMotionLab(page);
    const header = page.locator(STORY_HEADER);
    const links = header.locator("[data-story-navigation-target]");
    const initialHistoryLength = await page.evaluate(() => history.length);

    expect(
      await links.evaluateAll((elements) =>
        elements.map((element) => [
          element.getAttribute("data-story-navigation-target"),
          element.getAttribute("href"),
        ]),
      ),
    ).toEqual(HEADER_TARGETS.map(([chapterId, hash]) => [chapterId, hash]));
    await expect(
      header.locator('[data-story-navigation-target="home"]'),
    ).toHaveAttribute("aria-current", "location");
    const homeLink = header.locator('[data-story-navigation-target="home"]');
    await homeLink.click();
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-traversal-state",
      "no-op",
    );
    expect(await page.evaluate(() => history.length)).toBe(initialHistoryLength);
    expect(
      await page.evaluate(async () => {
        try {
          await window.__WFLYER_PHASE5_MOTION__?.navigate(
            "application-demo",
          );
          return "resolved";
        } catch (error) {
          return error instanceof Error ? error.message : String(error);
        }
      }),
    ).toContain("not an approved header target");

    const aboutLink = header.locator(
      '[data-story-navigation-target="professional-about"]',
    );
    await aboutLink.focus();
    await page.keyboard.press("Enter");
    await waitForTraversalCompletion(page, "professional-about");
    await expect(aboutLink).toBeFocused();
    await expect(aboutLink).toHaveAttribute("aria-current", "location");
    await expect(page).toHaveURL(/#sobre$/u);

    await homeLink.click();
    await waitForTraversalCompletion(page, "home");
    const home = await motionSnapshot(page);
    if (home.homeProgress === null) {
      throw new Error("Enhanced Home geometry is unavailable.");
    }
    expect(home.progress).toBeCloseTo(home.homeProgress, 6);
    expect(home.homeProgress).not.toBeCloseTo(0.5, 3);

    const applicationLink = header.locator(
      '[data-story-navigation-target="application-overview"]',
    );
    await applicationLink.click();
    await waitForTraversalCompletion(page, "application-overview");
    await expect(page).toHaveURL(/#aplicacao$/u);

    const result = await page.evaluate(() => ({
      chapterId: window.history.state?.__wflyerStoryV2?.chapterId,
      historyLength: window.history.length,
    }));
    expect(result).toEqual({
      chapterId: "application-overview",
      historyLength: initialHistoryLength + 3,
    });
  });

  test("proves the exact ten-item order, tab sequence, click target, active scene, aria-current, and hash", async ({
    page,
  }) => {
    test.setTimeout(55_000);
    await openMotionLab(page);
    const header = page.locator(STORY_HEADER);
    const links = header.locator("[data-story-navigation-target]");

    await expect(links).toHaveCount(HEADER_TARGETS.length);
    expect(
      await links.evaluateAll((elements) =>
        elements.map((element) => ({
          chapterId: element.getAttribute("data-story-navigation-target"),
          hash: element.getAttribute("href"),
          label: element.textContent?.trim(),
        })),
      ),
    ).toEqual(
      HEADER_TARGETS.map(([chapterId, hash, label]) => ({
        chapterId,
        hash,
        label,
      })),
    );

    await links.first().focus();
    for (let index = 0; index < HEADER_TARGETS.length; index += 1) {
      await expect(links.nth(index)).toBeFocused();
      if (index < HEADER_TARGETS.length - 1) await page.keyboard.press("Tab");
    }

    for (const [chapterId, hash, , sceneSelector] of HEADER_TARGETS) {
      const sourceChapterId =
        chapterId === "application-overview"
          ? "home"
          : "application-overview";
      await positionImmediately(page, sourceChapterId);

      const link = header.locator(
        `[data-story-navigation-target="${chapterId}"]`,
      );
      await link.click();
      await waitForTraversalCompletion(page, chapterId);

      await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
        "data-motion-active-chapter",
        chapterId,
      );
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(
        page.locator(`[data-chapter-id="${chapterId}"]`).locator(sceneSelector),
      ).toBeVisible();
      expect(await page.evaluate(() => location.hash)).toBe(hash);
    }
  });

  test("uses the minimum-bound formula for a nearby canonical target", async ({
    page,
  }) => {
    await openMotionLab(page);
    await positionImmediately(page, "application-overview");
    await page
      .locator(
        `${STORY_HEADER} [data-story-navigation-target="application-how-it-works"]`,
      )
      .click();
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(1);
    const adjacent = await motionSnapshot(page);

    expect(adjacent.lastTraversalDistance).toBeGreaterThan(0);
    expect(adjacent.lastTraversalDurationSeconds).toBeCloseTo(
      0.65 + 2.35 * (adjacent.lastTraversalDistance ?? 0),
      5,
    );
    expect(adjacent.lastTraversalDurationSeconds).toBeGreaterThanOrEqual(0.65);
    expect(adjacent.lastTraversalDurationSeconds).toBeLessThan(3);
    await waitForTraversalCompletion(page, "application-how-it-works");
  });

  test("uses proportional bounded duration and crosses non-header intermediate chapters", async ({
    page,
  }) => {
    await openMotionLab(page);
    await positionImmediately(page, "application-benefits");
    const sourceProgress = (await motionSnapshot(page)).progress;
    await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>("main[data-motion-lab]");
      const visited = new Set<string>();
      if (root === null) throw new Error("Missing Motion Lab root.");
      const record = () => {
        if (root.dataset.motionActiveChapter) {
          visited.add(root.dataset.motionActiveChapter);
        }
      };
      record();
      const observer = new MutationObserver(record);
      observer.observe(root, {
        attributeFilter: ["data-motion-active-chapter"],
        attributes: true,
      });
      Object.assign(window, {
        __WFLYER_PHASE6_VISITED__: visited,
        __WFLYER_PHASE6_VISITED_OBSERVER__: observer,
      });
    });

    await page
      .locator(
        `${STORY_HEADER} [data-story-navigation-target="professional-contact"]`,
      )
      .click();
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(1);
    const running = await motionSnapshot(page);

    expect(running.lastTraversalDistance).not.toBeNull();
    expect(running.lastTraversalDurationSeconds).toBeCloseTo(
      0.65 + 2.35 * (running.lastTraversalDistance ?? 0),
      5,
    );
    expect(running.lastTraversalDurationSeconds).toBeGreaterThanOrEqual(0.65);
    expect(running.lastTraversalDurationSeconds).toBeLessThanOrEqual(3);
    await waitForTraversalCompletion(page, "professional-contact");
    const completed = await motionSnapshot(page);
    const overviewProgress = completed.labelProgress["app-overview"];
    const processProgress = completed.labelProgress["pro-process"];
    const homeProgress = completed.homeProgress;

    expect(overviewProgress).toBeDefined();
    expect(processProgress).toBeDefined();
    expect(homeProgress).not.toBeNull();
    expect(sourceProgress).toBeLessThan(overviewProgress ?? 0);
    expect(overviewProgress ?? 1).toBeLessThan(homeProgress ?? 0);
    expect(completed.progress).toBeGreaterThan(overviewProgress ?? 1);
    expect(sourceProgress).toBeLessThan(homeProgress ?? 0);
    expect(completed.progress).toBeGreaterThan(homeProgress ?? 1);
    expect(sourceProgress).toBeLessThan(processProgress ?? 0);
    expect(completed.progress).toBeGreaterThan(processProgress ?? 1);

    const visited = await page.evaluate(() => {
      const instrumentedWindow = window as typeof window & {
        __WFLYER_PHASE6_VISITED__?: Set<string>;
        __WFLYER_PHASE6_VISITED_OBSERVER__?: MutationObserver;
      };
      instrumentedWindow.__WFLYER_PHASE6_VISITED_OBSERVER__?.disconnect();
      return [...(instrumentedWindow.__WFLYER_PHASE6_VISITED__ ?? [])];
    });
    expect(visited).toEqual(
      expect.arrayContaining([
        "professional-process",
        "professional-projects",
        "professional-contact",
      ]),
    );
    expect(visited.length).toBeGreaterThanOrEqual(6);
  });

  test("replaces passive semantic history without appending entries", async ({
    page,
  }) => {
    await openMotionLab(page);
    const initialHistoryLength = await page.evaluate(() => history.length);
    const initialScroll = await page.evaluate(() => scrollY);

    await page.evaluate((start) => {
      window.scrollTo({ behavior: "auto", top: start + 1_800 });
    }, initialScroll);
    await expect
      .poll(async () => {
        const snapshot = await motionSnapshot(page);
        return page.evaluate(({ activeChapterId, expectedHistoryLength }) => {
          const historyChapterId =
            window.history.state?.__wflyerStoryV2?.chapterId ?? null;
          return (
            activeChapterId !== "home" &&
            historyChapterId === activeChapterId &&
            window.history.length === expectedHistoryLength
          );
        }, {
          activeChapterId: snapshot.activeChapterId,
          expectedHistoryLength: initialHistoryLength,
        });
      })
      .toBe(true);
    const passiveChapter = (await motionSnapshot(page)).activeChapterId;
    const expectedHash =
      passiveChapter === "professional-about"
        ? "#sobre"
        : passiveChapter === "professional-services"
          ? "#servicos"
          : null;
    expect(expectedHash).not.toBeNull();
    expect(await page.evaluate(() => location.hash)).toBe(expectedHash);
  });

  test("cancels without snap or push and supersedes from the current native position", async ({
    page,
  }) => {
    await openMotionLab(page);
    const initialHistoryLength = await page.evaluate(() => history.length);
    const contact = page.locator(
      `${STORY_HEADER} [data-story-navigation-target="professional-contact"]`,
    );

    await contact.click();
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(1);
    await page.waitForTimeout(120);
    await page.mouse.wheel(0, 420);
    await expect
      .poll(async () => (await motionSnapshot(page)).lastTraversalStatus)
      .toBe("cancelled");
    const cancelled = await motionSnapshot(page);

    expect(cancelled.lastCancelledTraversalReason).toBe("wheel");
    expect(cancelled.ownedTraversalCount).toBe(0);
    expect(await page.evaluate(() => history.length)).toBe(initialHistoryLength);
    // Firefox and WebKit apply the native wheel delta after dispatching the
    // cancellation event. Measure after that user-owned delta, then verify the
    // killed traversal cannot resume or correct toward its former target.
    await page.waitForTimeout(200);
    const userOwnedProgress = (await motionSnapshot(page)).progress;
    await page.waitForTimeout(800);
    expect((await motionSnapshot(page)).progress).toBeCloseTo(
      userOwnedProgress,
      2,
    );
    expect(
      await page.evaluate(() => {
        const event = new WheelEvent("wheel", { cancelable: true });
        window.dispatchEvent(event);
        return event.defaultPrevented;
      }),
    ).toBe(false);

    await contact.click();
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(1);
    const supersedingTarget = page.locator(
      `${STORY_HEADER} [data-story-navigation-target="application-how-it-works"]`,
    );
    await supersedingTarget.click();
    await waitForTraversalCompletion(page, "application-how-it-works");
    const superseded = await motionSnapshot(page);

    expect(superseded.lastCancelledTraversalReason).toBe("superseded");
    expect(superseded.traversalCancelCount).toBeGreaterThanOrEqual(2);
    expect(await page.evaluate(() => history.length)).toBe(
      initialHistoryLength + 1,
    );
  });

  test("gives keyboard, Escape, touch, and pointer intent immediate ownership", async ({
    page,
  }) => {
    await openMotionLab(page);

    for (const input of [
      { reason: "keyboard", type: "keyboard" },
      { reason: "escape", type: "escape" },
      { reason: "touch", type: "touch" },
      { reason: "pointer", type: "pointer" },
      { reason: "hidden-document", type: "hidden" },
    ] as const) {
      await positionImmediately(page, "home");
      const baselineCancelCount = (await motionSnapshot(page))
        .traversalCancelCount;
      await page.evaluate(() => {
        void window.__WFLYER_PHASE5_MOTION__?.navigate(
          "professional-contact",
        );
      });
      await expect
        .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
        .toBe(1);

      if (input.type === "keyboard") {
        await page.keyboard.press("PageDown");
      } else if (input.type === "escape") {
        await page.keyboard.press("Escape");
      } else if (input.type === "touch") {
        await page.evaluate(() => {
          window.dispatchEvent(
            new Event("touchstart", { bubbles: true, cancelable: true }),
          );
        });
      } else if (input.type === "pointer") {
        await page.locator(MOTION_ROOT).dispatchEvent("pointerdown", {
          bubbles: true,
          pointerType: "mouse",
        });
      } else {
        await page.evaluate(() => {
          Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "hidden",
          });
          document.dispatchEvent(new Event("visibilitychange"));
          Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "visible",
          });
          document.dispatchEvent(new Event("visibilitychange"));
        });
      }

      await expect
        .poll(async () => (await motionSnapshot(page)).traversalCancelCount)
        .toBe(baselineCancelCount + 1);
      const snapshot = await motionSnapshot(page);
      expect(snapshot.lastCancelledTraversalReason).toBe(input.reason);
      expect(snapshot.ownedTraversalCount).toBe(0);
    }
  });

  test("cancels owned traversal on projection rebuild and teardown", async ({
    page,
  }) => {
    await openMotionLab(page);
    await page.evaluate(() => {
      void window.__WFLYER_PHASE5_MOTION__?.navigate("professional-contact");
    });
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(1);
    await page.evaluate(() => {
      void window.__WFLYER_PHASE5_MOTION__?.rebuild();
    });
    await expect
      .poll(async () => (await motionSnapshot(page)).lastCancelledTraversalReason)
      .toBe("projection-rebuild");
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedTraversalCount)
      .toBe(0);
    await expect
      .poll(async () => (await motionSnapshot(page)).ownedScrollTriggerCount)
      .toBe(1);

    const destroyed = await page.evaluate(async () => {
      const controller = window.__WFLYER_PHASE5_MOTION__;
      if (controller === undefined) throw new Error("Missing motion controller.");
      void controller.navigate("application-benefits");
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const snapshot = controller.destroyForReplacement();
      return {
        rootScrollBehavior:
          document.documentElement.style.getPropertyValue("scroll-behavior"),
        snapshot,
      };
    });

    expect(destroyed.snapshot.destroyed).toBe(true);
    expect(destroyed.snapshot.lastCancelledTraversalReason).toBe("teardown");
    expect(destroyed.snapshot.ownedTraversalCount).toBe(0);
    expect(destroyed.snapshot.ownedScrollTriggerCount).toBe(0);
    expect(destroyed.rootScrollBehavior).toBe("");
  });

  test("restores Back/Forward without duplicate history and remains functional in fallback modes", async ({
    page,
  }) => {
    await openMotionLab(page);
    const header = page.locator(STORY_HEADER);
    const initialHistoryLength = await page.evaluate(() => history.length);

    await header
      .locator('[data-story-navigation-target="professional-about"]')
      .click();
    await waitForTraversalCompletion(page, "professional-about");
    await header
      .locator('[data-story-navigation-target="professional-services"]')
      .click();
    await waitForTraversalCompletion(page, "professional-services");
    expect(await page.evaluate(() => history.length)).toBe(
      initialHistoryLength + 2,
    );

    await page.goBack();
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("professional-about");
    await expect(page).toHaveURL(/#sobre$/u);
    await page.goForward();
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("professional-services");
    await expect(page).toHaveURL(/#servicos$/u);
    expect(await page.evaluate(() => history.length)).toBe(
      initialHistoryLength + 2,
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "static",
    );
    await header
      .locator('[data-story-navigation-target="application-benefits"]')
      .click();
    await expect
      .poll(async () => (await motionSnapshot(page)).activeChapterId)
      .toBe("application-benefits");
    const reduced = await motionSnapshot(page);
    expect(reduced.lastTraversalDurationSeconds).toBe(0);
    expect(reduced.ownedTraversalCount).toBe(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ height: 844, width: 390 });
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-compact",
    );
    await header
      .locator('[data-story-navigation-target="professional-about"]')
      .click();
    await waitForTraversalCompletion(page, "professional-about");
    const compact = await motionSnapshot(page);
    expect(compact.lastTraversalDurationSeconds).toBeGreaterThanOrEqual(0.65);
    expect(compact.ownedScrollTriggerCount).toBe(0);
  });
});
