import type {
  LineSegment,
  ScorePath,
  StaffSpace,
  StaffStep,
  StemDirection,
  Vec2,
} from "./types";
import {
  MIDDLE_STAFF_STEP,
  requirePositiveNumber,
  requireStaffSpace,
  requireStaffStep,
} from "./units";
import { addVectors, requireVec2, scaleVector } from "./vectors";

export interface StemModel extends LineSegment {
  readonly direction: StemDirection;
  readonly thickness: number;
}

export interface BuildStemInput {
  /** A world-space glyph anchor selected by the calibrated notehead metrics. */
  readonly attachment: Vec2;
  readonly direction: StemDirection;
  readonly lengthInStaffSpaces: number;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly t: number;
  readonly thicknessInStaffSpaces: number;
}

export function resolveIsolatedStemDirection(
  staffStep: StaffStep,
  explicitDirection?: StemDirection,
): StemDirection {
  requireStaffStep(staffStep);

  return (
    explicitDirection ?? (staffStep < MIDDLE_STAFF_STEP ? "up" : "down")
  );
}

export function resolveBeamGroupStemDirection(
  staffSteps: readonly StaffStep[],
): StemDirection {
  if (staffSteps.length === 0) {
    throw new RangeError("A beam group must contain at least one staffStep");
  }

  staffSteps.forEach(requireStaffStep);
  const offsets = staffSteps.map((step) => step - MIDDLE_STAFF_STEP);
  const balance = offsets.reduce((sum, offset) => sum + offset, 0);

  if (balance < 0) {
    return "up";
  }

  if (balance > 0) {
    return "down";
  }

  const farthestBelow = Math.max(
    0,
    ...offsets.filter((offset) => offset < 0).map((offset) => -offset),
  );
  const farthestAbove = Math.max(
    0,
    ...offsets.filter((offset) => offset > 0),
  );

  if (farthestBelow > farthestAbove) {
    return "up";
  }

  return "down";
}

export function buildStem(input: BuildStemInput): StemModel {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const length =
    requirePositiveNumber(input.lengthInStaffSpaces, "lengthInStaffSpaces") *
    staffSpace;
  const thickness =
    requirePositiveNumber(
      input.thicknessInStaffSpaces,
      "thicknessInStaffSpaces",
    ) * staffSpace;
  const start = { ...requireVec2(input.attachment, "attachment") };
  const multiplier = input.direction === "up" ? 1 : -1;

  return {
    direction: input.direction,
    end: addVectors(
      start,
      scaleVector(input.path.normalAt(input.t), multiplier * length),
    ),
    start,
    thickness,
  };
}
