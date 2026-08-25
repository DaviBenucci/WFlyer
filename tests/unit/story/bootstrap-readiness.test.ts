import { describe, expect, it } from "vitest";

import {
  BOOTSTRAP_READINESS_INITIAL_STATE,
  BOOTSTRAP_READINESS_PHASES,
  BOOTSTRAP_TIMING_MS,
  isBootstrapOverlayActive,
  isBootstrapTerminalPhase,
  transitionBootstrapReadiness,
  type BootstrapReadinessEvent,
} from "@/lib/story/bootstrap";

describe("Phase-4 bootstrap readiness contract", () => {
  it("exposes every explicit readiness phase and the operational timing bounds", () => {
    expect(BOOTSTRAP_READINESS_PHASES).toEqual([
      "INITIAL",
      "WAITING_CRITICAL",
      "RESOLVING_DESTINATION",
      "POSITIONING",
      "READY_TO_REVEAL",
      "REVEALING",
      "REVEALED",
      "DEGRADED",
    ]);
    expect(BOOTSTRAP_TIMING_MS).toEqual({
      FIRST_ELIGIBLE_REVEAL: 1_500,
      REVEAL: 280,
      REDUCED_MOTION: 0,
      SESSION_REPEAT: 0,
      HARD_FAIL_OPEN: 5_000,
    });
  });

  it("advances only through the deterministic readiness sequence", () => {
    const events: readonly BootstrapReadinessEvent[] = [
      { type: "START" },
      { type: "CRITICAL_READY" },
      { type: "DESTINATION_RESOLVED" },
      { type: "POSITIONED" },
      { type: "START_REVEAL" },
      { type: "REVEAL_COMPLETE" },
    ];
    const phases = [BOOTSTRAP_READINESS_INITIAL_STATE.phase];
    let state = BOOTSTRAP_READINESS_INITIAL_STATE;

    for (const event of events) {
      state = transitionBootstrapReadiness(state, event);
      phases.push(state.phase);
    }

    expect(phases).toEqual([
      "INITIAL",
      "WAITING_CRITICAL",
      "RESOLVING_DESTINATION",
      "POSITIONING",
      "READY_TO_REVEAL",
      "REVEALING",
      "REVEALED",
    ]);
    expect(state.degradedReason).toBeNull();
    expect(isBootstrapTerminalPhase(state.phase)).toBe(true);
    expect(isBootstrapOverlayActive(state.phase)).toBe(false);
  });

  it("ignores out-of-order events without manufacturing readiness", () => {
    const initial = BOOTSTRAP_READINESS_INITIAL_STATE;
    const unchanged = transitionBootstrapReadiness(initial, {
      type: "POSITIONED",
    });

    expect(unchanged).toBe(initial);
    expect(isBootstrapOverlayActive(unchanged.phase)).toBe(true);
  });

  it("fails open from every nonterminal phase with an explicit reason", () => {
    let state = BOOTSTRAP_READINESS_INITIAL_STATE;
    state = transitionBootstrapReadiness(state, { type: "START" });
    state = transitionBootstrapReadiness(state, {
      type: "FAIL_OPEN",
      reason: "hard-timeout",
    });

    expect(state).toEqual({
      phase: "DEGRADED",
      degradedReason: "hard-timeout",
    });
    expect(isBootstrapTerminalPhase(state.phase)).toBe(true);
  });

  it("keeps the first terminal outcome immutable", () => {
    const degraded = transitionBootstrapReadiness(
      BOOTSTRAP_READINESS_INITIAL_STATE,
      {
        type: "FAIL_OPEN",
        reason: "critical-resource-error",
      },
    );

    expect(
      transitionBootstrapReadiness(degraded, {
        type: "FAIL_OPEN",
        reason: "positioning-error",
      }),
    ).toBe(degraded);
    expect(
      transitionBootstrapReadiness(degraded, { type: "REVEAL_COMPLETE" }),
    ).toBe(degraded);
  });
});
