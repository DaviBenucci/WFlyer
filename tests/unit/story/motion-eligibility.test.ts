import { describe, expect, it } from "vitest";

import {
  resolveStoryPresentationClass,
  resolveStoryProjectionMode,
} from "@/lib/story/motion/eligibility";

describe("Phase-5 projection eligibility", () => {
  const eligibleSignals = {
    anyFinePointer: true,
    height: 900,
    hoverCapable: true,
    reducedMotion: false,
    width: 1440,
  } as const;

  it("requires full effective capacity rather than width alone", () => {
    expect(resolveStoryProjectionMode(eligibleSignals, "PASS")).toEqual({
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

  it("requires a complete Projects candidate result at the same viewport", () => {
    expect(resolveStoryProjectionMode(eligibleSignals, "NOT_READY")).toEqual({
      mode: "vertical-wide",
      reason: "projects-capacity-pending",
    });
    expect(
      resolveStoryProjectionMode(eligibleSignals, "INSUFFICIENT_CAPACITY"),
    ).toEqual({
      mode: "vertical-wide",
      reason: "projects-capacity-insufficient",
    });
    expect(resolveStoryProjectionMode(eligibleSignals, "INVALID")).toEqual({
      mode: "vertical-wide",
      reason: "invalid-projects-capacity",
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

  it("keeps presentation separate from capacity and wide touch input", () => {
    expect(resolveStoryPresentationClass(eligibleSignals, "horizontal-enhanced")).toBe("EXPANDED_LANDSCAPE");
    expect(
      resolveStoryPresentationClass({ ...eligibleSignals, width: 1366, height: 611 }, "vertical-wide"),
    ).toBe("COMPACT_LANDSCAPE");
    expect(
      resolveStoryPresentationClass({
        ...eligibleSignals,
        anyFinePointer: false,
        hoverCapable: false,
        width: 900,
        height: 600,
      }, "vertical-wide"),
    ).toBe("COMPACT_LANDSCAPE");
    expect(
      resolveStoryPresentationClass({ ...eligibleSignals, width: 390 }, "vertical-compact"),
    ).toBe("PORTRAIT_TRAVERSE");
    expect(resolveStoryPresentationClass({ ...eligibleSignals, width: 900, height: 1024 }, "vertical-wide"))
      .toBe("PORTRAIT_TRAVERSE");
  });
});
