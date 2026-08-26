import { describe, expect, it } from "vitest";

import { CubicBezierScorePath } from "@/lib/music/geometry/cubic-bezier-score-path";
import { buildFinalBarline } from "@/lib/music/geometry/barlines";
import { placeAtStaffStep } from "@/lib/music/geometry/score-path";
import {
  buildResponsiveScoreProjection,
  APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
  projectSemanticSlotNoteTs,
  RESPONSIVE_SCORE_PRESENTATION_MODES,
  selectResponsiveScorePresentationMode,
  validateResponsiveScoreEventPlacement,
  zoneForResponsiveScoreT,
  type ResponsiveScorePresentationMode,
  type ResponsiveScoreNotationZone,
  type ResponsiveScoreModeSelectionContext,
  type ResponsiveScoreProjection,
  type ResponsiveScoreProjectionZone,
  type ResponsiveScoreProjectionZoneInput,
} from "@/lib/music/geometry/responsive-score-projection";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";

const SLOT_IDS = Object.freeze([
  "slot01",
  "slot02",
  "slot03",
  "slot04",
  "slot05",
  "slot06",
]);

function notationPath(
  start: { readonly x: number; readonly y: number },
  end: { readonly x: number; readonly y: number },
) {
  return new StraightScorePath(start, end, {
    at: 0.5,
    towardIncreasingPitch: { x: 0, y: -1 },
  });
}

function connectorPath(startY: number, endY: number) {
  return new CubicBezierScorePath(
    { x: 360, y: startY },
    { x: 408, y: startY },
    { x: 12, y: endY },
    { x: 60, y: endY },
    { at: 0, towardIncreasingPitch: { x: 0, y: -1 } },
  );
}

function isNotationZone(
  zone: ResponsiveScoreProjectionZone,
): zone is ResponsiveScoreNotationZone {
  return zone.kind === "notation-safe";
}

function verticalZones(): readonly ResponsiveScoreProjectionZoneInput[] {
  return Object.freeze([
    {
      id: "notation-origin",
      kind: "notation-safe",
      path: notationPath({ x: 60, y: 150 }, { x: 360, y: 150 }),
      weight: 1,
      purpose: "origin",
      contentRange: { start: 0.22, end: 0.82 },
      semanticSlotIds: SLOT_IDS.slice(0, 2),
    },
    {
      id: "connector-a",
      kind: "connector",
      path: connectorPath(150, 420),
      weight: 1.3,
    },
    {
      id: "notation-body",
      kind: "notation-safe",
      path: notationPath({ x: 60, y: 420 }, { x: 360, y: 420 }),
      weight: 1,
      purpose: "body",
      contentRange: { start: 0.12, end: 0.88 },
      semanticSlotIds: SLOT_IDS.slice(2, 4),
    },
    {
      id: "connector-b",
      kind: "connector",
      path: connectorPath(420, 690),
      weight: 1.3,
    },
    {
      id: "notation-terminal",
      kind: "notation-safe",
      path: notationPath({ x: 60, y: 690 }, { x: 360, y: 690 }),
      weight: 1,
      purpose: "terminal",
      contentRange: { start: 0.12, end: 0.76 },
      semanticSlotIds: SLOT_IDS.slice(4),
    },
  ]);
}

