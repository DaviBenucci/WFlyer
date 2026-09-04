import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = 43_129;
const suppliedBaseUrl = process.env.WFLYER_EVIDENCE_BASE_URL?.replace(/\/$/u, "");
const baseUrl = suppliedBaseUrl ?? `http://127.0.0.1:${port}`;
const motionPath = "/__visual-lab/story/motion";
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-2026-08-31",
);

const sceneIds = [
  "home",
  "application-overview",
  "application-how-it-works",
  "application-benefits",
  "application-demo",
  "application-access",
  "application-terminal",
  "professional-about",
  "professional-services",
  "professional-process",
  "professional-projects",
  "professional-contact",
  "professional-terminal",
];

const files = [];
const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/`, {
        redirect: "manual",
        signal: AbortSignal.timeout(2_000),
      });
      await response.body?.cancel();
      if (response.status < 500) return;
    } catch {
      // The owned development server is still starting.
    }
    await delay(250);
  }

  throw new Error("The Phase-9 refinement evidence server did not become ready.");
}

async function stopServer(server) {
  if (server.exitCode !== null || server.pid === undefined) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    if (error?.code === "ESRCH") return;
    throw error;
  }

  const deadline = Date.now() + 10_000;
  while (server.exitCode === null && Date.now() < deadline) await delay(100);
  if (server.exitCode === null) {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch (error) {
      if (error?.code !== "ESRCH") throw error;
    }
  }
}

async function openStory(browser, options) {
  const context = await browser.newContext({
    colorScheme: options.theme,
    deviceScaleFactor: 1,
    hasTouch: options.hasTouch ?? false,
    locale: "pt-BR",
    reducedMotion: options.reducedMotion ?? "no-preference",
    viewport: options.viewport,
  });
  await context.route("**/turnstile/v0/api.js*", async (route) => {
    await route.fulfill({
      body: "",
      contentType: "application/javascript",
      status: 200,
    });
  });
  await context.addInitScript(() => {
    let widgetIndex = 0;
    window.turnstile = {
      remove() {},
      render(container, configuration) {
        void container;
        widgetIndex += 1;
        queueMicrotask(() =>
          configuration.callback("phase-9-refinement-evidence-token"),
        );
        return `phase-9-refinement-evidence-${widgetIndex}`;
      },
      reset() {},
    };
  });
  const page = await context.newPage();
  await page.addInitScript((theme) => {
    window.localStorage.setItem("wf-theme", theme);
  }, options.theme);
  await page.goto(`${baseUrl}${motionPath}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-story-bootstrap]")
        ?.getAttribute("data-bootstrap-state") === "REVEALED" &&
      document.querySelector("[data-bootstrap-cover]") === null &&
      document
        .querySelector("main[data-motion-lab]")
        ?.getAttribute("data-motion-lifecycle") === "mounted",
    undefined,
    { timeout: 15_000 },
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
  await page.addStyleTag({
    content: `
      nextjs-portal { display: none !important; }
      *, *::before, *::after {
        animation-duration: 0s !important;
        caret-color: transparent !important;
        transition-duration: 0s !important;
      }
      [data-phase9-diagnostic-target="true"] {
        outline: 3px solid #27d3e8 !important;
        outline-offset: 4px !important;
      }
      [data-phase9-diagnostic-muted="true"] {
        opacity: 0.12 !important;
      }
      [data-phase9-diagnostic-focus="true"] {
        opacity: 1 !important;
        stroke: #27d3e8 !important;
        stroke-width: 3px !important;
      }
      [data-phase9-diagnostic-label] {
        background: #081013;
        border: 1px solid #27d3e8;
        border-radius: 999px;
        color: #f4ecdf;
        font: 700 13px/1.2 system-ui, sans-serif;
        left: 20px;
        letter-spacing: 0.04em;
        padding: 9px 13px;
        pointer-events: none;
        position: fixed;
        top: 88px;
        z-index: 2147483646;
      }
      [data-phase9-diagnostic-anchor] {
        background: #27d3e8;
        border: 2px solid #081013;
        border-radius: 999px;
        box-shadow: 0 0 0 3px rgba(39, 211, 232, 0.5);
        height: 12px;
        pointer-events: none;
        position: fixed;
        transform: translate(-50%, -50%);
        width: 12px;
        z-index: 2147483645;
      }
    `,
  });

  return { context, page };
}

