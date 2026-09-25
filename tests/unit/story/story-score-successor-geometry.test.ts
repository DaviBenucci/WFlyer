import { describe, expect, it } from "vitest";

import { buildStoryScoreProjection } from "@/lib/story/score/projection";
import { eventPrimitiveFootprintPoints } from "@/lib/story/score/event-safe-placement";
import type { Vec2 } from "@/lib/music/geometry/types";

function intersections(points: readonly Vec2[]) {
  const found: { left: number; right: number; a: Vec2; b: Vec2; c: Vec2; d: Vec2 }[] = [];
  const orientation = (a: Vec2, b: Vec2, c: Vec2) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  for (let left = 0; left < points.length - 1; left += 1) {
    const a = points[left]!;
    const b = points[left + 1]!;
    for (let right = left + 2; right < points.length - 1; right += 1) {
      const c = points[right]!;
      const d = points[right + 1]!;
      if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
          Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) continue;
      if (orientation(a, b, c) * orientation(a, b, d) < -1e-7 &&
          orientation(c, d, a) * orientation(c, d, b) < -1e-7) found.push({ left, right, a, b, c, d });
    }
  }
  return found;
}

describe("Stage-1 static Home geometry", () => {
  it.each([[1100, 640], [1280, 720], [1536, 900], [1920, 917], [1920, 1200]])(
    "reserves central reading and the complete approved clef at %s × %s", (viewportWidth, viewportHeight) => {
      const projection = buildStoryScoreProjection("horizontal-enhanced", { viewportWidth, viewportHeight });
      const home = projection.branches.professional.chapters.find(({ chapterId }) => chapterId === "home")!;
      const rect = home.contentRect;
      const origin = projection.branches.professional.path.pointAt(0);
      expect(rect.x + rect.width / 2).toBeCloseTo(origin.x, 8);
      for (const branch of Object.values(projection.branches)) {
        const points = branch.model.primitives.flatMap(eventPrimitiveFootprintPoints);
        const distances = points.map((point) => Math.hypot(
          Math.max(rect.x - point.x, 0, point.x - rect.x - rect.width),
          Math.max(rect.y - point.y, 0, point.y - rect.y - rect.height),
        ));
        expect(Math.min(...distances)).toBeGreaterThanOrEqual(12);
      }
      const clef = projection.branches.professional.model.primitives.find(({ role }) => role === "clef")!;
      const clefPoints = eventPrimitiveFootprintPoints(clef);
      expect(Math.max(...clefPoints.map(({ y }) => y)) + 12).toBeLessThanOrEqual(rect.y);
      expect(Math.min(...clefPoints.map(({ y }) => y))).toBeGreaterThan(0);
      expect(projection.evidence.pathSelfIntersections).toEqual({ professional: 0 });
      expect(projection.evidence.staffLineSelfIntersections).toEqual({ professional: 0 });
    },
  );

  it.each(["horizontal-enhanced", "vertical-wide", "vertical-compact", "static"] as const)(
    "derives the deterministic Professional handoff target and event-free lead-in from the actual %s projection", (mode) => {
      const projection = buildStoryScoreProjection(mode);
      const crossings = Object.values(projection.branches).flatMap((branch) => [
        ...branch.model.staff.lines.flatMap((line) => intersections(line.points).map((intersection) => ({
          branch: branch.branch, line: line.id, ...intersection,
          zones: branch.zones.filter((zone) => zone.startT <= intersection.right / (line.points.length - 1) && zone.endT >= intersection.left / (line.points.length - 1)).map(({ id, chapterId }) => ({ id, chapterId })),
        }))),
        ...intersections(Array.from({ length: 2049 }, (_, index) => branch.path.pointAt(index / 2048))).map((intersection) => ({ branch: branch.branch, line: "center", ...intersection })),
      ]);
      for (const branch of Object.values(projection.branches)) {
        const { homeEntry, path, staffSpace, eventSafety } = branch;
        expect(homeEntry.point).toEqual(path.pointAt(homeEntry.t));
        expect(homeEntry.tangent).toEqual(path.tangentAt(homeEntry.t));
        expect(homeEntry.staffPoints).toHaveLength(5);
        expect(homeEntry.t).toBeGreaterThan(0);
        expect(homeEntry.t).toBeLessThan(homeEntry.eventFreeLeadIn.endT);
        expect(eventSafety.groups.every(({ marginStartT }) => marginStartT >= homeEntry.eventFreeLeadIn.endT)).toBe(true);
        const normal = path.normalAt(homeEntry.t);
        homeEntry.staffPoints.forEach((point, index) => expect(point).toEqual({
          x: homeEntry.point.x + normal.x * (index - 2) * staffSpace,
          y: homeEntry.point.y + normal.y * (index - 2) * staffSpace,
        }));
        expect(buildStoryScoreProjection(mode).branches[branch.branch].homeEntry).toEqual(homeEntry);
        // Inspect every rendered staff segment, including near-neighbor pairs,
        // independently of the coarser diagnostic sampling used by Projection.
      }
      const originX = projection.branches.professional.path.pointAt(0).x;
      expect(projection.branches.professional.homeEntry.point.x).toBeGreaterThan(originX);
      expect(projection.branches.professional.homeEntry.tangent.x).toBeGreaterThan(0);
      expect(projection.evidence.continuity.maximumPointGap).toBe(0);
      expect(projection.evidence.continuity.minimumTangentAlignment).toBeGreaterThanOrEqual(0.999999);
      expect(crossings).toEqual([]);
    },
  );
});

