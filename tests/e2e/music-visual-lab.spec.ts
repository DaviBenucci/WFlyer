import { expect, test, type Page } from "@playwright/test";

const productionServer =
  process.env.WFLYER_PLAYWRIGHT_TEST_SERVER === "production";

const LAB_ROUTES = [
  "/__visual-lab/music",
  "/__visual-lab/music/glyphs",
  "/__visual-lab/music/calibration",
  "/__visual-lab/music/pitches",
  "/__visual-lab/music/beams",
  "/__visual-lab/music/key-signatures",
  "/__visual-lab/music/curved-score",
  "/__visual-lab/music/composer",
] as const;

interface BrowserDraftGlyphCalibration {
  readonly assetKey: string;
  readonly status: string;
  readonly coordinateSpace: string;
  readonly metrics: {
    readonly nominalHeightSp: number;
    readonly nominalWidthSp: number;
  };
  readonly anchors: Readonly<Record<string, { x: number; y: number }>>;
  readonly sourceSha256: {
    readonly runtimeCandidate: string;
    readonly sourceMaster: string;
  };
  readonly nominalHeightSp?: unknown;
  readonly nominalWidthSp?: unknown;
}

interface BrowserDraftCalibrationExport {
  readonly schemaVersion: number;
  readonly status: string;
  readonly glyphs: readonly BrowserDraftGlyphCalibration[];
}

interface ComposerPerformanceSnapshot {
  readonly counters: {
    readonly compositionResult: number;
    readonly geometryResult: number;
    readonly reactRender: number;
  };
  readonly marks: {
    readonly compositionResult: number;
    readonly geometryResult: number;
    readonly reactRender: number;
  };
}

const COMPOSER_PERFORMANCE_MARKS = {
  compositionResult:
    "wflyer.music-lab.composer.composition-result-commit",
  geometryResult: "wflyer.music-lab.composer.geometry-result-commit",
  reactRender: "wflyer.music-lab.composer.react-render-commit",
} as const;

async function openDevelopmentFixture(
  page: Page,
  path: string,
  fixturePage: string,
) {
  const response = await page.goto(path);

  expect(response?.ok(), path).toBe(true);
  await expect(
    page.locator(`[data-fixture-page="${fixturePage}"]`),
  ).toBeVisible();
}

async function readComposerSemantics(page: Page): Promise<readonly unknown[]> {
  return page.locator("[data-composer-semantics]").evaluateAll((elements) =>
    elements.map((element) => JSON.parse(element.textContent ?? "null") as unknown),
  );
}

