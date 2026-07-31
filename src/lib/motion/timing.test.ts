import { describe, expect, it } from "vitest";

import { getTransitionDurationMs, NAVIGATION_TIMING_MS } from "./timing";

describe("navigation timing", () => {
  it("exposes every normative lifecycle limit", () => {
    expect(NAVIGATION_TIMING_MS).toStrictEqual({
      prepareMaximum: 100,
      standardMinimum: 620,
      standardTarget: 720,
      standardMaximum: 820,
      pivotMinimum: 760,
      pivotTarget: 840,
      pivotMaximum: 900,
      hardMaximum: 900,
      neutral: 220,
      reduced: 180,
      recovery: 1_100,
    });
  });

  it.each([
    ["adjacent-score", 720],
    ["compressed-score-jump", 720],
    ["home-pivot", 840],
    ["neutral", 220],
  ] as const)("resolves %s to %d ms", (mode, duration) => {
    expect(getTransitionDurationMs(mode, false)).toBe(duration);
  });

  it("keeps compressed duration independent of chapter distance", () => {
    expect(getTransitionDurationMs("compressed-score-jump", false)).toBe(
      NAVIGATION_TIMING_MS.standardTarget,
    );
  });

  it.each([
    "adjacent-score",
    "compressed-score-jump",
    "home-pivot",
    "neutral",
  ] as const)("reduces %s to one 180 ms replacement", (mode) => {
    expect(getTransitionDurationMs(mode, true)).toBe(180);
  });
});
