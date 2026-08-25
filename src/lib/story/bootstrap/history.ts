import { STORY_CHAPTER_BY_ID } from "../manifest";
import type { StoryChapterId } from "../types";

export const STORY_HISTORY_STATE_KEY = "__wflyerStoryV2" as const;
export const STORY_HISTORY_STATE_VERSION = 1 as const;

export interface StoryHistoryEntry {
  readonly version: typeof STORY_HISTORY_STATE_VERSION;
  readonly chapterId: StoryChapterId;
}

export type StoryHistoryState = Readonly<
  Record<string, unknown> & {
    readonly [STORY_HISTORY_STATE_KEY]: StoryHistoryEntry;
  }
>;

const STORY_CHAPTER_IDS: ReadonlySet<string> = new Set(
  Object.keys(STORY_CHAPTER_BY_ID),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStoryChapterId(value: unknown): value is StoryChapterId {
  return typeof value === "string" && STORY_CHAPTER_IDS.has(value);
}

export function createStoryHistoryEntry(
  chapterId: StoryChapterId,
): StoryHistoryEntry {
  return Object.freeze({
    version: STORY_HISTORY_STATE_VERSION,
    chapterId,
  });
}

/**
 * Reads only the versioned W_Flyer envelope. Arbitrary history state and
 * unversioned/stale payloads are not restoration authority.
 */
export function readStoryHistoryChapterId(
  historyState: unknown,
): StoryChapterId | null {
  if (
    !isRecord(historyState) ||
    !Object.hasOwn(historyState, STORY_HISTORY_STATE_KEY)
  ) {
    return null;
  }

  const entry = historyState[STORY_HISTORY_STATE_KEY];

  if (
    !isRecord(entry) ||
    entry.version !== STORY_HISTORY_STATE_VERSION ||
    !isStoryChapterId(entry.chapterId)
  ) {
    return null;
  }

  return entry.chapterId;
}

/**
 * Produces the payload for a caller-owned replaceState operation while
 * preserving every foreign top-level field. No helper in this module appends
 * a browser-history entry.
 */
export function mergeStoryHistoryState(
  existingState: unknown,
  chapterId: StoryChapterId,
): StoryHistoryState {
  const foreignState = isRecord(existingState) ? existingState : {};

  return Object.freeze({
    ...foreignState,
    [STORY_HISTORY_STATE_KEY]: createStoryHistoryEntry(chapterId),
  }) as StoryHistoryState;
}
