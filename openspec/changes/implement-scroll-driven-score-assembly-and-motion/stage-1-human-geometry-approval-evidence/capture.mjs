import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, devices, firefox, webkit } from "playwright";

const evidenceDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(evidenceDirectory, "../../../..");
const screenshotsDirectory = path.join(evidenceDirectory, "screenshots");
const port = 43_137;
const suppliedBaseUrl = process.env.WFLYER_EVIDENCE_BASE_URL?.replace(/\/$/u, "");
const baseUrl = suppliedBaseUrl ?? `http://127.0.0.1:${port}`;
const motionPath = "/__visual-lab/story/motion";
const validationResultsPath = path.join(
  repositoryRoot,
  "openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-portfolio-geometry-validation-results.json",
);

const browserDefinitions = {
  chromium: { descriptor: devices["Desktop Chrome"], launcher: chromium },
  firefox: { descriptor: devices["Desktop Firefox"], launcher: firefox },
  webkit: { descriptor: devices["Desktop Safari"], launcher: webkit },
};

const definitions = [
  {
    evidenceId: "HGE-001",
    browser: "chromium",
    viewport: { width: 1536, height: 900 },
    chapter: "home",
    expectedMode: "horizontal-enhanced",
    expectedCapacity: "PASS",
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-GEO-02",
    purpose: "Home / single spatial origin",
  },
  {
    evidenceId: "HGE-002",
    browser: "chromium",
    viewport: { width: 1536, height: 900 },
    chapter: "professional-process",
    expectedMode: "horizontal-enhanced",
    expectedCapacity: "PASS",
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-LIFE-01",
    purpose: "Normal desktop Professional progression",
  },
  {
    evidenceId: "HGE-003",
    browser: "webkit",
    viewport: { width: 1536, height: 900 },
    chapter: "professional-projects",
    expectedMode: "horizontal-enhanced",
    expectedCapacity: "PASS",
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "WEBKIT-PC-04",
    purpose: "Projects horizontal-enhanced and representative WebKit rendering",
  },
  {
    evidenceId: "HGE-004",
    browser: "chromium",
    viewport: { width: 1920, height: 917 },
    chapter: "professional-projects",
    expectedMode: "vertical-wide",
    expectedCapacity: "INSUFFICIENT_CAPACITY",
    safeFallback: true,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-PC-05",
    purpose: "Projects whole-story capacity fallback",
  },
  {
    evidenceId: "HGE-005",
    browser: "chromium",
    viewport: { width: 1100, height: 640 },
    chapter: "professional-projects",
    expectedMode: "vertical-wide",
    expectedCapacity: "INSUFFICIENT_CAPACITY",
    safeFallback: true,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-PC-06",
    framing: "projects-fan-start",
    purpose: "Registered capacity/breakpoint boundary candidate",
  },
  {
    evidenceId: "HGE-006",
    browser: "chromium",
    viewport: { width: 900, height: 1024 },
    chapter: "professional-projects",
    expectedMode: "vertical-wide",
    expectedCapacity: null,
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-GEO-05",
    purpose: "Tablet composition",
  },
  {
    evidenceId: "HGE-007",
    browser: "chromium",
    viewport: { width: 390, height: 844 },
    chapter: "professional-projects",
    expectedMode: "vertical-compact",
    expectedCapacity: null,
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-GEO-06",
    purpose: "Mobile composition",
  },
  {
    evidenceId: "HGE-008",
    browser: "chromium",
    viewport: { width: 1536, height: 900 },
    chapter: "professional-projects",
    expectedMode: "horizontal-enhanced",
    expectedCapacity: "PASS",
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-PC-02",
    interaction: "project-focus",
    purpose: "Projects keyboard-focus geometry",
  },
  {
    evidenceId: "HGE-009",
    browser: "firefox",
    viewport: { width: 1536, height: 900 },
    chapter: "professional-contact",
    expectedMode: "vertical-wide",
    expectedCapacity: "INSUFFICIENT_CAPACITY",
    safeFallback: true,
    motionPreference: "no-preference",
    sourceObservationId: "FIREFOX-GEO-02",
    purpose: "Contact geometry and representative Firefox rendering",
  },
  {
    evidenceId: "HGE-010",
    browser: "chromium",
    viewport: { width: 1536, height: 900 },
    chapter: "professional-terminal",
    expectedMode: "horizontal-enhanced",
    expectedCapacity: "PASS",
    safeFallback: false,
    motionPreference: "no-preference",
    sourceObservationId: "CHROMIUM-GEO-02",
    purpose: "Professional terminal and global-footer handoff",
  },
  {
    evidenceId: "HGE-011",
    browser: "chromium",
    viewport: { width: 1440, height: 900 },
    chapter: "professional-projects",
    expectedMode: "static",
    expectedCapacity: null,
    safeFallback: false,
    motionPreference: "reduce",
    sourceObservationId: "CHROMIUM-GEO-07",
    purpose: "Reduced Motion static Projects presentation",
  },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function waitForServer() {
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, {
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
  throw new Error("The Human Geometry evidence server did not become ready.");
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
  if (server.exitCode === null) process.kill(-server.pid, "SIGKILL");
}

async function settle(page, definition) {
  await page.goto(`${baseUrl}${motionPath}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => {
      const bootstrap = document
        .querySelector("[data-story-bootstrap]")
        ?.getAttribute("data-bootstrap-state");
      return (
        (bootstrap === "REVEALED" || bootstrap === "DEGRADED") &&
        document.querySelector("[data-bootstrap-cover]") === null &&
        document
          .querySelector("main[data-motion-lab]")
          ?.getAttribute("data-motion-lifecycle") === "mounted"
      );
    },
    undefined,
    { timeout: 30_000 },
  );
  if (definition.expectedCapacity !== null) {
    await page.waitForFunction(
      (expected) =>
        document
          .querySelector("main[data-motion-lab]")
          ?.getAttribute("data-motion-projects-capacity") === expected,
      definition.expectedCapacity,
      { timeout: 40_000 },
    );
  }
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
    `,
  });
  await page.evaluate(async (chapter) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (!controller) throw new Error("The motion controller is unavailable.");
    await controller.position(chapter);
  }, definition.chapter);
  await page.waitForFunction(
    ({ chapter, mode }) => {
      const root = document.querySelector("main[data-motion-lab]");
      return (
        root?.getAttribute("data-motion-active-chapter") === chapter &&
        root?.getAttribute("data-projection-mode") === mode
      );
    },
    { chapter: definition.chapter, mode: definition.expectedMode },
    { timeout: 15_000 },
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function capture(page, browser, definition, errors) {
  await settle(page, definition);
  let interactionState = null;
  if (definition.interaction === "project-focus") {
    const link = page.locator("[data-project-card-link]").first();
    await link.focus();
    await page.waitForFunction(
      () => document.activeElement?.hasAttribute("data-project-card-link") === true,
    );
    interactionState = await link.evaluate((element) => {
      const item = element.closest("[data-project-card-item]");
      if (!(item instanceof HTMLElement)) throw new Error("Missing project item");
      const itemStyle = getComputedStyle(item);
      const linkStyle = getComputedStyle(element);
      return {
        active: document.activeElement === element,
        itemTransform: itemStyle.transform,
        itemZIndex: itemStyle.zIndex,
        outlineStyle: linkStyle.outlineStyle,
        outlineWidth: linkStyle.outlineWidth,
      };
    });
  }
  if (definition.framing === "projects-fan-start") {
    await page.locator("[data-project-card-fan]").evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
  }

  const proof = await page.evaluate(() => {
    const root = document.querySelector("main[data-motion-lab]");
    const layer = document.querySelector("[data-story-score-layer]");
    return {
      activeChapter: root?.getAttribute("data-motion-active-chapter"),
      bootstrapState: document
        .querySelector("[data-story-bootstrap]")
        ?.getAttribute("data-bootstrap-state"),
      coverCount: document.querySelectorAll("[data-bootstrap-cover]").length,
      lifecycle: root?.getAttribute("data-motion-lifecycle"),
      projectsCapacityResult:
        root?.getAttribute("data-motion-projects-capacity"),
      projectsCapacityReasons:
        root?.getAttribute("data-motion-projects-capacity-reasons"),
      responsiveMode: root?.getAttribute("data-projection-mode"),
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      pathSelfIntersections: Number(
        layer?.getAttribute("data-score-path-self-intersections"),
      ),
      staffSelfIntersections: Number(
        layer?.getAttribute("data-score-staff-line-self-intersections"),
      ),
      composerFingerprint: layer?.getAttribute(
        "data-score-professional-fingerprint",
      ),
    };
  });

  if (
    errors.length > 0 ||
    proof.coverCount !== 0 ||
    proof.lifecycle !== "mounted" ||
    proof.activeChapter !== definition.chapter ||
    proof.responsiveMode !== definition.expectedMode ||
    proof.pathSelfIntersections !== 0 ||
    proof.staffSelfIntersections !== 0 ||
    proof.horizontalOverflow
  ) {
    throw new Error(
      `${definition.evidenceId} precondition failed: ${JSON.stringify({ errors, proof })}`,
    );
  }

  const fileName = `${definition.evidenceId.toLowerCase()}-${definition.browser}-${definition.chapter}-${definition.viewport.width}x${definition.viewport.height}.png`;
  const outputPath = path.join(screenshotsDirectory, fileName);
  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    path: outputPath,
  });

  return {
    evidence_id: definition.evidenceId,
    browser: definition.browser,
    browser_version: browser.version(),
    viewport_width: definition.viewport.width,
    viewport_height: definition.viewport.height,
    route: motionPath,
    chapter: definition.chapter,
    responsive_mode: proof.responsiveMode,
    projects_capacity_result: definition.expectedCapacity,
    projects_capacity_reasons: proof.projectsCapacityReasons,
    safe_fallback: definition.safeFallback,
    motion_preference: definition.motionPreference,
    source_validation_observation_id: definition.sourceObservationId,
    purpose: definition.purpose,
    capture_framing: definition.framing ?? "chapter-viewport",
    interaction_state: interactionState,
    stable_post_readiness: {
      bootstrap_state: proof.bootstrapState,
      bootstrap_cover_present: false,
      lifecycle: proof.lifecycle,
      page_error_count: errors.length,
    },
    supporting_automated_facts: {
      composer_fingerprint: proof.composerFingerprint,
      horizontal_overflow: proof.horizontalOverflow,
      path_self_intersections: proof.pathSelfIntersections,
      staff_self_intersections: proof.staffSelfIntersections,
    },
    screenshot: `screenshots/${fileName}`,
    screenshot_sha256: await sha256(outputPath),
  };
}

