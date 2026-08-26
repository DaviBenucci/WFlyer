import { frameAt, placeAtStaffStep } from "./score-path";
import type {
  Accidental,
  Fifths,
  ScorePath,
  StaffSpace,
  StaffStep,
  Vec2,
} from "./types";
import {
  requireInteger,
  requireNonNegativeNumber,
  requirePositiveNumber,
  requireStaffSpace,
} from "./units";
import { addVectors, scaleVector } from "./vectors";

export const TREBLE_SHARP_STEPS = [8, 5, 9, 6, 3, 7, 4] as const;
export const TREBLE_FLAT_STEPS = [4, 7, 3, 6, 2, 5, 1] as const;

export interface KeySignatureEntry {
  readonly accidental: Extract<Accidental, "flat" | "sharp">;
  readonly index: number;
  readonly staffStep: StaffStep;
}

export interface KeySignaturePlacement extends KeySignatureEntry {
  /** World target to which the calibrated glyph pitchCenter anchor aligns. */
  readonly pitchCenter: Vec2;
}

export interface BuildTrebleKeySignatureInput {
  readonly accidentalWidthInStaffSpaces: number;
  readonly fifths: Fifths;
  readonly gapInStaffSpaces: number;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly startOffsetInStaffSpaces: number;
  readonly t: number;
}

export function requireFifths(value: number): Fifths {
  requireInteger(value, "fifths");

  if (value < -7 || value > 7) {
    throw new RangeError("fifths must be between -7 and 7 inclusive");
  }

  return value as Fifths;
}

export function getTrebleKeySignatureEntries(
  fifthsValue: Fifths,
): readonly KeySignatureEntry[] {
  const fifths = requireFifths(fifthsValue);
  const count = Math.abs(fifths);

  if (count === 0) {
    return [];
  }

  const accidental = fifths > 0 ? "sharp" : "flat";
  const steps = fifths > 0 ? TREBLE_SHARP_STEPS : TREBLE_FLAT_STEPS;

  return steps.slice(0, count).map((staffStep, index) => ({
    accidental,
    index,
    staffStep,
  }));
}

export function buildTrebleKeySignature(
  input: BuildTrebleKeySignatureInput,
): readonly KeySignaturePlacement[] {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const width = requirePositiveNumber(
    input.accidentalWidthInStaffSpaces,
    "accidentalWidthInStaffSpaces",
  );
  const gap = requireNonNegativeNumber(
    input.gapInStaffSpaces,
    "gapInStaffSpaces",
  );
  const startOffset = requireNonNegativeNumber(
    input.startOffsetInStaffSpaces,
    "startOffsetInStaffSpaces",
  );
  const tangent = frameAt(input.path, input.t).tangent;

  return getTrebleKeySignatureEntries(input.fifths).map((entry) => ({
    ...entry,
    pitchCenter: addVectors(
      placeAtStaffStep(
        input.path,
        input.t,
        entry.staffStep,
        staffSpace,
      ),
      scaleVector(
        tangent,
        (startOffset + entry.index * (width + gap)) * staffSpace,
      ),
    ),
  }));
}
