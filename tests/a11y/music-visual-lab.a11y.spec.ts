import { expect, test, type Locator, type Page } from "@playwright/test";
import axe from "axe-core";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const LAB_ROUTES = [
  { fixturePage: "index", path: "/__visual-lab/music" },
  { fixturePage: "glyphs", path: "/__visual-lab/music/glyphs" },
  {
    fixturePage: "calibration",
    path: "/__visual-lab/music/calibration",
  },
  { fixturePage: "pitches", path: "/__visual-lab/music/pitches" },
  { fixturePage: "beams", path: "/__visual-lab/music/beams" },
  {
    fixturePage: "key-signatures",
    path: "/__visual-lab/music/key-signatures",
  },
  {
    fixturePage: "curved-score",
    path: "/__visual-lab/music/curved-score",
  },
  { fixturePage: "composer", path: "/__visual-lab/music/composer" },
] as const;

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

async function openDevelopmentFixture(
  page: Page,
  path: string,
  fixturePage: string,
) {
  const response = await page.goto(path);

  expect(response?.ok(), path).toBe(true);
  await expect(
    page.locator(`[data-fixture-page="${fixturePage}"]`),
  ).toBeVisible();
}

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

async function tabUntilFocused(page: Page, target: Locator) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    await page.keyboard.press("Tab");

    if (await target.evaluate((element) => element === document.activeElement)) {
      return;
    }
  }

  throw new Error("Keyboard focus did not reach the requested control");
}

test.describe("development Music Visual Lab accessibility", () => {
  test.skip(productionServer, "Development harness accessibility evidence only");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: axe.source });
  });

  for (const route of LAB_ROUTES) {
    test(`${route.path} has no critical or serious axe findings`, async ({
      page,
    }) => {
      test.setTimeout(120_000);

      await openDevelopmentFixture(page, route.path, route.fixturePage);
      expect(await findRelevantViolations(page)).toEqual([]);
    });
  }

  test("calibration and composer controls have ordinary accessible labels", async ({
    page,
  }) => {
    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/calibration",
      "calibration",
    );

    const calibrationWorkbench = page.locator(
      '[data-fixture-component="calibration-workbench"]',
    );
    const glyphSelect = calibrationWorkbench.locator("select").first();
    const metricRanges = calibrationWorkbench.locator('input[type="range"]');

    await expect(glyphSelect).toBeVisible();
    await expect(glyphSelect).toHaveAccessibleName(/^Glyph/u);
    await expect(metricRanges.nth(0)).toHaveAccessibleName(
      /^nominalWidthSp:/u,
    );
    await expect(metricRanges.nth(1)).toHaveAccessibleName(
      /^nominalHeightSp:/u,
    );
    await expect(page.getByRole("button", { name: "Download draft JSON" })).toBeVisible();
    await expect(page.getByLabel("Draft calibration JSON")).toBeVisible();

    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
    );

    for (const [control, label] of [
      ["seed", "Explicit session seed"],
      ["chapter", "Stable chapter ID"],
      ["profile", "Profile fixture"],
      ["theme", "Theme context"],
      ["viewport", "Geometry viewport"],
      ["debug", "Debug overlay"],
    ] as const) {
      const input = page.locator(`[data-composer-control="${control}"]`);

      await expect(input).toBeVisible();
      await expect(input).toHaveAccessibleName(new RegExp(`^${label}`, "u"));
    }
  });

  test("composer controls follow their DOM order under keyboard navigation", async ({
    page,
  }) => {
    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
    );

    const controls = ["seed", "chapter", "profile", "theme", "viewport", "debug"].map(
      (control) =>
        page.locator(`[data-composer-control="${control}"]`),
    );

    await tabUntilFocused(page, controls[0]!);
    await expect(controls[0]!).toBeFocused();

    for (const control of controls.slice(1)) {
      await page.keyboard.press("Tab");
      await expect(control).toBeFocused();
    }
  });

  test("score fixtures and debug overlays cannot enter the focus order", async ({
    page,
  }) => {
    const scoreSvgSource = readFileSync(
      join(process.cwd(), "src/components/score/ScoreSvg.tsx"),
      "utf8",
    );

    expect(scoreSvgSource).toContain('{ "aria-hidden": true, role: "presentation" }');
    expect(scoreSvgSource).toContain('focusable="false"');

    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
    );

    const interactiveComposer = page.locator('[data-composer-performance]');
    const scores = interactiveComposer.locator("svg[data-score-model]");
    await expect(scores).toHaveCount(4);
    expect(
      await scores.evaluateAll((elements) =>
        elements.every(
          (element) =>
            element.getAttribute("focusable") === "false" &&
            element.getAttribute("aria-hidden") === "true" &&
            element.getAttribute("role") === "presentation" &&
            !element.contains(document.activeElement),
        ),
      ),
    ).toBe(true);
    await expect(
      scores.locator(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).toHaveCount(0);
    expect(
      await page
        .locator(
          '[data-composer-performance] [data-score-debug-overlay="true"]',
        )
        .evaluateAll((elements) =>
          elements.every(
            (element) => element.getAttribute("aria-hidden") === "true",
          ),
        ),
    ).toBe(true);
  });

  test("forced-colors keeps the development controls visible and focusable", async ({
    browserName,
    page,
  }) => {
    test.skip(browserName !== "chromium", "Forced-colors evidence uses Chromium");

    await page.emulateMedia({ forcedColors: "active" });
    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
    );

    expect(
      await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
    ).toBe(true);

    const seed = page.locator('[data-composer-control="seed"]');
    await seed.focus();
    await expect(seed).toBeFocused();

    const focusPresentation = await seed.evaluate((input) => {
      const style = getComputedStyle(input);

      return {
        borderStyle: style.borderStyle,
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
      };
    });

    expect(focusPresentation.borderStyle).toBe("solid");
    expect(focusPresentation.outlineStyle).not.toBe("none");
    expect(focusPresentation.outlineWidth).toBeGreaterThanOrEqual(3);
    expect(await findRelevantViolations(page)).toEqual([]);
  });

  test("mobile dark reduced-motion composer remains accessible", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 844, width: 390 });
    await page.emulateMedia({
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await openDevelopmentFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
    );
    // Firefox resets page-level color-scheme emulation across navigation,
    // while WebKit needs the initial preference for complete style inheritance.
    // Reapply the documented override and verify rendered CSS below as well as
    // matchMedia state.
    await page.emulateMedia({
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await page
      .locator('[data-composer-control="theme"]')
      .selectOption("dark");
    await page
      .locator('[data-composer-control="viewport"]')
      .selectOption("vertical-compact");

    expect(
      await page.evaluate(() => ({
        dark: matchMedia("(prefers-color-scheme: dark)").matches,
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      })),
    ).toEqual({ dark: true, reduced: true });
    await expect(page.locator('[data-music-visual-lab="development-only"]')).toHaveCSS(
      "background-color",
      "rgb(16, 13, 22)",
    );
    await expect(
      page.locator('[data-composer-profile][data-theme="dark"]'),
    ).toHaveCount(4);
    await expect(
      page.locator('[data-viewport="vertical-compact"]'),
    ).toHaveCount(4);
    await expect(
      page.locator('pre[data-composer-semantics="CALM"] > code'),
    ).toHaveCSS("color", "rgb(246, 240, 255)");
    expect(await findRelevantViolations(page)).toEqual([]);
  });
});
