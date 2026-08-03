import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript({ content: axe.source });
});

async function findRelevantViolations(page: Page): Promise<RelevantViolation[]> {
  return page.evaluate(async () => {
    const axeWindow = window as typeof window & {
      axe: typeof import("axe-core");
    };
    const results = await axeWindow.axe.run(document, {
      resultTypes: ["violations", "incomplete"],
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
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
  });
}

for (const state of [
  { colorScheme: "light" as const, height: 1024, width: 1536 },
  { colorScheme: "dark" as const, height: 844, width: 390 },
] as const) {
  test(`brand opening passes axe (${state.colorScheme})`, async ({ page }) => {
    await page.setViewportSize({ height: state.height, width: state.width });
    await page.emulateMedia({ colorScheme: state.colorScheme });
    await page.addInitScript((selectedTheme) => {
      window.localStorage.setItem("wf-theme", selectedTheme);
    }, state.colorScheme);
    await page.goto("/?intro=1&introCheckpoint=1");
    const overlay = page.locator("[data-brand-intro]");
    await expect(overlay).toHaveAttribute("data-brand-intro", "playing");
    await page.waitForFunction(
      () =>
        Boolean(
          (window as typeof window & { __wfBrandIntroTimeline?: unknown })
            .__wfBrandIntroTimeline,
        ),
    );
    await page.evaluate(() => {
      (
        window as typeof window & {
          __wfBrandIntroTimeline: { pause: (at: number) => void };
        }
      ).__wfBrandIntroTimeline.pause(3.3);
    });

    await expect(page.getByRole("img", { name: "W_Flyer" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Pular introdução" }),
    ).toBeVisible();
    expect(await findRelevantViolations(page)).toEqual([]);
  });
}
