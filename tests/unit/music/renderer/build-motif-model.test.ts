import { describe, expect, it } from "vitest";

import type { MotifId } from "@/lib/music/composer/types";
import {
  BEAM_SECONDARY_PERPENDICULAR_EPSILON,
  buildMotifModel,
  TUPLET_LABEL_CENTER_EPSILON_SP,
} from "@/lib/music/renderer/build-motif-model";

import {
  composedMotif,
  downStemBeamLayout,
  noteTs,
  TEST_CALIBRATION,
  TEST_PATH,
  TEST_STAFF_SPACE,
  TEST_TOKENS,
  TEST_TUPLET_LAYOUT,
  upStemBeamLayout,
} from "./fixtures";

const beamCases = [
  ["E8_E8", ["beam-primary"]],
  ["E8_TRIPLET_3", ["beam-primary"]],
  ["S16_S16_S16_S16", ["beam-primary", "beam-secondary"]],
  ["E8_S16_S16", ["beam-primary", "beam-secondary"]],
  ["S16_S16_E8", ["beam-primary", "beam-secondary"]],
  [
    "S16_E8_S16",
    [
      "beam-primary",
      "beam-secondary-hook-left",
      "beam-secondary-hook-right",
    ],
  ],
] as const satisfies readonly [MotifId, readonly string[]][];

describe("buildMotifModel", () => {
  it.each(beamCases)("materializes exact %s topology", (motifId, roles) => {
    const motif = composedMotif(motifId);
    const ts = noteTs(motif.durations.length);
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: ts,
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout: upStemBeamLayout(ts),
      ...(motifId === "E8_TRIPLET_3"
        ? { tupletLayout: TEST_TUPLET_LAYOUT }
        : {}),
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.beams.map(({ role }) => role)).toEqual(roles);
    expect(result.notes.every(({ stemDirection }) => stemDirection === "up"))
      .toBe(true);
    expect(result.notes.every(({ flag }) => flag === undefined)).toBe(true);
  });

  it("emits mandatory centered triplet label and bracket metadata", () => {
    const motif = composedMotif("E8_TRIPLET_3");
    const ts = noteTs(3);
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: ts,
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout: upStemBeamLayout(ts),
      tupletLayout: TEST_TUPLET_LAYOUT,
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.notes).toHaveLength(3);
    expect(result.tuplet).toMatchObject({
      kind: "tuplet",
      label: "3",
      labelPosition: TEST_TUPLET_LAYOUT.labelPosition,
      numeralRotationRadians: 0,
    });
    expect(result.tuplet?.bracket).toHaveLength(4);
  });

  it("rejects a triplet bracket inside the configured beam clearance", () => {
    const motif = composedMotif("E8_TRIPLET_3");
    const ts = noteTs(3);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout: upStemBeamLayout(ts),
        tupletLayout: {
          ...TEST_TUPLET_LAYOUT,
          bracketStart: { x: 29.8, y: -51 },
          bracketEnd: { x: 79.8, y: -51 },
        },
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/bracketClearanceSp/);
  });

  it("rejects a triplet label outside the bracket midpoint epsilon", () => {
    const motif = composedMotif("E8_TRIPLET_3");
    const ts = noteTs(3);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif,
        noteTs: ts,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout: upStemBeamLayout(ts),
        tupletLayout: {
          ...TEST_TUPLET_LAYOUT,
          labelPosition: { x: 54.81, y: -60 },
        },
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/must be centered/);
  });

  it("normalizes label drift within the documented midpoint epsilon", () => {
    const motif = composedMotif("E8_TRIPLET_3");
    const ts = noteTs(3);
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: ts,
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout: upStemBeamLayout(ts),
      tupletLayout: {
        ...TEST_TUPLET_LAYOUT,
        labelPosition: {
          x:
            54.8 +
            (TUPLET_LABEL_CENTER_EPSILON_SP * TEST_STAFF_SPACE) / 2,
          y: -60,
        },
      },
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.tuplet?.labelPosition).toEqual({ x: 54.8, y: -60 });
  });

  it("renders simple motifs without beam geometry", () => {
    const motif = composedMotif("Q3");
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: noteTs(3),
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.notes).toHaveLength(3);
    expect(result.beams).toEqual([]);
    expect(result.tuplet).toBeUndefined();
  });

  it("uses one DOWN direction for an above-center beam group", () => {
    const motif = composedMotif("E8_E8", [6, 8]);
    const ts = noteTs(2);
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: ts,
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout: downStemBeamLayout(ts),
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.notes.map(({ stemDirection }) => stemDirection)).toEqual([
      "down",
      "down",
    ]);
  });

  it("rejects a longitudinal or zero secondary-beam offset direction", () => {
    const motif = composedMotif("E8_E8");
    const ts = noteTs(2);
    const baseLayout = upStemBeamLayout(ts);

    for (const secondaryOffsetDirection of [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ]) {
      expect(() =>
        buildMotifModel({
          calibration: TEST_CALIBRATION,
          motif,
          noteTs: ts,
          path: TEST_PATH,
          staffSpace: TEST_STAFF_SPACE,
          beamLayout: { ...baseLayout, secondaryOffsetDirection },
          tokens: {
            beam: TEST_TOKENS.beam,
            note: TEST_TOKENS.note,
            tuplet: TEST_TOKENS.tuplet,
          },
        }),
      ).toThrow(/perpendicular|non-zero length/);
    }
  });

  it("accepts a secondary offset inside the perpendicularity epsilon", () => {
    const motif = composedMotif("E8_E8");
    const ts = noteTs(2);
    const baseLayout = upStemBeamLayout(ts);
    const result = buildMotifModel({
      calibration: TEST_CALIBRATION,
      motif,
      noteTs: ts,
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      beamLayout: {
        ...baseLayout,
        secondaryOffsetDirection: {
          x: BEAM_SECONDARY_PERPENDICULAR_EPSILON / 2,
          y: 1,
        },
      },
      tokens: {
        beam: TEST_TOKENS.beam,
        note: TEST_TOKENS.note,
        tuplet: TEST_TOKENS.tuplet,
      },
    });

    expect(result.beams).toHaveLength(1);
  });

  it("rejects mutated whitelist semantics and missing layouts", () => {
    const legal = composedMotif("E8_E8");

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif: { ...legal, durations: ["quarter", "quarter"] },
        noteTs: noteTs(2),
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout: upStemBeamLayout(noteTs(2)),
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/durations compatibility array/);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif: {
          ...legal,
          notes: legal.notes.map((note, index) =>
            index === 0 ? { ...note, staffStep: note.staffStep + 1 } : note,
          ),
        },
        noteTs: noteTs(2),
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        beamLayout: upStemBeamLayout(noteTs(2)),
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/staffSteps compatibility array/);

    expect(() =>
      buildMotifModel({
        calibration: TEST_CALIBRATION,
        motif: legal,
        noteTs: noteTs(2),
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        tokens: {
          beam: TEST_TOKENS.beam,
          note: TEST_TOKENS.note,
          tuplet: TEST_TOKENS.tuplet,
        },
      }),
    ).toThrow(/requires an explicit beamLayout/);
  });
});
