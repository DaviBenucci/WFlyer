import type { Vec2 } from "@/lib/music/geometry/types";
import type { StoryScoreMeasuredRect } from "./projection";

function distanceToSegment(point: Vec2, a: Vec2, b: Vec2): number {
  const length = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  const t = length
    ? Math.max(
        0,
        Math.min(
          1,
          ((point.x - a.x) * (b.x - a.x) +
            (point.y - a.y) * (b.y - a.y)) /
            length,
        ),
      )
    : 0;

  return Math.hypot(
    point.x - a.x - t * (b.x - a.x),
    point.y - a.y - t * (b.y - a.y),
  );
}

const CROSS_EPSILON = 1e-7;

function cross(a: Vec2, b: Vec2, c: Vec2): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function pointOnSegment(point: Vec2, a: Vec2, b: Vec2): boolean {
  return (
    Math.abs(cross(a, b, point)) <= CROSS_EPSILON &&
    point.x >= Math.min(a.x, b.x) - CROSS_EPSILON &&
    point.x <= Math.max(a.x, b.x) + CROSS_EPSILON &&
    point.y >= Math.min(a.y, b.y) - CROSS_EPSILON &&
    point.y <= Math.max(a.y, b.y) + CROSS_EPSILON
  );
}

function segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
  const abC = cross(a, b, c);
  const abD = cross(a, b, d);
  const cdA = cross(c, d, a);
  const cdB = cross(c, d, b);

  return (
    (abC * abD < -CROSS_EPSILON && cdA * cdB < -CROSS_EPSILON) ||
    pointOnSegment(c, a, b) ||
    pointOnSegment(d, a, b) ||
    pointOnSegment(a, c, d) ||
    pointOnSegment(b, c, d)
  );
}

function pointInsidePolygon(point: Vec2, polygon: readonly Vec2[]): boolean {
  let inside = false;

  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index]!;
    const b = polygon[(index + 1) % polygon.length]!;
    if (pointOnSegment(point, a, b)) return true;

    if (
      (a.y > point.y) !== (b.y > point.y) &&
      point.x <
        ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function segmentDistance(a: Vec2, b: Vec2, c: Vec2, d: Vec2): number {
  if (segmentsIntersect(a, b, c, d)) return 0;

  return Math.min(
    distanceToSegment(a, c, d),
    distanceToSegment(b, c, d),
    distanceToSegment(c, a, b),
    distanceToSegment(d, a, b),
  );
}

/** Signed complete-segment clearance, including intersections between endpoints. */
export function projectsSegmentClearance(
  a: Vec2,
  b: Vec2,
  rect: StoryScoreMeasuredRect,
  radius = 0,
): number {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  const pointDistance = (point: Vec2) => {
    const dx = Math.max(rect.x - point.x, 0, point.x - right);
    const dy = Math.max(rect.y - point.y, 0, point.y - bottom);

    return dx || dy
      ? Math.hypot(dx, dy)
      : -Math.min(
          point.x - rect.x,
          right - point.x,
          point.y - rect.y,
          bottom - point.y,
        );
  };
  let enter = 0;
  let exit = 1;

  for (const [start, end, low, high] of [
    [a.x, b.x, rect.x, right],
    [a.y, b.y, rect.y, bottom],
  ] as const) {
    const delta = end - start;

    if (delta === 0) {
      if (start < low || start > high) enter = 2;
    } else {
      const near = (low - start) / delta;
      const far = (high - start) / delta;
      enter = Math.max(enter, Math.min(near, far));
      exit = Math.min(exit, Math.max(near, far));
    }
  }

  const endpoints = Math.min(pointDistance(a), pointDistance(b));
  const corners = [
    { x: rect.x, y: rect.y },
    { x: right, y: rect.y },
    { x: right, y: bottom },
    { x: rect.x, y: bottom },
  ];

  return (
    (enter <= exit
      ? Math.min(0, endpoints)
      : Math.min(
          endpoints,
          ...corners.map((point) => distanceToSegment(point, a, b)),
        )) - radius
  );
}

/**
 * Complete segment-to-polygon clearance. The caller-provided padding expands
 * the sampled protected locus and must include the continuous-transition and
 * numerical error bound.
 */
export function projectsSegmentPolygonClearance(
  a: Vec2,
  b: Vec2,
  polygon: readonly Vec2[],
  radius = 0,
  padding = 0,
): number {
  if (
    polygon.length < 3 ||
    pointInsidePolygon(a, polygon) ||
    pointInsidePolygon(b, polygon)
  ) {
    return -radius - padding;
  }

  const clearance = Math.min(
    ...polygon.map((point, index) =>
      segmentDistance(
        a,
        b,
        point,
        polygon[(index + 1) % polygon.length]!,
      ),
    ),
  );

  return clearance - radius - padding;
}
