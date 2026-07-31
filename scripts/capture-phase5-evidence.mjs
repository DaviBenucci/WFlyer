import { mkdir } from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const baseUrl = new URL(
  process.env.WFLYER_EVIDENCE_BASE_URL ?? "http://127.0.0.1:43118",
);
const outputDirectory = path.resolve(
  "docs/05-implementacao/evidencias/fase-5",
);

const desktopViewport = { height: 1024, width: 1536 };
const mobileViewport = { height: 844, width: 390 };

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

async function openEvidencePage(
  browser,
  {
    reducedMotion = "no-preference",
    route,
    theme = "light",
    viewport = desktopViewport,
  },
) {
  const context = await browser.newContext({
    colorScheme: theme,
    deviceScaleFactor: 1,
    locale: "pt-BR",
    reducedMotion,
    viewport,
  });

  await context.addInitScript((initialTheme) => {
    window.localStorage.setItem("wf-theme", initialTheme);
  }, theme);

  const page = await context.newPage();
  await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
  await page.locator("main#main-content").waitFor({ state: "visible" });
  await page.waitForFunction(
    () => Boolean(window.__WFLYER_TRANSITION_TEST__),
    undefined,
    { timeout: 10_000 },
  ).catch((error) => {
    throw new Error(
      "The Phase 5 transition test controller is unavailable. Start a local Next.js development server with WFLYER_TRANSITION_TEST_MODE=1.",
      { cause: error },
    );
  });
  await page.waitForFunction(
    (expectedTheme) =>
      document.documentElement.dataset.theme === expectedTheme,
    theme,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  return { context, page };
}

async function holdAt(page, checkpoint) {
  await page.evaluate((nextCheckpoint) => {
    const controller = window.__WFLYER_TRANSITION_TEST__;

    if (!controller) {
      throw new Error("The transition test controller is unavailable.");
    }

    controller.holdAt(nextCheckpoint);
  }, checkpoint);
}

async function releaseTransition(page) {
  await page.evaluate(() => {
    const controller = window.__WFLYER_TRANSITION_TEST__;

    if (!controller) {
      throw new Error("The transition test controller is unavailable.");
    }

    controller.release();
  });
}

async function interruptTransition(page) {
  await page.evaluate(() => {
    const controller = window.__WFLYER_TRANSITION_TEST__;

    if (!controller) {
      throw new Error("The transition test controller is unavailable.");
    }

    controller.interrupt();
  });
}

async function waitForCheckpoint(page, checkpoint, expected) {
  await page.waitForFunction(
    ({ destination, mode, nextCheckpoint, source }) => {
      const layer = document.querySelector(
        "[data-score-transition-layer]",
      );
      const shell = document.querySelector("[data-site-experience]");

      return (
        layer?.getAttribute("data-checkpoint") === nextCheckpoint &&
        shell?.getAttribute("data-transition-source") === source &&
        shell?.getAttribute("data-transition-destination") === destination &&
        shell?.getAttribute("data-transition-mode") === mode
      );
    },
    {
      destination: expected.destination,
      mode: expected.mode,
      nextCheckpoint: checkpoint,
      source: expected.source,
    },
  );
}

async function waitForSettledTransition(page, destination) {
  await page.waitForFunction(
    (expectedDestination) => {
      const layer = document.querySelector(
        "[data-score-transition-layer]",
      );
      const shell = document.querySelector("[data-site-experience]");

      return (
        window.location.pathname === expectedDestination &&
        layer?.getAttribute("data-active") === "false" &&
        shell?.getAttribute("data-active-timelines") === "0" &&
        shell?.getAttribute("data-transition-phase") === "idle"
      );
    },
    destination,
  );
}

async function capture(page, file, { fullPage = false } = {}) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    fullPage,
    path: path.join(outputDirectory, file),
  });
}

