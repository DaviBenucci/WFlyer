"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import {
  classifyScoreTransition,
  createCleanupRegistry,
  createInitialNavigationLifecycleState,
  evaluateLinkEligibility,
  getTransitionDurationMs,
  navigationLifecycleReducer,
  NAVIGATION_TIMING_MS,
  nextNavigationRequestId,
  normalizePathname,
  scheduleRecoveryTimeout,
  type AnchorPoint,
  type CleanupRegistry,
  type NavigationRecoveryReason,
  type NavigationRequest,
  type ScoreTransition,
  type TransitionDirection,
  type TransitionMode,
} from "@/lib/motion";

import {
  ScoreTransitionLayer,
  type ScoreTransitionGeometry,
  type ViewportPoint,
} from "./ScoreTransitionLayer";
import styles from "./experience.module.css";

gsap.registerPlugin(useGSAP);

type TestCheckpoint = "completion" | "midpoint" | "start";
type NavigationMethod = "history" | "push" | "replace";

interface RuntimeRequest {
  readonly cleanup: CleanupRegistry;
  readonly href: string;
  readonly navigation: NavigationRequest;
  readonly sourcePoint: ViewportPoint | null;
  committed: boolean;
  forceAnimationFailure: boolean;
  forceDirect: boolean;
  forceTimeout: boolean;
  method: NavigationMethod;
  pending: RuntimeRequest | null;
  routeRequested: boolean;
  safetyArmed: boolean;
  safetyCleanup: (() => void) | null;
  timeline: gsap.core.Timeline | null;
}

interface TransitionPresentation {
  readonly active: boolean;
  readonly checkpoint: TestCheckpoint | null;
  readonly destinationPathname: string | null;
  readonly direction: TransitionDirection;
  readonly geometry: ScoreTransitionGeometry | null;
  readonly mode: TransitionMode;
  readonly navigationSource: NavigationRequest["source"] | null;
  readonly reducedMotion: boolean;
  readonly requestId: number | null;
  readonly result:
    | "animation-error"
    | "cancelled"
    | "idle"
    | "recovered"
    | "success";
  readonly sourcePathname: string | null;
  readonly timelineCount: 0 | 1;
}

export interface TransitionTestSnapshot {
  readonly active: boolean;
  readonly checkpoint: TestCheckpoint | null;
  readonly destinationPathname: string | null;
  readonly direction: TransitionDirection;
  readonly mode: TransitionMode;
  readonly phase: string;
  readonly requestId: number | null;
  readonly sourcePathname: string | null;
}

export interface TransitionTestController {
  readonly failNext: () => void;
  readonly holdAt: (checkpoint: TestCheckpoint | null) => void;
  readonly interrupt: () => void;
  readonly release: () => void;
  readonly snapshot: () => TransitionTestSnapshot;
  readonly timeoutNext: () => void;
}

declare global {
  interface Window {
    __WFLYER_TRANSITION_TEST__?: TransitionTestController;
  }
}

export interface SiteExperienceShellProps {
  readonly children: ReactNode;
  readonly testMode?: boolean;
}

const INITIAL_PRESENTATION: TransitionPresentation = {
  active: false,
  checkpoint: null,
  destinationPathname: null,
  direction: "none",
  geometry: null,
  mode: "neutral",
  navigationSource: null,
  reducedMotion: false,
  requestId: null,
  result: "idle",
  sourcePathname: null,
  timelineCount: 0,
};

const ROUTE_REQUEST_DELAY_MS = Math.min(
  56,
  NAVIGATION_TIMING_MS.prepareMaximum,
);
const PRESENTATION_SETTLE_RESERVE_MS = 64;

function currentViewport(): { readonly height: number; readonly width: number } {
  return {
    height: Math.max(1, window.innerHeight),
    width: Math.max(1, document.documentElement.clientWidth),
  };
}

function visibleElement<T extends Element>(elements: Iterable<T>): T | null {
  for (const element of elements) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    if (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0
    ) {
      return element;
    }
  }

  return null;
}

