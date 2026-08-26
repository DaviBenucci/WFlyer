import type { StoryChapterId } from "../types";

export type StoryProjectionMode =
  | "horizontal-enhanced"
  | "vertical-wide"
  | "vertical-compact"
  | "static";

export interface StoryPositioningOptions {
  /**
   * Phase 5 uses this semantic intent to distinguish destination resolution
   * from a viewport rebuild that must retain the currently active chapter.
   */
  readonly intent?:
    | "position-destination"
    | "preserve-active-chapter"
    | "semantic-navigation";
  readonly signal?: AbortSignal;
}

export interface StoryPositioningResult {
  readonly requestedChapterId: StoryChapterId;
  readonly positionedChapterId: StoryChapterId;
  readonly fallbackToHome: boolean;
  readonly projectionMode: StoryProjectionMode;
}

/**
 * Semantic positioning seam. A caller names a chapter; the active projection
 * alone owns the physical coordinate that represents it.
 */
export interface StoryPositioningAdapter {
  readonly projectionMode: StoryProjectionMode;
  position(
    chapterId: StoryChapterId,
    options?: StoryPositioningOptions,
  ): Promise<StoryPositioningResult>;
}

export interface StoryFrameScheduler {
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
}

export interface StaticNativeStoryPositioningAdapterOptions {
  readonly root?: ParentNode;
  readonly frameScheduler?: StoryFrameScheduler;
}

export class StoryPositioningError extends Error {
  override readonly name = "StoryPositioningError";
}

interface ScrollBehaviorLock {
  count: number;
  readonly originalValue: string;
  readonly originalPriority: string;
}

const SCROLL_BEHAVIOR_LOCKS = new WeakMap<Document, ScrollBehaviorLock>();

function createAbortError(): DOMException {
  return new DOMException("Story positioning was aborted.", "AbortError");
}

function assertNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted === true) {
    throw createAbortError();
  }
}

function resolveRoot(root: ParentNode | undefined): ParentNode {
  if (root !== undefined) {
    return root;
  }

  if (typeof document === "undefined") {
    throw new StoryPositioningError("The story document is unavailable.");
  }

  return document;
}

function ownerDocumentFor(root: ParentNode): Document {
  if (root.nodeType === Node.DOCUMENT_NODE) {
    return root as Document;
  }

  const ownerDocument = (root as Node).ownerDocument;

  if (ownerDocument === null) {
    throw new StoryPositioningError("The story root has no owner document.");
  }

  return ownerDocument;
}

function resolveFrameScheduler(
  documentNode: Document,
  injectedScheduler: StoryFrameScheduler | undefined,
): StoryFrameScheduler {
  if (injectedScheduler !== undefined) {
    return injectedScheduler;
  }

  const view = documentNode.defaultView;

  if (view === null || typeof view.requestAnimationFrame !== "function") {
    throw new StoryPositioningError(
      "The story projection has no animation-frame scheduler.",
    );
  }

  return {
    requestAnimationFrame: view.requestAnimationFrame.bind(view),
    cancelAnimationFrame: view.cancelAnimationFrame.bind(view),
  };
}

function acquireImmediateScroll(documentNode: Document): () => void {
  const existingLock = SCROLL_BEHAVIOR_LOCKS.get(documentNode);

  if (existingLock !== undefined) {
    existingLock.count += 1;
  } else {
    const rootStyle = documentNode.documentElement.style;
    SCROLL_BEHAVIOR_LOCKS.set(documentNode, {
      count: 1,
      originalValue: rootStyle.getPropertyValue("scroll-behavior"),
      originalPriority: rootStyle.getPropertyPriority("scroll-behavior"),
    });
    rootStyle.setProperty("scroll-behavior", "auto", "important");
  }

  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    const currentLock = SCROLL_BEHAVIOR_LOCKS.get(documentNode);

    if (currentLock === undefined) {
      return;
    }

    currentLock.count -= 1;

    if (currentLock.count > 0) {
      return;
    }

    const rootStyle = documentNode.documentElement.style;
    if (currentLock.originalValue === "") {
      rootStyle.removeProperty("scroll-behavior");
    } else {
      rootStyle.setProperty(
        "scroll-behavior",
        currentLock.originalValue,
        currentLock.originalPriority,
      );
    }
    SCROLL_BEHAVIOR_LOCKS.delete(documentNode);
  };
}

