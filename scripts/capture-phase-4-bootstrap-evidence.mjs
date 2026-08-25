import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import {
  link,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = 43_124;
const baseUrl = new URL(`http://127.0.0.1:${port}`);
const bootstrapRoute = "/__visual-lab/story/bootstrap";
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-4",
);

const bootstrapRootSelector = "[data-story-bootstrap]";
const bootstrapCoverSelector = "[data-bootstrap-cover]";
const musicRendererMarkerSelector = [
  "[data-composer-semantics]",
  "[data-connector-fixture]",
  "[data-music-visual-lab]",
  "[data-music-renderer]",
  "[data-origin-score]",
  "[data-rendered-score]",
  "[data-score-model]",
  "[data-score-role]",
  "[data-score-segment]",
  "[data-staff]",
  "[data-staff-segment]",
  "[data-musical-note]",
  "[data-narrative-clef]",
  "[data-measure-bar]",
  "[data-chapter-note]",
].join(", ");

const captures = [
  {
    destination: "unresolved",
    degradedReason: "none",
    fileName: "01-bootstrap-slow-critical-cover-home-desktop-1536x1024.png",
    reducedMotion: "no-preference",
    route: `${bootstrapRoute}?scenario=slow-critical`,
    scenario: "slow-critical",
    source: "unresolved",
    state: "WAITING_CRITICAL",
    targetSelector: "#home",
    viewport: { height: 1024, width: 1536 },
    visibleCover: true,
  },
  {
    destination: "professional-projects",
    degradedReason: "none",
    fileName: "02-bootstrap-projects-revealed-desktop-1536x1024.png",
    reducedMotion: "no-preference",
    route: `${bootstrapRoute}#projetos`,
    scenario: "normal",
    source: "explicit-hash",
    state: "REVEALED",
    targetSelector: "#projetos",
    viewport: { height: 1024, width: 1536 },
    visibleCover: false,
  },
  {
    destination: "professional-contact",
    degradedReason: "hard-timeout",
    fileName: "03-bootstrap-timeout-contact-degraded-mobile-390x844.png",
    reducedMotion: "no-preference",
    route: `${bootstrapRoute}?scenario=timeout#contato`,
    scenario: "timeout",
    source: "explicit-hash",
    state: "DEGRADED",
    targetSelector: "#contato",
    viewport: { height: 844, width: 390 },
    visibleCover: false,
  },
  {
    destination: "application-benefits",
    degradedReason: "none",
    fileName: "04-bootstrap-benefits-reduced-motion-desktop-1536x1024.png",
    reducedMotion: "reduce",
    route: `${bootstrapRoute}#beneficios`,
    scenario: "normal",
    source: "explicit-hash",
    state: "REVEALED",
    targetSelector: "#beneficios",
    viewport: { height: 1024, width: 1536 },
    visibleCover: false,
  },
];

const deterministicCaptureStyle = `
  nextjs-portal {
    display: none !important;
  }

  html {
    scroll-behavior: auto !important;
  }

  *,
  *::before,
  *::after {
    caret-color: transparent !important;
  }

  [data-bootstrap-cover],
  [data-bootstrap-cover] * {
    animation-play-state: paused !important;
    transition: none !important;
  }
`;

let browser;
let ownedDevServer;
let receivedSignal;
let serverOutput = "";
let stopServerPromise;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function captureUrl(route) {
  return new URL(route, baseUrl).toString();
}

function assertNoArguments() {
  const unexpectedArguments = process.argv.slice(2);

  if (unexpectedArguments.length > 0) {
    throw new Error(
      `This capture accepts no arguments and never overwrites evidence. Unexpected arguments: ${unexpectedArguments.join(" ")}`,
    );
  }
}

