/**
 * Phase-4 operational timing defaults.
 *
 * Readiness remains authoritative: the first-eligible duration is a lower
 * bound, never a substitute for critical-resource readiness. Motion Lab may
 * calibrate presentation timing later without changing the bootstrap state
 * contract.
 */
export const BOOTSTRAP_TIMING_MS = Object.freeze({
  FIRST_ELIGIBLE_REVEAL: 1_500,
  REVEAL: 280,
  REDUCED_MOTION: 0,
  SESSION_REPEAT: 0,
  HARD_FAIL_OPEN: 5_000,
} as const);
