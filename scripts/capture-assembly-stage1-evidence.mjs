import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { chromium, firefox, webkit } from "playwright";
import { inspectHomeEntry, inspectProjects, inspectRenderedGeometry, observeRuntime, requireCleanRuntime, strictIntersections } from "../tests/e2e/helpers/assembly-stage1-audit.ts";

// Successor review inventory only. This script never creates a geometry-refreeze
// seal and never writes the historical Phase-9 evidence directories. Historical
// Projects captures are hashed read-only as references in this successor inventory.
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const requireFromProject = createRequire(path.join(repositoryRoot, "package.json"));

async function loadProjectionReplay() {
  const { build } = createRequire(requireFromProject.resolve("vite"))("esbuild");
  const bundle = await build({
    stdin: {
      contents: 'export { buildStoryScoreProjection } from "@/lib/story/score/projection";',
      resolveDir: repositoryRoot, loader: "ts",
    },
    alias: { "@": path.join(repositoryRoot, "src") },
    bundle: true, platform: "node", format: "esm", write: false,
  });
  const { buildStoryScoreProjection } = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
  );
  return buildStoryScoreProjection;
}
const evidenceRoot = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/assembly-motion",
);
const outputDirectory = path.resolve(
  repositoryRoot,
  process.env.WFLYER_EVIDENCE_OUTPUT_DIR ??
    path.join(evidenceRoot, "stage-1-geometry-2026-09-05"),
);
const port = Number(process.env.WFLYER_EVIDENCE_PORT ?? 43_149);
const suppliedBaseUrl = process.env.WFLYER_EVIDENCE_BASE_URL?.replace(/\/$/u, "");
const baseUrl = suppliedBaseUrl ?? `http://127.0.0.1:${port}`;
const baseOrigin = new URL(baseUrl);
const routePath = "/__visual-lab/story/motion";
const expectedSeed = "phase-9-task-33-review-v1";
const expectedFingerprints = {
  application: "fnv1a32:1fe3356b",
  professional: "fnv1a32:039bce10",
};
const browserTypes = { chromium, firefox, webkit };
const selectedBrowsers = (
  process.env.WFLYER_EVIDENCE_BROWSERS ?? "chromium,firefox,webkit"
).split(",");
const captureFilter = process.env.WFLYER_EVIDENCE_FILTER;
const listedOnly = process.env.WFLYER_EVIDENCE_LIST === "1";
const sourcePaths = [
  "src",
  "public",
  "scripts",
  "tests",
  "AGENTS.md",
  "WFLYER_IMPLEMENTATION_PLAN.md",
  ".nvmrc",
  "package.json",
  "pnpm-lock.yaml",
  "next.config.ts",
  "postcss.config.mjs",
  "playwright.config.ts",
  "tsconfig.json",
  "docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md",
  "openspec/changes/implement-scroll-driven-score-assembly-and-motion/proposal.md",
  "openspec/changes/implement-scroll-driven-score-assembly-and-motion/design.md",
  "openspec/changes/implement-scroll-driven-score-assembly-and-motion/specs",
  "openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-authorization.md",
];
const desktopViewport = { width: 1_536, height: 900 };
const projectsReferenceDirectory = "docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-2026-08-31";
const projectsReferenceFiles = [
  "11-scene-professional-projects-dark-1536x900.png",
  "20-diagnostic-projects-visit-1-dark-1536x900.png",
  "21-diagnostic-projects-visit-2-dark-1536x900.png",
  "22-diagnostic-projects-visit-3-dark-1536x900.png",
  "25-regression-projects-dark-compact-390x844.png",
];
const desktopTargets = [
  { id: "home-origin", chapterId: "home", diagnostic: true },
  {
    id: "home-application-entry",
    homeEntryBranch: "application",
    diagnostic: true,
  },
  {
    id: "home-professional-entry",
    homeEntryBranch: "professional",
    diagnostic: true,
  },
  {
    id: "application-terminal",
    chapterId: "application-terminal",
    diagnostic: true,
  },
  { id: "application-benefits", chapterId: "application-benefits" },
  {
    id: "how-benefits-and-demo-approach",
    between: ["application-how-it-works", "application-benefits"],
    fraction: 0.8,
    diagnostic: true,
  },
  {
    id: "benefits-demo-corridor",
    between: ["application-benefits", "application-demo"],
    fraction: 0.5,
    diagnostic: true,
  },
  { id: "application-demo", chapterId: "application-demo", diagnostic: true },
  {
    id: "demo-launch-continuity",
    between: ["application-demo", "application-access"],
    fraction: 0.5,
    diagnostic: true,
  },
  { id: "application-launch", chapterId: "application-access" },
  { id: "professional-about-shelves", chapterId: "professional-about" },
  { id: "professional-process-shelves", chapterId: "professional-process" },
  { id: "professional-projects", chapterId: "professional-projects" },
  ...[1, 2, 3].map((projectIndex) => ({ id: `professional-projects-visit-${projectIndex}`, chapterId: "professional-projects", projectIndex, diagnostic: true })),
  { id: "professional-contact-shelves", chapterId: "professional-contact" },
];
const definitions = selectedBrowsers.flatMap((browser) => [
  ...desktopTargets.map((target) => ({
    ...target,
    browser,
    projection: "horizontal-enhanced",
    theme: "dark",
    viewport: desktopViewport,
  })),
  ...["home-origin", "application-terminal", "professional-process-shelves"].map(
    (id) => ({
      ...desktopTargets.find((target) => target.id === id),
      browser,
      diagnostic: false,
      projection: "horizontal-enhanced",
      theme: "light",
      viewport: desktopViewport,
    }),
  ),
  ...["home", "application-terminal"].map((chapterId) => ({
    browser,
    chapterId,
    id: `vertical-wide-${chapterId}`,
    projection: "vertical-wide",
    theme: "dark",
    viewport: { width: 900, height: 1_024 },
  })),
  ...["home", "professional-about", "professional-projects", "application-terminal"].map((chapterId) => ({
    browser,
    chapterId,
    hasTouch: true,
    id: `vertical-compact-${chapterId}`,
    projection: "vertical-compact",
    theme: "light",
    viewport: { width: 390, height: 844 },
  })),
  {
    browser,
    chapterId: "home",
    id: "reduced-static-home",
    projection: "static",
    reducedMotion: "reduce",
    theme: "dark",
    viewport: desktopViewport,
  },
]).filter((definition) => !captureFilter || definition.id.includes(captureFilter));