function pointFromSvgMarker(marker: SVGGraphicsElement | null): ViewportPoint | null {
  if (!marker) {
    return null;
  }

  const matrix = marker.getScreenCTM();

  if (!matrix) {
    return null;
  }

  const circle = marker instanceof SVGCircleElement ? marker : null;
  const x = circle?.cx.baseVal.value ?? 0;
  const y = circle?.cy.baseVal.value ?? 0;
  const point = new DOMPoint(x, y).matrixTransform(matrix);

  return Number.isFinite(point.x) && Number.isFinite(point.y)
    ? { x: point.x, y: point.y }
    : null;
}

function measureScoreAnchor(
  chapterId: string,
  anchor: "entry" | "exit",
): ViewportPoint | null {
  const main = document.querySelector<HTMLElement>("main#main-content");

  if (!main) {
    return null;
  }

  if (chapterId === "home") {
    const score = visibleElement(
      main.querySelectorAll<SVGSVGElement>("[data-origin-score] svg"),
    );

    return pointFromSvgMarker(
      score?.querySelector<SVGGraphicsElement>(
        '[data-score-anchor="origin"]',
      ) ?? null,
    );
  }

  const primaryScore = visibleElement(
    main.querySelectorAll<SVGSVGElement>(
      `[data-score-chapter="${CSS.escape(chapterId)}"][data-score-placement]`,
    ),
  );

  return pointFromSvgMarker(
    primaryScore?.querySelector<SVGGraphicsElement>(
      `[data-score-anchor="${anchor}"]`,
    ) ?? null,
  );
}

function measureHomePivot(viewport: {
  readonly height: number;
  readonly width: number;
}): ViewportPoint {
  const pivot = visibleElement(
    document.querySelectorAll<HTMLElement>("[data-home-pivot]"),
  );
  const rect = pivot?.getBoundingClientRect();

  return rect
    ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    : { x: viewport.width / 2, y: Math.min(120, viewport.height * 0.14) };
}

function edgeFallbackPoint(
  edge: "center" | "left" | "right",
  anchorY: number,
  viewport: { readonly height: number; readonly width: number },
): ViewportPoint {
  return {
    x:
      edge === "left"
        ? 0
        : edge === "right"
          ? viewport.width
          : viewport.width / 2,
    y: viewport.height * Math.min(1, Math.max(0, anchorY)),
  };
}

function movesAwayFromHome(transition: ScoreTransition): boolean {
  const sourceCoordinate = transition.sourceChapter?.coordinate ?? 0;
  const destinationCoordinate =
    transition.destinationChapter?.coordinate ?? 0;

  return Math.abs(destinationCoordinate) > Math.abs(sourceCoordinate);
}

function sourceAnchorKind(
  transition: ScoreTransition,
): "entry" | "exit" {
  if (transition.mode === "home-pivot") {
    return "entry";
  }

  return movesAwayFromHome(transition) ? "exit" : "entry";
}

function destinationAnchorKind(
  transition: ScoreTransition,
): "entry" | "exit" {
  if (transition.mode === "home-pivot") {
    return "entry";
  }

  return movesAwayFromHome(transition) ? "entry" : "exit";
}

function fallbackSourcePoint(
  transition: ScoreTransition,
  viewport: { readonly height: number; readonly width: number },
): ViewportPoint {
  const chapter = transition.sourceChapter;

  if (!chapter) {
    return { x: viewport.width / 2, y: viewport.height / 2 };
  }

  const kind = sourceAnchorKind(transition);

  return edgeFallbackPoint(
    kind === "entry" ? chapter.entry_edge : chapter.exit_edge,
    kind === "entry" ? chapter.entry_anchor_y : chapter.exit_anchor_y,
    viewport,
  );
}

function fallbackDestinationPoint(
  transition: ScoreTransition,
  viewport: { readonly height: number; readonly width: number },
): ViewportPoint {
  const chapter = transition.destinationChapter;

  if (!chapter) {
    return { x: viewport.width / 2, y: viewport.height / 2 };
  }

  const kind = destinationAnchorKind(transition);

  return edgeFallbackPoint(
    kind === "entry" ? chapter.entry_edge : chapter.exit_edge,
    kind === "entry" ? chapter.entry_anchor_y : chapter.exit_anchor_y,
    viewport,
  );
}

function resolveGeometry(
  transition: ScoreTransition,
  sourcePoint: ViewportPoint | null,
  destinationPoint?: ViewportPoint | null,
): ScoreTransitionGeometry {
  const viewport = currentViewport();

  return {
    height: viewport.height,
    pivot: measureHomePivot(viewport),
    source: sourcePoint ?? fallbackSourcePoint(transition, viewport),
    target:
      destinationPoint ?? fallbackDestinationPoint(transition, viewport),
    width: viewport.width,
  };
}

