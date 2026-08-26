import { AUTOMATIC_MOTIF_IDS } from "./motifs";
import {
  LANDING_STAFF_STEPS,
  PITCH_CONTOUR_IDS,
} from "./pitch-contours";
import type {
  ComposerCalibration,
  ComposerProfile,
  MotifId,
  PitchContourId,
  ProfileCalibration,
  SlotDensity,
  SupportedNoteCount,
} from "./types";

function weights<T extends string>(
  entries: Readonly<Record<T, number>>,
): Readonly<Record<T, number>> {
  return Object.freeze({ ...entries });
}

const COMMON_CONTOUR_WEIGHTS = weights<PitchContourId>({
  alternating: 1,
  arch: 1.2,
  "repeat-then-step": 0.8,
  "small-leap-down": 0.65,
  "small-leap-up": 0.65,
  "step-down": 1.2,
  "step-up": 1.2,
  valley: 1.2,
});

const COMMON_ANCHOR_WEIGHTS: Readonly<Record<number, number>> = Object.freeze(
  Object.fromEntries(
    LANDING_STAFF_STEPS.map((staffStep) => [
      staffStep,
      staffStep >= 0 && staffStep <= 8 ? 4 : 1,
    ]),
  ),
);

const DENSITY_WEIGHTS: Readonly<
  Record<SlotDensity, Readonly<Record<SupportedNoteCount, number>>>
> = Object.freeze({
  sparse: Object.freeze({ 1: 1.5, 2: 0.9, 3: 0.45, 4: 0.25 }),
  normal: Object.freeze({ 1: 1, 2: 1, 3: 1, 4: 1 }),
  dense: Object.freeze({ 1: 0.5, 2: 0.9, 3: 1.25, 4: 1.5 }),
});

function profile(
  motifWeights: Readonly<Record<MotifId, number>>,
  adjustments: Partial<
    Pick<
      ProfileCalibration,
      "denseAfterDensePenalty" | "thirdSameFamilyPenalty"
    >
  > = {},
): ProfileCalibration {
  return Object.freeze({
    motifWeights: weights(motifWeights),
    contourWeights: COMMON_CONTOUR_WEIGHTS,
    pitchAnchorWeights: COMMON_ANCHOR_WEIGHTS,
    noteCountWeightsByDensity: DENSITY_WEIGHTS,
    denseAfterDensePenalty: adjustments.denseAfterDensePenalty ?? 0.35,
    thirdSameFamilyPenalty: adjustments.thirdSameFamilyPenalty ?? 0.25,
  });
}

/**
 * Canonical Music System v0.1 calibration approved at human Gate C on
 * 2026-08-24. Callers may still inject an explicit calibration for testing or
 * a future separately governed calibration proposal.
 */
export const APPROVED_COMPOSER_CALIBRATION_V1: ComposerCalibration =
  Object.freeze({
    CALM: profile({
      Q1: 4,
      Q2: 4,
      Q3: 1.8,
      Q4: 0.8,
      H1: 4,
      H2: 3,
      W1: 3,
      E8_E8: 1.5,
      E8_TRIPLET_3: 0.35,
      S16_S16_S16_S16: 0.15,
      E8_S16_S16: 0.2,
      S16_S16_E8: 0.2,
      S16_E8_S16: 0.2,
    }),
    BALANCED: profile({
      Q1: 2,
      Q2: 3,
      Q3: 2.5,
      Q4: 1.5,
      H1: 2,
      H2: 1.8,
      W1: 1,
      E8_E8: 3,
      E8_TRIPLET_3: 1.5,
      S16_S16_S16_S16: 1,
      E8_S16_S16: 1.5,
      S16_S16_E8: 1.5,
      S16_E8_S16: 1.5,
    }),
    ACTIVE: profile(
      {
        Q1: 0.8,
        Q2: 1.2,
        Q3: 1.4,
        Q4: 1.8,
        H1: 0.5,
        H2: 0.5,
        W1: 0.2,
        E8_E8: 3,
        E8_TRIPLET_3: 3,
        S16_S16_S16_S16: 3,
        E8_S16_S16: 3,
        S16_S16_E8: 3,
        S16_E8_S16: 3,
      },
      { denseAfterDensePenalty: 0.55 },
    ),
    TERMINAL: profile({
      Q1: 4,
      Q2: 4,
      Q3: 0,
      Q4: 0,
      H1: 4,
      H2: 4,
      W1: 4,
      E8_E8: 0,
      E8_TRIPLET_3: 0,
      S16_S16_S16_S16: 0,
      E8_S16_S16: 0,
      S16_S16_E8: 0,
      S16_E8_S16: 0,
    }),
  } satisfies Record<ComposerProfile, ProfileCalibration>);

// Compile-time exhaustiveness guards for additions to either whitelist.
const _allMotifWeightsCovered: readonly MotifId[] = AUTOMATIC_MOTIF_IDS;
const _allContourWeightsCovered: readonly PitchContourId[] = PITCH_CONTOUR_IDS;

void _allMotifWeightsCovered;
void _allContourWeightsCovered;
