import { describe, expect, it } from "vitest";

import { CubicBezierScorePath } from "@/lib/music/geometry/cubic-bezier-score-path";
import { frameAt, placeAtStaffStep } from "@/lib/music/geometry/score-path";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import type { Vec2 } from "@/lib/music/geometry/types";
import { dotVectors, vectorLength } from "@/lib/music/geometry/vectors";

function expectVec(actual: Vec2, expected: Vec2): void {
  expect(actual.x).toBeCloseTo(expected.x, 10);
  expect(actual.y).toBeCloseTo(expected.y, 10);
}

describe("StraightScorePath", () => {
  it("returns exact normalized P/T/N values", () => {
    const path = new StraightScorePath(
      { x: 10, y: 20 },
      { x: 110, y: 20 },
      { at: 0.25, towardIncreasingPitch: { x: 0, y: -4 } },
    );

    expect(path.pointAt(0.25)).toEqual({ x: 35, y: 20 });
    expect(path.tangentAt(0.25)).toEqual({ x: 1, y: 0 });
    expect(path.normalAt(0.25)).toEqual({ x: 0, y: -1 });
    expect(frameAt(path, 0.25)).toEqual({
      normal: { x: 0, y: -1 },
      point: { x: 35, y: 20 },
      tangent: { x: 1, y: 0 },
    });
  });

  it("keeps the pitch normal stable when traversal reverses", () => {
    const increasingPitch = { x: 0, y: -1 };
    const forward = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { at: 0.25, towardIncreasingPitch: increasingPitch },
    );
    const reversed = new StraightScorePath(
      { x: 100, y: 0 },
      { x: 0, y: 0 },
      { at: 0.75, towardIncreasingPitch: increasingPitch },
    );

    expectVec(forward.pointAt(0.25), reversed.pointAt(0.75));
    expectVec(forward.tangentAt(0.25), { x: 1, y: 0 });
    expectVec(reversed.tangentAt(0.75), { x: -1, y: 0 });
    expectVec(forward.normalAt(0.25), reversed.normalAt(0.75));
    expectVec(
      placeAtStaffStep(forward, 0.25, 8, 10),
      placeAtStaffStep(reversed, 0.75, 8, 10),
    );
  });

  it("rejects an ambiguous pitch-side reference and out-of-range t", () => {
    expect(
      () =>
        new StraightScorePath(
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { at: 0.5, towardIncreasingPitch: { x: 1, y: 0 } },
        ),
    ).toThrow(/identify one side/);

    const path = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );
    expect(() => path.pointAt(1.1)).toThrow(/between zero and one/);
  });
});

describe("CubicBezierScorePath", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 0, y: -20 },
    { x: 100, y: -20 },
    { x: 100, y: 0 },
  ] as const;

  it("returns normalized orthogonal local frames", () => {
    const path = new CubicBezierScorePath(...points, {
      at: 0.5,
      towardIncreasingPitch: { x: 0, y: -1 },
    });

    expectVec(path.pointAt(0), points[0]);
    expectVec(path.pointAt(1), points[3]);
    expectVec(path.pointAt(0.5), { x: 50, y: -15 });

    for (const t of [0, 0.2, 0.5, 0.8, 1]) {
      const tangent = path.tangentAt(t);
      const normal = path.normalAt(t);

      expect(vectorLength(tangent)).toBeCloseTo(1, 12);
      expect(vectorLength(normal)).toBeCloseTo(1, 12);
      expect(dotVectors(tangent, normal)).toBeCloseTo(0, 12);
    }
  });

  it("preserves corresponding points and pitch normals when reversed", () => {
    const pitchSide = { x: 0, y: -1 };
    const forward = new CubicBezierScorePath(...points, {
      at: 0.5,
      towardIncreasingPitch: pitchSide,
    });
    const reverse = new CubicBezierScorePath(
      points[3],
      points[2],
      points[1],
      points[0],
      { at: 0.5, towardIncreasingPitch: pitchSide },
    );

    for (const t of [0.1, 0.35, 0.8]) {
      const reverseT = 1 - t;
      const forwardTangent = forward.tangentAt(t);
      const reverseTangent = reverse.tangentAt(reverseT);

      expectVec(forward.pointAt(t), reverse.pointAt(reverseT));
      expectVec(forward.normalAt(t), reverse.normalAt(reverseT));
      expectVec(forwardTangent, {
        x: -reverseTangent.x,
        y: -reverseTangent.y,
      });
      expectVec(
        placeAtStaffStep(forward, t, 0, 12),
        placeAtStaffStep(reverse, reverseT, 0, 12),
      );
    }
  });

  it("rejects a zero derivative instead of fabricating a tangent", () => {
    expect(
      () =>
        new CubicBezierScorePath(
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 20, y: 0 },
          { at: 0, towardIncreasingPitch: { x: 0, y: -1 } },
        ),
    ).toThrow(/non-zero length/);
  });
});
