export const MUSIC_GLYPH_KEYS = [
  "wf-music-treble-clef",
  "wf-music-notehead-filled",
  "wf-music-notehead-open",
  "wf-music-accidental-sharp",
  "wf-music-accidental-flat",
  "wf-music-accidental-natural",
  "wf-music-eighth-flag",
  "wf-music-sixteenth-double-flag",
] as const;

export type MusicGlyphKey = (typeof MUSIC_GLYPH_KEYS)[number];

export type GlyphRuntimeStatus =
  | "pending-metrics-and-visual-lab"
  | "approved";

export type GlyphGeometryPolicy =
  "immutable-without-explicit-human-reapproval";

export interface GlyphViewBox {
  readonly minX: number;
  readonly minY: number;
  readonly width: number;
  readonly height: number;
}

/** A glyph-local point normalized to its immutable SVG viewBox. */
export interface NormalizedGlyphPoint {
  readonly x: number;
  readonly y: number;
}

export interface GlyphMetrics {
  readonly nominalWidthSp: number | null;
  readonly nominalHeightSp: number | null;
}

export interface TrebleClefAnchors {
  readonly gLine: NormalizedGlyphPoint | null;
}

export interface NoteheadAnchors {
  readonly opticalCenter: NormalizedGlyphPoint | null;
  readonly stemUp: NormalizedGlyphPoint | null;
  readonly stemDown: NormalizedGlyphPoint | null;
}

export interface AccidentalAnchors {
  readonly pitchCenter: NormalizedGlyphPoint | null;
}

export interface FlagAnchors {
  readonly stemAttachment: NormalizedGlyphPoint | null;
}

export type GlyphAnchors =
  | TrebleClefAnchors
  | NoteheadAnchors
  | AccidentalAnchors
  | FlagAnchors;

export type GlyphAnchorName =
  | keyof TrebleClefAnchors
  | keyof NoteheadAnchors
  | keyof AccidentalAnchors
  | keyof FlagAnchors;

export interface GlyphChecksumTrace {
  readonly sourceMaster: string;
  readonly runtimeCandidate: string;
}

export interface GlyphRegistryEntry<
  TKey extends MusicGlyphKey = MusicGlyphKey,
  TAnchors extends GlyphAnchors = GlyphAnchors,
> {
  readonly id: `MUS-GLYPH-00${number}`;
  readonly assetKey: TKey;
  readonly name: string;
  readonly runtimeStatus: GlyphRuntimeStatus;
  readonly geometryPolicy: GlyphGeometryPolicy;
  readonly sourceMaster: string;
  readonly runtimeCandidate: string;
  readonly viewBox: GlyphViewBox;
  readonly requiredAnchors: TAnchors;
  readonly metrics: GlyphMetrics;
  readonly sha256: GlyphChecksumTrace;
}

export type MusicGlyphRegistryEntry =
  | GlyphRegistryEntry<"wf-music-treble-clef", TrebleClefAnchors>
  | GlyphRegistryEntry<
      "wf-music-notehead-filled" | "wf-music-notehead-open",
      NoteheadAnchors
    >
  | GlyphRegistryEntry<
      | "wf-music-accidental-sharp"
      | "wf-music-accidental-flat"
      | "wf-music-accidental-natural",
      AccidentalAnchors
    >
  | GlyphRegistryEntry<
      "wf-music-eighth-flag" | "wf-music-sixteenth-double-flag",
      FlagAnchors
    >;

export type GlyphAnchorsFor<TKey extends MusicGlyphKey> =
  TKey extends "wf-music-treble-clef"
    ? TrebleClefAnchors
    : TKey extends "wf-music-notehead-filled" | "wf-music-notehead-open"
      ? NoteheadAnchors
      : TKey extends
            | "wf-music-accidental-sharp"
            | "wf-music-accidental-flat"
            | "wf-music-accidental-natural"
        ? AccidentalAnchors
        : FlagAnchors;

export type MusicGlyphEntryFor<TKey extends MusicGlyphKey> =
  GlyphRegistryEntry<TKey, GlyphAnchorsFor<TKey>>;

export type GlyphCalibrationStatus =
  | "draft-calibration"
  | "runtime-approved";

/**
 * A reviewable proposal. It is deliberately separate from the canonical
 * registry so local calibration cannot approve or mutate a glyph asset.
 */
export interface DraftGlyphCalibration<
  TAnchors extends GlyphAnchors = GlyphAnchors,
> {
  readonly assetKey: MusicGlyphKey;
  readonly status: "draft-calibration";
  readonly coordinateSpace: "normalized-view-box";
  readonly metrics: GlyphMetrics;
  readonly anchors: TAnchors;
  readonly sourceSha256: GlyphChecksumTrace;
}

export interface CompleteGlyphMetrics {
  readonly nominalWidthSp: number;
  readonly nominalHeightSp: number;
}

export type CompleteGlyphAnchorsFor<TKey extends MusicGlyphKey> = {
  readonly [TAnchor in keyof GlyphAnchorsFor<TKey>]-?: Exclude<
    GlyphAnchorsFor<TKey>[TAnchor],
    null
  >;
};

/** Gate-B-approved runtime shape returned only after fail-closed validation. */
export interface RuntimeApprovedGlyphCalibration<
  TKey extends MusicGlyphKey = MusicGlyphKey,
> {
  readonly assetKey: TKey;
  readonly status: "runtime-approved";
  readonly coordinateSpace: "normalized-view-box";
  readonly metrics: CompleteGlyphMetrics;
  readonly anchors: CompleteGlyphAnchorsFor<TKey>;
  readonly sourceSha256: GlyphChecksumTrace;
}

export type RuntimeApprovedGlyphCalibrationSet = {
  readonly [TKey in MusicGlyphKey]: RuntimeApprovedGlyphCalibration<TKey>;
};
