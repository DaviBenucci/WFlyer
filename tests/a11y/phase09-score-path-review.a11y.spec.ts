import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const PREVIEW_ROUTE = "/__visual-lab/story/score-paths/preview";
const ORIGIN_ROUTE = "/__visual-lab/story/score-paths/origin";

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function findRelevantViolations(
  page: Page,
  rootSelector = "main[data-phase-9-task-33-review]",
): Promise<RelevantViolation[]> {
  return page.evaluate(async (selector) => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(
      selector,
      {
        resultTypes: ["violations", "incomplete"],
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      },
    );
    const relevantIncomplete = results.incomplete.filter(
      ({ id }) => id === "aria-hidden-focus",
    );

    return [...results.violations, ...relevantIncomplete]
      .filter(({ impact }) => impact === "critical" || impact === "serious")
      .map(({ help, id, impact, nodes }) => ({
        help,
        id,
        impact: impact ?? null,
        targets: nodes.map(({ target }) => JSON.stringify(target)),
      }));
  }, rootSelector);
}

test.describe("Phase-9 task-33 review accessibility", () => {
  test.skip(productionServer, "Development-only task-33 review surface");

  for (const state of [
    {
      candidate: "organic-soft",
      colorScheme: "light" as const,
      mode: "vertical-wide",
      reducedMotion: "no-preference" as const,
      viewport: { height: 820, width: 1340 },
    },
    {
      candidate: "organic-flowing",
      colorScheme: "dark" as const,
      mode: "vertical-compact",
      reducedMotion: "reduce" as const,
      viewport: { height: 844, width: 430 },
    },
  ] as const) {
    test(`${state.candidate} · ${state.mode} · ${state.colorScheme}`, async ({
      page,
    }) => {
      await page.addInitScript({ content: axe.source });
      await page.setViewportSize(state.viewport);
      await page.emulateMedia({
        colorScheme: state.colorScheme,
        reducedMotion: state.reducedMotion,
      });

      const query = new URLSearchParams({
        candidate: state.candidate,
        mode: state.mode,
        theme: state.colorScheme,
      });
      const response = await page.goto(`${PREVIEW_ROUTE}?${query}`, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.locator("main[data-phase-9-task-33-review]"),
      ).toBeVisible();
      expect(await findRelevantViolations(page)).toEqual([]);
    });
  }

  for (const state of [
    {
      colorScheme: "light" as const,
      mode: "horizontal-enhanced",
      reducedMotion: "no-preference" as const,
      viewport: { height: 900, width: 1440 },
    },
    {
      colorScheme: "dark" as const,
      mode: "vertical-compact",
      reducedMotion: "reduce" as const,
      viewport: { height: 844, width: 390 },
    },
  ] as const) {
    test(`origin · ${state.mode} · ${state.colorScheme}`, async ({ page }) => {
      await page.addInitScript({ content: axe.source });
      await page.setViewportSize(state.viewport);
      await page.emulateMedia({
        colorScheme: state.colorScheme,
        reducedMotion: state.reducedMotion,
      });
      const query = new URLSearchParams({
        mode: state.mode,
        theme: state.colorScheme,
      });
      const response = await page.goto(`${ORIGIN_ROUTE}?${query}`, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.ok()).toBe(true);
      await expect(
        page.locator("main[data-phase-9-task-33-origin-review]"),
      ).toBeVisible();
      expect(
        await findRelevantViolations(
          page,
          "main[data-phase-9-task-33-origin-review]",
        ),
      ).toEqual([]);
    });
  }
});