async function position(page, chapterId) {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (!controller) throw new Error("The motion controller is unavailable.");
    await controller.position(requestedChapterId);
  }, chapterId);
  await page.waitForFunction(
    (requestedChapterId) =>
      document
        .querySelector("main[data-motion-lab]")
        ?.getAttribute("data-motion-active-chapter") === requestedChapterId,
    chapterId,
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function assertScoreContract(page, expectedProjection) {
  const proof = await page.evaluate(() => {
    const layer = document.querySelector("[data-story-score-layer]");
    const root = document.querySelector("main[data-motion-lab]");
    return {
      composerInvocations: Number(
        layer?.getAttribute("data-score-composer-invocations"),
      ),
      connectorEvents: Number(
        layer?.getAttribute("data-score-connector-events"),
      ),
      howMeasurement: layer?.getAttribute("data-score-how-measurement-source"),
      maximumNotationTangent: Number(
        layer?.getAttribute("data-score-maximum-notation-tangent"),
      ),
      pathIntersections: Number(
        layer?.getAttribute("data-score-path-self-intersections"),
      ),
      projection: root?.getAttribute("data-projection-mode"),
      servicesMeasurement: layer?.getAttribute(
        "data-score-services-measurement-source",
      ),
      staffIntersections: Number(
        layer?.getAttribute("data-score-staff-line-self-intersections"),
      ),
    };
  });

  if (
    proof.projection !== expectedProjection ||
    proof.composerInvocations !== 2 ||
    proof.connectorEvents !== 0 ||
    proof.pathIntersections !== 0 ||
    proof.staffIntersections !== 0 ||
    proof.maximumNotationTangent > 18 ||
    (expectedProjection === "horizontal-enhanced" &&
      (proof.servicesMeasurement !== "dom-measured" ||
        proof.howMeasurement !== "dom-measured"))
  ) {
    throw new Error(`Score capture precondition failed: ${JSON.stringify(proof)}`);
  }
}

async function captureViewport(page, definition) {
  if (definition.reviewTarget === "application-access") {
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-app-launch-interest-state]")
          ?.getAttribute("data-app-launch-interest-state") === "IDLE",
    );
  }
  if (definition.reviewTarget === "professional-contact") {
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-verification-state]")
          ?.getAttribute("data-verification-state") === "deferred",
    );
  }
  const outputPath = path.join(outputDirectory, definition.fileName);
  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    path: outputPath,
  });
  const proof = await page.evaluate(() => ({
    activeChapter: document
      .querySelector("main[data-motion-lab]")
      ?.getAttribute("data-motion-active-chapter"),
    projection: document
      .querySelector("main[data-motion-lab]")
      ?.getAttribute("data-projection-mode"),
    url: window.location.href,
  }));
  files.push({
    activeChapter: proof.activeChapter,
    fileName: definition.fileName,
    height: definition.viewport.height,
    kind: definition.kind,
    projection: proof.projection,
    reviewTarget: definition.reviewTarget,
    route: new URL(proof.url).pathname,
    selectionMethod: "window.__WFLYER_PHASE5_MOTION__.position(chapterId)",
    theme: definition.theme,
    width: definition.viewport.width,
  });
}

async function clearDiagnostics(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "[data-phase9-diagnostic-target], [data-phase9-diagnostic-muted], [data-phase9-diagnostic-focus]",
      )
      .forEach((element) => {
        element.removeAttribute("data-phase9-diagnostic-target");
        element.removeAttribute("data-phase9-diagnostic-muted");
        element.removeAttribute("data-phase9-diagnostic-focus");
      });
    document
      .querySelectorAll(
        "[data-phase9-diagnostic-label], [data-phase9-diagnostic-anchor]",
      )
      .forEach((element) => element.remove());
  });
}

async function applyInteractionDiagnostic(page, definition) {
  const proof = await page.evaluate((requested) => {
    const chapter = document.querySelector(
      `[data-chapter-id="${requested.chapterId}"]`,
    );
    const cards = Array.from(
      chapter?.querySelectorAll(requested.cardSelector) ?? [],
    ).sort(
      (left, right) =>
        left.getBoundingClientRect().left - right.getBoundingClientRect().left,
    );
    const branch = document.querySelector(
      `[data-score-branch="${requested.branch}"]`,
    );
    const interactionLines = Array.from(
      branch?.querySelectorAll(
        '[data-score-role="staff-line"][data-score-primitive-id*="card-score-interaction"]',
      ) ?? [],
    );
    const focusedLines = interactionLines.filter((line) =>
      line
        .getAttribute("data-score-primitive-id")
        ?.includes(`:${requested.phase}:`),
    );
    interactionLines.forEach((line) =>
      line.setAttribute("data-phase9-diagnostic-muted", "true"),
    );
    focusedLines.forEach((line) =>
      line.setAttribute("data-phase9-diagnostic-focus", "true"),
    );

    const targetCards =
      requested.phase === "expanded"
        ? cards
        : [cards[requested.targetCardIndex]].filter(Boolean);
    targetCards.forEach((card) =>
      card.setAttribute("data-phase9-diagnostic-target", "true"),
    );
    const label = document.createElement("div");
    label.setAttribute("data-phase9-diagnostic-label", requested.label);
    label.textContent = requested.label;
    document.body.append(label);

    return {
      cardCount: cards.length,
      focusedLineCount: focusedLines.length,
      targetCardCount: targetCards.length,
    };
  }, definition);

  if (
    proof.cardCount !== definition.expectedCardCount ||
    proof.focusedLineCount === 0 ||
    proof.targetCardCount === 0
  ) {
    throw new Error(
      `${definition.label} diagnostic failed: ${JSON.stringify(proof)}`,
    );
  }
}