function findChapterElement(
  root: ParentNode,
  chapterId: StoryChapterId,
): HTMLElement | null {
  const candidates = root.querySelectorAll<HTMLElement>("[data-chapter-id]");

  for (const candidate of candidates) {
    if (candidate.dataset.chapterId === chapterId) {
      return candidate;
    }
  }

  return null;
}

function waitForAnimationFrame(
  scheduler: StoryFrameScheduler,
  signal: AbortSignal | undefined,
): Promise<void> {
  return new Promise((resolve, reject) => {
    assertNotAborted(signal);

    let frameHandle: number | null = null;
    let settled = false;

    const cleanup = () => {
      signal?.removeEventListener("abort", handleAbort);
    };
    const handleAbort = () => {
      if (settled) {
        return;
      }

      settled = true;
      if (frameHandle !== null) {
        scheduler.cancelAnimationFrame(frameHandle);
      }
      cleanup();
      reject(createAbortError());
    };

    signal?.addEventListener("abort", handleAbort, { once: true });
    frameHandle = scheduler.requestAnimationFrame(() => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve();
    });
  });
}

/**
 * Phase-4 vertical/static implementation. It performs an immediate native
 * scroll, then waits two frames so layout consumers can treat the semantic
 * target as stable before revealing the page.
 */
export function createStaticNativeStoryPositioningAdapter(
  options: StaticNativeStoryPositioningAdapterOptions = {},
): StoryPositioningAdapter {
  return Object.freeze({
    projectionMode: "static" as const,
    async position(
      requestedChapterId: StoryChapterId,
      positioningOptions: StoryPositioningOptions = {},
    ): Promise<StoryPositioningResult> {
      assertNotAborted(positioningOptions.signal);

      const root = resolveRoot(options.root);
      const documentNode = ownerDocumentFor(root);
      const scheduler = resolveFrameScheduler(
        documentNode,
        options.frameScheduler,
      );
      const requestedTarget = findChapterElement(root, requestedChapterId);
      const target = requestedTarget ?? findChapterElement(root, "home");

      if (target === null) {
        throw new StoryPositioningError(
          `Neither story chapter "${requestedChapterId}" nor Home is mounted.`,
        );
      }

      const positionedChapterId =
        requestedTarget === null ? "home" : requestedChapterId;
      const releaseImmediateScroll = acquireImmediateScroll(documentNode);

      try {
        assertNotAborted(positioningOptions.signal);
        if (positionedChapterId === "home") {
          const view = documentNode.defaultView;

          if (view === null || typeof view.scrollTo !== "function") {
            throw new StoryPositioningError(
              "The static story cannot position Home at the document origin.",
            );
          }

          view.scrollTo({ behavior: "auto", left: 0, top: 0 });
        } else if (typeof target.scrollIntoView !== "function") {
          throw new StoryPositioningError(
            `Story chapter "${positionedChapterId}" cannot be positioned.`,
          );
        } else {
          target.scrollIntoView({
            behavior: "auto",
            block: "start",
            inline: "nearest",
          });
        }
        await waitForAnimationFrame(scheduler, positioningOptions.signal);
        await waitForAnimationFrame(scheduler, positioningOptions.signal);

        return Object.freeze({
          requestedChapterId,
          positionedChapterId,
          fallbackToHome: requestedTarget === null,
          projectionMode: "static",
        });
      } finally {
        releaseImmediateScroll();
      }
    },
  });
}
