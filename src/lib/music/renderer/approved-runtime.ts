import { APPROVED_FLAG_TRANSFORM, APPROVED_GLYPH_CALIBRATIONS } from "../glyphs/metrics";
import type {
  MusicGlyphKey,
  RuntimeApprovedGlyphCalibration,
} from "../glyphs/types";
import type {
  RendererEngravingTokens,
  RendererGlyphCalibrations,
  ResolvedGlyphCalibration,
} from "./types";

function approvedRendererCalibration<TKey extends MusicGlyphKey>(
  assetKey: TKey,
): ResolvedGlyphCalibration<TKey> {
  const approved = APPROVED_GLYPH_CALIBRATIONS[
    assetKey
  ] as unknown as RuntimeApprovedGlyphCalibration<TKey>;

  return Object.freeze({
    assetKey,
    status: approved.status,
    nominalWidthSp: approved.metrics.nominalWidthSp,
    nominalHeightSp: approved.metrics.nominalHeightSp,
    anchors: approved.anchors,
  });
}

/** Gate-B-approved immutable glyph metrics in the renderer's runtime shape. */
export const APPROVED_RENDERER_GLYPH_CALIBRATIONS = Object.freeze({
  "wf-music-treble-clef": approvedRendererCalibration(
    "wf-music-treble-clef",
  ),
  "wf-music-notehead-filled": approvedRendererCalibration(
    "wf-music-notehead-filled",
  ),
  "wf-music-notehead-open": approvedRendererCalibration(
    "wf-music-notehead-open",
  ),
  "wf-music-accidental-sharp": approvedRendererCalibration(
    "wf-music-accidental-sharp",
  ),
  "wf-music-accidental-flat": approvedRendererCalibration(
    "wf-music-accidental-flat",
  ),
  "wf-music-accidental-natural": approvedRendererCalibration(
    "wf-music-accidental-natural",
  ),
  "wf-music-eighth-flag": approvedRendererCalibration(
    "wf-music-eighth-flag",
  ),
  "wf-music-sixteenth-double-flag": approvedRendererCalibration(
    "wf-music-sixteenth-double-flag",
  ),
} satisfies RendererGlyphCalibrations);

/** Music System v0.1 engraving tokens approved at Gate C. */
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
