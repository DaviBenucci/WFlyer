import { getMotifDefinition } from "../composer/motifs";
import {
  materializeBeamTopology,
  type BeamMotifId,
} from "../geometry/beams";
import { resolveBeamGroupStemDirection } from "../geometry/stems";
import {
  requirePositiveNumber,
  requireStaffSpace,
} from "../geometry/units";
import {
  addVectors,
  distanceBetween,
  dotVectors,
  leftNormal,
  normalizeVector,
  scaleVector,
  subtractVectors,
} from "../geometry/vectors";
import { buildNoteModel } from "./build-note-model";
import { wfPrimitiveId } from "./ids";
import { sortPrimitivesByPaintOrder } from "./paint-order";
import type {
  BeamRenderPrimitive,
  BuildMotifModelInput,
  MotifRenderModel,
  TupletRenderPrimitive,
} from "./types";

/** Absolute label-centering tolerance expressed in staff-space units. */
export const TUPLET_LABEL_CENTER_EPSILON_SP = 1e-7;
/** World-space group/alignment tolerance expressed in staff-space units. */
export const TUPLET_GROUP_ALIGNMENT_EPSILON_SP = 1e-7;
/** Unit-vector tolerance for keeping the bracket parallel to its beam group. */
export const TUPLET_BRACKET_PARALLEL_EPSILON = 1e-7;
/** Unit-vector tolerance for end caps perpendicular to the beam axis. */
export const TUPLET_END_CAP_PERPENDICULAR_EPSILON = 1e-7;
/** Unit-vector dot-product tolerance for a perpendicular secondary offset. */
export const BEAM_SECONDARY_PERPENDICULAR_EPSILON = 1e-7;

function arraysEqual<T>(
  left: readonly T[],
  right: readonly T[],
): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function validateSemanticMotif(input: BuildMotifModelInput): void {
  const definition = getMotifDefinition(input.motif.motifId);
  const canonicalDurations = input.motif.notes.map(({ duration }) => duration);
  const canonicalStaffSteps = input.motif.notes.map(
    ({ staffStep }) => staffStep,
  );

  if (!arraysEqual(canonicalDurations, definition.durations)) {
    throw new RangeError(
      `${input.motif.motifId} canonical notes do not match its whitelist durations`,
    );
  }

  if (
    input.motif.notes.length !== definition.durations.length ||
    input.noteTs.length !== definition.durations.length
  ) {
    throw new RangeError(
      `${input.motif.motifId} requires exactly ${definition.durations.length} note positions`,
    );
  }

  if (!arraysEqual(input.motif.durations, canonicalDurations)) {
    throw new RangeError(
      `${input.motif.motifId} durations compatibility array does not match canonical notes`,
    );
  }

  if (!arraysEqual(input.motif.staffSteps, canonicalStaffSteps)) {
    throw new RangeError(
      `${input.motif.motifId} staffSteps compatibility array does not match canonical notes`,
    );
  }

  if (input.motif.family !== definition.family) {
    throw new RangeError(
      `${input.motif.motifId} family does not match its whitelist definition`,
    );
  }

  if (input.motif.dense !== definition.dense) {
    throw new RangeError(
      `${input.motif.motifId} density does not match its whitelist definition`,
    );
  }

  if (definition.tuplet) {
    if (
      !input.motif.tuplet ||
      input.motif.tuplet.bracket !== true ||
      input.motif.tuplet.count !== 3 ||
      input.motif.tuplet.label !== "3" ||
      input.motif.tuplet.labelPosition !== "center"
    ) {
      throw new RangeError(
        "E8_TRIPLET_3 requires bracketed, centered triplet metadata",
      );
    }
  } else if (input.motif.tuplet !== undefined) {
    throw new RangeError("Only E8_TRIPLET_3 may carry tuplet metadata");
  }

  if (definition.primaryBeam !== (input.beamLayout !== undefined)) {
    throw new RangeError(
      definition.primaryBeam
        ? `${input.motif.motifId} requires an explicit beamLayout`
        : `${input.motif.motifId} must not provide a beamLayout`,
    );
  }

  if (
    input.beamLayout &&
    input.beamLayout.primaryAttachments.length !== input.motif.notes.length
  ) {
    throw new RangeError(
      `${input.motif.motifId} beamLayout requires exactly ${definition.durations.length} primary attachments`,
    );
  }

  if ((definition.tuplet !== undefined) !== (input.tupletLayout !== undefined)) {
    throw new RangeError(
      definition.tuplet
        ? "E8_TRIPLET_3 requires an explicit tupletLayout"
        : "Only E8_TRIPLET_3 may provide a tupletLayout",
    );
  }
}

