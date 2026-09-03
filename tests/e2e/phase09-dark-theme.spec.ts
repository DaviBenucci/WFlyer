import { expect, test, type Page } from "@playwright/test";

import { mockTurnstile } from "../helpers/turnstile";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const DARK_THEME_TOKENS = Object.freeze({
  "--wf-accent": "#e79271",
  "--wf-bg": "#12100f",
  "--wf-danger": "#d45c5c",
  "--wf-emphasis": "#e79271",
  "--wf-glow-soft": "none",
  "--wf-note": "#f4ecdf",
  "--wf-primary": "#e79271",
  "--wf-score-accent": "#e79271",
  "--wf-score-muted": "#c1b9ad",
  "--wf-score-primary": "#f4ecdf",
  "--wf-staff": "#c1b9ad",
  "--wf-success": "#3f9e63",
  "--wf-text": "#f4ecdf",
  "--wf-text-muted": "#c1b9ad",
} as const);

const STORY_SCENE_CONTROLS = [
  "[data-project-card-link]:visible",
  '[data-contact-form] input:not([type="checkbox"]):not([name="website"]):visible',
  "[data-contact-form] select:visible",
  "[data-contact-form] textarea:visible",
  "[data-contact-form] button:visible",
  '[data-primary-app-access="true"]:visible',
].join(", ");

type ThemeName = "dark" | "light";

interface ReviewScenario {
  readonly developmentOnly?: boolean;
  readonly expectedProjection?:
    | "horizontal-enhanced"
    | "vertical-compact"
    | "vertical-wide";
  readonly label: string;
  readonly reducedMotion?: boolean;
  readonly rootSelector: string;
  readonly route: string;
  readonly theme: ThemeName;
  readonly touchTargetSelector: string;
  readonly viewport: {
    readonly height: number;
    readonly width: number;
  };
}

const REVIEW_SCENARIOS: readonly ReviewScenario[] = [
  {
    developmentOnly: true,
    expectedProjection: "horizontal-enhanced",
    label: "Motion Lab enhanced desktop dark",
    rootSelector: "main[data-motion-lab]",
    route: "/__visual-lab/story/motion",
    theme: "dark",
    touchTargetSelector: STORY_SCENE_CONTROLS,
    viewport: { height: 900, width: 1440 },
  },
  {
    developmentOnly: true,
    expectedProjection: "vertical-wide",
    label: "Organic Flowing vertical-wide dark",
    rootSelector: "main[data-phase-9-task-33-review]",
    route:
      "/__visual-lab/story/score-paths/preview?candidate=organic-flowing&mode=vertical-wide&theme=dark",
    theme: "dark",
    touchTargetSelector: STORY_SCENE_CONTROLS,
    viewport: { height: 820, width: 1340 },
  },
  {
    developmentOnly: true,
    expectedProjection: "vertical-compact",
    label: "Organic Flowing compact dark reduced motion",
    reducedMotion: true,
    rootSelector: "main[data-phase-9-task-33-review]",
    route:
      "/__visual-lab/story/score-paths/preview?candidate=organic-flowing&mode=vertical-compact&theme=dark",
    theme: "dark",
    touchTargetSelector: STORY_SCENE_CONTROLS,
    viewport: { height: 844, width: 390 },
  },
  {
    label: "Portfolio mobile dark",
    rootSelector: 'main[data-chapter="portfolio"]',
    route: "/portfolio",
    theme: "dark",
    touchTargetSelector: 'button[aria-label="Tema escuro"]:visible',
    viewport: { height: 844, width: 390 },
  },
  {
    label: "Contact tablet dark",
    rootSelector: 'main[data-chapter="contact"]',
    route: "/contato",
    theme: "dark",
    touchTargetSelector: [
      '[data-contact-form] input:not([type="checkbox"]):not([name="website"]):visible',
      "[data-contact-form] select:visible",
      "[data-contact-form] textarea:visible",
      "[data-contact-form] button:visible",
    ].join(", "),
    viewport: { height: 1024, width: 768 },
  },
  {
    developmentOnly: true,
    expectedProjection: "horizontal-enhanced",
    label: "Origin horizontal dark",
    rootSelector: "main[data-phase-9-task-33-origin-review]",
    route:
      "/__visual-lab/story/score-paths/origin?mode=horizontal-enhanced&theme=dark",
    theme: "dark",
    touchTargetSelector: 'nav[aria-label="Origin review variants"] a:visible',
    viewport: { height: 900, width: 1440 },
  },
  {
    label: "Portfolio desktop light regression",
    rootSelector: 'main[data-chapter="portfolio"]',
    route: "/portfolio",
    theme: "light",
    touchTargetSelector: 'button[aria-label="Tema escuro"]:visible',
    viewport: { height: 1024, width: 1536 },
  },
] as const;

