import { frameAt } from "./score-path";
import type { LineSegment, ScorePath, StaffSpace, Vec2 } from "./types";
import {
  requireNonNegativeNumber,
  requirePositiveNumber,
  requireStaffSpace,
} from "./units";
import { addVectors, scaleVector } from "./vectors";

export type BarlineRole = "final-thick" | "final-thin" | "ordinary";

export interface BarlineStroke extends LineSegment {
  readonly center: Vec2;
  readonly role: BarlineRole;
  readonly thickness: number;
}

export interface OrdinaryBarlineInput {
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly t: number;
  readonly thicknessInStaffSpaces: number;
}

export interface FinalBarlineInput {
  readonly gapInStaffSpaces: number;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly t: number;
  readonly thickThicknessInStaffSpaces: number;
  readonly thinThicknessInStaffSpaces: number;
}

export interface FinalBarlineModel {
  readonly gap: number;
  /** Ordered along score progression: thin stroke, configured clear gap, thick stroke. */
  readonly strokes: readonly [BarlineStroke, BarlineStroke];
}

function buildBarlineStroke(
  path: ScorePath,
  t: number,
  staffSpace: StaffSpace,
  tangentOffset: number,
  thickness: number,
  role: BarlineRole,
): BarlineStroke {
  const frame = frameAt(path, t);
  const center = addVectors(
    frame.point,
    scaleVector(frame.tangent, tangentOffset),
  );
  const halfSpan = 2 * staffSpace;

  return {
    center,
    end: addVectors(center, scaleVector(frame.normal, halfSpan)),
    role,
    start: addVectors(center, scaleVector(frame.normal, -halfSpan)),
    thickness,
  };
}

export function buildOrdinaryBarline(
  input: OrdinaryBarlineInput,
): BarlineStroke {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const thickness =
    requirePositiveNumber(
      input.thicknessInStaffSpaces,
      "thicknessInStaffSpaces",
    ) * staffSpace;

  return buildBarlineStroke(
    input.path,
    input.t,
    staffSpace,
    0,
    thickness,
    "ordinary",
  );
}

export function buildFinalBarline(
  input: FinalBarlineInput,
): FinalBarlineModel {
  const staffSpace = requireStaffSpace(input.staffSpace);
  const thinThickness =
    requirePositiveNumber(
      input.thinThicknessInStaffSpaces,
      "thinThicknessInStaffSpaces",
    ) * staffSpace;
  const thickThickness =
    requirePositiveNumber(
      input.thickThicknessInStaffSpaces,
      "thickThicknessInStaffSpaces",
    ) * staffSpace;
  const gap =
    requireNonNegativeNumber(input.gapInStaffSpaces, "gapInStaffSpaces") *
    staffSpace;
  const thickCenterOffset = thinThickness / 2 + gap + thickThickness / 2;
  const thinStroke = buildBarlineStroke(
    input.path,
    input.t,
    staffSpace,
    0,
    thinThickness,
    "final-thin",
  );
  const thickStroke = buildBarlineStroke(
    input.path,
    input.t,
    staffSpace,
    thickCenterOffset,
    thickThickness,
    "final-thick",
  );

  return { gap, strokes: [thinStroke, thickStroke] };
}