function beamRole(
  kind: "hook" | "primary" | "secondary",
  direction?: "backward" | "forward",
): BeamRenderPrimitive["role"] {
  if (kind === "primary") {
    return "beam-primary";
  }

  if (kind === "secondary") {
    return "beam-secondary";
  }

  return direction === "forward"
    ? "beam-secondary-hook-left"
    : "beam-secondary-hook-right";
}

function uprightAxisRotationRadians(axis: {
  readonly x: number;
  readonly y: number;
}): number {
  let rotation = Math.atan2(axis.y, axis.x);

  if (rotation > Math.PI / 2) rotation -= Math.PI;
  if (rotation < -Math.PI / 2) rotation += Math.PI;

  return rotation;
}

function buildTuplet(
  input: BuildMotifModelInput,
  staffSpace: number,
): TupletRenderPrimitive | undefined {
  const layout = input.tupletLayout;

  if (!layout) {
    return undefined;
  }

  const thickness =
    requirePositiveNumber(
      input.tokens.tuplet.bracketThicknessSp,
      "bracketThicknessSp",
    ) * staffSpace;
  const endCapLength =
    requirePositiveNumber(
      input.tokens.tuplet.bracketEndCapSp,
      "bracketEndCapSp",
    ) * staffSpace;
  const minimumClearance =
    requirePositiveNumber(
      input.tokens.tuplet.bracketClearanceSp,
      "bracketClearanceSp",
    ) * staffSpace;
  const numeralSize =
    requirePositiveNumber(
      input.tokens.tuplet.tupletNumeralSizeSp,
      "tupletNumeralSizeSp",
    ) * staffSpace;
  const numeralSideGap =
    requirePositiveNumber(
      input.tokens.tuplet.tupletNumeralSideGapSp,
      "tupletNumeralSideGapSp",
    ) * staffSpace;
  // SVG textLength forces the rendered single-glyph width to this exact value.
  const numeralWidth = numeralSize;
  const centralGap = numeralWidth + 2 * numeralSideGap;
  const beamLayout = input.beamLayout;

  if (!beamLayout) {
    throw new RangeError("Tuplet placement requires its primary beam layout");
  }

  const firstBeamPoint = beamLayout.primaryAttachments[0];
  const lastBeamPoint = beamLayout.primaryAttachments.at(-1);

  if (!firstBeamPoint || !lastBeamPoint) {
    throw new RangeError("Tuplet placement requires beam attachment endpoints");
  }

  const beamAxis = normalizeVector(
    beamLayout.axisDirection,
    "tuplet beam axisDirection",
  );
  const beamNormal = leftNormal(beamAxis);
  const groupAlignmentTolerance =
    TUPLET_GROUP_ALIGNMENT_EPSILON_SP * staffSpace;
  const bracketAxis = normalizeVector(
    subtractVectors(layout.bracketEnd, layout.bracketStart),
    "tuplet bracket span",
  );

  const startOffset = subtractVectors(
    layout.bracketStart,
    firstBeamPoint,
  );
  const endOffset = subtractVectors(
    layout.bracketEnd,
    lastBeamPoint,
  );
  const startLongitudinalOffset = dotVectors(startOffset, beamAxis);
  const endLongitudinalOffset = dotVectors(endOffset, beamAxis);

  if (
    Math.abs(startLongitudinalOffset) > groupAlignmentTolerance ||
    Math.abs(endLongitudinalOffset) > groupAlignmentTolerance
  ) {
    throw new RangeError(
      "Tuplet bracket endpoints must align with the complete beam-group span",
    );
  }

  const startSignedClearance = dotVectors(startOffset, beamNormal);
  const endSignedClearance = dotVectors(endOffset, beamNormal);
  const exteriorSign = startSignedClearance > 0 ? 1 : -1;

  if (
    startSignedClearance * endSignedClearance <= 0 ||
    Math.abs(startSignedClearance - endSignedClearance) >
      groupAlignmentTolerance
  ) {
    throw new RangeError(
      "Tuplet bracket must remain on one signed exterior side of the primary beam",
    );
  }

  if (
    dotVectors(bracketAxis, beamAxis) <
    1 - TUPLET_BRACKET_PARALLEL_EPSILON
  ) {
    throw new RangeError(
      "Tuplet bracket must progress parallel to its primary beam axis",
    );
  }

  const startClearance = startSignedClearance * exteriorSign;
  const endClearance = endSignedClearance * exteriorSign;

  if (
    startClearance < minimumClearance - groupAlignmentTolerance ||
    endClearance < minimumClearance - groupAlignmentTolerance
  ) {
    throw new RangeError(
      "Tuplet bracket must satisfy bracketClearanceSp from the primary beam",
    );
  }

  const bracketMidpoint = scaleVector(
    addVectors(layout.bracketStart, layout.bracketEnd),
    0.5,
  );
  const bracketSpan = distanceBetween(
    layout.bracketStart,
    layout.bracketEnd,
  );
  const completeGroupSpan = distanceBetween(
    firstBeamPoint,
    lastBeamPoint,
  );

  if (
    Math.abs(bracketSpan - completeGroupSpan) >
    groupAlignmentTolerance
  ) {
    throw new RangeError(
      "Tuplet bracket must preserve the complete beam-group bounding span",
    );
  }

  if (centralGap >= bracketSpan - groupAlignmentTolerance) {
    throw new RangeError(
      "Tuplet bracket span must exceed the numeral central gap",
    );
  }

  const labelCenterTolerance =
    TUPLET_LABEL_CENTER_EPSILON_SP * staffSpace;

  if (
    distanceBetween(layout.labelPosition, bracketMidpoint) >
    labelCenterTolerance
  ) {
    throw new RangeError(
      "Triplet labelPosition must be centered between bracketStart and bracketEnd",
    );
  }

  const endCapDirection = normalizeVector(
    layout.endCapDirection,
    "tuplet endCapDirection",
  );

  if (
    Math.abs(dotVectors(endCapDirection, beamAxis)) >
    TUPLET_END_CAP_PERPENDICULAR_EPSILON
  ) {
    throw new RangeError(
      "Tuplet bracket end caps must be perpendicular to the primary beam",
    );
  }

  if (
    dotVectors(endCapDirection, beamNormal) * exteriorSign >=
    -1 + TUPLET_END_CAP_PERPENDICULAR_EPSILON
  ) {
    throw new RangeError(
      "Tuplet bracket end caps must point toward the primary beam group",
    );
  }

  const endCap = scaleVector(endCapDirection, endCapLength);
  const beamMidpoint = scaleVector(
    addVectors(firstBeamPoint, lastBeamPoint),
    0.5,
  );
  const numeralSignedClearance =
    dotVectors(
      subtractVectors(bracketMidpoint, beamMidpoint),
      beamNormal,
    ) * exteriorSign;
  const beamThickness =
    requirePositiveNumber(
      input.tokens.beam.thicknessSp,
      "beam.thicknessSp",
    ) * staffSpace;

  if (
    numeralSignedClearance <
    (numeralSize + beamThickness) / 2 - groupAlignmentTolerance
  ) {
    throw new RangeError(
      "Triplet numeral bounding box must remain external to the primary beam",
    );
  }

  const startCapEnd = addVectors(layout.bracketStart, endCap);
  const endCapEnd = addVectors(layout.bracketEnd, endCap);
  const minimumStrokeSeparation = (thickness + beamThickness) / 2;

  for (const [capEnd, beamPoint] of [
    [startCapEnd, firstBeamPoint],
    [endCapEnd, lastBeamPoint],
  ] as const) {
    const capClearance =
      dotVectors(subtractVectors(capEnd, beamPoint), beamNormal) *
      exteriorSign;

    if (
      capClearance <= 0 ||
      capClearance <
        minimumStrokeSeparation - groupAlignmentTolerance
    ) {
      throw new RangeError(
        "Tuplet bracket end caps must remain external to the primary beam",
      );
    }
  }

  const halfGapVector = scaleVector(bracketAxis, centralGap / 2);
  const beforeNumeralEnd = subtractVectors(
    bracketMidpoint,
    halfGapVector,
  );
  const afterNumeralStart = addVectors(
    bracketMidpoint,
    halfGapVector,
  );

  return {
    kind: "tuplet",
    id: wfPrimitiveId(input.motif.slotId, "tuplet"),
    layer: "annotations",
    role: "tuplet",
    label: "3",
    labelPosition: bracketMidpoint,
    numeralSize,
    numeralWidth,
    numeralSideGap,
    numeralRotationRadians: uprightAxisRotationRadians(bracketAxis),
    centralGap,
    bracket: [
      {
        role: "span-before-numeral",
        start: layout.bracketStart,
        end: beforeNumeralEnd,
      },
      {
        role: "span-after-numeral",
        start: afterNumeralStart,
        end: layout.bracketEnd,
      },
      {
        role: "end-cap-start",
        start: layout.bracketStart,
        end: startCapEnd,
      },
      {
        role: "end-cap-end",
        start: layout.bracketEnd,
        end: endCapEnd,
      },
    ],
    thickness,
  };
}

