"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { OfficialBrandSymbol } from "@/components/brand";
import { STORY_CHAPTERS } from "@/lib/story";
import {
  BOOTSTRAP_READINESS_INITIAL_STATE,
  BOOTSTRAP_TIMING_MS,
  createStaticNativeStoryPositioningAdapter,
  mergeStoryHistoryState,
  resolveStoryBootstrapDestination,
  STORY_BOOTSTRAP_SESSION_KEY,
  transitionBootstrapReadiness,
  type BootstrapDegradedReason,
  type BootstrapReadinessEvent,
  type StoryBootstrapDestination,
  type StoryPositioningAdapter,
  type StoryPositioningResult,
} from "@/lib/story/bootstrap";

import styles from "./story-bootstrap.module.css";

export type StoryBootstrapScenario =
  | "normal"
  | "slow-critical"
  | "critical-failure"
  | "timeout"
  | "noncritical-failure"
  | "projection-failure";

type TimingOverrides = Partial<
  Record<keyof typeof BOOTSTRAP_TIMING_MS, number>
>;

interface BootstrapProbeContext {
  readonly root: HTMLElement;
  readonly signal: AbortSignal;
}

interface BootstrapDebugPositionCall {
  readonly chapterId: StoryBootstrapDestination["chapterId"];
  readonly trigger: string;
}

interface BootstrapDebugState {
  degradedReason: BootstrapDegradedReason | null;
  destination: StoryBootstrapDestination["chapterId"] | "unresolved";
  positionCalls: BootstrapDebugPositionCall[];
  releaseCause: string | null;
  releaseTimestamp: number | null;
  scenario: StoryBootstrapScenario;
  states: string[];
}

declare global {
  interface Window {
    __WFLYER_PHASE4_BOOTSTRAP__?: BootstrapDebugState;
  }
}

export interface StoryBootstrapExperienceProps {
  readonly children: ReactNode;
  readonly criticalProbe?: (
    context: BootstrapProbeContext,
  ) => Promise<void> | void;
  readonly noncriticalProbe?: (
    context: BootstrapProbeContext,
  ) => Promise<void> | void;
  readonly positioningAdapter?: StoryPositioningAdapter;
  readonly scenario?: StoryBootstrapScenario;
  readonly timing?: TimingOverrides;
}

type AttributeSnapshot = Readonly<{
  name: string;
  element: HTMLElement;
  present: boolean;
  value: string | null;
}>;

type ReleaseCause =
  | "normal"
  | "reduced-motion"
  | "session-repeat"
  | "skip"
  | "escape";

type PositionStatus = "pending" | "positioned" | "fallback" | "failed";

interface ActivePositionRequest {
  readonly adapter: StoryPositioningAdapter;
  readonly chapterId: StoryBootstrapDestination["chapterId"];
  readonly controller: AbortController;
  readonly promise: Promise<StoryPositioningResult>;
}

interface PositionRequestOptions {
  readonly adapter?: StoryPositioningAdapter;
  readonly forceRestart?: boolean;
  readonly preserveFailureStatus?: boolean;
}

const UNDERLYING_STORY_SELECTORS = [
  ".wf-skip-link",
  "[data-story-v2-header]",
  "main[data-story-v2]",
  "[data-story-global-footer]",
] as const;

const SLOW_CRITICAL_DELAY_MS = 3_500;
const FONT_FALLBACK_DELAY_MS = 120;

