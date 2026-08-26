import {
  orientedPitchNormal,
  type PitchNormalOrientation,
  type PitchNormalReference,
  resolvePitchNormalOrientation,
} from "./score-path";
import type { ScorePath, Vec2 } from "./types";
import { requireNormalizedPosition } from "./units";
import {
  lerpVectors,
  normalizeVector,
  requireVec2,
  subtractVectors,
} from "./vectors";

export class StraightScorePath implements ScorePath {
  readonly #end: Vec2;
  readonly #orientation: PitchNormalOrientation;
  readonly #start: Vec2;
  readonly #tangent: Vec2;

  constructor(
    start: Vec2,
    end: Vec2,
    pitchNormalReference: PitchNormalReference,
  ) {
    this.#start = { ...requireVec2(start, "start") };
    this.#end = { ...requireVec2(end, "end") };
    this.#tangent = normalizeVector(
      subtractVectors(this.#end, this.#start),
      "straight path direction",
    );
    this.#orientation = resolvePitchNormalOrientation(
      this.#tangent,
      pitchNormalReference,
    );
  }

  pointAt(t: number): Vec2 {
    requireNormalizedPosition(t);

    return lerpVectors(this.#start, this.#end, t);
  }

  tangentAt(t: number): Vec2 {
    requireNormalizedPosition(t);

    return { ...this.#tangent };
  }

  normalAt(t: number): Vec2 {
    requireNormalizedPosition(t);

    return orientedPitchNormal(this.#tangent, this.#orientation);
  }
}
