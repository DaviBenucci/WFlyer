import { expect, test, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const REVIEW_ROUTE = "/__visual-lab/story/score-paths";
const PREVIEW_ROUTE = `${REVIEW_ROUTE}/preview`;
const ORIGIN_ROUTE = `${REVIEW_ROUTE}/origin`;
const HYDRATION_WARNING_PATTERN =
  /(?:hydration\s+(?:mismatch|failed)|server rendered html didn['’]t match|attributes[\s\S]{0,240}didn['’]t match|a tree hydrated[\s\S]{0,240}didn['’]t match)/iu;

const COMPACT_VIEWPORT_MATRIX = [
  { height: 640, trackWidth: 344, width: 360 },
  { height: 844, trackWidth: 359, width: 375 },
  { height: 932, trackWidth: 374, width: 390 },
  { height: 640, trackWidth: 396, width: 412 },
  { height: 844, trackWidth: 398, width: 414 },
  { height: 932, trackWidth: 414, width: 430 },
] as const;

const REVIEW_MATRIX = [
  ["organic-soft", "vertical-wide", "light"],
  ["organic-soft", "vertical-wide", "dark"],
  ["organic-soft", "vertical-compact", "light"],
  ["organic-soft", "vertical-compact", "dark"],
  ["organic-flowing", "vertical-wide", "light"],
  ["organic-flowing", "vertical-wide", "dark"],
  ["organic-flowing", "vertical-compact", "light"],
  ["organic-flowing", "vertical-compact", "dark"],
] as const;

function previewUrl(
  candidate: (typeof REVIEW_MATRIX)[number][0],
  mode: (typeof REVIEW_MATRIX)[number][1],
  theme: (typeof REVIEW_MATRIX)[number][2],
) {
  return `${PREVIEW_ROUTE}?${new URLSearchParams({ candidate, mode, theme })}`;
}

async function openPreview(
  page: Page,
  candidate: (typeof REVIEW_MATRIX)[number][0],
  mode: (typeof REVIEW_MATRIX)[number][1],
  theme: (typeof REVIEW_MATRIX)[number][2],
) {
  await page.setViewportSize(
    mode === "vertical-wide"
      ? { width: 1340, height: 820 }
      : { width: 430, height: 844 },
  );
  const response = await page.goto(previewUrl(candidate, mode, theme), {
    waitUntil: "domcontentloaded",
  });

  expect(response?.ok()).toBe(true);
  const root = page.locator("main[data-phase-9-task-33-review]");
  await expect(root).toHaveAttribute("data-review-candidate", candidate);
  await expect(root).toHaveAttribute("data-projection-mode", mode);
  await expect(root).toHaveAttribute("data-review-theme", theme);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test("the task-33 ScorePath review surface remains development-only", async ({
  page,
}) => {
  const response = await page.goto(REVIEW_ROUTE, {
    waitUntil: "domcontentloaded",
  });

  if (productionServer) {
    expect(response?.status()).toBe(404);
    await expect(
      page.locator("[data-phase-9-score-path-review-shell]"),
    ).toHaveCount(0);
    const originResponse = await page.goto(ORIGIN_ROUTE, {
      waitUntil: "domcontentloaded",
    });
    expect(originResponse?.status()).toBe(404);
    await expect(
      page.locator("[data-phase-9-task-33-origin-review]"),
    ).toHaveCount(0);
    return;
  }

  expect(response?.ok()).toBe(true);
  await expect(
    page.locator('[data-phase-9-score-path-review-shell="task-33"]'),
  ).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/u,
  );
});

test.describe("Phase-9 ScorePath hydration regression", () => {
  test.skip(productionServer, "Development-only task-33 review surface");

  for (const state of [
    {
      label: "vertical-compact light",
      root: "main[data-phase-9-task-33-review]",
      route: previewUrl("organic-flowing", "vertical-compact", "light"),
      theme: "light" as const,
      viewport: { height: 844, width: 390 },
    },
    {
      label: "vertical-compact dark",
      root: "main[data-phase-9-task-33-review]",
      route: previewUrl("organic-flowing", "vertical-compact", "dark"),
      theme: "dark" as const,
      viewport: { height: 844, width: 390 },
    },
    {
      label: "origin vertical-compact",
      root: "main[data-phase-9-task-33-origin-review]",
      route: `${ORIGIN_ROUTE}?mode=vertical-compact&theme=dark`,
      theme: "dark" as const,
      viewport: { height: 844, width: 390 },
    },
    {
      label: "origin horizontal-enhanced",
      root: "main[data-phase-9-task-33-origin-review]",
      route: `${ORIGIN_ROUTE}?mode=horizontal-enhanced&theme=dark`,
      theme: "dark" as const,
      viewport: { height: 900, width: 1440 },
    },
  ] as const) {
    test(`zero hydration warnings · ${state.label}`, async ({ page }) => {
      const hydrationMessages: string[] = [];
      const fallbackTheme = state.theme === "dark" ? "light" : "dark";

      page.on("console", (message) => {
        const text = message.text();
        if (HYDRATION_WARNING_PATTERN.test(text)) hydrationMessages.push(text);
      });
      page.on("pageerror", (error) => {
        if (HYDRATION_WARNING_PATTERN.test(error.message)) {
          hydrationMessages.push(error.message);
        }
      });
      await page.addInitScript((storedTheme) => {
        window.localStorage.setItem("wf-theme", storedTheme);
      }, fallbackTheme);
      await page.setViewportSize(state.viewport);
      await page.emulateMedia({ colorScheme: fallbackTheme });

      const response = await page.goto(state.route, {
        waitUntil: "networkidle",
      });
      expect(response?.ok()).toBe(true);
      await expect(page.locator(state.root)).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        state.theme,
      );
      await expect(page.locator(state.root)).not.toHaveAttribute("data-theme");
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      });

      const overlayText = await page.locator("nextjs-portal").evaluateAll(
        (portals) =>
          portals
            .map((portal) => portal.shadowRoot?.textContent ?? portal.textContent)
            .join("\n"),
      );
      if (HYDRATION_WARNING_PATTERN.test(overlayText)) {
        hydrationMessages.push(overlayText);
      }

      expect(hydrationMessages).toEqual([]);
    });
  }
});