function validateInputs() {
  if (suppliedBaseUrl && !captureFilter) {
    throw new Error("Final Stage-1 evidence requires the owned source-worktree server; an external local server is only allowed for explicitly filtered diagnostics.");
  }
  const relativeOutput = path.relative(evidenceRoot, outputDirectory);
  if (
    !relativeOutput ||
    relativeOutput.startsWith("..") ||
    path.isAbsolute(relativeOutput) ||
    !/^stage-1-geometry-[a-zA-Z0-9_-]+$/u.test(relativeOutput)
  ) {
    throw new Error(
      "WFLYER_EVIDENCE_OUTPUT_DIR must be a new stage-1-geometry-* directory directly inside the successor assembly-motion evidence directory.",
    );
  }
  if (
    !["127.0.0.1", "localhost", "[::1]"].includes(baseOrigin.hostname) ||
    baseOrigin.protocol !== "http:" ||
    baseOrigin.origin !== baseUrl ||
    !Number.isSafeInteger(port) ||
    port < 1 ||
    port > 65_535
  ) {
    throw new Error("Stage-1 captures require a local HTTP origin and valid port.");
  }
  if (
    selectedBrowsers.some((browser) => !Object.hasOwn(browserTypes, browser)) ||
    new Set(selectedBrowsers).size !== selectedBrowsers.length ||
    definitions.length === 0
  ) {
    throw new Error("Select unique supported browser engines and a nonempty capture filter.");
  }
}

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const hashBytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sha256 = async (fileName) => hashBytes(await readFile(fileName));
const git = (...arguments_) =>
  execFileSync("git", arguments_, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1_024 * 1_024,
  });

async function sourceProvenance() {
  const fileNames = Array.from(
    new Set(
      git("ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", ...sourcePaths)
        .split("\0")
        .filter(Boolean),
    ),
  ).sort();
  const files = Object.fromEntries(
    await Promise.all(
      fileNames.map(async (fileName) => [
        fileName,
        await sha256(path.join(repositoryRoot, fileName)),
      ]),
    ),
  );
  return {
    files,
    sourceInventorySha256: hashBytes(JSON.stringify(files)),
    head: git("rev-parse", "HEAD").trim(),
    sourceDiffSha256: hashBytes(git("diff", "HEAD", "--", ...sourcePaths)),
    statusShort: git("status", "--short", "--untracked-files=all").trimEnd(),
  };
}

