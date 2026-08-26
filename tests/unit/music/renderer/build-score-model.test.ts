import { describe, expect, it } from "vitest";

import { buildScoreModel } from "@/lib/music/renderer/build-score-model";
import type { Fifths } from "@/lib/music/geometry/types";

import {
  composedMotif,
  downStemBeamLayout,
  noteTs,
  TEST_CALIBRATION,
  TEST_DOWN_TUPLET_LAYOUT,
  TEST_PATH,
  TEST_REVERSED_PATH,
  TEST_STAFF_SPACE,
  TEST_TOKENS,
} from "./fixtures";

describe("buildScoreModel", () => {
  it("builds five visible lines including the B4 master guide", () => {
    const result = buildScoreModel({
      id: "score",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 5,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      motifs: [],
    });

    expect(result.staff.lines).toHaveLength(5);
    expect(result.staff.masterGuideStaffStep).toBe(4);
    expect(result.staff.lines.map(({ id }) => id)).toEqual([
      "wf-score:staff:0",
      "wf-score:staff:2",
      "wf-score:staff:4",
      "wf-score:staff:6",
      "wf-score:staff:8",
    ]);
    expect(result.staff.lines[2]?.points).toEqual([
      { x: 0, y: 0 },
      { x: 25, y: 0 },
      { x: 50, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 0 },
    ]);
  });

  it("orders staff, structure, notes, annotations, then barlines", () => {
    const result = buildScoreModel({
      id: "score",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 3,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      clef: { t: 0.05 },
      keySignature: { fifths: 4, t: 0.15 },
      motifs: [
        {
          motif: composedMotif("Q1", [4]),
          noteTs: [0.5],
        },
      ],
      barlines: [{ id: "ordinary", t: 0.75 }],
      finalBarline: { id: "terminal", t: 0.95 },
    });

    expect(result.layers.map(({ id }) => id)).toEqual([
      "staff",
      "structural",
      "notes",
      "annotations",
      "barlines",
    ]);
    expect(
      result.layers[1]?.primitives.filter(
        ({ role }) => role === "key-signature",
      ),
    ).toHaveLength(4);
    expect(result.layers.at(-1)?.primitives.map(({ role }) => role)).toEqual([
      "barline",
      "final-barline-thin",
      "final-barline-thick",
    ]);

    const finalStrokes = result.layers
      .at(-1)
      ?.primitives.filter(({ role }) => role.startsWith("final-barline"));
    expect(finalStrokes?.[0]).toMatchObject({
      role: "final-barline-thin",
      thickness: 0.8,
    });
    expect(finalStrokes?.[1]).toMatchObject({
      role: "final-barline-thick",
      thickness: 3,
    });
  });

  it("renders fifths zero as no key signature", () => {
    const result = buildScoreModel({
      id: "score",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 2,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      clef: { t: 0.05 },
      keySignature: { fifths: 0, t: 0.1 },
      motifs: [],
    });

    expect(
      result.primitives.filter(({ role }) => role === "key-signature"),
    ).toEqual([]);
  });

  it("maps every fifths value to the correct glyph family and count", () => {
    for (let fifths = -7; fifths <= 7; fifths += 1) {
      const result = buildScoreModel({
        id: `score-${fifths}`,
        path: TEST_PATH,
        staffSpace: TEST_STAFF_SPACE,
        staffSampleCount: 2,
        calibration: TEST_CALIBRATION,
        tokens: TEST_TOKENS,
        clef: { t: 0.05 },
        keySignature: { fifths: fifths as Fifths, t: 0.1 },
        motifs: [],
      });
      const glyphs = result.primitives.filter(
        (primitive) => primitive.role === "key-signature",
      );

      expect(glyphs).toHaveLength(Math.abs(fifths));

      if (fifths !== 0) {
        expect(glyphs.every((glyph) => glyph.kind === "glyph")).toBe(true);
        expect(
          glyphs.every(
            (glyph) =>
              glyph.kind === "glyph" &&
              glyph.assetKey ===
                (fifths > 0
                  ? "wf-music-accidental-sharp"
                  : "wf-music-accidental-flat"),
          ),
        ).toBe(true);
      }
    }
  });

  it("globally paints ledgers, notes, beams, tuplets, then barlines", () => {
    const triplet = composedMotif("E8_TRIPLET_3", [10, 11, 12]);
    const ts = noteTs(3);
    const result = buildScoreModel({
      id: "paint-order",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 2,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      clef: { t: 0.01 },
      keySignature: { fifths: 1, t: 0.05 },
      motifs: [
        { motif: composedMotif("Q1", [-4]), noteTs: [0.1] },
        {
          motif: triplet,
          noteTs: ts,
          beamLayout: downStemBeamLayout(ts),
          tupletLayout: TEST_DOWN_TUPLET_LAYOUT,
        },
      ],
      finalBarline: { id: "terminal", t: 0.95 },
    });
    const roles = result.primitives.map(({ role }) => role);
    const lastLedger = roles.lastIndexOf("ledger");
    const firstNotehead = roles.indexOf("notehead");
    const lastStem = roles.lastIndexOf("stem");
    const firstBeam = roles.indexOf("beam-primary");
    const tuplet = roles.indexOf("tuplet");
    const firstBarline = roles.indexOf("final-barline-thin");

    expect(lastLedger).toBeGreaterThan(-1);
    expect(lastLedger).toBeLessThan(firstNotehead);
    expect(lastStem).toBeLessThan(firstBeam);
    expect(firstBeam).toBeLessThan(tuplet);
    expect(tuplet).toBeLessThan(firstBarline);
    expect(result.primitives.every(({ id }) => id.startsWith("wf-"))).toBe(
      true,
    );
  });

  it("uses frame handedness for reversed clef and key-signature glyphs", () => {
    const forward = buildScoreModel({
      id: "forward",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 2,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      clef: { t: 0.25 },
      keySignature: { fifths: 2, t: 0.35 },
      motifs: [],
    });
    const reversed = buildScoreModel({
      id: "reversed",
      path: TEST_REVERSED_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 2,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      clef: { t: 0.25 },
      keySignature: { fifths: 2, t: 0.35 },
      motifs: [],
    });
    const forwardGlyphs = forward.layers[1]?.primitives.filter(
      (primitive) => primitive.kind === "glyph",
    );
    const reversedGlyphs = reversed.layers[1]?.primitives.filter(
      (primitive) => primitive.kind === "glyph",
    );

    expect(forwardGlyphs).toHaveLength(3);
    expect(reversedGlyphs).toHaveLength(3);
    expect(forwardGlyphs?.every(({ mirrorY }) => mirrorY === false)).toBe(
      true,
    );
    expect(reversedGlyphs?.every(({ mirrorY }) => mirrorY === true)).toBe(
      true,
    );
  });

  it("requires clef < key signature < first motif note", () => {
    const base = {
      id: "structural-order",
      path: TEST_PATH,
      staffSpace: TEST_STAFF_SPACE,
      staffSampleCount: 2,
      calibration: TEST_CALIBRATION,
      tokens: TEST_TOKENS,
      motifs: [{ motif: composedMotif("Q1"), noteTs: [0.5] }],
    } as const;

    expect(() =>
      buildScoreModel({
        ...base,
        keySignature: { fifths: 1, t: 0.2 },
      }),
    ).toThrow(/requires a treble clef/);
    expect(() =>
      buildScoreModel({
        ...base,
        clef: { t: 0.3 },
        keySignature: { fifths: 1, t: 0.2 },
      }),
    ).toThrow(/clef < keySignature/);
    expect(() =>
      buildScoreModel({
        ...base,
        clef: { t: 0.1 },
        keySignature: { fifths: 1, t: 0.5 },
      }),
    ).toThrow(/keySignature < first motif note/);

    expect(
      buildScoreModel({
        ...base,
        clef: { t: 0.1 },
        keySignature: { fifths: 1, t: 0.2 },
      }).layers[1]?.primitives.map(({ role }) => role),
    ).toEqual(["clef", "key-signature"]);
  });
});