function buildProjection(
  mode: ResponsiveScorePresentationMode,
): ResponsiveScoreProjection {
  if (mode === "horizontal-enhanced") {
    return buildResponsiveScoreProjection({
      mode,
      maxNotationTangentAngleDeg: APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
      semanticSlotIds: SLOT_IDS,
      zones: [
        {
          id: "notation-origin-terminal",
          kind: "notation-safe",
          path: notationPath({ x: 40, y: 140 }, { x: 1240, y: 140 }),
          weight: 1,
          purpose: "origin-terminal",
          contentRange: { start: 0.12, end: 0.9 },
          semanticSlotIds: SLOT_IDS,
        },
      ],
      trebleClef: { zoneId: "notation-origin-terminal", localT: 0.04 },
      keySignature: {
        fifths: 3,
        zoneId: "notation-origin-terminal",
        localT: 0.08,
      },
      ordinaryBarlines: [
        {
          id: "ordinary",
          zoneId: "notation-origin-terminal",
          localT: 0.92,
        },
      ],
      finalBarline: {
        zoneId: "notation-origin-terminal",
        localT: 0.96,
      },
    });
  }

  return buildResponsiveScoreProjection({
    mode,
    maxNotationTangentAngleDeg: APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
    semanticSlotIds: SLOT_IDS,
    zones: verticalZones(),
    trebleClef: { zoneId: "notation-origin", localT: 0.06 },
    keySignature: {
      fifths: 3,
      zoneId: "notation-origin",
      localT: 0.12,
    },
    ordinaryBarlines: [
      {
        id: "ordinary",
        zoneId: "notation-terminal",
        localT: 0.84,
      },
    ],
    finalBarline: { zoneId: "notation-terminal", localT: 0.94 },
  });
}

