import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import {
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

const DEFAULT_PORT = 43121;
const baseUrl = new URL(
  process.env.WFLYER_MUSIC_GATE_C_DELTA_BASE_URL ??
    `http://127.0.0.1:${DEFAULT_PORT}`,
);
const originalEvidenceDirectory = path.resolve(
  "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c",
);
const captureArguments = process.argv.slice(2);
assert.ok(
  captureArguments.length === 1 &&
    captureArguments[0] === "--final-triplet",
  "Usage: node scripts/capture-music-gate-c-delta-evidence.mjs --final-triplet (the historical full-delta bundle is sealed)",
);
const tripletOnly = captureArguments[0] === "--final-triplet";
const captureScope = tripletOnly ? "final-triplet" : "full";
const outputDirectory = path.join(
  originalEvidenceDirectory,
  "final-triplet-2026-08-24",
);
const desktopViewport = { height: 1024, width: 1536 };
const mobileViewport = { height: 844, width: 390 };
const reviewViewport = { height: 1200, width: 720 };
const pathShapes = ["straight", "gentle-arc", "gentle-s"];
const stemDirections = ["up", "down"];
const responsiveModes = [
  "horizontal-enhanced",
  "vertical-wide",
  "vertical-compact",
  "static",
];
const tripletScreenshotFiles = [
  "01-motif-matrix-light.png",
  "02-motif-matrix-dark.png",
  "10-triplet-detail-light.png",
  "11-triplet-detail-dark.png",
];
const screenshotFiles = tripletOnly
  ? tripletScreenshotFiles
  : [
      ...tripletScreenshotFiles,
      "08-responsive-vertical-mobile.png",
      "12-responsive-orientation-light.png",
      "13-responsive-orientation-dark.png",
    ];
const jsonFiles = tripletOnly
  ? []
  : [
      "gate-c-delta-proposals.json",
      "gate-c-delta-semantic-equivalence.json",
    ];

function manifestFileName(stage, subject) {
  return tripletOnly
    ? `2026-08-24-${stage}-final-triplet-${subject}.sha256`
    : `2026-08-17-${stage}-delta-${subject}.sha256`;
}

const manifestFiles = [
  manifestFileName("pre", "approved-svg-files"),
  manifestFileName("pre", "committed-snapshots"),
  manifestFileName("post", "approved-svg-files"),
  manifestFileName("post", "committed-snapshots"),
];
const authorizedFiles = new Set([
  ...screenshotFiles,
  ...jsonFiles,
  ...manifestFiles,
]);
const generatedFiles = new Set();

const baseCaptureStyle = `
  nextjs-portal,
  .wf-skip-link,
  [data-brand-intro-header],
  [data-score-transition-layer],
  [data-site-experience] > footer {
    display: none !important;
  }

  [data-fixture-page] {
    padding: 0.25rem;
  }
`;

const motifCaptureStyle = `
  [aria-labelledby="motif-path-matrix-heading"] > div {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.65rem !important;
  }

  [data-motif-path-case] {
    padding: 0.65rem !important;
  }

  [data-motif-path-case] svg {
    max-height: 8.5rem !important;
  }

  [data-motif-path-case] figcaption {
    font-size: 0.62rem !important;
  }
`;

const tripletCaptureStyle = `
  [data-triplet-detail-review] > div {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  [data-triplet-path-shape] {
    padding: 0.8rem !important;
  }

  [data-triplet-path-shape] svg {
    max-height: 14rem !important;
  }
`;

const orientationCaptureStyle = `
  [data-responsive-projection-review] [data-responsive-mode] {
    display: none !important;
  }

  [data-responsive-projection-review]
    [data-responsive-mode="vertical-compact"] {
    display: block !important;
  }

  [data-responsive-mode="vertical-compact"] svg {
    max-height: none !important;
  }
`;

let ownedDevServer;
let serverOutput = "";
let stopping = false;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableSemanticHash(value) {
  return `sha256-v1-${sha256(JSON.stringify(value))}`;
}

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

async function listFilesRecursively(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(absolutePath)));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function captureImmutableBaseline() {
  const glyphFiles = (
    await Promise.all(
      [
        "docs/design-reference/visual-library/musical/glyphs/source",
        "src/assets/visuals/musical",
      ].map((directory) => listFilesRecursively(path.resolve(directory))),
    )
  )
    .flat()
    .filter((filePath) => filePath.endsWith(".svg"))
    .sort();
  const snapshotFiles = (
    await listFilesRecursively(path.resolve("tests/visual"))
  )
    .filter(
      (filePath) =>
        filePath.endsWith(".png") &&
        filePath
          .split(path.sep)
          .some((segment) => segment.endsWith("-snapshots")),
    )
    .sort();

  assert.equal(glyphFiles.length, 16, "approved SVG inventory must remain 16");
  assert.equal(
    snapshotFiles.length,
    84,
    "committed snapshot inventory must remain 84",
  );

  const digest = async (files) =>
    Promise.all(
      files.map(async (filePath) => ({
        filePath: path.relative(process.cwd(), filePath),
        sha256: sha256(await readFile(filePath)),
      })),
    );

  return {
    glyphs: await digest(glyphFiles),
    snapshots: await digest(snapshotFiles),
  };
}