function abortError(): DOMException {
  return new DOMException("Bootstrap work was aborted.", "AbortError");
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function waitForDelay(milliseconds: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.reject(abortError());
  if (milliseconds <= 0) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(() => {
      settled = true;
      signal.removeEventListener("abort", handleAbort);
      resolve();
    }, milliseconds);
    const handleAbort = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      signal.removeEventListener("abort", handleAbort);
      reject(abortError());
    };

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

function waitUntilAborted(signal: AbortSignal): Promise<never> {
  if (signal.aborted) return Promise.reject(abortError());

  return new Promise((_, reject) => {
    signal.addEventListener("abort", () => reject(abortError()), {
      once: true,
    });
  });
}

async function waitForFontsOrFallback(signal: AbortSignal): Promise<void> {
  const fontSet = document.fonts;

  if (fontSet === undefined) return;

  await Promise.race([
    fontSet.ready.then(() => undefined, () => undefined),
    waitForDelay(FONT_FALLBACK_DELAY_MS, signal),
  ]);
}

function verifyMountedCriticalSurface(root: HTMLElement): void {
  if (root.querySelector("main[data-story-v2]") === null) {
    throw new Error("The semantic story document is not mounted.");
  }

  if (STORY_CHAPTERS.length !== 13) {
    throw new Error("The canonical story manifest is incomplete.");
  }

  const officialSymbol = root.querySelector(
    '[data-asset-name="wflyer-header-symbol"]',
  );
  if (
    officialSymbol === null ||
    officialSymbol.querySelectorAll("[data-brand-path]").length !== 3
  ) {
    throw new Error("The approved inline W_Flyer symbol is unavailable.");
  }
}

function snapshotAttribute(
  element: HTMLElement,
  name: string,
): AttributeSnapshot {
  return {
    element,
    name,
    present: element.hasAttribute(name),
    value: element.getAttribute(name),
  };
}

function restoreAttribute(snapshot: AttributeSnapshot): void {
  if (snapshot.present) {
    snapshot.element.setAttribute(snapshot.name, snapshot.value ?? "");
  } else {
    snapshot.element.removeAttribute(snapshot.name);
  }
}

function isolateUnderlyingStory(): () => void {
  const elements = new Set<HTMLElement>();
  for (const selector of UNDERLYING_STORY_SELECTORS) {
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      elements.add(element);
    }
  }

  const snapshots = Array.from(elements).flatMap((element) => [
    snapshotAttribute(element, "aria-hidden"),
    snapshotAttribute(element, "inert"),
  ]);

  for (const element of elements) {
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("inert", "");
  }

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    for (const snapshot of snapshots) restoreAttribute(snapshot);
  };
}

function acquireBootstrapLocks(): () => void {
  const restoreIsolation = isolateUnderlyingStory();
  const root = document.documentElement;
  const body = document.body;
  const activeAttribute = snapshotAttribute(root, "data-story-bootstrap-active");
  const overflow = body.style.getPropertyValue("overflow");
  const overflowPriority = body.style.getPropertyPriority("overflow");
  const hadScrollRestoration = "scrollRestoration" in window.history;
  const scrollRestoration = hadScrollRestoration
    ? window.history.scrollRestoration
    : null;

  root.setAttribute("data-story-bootstrap-active", "true");
  body.style.setProperty("overflow", "hidden");
  if (hadScrollRestoration) window.history.scrollRestoration = "manual";

  let released = false;
  return () => {
    if (released) return;
    released = true;
    restoreIsolation();
    restoreAttribute(activeAttribute);
    if (overflow === "") {
      body.style.removeProperty("overflow");
    } else {
      body.style.setProperty("overflow", overflow, overflowPriority);
    }
    if (hadScrollRestoration && scrollRestoration !== null) {
      window.history.scrollRestoration = scrollRestoration;
    }
  };
}

