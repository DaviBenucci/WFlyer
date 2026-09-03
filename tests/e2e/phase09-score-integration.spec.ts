import { expect, test } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_ROUTE = "/__visual-lab/story/motion";
const HYDRATION_WARNING_PATTERN =
  /(?:hydration\s+(?:mismatch|failed)|server rendered html didn['’]t match|attributes[\s\S]{0,240}didn['’]t match|a tree hydrated[\s\S]{0,240}didn['’]t match)/iu;
const SEGMENT_IDS = [
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

const MODES = [
  {
    expected: "horizontal-enhanced",
    label: "horizontal enhanced dark",
    route: MOTION_ROUTE,
    resolved: "horizontal-enhanced",
    theme: "dark",
    viewport: { height: 900, width: 1440 },
  },
  {
    expected: "static",
    label: "vertical wide light",
    reducedMotion: "reduce",
    route: MOTION_ROUTE,
    resolved: "vertical-wide",
    theme: "light",
    viewport: { height: 900, width: 1200 },
  },
  {
    expected: "vertical-compact",
    label: "vertical compact dark",
    route: MOTION_ROUTE,
    resolved: "vertical-compact",
    theme: "dark",
    viewport: { height: 844, width: 390 },
  },
  {
    expected: "vertical-wide",
    label: "static fail-open light",
    route: `${MOTION_ROUTE}?scenario=motion-failure`,
    resolved: "vertical-wide",
    theme: "light",
    viewport: { height: 900, width: 1440 },
  },
] as const;

test.describe("Phase-9 Task-34 real score integration", () => {
  test.skip(productionServer, "Development-only Task-34 review surface");

  for (const state of MODES) {
    test(`${state.label} has deterministic hydration and Music contracts`, async ({
      page,
    }) => {
      const hydrationMessages: string[] = [];
      page.on("console", (message) => {
        if (HYDRATION_WARNING_PATTERN.test(message.text())) {
          hydrationMessages.push(message.text());
        }
      });
      page.on("pageerror", (error) => {
        if (HYDRATION_WARNING_PATTERN.test(error.message)) {
          hydrationMessages.push(error.message);
        }
      });
      await page.addInitScript((theme) => {
        window.localStorage.setItem("wf-theme", theme);
      }, state.theme);
      await page.setViewportSize(state.viewport);
      await page.emulateMedia({
        colorScheme: state.theme,
        reducedMotion:
          "reducedMotion" in state
            ? state.reducedMotion
            : "no-preference",
      });

      const response = await page.goto(state.route, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.ok()).toBe(true);
      const root = page.locator("main[data-motion-lab]");
      const layer = page.locator("[data-story-score-layer]");
      await expect(page.locator("[data-story-bootstrap]")).toHaveAttribute(
        "data-bootstrap-state",
        "REVEALED",
        { timeout: 10_000 },
      );
      await expect(page.locator("[data-bootstrap-cover]")).toHaveCount(0);
      await expect(root).toHaveAttribute("data-motion-lifecycle", "mounted");
      await expect(root).toHaveAttribute("data-projection-mode", state.expected);
      await expect(layer).toHaveAttribute("data-score-projection", state.expected);
      await expect(layer).toHaveAttribute(
        "data-score-resolved-geometry",
        state.resolved,
      );
      await expect(layer).toHaveAttribute("data-score-segment-count", "12");
      await expect(layer).toHaveAttribute("data-score-composer-invocations", "2");
      await expect(layer).toHaveAttribute("data-score-connector-events", "0");
      await expect(layer).toHaveAttribute(
        "data-score-path-self-intersections",
        "0",
      );
      await expect(layer).toHaveAttribute(
        "data-score-staff-line-self-intersections",
        "0",
      );
      await expect(layer).toHaveAttribute(
        "data-score-runtime-owner",
        "precomputed-projection-no-scroll-state",
      );
      await expect(layer).toHaveAttribute("data-score-origin-point-gap", "0.000000");
      await expect(layer).toHaveAttribute(
        "data-score-origin-staff-line-gap",
        "0.000000",
      );
      await expect(layer).toHaveAttribute("data-score-clef-rotation", "0.000000");
      await expect(layer).toHaveAttribute("data-score-clef-mirror-x", "false");
      await expect(layer).toHaveAttribute("data-score-clef-mirror-y", "false");
      expect(
        Number(
          await layer.getAttribute("data-score-maximum-notation-tangent"),
        ),
      ).toBeLessThanOrEqual(18.000001);
      await expect(layer).toHaveAttribute("data-score-hydration-precision", "6");
      await expect(layer).toHaveAttribute(
        "data-score-professional-fingerprint",
        "fnv1a32:039bce10",
      );
      await expect(layer).toHaveAttribute(
        "data-score-application-fingerprint",
        "fnv1a32:1fe3356b",
      );
      await expect(layer.locator('[data-score-role="clef"]')).toHaveCount(1);
      await expect(
        layer.locator('[data-score-role="final-barline-thin"]'),
      ).toHaveCount(2);
      await expect(
        layer.locator('[data-score-role="final-barline-thick"]'),
      ).toHaveCount(2);
      await expect(
        page.locator(
          '[data-story-score-segment]:not([data-story-score-segment="shared-origin"])',
        ),
      ).toHaveCount(12);
      const semanticSlots = await page
        .locator(
          '[data-story-score-segment]:not([data-story-score-segment="shared-origin"])',
        )
        .evaluateAll((segments) =>
          segments.map((segment) => ({
            id: segment.getAttribute("data-story-score-segment"),
            slots: segment.getAttribute("data-score-semantic-slot-ids"),
          })),
        );
      expect(semanticSlots).toHaveLength(12);
      expect(new Set(semanticSlots.map(({ id }) => id)).size).toBe(12);
      expect(semanticSlots).toEqual(
        expect.arrayContaining(
          SEGMENT_IDS.map((id) => ({
            id,
            slots: `${id}:primary ${id}:reserved`,
          })),
        ),
      );

      const motionOwnership = await page.evaluate(() =>
        window.__WFLYER_PHASE5_MOTION__?.snapshot(),
      );
      expect(motionOwnership?.ownedScrollTriggerCount).toBe(
        state.expected === "horizontal-enhanced" ? 1 : 0,
      );
      expect(motionOwnership?.ownedTimelineCount).toBe(
        state.expected === "horizontal-enhanced" ? 1 : 0,
      );

      const colors = await layer.evaluate((element) => {
        const color = (selector: string) => {
          const target = element.querySelector(selector);
          if (!target) throw new Error(`Missing score role: ${selector}`);
          return getComputedStyle(target).color;
        };
        return {
          accent: color('[data-score-role="final-barline-thick"]'),
          muted: color('[data-score-role="staff-line"]'),
          primary: color('[data-score-role="notehead"]'),
        };
      });
      expect(colors.primary).not.toBe("rgb(147, 63, 255)");
      expect(colors.muted).not.toBe("rgb(123, 93, 218)");
      expect(colors.accent).not.toBe(colors.primary);
      expect(colors.accent).not.toBe(colors.muted);

      const renderCount = await root.getAttribute("data-motion-lab-render-count");
      await page.mouse.wheel(0, 320);
      await page.waitForTimeout(50);
      await expect(root).toHaveAttribute(
        "data-motion-lab-render-count",
        renderCount ?? "1",
      );

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
