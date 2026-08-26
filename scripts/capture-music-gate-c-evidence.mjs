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

const DEFAULT_PORT = 43120;
const baseUrl = new URL(
  process.env.WFLYER_MUSIC_GATE_C_BASE_URL ??
    `http://127.0.0.1:${DEFAULT_PORT}`,
);
const outputDirectory = path.resolve(
  "docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c",
);
const desktopViewport = { height: 1024, width: 1536 };
const mobileViewport = { height: 844, width: 390 };

const MOTIF_IDS = [
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "H1",
  "H2",
  "W1",
  "E8_E8",
  "E8_TRIPLET_3",
  "S16_S16_S16_S16",
  "E8_S16_S16",
  "S16_S16_E8",
  "S16_E8_S16",
];
const PATH_SHAPES = ["straight", "gentle-arc", "gentle-s"];
const PROFILES = ["CALM", "BALANCED", "ACTIVE", "TERMINAL"];
const FIXED_SEEDS = [
  {
    id: "origin",
    label: "Origin",
    sessionSeed: "wflyer-music-gate-c-origin-v1",
  },
  {
    id: "flight",
    label: "Flight",
    sessionSeed: "wflyer-music-gate-c-flight-v1",
  },
  {
    id: "return",
    label: "Return",
    sessionSeed: "wflyer-music-gate-c-return-v1",
  },
];
const FIXED_SEED_CHAPTER_ID = "music-gate-c-fixed-seed-review";
const SEMANTIC_PROJECTION_VERSION = 1;
const EXPECTED_FIXED_SEED_HASHES = new Map([
  ["origin:CALM", "fnv1a32-v1-a3b59d21"],
  ["origin:BALANCED", "fnv1a32-v1-57efa235"],
  ["origin:ACTIVE", "fnv1a32-v1-ba51ae4c"],
  ["origin:TERMINAL", "fnv1a32-v1-b639ebff"],
  ["flight:CALM", "fnv1a32-v1-9afa76b2"],
  ["flight:BALANCED", "fnv1a32-v1-92ebd37e"],
  ["flight:ACTIVE", "fnv1a32-v1-46d3d40c"],
  ["flight:TERMINAL", "fnv1a32-v1-b8706c1e"],
  ["return:CALM", "fnv1a32-v1-6ea83d8b"],
  ["return:BALANCED", "fnv1a32-v1-95b7e08d"],
  ["return:ACTIVE", "fnv1a32-v1-0dec3074"],
  ["return:TERMINAL", "fnv1a32-v1-d5b5a09a"],
]);

const PERFORMANCE_MARK_NAMES = {
  compositionResult:
    "wflyer.music-lab.composer.composition-result-commit",
  geometryResult: "wflyer.music-lab.composer.geometry-result-commit",
  reactRender: "wflyer.music-lab.composer.react-render-commit",
};

const SCREENSHOT_FILES = [
  "01-motif-matrix-light.png",
  "02-motif-matrix-dark.png",
  "03-key-signatures-light.png",
  "04-key-signatures-dark.png",
  "05-composer-fixed-seeds-light.png",
  "06-composer-fixed-seeds-dark.png",
  "07-responsive-horizontal-desktop.png",
  "08-responsive-vertical-mobile.png",
  "09-reduced-motion-static.png",
];
const JSON_FILES = [
  "gate-c-draft-configuration.json",
  "gate-c-composer-fixed-seeds.json",
  "gate-c-semantic-stability.json",
  "gate-c-performance.json",
];
const EXPECTED_FILES = [...SCREENSHOT_FILES, ...JSON_FILES].sort();

const BASE_CAPTURE_STYLE = `
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

  [data-fixture-page] h2,
  [data-fixture-page] h3,
  [data-fixture-page] p {
    max-width: 76rem;
  }
`;

const MOTIF_CAPTURE_STYLE = `
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

const KEY_SIGNATURE_CAPTURE_STYLE = `
  [data-fixture-page="key-signatures"] > div:last-child {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.65rem !important;
  }

  [data-fifths] {
    padding: 0.65rem !important;
  }

  [data-fifths] svg {
    max-height: 8rem !important;
  }

  [data-fifths] figcaption {
    font-size: 0.64rem !important;
  }
`;

const FIXED_SEED_CAPTURE_STYLE = `
  [data-fixed-seed-matrix="gate-c-v1"] > div {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.75rem !important;
  }

  [data-fixed-seed-matrix="gate-c-v1"] figure {
    padding: 0.7rem !important;
  }

  [data-fixed-seed-matrix="gate-c-v1"] svg {
    max-height: 9rem !important;
  }

  [data-fixed-seed-matrix="gate-c-v1"] pre {
    display: none !important;
  }
`;

const RESPONSIVE_CAPTURE_STYLE = `
  [data-composer-performance="memo-result-commit-v1"]
    [data-composer-semantics] {
    display: none !important;
  }

  [data-composer-performance="memo-result-commit-v1"] figure svg {
    max-height: 24rem !important;
  }
