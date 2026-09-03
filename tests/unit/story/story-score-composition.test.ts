import { describe, expect, it } from "vitest";

import {
  STORY_SCORE_BRANCHES,
  STORY_SCORE_COMPOSITIONS,
  STORY_SCORE_EXPECTED_FINGERPRINTS,
  STORY_SCORE_SEGMENTS,
  STORY_SCORE_SESSION_SEED,
  storyScoreCompositionDiagnostics,
  storyScoreSemanticFingerprint,
} from "@/lib/story/score/composition";

describe("Task 34 story score composition", () => {
  it("owns one stable approved composition per branch", () => {
    expect(STORY_SCORE_SESSION_SEED).toBe("phase-9-task-33-review-v1");
    expect(storyScoreCompositionDiagnostics().composerInvocationCount).toBe(2);

    for (const branch of STORY_SCORE_BRANCHES) {
      expect(storyScoreSemanticFingerprint(STORY_SCORE_COMPOSITIONS[branch])).toBe(
        STORY_SCORE_EXPECTED_FINGERPRINTS[branch],
      );
    }
  });

  it("exposes exactly six real two-slot segments per branch", () => {
    for (const branch of STORY_SCORE_BRANCHES) {
      expect(
        STORY_SCORE_COMPOSITIONS[branch].motifs.some(
          ({ slotId }) => slotId === "home:primary",
        ),
      ).toBe(true);
    }
    expect(STORY_SCORE_SEGMENTS).toHaveLength(12);
    expect(
      STORY_SCORE_SEGMENTS.filter(({ branch }) => branch === "professional"),
    ).toHaveLength(6);
    expect(
      STORY_SCORE_SEGMENTS.filter(({ branch }) => branch === "application"),
    ).toHaveLength(6);

    for (const segment of STORY_SCORE_SEGMENTS) {
      expect(segment.semanticSlotIds).toEqual([
        `${segment.chapterId}:primary`,
        `${segment.chapterId}:reserved`,
      ]);
    }
  });
});
