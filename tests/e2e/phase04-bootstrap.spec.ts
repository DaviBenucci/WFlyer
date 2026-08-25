import { expect, test, type Browser, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const BOOTSTRAP_PATH = "/__visual-lab/story/bootstrap";
const ROOT = "[data-story-bootstrap]";
const COVER = "[data-bootstrap-cover]";
const STORY_MAIN = "main[data-story-v2]";

async function openBootstrap(
  page: Page,
  suffix = "",
  waitUntil: "commit" | "domcontentloaded" = "domcontentloaded",
) {
  const response = await page.goto(`${BOOTSTRAP_PATH}${suffix}`, { waitUntil });

  expect(response?.ok(), `${BOOTSTRAP_PATH}${suffix}`).toBe(true);
  await expect(page.locator(ROOT)).toHaveCount(1);
  return response;
}

async function expectTerminalBootstrap(
  page: Page,
  phase: "DEGRADED" | "REVEALED" = "REVEALED",
  timeout = 7_000,
) {
  await expect(page.locator(ROOT)).toHaveAttribute(
    "data-bootstrap-state",
    phase,
    { timeout },
  );
  await expect(page.locator(STORY_MAIN)).toBeVisible();
  await expect(page.locator(COVER)).toHaveCount(0);
}

test("the Phase-4 bootstrap lab fails closed in production", async ({
  page,
  request,
}) => {
  const response = await page.goto(BOOTSTRAP_PATH, {
    waitUntil: "domcontentloaded",
  });

  if (!productionServer) {
    expect(response?.ok()).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/u,
    );
    return;
  }

  expect(response?.status()).toBe(404);
  await expect(page.locator(ROOT)).toHaveCount(0);
  await expect(page.locator(COVER)).toHaveCount(0);
  expect(await page.locator("body").innerText()).not.toContain(
    "Pular introdução",
  );
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/u,
  );

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("__visual-lab");
});