async function createFreshOutputDirectory() {
  const parts = path.relative(repositoryRoot, outputDirectory).split(path.sep);
  let candidate = repositoryRoot;
  for (const part of parts) {
    candidate = path.join(candidate, part);
    try {
      const stats = await lstat(candidate);
      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw new Error(`Evidence path contains an unsafe directory: ${candidate}`);
      }
      if (candidate === outputDirectory) {
        throw new Error("Refusing to overwrite an existing successor evidence directory.");
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  await mkdir(evidenceRoot, { recursive: true });
  await mkdir(outputDirectory);
}

async function waitForServer(server) {
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    if (server && server.exitCode !== null) {
      throw new Error(`The owned evidence server exited with ${server.exitCode}.`);
    }
    try {
      const response = await fetch(baseUrl + routePath, {
        redirect: "manual",
        signal: AbortSignal.timeout(2_000),
      });
      await response.body?.cancel();
      if (response.status === 200) return;
    } catch {
      // The owned development server may still be compiling the review route.
    }
    await delay(250);
  }
  throw new Error("The local Stage-1 evidence route did not become ready.");
}

async function stopServer(server) {
  if (!server || server.exitCode !== null || server.pid === undefined) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch (error) {
    if (error.code === "ESRCH") return;
    throw error;
  }
  const deadline = Date.now() + 10_000;
  while (server.exitCode === null && Date.now() < deadline) await delay(100);
  if (server.exitCode === null) {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  }
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
  let previous;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const current = await page.locator("[data-story-score-layer]").evaluate(
      (layer) => JSON.stringify(Object.fromEntries(
        Array.from(layer.attributes)
          .filter(({ name }) => name.startsWith("data-score-"))
          .map(({ name, value }) => [name, value]),
      )),
    );
    if (current === previous) return;
    previous = current;
    await page.evaluate(() => new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    ));
  }
  throw new Error("Projection diagnostics did not stabilize before capture.");
}

async function openStory(browser, definition) {
  const context = await browser.newContext({
    colorScheme: definition.theme,
    deviceScaleFactor: 1,
    hasTouch: definition.hasTouch ?? false,
    locale: "pt-BR",
    reducedMotion: definition.reducedMotion ?? "no-preference",
    serviceWorkers: "block",
    timezoneId: "America/Sao_Paulo",
    viewport: definition.viewport,
  });
  const forbiddenRequests = [];
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      url.hostname === "challenges.cloudflare.com" &&
      url.pathname.endsWith("/turnstile/v0/api.js")
    ) {
      await route.fulfill({ body: "", contentType: "application/javascript", status: 200 });
    } else if (url.origin === baseOrigin.origin && ["GET", "HEAD"].includes(request.method())) {
      await route.continue();
    } else {
      forbiddenRequests.push({ method: request.method(), origin: url.origin, pathname: url.pathname });
      await route.abort("blockedbyclient");
    }
  });
  await context.addInitScript((theme) => {
    window.localStorage.setItem("wf-theme", theme);
    let widgetIndex = 0;
    window.turnstile = {
      remove() {},
      render(container, configuration) {
        void container;
        widgetIndex += 1;
        queueMicrotask(() => configuration.callback("assembly-stage1-local-evidence-token"));
        return `assembly-stage1-local-evidence-${widgetIndex}`;
      },
      reset() {},
    };
  }, definition.theme);
  let runtime;
  try {
    const page = await context.newPage();
    runtime = observeRuntime(page);
    await page.goto(baseUrl + routePath, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
      document.querySelector("[data-story-bootstrap]")?.getAttribute("data-bootstrap-state") === "REVEALED" &&
      document.querySelector("[data-bootstrap-cover]") === null &&
      document.querySelector("main[data-motion-lab]")?.getAttribute("data-motion-lifecycle") === "mounted",
    undefined, { timeout: 30_000 });
    await page.addStyleTag({ content: `
      nextjs-portal { display: none !important; }
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    ` });
    await settle(page);
    requireCleanRuntime(runtime.snapshot());
    return { context, page, runtime, forbiddenRequests };
  } catch (error) {
    error.runtimeSnapshot = runtime?.snapshot() ?? null;
    await context.close();
    throw error;
  }
}

async function positionChapter(page, chapterId) {
  await page.evaluate(async (requestedChapterId) => {
    const controller = window.__WFLYER_PHASE5_MOTION__;
    if (!controller) throw new Error("The existing review positioning controller is unavailable.");
    await controller.position(requestedChapterId);
  }, chapterId);
  await page.waitForFunction((requestedChapterId) =>
    document.querySelector("main[data-motion-lab]")?.getAttribute("data-motion-active-chapter") === requestedChapterId,
  chapterId);
  await settle(page);
  return page.evaluate(() => window.scrollY);
}

