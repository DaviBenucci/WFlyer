export const COMPOSER_VERSION = 1 as const;
export const PITCH_CONTOUR_TABLE_VERSION = COMPOSER_VERSION;

export type ComposerVersion = typeof COMPOSER_VERSION;
export type PitchContourTableVersion = typeof PITCH_CONTOUR_TABLE_VERSION;

export type ComposerProfile = "ACTIVE" | "BALANCED" | "CALM" | "TERMINAL";

export type MotifId =
  | "E8_E8"
  | "E8_S16_S16"
  | "E8_TRIPLET_3"
  | "H1"
  | "H2"
  | "Q1"
  | "Q2"
  | "Q3"
  | "Q4"
  | "S16_E8_S16"
  | "S16_S16_E8"
  | "S16_S16_S16_S16"
  | "W1";

export type RhythmFamily =
  | "eighth"
  | "half"
  | "mixed"
  | "quarter"
  | "sixteenth"
  | "triplet"
  | "whole";

export type NoteDuration =
  | "eighth"
  | "half"
  | "quarter"
  | "sixteenth"
  | "whole";

export type PitchContourId =
  | "alternating"
  | "arch"
  | "repeat-then-step"
  | "small-leap-down"
  | "small-leap-up"
  | "step-down"
  | "step-up"
  | "valley";

export type SupportedNoteCount = 1 | 2 | 3 | 4;
export type SlotDensity = "dense" | "normal" | "sparse";
export type SlotRole = "standard" | "terminal";

export type ReservedZoneReason =
  | "form"
  | "headline"
  | "persona"
  | "project-cards"
  | "tablet"
  | "transition";

export interface ScoreCompositionSlot {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly density: SlotDensity;
  readonly allowedMotifFamilies: readonly RhythmFamily[];
  readonly role?: SlotRole;
}

export interface ReservedScoreZone {
  readonly start: number;
  readonly end: number;
  readonly reason: ReservedZoneReason;
}

export interface TupletMetadata {
  readonly bracket: true;
  readonly count: 3;
  readonly label: "3";
  readonly labelPosition: "center";
}

export type SecondaryBeamTopology =
  | "continuous"
  | "left-and-right-hooks"
  | "leading-pair"
  | "none"
  | "trailing-pair";

export interface MotifDefinition {
  readonly id: MotifId;
  readonly family: RhythmFamily;
  readonly durations: readonly NoteDuration[];
  readonly dense: boolean;
  readonly primaryBeam: boolean;
  readonly secondaryBeam: SecondaryBeamTopology;
  readonly tuplet?: TupletMetadata;
}

export interface ProfileCalibration {
  readonly motifWeights: Readonly<Record<MotifId, number>>;
  readonly contourWeights: Readonly<Record<PitchContourId, number>>;
  readonly pitchAnchorWeights: Readonly<Record<number, number>>;
  readonly noteCountWeightsByDensity: Readonly<
    Record<SlotDensity, Readonly<Record<SupportedNoteCount, number>>>
  >;
  readonly denseAfterDensePenalty: number;
  readonly thirdSameFamilyPenalty: number;
}

export type ComposerCalibration = Readonly<
  Record<ComposerProfile, ProfileCalibration>
>;

export interface CompositionHistory {
  readonly motifIds: readonly MotifId[];
  readonly families: readonly RhythmFamily[];
  readonly denseStates: readonly boolean[];
  readonly staffSteps: readonly number[];
}

export interface ComposedNote {
  readonly staffStep: number;
  readonly duration: NoteDuration;
}

export interface ComposedMotif {
  readonly id: string;
  readonly slotId: string;
  readonly motifId: MotifId;
  readonly notes: readonly ComposedNote[];
  readonly family: RhythmFamily;
  readonly durations: readonly NoteDuration[];
  readonly staffSteps: readonly number[];
  readonly contourId: PitchContourId;
  readonly contourTranslation: number;
  readonly dense: boolean;
  readonly tuplet?: TupletMetadata;
}

export interface EmptyCompositionSlot {
  readonly slotId: string;
  readonly reason: "reserved-zone";
  readonly reservedReason: ReservedZoneReason;
}

export interface ComposedSegment {
  readonly composerVersion: ComposerVersion;
  readonly pitchContourTableVersion: PitchContourTableVersion;
  readonly branchId: string;
  readonly chapterId: string;
  readonly seed: string;
  readonly profile: ComposerProfile;
  readonly motifs: readonly ComposedMotif[];
  readonly emptySlots: readonly EmptyCompositionSlot[];
}

export interface ComposeSegmentInput {
  readonly sessionSeed: string;
  readonly branchId: string;
  readonly chapterId: string;
  readonly profile: ComposerProfile;
  readonly slots: readonly ScoreCompositionSlot[];
  readonly reservedZones?: readonly ReservedScoreZone[];
  readonly calibration?: ComposerCalibration;
}

export class ComposerConfigurationError extends Error {
  readonly code = "COMPOSER_CONFIGURATION_ERROR" as const;

  constructor(message: string) {
    super(message);
    this.name = "ComposerConfigurationError";
  }
}

export class ComposerCandidateExhaustedError extends Error {
  readonly code = "COMPOSER_CANDIDATE_EXHAUSTED" as const;

  constructor(
    readonly slotId: string,
    readonly attempts: number,
  ) {
    super(
      `No legal deterministic composer candidate remained for slot "${slotId}" after ${attempts} attempts.`,
    );
    this.name = "ComposerCandidateExhaustedError";
  }
}