export function buildMotifModel(
  input: BuildMotifModelInput,
): MotifRenderModel {
  const staffSpace = requireStaffSpace(input.staffSpace);
  validateSemanticMotif(input);
  const definition = getMotifDefinition(input.motif.motifId);
  const stemDirection = definition.primaryBeam
    ? resolveBeamGroupStemDirection(
        input.motif.notes.map(({ staffStep }) => staffStep),
      )
    : undefined;
  const beamLayout = input.beamLayout;

  const notes = input.motif.notes.map((canonicalNote, index) => {
    const t = input.noteTs[index];

    if (t === undefined) {
      throw new RangeError("Motif note arrays are not aligned");
    }

    const beamEnd = beamLayout?.primaryAttachments[index];

    if (definition.primaryBeam && !beamEnd) {
      throw new RangeError("Motif beam attachments are not aligned");
    }

    return buildNoteModel({
      id: `${input.motif.slotId}:note:${index}`,
      beamed: definition.primaryBeam,
      calibration: input.calibration,
      duration: canonicalNote.duration,
      path: input.path,
      staffSpace,
      staffStep: canonicalNote.staffStep,
      t,
      tokens: input.tokens.note,
      ...(definition.primaryBeam && beamLayout && stemDirection && beamEnd
        ? {
            beamStem: {
              direction: stemDirection,
              end: beamEnd,
            },
          }
        : {}),
    });
  });

  let beams: readonly BeamRenderPrimitive[] = [];

  if (definition.primaryBeam && beamLayout) {
    const axisDirection = normalizeVector(
      beamLayout.axisDirection,
      "beam axisDirection",
    );
    const secondaryOffsetDirection = normalizeVector(
      beamLayout.secondaryOffsetDirection,
      "secondaryOffsetDirection",
    );

    if (
      Math.abs(dotVectors(axisDirection, secondaryOffsetDirection)) >
      BEAM_SECONDARY_PERPENDICULAR_EPSILON
    ) {
      throw new RangeError(
        "secondaryOffsetDirection must be perpendicular to beam axisDirection",
      );
    }

    const beamGeometry = materializeBeamTopology({
      axisDirection,
      hookLengthInStaffSpaces: input.tokens.beam.hookLengthSp,
      motifId: input.motif.motifId as BeamMotifId,
      primaryAttachments: beamLayout.primaryAttachments,
      primaryThicknessInStaffSpaces: input.tokens.beam.thicknessSp,
      secondaryOffsetInStaffSpaces: scaleVector(
        secondaryOffsetDirection,
        input.tokens.beam.secondaryGapSp,
      ),
      secondaryThicknessInStaffSpaces:
        input.tokens.beam.secondaryThicknessSp,
      staffSpace,
    });

    beams = beamGeometry.map((beam, index) => ({
      kind: "beam",
      id: wfPrimitiveId(input.motif.slotId, "beam", index),
      layer: "notes",
      role: beamRole(beam.kind, beam.direction),
      start: beam.start,
      end: beam.end,
      thickness: beam.thickness,
    }));
  }

  const tuplet = buildTuplet(input, staffSpace);
  const primitives = sortPrimitivesByPaintOrder([
    ...notes.flatMap((note) => note.primitives),
    ...beams,
    ...(tuplet ? [tuplet] : []),
  ]);

  return {
    id: input.motif.slotId,
    motifId: input.motif.motifId,
    notes,
    beams,
    ...(tuplet ? { tuplet } : {}),
    primitives,
  };
}
