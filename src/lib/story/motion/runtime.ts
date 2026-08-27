import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  createStaticNativeStoryPositioningAdapter,
  mergeStoryHistoryState,
  readStoryHistoryChapterId,
  type StoryPositioningOptions,
  type StoryPositioningResult,
  type StoryProjectionMode,
} from "../bootstrap";
import {
  DESKTOP_TIMELINE_ORDER,
  HEADER_NAVIGATION_ORDER,
  STORY_CHAPTER_BY_ID,
} from "../manifest";
import type { StoryChapterId, StoryTimelineLabel } from "../types";
import {
  closestStoryChapter,
  measureStoryTimelineGeometry,
  storyProgressToNativeScroll,
  type StoryTimelineGeometry,
} from "./geometry";
import {
  resolveStoryProjectionMode,
  type StoryProjectionDecision,
} from "./eligibility";
import {
  HEADER_TRAVERSAL_TIMING,
  resolveHeaderTraversalDuration,
} from "./traversal";

gsap.registerPlugin(ScrollTrigger);

const MOTION_SCROLL_TRIGGER_ID = "wflyer-phase-5-master-story";
const HEADER_NAVIGATION_TARGETS: ReadonlySet<StoryChapterId> = new Set(
  HEADER_NAVIGATION_ORDER,
);

interface MotionStoryElements {
  readonly root: HTMLElement;
  readonly stage: HTMLElement;
  readonly track: HTMLElement;
}

interface MotionStoryDiagnosticElements {
  readonly activeChapter: HTMLElement | null;
  readonly homeProgress: HTMLElement | null;
  readonly lifecycle: HTMLElement | null;
  readonly progress: HTMLElement | null;
  readonly projection: HTMLElement | null;
}

export type HeaderTraversalCancelReason =
  | "escape"
  | "hidden-document"
  | "keyboard"
  | "pointer"
  | "positioning"
  | "projection-rebuild"
  | "superseded"
  | "teardown"
  | "touch"
  | "wheel";

export type HeaderTraversalStatus =
  | "cancelled"
  | "completed"
  | "no-op"
  | "superseded";

export type HeaderTraversalState = HeaderTraversalStatus | "idle" | "running";

export interface HeaderTraversalResult {
  readonly cancelReason: HeaderTraversalCancelReason | null;
  readonly distance: number;
  readonly durationSeconds: number;
  readonly status: HeaderTraversalStatus;
  readonly targetChapterId: StoryChapterId;
}

export interface MotionStoryRuntimeSnapshot {
  readonly activeTraversalTargetId: StoryChapterId | null;
  readonly activeChapterId: StoryChapterId;
  readonly cleanupCount: number;
  readonly destroyed: boolean;
  readonly destroyCount: number;
  readonly homeProgress: number | null;
  readonly lastTraversalCancelReason: HeaderTraversalCancelReason | null;
  readonly lastCancelledTraversalReason: HeaderTraversalCancelReason | null;
  readonly lastTraversalDistance: number | null;
  readonly lastTraversalDurationSeconds: number | null;
  readonly lastTraversalStatus: HeaderTraversalState;
  readonly labelOrder: readonly StoryTimelineLabel[];
  readonly labelProgress: Readonly<Partial<Record<StoryTimelineLabel, number>>>;
  readonly mountCount: number;
  readonly ownedScrollTriggerCount: number;
  readonly ownedTimelineCount: number;
  readonly ownedTraversalCount: number;
  readonly scrollTriggerDestroyCount: number;
  readonly timelineDestroyCount: number;
  readonly totalCleanupCount: number;
  readonly traversalCancelCount: number;
  readonly traversalCompleteCount: number;
  readonly progress: number;
  readonly projectionMode: StoryProjectionMode;
  readonly projectionReason: StoryProjectionDecision["reason"];
  readonly rebuildCount: number;
  readonly visibility: DocumentVisibilityState;
}

export interface MotionStoryRuntime {
  readonly projectionMode: StoryProjectionMode;
  destroy(): void;
  navigate(chapterId: StoryChapterId): Promise<HeaderTraversalResult>;
  position(
    chapterId: StoryChapterId,
    options?: StoryPositioningOptions,
  ): Promise<StoryPositioningResult>;
  rebuildPreservingActiveChapter(
    requestedChapterId: StoryChapterId,
    options?: StoryPositioningOptions,
  ): Promise<StoryPositioningResult>;
  snapshot(): MotionStoryRuntimeSnapshot;
}

