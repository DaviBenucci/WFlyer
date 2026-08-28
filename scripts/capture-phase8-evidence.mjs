import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = 43_128;
const suppliedBaseUrl = process.env.WFLYER_EVIDENCE_BASE_URL?.replace(/\/$/u, "");
const baseUrl = suppliedBaseUrl ?? `http://127.0.0.1:${port}`;
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-8",
);
const motionPath = "/__visual-lab/story/motion";

const captures = [
  {
    chapterId: "application-overview",
    fileName: "01-application-overview-enhanced-1536x900.png",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "application-how-it-works",
    fileName: "02-application-how-minimum-enhanced-1100x640.png",
    viewport: { height: 640, width: 1100 },
  },
  {
    chapterId: "application-benefits",
    fileName: "03-application-benefits-compact-390x844.png",
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  },
  {
    chapterId: "application-demo",
    fileName: "04-app04-missing-media-enhanced-1536x900.png",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "application-demo",
    fileName: "05-app04-missing-media-reduced-390x844.png",
    hasTouch: true,
    reducedMotion: "reduce",
    viewport: { height: 844, width: 390 },
  },
  {
    chapterId: "application-access",
    fileName: "06-application-access-enhanced-1536x900.png",
    focus: '[data-primary-app-access="true"]',
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "application-terminal",
    fileName: "07-application-barline-terminal-enhanced-1536x900.png",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "application-terminal",
    fileName: "08-application-ending-compact-390x844.png",
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  },
];

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

  throw new Error("The Phase-8 evidence server did not become ready.");
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

async function capture(browser, definition) {
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    hasTouch: definition.hasTouch ?? false,
    locale: "pt-BR",
    reducedMotion: definition.reducedMotion ?? "no-preference",
    viewport: definition.viewport,
  });
  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}${motionPath}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-story-bootstrap]")
          ?.getAttribute("data-bootstrap-state") === "REVEALED" &&
        document
          .querySelector("main[data-motion-lab]")
          ?.getAttribute("data-motion-lifecycle") === "mounted",
      undefined,
      { timeout: 10_000 },
    );
    await page.evaluate(async (chapterId) => {
      await document.fonts.ready;
      const controller = window.__WFLYER_PHASE5_MOTION__;
      if (!controller) throw new Error("The motion controller is unavailable.");
      await controller.position(chapterId);
    }, definition.chapterId);
    await page.waitForFunction(
      (chapterId) =>
        document
          .querySelector("main[data-motion-lab]")
          ?.getAttribute("data-motion-active-chapter") === chapterId,
      definition.chapterId,
    );
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
    if (definition.focus) await page.locator(definition.focus).focus();

    const proof = await page.evaluate((chapterId) => {
      const root = document.querySelector("main[data-motion-lab]");
      const chapter = document.querySelector(`[data-chapter-id="${chapterId}"]`);
      const scene = chapter?.querySelector("[data-application-scene]");
      const stage = document.querySelector("[data-motion-stage]");
      const bounds = scene?.getBoundingClientRect();
      const stageBounds = stage?.getBoundingClientRect();
      const device = document.querySelector("[data-application-demo-device]");
      const barline = document.querySelector(
        '[data-final-barline-before="application-terminal"]',
      );
      const terminal = document.querySelector(
        '[data-branch-terminal="application"]',
      );

      return {
        activeChapter: root?.getAttribute("data-motion-active-chapter"),
        app04MediaContract: device?.getAttribute("data-app04-media-contract"),
        app04State: device?.getAttribute("data-app04-state"),
        applicationSceneCount: document.querySelectorAll(
          "[data-application-scene]",
        ).length,
        barlineBeforeTerminal:
          barline !== null &&
          terminal !== null &&
          Boolean(
            barline.compareDocumentPosition(terminal) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        chapterInsideStage:
          bounds !== undefined &&
          stageBounds !== undefined &&
          bounds.left >= stageBounds.left - 3 &&
          bounds.right <= stageBounds.right + 3 &&
          bounds.top >= stageBounds.top - 3 &&
          bounds.bottom <= stageBounds.bottom + 3,
        finalMediaNodeCount: device?.querySelectorAll(
          "video, img, picture, canvas",
        ).length,
        noHorizontalOverflow:
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
        primaryAccessCount: document.querySelectorAll(
          '[data-primary-app-access="true"]',
        ).length,
        projectionMode: root?.getAttribute("data-projection-mode"),
      };
    }, definition.chapterId);

    if (
      proof.activeChapter !== definition.chapterId ||
      proof.applicationSceneCount !== 6 ||
      proof.app04MediaContract !== "missing" ||
      proof.app04State !== "ERROR_STATIC" ||
      proof.finalMediaNodeCount !== 0 ||
      proof.primaryAccessCount !== 1 ||
      !proof.barlineBeforeTerminal ||
      !proof.noHorizontalOverflow
    ) {
      throw new Error(
        `${definition.fileName} failed its Phase-8 capture contract: ${JSON.stringify(proof)}`,
      );
    }
    if (
      proof.projectionMode === "horizontal-enhanced" &&
      !proof.chapterInsideStage
    ) {
      throw new Error(`${definition.fileName} is clipped by the enhanced stage.`);
    }

    await page.screenshot({
      animations: "disabled",
      caret: "hide",
      path: path.join(outputDirectory, definition.fileName),
    });
  } finally {
    await context.close();
  }
}

await mkdir(outputDirectory, { recursive: true });

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
          WFLYER_DEPLOYMENT_ENVIRONMENT: "production",
          WFLYER_TRANSITION_TEST_MODE: "1",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
server?.stdout.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
});
server?.stderr.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  for (const definition of captures) await capture(browser, definition);
} catch (error) {
  throw new Error(`Phase-8 capture failed.\n${serverOutput}`, { cause: error });
} finally {
  await browser?.close();
  if (server !== null) await stopServer(server);
}

console.log(`Phase-8 evidence captured: ${captures.length} deterministic views.`);
