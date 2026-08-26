import type { LineSegment, StaffSpace, Vec2 } from "./types";
import {
  requirePositiveNumber,
  requireStaffSpace,
} from "./units";
import {
  addVectors,
  dotVectors,
  leftNormal,
  normalizeVector,
  requireVec2,
  scaleVector,
  subtractVectors,
  vectorLength,
} from "./vectors";

export type BeamMotifId =
  | "E8_E8"
  | "E8_TRIPLET_3"
  | "E8_S16_S16"
  | "S16_E8_S16"
  | "S16_S16_E8"
  | "S16_S16_S16_S16";

export interface ContinuousBeamTopologyElement {
  readonly fromNoteIndex: number;
  readonly kind: "primary" | "secondary";
  readonly toNoteIndex: number;
}

export interface HookBeamTopologyElement {
  readonly direction: "backward" | "forward";
  readonly kind: "hook";
  readonly noteIndex: number;
}

export type BeamTopologyElement =
  | ContinuousBeamTopologyElement
  | HookBeamTopologyElement;

export interface TripletTopology {
  readonly bracket: true;
  readonly count: 3;
  readonly label: "3";
}

export interface BeamTopology {
  readonly elements: readonly BeamTopologyElement[];
  readonly motifId: BeamMotifId;
  readonly noteCount: 2 | 3 | 4;
  readonly triplet: TripletTopology | null;
}

const BEAM_TOPOLOGIES = {
  E8_E8: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 1 },
    ],
    motifId: "E8_E8",
    noteCount: 2,
    triplet: null,
  },
  E8_TRIPLET_3: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 2 },
    ],
    motifId: "E8_TRIPLET_3",
    noteCount: 3,
    triplet: { bracket: true, count: 3, label: "3" },
  },
  E8_S16_S16: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 2 },
      { fromNoteIndex: 1, kind: "secondary", toNoteIndex: 2 },
    ],
    motifId: "E8_S16_S16",
    noteCount: 3,
    triplet: null,
  },
  S16_E8_S16: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 2 },
      { direction: "forward", kind: "hook", noteIndex: 0 },
      { direction: "backward", kind: "hook", noteIndex: 2 },
    ],
    motifId: "S16_E8_S16",
    noteCount: 3,
    triplet: null,
  },
  S16_S16_E8: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 2 },
      { fromNoteIndex: 0, kind: "secondary", toNoteIndex: 1 },
    ],
    motifId: "S16_S16_E8",
    noteCount: 3,
    triplet: null,
  },
  S16_S16_S16_S16: {
    elements: [
      { fromNoteIndex: 0, kind: "primary", toNoteIndex: 3 },
      { fromNoteIndex: 0, kind: "secondary", toNoteIndex: 3 },
    ],
    motifId: "S16_S16_S16_S16",
    noteCount: 4,
    triplet: null,
  },
} as const satisfies Record<BeamMotifId, BeamTopology>;

export interface BeamPrimitive extends LineSegment {
  readonly direction?: "backward" | "forward";
  readonly fromNoteIndex: number;
  readonly kind: "hook" | "primary" | "secondary";
  readonly thickness: number;
  readonly toNoteIndex: number;
}

export interface MaterializeBeamTopologyInput {
  /** Explicit world-space beam progression; the core never invents a slope. */
  readonly axisDirection: Vec2;
  readonly hookLengthInStaffSpaces: number;
  readonly motifId: BeamMotifId;
  /** Exact stem-to-primary-beam attachment points in semantic note order. */
  readonly primaryAttachments: readonly Vec2[];
  readonly primaryThicknessInStaffSpaces: number;
  /** Explicit world-oriented offset from the primary to secondary beam, in staffSpaces. */
  readonly secondaryOffsetInStaffSpaces: Vec2;
  readonly secondaryThicknessInStaffSpaces: number;
  readonly staffSpace: StaffSpace;
}

const BEAM_AXIS_EPSILON = 1e-7;

export function getBeamTopology(motifId: BeamMotifId): BeamTopology {
  return BEAM_TOPOLOGIES[motifId];
}