async function setStoredTheme(page: Page, theme: ThemeName) {
  await page.addInitScript((storedTheme) => {
    window.localStorage.setItem("wf-theme", storedTheme);
  }, theme);
}

async function settleLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function storyThemeInheritance(page: Page) {
  const surfaces = [
    ["html", "html"],
    ["body", "body"],
    ["header", "header[data-story-v2-header]"],
    ["review", "main[data-phase-9-task-33-review]"],
    ["score", "[data-review-score]"],
    ["professional", "[data-professional-scene]"],
    ["projects", "[data-project-card-link]"],
    ["contact", "[data-contact-form]"],
    ["application", "[data-application-scene]"],
    ["app04", "[data-app04-deterministic-fallback]"],
    ["professional-terminal", '[data-professional-scene="terminal"]'],
    ["application-terminal", '[data-application-scene="terminal"]'],
  ] as const;
  const tokenNames = [
    "--wf-bg",
    "--wf-surface",
    "--wf-text",
    "--wf-text-muted",
    "--wf-emphasis",
  ] as const;

  return page.evaluate(
    ({ selectors, tokens }) =>
      Object.fromEntries(
        selectors.map(([name, selector]) => {
          const element = document.querySelector<HTMLElement>(selector);

          if (element === null) {
            throw new Error(`Missing theme surface: ${name} (${selector})`);
          }

          const style = getComputedStyle(element);

          return [
            name,
            {
              colorScheme: style.colorScheme,
              tokens: Object.fromEntries(
                tokens.map((token) => [
                  token,
                  style.getPropertyValue(token).trim(),
                ]),
              ),
            },
          ];
        }),
      ),
    { selectors: surfaces, tokens: tokenNames },
  );
}

async function expectMinimumTouchTargets(page: Page, selector: string) {
  const dimensions = await page.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const rectangle = element.getBoundingClientRect();
      return {
        height: rectangle.height,
        width: rectangle.width,
      };
    }),
  );

  expect(dimensions.length).toBeGreaterThan(0);
  for (const dimension of dimensions) {
    expect(dimension.height).toBeGreaterThanOrEqual(44);
    expect(dimension.width).toBeGreaterThanOrEqual(44);
  }
}

async function portfolioGeometry(page: Page) {
  return page
    .locator(
      'main[data-chapter="portfolio"], [data-project-list], [data-project-list] article',
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rectangle = element.getBoundingClientRect();
        const round = (value: number) => Math.round(value * 1_000) / 1_000;

        return {
          height: round(rectangle.height),
          left: round(rectangle.left),
          scrollHeight: element.scrollHeight,
          scrollWidth: element.scrollWidth,
          top: round(rectangle.top),
          width: round(rectangle.width),
        };
      }),
    );
}