async function readComposerPerformance(
  page: Page,
): Promise<ComposerPerformanceSnapshot> {
  return page
    .locator('[data-composer-performance="memo-result-commit-v1"]')
    .evaluate((element, marks) => {
      const numericAttribute = (name: string) => {
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
    }, COMPOSER_PERFORMANCE_MARKS);
}

async function waitForComposerInstrumentation(page: Page) {
  await expect
    .poll(async () => {
      const { counters } = await readComposerPerformance(page);

      return Object.values(counters).every((count) => count > 0);
    })
    .toBe(true);

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

test("development Music Visual Lab exposes the complete fixture index", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[0], "index");
  await expect(
    page.getByRole("heading", { name: "W_Flyer Music Visual Lab" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Open fixture" })).toHaveCount(7);
  await expect(page.getByRole("status")).toContainText("Gate B approved");
  await expect(page.getByRole("status")).toContainText(
    "Gate C approved for future landing integration",
  );
});

test("glyph gallery exposes all assets, themes, and scales", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[1], "glyphs");
  await expect(page.locator("[data-glyph-scale]")).toHaveCount(64);
  await expect(
    page.locator('[data-theme="light"][data-glyph-scale]'),
  ).toHaveCount(32);
  await expect(
    page.locator('[data-theme="dark"][data-glyph-scale]'),
  ).toHaveCount(32);

  for (const scale of [25, 50, 100, 200]) {
    await expect(page.locator(`[data-glyph-scale="${scale}"]`)).toHaveCount(16);
  }
});

test("calibration workbench exports canonical drafts and shows accidental contexts", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[2], "calibration");
  await expect(
    page.locator('[data-fixture-component="calibration-workbench"]'),
  ).toHaveAttribute("data-calibration-status", "draft-calibration");

  const accidentalContexts = page.locator("[data-accidental-context]");
  await expect(accidentalContexts).toHaveCount(6);

  const calibrationComposites = page.locator(
    "[data-calibration-composite-theme]",
  );
  await expect(calibrationComposites).toHaveCount(2);

  for (const theme of ["light", "dark"] as const) {
    const composite = page.locator(
      `[data-calibration-composite-theme="${theme}"]`,
    );

    await expect(composite).toHaveAttribute(
      "data-runtime-status",
      "draft-calibration",
    );
    await expect(composite).toHaveAttribute("data-clef-g-line-aligned", "true");
    await expect(composite).toHaveAttribute(
      "data-notehead-connection-cases",
      "8",
    );
    await expect(composite).toHaveAttribute(
      "data-accidental-context-cases",
      "6",
    );
    await expect(composite).toHaveAttribute("data-flag-attachment-cases", "4");
    await expect(
      composite.locator('[data-calibration-anchor="gLine"]'),
    ).toHaveCount(1);
    await expect(
      composite.locator('[data-composite-stem-connection="stemUp"]'),
    ).toHaveCount(4);
    await expect(
      composite.locator('[data-composite-stem-connection="stemDown"]'),
    ).toHaveCount(4);
    await expect(
      composite.locator('[data-calibration-anchor="pitchCenter"]'),
    ).toHaveCount(6);
    await expect(
      composite.locator('[data-calibration-anchor="stemAttachment"]'),
    ).toHaveCount(4);
  }

  for (const accidental of ["sharp", "flat", "natural"]) {
    const assetKey = `wf-music-accidental-${accidental}`;
    await expect(
      page.locator(
        `[data-accidental-context="${assetKey}"][data-staff-position="line"]`,
      ),
    ).toHaveCount(1);
    await expect(
      page.locator(
        `[data-accidental-context="${assetKey}"][data-staff-position="space"]`,
      ),
    ).toHaveCount(1);
  }

  const exportField = page.getByLabel("Draft calibration JSON");
  const payload = JSON.parse(
    await exportField.inputValue(),
  ) as BrowserDraftCalibrationExport;

  expect(payload.schemaVersion).toBe(1);
  expect(payload.status).toBe("draft-calibration");
  expect(payload.glyphs).toHaveLength(8);

  for (const glyph of payload.glyphs) {
    expect(glyph.status).toBe("draft-calibration");
    expect(glyph.coordinateSpace).toBe("normalized-view-box");
    expect(glyph.metrics.nominalWidthSp).toBeGreaterThan(0);
    expect(glyph.metrics.nominalHeightSp).toBeGreaterThan(0);
    expect(glyph.anchors).toBeTruthy();
    expect(glyph.sourceSha256.sourceMaster).toMatch(/^[0-9a-f]{64}$/u);
    expect(glyph.sourceSha256.runtimeCandidate).toMatch(/^[0-9a-f]{64}$/u);
    expect(glyph.nominalWidthSp).toBeUndefined();
    expect(glyph.nominalHeightSp).toBeUndefined();
  }

  await page.locator('input[type="range"]').first().fill("2.7");
  await expect
    .poll(async () => {
      const changed = JSON.parse(
        await exportField.inputValue(),
      ) as BrowserDraftCalibrationExport;
      return changed.glyphs[0]?.metrics.nominalWidthSp;
    })
    .toBe(2.7);
});

test("pitch page exposes ladder, ledger, stem, and flag fixtures", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[3], "pitches");
  const ladder = page.locator('[data-fixture="landing-pitch-ladder"]');
  const extended = page.locator('[data-fixture="extended-ledger-cases"]');
  const stems = page.locator('[data-fixture="isolated-stems-flags"]');

  await expect(ladder.locator('[data-score-role="notehead"]')).toHaveCount(13);
  await expect(extended.locator('[data-score-role="ledger"]')).toHaveCount(13);
  await expect(page.locator("table tbody tr")).toHaveCount(10);
  await expect(stems.locator('[data-score-role="stem"]')).toHaveCount(6);
  await expect(stems.locator('[data-score-role="flag"]')).toHaveCount(4);
  await expect(stems).toHaveAttribute(
    "data-down-flag-transform-status",
    "approved",
  );
});