async function captureHeldTransition(browser, captureDefinition) {
  const { context, page } = await openEvidencePage(
    browser,
    captureDefinition,
  );

  try {
    await holdAt(page, captureDefinition.checkpoint);
    await page.locator(captureDefinition.link).first().click();
    await waitForCheckpoint(page, captureDefinition.checkpoint, {
      destination: captureDefinition.destination,
      mode: captureDefinition.mode,
      source: captureDefinition.route,
    });

    if (captureDefinition.expectedSegments !== undefined) {
      const segmentCount = await page
        .locator("[data-transition-segment]")
        .count();

      if (segmentCount !== captureDefinition.expectedSegments) {
        throw new Error(
          `${captureDefinition.file} expected ${captureDefinition.expectedSegments} transition segments, but found ${segmentCount}.`,
        );
      }
    }

    if (captureDefinition.assertNoOverflow) {
      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollLocked:
          document
            .querySelector("[data-site-experience]")
            ?.getAttribute("data-scroll-locked") === "true",
        scrollWidth: document.documentElement.scrollWidth,
      }));

      if (layout.scrollLocked || layout.scrollWidth > layout.clientWidth) {
        throw new Error(
          `${captureDefinition.file} did not reach a safe mobile layout.`,
        );
      }
    }

    await capture(page, captureDefinition.file, {
      fullPage: captureDefinition.fullPage,
    });

    if (captureDefinition.checkpoint === "start") {
      await interruptTransition(page);
      await waitForSettledTransition(page, captureDefinition.route);
    } else {
      await releaseTransition(page);
      await waitForSettledTransition(page, captureDefinition.destination);
    }
  } finally {
    await context.close();
  }
}

async function captureTerminal(browser, captureDefinition) {
  const { context, page } = await openEvidencePage(
    browser,
    captureDefinition,
  );

  try {
    const finalBarline = page.locator(
      `[data-final-barline][data-side="${captureDefinition.side}"]`,
    );

    if ((await finalBarline.count()) !== 1) {
      throw new Error(
        `${captureDefinition.file} expected exactly one ${captureDefinition.side} final barline.`,
      );
    }

    await finalBarline.scrollIntoViewIfNeeded();
    await capture(page, captureDefinition.file, { fullPage: true });
  } finally {
    await context.close();
  }
}

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch();

try {
  await captureHeldTransition(browser, {
    checkpoint: "start",
    destination: "/sobre",
    expectedSegments: 2,
    file: "phase05-transition-start.png",
    link: 'header a[href="/sobre"]:visible',
    mode: "home-pivot",
    route: "/aplicacao-wflyer",
  });

  await captureHeldTransition(browser, {
    checkpoint: "midpoint",
    destination: "/sobre",
    expectedSegments: 2,
    file: "phase05-home-pivot-midpoint-dark.png",
    link: 'header a[href="/sobre"]:visible',
    mode: "home-pivot",
    route: "/aplicacao-wflyer",
    theme: "dark",
  });

  await captureHeldTransition(browser, {
    checkpoint: "completion",
    destination: "/servicos",
    expectedSegments: 1,
    file: "phase05-transition-completion.png",
    link: 'main [data-navigation-role="next"]:visible',
    mode: "adjacent-score",
    route: "/sobre",
  });

  await captureTerminal(browser, {
    file: "phase05-benefits-terminal-light.png",
    route: "/aplicacao-wflyer/beneficios",
    side: "start",
    theme: "light",
  });

  await captureTerminal(browser, {
    file: "phase05-contact-terminal-dark.png",
    route: "/contato",
    side: "end",
    theme: "dark",
  });

  await captureHeldTransition(browser, {
    checkpoint: "completion",
    destination: "/servicos",
    expectedSegments: 0,
    file: "phase05-reduced-motion-completion.png",
    fullPage: true,
    link: 'main [data-navigation-role="next"]:visible',
    mode: "adjacent-score",
    reducedMotion: "reduce",
    route: "/sobre",
  });

  await captureHeldTransition(browser, {
    assertNoOverflow: true,
    checkpoint: "completion",
    destination: "/servicos",
    expectedSegments: 0,
    file: "phase05-mobile-completion.png",
    fullPage: true,
    link: 'main [data-navigation-role="next"]:visible',
    mode: "adjacent-score",
    route: "/sobre",
    viewport: mobileViewport,
  });
} finally {
  await browser.close();
}

console.log("Phase 5 evidence captured: 7 deterministic views.");
