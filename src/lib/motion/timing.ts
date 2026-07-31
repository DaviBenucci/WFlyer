import type { TransitionMode } from "./topology";

export const NAVIGATION_TIMING_MS = {
  prepareMaximum: 100,
  standardMinimum: 620,
  standardTarget: 720,
  standardMaximum: 820,
  pivotMinimum: 760,
  pivotTarget: 840,
  pivotMaximum: 900,
  hardMaximum: 900,
  neutral: 220,
  reduced: 180,
  recovery: 1_100,
} as const;

export function getTransitionDurationMs(
  mode: TransitionMode,
  reducedMotion: boolean,
): number {
  if (reducedMotion) {
    return NAVIGATION_TIMING_MS.reduced;
  }

  if (mode === "neutral") {
    return NAVIGATION_TIMING_MS.neutral;
  }

  if (mode === "home-pivot") {
    return NAVIGATION_TIMING_MS.pivotTarget;
  }

  return NAVIGATION_TIMING_MS.standardTarget;
}
