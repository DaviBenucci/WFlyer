import { APPROVED_GLYPH_CALIBRATIONS } from "@/lib/music/glyphs/metrics";
import type {
  MusicGlyphKey,
  RuntimeApprovedGlyphCalibration,
} from "@/lib/music/glyphs/types";
import type {
  RendererGlyphCalibrations,
  ResolvedGlyphCalibration,
} from "@/lib/music/renderer/types";

/** Flattens canonical Gate-B payloads into the renderer's injectable shape. */
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
