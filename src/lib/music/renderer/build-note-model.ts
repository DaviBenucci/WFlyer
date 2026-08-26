import { buildAccidentalPlacement } from "../geometry/accidentals";
import { buildLedgerLines } from "../geometry/ledger-lines";
import { frameAt, placeAtStaffStep } from "../geometry/score-path";
import {
  buildStem,
  resolveIsolatedStemDirection,
} from "../geometry/stems";
import type {
  Accidental,
  StemDirection,
  Vec2,
} from "../geometry/types";
import {
  requireNonNegativeNumber,
  requirePositiveNumber,
  requireStaffSpace,
  requireStaffStep,
} from "../geometry/units";
import {
  addVectors,
  dotVectors,
  scaleVector,
  subtractVectors,
} from "../geometry/vectors";
import type {
  MusicGlyphKey,
  NormalizedGlyphPoint,
} from "../glyphs/types";
import { glyphTransformForFrame } from "./glyph-frame";
import { wfPrimitiveId } from "./ids";
import type {
  GlyphRenderPrimitive,
  LineRenderPrimitive,
  NoteRenderModel,
  ResolvedGlyphCalibration,
  BuildNoteModelInput,
} from "./types";

const STEM_ALIGNMENT_EPSILON = 1e-7;

const accidentalGlyphs = {
  flat: "wf-music-accidental-flat",
  natural: "wf-music-accidental-natural",
  sharp: "wf-music-accidental-sharp",
} as const satisfies Record<Accidental, GlyphRenderPrimitive["assetKey"]>;