`;

const REDUCED_MOTION_CAPTURE_STYLE = `
  [data-composer-performance="memo-result-commit-v1"]::before {
    background: #f1e6ff;
    border: 2px solid #7753d7;
    border-radius: 0.7rem;
    color: #1c1830;
    content: "Reduced motion: reduce · static presentation · semantics unchanged";
    display: block;
    font: 700 0.8rem/1.4 ui-monospace, SFMono-Regular, Consolas, monospace;
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
`;

const generatedFiles = new Set();
let ownedDevServer;
let serverOutput = "";

function routeUrl(route) {
  return new URL(route, baseUrl).toString();
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableSemanticHash(value) {
  return `sha256-v1-${sha256(JSON.stringify(value))}`;
}

function fnv1a32(parts) {
  let hash = 0x811c9dc5;
  const encoder = new TextEncoder();

  for (const part of parts) {
    const bytes = encoder.encode(String(part));
    const lengthBytes = [
      (bytes.length >>> 24) & 0xff,
      (bytes.length >>> 16) & 0xff,
      (bytes.length >>> 8) & 0xff,
      bytes.length & 0xff,
    ];

    for (const byte of [...lengthBytes, ...bytes]) {
      hash ^= byte;
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
  }

  return hash >>> 0;
}

function fixedSeedSemanticHash(canonicalJson) {
  const hash = fnv1a32([
    "wflyer-music-gate-c-semantic-projection",
    SEMANTIC_PROJECTION_VERSION,
    canonicalJson,
  ]);

  return `fnv1a32-v1-${hash.toString(16).padStart(8, "0")}`;
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
  const glyphDirectories = [
    path.resolve(
      "docs/design-reference/visual-library/musical/glyphs/source",
    ),
    path.resolve("src/assets/visuals/musical"),
  ];
  const glyphFiles = (
    await Promise.all(glyphDirectories.map(listFilesRecursively))
  )
    .flat()
    .filter((filePath) => filePath.endsWith(".svg"))
    .sort();
  const snapshotFiles = (await listFilesRecursively(path.resolve("tests/visual")))
    .filter(
      (filePath) =>
        filePath.endsWith(".png") &&
        filePath
          .split(path.sep)
          .some((segment) => segment.endsWith("-snapshots")),
    )
    .sort();

  assert.equal(glyphFiles.length, 16, "expected eight source and eight runtime SVGs");
  assert.equal(snapshotFiles.length, 84, "the committed snapshot baseline must remain 84 PNGs");

  const digestFiles = async (files) =>
    Promise.all(
      files.map(async (filePath) => [
        path.relative(process.cwd(), filePath),
        sha256(await readFile(filePath)),
      ]),
    );

  return {
    glyphs: await digestFiles(glyphFiles),
    snapshots: await digestFiles(snapshotFiles),
  };
}

async function assertImmutableBaselineUnchanged(baseline) {
  const current = await captureImmutableBaseline();
  assert.deepEqual(
    current.glyphs,
    baseline.glyphs,
    "approved source/runtime SVGs changed during capture",
  );
  assert.deepEqual(
    current.snapshots,
    baseline.snapshots,
    "committed visual snapshots changed during capture",
  );
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
  serverOutput = `${serverOutput}${String(chunk)}`.slice(-16_000);
}

function assertSafeLoopbackOrigin() {
  assert.equal(baseUrl.protocol, "http:", "capture server must use loopback HTTP");
  assert.ok(
    ["127.0.0.1", "localhost", "[::1]"].includes(baseUrl.hostname),
    "capture server hostname must be loopback",
  );
  assert.equal(baseUrl.pathname, "/", "capture server URL must not include a path");
  assert.equal(baseUrl.search, "", "capture server URL must not include a query");
  assert.equal(baseUrl.hash, "", "capture server URL must not include a fragment");
  assert.equal(baseUrl.username, "", "capture server URL must not include credentials");
  assert.equal(baseUrl.password, "", "capture server URL must not include credentials");
}

async function startOwnedDevelopmentServer() {
  assertSafeLoopbackOrigin();
  const initialProbe = await probeLab();

  if (initialProbe.reachable) {
    throw new Error(
      `${baseUrl.origin} is already occupied (HTTP ${initialProbe.status}); Gate-C capture requires its own self-started/self-stopped development harness.`,
    );
  }

  const hostname = baseUrl.hostname === "[::1]" ? "::1" : baseUrl.hostname;
  const port = baseUrl.port || "80";
  ownedDevServer = spawn(
    "pnpm",
    ["exec", "next", "dev", "--hostname", hostname, "--port", port],
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
        `Development server exited before the Music Visual Lab was ready.\n${serverOutput}`,
      );
    }

    const probe = await probeLab();
    if (probe.status === 200) {
      console.log(`Started isolated development server at ${baseUrl.origin}.`);
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
  } else if (ownedDevServer.pid) {
    process.kill(-ownedDevServer.pid, "SIGTERM");
  }

  await Promise.race([exitPromise, delay(5_000)]);

  if (ownedDevServer.exitCode === null) {
    if (process.platform === "win32") {
      ownedDevServer.kill("SIGKILL");
    } else if (ownedDevServer.pid) {
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

async function waitUntil(assertion, message, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const result = await assertion();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await delay(50);
  }

  throw new Error(
    `${message}${lastError instanceof Error ? `: ${lastError.message}` : ""}`,
  );
}

async function openFixture(page, route, fixturePage, captureStyle = "") {
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
  assert.equal(
    await page.locator('[data-music-visual-lab="development-only"]').count(),
    1,
    `${route} must be the isolated development-only lab`,
  );
  await page.addStyleTag({ content: `${BASE_CAPTURE_STYLE}${captureStyle}` });
  await waitForStableRendering(page);
}

async function captureLocator(locator, fileName) {
  assert.ok(SCREENSHOT_FILES.includes(fileName), `${fileName} is not authorized`);
  const target = path.join(outputDirectory, fileName);
  await locator.scrollIntoViewIfNeeded();
  await locator.screenshot({
    animations: "disabled",
    caret: "hide",
    path: target,
  });
  generatedFiles.add(fileName);
}

async function writeJson(fileName, payload) {
  assert.ok(JSON_FILES.includes(fileName), `${fileName} is not authorized`);
  await writeFile(
    path.join(outputDirectory, fileName),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );
  generatedFiles.add(fileName);
}

async function assertMotifPathMatrix(page) {
  const matrix = page.locator("[data-motif-path-case]");
  assert.equal(await matrix.count(), 39, "motif matrix must contain 39 cases");
  const cases = await matrix.evaluateAll((elements) =>
    elements.map((element) => ({
      caseId: element.getAttribute("data-motif-path-case"),
      glyphStatus: element.getAttribute("data-glyph-calibration-status"),
      motifId: element.getAttribute("data-matrix-motif-id"),
      opticalStatus: element.getAttribute("data-optical-token-status"),
      pathShape: element.getAttribute("data-matrix-path-shape"),
    })),
  );
  const expectedCases = PATH_SHAPES.flatMap((pathShape) =>
    MOTIF_IDS.map((motifId) => `${pathShape}:${motifId}`),
  ).sort();

  assert.deepEqual(
    cases.map(({ caseId }) => caseId).sort(),
    expectedCases,
    "matrix must cover every motif on every path exactly once",
  );
  for (const fixture of cases) {
    assert.equal(fixture.caseId, `${fixture.pathShape}:${fixture.motifId}`);
    assert.equal(fixture.glyphStatus, "runtime-approved");
    assert.equal(fixture.opticalStatus, "draft");
  }

  for (const pathShape of PATH_SHAPES) {
    assert.equal(
      cases.filter((fixture) => fixture.pathShape === pathShape).length,
      13,
      `${pathShape} must contain all 13 motifs`,
    );
  }
  for (const motifId of MOTIF_IDS) {
    assert.equal(
      cases.filter((fixture) => fixture.motifId === motifId).length,
      3,
      `${motifId} must render on all three paths`,
    );
  }

  const hookedCases = page.locator(
    '[data-matrix-motif-id="S16_E8_S16"]',
  );
  assert.equal(
    await hookedCases.locator('[data-score-role="beam-secondary-hook-left"]').count(),
    3,
  );
  assert.equal(
    await hookedCases.locator('[data-score-role="beam-secondary-hook-right"]').count(),
    3,
  );
  const tripletCases = page.locator(
    '[data-matrix-motif-id="E8_TRIPLET_3"]',
  );
  assert.equal(await tripletCases.locator('[data-score-role="tuplet"]').count(), 3);
}

async function captureMotifMatrix(page) {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/curved-score",
      "curved-score",
      MOTIF_CAPTURE_STYLE,
    );
    assert.equal(
      await page.evaluate((value) =>
        matchMedia(`(prefers-color-scheme: ${value})`).matches,
      theme),
      true,
    );
    await assertMotifPathMatrix(page);
    await captureLocator(
      page.locator('[aria-labelledby="motif-path-matrix-heading"]'),
      theme === "light"
        ? "01-motif-matrix-light.png"
        : "02-motif-matrix-dark.png",
    );
  }
}

async function assertKeySignatureFixtures(page) {
  const fixtures = page.locator("[data-fifths]");
  assert.equal(await fixtures.count(), 15, "key-signature matrix must have 15 cases");
  assert.equal(
    await page
      .locator(
        '[data-key-signature-ownership="renderer-authored-outside-composer"]',
      )
      .getAttribute("data-composer-key-signature-fields"),
    "0",
  );

  for (let fifths = -7; fifths <= 7; fifths += 1) {
    const fixture = page.locator(`[data-fifths="${fifths}"]`);
    const expectedOccurrences = fifths === 0 ? 0 : 1;
    const expectedAccidentals = Math.abs(fifths);

    assert.equal(await fixture.count(), 1, `fifths=${fifths} must be unique`);
    assert.equal(
      Number(
        await fixture.getAttribute(
          "data-configured-key-signature-occurrences",
        ),
      ),
      expectedOccurrences,
      `fifths=${fifths} must have ${expectedOccurrences} configured occurrence`,
    );
    assert.equal(
      Number(
        await fixture.getAttribute("data-rendered-key-signature-accidentals"),
      ),
      expectedAccidentals,
      `fifths=${fifths} must render abs(fifths) accidentals`,
    );
    assert.equal(
      await fixture.locator('[data-score-role="key-signature"]').count(),
      expectedAccidentals,
      `fifths=${fifths} DOM must match structural evidence`,
    );
    assert.equal(
      await fixture.getAttribute("data-glyph-calibration-status"),
      "runtime-approved",
    );
    assert.equal(
      await fixture.getAttribute("data-optical-token-status"),
      "draft",
    );
  }
}

async function captureKeySignatures(page) {
  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/key-signatures",
      "key-signatures",
      KEY_SIGNATURE_CAPTURE_STYLE,
    );
    await assertKeySignatureFixtures(page);
    await captureLocator(
      page.locator('[data-fixture-page="key-signatures"]'),
      theme === "light"
        ? "03-key-signatures-light.png"
        : "04-key-signatures-dark.png",
    );
  }
}

function assertFixedSeedProjection(projection, seed, profile) {
  assert.equal(projection.schemaVersion, SEMANTIC_PROJECTION_VERSION);
  assert.equal(projection.chapterId, FIXED_SEED_CHAPTER_ID);
  assert.equal(projection.profile, profile);
  assert.equal(typeof projection.composerVersion, "number");
  assert.equal(typeof projection.pitchContourTableVersion, "number");
  assert.equal(typeof projection.branchId, "string");
  assert.equal(typeof projection.derivedChapterSeed, "string");
  assert.ok(projection.branchId.length > 0);
  assert.ok(projection.derivedChapterSeed.length > 0);
  assert.ok(Array.isArray(projection.motifs));
  assert.ok(Array.isArray(projection.emptySlots));

  for (const motif of projection.motifs) {
    assert.deepEqual(Object.keys(motif).sort(), [
      "contourId",
      "contourTranslation",
      "dense",
      "durations",
      "family",
      "motifId",
      "slotId",
      "staffSteps",
      "tuplet",
    ]);
    assert.ok(MOTIF_IDS.includes(motif.motifId));
    assert.ok(Array.isArray(motif.durations));
    assert.ok(Array.isArray(motif.staffSteps));
    assert.equal(motif.durations.length, motif.staffSteps.length);
    assert.equal(typeof motif.contourId, "string");
    assert.equal(Number.isInteger(motif.contourTranslation), true);
  }

  assert.ok(seed.sessionSeed.startsWith("wflyer-music-gate-c-"));
}

async function readFixedSeedMatrix(page) {
  const matrix = page.locator('[data-fixed-seed-matrix="gate-c-v1"]');
  assert.equal(await matrix.count(), 1, "fixed-seed matrix must be unique");
  assert.equal(
    await matrix.getAttribute("data-semantic-projection-version"),
    String(SEMANTIC_PROJECTION_VERSION),
  );
  const figures = matrix.locator("figure[data-fixed-seed-id]");
  assert.equal(await figures.count(), 12, "fixed-seed matrix must have 12 cases");
  const cases = [];

  for (let index = 0; index < 12; index += 1) {
    const figure = figures.nth(index);
    const seedId = await figure.getAttribute("data-fixed-seed-id");
    const profile = await figure.getAttribute("data-composer-profile");
    const semanticHash = await figure.getAttribute("data-semantic-hash");
    const composerTuningStatus = await figure.getAttribute(
      "data-composer-tuning-status",
    );
    const glyphCalibrationStatus = await figure.getAttribute(
      "data-glyph-calibration-status",
    );
    const opticalTokenStatus = await figure.getAttribute(
      "data-optical-token-status",
    );
    assert.ok(seedId);
    assert.ok(profile);
    assert.ok(semanticHash);
    const seed = FIXED_SEEDS.find((candidate) => candidate.id === seedId);
    assert.ok(seed, `unknown fixed seed ${seedId}`);
    assert.ok(PROFILES.includes(profile), `unknown profile ${profile}`);
    const caseId = `${seedId}:${profile}`;
    const canonicalJson = await figure
      .locator(`[data-canonical-composer-semantics="${caseId}"]`)
      .textContent();
    assert.ok(canonicalJson, `${caseId} must expose canonical JSON`);
    const projection = JSON.parse(canonicalJson);

    assert.equal(composerTuningStatus, "draft");
    assert.equal(opticalTokenStatus, "draft");
    assert.equal(glyphCalibrationStatus, "runtime-approved");
    assert.equal(
      semanticHash,
      fixedSeedSemanticHash(canonicalJson),
      `${caseId} hash must independently match its canonical projection`,
    );
    assert.equal(
      semanticHash,
      EXPECTED_FIXED_SEED_HASHES.get(caseId),
      `${caseId} hash must match the reviewed deterministic golden`,
    );
    assertFixedSeedProjection(projection, seed, profile);
    cases.push({
      caseId,
      composerTuningStatus,
      glyphCalibrationStatus,
      opticalTokenStatus,
      profile,
      projection,
      seedId,
      seedLabel: seed.label,
      semanticHash,
      sessionSeed: seed.sessionSeed,
    });
  }

  assert.deepEqual(
    cases.map(({ caseId }) => caseId).sort(),
    FIXED_SEEDS.flatMap((seed) =>
      PROFILES.map((profile) => `${seed.id}:${profile}`),
    ).sort(),
    "fixed-seed evidence must contain the exact 3 by 4 cross-product",
  );
  assert.equal(
    new Set(cases.map(({ semanticHash }) => semanticHash)).size,
    12,
    "all fixed-seed/profile projections must have distinct hashes",
  );

  return cases;
}

async function readDraftConfiguration(page) {
  const rendererText = await page
    .locator('[data-draft-renderer-tokens="v1"]')
    .textContent();
  const composerText = await page
    .locator('[data-draft-composer-calibration="v1"]')
    .textContent();
  assert.ok(rendererText);
  assert.ok(composerText);
  const renderer = JSON.parse(rendererText);
  const composer = JSON.parse(composerText);
  assert.equal(renderer.status, "draft-human-review-pending");
  assert.equal(composer.status, "draft-human-review-pending");
  assert.equal(renderer.inheritedApprovedInputs.noteFlagTransform, "approved-gate-b");

  return {
    approvalStatus: "pending-human-gate-c-review",
    composer,
    renderer,
    schemaVersion: 1,
    sourceRoute: "/__visual-lab/music/composer",
  };
}

async function captureFixedSeeds(page) {
  let canonicalCases;
  let draftConfiguration;

  for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await openFixture(
      page,
      "/__visual-lab/music/composer",
      "composer",
      FIXED_SEED_CAPTURE_STYLE,
    );
    const cases = await readFixedSeedMatrix(page);
    const configuration = await readDraftConfiguration(page);

    if (canonicalCases) {
      assert.deepEqual(
        cases,
        canonicalCases,
        "fixed-seed semantics must survive a theme navigation/reload",
      );
      assert.deepEqual(configuration, draftConfiguration);
    } else {
      canonicalCases = cases;
      draftConfiguration = configuration;
    }

    await captureLocator(
      page.locator('[data-fixed-seed-matrix="gate-c-v1"]'),
      theme === "light"
        ? "05-composer-fixed-seeds-light.png"
        : "06-composer-fixed-seeds-dark.png",
    );
  }

  assert.ok(canonicalCases);
  assert.ok(draftConfiguration);
  await writeJson("gate-c-draft-configuration.json", draftConfiguration);
  await writeJson("gate-c-composer-fixed-seeds.json", {
    approvalStatus: "pending-human-gate-c-review",
    cases: canonicalCases,
    chapterId: FIXED_SEED_CHAPTER_ID,
    profiles: PROFILES,
    schemaVersion: 1,
    seedIds: FIXED_SEEDS.map(({ id }) => id),
    semanticProjectionVersion: SEMANTIC_PROJECTION_VERSION,
  });
}

async function configureInteractiveComposer(page, configuration) {
  await page
    .locator('[data-composer-control="seed"]')
    .fill(configuration.seed);
  await page
    .locator('[data-composer-control="chapter"]')
    .fill(configuration.chapterId);
  await page
    .locator('[data-composer-control="profile"]')
    .selectOption(configuration.profile);
  await page
    .locator('[data-composer-control="theme"]')
    .selectOption(configuration.theme);
  await page
    .locator('[data-composer-control="viewport"]')
    .selectOption(configuration.viewport);
  const debug = page.locator('[data-composer-control="debug"]');
  if (configuration.debug) {
    await debug.check();
  } else {
    await debug.uncheck();
  }

  await waitUntil(async () => {
    const semantics = await readInteractiveSemantics(page);
    return (
      semantics.projections.length === 4 &&
      semantics.projections.every(
        (projection) => projection.chapterId === configuration.chapterId,
      )
    );
  }, "interactive composer did not settle on the requested semantic inputs");
  await waitForStableRendering(page);
}

async function readInteractiveSemantics(page) {
  const projections = await page
    .locator('[data-composer-semantics]')
    .evaluateAll((elements) =>
      elements.map((element) => JSON.parse(element.textContent ?? "null")),
    );

  for (const projection of projections) {
    assert.equal(typeof projection.versions.composer, "number");
    assert.equal(typeof projection.versions.pitchContourTable, "number");
    assert.equal(typeof projection.branchId, "string");
    assert.equal(typeof projection.chapterId, "string");
    assert.equal(typeof projection.derivedSeed, "string");
    assert.ok(PROFILES.includes(projection.profile));
    assert.ok(Array.isArray(projection.motifs));
    assert.ok(Array.isArray(projection.emptySlots));
    for (const motif of projection.motifs) {
      assert.equal(typeof motif.instanceId, "string");
      assert.equal(typeof motif.slotId, "string");
      assert.ok(MOTIF_IDS.includes(motif.motifId));
      assert.ok(Array.isArray(motif.durations));
      assert.ok(Array.isArray(motif.staffSteps));
      assert.equal(typeof motif.contour.id, "string");
      assert.equal(Number.isInteger(motif.contour.translation), true);
    }
  }

  return {
    hash: stableSemanticHash(projections),
    projections,
  };
}

async function assertInteractiveStatuses(page) {
  const root = page.locator(
    '[data-composer-performance="memo-result-commit-v1"]',
  );
  const figures = root.locator("figure[data-composer-profile]");
  assert.equal(await figures.count(), 4);
  assert.equal(
    await figures.filter({ has: page.locator("svg") }).count(),
    4,
  );
  for (let index = 0; index < 4; index += 1) {
    const figure = figures.nth(index);
    assert.equal(await figure.getAttribute("data-glyph-calibration-status"), "runtime-approved");
    assert.equal(await figure.getAttribute("data-optical-token-status"), "draft");
    assert.equal(await figure.getAttribute("data-composer-tuning-status"), "draft");
  }
}

async function captureSemanticStability(page) {
  await page.setViewportSize(desktopViewport);
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await openFixture(
    page,
    "/__visual-lab/music/composer",
    "composer",
    RESPONSIVE_CAPTURE_STYLE,
  );
  const semanticInputs = {
    chapterId: "music-gate-c-semantic-stability",
    debug: false,
    profile: "ALL",
    seed: "wflyer-music-gate-c-stability-v1",
    theme: "light",
    viewport: "horizontal",
  };
  await configureInteractiveComposer(page, semanticInputs);
  await assertInteractiveStatuses(page);
  const baseline = await readInteractiveSemantics(page);
  assert.deepEqual(
    baseline.projections.map(({ profile }) => profile),
    PROFILES,
  );
  const cases = [];
  const addCase = (id, context, semantics) => {
    assert.deepEqual(
      semantics.projections,
      baseline.projections,
      `${id} must preserve semantic composition`,
    );
    cases.push({
      context,
      equalsBaseline: true,
      id,
      semanticHash: semantics.hash,
    });
  };

  addCase(
    "horizontal-desktop",
    {
      colorScheme: "light",
      reducedMotion: "no-preference",
      themeControl: "light",
      viewport: desktopViewport,
      viewportControl: "horizontal",
    },
    baseline,
  );
  await captureLocator(
    page.locator('[data-composer-performance="memo-result-commit-v1"]'),
    "07-responsive-horizontal-desktop.png",
  );

  await page
    .locator('[data-composer-control="viewport"]')
    .selectOption("vertical");
  await waitForStableRendering(page);
  addCase(
    "vertical-desktop",
    {
      colorScheme: "light",
      reducedMotion: "no-preference",
      themeControl: "light",
      viewport: desktopViewport,
      viewportControl: "vertical",
    },
    await readInteractiveSemantics(page),
  );

  await page.setViewportSize(mobileViewport);
  await waitForStableRendering(page);
  addCase(
    "actual-resize-mobile",
    {
      colorScheme: "light",
      reducedMotion: "no-preference",
      themeControl: "light",
      viewport: mobileViewport,
      viewportControl: "vertical",
    },
    await readInteractiveSemantics(page),
  );
  await captureLocator(
    page.locator('[data-composer-performance="memo-result-commit-v1"]'),
    "08-responsive-vertical-mobile.png",
  );

  await page.locator('[data-composer-control="theme"]').selectOption("dark");
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "no-preference" });
  await waitForStableRendering(page);
  addCase(
    "dark-theme",
    {
      colorScheme: "dark",
      reducedMotion: "no-preference",
      themeControl: "dark",
      viewport: mobileViewport,
      viewportControl: "vertical",
    },
    await readInteractiveSemantics(page),
  );

  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.addStyleTag({ content: REDUCED_MOTION_CAPTURE_STYLE });
  assert.equal(
    await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
    true,
  );
  await waitForStableRendering(page);
  addCase(
    "reduced-motion",
    {
      colorScheme: "dark",
      reducedMotion: "reduce",
      themeControl: "dark",
      viewport: mobileViewport,
      viewportControl: "vertical",
    },
    await readInteractiveSemantics(page),
  );
  await captureLocator(
    page.locator('[data-composer-performance="memo-result-commit-v1"]'),
    "09-reduced-motion-static.png",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  await page
    .locator('[data-fixture-page="composer"]')
    .waitFor({ state: "visible" });
  await page.addStyleTag({
    content: `${BASE_CAPTURE_STYLE}${RESPONSIVE_CAPTURE_STYLE}`,
  });
  await configureInteractiveComposer(page, {
    ...semanticInputs,
    theme: "dark",
    viewport: "vertical",
  });
  addCase(
    "reload-same-inputs",
    {
      colorScheme: "dark",
      reducedMotion: "reduce",
      reappliedSemanticInputs: true,
      themeControl: "dark",
      viewport: mobileViewport,
      viewportControl: "vertical",
    },
    await readInteractiveSemantics(page),
  );

  await writeJson("gate-c-semantic-stability.json", {
    approvalStatus: "pending-human-gate-c-review",
    baselineProjection: baseline.projections,
    baselineSemanticHash: baseline.hash,
    cases,
    invariants: {
      actualResizePreservesSemantics: true,
      reloadWithSameInputsPreservesSemantics: true,
      reducedMotionPreservesSemantics: true,
      themePreservesSemantics: true,
      viewportGeometryPreservesSemantics: true,
    },
    schemaVersion: 1,
    semanticInputs: {
      chapterId: semanticInputs.chapterId,
      profile: semanticInputs.profile,
      seed: semanticInputs.seed,
    },
  });
}

async function readPerformanceSnapshot(page) {
  return page
    .locator('[data-composer-performance="memo-result-commit-v1"]')
    .evaluate((element, marks) => {
      const numericAttribute = (name) => {
        const value = Number(element.getAttribute(name));
        if (!Number.isSafeInteger(value) || value < 0) {
          throw new Error(`${name} must expose a non-negative integer`);
        }
        return value;
      };

      return {
        counters: {
          compositionResult: numericAttribute(
            "data-composition-result-commits",
          ),
          geometryResult: numericAttribute("data-geometry-result-commits"),
          reactRender: numericAttribute("data-react-render-commits"),
        },
        marks: {
          compositionResult: performance.getEntriesByName(
            marks.compositionResult,
            "mark",
          ).length,
          geometryResult: performance.getEntriesByName(
            marks.geometryResult,
            "mark",
          ).length,
          reactRender: performance.getEntriesByName(
            marks.reactRender,
            "mark",
          ).length,
        },
      };
    }, PERFORMANCE_MARK_NAMES);
}

function performanceDelta(before, after) {
  const subtract = (category, field) =>
    after[category][field] - before[category][field];

  return {
    counters: {
      compositionResult: subtract("counters", "compositionResult"),
      geometryResult: subtract("counters", "geometryResult"),
      reactRender: subtract("counters", "reactRender"),
    },
    marks: {
      compositionResult: subtract("marks", "compositionResult"),
      geometryResult: subtract("marks", "geometryResult"),
      reactRender: subtract("marks", "reactRender"),
    },
  };
}

function assertCounterAndMarkParity(snapshot) {
  assert.deepEqual(
    snapshot.marks,
    snapshot.counters,
    "performance marks must match committed memo-result counters",
  );
}

async function waitForPerformanceIncrease(page, field, previousValue) {
  await waitUntil(async () => {
    const snapshot = await readPerformanceSnapshot(page);
    return snapshot.counters[field] > previousValue;
  }, `${field} did not record a committed result change`);
}

function performanceStep(id, before, after, assertions) {
  return {
    after,
    assertions,
    before,
    delta: performanceDelta(before, after),
    id,
  };
}

async function capturePerformanceEvidence(context) {
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await page.setViewportSize(desktopViewport);
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
    await openFixture(page, "/__visual-lab/music/composer", "composer");
    await waitUntil(async () => {
      const snapshot = await readPerformanceSnapshot(page);
      return Object.values(snapshot.counters).every((value) => value > 0);
    }, "composer performance instrumentation did not initialize");
    await waitForStableRendering(page);
    const steps = [];

    const beforeScroll = await readPerformanceSnapshot(page);
    assertCounterAndMarkParity(beforeScroll);
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          window.scrollTo({ top: document.documentElement.scrollHeight });
          let frames = 5;
          const next = () => {
            frames -= 1;
            if (frames === 0) {
              resolve();
            } else {
              requestAnimationFrame(next);
            }
          };
          requestAnimationFrame(next);
        }),
    );
    const afterScroll = await readPerformanceSnapshot(page);
    assert.deepEqual(afterScroll, beforeScroll);
    steps.push(
      performanceStep("scroll-plus-five-animation-frames", beforeScroll, afterScroll, {
        compositionDelta: 0,
        geometryDelta: 0,
        reactRenderDelta: 0,
      }),
    );

    const beforeTheme = afterScroll;
    await page.locator('[data-composer-control="theme"]').selectOption("dark");
    await waitForPerformanceIncrease(
      page,
      "reactRender",
      beforeTheme.counters.reactRender,
    );
    const afterTheme = await readPerformanceSnapshot(page);
    const themeDelta = performanceDelta(beforeTheme, afterTheme);
    assert.equal(themeDelta.counters.compositionResult, 0);
    assert.equal(themeDelta.counters.geometryResult, 0);
    assert.ok(themeDelta.counters.reactRender > 0);
    assert.equal(themeDelta.marks.compositionResult, 0);
    assert.equal(themeDelta.marks.geometryResult, 0);
    steps.push(
      performanceStep("theme-control-change", beforeTheme, afterTheme, {
        compositionDelta: 0,
        geometryDelta: 0,
        reactRenderDelta: "greater-than-zero",
      }),
    );

    const beforeReducedMotion = afterTheme;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await waitForStableRendering(page);
    const afterReducedMotion = await readPerformanceSnapshot(page);
    const reducedDelta = performanceDelta(beforeReducedMotion, afterReducedMotion);
    assert.equal(reducedDelta.counters.compositionResult, 0);
    assert.equal(reducedDelta.counters.geometryResult, 0);
    assert.equal(reducedDelta.marks.compositionResult, 0);
    assert.equal(reducedDelta.marks.geometryResult, 0);
    steps.push(
      performanceStep(
        "reduced-motion-media-change",
        beforeReducedMotion,
        afterReducedMotion,
        {
          compositionDelta: 0,
          geometryDelta: 0,
          reactRenderDelta: "unconstrained",
        },
      ),
    );

    const beforeViewport = afterReducedMotion;
    await page
      .locator('[data-composer-control="viewport"]')
      .selectOption("vertical");
    await waitForPerformanceIncrease(
      page,
      "geometryResult",
      beforeViewport.counters.geometryResult,
    );
    const afterViewport = await readPerformanceSnapshot(page);
    const viewportDelta = performanceDelta(beforeViewport, afterViewport);
    assert.equal(viewportDelta.counters.compositionResult, 0);
    assert.ok(viewportDelta.counters.geometryResult > 0);
    assert.ok(viewportDelta.counters.reactRender > 0);
    assert.equal(viewportDelta.marks.compositionResult, 0);
    assert.ok(viewportDelta.marks.geometryResult > 0);
    steps.push(
      performanceStep("viewport-geometry-control-change", beforeViewport, afterViewport, {
        compositionDelta: 0,
        geometryDelta: "greater-than-zero",
        reactRenderDelta: "greater-than-zero",
      }),
    );

    const beforeSemanticInput = afterViewport;
    await page
      .locator('[data-composer-control="seed"]')
      .fill("wflyer-music-gate-c-performance-recompose-v1");
    await waitForPerformanceIncrease(
      page,
      "compositionResult",
      beforeSemanticInput.counters.compositionResult,
    );
    await waitForPerformanceIncrease(
      page,
      "geometryResult",
      beforeSemanticInput.counters.geometryResult,
    );
    const afterSemanticInput = await readPerformanceSnapshot(page);
    const semanticDelta = performanceDelta(
      beforeSemanticInput,
      afterSemanticInput,
    );
    assert.ok(semanticDelta.counters.compositionResult > 0);
    assert.ok(semanticDelta.counters.geometryResult > 0);
    assert.ok(semanticDelta.counters.reactRender > 0);
    assert.ok(semanticDelta.marks.compositionResult > 0);
    assert.ok(semanticDelta.marks.geometryResult > 0);
    steps.push(
      performanceStep("semantic-seed-input-change", beforeSemanticInput, afterSemanticInput, {
        compositionDelta: "greater-than-zero",
        geometryDelta: "greater-than-zero",
        reactRenderDelta: "greater-than-zero",
      }),
    );

    for (const step of steps) {
      assertCounterAndMarkParity(step.after);
    }
    assert.deepEqual(pageErrors, [], `Browser page errors: ${pageErrors.join("\n")}`);
    await writeJson("gate-c-performance.json", {
      approvalStatus: "pending-human-gate-c-review",
      instrumentation: {
        counterMeaning: "committed-memo-result-identities",
        markNames: PERFORMANCE_MARK_NAMES,
        schemaVersion: "memo-result-commit-v1",
      },
      invariants: {
        reducedMotionDoesNotComposeOrMapGeometry: true,
        scrollAndAnimationFramesDoNoComposerGeometryOrReactWork: true,
        semanticInputRecomposesAndRemapsGeometry: true,
        themeDoesNotComposeOrMapGeometry: true,
        viewportControlRemapsGeometryWithoutComposition: true,
      },
      schemaVersion: 1,
      steps,
    });
  } finally {
    await page.close();
  }
}

async function validateArtifacts() {
  assert.deepEqual(
    [...generatedFiles].sort(),
    EXPECTED_FILES,
    "capture must produce exactly nine screenshots and four JSON payloads",
  );
  const hashes = [];

  for (const fileName of EXPECTED_FILES) {
    const filePath = path.join(outputDirectory, fileName);
    const details = await stat(filePath);
    const bytes = await readFile(filePath);
    assert.ok(details.size > 0, `${fileName} must not be empty`);

    if (fileName.endsWith(".png")) {
      assert.ok(details.size > 10_000, `${fileName} looks like an empty capture`);
      assert.deepEqual(
        [...bytes.subarray(0, 8)],
        [137, 80, 78, 71, 13, 10, 26, 10],
        `${fileName} must be a PNG`,
      );
    } else {
      JSON.parse(bytes.toString("utf8"));
    }

    hashes.push({
      bytes: details.size,
      fileName,
      sha256: sha256(bytes),
    });
  }

  return hashes;
}

await mkdir(outputDirectory, { recursive: true });
const immutableBaseline = await captureImmutableBaseline();
let browser;
const browserPageErrors = [];

try {
  await startOwnedDevelopmentServer();
  browser = await chromium.launch();
  const context = await browser.newContext({
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "pt-BR",
    reducedMotion: "no-preference",
    viewport: desktopViewport,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => browserPageErrors.push(error.message));

  try {
    await captureMotifMatrix(page);
    await captureKeySignatures(page);
    await captureFixedSeeds(page);
    await captureSemanticStability(page);
    await capturePerformanceEvidence(context);
    assert.deepEqual(
      browserPageErrors,
      [],
      `Browser page errors: ${browserPageErrors.join("\n")}`,
    );
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

await assertImmutableBaselineUnchanged(immutableBaseline);
const artifactHashes = await validateArtifacts();

console.log(
  `Music Gate-C candidate evidence captured: ${SCREENSHOT_FILES.length} PNGs and ${JSON_FILES.length} JSON payloads in ${outputDirectory}.`,
);
console.log("No aggregate SHA manifest was created; candidate artifact hashes:");
for (const artifact of artifactHashes) {
  console.log(`${artifact.sha256}  ${artifact.fileName}  (${artifact.bytes} bytes)`);
}
