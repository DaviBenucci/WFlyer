import { frameAt, placeAtStaffStep } from "./score-path";
import type {
  Accidental,
  ScorePath,
  StaffSpace,
  StaffStep,
  Vec2,
} from "./types";
import {
  requireNonNegativeNumber,
  requirePositiveNumber,
  requireStaffSpace,
} from "./units";
import { addVectors, scaleVector } from "./vectors";

export interface AccidentalPlacement {
  readonly accidental: Accidental;
  /** World target to which the calibrated glyph pitchCenter anchor aligns. */
  readonly pitchCenter: Vec2;
  readonly staffStep: StaffStep;
}

export interface BuildAccidentalPlacementInput {
  readonly accidental: Accidental;
  readonly accidentalWidthInStaffSpaces: number;
  readonly gapInStaffSpaces: number;
  readonly noteheadWidthInStaffSpaces: number;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly staffStep: StaffStep;
  readonly t: number;
}

export function buildAccidentalPlacement(
  input: BuildAccidentalPlacementInput,
): AccidentalPlacement {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const noteheadWidth = requirePositiveNumber(
    input.noteheadWidthInStaffSpaces,
    "noteheadWidthInStaffSpaces",
  );
  const accidentalWidth = requirePositiveNumber(
    input.accidentalWidthInStaffSpaces,
    "accidentalWidthInStaffSpaces",
  );
  const gap = requireNonNegativeNumber(
    input.gapInStaffSpaces,
    "gapInStaffSpaces",
  );
  const backwardOffset =
    -(noteheadWidth / 2 + gap + accidentalWidth / 2) * staffSpace;
  const noteCenter = placeAtStaffStep(
    input.path,
    input.t,
    input.staffStep,
    staffSpace,
  );

  return {
    accidental: input.accidental,
    pitchCenter: addVectors(
      noteCenter,
      scaleVector(frameAt(input.path, input.t).tangent, backwardOffset),
    ),
    staffStep: input.staffStep,
  };
}
