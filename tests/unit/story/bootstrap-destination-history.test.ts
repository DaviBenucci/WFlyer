import { describe, expect, it } from "vitest";

import {
  createStoryHistoryEntry,
  mergeStoryHistoryState,
  readStoryHistoryChapterId,
  resolveStoryBootstrapDestination,
  STORY_CHAPTERS,
  STORY_HISTORY_STATE_KEY,
} from "@/lib/story";

describe("Phase-4 semantic bootstrap destination", () => {
  it("allowlists every and only the manifest-defined landing hash", () => {
    const addressableChapters = STORY_CHAPTERS.flatMap((chapter) =>
      "hash" in chapter ? [chapter] : [],
    );

    for (const chapter of addressableChapters) {
      if (!("hash" in chapter)) {
        throw new Error("Addressable chapter lost its hash.");
      }

      expect(
        resolveStoryBootstrapDestination({ explicitHash: chapter.hash }),
      ).toEqual({
        chapterId: chapter.id,
        hash: chapter.hash,
        source: "explicit-hash",
      });
    }

    expect(addressableChapters).toHaveLength(11);
  });

  it("gives a valid explicit hash priority over validated history", () => {
    const historyState = mergeStoryHistoryState({}, "professional-contact");

    expect(
      resolveStoryBootstrapDestination({
        explicitHash: "#beneficios",
        historyState,
      }),
    ).toEqual({
      chapterId: "application-benefits",
      hash: "#beneficios",
      source: "explicit-hash",
    });
  });

  it("falls directly to Home for a nonempty invalid hash without reading stale history", () => {
    const historyState = mergeStoryHistoryState({}, "professional-projects");

    expect(
      resolveStoryBootstrapDestination({
        explicitHash: "#not-a-story-target",
        historyState,
      }),
    ).toEqual({
      chapterId: "home",
      hash: "#home",
      source: "invalid-hash-fallback",
    });
  });

  it("uses validated history only when no explicit hash is present", () => {
    const historyState = mergeStoryHistoryState(
      { framework: { internal: true } },
      "professional-terminal",
    );

    expect(
      resolveStoryBootstrapDestination({ explicitHash: "", historyState }),
    ).toEqual({
      chapterId: "professional-terminal",
      hash: null,
      source: "history-restoration",
    });
  });

  it("defaults to semantic Home when neither URL nor history is authoritative", () => {
    expect(resolveStoryBootstrapDestination({})).toEqual({
      chapterId: "home",
      hash: "#home",
      source: "default-home",
    });
  });
});

describe("Phase-4 namespaced history envelope", () => {
  it("creates the exact versioned envelope and preserves foreign fields", () => {
    const foreignState = {
      __NA: true,
      framework: { tree: ["route"] },
      [STORY_HISTORY_STATE_KEY]: { version: 0, chapterId: "home" },
    };
    const merged = mergeStoryHistoryState(
      foreignState,
      "application-how-it-works",
    );

    expect(merged).toEqual({
      __NA: true,
      framework: { tree: ["route"] },
      [STORY_HISTORY_STATE_KEY]: {
        version: 1,
        chapterId: "application-how-it-works",
      },
    });
    expect(merged.framework).toBe(foreignState.framework);
    expect(readStoryHistoryChapterId(merged)).toBe(
      "application-how-it-works",
    );
  });

  it("accepts restoration for all thirteen semantic chapter IDs", () => {
    for (const chapter of STORY_CHAPTERS) {
      const state = {
        [STORY_HISTORY_STATE_KEY]: createStoryHistoryEntry(chapter.id),
      };
      expect(readStoryHistoryChapterId(state)).toBe(chapter.id);
    }
  });

  it("rejects unnamespaced, unversioned, stale, and unknown restoration state", () => {
    expect(readStoryHistoryChapterId(null)).toBeNull();
    expect(readStoryHistoryChapterId("home")).toBeNull();
    expect(readStoryHistoryChapterId({ chapterId: "home" })).toBeNull();
    expect(
      readStoryHistoryChapterId({
        [STORY_HISTORY_STATE_KEY]: { chapterId: "home" },
      }),
    ).toBeNull();
    expect(
      readStoryHistoryChapterId({
        [STORY_HISTORY_STATE_KEY]: { version: 2, chapterId: "home" },
      }),
    ).toBeNull();
    expect(
      readStoryHistoryChapterId({
        [STORY_HISTORY_STATE_KEY]: {
          version: 1,
          chapterId: "attacker-controlled",
        },
      }),
    ).toBeNull();
  });

  it("creates a clean envelope when existing history state is not a record", () => {
    expect(mergeStoryHistoryState(7, "home")).toEqual({
      [STORY_HISTORY_STATE_KEY]: { version: 1, chapterId: "home" },
    });
  });
});