test.describe("Phase-4 readiness and semantic bootstrap", () => {
  test.skip(productionServer, "Development-only Phase-4 review surface");

  test("resolves direct-root semantics to Home before an intentional reveal", async ({
    page,
  }) => {
    await openBootstrap(page);

    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "home",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-source",
      "default-home",
    );
    await expectTerminalBootstrap(page);
    await expect(page.locator("#home")).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(2);
  });

  test("positions a valid deep link under the cover and does not scroll after release", async ({
    page,
  }) => {
    await openBootstrap(page, "#projetos");

    const root = page.locator(ROOT);
    await expect(root).toHaveAttribute(
      "data-bootstrap-state",
      "READY_TO_REVEAL",
      { timeout: 4_000 },
    );
    await expect(page.locator(COVER)).toBeVisible();
    await expect(root).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-projects",
    );
    await expect(root).toHaveAttribute(
      "data-bootstrap-source",
      "explicit-hash",
    );

    const coveredPosition = await page.evaluate(() => ({
      targetTop:
        document.querySelector<HTMLElement>("#projetos")?.getBoundingClientRect()
          .top ?? Number.NaN,
      scrollY: window.scrollY,
    }));
    // Canonical chapter CSS owns a small scroll margin beneath the viewport
    // edge; stability, not a literal zero coordinate, is the contract.
    expect(coveredPosition.targetTop).toBeGreaterThanOrEqual(0);
    expect(coveredPosition.targetTop).toBeLessThan(64);

    await expectTerminalBootstrap(page);
    const revealedScrollY = await page.evaluate(() => window.scrollY);
    expect(Math.abs(revealedScrollY - coveredPosition.scrollY)).toBeLessThan(2);
    await expect(page.locator("#projetos")).toBeInViewport();
  });

  test("rejects invalid hashes without selector interpretation or URL rewriting", async ({
    page,
  }) => {
    const invalidHash = "#%5Bdata-chapter-id%3Dprofessional-contact%5D";
    await openBootstrap(page, invalidHash);
    await expectTerminalBootstrap(page);

    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "home",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-source",
      "invalid-hash-fallback",
    );
    expect(new URL(page.url()).hash).toBe(
      "#%5Bdata-chapter-id%3Dprofessional-contact%5D",
    );
    await expect(page.locator("#home")).toBeInViewport();
  });

  test("prefers a valid hash over restoration and otherwise restores validated semantic state", async ({
    page,
  }) => {
    await openBootstrap(page, "?scenario=slow-critical");
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );
    await page.evaluate(() => {
      window.history.replaceState(
        {
          ...(typeof window.history.state === "object" &&
          window.history.state !== null
            ? window.history.state
            : {}),
          __wflyerStoryV2: {
            version: 1,
            chapterId: "professional-contact",
          },
          foreignOwner: "preserved",
        },
        "",
      );
    });
    await expectTerminalBootstrap(page, "REVEALED", 6_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-contact",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-source",
      "history-restoration",
    );
    expect(
      await page.evaluate(() =>
        (history.state as { foreignOwner?: string } | null)?.foreignOwner,
      ),
    ).toBe("preserved");

    await page.goto("about:blank");
    await openBootstrap(page, "#sobre");
    await expectTerminalBootstrap(page);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-about",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-source",
      "explicit-hash",
    );
  });

  test("waits for slow critical readiness but ignores a noncritical failure", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openBootstrap(page, "?scenario=slow-critical#beneficios");
    await expect(page.locator(COVER)).toBeVisible();
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-reduced-motion",
      "true",
    );
    await page.waitForTimeout(800);
    await expect(page.locator(COVER)).toBeVisible();
    await expectTerminalBootstrap(page, "REVEALED", 6_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "application-benefits",
    );
    const stateTrace = await page.evaluate(
      () => window.__WFLYER_PHASE4_BOOTSTRAP__?.states ?? [],
    );
    expect(stateTrace.indexOf("POSITIONING")).toBeGreaterThan(-1);
    expect(stateTrace.indexOf("POSITIONING")).toBeLessThan(
      stateTrace.indexOf("READY_TO_REVEAL"),
    );
    expect(stateTrace.indexOf("READY_TO_REVEAL")).toBeLessThan(
      stateTrace.indexOf("REVEALED"),
    );

    await page.goto("about:blank");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const startedAt = Date.now();
    await openBootstrap(page, "?scenario=noncritical-failure#beneficios");
    await expectTerminalBootstrap(page, "REVEALED", 4_000);
    expect(Date.now() - startedAt).toBeLessThan(3_500);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "application-benefits",
    );
  });

  test("fails open on the hard timeout and on positioning failure", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await openBootstrap(page, "?scenario=timeout#contato");
    await expect(page.locator(COVER)).toBeVisible();
    await page.waitForTimeout(1_000);
    await expect(page.locator(COVER)).toBeVisible();
    await expectTerminalBootstrap(page, "DEGRADED", 7_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hard-timeout",
    );
    await expect(page.locator("#contato")).toBeInViewport();

    await page.goto("about:blank");
    await openBootstrap(page, "?scenario=projection-failure#sobre");
    await expectTerminalBootstrap(page, "DEGRADED", 3_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "positioning-error",
    );
    await expect(page.locator("#sobre")).toBeInViewport();
  });

  test("keeps the same destination for reduced motion and same-session refresh", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openBootstrap(page, "#como-funciona");
    await expectTerminalBootstrap(page, "REVEALED", 3_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "application-how-it-works",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-reduced-motion",
      "true",
    );

    const historyLength = await page.evaluate(() => history.length);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectTerminalBootstrap(page, "REVEALED", 3_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "application-how-it-works",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-session-repeated",
      "true",
    );
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
  });

  test("restores Back and Forward without bootstrap-created duplicate entries", async ({
    page,
  }) => {
    await openBootstrap(page);
    await expectTerminalBootstrap(page);
    const initialLength = await page.evaluate(() => history.length);

    await page.locator('header a[href="#projetos"]').click();
    await expect(page).toHaveURL(/#projetos$/u);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-projects",
    );
    await page.locator('header a[href="#contato"]').click();
    await expect(page).toHaveURL(/#contato$/u);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-contact",
    );
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);

    await page.goBack();
    await expect(page).toHaveURL(/#projetos$/u);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-projects",
    );
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);

    await page.goForward();
    await expect(page).toHaveURL(/#contato$/u);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "professional-contact",
    );
    expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);
  });

  test("reconciles resize during boot and retains the mobile vertical Home origin", async ({
    page,
  }) => {
    await page.setViewportSize({ height: 900, width: 1200 });
    await openBootstrap(page, "?scenario=slow-critical");
    await expect(page.locator(COVER)).toBeVisible();
    await page.setViewportSize({ height: 844, width: 390 });
    await expectTerminalBootstrap(page, "REVEALED", 6_000);

    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-destination",
      "home",
    );
    await expect(page.locator("#home")).toBeInViewport();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });

  test("fails open while hidden and does not re-lock after visibility returns", async ({
    page,
  }) => {
    await openBootstrap(page, "?scenario=slow-critical#contato");
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "WAITING_CRITICAL",
    );

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expectTerminalBootstrap(page, "DEGRADED", 3_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hidden-document",
    );

    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "visible",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "DEGRADED",
    );
    await expect(page.locator(COVER)).toHaveCount(0);
    await expect(page.locator(STORY_MAIN)).not.toHaveAttribute("inert");
    await expect(page.locator("#contato")).toBeInViewport();
  });

  test("keeps SSR content usable when JavaScript hydration is delayed past fail-open", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await page.route("**/*", async (route) => {
      if (route.request().resourceType() === "script") {
        await new Promise((resolve) => setTimeout(resolve, 5_800));
      }
      await route.continue();
    });

    const response = await page.goto(`${BOOTSTRAP_PATH}#projetos`, {
      waitUntil: "commit",
    });
    expect(response?.ok()).toBe(true);
    await expect(page.locator(STORY_MAIN)).toBeVisible({ timeout: 4_000 });
    await expect(page.locator(COVER)).toBeVisible();
    await expect(page.locator(COVER)).toBeHidden({ timeout: 7_000 });
    await expect(page.locator(STORY_MAIN)).not.toHaveAttribute("inert");

    await page.waitForLoadState("domcontentloaded", { timeout: 20_000 });
    await expectTerminalBootstrap(page, "DEGRADED", 4_000);
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-degraded-reason",
      "hard-timeout",
    );
    await expect(page.locator(ROOT)).toHaveAttribute(
      "data-bootstrap-release-cause",
      "css-fail-open",
    );
    await expect(page.locator(STORY_MAIN)).not.toHaveAttribute("inert");
    await expect(page.locator("#projetos")).toBeInViewport();
  });
});

test.describe("Phase-4 no-JavaScript fail-open", () => {
  test.skip(productionServer, "Development-only Phase-4 review surface");

  test("the SSR cover releases and leaves the semantic story usable", async ({
    browser,
  }: {
    browser: Browser;
  }) => {
    test.setTimeout(20_000);
    const context = await browser.newContext({
      javaScriptEnabled: false,
      locale: "pt-BR",
      viewport: { height: 844, width: 390 },
    });

    try {
      const page = await context.newPage();
      const response = await page.goto(`${BOOTSTRAP_PATH}#projetos`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.ok()).toBe(true);
      await expect(page.locator(STORY_MAIN)).toBeVisible();
      await expect(page.locator(COVER)).toBeVisible();
      await expect(page.locator(COVER)).toBeHidden({ timeout: 7_000 });
      await expect(page.locator("#projetos")).toBeInViewport();
      await expect(page.locator('header a[href="#contato"]')).toBeVisible();
    } finally {
      await context.close();
    }
  });
});