test.describe("Phase-9 ScorePath task-33 candidate matrix", () => {
  test.skip(productionServer, "Development-only task-33 review surface");

  for (const [candidate, mode, theme] of REVIEW_MATRIX) {
    test(`${candidate} · ${mode} · ${theme}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await openPreview(page, candidate, mode, theme);

      await expect(page.locator("[data-review-branch]")).toHaveCount(2);
      await expect(page.locator("[data-review-chapter-id]")).toHaveCount(14);
      await expect(page.locator("[data-professional-scene]")).toHaveCount(6);
      await expect(page.locator("[data-application-scene]")).toHaveCount(6);
      await expect(page.locator('[data-score-role="staff-line"]')).toHaveCount(10);
      await expect(page.locator('[data-score-role="clef"]')).toHaveCount(2);
      await expect(
        page.locator('[data-score-role="final-barline-thin"]'),
      ).toHaveCount(2);
      await expect(
        page.locator('[data-score-role="final-barline-thick"]'),
      ).toHaveCount(2);
      await expect(page.locator('[data-review-zone-kind="notation-safe"]')).toHaveCount(
        14,
      );
      const expectedConnectorCount =
        candidate === "organic-flowing" ? 12 : 14;
      await expect(page.locator('[data-review-zone-kind="connector"]')).toHaveCount(
        expectedConnectorCount,
      );
      await expect(page.locator("[data-review-diagnostics]")).toHaveCount(2);
      await expect(page.locator('[data-review-marker-only="true"]')).toHaveCount(
        14 + expectedConnectorCount,
      );
      await expect(
        page.locator("[data-review-zone-markers] polyline"),
      ).toHaveCount(0);
      await expect(
        page.locator('[data-review-terminal-invariant="pass"]'),
      ).toHaveCount(2);
      expect(
        await page
          .locator("[data-review-primitive-span-violations]")
          .evaluateAll((branches) =>
            branches.every(
              (branch) =>
                branch.getAttribute(
                  "data-review-primitive-span-violations",
                ) === "0",
            ),
          ),
      ).toBe(true);
      if (candidate === "organic-flowing") {
        await expect(
          page.locator("main[data-phase-9-task-33-review]"),
        ).toHaveAttribute("data-review-status", "SELECTED_FOR_REVISION");
      }
      expect(
        await page.locator('[data-review-zone-kind="connector"]').evaluateAll(
          (connectors) =>
            connectors.every(
              (connector) =>
                connector.getAttribute("data-review-event-count") === "0" &&
                connector.getAttribute("data-review-semantic-slot-ids") === "",
            ),
        ),
      ).toBe(true);

      const envelopeOverflow = await page
        .locator("[data-review-content-envelope]")
        .evaluateAll((envelopes) =>
          envelopes.map((envelope) => ({
            chapter: envelope.getAttribute("data-review-content-envelope"),
            horizontal: envelope.scrollWidth - envelope.clientWidth,
            vertical: envelope.scrollHeight - envelope.clientHeight,
          })),
        );
      expect(envelopeOverflow).toEqual(
        envelopeOverflow.map(({ chapter }) => ({
          chapter,
          horizontal: 0,
          vertical: 0,
        })),
      );

      expect(
        await page.locator("[data-review-score]").evaluateAll((scores) =>
          scores.every(
            (score) => getComputedStyle(score).pointerEvents === "none",
          ),
        ),
      ).toBe(true);
      expect(
        await page.evaluate(() =>
          document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      expect(
        await page.locator("main[data-phase-9-task-33-review]").evaluate(
          (root) => getComputedStyle(root).colorScheme,
        ),
      ).toContain(theme);

      await expect(page.locator("[data-project-card-link]")).toHaveCount(3);
      await expect(page.locator("[data-contact-form]")).toHaveCount(1);
      await expect(page.locator('[data-primary-app-access="true"]')).toHaveCount(1);
      await expect(page.locator("[data-app04-deterministic-fallback]")).toHaveCount(1);
      expect(
        await page
          .locator(
            "[data-project-card-link], [data-contact-form] input, [data-contact-form] textarea, [data-primary-app-access]",
          )
          .evaluateAll((elements) =>
            elements.every((element) => {
              const style = getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return (
                style.pointerEvents !== "none" &&
                rect.width > 0 &&
                rect.height > 0
              );
            }),
          ),
      ).toBe(true);
      expect(pageErrors).toEqual([]);
    });
  }

  test("reduced motion retains the complete static score and usable scenes", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPreview(page, "organic-flowing", "vertical-compact", "dark");

    await expect(page.locator('[data-score-role="staff-line"]')).toHaveCount(10);
    await expect(page.locator("[data-review-chapter-id]")).toHaveCount(14);
    expect(
      await page.evaluate(() =>
        document.getAnimations().filter((animation) => {
          if (!(animation.effect instanceof KeyframeEffect)) return true;

          const { duration, iterations } = animation.effect.getTiming();
          return (
            duration === "auto" ||
            Number(duration) > 1 ||
            iterations === Number.POSITIVE_INFINITY
          );
        }),
      ),
    ).toEqual([]);
    await expect(page.locator("[data-contact-form]")).toBeVisible();
    await expect(page.locator('[data-primary-app-access="true"]')).toBeVisible();
  });
});

test.describe("Phase-9 task-33 responsive refinement", () => {
  test.skip(productionServer, "Development-only task-33 review surface");

  for (const viewport of COMPACT_VIEWPORT_MATRIX) {
    test(`Organic Flowing compact real scenes fit ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.setViewportSize(viewport);
      const response = await page.goto(
        previewUrl("organic-flowing", "vertical-compact", "light"),
        { waitUntil: "domcontentloaded" },
      );

      expect(response?.ok()).toBe(true);
      const root = page.locator("main[data-phase-9-task-33-review]");
      await expect(root).toHaveAttribute(
        "data-review-track-width",
        String(viewport.trackWidth),
      );
      await expect(page.locator("[data-review-content-envelope]")).toHaveCount(14);
      await expect(page.locator("[data-professional-scene]")).toHaveCount(6);
      await expect(page.locator("[data-application-scene]")).toHaveCount(6);

      const fit = await page.evaluate(() => {
        const storyHeader = document.querySelector<HTMLElement>(
          "header[data-story-v2-header]",
        );
        const reviewRoot = document.querySelector<HTMLElement>(
          "main[data-phase-9-task-33-review]",
        );
        const controls = Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-story-navigation-target], header[data-story-v2-header] button",
          ),
          (control) => control.getBoundingClientRect(),
        );
        const controlsOverlap = controls.some((left, leftIndex) =>
          controls.slice(leftIndex + 1).some(
            (right) =>
              Math.min(left.right, right.right) -
                Math.max(left.left, right.left) >
                0.5 &&
              Math.min(left.bottom, right.bottom) -
                Math.max(left.top, right.top) >
                0.5,
          ),
        );
        const envelopes = Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-review-content-envelope]",
          ),
          (envelope) => ({
            horizontal: envelope.scrollWidth - envelope.clientWidth,
            id: envelope.dataset.reviewContentEnvelope,
            vertical: envelope.scrollHeight - envelope.clientHeight,
          }),
        );
        const scenes = Array.from(
          document.querySelectorAll<HTMLElement>(
            "[data-professional-scene], [data-application-scene]",
          ),
          (scene) => ({
            horizontal: scene.scrollWidth - scene.clientWidth,
            id:
              scene.dataset.professionalScene ?? scene.dataset.applicationScene,
            vertical: scene.scrollHeight - scene.clientHeight,
          }),
        );
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>("[data-project-card-link]"),
          (card) => {
            const envelope = card.closest<HTMLElement>(
              "[data-review-content-envelope]",
            );
            const cardRect = card.getBoundingClientRect();
            const envelopeRect = envelope?.getBoundingClientRect();

            return {
              contained:
                envelopeRect !== undefined &&
                cardRect.left >= envelopeRect.left - 1 &&
                cardRect.right <= envelopeRect.right + 1,
              height: cardRect.height,
              horizontal: card.scrollWidth - card.clientWidth,
              width: cardRect.width,
            };
          },
        );
        const fan = document.querySelector<HTMLElement>("[data-project-card-fan]");
        const fallback = document.querySelector<HTMLElement>(
          "[data-app04-deterministic-fallback]",
        );
        const contact = document.querySelector<HTMLElement>("[data-contact-form]");

        if (!storyHeader || !reviewRoot || !fan || !fallback || !contact) {
          throw new Error("Required responsive review nodes are missing");
        }

        return {
          cards,
          controlsFit: controls.every(
            ({ width, height }) => width >= 44 && height >= 44,
          ),
          controlsOverlap,
          documentOverflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          envelopes,
          fanWidth: fan.getBoundingClientRect().width,
          headerHeight: storyHeader.getBoundingClientRect().height,
          reviewOverflow: reviewRoot.scrollWidth - reviewRoot.clientWidth,
          scenes,
          structuralContentVisible: [fallback, contact].every((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          }),
        };
      });

      expect(fit.documentOverflow).toBe(0);
      expect(fit.reviewOverflow).toBe(0);
      expect(fit.headerHeight).toBe(149);
      expect(fit.controlsFit).toBe(true);
      expect(fit.controlsOverlap).toBe(false);
      expect(fit.envelopes.every(({ horizontal, vertical }) =>
        horizontal === 0 && vertical === 0,
      )).toBe(true);
      expect(fit.scenes.every(({ horizontal, vertical }) =>
        horizontal === 0 && vertical === 0,
      )).toBe(true);
      expect(fit.cards.every(({ contained, horizontal, width }) =>
        contained && horizontal === 0 && width / fit.fanWidth > 0.9,
      )).toBe(true);
      expect(fit.structuralContentVisible).toBe(true);

      const evidence = await page.locator("[data-review-branch]").evaluateAll(
        (branches) =>
          branches.map((branch) => ({
            bounds: branch.getAttribute("data-review-bounds-violations"),
            collisions: branch.getAttribute(
              "data-review-reserved-content-collisions",
            ),
            connectorEvents: branch.getAttribute(
              "data-review-connector-event-count",
            ),
            fingerprint: branch.getAttribute(
              "data-review-semantic-fingerprint",
            ),
            largestGap: branch.getAttribute(
              "data-review-largest-content-free-interval",
            ),
            pathIntersections: branch.getAttribute(
              "data-review-path-self-intersections",
            ),
            staffIntersections: branch.getAttribute(
              "data-review-staff-self-intersections",
            ),
            tangent: Number(
              branch.getAttribute("data-review-max-notation-tangent"),
            ),
            trackHeight: branch.getAttribute("data-review-track-height"),
            transitionHeight: branch.getAttribute(
              "data-review-transition-only-height",
            ),
          })),
      );
      expect(evidence).toEqual([
        expect.objectContaining({
          bounds: "0",
          collisions: "0",
          connectorEvents: "0",
          fingerprint: "fnv1a32:039bce10",
          largestGap: "234",
          pathIntersections: "0",
          staffIntersections: "0",
          trackHeight: "9898",
          transitionHeight: "1638",
        }),
        expect.objectContaining({
          bounds: "0",
          collisions: "0",
          connectorEvents: "0",
          fingerprint: "fnv1a32:1fe3356b",
          largestGap: "234",
          pathIntersections: "0",
          staffIntersections: "0",
          trackHeight: "7028",
          transitionHeight: "1638",
        }),
      ]);
      expect(evidence.every(({ tangent }) => tangent <= 18)).toBe(true);

      const firstCard = page.locator("[data-project-card-link]").first();
      await firstCard.focus();
      const focus = await firstCard.evaluate((card) => {
        const header = document.querySelector<HTMLElement>(
          "header[data-story-v2-header]",
        );
        const rect = card.getBoundingClientRect();
        const style = getComputedStyle(card);

        if (!header) throw new Error("Story header is missing");

        return {
          headerBottom: header.getBoundingClientRect().bottom,
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          top: rect.top,
        };
      });
      expect(focus.outlineStyle).not.toBe("none");
      expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);
      expect(focus.top).toBeGreaterThanOrEqual(focus.headerBottom + 14);

      await page.evaluate(() => window.localStorage.setItem("wf-theme", "light"));
      await page.emulateMedia({ colorScheme: "light" });
      const darkResponse = await page.goto(
        previewUrl("organic-flowing", "vertical-compact", "dark"),
        { waitUntil: "domcontentloaded" },
      );
      expect(darkResponse?.ok()).toBe(true);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(root).not.toHaveAttribute("data-theme");
      await expect(root).toHaveAttribute(
        "data-review-track-width",
        String(viewport.trackWidth),
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      });

      const darkState = await page.evaluate(() => {
        const selectors = [
          "html",
          "body",
          "header[data-story-v2-header]",
          "main[data-phase-9-task-33-review]",
          "[data-review-score]",
          "[data-professional-scene]",
          "[data-project-card-link]",
          "[data-contact-form]",
          "[data-application-scene]",
          "[data-app04-deterministic-fallback]",
          '[data-professional-scene="terminal"]',
          '[data-application-scene="terminal"]',
        ] as const;
        const tokenNames = [
          "--wf-bg",
          "--wf-surface",
          "--wf-text",
          "--wf-text-muted",
          "--wf-emphasis",
        ] as const;
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>("[data-project-card-link]"),
          (card) => {
            const rectangle = card.getBoundingClientRect();
            return { height: rectangle.height, width: rectangle.width };
          },
        );
        const fan = document.querySelector<HTMLElement>(
          "[data-project-card-fan]",
        );
        const header = document.querySelector<HTMLElement>(
          "header[data-story-v2-header]",
        );
        const reviewRoot = document.querySelector<HTMLElement>(
          "main[data-phase-9-task-33-review]",
        );

        if (fan === null || header === null || reviewRoot === null) {
          throw new Error("Required compact dark geometry is missing");
        }

        return {
          cards,
          documentOverflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          fanWidth: fan.getBoundingClientRect().width,
          headerHeight: header.getBoundingClientRect().height,
          reviewOverflow: reviewRoot.scrollWidth - reviewRoot.clientWidth,
          sceneOverflow: Array.from(
            document.querySelectorAll<HTMLElement>(
              "[data-review-content-envelope], [data-professional-scene], [data-application-scene]",
            ),
            (element) => ({
              horizontal: element.scrollWidth - element.clientWidth,
              vertical: element.scrollHeight - element.clientHeight,
            }),
          ),
          surfaces: selectors.map((selector) => {
            const element = document.querySelector<HTMLElement>(selector);

            if (element === null) {
              throw new Error(`Missing compact dark surface: ${selector}`);
            }

            const style = getComputedStyle(element);
            return {
              colorScheme: style.colorScheme,
              dataTheme: element.getAttribute("data-theme"),
              selector,
              tokens: Object.fromEntries(
                tokenNames.map((name) => [
                  name,
                  style.getPropertyValue(name).trim(),
                ]),
              ),
            };
          }),
        };
      });

      expect(darkState.documentOverflow).toBe(0);
      expect(darkState.reviewOverflow).toBe(0);
      expect(
        darkState.sceneOverflow.every(
          ({ horizontal, vertical }) => horizontal === 0 && vertical === 0,
        ),
      ).toBe(true);
      expect(darkState.headerHeight).toBe(fit.headerHeight);
      expect(darkState.fanWidth).toBe(fit.fanWidth);
      expect(darkState.cards).toEqual(
        fit.cards.map(({ height, width }) => ({ height, width })),
      );
      expect(darkState.surfaces[0]?.dataTheme).toBe("dark");
      const documentTokens = darkState.surfaces[0]?.tokens;
      expect(documentTokens?.["--wf-emphasis"]).toBe("#e79271");
      for (const surface of darkState.surfaces) {
        expect(surface.colorScheme).toContain("dark");
        expect(surface.tokens).toEqual(documentTokens);
        if (surface.selector !== "html") expect(surface.dataTheme).toBeNull();
      }

      await firstCard.focus();
      const darkFocus = await firstCard.evaluate((card) => {
        const header = document.querySelector<HTMLElement>(
          "header[data-story-v2-header]",
        );
        const rectangle = card.getBoundingClientRect();
        const style = getComputedStyle(card);

        if (header === null) throw new Error("Story header is missing");

        return {
          headerBottom: header.getBoundingClientRect().bottom,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          top: rectangle.top,
        };
      });
      expect(darkFocus.outlineWidth).toBeGreaterThanOrEqual(2);
      expect(darkFocus.top).toBeGreaterThanOrEqual(
        darkFocus.headerBottom + 14,
      );
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }

  test("tablet and vertical-wide baselines remain intact", async ({ page }) => {
    await page.setViewportSize({ height: 1024, width: 768 });
    let response = await page.goto("/__visual-lab/story/motion", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.ok()).toBe(true);
    await expect(page.locator("[data-story-v2-header]")).toHaveAttribute(
      "data-story-header-block-size",
      "137",
    );
    expect(
      await page.evaluate(() =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(page.locator("[data-professional-scene]")).toHaveCount(6);
    await expect(page.locator("[data-application-scene]")).toHaveCount(6);

    await page.setViewportSize({ height: 820, width: 1340 });
    response = await page.goto(
      previewUrl("organic-flowing", "vertical-wide", "light"),
      { waitUntil: "domcontentloaded" },
    );
    expect(response?.ok()).toBe(true);
    await expect(page.locator("[data-story-v2-header]")).toHaveAttribute(
      "data-story-header-block-size",
      "77",
    );
    await expect(page.locator("[data-review-content-envelope]")).toHaveCount(14);
    expect(
      await page.evaluate(() =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
      ),
    ).toBe(true);
    expect(
      await page.locator("[data-review-content-envelope]").evaluateAll(
        (envelopes) =>
          envelopes.every(
            (envelope) =>
              envelope.scrollWidth === envelope.clientWidth &&
              envelope.scrollHeight === envelope.clientHeight,
          ),
      ),
    ).toBe(true);
  });
});

