import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";
const MOTION_ROOT = "main[data-motion-lab]";

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

async function openMotionLab(page: Page) {
  await page.goto(MOTION_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
}

test.describe("Phase-6 story header accessibility", () => {
  test.skip(productionServer, "Development-only Phase-6 review surface");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: axe.source });
  });

  test("keeps keyboard focus and current-target semantics after traversal", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
    await openMotionLab(page);
    const projects = page.locator(
      '[data-story-navigation-target="professional-projects"]',
    );

    await projects.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "professional-projects",
      { timeout: 5_000 },
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-traversal-state",
      "completed",
    );
    await expect(projects).toBeFocused();
    await expect(projects).toHaveAttribute("aria-current", "location");
    await expect(
      page.locator('[data-story-navigation-target][aria-current="location"]'),
    ).toHaveCount(1);
    expect(await relevantFindings(page)).toEqual([]);
  });

  test("keeps reduced-motion navigation immediate, focused, and operable", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openMotionLab(page);
    const benefits = page.locator(
      '[data-story-navigation-target="application-benefits"]',
    );

    await benefits.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "static",
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "application-benefits",
    );
    await expect(benefits).toBeFocused();
    expect(
      await page.locator(MOTION_ROOT).getAttribute(
        "data-motion-traversal-duration",
      ),
    ).toBe("0.000000");
    expect(await relevantFindings(page)).toEqual([]);
  });
});