describe("responsive ScorePath projection", () => {
  it("supports all four modes without selecting from viewport width alone", () => {
    const inspectedContexts: ResponsiveScoreModeSelectionContext[] = [];
    const classifyCapacity = (
      context: ResponsiveScoreModeSelectionContext,
    ) => {
      inspectedContexts.push(context);

      if (context.pointerCapability !== "fine") {
        return "vertical-wide" as const;
      }

      if (context.viewportWidth < 500) return "vertical-compact" as const;

      return context.viewportWidth >= 900 && context.viewportHeight >= 700
        ? ("horizontal-enhanced" as const)
        : ("vertical-wide" as const);
    };

    expect(RESPONSIVE_SCORE_PRESENTATION_MODES).toEqual([
      "horizontal-enhanced",
      "vertical-wide",
      "vertical-compact",
      "static",
    ]);

    expect(
      selectResponsiveScorePresentationMode(
        {
          pointerCapability: "fine",
          prefersReducedMotion: false,
          viewportHeight: 900,
          viewportWidth: 1024,
        },
        classifyCapacity,
      ),
    ).toBe("horizontal-enhanced");
    expect(
      selectResponsiveScorePresentationMode(
        {
          pointerCapability: "fine",
          prefersReducedMotion: false,
          viewportHeight: 320,
          viewportWidth: 1024,
        },
        classifyCapacity,
      ),
    ).toBe("vertical-wide");
    expect(
      selectResponsiveScorePresentationMode(
        {
          pointerCapability: "coarse",
          prefersReducedMotion: false,
          viewportHeight: 640,
          viewportWidth: 1024,
        },
        classifyCapacity,
      ),
    ).toBe("vertical-wide");
    expect(
      selectResponsiveScorePresentationMode(
        {
          pointerCapability: "fine",
          prefersReducedMotion: false,
          viewportHeight: 844,
          viewportWidth: 390,
        },
        classifyCapacity,
      ),
    ).toBe("vertical-compact");
    expect(
      selectResponsiveScorePresentationMode(
        {
          pointerCapability: "coarse",
          prefersReducedMotion: true,
          viewportHeight: 844,
          viewportWidth: 390,
        },
        () => {
          throw new Error("Reduced motion must bypass capacity classification");
        },
      ),
    ).toBe("static");
    expect(inspectedContexts).toEqual([
      {
        pointerCapability: "fine",
        prefersReducedMotion: false,
        viewportHeight: 900,
        viewportWidth: 1024,
      },
      {
        pointerCapability: "fine",
        prefersReducedMotion: false,
        viewportHeight: 320,
        viewportWidth: 1024,
      },
      {
        pointerCapability: "coarse",
        prefersReducedMotion: false,
        viewportHeight: 640,
        viewportWidth: 1024,
      },
      {
        pointerCapability: "fine",
        prefersReducedMotion: false,
        viewportHeight: 844,
        viewportWidth: 390,
      },
    ]);
  });

  it("keeps vertical document flow separate from conventional engraving orientation", () => {
    const projection = buildProjection("vertical-compact");
    const notationZones = projection.zones.filter(isNotationZone);
    const connectorZones = projection.zones.filter(
      ({ kind }) => kind === "connector",
    );

    expect(projection.maxNotationTangentAngleDeg).toBe(18);
    expect(notationZones).toHaveLength(3);
    expect(connectorZones).toHaveLength(2);
    expect(
      notationZones.every(
        ({ maximumTangentAngleDeg, path }) =>
          maximumTangentAngleDeg <= 18 &&
          path.tangentAt(0.5).x > 0,
      ),
    ).toBe(true);
    expect(
      connectorZones.some(({ path }) =>
        [0.25, 0.5, 0.75].some(
          (t) => Math.abs(path.tangentAt(t).y) > 0.5,
        ),
      ),
    ).toBe(true);
    expect(
      projection.zones.map(({ path }, index, zones) => {
        const next = zones[index + 1];
        return next ? [path.pointAt(1), next.path.pointAt(0)] : null;
      }),
    ).toEqual([
      [{ x: 360, y: 150 }, { x: 360, y: 150 }],
      [{ x: 60, y: 420 }, { x: 60, y: 420 }],
      [{ x: 360, y: 420 }, { x: 360, y: 420 }],
      [{ x: 60, y: 690 }, { x: 60, y: 690 }],
      null,
    ]);
  });

  it("places every semantic slot once, in order, and never inside connectors", () => {
    const projection = buildProjection("vertical-compact");

    expect(projection.semanticSlotIds).toEqual(SLOT_IDS);
    expect(projection.slots.map(({ slotId }) => slotId)).toEqual(SLOT_IDS);

    for (const slot of projection.slots) {
      const noteTs = projectSemanticSlotNoteTs(projection, slot.slotId, 4);

      expect(noteTs).toHaveLength(4);
      expect(
        noteTs.every(
          (t) => zoneForResponsiveScoreT(projection, t).kind === "notation-safe",
        ),
      ).toBe(true);
    }
    expect(
      projection.zones
        .filter(({ kind }) => kind === "connector")
        .every((zone) => !("semanticSlotIds" in zone)),
    ).toBe(true);

    const connector = projection.zones.find(
      ({ kind }) => kind === "connector",
    );

    expect(connector).toBeDefined();
    if (connector) {
      const connectorT =
        (connector.globalRange.start + connector.globalRange.end) / 2;

      expect(() =>
        validateResponsiveScoreEventPlacement(
          projection,
          connectorT,
          "test event",
        ),
      ).toThrow(/cannot occupy connector zone/);
    }
  });

  it("keeps key signatures and ordinary barlines in notation-safe zones", () => {
    for (const mode of RESPONSIVE_SCORE_PRESENTATION_MODES) {
      const projection = buildProjection(mode);

      expect(projection.keySignature?.fifths).toBe(3);
      expect(projection.keySignature?.t).toBeGreaterThan(
        projection.trebleClef.t,
      );
      expect(projection.keySignature?.t).toBeLessThan(
        projection.slots[0]?.range.start ?? Number.NEGATIVE_INFINITY,
      );
      expect(projection.ordinaryBarlines).toHaveLength(1);

      if (projection.keySignature) {
        expect(
          validateResponsiveScoreEventPlacement(
            projection,
            projection.keySignature.t,
            "key signature",
          ).kind,
        ).toBe("notation-safe");
      }

      for (const barline of projection.ordinaryBarlines) {
        expect(
          validateResponsiveScoreEventPlacement(
            projection,
            barline.t,
            "ordinary barline",
          ).kind,
        ).toBe("notation-safe");
      }
    }
  });

  it("remaps geometry while preserving semantic slots and ordering", () => {
    const horizontal = buildProjection("horizontal-enhanced");
    const verticalWide = buildProjection("vertical-wide");
    const verticalCompact = buildProjection("vertical-compact");
    const staticProjection = buildProjection("static");

    for (const projection of [
      verticalWide,
      verticalCompact,
      staticProjection,
    ]) {
      expect(projection.semanticSlotIds).toEqual(horizontal.semanticSlotIds);
      expect(projection.slots.map(({ slotId }) => slotId)).toEqual(
        horizontal.slots.map(({ slotId }) => slotId),
      );
    }

    expect(
      verticalCompact.path.pointAt(
        projectSemanticSlotNoteTs(verticalCompact, "slot05", 1)[0]!,
      ),
    ).not.toEqual(
      horizontal.path.pointAt(
        projectSemanticSlotNoteTs(horizontal, "slot05", 1)[0]!,
      ),
    );
  });

  it("keeps the clef frame upright and the terminal final barline conventional", () => {
    const projection = buildProjection("vertical-compact");
    const clefTangent = projection.path.tangentAt(projection.trebleClef.t);
    const clefNormal = projection.path.normalAt(projection.trebleClef.t);
    const finalTangent = projection.path.tangentAt(
      projection.finalBarline.t,
    );
    const final = buildFinalBarline({
      gapInStaffSpaces: 0.3,
      path: projection.path,
      staffSpace: 16,
      t: projection.finalBarline.t,
      thickThicknessInStaffSpaces: 0.28,
      thinThicknessInStaffSpaces: 0.11,
    });

    expect(clefTangent).toEqual({ x: 1, y: 0 });
    expect(clefNormal).toEqual({ x: 0, y: -1 });
    expect(finalTangent).toEqual({ x: 1, y: 0 });
    expect(final.strokes.map(({ center }) => center.y)).toEqual([
      final.strokes[0].center.y,
      final.strokes[0].center.y,
    ]);
    expect(final.strokes[1].center.x).toBeGreaterThan(
      final.strokes[0].center.x,
    );
    expect(
      final.strokes.every(
        ({ start, end }) => start.x === end.x && start.y > end.y,
      ),
    ).toBe(true);
  });

  it("preserves pitch-increasing normal semantics in every mode", () => {
    for (const mode of RESPONSIVE_SCORE_PRESENTATION_MODES) {
      const projection = buildProjection(mode);
      const t = projectSemanticSlotNoteTs(projection, "slot02", 1)[0]!;
      const middle = projection.path.pointAt(t);
      const low = placeAtStaffStep(projection.path, t, 0, 16);
      const high = placeAtStaffStep(projection.path, t, 8, 16);

      expect(middle.y).toBeGreaterThan(high.y);
      expect(middle.y).toBeLessThan(low.y);
    }
  });

  it("rejects vertical or right-to-left notation zones instead of rotating glyphs", () => {
    const unsafePath = new StraightScorePath(
      { x: 100, y: 40 },
      { x: 100, y: 500 },
      { at: 0.5, towardIncreasingPitch: { x: -1, y: 0 } },
    );
    const reversedPath = notationPath(
      { x: 360, y: 140 },
      { x: 40, y: 140 },
    );
    const inputFor = (path: StraightScorePath) => ({
      mode: "vertical-compact" as const,
      maxNotationTangentAngleDeg: 18,
      semanticSlotIds: ["slot01"],
      zones: [
        {
          id: "only",
          kind: "notation-safe" as const,
          path,
          weight: 1,
          purpose: "origin-terminal" as const,
          contentRange: { start: 0.2, end: 0.8 },
          semanticSlotIds: ["slot01"],
        },
      ],
      trebleClef: { zoneId: "only", localT: 0.05 },
      finalBarline: { zoneId: "only", localT: 0.95 },
    });

    expect(() => buildResponsiveScoreProjection(inputFor(unsafePath))).toThrow(
      /left-to-right/,
    );
    expect(() => buildResponsiveScoreProjection(inputFor(reversedPath))).toThrow(
      /left-to-right/,
    );

    const overLimitRadians = (19 * Math.PI) / 180;
    const overLimitPath = notationPath(
      { x: 40, y: 140 },
      {
        x: 360,
        y: 140 + Math.tan(overLimitRadians) * 320,
      },
    );

    expect(() => buildResponsiveScoreProjection(inputFor(overLimitPath))).toThrow(
      /exceeds maxNotationTangentAngleDeg/,
    );
  });
});