async function applyProjectDiagnostic(page, projectIndex) {
  const proof = await page.evaluate((requestedProjectIndex) => {
    const chapter = document.querySelector(
      '[data-chapter-id="professional-projects"]',
    );
    const cards = Array.from(
      chapter?.querySelectorAll("[data-project-card-item]") ?? [],
    ).sort(
      (left, right) =>
        Number(left.getAttribute("data-project-position")) -
        Number(right.getAttribute("data-project-position")),
    );
    const layer = document.querySelector("[data-story-score-layer]");
    const track = document.querySelector("[data-motion-track]");
    const visits = JSON.parse(
      layer?.getAttribute("data-score-project-visit-anchors") ?? "[]",
    );
    const card = cards[requestedProjectIndex - 1];
    const visit = visits[requestedProjectIndex - 1];
    if (!card || !visit || !track) {
      return { cardCount: cards.length, hasVisit: Boolean(visit) };
    }

    card.setAttribute("data-phase9-diagnostic-target", "true");
    const trackRect = track.getBoundingClientRect();
    const anchor = document.createElement("div");
    anchor.setAttribute(
      "data-phase9-diagnostic-anchor",
      String(requestedProjectIndex),
    );
    anchor.style.left = `${trackRect.left + visit.anchor.x}px`;
    anchor.style.top = `${trackRect.top + visit.anchor.y}px`;
    document.body.append(anchor);
    const label = document.createElement("div");
    label.setAttribute(
      "data-phase9-diagnostic-label",
      `Projetos · visita ${requestedProjectIndex}`,
    );
    label.textContent = `Projetos · visita ${requestedProjectIndex}`;
    document.body.append(label);

    return {
      anchorInViewport:
        trackRect.left + visit.anchor.x >= 0 &&
        trackRect.left + visit.anchor.x <= window.innerWidth &&
        trackRect.top + visit.anchor.y >= 0 &&
        trackRect.top + visit.anchor.y <= window.innerHeight,
      cardCount: cards.length,
      hasVisit: true,
      measurementSource: visit.measurementSource,
    };
  }, projectIndex);

  if (
    proof.cardCount !== 3 ||
    proof.hasVisit !== true ||
    proof.anchorInViewport !== true ||
    proof.measurementSource !== "dom-measured"
  ) {
    throw new Error(
      `Projects visit ${projectIndex} diagnostic failed: ${JSON.stringify(proof)}`,
    );
  }
}

