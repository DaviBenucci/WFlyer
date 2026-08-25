import { STORY_CHAPTERS, STORY_CHAPTER_BY_ID } from "../manifest";
import type { StoryChapterId, StoryHash } from "../types";
import { readStoryHistoryChapterId } from "./history";

export type StoryBootstrapDestinationSource =
  | "explicit-hash"
  | "history-restoration"
  | "default-home"
  | "invalid-hash-fallback";

export interface StoryBootstrapDestination {
  readonly chapterId: StoryChapterId;
  readonly hash: StoryHash | null;
  readonly source: StoryBootstrapDestinationSource;
}

export interface ResolveStoryBootstrapDestinationInput {
  readonly explicitHash?: string | null;
  readonly historyState?: unknown;
}

const STORY_CHAPTER_ID_BY_HASH = new Map<StoryHash, StoryChapterId>(
  STORY_CHAPTERS.flatMap((chapter) => {
    const widenedChapter = STORY_CHAPTER_BY_ID[chapter.id];

    return widenedChapter.hash === undefined
      ? []
      : [[widenedChapter.hash, widenedChapter.id] as const];
  }),
);

function storyHashForChapter(chapterId: StoryChapterId): StoryHash | null {
  return STORY_CHAPTER_BY_ID[chapterId].hash ?? null;
}

function destination(
  chapterId: StoryChapterId,
  source: StoryBootstrapDestinationSource,
): StoryBootstrapDestination {
  return Object.freeze({
    chapterId,
    hash: storyHashForChapter(chapterId),
    source,
  });
}

/**
 * Resolves semantic bootstrap authority in strict order:
 *
 * 1. valid, nonempty explicit landing hash;
 * 2. validated, namespaced history restoration when no hash was supplied;
 * 3. Home.
 *
 * A nonempty invalid hash resolves directly to Home and deliberately does not
 * consult history, preventing stale restoration state from overriding the URL.
 */
export function resolveStoryBootstrapDestination({
  explicitHash,
  historyState,
}: ResolveStoryBootstrapDestinationInput): StoryBootstrapDestination {
  if (explicitHash !== undefined && explicitHash !== null && explicitHash !== "") {
    const chapterId = STORY_CHAPTER_ID_BY_HASH.get(explicitHash as StoryHash);

    return chapterId === undefined
      ? destination("home", "invalid-hash-fallback")
      : destination(chapterId, "explicit-hash");
  }

  const restoredChapterId = readStoryHistoryChapterId(historyState);

  return restoredChapterId === null
    ? destination("home", "default-home")
    : destination(restoredChapterId, "history-restoration");
}
