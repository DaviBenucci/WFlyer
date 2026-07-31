import type { ScoreTransition } from "./topology";

export type NavigationSource = "link" | "history";

export interface NavigationRequest {
  readonly requestId: number;
  readonly sourcePathname: string;
  readonly destinationPathname: string;
  readonly source: NavigationSource;
  readonly requestedAt: number;
  readonly reducedMotion: boolean;
  readonly transition: ScoreTransition;
}

export type NavigationLifecyclePhase =
  | "idle"
  | "preparing"
  | "outgoing"
  | "navigating"
  | "incoming"
  | "settling"
  | "recovering";

export type NavigationRecoveryReason =
  | "superseded"
  | "timeout"
  | "animation-error"
  | "measurement-error"
  | "preference-change"
  | "route-mismatch"
  | "cancelled"
  | "unmount";

export interface NavigationLifecycleState {
  readonly phase: NavigationLifecyclePhase;
  readonly activeRequest: NavigationRequest | null;
  readonly pendingRequest: NavigationRequest | null;
  readonly lastIssuedRequestId: number;
  readonly recoveryReason: NavigationRecoveryReason | null;
}

export type NavigationLifecycleEvent =
  | { readonly type: "request"; readonly request: NavigationRequest }
  | { readonly type: "outgoing-started"; readonly requestId: number }
  | { readonly type: "route-requested"; readonly requestId: number }
  | { readonly type: "route-committed"; readonly requestId: number }
  | { readonly type: "settling-started"; readonly requestId: number }
  | { readonly type: "settled"; readonly requestId: number }
  | {
      readonly type: "recovery-requested";
      readonly requestId: number;
      readonly reason: NavigationRecoveryReason;
    }
  | { readonly type: "recovery-completed"; readonly requestId: number };

export function createInitialNavigationLifecycleState(
  lastIssuedRequestId = 0,
): NavigationLifecycleState {
  return {
    phase: "idle",
    activeRequest: null,
    pendingRequest: null,
    lastIssuedRequestId,
    recoveryReason: null,
  };
}

export function nextNavigationRequestId(lastIssuedRequestId: number): number {
  if (
    !Number.isSafeInteger(lastIssuedRequestId) ||
    lastIssuedRequestId < 0 ||
    lastIssuedRequestId >= Number.MAX_SAFE_INTEGER
  ) {
    throw new RangeError("The last navigation request id must be a safe integer.");
  }

  return lastIssuedRequestId + 1;
}

function isEventForActiveRequest(
  state: NavigationLifecycleState,
  requestId: number,
): boolean {
  return state.activeRequest?.requestId === requestId;
}

function startPendingOrIdle(
  state: NavigationLifecycleState,
): NavigationLifecycleState {
  if (state.pendingRequest) {
    return {
      ...state,
      phase: "preparing",
      activeRequest: state.pendingRequest,
      pendingRequest: null,
      recoveryReason: null,
    };
  }

  return {
    ...state,
    phase: "idle",
    activeRequest: null,
    pendingRequest: null,
    recoveryReason: null,
  };
}

function advancePhase(
  state: NavigationLifecycleState,
  requestId: number,
  expectedPhase: NavigationLifecyclePhase,
  nextPhase: NavigationLifecyclePhase,
): NavigationLifecycleState {
  if (
    state.phase !== expectedPhase ||
    !isEventForActiveRequest(state, requestId)
  ) {
    return state;
  }

  return { ...state, phase: nextPhase };
}

/**
 * A cancelable finite-state reducer. New requests never form a queue: while a
 * request is active, only the latest pending request is retained.
 */
export function navigationLifecycleReducer(
  state: NavigationLifecycleState,
  event: NavigationLifecycleEvent,
): NavigationLifecycleState {
  switch (event.type) {
    case "request": {
      if (event.request.requestId <= state.lastIssuedRequestId) {
        return state;
      }

      if (state.phase === "idle") {
        return {
          phase: "preparing",
          activeRequest: event.request,
          pendingRequest: null,
          lastIssuedRequestId: event.request.requestId,
          recoveryReason: null,
        };
      }

      return {
        ...state,
        phase: "recovering",
        pendingRequest: event.request,
        lastIssuedRequestId: event.request.requestId,
        recoveryReason: "superseded",
      };
    }

    case "outgoing-started":
      return advancePhase(
        state,
        event.requestId,
        "preparing",
        "outgoing",
      );

    case "route-requested":
      return advancePhase(
        state,
        event.requestId,
        "outgoing",
        "navigating",
      );

    case "route-committed":
      return advancePhase(
        state,
        event.requestId,
        "navigating",
        "incoming",
      );

    case "settling-started":
      return advancePhase(
        state,
        event.requestId,
        "incoming",
        "settling",
      );

    case "settled":
      if (
        state.phase !== "settling" ||
        !isEventForActiveRequest(state, event.requestId)
      ) {
        return state;
      }

      return startPendingOrIdle(state);

    case "recovery-requested":
      if (
        state.phase === "idle" ||
        !isEventForActiveRequest(state, event.requestId)
      ) {
        return state;
      }

      return {
        ...state,
        phase: "recovering",
        recoveryReason: event.reason,
      };

    case "recovery-completed":
      if (
        state.phase !== "recovering" ||
        !isEventForActiveRequest(state, event.requestId)
      ) {
        return state;
      }

      return startPendingOrIdle(state);
  }
}

export function isCurrentNavigationRequest(
  state: NavigationLifecycleState,
  requestId: number,
): boolean {
  return (
    state.phase !== "idle" &&
    state.phase !== "recovering" &&
    state.activeRequest?.requestId === requestId
  );
}
