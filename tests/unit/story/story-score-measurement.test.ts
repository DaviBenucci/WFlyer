import { describe, expect, it } from "vitest";

import { normalizeStoryScoreMeasuredRect } from "@/components/story-score/measurement";

describe("story score rendered-bound normalization", () => {
  it("keeps canonical story coordinates stable across native scroll", () => {
    const beforeScroll = normalizeStoryScoreMeasuredRect(
      { height: 180.006, left: 4_312.349, top: 212.125, width: 320.004 },
      { height: 900, left: -1_107.651, top: 64.125, width: 20_000 },
    );
    const afterScroll = normalizeStoryScoreMeasuredRect(
      { height: 180.006, left: 4_312.349, top: -427.875, width: 320.004 },
      { height: 900, left: -1_107.651, top: -575.875, width: 20_000 },
    );

    expect(afterScroll).toEqual(beforeScroll);
    expect(afterScroll).toEqual({
      height: 180.01,
      width: 320,
      x: 5_420,
      y: 148,
    });
    expect(Object.isFrozen(afterScroll)).toBe(true);
  });

  it("removes an equal GSAP track translation from viewport rectangles", () => {
    const untranslated = normalizeStoryScoreMeasuredRect(
      { height: 200, left: 2_800, top: 260, width: 400 },
      { height: 900, left: 0, top: 0, width: 20_000 },
    );
    const translated = normalizeStoryScoreMeasuredRect(
      { height: 200, left: -1_700, top: 260, width: 400 },
      { height: 900, left: -4_500, top: 0, width: 20_000 },
    );

    expect(translated).toEqual(untranslated);
  });
});
