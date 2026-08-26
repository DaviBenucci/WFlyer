import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  createStaticNativeStoryPositioningAdapter,
  type StoryPositioningOptions,
  type StoryPositioningResult,
  type StoryProjectionMode,
} from "../bootstrap";
import { DESKTOP_TIMELINE_ORDER } from "../manifest";
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

gsap.registerPlugin(ScrollTrigger);

const MOTION_SCROLL_TRIGGER_ID = "wflyer-phase-5-master-story";

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

export interface MotionStoryRuntimeSnapshot {
  readonly activeChapterId: StoryChapterId;
  readonly cleanupCount: number;
  readonly destroyed: boolean;
  readonly destroyCount: number;
  readonly homeProgress: number | null;
  readonly labelOrder: readonly StoryTimelineLabel[];
  readonly labelProgress: Readonly<Partial<Record<StoryTimelineLabel, number>>>;
  readonly mountCount: number;
  readonly ownedScrollTriggerCount: number;
  readonly ownedTimelineCount: number;
  readonly scrollTriggerDestroyCount: number;
  readonly timelineDestroyCount: number;
  readonly totalCleanupCount: number;
  readonly progress: number;
  readonly projectionMode: StoryProjectionMode;
  readonly projectionReason: StoryProjectionDecision["reason"];
  readonly rebuildCount: number;
  readonly visibility: DocumentVisibilityState;
}

export interface MotionStoryRuntime {
  readonly projectionMode: StoryProjectionMode;
  destroy(): void;
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
  readonly onRequestRemount?: () => void;
}

interface DebugController {
  readonly destroyForReplacement: () => MotionStoryRuntimeSnapshot;
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

  const updateDiagnostics = (nextProgress: number, chapterId: StoryChapterId) => {
    progress = Math.min(1, Math.max(0, nextProgress));
    activeChapterId = chapterId;
    root.dataset.motionActiveChapter = chapterId;
    root.dataset.motionProgress = progress.toFixed(6);
    diagnostics.progress?.replaceChildren(progress.toFixed(4));
    diagnostics.activeChapter?.replaceChildren(chapterId);
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

  const position = async (
    requestedChapterId: StoryChapterId,
    options: StoryPositioningOptions = {},
  ): Promise<StoryPositioningResult> => {
    assertNotAborted(options.signal);
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
    const positionedChapterId = target === undefined ? "home" : requestedChapterId;

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
  };

  const rebuildPreservingActiveChapter = async (
    requestedChapterId: StoryChapterId,
    options: StoryPositioningOptions = {},
  ): Promise<StoryPositioningResult> => {
    assertNotAborted(options.signal);
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
    projectionDirty = true;
    preservedViewportChapter ??= activeChapterId;
    root.dataset.motionPreservedChapter = preservedViewportChapter;
  };
  const handleVisibilityChange = () => {
    visibility = document.visibilityState;
    root.dataset.motionVisibility = visibility;
    if (visibility === "visible") scrollTrigger?.refresh();
  };

  const snapshot = (): MotionStoryRuntimeSnapshot => {
    const labelProgress: Partial<Record<StoryTimelineLabel, number>> = {};
    if (geometry !== null) {
      for (const chapter of geometry.chapters) {
        labelProgress[chapter.timelineLabel] = chapter.progress;
      }
    }

    return Object.freeze({
      activeChapterId,
      cleanupCount,
      destroyed,
      destroyCount: lifecycleLedger.destroyCount,
      homeProgress: geometry?.homeProgress ?? null,
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
      progress,
      projectionMode: decision.mode,
      projectionReason: decision.reason,
      rebuildCount,
      scrollTriggerDestroyCount:
        lifecycleLedger.scrollTriggerDestroyCount,
      timelineDestroyCount: lifecycleLedger.timelineDestroyCount,
      totalCleanupCount: lifecycleLedger.cleanupCount,
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
      lifecycleLedger.destroyCount += 1;
      if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame);
      if (preservationReleaseTimer !== 0) {
        window.clearTimeout(preservationReleaseTimer);
      }
      if (semanticPriorityTimer !== 0) {
        window.clearTimeout(semanticPriorityTimer);
      }
      window.removeEventListener("scroll", handleScroll);
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
    position,
    rebuildPreservingActiveChapter,
    snapshot,
  };

  debugController = {
    destroyForReplacement() {
      runtime.destroy();
      return snapshot();
    },
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
  buildOwnedDriver();
  diagnostics.lifecycle?.replaceChildren("mounted");
  root.dataset.motionLifecycle = "mounted";
  root.dataset.motionVisibility = visibility;

  return runtime;
}