function assertNotInterrupted() {
  if (receivedSignal) {
    throw new Error(`Capture interrupted by ${receivedSignal}.`);
  }
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function assertOutputTargetsAbsent() {
  const existingTargets = [];

  for (const capture of captures) {
    const target = path.join(outputDirectory, capture.fileName);
    if (await pathExists(target)) existingTargets.push(target);
  }

  if (existingTargets.length > 0) {
    throw new Error(
      `Refusing to overwrite existing Phase 4 screenshots:\n${existingTargets.join("\n")}`,
    );
  }
}

async function probe(route = "/") {
  try {
    const response = await fetch(captureUrl(route), {
      redirect: "manual",
      signal: AbortSignal.timeout(2_000),
    });
    const result = { reachable: true, status: response.status };
    await response.body?.cancel();
    return result;
  } catch {
    return { reachable: false, status: null };
  }
}

function recordServerOutput(chunk) {
  serverOutput = `${serverOutput}${chunk.toString()}`.slice(-16_000);
}

async function startOwnedDevelopmentServer() {
  assertNotInterrupted();
  const initialProbe = await probe();

  if (initialProbe.reachable) {
    throw new Error(
      `${baseUrl.origin} is already reachable (HTTP ${initialProbe.status}). Refusing to capture from or terminate an unowned server.`,
    );
  }

  ownedDevServer = spawn(
    "pnpm",
    [
      "exec",
      "next",
      "dev",
      "--hostname",
      baseUrl.hostname,
      "--port",
      String(port),
    ],
    {
      cwd: repositoryRoot,
      detached: process.platform !== "win32",
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  ownedDevServer.stdout?.on("data", recordServerOutput);
  ownedDevServer.stderr?.on("data", recordServerOutput);
  ownedDevServer.on("error", recordServerOutput);

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    assertNotInterrupted();
    if (
      ownedDevServer.exitCode !== null ||
      ownedDevServer.signalCode !== null
    ) {
      throw new Error(
        `Owned development server exited before the Phase-4 bootstrap route was ready.\n${serverOutput}`,
      );
    }

    const routeProbe = await probe(captures[0].route);
    if (routeProbe.status === 200) return;
    await delay(400);
  }

  throw new Error(
    `Timed out waiting for the owned development server.\n${serverOutput}`,
  );
}

async function stopOwnedDevelopmentServerImplementation() {
  if (
    !ownedDevServer ||
    ownedDevServer.exitCode !== null ||
    ownedDevServer.signalCode !== null
  ) {
    return;
  }

  const exitPromise = once(ownedDevServer, "exit").catch(() => undefined);
  try {
    if (process.platform === "win32") {
      ownedDevServer.kill("SIGTERM");
    } else {
      process.kill(-ownedDevServer.pid, "SIGTERM");
    }
  } catch (error) {
    if (error?.code !== "ESRCH") throw error;
  }

  await Promise.race([exitPromise, delay(5_000)]);
  if (
    ownedDevServer.exitCode === null &&
    ownedDevServer.signalCode === null
  ) {
    try {
      if (process.platform === "win32") {
        ownedDevServer.kill("SIGKILL");
      } else {
        process.kill(-ownedDevServer.pid, "SIGKILL");
      }
    } catch (error) {
      if (error?.code !== "ESRCH") throw error;
    }
    await exitPromise;
  }
}

function stopOwnedDevelopmentServer() {
  stopServerPromise ??= stopOwnedDevelopmentServerImplementation();
  return stopServerPromise;
}

async function closeBrowser() {
  if (!browser) return;
  const browserToClose = browser;
  browser = undefined;
  await browserToClose.close();
}

async function waitForStableRendering(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

async function waitForTargetInViewport(page, selector) {
  await page.waitForFunction(
    (targetSelector) => {
      const target = document.querySelector(targetSelector);
      if (!(target instanceof HTMLElement)) return false;
      const bounds = target.getBoundingClientRect();
      return (
        bounds.bottom > 0 &&
        bounds.right > 0 &&
        bounds.top < window.innerHeight &&
        bounds.left < window.innerWidth
      );
    },
    selector,
    { timeout: 7_000 },
  );
}

async function assertBootstrapContract(page, capture) {
  const root = page.locator(bootstrapRootSelector);
  await root.waitFor({ state: "attached" });
  await page
    .locator(
      `${bootstrapRootSelector}[data-bootstrap-state="${capture.state}"]`,
    )
    .waitFor({ state: "attached", timeout: 8_000 });

  assert.equal(
    await root.getAttribute("data-bootstrap-destination"),
    capture.destination,
    `${capture.fileName} must expose the expected semantic destination`,
  );
  assert.equal(
    await root.getAttribute("data-bootstrap-source"),
    capture.source,
    `${capture.fileName} must expose the expected destination source`,
  );
  assert.equal(
    await root.getAttribute("data-bootstrap-scenario"),
    capture.scenario,
    `${capture.fileName} must expose the intended review scenario`,
  );
  assert.equal(
    await root.getAttribute("data-bootstrap-degraded-reason"),
    capture.degradedReason,
    `${capture.fileName} must expose the expected degraded reason`,
  );
  assert.equal(
    await root.getAttribute("data-bootstrap-reduced-motion"),
    String(capture.reducedMotion === "reduce"),
    `${capture.fileName} must expose its reduced-motion policy`,
  );

  const coverCount = await page.locator(bootstrapCoverSelector).count();
  assert.equal(
    coverCount,
    capture.visibleCover ? 1 : 0,
    `${capture.fileName} has an unexpected bootstrap-cover state`,
  );
  await waitForTargetInViewport(page, capture.targetSelector);
}

async function capturePage(tempDirectory, capture) {
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "pt-BR",
    reducedMotion: capture.reducedMotion,
    viewport: capture.viewport,
  });

  try {
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(captureUrl(capture.route), {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response?.status(), 200, `${capture.route} must return 200`);
    await assertBootstrapContract(page, capture);
    await page.addStyleTag({ content: deterministicCaptureStyle });
    await waitForStableRendering(page);
    // Recheck immediately before capture so a transient state can never be
    // published as evidence for a different readiness phase.
    await assertBootstrapContract(page, capture);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      dimensions.scrollWidth <= dimensions.clientWidth,
      `${capture.fileName} has horizontal overflow (${dimensions.scrollWidth}px > ${dimensions.clientWidth}px)`,
    );
    assert.equal(
      await page.locator(musicRendererMarkerSelector).count(),
      0,
      `${capture.fileName} must not mount Music renderer output during Phase 4`,
    );
    assert.deepEqual(
      pageErrors,
      [],
      `Browser page errors while preparing ${capture.fileName}`,
    );

    await page.screenshot({
      animations: "allow",
      caret: "hide",
      fullPage: false,
      path: path.join(tempDirectory, capture.fileName),
    });
  } finally {
    await context.close();
  }
}

async function assertValidPng(filePath) {
  const details = await stat(filePath);
  const bytes = await readFile(filePath);
  assert.ok(details.isFile(), `${filePath} must be a regular file`);
  assert.ok(details.size > 10_000, `${filePath} looks like an empty capture`);
  assert.deepEqual(
    [...bytes.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
    `${filePath} must be a PNG`,
  );
}

async function removeOwnedPublishedLinks(publishedLinks) {
  for (const published of [...publishedLinks].reverse()) {
    try {
      const [sourceDetails, targetDetails] = await Promise.all([
        lstat(published.source),
        lstat(published.target),
      ]);
      if (
        sourceDetails.dev === targetDetails.dev &&
        sourceDetails.ino === targetDetails.ino
      ) {
        await unlink(published.target);
      }
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
}

async function publishCaptures(tempDirectory) {
  await assertOutputTargetsAbsent();
  const publishedLinks = [];

  try {
    for (const capture of captures) {
      const source = path.join(tempDirectory, capture.fileName);
      const target = path.join(outputDirectory, capture.fileName);
      await assertValidPng(source);
      await link(source, target);
      publishedLinks.push({ source, target });
    }
  } catch (error) {
    await removeOwnedPublishedLinks(publishedLinks);
    throw error;
  }
}

function requestShutdown(signal) {
  receivedSignal ??= signal;
  void closeBrowser().catch(() => undefined);
  void stopOwnedDevelopmentServer().catch(() => undefined);
}

const signalHandlers = new Map(
  ["SIGINT", "SIGTERM"].map((signal) => [
    signal,
    () => requestShutdown(signal),
  ]),
);
for (const [signal, handler] of signalHandlers) {
  process.once(signal, handler);
}

let failure;
let tempDirectory;

try {
  assertNoArguments();
  await mkdir(outputDirectory, { recursive: true });
  await assertOutputTargetsAbsent();
  tempDirectory = await mkdtemp(
    path.join(outputDirectory, ".phase-4-bootstrap-capture-"),
  );
  await startOwnedDevelopmentServer();
  browser = await chromium.launch();

  for (const capture of captures) {
    assertNotInterrupted();
    await capturePage(tempDirectory, capture);
  }
  await publishCaptures(tempDirectory);
} catch (error) {
  failure = error;
} finally {
  try {
    await closeBrowser();
  } catch (error) {
    failure ??= error;
  }
  try {
    await stopOwnedDevelopmentServer();
  } catch (error) {
    failure ??= error;
  }
  if (tempDirectory) {
    try {
      await rm(tempDirectory, { force: true, recursive: true });
    } catch (error) {
      failure ??= error;
    }
  }
  for (const [signal, handler] of signalHandlers) {
    process.off(signal, handler);
  }
}

if (receivedSignal) {
  process.exitCode = receivedSignal === "SIGINT" ? 130 : 143;
} else if (failure) {
  throw failure;
} else {
  console.log(
    `Phase 4 bootstrap evidence captured: ${captures.length} PNGs in ${outputDirectory}.`,
  );
}
