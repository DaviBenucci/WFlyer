import { describe, expect, it } from "vitest";

import { resolveStoryProjectionMode } from "@/lib/story/motion/eligibility";

describe("Phase-5 projection eligibility", () => {
  const eligibleSignals = {
    anyFinePointer: true,
    height: 900,
    hoverCapable: true,
    reducedMotion: false,
    width: 1440,
  } as const;

  it("requires full effective capacity rather than width alone", () => {
    expect(resolveStoryProjectionMode(eligibleSignals)).toEqual({
      mode: "horizontal-enhanced",
      reason: "eligible-full-motion",
    });
    expect(
      resolveStoryProjectionMode({ ...eligibleSignals, height: 520 }),
    ).toEqual({
      mode: "vertical-wide",
      reason: "insufficient-layout-capacity",
    });
    expect(
      resolveStoryProjectionMode({
        ...eligibleSignals,
        anyFinePointer: false,
        hoverCapable: false,
      }),
    ).toEqual({
      mode: "vertical-wide",
      reason: "touch-or-coarse-input",
    });
  });

  it("always chooses a vertical/static fallback for compact or reduced motion", () => {
    expect(
      resolveStoryProjectionMode({ ...eligibleSignals, width: 390 }),
    ).toEqual({
      mode: "vertical-compact",
      reason: "compact-viewport",
    });
    expect(
      resolveStoryProjectionMode({ ...eligibleSignals, reducedMotion: true }),
    ).toEqual({ mode: "static", reason: "reduced-motion" });
  });
});