test.describe("Phase-9 task-33 real-origin review", () => {
  test.skip(productionServer, "Development-only task-33 origin fixture");

  for (const state of [
    {
      mode: "horizontal-enhanced",
      theme: "light",
      viewport: { height: 900, width: 1440 },
    },
    {
      mode: "vertical-wide",
      theme: "light",
      viewport: { height: 820, width: 1340 },
    },
    {
      mode: "vertical-compact",
      theme: "dark",
      viewport: { height: 844, width: 390 },
    },
  ] as const) {
    test(`${state.mode} · ${state.theme}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.setViewportSize(state.viewport);
      await page.emulateMedia({
        reducedMotion:
          state.mode === "vertical-compact" ? "reduce" : "no-preference",
      });
      const query = new URLSearchParams({
        mode: state.mode,
        theme: state.theme,
      });
      const response = await page.goto(`${ORIGIN_ROUTE}?${query}`, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.ok()).toBe(true);
      const root = page.locator("main[data-phase-9-task-33-origin-review]");
      await expect(root).toHaveAttribute(
        "data-origin-review-status",
        "HUMAN_APPROVAL_PENDING",
      );
      await expect(root).toHaveAttribute("data-origin-review-mode", state.mode);
      await expect(page.locator("[data-origin-score-branch]")).toHaveCount(2);
      await expect(page.locator('[data-score-role="staff-line"]')).toHaveCount(10);
      await expect(page.locator('[data-score-role="clef"]')).toHaveCount(1);
      await expect(page.locator("[data-origin-zone-kind]")).toHaveCount(4);
      await expect(page.locator('[data-score-role*="barline"]')).toHaveCount(0);
      await expect(page.locator('[data-score-role="notehead"]')).toHaveCount(0);
      await expect(page.getByText("ORIGIN_CURVE — HUMAN_APPROVAL_PENDING")).toHaveCount(
        2,
      );
      const clefTransform = await page
        .locator('[data-score-role="clef"]')
        .getAttribute("transform");
      expect(clefTransform).toContain("rotate(0)");
      expect(clefTransform).toContain("scale(1 1)");
      expect(
        await page.evaluate(() =>
          document.documentElement.scrollWidth <=
            document.documentElement.clientWidth &&
          document.body.scrollWidth <= document.body.clientWidth,
        ),
      ).toBe(true);
      expect(
        await page.locator("[data-origin-review-stage]").evaluate(
          (stage) => stage.scrollWidth <= stage.clientWidth,
        ),
      ).toBe(true);
      if (state.mode === "vertical-compact") {
        expect(
          await page.evaluate(() =>
            document.getAnimations().every((animation) => {
              if (!(animation.effect instanceof KeyframeEffect)) return false;
              const { duration, iterations } = animation.effect.getTiming();
              return (
                duration !== "auto" &&
                Number(duration) <= 1 &&
                iterations !== Number.POSITIVE_INFINITY
              );
            }),
          ),
        ).toBe(true);
      }
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }
});