test("the canonical warm dark tokens reach Portfolio and Contact without changing layout", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await mockTurnstile(page);
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.emulateMedia({ colorScheme: "light" });
  await setStoredTheme(page, "light");

  const portfolioResponse = await page.goto("/portfolio", {
    waitUntil: "networkidle",
  });
  expect(portfolioResponse?.ok()).toBe(true);
  await expect(page.locator('main[data-chapter="portfolio"]')).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await settleLayout(page);

  const lightGeometry = await portfolioGeometry(page);
  await page.locator('button[aria-label="Tema escuro"]:visible').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await settleLayout(page);
  expect(await portfolioGeometry(page)).toEqual(lightGeometry);

  const tokens = await page.evaluate((tokenNames) => {
    const styles = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      tokenNames.map((tokenName) => [
        tokenName,
        styles.getPropertyValue(tokenName).trim(),
      ]),
    );
  }, Object.keys(DARK_THEME_TOKENS));
  expect(tokens).toEqual(DARK_THEME_TOKENS);

  const resolvedRoles = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.position = "fixed";
    probe.style.color = "var(--wf-text-accent)";
    document.body.append(probe);
    const textAccent = getComputedStyle(probe).color;
    probe.style.color = "var(--wf-text)";
    const text = getComputedStyle(probe).color;
    probe.style.color = "var(--wf-accent-text)";
    const accentText = getComputedStyle(probe).color;
    probe.style.color = "var(--wf-primary-text)";
    const primaryText = getComputedStyle(probe).color;
    probe.style.color = "var(--wf-link)";
    const link = getComputedStyle(probe).color;
    probe.remove();

    return { accentText, link, primaryText, text, textAccent };
  });
  expect(resolvedRoles.accentText).toBe(resolvedRoles.textAccent);
  expect(resolvedRoles.primaryText).toBe(resolvedRoles.textAccent);
  expect(resolvedRoles.link).toBe(resolvedRoles.textAccent);
  expect(resolvedRoles.textAccent).toBe("rgb(231, 146, 113)");

  const projectColors = await page.evaluate(() => ({
    callsToAction: Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-project-list] article > a:last-child",
      ),
      (element) => getComputedStyle(element).color,
    ),
    metadata: Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-project-list] article > span:first-child",
      ),
      (element) => getComputedStyle(element).color,
    ),
  }));
  expect(projectColors.metadata.length).toBeGreaterThan(0);
  expect(
    projectColors.metadata.every(
      (color) => color === resolvedRoles.textAccent,
    ),
  ).toBe(true);
  expect(projectColors.callsToAction.length).toBeGreaterThan(0);
  expect(
    projectColors.callsToAction.every(
      (color) =>
        color === resolvedRoles.text || color === resolvedRoles.textAccent,
    ),
  ).toBe(true);

  expect(
    await page.locator('meta[name="theme-color"]').evaluateAll((elements) =>
      elements.map((element) => ({
        content: element.getAttribute("content"),
        media: element.getAttribute("media"),
      })),
    ),
  ).toEqual([
    { content: "#f7f1e8", media: "(prefers-color-scheme: light)" },
    { content: "#12100f", media: "(prefers-color-scheme: dark)" },
  ]);
  await expectNoHorizontalOverflow(page);

  const contactResponse = await page.goto("/contato", {
    waitUntil: "networkidle",
  });
  expect(contactResponse?.ok()).toBe(true);
  const form = page.locator("[data-contact-form]");
  await expect(form).toBeVisible();
  await settleLayout(page);

  const borderColors = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.border = "1px solid var(--wf-border-strong)";
    document.body.append(probe);
    const expected = getComputedStyle(probe).borderTopColor;
    probe.remove();

    const actual = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-contact-form] input:not([type="checkbox"]):not([name="website"]), [data-contact-form] select, [data-contact-form] textarea',
      ),
      (element) => getComputedStyle(element).borderTopColor,
    );
    return { actual, expected };
  });
  expect(borderColors.actual.length).toBeGreaterThan(0);
  expect(
    borderColors.actual.every((color) => color === borderColors.expected),
  ).toBe(true);
  await expectNoHorizontalOverflow(page);
  expect(pageErrors).toEqual([]);
});