test("beam page exposes the complete whitelist without an always-on debug overlay", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[4], "beams");
  await expect(page.locator("[data-beam-motif]")).toHaveCount(7);
  await expect(page.locator('[data-beam-motif="E8_TRIPLET_3"]')).toHaveCount(2);
  await expect(
    page.locator('[data-triplet-direction="up"] [data-score-role="tuplet"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-triplet-direction="down"] [data-score-role="tuplet"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-score-role="beam-secondary-hook-left"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-score-role="beam-secondary-hook-right"]'),
  ).toHaveCount(1);
  await expect(page.locator('[data-score-debug-overlay="true"]')).toHaveCount(
    0,
  );
  await expect(
    page.locator('[data-semantic-debug="score-primitive-attributes"]'),
  ).toHaveCount(7);
});

test("key-signature page covers fifths -7 through +7 and both barline kinds", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[5], "key-signatures");
  await expect(page.locator("[data-fifths]")).toHaveCount(15);
  await expect(page.locator('[data-score-role="key-signature"]')).toHaveCount(
    56,
  );
  await expect(
    page.locator('[data-key-signature-ownership="renderer-authored-outside-composer"]'),
  ).toHaveAttribute("data-composer-key-signature-fields", "0");

  for (let fifths = -7; fifths <= 7; fifths += 1) {
    const fixture = page.locator(`[data-fifths="${fifths}"]`);
    const expectedOccurrence = fifths === 0 ? "0" : "1";

    await expect(fixture).toHaveCount(1);
    await expect(fixture).toHaveAttribute(
      "data-configured-key-signature-occurrences",
      expectedOccurrence,
    );
    await expect(fixture).toHaveAttribute(
      "data-rendered-key-signature-accidentals",
      String(Math.abs(fifths)),
    );
    await expect(fixture.locator('[data-score-role="key-signature"]')).toHaveCount(
      Math.abs(fifths),
    );
  }
  await expect(page.locator('[data-score-role="barline"]')).toHaveCount(15);
  await expect(
    page.locator('[data-score-role="final-barline-thin"]'),
  ).toHaveCount(15);
  await expect(
    page.locator('[data-score-role="final-barline-thick"]'),
  ).toHaveCount(15);
});

