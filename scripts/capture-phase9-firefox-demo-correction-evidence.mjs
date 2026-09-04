import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, firefox } from "playwright";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = Number(process.env.WFLYER_EVIDENCE_PORT ?? 43_129);
const suppliedBaseUrl = process.env.WFLYER_EVIDENCE_BASE_URL?.replace(/\/$/u, "");
const baseUrl = suppliedBaseUrl ?? "http://127.0.0.1:" + port;
const motionPath = "/__visual-lab/story/motion";
const outputDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-firefox-correction-2026-09-04",
);
const priorDirectory = path.join(
  repositoryRoot,
  "docs/canonical-v2/06-migration/evidence/phase-9/task-34-refinement-2026-08-31",
);

const definitions = [
  {
    browser: "chromium",
    chapterId: "home",
    fileName: "01-current-home-dark-chromium-1536x900.png",
    priorFileName: "01-scene-home-dark-1536x900.png",
    relationship: "revalidates-current-review",
    reviewTarget: "home-origin",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-overview",
    fileName: "02-current-application-overview-dark-chromium-1536x900.png",
    priorFileName: "02-scene-application-overview-dark-1536x900.png",
    relationship: "revalidates-current-review",
    reviewTarget: "application-overview",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-how-it-works",
    fileName: "03-current-application-how-dark-chromium-1536x900.png",
    priorFileName: "03-scene-application-how-it-works-dark-1536x900.png",
    relationship: "revalidates-current-review",
    reviewTarget: "application-how-it-works",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-benefits",
    fileName: "04-current-application-benefits-dark-chromium-1536x900.png",
    priorFileName: "04-scene-application-benefits-dark-1536x900.png",
    relationship: "supersedes-for-current-review",
    reviewTarget: "application-benefits",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-demo",
    fileName: "05-current-application-demo-dark-chromium-1536x900.png",
    priorFileName: "05-scene-application-demo-dark-1536x900.png",
    relationship: "supersedes-for-current-review",
    reviewTarget: "application-demo-cta-and-tablet",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-access",
    fileName: "06-current-application-launch-dark-chromium-1536x900.png",
    priorFileName: "06-scene-application-access-dark-1536x900.png",
    relationship: "supersedes-for-current-review",
    reviewTarget: "application-launch",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "chromium",
    chapterId: "application-terminal",
    fileName: "07-current-application-terminal-dark-chromium-1536x900.png",
    priorFileName: "07-scene-application-terminal-dark-1536x900.png",
    relationship: "supersedes-for-current-review",
    reviewTarget: "application-terminal",
    theme: "dark",
    viewport: { height: 900, width: 1_536 },
  },
  {
    browser: "firefox",
    chapterId: "home",
    fileName: "08-firefox-origin-home-dark-1536x864.png",
    relationship: "supplements-prior-review",
    reviewTarget: "firefox-origin-departure",
    theme: "dark",
    viewport: { height: 864, width: 1_536 },
  },
  {
    browser: "firefox",
    chapterId: "application-terminal",
    fileName: "09-firefox-reported-terminal-dark-1920x917.png",
    relationship: "supplements-prior-review",
    reviewTarget: "firefox-reported-terminal-return",
    theme: "dark",
    viewport: { height: 917, width: 1_920 },
  },
  {
    browser: "firefox",
    chapterId: "application-overview",
    fileName: "10-firefox-high-overview-dark-1920x1200.png",
    relationship: "supplements-prior-review",
    reviewTarget: "firefox-high-viewport-overview-exit",
    theme: "dark",
    viewport: { height: 1_200, width: 1_920 },
  },
  {
    browser: "firefox",
    chapterId: "application-how-it-works",
    fileName: "11-firefox-high-how-dark-1920x1200.png",
    relationship: "supplements-prior-review",
    reviewTarget: "firefox-high-viewport-how-arrival",
    theme: "dark",
    viewport: { height: 1_200, width: 1_920 },
  },
];

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function sha256(relativeOrAbsolutePath) {
  const bytes = await readFile(relativeOrAbsolutePath);
  return createHash("sha256").update(bytes).digest("hex");
}