async function readPinnedManifest(fileName) {
  const text = await readFile(path.join(originalEvidenceDirectory, fileName), "utf8");

  return text
    .trim()
    .split("\n")
    .map((line) => {
      const match = /^([0-9a-f]{64})\s+(.+)$/u.exec(line);
      assert.ok(match, `Invalid pinned manifest line in ${fileName}: ${line}`);
      return { sha256: match[1], filePath: match[2].replace(/^\*?\.\//u, "") };
    });
}

function serializeManifest(entries) {
  return `${entries.map(({ filePath, sha256: digest }) => `${digest}  ${filePath}`).join("\n")}\n`;
}

async function writeAuthorized(fileName, content) {
  assert.ok(authorizedFiles.has(fileName), `${fileName} is not authorized`);
  await writeFile(path.join(outputDirectory, fileName), content);
  generatedFiles.add(fileName);
}

async function writeJson(fileName, payload) {
  assert.ok(jsonFiles.includes(fileName), `${fileName} is not an authorized JSON`);
  await writeAuthorized(fileName, `${JSON.stringify(payload, null, 2)}\n`);
}

async function writeImmutableManifests(stage, baseline) {
  assert.ok(stage === "pre" || stage === "post");
  await writeAuthorized(
    manifestFileName(stage, "approved-svg-files"),
    serializeManifest(baseline.glyphs),
  );
  await writeAuthorized(
    manifestFileName(stage, "committed-snapshots"),
    serializeManifest(baseline.snapshots),
  );
}

function assertSafeLoopbackOrigin() {
  assert.equal(baseUrl.protocol, "http:");
  assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(baseUrl.hostname));
  assert.equal(baseUrl.pathname, "/");
  assert.equal(baseUrl.username, "");
  assert.equal(baseUrl.password, "");
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
  serverOutput = `${serverOutput}${String(chunk)}`.slice(-24_000);
}

async function startOwnedDevelopmentServer() {
  assertSafeLoopbackOrigin();
  const initialProbe = await probeLab();

  if (initialProbe.reachable) {
    throw new Error(
      `${baseUrl.origin} is occupied (HTTP ${initialProbe.status}); refusing to reuse an unowned server.`,
    );
  }

  ownedDevServer = spawn(
    "pnpm",
    [
      "exec",
      "next",
      "dev",
      "--hostname",
      baseUrl.hostname === "[::1]" ? "::1" : baseUrl.hostname,
      "--port",
      baseUrl.port || "80",
    ],
    {
      cwd: process.cwd(),
      detached: process.platform !== "win32",
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  ownedDevServer.stdout?.on("data", recordServerOutput);
  ownedDevServer.stderr?.on("data", recordServerOutput);
  ownedDevServer.on("error", recordServerOutput);

  const deadline = Date.now() + 180_000;

  while (Date.now() < deadline) {
    if (ownedDevServer.exitCode !== null) {
      throw new Error(`Development server exited early.\n${serverOutput}`);
    }

    const probe = await probeLab();
    if (probe.status === 200) return;
    await delay(400);
  }

  throw new Error(`Timed out waiting for the development lab.\n${serverOutput}`);
}

async function stopOwnedDevelopmentServer() {
  if (stopping || !ownedDevServer || ownedDevServer.exitCode !== null) return;
  stopping = true;
  const exitPromise = once(ownedDevServer, "exit").catch(() => undefined);

  try {
    if (process.platform === "win32") {
      ownedDevServer.kill("SIGTERM");
    } else if (ownedDevServer.pid) {
      process.kill(-ownedDevServer.pid, "SIGTERM");
    }
  } catch {
    // The owned process may have exited between the status check and signal.
  }

  await Promise.race([exitPromise, delay(5_000)]);
  if (ownedDevServer.exitCode === null) {
    try {
      if (process.platform === "win32") {
        ownedDevServer.kill("SIGKILL");
      } else if (ownedDevServer.pid) {
        process.kill(-ownedDevServer.pid, "SIGKILL");
      }
    } catch {
      // Already gone.
    }
    await exitPromise;
  }
}

for (const [signal, exitCode] of [
  ["SIGINT", 130],
  ["SIGTERM", 143],
]) {
  process.once(signal, () => {
    void stopOwnedDevelopmentServer().finally(() => process.exit(exitCode));
  });
}

async function waitForStableRendering(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
}

async function openFixture(page, route, fixturePage, captureStyle = "") {
  const response = await page.goto(routeUrl(route), {
    waitUntil: "domcontentloaded",
  });

  assert.equal(response?.status(), 200, `${route} must return 200 in dev`);
  await page.locator(`[data-fixture-page="${fixturePage}"]`).waitFor({
    state: "visible",
  });
  assert.equal(
    await page.locator('[data-music-visual-lab="development-only"]').count(),
    1,
  );
  await page.addStyleTag({ content: `${baseCaptureStyle}${captureStyle}` });
  await waitForStableRendering(page);
}

async function captureLocator(locator, fileName) {
  assert.ok(screenshotFiles.includes(fileName), `${fileName} is not authorized`);
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({
    animations: "disabled",
    caret: "hide",
    path: path.join(outputDirectory, fileName),
  });
  generatedFiles.add(fileName);
}

async function readTupletGeometry(tupletLocator) {
  return tupletLocator.evaluate((element) => {
    const numberAttribute = (name) => {
      const value = Number(element.getAttribute(name));
      if (!Number.isFinite(value)) throw new Error(`${name} must be finite`);
      return value;
    };
    const segment = (role) => {
      const line = element.querySelector(`[data-tuplet-bracket-segment="${role}"]`);
      if (!(line instanceof SVGLineElement)) throw new Error(`Missing ${role}`);
      return {
        x1: line.x1.baseVal.value,
        x2: line.x2.baseVal.value,
        y1: line.y1.baseVal.value,
        y2: line.y2.baseVal.value,
      };
    };
    const numeral = element.querySelector('[data-tuplet-numeral="3"]');
    if (!(numeral instanceof SVGTextElement)) throw new Error("Missing numeral 3");
    const before = segment("span-before-numeral");
    const after = segment("span-after-numeral");
    const gap = Math.hypot(after.x1 - before.x2, after.y1 - before.y2);

    return {
      centralGap: numberAttribute("data-tuplet-central-gap"),
      computedTextLength: numeral.getComputedTextLength(),
      fillAttribute: numeral.getAttribute("fill"),
      gap,
      label: numeral.textContent,
      numeralSideGap: numberAttribute("data-tuplet-numeral-side-gap"),
      numeralSize: numberAttribute("data-tuplet-numeral-size"),
      numeralWidth: numberAttribute("data-tuplet-numeral-width"),
      rotationRadians: numberAttribute(
        "data-tuplet-numeral-rotation-radians",
      ),
      segmentRoles: Array.from(
        element.querySelectorAll("[data-tuplet-bracket-segment]"),
        (node) => node.getAttribute("data-tuplet-bracket-segment"),
      ),
    };
  });
}

function assertTupletGeometry(geometry) {
  assert.equal(geometry.label, "3");
  assert.equal(geometry.fillAttribute, "currentColor");
  assert.deepEqual(geometry.segmentRoles, [
    "span-before-numeral",
    "span-after-numeral",
    "end-cap-start",
    "end-cap-end",
  ]);
  assert.ok(Math.abs(geometry.numeralSize - 13.6) < 1e-9);
  assert.ok(Math.abs(geometry.numeralWidth - 13.6) < 1e-9);
  assert.ok(Math.abs(geometry.numeralSideGap - 2.88) < 1e-9);
  assert.ok(
    Math.abs(
      geometry.centralGap -
        (geometry.numeralWidth + 2 * geometry.numeralSideGap),
    ) < 1e-7,
  );
  assert.ok(Math.abs(geometry.gap - geometry.centralGap) < 1e-4);
  assert.ok(
    Math.abs(geometry.computedTextLength - geometry.numeralWidth) < 0.05,
    `rendered numeral width ${geometry.computedTextLength} must match ${geometry.numeralWidth}`,
  );
  assert.ok(Number.isFinite(geometry.rotationRadians));
}

async function assertMotifMatrix(page) {
  const matrix = page.locator("[data-motif-path-case]");
  assert.equal(await matrix.count(), 39);

  for (const pathShape of pathShapes) {
    assert.equal(
      await matrix.filter({ has: page.locator(`[data-matrix-path-shape="${pathShape}"]`) }).count(),
      0,
      "nested path-shape markers are not expected",
    );
    assert.equal(
      await page.locator(`[data-matrix-path-shape="${pathShape}"]`).count(),
      13,
    );
  }

  const triplets = page.locator('[data-matrix-motif-id="E8_TRIPLET_3"]');
  assert.equal(await triplets.count(), 3);
  for (let index = 0; index < 3; index += 1) {
    const tuplet = triplets.nth(index).locator('[data-score-role="tuplet"]');
    assert.equal(await tuplet.count(), 1);
    assertTupletGeometry(await readTupletGeometry(tuplet));
  }
}

async function captureMotifMatrix(page) {
  for (const theme of ["light", "dark"]) {
    await page.setViewportSize(desktopViewport);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/curved-score",
      "curved-score",
      motifCaptureStyle,
    );
    await assertMotifMatrix(page);
    await captureLocator(
      page.locator('[aria-labelledby="motif-path-matrix-heading"]'),
      theme === "light"
        ? "01-motif-matrix-light.png"
        : "02-motif-matrix-dark.png",
    );
  }
}

async function assertAndCaptureTripletDetail(page) {
  for (const theme of ["light", "dark"]) {
    await page.setViewportSize(desktopViewport);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/curved-score",
      "curved-score",
      tripletCaptureStyle,
    );
    const root = page.locator(
      '[data-triplet-detail-review="gate-c-delta-v1"]',
    );
    assert.equal(
      await root.getAttribute("data-triplet-numeral-status"),
      "draft-human-review-pending",
    );
    const figures = root.locator("figure[data-triplet-path-shape]");
    assert.equal(await figures.count(), 6);

    for (const pathShape of pathShapes) {
      for (const stemDirection of stemDirections) {
        const figure = root.locator(
          `[data-triplet-path-shape="${pathShape}"][data-triplet-stem-direction="${stemDirection}"]`,
        );
        assert.equal(await figure.count(), 1);
        assert.equal(
          await figure.getAttribute("data-glyph-calibration-status"),
          "runtime-approved",
        );
        assert.equal(await figure.getAttribute("data-optical-token-status"), "draft");
        const tuplet = figure.locator('[data-score-role="tuplet"]');
        assert.equal(await tuplet.count(), 1);
        assertTupletGeometry(await readTupletGeometry(tuplet));
      }
    }

    await captureLocator(
      root,
      theme === "light"
        ? "10-triplet-detail-light.png"
        : "11-triplet-detail-dark.png",
    );
  }
}

async function readResponsiveEvidence(page) {
  const root = page.locator(
    '[data-responsive-projection-review="gate-c-delta-v1"]',
  );
  assert.equal(await root.getAttribute("data-max-notation-tangent-angle-deg"), "18");
  assert.equal(
    await root.getAttribute("data-responsive-calibration-status"),
    "draft-human-review-pending",
  );
  const figures = root.locator("figure[data-responsive-mode]");
  assert.equal(await figures.count(), 4);
  const semantics = [];

  for (const mode of responsiveModes) {
    const figure = root.locator(`[data-responsive-mode="${mode}"]`);
    assert.equal(await figure.count(), 1);
    assert.equal(await figure.getAttribute("data-clef-mirror-x"), "false");
    assert.equal(await figure.getAttribute("data-clef-mirror-y"), "false");
    assert.equal(await figure.getAttribute("data-clef-rotation-radians"), "0");
    assert.equal(
      await figure.getAttribute("data-final-barline-orientation"),
      "thin-gap-thick-vertical",
    );
    assert.equal(await figure.getAttribute("data-five-line-continuity"), "one-master-guide");
    assert.equal(await figure.getAttribute("data-key-signature-fifths"), "2");
    assert.equal(
      await figure.getAttribute("data-key-signature-rendered-accidentals"),
      "2",
    );
    assert.equal(await figure.getAttribute("data-ordinary-barline-count"), "1");
    assert.equal(await figure.locator('[data-score-role="staff-line"]').count(), 5);
    assert.equal(await figure.locator('[data-score-role="clef"]').count(), 1);
    assert.equal(await figure.locator('[data-score-role="beam-primary"]').count(), 2);
    assert.equal(await figure.locator('[data-score-role="tuplet"]').count(), 1);
    assert.equal(await figure.locator('[data-score-role="final-barline-thin"]').count(), 1);
    assert.equal(await figure.locator('[data-score-role="final-barline-thick"]').count(), 1);

    const motifIds = (await figure.getAttribute("data-motif-ids"))?.split(",") ?? [];
    const durations = (await figure.getAttribute("data-note-durations"))?.split(",") ?? [];
    assert.ok(motifIds.includes("Q1"));
    assert.ok(motifIds.includes("H1"));
    assert.ok(motifIds.includes("E8_E8"));
    assert.ok(motifIds.includes("E8_TRIPLET_3"));
    assert.ok(durations.includes("quarter"));
    assert.ok(durations.includes("half"));
    assert.ok(durations.includes("eighth"));

    semantics.push({
      contourIds: await figure.getAttribute("data-contour-ids"),
      contourTranslations: await figure.getAttribute("data-contour-translations"),
      durations: await figure.getAttribute("data-note-durations"),
      emptySlotIds: await figure.getAttribute("data-empty-slot-ids"),
      keySignatureFifths: await figure.getAttribute("data-key-signature-fifths"),
      mode,
      motifIds: await figure.getAttribute("data-motif-ids"),
      semanticSlotIds: await figure.getAttribute("data-semantic-slot-ids"),
      staffSteps: await figure.getAttribute("data-staff-steps"),
    });
  }

  const baseline = { ...semantics[0], mode: undefined };
  for (const semanticsByMode of semantics) {
    assert.deepEqual(
      { ...semanticsByMode, mode: undefined },
      baseline,
      `${semanticsByMode.mode} must preserve responsive review semantics`,
    );
  }

  const compact = root.locator('[data-responsive-mode="vertical-compact"]');
  const notationZones = compact.locator('[data-zone-kind="notation-safe"]');
  const connectors = compact.locator('[data-zone-kind="connector"]');
  assert.equal(await notationZones.count(), 3);
  assert.equal(await connectors.count(), 2);
  const notationEvidence = await notationZones.evaluateAll((elements) =>
    elements.map((element) => ({
      angle: Number(element.getAttribute("data-tangent-angle-deg")),
      events: Number(element.getAttribute("data-event-count")),
      measurement: element.getAttribute("data-tangent-measurement"),
      slots: element.getAttribute("data-semantic-slot-ids"),
    })),
  );
  const connectorEvidence = await connectors.evaluateAll((elements) =>
    elements.map((element) => ({
      angle: Number(element.getAttribute("data-tangent-angle-deg")),
      events: Number(element.getAttribute("data-event-count")),
      measurement: element.getAttribute("data-tangent-measurement"),
      minimumCurvatureRadiusSp: Number(
        element.getAttribute("data-minimum-curvature-radius-sp"),
      ),
      slots: element.getAttribute("data-semantic-slot-ids"),
    })),
  );
  assert.ok(
    notationEvidence.every(
      ({ angle, events, measurement, slots }) =>
        angle <= 18 &&
        events > 0 &&
        measurement === "analytic-constant" &&
        Boolean(slots),
    ),
  );
  assert.ok(
    connectorEvidence.every(
      ({ angle, events, measurement, minimumCurvatureRadiusSp, slots }) =>
        angle > 18 &&
        events === 0 &&
        measurement === "display-sampled" &&
        minimumCurvatureRadiusSp > 2 &&
        slots === "",
    ),
  );

  const finalBars = await compact
    .locator(
      '[data-score-role="final-barline-thin"], [data-score-role="final-barline-thick"]',
    )
    .evaluateAll((elements) =>
      elements.map((element) => {
        if (!(element instanceof SVGLineElement)) throw new Error("Expected SVG line");
        return { x1: element.x1.baseVal.value, x2: element.x2.baseVal.value };
      }),
    );
  assert.ok(finalBars.every(({ x1, x2 }) => Math.abs(x1 - x2) < 1e-9));

  return { connectorEvidence, notationEvidence, semantics };
}

async function captureResponsiveReview(page) {
  let responsiveEvidence;

  for (const theme of ["light", "dark"]) {
    await page.setViewportSize(theme === "light" ? mobileViewport : reviewViewport);
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
      orientationCaptureStyle,
    );
    const current = await readResponsiveEvidence(page);
    if (responsiveEvidence) assert.deepEqual(current, responsiveEvidence);
    responsiveEvidence = current;

    const root = page.locator(
      '[data-responsive-projection-review="gate-c-delta-v1"]',
    );
    const compact = root.locator('[data-responsive-mode="vertical-compact"]');
    if (theme === "light") {
      await captureLocator(compact, "08-responsive-vertical-mobile.png");
    }
    await captureLocator(
      root,
      theme === "light"
        ? "12-responsive-orientation-light.png"
        : "13-responsive-orientation-dark.png",
    );
  }

  return responsiveEvidence;
}