test("curved-score page covers all three path shapes with coherent staffs", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[6], "curved-score");
  await expect(page.locator("[data-path-shape]")).toHaveCount(3);
  await expect(page.locator('[data-path-shape="straight"]')).toHaveCount(1);
  await expect(page.locator('[data-path-shape="gentle-arc"]')).toHaveCount(1);
  await expect(page.locator('[data-path-shape="gentle-s"]')).toHaveCount(1);
  const semanticPathFixtures = page.locator("[data-path-shape]");
  await expect(
    semanticPathFixtures.locator('[data-score-role="staff-line"]'),
  ).toHaveCount(15);
  await expect(
    semanticPathFixtures.locator('[data-score-role="notehead"]'),
  ).toHaveCount(9);
  await expect(
    semanticPathFixtures.locator(
      '[data-score-role="final-barline-thin"]',
    ),
  ).toHaveCount(3);
  await expect(
    semanticPathFixtures.locator(
      '[data-score-role="final-barline-thick"]',
    ),
  ).toHaveCount(3);

  const motifIds = [
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
  ] as const;
  const matrix = page.locator("[data-motif-path-case]");

  await expect(matrix).toHaveCount(39);
  await expect(
    page.locator(
      '[data-motif-path-case][data-glyph-calibration-status="runtime-approved"]',
    ),
  ).toHaveCount(39);
  await expect(
    page.locator(
      '[data-motif-path-case][data-optical-token-status="approved"]',
    ),
  ).toHaveCount(39);

  for (const pathShape of ["straight", "gentle-arc", "gentle-s"] as const) {
    await expect(
      page.locator(`[data-matrix-path-shape="${pathShape}"]`),
    ).toHaveCount(13);
  }

  for (const motifId of motifIds) {
    await expect(
      page.locator(`[data-matrix-motif-id="${motifId}"]`),
    ).toHaveCount(3);
  }

  const curvedHooks = page.locator(
    '[data-matrix-motif-id="S16_E8_S16"]:not([data-matrix-path-shape="straight"])',
  );
  await expect(
    curvedHooks.locator('[data-score-role="beam-secondary-hook-left"]'),
  ).toHaveCount(2);
  await expect(
    curvedHooks.locator('[data-score-role="beam-secondary-hook-right"]'),
  ).toHaveCount(2);

  const curvedTriplets = page.locator(
    '[data-matrix-motif-id="E8_TRIPLET_3"]:not([data-matrix-path-shape="straight"])',
  );
  await expect(
    curvedTriplets.locator('[data-score-role="tuplet"]'),
  ).toHaveCount(2);

  const tripletDetail = page.locator(
    '[data-triplet-detail-review="gate-c-final-approved-v1"]',
  );
  await expect(tripletDetail).toHaveAttribute(
    "data-triplet-numeral-status",
    "approved-external-human-review",
  );
  await expect(tripletDetail.locator("figure[data-triplet-path-shape]")).toHaveCount(
    6,
  );
  for (const pathShape of ["straight", "gentle-arc", "gentle-s"] as const) {
    for (const stemDirection of ["up", "down"] as const) {
      const fixture = tripletDetail.locator(
        `[data-triplet-path-shape="${pathShape}"][data-triplet-stem-direction="${stemDirection}"]`,
      );
      await expect(fixture).toHaveCount(1);
      await expect(fixture.locator('[data-score-role="tuplet"]')).toHaveCount(1);
      await expect(fixture.locator('[data-tuplet-numeral="3"]')).toHaveCount(1);
      await expect(fixture.locator('[data-tuplet-bracket-segment]')).toHaveCount(4);
    }
  }
});

test("responsive review keeps conventional engraving inside notation-safe zones", async ({
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[7], "composer");
  const review = page.locator(
    '[data-responsive-projection-review="gate-c-delta-v1"]',
  );
  const figures = review.locator("figure[data-responsive-mode]");

  await expect(review).toHaveAttribute(
    "data-max-notation-tangent-angle-deg",
    "18",
  );
  await expect(review).toHaveAttribute(
    "data-responsive-calibration-status",
    "semantics-approved-thresholds-noncanonical",
  );
  await expect(figures).toHaveCount(4);

  for (const mode of [
    "horizontal-enhanced",
    "vertical-wide",
    "vertical-compact",
    "static",
  ] as const) {
    await expect(
      review.locator(`figure[data-responsive-mode="${mode}"]`),
    ).toHaveCount(1);
  }

  const mobile = review.locator(
    'figure[data-responsive-mode="vertical-compact"]',
  );
  const notationZones = mobile.locator('[data-zone-kind="notation-safe"]');
  const connectorZones = mobile.locator('[data-zone-kind="connector"]');

  await expect(mobile).toHaveAttribute("data-clef-mirror-x", "false");
  await expect(mobile).toHaveAttribute("data-clef-mirror-y", "false");
  await expect(mobile).toHaveAttribute("data-clef-rotation-radians", "0");
  await expect(mobile).toHaveAttribute(
    "data-final-barline-orientation",
    "thin-gap-thick-vertical",
  );
  await expect(mobile).toHaveAttribute(
    "data-five-line-continuity",
    "one-master-guide",
  );
  await expect(mobile).toHaveAttribute("data-key-signature-fifths", "2");
  await expect(mobile).toHaveAttribute(
    "data-key-signature-rendered-accidentals",
    "2",
  );
  await expect(mobile).toHaveAttribute("data-musical-event-count", "10");
  await expect(mobile).toHaveAttribute("data-ordinary-barline-count", "1");
  await expect(mobile.locator('[data-score-role="staff-line"]')).toHaveCount(5);
  await expect(mobile.locator('[data-score-role="clef"]')).toHaveCount(1);
  await expect(
    mobile.locator('[data-score-role="key-signature"]'),
  ).toHaveCount(2);
  await expect(mobile.locator('[data-score-role="notehead"]')).toHaveCount(10);
  await expect(
    mobile.locator('[data-score-role="beam-primary"]'),
  ).toHaveCount(2);
  await expect(mobile.locator('[data-score-role="tuplet"]')).toHaveCount(1);
  await expect(mobile.locator('[data-score-role="barline"]')).toHaveCount(1);
  await expect(
    mobile.locator('[data-score-role="final-barline-thin"]'),
  ).toHaveCount(1);
  await expect(
    mobile.locator('[data-score-role="final-barline-thick"]'),
  ).toHaveCount(1);
  await expect(notationZones).toHaveCount(3);
  await expect(connectorZones).toHaveCount(2);

  expect(
    await notationZones.evaluateAll((elements) =>
      elements.every(
        (element) =>
          element.getAttribute("data-notation-angle-limit-applies") ===
            "true" &&
          element.getAttribute("data-tangent-measurement") ===
            "analytic-constant" &&
          Number(element.getAttribute("data-tangent-angle-deg")) <= 18,
      ),
    ),
  ).toBe(true);
  expect(
    await connectorZones.evaluateAll((elements) =>
      elements.every(
        (element) =>
          element.getAttribute("data-event-count") === "0" &&
          element.getAttribute("data-semantic-slot-ids") === "" &&
          element.getAttribute("data-notation-angle-limit-applies") ===
            "false" &&
          element.getAttribute("data-tangent-measurement") ===
            "display-sampled" &&
          Number(element.getAttribute("data-tangent-angle-deg")) > 18 &&
          Number(element.getAttribute("data-minimum-curvature-radius-sp")) > 2,
      ),
    ),
  ).toBe(true);
});

