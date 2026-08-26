import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";

interface RelevantFinding {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function relevantFindings(page: Page): Promise<RelevantFinding[]> {
  return page.evaluate(async () => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(document, {
      resultTypes: ["violations", "incomplete"],
      runOnly: {
        type: "tag",
        values: [
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
          "wcag22aa",
        ],
      },
    });

    return [
      ...results.violations,
      ...results.incomplete.filter(({ id }) => id === "aria-hidden-focus"),
    ]
      .filter(({ impact }) => impact === "critical" || impact === "serious")
      .map(({ help, id, impact, nodes }) => ({
        help,
        id,
        impact: impact ?? null,
        targets: nodes.map(({ target }) => JSON.stringify(target)),
      }));
  });
}

test.describe("Phase-5 Motion Lab accessibility", () => {
  test.skip(productionServer, "Development-only Phase-5 review surface");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: axe.source });
  });

  test("passes at the enhanced desktop Home origin", async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
    await page.goto(MOTION_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    await expect(page.locator("main[data-motion-lab]")).toHaveAttribute(
      "data-projection-mode",
      "horizontal-enhanced",
    );

    expect(await relevantFindings(page)).toEqual([]);
  });

  test("passes for reduced motion and compact deep-link fallback", async ({
    page,
  }) => {
    for (const state of [
      {
        colorScheme: "dark" as const,
        height: 900,
        reducedMotion: "reduce" as const,
        width: 1536,
      },
      {
        colorScheme: "light" as const,
        height: 844,
        reducedMotion: "no-preference" as const,
        width: 390,
      },
    ]) {
      await page.goto("about:blank");
      await page.setViewportSize({ height: state.height, width: state.width });
      await page.emulateMedia({
        colorScheme: state.colorScheme,
        reducedMotion: state.reducedMotion,
      });
      await page.goto(`${MOTION_PATH}#beneficios`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
        "data-bootstrap-state",
        "REVEALED",
        { timeout: 10_000 },
      );
      await expect(page.locator("main[data-motion-lab]")).toHaveAttribute(
        "data-motion-active-chapter",
        "application-benefits",
      );

      expect(await relevantFindings(page), JSON.stringify(state)).toEqual([]);
    }
  });
});
