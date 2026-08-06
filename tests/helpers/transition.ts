import { expect, type Locator, type Page } from "@playwright/test";

export type TransitionCheckpoint = "completion" | "midpoint" | "start";
export type TransitionDirection = "left" | "none" | "right";
export type TransitionMode =
  | "adjacent-score"
  | "compressed-score-jump"
  | "home-pivot"
  | "neutral";
export type SettledTransitionResult =
  | "animation-error"
  | "cancelled"
  | "recovered"
  | "success";

export interface TransitionSnapshot {
  readonly active: boolean;
  readonly checkpoint: TransitionCheckpoint | null;
  readonly destinationPathname: string | null;
  readonly direction: TransitionDirection;
  readonly mode: TransitionMode;
  readonly phase: string;
  readonly requestId: number | null;
  readonly sourcePathname: string | null;
}

interface TransitionTestController {
  failNext(): void;
  holdAt(checkpoint: TransitionCheckpoint | null): void;
  interrupt(): void;
  release(): void;
  snapshot(): TransitionSnapshot;
  timeoutNext(): void;
}

interface TestWindow extends Window {
  __WFLYER_TRANSITION_TEST__?: TransitionTestController;
}

export const experienceSelector = "[data-site-experience]";
export const overlaySelector = "[data-score-transition-layer]";

export function experience(page: Page): Locator {
  return page.locator(experienceSelector);
}

export function overlay(page: Page): Locator {
  return page.locator(overlaySelector);
}

export function visibleLink(page: Page, href: string): Locator {
  return page.locator(`a[href="${href}"]:visible`).first();
}

export function visibleMainLink(page: Page, href: string): Locator {
  return page.locator(`main a[href="${href}"]:visible`).first();
}

export function visibleHeaderLink(page: Page, href: string): Locator {
  return page.locator(`header a[href="${href}"]:visible`).first();
}

export function chapterControl(page: Page, role: "next" | "previous"): Locator {
  return page.locator(`[data-navigation-role="${role}"]:visible`).first();
}

/**
 * Compiles a destination before timing-sensitive development-server checks.
 * Production routes are prebuilt, but Next.js development compilation can
 * otherwise consume the coordinator's intentional 1,100 ms safety budget.
 */
export async function warmRoute(page: Page, pathname: string): Promise<void> {
  const response = await page.request.get(pathname);

  expect(response.ok(), `the warmed route ${pathname} should respond`).toBe(true);
}

export async function waitForTransitionController(page: Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            Boolean(
              (window as TestWindow).__WFLYER_TRANSITION_TEST__,
            ),
        ),
      {
        message:
          "the explicitly enabled transition test controller should be available",
      },
    )
    .toBe(true);
}

export async function holdAt(
  page: Page,
  checkpoint: TransitionCheckpoint,
): Promise<void> {
  await waitForTransitionController(page);
  await page.evaluate((nextCheckpoint) => {
    (window as TestWindow).__WFLYER_TRANSITION_TEST__?.holdAt(
      nextCheckpoint,
    );
  }, checkpoint);
}

export async function releaseTransition(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as TestWindow).__WFLYER_TRANSITION_TEST__?.release();
  });
}

export async function interruptTransition(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as TestWindow).__WFLYER_TRANSITION_TEST__?.interrupt();
  });
}

export async function failNextTransition(page: Page): Promise<void> {
  await waitForTransitionController(page);
  await page.evaluate(() => {
    (window as TestWindow).__WFLYER_TRANSITION_TEST__?.failNext();
  });
}

export async function timeoutNextTransition(page: Page): Promise<void> {
  await waitForTransitionController(page);
  await page.evaluate(() => {
    (window as TestWindow).__WFLYER_TRANSITION_TEST__?.timeoutNext();
  });
}

export async function transitionSnapshot(
  page: Page,
): Promise<TransitionSnapshot> {
  await waitForTransitionController(page);

  return page.evaluate(() => {
    const controller =
      (window as TestWindow).__WFLYER_TRANSITION_TEST__;

    if (!controller) {
      throw new Error("Transition test controller is unavailable.");
    }

    return controller.snapshot();
  });
}

export async function waitForCheckpoint(
  page: Page,
  checkpoint: TransitionCheckpoint,
): Promise<void> {
  await expect(overlay(page)).toHaveAttribute("data-checkpoint", checkpoint);
}

export async function expectTransitionMetadata(
  page: Page,
  expected: {
    readonly destination: string;
    readonly direction: TransitionDirection;
    readonly mode: TransitionMode;
    readonly source: string;
    readonly sourceKind?: "history" | "link";
  },
): Promise<void> {
  const shell = experience(page);

  await expect(shell).toHaveAttribute("data-transition-source", expected.source);
  await expect(shell).toHaveAttribute(
    "data-transition-destination",
    expected.destination,
  );
  await expect(shell).toHaveAttribute("data-transition-mode", expected.mode);
  await expect(shell).toHaveAttribute(
    "data-transition-direction",
    expected.direction,
  );

  if (expected.sourceKind) {
    await expect(shell).toHaveAttribute(
      "data-transition-source-kind",
      expected.sourceKind,
    );
  }
}

function pathnamePattern(pathname: string): RegExp {
  const escaped = pathname.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`${escaped.replace(/\/$/u, "") || "/"}(?:[?#].*)?$`, "u");
}

export async function waitForSettledTransition(
  page: Page,
  destination: string,
  result:
    | SettledTransitionResult
    | readonly SettledTransitionResult[] = "success",
): Promise<void> {
  const acceptedResults = typeof result === "string" ? [result] : result;

  await expect(page).toHaveURL(pathnamePattern(destination));
  await expect(experience(page)).toHaveAttribute("data-transition-phase", "idle");
  await expect(experience(page)).toHaveAttribute(
    "data-active-timelines",
    "0",
  );
  await expect
    .poll(async () => {
      const currentResult = await experience(page).getAttribute(
        "data-transition-result",
      );
      return acceptedResults.includes(
        currentResult as SettledTransitionResult,
      );
    })
    .toBe(true);
  await expect(overlay(page)).toHaveAttribute("data-active", "false");
  await expect(page.getByRole("main")).toBeVisible();
}

export async function expectSafeSettledDocument(page: Page): Promise<void> {
  await expect(experience(page)).toHaveAttribute("data-scroll-locked", "false");
  await expect(overlay(page)).toHaveCSS("pointer-events", "none");

  const state = await page.evaluate(() => ({
    bodyOverflow: window.getComputedStyle(document.body).overflow,
    clientWidth: document.documentElement.clientWidth,
    htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(state.bodyOverflow).not.toBe("hidden");
  expect(state.htmlOverflow).not.toBe("hidden");
  expect(state.scrollWidth).toBeLessThanOrEqual(state.clientWidth);
}