async function readInteractiveSemantics(page) {
  const projections = await page
    .locator("[data-composer-semantics]")
    .evaluateAll((elements) =>
      elements.map((element) => JSON.parse(element.textContent ?? "null")),
    );
  return { hash: stableSemanticHash(projections), projections };
}

async function selectModeAndRead(page, mode) {
  await page.locator('[data-composer-control="viewport"]').selectOption(mode);
  await page.locator(`[data-composer-profile][data-viewport="${mode}"]`).first().waitFor();
  await waitForStableRendering(page);
  return readInteractiveSemantics(page);
}

async function captureSemanticEquivalence(page, responsiveEvidence) {
  await page.setViewportSize(desktopViewport);
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await openFixture(page, "/__visual-lab/music/composer", "composer");
  await page.locator('[data-composer-control="seed"]').fill("wflyer-gate-c-delta-v1");
  await page.locator('[data-composer-control="chapter"]').fill("gate-c-delta-responsive");
  await page.locator('[data-composer-control="profile"]').selectOption("ALL");
  await page.locator('[data-composer-control="theme"]').selectOption("light");
  await page.locator('[data-composer-control="debug"]').uncheck();

  const cases = [];
  let baseline;
  for (const mode of responsiveModes) {
    const semantics = await selectModeAndRead(page, mode);
    baseline ??= semantics;
    assert.deepEqual(semantics.projections, baseline.projections);
    cases.push({ mode, semanticHash: semantics.hash });
  }

  await page.setViewportSize(mobileViewport);
  await waitForStableRendering(page);
  const afterResize = await readInteractiveSemantics(page);
  assert.deepEqual(afterResize.projections, baseline.projections);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reduced = await selectModeAndRead(page, "static");
  assert.deepEqual(reduced.projections, baseline.projections);

  return {
    approvalStatus: "pending-human-gate-c-review",
    cases,
    invariants: {
      actualResizeRecomposes: false,
      keySignatureConfigurationPreserved: true,
      modeChangeRecomposes: false,
      reducedMotionRecomposes: false,
      semanticCompositionDeepEqual: true,
    },
    responsiveReview: {
      configuredKeySignatureFifths: 2,
      connectorEvidence: responsiveEvidence.connectorEvidence,
      notationEvidence: responsiveEvidence.notationEvidence,
      semanticsByMode: responsiveEvidence.semantics,
    },
    schemaVersion: 1,
    semanticHash: baseline.hash,
    semanticInputs: {
      branchId: "visual-lab-branch",
      chapterId: "gate-c-delta-responsive",
      keySignatureConfiguration: null,
      profile: "ALL",
      sessionSeed: "wflyer-gate-c-delta-v1",
    },
  };
}