async function positionCapture(page, definition) {
  if (definition.homeEntryBranch) {
    const homeScrollY = await positionChapter(page, "home");
    const atHome = await inspectHomeEntry(page, definition.homeEntryBranch);
    const adjacentChapter = definition.homeEntryBranch === "application" ? "application-overview" : "professional-about";
    const adjacentScrollY = await positionChapter(page, adjacentChapter);
    const atAdjacent = await inspectHomeEntry(page, definition.homeEntryBranch);
    const screenDelta = atAdjacent.screenPoint.x - atHome.screenPoint.x;
    if (screenDelta === 0 || adjacentScrollY === homeScrollY) throw new Error("Cannot resolve native scroll from actual Home entry geometry.");
    const requestedScrollY = homeScrollY + (definition.viewport.width / 2 - atHome.screenPoint.x) * (adjacentScrollY - homeScrollY) / screenDelta;
    await page.evaluate((top) => window.scrollTo({ top, left: 0, behavior: "instant" }), requestedScrollY);
    await settle(page);
    const homeEntry = await inspectHomeEntry(page, definition.homeEntryBranch);
    if (!homeEntry.allStaffPointsInViewport) throw new Error(`Home target is not reviewable: ${JSON.stringify(homeEntry)}`);
    return { method: "native scroll calibrated to actual Projection homeEntry.t/point/staffPoints", homeScrollY, adjacentScrollY, atHome, atAdjacent, requestedScrollY, scrollY: await page.evaluate(() => window.scrollY), homeEntry };
  }
  if (!definition.between) {
    return {
      chapterId: definition.chapterId,
      method: "existing review controller position(chapterId)",
      scrollY: await positionChapter(page, definition.chapterId),
    };
  }
  const [from, to] = definition.between;
  const fromScrollY = await positionChapter(page, from);
  const toScrollY = await positionChapter(page, to);
  const requestedScrollY = fromScrollY + (toScrollY - fromScrollY) * definition.fraction;
  await page.evaluate((top) => window.scrollTo({ top, left: 0, behavior: "instant" }), requestedScrollY);
  await settle(page);
  return {
    between: definition.between,
    fraction: definition.fraction,
    fromScrollY,
    method: "native-scroll interpolation between existing review chapter positions",
    requestedScrollY,
    scrollY: await page.evaluate(() => window.scrollY),
    toScrollY,
  };
}

async function scoreProof(page, definition) {
  const proof = await page.evaluate(() => {
    const root = document.querySelector("main[data-motion-lab]");
    const layer = document.querySelector("[data-story-score-layer]");
    if (!layer || !root) throw new Error("Missing score proof owners.");
    const attributes = Object.fromEntries(Array.from(layer.attributes)
      .filter(({ name }) => name.startsWith("data-score-"))
      .map(({ name, value }) => [name, value]));
    return {
      activeChapter: root.getAttribute("data-motion-active-chapter"),
      attributes,
      bootstrapState: document.querySelector("[data-story-bootstrap]")?.getAttribute("data-bootstrap-state"),
      projection: root.getAttribute("data-projection-mode"),
      runtimeSnapshot: window.__WFLYER_PHASE5_MOTION__?.snapshot() ?? null,
      branches: Array.from(layer.querySelectorAll("[data-score-branch]")).map((branch) => ({
        branch: branch.getAttribute("data-score-branch"),
        finalBarline: branch.getAttribute("data-score-final-barline"),
        semanticSegmentIds: branch.getAttribute("data-score-segment-ids"),
      })),
    };
  });
  const attributes = proof.attributes;
  const numeric = (name) => {
    const value = attributes[name];
    if (value === undefined || value.trim() === "" || !Number.isFinite(Number(value))) {
      throw new Error(`Missing or invalid numeric score evidence: ${name}`);
    }
    return Number(value);
  };
  const failures = [];
  if (proof.bootstrapState !== "REVEALED") failures.push("bootstrap not revealed");
  if (proof.projection !== definition.projection) failures.push("unexpected projection mode");
  if (attributes["data-score-session-seed"] !== expectedSeed) failures.push("session seed changed");
  for (const [branch, fingerprint] of Object.entries(expectedFingerprints)) {
    if (attributes[`data-score-${branch}-fingerprint`] !== fingerprint) failures.push(`${branch} fingerprint changed`);
  }
  for (const name of ["connector-events", "path-self-intersections", "staff-line-self-intersections", "services-unsafe-events", "how-unsafe-events"]) {
    if (numeric(`data-score-${name}`) !== 0) failures.push(name);
  }
  if (numeric("data-score-composer-invocations") !== 2) failures.push("Composer invocation count changed");
  if (numeric("data-score-maximum-notation-tangent") > 18) failures.push("notation tangent exceeds 18 degrees");
  if (numeric("data-score-origin-point-gap") > 0.001) failures.push("origin point gap");
  if (numeric("data-score-origin-staff-line-gap") > 0.001) failures.push("origin staff gap");
  if (proof.branches.length !== 2 || proof.branches.some(({ finalBarline }) => finalBarline !== "thin-gap-thick-and-physical-end")) {
    failures.push("conventional branch terminals missing");
  }
  if (definition.projection === "horizontal-enhanced") {
    for (const family of ["services", "how"]) {
      if (attributes[`data-score-${family}-measurement-source`] !== "dom-measured") failures.push(`${family} DOM measurement missing`);
    }
  }
  if (failures.length > 0) throw new Error(`Capture contract failed: ${JSON.stringify({ failures, proof })}`);
  return proof;
}