function validatePrimaryAttachments(
  attachments: readonly Vec2[],
  noteCount: number,
  axis: Vec2,
): void {
  if (attachments.length !== noteCount) {
    throw new RangeError(
      `primaryAttachments must contain exactly ${noteCount} points`,
    );
  }

  const origin = attachments[0];

  if (!origin) {
    throw new RangeError("primaryAttachments must not be empty");
  }

  requireVec2(origin, "primaryAttachments[0]");
  const crossAxis = leftNormal(axis);
  let previousProgress = 0;

  attachments.forEach((attachment, index) => {
    requireVec2(attachment, `primaryAttachments[${index}]`);
    const delta = subtractVectors(attachment, origin);
    const progress = dotVectors(delta, axis);
    const crossDistance = Math.abs(dotVectors(delta, crossAxis));
    const tolerance = BEAM_AXIS_EPSILON * Math.max(1, vectorLength(delta));

    if (crossDistance > tolerance) {
      throw new RangeError("primaryAttachments must lie on the explicit beam axis");
    }

    if (index > 0 && progress <= previousProgress + BEAM_AXIS_EPSILON) {
      throw new RangeError(
        "primaryAttachments must progress strictly along axisDirection",
      );
    }

    previousProgress = progress;
  });
}

export function materializeBeamTopology(
  input: MaterializeBeamTopologyInput,
): readonly BeamPrimitive[] {
  const topology = getBeamTopology(input.motifId);
  const staffSpace = requireStaffSpace(input.staffSpace);
  const axis = normalizeVector(input.axisDirection, "axisDirection");
  validatePrimaryAttachments(input.primaryAttachments, topology.noteCount, axis);

  const primaryThickness =
    requirePositiveNumber(
      input.primaryThicknessInStaffSpaces,
      "primaryThicknessInStaffSpaces",
    ) * staffSpace;
  const secondaryThickness =
    requirePositiveNumber(
      input.secondaryThicknessInStaffSpaces,
      "secondaryThicknessInStaffSpaces",
    ) * staffSpace;
  const hookLength =
    requirePositiveNumber(
      input.hookLengthInStaffSpaces,
      "hookLengthInStaffSpaces",
    ) * staffSpace;
  const secondaryOffset = scaleVector(
    requireVec2(
      input.secondaryOffsetInStaffSpaces,
      "secondaryOffsetInStaffSpaces",
    ),
    staffSpace,
  );

  if (vectorLength(secondaryOffset) <= BEAM_AXIS_EPSILON) {
    throw new RangeError("secondaryOffsetInStaffSpaces must be non-zero");
  }

  return topology.elements.map((element): BeamPrimitive => {
    if (element.kind !== "hook") {
      const startAttachment = input.primaryAttachments[element.fromNoteIndex];
      const endAttachment = input.primaryAttachments[element.toNoteIndex];

      if (!startAttachment || !endAttachment) {
        throw new RangeError("Beam topology references a missing attachment");
      }

      const offset = element.kind === "secondary" ? secondaryOffset : { x: 0, y: 0 };

      return {
        end: addVectors(endAttachment, offset),
        fromNoteIndex: element.fromNoteIndex,
        kind: element.kind,
        start: addVectors(startAttachment, offset),
        thickness:
          element.kind === "primary" ? primaryThickness : secondaryThickness,
        toNoteIndex: element.toNoteIndex,
      };
    }

    const attachment = input.primaryAttachments[element.noteIndex];

    if (!attachment) {
      throw new RangeError("Beam hook references a missing attachment");
    }

    const hookAttachment = addVectors(attachment, secondaryOffset);
    const hookVector = scaleVector(axis, hookLength);
    const start =
      element.direction === "forward"
        ? hookAttachment
        : addVectors(hookAttachment, scaleVector(hookVector, -1));
    const end =
      element.direction === "forward"
        ? addVectors(hookAttachment, hookVector)
        : hookAttachment;

    return {
      direction: element.direction,
      end,
      fromNoteIndex: element.noteIndex,
      kind: "hook",
      start,
      thickness: secondaryThickness,
      toNoteIndex: element.noteIndex,
    };
  });
}
