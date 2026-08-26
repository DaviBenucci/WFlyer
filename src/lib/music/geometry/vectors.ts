import type { Vec2 } from "./types";
import { requireFiniteNumber } from "./units";

export const VECTOR_EPSILON = 1e-12;

export function requireVec2(vector: Vec2, label = "vector"): Vec2 {
  requireFiniteNumber(vector.x, `${label}.x`);
  requireFiniteNumber(vector.y, `${label}.y`);

  return vector;
}

export function addVectors(left: Vec2, right: Vec2): Vec2 {
  requireVec2(left, "left");
  requireVec2(right, "right");

  return { x: left.x + right.x, y: left.y + right.y };
}

export function subtractVectors(left: Vec2, right: Vec2): Vec2 {
  requireVec2(left, "left");
  requireVec2(right, "right");

  return { x: left.x - right.x, y: left.y - right.y };
}

export function scaleVector(vector: Vec2, scalar: number): Vec2 {
  requireVec2(vector);
  requireFiniteNumber(scalar, "scalar");

  return { x: vector.x * scalar, y: vector.y * scalar };
}

export function dotVectors(left: Vec2, right: Vec2): number {
  requireVec2(left, "left");
  requireVec2(right, "right");

  return left.x * right.x + left.y * right.y;
}

export function vectorLength(vector: Vec2): number {
  requireVec2(vector);

  return Math.hypot(vector.x, vector.y);
}

export function normalizeVector(vector: Vec2, label = "vector"): Vec2 {
  requireVec2(vector, label);
  const length = vectorLength(vector);

  if (length <= VECTOR_EPSILON) {
    throw new RangeError(`${label} must have non-zero length`);
  }

  return scaleVector(vector, 1 / length);
}

export function leftNormal(vector: Vec2): Vec2 {
  const normalized = normalizeVector(vector);

  return { x: -normalized.y, y: normalized.x };
}

export function distanceBetween(start: Vec2, end: Vec2): number {
  return vectorLength(subtractVectors(end, start));
}

export function lerpVectors(start: Vec2, end: Vec2, amount: number): Vec2 {
  requireVec2(start, "start");
  requireVec2(end, "end");
  requireFiniteNumber(amount, "amount");

  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}
