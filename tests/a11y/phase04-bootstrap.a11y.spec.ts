import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const BOOTSTRAP_PATH = "/__visual-lab/story/bootstrap";
const ROOT = "[data-story-bootstrap]";
const COVER = "[data-bootstrap-cover]";
const SKIP = "[data-bootstrap-skip]";

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

async function expectNoRelevantFindings(page: Page, label: string) {
  expect(await relevantFindings(page), label).toEqual([]);
}

test.describe("Phase-4 bootstrap accessibility", () => {
  test.skip(productionServer, "Development-only Phase-4 accessibility surface");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: axe.source });
  });

  test("keeps the active cover non-modal with only the explicit skip control operable", async ({
    page,
  }) => {
    await page.goto(`${BOOTSTRAP_PATH}?scenario=slow-critical`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );
    await expect(page.locator(COVER)).toBeVisible();
    await expect(page.locator(SKIP)).toBeVisible();
    await expect(page.locator(SKIP)).toHaveAccessibleName("Pular introdução");

    const operableControls = await page.evaluate(() => {
      const selector = [
        "a[href]",
        "button:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        "textarea:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(",");

      return [...document.querySelectorAll<HTMLElement>(selector)]
        .filter((element) => {
          if (element.closest("[inert]")) return false;
          if (element.closest('[aria-hidden="true"]')) return false;
          const style = getComputedStyle(element);
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            element.getClientRects().length > 0
          );
        })
        .map((element) =>
          element.hasAttribute("data-bootstrap-skip")
            ? "bootstrap-skip"
            : `${element.tagName.toLowerCase()}:${element.textContent?.trim()}`,
        );
    });
    expect(operableControls).toEqual(["bootstrap-skip"]);

    await page.locator(SKIP).focus();
    await page.keyboard.press("Escape");
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      /^(?:DEGRADED|REVEALED)$/u,
      { timeout: 3_000 },
    );
    await expect(page.locator("main#main-content")).toBeFocused();
    await expectNoRelevantFindings(page, "after keyboard skip");
  });

  test("passes axe after a valid deep-link reveal in desktop light and mobile dark", async ({
    page,
  }) => {
    test.setTimeout(45_000);

    for (const state of [
      { colorScheme: "light" as const, height: 1024, name: "desktop light", width: 1536 },
      { colorScheme: "dark" as const, height: 844, name: "mobile dark", width: 390 },
    ]) {
      await page.goto("about:blank");
      await page.setViewportSize({ height: state.height, width: state.width });
      await page.emulateMedia({
        colorScheme: state.colorScheme,
        reducedMotion: "no-preference",
      });
      await page.goto(`${BOOTSTRAP_PATH}#projetos`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator(ROOT)).toHaveAttribute(
        "data-bootstrap-state",
        "REVEALED",
        { timeout: 7_000 },
      );
      await expect(page.locator(ROOT)).toHaveAttribute(
        "data-bootstrap-destination",
        "professional-projects",
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      await expectNoRelevantFindings(page, state.name);
    }
  });

  test("preserves the destination, mounted chapters, and axe result for reduced motion", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 800, width: 320 });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto(`${BOOTSTRAP_PATH}#beneficios`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 3_000 },
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "application-benefits",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-reduced-motion",
      "true",
    );
    await expect(page.locator("main#main-content [data-chapter-id]")).toHaveCount(
      13,
    );
    await expectNoRelevantFindings(page, "reduced motion");
  });

  test("releases every interaction lock in degraded mode", async ({ page }) => {
    await page.goto(`${BOOTSTRAP_PATH}?scenario=projection-failure#contato`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "DEGRADED",
      { timeout: 3_000 },
    );
    await expect(page.locator(COVER)).toHaveCount(0);
    await expect(page.locator('header a[href="#home"]')).toBeEnabled();
    await expect(page.locator("main#main-content")).not.toHaveAttribute("inert");
    await expect(page.locator("main#main-content")).not.toHaveAttribute(
      "aria-hidden",
    );
    await expectNoRelevantFindings(page, "degraded projection");
  });
});
