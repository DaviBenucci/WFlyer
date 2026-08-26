import { placeAtStaffStep } from "./score-path";
import type { ScorePath, StaffSpace, StaffStep, Vec2 } from "./types";
import {
  requireInteger,
  requireNormalizedPosition,
  requireStaffSpace,
  STAFF_LINE_STEPS,
  staffStepToOffset,
} from "./units";

export interface StaffLinePoint {
  readonly offset: number;
  readonly point: Vec2;
  readonly staffStep: StaffStep;
}

export interface SampledStaffLine {
  readonly points: readonly Vec2[];
  readonly staffStep: StaffStep;
}

/** All five visible lines, including staffStep 4 at the logical master guide. */
export function buildStaffSampleAt(
  path: ScorePath,
  t: number,
  staffSpace: StaffSpace,
): readonly StaffLinePoint[] {
  requireNormalizedPosition(t);
  requireStaffSpace(staffSpace);

  return STAFF_LINE_STEPS.map((staffStep) => ({
    offset: staffStepToOffset(staffStep, staffSpace),
    point: placeAtStaffStep(path, t, staffStep, staffSpace),
    staffStep,
  }));
}

/**
 * Samples coherent normal offsets of one guide. Sampling density is an explicit
 * layout input; the geometry core does not invent a rendering resolution.
 */
export function sampleStaffLines(
  path: ScorePath,
  staffSpace: StaffSpace,
  sampleCount: number,
): readonly SampledStaffLine[] {
  requireStaffSpace(staffSpace);
  requireInteger(sampleCount, "sampleCount");

  if (sampleCount < 2) {
    throw new RangeError("sampleCount must be at least two");
  }

  return STAFF_LINE_STEPS.map((staffStep) => ({
    points: Array.from({ length: sampleCount }, (_, index) =>
      placeAtStaffStep(
        path,
        index / (sampleCount - 1),
        staffStep,
        staffSpace,
      ),
    ),
    staffStep,
  }));
}