async function protectedContentProof(page) {
  return page.evaluate(() => {
    const track = document.querySelector("[data-motion-track]");
    if (!track) throw new Error("Missing track coordinate owner.");
    const trackRect = track.getBoundingClientRect();
    const rectangle = (rect) => ({
      left: rect.left - trackRect.left,
      top: rect.top - trackRect.top,
      right: rect.right - trackRect.left,
      bottom: rect.bottom - trackRect.top,
    });
    const protectedBounds = Array.from(document.querySelectorAll("[data-score-content-exclusion]"))
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          chapterId: element.closest("[data-chapter-id]")?.getAttribute("data-chapter-id"),
          reason: element.getAttribute("data-score-content-exclusion"),
          rect: rectangle(bounds),
          visible: bounds.right > 0 && bounds.left < innerWidth && bounds.bottom > 0 && bounds.top < innerHeight,
        };
      });
    const branch = document.querySelector('[data-score-branch="application"]');
    if (!branch) throw new Error("Missing Application clearance owner.");
    const staffPoints = [];
    branch.querySelectorAll('[data-score-role="staff-line"]').forEach((line) => {
      const matrix = line.getScreenCTM();
      if (!matrix) throw new Error("Missing staff transform.");
      const length = line.getTotalLength();
      const count = Math.max(1, Math.ceil(length / 3));
      const radius = Number(line.getAttribute("stroke-width") ?? 0) / 2;
      for (let index = 0; index <= count; index += 1) {
        const point = line.getPointAtLength(length * index / count);
        const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        staffPoints.push({ x: screen.x - trackRect.left, y: screen.y - trackRect.top, radius });
      }
    });
    const notationRects = Array.from(branch.querySelectorAll('[data-score-role]:not([data-score-role="staff-line"])'))
      .map((primitive) => rectangle(primitive.getBoundingClientRect()))
      .filter((rect) => rect.right > rect.left || rect.bottom > rect.top);
    const clearances = [
      ["application-demo", "demo-call-to-action", '[data-score-content-exclusion="heading-and-body"] a', 12],
      ["application-demo", "application-tablet-demo", '[data-score-content-exclusion="application-tablet-demo"]', 12.64],
      ["application-access", "access-action", '[data-score-content-exclusion="access-action"]', 23.64],
    ].map(([chapterId, reason, selector, minimumRequired]) => {
      const element = document.querySelector(`[data-chapter-id="${chapterId}"] ${selector}`);
      if (!element) throw new Error(`Missing clearance target: ${reason}`);
      const rect = rectangle(element.getBoundingClientRect());
      let minimum = Infinity;
      for (const point of staffPoints) {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        minimum = Math.min(minimum, (dx || dy ? Math.hypot(dx, dy) : -Math.min(point.x - rect.left, rect.right - point.x, point.y - rect.top, rect.bottom - point.y)) - point.radius);
      }
      for (const notation of notationRects) {
        const dx = Math.max(rect.left - notation.right, 0, notation.left - rect.right);
        const dy = Math.max(rect.top - notation.bottom, 0, notation.top - rect.bottom);
        minimum = Math.min(minimum, dx || dy ? Math.hypot(dx, dy) : -Math.min(notation.right - rect.left, rect.right - notation.left, notation.bottom - rect.top, rect.bottom - notation.top));
      }
      if (!Number.isFinite(minimum)) throw new Error(`No measurable geometry at ${reason}`);
      return {
        chapterId,
        classification: minimum < 0 ? "COLLISION" : minimum < 12 ? "TOO_CLOSE" : "CLEAR",
        minimumClearance: Number(minimum.toFixed(3)),
        minimumClearanceRounded: Number(minimum.toFixed(2)),
        minimumRequired,
        reason,
        rect,
      };
    });
    return { clearances, protectedBounds, sampleStepPixels: 3, coordinateSpace: "motion-track" };
  });
}

