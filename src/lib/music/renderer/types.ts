import type {
  ComposedMotif,
  MotifId,
  NoteDuration,
} from "../composer/types";
import type {
  Accidental,
  Fifths,
  LineSegment,
  ScorePath,
  StaffSpace,
  StaffStep,
  StemDirection,
  Vec2,
} from "../geometry/types";
import type {
  GlyphCalibrationStatus,
  GlyphAnchorsFor,
  MusicGlyphKey,
  NormalizedGlyphPoint,
} from "../glyphs/types";

export type ResolvedGlyphAnchors<TKey extends MusicGlyphKey> = {
  readonly [TAnchor in keyof GlyphAnchorsFor<TKey>]-?: Exclude<
    GlyphAnchorsFor<TKey>[TAnchor],
    null
  >;
};

export interface ResolvedGlyphCalibration<
  TKey extends MusicGlyphKey = MusicGlyphKey,
> {
  readonly assetKey: TKey;
  /** Draft values are lab-only; runtime fixtures consume approved values. */
  readonly status: GlyphCalibrationStatus;
  readonly nominalWidthSp: number;
  readonly nominalHeightSp: number;
  readonly anchors: ResolvedGlyphAnchors<TKey>;
}

export type RendererGlyphCalibrations = {
  readonly [TKey in MusicGlyphKey]: ResolvedGlyphCalibration<TKey>;
};

export type RenderLayerId =
  | "staff"
  | "structural"
  | "notes"
  | "annotations"
  | "barlines";

export type RenderPrimitiveRole =
  | "accidental"
  | "barline"
  | "beam-primary"
  | "beam-secondary"
  | "beam-secondary-hook-left"
  | "beam-secondary-hook-right"
  | "clef"
  | "final-barline-thick"
  | "final-barline-thin"
  | "flag"
  | "key-signature"
  | "ledger"
  | "notehead"
  | "staff-line"
  | "stem"
  | "tuplet";

export interface LineRenderPrimitive extends LineSegment {
  readonly kind: "line";
  readonly id: string;
  readonly layer: RenderLayerId;
  readonly role: RenderPrimitiveRole;
  readonly thickness: number;
}

export interface PolylineRenderPrimitive {
  readonly kind: "polyline";
  readonly id: string;
  readonly layer: RenderLayerId;
  readonly role: "staff-line";
  readonly points: readonly Vec2[];
  /** Optional presentational opacity for deterministic staff transitions. */
  readonly opacity?: number;
  readonly thickness: number;
}

export interface GlyphRenderPrimitive {
  readonly kind: "glyph";
  readonly id: string;
  readonly layer: RenderLayerId;
  readonly role:
    | "accidental"
    | "clef"
    | "flag"
    | "key-signature"
    | "notehead";
  readonly assetKey: MusicGlyphKey;
  /** World-space point aligned to `anchorInGlyph`. */
  readonly anchorTarget: Vec2;
  readonly anchorInGlyph: NormalizedGlyphPoint;
  readonly width: number;
  readonly height: number;
  /** Rotation aligns glyph-local +x to the local score tangent. */
  readonly rotationRadians: number;
  readonly mirrorX: boolean;
  readonly mirrorY: boolean;
}

export interface BeamRenderPrimitive extends LineSegment {
  readonly kind: "beam";
  readonly id: string;
  readonly layer: "notes";
  readonly role:
    | "beam-primary"
    | "beam-secondary"
    | "beam-secondary-hook-left"
    | "beam-secondary-hook-right";
  readonly thickness: number;
}

export type TupletBracketSegmentRole =
  | "span-before-numeral"
  | "span-after-numeral"
  | "end-cap-start"
  | "end-cap-end";

export interface TupletBracketSegment extends LineSegment {
  readonly role: TupletBracketSegmentRole;
}

export interface TupletRenderPrimitive {
  readonly kind: "tuplet";
  readonly id: string;
  readonly layer: "annotations";
  readonly role: "tuplet";
  readonly label: "3";
  readonly labelPosition: Vec2;
  /** Exact world-space numeral size and forced SVG text width. */
  readonly numeralSize: number;
  readonly numeralWidth: number;
  readonly numeralSideGap: number;
  /** Upright rotation that aligns the numeral-local x-axis to the bracket. */
  readonly numeralRotationRadians: number;
  readonly centralGap: number;
  readonly bracket: readonly TupletBracketSegment[];
  readonly thickness: number;
}

export type ScoreRenderPrimitive =
  | BeamRenderPrimitive
  | GlyphRenderPrimitive
  | LineRenderPrimitive
  | PolylineRenderPrimitive
  | TupletRenderPrimitive;

export interface RenderLayer {
  readonly id: RenderLayerId;
  readonly primitives: readonly ScoreRenderPrimitive[];
}

export interface GlyphTransformByStemDirection {
  readonly up: {
    readonly mirrorX: boolean;
    readonly mirrorY: boolean;
    readonly rotationRadians: number;
  };
  readonly down: {
    readonly mirrorX: boolean;
    readonly mirrorY: boolean;
    readonly rotationRadians: number;
  };
}

