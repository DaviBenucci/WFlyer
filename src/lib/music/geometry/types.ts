export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export interface LineSegment {
  readonly end: Vec2;
  readonly start: Vec2;
}

/** A diatonic line/space position relative to E4 = 0. */
export type StaffStep = number;

/** The world-space distance between adjacent visible staff lines. */
export type StaffSpace = number;

export type StemDirection = "down" | "up";

export type Accidental = "flat" | "natural" | "sharp";

export type Fifths =
  | -7
  | -6
  | -5
  | -4
  | -3
  | -2
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7;

/**
 * The logical score guide. `pointAt` lies on B4 / staffStep 4 and
 * `normalAt` always points toward increasing pitch.
 */
export interface ScorePath {
  normalAt(t: number): Vec2;
  pointAt(t: number): Vec2;
  tangentAt(t: number): Vec2;
}

export interface ScorePathFrame {
  readonly normal: Vec2;
  readonly point: Vec2;
  readonly tangent: Vec2;
}
