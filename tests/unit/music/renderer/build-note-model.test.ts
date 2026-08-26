import { describe, expect, it } from "vitest";

import { buildNoteModel } from "@/lib/music/renderer/build-note-model";

import {
  TEST_CALIBRATION,
  TEST_PATH,
  TEST_REVERSED_PATH,
  TEST_STAFF_SPACE,
  TEST_TOKENS,
} from "./fixtures";

function transformGlyphPoint(
  primitive: NonNullable<ReturnType<typeof buildNote>["accidental"]>,
  point: { readonly x: number; readonly y: number },
) {
  let localX = (point.x - primitive.anchorInGlyph.x) * primitive.width;
  let localY = (point.y - primitive.anchorInGlyph.y) * primitive.height;

  if (primitive.mirrorX) localX *= -1;
  if (primitive.mirrorY) localY *= -1;

  const cosine = Math.cos(primitive.rotationRadians);
  const sine = Math.sin(primitive.rotationRadians);

  return {
    x:
      primitive.anchorTarget.x +
      localX * cosine -
      localY * sine,
    y:
      primitive.anchorTarget.y +
      localX * sine +
      localY * cosine,
  };
}

function buildNote(
  overrides: Partial<Parameters<typeof buildNoteModel>[0]> = {},
) {
  return buildNoteModel({
    id: "note",
    beamed: false,
    calibration: TEST_CALIBRATION,
    duration: "quarter",
    path: TEST_PATH,
    staffSpace: TEST_STAFF_SPACE,
    staffStep: 0,
    t: 0.5,
    tokens: TEST_TOKENS.note,
    ...overrides,
  });
}

describe("buildNoteModel", () => {
  it("places pitch from the B4 master guide and keeps glyph geometry external", () => {
    const e4 = buildNote({ staffStep: 0 });
    const b4 = buildNote({ staffStep: 4 });
    const f5 = buildNote({ staffStep: 8 });

    expect(e4.center).toEqual({ x: 50, y: 20 });
    expect(b4.center).toEqual({ x: 50, y: 0 });
    expect(f5.center).toEqual({ x: 50, y: -20 });
    expect(e4.notehead).toMatchObject({
      kind: "glyph",
      assetKey: "wf-music-notehead-filled",
      anchorInGlyph: { x: 0.5, y: 0.5 },
      width: 12,
      height: 8,
    });
  });

  it("emits only required intermediate ledgers with explicit thickness", () => {
    const a3 = buildNote({ staffStep: -4 });
    const e6 = buildNote({ staffStep: 14 });

    expect(a3.ledgerLines).toHaveLength(2);
    expect(a3.ledgerLines.map(({ start }) => start.y)).toEqual([30, 40]);
    expect(e6.ledgerLines).toHaveLength(3);
    expect(e6.ledgerLines.map(({ start }) => start.y)).toEqual([
      -30, -40, -50,
    ]);
    expect(e6.ledgerLines.every(({ thickness }) => thickness === 0.8)).toBe(
      true,
    );
  });

  it("uses isolated direction, open heads, stems, and duration-specific flags", () => {
    const whole = buildNote({ duration: "whole" });
    const half = buildNote({ duration: "half" });
    const middle = buildNote({ staffStep: 4 });
    const eighth = buildNote({ duration: "eighth" });
    const sixteenth = buildNote({ duration: "sixteenth" });

    expect(whole.notehead.assetKey).toBe("wf-music-notehead-open");
    expect(whole.stem).toBeUndefined();
    expect(half.notehead.assetKey).toBe("wf-music-notehead-open");
    expect(half.stemDirection).toBe("up");
    expect(middle.stemDirection).toBe("down");
    expect(eighth.flag?.assetKey).toBe("wf-music-eighth-flag");
    expect(eighth.flag?.mirrorY).toBe(false);
    expect(sixteenth.flag?.assetKey).toBe(
      "wf-music-sixteenth-double-flag",
    );
    expect(buildNote({ duration: "eighth", staffStep: 8 }).flag?.mirrorY).toBe(
      true,
    );
  });

  it("places an accidental from calibrated bounds and pitch-center anchor", () => {
    const sharp = buildNote({ accidental: "sharp" });

    expect(sharp.accidental).toMatchObject({
      assetKey: "wf-music-accidental-sharp",
      anchorInGlyph: { x: 0.5, y: 0.5 },
      anchorTarget: { x: 38.25, y: 20 },
    });
  });

  it("requires authored justification for isolated stem overrides", () => {
    expect(() => buildNote({ stemDirectionOverride: "down" })).toThrow(
      /requires stemOverrideJustification/,
    );
    expect(
      buildNote({
        stemDirectionOverride: "down",
        stemOverrideJustification: "Fixture comparison",
      }).stemDirection,
    ).toBe("down");
  });

  it("rejects incomplete beamed-note geometry instead of inventing it", () => {
    expect(() =>
      buildNote({ duration: "eighth", beamed: true }),
    ).toThrow(/require an exact beamStem/);
  });

  it("preserves the pitch-relative glyph frame when traversal reverses", () => {
    const forward = buildNote({
      accidental: "sharp",
      duration: "eighth",
      path: TEST_PATH,
      t: 0.25,
    });
    const reversed = buildNote({
      accidental: "sharp",
      duration: "eighth",
      path: TEST_REVERSED_PATH,
      t: 0.75,
    });

    expect(reversed.center).toEqual(forward.center);
    expect(forward.notehead).toMatchObject({
      mirrorY: false,
      rotationRadians: 0,
    });
    expect(reversed.notehead.mirrorY).toBe(true);
    expect(reversed.notehead.rotationRadians).toBeCloseTo(Math.PI);
    expect(forward.accidental?.mirrorY).toBe(false);
    expect(reversed.accidental?.mirrorY).toBe(true);
    expect(forward.flag?.mirrorY).toBe(false);
    expect(reversed.flag?.mirrorY).toBe(true);

    const stemUpAnchor = TEST_CALIBRATION[
      "wf-music-notehead-filled"
    ].anchors.stemUp;
    expect(
      transformGlyphPoint(reversed.notehead, stemUpAnchor),
    ).toEqual(reversed.stem?.start);
  });
});
