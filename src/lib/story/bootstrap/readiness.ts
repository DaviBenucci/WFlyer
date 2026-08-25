export const BOOTSTRAP_READINESS_PHASES = Object.freeze([
  "INITIAL",
  "WAITING_CRITICAL",
  "RESOLVING_DESTINATION",
  "POSITIONING",
  "READY_TO_REVEAL",
  "REVEALING",
  "REVEALED",
  "DEGRADED",
] as const);

export type BootstrapReadinessPhase =
  (typeof BOOTSTRAP_READINESS_PHASES)[number];

export const BOOTSTRAP_DEGRADED_REASONS = Object.freeze([
  "hard-timeout",
  "critical-resource-error",
  "positioning-error",
  "hidden-document",
  "aborted",
  "teardown",
] as const);

export type BootstrapDegradedReason =
  (typeof BOOTSTRAP_DEGRADED_REASONS)[number];

export interface BootstrapReadinessState {
  readonly phase: BootstrapReadinessPhase;
  readonly degradedReason: BootstrapDegradedReason | null;
}

export type BootstrapReadinessEvent =
  | Readonly<{ type: "START" }>
  | Readonly<{ type: "CRITICAL_READY" }>
  | Readonly<{ type: "DESTINATION_RESOLVED" }>
  | Readonly<{ type: "POSITIONED" }>
  | Readonly<{ type: "START_REVEAL" }>
  | Readonly<{ type: "REVEAL_COMPLETE" }>
  | Readonly<{
      type: "FAIL_OPEN";
      reason: BootstrapDegradedReason;
    }>;

export const BOOTSTRAP_READINESS_INITIAL_STATE: BootstrapReadinessState =
  Object.freeze({
    phase: "INITIAL",
    degradedReason: null,
  });

const NEXT_PHASE_BY_EVENT = Object.freeze({
  INITIAL: Object.freeze({ START: "WAITING_CRITICAL" }),
  WAITING_CRITICAL: Object.freeze({ CRITICAL_READY: "RESOLVING_DESTINATION" }),
  RESOLVING_DESTINATION: Object.freeze({
    DESTINATION_RESOLVED: "POSITIONING",
  }),
  POSITIONING: Object.freeze({ POSITIONED: "READY_TO_REVEAL" }),
  READY_TO_REVEAL: Object.freeze({ START_REVEAL: "REVEALING" }),
  REVEALING: Object.freeze({ REVEAL_COMPLETE: "REVEALED" }),
  REVEALED: Object.freeze({}),
  DEGRADED: Object.freeze({}),
} as const);

const TERMINAL_PHASES: ReadonlySet<BootstrapReadinessPhase> = new Set([
  "REVEALED",
  "DEGRADED",
]);

export function isBootstrapTerminalPhase(
  phase: BootstrapReadinessPhase,
): boolean {
  return TERMINAL_PHASES.has(phase);
}

export function isBootstrapOverlayActive(
  phase: BootstrapReadinessPhase,
): boolean {
  return !isBootstrapTerminalPhase(phase);
}

/**
 * Deterministic, pure readiness reducer. Events that are not legal for the
 * current phase are ignored. The first terminal result wins, including its
 * original fail-open reason.
 */
export function transitionBootstrapReadiness(
  state: BootstrapReadinessState,
  event: BootstrapReadinessEvent,
): BootstrapReadinessState {
  if (isBootstrapTerminalPhase(state.phase)) {
    return state;
  }

  if (event.type === "FAIL_OPEN") {
    return Object.freeze({
      phase: "DEGRADED",
      degradedReason: event.reason,
    });
  }

  const transitions = NEXT_PHASE_BY_EVENT[state.phase] as Readonly<
    Partial<Record<BootstrapReadinessEvent["type"], BootstrapReadinessPhase>>
  >;
  const nextPhase = transitions[event.type];

  if (nextPhase === undefined) {
    return state;
  }

  return Object.freeze({
    phase: nextPhase,
    degradedReason: null,
  });
}

/**
 * Readiness policy is semantic, not a list of eagerly preloaded page assets.
 * Noncritical resources must never delay reveal eligibility.
 */
export const BOOTSTRAP_RESOURCE_POLICY = Object.freeze({
  critical: Object.freeze([
    "base-css-layout",
    "static-story-model",
    "positioning-adapter",
    "official-intro-asset",
    "critical-fonts-or-fallback",
  ] as const),
  noncritical: Object.freeze([
    "application-demo-media",
    "project-media",
    "persona-variants",
    "detailed-route-media",
  ] as const),
});
