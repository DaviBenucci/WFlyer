import { placeAtStaffStep } from "./score-path";
import type {
  LineSegment,
  ScorePath,
  StaffSpace,
  StaffStep,
  Vec2,
} from "./types";
import {
  requireNonNegativeNumber,
  requirePositiveNumber,
  requireStaffSpace,
  requireStaffStep,
} from "./units";
import { addVectors, scaleVector } from "./vectors";

export interface LedgerLineModel extends LineSegment {
  readonly center: Vec2;
  readonly ledgerStep: StaffStep;
  readonly width: number;
}

export interface BuildLedgerLinesInput {
  readonly extensionInStaffSpaces: number;
  readonly noteStaffStep: StaffStep;
  readonly noteheadWidthInStaffSpaces: number;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly t: number;
}

export function getLedgerLineSteps(
  noteStaffStep: StaffStep,
): readonly StaffStep[] {
  requireStaffStep(noteStaffStep);
  const steps: StaffStep[] = [];

  if (noteStaffStep >= 10) {
    for (let step = 10; step <= noteStaffStep; step += 2) {
      steps.push(step);
    }
  } else if (noteStaffStep <= -2) {
    for (let step = -2; step >= noteStaffStep; step -= 2) {
      steps.push(step);
    }
  }

  return steps;
}

export function buildLedgerLines(
  input: BuildLedgerLinesInput,
): readonly LedgerLineModel[] {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const noteheadWidth =
    requirePositiveNumber(
      input.noteheadWidthInStaffSpaces,
      "noteheadWidthInStaffSpaces",
    ) * staffSpace;
  const extension =
    requireNonNegativeNumber(
      input.extensionInStaffSpaces,
      "extensionInStaffSpaces",
    ) * staffSpace;
  const width = noteheadWidth + 2 * extension;
  const halfWidth = width / 2;
  const tangent = input.path.tangentAt(input.t);

  return getLedgerLineSteps(input.noteStaffStep).map((ledgerStep) => {
    const center = placeAtStaffStep(
      input.path,
      input.t,
      ledgerStep,
      staffSpace,
    );

    return {
      center,
      end: addVectors(center, scaleVector(tangent, halfWidth)),
      ledgerStep,
      start: addVectors(center, scaleVector(tangent, -halfWidth)),
      width,
    };
  });
}
