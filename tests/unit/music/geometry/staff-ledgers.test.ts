import { describe, expect, it } from "vitest";

import { CubicBezierScorePath } from "@/lib/music/geometry/cubic-bezier-score-path";
import {
  buildLedgerLines,
  getLedgerLineSteps,
} from "@/lib/music/geometry/ledger-lines";
import { frameAt } from "@/lib/music/geometry/score-path";
import {
  buildStaffSampleAt,
  sampleStaffLines,
} from "@/lib/music/geometry/staff";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import { dotVectors, subtractVectors } from "@/lib/music/geometry/vectors";

describe("coherent staff offsets", () => {
  it("emits all five visible lines around a curved B4 guide", () => {
    const path = new CubicBezierScorePath(
      { x: 0, y: 0 },
      { x: 30, y: -10 },
      { x: 70, y: -10 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );

    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const frame = frameAt(path, t);
      const sample = buildStaffSampleAt(path, t, 10);

      expect(sample.map((line) => line.staffStep)).toEqual([0, 2, 4, 6, 8]);
      expect(sample.map((line) => line.offset)).toEqual([-20, -10, 0, 10, 20]);
      expect(sample[2]?.point.x).toBeCloseTo(frame.point.x, 12);
      expect(sample[2]?.point.y).toBeCloseTo(frame.point.y, 12);

      for (const line of sample) {
        const delta = subtractVectors(line.point, frame.point);
        expect(dotVectors(delta, frame.normal)).toBeCloseTo(line.offset, 10);
        expect(dotVectors(delta, frame.tangent)).toBeCloseTo(0, 10);
      }
    }
  });

  it("uses an explicit sampling count for every line", () => {
    const path = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );
    const staff = sampleStaffLines(path, 8, 5);

    expect(staff).toHaveLength(5);
    expect(staff.every((line) => line.points.length === 5)).toBe(true);
    expect(staff[2]?.points).toEqual([
      { x: 0, y: 0 },
      { x: 25, y: 0 },
      { x: 50, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 0 },
    ]);
    expect(() => sampleStaffLines(path, 8, 1)).toThrow(/at least two/);
  });
});

describe("ledger-line rules", () => {
  it.each([
    [-4, [-2, -4]],
    [-3, [-2]],
    [-2, [-2]],
    [-1, []],
    [9, []],
    [10, [10]],
    [11, [10]],
    [12, [10, 12]],
    [13, [10, 12]],
    [14, [10, 12, 14]],
  ])("generates exactly the intermediate ledger lines for step %i", (step, expected) => {
    expect(getLedgerLineSteps(step)).toEqual(expected);
  });

  it("centers each ledger on its own pitch line and uses the configured width", () => {
    const path = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );
    const lines = buildLedgerLines({
      extensionInStaffSpaces: 0.2,
      noteStaffStep: 14,
      noteheadWidthInStaffSpaces: 1.2,
      path,
      staffSpace: 10,
      t: 0.5,
    });

    expect(lines.map((line) => line.ledgerStep)).toEqual([10, 12, 14]);
    expect(lines.map((line) => line.width)).toEqual([16, 16, 16]);
    expect(lines.map((line) => line.center)).toEqual([
      { x: 50, y: -30 },
      { x: 50, y: -40 },
      { x: 50, y: -50 },
    ]);
    expect(lines[0]).toMatchObject({
      end: { x: 58, y: -30 },
      start: { x: 42, y: -30 },
    });
  });
});