function requireCalibration<TKey extends MusicGlyphKey>(
  calibration: ResolvedGlyphCalibration<TKey>,
): ResolvedGlyphCalibration<TKey> {
  requirePositiveNumber(calibration.nominalWidthSp, "nominalWidthSp");
  requirePositiveNumber(calibration.nominalHeightSp, "nominalHeightSp");

  for (const [name, point] of Object.entries(
    calibration.anchors as Readonly<Record<string, NormalizedGlyphPoint>>,
  )) {
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

  return calibration;
}

function glyphPointInWorld(
  anchorTarget: Vec2,
  alignedAnchor: Vec2,
  requestedAnchor: Vec2,
  width: number,
  height: number,
  tangent: Vec2,
  normal: Vec2,
): Vec2 {
  const localX = (requestedAnchor.x - alignedAnchor.x) * width;
  // SVG-local +y points down, while ScorePath N points toward higher pitch.
  const localY = -(requestedAnchor.y - alignedAnchor.y) * height;

  return addVectors(
    anchorTarget,
    addVectors(
      scaleVector(tangent, localX),
      scaleVector(normal, localY),
    ),
  );
}

function glyphSize<TKey extends MusicGlyphKey>(
  calibration: ResolvedGlyphCalibration<TKey>,
  staffSpace: number,
): { readonly width: number; readonly height: number } {
  requireCalibration(calibration);

  return {
    width: calibration.nominalWidthSp * staffSpace,
    height: calibration.nominalHeightSp * staffSpace,
  };
}

function linePrimitive(
  id: string,
  role: LineRenderPrimitive["role"],
  start: Vec2,
  end: Vec2,
  thickness: number,
): LineRenderPrimitive {
  return {
    kind: "line",
    id,
    layer: "notes",
    role,
    start,
    end,
    thickness,
  };
}

function validateExplicitStemOverride(input: BuildNoteModelInput): void {
  if (
    input.stemDirectionOverride !== undefined &&
    !input.stemOverrideJustification?.trim()
  ) {
    throw new RangeError(
      "stemDirectionOverride requires stemOverrideJustification",
    );
  }

  if (
    input.stemDirectionOverride === undefined &&
    input.stemOverrideJustification !== undefined
  ) {
    throw new RangeError(
      "stemOverrideJustification requires stemDirectionOverride",
    );
  }
}

function validateBeamStem(
  attachment: Vec2,
  end: Vec2,
  direction: StemDirection,
  tangent: Vec2,
  normal: Vec2,
): void {
  const delta = subtractVectors(end, attachment);
  const tangentDistance = Math.abs(dotVectors(delta, tangent));
  const expectedNormalSign = direction === "up" ? 1 : -1;
  const directedLength = dotVectors(delta, normal) * expectedNormalSign;

  if (directedLength <= STEM_ALIGNMENT_EPSILON) {
    throw new RangeError(
      "beam stem endpoint must extend from the notehead in its resolved direction",
    );
  }

  if (tangentDistance > STEM_ALIGNMENT_EPSILON * Math.max(1, directedLength)) {
    throw new RangeError(
      "beam stem endpoint must lie on the note local normal",
    );
  }
}

export function buildNoteModel(input: BuildNoteModelInput): NoteRenderModel {
  const staffSpace = requireStaffSpace(input.staffSpace);
  requireStaffStep(input.staffStep);
  validateExplicitStemOverride(input);
  requireNonNegativeNumber(
    input.tokens.accidentalGapSp,
    "accidentalGapSp",
  );
  requireNonNegativeNumber(
    input.tokens.ledgerLineExtensionSp,
    "ledgerLineExtensionSp",
  );
  requirePositiveNumber(
    input.tokens.ledgerLineThicknessSp,
    "ledgerLineThicknessSp",
  );
  requirePositiveNumber(input.tokens.stemLengthSp, "stemLengthSp");
  requirePositiveNumber(input.tokens.stemThicknessSp, "stemThicknessSp");

  if (input.beamed !== (input.beamStem !== undefined)) {
    throw new RangeError(
      "beamed notes require an exact beamStem and un-beamed notes forbid one",
    );
  }

  if (
    input.beamed &&
    input.duration !== "eighth" &&
    input.duration !== "sixteenth"
  ) {
    throw new RangeError("Only eighth and sixteenth notes may be beamed");
  }

  if (input.beamed && input.stemDirectionOverride !== undefined) {
    throw new RangeError(
      "Beamed notes use the resolved group direction, not an isolated override",
    );
  }

  const frame = frameAt(input.path, input.t);
  const center = placeAtStaffStep(
    input.path,
    input.t,
    input.staffStep,
    staffSpace,
  );
  const noteheadKey =
    input.duration === "whole" || input.duration === "half"
      ? "wf-music-notehead-open"
      : "wf-music-notehead-filled";
  const noteheadCalibration = requireCalibration(
    input.calibration[noteheadKey],
  );
  const noteheadDimensions = glyphSize(noteheadCalibration, staffSpace);
  const frameTransform = glyphTransformForFrame(frame);
  const notehead: GlyphRenderPrimitive = {
    kind: "glyph",
    id: wfPrimitiveId(input.id, "notehead"),
    layer: "notes",
    role: "notehead",
    assetKey: noteheadKey,
    anchorTarget: center,
    anchorInGlyph: noteheadCalibration.anchors.opticalCenter,
    ...noteheadDimensions,
    ...frameTransform,
  };
  const ledgerLines = buildLedgerLines({
    extensionInStaffSpaces: input.tokens.ledgerLineExtensionSp,
    noteStaffStep: input.staffStep,
    noteheadWidthInStaffSpaces: noteheadCalibration.nominalWidthSp,
    path: input.path,
    staffSpace,
    t: input.t,
  }).map((ledger, index) =>
    linePrimitive(
      wfPrimitiveId(input.id, "ledger", index),
      "ledger",
      ledger.start,
      ledger.end,
      input.tokens.ledgerLineThicknessSp * staffSpace,
    ),
  );

  let accidental: GlyphRenderPrimitive | undefined;

  if (input.accidental !== undefined) {
    const assetKey = accidentalGlyphs[input.accidental];
    const accidentalCalibration = requireCalibration(
      input.calibration[assetKey],
    );
    const placement = buildAccidentalPlacement({
      accidental: input.accidental,
      accidentalWidthInStaffSpaces: accidentalCalibration.nominalWidthSp,
      gapInStaffSpaces: input.tokens.accidentalGapSp,
      noteheadWidthInStaffSpaces: noteheadCalibration.nominalWidthSp,
      path: input.path,
      staffSpace,
      staffStep: input.staffStep,
      t: input.t,
    });

    accidental = {
      kind: "glyph",
      id: wfPrimitiveId(input.id, "accidental"),
      layer: "notes",
      role: "accidental",
      assetKey,
      anchorTarget: placement.pitchCenter,
      anchorInGlyph: accidentalCalibration.anchors.pitchCenter,
      ...glyphSize(accidentalCalibration, staffSpace),
      ...frameTransform,
    };
  }

  let stem: LineRenderPrimitive | undefined;
  let stemDirection: StemDirection | undefined;
  let flag: GlyphRenderPrimitive | undefined;

  if (input.duration !== "whole") {
    stemDirection =
      input.beamStem?.direction ??
      resolveIsolatedStemDirection(
        input.staffStep,
        input.stemDirectionOverride,
      );
    const stemAnchor =
      stemDirection === "up"
        ? noteheadCalibration.anchors.stemUp
        : noteheadCalibration.anchors.stemDown;
    const attachment = glyphPointInWorld(
      center,
      noteheadCalibration.anchors.opticalCenter,
      stemAnchor,
      noteheadDimensions.width,
      noteheadDimensions.height,
      frame.tangent,
      frame.normal,
    );

    if (input.beamStem) {
      validateBeamStem(
        attachment,
        input.beamStem.end,
        stemDirection,
        frame.tangent,
        frame.normal,
      );
      stem = linePrimitive(
        wfPrimitiveId(input.id, "stem"),
        "stem",
        attachment,
        input.beamStem.end,
        input.tokens.stemThicknessSp * staffSpace,
      );
    } else {
      const stemGeometry = buildStem({
        attachment,
        direction: stemDirection,
        lengthInStaffSpaces: input.tokens.stemLengthSp,
        path: input.path,
        staffSpace,
        t: input.t,
        thicknessInStaffSpaces: input.tokens.stemThicknessSp,
      });
      stem = linePrimitive(
        wfPrimitiveId(input.id, "stem"),
        "stem",
        stemGeometry.start,
        stemGeometry.end,
        stemGeometry.thickness,
      );
    }

    if (
      !input.beamed &&
      (input.duration === "eighth" || input.duration === "sixteenth")
    ) {
      const flagKey =
        input.duration === "eighth"
          ? "wf-music-eighth-flag"
          : "wf-music-sixteenth-double-flag";
      const flagCalibration = requireCalibration(input.calibration[flagKey]);
      const transform = glyphTransformForFrame(
        frame,
        input.tokens.flagTransform[stemDirection],
      );

      flag = {
        kind: "glyph",
        id: wfPrimitiveId(input.id, "flag"),
        layer: "notes",
        role: "flag",
        assetKey: flagKey,
        anchorTarget: stem.end,
        anchorInGlyph: flagCalibration.anchors.stemAttachment,
        ...glyphSize(flagCalibration, staffSpace),
        ...transform,
      };
    }
  }

  const primitives = [
    ...ledgerLines,
    ...(accidental ? [accidental] : []),
    notehead,
    ...(stem ? [stem] : []),
    ...(flag ? [flag] : []),
  ];

  return {
    id: input.id,
    ...(accidental ? { accidental } : {}),
    center,
    duration: input.duration,
    ...(flag ? { flag } : {}),
    ledgerLines,
    notehead,
    primitives,
    staffStep: input.staffStep,
    ...(stem ? { stem } : {}),
    ...(stemDirection ? { stemDirection } : {}),
    t: input.t,
  };
}
