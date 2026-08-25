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
const port = 43_123;
const baseUrl = new URL(`http://127.0.0.1:${port}`);
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-3",
);

const captures = [
  {
    fileName: "01-services-desktop-1536x1024.png",
    route: "/servicos",
    reducedMotion: "no-preference",
    viewport: { height: 1024, width: 1536 },
  },
  {
    fileName: "02-projects-desktop-1536x1024.png",
    route: "/portfolio",
    reducedMotion: "no-preference",
    viewport: { height: 1024, width: 1536 },
  },
  {
    fileName: "03-project-detail-mobile-390x844.png",
    route: "/portfolio/w-flyer",
    reducedMotion: "no-preference",
    viewport: { height: 844, width: 390 },
  },
  {
    fileName: "04-application-tablet-768x1024.png",
    route: "/aplicacao-wflyer",
    reducedMotion: "no-preference",
    viewport: { height: 1024, width: 768 },
  },
  {
    fileName: "05-contact-desktop-1536x1024.png",
    route: "/contato",
    reducedMotion: "no-preference",
    viewport: { height: 1024, width: 1536 },
  },
  {
    fileName: "06-benefits-reduced-motion-1536x1024.png",
    route: "/aplicacao-wflyer/beneficios",
    reducedMotion: "reduce",
    viewport: { height: 1024, width: 1536 },
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
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
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
      `Refusing to overwrite existing Phase 3 screenshots:\n${existingTargets.join("\n")}`,
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
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
        NEXT_TELEMETRY_DISABLED: "1",
        WFLYER_TRANSITION_TEST_MODE: "1",
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
        `Owned development server exited before Phase-3 routes were ready.\n${serverOutput}`,
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
    await page.route("**/turnstile/v0/api.js**", async (route) => {
      await route.fulfill({
        body: `
          window.turnstile = {
            render: function (container, options) {
              var button = document.createElement("button");
              button.type = "button";
              button.textContent = "Concluir verificação de teste";
              button.addEventListener("click", function () {
                options.callback("phase-3-capture-token");
              });
              container.appendChild(button);
              return "phase-3-capture-widget";
            },
            remove: function () {},
            reset: function () {}
          };
        `,
        contentType: "application/javascript; charset=utf-8",
        status: 200,
      });
    });

    const response = await page.goto(captureUrl(capture.route), {
      waitUntil: "domcontentloaded",
    });
    assert.equal(response?.status(), 200, `${capture.route} must return 200`);
    await page.locator("main#main-content").waitFor({ state: "visible" });
    if (capture.route === "/contato") {
      await page
        .getByRole("button", { name: "Concluir verificação de teste" })
        .waitFor({ state: "visible" });
    }
    assert.equal(
      await page.locator("main#main-content h1").count(),
      1,
      `${capture.route} must expose exactly one H1`,
    );
    assert.equal(
      await page
        .locator('main a[href="https://app.wflyer.com.br"]')
        .count(),
      0,
      `${capture.route} must not expose an early application-access CTA`,
    );

    await page.addStyleTag({ content: deterministicCaptureStyle });
    await waitForStableRendering(page);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(
      dimensions.scrollWidth <= dimensions.clientWidth,
      `${capture.fileName} has horizontal overflow (${dimensions.scrollWidth}px > ${dimensions.clientWidth}px)`,
    );
    assert.deepEqual(
      pageErrors,
      [],
      `Browser page errors while preparing ${capture.fileName}`,
    );

    await page.screenshot({
      animations: "disabled",
      caret: "hide",
      fullPage: true,
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
    path.join(outputDirectory, ".phase-3-content-capture-"),
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
    `Phase 3 content evidence captured: ${captures.length} PNGs in ${outputDirectory}.`,
  );
}
