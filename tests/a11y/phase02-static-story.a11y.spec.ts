import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const STORY_PATH = "/__visual-lab/story";
const STORY_MAIN = "main[data-story-v2]";
const STORY_HEADER = "header[data-story-v2-header]";

const CHAPTER_IDS = [
  "home",
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
  "application-overview",
  "application-how-it-works",
  "application-benefits",
  "application-demo",
  "application-access",
  "application-terminal",
] as const;

const HEADER_HASHES = [
  "#aplicacao",
  "#como-funciona",
  "#beneficios",
  "#home",
  "#sobre",
  "#servicos",
  "#projetos",
  "#contato",
] as const;

interface RelevantViolation {
  readonly help: string;
  readonly id: string;
  readonly impact: string | null;
  readonly targets: readonly string[];
}

const accessibilityStates = [
  {
    colorScheme: "light",
    height: 1024,
    name: "desktop light",
    reducedMotion: "no-preference",
    width: 1536,
  },
  {
    colorScheme: "dark",
    height: 1024,
    name: "desktop dark",
    reducedMotion: "no-preference",
    width: 1536,
  },
  {
    colorScheme: "light",
    height: 844,
    name: "mobile light",
    reducedMotion: "no-preference",
    width: 390,
  },
  {
    colorScheme: "dark",
    height: 800,
    name: "narrow reduced motion",
    reducedMotion: "reduce",
    width: 320,
  },
] as const;

async function openDevelopmentStory(page: Page) {
  const response = await page.goto(STORY_PATH, {
    waitUntil: "domcontentloaded",
  });

  expect(response?.ok(), STORY_PATH).toBe(true);
  await expect(page.locator(STORY_MAIN)).toBeVisible();
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

test.describe("Phase 2 static story accessibility", () => {
  test.skip(productionServer, "Development-only Phase 2 accessibility evidence");

  test.beforeEach(async ({ page }) => {
    await page.addInitScript({ content: axe.source });
  });

  test("has no critical or serious axe findings across responsive and reduced-motion states", async ({
    page,
  }) => {
    test.setTimeout(120_000);

    for (const state of accessibilityStates) {
      await page.setViewportSize({ height: state.height, width: state.width });
      await page.emulateMedia({
        colorScheme: state.colorScheme,
        reducedMotion: state.reducedMotion,
      });
      await openDevelopmentStory(page);

      expect(
        await findRelevantViolations(page),
        state.name,
      ).toEqual([]);
    }
  });

  test("exposes a first-focus skip link and the canonical header order", async ({
    page,
  }) => {
    await openDevelopmentStory(page);

    const skipLink = page.getByRole("link", {
      name: "Pular para o conteúdo principal",
    });
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(STORY_MAIN)).toBeFocused();

    // Start a fresh document so Firefox/WebKit do not retain the fragment
    // target's focus across a reload after the skip-link assertion above.
    await page.goto("about:blank");
    await openDevelopmentStory(page);
    await page.keyboard.press("Tab");
    await expect(skipLink).toBeFocused();

    const headerLinks = page.locator(`${STORY_HEADER} a[href^="#"]`);
    await expect(headerLinks).toHaveCount(HEADER_HASHES.length);

    for (const [index, hash] of HEADER_HASHES.entries()) {
      await page.keyboard.press("Tab");
      const link = headerLinks.nth(index);

      await expect(link).toBeFocused();
      await expect(link).toHaveAttribute("href", hash);
    }

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contato$/u);
    await expect(page.locator("#contato")).toBeVisible();
  });

  test("reduced motion retains every chapter as visible semantic content", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openDevelopmentStory(page);

    expect(
      await page.evaluate(
        () => matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    ).toBe(true);

    const chapters = page.locator(`${STORY_MAIN} [data-chapter-id]`);
    await expect(chapters).toHaveCount(CHAPTER_IDS.length);
    expect(await chapters.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-chapter-id")),
    )).toEqual(CHAPTER_IDS);

    for (const chapterId of CHAPTER_IDS) {
      const chapter = page.locator(`[data-chapter-id="${chapterId}"]`);

      await expect(chapter).toBeVisible();
      expect(
        await chapter.evaluate(
          (element) =>
            element.closest('[hidden], [inert], [aria-hidden="true"]') === null,
        ),
      ).toBe(true);
    }
  });
});
