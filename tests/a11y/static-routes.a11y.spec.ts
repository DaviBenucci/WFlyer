import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

const internalRoutes = [
  "/aplicacao-wflyer",
  "/aplicacao-wflyer/como-funciona",
  "/aplicacao-wflyer/beneficios",
  "/sobre",
  "/servicos",
  "/processo",
  "/portfolio",
  "/contato",
  "/servicos/criacao-de-sites",
  "/servicos/criacao-de-aplicacoes",
  "/servicos/integracoes",
  "/servicos/solucoes-sob-medida",
  "/portfolio/w-flyer",
  "/portfolio/msn-distribuidora",
  "/portfolio/msn-suprimentos",
  "/politica-de-privacidade",
  "/politica-de-cookies",
  "/termos-de-uso",
  "/acessibilidade",
] as const;

const accessibilityStates = [
  { colorScheme: "light", height: 1024, name: "desktop claro", width: 1536 },
  { colorScheme: "dark", height: 1024, name: "desktop escuro", width: 1536 },
  { colorScheme: "light", height: 844, name: "mobile claro", width: 390 },
  { colorScheme: "dark", height: 844, name: "mobile escuro", width: 390 },
] as const;

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

for (const route of internalRoutes) {
  test(`${route} passa axe nos quatro estados normativos`, async ({
    page,
  }) => {
    test.setTimeout(120_000);

    for (const state of accessibilityStates) {
      await page.setViewportSize({
        height: state.height,
        width: state.width,
      });
      await page.emulateMedia({ colorScheme: state.colorScheme });
      await page.goto(route);
      await page.evaluate((theme) => {
        window.localStorage.setItem("wf-theme", theme);
      }, state.colorScheme);
      await page.reload();

      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        state.colorScheme,
      );
      await expect(page.getByRole("main")).toBeVisible();
      expect(
        await findRelevantViolations(page),
        `${route} — ${state.name}`,
      ).toEqual([]);
    }
  });
}
