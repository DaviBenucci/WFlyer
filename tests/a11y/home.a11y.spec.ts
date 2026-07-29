import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function findRelevantViolations(page: Page): Promise<RelevantViolation[]> {
  await page.addScriptTag({ content: axe.source });

  return page.evaluate(async () => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(document, {
      resultTypes: ["violations"],
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

    return results.violations
      .filter(({ impact }) => impact === "critical" || impact === "serious")
      .map(({ help, id, impact, nodes }) => ({
        help,
        id,
        impact: impact ?? null,
        targets: nodes.map(({ target }) => JSON.stringify(target)),
      }));
  });
}

test("a Home não apresenta violações axe críticas ou sérias", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible();

  expect(await findRelevantViolations(page)).toEqual([]);
});