async function captureDarkDesktop(browser) {
  const viewport = { height: 900, width: 1_536 };
  const { context, page } = await openStory(browser, {
    theme: "dark",
    viewport,
  });

  try {
    await assertScoreContract(page, "horizontal-enhanced");
    for (const [index, chapterId] of sceneIds.entries()) {
      await position(page, chapterId);
      await captureViewport(page, {
        fileName: `${String(index + 1).padStart(2, "0")}-scene-${chapterId}-dark-1536x900.png`,
        kind: "scene",
        reviewTarget: chapterId,
        theme: "dark",
        viewport,
      });
    }

    const interactions = [
      {
        branch: "professional",
        cardSelector: "[data-service-module]",
        chapterId: "professional-services",
        expectedCardCount: 4,
        fileName: "14-diagnostic-services-lead-in-dark-1536x900.png",
        label: "Serviços · aproximação",
        phase: "pre-transition",
        targetCardIndex: 0,
      },
      {
        branch: "professional",
        cardSelector: "[data-service-module]",
        chapterId: "professional-services",
        expectedCardCount: 4,
        fileName: "15-diagnostic-services-expanded-dark-1536x900.png",
        label: "Serviços · expansão máxima",
        phase: "expanded",
        targetCardIndex: 0,
      },
      {
        branch: "professional",
        cardSelector: "[data-service-module]",
        chapterId: "professional-services",
        expectedCardCount: 4,
        fileName: "16-diagnostic-services-lead-out-dark-1536x900.png",
        label: "Serviços · recuperação",
        phase: "post-transition",
        targetCardIndex: 3,
      },
      {
        branch: "application",
        cardSelector: "[data-application-how-step]",
        chapterId: "application-how-it-works",
        expectedCardCount: 5,
        fileName: "17-diagnostic-how-lead-in-dark-1536x900.png",
        label: "Como funciona · aproximação",
        phase: "pre-transition",
        targetCardIndex: 4,
      },
      {
        branch: "application",
        cardSelector: "[data-application-how-step]",
        chapterId: "application-how-it-works",
        expectedCardCount: 5,
        fileName: "18-diagnostic-how-expanded-dark-1536x900.png",
        label: "Como funciona · expansão máxima",
        phase: "expanded",
        targetCardIndex: 0,
      },
      {
        branch: "application",
        cardSelector: "[data-application-how-step]",
        chapterId: "application-how-it-works",
        expectedCardCount: 5,
        fileName: "19-diagnostic-how-lead-out-dark-1536x900.png",
        label: "Como funciona · recuperação",
        phase: "post-transition",
        targetCardIndex: 0,
      },
    ];

    for (const definition of interactions) {
      await clearDiagnostics(page);
      await position(page, definition.chapterId);
      await applyInteractionDiagnostic(page, definition);
      await captureViewport(page, {
        fileName: definition.fileName,
        kind: "diagnostic",
        reviewTarget: `${definition.chapterId}:${definition.phase}`,
        theme: "dark",
        viewport,
      });
    }

    for (let projectIndex = 1; projectIndex <= 3; projectIndex += 1) {
      await clearDiagnostics(page);
      await position(page, "professional-projects");
      await applyProjectDiagnostic(page, projectIndex);
      await captureViewport(page, {
        fileName: `${String(19 + projectIndex).padStart(2, "0")}-diagnostic-projects-visit-${projectIndex}-dark-1536x900.png`,
        kind: "diagnostic",
        reviewTarget: `professional-projects:visit-${projectIndex}`,
        theme: "dark",
        viewport,
      });
    }
  } finally {
    await context.close();
  }
}

async function captureResponsiveRegressions(browser) {
  const definitions = [
    {
      chapterId: "home",
      expectedProjection: "horizontal-enhanced",
      fileName: "23-regression-home-light-horizontal-1536x900.png",
      theme: "light",
      viewport: { height: 900, width: 1_536 },
    },
    {
      chapterId: "application-access",
      expectedProjection: "vertical-compact",
      fileName: "24-regression-launch-dark-compact-390x844.png",
      hasTouch: true,
      theme: "dark",
      viewport: { height: 844, width: 390 },
    },
    {
      chapterId: "professional-projects",
      expectedProjection: "vertical-compact",
      fileName: "25-regression-projects-dark-compact-390x844.png",
      hasTouch: true,
      theme: "dark",
      viewport: { height: 844, width: 390 },
    },
  ];

  for (const definition of definitions) {
    const { context, page } = await openStory(browser, definition);
    try {
      await assertScoreContract(page, definition.expectedProjection);
      await position(page, definition.chapterId);
      await captureViewport(page, {
        fileName: definition.fileName,
        kind: "regression",
        reviewTarget: definition.chapterId,
        theme: definition.theme,
        viewport: definition.viewport,
      });
    } finally {
      await context.close();
    }
  }
}

await mkdir(outputDirectory);

let serverOutput = "";
const server = suppliedBaseUrl
  ? null
  : spawn(
      "pnpm",
      [
        "exec",
        "next",
        "dev",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(port),
      ],
      {
        cwd: repositoryRoot,
        detached: true,
        env: {
          ...process.env,
          NEXT_TELEMETRY_DISABLED: "1",
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
          WFLYER_DEPLOYMENT_ENVIRONMENT: "production",
          WFLYER_TRANSITION_TEST_MODE: "1",
          WATCHPACK_POLLING: "true",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
server?.stdout.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-12_000);
});
server?.stderr.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-12_000);
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  await captureDarkDesktop(browser);
  await captureResponsiveRegressions(browser);
  await writeFile(
    path.join(outputDirectory, "capture-manifest.json"),
    `${JSON.stringify(
      {
        browser: {
          engine: "chromium",
          version: browser.version(),
        },
        captureCount: files.length,
        capturedAt: "2026-09-03",
        route: motionPath,
        files,
        viewportScreenshotScale: 1,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
} catch (error) {
  throw new Error(`Phase-9 refinement capture failed.\n${serverOutput}`, {
    cause: error,
  });
} finally {
  await browser?.close();
  if (server !== null) await stopServer(server);
}

console.log(
  `Phase-9 refinement evidence captured: ${files.length} deterministic views.`,
);
