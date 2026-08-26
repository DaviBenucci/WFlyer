import { describe, expect, it } from "vitest";

import {
  getBeamTopology,
  materializeBeamTopology,
  type BeamMotifId,
} from "@/lib/music/geometry/beams";
import {
  buildStem,
  resolveBeamGroupStemDirection,
  resolveIsolatedStemDirection,
} from "@/lib/music/geometry/stems";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";

describe("stem direction", () => {
  it("uses down at B4 and up only below B4 for isolated notes", () => {
    expect(resolveIsolatedStemDirection(3)).toBe("up");
    expect(resolveIsolatedStemDirection(4)).toBe("down");
    expect(resolveIsolatedStemDirection(5)).toBe("down");
    expect(resolveIsolatedStemDirection(8, "up")).toBe("up");
  });

  it("uses Option B balance, farthest extreme, then down symmetry", () => {
    expect(resolveBeamGroupStemDirection([0, 2, 4])).toBe("up");
    expect(resolveBeamGroupStemDirection([4, 6, 8])).toBe("down");
    expect(resolveBeamGroupStemDirection([0, 6, 6])).toBe("up");
    expect(resolveBeamGroupStemDirection([6, 3, 3])).toBe("down");
    expect(resolveBeamGroupStemDirection([0, 8])).toBe("down");
    expect(resolveBeamGroupStemDirection([4, 4])).toBe("down");
    expect(() => resolveBeamGroupStemDirection([])).toThrow(/at least one/);
  });

  it("extends an explicit calibrated anchor along pitch N", () => {
    const path = new StraightScorePath(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
    );
    const common = {
      attachment: { x: 50, y: 0 },
      lengthInStaffSpaces: 3,
      path,
      staffSpace: 10,
      t: 0.5,
      thicknessInStaffSpaces: 0.1,
    } as const;

    expect(buildStem({ ...common, direction: "up" })).toEqual({
      direction: "up",
      end: { x: 50, y: -30 },
      start: { x: 50, y: 0 },
      thickness: 1,
    });
    expect(buildStem({ ...common, direction: "down" })).toEqual({
      direction: "down",
      end: { x: 50, y: 30 },
      start: { x: 50, y: 0 },
      thickness: 1,
    });
  });
});

describe("approved beam topology", () => {
  const expectedElements: Record<BeamMotifId, readonly string[]> = {
    E8_E8: ["primary:0-1"],
    E8_TRIPLET_3: ["primary:0-2"],
    E8_S16_S16: ["primary:0-2", "secondary:1-2"],
    S16_E8_S16: ["primary:0-2", "hook:0:forward", "hook:2:backward"],
    S16_S16_E8: ["primary:0-2", "secondary:0-1"],
    S16_S16_S16_S16: ["primary:0-3", "secondary:0-3"],
  };

  it.each(Object.entries(expectedElements) as [BeamMotifId, readonly string[]][])(
    "encodes only the approved %s topology",
    (motifId, expected) => {
      const topology = getBeamTopology(motifId);
      const actual = topology.elements.map((element) =>
        element.kind === "hook"
          ? `hook:${element.noteIndex}:${element.direction}`
          : `${element.kind}:${element.fromNoteIndex}-${element.toNoteIndex}`,
      );

      expect(actual).toEqual(expected);
    },
  );

  it("requires triplet bracket and centered 3 metadata", () => {
    expect(getBeamTopology("E8_TRIPLET_3")).toMatchObject({
      noteCount: 3,
      triplet: { bracket: true, count: 3, label: "3" },
    });
  });

  it("materializes mixed hooks from an explicit caller-owned axis", () => {
    const primitives = materializeBeamTopology({
      axisDirection: { x: 1, y: 0 },
      hookLengthInStaffSpaces: 0.5,
      motifId: "S16_E8_S16",
      primaryAttachments: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 20, y: 0 },
      ],
      primaryThicknessInStaffSpaces: 0.5,
      secondaryOffsetInStaffSpaces: { x: 0, y: 0.4 },
      secondaryThicknessInStaffSpaces: 0.4,
      staffSpace: 10,
    });

    expect(primitives).toEqual([
      {
        end: { x: 20, y: 0 },
        fromNoteIndex: 0,
        kind: "primary",
        start: { x: 0, y: 0 },
        thickness: 5,
        toNoteIndex: 2,
      },
      {
        direction: "forward",
        end: { x: 5, y: 4 },
        fromNoteIndex: 0,
        kind: "hook",
        start: { x: 0, y: 4 },
        thickness: 4,
        toNoteIndex: 0,
      },
      {
        direction: "backward",
        end: { x: 20, y: 4 },
        fromNoteIndex: 2,
        kind: "hook",
        start: { x: 15, y: 4 },
        thickness: 4,
        toNoteIndex: 2,
      },
    ]);
  });

  it("rejects non-collinear inputs instead of inventing an automatic beam slope", () => {
    expect(() =>
      materializeBeamTopology({
        axisDirection: { x: 1, y: 0 },
        hookLengthInStaffSpaces: 0.5,
        motifId: "E8_E8",
        primaryAttachments: [
          { x: 0, y: 0 },
          { x: 10, y: 2 },
        ],
        primaryThicknessInStaffSpaces: 0.5,
        secondaryOffsetInStaffSpaces: { x: 0, y: 0.4 },
        secondaryThicknessInStaffSpaces: 0.4,
        staffSpace: 10,
      }),
    ).toThrow(/explicit beam axis/);
  });
});
