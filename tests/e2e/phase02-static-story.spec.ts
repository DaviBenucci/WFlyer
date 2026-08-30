import { expect, test, type Locator, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const STORY_PATH = "/__visual-lab/story";

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

const CHAPTER_HASHES = {
  "application-access": "acessar-wflyer",
  "application-benefits": "beneficios",
  "application-demo": "demonstracao",
  "application-how-it-works": "como-funciona",
  "application-overview": "aplicacao",
  home: "home",
  "professional-about": "sobre",
  "professional-contact": "contato",
  "professional-process": "processo",
  "professional-projects": "projetos",
  "professional-services": "servicos",
} as const;

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

const STORY_MAIN = "main[data-story-v2]";
const STORY_HEADER = "header[data-story-v2-header]";
const STORY_FOOTER = "footer[data-story-global-footer]";

async function openDevelopmentStory(page: Page) {
  const response = await page.goto(STORY_PATH, {
    waitUntil: "domcontentloaded",
  });

  expect(response?.ok(), STORY_PATH).toBe(true);
  await expect(page.locator(STORY_MAIN)).toBeVisible();
}

async function expectNativeHashNavigation(
  page: Page,
  link: Locator,
  hash: string,
) {
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${hash}$`, "u"));
  await expect(page.locator(hash)).toBeVisible();
}

test("the Phase 2 story surface is development-only", async ({ page }) => {
  const response = await page.goto(STORY_PATH, {
    waitUntil: "domcontentloaded",
  });

  if (productionServer) {
    expect(response?.status()).toBe(404);
    await expect(page.locator(STORY_MAIN)).toHaveCount(0);
    await expect(page.locator(STORY_HEADER)).toHaveCount(0);
    await expect(page.locator(STORY_FOOTER)).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toContain(
      "Static Vertical v2 Skeleton",
    );
    return;
  }

  expect(response?.ok()).toBe(true);
  await expect(page.locator(STORY_MAIN)).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/u,
  );
});

test.describe("Phase 2 static vertical story", () => {
  test.skip(productionServer, "Development-only Phase 2 evidence surface");

  test("renders the exact mobile document order with one semantic document shell", async ({
    page,
  }) => {
    await openDevelopmentStory(page);

    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.locator(STORY_FOOTER)).toHaveCount(1);
    await expect(page.locator(`${STORY_MAIN} ${STORY_FOOTER}`)).toHaveCount(0);

    const chapters = page.locator(`${STORY_MAIN} [data-chapter-id]`);
    await expect(chapters).toHaveCount(CHAPTER_IDS.length);
    expect(await chapters.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-chapter-id")),
    )).toEqual(CHAPTER_IDS);

    for (const [chapterId, htmlId] of Object.entries(CHAPTER_HASHES)) {
      await expect(
        page.locator(`[data-chapter-id="${chapterId}"]`),
      ).toHaveAttribute("id", htmlId);
    }

    expect(
      await page.locator(STORY_MAIN).evaluate((main, footerSelector) => {
        const footer = document.querySelector(footerSelector);
        const lastChapter = main.querySelector(
          '[data-chapter-id="application-terminal"]',
        );

        if (!footer || !lastChapter) return false;

        return (
          Boolean(
            main.compareDocumentPosition(footer) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ) &&
          Boolean(
            lastChapter.compareDocumentPosition(footer) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          )
        );
      }, STORY_FOOTER),
    ).toBe(true);

    const duplicateIds = await page.locator("[id]").evaluateAll((elements) => {
      const counts = new Map<string, number>();

      for (const element of elements) {
        counts.set(element.id, (counts.get(element.id) ?? 0) + 1);
      }

      return [...counts.entries()]
        .filter(([, count]) => count > 1)
        .map(([id]) => id);
    });

    expect(duplicateIds).toEqual([]);
  });

  test("keeps every essential chapter element visible and outside hidden or inert trees", async ({
    page,
  }) => {
    await openDevelopmentStory(page);

    const chapters = page.locator(`${STORY_MAIN} [data-chapter-id]`);
    const hiddenEssentialElements = await chapters.evaluateAll((elements) => {
      const failures: string[] = [];

      for (const chapter of elements) {
        const chapterId = chapter.getAttribute("data-chapter-id") ?? "unknown";
        const essentialElements = [
          chapter,
          ...chapter.querySelectorAll("h1, h2, h3, p, li, a"),
        ];

        for (const [index, element] of essentialElements.entries()) {
          const style = getComputedStyle(element);
          const hiddenAncestor = element.closest(
            '[hidden], [inert], [aria-hidden="true"]',
          );
          const visuallyHidden =
            style.display === "none" ||
            style.visibility === "hidden" ||
            style.opacity === "0" ||
            element.getClientRects().length === 0;

          if (hiddenAncestor || visuallyHidden) {
            failures.push(`${chapterId}:${element.tagName.toLowerCase()}:${index}`);
          }
        }
      }

      return failures;
    });

    expect(hiddenEssentialElements).toEqual([]);
    for (const chapterId of CHAPTER_IDS) {
      const chapter = page.locator(`[data-chapter-id="${chapterId}"]`);

      await expect(chapter).toBeVisible();
      expect((await chapter.innerText()).trim().length).toBeGreaterThan(0);
    }
  });

  test("uses canonical native header anchors and keyboard hash traversal", async ({
    page,
  }) => {
    await openDevelopmentStory(page);

    const header = page.locator(STORY_HEADER);
    await expect(header).toBeVisible();

    const links = header.locator('a[href^="#"]');
    await expect(links).toHaveCount(HEADER_HASHES.length);
    expect(await links.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")),
    )).toEqual(HEADER_HASHES);

    await expectNativeHashNavigation(
      page,
      header.locator('a[href="#beneficios"]'),
      "#beneficios",
    );
    await expectNativeHashNavigation(
      page,
      header.locator('a[href="#contato"]'),
      "#contato",
    );

    expect(
      await page.locator(`${STORY_MAIN} a`).evaluateAll((elements) =>
        elements.every((element) => {
          const href = element.getAttribute("href");

          return (
            element.tagName === "A" &&
            element.getAttribute("role") !== "button" &&
            href !== null &&
            href.trim().length > 0 &&
            !href.toLowerCase().startsWith("javascript:")
          );
        }),
      ),
    ).toBe(true);
  });

  test("keeps the application CTA at the access chapter and omits company framing and Music renderer output", async ({
    page,
  }) => {
    await openDevelopmentStory(page);

    const applicationLinks = page.locator(
      'a[href^="https://app.wflyer.com.br"]',
    );
    await expect(applicationLinks).toHaveCount(1);
    await expect(
      page.locator(
        '[data-chapter-id="application-access"] a[href^="https://app.wflyer.com.br"]',
      ),
    ).toHaveCount(1);

    const mainCopy = (await page.locator(STORY_MAIN).innerText()).normalize(
      "NFC",
    );
    expect(mainCopy).not.toMatch(
      /\b(?:agência|companhia|empresa|empresas|nossa equipe|nosso time|sociedade)\b/iu,
    );

    await expect(
      page.locator(
        [
          "[data-composer-semantics]",
          "[data-connector-fixture]",
          "[data-music-renderer]",
          "[data-rendered-score]",
          "[data-score-model]",
          "[data-score-role]",
        ].join(", "),
      ),
    ).toHaveCount(0);
  });

  test("has no horizontal overflow at the five Phase 2 evidence widths", async ({
    page,
  }) => {
    const viewports = [
      { height: 800, width: 320 },
      { height: 844, width: 390 },
      { height: 1024, width: 768 },
      { height: 900, width: 1366 },
      { height: 1024, width: 1536 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openDevelopmentStory(page);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => ({
        body: Math.max(0, document.body.scrollWidth - document.body.clientWidth),
        document: Math.max(
          0,
          document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        ),
      }));

      expect(overflow, `${viewport.width}px viewport`).toEqual({
        body: 0,
        document: 0,
      });
      await expect(page.locator(`${STORY_MAIN} [data-chapter-id]`)).toHaveCount(
        CHAPTER_IDS.length,
      );
    }
  });

  test("remains readable and natively navigable when JavaScript is disabled", async ({
    baseURL,
    browser,
  }) => {
    if (!baseURL) throw new Error("Playwright baseURL is required");

    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      locale: "pt-BR",
      viewport: { height: 844, width: 390 },
    });

    try {
      const page = await context.newPage();
      const response = await page.goto(STORY_PATH, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.ok()).toBe(true);
      await expect(page.locator(STORY_MAIN)).toBeVisible();
      await expect(
        page.locator(`${STORY_MAIN} [data-chapter-id]`),
      ).toHaveCount(CHAPTER_IDS.length);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator(STORY_FOOTER)).toBeVisible();

      await expectNativeHashNavigation(
        page,
        page.locator(`${STORY_HEADER} a[href="#contato"]`),
        "#contato",
      );
      const noScriptClearance = await page.evaluate(() => {
        const header = document.querySelector<HTMLElement>(
          "header[data-story-v2-header]",
        );
        const target = document.querySelector<HTMLElement>("#contato");

        if (!header || !target) throw new Error("Story header/target missing");

        return {
          headerBottom: header.getBoundingClientRect().bottom,
          targetTop: target.getBoundingClientRect().top,
        };
      });

      expect(noScriptClearance.targetTop).toBeGreaterThanOrEqual(
        noScriptClearance.headerBottom + 15,
      );
    } finally {
      await context.close();
    }
  });
});