async function readProposalEvidence(page) {
  const renderer = JSON.parse(
    (await page.locator('[data-draft-renderer-tokens="v1"]').textContent()) ??
      "null",
  );
  const composer = JSON.parse(
    (await page
      .locator('[data-draft-composer-calibration="v1"]')
      .textContent()) ?? "null",
  );
  const originalPath = path.join(
    originalEvidenceDirectory,
    "gate-c-draft-configuration.json",
  );
  const originalBytes = await readFile(originalPath);
  const original = JSON.parse(originalBytes.toString("utf8"));

  assert.deepEqual(composer, original.composer, "Composer proposal changed outside scope");
  const unchangedRenderer = structuredClone(renderer);
  const triplet = unchangedRenderer.tokens.tuplet;
  assert.equal(triplet.tupletNumeralSizeSp, 0.85);
  assert.equal(triplet.tupletNumeralSideGapSp, 0.18);
  delete triplet.tupletNumeralSizeSp;
  delete triplet.tupletNumeralSideGapSp;
  assert.deepEqual(
    unchangedRenderer,
    original.renderer,
    "Previously accepted renderer values changed outside the named triplet delta",
  );

  return {
    approvalStatus: "pending-human-gate-c-review",
    connectorStrategy: {
      canonical: false,
      description:
        "piecewise curvature-safe returning connectors with four cubic quarter turns and straight spans; complete-curve curvature and outer offsets are validated",
      responsiveActivationThresholdsCanonicalized: false,
    },
    previousGateCProposal: {
      composerDeepEqual: true,
      originalConfigurationSha256: sha256(originalBytes),
      rendererDeepEqualAfterRemovingOnlyNamedTripletFields: true,
      unchangedOutsideNamedDeltaAreas: true,
    },
    responsive: {
      maxNotationTangentAngleDeg: 18,
      modes: responsiveModes,
      status: "draft-human-review-pending",
      thresholdsCanonicalized: false,
    },
    schemaVersion: 1,
    triplet: {
      preserved: {
        bracketClearanceSp: triplet.bracketClearanceSp,
        bracketEndCapSp: triplet.bracketEndCapSp,
        bracketThicknessSp: triplet.bracketThicknessSp,
      },
      status: "draft-human-review-pending",
      tupletNumeralSideGapSp: renderer.tokens.tuplet.tupletNumeralSideGapSp,
      tupletNumeralSizeSp: renderer.tokens.tuplet.tupletNumeralSizeSp,
    },
  };
}

