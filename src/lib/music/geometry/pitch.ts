import { placeAtStaffStep } from "./score-path";
import type { ScorePath, StaffSpace, StaffStep, Vec2 } from "./types";
import { requireInteger } from "./units";

export type PitchLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type NaturalPitch = `${PitchLetter}${number}`;

const PITCH_LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const E4_DIATONIC_INDEX = 4 * PITCH_LETTERS.length + 2;

function pitchLetterIndex(letter: PitchLetter): number {
  return PITCH_LETTERS.indexOf(letter);
}

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

export function pitchToStaffStep(pitch: NaturalPitch): StaffStep {
  const match = /^([A-G])(-?\d+)$/.exec(pitch);

  if (!match) {
    throw new RangeError(`Invalid natural pitch: ${pitch}`);
  }

  const letter = match[1] as PitchLetter;
  const octave = Number(match[2]);
  requireInteger(octave, "pitch octave");

  return octave * PITCH_LETTERS.length + pitchLetterIndex(letter) - E4_DIATONIC_INDEX;
}

export function staffStepToPitch(staffStep: StaffStep): NaturalPitch {
  requireInteger(staffStep, "staffStep");
  const diatonicIndex = E4_DIATONIC_INDEX + staffStep;
  const letterIndex = modulo(diatonicIndex, PITCH_LETTERS.length);
  const letter = PITCH_LETTERS[letterIndex];

  if (!letter) {
    throw new RangeError("Unable to resolve staffStep pitch");
  }

  const octave = Math.floor(diatonicIndex / PITCH_LETTERS.length);

  return `${letter}${octave}`;
}

export function placePitch(
  path: ScorePath,
  t: number,
  pitch: NaturalPitch,
  staffSpace: StaffSpace,
): Vec2 {
  return placeAtStaffStep(path, t, pitchToStaffStep(pitch), staffSpace);
}