export interface NoteEngravingTokens {
  readonly accidentalGapSp: number;
  readonly ledgerLineExtensionSp: number;
  readonly ledgerLineThicknessSp: number;
  readonly stemLengthSp: number;
  readonly stemThicknessSp: number;
  /** The approved flags are up masters; both transforms remain explicit. */
  readonly flagTransform: GlyphTransformByStemDirection;
}

export interface BeamEngravingTokens {
  readonly thicknessSp: number;
  readonly secondaryThicknessSp: number;
  readonly secondaryGapSp: number;
  readonly hookLengthSp: number;
}

export interface TupletEngravingTokens {
  readonly bracketClearanceSp: number;
  readonly bracketEndCapSp: number;
  readonly bracketThicknessSp: number;
  readonly tupletNumeralSizeSp: number;
  readonly tupletNumeralSideGapSp: number;
}

export interface ScoreEngravingTokens {
  readonly staffLineThicknessSp: number;
  readonly barlineThicknessSp: number;
  readonly finalBarlineThinThicknessSp: number;
  readonly finalBarlineGapSp: number;
  readonly finalBarlineThickThicknessSp: number;
  readonly keySignatureGapSp: number;
  readonly keySignatureStartOffsetSp: number;
}

export interface RendererEngravingTokens {
  readonly note: NoteEngravingTokens;
  readonly beam: BeamEngravingTokens;
  readonly tuplet: TupletEngravingTokens;
  readonly score: ScoreEngravingTokens;
}

export interface BuildNoteModelInput {
  readonly id: string;
  readonly accidental?: Accidental;
  readonly beamed: boolean;
  readonly calibration: RendererGlyphCalibrations;
  readonly duration: NoteDuration;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly staffStep: StaffStep;
  readonly stemDirectionOverride?: StemDirection;
  readonly stemOverrideJustification?: string;
  readonly t: number;
  readonly tokens: NoteEngravingTokens;
  /** Exact shared-direction stem target supplied by the motif beam layout. */
  readonly beamStem?: {
    readonly direction: StemDirection;
    readonly end: Vec2;
  };
}

export interface NoteRenderModel {
  readonly id: string;
  readonly accidental?: GlyphRenderPrimitive;
  readonly center: Vec2;
  readonly duration: NoteDuration;
  readonly flag?: GlyphRenderPrimitive;
  readonly ledgerLines: readonly LineRenderPrimitive[];
  readonly notehead: GlyphRenderPrimitive;
  readonly primitives: readonly ScoreRenderPrimitive[];
  readonly staffStep: StaffStep;
  readonly stem?: LineRenderPrimitive;
  readonly stemDirection?: StemDirection;
  readonly t: number;
}

export interface BuildMotifModelInput {
  readonly calibration: RendererGlyphCalibrations;
  readonly motif: ComposedMotif;
  readonly noteTs: readonly number[];
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  /** Required for beamed motifs. Optical axis placement remains explicit. */
  readonly beamLayout?: {
    readonly axisDirection: Vec2;
    readonly primaryAttachments: readonly Vec2[];
    /** World-oriented direction from primary to secondary beam. */
    readonly secondaryOffsetDirection: Vec2;
  };
  /** Required only for E8_TRIPLET_3; no bracket placement is invented. */
  readonly tupletLayout?: {
    readonly bracketStart: Vec2;
    readonly bracketEnd: Vec2;
    readonly endCapDirection: Vec2;
    readonly labelPosition: Vec2;
  };
  readonly tokens: Pick<RendererEngravingTokens, "beam" | "note" | "tuplet">;
}

export interface MotifRenderModel {
  readonly id: string;
  readonly motifId: MotifId;
  readonly notes: readonly NoteRenderModel[];
  readonly beams: readonly BeamRenderPrimitive[];
  readonly tuplet?: TupletRenderPrimitive;
  readonly primitives: readonly ScoreRenderPrimitive[];
}

export interface ScoreMotifPlacement {
  readonly motif: ComposedMotif;
  readonly noteTs: readonly number[];
  readonly beamLayout?: BuildMotifModelInput["beamLayout"];
  readonly tupletLayout?: BuildMotifModelInput["tupletLayout"];
}

export interface ScoreBarlinePlacement {
  readonly id: string;
  readonly t: number;
}

export interface BuildScoreModelInput {
  readonly id: string;
  readonly path: ScorePath;
  readonly staffSpace: StaffSpace;
  readonly staffSampleCount: number;
  readonly calibration: RendererGlyphCalibrations;
  readonly tokens: RendererEngravingTokens;
  readonly clef?: { readonly t: number };
  /** Singular by design: a continuous branch can have at most one. */
  readonly keySignature?: { readonly fifths: Fifths; readonly t: number };
  readonly motifs: readonly ScoreMotifPlacement[];
  readonly barlines?: readonly ScoreBarlinePlacement[];
  readonly finalBarline?: ScoreBarlinePlacement;
}

export interface StaffRenderModel {
  readonly lines: readonly PolylineRenderPrimitive[];
  readonly masterGuideStaffStep: 4;
}

export interface ScoreRenderModel {
  readonly id: string;
  readonly staff: StaffRenderModel;
  readonly motifs: readonly MotifRenderModel[];
  readonly layers: readonly RenderLayer[];
  readonly primitives: readonly ScoreRenderPrimitive[];
}
