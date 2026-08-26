import type { StoryProjectionMode } from "../bootstrap";

/**
 * Phase-5 laboratory values only. The final activation thresholds remain a
 * human calibration item and must not be promoted to canonical policy from
 * this module.
 */
export const MOTION_LAB_DRAFT_ELIGIBILITY = Object.freeze({
  compactMaximumWidth: 767,
  horizontalMinimumAspectRatio: 1.35,
  horizontalMinimumHeight: 640,
  horizontalMinimumWidth: 1100,
});

export interface StoryProjectionSignals {
  readonly anyFinePointer: boolean;
  readonly height: number;
  readonly hoverCapable: boolean;
  readonly reducedMotion: boolean;
  readonly width: number;
}

export type StoryProjectionReason =
  | "driver-failure"
  | "eligible-full-motion"
  | "insufficient-layout-capacity"
  | "reduced-motion"
  | "touch-or-coarse-input"
  | "compact-viewport";

export interface StoryProjectionDecision {
  readonly mode: StoryProjectionMode;
  readonly reason: StoryProjectionReason;
}

export function resolveStoryProjectionMode(
  signals: StoryProjectionSignals,
): StoryProjectionDecision {
  const width = Math.max(0, signals.width);
  const height = Math.max(1, signals.height);

  if (signals.reducedMotion) {
    return { mode: "static", reason: "reduced-motion" };
  }

  if (width <= MOTION_LAB_DRAFT_ELIGIBILITY.compactMaximumWidth) {
    return { mode: "vertical-compact", reason: "compact-viewport" };
  }

  if (!signals.anyFinePointer || !signals.hoverCapable) {
    return { mode: "vertical-wide", reason: "touch-or-coarse-input" };
  }

  const hasEffectiveCapacity =
    width >= MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumWidth &&
    height >= MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumHeight &&
    width / height >=
      MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumAspectRatio;

  if (!hasEffectiveCapacity) {
    return {
      mode: "vertical-wide",
      reason: "insufficient-layout-capacity",
    };
  }

  return { mode: "horizontal-enhanced", reason: "eligible-full-motion" };
}
