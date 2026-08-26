import { describe, expect, it } from "vitest";

import { buildAccidentalPlacement } from "@/lib/music/geometry/accidentals";
import {
  buildFinalBarline,
  buildOrdinaryBarline,
} from "@/lib/music/geometry/barlines";
import {
  buildTrebleKeySignature,
  getTrebleKeySignatureEntries,
  TREBLE_FLAT_STEPS,
  TREBLE_SHARP_STEPS,
  type KeySignatureEntry,
} from "@/lib/music/geometry/key-signatures";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import type { Fifths } from "@/lib/music/geometry/types";

const path = new StraightScorePath(
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
);

describe("accidental placement", () => {
  it("places the glyph pitchCenter before the note using explicit bounds and gap", () => {
    expect(
      buildAccidentalPlacement({
        accidental: "sharp",
        accidentalWidthInStaffSpaces: 0.8,
        gapInStaffSpaces: 0.2,
        noteheadWidthInStaffSpaces: 1.2,
        path,
        staffSpace: 10,
        staffStep: 8,
        t: 0.5,
      }),
    ).toEqual({
      accidental: "sharp",
      pitchCenter: { x: 38, y: -20 },
      staffStep: 8,
    });
  });
});

describe("treble key signatures", () => {
  it.each(Array.from({ length: 15 }, (_, index) => (index - 7) as Fifths))(
    "supports fifths=%i with deterministic count and order",
    (fifths) => {
      const entries = getTrebleKeySignatureEntries(fifths);
      const expectedSteps =
        fifths > 0
          ? TREBLE_SHARP_STEPS.slice(0, fifths)
          : TREBLE_FLAT_STEPS.slice(0, Math.abs(fifths));

      expect(entries).toHaveLength(Math.abs(fifths));
      expect(entries.map((entry: KeySignatureEntry) => entry.staffStep)).toEqual(
        expectedSteps,
      );
      expect(
        entries.every((entry: KeySignatureEntry) =>
          fifths > 0
            ? entry.accidental === "sharp"
            : entry.accidental === "flat",
        ),
      ).toBe(true);
    },
  );

  it("uses configured deterministic horizontal spacing", () => {
    const placements = buildTrebleKeySignature({
      accidentalWidthInStaffSpaces: 0.8,
      fifths: 4,
      gapInStaffSpaces: 0.2,
      path,
      staffSpace: 10,
      startOffsetInStaffSpaces: 1,
      t: 0.25,
    });

    expect(placements.map((entry) => entry.staffStep)).toEqual([8, 5, 9, 6]);
    expect(placements.map((entry) => entry.pitchCenter.x)).toEqual([
      35, 45, 55, 65,
    ]);
    expect(placements.map((entry) => entry.pitchCenter.y)).toEqual([
      -20, -5, -25, -10,
    ]);
  });
});

describe("barlines", () => {
  it("spans all five staff lines along the pitch normal", () => {
    expect(
      buildOrdinaryBarline({
        path,
        staffSpace: 10,
        t: 0.5,
        thicknessInStaffSpaces: 0.1,
      }),
    ).toEqual({
      center: { x: 50, y: 0 },
      end: { x: 50, y: -20 },
      role: "ordinary",
      start: { x: 50, y: 20 },
      thickness: 1,
    });
  });

  it("orders the final thin stroke, clear gap, and thick stroke", () => {
    const final = buildFinalBarline({
      gapInStaffSpaces: 0.2,
      path,
      staffSpace: 10,
      t: 0.5,
      thickThicknessInStaffSpaces: 0.3,
      thinThicknessInStaffSpaces: 0.1,
    });

    expect(final.gap).toBe(2);
    expect(final.strokes).toEqual([
      {
        center: { x: 50, y: 0 },
        end: { x: 50, y: -20 },
        role: "final-thin",
        start: { x: 50, y: 20 },
        thickness: 1,
      },
      {
        center: { x: 54, y: 0 },
        end: { x: 54, y: -20 },
        role: "final-thick",
        start: { x: 54, y: 20 },
        thickness: 3,
      },
    ]);

    const [thin, thick] = final.strokes;
    const measuredClearGap =
      thick.center.x - thick.thickness / 2 - (thin.center.x + thin.thickness / 2);
    expect(measuredClearGap).toBe(final.gap);
  });
});
