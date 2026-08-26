import { describe, expect, it } from "vitest";

import {
  validateDraftGlyphCalibration,
  validateRuntimeGlyphCalibration,
} from "@/lib/music/glyphs/metrics";
import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";

import {
  createDraftCalibrationExport,
  createEditableGlyphCalibrations,
} from "./calibration-export";
import { DRAFT_GLYPH_CALIBRATIONS } from "./draft-calibration";

describe("Music Visual Lab calibration export", () => {
  it("exports canonical validator-consumable DraftGlyphCalibration entries", () => {
    const payload = createDraftCalibrationExport(
      createEditableGlyphCalibrations(DRAFT_GLYPH_CALIBRATIONS),
    );

    expect(payload.glyphs).toHaveLength(8);

    for (const glyph of payload.glyphs) {
      expect(glyph).toEqual({
        assetKey: glyph.assetKey,
        status: "draft-calibration",
        coordinateSpace: "normalized-view-box",
        metrics: {
          nominalWidthSp: expect.any(Number),
          nominalHeightSp: expect.any(Number),
        },
        anchors: expect.any(Object),
        sourceSha256: {
          sourceMaster: expect.stringMatching(/^[0-9a-f]{64}$/u),
          runtimeCandidate: expect.stringMatching(/^[0-9a-f]{64}$/u),
        },
      });
      expect("nominalWidthSp" in glyph).toBe(false);
      expect("nominalHeightSp" in glyph).toBe(false);
      expect(validateDraftGlyphCalibration(glyph)).toEqual([]);
      expect(validateRuntimeGlyphCalibration(glyph)).toContainEqual({
        field: "status",
        reason: "must be runtime-approved before runtime use",
      });
    }
  });

  it("cannot alter the approved registry or self-approve an exported draft", () => {
    const registryBefore = structuredClone(MUSIC_GLYPH_REGISTRY);
    const draft = createDraftCalibrationExport(
      createEditableGlyphCalibrations(DRAFT_GLYPH_CALIBRATIONS),
    );

    expect(MUSIC_GLYPH_REGISTRY).toEqual(registryBefore);
    expect(
      MUSIC_GLYPH_REGISTRY.every(
        (entry) => entry.runtimeStatus === "approved",
      ),
    ).toBe(true);
    expect(draft.status).toBe("draft-calibration");
    expect(draft.glyphs.every((glyph) => glyph.status === "draft-calibration"))
      .toBe(true);
  });
});
