import { getMotifDefinition } from "@/lib/music/composer/motifs";
import type {
  ComposedMotif,
  MotifId,
} from "@/lib/music/composer/types";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import type {
  RendererEngravingTokens,
  RendererGlyphCalibrations,
} from "@/lib/music/renderer/types";

export const TEST_STAFF_SPACE = 10;

export const TEST_PATH = new StraightScorePath(
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
);

export const TEST_REVERSED_PATH = new StraightScorePath(
  { x: 100, y: 0 },
  { x: 0, y: 0 },
  { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
);

const noteheadAnchors = {
  opticalCenter: { x: 0.5, y: 0.5 },
  stemUp: { x: 0.9, y: 0.15 },
  stemDown: { x: 0.1, y: 0.85 },
} as const;

const accidentalAnchors = {
  pitchCenter: { x: 0.5, y: 0.5 },
} as const;

const flagAnchors = {
  stemAttachment: { x: 0.05, y: 0.05 },
} as const;

/** Deliberately test-only draft values, never canonical calibration. */
export const TEST_CALIBRATION = {
  "wf-music-treble-clef": {
    assetKey: "wf-music-treble-clef",
    status: "draft-calibration",
    nominalWidthSp: 2,
    nominalHeightSp: 6,
    anchors: { gLine: { x: 0.5, y: 0.65 } },
  },
  "wf-music-notehead-filled": {
    assetKey: "wf-music-notehead-filled",
    status: "draft-calibration",
    nominalWidthSp: 1.2,
    nominalHeightSp: 0.8,
    anchors: noteheadAnchors,
  },
  "wf-music-notehead-open": {
    assetKey: "wf-music-notehead-open",
    status: "draft-calibration",
    nominalWidthSp: 1.2,
    nominalHeightSp: 0.8,
    anchors: noteheadAnchors,
  },
  "wf-music-accidental-sharp": {
    assetKey: "wf-music-accidental-sharp",
    status: "draft-calibration",
    nominalWidthSp: 0.65,
    nominalHeightSp: 2,
    anchors: accidentalAnchors,
  },
  "wf-music-accidental-flat": {
    assetKey: "wf-music-accidental-flat",
    status: "draft-calibration",
    nominalWidthSp: 0.65,
    nominalHeightSp: 2,
    anchors: accidentalAnchors,
  },
  "wf-music-accidental-natural": {
    assetKey: "wf-music-accidental-natural",
    status: "draft-calibration",
    nominalWidthSp: 0.65,
    nominalHeightSp: 2,
    anchors: accidentalAnchors,
  },
  "wf-music-eighth-flag": {
    assetKey: "wf-music-eighth-flag",
    status: "draft-calibration",
    nominalWidthSp: 0.9,
    nominalHeightSp: 2.2,
    anchors: flagAnchors,
  },
  "wf-music-sixteenth-double-flag": {
    assetKey: "wf-music-sixteenth-double-flag",
    status: "draft-calibration",
    nominalWidthSp: 0.9,
    nominalHeightSp: 2.4,
    anchors: flagAnchors,
  },
} as const satisfies RendererGlyphCalibrations;

export const TEST_TOKENS = {
  note: {
    accidentalGapSp: 0.25,
    ledgerLineExtensionSp: 0.2,
    ledgerLineThicknessSp: 0.08,
    stemLengthSp: 3.5,
    stemThicknessSp: 0.08,
    flagTransform: {
      up: { mirrorX: false, mirrorY: false, rotationRadians: 0 },
      down: { mirrorX: false, mirrorY: true, rotationRadians: 0 },
    },
  },
  beam: {
    thicknessSp: 0.35,
    secondaryThicknessSp: 0.3,
    secondaryGapSp: 0.5,
    hookLengthSp: 0.8,
  },
  tuplet: {
    bracketClearanceSp: 0.8,
    bracketEndCapSp: 0.3,
    bracketThicknessSp: 0.08,
    tupletNumeralSizeSp: 0.85,
    tupletNumeralSideGapSp: 0.18,
  },
  score: {
    staffLineThicknessSp: 0.05,
    barlineThicknessSp: 0.08,
    finalBarlineThinThicknessSp: 0.08,
    finalBarlineGapSp: 0.25,
    finalBarlineThickThicknessSp: 0.3,
    keySignatureGapSp: 0.2,
    keySignatureStartOffsetSp: 0,
  },
} as const satisfies RendererEngravingTokens;

export function composedMotif(
  motifId: MotifId,
  staffSteps?: readonly number[],
): ComposedMotif {
  const definition = getMotifDefinition(motifId);
  const resolvedStaffSteps =
    staffSteps ?? definition.durations.map((_, index) => index);

  return {
    id: `wf-motif-fixture-${motifId}`,
    slotId: `slot-${motifId}`,
    motifId,
    notes: resolvedStaffSteps.map((staffStep, index) => ({
      staffStep,
      duration: definition.durations[index]!,
    })),
    family: definition.family,
    durations: definition.durations,
    staffSteps: resolvedStaffSteps,
    contourId: "step-up",
    contourTranslation: 0,
    dense: definition.dense,
    ...(definition.tuplet ? { tuplet: definition.tuplet } : {}),
  };
}

export function noteTs(noteCount: number): readonly number[] {
  return Array.from(
    { length: noteCount },
    (_, index) => (index + 1) / (noteCount + 1),
  );
}

export function upStemBeamLayout(ts: readonly number[]) {
  return {
    axisDirection: { x: 1, y: 0 },
    primaryAttachments: ts.map((t) => ({
      // Filled-notehead stemUp x is center + (0.9 - 0.5) * 12 = +4.8.
      x: t * 100 + 4.8,
      y: -50,
    })),
    secondaryOffsetDirection: { x: 0, y: 1 },
  } as const;
}

export function downStemBeamLayout(ts: readonly number[]) {
  return {
    axisDirection: { x: 1, y: 0 },
    primaryAttachments: ts.map((t) => ({
      // Filled-notehead stemDown x is center + (0.1 - 0.5) * 12 = -4.8.
      x: t * 100 - 4.8,
      y: 50,
    })),
    secondaryOffsetDirection: { x: 0, y: -1 },
  } as const;
}

export const TEST_TUPLET_LAYOUT = {
  bracketStart: { x: 29.8, y: -60 },
  bracketEnd: { x: 79.8, y: -60 },
  endCapDirection: { x: 0, y: 1 },
  labelPosition: { x: 54.8, y: -60 },
} as const;

export const TEST_DOWN_TUPLET_LAYOUT = {
  bracketStart: { x: 20.2, y: 60 },
  bracketEnd: { x: 70.2, y: 60 },
  endCapDirection: { x: 0, y: -1 },
  labelPosition: { x: 45.2, y: 60 },
} as const;