export interface CreateMotionStoryRuntimeOptions extends MotionStoryElements {
  readonly forceBuildFailure?: boolean;
  readonly onActiveChapterChange?: (chapterId: StoryChapterId) => void;
  readonly onRequestRemount?: () => void;
}

interface DebugController {
  readonly destroyForReplacement: () => MotionStoryRuntimeSnapshot;
  readonly navigate: (
    chapterId: StoryChapterId,
  ) => Promise<HeaderTraversalResult>;
  readonly position: (chapterId: StoryChapterId) => Promise<void>;
  readonly rebuild: () => Promise<void>;
  readonly remountForReview: () => void;
  readonly snapshot: () => MotionStoryRuntimeSnapshot;
}

interface MotionStoryLifecycleLedger {
  cleanupCount: number;
  destroyCount: number;
  mountCount: number;
  scrollTriggerDestroyCount: number;
  timelineDestroyCount: number;
}

interface ActiveHeaderTraversal {
  readonly distance: number;
  readonly durationSeconds: number;
  readonly releaseHistoryWriteSuppression: () => void;
  readonly releaseImmediateScroll: () => void;
  readonly resolve: (result: HeaderTraversalResult) => void;
  readonly targetChapterId: StoryChapterId;
  settled: boolean;
  tween: gsap.core.Tween | null;
}

const STORY_SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ",
  "Spacebar",
]);

declare global {
  interface Window {
    __WFLYER_PHASE5_MOTION__?: DebugController;
    __WFLYER_PHASE5_MOTION_LIFECYCLE__?: MotionStoryLifecycleLedger;
  }
}

function abortError(): DOMException {
  return new DOMException("Motion story work was aborted.", "AbortError");
}

function assertNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted === true) throw abortError();
}

function isEditableKeyboardTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement)
  );
}

function acquireImmediateNativeScroll(): () => void {
  const style = document.documentElement.style;
  const previousValue = style.getPropertyValue("scroll-behavior");
  const previousPriority = style.getPropertyPriority("scroll-behavior");
  style.setProperty("scroll-behavior", "auto", "important");
  let released = false;

  return () => {
    if (released) return;
    released = true;
    if (previousValue === "") {
      style.removeProperty("scroll-behavior");
    } else {
      style.setProperty("scroll-behavior", previousValue, previousPriority);
    }
  };
}

function storyHistoryUrl(chapterId: StoryChapterId): string {
  const url = new URL(window.location.href);
  const hash = STORY_CHAPTER_BY_ID[chapterId].hash;

  url.hash = hash ?? "";
  return `${url.pathname}${url.search}${url.hash}`;
}

function waitForFrame(signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);
    let frame = 0;
    const handleAbort = () => {
      window.cancelAnimationFrame(frame);
      reject(abortError());
    };
    signal?.addEventListener("abort", handleAbort, { once: true });
    frame = window.requestAnimationFrame(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    });
  });
}

function waitForDelay(
  milliseconds: number,
  signal: AbortSignal | undefined,
): Promise<void> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);
    let timer = 0;
    const handleAbort = () => {
      window.clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener("abort", handleAbort, { once: true });
    timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, milliseconds);
  });
}

function chapterElementsFor(root: ParentNode): Map<StoryChapterId, HTMLElement> {
  const elements = new Map<StoryChapterId, HTMLElement>();

  for (const element of root.querySelectorAll<HTMLElement>("[data-chapter-id]")) {
    const chapterId = element.dataset.chapterId as StoryChapterId | undefined;
    if (chapterId !== undefined) elements.set(chapterId, element);
  }

  return elements;
}

function currentProjectionSignals() {
  const visualViewport = window.visualViewport;

  return {
    anyFinePointer: window.matchMedia("(any-pointer: fine)").matches,
    height: Math.min(
      window.innerHeight,
      visualViewport?.height ?? window.innerHeight,
    ),
    hoverCapable: window.matchMedia("(hover: hover)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    width: Math.min(
      document.documentElement.clientWidth,
      visualViewport?.width ?? document.documentElement.clientWidth,
    ),
  };
}

function currentVerticalChapter(
  elements: ReadonlyMap<StoryChapterId, HTMLElement>,
): StoryChapterId {
  const viewportCenter = window.innerHeight / 2;
  let active: StoryChapterId = "home";
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const [chapterId, element] of elements) {
    const bounds = element.getBoundingClientRect();
    const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);
    if (distance < closestDistance) {
      active = chapterId;
      closestDistance = distance;
    }
  }

  return active;
}

