import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { buildStoryScoreProjection } from "@/lib/story/score/projection";
import type { StoryScoreSceneMeasurements } from "@/lib/story/score/projection";
import type { Vec2 } from "@/lib/music/geometry/types";

const cases = JSON.parse(
  readFileSync(
    resolve(
      "openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-hga-001-causal-model.json",
    ),
    "utf8",
  ),
).cases as readonly {
  width: number;
  height: number;
  sceneMeasurements: StoryScoreSceneMeasurements;
}[];

function crossings(points: readonly Vec2[]): number {
  const orientation = (a: Vec2, b: Vec2, c: Vec2) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  let count = 0;
  for (let left = 0; left < points.length - 1; left += 1) {
    const a = points[left]!;
    const b = points[left + 1]!;
    for (let right = left + 2; right < points.length - 1; right += 1) {
      const c = points[right]!;
      const d = points[right + 1]!;
      if (
        Math.max(a.x, b.x) < Math.min(c.x, d.x) ||
        Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
        Math.max(a.y, b.y) < Math.min(c.y, d.y) ||
        Math.max(c.y, d.y) < Math.min(a.y, b.y)
      ) continue;
      if (
        orientation(a, b, c) * orientation(a, b, d) < -1e-7 &&
        orientation(c, d, a) * orientation(c, d, b) < -1e-7
      ) count += 1;
    }
  }
  return count;
}

describe("HGA-001 Home-to-About staff offset", () => {
  it.each([1366, 1440])("keeps the measured %ipx candidate regular without hiding intersections", (width) => {
    const saved = cases.find((candidate) => candidate.width === width)!;
    const projection = buildStoryScoreProjection("horizontal-enhanced", {
      viewportWidth: width,
      viewportHeight: saved.height,
      sceneMeasurements: saved.sceneMeasurements,
    });
    const branch = projection.branches.professional;
    const path = branch.path;
    const radius = 2 * branch.staffSpace + branch.model.staff.lines[0]!.thickness / 2;
    const margin = 1e-7;

    for (let segment = 30; segment <= 43; segment += 1) {
      for (let sample = 0; sample <= 64; sample += 1) {
        const t = (segment + sample / 64) / path.segmentCount;
        const curvature = path.curvatureAt(t);
        expect(path.tangentAt(t).x, `guide progress at ${segment}+${sample}/64`).toBeGreaterThan(margin);
        expect(1 - radius * Math.abs(curvature), `offset progress at ${segment}+${sample}/64`).toBeGreaterThan(margin);
      }
    }

    for (const line of branch.model.staff.lines) {
      expect(crossings(line.points), line.id).toBe(0);
    }
  });
});
