import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

import {
  chapterControl,
  holdAt,
  overlay,
  releaseTransition,
  visibleHeaderLink,
  waitForCheckpoint,
  waitForSettledTransition,
  warmRoute,
} from "../helpers/transition";

test.describe.configure({ mode: "serial" });

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

const operableCompletion = ["success", "recovered"] as const;

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

test("the decorative transition layer is inert, hidden from AT, and never focusable", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.goto("/aplicacao-wflyer");
  await warmRoute(page, "/sobre");
  await holdAt(page, "midpoint");
  await visibleHeaderLink(page, "/sobre").click();
  await waitForCheckpoint(page, "midpoint");

  const transitionLayer = overlay(page);
  await expect(transitionLayer).toHaveAttribute("aria-hidden", "true");
  await expect(transitionLayer).toHaveAttribute("inert", "");
  await expect(transitionLayer).toHaveCSS("pointer-events", "none");
  await expect(transitionLayer.locator("svg")).toHaveAttribute(
    "focusable",
    "false",
  );
  await expect(
    transitionLayer.locator(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).toHaveCount(0);
  await expect(
    transitionLayer.locator("[data-transition-segment]"),
  ).toHaveCount(2);
  await expect(
    transitionLayer.locator("[data-transition-note]"),
  ).toHaveCount(6);

  await page.keyboard.press("Tab");
  expect(
    await transitionLayer.evaluate((layer) => layer.contains(document.activeElement)),
  ).toBe(false);

  await releaseTransition(page);
  await waitForSettledTransition(page, "/sobre", operableCompletion);
  await expect(page.getByRole("main")).toBeFocused();
});

test("keyboard navigation exposes the destination title through one framework announcer", async ({
  page,
}) => {
  await page.goto("/sobre");
  await warmRoute(page, "/servicos");
  const nextChapter = chapterControl(page, "next");
  await nextChapter.focus();

  await page.keyboard.press("Enter");
  await waitForSettledTransition(
    page,
    "/servicos",
    operableCompletion,
  );

  await expect(page.getByRole("main")).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const destinationTitle = await page.title();
  await expect(page.locator("next-route-announcer")).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const host = document.querySelector("next-route-announcer");
        return (
          host?.shadowRoot
            ?.querySelector("#__next-route-announcer__")
            ?.textContent?.trim() ?? ""
        );
      }),
    )
    .toBe(destinationTitle);
  await expect(page.locator('body > [aria-live="assertive"]')).toHaveCount(0);
});

const normativeStates = [
  {
    colorScheme: "light" as const,
    height: 1024,
    name: "desktop light",
    reducedMotion: "no-preference" as const,
    width: 1536,
  },
  {
    colorScheme: "dark" as const,
    height: 1024,
    name: "desktop dark",
    reducedMotion: "no-preference" as const,
    width: 1536,
  },
  {
    colorScheme: "light" as const,
    height: 844,
    name: "mobile light",
    reducedMotion: "no-preference" as const,
    width: 390,
  },
  {
    colorScheme: "dark" as const,
    height: 1024,
    name: "reduced-motion dark",
    reducedMotion: "reduce" as const,
    width: 1536,
  },
] as const;

for (const state of normativeStates) {
  test(`a completed transition passes axe in ${state.name}`, async ({ page }) => {
    await page.setViewportSize({ height: state.height, width: state.width });
    await page.emulateMedia({
      colorScheme: state.colorScheme,
      reducedMotion: state.reducedMotion,
    });
    await page.addInitScript((theme) => {
      window.localStorage.setItem("wf-theme", theme);
    }, state.colorScheme);
    await page.goto("/sobre");
    await warmRoute(page, "/servicos");

    await chapterControl(page, "next").click();
    await waitForSettledTransition(
      page,
      "/servicos",
      operableCompletion,
    );

    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      state.colorScheme,
    );
    expect(await findRelevantViolations(page), state.name).toEqual([]);
  });
}

for (const terminal of [
  {
    name: "Benefits",
    route: "/aplicacao-wflyer/beneficios",
  },
  { name: "Contact", route: "/contato" },
] as const) {
  test(`${terminal.name} keeps previous, Home, and theme controls keyboard reachable`, async ({
    page,
  }) => {
    await page.goto(terminal.route);

    await expect(chapterControl(page, "previous")).toBeVisible();
    await expect(
      page.locator('[data-home-pivot="desktop"]:visible'),
    ).toBeVisible();
    await expect(
      page.locator('button[aria-label="Tema escuro"]:visible'),
    ).toBeVisible();

    await chapterControl(page, "previous").focus();
    await expect(chapterControl(page, "previous")).toBeFocused();
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => document.activeElement?.tagName),
    ).not.toBe("svg");
  });
}