test("composer controls preserve semantics and expose isolated performance evidence", async ({
  browserName,
  page,
}) => {
  test.skip(productionServer, "Development harness evidence only");

  await openDevelopmentFixture(page, LAB_ROUTES[7], "composer");
  const interactiveComposer = page.locator(
    '[data-composer-performance="memo-result-commit-v1"]',
  );
  const fixedSeedMatrix = page.locator(
    '[data-fixed-seed-matrix="gate-c-v1"]',
  );

  await expect(fixedSeedMatrix.locator("[data-fixed-seed-id]")).toHaveCount(
    12,
  );
  for (const profile of ["CALM", "BALANCED", "ACTIVE", "TERMINAL"] as const) {
    await expect(
      fixedSeedMatrix.locator(`[data-composer-profile="${profile}"]`),
    ).toHaveCount(3);
  }
  const semanticHashes = await fixedSeedMatrix
    .locator("[data-semantic-hash]")
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-semantic-hash")),
    );
  expect(semanticHashes).toHaveLength(12);
  expect(new Set(semanticHashes).size).toBe(12);
  expect(
    semanticHashes.every((hash) => /^fnv1a32-v1-[0-9a-f]{8}$/u.test(hash ?? "")),
  ).toBe(true);
  await expect(page.locator('[data-approved-renderer-tokens="v1"]')).toContainText(
    '"status": "approved-external-human-review"',
  );
  await expect(
    page.locator('[data-approved-composer-calibration="v1"]'),
  ).toContainText('"status": "approved-external-human-review"');

  await expect(page.locator("[data-composer-control]")).toHaveCount(6);
  await expect(interactiveComposer.locator("[data-composer-profile]")).toHaveCount(
    4,
  );
  await expect(
    interactiveComposer.locator(
      '[data-composer-profile][data-glyph-calibration-status="runtime-approved"]',
    ),
  ).toHaveCount(4);
  await expect(
    interactiveComposer.locator(
      '[data-composer-profile][data-optical-token-status="approved"]',
    ),
  ).toHaveCount(4);
  await expect(
    interactiveComposer.locator(
      '[data-composer-profile][data-composer-tuning-status="approved"]',
    ),
  ).toHaveCount(4);
  await expect(page.locator('[data-score-debug-overlay="true"]')).toHaveCount(
    4,
  );
  await waitForComposerInstrumentation(page);

  const initialSemantics = await readComposerSemantics(page);
  const initialPerformance = await readComposerPerformance(page);

  expect(initialPerformance.marks).toEqual(initialPerformance.counters);
  expect(JSON.stringify(initialSemantics)).toContain('"versions"');
  expect(JSON.stringify(initialSemantics)).toContain('"derivedSeed"');
  expect(JSON.stringify(initialSemantics)).toContain('"contour"');

  const scrollHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  expect(scrollHeight).toBeGreaterThan(await page.evaluate(() => innerHeight));
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.scrollTo({ top: document.documentElement.scrollHeight });
        let remainingFrames = 5;

        const waitForFrame = () => {
          remainingFrames -= 1;
          if (remainingFrames === 0) {
            resolve();
            return;
          }

          requestAnimationFrame(waitForFrame);
        };

        requestAnimationFrame(waitForFrame);
      }),
  );
  expect(await readComposerPerformance(page)).toEqual(initialPerformance);
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  const beforeViewportChange = await readComposerPerformance(page);
  await page
    .locator('[data-composer-control="viewport"]')
    .selectOption("vertical-compact");
  await expect(
    interactiveComposer.locator('[data-viewport="vertical-compact"]'),
  ).toHaveCount(4);
  await expect
    .poll(
      async () =>
        (await readComposerPerformance(page)).counters.geometryResult,
    )
    .toBeGreaterThan(beforeViewportChange.counters.geometryResult);
  const afterViewportChange = await readComposerPerformance(page);

  expect(afterViewportChange.counters.compositionResult).toBe(
    beforeViewportChange.counters.compositionResult,
  );
  expect(afterViewportChange.marks.compositionResult).toBe(
    beforeViewportChange.marks.compositionResult,
  );
  expect(afterViewportChange.counters.geometryResult).toBeGreaterThan(
    beforeViewportChange.counters.geometryResult,
  );
  expect(afterViewportChange.marks.geometryResult).toBeGreaterThan(
    beforeViewportChange.marks.geometryResult,
  );
  expect(afterViewportChange.counters.reactRender).toBeGreaterThan(
    beforeViewportChange.counters.reactRender,
  );
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  const beforeThemeChange = afterViewportChange;
  await page.locator('[data-composer-control="theme"]').selectOption("dark");
  await expect(
    interactiveComposer.locator(
      '[data-composer-profile][data-theme="dark"]',
    ),
  ).toHaveCount(4);
  await expect
    .poll(
      async () => (await readComposerPerformance(page)).counters.reactRender,
    )
    .toBeGreaterThan(beforeThemeChange.counters.reactRender);
  const afterThemeChange = await readComposerPerformance(page);

  expect(afterThemeChange.counters.compositionResult).toBe(
    beforeThemeChange.counters.compositionResult,
  );
  expect(afterThemeChange.counters.geometryResult).toBe(
    beforeThemeChange.counters.geometryResult,
  );
  expect(afterThemeChange.marks.compositionResult).toBe(
    beforeThemeChange.marks.compositionResult,
  );
  expect(afterThemeChange.marks.geometryResult).toBe(
    beforeThemeChange.marks.geometryResult,
  );
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  const beforeResize = await readComposerPerformance(page);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  expect(await readComposerPerformance(page)).toEqual(beforeResize);
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  const beforeReducedMotion = await readComposerPerformance(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const afterReducedMotion = await readComposerPerformance(page);

  expect(afterReducedMotion.counters.compositionResult).toBe(
    beforeReducedMotion.counters.compositionResult,
  );
  expect(afterReducedMotion.counters.geometryResult).toBe(
    beforeReducedMotion.counters.geometryResult,
  );
  expect(afterReducedMotion.marks.compositionResult).toBe(
    beforeReducedMotion.marks.compositionResult,
  );
  expect(afterReducedMotion.marks.geometryResult).toBe(
    beforeReducedMotion.marks.geometryResult,
  );
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  await page.reload();
  await expect(page.locator('[data-fixture-page="composer"]')).toBeVisible();
  await waitForComposerInstrumentation(page);
  expect(await readComposerSemantics(page)).toEqual(initialSemantics);

  const debugControl = page.locator('[data-composer-control="debug"]');
  await debugControl.uncheck();
  await expect(page.locator('[data-score-debug-overlay="true"]')).toHaveCount(
    0,
  );
  await debugControl.check();
  await expect(page.locator('[data-score-debug-overlay="true"]')).toHaveCount(
    4,
  );

  const seedControl = page.locator('[data-composer-control="seed"]');
  const chapterControl = page.locator('[data-composer-control="chapter"]');
  const beforeSeedChange = await readComposerPerformance(page);
  await seedControl.fill("review-seed-v1");
  await expect(page.getByRole("status")).toContainText("review-seed-v1");
  await expect
    .poll(
      async () =>
        (await readComposerPerformance(page)).counters.compositionResult,
    )
    .toBeGreaterThan(beforeSeedChange.counters.compositionResult);
  const afterSeedChange = await readComposerPerformance(page);

  expect(afterSeedChange.counters.geometryResult).toBeGreaterThan(
    beforeSeedChange.counters.geometryResult,
  );
  expect(afterSeedChange.marks.compositionResult).toBeGreaterThan(
    beforeSeedChange.marks.compositionResult,
  );
  expect(afterSeedChange.marks.geometryResult).toBeGreaterThan(
    beforeSeedChange.marks.geometryResult,
  );
  expect(await readComposerSemantics(page)).not.toEqual(initialSemantics);

  const beforeChapterChange = afterSeedChange;
  await chapterControl.fill("review-chapter");
  await expect(page.getByRole("status")).toContainText("review-chapter");
  await expect
    .poll(
      async () =>
        (await readComposerPerformance(page)).counters.compositionResult,
    )
    .toBeGreaterThan(beforeChapterChange.counters.compositionResult);
  const afterChapterChange = await readComposerPerformance(page);

  expect(afterChapterChange.counters.geometryResult).toBeGreaterThan(
    beforeChapterChange.counters.geometryResult,
  );
  expect(afterChapterChange.marks.compositionResult).toBeGreaterThan(
    beforeChapterChange.marks.compositionResult,
  );
  expect(afterChapterChange.marks.geometryResult).toBeGreaterThan(
    beforeChapterChange.marks.geometryResult,
  );

  const textInputStyles = await seedControl.evaluate((input) => {
    const style = getComputedStyle(input);
    return {
      backgroundColor: style.backgroundColor,
      borderStyle: style.borderStyle,
      minHeight: style.minHeight,
    };
  });
  expect(textInputStyles.borderStyle).toBe("solid");
  expect(textInputStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(Number.parseFloat(textInputStyles.minHeight)).toBeGreaterThanOrEqual(
    44,
  );

  if (browserName === "chromium") {
    await page.emulateMedia({ forcedColors: "active" });
    await seedControl.focus();
    const forcedColorsFocus = await seedControl.evaluate((input) => {
      const style = getComputedStyle(input);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    expect(forcedColorsFocus.outlineStyle).not.toBe("none");
    expect(
      Number.parseFloat(forcedColorsFocus.outlineWidth),
    ).toBeGreaterThanOrEqual(3);
  }

  await page
    .locator('[data-composer-control="profile"]')
    .selectOption("TERMINAL");
  await expect(
    interactiveComposer.locator('[data-composer-profile="TERMINAL"]'),
  ).toHaveCount(1);
  await expect(interactiveComposer.locator("[data-composer-profile]")).toHaveCount(
    1,
  );
});

test("production build returns 404 for every Music Visual Lab route", async ({
  request,
}) => {
  test.skip(!productionServer, "Production-standalone guard evidence only");

  for (const path of LAB_ROUTES) {
    const response = await request.get(path);
    const body = await response.text();

    expect(response.status(), path).toBe(404);
    expect(body, path).not.toContain(
      'data-music-visual-lab="development-only"',
    );
    expect(body, path).not.toContain("Draft calibration JSON");
  }
});
