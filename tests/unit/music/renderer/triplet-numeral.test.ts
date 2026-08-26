import { describe, expect, it } from "vitest";

import { APPROVED_RENDERER_TOKENS } from "@/app/%5F_visual-lab/music/_fixtures/draft-calibration";
import { CubicBezierScorePath } from "@/lib/music/geometry/cubic-bezier-score-path";
import {
  frameAt,
  placeAtStaffStep,
} from "@/lib/music/geometry/score-path";
import { resolveBeamGroupStemDirection } from "@/lib/music/geometry/stems";
import type {
  ScorePath,
  StemDirection,
  Vec2,
} from "@/lib/music/geometry/types";
import {
  addVectors,
  distanceBetween,
  dotVectors,
  leftNormal,
  scaleVector,
  subtractVectors,
} from "@/lib/music/geometry/vectors";
import { buildMotifModel } from "@/lib/music/renderer/build-motif-model";
import type {
  BuildMotifModelInput,
  TupletRenderPrimitive,
} from "@/lib/music/renderer/types";

import {
  composedMotif,
  downStemBeamLayout,
  noteTs,
  TEST_CALIBRATION,
  TEST_PATH,
  TEST_STAFF_SPACE,
  TEST_TOKENS,
  upStemBeamLayout,
} from "./fixtures";

