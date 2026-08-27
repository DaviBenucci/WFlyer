import { describe, expect, it } from "vitest";

import {
  HEADER_TRAVERSAL_TIMING,
  resolveHeaderTraversalDuration,
} from "@/lib/story/motion";

describe("Phase-6 header traversal timing", () => {
  it("uses the approved proportional formula and exact hard ceiling", () => {
    expect(HEADER_TRAVERSAL_TIMING).toEqual({
      distanceRangeSeconds: 2.35,
      ease: "power2.inOut",
      maximumDurationSeconds: 3,
      minimumDurationSeconds: 0.65,
    });
    expect(resolveHeaderTraversalDuration(0)).toBe(0.65);
    expect(resolveHeaderTraversalDuration(0.25)).toBeCloseTo(1.2375, 8);
    expect(resolveHeaderTraversalDuration(1)).toBe(3);
    expect(resolveHeaderTraversalDuration(2)).toBe(3);
  });

  it("normalizes direction without accepting non-finite input", () => {
    expect(resolveHeaderTraversalDuration(-0.5)).toBeCloseTo(1.825, 8);
    expect(() => resolveHeaderTraversalDuration(Number.NaN)).toThrow(
      "Header traversal distance must be finite.",
    );
    expect(() => resolveHeaderTraversalDuration(Number.POSITIVE_INFINITY)).toThrow(
      RangeError,
    );
  });
});