async function waitForServer() {
  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl + "/", {
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

  throw new Error("The Phase-9 correction evidence server did not become ready.");
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

async function openStory(browser, definition) {
  const context = await browser.newContext({
    colorScheme: definition.theme,
    deviceScaleFactor: 1,
    locale: "pt-BR",
    reducedMotion: "no-preference",
    viewport: definition.viewport,
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
          configuration.callback("phase-9-correction-evidence-token"),
        );
        return "phase-9-correction-evidence-" + widgetIndex;
      },
      reset() {},
    };
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.addInitScript((theme) => {
    window.localStorage.setItem("wf-theme", theme);
  }, definition.theme);
  await page.goto(baseUrl + motionPath, { waitUntil: "domcontentloaded" });
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
    content:
      "nextjs-portal { display: none !important; }" +
      "*, *::before, *::after {" +
      "animation-duration: 0s !important;" +
      "caret-color: transparent !important;" +
      "transition-duration: 0s !important;" +
      "}",
  });

  return { context, page, pageErrors };
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

async function scoreProof(page) {
  const proof = await page.evaluate(() => {
    const layer = document.querySelector("[data-story-score-layer]");
    const root = document.querySelector("main[data-motion-lab]");
    return {
      bootstrapState: document
        .querySelector("[data-story-bootstrap]")
        ?.getAttribute("data-bootstrap-state"),
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
    proof.bootstrapState !== "REVEALED" ||
    proof.projection !== "horizontal-enhanced" ||
    proof.composerInvocations !== 2 ||
    proof.connectorEvents !== 0 ||
    proof.pathIntersections !== 0 ||
    proof.staffIntersections !== 0 ||
    proof.maximumNotationTangent > 18 ||
    proof.servicesMeasurement !== "dom-measured" ||
    proof.howMeasurement !== "dom-measured"
  ) {
    throw new Error("Score capture precondition failed: " + JSON.stringify(proof));
  }

  return proof;
}

async function demoCtaProof(page) {
  return page.evaluate(() => {
    const track = document.querySelector("[data-motion-track]");
    const target = document.querySelector(
      '[data-chapter-id="application-demo"] ' +
        '[data-score-content-exclusion="heading-and-body"] a',
    );
    const branch = document.querySelector('[data-score-branch="application"]');
    if (!track || !target || !branch) {
      throw new Error("Missing Demo CTA clearance owner");
    }
    const trackRect = track.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const rect = {
      bottom: targetRect.bottom - trackRect.top,
      left: targetRect.left - trackRect.left,
      right: targetRect.right - trackRect.left,
      top: targetRect.top - trackRect.top,
    };
    let minimumClearance = Number.POSITIVE_INFINITY;

    branch
      .querySelectorAll('[data-score-role="staff-line"]')
      .forEach((line) => {
        const matrix = line.getScreenCTM();
        if (!matrix) throw new Error("Missing Demo staff matrix");
        const length = line.getTotalLength();
        const sampleCount = Math.max(1, Math.ceil(length / 3));
        const radius = Number(line.getAttribute("stroke-width") ?? 0) / 2;

        for (let index = 0; index <= sampleCount; index += 1) {
          const rawPoint = line.getPointAtLength((length * index) / sampleCount);
          const point = new DOMPoint(rawPoint.x, rawPoint.y).matrixTransform(
            matrix,
          );
          const x = point.x - trackRect.left;
          const y = point.y - trackRect.top;
          const dx = Math.max(rect.left - x, 0, x - rect.right);
          const dy = Math.max(rect.top - y, 0, y - rect.bottom);
          const clearance =
            (dx || dy
              ? Math.hypot(dx, dy)
              : -Math.min(
                  x - rect.left,
                  rect.right - x,
                  y - rect.top,
                  rect.bottom - y,
                )) - radius;
          minimumClearance = Math.min(minimumClearance, clearance);
        }
      });

    const rounded = Number(minimumClearance.toFixed(2));
    return {
      classification:
        minimumClearance < 0
          ? "COLLISION"
          : minimumClearance < 12
            ? "TOO_CLOSE"
            : "CLEAR",
      minimumClearance: rounded,
      threshold: 12,
    };
  });
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
  serverOutput = (serverOutput + chunk).slice(-12_000);
});
server?.stderr.on("data", (chunk) => {
  serverOutput = (serverOutput + chunk).slice(-12_000);
});

const launchedBrowsers = {};
const files = [];
try {
  await waitForServer();
  launchedBrowsers.chromium = await chromium.launch();
  launchedBrowsers.firefox = await firefox.launch();

  for (const definition of definitions) {
    const browser = launchedBrowsers[definition.browser];
    const { context, page, pageErrors } = await openStory(browser, definition);
    try {
      const proof = await scoreProof(page);
      await position(page, definition.chapterId);
      if (definition.chapterId === "application-access") {
        await page.waitForFunction(
          () =>
            document
              .querySelector("[data-app-launch-interest-state]")
              ?.getAttribute("data-app-launch-interest-state") === "IDLE",
        );
      }
      const ctaProof =
        definition.reviewTarget === "application-demo-cta-and-tablet"
          ? await demoCtaProof(page)
          : null;
      if (ctaProof !== null && ctaProof.minimumClearance < ctaProof.threshold) {
        throw new Error(
          "Demo CTA capture clearance failed: " + JSON.stringify(ctaProof),
        );
      }
      if (pageErrors.length > 0) {
        throw new Error("Page errors before capture: " + JSON.stringify(pageErrors));
      }

      const outputPath = path.join(outputDirectory, definition.fileName);
      await page.screenshot({
        animations: "disabled",
        caret: "hide",
        path: outputPath,
      });
      const prior =
        definition.priorFileName === undefined
          ? null
          : {
              fileName: definition.priorFileName,
              sha256: await sha256(
                path.join(priorDirectory, definition.priorFileName),
              ),
            };

      files.push({
        activeChapter: definition.chapterId,
        browser: {
          engine: definition.browser,
          version: browser.version(),
        },
        demoCtaClearance: ctaProof,
        deviceScaleFactor: 1,
        fileName: definition.fileName,
        height: definition.viewport.height,
        pageErrorCount: pageErrors.length,
        prior,
        projection: proof.projection,
        relationship: definition.relationship,
        reviewTarget: definition.reviewTarget,
        route: motionPath,
        scoreProof: proof,
        selectionMethod: "window.__WFLYER_PHASE5_MOTION__.position(chapterId)",
        sha256: await sha256(outputPath),
        theme: definition.theme,
        width: definition.viewport.width,
      });
    } finally {
      await context.close();
    }
  }

  const sourceFiles = [
    "src/lib/story/score/projection.ts",
    "tests/e2e/phase09-score-refinement.spec.ts",
    "tests/unit/story/story-score-projection.test.ts",
    "scripts/capture-phase9-firefox-demo-correction-evidence.mjs",
  ];
  const sourceSha256 = Object.fromEntries(
    await Promise.all(
      sourceFiles.map(async (fileName) => [
        fileName,
        await sha256(path.join(repositoryRoot, fileName)),
      ]),
    ),
  );
  const packageMetadata = JSON.parse(
    await readFile(path.join(repositoryRoot, "node_modules/playwright/package.json")),
  );

  await writeFile(
    path.join(outputDirectory, "capture-manifest.json"),
    JSON.stringify(
      {
        activeChange: "refine-phase-9-score-choreography-and-prelaunch",
        captureCount: files.length,
        capturedAt: "2026-09-04",
        correctionSourceSha256: sourceSha256,
        files,
        implementationTreeState: "uncommitted-working-tree",
        relationship: {
          historicalTask34: {
            manifestSha256:
              "c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a",
            path: "../task-34-integration-review-2026-08-31/",
            payloadCount: 11,
            role: "immutable-checkpoint",
          },
          kind: "corrective-addendum",
          priorRefinementCandidate: {
            disposition:
              "retained-byte-identical; insufficient-alone-after-runtime-report",
            manifestSha256:
              "1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442",
            path: "../task-34-refinement-2026-08-31/",
            payloadCount: 28,
          },
        },
        repositoryBaseSha: "2ffef25b3ba621b535a00c001d68fc3a6977085c",
        route: motionPath,
        runtime: {
          node: process.version.replace(/^v/u, ""),
          playwright: packageMetadata.version,
        },
        schema: "wflyer-phase9-refinement-firefox-correction-capture/v1",
        trigger: {
          browser: "Firefox",
          invariant: "staffLineSelfIntersections.application",
          measurementSource: "dom-measured",
          observed: 1,
          reportedViewport: { height: 917, width: 1_920 },
          staffLineIndex: 4,
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
} catch (error) {
  throw new Error("Phase-9 correction capture failed.\n" + serverOutput, {
    cause: error,
  });
} finally {
  await Promise.all(
    Object.values(launchedBrowsers).map((browser) => browser.close()),
  );
  if (server !== null) await stopServer(server);
}

console.log(
  "Phase-9 Firefox/Demo correction evidence captured: " +
    files.length +
    " deterministic views.",
);