export function createMotionStoryRuntime({
  forceBuildFailure = false,
  onActiveChapterChange = () => undefined,
  onRequestRemount = () => undefined,
  root,
  stage,
  track,
}: CreateMotionStoryRuntimeOptions): MotionStoryRuntime {
  window.__WFLYER_PHASE5_MOTION__?.destroyForReplacement();

  const diagnostics: MotionStoryDiagnosticElements = {
    activeChapter: root.querySelector('[data-motion-diagnostic="active-chapter"]'),
    homeProgress: root.querySelector('[data-motion-diagnostic="home-progress"]'),
    lifecycle: root.querySelector('[data-motion-diagnostic="lifecycle"]'),
    progress: root.querySelector('[data-motion-diagnostic="progress"]'),
    projection: root.querySelector('[data-motion-diagnostic="projection"]'),
  };
  const staticAdapter = createStaticNativeStoryPositioningAdapter({ root });
  const lifecycleLedger =
    window.__WFLYER_PHASE5_MOTION_LIFECYCLE__ ??
    {
      cleanupCount: 0,
      destroyCount: 0,
      mountCount: 0,
      scrollTriggerDestroyCount: 0,
      timelineDestroyCount: 0,
    };
  lifecycleLedger.scrollTriggerDestroyCount ??= 0;
  lifecycleLedger.timelineDestroyCount ??= 0;
  lifecycleLedger.mountCount += 1;
  window.__WFLYER_PHASE5_MOTION_LIFECYCLE__ = lifecycleLedger;
  const chapterElements = chapterElementsFor(track);
  const mediaQueries = [
    window.matchMedia("(any-pointer: fine)"),
    window.matchMedia("(hover: hover)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ] as const;
  let decision = resolveStoryProjectionMode(currentProjectionSignals());
  let geometry: StoryTimelineGeometry | null = null;
  let timeline: gsap.core.Timeline | null = null;
  let scrollTrigger: ScrollTrigger | null = null;
  let destroyed = false;
  let progress = 0;
  let activeChapterId: StoryChapterId = "home";
  let cleanupCount = 0;
  let projectionDirty = false;
  let rebuildCount = 0;
  let scrollFrame = 0;
  let preservationReleaseTimer = 0;
  let preservedViewportChapter: StoryChapterId | null = null;
  let semanticPriorityChapter: StoryChapterId | null = null;
  let semanticPriorityTimer = 0;
  let visibility: DocumentVisibilityState = document.visibilityState;
  let debugController: DebugController | null = null;
  let activeTraversal: ActiveHeaderTraversal | null = null;
  let historyWriteSuppressionCount = 0;
  let lastReportedChapterId: StoryChapterId | null = null;
  let lastTraversalCancelReason: HeaderTraversalCancelReason | null = null;
  let lastCancelledTraversalReason: HeaderTraversalCancelReason | null = null;
  let lastTraversalDistance: number | null = null;
  let lastTraversalDurationSeconds: number | null = null;
  let lastTraversalStatus: HeaderTraversalState = "idle";
  let traversalCancelCount = 0;
  let traversalCompleteCount = 0;

  const acquireHistoryWriteSuppression = () => {
    historyWriteSuppressionCount += 1;
    let released = false;

    return () => {
      if (released) return;
      released = true;
      historyWriteSuppressionCount = Math.max(
        0,
        historyWriteSuppressionCount - 1,
      );
    };
  };

  const bootstrapAllowsPhase6History = () => {
    const bootstrapRoot = root.closest<HTMLElement>("[data-story-bootstrap]");
    const state = bootstrapRoot?.dataset.bootstrapState;
    return state === "DEGRADED" || state === "REVEALED";
  };

  const replacePassiveHistory = (chapterId: StoryChapterId) => {
    if (
      destroyed ||
      historyWriteSuppressionCount > 0 ||
      activeTraversal !== null ||
      !bootstrapAllowsPhase6History()
    ) {
      return;
    }

    const chapterHash = STORY_CHAPTER_BY_ID[chapterId].hash;
    if (
      readStoryHistoryChapterId(window.history.state) === chapterId &&
      window.location.hash === (chapterHash ?? "")
    ) {
      return;
    }

    try {
      window.history.replaceState(
        mergeStoryHistoryState(window.history.state, chapterId),
        "",
        storyHistoryUrl(chapterId),
      );
      root.dataset.motionHistory = `replace:${chapterId}`;
    } catch {
      root.dataset.motionHistory = "replace-failed";
    }
  };

  const pushExplicitHistory = (chapterId: StoryChapterId) => {
    try {
      window.history.pushState(
        mergeStoryHistoryState(window.history.state, chapterId),
        "",
        storyHistoryUrl(chapterId),
      );
      root.dataset.motionHistory = `push:${chapterId}`;
    } catch {
      root.dataset.motionHistory = "push-failed";
    }
  };

  const updateTraversalDiagnostics = (
    status: HeaderTraversalState,
    targetChapterId: StoryChapterId | null,
    cancelReason: HeaderTraversalCancelReason | null,
  ) => {
    lastTraversalStatus = status;
    lastTraversalCancelReason = cancelReason;
    root.dataset.motionTraversalState = status;
    root.dataset.motionTraversalTarget = targetChapterId ?? "none";
    root.dataset.motionTraversalCancelReason = cancelReason ?? "none";
  };

  const updateDiagnostics = (nextProgress: number, chapterId: StoryChapterId) => {
    progress = Math.min(1, Math.max(0, nextProgress));
    activeChapterId = chapterId;
    root.dataset.motionActiveChapter = chapterId;
    root.dataset.motionProgress = progress.toFixed(6);
    diagnostics.progress?.replaceChildren(progress.toFixed(4));
    diagnostics.activeChapter?.replaceChildren(chapterId);
    if (lastReportedChapterId !== chapterId) {
      lastReportedChapterId = chapterId;
      onActiveChapterChange(chapterId);
      replacePassiveHistory(chapterId);
    }
  };

  const applyDecision = (nextDecision: StoryProjectionDecision) => {
    decision = nextDecision;
    root.dataset.projectionMode = decision.mode;
    root.dataset.projectionReason = decision.reason;
    diagnostics.projection?.replaceChildren(decision.mode);
  };

  const teardownOwnedDriver = () => {
    const ownedTrigger = scrollTrigger;
    const ownedTimeline = timeline;
    scrollTrigger = null;
    timeline = null;
    geometry = null;

    if (ownedTrigger !== null) {
      // ScrollTrigger kills its attached animation by default. Preserve it
      // here so the runtime explicitly destroys each owned resource once.
      ownedTrigger.kill(true, true);
      lifecycleLedger.scrollTriggerDestroyCount += 1;
    }
    if (ownedTimeline !== null) {
      ownedTimeline.kill();
      lifecycleLedger.timelineDestroyCount += 1;
    }
    if (ownedTrigger !== null || ownedTimeline !== null) {
      cleanupCount += 1;
      lifecycleLedger.cleanupCount += 1;
    }
    gsap.set(track, { clearProps: "transform" });
  };

  const updateVerticalDiagnostics = () => {
    if (destroyed || decision.mode === "horizontal-enhanced") return;
    const maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    updateDiagnostics(
      Math.min(1, Math.max(0, window.scrollY / maxScroll)),
      currentVerticalChapter(chapterElements),
    );
  };

  const handleScroll = () => {
    if (decision.mode === "horizontal-enhanced" || scrollFrame !== 0) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateVerticalDiagnostics();
    });
  };

  const buildOwnedDriver = () => {
    teardownOwnedDriver();
    delete root.dataset.motionFailure;
    applyDecision(resolveStoryProjectionMode(currentProjectionSignals()));
    projectionDirty = false;

    if (decision.mode !== "horizontal-enhanced") {
      diagnostics.homeProgress?.replaceChildren("vertical-native");
      updateVerticalDiagnostics();
      return;
    }

    try {
      if (forceBuildFailure) {
        throw new Error("Injected Phase-5 master-story failure.");
      }

      geometry = measureStoryTimelineGeometry({
        chapterElements,
        trackWidth: track.scrollWidth,
        viewportWidth: stage.clientWidth,
      });
      if (geometry.travel <= 0) {
        throw new Error("The horizontal story has no measurable travel.");
      }

      const nextTimeline = gsap.timeline({ paused: true });
      nextTimeline.to(
        track,
        { duration: 1, ease: "none", x: -geometry.travel },
        0,
      );
      for (const chapter of geometry.chapters) {
        nextTimeline.addLabel(chapter.timelineLabel, chapter.progress);
      }
      timeline = nextTimeline;

      const nextTrigger = ScrollTrigger.create({
        animation: nextTimeline,
        anticipatePin: 1,
        end: `+=${geometry.travel}`,
        id: MOTION_SCROLL_TRIGGER_ID,
        invalidateOnRefresh: false,
        onUpdate: ({ progress: triggerProgress }) => {
          const currentGeometry = geometry;
          if (currentGeometry === null) return;
          updateDiagnostics(
            triggerProgress,
            closestStoryChapter(currentGeometry, triggerProgress),
          );
        },
        pin: stage,
        scrub: true,
        start: "top top",
        trigger: stage,
      });
      scrollTrigger = nextTrigger;
      diagnostics.homeProgress?.replaceChildren(
        geometry.homeProgress.toFixed(6),
      );
      root.dataset.motionHomeProgress = geometry.homeProgress.toFixed(6);
      nextTrigger.refresh();
      updateDiagnostics(
        nextTrigger.progress,
        closestStoryChapter(geometry, nextTrigger.progress),
      );
    } catch {
      teardownOwnedDriver();
      applyDecision({
        mode: "vertical-wide",
        reason: "driver-failure",
      });
      root.dataset.motionFailure = "driver-build";
      diagnostics.homeProgress?.replaceChildren("fallback-vertical");
      updateVerticalDiagnostics();
    }
  };

  const activeSemanticChapter = () => {
    return activeChapterId;
  };

  const currentNativeProgress = () => {
    if (geometry !== null && scrollTrigger !== null) {
      scrollTrigger.update();
      return Math.min(1, Math.max(0, scrollTrigger.progress));
    }

    const maximumScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    return Math.min(1, Math.max(0, window.scrollY / maximumScroll));
  };

  const nativeTargetForChapter = (chapterId: StoryChapterId) => {
    if (geometry !== null && scrollTrigger !== null) {
      const targetProgress = geometry.chapterById[chapterId].progress;
      return {
        nativeScroll: storyProgressToNativeScroll(
          targetProgress,
          scrollTrigger.start,
          scrollTrigger.end,
        ),
        targetProgress,
      };
    }

    const maximumScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const target = chapterElements.get(chapterId);
    const nativeScroll =
      chapterId === "home" || target === undefined
        ? 0
        : Math.min(
            maximumScroll,
            Math.max(0, window.scrollY + target.getBoundingClientRect().top),
          );

    return {
      nativeScroll,
      targetProgress: maximumScroll === 0 ? 0 : nativeScroll / maximumScroll,
    };
  };

  const applyNativeScroll = (
    nativeScroll: number,
    targetChapterId?: StoryChapterId,
    targetProgress?: number,
  ) => {
    window.scrollTo({ behavior: "auto", left: 0, top: nativeScroll });

    if (geometry !== null && scrollTrigger !== null) {
      scrollTrigger.update();
      if (targetChapterId !== undefined && targetProgress !== undefined) {
        timeline?.progress(targetProgress);
        updateDiagnostics(targetProgress, targetChapterId);
      }
    } else {
      updateVerticalDiagnostics();
      if (targetChapterId !== undefined && targetProgress !== undefined) {
        updateDiagnostics(targetProgress, targetChapterId);
      }
    }
  };

  const settleHeaderTraversal = (
    traversal: ActiveHeaderTraversal,
    status: HeaderTraversalStatus,
    cancelReason: HeaderTraversalCancelReason | null,
  ) => {
    if (traversal.settled) return;
    traversal.settled = true;
    if (activeTraversal === traversal) activeTraversal = null;

    const ownedTween = traversal.tween;
    traversal.tween = null;
    if (status !== "completed" && ownedTween !== null) ownedTween.kill();
    traversal.releaseImmediateScroll();
    traversal.releaseHistoryWriteSuppression();
    lastTraversalDistance = traversal.distance;
    lastTraversalDurationSeconds = traversal.durationSeconds;
    updateTraversalDiagnostics(status, traversal.targetChapterId, cancelReason);

    if (status === "completed") {
      traversalCompleteCount += 1;
      pushExplicitHistory(traversal.targetChapterId);
    } else {
      traversalCancelCount += 1;
      lastCancelledTraversalReason = cancelReason;
      if (geometry !== null && scrollTrigger !== null) {
        scrollTrigger.update();
      } else {
        updateVerticalDiagnostics();
      }
      replacePassiveHistory(activeChapterId);
    }

    traversal.resolve(
      Object.freeze({
        cancelReason,
        distance: traversal.distance,
        durationSeconds: traversal.durationSeconds,
        status,
        targetChapterId: traversal.targetChapterId,
      }),
    );
  };

  const cancelActiveHeaderTraversal = (
    reason: HeaderTraversalCancelReason,
  ) => {
    const traversal = activeTraversal;
    if (traversal === null) return false;
    settleHeaderTraversal(
      traversal,
      reason === "superseded" ? "superseded" : "cancelled",
      reason,
    );
    return true;
  };

  const navigate = async (
    targetChapterId: StoryChapterId,
  ): Promise<HeaderTraversalResult> => {
    if (!HEADER_NAVIGATION_TARGETS.has(targetChapterId)) {
      throw new RangeError(
        `Story chapter "${targetChapterId}" is not an approved header target.`,
      );
    }

    if (destroyed) {
      return Object.freeze({
        cancelReason: "teardown" as const,
        distance: 0,
        durationSeconds: 0,
        status: "cancelled" as const,
        targetChapterId,
      });
    }

    cancelActiveHeaderTraversal("superseded");
    const { nativeScroll, targetProgress } =
      nativeTargetForChapter(targetChapterId);
    const currentProgress = currentNativeProgress();
    const distance = Math.abs(targetProgress - currentProgress);
    const currentScroll = window.scrollY;

    if (Math.abs(nativeScroll - currentScroll) < 1) {
      applyNativeScroll(nativeScroll, targetChapterId, targetProgress);
      replacePassiveHistory(targetChapterId);
      lastTraversalDistance = distance;
      lastTraversalDurationSeconds = 0;
      root.dataset.motionTraversalDistance = distance.toFixed(6);
      root.dataset.motionTraversalDuration = "0.000000";
      updateTraversalDiagnostics("no-op", targetChapterId, null);
      return Object.freeze({
        cancelReason: null,
        distance,
        durationSeconds: 0,
        status: "no-op" as const,
        targetChapterId,
      });
    }

    if (decision.mode === "static") {
      const releaseHistoryWriteSuppression =
        acquireHistoryWriteSuppression();
      const releaseImmediateScroll = acquireImmediateNativeScroll();
      try {
        applyNativeScroll(nativeScroll, targetChapterId, targetProgress);
      } finally {
        releaseImmediateScroll();
        releaseHistoryWriteSuppression();
      }
      pushExplicitHistory(targetChapterId);
      traversalCompleteCount += 1;
      lastTraversalDistance = distance;
      lastTraversalDurationSeconds = 0;
      root.dataset.motionTraversalDistance = distance.toFixed(6);
      root.dataset.motionTraversalDuration = "0.000000";
      updateTraversalDiagnostics("completed", targetChapterId, null);
      return Object.freeze({
        cancelReason: null,
        distance,
        durationSeconds: 0,
        status: "completed" as const,
        targetChapterId,
      });
    }

    const durationSeconds = resolveHeaderTraversalDuration(distance);
    const scrollProxy = { nativeScroll: currentScroll };
    const releaseImmediateScroll = acquireImmediateNativeScroll();
    const releaseHistoryWriteSuppression = acquireHistoryWriteSuppression();
    lastTraversalDistance = distance;
    lastTraversalDurationSeconds = durationSeconds;
    root.dataset.motionTraversalDistance = distance.toFixed(6);
    root.dataset.motionTraversalDuration = durationSeconds.toFixed(6);
    updateTraversalDiagnostics("running", targetChapterId, null);

    return new Promise<HeaderTraversalResult>((resolve) => {
      const traversal: ActiveHeaderTraversal = {
        distance,
        durationSeconds,
        releaseHistoryWriteSuppression,
        releaseImmediateScroll,
        resolve,
        settled: false,
        targetChapterId,
        tween: null,
      };
      activeTraversal = traversal;
      try {
        traversal.tween = gsap.to(scrollProxy, {
          duration: durationSeconds,
          ease: HEADER_TRAVERSAL_TIMING.ease,
          nativeScroll,
          onComplete: () => {
            applyNativeScroll(nativeScroll, targetChapterId, targetProgress);
            settleHeaderTraversal(traversal, "completed", null);
          },
          onInterrupt: () => {
            settleHeaderTraversal(traversal, "cancelled", "positioning");
          },
          onUpdate: () => {
            applyNativeScroll(scrollProxy.nativeScroll);
          },
        });
      } catch {
        settleHeaderTraversal(traversal, "cancelled", "positioning");
      }
    });
  };

  const position = async (
    requestedChapterId: StoryChapterId,
    options: StoryPositioningOptions = {},
  ): Promise<StoryPositioningResult> => {
    assertNotAborted(options.signal);
    cancelActiveHeaderTraversal("positioning");
    const releaseHistoryWriteSuppression = acquireHistoryWriteSuppression();
    try {
      if (options.intent === "semantic-navigation") {
        semanticPriorityChapter = requestedChapterId;
        root.dataset.motionSemanticPriority = requestedChapterId;
        if (semanticPriorityTimer !== 0) {
          window.clearTimeout(semanticPriorityTimer);
        }
        semanticPriorityTimer = window.setTimeout(() => {
          semanticPriorityTimer = 0;
          semanticPriorityChapter = null;
          delete root.dataset.motionSemanticPriority;
        }, 1_000);
      }
      if (projectionDirty) {
        // A semantic hash/history request may supersede the bootstrap viewport
        // request during the same resize burst. It still owns the destination,
        // but must first rebuild stale physical geometry for the new viewport.
        await waitForDelay(240, options.signal);
        assertNotAborted(options.signal);
        buildOwnedDriver();
      }
      const target = chapterElements.get(requestedChapterId);
      const positionedChapterId =
        target === undefined ? "home" : requestedChapterId;

      if (geometry === null || scrollTrigger === null) {
        const result = await staticAdapter.position(positionedChapterId, options);
        updateVerticalDiagnostics();
        return {
          ...result,
          requestedChapterId,
          fallbackToHome: target === undefined,
          projectionMode: decision.mode,
        };
      }

      const chapter = geometry.chapterById[positionedChapterId];
      const nativeScroll = storyProgressToNativeScroll(
        chapter.progress,
        scrollTrigger.start,
        scrollTrigger.end,
      );
      scrollTrigger.scroll(nativeScroll);
      scrollTrigger.update();
      timeline?.progress(chapter.progress);
      updateDiagnostics(chapter.progress, positionedChapterId);
      await waitForFrame(options.signal);
      await waitForFrame(options.signal);

      return {
        requestedChapterId,
        positionedChapterId,
        fallbackToHome: target === undefined,
        projectionMode: decision.mode,
      };
    } finally {
      releaseHistoryWriteSuppression();
    }
  };

  const rebuildPreservingActiveChapter = async (
    requestedChapterId: StoryChapterId,
    options: StoryPositioningOptions = {},
  ): Promise<StoryPositioningResult> => {
    assertNotAborted(options.signal);
    cancelActiveHeaderTraversal("projection-rebuild");
    const preservedChapterId =
      semanticPriorityChapter ??
      preservedViewportChapter ??
      activeSemanticChapter();
    preservedViewportChapter = preservedChapterId;
    if (preservationReleaseTimer !== 0) {
      window.clearTimeout(preservationReleaseTimer);
    }
    // ScrollTrigger batches its global resize refresh at 0.2 s. Rebuild after
    // that bounded window so the old pin cannot restore a stale scroll value
    // over the semantic position selected by the new projection.
    await waitForDelay(240, options.signal);
    assertNotAborted(options.signal);
    rebuildCount += 1;
    buildOwnedDriver();
    const result = await position(preservedChapterId, options);
    preservationReleaseTimer = window.setTimeout(() => {
      preservationReleaseTimer = 0;
      preservedViewportChapter = null;
      delete root.dataset.motionPreservedChapter;
    }, 120);

    return {
      ...result,
      requestedChapterId,
      positionedChapterId: preservedChapterId,
      fallbackToHome: false,
    };
  };

  const handleMediaChange = () => {
    projectionDirty = true;
    void rebuildPreservingActiveChapter(activeSemanticChapter()).catch(
      () => undefined,
    );
  };
  const handleViewportCapture = () => {
    cancelActiveHeaderTraversal("projection-rebuild");
    projectionDirty = true;
    preservedViewportChapter ??= activeChapterId;
    root.dataset.motionPreservedChapter = preservedViewportChapter;
  };
  const handleVisibilityChange = () => {
    visibility = document.visibilityState;
    root.dataset.motionVisibility = visibility;
    if (visibility === "hidden") {
      cancelActiveHeaderTraversal("hidden-document");
    } else {
      scrollTrigger?.refresh();
    }
  };

  const handleWheelIntent = () => {
    cancelActiveHeaderTraversal("wheel");
  };
  const handleTouchIntent = () => {
    cancelActiveHeaderTraversal("touch");
  };
  const handlePointerIntent = (event: PointerEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest("[data-story-navigation-target]") !== null
    ) {
      return;
    }
    cancelActiveHeaderTraversal("pointer");
  };
  const handleKeyboardIntent = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      cancelActiveHeaderTraversal("escape");
      return;
    }
    if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !isEditableKeyboardTarget(event.target) &&
      STORY_SCROLL_KEYS.has(event.key)
    ) {
      cancelActiveHeaderTraversal("keyboard");
    }
  };

  const snapshot = (): MotionStoryRuntimeSnapshot => {
    const labelProgress: Partial<Record<StoryTimelineLabel, number>> = {};
    if (geometry !== null) {
      for (const chapter of geometry.chapters) {
        labelProgress[chapter.timelineLabel] = chapter.progress;
      }
    }

    return Object.freeze({
      activeTraversalTargetId: activeTraversal?.targetChapterId ?? null,
      activeChapterId,
      cleanupCount,
      destroyed,
      destroyCount: lifecycleLedger.destroyCount,
      homeProgress: geometry?.homeProgress ?? null,
      lastTraversalCancelReason,
      lastCancelledTraversalReason,
      lastTraversalDistance,
      lastTraversalDurationSeconds,
      lastTraversalStatus,
      labelOrder: Object.freeze(
        DESKTOP_TIMELINE_ORDER.map(
          (chapterId) =>
            chapterElements.get(chapterId)?.dataset.storyTimelineLabel as StoryTimelineLabel,
        ),
      ),
      labelProgress: Object.freeze(labelProgress),
      mountCount: lifecycleLedger.mountCount,
      ownedScrollTriggerCount: ScrollTrigger.getAll().filter(
        ({ vars }) => vars.id === MOTION_SCROLL_TRIGGER_ID,
      ).length,
      ownedTimelineCount: timeline === null ? 0 : 1,
      ownedTraversalCount: activeTraversal === null ? 0 : 1,
      progress,
      projectionMode: decision.mode,
      projectionReason: decision.reason,
      rebuildCount,
      scrollTriggerDestroyCount:
        lifecycleLedger.scrollTriggerDestroyCount,
      timelineDestroyCount: lifecycleLedger.timelineDestroyCount,
      totalCleanupCount: lifecycleLedger.cleanupCount,
      traversalCancelCount,
      traversalCompleteCount,
      visibility,
    });
  };

  const runtime: MotionStoryRuntime = {
    get projectionMode() {
      return decision.mode;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      cancelActiveHeaderTraversal("teardown");
      lifecycleLedger.destroyCount += 1;
      if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame);
      if (preservationReleaseTimer !== 0) {
        window.clearTimeout(preservationReleaseTimer);
      }
      if (semanticPriorityTimer !== 0) {
        window.clearTimeout(semanticPriorityTimer);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheelIntent);
      window.removeEventListener("touchstart", handleTouchIntent);
      window.removeEventListener("touchmove", handleTouchIntent);
      window.removeEventListener("pointerdown", handlePointerIntent);
      window.removeEventListener("keydown", handleKeyboardIntent, true);
      window.removeEventListener("resize", handleViewportCapture, true);
      window.removeEventListener(
        "orientationchange",
        handleViewportCapture,
        true,
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      for (const query of mediaQueries) {
        query.removeEventListener("change", handleMediaChange);
      }
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportCapture,
        true,
      );
      teardownOwnedDriver();
      diagnostics.lifecycle?.replaceChildren("destroyed");
      root.dataset.motionLifecycle = "destroyed";
      if (window.__WFLYER_PHASE5_MOTION__ === debugController) {
        delete window.__WFLYER_PHASE5_MOTION__;
      }
    },
    navigate,
    position,
    rebuildPreservingActiveChapter,
    snapshot,
  };

  debugController = {
    destroyForReplacement() {
      runtime.destroy();
      return snapshot();
    },
    navigate,
    async position(chapterId) {
      await position(chapterId);
    },
    async rebuild() {
      await rebuildPreservingActiveChapter(activeSemanticChapter());
    },
    remountForReview: onRequestRemount,
    snapshot,
  };
  window.__WFLYER_PHASE5_MOTION__ = debugController;
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("wheel", handleWheelIntent, { passive: true });
  window.addEventListener("touchstart", handleTouchIntent, { passive: true });
  window.addEventListener("touchmove", handleTouchIntent, { passive: true });
  window.addEventListener("pointerdown", handlePointerIntent, {
    passive: true,
  });
  window.addEventListener("keydown", handleKeyboardIntent, true);
  window.addEventListener("resize", handleViewportCapture, true);
  window.addEventListener("orientationchange", handleViewportCapture, true);
  window.visualViewport?.addEventListener(
    "resize",
    handleViewportCapture,
    true,
  );
  document.addEventListener("visibilitychange", handleVisibilityChange);
  for (const query of mediaQueries) {
    query.addEventListener("change", handleMediaChange);
  }
  updateTraversalDiagnostics("idle", null, null);
  buildOwnedDriver();
  diagnostics.lifecycle?.replaceChildren("mounted");
  root.dataset.motionLifecycle = "mounted";
  root.dataset.motionVisibility = visibility;

  return runtime;
}
