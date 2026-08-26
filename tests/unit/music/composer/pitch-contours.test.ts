import { describe, expect, it } from "vitest";

import {
  ContourTranslationExhaustedError,
  getPitchContourDeltas,
  instantiatePitchContour,
  PITCH_CONTOUR_TABLE,
  supportedContoursForLength,
  translateCompleteContourIntoRange,
  UnsupportedPitchContourError,
} from "@/lib/music/composer/pitch-contours";

describe("version-1 pitch contour table", () => {
  it("contains the exact approved per-length delta vectors", () => {
    expect(PITCH_CONTOUR_TABLE).toEqual({
      "step-up": {
        1: [0],
        2: [0, 1],
        3: [0, 1, 2],
        4: [0, 1, 2, 3],
      },
      "step-down": {
        1: [0],
        2: [0, -1],
        3: [0, -1, -2],
        4: [0, -1, -2, -3],
      },
      arch: { 1: null, 2: null, 3: [0, 1, 0], 4: [0, 1, 1, 0] },
      valley: { 1: null, 2: null, 3: [0, -1, 0], 4: [0, -1, -1, 0] },
      alternating: {
        1: null,
        2: null,
        3: [0, 1, -1],
        4: [0, 1, -1, 0],
      },
      "repeat-then-step": {
        1: null,
        2: null,
        3: [0, 0, 1],
        4: [0, 0, 1, 2],
      },
      "small-leap-up": {
        1: null,
        2: [0, 2],
        3: [0, 2, 3],
        4: [0, 2, 3, 4],
      },
      "small-leap-down": {
        1: null,
        2: [0, -2],
        3: [0, -2, -3],
        4: [0, -2, -3, -4],
      },
    });
  });

  it("reports only contours explicitly supported for each note count", () => {
    expect(supportedContoursForLength(1)).toEqual(["step-up", "step-down"]);
    expect(supportedContoursForLength(2)).toEqual([
      "step-up",
      "step-down",
      "small-leap-up",
      "small-leap-down",
    ]);
    expect(supportedContoursForLength(3)).toHaveLength(8);
    expect(supportedContoursForLength(4)).toHaveLength(8);
    expect(() => getPitchContourDeltas("arch", 2)).toThrow(
      UnsupportedPitchContourError,
    );
  });
});

describe("uniform contour boundary translation", () => {
  it("uses zero when the complete contour already fits", () => {
    const result = instantiatePitchContour("step-up", 4, 2);

    expect(result).toEqual({ staffSteps: [2, 3, 4, 5], translation: 0 });
  });

  it("uses the smallest-magnitude uniform translation above the range", () => {
    const result = instantiatePitchContour("step-up", 4, 10);

    expect(result).toEqual({ staffSteps: [7, 8, 9, 10], translation: -3 });
    expect(result.staffSteps.slice(1).map((step, index) =>
      step - (result.staffSteps[index] ?? 0),
    )).toEqual([1, 1, 1]);
  });

  it("uses the smallest-magnitude uniform translation below the range", () => {
    const result = instantiatePitchContour("step-down", 4, -2);

    expect(result).toEqual({ staffSteps: [1, 0, -1, -2], translation: 3 });
    expect(result.staffSteps.slice(1).map((step, index) =>
      step - (result.staffSteps[index] ?? 0),
    )).toEqual([-1, -1, -1]);
  });

  it("rejects an unfit span without mutating the supplied contour", () => {
    const input = Object.freeze([0, 13]);

    expect(() => translateCompleteContourIntoRange(input)).toThrow(
      ContourTranslationExhaustedError,
    );
    expect(input).toEqual([0, 13]);
  });

  it("rejects non-integer contours and invalid ranges", () => {
    expect(() => translateCompleteContourIntoRange([0, 0.5])).toThrow(
      /integer/u,
    );
    expect(() =>
      translateCompleteContourIntoRange([0], { minimum: 2, maximum: 1 }),
    ).toThrow(/ordered/u);
  });
});
