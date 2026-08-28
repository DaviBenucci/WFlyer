import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = 43_127;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-7",
);
const motionPath = "/__visual-lab/story/motion";

const captures = [
  {
    chapterId: "professional-about",
    fileName: "01-about-persona-seam-enhanced-1536x900.png",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "professional-projects",
    fileName: "02-project-fan-focused-enhanced-1536x900.png",
    focus: "[data-project-card-link]",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "professional-contact",
    fileName: "03-contact-editing-minimum-enhanced-1100x640.png",
    focus: 'input[name="name"]',
    turnstile: true,
    viewport: { height: 640, width: 1100 },
  },
  {
    chapterId: "professional-contact",
    fileName: "03b-contact-editing-review-enhanced-1100x900.png",
    focus: 'input[name="name"]',
    turnstile: true,
    viewport: { height: 900, width: 1100 },
  },
  {
    chapterId: "professional-projects",
    fileName: "04-project-stack-compact-390x844.png",
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  },
  {
    chapterId: "professional-terminal",
    fileName: "05-professional-barline-terminal-enhanced-1536x900.png",
    viewport: { height: 900, width: 1536 },
  },
  {
    chapterId: "professional-terminal",
    fileName: "06-professional-terminal-reduced-390x844.png",
    reducedMotion: "reduce",
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

  throw new Error("The Phase-7 evidence server did not become ready.");
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

async function mockTurnstile(page) {
  await page.route("**/turnstile/v0/api.js**", async (route) => {
    await route.fulfill({
      body: `
        window.turnstile = {
          render: function (container, options) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = "Concluir verificação de teste";
            button.addEventListener("click", function () {
              options.callback("phase-7-evidence-token");
            });
            container.appendChild(button);
            return "phase-7-evidence-widget";
          },
          remove: function () {},
          reset: function () {}
        };
      `,
      contentType: "application/javascript; charset=utf-8",
      status: 200,
    });
  });
}

async function capture(browser, definition) {
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    hasTouch: definition.hasTouch ?? false,
    locale: "pt-BR",
    reducedMotion: definition.reducedMotion ?? "no-preference",
    viewport: definition.initialViewport ?? definition.viewport,
  });
  const page = await context.newPage();

  try {
    if (definition.turnstile) await mockTurnstile(page);
    const routeHash = definition.initialViewport ? "#projetos" : "";
    await page.goto(`${baseUrl}${motionPath}${routeHash}`, {
      waitUntil: "domcontentloaded",
    });
    await page
      .locator("[data-story-bootstrap]")
      .waitFor({ state: "attached", timeout: 10_000 });
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
    if (definition.initialViewport) {
      await page.setViewportSize(definition.viewport);
      await page.waitForFunction(
        () =>
          document
            .querySelector("main[data-motion-lab]")
            ?.getAttribute("data-projection-mode") === "vertical-wide",
      );
    }
    await page.evaluate(async ({ chapterId, position }) => {
      await document.fonts.ready;
      if (!position) return;
      const controller = window.__WFLYER_PHASE5_MOTION__;
      if (!controller) throw new Error("The motion controller is unavailable.");
      await controller.position(chapterId);
    }, {
      chapterId: definition.chapterId,
      position: definition.initialViewport === undefined,
    });
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

    if (definition.focus) {
      await page.locator(definition.focus).first().focus();
      if (definition.turnstile) {
        await page
          .getByRole("button", { name: "Concluir verificação de teste" })
          .waitFor({ state: "visible" });
      }
    }

    const proof = await page.evaluate((chapterId) => {
      const root = document.querySelector("main[data-motion-lab]");
      const chapter = document.querySelector(`[data-chapter-id="${chapterId}"]`);
      const scene = chapter?.querySelector("[data-professional-scene]");
      const stage = document.querySelector("[data-motion-stage]");
      const applicationPlaceholders = document.querySelectorAll(
        '[data-structural-placeholder^="application-"]',
      );
      const barline = document.querySelector(
        '[data-final-barline-before="professional-terminal"]',
      );
      const terminal = document.querySelector(
        '[data-branch-terminal="professional"]',
      );
      const bounds = scene?.getBoundingClientRect();
      const stageBounds = stage?.getBoundingClientRect();

      return {
        activeChapter: root?.getAttribute("data-motion-active-chapter"),
        applicationPlaceholderCount: applicationPlaceholders.length,
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
          bounds.left >= stageBounds.left - 1 &&
          bounds.right <= stageBounds.right + 1,
        noHorizontalOverflow:
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
        projectionMode: root?.getAttribute("data-projection-mode"),
      };
    }, definition.chapterId);

    if (
      proof.activeChapter !== definition.chapterId ||
      proof.applicationPlaceholderCount !== 6 ||
      !proof.barlineBeforeTerminal ||
      !proof.noHorizontalOverflow
    ) {
      throw new Error(
        `${definition.fileName} failed its Phase-7 capture contract: ${JSON.stringify(proof)}`,
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
const server = spawn(
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
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      NEXT_TELEMETRY_DISABLED: "1",
      WFLYER_DEPLOYMENT_ENVIRONMENT: "production",
      WFLYER_TRANSITION_TEST_MODE: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
server.stdout.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
});
server.stderr.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  for (const definition of captures) await capture(browser, definition);
} catch (error) {
  throw new Error(`Phase-7 capture failed.\n${serverOutput}`, { cause: error });
} finally {
  await browser?.close();
  await stopServer(server);
}

console.log(`Phase-7 evidence captured: ${captures.length} deterministic views.`);
