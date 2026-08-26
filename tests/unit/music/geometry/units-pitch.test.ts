import { describe, expect, it } from "vitest";

import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import {
  pitchToStaffStep,
  placePitch,
  staffStepToPitch,
} from "@/lib/music/geometry/pitch";
import {
  staffStepSize,
  staffStepToOffset,
} from "@/lib/music/geometry/units";

describe("staff-space units", () => {
  it("defines one staffStep as half a staffSpace", () => {
    expect(staffStepSize(12)).toBe(6);
  });

  it.each([
    [-2, -30],
    [0, -20],
    [2, -10],
    [4, 0],
    [6, 10],
    [8, 20],
    [10, 30],
  ])("offsets staffStep %i from the B4 guide by %i", (step, offset) => {
    expect(staffStepToOffset(step, 10)).toBe(offset);
  });

  it("rejects invalid unit inputs instead of silently clamping them", () => {
    expect(() => staffStepToOffset(4.5, 10)).toThrow(/integer/);
    expect(() => staffStepToOffset(4, 0)).toThrow(/greater than zero/);
    expect(() => staffStepToOffset(Number.NaN, 10)).toThrow(/finite/);
  });
});

describe("natural treble pitch mapping", () => {
  it.each([
    ["C4", -2],
    ["E4", 0],
    ["G4", 2],
    ["B4", 4],
    ["F5", 8],
    ["A5", 10],
    ["E6", 14],
    ["A3", -4],
  ] as const)("maps %s to staffStep %i", (pitch, step) => {
    expect(pitchToStaffStep(pitch)).toBe(step);
    expect(staffStepToPitch(step)).toBe(pitch);
  });

  it("places B4 on the ScorePath and preserves the line ordering", () => {
    const path = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );

    expect(placePitch(path, 0.5, "B4", 10)).toEqual({ x: 50, y: 0 });
    expect(placePitch(path, 0.5, "E4", 10)).toEqual({ x: 50, y: 20 });
    expect(placePitch(path, 0.5, "F5", 10)).toEqual({ x: 50, y: -20 });
  });

  it("rejects accidental and fractional pitch spellings", () => {
    expect(() => pitchToStaffStep("F#4" as "F4")).toThrow(/Invalid/);
    expect(() => pitchToStaffStep("C4.5" as "C4")).toThrow(/Invalid/);
  });
});