async function validateGeneratedArtifacts() {
  assert.deepEqual(
    [...generatedFiles].sort(),
    [...authorizedFiles].sort(),
    "capture must produce the exact authorized delta artifact set",
  );

  for (const fileName of authorizedFiles) {
    const filePath = path.join(outputDirectory, fileName);
    const details = await stat(filePath);
    const bytes = await readFile(filePath);
    assert.ok(details.size > 0, `${fileName} must not be empty`);
    if (fileName.endsWith(".png")) {
      assert.ok(details.size > 10_000, `${fileName} looks empty`);
      assert.deepEqual(
        [...bytes.subarray(0, 8)],
        [137, 80, 78, 71, 13, 10, 26, 10],
      );
    } else if (fileName.endsWith(".json")) {
      JSON.parse(bytes.toString("utf8"));
    }
  }
}

await mkdir(outputDirectory, { recursive: true });
const pinnedGlyphs = await readPinnedManifest(
  "2026-08-17-post-gate-c-approved-svg-files.sha256",
);
const pinnedSnapshots = await readPinnedManifest(
  "2026-08-17-post-gate-c-committed-snapshots.sha256",
);
const preBaseline = await captureImmutableBaseline();
assert.deepEqual(preBaseline.glyphs, pinnedGlyphs);
assert.deepEqual(preBaseline.snapshots, pinnedSnapshots);
await writeImmutableManifests("pre", preBaseline);