const TEST_PATH_CASES = [
  { id: "straight", path: TEST_PATH },
  {
    id: "gentle-arc",
    path: new CubicBezierScorePath(
      { x: 0, y: 0 },
      { x: 28, y: -10 },
      { x: 72, y: -4 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    ),
  },
  {
    id: "gentle-s",
    path: new CubicBezierScorePath(
      { x: 0, y: 0 },
      { x: 28, y: -8 },
      { x: 72, y: 8 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    ),
  },
] as const;

const PATH_DIRECTION_CASES = TEST_PATH_CASES.flatMap(({ id, path }) =>
  (["up", "down"] as const).map((stemDirection) => ({
    id,
    path,
    stemDirection,
  })),
);

function crossVectors(left: Vec2, right: Vec2): number {
  return left.x * right.y - left.y * right.x;
}

function averagePoints(points: readonly Vec2[]): Vec2 {
  const sum = points.reduce(
    (total, point) => ({
      x: total.x + point.x,
      y: total.y + point.y,
    }),
    { x: 0, y: 0 },
  );

  return scaleVector(sum, 1 / points.length);
}

function noteheadStemAttachment(
  path: ScorePath,
  t: number,
  staffStep: number,
  direction: StemDirection,
): Vec2 {
  const calibration = TEST_CALIBRATION["wf-music-notehead-filled"];
  const frame = frameAt(path, t);
  const center = placeAtStaffStep(
    path,
    t,
    staffStep,
    TEST_STAFF_SPACE,
  );
  const requestedAnchor =
    direction === "up"
      ? calibration.anchors.stemUp
      : calibration.anchors.stemDown;
  const alignedAnchor = calibration.anchors.opticalCenter;
  const localX =
    (requestedAnchor.x - alignedAnchor.x) *
    calibration.nominalWidthSp *
    TEST_STAFF_SPACE;
  const localY =
    -(requestedAnchor.y - alignedAnchor.y) *
    calibration.nominalHeightSp *
    TEST_STAFF_SPACE;

  return addVectors(
    center,
    addVectors(
      scaleVector(frame.tangent, localX),
      scaleVector(frame.normal, localY),
    ),
  );
}

function resolveBeamLayout(
  path: ScorePath,
  ts: readonly number[],
  staffSteps: readonly number[],
  direction: StemDirection,
): NonNullable<BuildMotifModelInput["beamLayout"]> {
  const firstT = ts[0];
  const lastT = ts.at(-1);

  if (firstT === undefined || lastT === undefined) {
    throw new RangeError("Triplet test requires note positions");
  }

  const stemAttachments = staffSteps.map((staffStep, index) =>
    noteheadStemAttachment(
      path,
      ts[index] ?? Number.NaN,
      staffStep,
      direction,
    ),
  );
  const beamFrame = frameAt(path, (firstT + lastT) / 2);
  const axisDirection = beamFrame.tangent;
  const directionSign = direction === "up" ? 1 : -1;
  const stemReach =
    TEST_TOKENS.note.stemLengthSp * TEST_STAFF_SPACE;
  const attachmentCenter = averagePoints(stemAttachments);

  for (let multiplier = 1; multiplier <= 32; multiplier += 1) {
    const beamReference = addVectors(
      attachmentCenter,
      scaleVector(
        beamFrame.normal,
        directionSign * stemReach * multiplier,
      ),
    );
    const intersections = stemAttachments.map((attachment, index) => {
      const noteT = ts[index];

      if (noteT === undefined) {
        throw new RangeError("Triplet test positions must align");
      }

      const noteNormal = frameAt(path, noteT).normal;
      const denominator = crossVectors(noteNormal, axisDirection);
      const deltaToReference = subtractVectors(beamReference, attachment);
      const stemLength =
        crossVectors(deltaToReference, axisDirection) / denominator;

      return {
        directedLength: stemLength * directionSign,
        end: addVectors(
          attachment,
          scaleVector(noteNormal, stemLength),
        ),
      };
    });
    const progresses = intersections.map(({ end }) =>
      dotVectors(subtractVectors(end, beamReference), axisDirection),
    );

    if (
      intersections.every(({ directedLength }) => directedLength > 1e-7) &&
      progresses.every(
        (progress, index) =>
          index === 0 ||
          progress > (progresses[index - 1] ?? Number.NaN) + 1e-7,
      )
    ) {
      return {
        axisDirection,
        primaryAttachments: intersections.map(({ end }) => end),
        secondaryOffsetDirection: scaleVector(
          beamFrame.normal,
          -directionSign,
        ),
      };
    }
  }

  throw new RangeError("Unable to resolve curved triplet test beam");
}

function tupletLayoutForBeam(
  beamLayout: NonNullable<BuildMotifModelInput["beamLayout"]>,
  offsetY: number,
): NonNullable<BuildMotifModelInput["tupletLayout"]> {
  const first = beamLayout.primaryAttachments[0];
  const last = beamLayout.primaryAttachments.at(-1);

  if (!first || !last) {
    throw new RangeError("Triplet test layout requires beam endpoints");
  }

  const bracketStart = { x: first.x, y: first.y + offsetY };
  const bracketEnd = { x: last.x, y: last.y + offsetY };

  return {
    bracketStart,
    bracketEnd,
    endCapDirection: { x: 0, y: offsetY < 0 ? 1 : -1 },
    labelPosition: {
      x: (bracketStart.x + bracketEnd.x) / 2,
      y: (bracketStart.y + bracketEnd.y) / 2,
    },
  };
}

function straightTriplet(stemDirection: "down" | "up") {
  const ts = noteTs(3);
  const beamLayout =
    stemDirection === "up"
      ? upStemBeamLayout(ts)
      : downStemBeamLayout(ts);

  return buildMotifModel({
    calibration: TEST_CALIBRATION,
    motif: composedMotif(
      "E8_TRIPLET_3",
      stemDirection === "up" ? [0, 1, 2] : [6, 7, 8],
    ),
    noteTs: ts,
    path: TEST_PATH,
    staffSpace: TEST_STAFF_SPACE,
    beamLayout,
    tupletLayout: tupletLayoutForBeam(
      beamLayout,
      stemDirection === "up" ? -10 : 10,
    ),
    tokens: {
      beam: TEST_TOKENS.beam,
      note: TEST_TOKENS.note,
      tuplet: TEST_TOKENS.tuplet,
    },
  });
}

function pathTriplet(
  path: ScorePath,
  stemDirection: "down" | "up",
) {
  const ts = noteTs(3);
  const staffSteps = stemDirection === "up" ? [0, 1, 2] : [6, 7, 8];
  const resolvedDirection = resolveBeamGroupStemDirection(staffSteps);
  const beamLayout = resolveBeamLayout(
    path,
    ts,
    staffSteps,
    resolvedDirection,
  );
  const first = beamLayout.primaryAttachments[0];
  const last = beamLayout.primaryAttachments.at(-1);

  if (!first || !last) {
    throw new RangeError("Triplet test requires beam endpoints");
  }

  const towardGroup = beamLayout.secondaryOffsetDirection;
  const awayFromGroup = scaleVector(towardGroup, -1);
  const bracketOffset = scaleVector(
    awayFromGroup,
    (TEST_TOKENS.tuplet.bracketClearanceSp + 1e-9) *
      TEST_STAFF_SPACE,
  );
  const bracketStart = addVectors(first, bracketOffset);
  const bracketEnd = addVectors(last, bracketOffset);

  return {
    beamLayout,
    result: buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif: composedMotif("E8_TRIPLET_3", staffSteps),
      noteTs: ts,
      path,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout,
      tupletLayout: {
        bracketStart,
        bracketEnd,
        endCapDirection: towardGroup,
        labelPosition: scaleVector(
          addVectors(bracketStart, bracketEnd),
          0.5,
        ),
      },
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    }),
  };
}