const validationResults = JSON.parse(await readFile(validationResultsPath, "utf8"));
const validationById = new Map(
  validationResults.observations.map((observation) => [
    observation.observationId,
    observation,
  ]),
);
for (const definition of definitions) {
  const source = validationById.get(definition.sourceObservationId);
  if (
    source?.status !== "PASS" ||
    source.safeFallback !== definition.safeFallback
  ) {
    throw new Error(
      `Invalid source observation for ${definition.evidenceId}: ${definition.sourceObservationId}`,
    );
  }
}

await mkdir(screenshotsDirectory, { recursive: true });
let serverOutput = "";
const server = suppliedBaseUrl
  ? null
  : spawn(
      "pnpm",
      ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)],
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
  serverOutput = (serverOutput + chunk).slice(-12_000);
});
server?.stderr.on("data", (chunk) => {
  serverOutput = (serverOutput + chunk).slice(-12_000);
});

const browsers = {};
const items = [];
try {
  await waitForServer();
  for (const browserName of new Set(definitions.map(({ browser }) => browser))) {
    browsers[browserName] = await browserDefinitions[browserName].launcher.launch();
  }
  for (const definition of definitions) {
    const browser = browsers[definition.browser];
    const errors = [];
    const context = await browser.newContext({
      ...browserDefinitions[definition.browser].descriptor,
      colorScheme: "dark",
      deviceScaleFactor: 1,
      locale: "pt-BR",
      reducedMotion: definition.motionPreference,
      viewport: definition.viewport,
    });
    await context.route("**/turnstile/v0/api.js*", (route) =>
      route.fulfill({ body: "", contentType: "application/javascript" }),
    );
    await context.addInitScript(() => {
      window.localStorage.setItem("wf-theme", "dark");
      window.turnstile = {
        remove() {},
        render(_container, configuration) {
          queueMicrotask(() => configuration.callback("human-geometry-evidence"));
          return "human-geometry-evidence";
        },
        reset() {},
      };
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      items.push(await capture(page, browser, definition, errors));
    } finally {
      await context.close();
    }
  }

  const counts = Object.fromEntries(
    Object.keys(browserDefinitions).map((browser) => [
      browser,
      items.filter((item) => item.browser === browser).length,
    ]),
  );
  await writeFile(
    path.join(evidenceDirectory, "manifest.json"),
    `${JSON.stringify(
      {
        schema: "wflyer-stage1-human-geometry-evidence/v1",
        status: "READY_FOR_HUMAN_REVIEW",
        humanGeometryApproval: "PENDING",
        activeChange: "implement-scroll-driven-score-assembly-and-motion",
        repositoryHead: validationResults.gitHead,
        topology: "HOME / ORIGIN → PROFESSIONAL / PORTFOLIO",
        route: motionPath,
        capturedAt: new Date().toISOString(),
        itemCount: items.length,
        browserCounts: counts,
        coverage: {
          horizontalEnhancedIncluded: items.some(
            ({ responsive_mode }) => responsive_mode === "horizontal-enhanced",
          ),
          safeFallbackIncluded: items.some(({ safe_fallback }) => safe_fallback),
          tabletIncluded: items.some(
            ({ viewport_width, viewport_height }) =>
              viewport_width === 900 && viewport_height === 1024,
          ),
          mobileIncluded: items.some(
            ({ viewport_width, viewport_height }) =>
              viewport_width === 390 && viewport_height === 844,
          ),
          reducedMotionIncluded: items.some(
            ({ motion_preference }) => motion_preference === "reduce",
          ),
        },
        selectionPolicy:
          "Representative subset of the validated 63-observation manifest; no matrix rerun and no subjective approval inference.",
        items,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
} catch (error) {
  throw new Error(`Human Geometry capture failed.\n${serverOutput}`, {
    cause: error,
  });
} finally {
  await Promise.all(Object.values(browsers).map((browser) => browser.close()));
  if (server !== null) await stopServer(server);
}

console.log(`Human Geometry evidence captured: ${items.length} stable views.`);
