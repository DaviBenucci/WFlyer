import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";
import type {
  DraftGlyphCalibration,
  GlyphAnchors,
  MusicGlyphKey,
} from "@/lib/music/glyphs/types";
import type { RendererGlyphCalibrations } from "@/lib/music/renderer/types";

export interface EditableCalibrationPoint {
  x: number;
  y: number;
}

export interface EditableGlyphCalibration {
  assetKey: MusicGlyphKey;
  status: "draft-calibration";
  nominalWidthSp: number;
  nominalHeightSp: number;
  anchors: Record<string, EditableCalibrationPoint>;
}

export type EditableGlyphCalibrationSet = Record<
  MusicGlyphKey,
  EditableGlyphCalibration
>;

export interface DraftCalibrationExportPayload {
  readonly schemaVersion: 1;
  readonly status: "draft-calibration";
  readonly generatedBy: "music-visual-lab";
  readonly glyphs: readonly DraftGlyphCalibration[];
}

function cloneAnchors(
  anchors: Readonly<Record<string, EditableCalibrationPoint>>,
): Record<string, EditableCalibrationPoint> {
  return Object.fromEntries(
    Object.entries(anchors).map(([name, point]) => [name, { ...point }]),
  );
}

export function createEditableGlyphCalibrations(
  source: RendererGlyphCalibrations,
): EditableGlyphCalibrationSet {
  return Object.fromEntries(
    Object.entries(source).map(([assetKey, value]) => [
      assetKey,
      {
        assetKey,
        status: "draft-calibration",
        nominalWidthSp: value.nominalWidthSp,
        nominalHeightSp: value.nominalHeightSp,
        anchors: cloneAnchors(value.anchors),
      },
    ]),
  ) as EditableGlyphCalibrationSet;
}

/**
 * Produces canonical `DraftGlyphCalibration` entries. The envelope is a lab
 * transport format; each glyph can be passed directly to the core validator.
 */
export function createDraftCalibrationExport(
  calibrations: EditableGlyphCalibrationSet,
): DraftCalibrationExportPayload {
  return {
    schemaVersion: 1,
    status: "draft-calibration",
    generatedBy: "music-visual-lab",
    glyphs: MUSIC_GLYPH_REGISTRY.map((entry): DraftGlyphCalibration => {
      const calibration = calibrations[entry.assetKey];

      return {
        assetKey: entry.assetKey,
        status: "draft-calibration",
        coordinateSpace: "normalized-view-box",
        metrics: {
          nominalWidthSp: calibration.nominalWidthSp,
          nominalHeightSp: calibration.nominalHeightSp,
        },
        anchors: cloneAnchors(calibration.anchors) as unknown as GlyphAnchors,
        sourceSha256: { ...entry.sha256 },
      };
    }),
  };
}
