import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";
const MOTION_PATH = "/__visual-lab/story/motion";
const MOTION_ROOT = "main[data-motion-lab]";
const BOOTSTRAP_ROOT = "[data-story-bootstrap]";
const CONTRACT_PATH = `${MOTION_PATH}?scenario=app04-media-contract`;

const APPLICATION_CHAPTER_IDS = [
  "application-overview",
  "application-how-it-works",
  "application-benefits",
  "application-demo",
  "application-access",
  "application-terminal",
] as const;

const APPLICATION_SCENES = [
  "overview",
  "how-it-works",
  "benefits",
  "demo",
  "access",
  "terminal",
] as const;

const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

interface MediaDebugSnapshot {
  readonly currentTime: number;
  readonly pauses: number;
  readonly plays: number;
  readonly rejectPlay: boolean;
}

async function installMediaContract(
  page: Page,
  { rejectPlay = false }: { readonly rejectPlay?: boolean } = {},
) {
  await page.route("**/__phase8-app04-contract/**", async (route) => {
    const url = route.request().url();
    if (url.endsWith(".webp")) {
      await route.fulfill({
        body: ONE_PIXEL_PNG,
        contentType: "image/png",
        status: 200,
      });
      return;
    }

    await route.fulfill({
      body: Buffer.alloc(0),
      contentType: url.endsWith(".webm") ? "video/webm" : "video/mp4",
      status: 200,
    });
  });

  await page.addInitScript((initialRejectPlay) => {
    const mediaTimes = new WeakMap<HTMLMediaElement, number>();
    let hidden = false;
    const state = {
      pauses: 0,
      plays: 0,
      rejectPlay: initialRejectPlay,
    };

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => hidden,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      configurable: true,
      get() {
        return mediaTimes.get(this) ?? 0;
      },
      set(value: number) {
        mediaTimes.set(this, value);
      },
    });
    HTMLMediaElement.prototype.play = function play() {
      state.plays += 1;
      if (state.rejectPlay) {
        return Promise.reject(new DOMException("Denied", "NotAllowedError"));
      }
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function pause() {
      state.pauses += 1;
      this.dispatchEvent(new Event("pause"));
    };

    Object.defineProperty(window, "__WFLYER_APP04_TEST__", {
      configurable: true,
      value: {
        setHidden(value: boolean) {
          hidden = value;
          document.dispatchEvent(new Event("visibilitychange"));
        },
        setRejectPlay(value: boolean) {
          state.rejectPlay = value;
        },
        snapshot(): MediaDebugSnapshot {
          const video = document.querySelector("video");
          return {
            currentTime: video?.currentTime ?? 0,
            pauses: state.pauses,
            plays: state.plays,
            rejectPlay: state.rejectPlay,
          };
        },
      },
    });
  }, rejectPlay);
}

