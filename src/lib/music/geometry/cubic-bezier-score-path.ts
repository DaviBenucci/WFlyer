import {
  orientedPitchNormal,
  type PitchNormalOrientation,
  type PitchNormalReference,
  resolvePitchNormalOrientation,
} from "./score-path";
import type { ScorePath, Vec2 } from "./types";
import { requireNormalizedPosition } from "./units";
import {
  addVectors,
  normalizeVector,
  requireVec2,
  scaleVector,
  subtractVectors,
} from "./vectors";

export class CubicBezierScorePath implements ScorePath {
  readonly #control1: Vec2;
  readonly #control2: Vec2;
  readonly #end: Vec2;
  readonly #orientation: PitchNormalOrientation;
  readonly #start: Vec2;

  constructor(
    start: Vec2,
    control1: Vec2,
    control2: Vec2,
    end: Vec2,
    pitchNormalReference: PitchNormalReference,
  ) {
    this.#start = { ...requireVec2(start, "start") };
    this.#control1 = { ...requireVec2(control1, "control1") };
    this.#control2 = { ...requireVec2(control2, "control2") };
    this.#end = { ...requireVec2(end, "end") };
    this.#orientation = resolvePitchNormalOrientation(
      this.#normalizedTangentAt(pitchNormalReference.at),
      pitchNormalReference,
    );
  }

  #derivativeAt(t: number): Vec2 {
    const inverse = 1 - t;

    return addVectors(
      addVectors(
        scaleVector(
          subtractVectors(this.#control1, this.#start),
          3 * inverse * inverse,
        ),
        scaleVector(
          subtractVectors(this.#control2, this.#control1),
          6 * inverse * t,
        ),
      ),
      scaleVector(
        subtractVectors(this.#end, this.#control2),
        3 * t * t,
      ),
    );
  }

  #normalizedTangentAt(t: number): Vec2 {
    requireNormalizedPosition(t);

    return normalizeVector(this.#derivativeAt(t), "cubic path derivative");
  }

  pointAt(t: number): Vec2 {
    requireNormalizedPosition(t);
    const inverse = 1 - t;

    return addVectors(
      addVectors(
        scaleVector(this.#start, inverse ** 3),
        scaleVector(this.#control1, 3 * inverse * inverse * t),
      ),
      addVectors(
        scaleVector(this.#control2, 3 * inverse * t * t),
        scaleVector(this.#end, t ** 3),
      ),
    );
  }

  tangentAt(t: number): Vec2 {
    return this.#normalizedTangentAt(t);
  }

  normalAt(t: number): Vec2 {
    return orientedPitchNormal(
      this.#normalizedTangentAt(t),
      this.#orientation,
    );
  }
}