async function addDiagnosticOverlay(page, definition, proof, geometry, position, projects) {
  return page.evaluate(({ id, attributes, staffIntersectionCount, centerIntersectionCount, homeEntry, projectVisit }) => {
    const overlay = document.createElement("div");
    overlay.dataset.assemblyStage1Diagnostic = "review-only";
    overlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483646";
    document.querySelectorAll("[data-score-content-exclusion]").forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.right <= 0 || rect.left >= innerWidth || rect.bottom <= 0 || rect.top >= innerHeight) return;
      const outline = document.createElement("div");
      outline.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;outline:2px dashed #27d3e8;outline-offset:2px`;
      overlay.append(outline);
    });
    const mark = (point, text) => {
      const marker = document.createElement("div");
      marker.style.cssText = `position:absolute;left:${point.x}px;top:${point.y}px;width:12px;height:12px;transform:translate(-50%,-50%);background:#ffcf67;border:2px solid #071011;border-radius:50%;box-shadow:0 0 0 2px #ffcf67`;
      marker.title = text;
      overlay.append(marker);
    };
    homeEntry?.screenStaffPoints.forEach((point, index) => mark(point, `Home ${homeEntry.branch}: staff ${index + 1}`));
    if (projectVisit) {
      mark(projectVisit.screenAnchor, `Projects visit ${projectVisit.projectIndex}`);
      const card = document.querySelector(`[data-project-card-item][data-project-position="${projectVisit.projectIndex}"]`);
      if (!card || !projectVisit.anchorInViewport) throw new Error("Projects diagnostic target must be visible.");
      const rect = card.getBoundingClientRect();
      const outline = document.createElement("div");
      outline.style.cssText = `position:absolute;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;outline:3px solid #ffcf67;outline-offset:4px`;
      overlay.append(outline);
    }
    const label = document.createElement("div");
    label.style.cssText = "position:absolute;left:16px;bottom:16px;max-width:calc(100% - 32px);padding:10px;background:#081013;color:#f4ecdf;border:1px solid #27d3e8;font:12px/1.5 monospace;white-space:pre-wrap";
    label.textContent = `STAGE-1 REVIEW DIAGNOSTIC · ${id}\nProtected content: cyan dashed bounds\nIndependent complete DOM staff intersections: ${staffIntersectionCount}; center path: ${centerIntersectionCount} (2049-sample replay)\nConnector events: ${attributes["data-score-connector-events"]}; maximum notation tangent: ${attributes["data-score-maximum-notation-tangent"]}°${homeEntry ? `\n${homeEntry.branch} Home entry t=${homeEntry.entry.t}; all five staff targets visible=${homeEntry.allStaffPointsInViewport}` : ""}${projectVisit ? `\nProjects visit ${projectVisit.projectIndex}: ${projectVisit.classification}; clearance=${projectVisit.minimumClearance.toFixed(3)}px; anchor visible=${projectVisit.anchorInViewport}` : ""}\nGeometry approval: PENDING; refreeze: NOT STARTED`;
    overlay.append(label);
    document.body.append(overlay);
    return { homeEntry: homeEntry ?? null, projectVisit: projectVisit ?? null, label: label.textContent };
  }, { id: definition.id, attributes: proof.attributes, staffIntersectionCount: geometry.staffIntersectionCount, centerIntersectionCount: geometry.centerPathValidation.intersectionCount, homeEntry: position.homeEntry ?? null, projectVisit: definition.projectIndex ? projects.visits[definition.projectIndex - 1] : null });
}