function expectSplitNumeralGeometry(tuplet: TupletRenderPrimitive): void {
  const [before, after, startCap, endCap] = tuplet.bracket;

  expect(tuplet.label).toBe("3");
  expect(tuplet.numeralWidth).toBe(tuplet.numeralSize);
  expect(Number.isFinite(tuplet.numeralRotationRadians)).toBe(true);
  expect(tuplet.centralGap).toBe(
    tuplet.numeralWidth + 2 * tuplet.numeralSideGap,
  );
  expect(tuplet.bracket.map(({ role }) => role)).toEqual([
    "span-before-numeral",
    "span-after-numeral",
    "end-cap-start",
    "end-cap-end",
  ]);
  expect(before).toBeDefined();
  expect(after).toBeDefined();
  expect(startCap).toBeDefined();
  expect(endCap).toBeDefined();

  if (!before || !after || !startCap || !endCap) return;

  const completeGroupSpan = distanceBetween(
    startCap.start,
    endCap.start,
  );

  expect(distanceBetween(before.end, after.start)).toBeCloseTo(
    tuplet.centralGap,
    10,
  );
  expect(tuplet.labelPosition.x).toBeCloseTo(
    (startCap.start.x + endCap.start.x) / 2,
    10,
  );
  expect(tuplet.labelPosition.y).toBeCloseTo(
    (startCap.start.y + endCap.start.y) / 2,
    10,
  );
  expect(distanceBetween(startCap.start, tuplet.labelPosition)).toBeCloseTo(
    completeGroupSpan / 2,
    10,
  );
  expect(distanceBetween(tuplet.labelPosition, endCap.start)).toBeCloseTo(
    completeGroupSpan / 2,
    10,
  );
  expect(
    distanceBetween(before.start, before.end) +
      tuplet.centralGap +
      distanceBetween(after.start, after.end),
  ).toBeCloseTo(completeGroupSpan, 10);
  expect(distanceBetween(before.end, tuplet.labelPosition)).toBeCloseTo(
    tuplet.numeralWidth / 2 + tuplet.numeralSideGap,
    10,
  );
  expect(distanceBetween(tuplet.labelPosition, after.start)).toBeCloseTo(
    tuplet.numeralWidth / 2 + tuplet.numeralSideGap,
    10,
  );
}

function expectCompleteGroupExteriorGeometry(
  tuplet: TupletRenderPrimitive,
  beamLayout: NonNullable<BuildMotifModelInput["beamLayout"]>,
): void {
  const firstBeamPoint = beamLayout.primaryAttachments[0];
  const lastBeamPoint = beamLayout.primaryAttachments.at(-1);
  const startCap = tuplet.bracket.find(
    ({ role }) => role === "end-cap-start",
  );
  const endCap = tuplet.bracket.find(
    ({ role }) => role === "end-cap-end",
  );

  expect(firstBeamPoint).toBeDefined();
  expect(lastBeamPoint).toBeDefined();
  expect(startCap).toBeDefined();
  expect(endCap).toBeDefined();

  if (!firstBeamPoint || !lastBeamPoint || !startCap || !endCap) return;

  const beamAxis = beamLayout.axisDirection;
  const beamNormal = leftNormal(beamAxis);
  const numeralAxis = {
    x: Math.cos(tuplet.numeralRotationRadians),
    y: Math.sin(tuplet.numeralRotationRadians),
  };
  const startOffset = subtractVectors(startCap.start, firstBeamPoint);
  const endOffset = subtractVectors(endCap.start, lastBeamPoint);
  const exteriorSign = Math.sign(dotVectors(startOffset, beamNormal));
  const beamMidpoint = scaleVector(
    addVectors(firstBeamPoint, lastBeamPoint),
    0.5,
  );

  expect(dotVectors(startOffset, beamAxis)).toBeCloseTo(0, 10);
  expect(dotVectors(endOffset, beamAxis)).toBeCloseTo(0, 10);
  expect(Math.abs(dotVectors(numeralAxis, beamAxis))).toBeCloseTo(1, 10);
  expect(distanceBetween(startCap.start, endCap.start)).toBeCloseTo(
    distanceBetween(firstBeamPoint, lastBeamPoint),
    10,
  );
  expect(
    dotVectors(subtractVectors(tuplet.labelPosition, beamMidpoint), beamAxis),
  ).toBeCloseTo(0, 10);
  expect(Math.sign(dotVectors(endOffset, beamNormal))).toBe(exteriorSign);

  for (const [cap, beamPoint] of [
    [startCap, firstBeamPoint],
    [endCap, lastBeamPoint],
  ] as const) {
    const capVector = subtractVectors(cap.end, cap.start);
    const capEndClearance =
      dotVectors(subtractVectors(cap.end, beamPoint), beamNormal) *
      exteriorSign;

    expect(dotVectors(capVector, beamAxis)).toBeCloseTo(0, 10);
    expect(dotVectors(capVector, beamNormal) * exteriorSign).toBeLessThan(0);
    expect(capEndClearance).toBeGreaterThan(0);
  }
}