async function openMotionLab(page: Page, suffix = "") {
  const response = await page.goto(`${MOTION_PATH}${suffix}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);
  await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-lifecycle",
    "mounted",
  );
}

async function openContractLab(page: Page, hash = "") {
  await installMediaContract(page);
  const response = await page.goto(`${CONTRACT_PATH}${hash}`, {
    waitUntil: "domcontentloaded",
  });
  expect(response?.ok()).toBe(true);
  await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
    "data-bootstrap-state",
    "REVEALED",
    { timeout: 10_000 },
  );
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-lifecycle",
    "mounted",
  );
}

async function positionImmediately(page: Page, chapterId: string) {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (controller === undefined) throw new Error("Missing motion controller.");
    await controller.position(
      requestedChapterId as Parameters<typeof controller.position>[0],
    );
  }, chapterId);
  await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
    "data-motion-active-chapter",
    chapterId,
  );
}

async function mediaSnapshot(page: Page): Promise<MediaDebugSnapshot> {
  return page.evaluate(() => {
    const debug = (
      window as typeof window & {
        __WFLYER_APP04_TEST__?: { snapshot(): MediaDebugSnapshot };
      }
    ).__WFLYER_APP04_TEST__;
    if (debug === undefined) throw new Error("Missing APP-04 test bridge.");
    return debug.snapshot();
  });
}

async function setHidden(page: Page, hidden: boolean) {
  await page.evaluate((value) => {
    const debug = (
      window as typeof window & {
        __WFLYER_APP04_TEST__?: { setHidden(next: boolean): void };
      }
    ).__WFLYER_APP04_TEST__;
    if (debug === undefined) throw new Error("Missing APP-04 test bridge.");
    debug.setHidden(value);
  }, hidden);
}

async function installLaunchInterestContract(
  page: Page,
  acknowledgment: "pending" | "sent" = "sent",
) {
  const requests: unknown[] = [];
  await page.route("**/turnstile/v0/api.js*", async (route) => {
    await route.fulfill({
      body: "",
      contentType: "application/javascript",
      status: 200,
    });
  });
  await page.route("**/api/app-launch-interest", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      body: JSON.stringify({ acknowledgment, ok: true, registered: true }),
      contentType: "application/json",
      status: 200,
    });
  });
  await page.addInitScript(() => {
    window.turnstile = {
      remove() {},
      render(container, options) {
        void container;
        queueMicrotask(() => options.callback("phase-9-browser-token"));
        return "phase-9-launch-interest";
      },
      reset() {},
    };
  });

  return requests;
}

test("the Phase-8 Application review surface remains development-only", async ({
  page,
  request,
}) => {
  const response = await page.goto(MOTION_PATH, {
    waitUntil: "domcontentloaded",
  });

  if (!productionServer) {
    expect(response?.ok()).toBe(true);
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-application-scenes",
      "phase-8",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/u,
    );
    return;
  }

  expect(response?.status()).toBe(404);
  await expect(page.locator('[data-application-scenes="phase-8"]')).toHaveCount(
    0,
  );
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("__visual-lab");
});

test.describe("Phase-8 Application branch scenes", () => {
  test.skip(productionServer, "Development-only Phase-8 review surface");

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1536 });
  });

  test("renders the exact Application sequence and content boundaries", async ({
    page,
  }) => {
    await openMotionLab(page);

    expect(
      await page
        .locator(`${MOTION_ROOT} [data-chapter-id^="application-"]`)
        .evaluateAll((chapters) =>
          chapters.map((chapter) => chapter.getAttribute("data-chapter-id")),
        ),
    ).toEqual(APPLICATION_CHAPTER_IDS);
    expect(
      await page.locator("[data-application-scene]").evaluateAll((scenes) =>
        scenes.map((scene) => scene.getAttribute("data-application-scene")),
      ),
    ).toEqual(APPLICATION_SCENES);
    await expect(
      page.locator('[data-story-scene-contract="phase-8"]'),
    ).toHaveCount(6);
    await expect(
      page.locator("[data-application-overview-concept]"),
    ).toHaveCount(3);
    await expect(page.locator("[data-application-how-step]")).toHaveCount(5);
    await expect(page.locator("[data-application-benefit]")).toHaveCount(4);
    await expect(page.locator('[data-primary-app-access="true"]')).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("form", { name: "Aviso de lançamento da aplicação" }),
    ).toHaveCount(1);
    await expect(
      page.locator(
        '[data-chapter-id]:not([data-chapter-id="application-access"]) [data-primary-app-access="true"]',
      ),
    ).toHaveCount(0);
    await expect(
      page.locator('header[data-story-v2-header] a[href^="https://app.wflyer.com.br"]'),
    ).toHaveCount(0);
  });

  for (const [acknowledgment, expectedStatus] of [
    ["sent", /Enviaremos apenas o aviso de lançamento/u],
    ["pending", /seu registro foi preservado/u],
  ] as const) {
    test(`keeps PRELAUNCH operable when acknowledgment is ${acknowledgment}`, async ({
      page,
    }) => {
      const requests = await installLaunchInterestContract(
        page,
        acknowledgment,
      );
      await openMotionLab(page, "#lancamento");
      await positionImmediately(page, "application-access");

      const form = page.getByRole("form", {
        name: "Aviso de lançamento da aplicação",
      });
      await expect(form).toHaveAttribute(
        "data-app-launch-interest-state",
        "IDLE",
      );
      await expect(
        form.getByRole("link", { name: "Política de Privacidade" }),
      ).toHaveAttribute("href", "/politica-de-privacidade");
      await form.locator('input[name="email"]').fill("visitante@example.com");
      await form.getByRole("checkbox").check();
      await form.getByRole("button", { name: "Quero receber o aviso" }).click();

      await expect(form).toHaveAttribute(
        "data-app-launch-interest-state",
        "SUCCESS",
      );
      await expect(form.getByRole("status")).toHaveText(expectedStatus);
      expect(requests).toEqual([
        {
          consent: true,
          email: "visitante@example.com",
          honeypot: "",
          turnstileToken: "phase-9-browser-token",
        },
      ]);
    });
  }

  test("uses the deterministic missing-media state without inventing final assets", async ({
    page,
  }) => {
    await openMotionLab(page, "#demonstracao");
    await positionImmediately(page, "application-demo");

    const device = page.locator("[data-application-demo-device]");
    await expect(device).toHaveAttribute("data-app04-media-contract", "missing");
    await expect(device).toHaveAttribute("data-app04-state", "ERROR_STATIC");
    await expect(device.locator("[data-app04-deterministic-fallback]")).toContainText(
      "aguardam fornecimento e aprovação humana",
    );
    await expect(device.locator("video, img, picture, canvas")).toHaveCount(0);
    await expect(device.locator("button, a, input, select, textarea")).toHaveCount(
      0,
    );
  });

  test("fits every Application scene at the wide and minimum enhanced viewports", async ({
    page,
  }) => {
    await openMotionLab(page);

    for (const viewport of [
      { height: 900, width: 1536 },
      { height: 640, width: 1100 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
        "data-projection-mode",
        "horizontal-enhanced",
      );

      for (const chapterId of APPLICATION_CHAPTER_IDS) {
        await positionImmediately(page, chapterId);
        const contained = await page.evaluate((requestedChapterId) => {
          const scene = document.querySelector<HTMLElement>(
            `[data-chapter-id="${requestedChapterId}"] [data-application-scene]`,
          );
          const stage = document.querySelector<HTMLElement>("[data-motion-stage]");
          if (scene === null || stage === null) return false;
          const inner = scene.getBoundingClientRect();
          const outer = stage.getBoundingClientRect();
          return (
            inner.left >= outer.left - 3 &&
            inner.right <= outer.right + 3 &&
            inner.top >= outer.top - 3 &&
            inner.bottom <= outer.bottom + 3
          );
        }, chapterId);
        expect(contained, `${chapterId} at ${viewport.width}x${viewport.height}`).toBe(
          true,
        );
      }
    }
  });

  test("starts only on first active entry and pauses or resumes without seeking", async ({
    page,
  }) => {
    await openContractLab(page);
    const device = page.locator("[data-application-demo-device]");

    await expect(device).toHaveAttribute("data-app04-state", "NOT_STARTED");
    expect((await mediaSnapshot(page)).plays).toBe(0);

    await positionImmediately(page, "application-benefits");
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await expect(device).toHaveAttribute("data-app04-state", "NOT_STARTED");
    expect((await mediaSnapshot(page)).plays).toBe(0);

    await positionImmediately(page, "application-demo");
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");
    await expect.poll(async () => (await mediaSnapshot(page)).plays).toBe(1);
    await page.locator("video").evaluate((video) => {
      (video as HTMLVideoElement).currentTime = 4.25;
    });

    await positionImmediately(page, "application-access");
    await expect.poll(async () => (await mediaSnapshot(page)).pauses).toBeGreaterThan(
      0,
    );
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");

    await positionImmediately(page, "application-demo");
    await expect.poll(async () => (await mediaSnapshot(page)).plays).toBe(2);
    expect((await mediaSnapshot(page)).currentTime).toBeCloseTo(4.25, 2);
  });

  test("pauses on a hidden tab and resumes only while still active and unfinished", async ({
    page,
  }) => {
    await openContractLab(page, "#demonstracao");
    await positionImmediately(page, "application-demo");
    const device = page.locator("[data-application-demo-device]");
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");
    const initial = await mediaSnapshot(page);

    await setHidden(page, true);
    await expect(device).toHaveAttribute("data-app04-document-visible", "false");
    await expect.poll(async () => (await mediaSnapshot(page)).pauses).toBeGreaterThan(
      initial.pauses,
    );

    await setHidden(page, false);
    await expect(device).toHaveAttribute("data-app04-document-visible", "true");
    await expect.poll(async () => (await mediaSnapshot(page)).plays).toBe(
      initial.plays + 1,
    );

    await positionImmediately(page, "application-access");
    const afterLeave = await mediaSnapshot(page);
    await setHidden(page, true);
    await setHidden(page, false);
    expect((await mediaSnapshot(page)).plays).toBe(afterLeave.plays);
  });

  test("shows final-frame media and supports pointer, Enter, and Space replay", async ({
    page,
  }) => {
    await openContractLab(page, "#demonstracao");
    await positionImmediately(page, "application-demo");
    const device = page.locator("[data-application-demo-device]");
    const video = device.locator("video");

    await video.evaluate((element) => element.dispatchEvent(new Event("ended")));
    await expect(device).toHaveAttribute("data-app04-state", "FINAL_FRAME");
    await expect(
      device.locator('[data-app04-static-media="final-frame"]'),
    ).toBeVisible();
    const replay = device.getByRole("button", {
      name: "Reproduzir demonstração novamente",
    });
    await expect(replay).toBeVisible();
    expect(
      await device.locator("[data-app04-screen]").evaluate((screen) =>
        Array.from(
          screen.querySelectorAll<HTMLElement>(
            "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
          ),
          (control) => control.getAttribute("data-app04-replay-control"),
        ),
      ),
    ).toEqual([""]);

    await video.evaluate((element) => {
      (element as HTMLVideoElement).currentTime = 9;
    });
    await replay.click();
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");
    expect((await mediaSnapshot(page)).currentTime).toBe(0);

    await video.evaluate((element) => element.dispatchEvent(new Event("ended")));
    await replay.focus();
    await replay.press("Enter");
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");

    await video.evaluate((element) => element.dispatchEvent(new Event("ended")));
    await replay.focus();
    await replay.press("Space");
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");
  });

  test("recovers from play rejection and preserves a static state on media error", async ({
    page,
  }) => {
    await installMediaContract(page, { rejectPlay: true });
    await page.goto(`${CONTRACT_PATH}#demonstracao`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    await positionImmediately(page, "application-demo");
    const device = page.locator("[data-application-demo-device]");
    await expect(device).toHaveAttribute("data-app04-state", "ERROR_STATIC");
    await expect(device.locator('[data-app04-static-media="poster"]')).toBeVisible();

    await page.evaluate(() => {
      const debug = (
        window as typeof window & {
          __WFLYER_APP04_TEST__?: { setRejectPlay(value: boolean): void };
        }
      ).__WFLYER_APP04_TEST__;
      if (debug === undefined) throw new Error("Missing APP-04 test bridge.");
      debug.setRejectPlay(false);
    });
    await device.getByRole("button", { name: "Reproduzir demonstração" }).click();
    await expect(device).toHaveAttribute("data-app04-state", "PLAYING");

    await device.locator("video").evaluate((video) =>
      video.dispatchEvent(new Event("error")),
    );
    await expect(device).toHaveAttribute("data-app04-state", "ERROR_STATIC");
    await expect(device.locator("[data-app04-deterministic-fallback]")).toBeVisible();
    await positionImmediately(page, "application-access");
    await expect(
      page.getByRole("form", { name: "Aviso de lançamento da aplicação" }),
    ).toBeVisible();
    await expect(page.locator('[data-primary-app-access="true"]')).toHaveCount(0);
  });

  test("keeps reduced motion static until explicit replay and supports touch", async ({
    baseURL,
    browser,
  }) => {
    const context = await browser.newContext({
      ...(baseURL === undefined ? {} : { baseURL }),
      hasTouch: true,
      locale: "pt-BR",
      reducedMotion: "reduce",
      viewport: { height: 844, width: 390 },
    });
    const page = await context.newPage();

    try {
      await installMediaContract(page);
      await page.goto(`${CONTRACT_PATH}#demonstracao`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
        "data-bootstrap-state",
        "REVEALED",
        { timeout: 10_000 },
      );
      await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
        "data-projection-mode",
        "static",
      );
      await positionImmediately(page, "application-demo");
      const device = page.locator("[data-application-demo-device]");
      await expect(device).toHaveAttribute("data-app04-state", "REDUCED_STATIC");
      expect((await mediaSnapshot(page)).plays).toBe(0);

      await device.getByRole("button", { name: "Reproduzir demonstração" }).tap();
      await expect(device).toHaveAttribute("data-app04-state", "PLAYING");
      await expect.poll(async () => (await mediaSnapshot(page)).plays).toBe(1);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    } finally {
      await context.close();
    }
  });

  test("keeps Launch last, removes the duplicate immersive footer, and places the barline before terminal", async ({
    page,
  }) => {
    await installLaunchInterestContract(page);
    await openMotionLab(page, "#lancamento");
    await positionImmediately(page, "application-access");
    const access = page.locator('[data-application-scene="access"]');
    await expect(
      access.getByRole("form", { name: "Aviso de lançamento da aplicação" }),
    ).toHaveAttribute(
      "data-app-launch-interest-state",
      "IDLE",
    );
    await expect(access.locator('[data-primary-app-access="true"]')).toHaveCount(0);

    await positionImmediately(page, "application-terminal");
    const terminalScene = page.locator('[data-application-scene="terminal"]');
    const barline = terminalScene.locator(
      '[data-final-barline-before="application-terminal"]',
    );
    const terminal = terminalScene.locator('[data-branch-terminal="application"]');
    await expect(barline).toHaveAttribute(
      "data-score-integration-status",
      "phase-9-integrated",
    );
    await expect(barline).toHaveAttribute(
      "data-score-render-owner",
      "story-score-layer",
    );
    await expect(
      page.locator(
        '[data-score-branch="application"] [data-score-role="final-barline-thin"]',
      ),
    ).toHaveCount(1);
    await expect(
      page.locator(
        '[data-score-branch="application"] [data-score-role="final-barline-thick"]',
      ),
    ).toHaveCount(1);
    expect(
      await terminalScene.evaluate((scene) => {
        const line = scene.querySelector(
          '[data-final-barline-before="application-terminal"]',
        );
        const ending = scene.querySelector('[data-branch-terminal="application"]');
        return Boolean(
          line &&
            ending &&
            line.compareDocumentPosition(ending) &
              Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
    await expect(terminal).toBeVisible();
    await expect(
      terminalScene.getByRole("navigation", {
        name: "Conclusão do percurso da aplicação",
      }),
    ).toBeVisible();
    await expect(terminalScene.locator("footer")).toHaveCount(0);
    await expect(page.locator("[data-story-global-footer]")).toHaveCount(0);

    expect(
      await page.evaluate(() => {
        const accessChapter = document.querySelector(
          '[data-chapter-id="application-access"]',
        );
        const terminalChapter = document.querySelector(
          '[data-chapter-id="application-terminal"]',
        );
        return Boolean(
          accessChapter &&
            terminalChapter &&
            accessChapter.compareDocumentPosition(terminalChapter) &
              Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);
  });

  test("preserves the Application branch on resize and driver failure without Music integration", async ({
    page,
  }) => {
    await openMotionLab(page, "#beneficios");
    await positionImmediately(page, "application-benefits");
    await page.setViewportSize({ height: 900, width: 700 });
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-compact",
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-motion-active-chapter",
      "application-benefits",
    );
    await expect(page.locator("[data-application-scene]")).toHaveCount(6);

    await page.setViewportSize({ height: 900, width: 1536 });
    await page.goto(`${MOTION_PATH}?scenario=motion-failure#beneficios`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator(BOOTSTRAP_ROOT)).toHaveAttribute(
      "data-bootstrap-state",
      "REVEALED",
      { timeout: 10_000 },
    );
    await expect(page.locator(MOTION_ROOT)).toHaveAttribute(
      "data-projection-mode",
      "vertical-wide",
    );
    await expect(page.locator("[data-application-scene]")).toHaveCount(6);
    await expect(page.locator("[data-story-score-layer]")).toHaveCount(1);
    await expect(page.locator("[data-score-role]"))
      .not.toHaveCount(0);
    await expect(
      page.locator(
        '[data-chapter-id^="application-"] [data-score-integration-status="phase-9-integrated"]',
      ),
    ).toHaveCount(6);
  });

  test("passes axe with the fallback, replay, Access, and terminal controls", async ({
    page,
  }) => {
    await installLaunchInterestContract(page);
    await page.addInitScript({ content: axe.source });
    await openMotionLab(page, "#demonstracao");

    const findings = await page.evaluate(async () => {
      const axeWindow = window as typeof window & {
        axe: typeof import("axe-core");
      };
      const results = await axeWindow.axe.run("main[data-motion-lab]", {
        resultTypes: ["violations", "incomplete"],
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
        },
      });
      return [
        ...results.violations,
        ...results.incomplete.filter(({ id }) => id === "aria-hidden-focus"),
      ]
        .filter(({ impact }) => impact === "critical" || impact === "serious")
        .map(({ id, nodes }) => ({
          id,
          targets: nodes.map(({ target }) => JSON.stringify(target)),
        }));
    });

    expect(findings).toEqual([]);
  });
});