test("Home dark atmosphere is warm, geometry-stable, and filter-free", async ({
  page,
}) => {
  await page.setViewportSize({ height: 1024, width: 1536 });
  await page.emulateMedia({ colorScheme: "light" });
  await setStoredTheme(page, "light");

  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response?.ok()).toBe(true);
  const home = page.locator('main[data-chapter="home"]');
  await expect(home).toBeVisible();
  await settleLayout(page);
  const lightGeometry = await home.boundingBox();
  const lightAtmosphere = await home.evaluate(
    (element) => getComputedStyle(element, "::before").backgroundImage,
  );

  await page.locator('button[aria-label="Tema escuro"]:visible').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await settleLayout(page);

  const darkAtmosphere = await home.evaluate((element) => {
    const style = getComputedStyle(element, "::before");

    return {
      backdropFilter: style.backdropFilter,
      backgroundImage: style.backgroundImage,
      filter: style.filter,
    };
  });

  expect(await home.boundingBox()).toEqual(lightGeometry);
  expect(darkAtmosphere.backgroundImage).not.toBe(lightAtmosphere);
  expect(darkAtmosphere.backgroundImage).toMatch(/159[^\d]+75[^\d]+54/iu);
  expect(darkAtmosphere.backgroundImage).not.toMatch(
    /126[^\d]+55[^\d]+255|147[^\d]+63[^\d]+255|123[^\d]+93[^\d]+218/iu,
  );
  expect(darkAtmosphere.filter).toBe("none");
  expect(darkAtmosphere.backdropFilter).toBe("none");
  await expectNoHorizontalOverflow(page);
});

test.describe("Phase-9 canonical theme responsive matrix", () => {
  for (const scenario of REVIEW_SCENARIOS) {
    test(scenario.label, async ({ page }) => {
      test.skip(
        productionServer && scenario.developmentOnly === true,
        "Development-only review surface",
      );

      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await mockTurnstile(page);
      await page.setViewportSize(scenario.viewport);
      const queryOwnsTheme = scenario.route.includes("/score-paths");
      const fallbackTheme: ThemeName =
        queryOwnsTheme && scenario.theme === "dark" ? "light" : scenario.theme;
      await page.emulateMedia({
        colorScheme: fallbackTheme,
        reducedMotion: scenario.reducedMotion ? "reduce" : "no-preference",
      });
      await setStoredTheme(page, fallbackTheme);

      const response = await page.goto(scenario.route, {
        waitUntil: "networkidle",
      });
      expect(response?.ok()).toBe(true);

      const root = page.locator(scenario.rootSelector);
      await expect(root).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        scenario.theme,
      );
      if (queryOwnsTheme) {
        await expect(root).not.toHaveAttribute("data-theme");
      }

      if (scenario.route === "/__visual-lab/story/motion") {
        await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
          "data-bootstrap-state",
          "REVEALED",
          { timeout: 10_000 },
        );
        await expect(root).toHaveAttribute("data-motion-lifecycle", "mounted");
      }
      if (scenario.route.includes("/score-paths/preview")) {
        await expect(root).toHaveAttribute(
          "data-review-candidate",
          "organic-flowing",
        );
        await expect(root).toHaveAttribute("data-review-theme", scenario.theme);
      }
      if (scenario.route.includes("/score-paths/origin")) {
        await expect(root).toHaveAttribute(
          "data-origin-review-theme",
          scenario.theme,
        );
      }
      if (scenario.expectedProjection !== undefined) {
        const attribute = scenario.route.includes("/score-paths/origin")
          ? "data-origin-review-mode"
          : "data-projection-mode";
        await expect(root).toHaveAttribute(
          attribute,
          scenario.expectedProjection,
          { timeout: 10_000 },
        );
      }

      await settleLayout(page);
      if (
        scenario.route.includes("/score-paths/preview") &&
        scenario.theme === "dark"
      ) {
        const inheritance = await storyThemeInheritance(page);
        const documentTheme = inheritance.html;

        expect(documentTheme).toBeDefined();
        for (const surface of Object.values(inheritance)) {
          expect(surface).toEqual(documentTheme);
          expect(surface.colorScheme).toContain("dark");
        }
      }
      await expectNoHorizontalOverflow(page);
      await expectMinimumTouchTargets(page, scenario.touchTargetSelector);
      expect(pageErrors).toEqual([]);
    });
  }
});
