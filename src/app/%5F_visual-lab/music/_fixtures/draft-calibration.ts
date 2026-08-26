import { APPROVED_FLAG_TRANSFORM } from "@/lib/music/glyphs/metrics";
import type { MusicGlyphKey } from "@/lib/music/glyphs/types";
import type {
  RendererEngravingTokens,
  RendererGlyphCalibrations,
  ResolvedGlyphCalibration,
} from "@/lib/music/renderer/types";

import { APPROVED_RENDERER_GLYPH_CALIBRATIONS } from "./approved-calibration";

function draftFromApproved<TKey extends MusicGlyphKey>(
  approved: ResolvedGlyphCalibration<TKey>,
): ResolvedGlyphCalibration<TKey> {
  return Object.freeze({ ...approved, status: "draft-calibration" });
}

/**
 * The workbench always opens an editable draft. Gate-B approval supplies its
 * baseline values but cannot make an edited/exported proposal self-approve.
 */
export const DRAFT_GLYPH_CALIBRATIONS = Object.freeze({
  "wf-music-treble-clef": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-treble-clef"],
  ),
  "wf-music-notehead-filled": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-notehead-filled"],
  ),
  "wf-music-notehead-open": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-notehead-open"],
  ),
  "wf-music-accidental-sharp": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-accidental-sharp"],
  ),
  "wf-music-accidental-flat": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-accidental-flat"],
  ),
  "wf-music-accidental-natural": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-accidental-natural"],
  ),
  "wf-music-eighth-flag": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-eighth-flag"],
  ),
  "wf-music-sixteenth-double-flag": draftFromApproved(
    APPROVED_RENDERER_GLYPH_CALIBRATIONS[
      "wf-music-sixteenth-double-flag"
    ],
  ),
} satisfies RendererGlyphCalibrations);

/** Canonical Music System v0.1 renderer tokens approved on 2026-08-24. */
export const APPROVED_RENDERER_TOKENS = Object.freeze({
  note: {
    accidentalGapSp: 0.25,
    ledgerLineExtensionSp: 0.25,
    ledgerLineThicknessSp: 0.08,
    stemLengthSp: 3.5,
    stemThicknessSp: 0.1,
    flagTransform: APPROVED_FLAG_TRANSFORM,
  },
  beam: {
    thicknessSp: 0.45,
    secondaryThicknessSp: 0.38,
    secondaryGapSp: 0.65,
    hookLengthSp: 0.8,
  },
  tuplet: {
    bracketClearanceSp: 0.65,
    bracketEndCapSp: 0.3,
    bracketThicknessSp: 0.07,
    tupletNumeralSizeSp: 0.85,
    tupletNumeralSideGapSp: 0.18,
  },
  score: {
    staffLineThicknessSp: 0.06,
    barlineThicknessSp: 0.11,
    finalBarlineThinThicknessSp: 0.11,
    finalBarlineGapSp: 0.3,
    finalBarlineThickThicknessSp: 0.28,
    keySignatureGapSp: 0.18,
    keySignatureStartOffsetSp: 0.5,
  },
} satisfies RendererEngravingTokens);
