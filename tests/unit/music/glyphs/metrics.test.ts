import { describe, expect, it } from "vitest";

import {
  APPROVED_DOWN_FLAG_TRANSFORM,
  APPROVED_FLAG_TRANSFORM,
  APPROVED_GLYPH_CALIBRATIONS,
  createDraftGlyphCalibration,
  isCompleteDraftGlyphCalibration,
  isRuntimeApprovedGlyphCalibration,
  validateDraftGlyphCalibration,
  validateRuntimeGlyphCalibration,
} from "@/lib/music/glyphs/metrics";
import { getMusicGlyph } from "@/lib/music/glyphs/registry";
import { MUSIC_GLYPH_KEYS } from "@/lib/music/glyphs/types";

describe("draft glyph calibration", () => {
  it("creates an isolated draft without mutating the approved registry", () => {
    const entry = getMusicGlyph("wf-music-notehead-filled");
    const approvedMetrics = { ...entry.metrics };
    const approvedAnchors = { ...entry.requiredAnchors };
    const draft = createDraftGlyphCalibration(
      entry.assetKey,
      { nominalWidthSp: 1.25, nominalHeightSp: 0.9 },
      {
        opticalCenter: { x: 0.5, y: 0.5 },
        stemUp: { x: 0.88, y: 0.18 },
        stemDown: { x: 0.12, y: 0.82 },
      },
    );

    expect(draft.status).toBe("draft-calibration");
    expect(draft.coordinateSpace).toBe("normalized-view-box");
    expect(draft.sourceSha256).toEqual(entry.sha256);
    expect(isCompleteDraftGlyphCalibration(draft)).toBe(true);
    expect(validateRuntimeGlyphCalibration(draft)).toContainEqual({
      field: "status",
      reason: "must be runtime-approved before runtime use",
    });
    expect(isRuntimeApprovedGlyphCalibration(draft)).toBe(false);
    expect(entry.runtimeStatus).toBe("approved");
    expect(entry.metrics).toEqual(approvedMetrics);
    expect(entry.requiredAnchors).toEqual(approvedAnchors);
  });

  it("validates all eight canonical approved runtime payloads", () => {
    expect(Object.keys(APPROVED_GLYPH_CALIBRATIONS)).toEqual(
      MUSIC_GLYPH_KEYS,
    );

    for (const assetKey of MUSIC_GLYPH_KEYS) {
      const approved = APPROVED_GLYPH_CALIBRATIONS[assetKey];

      expect(validateRuntimeGlyphCalibration(approved), assetKey).toEqual([]);
      expect(isRuntimeApprovedGlyphCalibration(approved), assetKey).toBe(true);
      expect(approved.status).toBe("runtime-approved");
      expect(approved.metrics).toEqual(getMusicGlyph(assetKey).metrics);
      expect(approved.anchors).toEqual(
        getMusicGlyph(assetKey).requiredAnchors,
      );
      expect(approved.sourceSha256).toEqual(getMusicGlyph(assetKey).sha256);
    }
  });

  it("rejects a status-only promotion when values differ from the approved register", () => {
    const draft = createDraftGlyphCalibration(
      "wf-music-treble-clef",
      { nominalWidthSp: 2, nominalHeightSp: 5 },
      { gLine: { x: 0.5, y: 0.6 } },
    );
    const selfPromotedDraft = {
      ...draft,
      status: "runtime-approved",
    } as const;

    expect(validateRuntimeGlyphCalibration(selfPromotedDraft)).toEqual(
      expect.arrayContaining([
        {
          field: "metrics.nominalWidthSp",
          reason: "must match the canonical approved staff-space value",
        },
        {
          field: "metrics.nominalHeightSp",
          reason: "must match the canonical approved staff-space value",
        },
        {
          field: "anchors.gLine",
          reason: "must match the canonical approved normalized point",
        },
      ]),
    );
    expect(isRuntimeApprovedGlyphCalibration(selfPromotedDraft)).toBe(false);
    expect(draft.status).toBe("draft-calibration");
  });

  it("exports the exact approved flag transforms", () => {
    expect(APPROVED_DOWN_FLAG_TRANSFORM).toEqual({
      mirrorX: false,
      mirrorY: true,
      rotationRadians: 0,
    });
    expect(APPROVED_FLAG_TRANSFORM).toEqual({
      up: { mirrorX: false, mirrorY: false, rotationRadians: 0 },
      down: APPROVED_DOWN_FLAG_TRANSFORM,
    });
    expect(Object.isFrozen(APPROVED_DOWN_FLAG_TRANSFORM)).toBe(true);
    expect(Object.isFrozen(APPROVED_FLAG_TRANSFORM)).toBe(true);
  });

  it("rejects incomplete values even when imported data claims runtime approval", () => {
    const draft = createDraftGlyphCalibration(
      "wf-music-notehead-filled",
      { nominalWidthSp: 1.25, nominalHeightSp: 0.9 },
      {
        opticalCenter: { x: 0.5, y: 0.5 },
        stemUp: { x: 0.88, y: 0.18 },
        stemDown: { x: 0.12, y: 0.82 },
      },
    );
    const forgedApprovedPayload = {
      ...draft,
      status: "runtime-approved",
      metrics: {
        nominalWidthSp: null,
        nominalHeightSp: 0,
      },
      anchors: {
        opticalCenter: null,
        stemUp: { x: 1.1, y: Number.NaN },
      },
    };

    expect(validateRuntimeGlyphCalibration(forgedApprovedPayload)).toEqual(
      expect.arrayContaining([
        {
          field: "metrics.nominalWidthSp",
          reason: "must be a finite positive staff-space value",
        },
        {
          field: "metrics.nominalHeightSp",
          reason: "must be a finite positive staff-space value",
        },
        {
          field: "anchors.opticalCenter",
          reason: "must be a point inside the normalized SVG viewBox",
        },
        {
          field: "anchors.stemUp",
          reason: "must be a point inside the normalized SVG viewBox",
        },
        {
          field: "anchors.stemDown",
          reason: "is required by the canonical glyph manifest",
        },
      ]),
    );
    expect(isRuntimeApprovedGlyphCalibration(forgedApprovedPayload)).toBe(
      false,
    );
  });

  it("rejects null, non-positive, non-finite, and out-of-viewBox values", () => {
    const draft = createDraftGlyphCalibration(
      "wf-music-accidental-flat",
      { nominalWidthSp: 0, nominalHeightSp: Number.NaN },
      { pitchCenter: { x: -0.01, y: 1.01 } },
    );

    expect(validateDraftGlyphCalibration(draft)).toEqual([
      {
        field: "metrics.nominalWidthSp",
        reason: "must be a finite positive staff-space value",
      },
      {
        field: "metrics.nominalHeightSp",
        reason: "must be a finite positive staff-space value",
      },
      {
        field: "anchors.pitchCenter",
        reason: "must be a point inside the normalized SVG viewBox",
      },
    ]);
  });

  it("rejects a stale checksum trace", () => {
    const draft = {
      ...createDraftGlyphCalibration(
        "wf-music-treble-clef",
        { nominalWidthSp: 2, nominalHeightSp: 5 },
        { gLine: { x: 0.5, y: 0.6 } },
      ),
      sourceSha256: {
        sourceMaster: "0".repeat(64),
        runtimeCandidate: "1".repeat(64),
      },
    };

    expect(validateDraftGlyphCalibration(draft)).toContainEqual({
      field: "sourceSha256",
      reason: "must match the immutable registry checksum trace",
    });
  });

  it("rejects missing or undeclared anchor names in imported draft data", () => {
    const draft = {
      ...createDraftGlyphCalibration(
        "wf-music-treble-clef",
        { nominalWidthSp: 2, nominalHeightSp: 5 },
        { gLine: { x: 0.5, y: 0.6 } },
      ),
      anchors: { opticalCenter: { x: 0.5, y: 0.5 } },
    };

    expect(
      validateDraftGlyphCalibration(
        draft as unknown as Parameters<
          typeof validateDraftGlyphCalibration
        >[0],
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          field: "anchors.gLine",
          reason: "is required by the canonical glyph manifest",
        },
        {
          field: "anchors.opticalCenter",
          reason: "is not declared by the canonical glyph manifest",
        },
      ]),
    );
  });
});