function sessionWasCompleted(): boolean {
  try {
    return sessionStorage.getItem(STORY_BOOTSTRAP_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function completeSession(): void {
  try {
    sessionStorage.setItem(STORY_BOOTSTRAP_SESSION_KEY, "1");
  } catch {
    // Storage denial must not prevent the story from becoming usable.
  }
}

export function StoryBootstrapExperience({
  children,
  criticalProbe,
  noncriticalProbe,
  positioningAdapter,
  scenario = "normal",
  timing: timingOverrides,
}: StoryBootstrapExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const completedRef = useRef(false);
  const bypassRef = useRef<(cause: "skip" | "escape") => void>(() => undefined);
  const adapter = useMemo(
    () => positioningAdapter ?? createStaticNativeStoryPositioningAdapter(),
    [positioningAdapter],
  );
  const timing = useMemo(
    () => ({ ...BOOTSTRAP_TIMING_MS, ...timingOverrides }),
    [timingOverrides],
  );
  const [readiness, dispatch] = useReducer(
    transitionBootstrapReadiness,
    BOOTSTRAP_READINESS_INITIAL_STATE,
  );
  const [coverVisible, setCoverVisible] = useState(true);
  const [coverRevealing, setCoverRevealing] = useState(false);
  const [destination, setDestination] = useState<StoryBootstrapDestination | null>(
    null,
  );
  const [positionStatus, setPositionStatus] =
    useState<PositionStatus>("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sessionRepeated, setSessionRepeated] = useState(false);
  const [releaseCause, setReleaseCause] = useState<string | null>(null);
  const [historyStatus, setHistoryStatus] = useState("pending");
  const debugRef = useRef<BootstrapDebugState>({
    degradedReason: null,
    destination: "unresolved",
    positionCalls: [],
    releaseCause: null,
    releaseTimestamp: null,
    scenario,
    states: ["INITIAL"],
  });

  useEffect(() => {
    debugRef.current.states = Array.from(
      new Set([...debugRef.current.states, readiness.phase]),
    );
    debugRef.current.degradedReason = readiness.degradedReason;
  }, [readiness.degradedReason, readiness.phase]);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null || completedRef.current) return;

    let disposed = false;
    let terminalRequested = false;
    let contentReleased = false;
    let destinationRef: StoryBootstrapDestination | null = null;
    let hasPositioned = false;
    let initialHistoryReplaced = false;
    let deadlineTimer: number | null = null;
    let semanticNavigationTimer: number | null = null;
    let pendingNavigationTrigger: "hashchange" | "popstate" | null = null;
    let pendingNavigationState: unknown = undefined;
    let activePositionRequest: ActivePositionRequest | null = null;
    const lifecycleController = new AbortController();
    const criticalController = new AbortController();
    const staticFailOpenAdapter = createStaticNativeStoryPositioningAdapter();
    const serverCover = root.querySelector<HTMLElement>(
      "[data-bootstrap-cover]",
    );
    const cssFailOpenAlreadyReleased =
      serverCover !== null &&
      window.getComputedStyle(serverCover).visibility === "hidden";
    const releaseLocks = cssFailOpenAlreadyReleased
      ? () => undefined
      : acquireBootstrapLocks();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startedAt = performance.now();
    const debug = debugRef.current;
    let machineState = BOOTSTRAP_READINESS_INITIAL_STATE;

    debug.degradedReason = null;
    debug.destination = "unresolved";
    debug.positionCalls = [];
    debug.releaseCause = null;
    debug.releaseTimestamp = null;
    debug.scenario = scenario;
    debug.states = ["INITIAL"];
    window.__WFLYER_PHASE4_BOOTSTRAP__ = debug;

    const send = (event: BootstrapReadinessEvent) => {
      if (disposed) return;
      const nextState = transitionBootstrapReadiness(machineState, event);
      if (nextState.phase !== machineState.phase) {
        debug.states.push(nextState.phase);
      }
      machineState = nextState;
      debug.degradedReason = nextState.degradedReason;
      dispatch(event);
    };

    const resolveCurrentDestination = (
      historyState: unknown = window.history.state,
    ) => {
      const resolved = resolveStoryBootstrapDestination({
        explicitHash: window.location.hash,
        historyState,
      });
      destinationRef = resolved;
      debug.destination = resolved.chapterId;
      if (!disposed) setDestination(resolved);
      return resolved;
    };

    const replaceInitialHistory = (result: StoryPositioningResult) => {
      if (initialHistoryReplaced) return;
      initialHistoryReplaced = true;
      try {
        window.history.replaceState(
          mergeStoryHistoryState(
            window.history.state,
            result.positionedChapterId,
          ),
          "",
        );
        if (!disposed) setHistoryStatus("replaced");
      } catch {
        if (!disposed) setHistoryStatus("replace-failed");
      }
    };

    const position = async (
      resolved: StoryBootstrapDestination,
      trigger: string,
      requestOptions: PositionRequestOptions = {},
    ): Promise<StoryPositioningResult> => {
      const activeAdapter = requestOptions.adapter ?? adapter;
      if (
        requestOptions.forceRestart !== true &&
        activePositionRequest !== null &&
        activePositionRequest.adapter === activeAdapter &&
        activePositionRequest.chapterId === resolved.chapterId
      ) {
        return activePositionRequest.promise;
      }

      activePositionRequest?.controller.abort();
      const positionController = new AbortController();
      const handleLifecycleAbort = () => positionController.abort();
      lifecycleController.signal.addEventListener(
        "abort",
        handleLifecycleAbort,
        { once: true },
      );
      debug.positionCalls.push({ chapterId: resolved.chapterId, trigger });
      const request = Object.freeze({
        adapter: activeAdapter,
        chapterId: resolved.chapterId,
        controller: positionController,
        promise: (
          scenario === "projection-failure" && requestOptions.adapter === undefined
            ? Promise.reject(new Error("Injected projection failure."))
            : activeAdapter.position(resolved.chapterId, {
                signal: positionController.signal,
              })
        ).then((result) => {
          hasPositioned = true;
          if (!disposed && !requestOptions.preserveFailureStatus) {
            setPositionStatus(
              result.fallbackToHome ? "fallback" : "positioned",
            );
          }
          return result;
        }),
      }) satisfies ActivePositionRequest;
      activePositionRequest = request;

      try {
        const result = await request.promise;
        hasPositioned = true;
        return result;
      } catch (error) {
        if (!disposed && !isAbortError(error)) setPositionStatus("failed");
        throw error;
      } finally {
        lifecycleController.signal.removeEventListener(
          "abort",
          handleLifecycleAbort,
        );
        if (activePositionRequest === request) activePositionRequest = null;
      }
    };

    const releaseInteraction = (cause: string) => {
      if (contentReleased) return;
      contentReleased = true;
      completedRef.current = true;
      const shouldFocusMain = document.activeElement === skipRef.current;
      releaseLocks();
      completeSession();
      debug.releaseCause = cause;
      debug.releaseTimestamp = performance.now();
      if (!disposed) {
        setReleaseCause(cause);
        setCoverVisible(false);
      }
      if (shouldFocusMain) {
        root
          .querySelector<HTMLElement>("main#main-content")
          ?.focus({ preventScroll: true });
      }
    };

    const releaseDegraded = (
      reason: BootstrapDegradedReason,
      cause: string,
    ) => {
      if (terminalRequested) return;
      terminalRequested = true;
      if (deadlineTimer !== null) window.clearTimeout(deadlineTimer);
      criticalController.abort();
      send({ type: "FAIL_OPEN", reason });
      debug.degradedReason = reason;
      const resolved = destinationRef ?? resolveCurrentDestination();
      // The adapter performs its physical move synchronously before awaiting
      // frame stability, so invoking it is sufficient for a bounded fail-open.
      const failOpenAdapter =
        reason === "positioning-error" ? staticFailOpenAdapter : adapter;
      void position(
        resolved,
        reason === "positioning-error"
          ? `fail-open-static:${cause}`
          : `fail-open:${cause}`,
        {
          adapter: failOpenAdapter,
          forceRestart: true,
          preserveFailureStatus: reason === "positioning-error",
        },
      )
        .then((result) => {
          hasPositioned = true;
          replaceInitialHistory(result);
        })
        .catch(() => {
          if (!disposed) setPositionStatus("failed");
        });
      releaseInteraction(cause);
    };

    const handleCssFailOpen = (event: AnimationEvent) => {
      if (event.target === serverCover && !contentReleased) {
        releaseDegraded("hard-timeout", "css-fail-open");
      }
    };
    serverCover?.addEventListener("animationend", handleCssFailOpen);

    const releaseRevealed = async (
      cause: ReleaseCause,
      revealDuration: number,
    ) => {
      if (terminalRequested) return;
      terminalRequested = true;
      if (deadlineTimer !== null) window.clearTimeout(deadlineTimer);
      criticalController.abort();
      send({ type: "START_REVEAL" });
      if (!disposed) setCoverRevealing(true);
      try {
        await waitForDelay(revealDuration, lifecycleController.signal);
      } catch (error) {
        if (isAbortError(error)) return;
        throw error;
      }
      send({ type: "REVEAL_COMPLETE" });
      releaseInteraction(cause);
    };

    const bypass = (cause: "skip" | "escape" | "reduced-motion") => {
      if (terminalRequested) return;
      criticalController.abort();
      void (async () => {
        send({ type: "CRITICAL_READY" });
        const resolved = resolveCurrentDestination();
        send({ type: "DESTINATION_RESOLVED" });
        try {
          const result = await position(resolved, cause);
          replaceInitialHistory(result);
          send({ type: "POSITIONED" });
          await releaseRevealed(cause, 0);
        } catch (error) {
          if (!isAbortError(error)) {
            releaseDegraded("positioning-error", cause);
          }
        }
      })();
    };
    bypassRef.current = bypass;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !contentReleased) bypass("escape");
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && !contentReleased) {
        releaseDegraded("hidden-document", "hidden-document");
      }
    };
    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (!disposed) setReducedMotion(event.matches);
      if (event.matches && !contentReleased) bypass("reduced-motion");
    };
    const reconcileSemanticNavigation = () => {
      semanticNavigationTimer = null;
      if (disposed || !contentReleased) return;
      const trigger = pendingNavigationTrigger ?? "hashchange";
      const historyState =
        trigger === "popstate"
          ? pendingNavigationState
          : window.history.state;
      pendingNavigationTrigger = null;
      pendingNavigationState = undefined;
      const resolved = resolveCurrentDestination(historyState);
      void position(resolved, trigger).catch(() => undefined);
    };
    const scheduleSemanticNavigation = (
      trigger: "hashchange" | "popstate",
      historyState?: unknown,
    ) => {
      if (!contentReleased) return;
      if (trigger === "popstate" || pendingNavigationTrigger === null) {
        pendingNavigationTrigger = trigger;
        pendingNavigationState = historyState;
      }
      if (semanticNavigationTimer === null) {
        semanticNavigationTimer = window.setTimeout(
          reconcileSemanticNavigation,
          0,
        );
      }
    };
    const handleViewportChange = () => {
      if ((!contentReleased && !hasPositioned) || destinationRef === null) return;
      void position(destinationRef, "viewport-change").catch(() => undefined);
    };

    const handleHashChange = () => scheduleSemanticNavigation("hashchange");
    const handlePopState = (event: PopStateEvent) =>
      scheduleSemanticNavigation("popstate", event.state);

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionChange);

    const repeated = sessionWasCompleted();
    setReducedMotion(motionQuery.matches);
    setSessionRepeated(repeated);
    send({ type: "START" });

    deadlineTimer = window.setTimeout(() => {
      releaseDegraded("hard-timeout", "hard-timeout");
    }, timing.HARD_FAIL_OPEN);

    if (cssFailOpenAlreadyReleased) {
      queueMicrotask(() => {
        releaseDegraded("hard-timeout", "css-fail-open");
      });
    }

    void Promise.resolve()
      .then(async () => {
        if (scenario === "noncritical-failure") {
          throw new Error("Injected noncritical resource failure.");
        }
        await noncriticalProbe?.({
          root,
          signal: lifecycleController.signal,
        });
      })
      .catch(() => undefined);

    void (async () => {
      let criticalReady = false;
      let positioningStarted = false;
      try {
        if (scenario === "critical-failure") {
          throw new Error("Injected critical resource failure.");
        }
        if (scenario === "timeout") {
          await waitUntilAborted(criticalController.signal);
        }
        if (scenario === "slow-critical") {
          await waitForDelay(SLOW_CRITICAL_DELAY_MS, criticalController.signal);
        }
        verifyMountedCriticalSurface(root);
        if (typeof adapter.position !== "function") {
          throw new Error("The semantic positioning adapter is unavailable.");
        }
        await waitForFontsOrFallback(criticalController.signal);
        await criticalProbe?.({ root, signal: criticalController.signal });
        if (terminalRequested || disposed) return;

        criticalReady = true;
        send({ type: "CRITICAL_READY" });
        const resolved = resolveCurrentDestination();
        send({ type: "DESTINATION_RESOLVED" });
        positioningStarted = true;
        const result = await position(resolved, "initial");
        if (terminalRequested || disposed) return;

        replaceInitialHistory(result);
        send({ type: "POSITIONED" });
        const bypassVisual = motionQuery.matches || repeated;
        const minimumDuration = motionQuery.matches
          ? timing.REDUCED_MOTION
          : repeated
            ? timing.SESSION_REPEAT
            : timing.FIRST_ELIGIBLE_REVEAL;
        const remainingMinimum = Math.max(
          0,
          minimumDuration - (performance.now() - startedAt),
        );
        await waitForDelay(remainingMinimum, criticalController.signal);
        if (terminalRequested || disposed) return;

        await releaseRevealed(
          motionQuery.matches
            ? "reduced-motion"
            : repeated
              ? "session-repeat"
              : "normal",
          bypassVisual ? 0 : timing.REVEAL,
        );
      } catch (error) {
        if (isAbortError(error) || terminalRequested || disposed) return;
        releaseDegraded(
          positioningStarted && criticalReady
            ? "positioning-error"
            : "critical-resource-error",
          positioningStarted ? "positioning-error" : "critical-resource-error",
        );
      }
    })();

    if (document.visibilityState === "hidden") {
      queueMicrotask(handleVisibility);
    }

    return () => {
      disposed = true;
      terminalRequested = true;
      bypassRef.current = () => undefined;
      if (deadlineTimer !== null) window.clearTimeout(deadlineTimer);
      if (semanticNavigationTimer !== null) {
        window.clearTimeout(semanticNavigationTimer);
      }
      criticalController.abort();
      activePositionRequest?.controller.abort();
      lifecycleController.abort();
      releaseLocks();
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      serverCover?.removeEventListener("animationend", handleCssFailOpen);
      motionQuery.removeEventListener("change", handleMotionChange);
      if (window.__WFLYER_PHASE4_BOOTSTRAP__ === debug) {
        delete window.__WFLYER_PHASE4_BOOTSTRAP__;
      }
    };
  }, [adapter, criticalProbe, noncriticalProbe, scenario, timing]);

  const handleSkip = useCallback(() => bypassRef.current("skip"), []);

  return (
    <div
      className={styles.root}
      data-bootstrap-degraded-reason={readiness.degradedReason ?? "none"}
      data-bootstrap-destination={destination?.chapterId ?? "unresolved"}
      data-bootstrap-history-status={historyStatus}
      data-bootstrap-position-status={positionStatus}
      data-bootstrap-reduced-motion={String(reducedMotion)}
      data-bootstrap-release-cause={releaseCause ?? "pending"}
      data-bootstrap-scenario={scenario}
      data-bootstrap-session-repeated={String(sessionRepeated)}
      data-bootstrap-source={destination?.source ?? "unresolved"}
      data-bootstrap-state={readiness.phase}
      data-bootstrap-trace={readiness.phase}
      data-story-bootstrap="phase-4"
      ref={rootRef}
    >
      {coverVisible ? (
        <div
          className={styles.cover}
          data-bootstrap-cover=""
          data-revealing={String(coverRevealing)}
        >
          <div aria-hidden="true" className={styles.stage}>
            <OfficialBrandSymbol className={styles.symbol} decorative />
            <span className={styles.wordmark}>W_Flyer</span>
            <span className={styles.pulse} />
          </div>
          <button
            className={styles.skip}
            data-bootstrap-skip=""
            onClick={handleSkip}
            ref={skipRef}
            type="button"
          >
            Pular introdução
          </button>
        </div>
      ) : null}
      {children}
    </div>
  );
}