let browser;
try {
  await startOwnedDevelopmentServer();
  browser = await chromium.launch();
  const context = await browser.newContext({
    colorScheme: "light",
    locale: "pt-BR",
    reducedMotion: "no-preference",
    viewport: desktopViewport,
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await captureMotifMatrix(page);
  await assertAndCaptureTripletDetail(page);
  if (!tripletOnly) {
    const responsiveEvidence = await captureResponsiveReview(page);
    const semanticEvidence = await captureSemanticEquivalence(
      page,
      responsiveEvidence,
    );
    const proposalEvidence = await readProposalEvidence(page);
    await writeJson("gate-c-delta-semantic-equivalence.json", semanticEvidence);
    await writeJson("gate-c-delta-proposals.json", proposalEvidence);
  }
  assert.deepEqual(pageErrors, [], `Browser page errors: ${pageErrors.join("\n")}`);
  await context.close();
} finally {
  await browser?.close();
  await stopOwnedDevelopmentServer();
}

const postBaseline = await captureImmutableBaseline();
assert.deepEqual(postBaseline, preBaseline);
assert.deepEqual(postBaseline.glyphs, pinnedGlyphs);
assert.deepEqual(postBaseline.snapshots, pinnedSnapshots);
await writeImmutableManifests("post", postBaseline);
await validateGeneratedArtifacts();

console.log(
  `Gate-C ${captureScope} capture complete: ${screenshotFiles.length} PNG, ${jsonFiles.length} JSON, ${manifestFiles.length} immutable manifests.`,
);
