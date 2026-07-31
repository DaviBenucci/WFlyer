import { describe, expect, it } from "vitest";

import { classifyScoreTransition } from "./topology";
import {
  createInitialNavigationLifecycleState,
  isCurrentNavigationRequest,
  navigationLifecycleReducer,
  nextNavigationRequestId,
  type NavigationLifecycleEvent,
  type NavigationLifecycleState,
  type NavigationRequest,
} from "./lifecycle";

function createRequest(
  requestId: number,
  sourcePathname = "/sobre",
  destinationPathname = "/servicos",
): NavigationRequest {
  return {
    requestId,
    sourcePathname,
    destinationPathname,
    source: "link",
    requestedAt: requestId * 10,
    reducedMotion: false,
    transition: classifyScoreTransition(sourcePathname, destinationPathname),
  };
}

function reduce(
  state: NavigationLifecycleState,
  ...events: readonly NavigationLifecycleEvent[]
): NavigationLifecycleState {
  return events.reduce(navigationLifecycleReducer, state);
}

describe("navigationLifecycleReducer", () => {
  it("runs the complete lifecycle and rejects stale callbacks", () => {
    const request = createRequest(1);
    const preparing = navigationLifecycleReducer(
      createInitialNavigationLifecycleState(),
      { type: "request", request },
    );

    expect(preparing).toMatchObject({
      phase: "preparing",
      activeRequest: request,
      pendingRequest: null,
      lastIssuedRequestId: 1,
    });
    expect(isCurrentNavigationRequest(preparing, 1)).toBe(true);

    const outgoing = navigationLifecycleReducer(preparing, {
      type: "outgoing-started",
      requestId: 1,
    });
    const navigating = navigationLifecycleReducer(outgoing, {
      type: "route-requested",
      requestId: 1,
    });
    const incoming = navigationLifecycleReducer(navigating, {
      type: "route-committed",
      requestId: 1,
    });
    const settling = navigationLifecycleReducer(incoming, {
      type: "settling-started",
      requestId: 1,
    });
    const idle = navigationLifecycleReducer(settling, {
      type: "settled",
      requestId: 1,
    });

    expect([outgoing.phase, navigating.phase, incoming.phase, settling.phase]).toEqual(
      ["outgoing", "navigating", "incoming", "settling"],
    );
    expect(idle).toStrictEqual(createInitialNavigationLifecycleState(1));
    expect(isCurrentNavigationRequest(idle, 1)).toBe(false);
    expect(
      navigationLifecycleReducer(idle, {
        type: "route-committed",
        requestId: 1,
      }),
    ).toBe(idle);
  });

  it("does not skip lifecycle phases", () => {
    const state = navigationLifecycleReducer(
      createInitialNavigationLifecycleState(),
      { type: "request", request: createRequest(1) },
    );

    expect(
      navigationLifecycleReducer(state, {
        type: "route-committed",
        requestId: 1,
      }),
    ).toBe(state);
    expect(
      navigationLifecycleReducer(state, {
        type: "outgoing-started",
        requestId: 99,
      }),
    ).toBe(state);
  });

  it("retains only the latest request during rapid navigation", () => {
    const first = createRequest(1);
    const second = createRequest(2, "/sobre", "/portfolio");
    const third = createRequest(3, "/sobre", "/contato");
    const active = reduce(
      createInitialNavigationLifecycleState(),
      { type: "request", request: first },
      { type: "outgoing-started", requestId: 1 },
    );
    const recovering = reduce(
      active,
      { type: "request", request: second },
      { type: "request", request: third },
    );

    expect(recovering).toMatchObject({
      phase: "recovering",
      activeRequest: first,
      pendingRequest: third,
      lastIssuedRequestId: 3,
      recoveryReason: "superseded",
    });
    expect(isCurrentNavigationRequest(recovering, 1)).toBe(false);
    expect(
      navigationLifecycleReducer(recovering, {
        type: "route-committed",
        requestId: 1,
      }),
    ).toBe(recovering);

    const restarted = navigationLifecycleReducer(recovering, {
      type: "recovery-completed",
      requestId: 1,
    });

    expect(restarted).toMatchObject({
      phase: "preparing",
      activeRequest: third,
      pendingRequest: null,
      lastIssuedRequestId: 3,
      recoveryReason: null,
    });
  });

  it.each([
    "timeout",
    "animation-error",
    "measurement-error",
    "preference-change",
    "route-mismatch",
    "cancelled",
    "unmount",
  ] as const)("recovers idempotently after %s", (reason) => {
    const active = reduce(
      createInitialNavigationLifecycleState(),
      { type: "request", request: createRequest(1) },
      { type: "outgoing-started", requestId: 1 },
    );
    const recovering = navigationLifecycleReducer(active, {
      type: "recovery-requested",
      requestId: 1,
      reason,
    });

    expect(recovering).toMatchObject({
      phase: "recovering",
      recoveryReason: reason,
    });
    expect(
      navigationLifecycleReducer(recovering, {
        type: "recovery-completed",
        requestId: 99,
      }),
    ).toBe(recovering);

    const idle = navigationLifecycleReducer(recovering, {
      type: "recovery-completed",
      requestId: 1,
    });
    expect(idle).toStrictEqual(createInitialNavigationLifecycleState(1));
  });

  it("ignores reused and out-of-order request ids", () => {
    const initial = createInitialNavigationLifecycleState(4);

    expect(
      navigationLifecycleReducer(initial, {
        type: "request",
        request: createRequest(4),
      }),
    ).toBe(initial);
    expect(
      navigationLifecycleReducer(initial, {
        type: "request",
        request: createRequest(3),
      }),
    ).toBe(initial);
  });
});

describe("nextNavigationRequestId", () => {
  it("increments monotonically", () => {
    expect(nextNavigationRequestId(0)).toBe(1);
    expect(nextNavigationRequestId(41)).toBe(42);
  });

  it.each([-1, 1.5, Number.NaN, Number.MAX_SAFE_INTEGER])(
    "rejects the unsafe previous id %s",
    (value) => {
      expect(() => nextNavigationRequestId(value)).toThrow(RangeError);
    },
  );
});
