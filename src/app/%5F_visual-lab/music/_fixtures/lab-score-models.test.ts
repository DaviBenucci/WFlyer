import { describe, expect, it } from "vitest";

import {
  AUTOMATIC_MOTIF_IDS,
  getMotifDefinition,
  isTerminalMotif,
} from "@/lib/music/composer/motifs";
import { getPitchContourDeltas } from "@/lib/music/composer/pitch-contours";
import type {
  ComposerProfile,
  MotifId,
  SupportedNoteCount,
} from "@/lib/music/composer/types";
import {
  APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
  RESPONSIVE_SCORE_PRESENTATION_MODES,
  zoneForResponsiveScoreT,
  type ResponsiveScoreNotationZone,
  type ResponsiveScoreProjectionZone,
} from "@/lib/music/geometry/responsive-score-projection";
import { frameAt, placeAtStaffStep } from "@/lib/music/geometry/score-path";
import type { Fifths } from "@/lib/music/geometry/types";
import { glyphTransformForFrame } from "@/lib/music/renderer/glyph-frame";

import {
  buildBeamFixture,
  buildCurvedScoreFixtures,
  buildLabResponsiveProjection,
  buildKeySignatureFixture,
  buildLedgerFixture,
  buildResponsiveProjectionReviewFixtures,
  buildMotifPathMatrixFixtures,
  buildPitchLadderFixture,
  buildStemAndFlagFixture,
  buildTripletDetailFixtures,
  COMPOSER_LAB_SLOTS,
  composeLabSegment,
  renderLabSegment,
} from "./lab-score-models";

function roles(model: ReturnType<typeof buildPitchLadderFixture>["model"]) {
  return model.primitives.map((primitive) => primitive.role);
}

const EXPECTED_BEAM_ROLES = {
  E8_E8: ["beam-primary"],
  E8_TRIPLET_3: ["beam-primary"],
  S16_S16_S16_S16: ["beam-primary", "beam-secondary"],
  E8_S16_S16: ["beam-primary", "beam-secondary"],
  S16_S16_E8: ["beam-primary", "beam-secondary"],
  S16_E8_S16: [
    "beam-primary",
    "beam-secondary-hook-left",
    "beam-secondary-hook-right",
  ],
} as const satisfies Partial<Record<MotifId, readonly string[]>>;

function isBeamedFixtureMotif(
  motifId: MotifId,
): motifId is keyof typeof EXPECTED_BEAM_ROLES {
  return Object.hasOwn(EXPECTED_BEAM_ROLES, motifId);
}

function isNotationZone(
  zone: ResponsiveScoreProjectionZone,
): zone is ResponsiveScoreNotationZone {
  return zone.kind === "notation-safe";
}

