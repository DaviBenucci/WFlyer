import { describe, expect, it } from "vitest";

import { glyphTransformForFrame } from "@/lib/music/renderer/glyph-frame";
import {
  buildStoryScoreProjection,
  STORY_SCORE_CARD_INTERACTION,
  STORY_SCORE_CHAPTER_BARLINES,
  STORY_SCORE_PROJECTION_MODES,
} from "@/lib/story/score/projection";
import { SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG } from "@/lib/story/score/organic-flowing";
import {
  STORY_SCORE_BRANCHES,
  STORY_SCORE_COMPOSITIONS,
  storyScoreCompositionDiagnostics,
} from "@/lib/story/score/composition";

describe("Task 34 Organic Flowing production projections", () => {
  it("does not invent metric chapter barlines and preserves distinct branch finals", () => {
    const classifications = Object.entries(STORY_SCORE_CHAPTER_BARLINES);
    const nonTerminal = classifications.filter(
      ([chapterId]) => !chapterId.endsWith("-terminal"),
    );
    const terminals = classifications.filter(([chapterId]) =>
      chapterId.endsWith("-terminal"),
    );

    expect(nonTerminal).toHaveLength(11);
    expect(nonTerminal.map(([, classification]) => classification)).toEqual(
      Array.from({ length: 11 }, () => ({
        ordinaryBarlineRendered: false,
        reason: "CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION",
        status: "NOT_A_MEASURE_BOUNDARY",
      })),
    );
    expect(terminals).toHaveLength(2);
    expect(terminals.map(([, classification]) => classification)).toEqual(
      Array.from({ length: 2 }, () => ({
        ordinaryBarlineRendered: false,
        reason: "BRANCH_FINAL_BARLINE",
        status: "BRANCH_TERMINAL",
      })),
    );

    const projection = buildStoryScoreProjection("horizontal-enhanced");
    expect(projection.evidence.ordinaryBarlineCount).toBe(0);
    expect(projection.evidence.finalBarlines).toEqual({
      application: "thin-gap-thick-and-physical-end",
      professional: "thin-gap-thick-and-physical-end",
    });
  });

  it.each(STORY_SCORE_PROJECTION_MODES)(
    "integrates the shared origin and 12 segments in %s",
    (mode) => {
      const projection = buildStoryScoreProjection(mode, {
        viewportHeight: 900,
        viewportWidth: mode === "vertical-compact" ? 390 : 1440,
      });

      expect(projection.evidence.segmentCount).toBe(12);
      expect(projection.evidence.commonOrigin.pointGap).toBeLessThanOrEqual(1e-7);
      expect(projection.evidence.commonOrigin.staffLineGap).toBeLessThanOrEqual(
        1e-7,
      );
      expect(projection.evidence.commonOrigin.staffSpaceDelta).toBe(0);
      expect(projection.evidence.commonOrigin.tangentAlignment).toBeCloseTo(
        -1,
        7,
      );
      expect(projection.evidence.clef).toMatchObject({
        assetKey: "wf-music-treble-clef",
        count: 1,
        mirrorX: false,
        mirrorY: false,
      });
      expect(projection.evidence.maximumNotationTangentAngleDeg).toBeLessThanOrEqual(
        18.0000001,
      );
      expect(projection.evidence.connectorEventCount).toBe(0);
      expect(projection.evidence.fiveLineContinuity).toBe(true);
      expect(projection.evidence.continuity.maximumCurvatureDelta).toBeLessThanOrEqual(
        1e-7,
      );
      expect(projection.evidence.continuity.maximumPointGap).toBeLessThanOrEqual(
        1e-7,
      );
      expect(projection.evidence.continuity.minimumTangentAlignment).toBeGreaterThanOrEqual(
        1 - 1e-7,
      );
      expect(projection.evidence.pathSelfIntersections).toEqual({
        application: 0,
        professional: 0,
      });
      expect(projection.evidence.staffLineSelfIntersections).toEqual({
        application: 0,
        professional: 0,
      });

      for (const branch of ["professional", "application"] as const) {
        const projected = projection.branches[branch];
        const expectedSlotIds = [
          ...projected.composition.motifs.map(({ slotId }) => slotId),
          ...projected.composition.emptySlots.map(({ slotId }) => slotId),
        ].sort();
        const projectedSlotIds = projected.zones
          .flatMap(({ semanticSlotIds }) => semanticSlotIds)
          .sort();

        expect(projected.semanticSegmentIds).toHaveLength(6);
        expect(new Set(projectedSlotIds).size).toBe(projectedSlotIds.length);
        expect(projectedSlotIds).toEqual(expectedSlotIds);
        expect(projected.model.staff.lines).toHaveLength(5);
        expect(projected.zones.at(-1)).toMatchObject({
          endT: 1,
          kind: "notation-safe",
        });
        expect(
          projected.model.layers.at(-1)?.primitives.slice(-2).map(({ role }) => role),
        ).toEqual(["final-barline-thin", "final-barline-thick"]);
      }
    },
  );

  it("reuses cached projections without recomposing the session", () => {
    const first = buildStoryScoreProjection("vertical-wide");
    const second = buildStoryScoreProjection("vertical-wide");

    expect(second).toBe(first);
    expect(second.branches.professional.composition).toBe(
      first.branches.professional.composition,
    );
    expect(second.branches.application.composition).toBe(
      first.branches.application.composition,
    );
  });

  it("keys measured projections by normalized physical inputs, not object identity", () => {
    const measurements = {
      chapterContentExclusions: {
        "application-demo": [
          {
            height: 420,
            reason: "application-tablet-demo",
            width: 680,
            x: 7_250,
            y: 210,
          },
        ],
      },
    } as const;
    const first = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: measurements,
      viewportHeight: 900,
      viewportWidth: 1_536,
    });
    const equivalent = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: structuredClone(measurements),
      viewportHeight: 900,
      viewportWidth: 1_536,
    });
    const changed = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: {
        chapterContentExclusions: {
          "application-demo": [
            { ...measurements.chapterContentExclusions["application-demo"][0], x: 7_251 },
          ],
        },
      },
      viewportHeight: 900,
      viewportWidth: 1_536,
    });

    expect(equivalent).toBe(first);
    expect(changed).not.toBe(first);
    expect(changed.branches.application.composition).toBe(
      first.branches.application.composition,
    );
    expect(storyScoreCompositionDiagnostics().composerInvocationCount).toBe(2);
  });

  it("uses rendered card geometry for the shared interaction and three project visits", () => {
    const applicationHowItWorksCards = Array.from(
      { length: 5 },
      (_, index) => ({
        height: 176,
        width: 200.63,
        x: 5_744.98 + index * 208.63,
        y: 425,
      }),
    );
    const projection = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: {
        applicationHowItWorksCards,
        chapterContentExclusions: {
          "application-how-it-works": [
            {
              height: 660.55,
              reason: "heading-and-body",
              width: 560,
              x: 5_520,
              y: 154,
            },
          ],
          "professional-services": [
            {
              height: 521.8,
              reason: "heading-and-body",
              width: 330.03,
              x: 12_714.31,
              y: 189.09,
            },
          ],
        },
        professionalProjectCards: [
          { height: 610.43, width: 313.2, x: 16_713.65, y: 151.41 },
          { height: 599.52, width: 289.89, x: 17_045.39, y: 150.23 },
          { height: 610.43, width: 313.2, x: 17_353.81, y: 151.41 },
        ],
        professionalServicesCards: Array.from(
          { length: 4 },
          (_, index) => ({
            height: 275.72,
            width: 246.78,
            x: 12_991.17 + index * 262.78,
            y: 366.13,
          }),
        ),
      },
      viewportHeight: 900,
      viewportWidth: 1_536,
    });

    for (const interaction of Object.values(
      projection.evidence.cardScoreInteractions,
    )) {
      expect(interaction.measurementSource).toBe("dom-measured");
      expect(interaction.eventCount).toBe(0);
      expect(interaction.leadInLength).toBeGreaterThanOrEqual(96);
      expect(interaction.leadOutLength).toBeGreaterThanOrEqual(96);
      expect(interaction.minimumOpacity).toBe(0.34);
      expect(interaction.maximumStaffSpread).toBe(2.35);
    }

    const interactionPrimitives = STORY_SCORE_BRANCHES.flatMap((branch) =>
      projection.branches[branch].model.primitives.filter(
        (primitive) =>
          primitive.kind === "polyline" &&
          primitive.id.includes("card-score-interaction"),
      ),
    );
    const interactionIds = interactionPrimitives.map(({ id }) => id);
    const opacities = interactionPrimitives.flatMap((primitive) =>
      primitive.kind === "polyline" && primitive.opacity !== undefined
        ? [primitive.opacity]
        : [],
    );

    expect(interactionIds.some((id) => id.includes("pre-transition"))).toBe(
      true,
    );
    expect(interactionIds.some((id) => id.includes(":expanded:"))).toBe(true);
    expect(interactionIds.some((id) => id.includes("post-transition"))).toBe(
      true,
    );
    expect(Math.min(...opacities)).toBeCloseTo(0.34, 6);
    expect(new Set(opacities).size).toBeGreaterThan(3);

    const application = projection.branches.application;
    const howZones = application.zones.filter(
      ({ chapterId }) => chapterId === "application-how-it-works",
    );
    const howNotationZones = howZones.filter(
      ({ kind }) => kind === "notation-safe",
    );
    const howInteraction = howZones.find(
      ({ interactionId, kind }) =>
        kind === "connector" &&
        interactionId === STORY_SCORE_CARD_INTERACTION.id,
    );

    expect(howNotationZones).toHaveLength(1);
    expect(howNotationZones[0]?.semanticSlotIds).toEqual([
      "application-how-it-works:primary",
      "application-how-it-works:reserved",
    ]);
    expect(howNotationZones[0]?.eventCount).toBeGreaterThan(0);
    expect(howInteraction).toMatchObject({
      eventCount: 0,
      semanticSlotIds: [],
    });
    expect(howInteraction?.points.at(-1)?.x).toBeLessThan(
      howInteraction?.points[0]?.x ?? Number.NEGATIVE_INFINITY,
    );
    expect(howInteraction?.interactionProfile).toMatchObject({
      transformEndFraction: expect.any(Number),
      transformStartFraction: expect.any(Number),
    });
    expect(
      howInteraction?.interactionProfile?.transformStartFraction,
    ).toBeGreaterThan(0);
    expect(
      howInteraction?.interactionProfile?.transformEndFraction,
    ).toBeLessThan(1);
    expect(
      howInteraction?.interactionProfile?.transformEndFraction ?? 0,
    ).toBeGreaterThan(
      howInteraction?.interactionProfile?.transformStartFraction ?? 1,
    );

    for (const zone of application.zones) {
      const tangents = Array.from({ length: 129 }, (_, index) => {
        const t = zone.startT + ((zone.endT - zone.startT) * index) / 128;
        return application.path.tangentAt(t);
      });
      const hasReverseTravel = tangents.some(({ x }) => x < -1e-7);

      if (hasReverseTravel) {
        expect(zone.kind).toBe("connector");
        expect(zone.eventCount).toBe(0);
        expect(zone.semanticSlotIds).toEqual([]);
      }

      if (zone === howNotationZones[0]) {
        for (const tangent of tangents) {
          expect(tangent.x).toBeGreaterThan(0);
          expect(
            Math.abs((Math.atan2(tangent.y, tangent.x) * 180) / Math.PI),
          ).toBeLessThanOrEqual(
            SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG + 1e-7,
          );
        }
      }
    }

    const howMotifs = application.model.motifs.filter(({ id }) =>
      id.startsWith("application-how-it-works:"),
    );
    expect(howMotifs).toHaveLength(2);
    for (const motif of howMotifs) {
      expect(motif.beams).toEqual([]);
      for (const note of motif.notes) {
        const tangent = application.path.tangentAt(note.t);
        const expectedFrameTransform = glyphTransformForFrame({
          normal: application.path.normalAt(note.t),
          point: application.path.pointAt(note.t),
          tangent,
        });
        expect(tangent.x).toBeGreaterThan(0);
        expect(note.notehead).toMatchObject(expectedFrameTransform);
      }
    }

    const howOnlyProjection = buildStoryScoreProjection(
      "horizontal-enhanced",
      {
        sceneMeasurements: { applicationHowItWorksCards },
        viewportHeight: 900,
        viewportWidth: 1_536,
      },
    );
    const howOnlyEquivalent = buildStoryScoreProjection(
      "horizontal-enhanced",
      {
        sceneMeasurements: {
          applicationHowItWorksCards: structuredClone(
            applicationHowItWorksCards,
          ),
        },
        viewportHeight: 900,
        viewportWidth: 1_536,
      },
    );
    const unmeasuredProjection = buildStoryScoreProjection(
      "horizontal-enhanced",
      { viewportHeight: 900, viewportWidth: 1_536 },
    );

    expect(howOnlyEquivalent).toBe(howOnlyProjection);
    expect(howOnlyProjection.branches.professional.zones).toEqual(
      unmeasuredProjection.branches.professional.zones,
    );
    expect(howOnlyProjection.branches.professional.model).toEqual(
      unmeasuredProjection.branches.professional.model,
    );
    expect(
      Array.from({ length: 257 }, (_, index) =>
        howOnlyProjection.branches.professional.path.pointAt(index / 256),
      ),
    ).toEqual(
      Array.from({ length: 257 }, (_, index) =>
        unmeasuredProjection.branches.professional.path.pointAt(index / 256),
      ),
    );
    expect(SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG).toBe(18);

    expect(projection.evidence.projectSerpentine.visitAnchors).toHaveLength(3);
    projection.evidence.projectSerpentine.visitAnchors.forEach(
      (visit, index) => {
        expect(visit.measurementSource).toBe("dom-measured");
        expect(visit.projectIndex).toBe(index + 1);
        expect(visit.anchor.x).toBeCloseTo(
          visit.cardRect.x + visit.cardRect.width / 2,
          6,
        );
        const visitGap =
          visit.anchor.y - (visit.cardRect.y + visit.cardRect.height);
        expect(visitGap).toBeGreaterThanOrEqual(36);
        expect(visitGap).toBeLessThanOrEqual(54);
      },
    );
    expect(
      projection.evidence.projectSerpentine.connectorEventCounts,
    ).toEqual([0, 0, 0, 0]);
    expect(
      projection.evidence.projectSerpentine.maximumShelfTangentAngleDeg,
    ).toBeLessThanOrEqual(18);
    expect(projection.evidence.projectSerpentine.pathSelfIntersections).toBe(0);
    expect(
      projection.evidence.projectSerpentine.staffLineSelfIntersections,
    ).toBe(0);
  });

  it("uses measured outer gaps and explicit Family-A boundary transitions", () => {
    const projection = buildStoryScoreProjection("horizontal-enhanced", {
      sceneMeasurements: {
        chapterContentExclusions: {
          "application-access": [
            {
              height: 357,
              reason: "heading-and-body",
              width: 549,
              x: 1_183,
              y: 271,
            },
            {
              height: 449,
              reason: "access-action",
              width: 593,
              x: 1_695,
              y: 225,
            },
          ],
          "application-demo": [
            {
              height: 646,
              reason: "heading-and-body",
              width: 367,
              x: 2_442,
              y: 127,
            },
            {
              height: 683,
              reason: "application-tablet-demo",
              width: 1_045,
              x: 2_855,
              y: 109,
            },
          ],
          "application-terminal": [
            {
              height: 591,
              reason: "terminal-content",
              width: 951,
              x: 77,
              y: 154,
            },
          ],
        },
      },
      viewportHeight: 900,
      viewportWidth: 1_536,
    });

    expect(projection.evidence.pathSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(projection.evidence.staffLineSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(projection.evidence.maximumNotationTangentAngleDeg).toBeLessThanOrEqual(
      18,
    );
    expect(projection.evidence.connectorEventCount).toBe(0);
    expect(projection.branches.application.composition).toBe(
      STORY_SCORE_COMPOSITIONS.application,
    );
    expect(projection.branches.application.path.segmentCount).toBeGreaterThan(
      buildStoryScoreProjection("horizontal-enhanced", {
        viewportHeight: 900,
        viewportWidth: 1_536,
      }).branches.application.path.segmentCount,
    );
    Array.from(
      { length: projection.branches.application.path.segmentCount + 1 },
      (_, index) =>
        projection.branches.application.path.pointAt(
          index / projection.branches.application.path.segmentCount,
        ),
    ).forEach(({ x, y }) => {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    });

  });

  it("projects every responsive mode from the same two semantic compositions", () => {
    const projections = STORY_SCORE_PROJECTION_MODES.map((mode) =>
      buildStoryScoreProjection(mode, {
        viewportHeight: 900,
        viewportWidth: mode === "vertical-compact" ? 390 : 1440,
      }),
    );

    for (const branch of STORY_SCORE_BRANCHES) {
      for (const projection of projections) {
        expect(projection.branches[branch].composition).toBe(
          STORY_SCORE_COMPOSITIONS[branch],
        );
      }
    }
    expect(storyScoreCompositionDiagnostics().composerInvocationCount).toBe(2);
  });

  it("fails safe across the transient horizontal-to-compact resize handoff", () => {
    const transient = buildStoryScoreProjection("horizontal-enhanced", {
      viewportHeight: 900,
      viewportWidth: 700,
    });
    const settled = buildStoryScoreProjection("vertical-compact", {
      viewportHeight: 900,
      viewportWidth: 700,
    });

    expect(transient.resolvedGeometryMode).toBe("horizontal-enhanced");
    expect(transient.evidence.pathSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(settled.resolvedGeometryMode).toBe("vertical-compact");
    expect(settled.branches.professional.composition).toBe(
      transient.branches.professional.composition,
    );
    expect(settled.branches.application.composition).toBe(
      transient.branches.application.composition,
    );
  });

  it("fails safe across the Firefox effective-zoom vertical-wide handoff", () => {
    const transient = buildStoryScoreProjection("horizontal-enhanced", {
      viewportHeight: 450,
      viewportWidth: 768,
    });
    const projection = buildStoryScoreProjection("vertical-wide", {
      viewportHeight: 450,
      viewportWidth: 768,
    });

    expect(transient.evidence.pathSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(transient.evidence.staffLineSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(projection.evidence.pathSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
    expect(projection.evidence.staffLineSelfIntersections).toEqual({
      application: 0,
      professional: 0,
    });
  });

  it.each([
    [1_100, 640],
    [1_100, 800],
    [1_280, 720],
    [1_366, 768],
    [1_440, 900],
    [1_920, 1_080],
  ] as const)(
    "keeps horizontal geometry crossing-free at the %i×%i runtime boundary",
    (viewportWidth, viewportHeight) => {
      const projection = buildStoryScoreProjection("horizontal-enhanced", {
        viewportHeight,
        viewportWidth,
      });

      expect(projection.evidence.pathSelfIntersections).toEqual({
        application: 0,
        professional: 0,
      });
      expect(projection.evidence.staffLineSelfIntersections).toEqual({
        application: 0,
        professional: 0,
      });
    },
  );
});
