import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createStaticNativeStoryPositioningAdapter,
  StoryPositioningError,
  type StoryFrameScheduler,
  type StoryPositioningAdapter,
} from "@/lib/story/bootstrap";

function createControlledFrameScheduler(): StoryFrameScheduler & {
  readonly flushOne: () => void;
  readonly pendingCount: () => number;
} {
  let nextHandle = 1;
  const pending = new Map<number, FrameRequestCallback>();

  return {
    requestAnimationFrame(callback) {
      const handle = nextHandle;
      nextHandle += 1;
      pending.set(handle, callback);
      return handle;
    },
    cancelAnimationFrame(handle) {
      pending.delete(handle);
    },
    flushOne() {
      const entry = pending.entries().next().value as
        | [number, FrameRequestCallback]
        | undefined;
      if (entry === undefined) {
        throw new Error("No animation frame is pending.");
      }
      pending.delete(entry[0]);
      entry[1](performance.now());
    },
    pendingCount() {
      return pending.size;
    },
  };
}

function appendChapter(chapterId: string) {
  const chapter = document.createElement("section");
  chapter.dataset.chapterId = chapterId;
  const scrollIntoView = vi.fn();
  Object.defineProperty(chapter, "scrollIntoView", {
    configurable: true,
    value: scrollIntoView,
  });
  document.body.append(chapter);

  return { chapter, scrollIntoView };
}

async function settleTwoFrames(
  scheduler: ReturnType<typeof createControlledFrameScheduler>,
): Promise<void> {
  scheduler.flushOne();
  await Promise.resolve();
  scheduler.flushOne();
}

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.style.removeProperty("scroll-behavior");
  vi.restoreAllMocks();
});

describe("Phase-4 static semantic positioning adapter", () => {
  it("positions the requested semantic chapter immediately and stabilizes for two frames", async () => {
    appendChapter("home");
    const { scrollIntoView } = appendChapter("professional-projects");
    const scheduler = createControlledFrameScheduler();
    const adapter = createStaticNativeStoryPositioningAdapter({
      root: document,
      frameScheduler: scheduler,
    });

    const positioning = adapter.position("professional-projects");

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
    expect(scheduler.pendingCount()).toBe(1);

    await settleTwoFrames(scheduler);

    await expect(positioning).resolves.toEqual({
      requestedChapterId: "professional-projects",
      positionedChapterId: "professional-projects",
      fallbackToHome: false,
      projectionMode: "static",
    });
    expect(document.documentElement.style.scrollBehavior).toBe("");
  });

  it("uses Home as a safe static fallback without interpolating coordinates", async () => {
    const { scrollIntoView } = appendChapter("home");
    const scrollTo = vi.mocked(window.scrollTo);
    const scheduler = createControlledFrameScheduler();
    const adapter = createStaticNativeStoryPositioningAdapter({
      root: document,
      frameScheduler: scheduler,
    });

    const positioning = adapter.position("application-terminal");
    await settleTwoFrames(scheduler);

    await expect(positioning).resolves.toEqual({
      requestedChapterId: "application-terminal",
      positionedChapterId: "home",
      fallbackToHome: true,
      projectionMode: "static",
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith({ behavior: "auto", left: 0, top: 0 });
  });

  it("maps semantic Home to the native static document origin", async () => {
    appendChapter("home");
    const scrollTo = vi.mocked(window.scrollTo);
    const scheduler = createControlledFrameScheduler();
    const adapter = createStaticNativeStoryPositioningAdapter({
      root: document,
      frameScheduler: scheduler,
    });

    const positioning = adapter.position("home");
    await settleTwoFrames(scheduler);
    await positioning;

    expect(scrollTo).toHaveBeenCalledWith({ behavior: "auto", left: 0, top: 0 });
  });

  it("uses only a fixed selector and compares the data value separately", async () => {
    appendChapter("home");
    const scheduler = createControlledFrameScheduler();
    const root = document.createElement("main");
    const home = document.querySelector<HTMLElement>(
      '[data-chapter-id="home"]',
    );
    if (home === null) {
      throw new Error("Home fixture is unavailable.");
    }
    root.append(home);
    document.body.append(root);
    const querySelectorAll = vi.spyOn(root, "querySelectorAll");
    const adapter = createStaticNativeStoryPositioningAdapter({
      root,
      frameScheduler: scheduler,
    });

    const positioning = adapter.position(
      'home\"] [data-secret]' as "home",
    );
    await settleTwoFrames(scheduler);
    await positioning;

    expect(querySelectorAll).toHaveBeenCalledWith("[data-chapter-id]");
    expect(querySelectorAll).not.toHaveBeenCalledWith(
      '[data-chapter-id="home\"] [data-secret]"]',
    );
  });

  it("restores the prior scroll behavior and cancels a pending frame on abort", async () => {
    appendChapter("home");
    document.documentElement.style.setProperty("scroll-behavior", "smooth");
    const scheduler = createControlledFrameScheduler();
    const cancelAnimationFrame = vi.spyOn(scheduler, "cancelAnimationFrame");
    const controller = new AbortController();
    const adapter = createStaticNativeStoryPositioningAdapter({
      root: document,
      frameScheduler: scheduler,
    });

    const positioning = adapter.position("home", {
      signal: controller.signal,
    });
    controller.abort();

    await expect(positioning).rejects.toMatchObject({ name: "AbortError" });
    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(scheduler.pendingCount()).toBe(0);
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
  });

  it("fails explicitly when neither the requested chapter nor Home is mounted", async () => {
    const scheduler = createControlledFrameScheduler();
    const adapter = createStaticNativeStoryPositioningAdapter({
      root: document,
      frameScheduler: scheduler,
    });

    await expect(adapter.position("professional-contact")).rejects.toBeInstanceOf(
      StoryPositioningError,
    );
    expect(scheduler.pendingCount()).toBe(0);
  });

  it("allows a future projection to map semantic Home to a nonzero coordinate", async () => {
    const physicalOffsets = {
      home: 0.63,
    } as const;
    const positionedOffsets: number[] = [];
    const futureAdapter: StoryPositioningAdapter = {
      projectionMode: "horizontal-enhanced",
      async position(chapterId) {
        positionedOffsets.push(physicalOffsets[chapterId as "home"]);
        return {
          requestedChapterId: chapterId,
          positionedChapterId: chapterId,
          fallbackToHome: false,
          projectionMode: "horizontal-enhanced",
        };
      },
    };

    await futureAdapter.position("home");

    expect(positionedOffsets).toEqual([0.63]);
  });
});