validateInputs();
if (listedOnly) {
  console.log(JSON.stringify({ outputDirectory, captureCount: definitions.length, definitions }, null, 2));
} else {
  const buildProjection = await loadProjectionReplay();
  await createFreshOutputDirectory();
  const provenanceBefore = await sourceProvenance();
  const historicalProjectsReferences = await Promise.all(projectsReferenceFiles.map(async (fileName) => {
    const referencePath = `${projectsReferenceDirectory}/${fileName}`;
    return { path: referencePath, sha256: await sha256(path.join(repositoryRoot, referencePath)), access: "read-only historical reference" };
  }));
  const startedAt = new Date().toISOString();
  const browsers = new Map();
  const captures = [];
  let activeCaptureAudit = null;
  let serverOutput = "";
  const server = suppliedBaseUrl ? null : spawn("pnpm", [
    "exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port),
  ], {
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
  });
  server?.stdout.on("data", (chunk) => { serverOutput = (serverOutput + chunk).slice(-12_000); });
  server?.stderr.on("data", (chunk) => { serverOutput = (serverOutput + chunk).slice(-12_000); });
  server?.on("error", (error) => { serverOutput += `\n${error.message}`; });
  let cleanupPromise;
  const cleanup = () => cleanupPromise ??= (async () => {
    await Promise.allSettled(Array.from(browsers.values(), (browser) => browser.close()));
    await stopServer(server);
  })();
  const interrupted = () => { process.exitCode = 1; void cleanup(); };
  process.once("SIGINT", interrupted);
  process.once("SIGTERM", interrupted);
  try {
    await waitForServer(server);
    for (const definition of definitions) {
      let browser = browsers.get(definition.browser);
      if (!browser) {
        browser = await browserTypes[definition.browser].launch();
        browsers.set(definition.browser, browser);
      }
      activeCaptureAudit = { definition, status: "opening" };
      const { context, page, runtime, forbiddenRequests } = await openStory(browser, definition);
      try {
        const position = await positionCapture(page, definition);
        if (definition.chapterId === "application-access") {
          await page.waitForFunction(() => document.querySelector("[data-app-launch-interest-state]")?.getAttribute("data-app-launch-interest-state") === "IDLE");
        }
        const proof = await scoreProof(page, definition);
        const geometry = await inspectRenderedGeometry(page);
        const replay = buildProjection(geometry.replayInput.mode, geometry.replayInput.options);
        const centerPaths = Object.values(replay.branches).map((branch) => {
          const points = Array.from({ length: 2049 }, (_, index) => branch.path.pointAt(index / 2048));
          return { branch: branch.branch, points, crossings: strictIntersections(points) };
        });
        geometry.centerPathValidation = {
          status: "replayed from actual measured Projection inputs",
          sampleCount: 2049,
          intersectionCount: centerPaths.reduce((count, branch) => count + branch.crossings.length, 0),
          branches: centerPaths,
          projectionAttributesAreGlobalValidator: false,
        };
        const projects = await inspectProjects(page, geometry);
        activeCaptureAudit = { definition, geometry, projects, runtime: runtime.snapshot() };
        if (geometry.staffIntersectionCount !== 0) throw new Error(`Independent complete DOM staff validation failed: ${geometry.staffIntersectionCount} intersections.`);
        if (geometry.centerPathValidation.intersectionCount !== 0) throw new Error("Independent 2049-sample center-path replay found intersections.");
        if (definition.projectIndex && !projects.visits[definition.projectIndex - 1]?.anchorInViewport) throw new Error("Projects diagnostic anchor must be visibly reviewable.");
        if (definition.projection === "horizontal-enhanced") {
          const invalidVisits = projects.visits.filter((visit) => visit.measurementSource !== "dom-measured" || visit.classification !== "CLEAR" || visit.distanceFromRenderedCenter > 1 || !visit.notationSafe);
          if (invalidVisits.length) throw new Error(`Rendered Projects visits failed: ${JSON.stringify(invalidVisits)}`);
        }
        const content = await protectedContentProof(page);
        if (definition.projection === "horizontal-enhanced") {
          const failures = content.clearances.filter(({ minimumClearanceRounded, minimumRequired }) => minimumClearanceRounded < minimumRequired);
          if (failures.length) throw new Error(`Protected content clearance failed: ${JSON.stringify(failures)}`);
        }
        const runtimeBeforeCapture = runtime.snapshot();
        requireCleanRuntime(runtimeBeforeCapture);
        if (forbiddenRequests.length) {
          throw new Error(`Unexpected network activity: ${JSON.stringify({ forbiddenRequests })}`);
        }
        const stem = `${String(captures.length + 1).padStart(2, "0")}-${definition.id}-${definition.theme}-${definition.browser}-${definition.viewport.width}x${definition.viewport.height}`;
        const fileName = `${stem}.png`;
        await page.screenshot({ animations: "disabled", caret: "hide", path: path.join(outputDirectory, fileName) });
        const runtimeAfterCapture = runtime.snapshot();
        activeCaptureAudit.runtime = runtimeAfterCapture;
        requireCleanRuntime(runtimeAfterCapture);
        let diagnostic = null;
        if (definition.diagnostic && definition.browser === "chromium") {
          const diagnosticProof = await addDiagnosticOverlay(page, definition, proof, geometry, position, projects);
          const runtimeBeforeDiagnostic = runtime.snapshot();
          requireCleanRuntime(runtimeBeforeDiagnostic);
          const diagnosticFileName = `${stem}.diagnostic.png`;
          await page.screenshot({ animations: "disabled", caret: "hide", path: path.join(outputDirectory, diagnosticFileName) });
          const runtimeAfterDiagnostic = runtime.snapshot();
          activeCaptureAudit.runtime = runtimeAfterDiagnostic;
          requireCleanRuntime(runtimeAfterDiagnostic);
          diagnostic = { fileName: diagnosticFileName, sha256: await sha256(path.join(outputDirectory, diagnosticFileName)), kind: "review-only geometry/target overlay; not product UI", diagnosticProof, runtimeBeforeDiagnostic, runtimeAfterDiagnostic };
        }
        const metricFileName = `${stem}.json`;
        await writeFile(path.join(outputDirectory, metricFileName), JSON.stringify({ definition, position, scoreProof: proof, independentGeometry: geometry, projects, protectedContent: content, runtimeBeforeCapture, runtimeAfterCapture, diagnostic }, null, 2) + "\n");
        captures.push({
          definition,
          browserVersion: browser.version(),
          deviceScaleFactor: 1,
          diagnostic,
          fileName,
          sha256: await sha256(path.join(outputDirectory, fileName)),
          metrics: { fileName: metricFileName, sha256: await sha256(path.join(outputDirectory, metricFileName)) },
          position,
          projection: proof.projection,
          activeChapter: proof.activeChapter,
          runtimeBeforeCapture,
          runtimeAfterCapture,
          pageErrorCount: runtime.snapshot().pageErrorCount,
          hydrationWarningCount: runtime.snapshot().hydrationWarningCount,
          consoleWarningCount: runtime.snapshot().consoleWarningCount,
          consoleErrorCount: runtime.snapshot().consoleErrorCount,
          forbiddenRequestCount: forbiddenRequests.length,
        });
        console.log(`Captured ${captures.length}/${definitions.length}: ${fileName}`);
      } finally {
        await context.close();
      }
    }
    const provenanceAfter = await sourceProvenance();
    if (provenanceBefore.sourceInventorySha256 !== provenanceAfter.sourceInventorySha256 || provenanceBefore.head !== provenanceAfter.head) {
      throw new Error("Source worktree changed during capture; candidate evidence cannot claim one exact source state.");
    }
    const provenanceName = "worktree-provenance.json";
    await writeFile(path.join(outputDirectory, provenanceName), JSON.stringify({ before: provenanceBefore, after: provenanceAfter }, null, 2) + "\n");
    const playwrightPackage = JSON.parse(await readFile(path.join(repositoryRoot, "node_modules/playwright/package.json"), "utf8"));
    const manifest = {
      kind: "stage-1-human-review-candidate-inventory",
      activeChange: "implement-scroll-driven-score-assembly-and-motion",
      canonicalAuthority: "docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md",
      predecessorTechnicalSha: "306ccb74da6c7bbf8f187e360c0776c571b5fc3d",
      predecessorClosureSha: "a20d52ac9f214d385ea7c210b2ab45aa84095fc8",
      stage0CheckpointSha: "40e6ae1a8996c53ed2ec372c47f16bc073d6cee9",
      humanGeometryApproval: "PENDING",
      geometryRefreeze: "NOT STARTED",
      successorMotionRuntime: "NOT STARTED",
      captureValidation: "PASS",
      note: "Review checksums identify this candidate; they are not a Stage-2 seal or human geometry approval. Separate geometry regression results are required for Gate 1.",
      implementationTreeState: "uncommitted-working-tree",
      worktreeProvenance: { fileName: provenanceName, sha256: await sha256(path.join(outputDirectory, provenanceName)), sourceInventorySha256: provenanceBefore.sourceInventorySha256 },
      capturedAt: startedAt,
      completedAt: new Date().toISOString(),
      route: routePath,
      baseUrl,
      execution: { workers: 1, retries: 0, playwright: playwrightPackage.version, node: process.version },
      inputs: { expectedSeed, expectedFingerprints, selectedBrowsers, captureFilter: captureFilter ?? null, localTurnstileStub: true, localGetAndHeadRequestsOnly: true },
      captures,
      historicalProjectsReferences,
      captureCount: captures.length,
    };
    const manifestName = "capture-manifest.json";
    await writeFile(path.join(outputDirectory, manifestName), JSON.stringify(manifest, null, 2) + "\n");
    const manifestSha256 = await sha256(path.join(outputDirectory, manifestName));
    await writeFile(path.join(outputDirectory, "README.md"), [
      "# Stage-1 geometry candidate for human review",
      "",
      "Human Geometry Approval: PENDING. Stage 2/refreeze and Stage 3+ have not started.",
      "",
      `Source HEAD: \`${provenanceBefore.head}\`. Captured worktree inventory SHA-256: \`${provenanceBefore.sourceInventorySha256}\`.`,
      `Capture manifest SHA-256: \`${manifestSha256}\`. This is a review inventory digest, not a refreeze seal.`,
      "",
      "The capture harness runs serially with zero retries. Per-capture JSON records actual projection, seed, fingerprints, existing score diagnostics, DOM-protected bounds, and sampled Application clearances. Diagnostic PNGs add cyan protected-content bounds and a review label; scene PNGs preserve the product view.",
      "",
      ...captures.map((capture) => `- [${capture.fileName}](${capture.fileName}) · [metrics](${capture.metrics.fileName})${capture.diagnostic ? ` · [diagnostic](${capture.diagnostic.fileName})` : ""}`),
      "",
    ].join("\n"));
    console.log(`Stage-1 review candidate: ${path.relative(repositoryRoot, outputDirectory)}`);
    console.log(`Capture manifest SHA-256: ${manifestSha256}; Human Geometry Approval remains PENDING.`);
  } catch (error) {
    await writeFile(path.join(outputDirectory, "capture-failure.json"), JSON.stringify({
      status: "INCOMPLETE",
      humanGeometryApproval: "PENDING",
      sourceInventorySha256: provenanceBefore.sourceInventorySha256,
      message: error.message,
      completedCaptures: captures,
    }, null, 2) + "\n");
    console.error(serverOutput);
    throw error;
  } finally {
    await cleanup();
    process.removeListener("SIGINT", interrupted);
    process.removeListener("SIGTERM", interrupted);
  }
}
