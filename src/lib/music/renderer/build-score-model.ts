import { buildFinalBarline, buildOrdinaryBarline } from "../geometry/barlines";
import { buildTrebleKeySignature } from "../geometry/key-signatures";
import { frameAt, placeAtStaffStep } from "../geometry/score-path";
import { sampleStaffLines } from "../geometry/staff";
import {
  requireNonNegativeNumber,
  requireNormalizedPosition,
  requirePositiveNumber,
  requireStaffSpace,
} from "../geometry/units";
import { buildMotifModel } from "./build-motif-model";
import { glyphTransformForFrame } from "./glyph-frame";
import { wfPrimitiveId } from "./ids";
import { sortPrimitivesByPaintOrder } from "./paint-order";
import type {
  BuildScoreModelInput,
  GlyphRenderPrimitive,
  LineRenderPrimitive,
  PolylineRenderPrimitive,
  RenderLayer,
  RendererGlyphCalibrations,
  ScoreRenderModel,
} from "./types";

function requireGlyphCalibration(
  calibration: RendererGlyphCalibrations[keyof RendererGlyphCalibrations],
): void {
  requirePositiveNumber(calibration.nominalWidthSp, "nominalWidthSp");
  requirePositiveNumber(calibration.nominalHeightSp, "nominalHeightSp");

  for (const [name, point] of Object.entries(calibration.anchors)) {
    if (
      !point ||
      !Number.isFinite(point.x) ||
      !Number.isFinite(point.y) ||
      point.x < 0 ||
      point.x > 1 ||
      point.y < 0 ||
      point.y > 1
    ) {
      throw new RangeError(
        `${calibration.assetKey}.${name} must be inside the normalized viewBox`,
      );
    }
  }
}

function buildClef(
  input: BuildScoreModelInput,
): GlyphRenderPrimitive | undefined {
  if (!input.clef) {
    return undefined;
  }

  const staffSpace = requireStaffSpace(input.staffSpace);
  const calibration = input.calibration["wf-music-treble-clef"];
  requireGlyphCalibration(calibration);
  const frame = frameAt(input.path, input.clef.t);
  const transform = glyphTransformForFrame(frame);

  return {
    kind: "glyph",
    id: wfPrimitiveId(input.id, "clef"),
    layer: "structural",
    role: "clef",
    assetKey: calibration.assetKey,
    anchorTarget: placeAtStaffStep(
      input.path,
      input.clef.t,
      2,
      staffSpace,
    ),
    anchorInGlyph: calibration.anchors.gLine,
    width: calibration.nominalWidthSp * staffSpace,
    height: calibration.nominalHeightSp * staffSpace,
    ...transform,
  };
}

function buildKeySignature(
  input: BuildScoreModelInput,
): readonly GlyphRenderPrimitive[] {
  if (!input.keySignature || input.keySignature.fifths === 0) {
    return [];
  }

  const staffSpace = requireStaffSpace(input.staffSpace);
  const assetKey =
    input.keySignature.fifths > 0
      ? "wf-music-accidental-sharp"
      : "wf-music-accidental-flat";
  const calibration = input.calibration[assetKey];
  requireGlyphCalibration(calibration);
  const frame = frameAt(input.path, input.keySignature.t);
  const transform = glyphTransformForFrame(frame);
  const placements = buildTrebleKeySignature({
    accidentalWidthInStaffSpaces: calibration.nominalWidthSp,
    fifths: input.keySignature.fifths,
    gapInStaffSpaces: input.tokens.score.keySignatureGapSp,
    path: input.path,
    staffSpace,
    startOffsetInStaffSpaces:
      input.tokens.score.keySignatureStartOffsetSp,
    t: input.keySignature.t,
  });

  return placements.map((placement) => ({
    kind: "glyph",
    id: wfPrimitiveId(input.id, "key-signature", placement.index),
    layer: "structural",
    role: "key-signature",
    assetKey,
    anchorTarget: placement.pitchCenter,
    anchorInGlyph: calibration.anchors.pitchCenter,
    width: calibration.nominalWidthSp * staffSpace,
    height: calibration.nominalHeightSp * staffSpace,
    ...transform,
  }));
}

function buildBarlines(
  input: BuildScoreModelInput,
): readonly LineRenderPrimitive[] {
  const ordinary = (input.barlines ?? []).map((placement) => {
    const stroke = buildOrdinaryBarline({
      path: input.path,
      staffSpace: input.staffSpace,
      t: placement.t,
      thicknessInStaffSpaces: input.tokens.score.barlineThicknessSp,
    });

    return {
      kind: "line",
      id: wfPrimitiveId(input.id, "barline", placement.id),
      layer: "barlines",
      role: "barline",
      start: stroke.start,
      end: stroke.end,
      thickness: stroke.thickness,
    } satisfies LineRenderPrimitive;
  });

  if (!input.finalBarline) {
    return ordinary;
  }

  const final = buildFinalBarline({
    gapInStaffSpaces: input.tokens.score.finalBarlineGapSp,
    path: input.path,
    staffSpace: input.staffSpace,
    t: input.finalBarline.t,
    thickThicknessInStaffSpaces:
      input.tokens.score.finalBarlineThickThicknessSp,
    thinThicknessInStaffSpaces:
      input.tokens.score.finalBarlineThinThicknessSp,
  });
  const [thin, thick] = final.strokes;

  return [
    ...ordinary,
    {
      kind: "line",
      id: wfPrimitiveId(
        input.id,
        "final-barline",
        input.finalBarline.id,
        "thin",
      ),
      layer: "barlines",
      role: "final-barline-thin",
      start: thin.start,
      end: thin.end,
      thickness: thin.thickness,
    },
    {
      kind: "line",
      id: wfPrimitiveId(
        input.id,
        "final-barline",
        input.finalBarline.id,
        "thick",
      ),
      layer: "barlines",
      role: "final-barline-thick",
      start: thick.start,
      end: thick.end,
      thickness: thick.thickness,
    },
  ];
}

