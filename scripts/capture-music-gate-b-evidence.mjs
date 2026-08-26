import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import {
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const DEFAULT_PORT = 43119;
const baseUrl = new URL(
  process.env.WFLYER_MUSIC_GATE_B_BASE_URL ??
    `http://127.0.0.1:${DEFAULT_PORT}`,
);
const outputDirectory = path.resolve(
  "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-b",
);
const viewport = { height: 1024, width: 1536 };
const EVIDENCE_ONLY_STYLE = `
  nextjs-portal,
  .wf-skip-link,
  [data-brand-intro-header],
  [data-score-transition-layer],
  [data-site-experience] > footer {
    display: none !important;
  }
`;

const GLYPH_KEYS = [
  "wf-music-treble-clef",
  "wf-music-notehead-filled",
  "wf-music-notehead-open",
  "wf-music-accidental-sharp",
  "wf-music-accidental-flat",
  "wf-music-accidental-natural",
  "wf-music-eighth-flag",
  "wf-music-sixteenth-double-flag",
];

const CALIBRATION_FILE_NAMES = new Map(
  GLYPH_KEYS.map((assetKey, index) => [
    assetKey,
    `${String(index + 3).padStart(2, "0")}-calibration-${assetKey.replace("wf-music-", "")}.png`,
  ]),
);

const generatedFiles = [];
let ownedDevServer;
let serverOutput = "";

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function probeLab() {
  try {
    const response = await fetch(routeUrl("/__visual-lab/music"), {
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
  serverOutput = `${serverOutput}${chunk.toString()}`.slice(-12_000);
}

async function ensureDevelopmentServer() {
  const initialProbe = await probeLab();

  if (initialProbe.status === 200) {
    console.log(`Using existing development server at ${baseUrl.origin}.`);
    return;
  }

  if (initialProbe.reachable) {
    throw new Error(
      `${baseUrl.origin} is occupied, but the development Music Visual Lab returned HTTP ${initialProbe.status}.`,
    );
  }

  if (
    baseUrl.protocol !== "http:" ||
    !["127.0.0.1", "localhost", "[::1]"].includes(baseUrl.hostname) ||
    baseUrl.pathname !== "/"
  ) {
    throw new Error(
      "An unreachable WFLYER_MUSIC_GATE_B_BASE_URL must be a loopback HTTP origin with no path so the script can start a development server safely.",
    );
  }

  const port = baseUrl.port || "80";
  ownedDevServer = spawn(
    "pnpm",
    [
      "exec",
      "next",
      "dev",
      "--hostname",
      baseUrl.hostname,
      "--port",
      port,
    ],
    {
      cwd: process.cwd(),
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
    if (ownedDevServer.exitCode !== null) {
      throw new Error(
        `Development server exited before the lab was ready.\n${serverOutput}`,
      );
    }

    const probe = await probeLab();
    if (probe.status === 200) {
      console.log(`Started development server at ${baseUrl.origin}.`);
      return;
    }
    await delay(400);
  }

  throw new Error(
    `Timed out waiting for the development Music Visual Lab.\n${serverOutput}`,
  );
}

async function stopOwnedDevelopmentServer() {
  if (!ownedDevServer || ownedDevServer.exitCode !== null) return;

  const exitPromise = once(ownedDevServer, "exit").catch(() => undefined);

  if (process.platform === "win32") {
    ownedDevServer.kill("SIGTERM");
  } else {
    process.kill(-ownedDevServer.pid, "SIGTERM");
  }

  await Promise.race([exitPromise, delay(5_000)]);

  if (ownedDevServer.exitCode === null) {
    if (process.platform === "win32") {
      ownedDevServer.kill("SIGKILL");
    } else {
      process.kill(-ownedDevServer.pid, "SIGKILL");
    }
    await exitPromise;
  }
}

async function waitForStableRendering(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

async function openFixture(page, route, fixturePage) {
  const response = await page.goto(routeUrl(route), {
    waitUntil: "domcontentloaded",
  });

  assert.equal(
    response?.status(),
    200,
    `${route} must be available from the development harness`,
  );
  await page
    .locator(`[data-fixture-page="${fixturePage}"]`)
    .waitFor({ state: "visible" });
  await page.addStyleTag({ content: EVIDENCE_ONLY_STYLE });
  await waitForStableRendering(page);

  assert.equal(
    await page.locator('[data-runtime-status="runtime-approved"]').count(),
    0,
    `${route} must not expose runtime-approved calibration evidence`,
  );
}

async function capturePage(page, fileName) {
  const target = path.join(outputDirectory, fileName);
  await waitForStableRendering(page);
  await page.screenshot({
    animations: "disabled",
    caret: "hide",
    fullPage: true,
    path: target,
  });
  generatedFiles.push(fileName);
}

async function captureLocator(locator, fileName) {
  const target = path.join(outputDirectory, fileName);
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({
    animations: "disabled",
    caret: "hide",
    path: target,
  });
  generatedFiles.push(fileName);
}

async function captureOverview(page) {
  await openFixture(page, "/__visual-lab/music", "index");
  assert.equal(await page.getByRole("link", { name: "Open fixture" }).count(), 7);
  await capturePage(page, "00-music-visual-lab-index.png");
}

async function captureGlyphGallery(page) {
  await openFixture(page, "/__visual-lab/music/glyphs", "glyphs");
  assert.equal(await page.locator("[data-glyph-scale]").count(), 64);

  const lightGallery = page.locator(
    '[data-fixture-page="glyphs"] > section',
  ).nth(0);
  const darkGallery = page.locator(
    '[data-fixture-page="glyphs"] > section',
  ).nth(1);

  assert.equal(await lightGallery.locator('[data-theme="light"]').count(), 32);
  assert.equal(await darkGallery.locator('[data-theme="dark"]').count(), 32);
  await captureLocator(lightGallery, "01-glyph-gallery-light.png");
  await captureLocator(darkGallery, "02-glyph-gallery-dark.png");
}

function assertCanonicalDraftPayload(payload) {
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.status, "draft-calibration");
  assert.equal(payload.generatedBy, "music-visual-lab");
  assert.deepEqual(
    payload.glyphs.map((glyph) => glyph.assetKey),
    GLYPH_KEYS,
  );

  for (const glyph of payload.glyphs) {
    assert.deepEqual(Object.keys(glyph).sort(), [
      "anchors",
      "assetKey",
      "coordinateSpace",
      "metrics",
      "sourceSha256",
      "status",
    ]);
    assert.equal(glyph.status, "draft-calibration");
    assert.equal(glyph.coordinateSpace, "normalized-view-box");
    assert.ok(glyph.metrics.nominalWidthSp > 0);
    assert.ok(glyph.metrics.nominalHeightSp > 0);
    assert.ok(Object.keys(glyph.anchors).length > 0);
    assert.match(glyph.sourceSha256.sourceMaster, /^[0-9a-f]{64}$/u);
    assert.match(glyph.sourceSha256.runtimeCandidate, /^[0-9a-f]{64}$/u);
    assert.equal(Object.hasOwn(glyph, "nominalWidthSp"), false);
    assert.equal(Object.hasOwn(glyph, "nominalHeightSp"), false);
  }
}

async function captureCalibration(page) {
  await openFixture(page, "/__visual-lab/music/calibration", "calibration");

  const workbench = page.locator(
    '[data-fixture-component="calibration-workbench"]',
  );
  assert.equal(
    await workbench.getAttribute("data-calibration-status"),
    "draft-calibration",
  );

  const calibrationCompositeThemes = ["light", "dark"];

  assert.equal(
    await page.locator("[data-calibration-composite-theme]").count(),
    calibrationCompositeThemes.length,
    "the calibration page must expose exactly one light and one dark composite",
  );

  for (const theme of calibrationCompositeThemes) {
    const composite = page.locator(
      `[data-calibration-composite-theme="${theme}"]`,
    );
    const fileName =
      theme === "light"
        ? "03-glyph-calibration-composites-light.png"
        : "04-glyph-calibration-composites-dark.png";

    assert.equal(
      await composite.count(),
      1,
      `the ${theme} calibration composite must be unique`,
    );
    await composite.waitFor({ state: "visible" });
    assert.equal(
      await composite.isVisible(),
      true,
      `the ${theme} calibration composite must be visible`,
    );
    assert.equal(
      await composite.getAttribute("data-runtime-status"),
      "draft-calibration",
      `the ${theme} calibration composite must remain draft-only`,
    );
    assert.equal(
      await composite
        .locator('[data-runtime-status="runtime-approved"]')
        .count(),
      0,
      `the ${theme} calibration composite must not contain runtime-approved evidence`,
    );
    await captureLocator(composite, fileName);
  }

  const glyphSelect = workbench.locator("select");
  assert.equal(
    await glyphSelect.count(),
    1,
    "the calibration workbench must expose one glyph selector",
  );
  const calibrationGrid = workbench.locator(":scope > div").first();

  for (const assetKey of GLYPH_KEYS) {
    await glyphSelect.selectOption(assetKey);
    const selectedPreviews = calibrationGrid.locator(
      `[data-calibration-preview="${assetKey}"]`,
    );
    await selectedPreviews.first().waitFor({ state: "visible" });
    assert.equal(await selectedPreviews.count(), 2);
    assert.equal(
      await calibrationGrid
        .locator('[data-runtime-status="draft-calibration"]')
        .count(),
      2,
    );

    const fileName = CALIBRATION_FILE_NAMES.get(assetKey);
    assert.ok(fileName);
    await captureLocator(calibrationGrid, fileName);
  }

  const accidentalContexts = workbench.locator(
    '[data-fixture="accidental-line-space-calibration"]',
  );
  assert.equal(
    await accidentalContexts.locator("[data-accidental-context]").count(),
    6,
  );
  await captureLocator(
    accidentalContexts,
    "11-calibration-accidentals-line-space.png",
  );

  const draftJson = await workbench
    .getByLabel("Draft calibration JSON")
    .inputValue();
  const draftPayload = JSON.parse(draftJson);
  assertCanonicalDraftPayload(draftPayload);

  const draftFileName = "draft-glyph-calibration.json";
  await writeFile(
    path.join(outputDirectory, draftFileName),
    `${JSON.stringify(draftPayload, null, 2)}\n`,
    "utf8",
  );
  generatedFiles.push(draftFileName);
}

async function captureRepresentativeFixtures(page) {
  await openFixture(page, "/__visual-lab/music/pitches", "pitches");
  assert.equal(
    await page
      .locator(
        '[data-fixture="landing-pitch-ladder"] [data-score-role="notehead"]',
      )
      .count(),
    13,
  );
  assert.equal(await page.locator("table tbody tr").count(), 10);
  await captureLocator(
    page.locator('[data-fixture-page="pitches"]'),
    "12-pitches-ledgers-stems-flags.png",
  );

  await openFixture(page, "/__visual-lab/music/beams", "beams");
  assert.equal(await page.locator("[data-beam-motif]").count(), 7);
  assert.equal(
    await page.locator('[data-score-role="beam-secondary-hook-left"]').count(),
    1,
  );
  assert.equal(
    await page.locator('[data-score-role="beam-secondary-hook-right"]').count(),
    1,
  );
  assert.equal(await page.locator('[data-score-role="tuplet"]').count(), 2);
  assert.equal(await page.locator('[data-score-debug-overlay="true"]').count(), 0);
  await captureLocator(
    page.locator('[data-fixture-page="beams"]'),
    "13-beams-triplets-hooks.png",
  );

  await openFixture(
    page,
    "/__visual-lab/music/key-signatures",
    "key-signatures",
  );
  assert.equal(await page.locator("[data-fifths]").count(), 15);
  assert.equal(await page.locator('[data-score-role="barline"]').count(), 15);
  assert.equal(
    await page.locator('[data-score-role="final-barline-thin"]').count(),
    15,
  );
  assert.equal(
    await page.locator('[data-score-role="final-barline-thick"]').count(),
    15,
  );
  await captureLocator(
    page.locator('[data-fixture-page="key-signatures"]'),
    "14-key-signatures-and-barlines.png",
  );

  await openFixture(
    page,
    "/__visual-lab/music/curved-score",
    "curved-score",
  );
  assert.equal(await page.locator("[data-path-shape]").count(), 3);
  assert.equal(await page.locator('[data-score-role="staff-line"]').count(), 15);
  await captureLocator(
    page.locator('[data-fixture-page="curved-score"]'),
    "15-straight-arc-s-curve-score-paths.png",
  );

  await openFixture(page, "/__visual-lab/music/composer", "composer");
  await page
    .locator('[data-composer-control="seed"]')
    .fill("music-gate-b-review-seed-v1");
  await page
    .locator('[data-composer-control="chapter"]')
    .fill("music-gate-b-review-chapter");
  await page
    .locator('[data-composer-control="profile"]')
    .selectOption("ALL");
  await page
    .locator('[data-composer-control="theme"]')
    .selectOption("light");
  await page
    .locator('[data-composer-control="viewport"]')
    .selectOption("horizontal");
  await page.locator('[data-composer-control="debug"]').check();
  assert.equal(await page.locator("[data-composer-profile]").count(), 4);
  assert.equal(
    await page.locator('[data-score-debug-overlay="true"]').count(),
    4,
  );
  await captureLocator(
    page.locator('[data-fixture-page="composer"]'),
    "16-composer-four-profiles-explicit-seed.png",
  );
}

async function writeSha256Manifest() {
  const manifestEntries = [];

  for (const fileName of [...generatedFiles].sort()) {
    const filePath = path.join(outputDirectory, fileName);
    const bytes = await readFile(filePath);
    const details = await stat(filePath);
    assert.ok(details.size > 0, `${fileName} must not be empty`);

    if (fileName.endsWith(".png")) {
      assert.ok(details.size > 10_000, `${fileName} looks like an empty capture`);
      assert.deepEqual(
        [...bytes.subarray(0, 8)],
        [137, 80, 78, 71, 13, 10, 26, 10],
        `${fileName} must be a PNG`,
      );
    }

    const digest = createHash("sha256").update(bytes).digest("hex");
    manifestEntries.push(`${digest}  ${fileName}`);
  }

  const manifestPath = path.join(outputDirectory, "SHA256SUMS.txt");
  await writeFile(manifestPath, `${manifestEntries.join("\n")}\n`, "utf8");

  for (const entry of manifestEntries) {
    const [expectedDigest, fileName] = entry.split("  ");
    const actualDigest = createHash("sha256")
      .update(await readFile(path.join(outputDirectory, fileName)))
      .digest("hex");
    assert.equal(actualDigest, expectedDigest);
  }
}

await mkdir(outputDirectory, { recursive: true });
let browser;

try {
  await ensureDevelopmentServer();
  browser = await chromium.launch();
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "pt-BR",
    reducedMotion: "reduce",
    viewport,
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await captureOverview(page);
    await captureGlyphGallery(page);
    await captureCalibration(page);
    await captureRepresentativeFixtures(page);
    assert.deepEqual(pageErrors, [], `Browser page errors: ${pageErrors.join("\n")}`);
  } finally {
    await context.close();
  }
} finally {
  try {
    await browser?.close();
  } finally {
    await stopOwnedDevelopmentServer();
  }
}

await writeSha256Manifest();

console.log(
  `Music Gate-B evidence captured: ${generatedFiles.filter((file) => file.endsWith(".png")).length} PNGs, one canonical draft JSON, and SHA256SUMS.txt in ${outputDirectory}.`,
);