describe("triplet numeral legibility", () => {
  it("keeps the final named numeral candidate and preserved tokens explicit", () => {
    expect(APPROVED_RENDERER_TOKENS.tuplet).toMatchObject({
      bracketClearanceSp: 0.65,
      bracketEndCapSp: 0.3,
      bracketThicknessSp: 0.07,
      tupletNumeralSizeSp: 0.85,
      tupletNumeralSideGapSp: 0.18,
    });
  });

  it.each(["up", "down"] as const)(
    "splits a straight %s-stem bracket around the full-span-centered 3",
    (stemDirection) => {
      const result = straightTriplet(stemDirection);

      expect(result.notes.map(({ stemDirection: value }) => value)).toEqual([
        stemDirection,
        stemDirection,
        stemDirection,
      ]);
      expect(result.tuplet).toBeDefined();
      expect(result.tuplet?.numeralSize).toBe(
        TEST_TOKENS.tuplet.tupletNumeralSizeSp * TEST_STAFF_SPACE,
      );
      expect(result.tuplet?.numeralSideGap).toBe(
        TEST_TOKENS.tuplet.tupletNumeralSideGapSp * TEST_STAFF_SPACE,
      );
      expectSplitNumeralGeometry(result.tuplet!);
    },
  );

  it.each(PATH_DIRECTION_CASES)(
    "preserves complete-group exterior geometry on $id with $stemDirection stems",
    ({ id, path, stemDirection }) => {
      const { beamLayout, result } = pathTriplet(path, stemDirection);
      const tuplet = result.tuplet;

      expect(result.notes.map(({ stemDirection: value }) => value)).toEqual([
        stemDirection,
        stemDirection,
        stemDirection,
      ]);
      expect(tuplet).toBeDefined();

      if (tuplet) {
        expectSplitNumeralGeometry(tuplet);
        expectCompleteGroupExteriorGeometry(tuplet, beamLayout);
        if (id === "straight") {
          expect(tuplet.numeralRotationRadians).toBeCloseTo(0, 10);
        } else {
          expect(Math.abs(tuplet.numeralRotationRadians)).toBeGreaterThan(0);
        }
      }
    },
  );

  it("rejects a bracket span that cannot contain the numeral gap", () => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: tupletLayoutForBeam(beamLayout, -10),
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: {
            ...TEST_TOKENS.tuplet,
            tupletNumeralSizeSp: 5,
          },
        },
      }),
    ).toThrow(/exceed the numeral central gap/);
  });

  it("rejects a bracket shifted away from the complete group span", () => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);
    const layout = tupletLayoutForBeam(beamLayout, -10);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: {
          ...layout,
          bracketStart: {
            x: layout.bracketStart.x + 2,
            y: layout.bracketStart.y,
          },
          bracketEnd: {
            x: layout.bracketEnd.x + 2,
            y: layout.bracketEnd.y,
          },
          labelPosition: {
            x: layout.labelPosition.x + 2,
            y: layout.labelPosition.y,
          },
        },
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/complete beam-group span/);
  });

  it("rejects a bracket that crosses to the opposite signed beam side", () => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);
    const first = beamLayout.primaryAttachments[0]!;
    const last = beamLayout.primaryAttachments.at(-1)!;

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: {
          bracketStart: { x: first.x, y: first.y - 10 },
          bracketEnd: { x: last.x, y: last.y + 10 },
          endCapDirection: { x: 0, y: 1 },
          labelPosition: {
            x: (first.x + last.x) / 2,
            y: (first.y + last.y) / 2,
          },
        },
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/one signed exterior side/);
  });

  it.each([
    ["non-perpendicular", { x: 0.1, y: 1 }, /perpendicular/],
    ["away from group", { x: 0, y: -1 }, /point toward/],
  ] as const)("rejects %s end caps", (_, endCapDirection, expectedError) => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: {
          ...tupletLayoutForBeam(beamLayout, -10),
          endCapDirection,
        },
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(expectedError);
  });

  it("rejects an end cap whose full segment crosses the primary beam", () => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: tupletLayoutForBeam(beamLayout, -10),
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: {
            ...TEST_TOKENS.tuplet,
            bracketEndCapSp: 2,
          },
        },
      }),
    ).toThrow(/end caps.*external/);
  });

  it("rejects a numeral bounding box that would overlap the beam", () => {
    const motif = composedMotif("E8_TRIPLET_3", [0, 1, 2]);
    const ts = noteTs(3);
    const beamLayout = upStemBeamLayout(ts);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout,
        tupletLayout: tupletLayoutForBeam(beamLayout, -8),
        tokens: {
          beam: { ...TEST_TOKENS.beam, thicknessSp: 2 },
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/numeral bounding box.*external/);
  });
});