function validateScoreTokens(input: BuildScoreModelInput): void {
  requirePositiveNumber(
    input.tokens.score.staffLineThicknessSp,
    "staffLineThicknessSp",
  );
  requirePositiveNumber(
    input.tokens.score.barlineThicknessSp,
    "barlineThicknessSp",
  );
  requirePositiveNumber(
    input.tokens.score.finalBarlineThinThicknessSp,
    "finalBarlineThinThicknessSp",
  );
  requirePositiveNumber(
    input.tokens.score.finalBarlineThickThicknessSp,
    "finalBarlineThickThicknessSp",
  );
  requireNonNegativeNumber(
    input.tokens.score.finalBarlineGapSp,
    "finalBarlineGapSp",
  );
  requireNonNegativeNumber(
    input.tokens.score.keySignatureGapSp,
    "keySignatureGapSp",
  );
  requireNonNegativeNumber(
    input.tokens.score.keySignatureStartOffsetSp,
    "keySignatureStartOffsetSp",
  );
}

function requireUniqueIds(input: BuildScoreModelInput): void {
  const motifIds = input.motifs.map(({ motif }) => motif.slotId);
  const barlineIds = (input.barlines ?? []).map(({ id }) => id);

  if (new Set(motifIds).size !== motifIds.length) {
    throw new RangeError("Score motif slot IDs must be unique");
  }

  if (new Set(barlineIds).size !== barlineIds.length) {
    throw new RangeError("Score barline IDs must be unique");
  }
}

function validateStructuralOrder(input: BuildScoreModelInput): void {
  if (!input.keySignature) {
    return;
  }

  if (!input.clef) {
    throw new RangeError("keySignature requires a treble clef placement");
  }

  const clefT = requireNormalizedPosition(input.clef.t);
  const keySignatureT = requireNormalizedPosition(input.keySignature.t);

  if (clefT >= keySignatureT) {
    throw new RangeError("Score order must satisfy clef < keySignature");
  }

  const firstMotifT = Math.min(
    ...input.motifs.flatMap(({ noteTs }) => noteTs),
  );

  if (
    Number.isFinite(firstMotifT) &&
    keySignatureT >= requireNormalizedPosition(firstMotifT)
  ) {
    throw new RangeError(
      "Score order must satisfy keySignature < first motif note",
    );
  }
}

export function buildScoreModel(
  input: BuildScoreModelInput,
): ScoreRenderModel {
  const staffSpace = requireStaffSpace(input.staffSpace);
  validateScoreTokens(input);
  requireUniqueIds(input);
  validateStructuralOrder(input);
  const staffLines: readonly PolylineRenderPrimitive[] = sampleStaffLines(
    input.path,
    staffSpace,
    input.staffSampleCount,
  ).map((line) => ({
    kind: "polyline",
    id: wfPrimitiveId(input.id, "staff", line.staffStep),
    layer: "staff",
    role: "staff-line",
    points: line.points,
    thickness: input.tokens.score.staffLineThicknessSp * staffSpace,
  }));
  const clef = buildClef(input);
  const keySignature = buildKeySignature(input);
  const barlines = buildBarlines(input);
  const motifs = input.motifs.map((placement) =>
    buildMotifModel({
      calibration: input.calibration,
      motif: placement.motif,
      noteTs: placement.noteTs,
      path: input.path,
      staffSpace,
      tokens: {
        note: input.tokens.note,
        beam: input.tokens.beam,
        tuplet: input.tokens.tuplet,
      },
      ...(placement.beamLayout
        ? { beamLayout: placement.beamLayout }
        : {}),
      ...(placement.tupletLayout
        ? { tupletLayout: placement.tupletLayout }
        : {}),
    }),
  );
  const structuralPrimitives = [
    ...(clef ? [clef] : []),
    ...keySignature,
  ];
  const notePrimitives = sortPrimitivesByPaintOrder(
    motifs.flatMap((motif) =>
      motif.primitives.filter((primitive) => primitive.layer === "notes"),
    ),
  );
  const annotationPrimitives = sortPrimitivesByPaintOrder(
    motifs.flatMap((motif) =>
      motif.primitives.filter(
        (primitive) => primitive.layer === "annotations",
      ),
    ),
  );
  const layers: readonly RenderLayer[] = [
    { id: "staff", primitives: staffLines },
    { id: "structural", primitives: structuralPrimitives },
    { id: "notes", primitives: notePrimitives },
    { id: "annotations", primitives: annotationPrimitives },
    { id: "barlines", primitives: barlines },
  ];

  return {
    id: input.id,
    staff: {
      lines: staffLines,
      masterGuideStaffStep: 4,
    },
    motifs,
    layers,
    primitives: layers.flatMap((layer) => layer.primitives),
  };
}
