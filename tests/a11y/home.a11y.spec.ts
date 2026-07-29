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

for (const theme of ["light", "dark"] as const) {
  test(`a Home não apresenta violações axe críticas ou sérias (${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("main")).toBeVisible();

    expect(await findRelevantViolations(page)).toEqual([]);
  });
}

test("o menu mobile aberto não apresenta violações axe críticas ou sérias", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();

  await expect(
    page.getByRole("dialog", { name: "Navegação W_Flyer" }),
  ).toBeVisible();
  expect(await findRelevantViolations(page)).toEqual([]);
});