function orientation(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsProperlyIntersect(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
  d: { x: number; y: number },
): boolean {
  const epsilon = 1e-7;
  const first = orientation(a, b, c);
  const second = orientation(a, b, d);
  const third = orientation(c, d, a);
  const fourth = orientation(c, d, b);

  return (
    first * second < -epsilon &&
    third * fourth < -epsilon
  );
}

function polylineSelfIntersects(
  points: readonly { x: number; y: number }[],
): boolean {
  for (let firstIndex = 0; firstIndex < points.length - 1; firstIndex += 1) {
    const a = points[firstIndex];
    const b = points[firstIndex + 1];

    if (!a || !b) continue;

    for (
      let secondIndex = firstIndex + 2;
      secondIndex < points.length - 1;
      secondIndex += 1
    ) {
      const c = points[secondIndex];
      const d = points[secondIndex + 1];

      if (c && d && segmentsProperlyIntersect(a, b, c, d)) return true;
    }
  }

  return false;
}

function polylinesIntersect(
  first: readonly { x: number; y: number }[],
  second: readonly { x: number; y: number }[],
): boolean {
  for (let firstIndex = 0; firstIndex < first.length - 1; firstIndex += 1) {
    const a = first[firstIndex];
    const b = first[firstIndex + 1];

    if (!a || !b) continue;

    for (let secondIndex = 0; secondIndex < second.length - 1; secondIndex += 1) {
      const c = second[secondIndex];
      const d = second[secondIndex + 1];

      if (c && d && segmentsProperlyIntersect(a, b, c, d)) return true;
    }
  }

  return false;
}

describe("Music Visual Lab score fixtures", () => {
  it("builds the complete C4..A5 ladder and extended ledger set", () => {
    const ladder = buildPitchLadderFixture().model;
    const ledgers = buildLedgerFixture().model;

    expect(ladder.staff.lines).toHaveLength(5);
    expect(roles(ladder).filter((role) => role === "notehead")).toHaveLength(13);
    expect(roles(ledgers).filter((role) => role === "ledger")).toHaveLength(13);
  });

  it("builds isolated stem and flag fixtures in both directions", () => {
    const model = buildStemAndFlagFixture().model;
    const primitiveRoles = roles(model);

    expect(primitiveRoles.filter((role) => role === "stem")).toHaveLength(6);
    expect(primitiveRoles.filter((role) => role === "flag")).toHaveLength(4);
  });

  it.each([
    ["E8_E8", [1, 2], 1, false],
    ["E8_TRIPLET_3", [0, 1, 2], 1, true],
    ["E8_TRIPLET_3", [6, 7, 8], 1, true],
    ["S16_S16_S16_S16", [2, 3, 4, 5], 2, false],
    ["E8_S16_S16", [2, 3, 4], 2, false],
    ["S16_S16_E8", [6, 5, 4], 2, false],
    ["S16_E8_S16", [1, 2, 3], 3, false],
  ] as const)(
    "builds beam topology %s",
    (motifId, staffSteps, expectedBeamCount, expectsTuplet) => {
      const model = buildBeamFixture(
        motifId,
        staffSteps,
        `test-${motifId}-${staffSteps[0]}`,
      ).model;
      const motif = model.motifs[0];

      expect(motif?.beams).toHaveLength(expectedBeamCount);
      expect(Boolean(motif?.tuplet)).toBe(expectsTuplet);
      if (expectsTuplet) expect(motif?.tuplet?.label).toBe("3");
    },
  );

  it.each(
    Array.from({ length: 15 }, (_, index) => (index - 7) as Fifths),
  )("builds fifths=%s with ordered barline primitives", (fifths) => {
    const { model, structuralEvidence } =
      buildKeySignatureFixture(fifths);
    const primitiveRoles = roles(model);

    expect(
      primitiveRoles.filter((role) => role === "key-signature"),
    ).toHaveLength(Math.abs(fifths));
    expect(
      primitiveRoles.filter((role) =>
        ["barline", "final-barline-thin", "final-barline-thick"].includes(
          role,
        ),
      ),
    ).toEqual([
      "barline",
      "final-barline-thin",
      "final-barline-thick",
    ]);
    expect(structuralEvidence).toEqual({
      configuredOccurrences: fifths === 0 ? 0 : 1,
      firstNoteT: 0.32,
      keySignatureT: fifths === 0 ? null : 0.14,
      nearOriginAndBeforeMusic: true,
      renderedAccidentalGlyphs: Math.abs(fifths),
      rendererInputCardinality: "zero-or-one",
    });
  });

  it("maps identical pitch semantics to straight, arc, and S paths", () => {
    const fixtures = buildCurvedScoreFixtures();

    expect(fixtures.map((fixture) => fixture.id)).toEqual([
      "straight",
      "gentle-arc",
      "gentle-s",
    ]);
    for (const fixture of fixtures) {
      expect(fixture.model.staff.lines).toHaveLength(5);
      expect(
        fixture.model.motifs.flatMap((motif) =>
          motif.notes.map((note) => note.staffStep),
        ),
      ).toEqual([0, 4, 8]);
      expect(
        fixture.model.primitives
          .map((primitive) => primitive.role)
          .filter((role) =>
            ["barline", "final-barline-thin", "final-barline-thick"].includes(
              role,
            ),
          ),
      ).toEqual(["barline", "final-barline-thin", "final-barline-thick"]);
    }
  });

  it("renders all 13 automatic motifs on every supported ScorePath shape", () => {
    const fixtures = buildMotifPathMatrixFixtures();
    const pathShapes = ["straight", "gentle-arc", "gentle-s"] as const;
    const expectedCases = pathShapes.flatMap((pathShape) =>
      AUTOMATIC_MOTIF_IDS.map((motifId) => `${pathShape}:${motifId}`),
    );

    expect(fixtures).toHaveLength(39);
    expect(
      fixtures.map(({ motifId, pathShape }) => `${pathShape}:${motifId}`),
    ).toEqual(expectedCases);

    for (const fixture of fixtures) {
      const definition = getMotifDefinition(fixture.motifId);
      const motif = fixture.model.motifs[0];

      expect(fixture.model.staff.lines).toHaveLength(5);
      expect(fixture.model.motifs).toHaveLength(1);
      expect(motif?.motifId).toBe(fixture.motifId);
      expect(motif?.notes.map(({ duration }) => duration)).toEqual(
        definition.durations,
      );
      expect(motif?.notes).toHaveLength(definition.durations.length);
      expect(
        motif?.notes.every(
          ({ center, t }) =>
            Number.isFinite(center.x) &&
            Number.isFinite(center.y) &&
            Number.isFinite(t),
        ),
      ).toBe(true);

      if (!motif) throw new Error("Matrix fixture requires one motif");

      const deltas = getPitchContourDeltas(
        fixture.semanticMotif.contourId,
        fixture.semanticMotif.notes.length as SupportedNoteCount,
      );
      expect(fixture.semanticMotif.staffSteps).toEqual(
        deltas.map(
          (delta) => delta + fixture.semanticMotif.contourTranslation,
        ),
      );
    }

    for (const motifId of AUTOMATIC_MOTIF_IDS) {
      const semanticVariants = fixtures
        .filter((fixture) => fixture.motifId === motifId)
        .map((fixture) => ({
          staffSteps: fixture.model.motifs[0]?.notes.map(
            ({ staffStep }) => staffStep,
          ),
          ts: fixture.model.motifs[0]?.notes.map(({ t }) => t),
        }));

      expect(semanticVariants).toHaveLength(3);
      expect(semanticVariants[1]).toEqual(semanticVariants[0]);
      expect(semanticVariants[2]).toEqual(semanticVariants[0]);
    }
  });

  it("isolates the split triplet detail across every path and stem direction", () => {
    const fixtures = buildTripletDetailFixtures();

    expect(
      fixtures.map(({ pathShape, stemDirection }) =>
        `${pathShape}:${stemDirection}`,
      ),
    ).toEqual([
      "straight:up",
      "straight:down",
      "gentle-arc:up",
      "gentle-arc:down",
      "gentle-s:up",
      "gentle-s:down",
    ]);

    for (const fixture of fixtures) {
      const motif = fixture.model.motifs[0];
      const tuplet = motif?.tuplet;

      expect(motif?.motifId).toBe("E8_TRIPLET_3");
      expect(motif?.notes).toHaveLength(3);
      expect(
        motif?.notes.every(
          ({ stemDirection }) => stemDirection === fixture.stemDirection,
        ),
      ).toBe(true);
      expect(tuplet?.label).toBe("3");
      expect(tuplet?.bracket.map(({ role }) => role)).toEqual([
        "span-before-numeral",
        "span-after-numeral",
        "end-cap-start",
        "end-cap-end",
      ]);
      expect(tuplet?.numeralSize).toBe(0.85 * 16);
      expect(tuplet?.numeralSideGap).toBe(0.18 * 16);
      expect(tuplet?.centralGap).toBe(
        (tuplet?.numeralWidth ?? Number.NaN) +
          2 * (tuplet?.numeralSideGap ?? Number.NaN),
      );
    }
  });

  it("materializes every beamed topology on all three path shapes", () => {
    const fixtures = buildMotifPathMatrixFixtures().filter(({ motifId }) =>
      isBeamedFixtureMotif(motifId),
    );

    expect(fixtures).toHaveLength(18);

    for (const fixture of fixtures) {
      if (!isBeamedFixtureMotif(fixture.motifId)) {
        throw new Error("Filtered fixture must have a beamed motif ID");
      }

      const expectedRoles = EXPECTED_BEAM_ROLES[fixture.motifId];
      const motif = fixture.model.motifs[0];

      expect(expectedRoles).toBeDefined();
      expect(motif?.beams.map(({ role }) => role)).toEqual(expectedRoles);
      expect(
        motif?.beams.every(
          ({ start, end }) =>
            Number.isFinite(start.x) &&
            Number.isFinite(start.y) &&
            Number.isFinite(end.x) &&
            Number.isFinite(end.y),
        ),
      ).toBe(true);
      expect(Boolean(motif?.tuplet)).toBe(
        fixture.motifId === "E8_TRIPLET_3",
      );
    }
  });

  it("materializes hook and triplet behavior on both curved path shapes", () => {
    const curvedFixtures = buildMotifPathMatrixFixtures().filter(
      ({ pathShape }) => pathShape !== "straight",
    );
    const hookFixtures = curvedFixtures.filter(
      ({ motifId }) => motifId === "S16_E8_S16",
    );
    const tripletFixtures = curvedFixtures.filter(
      ({ motifId }) => motifId === "E8_TRIPLET_3",
    );

    expect(hookFixtures).toHaveLength(2);
    for (const fixture of hookFixtures) {
      const roles = fixture.model.motifs[0]?.beams.map(({ role }) => role);

      expect(roles).toEqual([
        "beam-primary",
        "beam-secondary-hook-left",
        "beam-secondary-hook-right",
      ]);
      expect(
        fixture.model.motifs[0]?.beams.every(
          ({ start, end }) =>
            Number.isFinite(start.x) &&
            Number.isFinite(start.y) &&
            Number.isFinite(end.x) &&
            Number.isFinite(end.y),
        ),
      ).toBe(true);
    }

    expect(tripletFixtures).toHaveLength(2);
    for (const fixture of tripletFixtures) {
      const tuplet = fixture.model.motifs[0]?.tuplet;

      expect(tuplet?.label).toBe("3");
      expect(tuplet?.bracket.map(({ role }) => role)).toEqual([
        "span-before-numeral",
        "span-after-numeral",
        "end-cap-start",
        "end-cap-end",
      ]);
      expect(tuplet?.labelPosition).toEqual({
        x: expect.any(Number),
        y: expect.any(Number),
      });
    }
  });

  it.each([
    "CALM",
    "BALANCED",
    "ACTIVE",
    "TERMINAL",
  ] as const satisfies readonly ComposerProfile[])(
    "keeps %s semantics identical across horizontal and vertical geometry",
    (profile) => {
      const segment = composeLabSegment(
        profile,
        "fixture-test-seed",
        "fixture-test-chapter",
      );
      const horizontal = renderLabSegment(
        segment,
        "horizontal-enhanced",
      );
      const vertical = renderLabSegment(segment, "vertical-compact");

      expect(horizontal.segment).toBe(segment);
      expect(vertical.segment).toBe(segment);
      expect(horizontal.segment.motifs).toEqual(vertical.segment.motifs);
      expect(segment.emptySlots).toEqual([
        {
          slotId: "reserved-transition",
          reason: "reserved-zone",
          reservedReason: "transition",
        },
      ]);
      expect(
        segment.motifs
          .filter((motif) => motif.slotId === "terminal")
          .every((motif) => isTerminalMotif(motif.motifId)),
      ).toBe(true);
    },
  );
});

describe("responsive Music Visual Lab projection fixtures", () => {
  it("shows every general presentation mode with mode-specific physical grouping", () => {
    const fixtures = buildResponsiveProjectionReviewFixtures();

    expect(fixtures.map(({ projection }) => projection.mode)).toEqual(
      RESPONSIVE_SCORE_PRESENTATION_MODES,
    );
    expect(
      fixtures.map(({ projection }) =>
        projection.zones
          .filter(isNotationZone)
          .map(({ semanticSlotIds }) => semanticSlotIds.length),
      ),
    ).toEqual([[7], [4, 3], [2, 2, 3], [4, 3]]);
    expect(fixtures.map(({ viewBox }) => viewBox)).toEqual([
      "0 0 1280 280",
      "0 0 760 940",
      "0 0 520 1280",
      "0 0 760 940",
    ]);
  });

  it("renders one continuous mobile ribbon with event-free returning connectors", () => {
    const fixture = buildResponsiveProjectionReviewFixtures().find(
      ({ projection }) => projection.mode === "vertical-compact",
    );

    expect(fixture).toBeDefined();
    if (!fixture) return;

    const notationZones = fixture.projection.zones.filter(isNotationZone);
    const connectors = fixture.projection.zones.filter(
      ({ kind }) => kind === "connector",
    );

    expect(fixture.model.staff.lines).toHaveLength(5);
    expect(notationZones).toHaveLength(3);
    expect(connectors).toHaveLength(2);
    expect(
      notationZones.every(
        ({ maximumTangentAngleDeg, path }) =>
          maximumTangentAngleDeg <=
            APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG &&
          path.tangentAt(0.5).x > 0,
      ),
    ).toBe(true);
    expect(
      connectors.every((connector) =>
        fixture.evidence.zones.some(
          ({ eventCount, id, semanticSlotIds }) =>
            id === connector.id &&
            eventCount === 0 &&
            semanticSlotIds.length === 0,
        ),
      ),
    ).toBe(true);
    expect(
      fixture.evidence.zones
        .filter(({ kind }) => kind === "connector")
        .every(
          ({ displayTangentAngleDeg, notationAngleLimitApplies }) =>
            displayTangentAngleDeg >
              APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG &&
            !notationAngleLimitApplies,
        ),
    ).toBe(true);
    expect(
      fixture.evidence.zones
        .filter(({ kind }) => kind === "connector")
        .every(
          ({ minimumCurvatureRadiusSp }) =>
            (minimumCurvatureRadiusSp ?? 0) > 2,
        ),
    ).toBe(true);
    expect(
      connectors.every(({ path }) =>
        [0.25, 0.5, 0.75].some(
          (t) => Math.abs(path.tangentAt(t).y) > 0.5,
        ),
      ),
    ).toBe(true);

    for (let index = 1; index < fixture.projection.zones.length; index += 1) {
      const previous = fixture.projection.zones[index - 1];
      const current = fixture.projection.zones[index];

      expect(previous?.path.pointAt(1)).toEqual(current?.path.pointAt(0));
      expect(previous?.path.tangentAt(1)).toEqual(
        current?.path.tangentAt(0),
      );
      expect(previous?.path.normalAt(1)).toEqual(current?.path.normalAt(0));
    }
  });

  it("keeps complete compact and wide connector outer offsets regular and non-intersecting", () => {
    const fixtures = buildResponsiveProjectionReviewFixtures().filter(
      ({ projection }) =>
        projection.mode === "vertical-compact" ||
        projection.mode === "vertical-wide",
    );
    const sampleCount = 513;

    for (const fixture of fixtures) {
      const connectors = fixture.projection.zones.filter(
        ({ kind }) => kind === "connector",
      );

      expect(connectors.length).toBeGreaterThan(0);

      for (const connector of connectors) {
        const upper = Array.from({ length: sampleCount }, (_, index) =>
          placeAtStaffStep(
            connector.path,
            index / (sampleCount - 1),
            8,
            16,
          ),
        );
        const lower = Array.from({ length: sampleCount }, (_, index) =>
          placeAtStaffStep(
            connector.path,
            index / (sampleCount - 1),
            0,
            16,
          ),
        );

        expect(polylineSelfIntersects(upper)).toBe(false);
        expect(polylineSelfIntersects(lower)).toBe(false);
        expect(polylinesIntersect(upper, lower)).toBe(false);

        for (let index = 0; index < sampleCount; index += 16) {
          const upperPoint = upper[index];
          const lowerPoint = lower[index];

          expect(upperPoint).toBeDefined();
          expect(lowerPoint).toBeDefined();
          if (!upperPoint || !lowerPoint) continue;

          expect(
            Math.hypot(
              upperPoint.x - lowerPoint.x,
              upperPoint.y - lowerPoint.y,
            ),
          ).toBeCloseTo(4 * 16, 8);
        }
      }

      for (let index = 1; index < fixture.projection.zones.length; index += 1) {
        const previous = fixture.projection.zones[index - 1];
        const current = fixture.projection.zones[index];

        if (!previous || !current) continue;

        for (const staffStep of [0, 8] as const) {
          expect(
            placeAtStaffStep(previous.path, 1, staffStep, 16),
          ).toEqual(placeAtStaffStep(current.path, 0, staffStep, 16));
        }
        expect(previous.path.tangentAt(1)).toEqual(current.path.tangentAt(0));
        expect(previous.path.normalAt(1)).toEqual(current.path.normalAt(0));
      }
    }
  });

  it("keeps every rendered musical event inside a left-to-right notation zone", () => {
    for (const fixture of buildResponsiveProjectionReviewFixtures()) {
      for (const note of fixture.model.motifs.flatMap(({ notes }) => notes)) {
        const zone = zoneForResponsiveScoreT(fixture.projection, note.t);

        expect(zone.kind).toBe("notation-safe");
        expect(fixture.projection.path.tangentAt(note.t).x).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the mobile clef upright/unmirrored in a horizontal origin zone", () => {
    const fixture = buildResponsiveProjectionReviewFixtures().find(
      ({ projection }) => projection.mode === "vertical-compact",
    );

    expect(fixture).toBeDefined();
    if (!fixture) return;

    const clef = fixture.model.primitives.find(
      (primitive) => primitive.kind === "glyph" && primitive.role === "clef",
    );
    const clefZone = fixture.projection.zones.find(
      ({ id }) => id === fixture.projection.trebleClef.zoneId,
    );
    const frame = frameAt(
      fixture.projection.path,
      fixture.projection.trebleClef.t,
    );

    expect(clefZone?.kind).toBe("notation-safe");
    expect(frame.tangent).toEqual({ x: 1, y: 0 });
    expect(frame.normal).toEqual({ x: 0, y: -1 });
    expect(glyphTransformForFrame(frame)).toEqual({
      mirrorX: false,
      mirrorY: false,
      rotationRadians: 0,
    });
    expect(
      clef && clef.kind === "glyph"
        ? {
            mirrorX: clef.mirrorX,
            mirrorY: clef.mirrorY,
            rotationRadians: clef.rotationRadians,
          }
        : null,
    ).toEqual({ mirrorX: false, mirrorY: false, rotationRadians: 0 });
    expect(fixture.evidence.clef).toEqual({
      mirrorX: false,
      mirrorY: false,
      rotationRadians: 0,
    });
  });

  it("keeps the final barline thin-gap-thick and vertical in the terminal notation zone", () => {
    const fixture = buildResponsiveProjectionReviewFixtures().find(
      ({ projection }) => projection.mode === "vertical-compact",
    );

    expect(fixture).toBeDefined();
    if (!fixture) return;

    const finalZone = fixture.projection.zones.find(
      ({ id }) => id === fixture.projection.finalBarline.zoneId,
    );
    const finalLines = fixture.model.primitives.filter(
      (primitive) =>
        primitive.kind === "line" &&
        (primitive.role === "final-barline-thin" ||
          primitive.role === "final-barline-thick"),
    );

    expect(finalZone?.kind).toBe("notation-safe");
    expect(finalLines.map(({ role }) => role)).toEqual([
      "final-barline-thin",
      "final-barline-thick",
    ]);
    expect(
      finalLines.every(
        (line) => line.kind === "line" && line.start.x === line.end.x,
      ),
    ).toBe(true);
    expect(fixture.evidence.finalBarlineOrientation).toBe(
      "thin-gap-thick-vertical",
    );
  });

  it("preserves a fixed key signature and ordinary barline across every mode", () => {
    for (const fixture of buildResponsiveProjectionReviewFixtures()) {
      expect(fixture.projection.keySignature?.fifths).toBe(2);
      expect(fixture.evidence.keySignature).toEqual({
        fifths: 2,
        renderedAccidentalGlyphs: 2,
      });
      expect(
        fixture.model.primitives.filter(
          ({ role }) => role === "key-signature",
        ),
      ).toHaveLength(2);
      expect(fixture.projection.ordinaryBarlines).toHaveLength(1);
      expect(fixture.evidence.ordinaryBarlineCount).toBe(1);
      expect(
        fixture.projection.ordinaryBarlines.every(
          ({ t }) =>
            zoneForResponsiveScoreT(fixture.projection, t).kind ===
            "notation-safe",
        ),
      ).toBe(true);
      expect(fixture.projection.keySignature?.t).toBeGreaterThan(
        fixture.projection.trebleClef.t,
      );
      expect(fixture.projection.keySignature?.t).toBeLessThan(
        fixture.projection.slots[0]?.range.start ?? Number.NEGATIVE_INFINITY,
      );
    }
  });

  it("preserves the complete semantic segment across every geometric remap", () => {
    const fixtures = buildResponsiveProjectionReviewFixtures();
    const baseline = fixtures[0];

    expect(baseline).toBeDefined();
    if (!baseline) return;

    for (const fixture of fixtures) {
      expect(fixture.segment).toBe(baseline.segment);
      expect(fixture.segment.motifs).toEqual(baseline.segment.motifs);
      expect(fixture.segment.emptySlots).toEqual(baseline.segment.emptySlots);
      expect(fixture.projection.semanticSlotIds).toEqual(
        COMPOSER_LAB_SLOTS.map(({ id }) => id),
      );
      expect(fixture.evidence.semanticSlotIds).toEqual(
        baseline.evidence.semanticSlotIds,
      );
    }

    expect(
      fixtures.map(({ model }) =>
        model.motifs.flatMap(({ notes }) =>
          notes.map(({ center }) => center),
        ),
      ),
    ).not.toEqual([
      fixtures[0]?.model.motifs.flatMap(({ notes }) =>
        notes.map(({ center }) => center),
      ),
      fixtures[0]?.model.motifs.flatMap(({ notes }) =>
        notes.map(({ center }) => center),
      ),
      fixtures[0]?.model.motifs.flatMap(({ notes }) =>
        notes.map(({ center }) => center),
      ),
      fixtures[0]?.model.motifs.flatMap(({ notes }) =>
        notes.map(({ center }) => center),
      ),
    ]);
  });

  it("keeps same-seed composer semantics stable while resize remaps geometry only", () => {
    const first = composeLabSegment(
      "BALANCED",
      "responsive-same-seed",
      "responsive-same-chapter",
    );
    const second = composeLabSegment(
      "BALANCED",
      "responsive-same-seed",
      "responsive-same-chapter",
    );

    expect(second).toEqual(first);

    const horizontal = renderLabSegment(first, "horizontal-enhanced");
    const vertical = renderLabSegment(first, "vertical-compact");

    expect(vertical.segment).toBe(first);
    expect(vertical.segment.motifs).toEqual(horizontal.segment.motifs);
    expect(vertical.segment.emptySlots).toEqual(horizontal.segment.emptySlots);
    expect(vertical.model.motifs.map(({ motifId }) => motifId)).toEqual(
      horizontal.model.motifs.map(({ motifId }) => motifId),
    );
    expect(
      vertical.model.motifs.flatMap(({ notes }) =>
        notes.map(({ staffStep }) => staffStep),
      ),
    ).toEqual(
      horizontal.model.motifs.flatMap(({ notes }) =>
        notes.map(({ staffStep }) => staffStep),
      ),
    );
    expect(vertical.model.staff.lines[2]?.points).not.toEqual(
      horizontal.model.staff.lines[2]?.points,
    );
  });

  it("preserves pitch-increasing normal placement after mobile remapping", () => {
    const projection = buildLabResponsiveProjection("vertical-compact");
    const t = projection.slots[3]?.range.start;

    expect(t).toBeDefined();
    if (t === undefined) return;

    const middle = projection.path.pointAt(t);
    const E4 = placeAtStaffStep(projection.path, t, 0, 16);
    const F5 = placeAtStaffStep(projection.path, t, 8, 16);

    expect(F5.y).toBeLessThan(middle.y);
    expect(E4.y).toBeGreaterThan(middle.y);
  });
});