function transitionHref(absoluteHref: string): string {
  const url = new URL(absoluteHref);
  return `${url.pathname}${url.search}${url.hash}`;
}

function incomingOffset(
  direction: TransitionDirection,
  distance: number,
): number {
  if (direction === "left") {
    return -distance;
  }

  if (direction === "right") {
    return distance;
  }

  return 0;
}

function outgoingOffset(
  direction: TransitionDirection,
  distance: number,
): number {
  return -incomingOffset(direction, distance);
}

function reportAnimationError(error: unknown): void {
  console.error("W_Flyer chapter transition failed; using safe fallback.", error);
}

export function SiteExperienceShell({
  children,
  testMode = false,
}: SiteExperienceShellProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const shellRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const activeRequestRef = useRef<RuntimeRequest | null>(null);
  const previousPathnameRef = useRef(normalizePathname(pathname));
  const historyNavigationRef = useRef(false);
  const requestIdRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const holdCheckpointRef = useRef<TestCheckpoint | null>(null);
  const releaseCheckpointRef = useRef<(() => void) | null>(null);
  const failNextRef = useRef(false);
  const timeoutNextRef = useRef(false);
  const presentationRef = useRef(INITIAL_PRESENTATION);
  const lifecycleStateRef = useRef(
    createInitialNavigationLifecycleState(),
  );
  const [lifecycleState, dispatchLifecycle] = useReducer(
    navigationLifecycleReducer,
    undefined,
    createInitialNavigationLifecycleState,
  );
  const [presentation, setPresentationState] = useState(
    INITIAL_PRESENTATION,
  );
  useGSAP({ scope: shellRef });

  useEffect(() => {
    lifecycleStateRef.current = lifecycleState;
  }, [lifecycleState]);

  const setPresentation = (
    update:
      | TransitionPresentation
      | ((current: TransitionPresentation) => TransitionPresentation),
  ): void => {
    if (!mountedRef.current) {
      return;
    }

    setPresentationState((current) => {
      const next = typeof update === "function" ? update(current) : update;
      presentationRef.current = next;
      return next;
    });
  };

  const revealCurrentContent = (): void => {
    const main = document.querySelector<HTMLElement>("main#main-content");

    if (main) {
      gsap.set(main, {
        clearProps: "opacity,transform,visibility,will-change",
      });
    }

    const layer = document.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );

    if (layer) {
      gsap.set(layer, { clearProps: "opacity,visibility" });
    }
  };

  const flushRequest = (request: RuntimeRequest): void => {
    request.timeline?.kill();
    request.timeline = null;

    try {
      request.cleanup.flush();
    } catch (error) {
      reportAnimationError(error);
    }

    revealCurrentContent();
  };

  const moveFocusAfterNavigation = (request: RuntimeRequest): void => {
    if (request.navigation.source !== "link") {
      return;
    }

    const main = document.querySelector<HTMLElement>("main#main-content");

    window.scrollTo({ behavior: "auto", left: 0, top: 0 });
    if (main) {
      main.dataset.navigationFocus = "true";
      main.addEventListener(
        "blur",
        () => {
          delete main.dataset.navigationFocus;
        },
        { once: true },
      );
    }
    main?.focus({ preventScroll: true });
  };

  const finishRequest = (
    request: RuntimeRequest,
    result: TransitionPresentation["result"],
    recoveryReason?: NavigationRecoveryReason,
  ): void => {
    if (activeRequestRef.current?.navigation.requestId !== request.navigation.requestId) {
      return;
    }

    releaseCheckpointRef.current = null;
    flushRequest(request);
    moveFocusAfterNavigation(request);

    if (recoveryReason) {
      dispatchLifecycle({
        reason: recoveryReason,
        requestId: request.navigation.requestId,
        type: "recovery-requested",
      });
      dispatchLifecycle({
        requestId: request.navigation.requestId,
        type: "recovery-completed",
      });
    } else {
      dispatchLifecycle({
        requestId: request.navigation.requestId,
        type: "settling-started",
      });
      dispatchLifecycle({
        requestId: request.navigation.requestId,
        type: "settled",
      });
    }

    activeRequestRef.current = null;
    setPresentation((current) => ({
      ...current,
      active: false,
      checkpoint: null,
      geometry: null,
      result,
      timelineCount: 0,
    }));
  };

  const armSafetyTimeout = (request: RuntimeRequest): void => {
    if (request.safetyArmed) {
      return;
    }

    request.safetyArmed = true;
    const clearTimeout = scheduleRecoveryTimeout(() => {
      if (
        !mountedRef.current ||
        activeRequestRef.current?.navigation.requestId !==
          request.navigation.requestId
      ) {
        return;
      }

      const latestRequest = request.pending ?? request;

      if (request.committed) {
        finishRequest(request, "recovered", "timeout");
        return;
      }

      flushRequest(request);
      activeRequestRef.current = null;
      window.location.assign(latestRequest.href);
    });

    request.safetyCleanup = clearTimeout;
    request.cleanup.add(clearTimeout);
  };

  const pauseSafetyForCheckpoint = (request: RuntimeRequest): void => {
    request.safetyCleanup?.();
    request.safetyCleanup = null;
    request.safetyArmed = false;
  };

  const completeOrHold = (request: RuntimeRequest): void => {
    if (holdCheckpointRef.current === "completion" && testMode) {
      pauseSafetyForCheckpoint(request);
      request.timeline?.pause();
      setPresentation((current) => ({
        ...current,
        checkpoint: "completion",
        timelineCount: 0,
      }));
      releaseCheckpointRef.current = () => {
        holdCheckpointRef.current = null;
        finishRequest(request, "success");
      };
      return;
    }

    finishRequest(request, "success");
  };

  const animateIncoming = (request: RuntimeRequest): void => {
    if (
      !mountedRef.current ||
      activeRequestRef.current?.navigation.requestId !==
        request.navigation.requestId
    ) {
      return;
    }

    if (request.forceTimeout) {
      setPresentation((current) => ({
        ...current,
        active: false,
        timelineCount: 0,
      }));
      revealCurrentContent();
      return;
    }

    if (request.forceAnimationFailure) {
      finishRequest(request, "animation-error", "animation-error");
      return;
    }

    const main = document.querySelector<HTMLElement>("main#main-content");

    if (!main) {
      finishRequest(request, "recovered", "measurement-error");
      return;
    }

    const reduced = request.navigation.reducedMotion || request.forceDirect;
    const mobile = window.matchMedia("(max-width: 47.999rem)").matches;
    const targetDurationMs = mobile && !reduced
      ? 440
      : getTransitionDurationMs(request.navigation.transition.mode, reduced);
    const elapsedMs = performance.now() - request.navigation.requestedAt;
    const durationMs = Math.max(
      reduced ? 1 : 120,
      targetDurationMs - elapsedMs - PRESENTATION_SETTLE_RESERVE_MS,
    );
    const duration = durationMs / 1_000;
    const distance = mobile
      ? 12
      : Math.min(
          window.innerWidth * 0.18,
          Math.max(window.innerWidth * 0.08, window.innerWidth * 0.1),
        );
    const x = incomingOffset(
      request.navigation.transition.direction,
      distance,
    );
    const layer = document.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );
    const lines = layer?.querySelectorAll<SVGPathElement>(
      "[data-transition-staff-line]",
    );
    const notes = layer?.querySelectorAll<SVGGElement>(
      "[data-transition-note]",
    );

    try {
      const animationContext = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: () => {
            completeOrHold(request);
          },
          paused: true,
        });
        request.timeline = timeline;
        request.cleanup.add(() => {
          timeline.kill();
        });

        gsap.set(main, { opacity: 0, willChange: "transform,opacity" });

        if (!reduced && !mobile && lines && lines.length > 0) {
          gsap.set(lines, { strokeDashoffset: 0.92 });
          gsap.set(notes ?? [], { opacity: 0, scale: 0.86 });
          timeline.to(
            lines,
            {
              duration: duration * 0.62,
              ease: "power2.inOut",
              stagger: 0.012,
              strokeDashoffset: 0,
            },
            0,
          );
          timeline.to(
            notes ?? [],
            {
              duration: duration * 0.24,
              ease: "power2.out",
              opacity: 0.76,
              scale: 1,
              stagger: 0.025,
            },
            duration * 0.16,
          );
        }

        timeline.fromTo(
          main,
          {
            opacity: reduced ? 0 : 0.38,
            x: reduced ? 0 : x,
            y: mobile && !reduced ? 8 : 0,
          },
          {
            duration: reduced ? duration : duration * 0.62,
            ease: "power3.out",
            opacity: 1,
            x: 0,
            y: 0,
          },
          reduced ? 0 : duration * 0.18,
        );

        if (!reduced && !mobile && layer) {
          timeline.to(
            layer,
            {
              duration: duration * 0.2,
              ease: "power2.out",
              opacity: 0,
            },
            duration * 0.8,
          );
        }

        timeline.to({}, { duration }, 0);
        setPresentation((current) => ({
          ...current,
          timelineCount: 1,
        }));

        if (holdCheckpointRef.current === "midpoint" && testMode) {
          pauseSafetyForCheckpoint(request);
          timeline.progress(0.5).pause();
          setPresentation((current) => ({
            ...current,
            checkpoint: "midpoint",
          }));
          releaseCheckpointRef.current = () => {
            holdCheckpointRef.current = null;
            setPresentation((current) => ({ ...current, checkpoint: null }));
            armSafetyTimeout(request);
            timeline.play();
          };
        } else {
          timeline.play(0);
        }
      }, shellRef);
      request.cleanup.add(() => {
        animationContext.revert();
      });
    } catch (error) {
      reportAnimationError(error);
      finishRequest(request, "animation-error", "animation-error");
    }
  };

  const prepareIncoming = (request: RuntimeRequest): void => {
    const transition = request.navigation.transition;
    const chapter = transition.destinationChapter;
    const measuredDestination = chapter
      ? measureScoreAnchor(chapter.id, destinationAnchorKind(transition))
      : null;
    const geometry = resolveGeometry(
      transition,
      request.sourcePoint,
      measuredDestination,
    );

    setPresentation((current) => ({
      ...current,
      active:
        !request.navigation.reducedMotion &&
        transition.mode !== "neutral" &&
        window.innerWidth >= 768,
      checkpoint: null,
      geometry,
    }));

    const frame = window.requestAnimationFrame(() => {
      animateIncoming(request);
    });
    request.cleanup.add(() => {
      window.cancelAnimationFrame(frame);
    });
  };

  const requestRoute = (
    request: RuntimeRequest,
    method: Exclude<NavigationMethod, "history">,
  ): void => {
    if (
      !mountedRef.current ||
      activeRequestRef.current?.navigation.requestId !==
        request.navigation.requestId
    ) {
      return;
    }

    request.routeRequested = true;
    request.method = method;
    dispatchLifecycle({
      requestId: request.navigation.requestId,
      type: "route-requested",
    });
    armSafetyTimeout(request);

    try {
      router[method](request.href, { scroll: false });
    } catch (error) {
      reportAnimationError(error);
      flushRequest(request);
      activeRequestRef.current = null;
      window.location.assign(request.href);
    }
  };

  const animateOutgoing = (request: RuntimeRequest): void => {
    if (
      !mountedRef.current ||
      activeRequestRef.current?.navigation.requestId !==
        request.navigation.requestId
    ) {
      return;
    }

    const main = document.querySelector<HTMLElement>("main#main-content");

    if (!main || request.forceAnimationFailure) {
      return;
    }

    const mobile = window.matchMedia("(max-width: 47.999rem)").matches;
    const distance = mobile
      ? 12
      : Math.min(window.innerWidth * 0.18, Math.max(80, window.innerWidth * 0.1));
    const x = outgoingOffset(
      request.navigation.transition.direction,
      distance,
    );
    const layer = document.querySelector<HTMLElement>(
      "[data-score-transition-layer]",
    );
    const lines = layer?.querySelectorAll<SVGPathElement>(
      "[data-transition-staff-line]",
    );

    try {
      const animationContext = gsap.context(() => {
        const timeline = gsap.timeline({ paused: true });
        request.timeline = timeline;
        request.cleanup.add(() => {
          timeline.kill();
        });
        gsap.set(main, { willChange: "transform,opacity" });
        timeline.to(
          main,
          {
            duration: 0.18,
            ease: "power2.out",
            opacity: request.navigation.reducedMotion ? 0.76 : 0.82,
            x: request.navigation.reducedMotion ? 0 : x,
          },
          0,
        );

        if (
          !request.navigation.reducedMotion &&
          !mobile &&
          lines &&
          lines.length > 0
        ) {
          timeline.to(
            lines,
            {
              duration: 0.18,
              ease: "power1.out",
              strokeDashoffset: 0.56,
            },
            0,
          );
        }

        timeline.play(0);
        setPresentation((current) => ({
          ...current,
          timelineCount: 1,
        }));
      }, shellRef);
      request.cleanup.add(() => {
        animationContext.revert();
      });
    } catch (error) {
      request.forceAnimationFailure = true;
      reportAnimationError(error);
    }
  };

  const startRequest = (
    request: RuntimeRequest,
    method: Exclude<NavigationMethod, "history">,
    alreadyDispatched = false,
  ): void => {
    activeRequestRef.current = request;

    if (!alreadyDispatched) {
      dispatchLifecycle({ type: "request", request: request.navigation });
    }

    dispatchLifecycle({
      requestId: request.navigation.requestId,
      type: "outgoing-started",
    });

    setPresentation({
      active:
        !request.navigation.reducedMotion &&
        request.navigation.transition.mode !== "neutral" &&
        window.innerWidth >= 768,
      checkpoint:
        holdCheckpointRef.current === "start" && testMode ? "start" : null,
      destinationPathname: request.navigation.destinationPathname,
      direction: request.navigation.transition.direction,
      geometry: resolveGeometry(
        request.navigation.transition,
        request.sourcePoint,
      ),
      mode: request.navigation.transition.mode,
      navigationSource: request.navigation.source,
      reducedMotion: request.navigation.reducedMotion,
      requestId: request.navigation.requestId,
      result: "idle",
      sourcePathname: request.navigation.sourcePathname,
      timelineCount: 0,
    });

    const continueRequest = (): void => {
      const frame = window.requestAnimationFrame(() => {
        animateOutgoing(request);
      });
      request.cleanup.add(() => {
        window.cancelAnimationFrame(frame);
      });

      const routeTimer = window.setTimeout(() => {
        requestRoute(request, method);
      }, ROUTE_REQUEST_DELAY_MS);
      request.cleanup.add(() => {
        window.clearTimeout(routeTimer);
      });
    };

    if (holdCheckpointRef.current === "start" && testMode) {
      releaseCheckpointRef.current = () => {
        holdCheckpointRef.current = null;
        setPresentation((current) => ({ ...current, checkpoint: null }));
        armSafetyTimeout(request);
        continueRequest();
      };
    } else {
      armSafetyTimeout(request);
      continueRequest();
    }
  };

  const createRuntimeRequest = (
    transition: ScoreTransition,
    href: string,
    source: NavigationRequest["source"],
    method: NavigationMethod,
    sourcePoint?: AnchorPoint | null,
  ): RuntimeRequest => {
    const requestId = nextNavigationRequestId(requestIdRef.current);
    requestIdRef.current = requestId;
    const navigation: NavigationRequest = {
      destinationPathname: transition.destinationPathname,
      reducedMotion: reducedMotionRef.current,
      requestId,
      requestedAt: performance.now(),
      source,
      sourcePathname: transition.sourcePathname,
      transition,
    };

    return {
      cleanup: createCleanupRegistry(),
      committed: method === "history",
      forceAnimationFailure: failNextRef.current,
      forceDirect: false,
      forceTimeout: timeoutNextRef.current,
      href,
      method,
      navigation,
      pending: null,
      routeRequested: method === "history",
      safetyArmed: false,
      safetyCleanup: null,
      sourcePoint: sourcePoint ?? null,
      timeline: null,
    };
  };

  const supersedeRequest = (
    active: RuntimeRequest,
    pending: RuntimeRequest,
  ): void => {
    failNextRef.current = false;
    timeoutNextRef.current = false;
    dispatchLifecycle({ type: "request", request: pending.navigation });

    if (active.routeRequested && !active.committed) {
      active.pending?.cleanup.flush();
      active.pending = pending;
      active.timeline?.kill();
      active.timeline = null;
      setPresentation((current) => ({
        ...current,
        destinationPathname: pending.navigation.destinationPathname,
        direction: pending.navigation.transition.direction,
        geometry: resolveGeometry(
          pending.navigation.transition,
          pending.sourcePoint,
        ),
        mode: pending.navigation.transition.mode,
        requestId: pending.navigation.requestId,
        timelineCount: 0,
      }));
      return;
    }

    flushRequest(active);
    dispatchLifecycle({
      requestId: active.navigation.requestId,
      type: "recovery-completed",
    });
    startRequest(
      pending,
      active.committed ? "replace" : "push",
      true,
    );
  };

  const handleNavigationClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ): void => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest<HTMLAnchorElement>("a[href]");

    if (!anchor) {
      return;
    }

    const active = activeRequestRef.current;
    const sourceUrl =
      active && !active.committed
        ? new URL(active.navigation.sourcePathname, window.location.origin)
        : window.location.href;
    const eligibility = evaluateLinkEligibility(
      {
        altKey: event.altKey,
        button: event.button,
        ctrlKey: event.ctrlKey,
        defaultPrevented: event.defaultPrevented,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      },
      {
        download: anchor.hasAttribute("download"),
        href: anchor.getAttribute("href"),
        target: anchor.getAttribute("target"),
      },
      sourceUrl,
    );

    if (!eligibility.eligible) {
      return;
    }

    event.preventDefault();
    const transition = eligibility.transition;
    const sourceChapter = transition.sourceChapter;
    const sourcePoint = sourceChapter
      ? measureScoreAnchor(sourceChapter.id, sourceAnchorKind(transition))
      : null;
    const runtime = createRuntimeRequest(
      transition,
      transitionHref(eligibility.destinationHref),
      "link",
      "push",
      active && !active.committed ? active.sourcePoint : sourcePoint,
    );
    failNextRef.current = false;
    timeoutNextRef.current = false;

    if (active) {
      supersedeRequest(active, runtime);
      return;
    }

    startRequest(runtime, "push");
  };

  const beginHistoryTransition = (
    sourcePathname: string,
    destinationPathname: string,
  ): void => {
    const transition = classifyScoreTransition(
      sourcePathname,
      destinationPathname,
    );
    const runtime = createRuntimeRequest(
      transition,
      destinationPathname,
      "history",
      "history",
      null,
    );

    activeRequestRef.current = runtime;
    dispatchLifecycle({ type: "request", request: runtime.navigation });
    dispatchLifecycle({
      requestId: runtime.navigation.requestId,
      type: "outgoing-started",
    });
    dispatchLifecycle({
      requestId: runtime.navigation.requestId,
      type: "route-requested",
    });
    dispatchLifecycle({
      requestId: runtime.navigation.requestId,
      type: "route-committed",
    });
    armSafetyTimeout(runtime);

    setPresentation({
      active:
        !runtime.navigation.reducedMotion &&
        transition.mode !== "neutral" &&
        window.innerWidth >= 768,
      checkpoint: null,
      destinationPathname,
      direction: transition.direction,
      geometry: resolveGeometry(transition, null),
      mode: transition.mode,
      navigationSource: "history",
      reducedMotion: runtime.navigation.reducedMotion,
      requestId: runtime.navigation.requestId,
      result: "idle",
      sourcePathname,
      timelineCount: 0,
    });
    prepareIncoming(runtime);
  };

  const handlePathnameChange = useEffectEvent((nextPathname: string): void => {
    const normalizedPathname = normalizePathname(nextPathname);
    const previousPathname = previousPathnameRef.current;

    if (normalizedPathname === previousPathname) {
      return;
    }

    previousPathnameRef.current = normalizedPathname;
    const active = activeRequestRef.current;

    if (
      active &&
      normalizedPathname === active.navigation.destinationPathname
    ) {
      active.committed = true;

      if (active.pending) {
        const pending = active.pending;
        active.pending = null;
        flushRequest(active);
        dispatchLifecycle({
          requestId: active.navigation.requestId,
          type: "recovery-completed",
        });
        startRequest(pending, "replace", true);
        return;
      }

      dispatchLifecycle({
        requestId: active.navigation.requestId,
        type: "route-committed",
      });
      active.timeline?.kill();
      active.timeline = null;
      prepareIncoming(active);
      historyNavigationRef.current = false;
      return;
    }

    if (active) {
      flushRequest(active);
      dispatchLifecycle({
        reason: "route-mismatch",
        requestId: active.navigation.requestId,
        type: "recovery-requested",
      });
      dispatchLifecycle({
        requestId: active.navigation.requestId,
        type: "recovery-completed",
      });
      activeRequestRef.current = null;
    }

    if (historyNavigationRef.current) {
      historyNavigationRef.current = false;
      beginHistoryTransition(previousPathname, normalizedPathname);
    }
  });

  useLayoutEffect(() => {
    handlePathnameChange(pathname);
  }, [pathname]);

  const flushRequestFromEffect = useEffectEvent(flushRequest);
  const finishRequestFromEffect = useEffectEvent(finishRequest);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const active = activeRequestRef.current;

      if (active) {
        flushRequestFromEffect(active);
      }

      activeRequestRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = (matches: boolean): void => {
      reducedMotionRef.current = matches;
      setPresentation((current) => ({
        ...current,
        reducedMotion: matches,
      }));
    };
    const handlePreferenceChange = (event: MediaQueryListEvent): void => {
      applyPreference(event.matches);
      const active = activeRequestRef.current;

      if (!active) {
        return;
      }

      active.timeline?.kill();
      active.timeline = null;
      active.forceDirect = true;
      setPresentation((current) => ({
        ...current,
        active: false,
        checkpoint: null,
        timelineCount: 0,
      }));

      if (active.committed) {
        finishRequestFromEffect(active, "recovered", "preference-change");
      }
    };

    applyPreference(mediaQuery.matches);
    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  useEffect(() => {
    const handlePopState = (): void => {
      historyNavigationRef.current = true;
    };
    const handleVisibilityChange = (): void => {
      if (document.visibilityState !== "hidden") {
        return;
      }

      const active = activeRequestRef.current;

      if (!active) {
        return;
      }

      active.forceDirect = true;
      active.timeline?.kill();
      active.timeline = null;
      setPresentation((current) => ({
        ...current,
        active: false,
        timelineCount: 0,
      }));

      if (active.committed) {
        finishRequestFromEffect(active, "recovered", "cancelled");
      }
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !testMode) {
      return;
    }

    const controller: TransitionTestController = {
      failNext: () => {
        failNextRef.current = true;
      },
      holdAt: (checkpoint) => {
        holdCheckpointRef.current = checkpoint;
      },
      interrupt: () => {
        const active = activeRequestRef.current;

        if (active) {
          finishRequestFromEffect(active, "cancelled", "cancelled");
        }
      },
      release: () => {
        const release = releaseCheckpointRef.current;
        releaseCheckpointRef.current = null;
        release?.();
      },
      snapshot: () => {
        const current = presentationRef.current;

        return {
          active: current.active,
          checkpoint: current.checkpoint,
          destinationPathname: current.destinationPathname,
          direction: current.direction,
          mode: current.mode,
          phase: lifecycleStateRef.current.phase,
          requestId: current.requestId,
          sourcePathname: current.sourcePathname,
        };
      },
      timeoutNext: () => {
        timeoutNextRef.current = true;
      },
    };

    window.__WFLYER_TRANSITION_TEST__ = controller;

    return () => {
      if (window.__WFLYER_TRANSITION_TEST__ === controller) {
        delete window.__WFLYER_TRANSITION_TEST__;
      }
    };
  }, [testMode]);

  return (
    <div
      className={styles.experienceShell}
      data-active-timelines={presentation.timelineCount}
      data-scroll-locked="false"
      data-site-experience=""
      data-transition-active={presentation.active ? "true" : "false"}
      data-transition-destination={
        presentation.destinationPathname ?? "none"
      }
      data-transition-direction={presentation.direction}
      data-transition-mode={presentation.mode}
      data-transition-phase={lifecycleState.phase}
      data-transition-reduced-motion={
        presentation.reducedMotion ? "true" : "false"
      }
      data-transition-request-id={presentation.requestId ?? "none"}
      data-transition-result={presentation.result}
      data-transition-source={presentation.sourcePathname ?? "none"}
      data-transition-source-kind={presentation.navigationSource ?? "none"}
      onClickCapture={handleNavigationClick}
      ref={shellRef}
    >
      <ScoreTransitionLayer
        active={presentation.active}
        checkpoint={presentation.checkpoint}
        direction={presentation.direction}
        geometry={presentation.geometry}
        mode={presentation.mode}
        reducedMotion={presentation.reducedMotion}
      />
      {children}
    </div>
  );
}
