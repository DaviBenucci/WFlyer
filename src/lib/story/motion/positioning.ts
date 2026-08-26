import {
  createStaticNativeStoryPositioningAdapter,
  type StoryPositioningAdapter,
  type StoryPositioningOptions,
} from "../bootstrap";
import type { StoryChapterId } from "../types";
import type { MotionStoryRuntime } from "./runtime";

export interface MotionStoryPositioningAdapterOptions {
  readonly getRuntime: () => MotionStoryRuntime | null;
}

export function createMotionStoryPositioningAdapter({
  getRuntime,
}: MotionStoryPositioningAdapterOptions): StoryPositioningAdapter {
  const staticAdapter = createStaticNativeStoryPositioningAdapter();

  const adapter: StoryPositioningAdapter = {
    get projectionMode() {
      return getRuntime()?.projectionMode ?? "static";
    },
    async position(
      chapterId: StoryChapterId,
      options: StoryPositioningOptions = {},
    ) {
      const runtime = getRuntime();

      if (runtime === null) {
        return staticAdapter.position(chapterId, options);
      }

      if (options.intent === "preserve-active-chapter") {
        return runtime.rebuildPreservingActiveChapter(chapterId, options);
      }

      return runtime.position(chapterId, options);
    },
  };

  return Object.freeze(adapter);
}
