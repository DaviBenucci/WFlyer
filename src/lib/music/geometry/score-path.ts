import type {
  ScorePath,
  ScorePathFrame,
  StaffSpace,
  StaffStep,
  Vec2,
} from "./types";
import {
  requireNormalizedPosition,
  staffStepToOffset,
} from "./units";
import {
  addVectors,
  dotVectors,
  leftNormal,
  normalizeVector,
  scaleVector,
} from "./vectors";

const NORMAL_ORIENTATION_EPSILON = 1e-9;

export interface PitchNormalReference {
  /** A normalized path position at which the world-space hint is evaluated. */
  readonly at: number;
  /** Any non-zero vector pointing toward increasing pitch in world space. */
  readonly towardIncreasingPitch: Vec2;
}

export type PitchNormalOrientation = -1 | 1;

export function resolvePitchNormalOrientation(
  tangentAtReference: Vec2,
  reference: PitchNormalReference,
): PitchNormalOrientation {
  requireNormalizedPosition(reference.at);
  const candidate = leftNormal(tangentAtReference);
  const pitchHint = normalizeVector(
    reference.towardIncreasingPitch,
    "towardIncreasingPitch",
  );
  const alignment = dotVectors(candidate, pitchHint);

  if (Math.abs(alignment) <= NORMAL_ORIENTATION_EPSILON) {
    throw new RangeError(
      "towardIncreasingPitch must identify one side of the path tangent",
    );
  }

  return alignment > 0 ? 1 : -1;
}

export function orientedPitchNormal(
  tangent: Vec2,
  orientation: PitchNormalOrientation,
): Vec2 {
  return scaleVector(leftNormal(tangent), orientation);
}

export function frameAt(path: ScorePath, t: number): ScorePathFrame {
  requireNormalizedPosition(t);

  return {
    normal: normalizeVector(path.normalAt(t), "path normal"),
    point: path.pointAt(t),
    tangent: normalizeVector(path.tangentAt(t), "path tangent"),
  };
}

export function placeAtStaffStep(
  path: ScorePath,
  t: number,
  staffStep: StaffStep,
  staffSpace: StaffSpace,
): Vec2 {
  const frame = frameAt(path, t);

  return addVectors(
    frame.point,
    scaleVector(frame.normal, staffStepToOffset(staffStep, staffSpace)),
  );
}
