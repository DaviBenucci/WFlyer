import {
  motifSatisfiesHardConstraints,
  motifSoftPenalty,
  wouldCreateThreeIdenticalPitches,
} from "./anti-repetition";
import {
  AUTOMATIC_MOTIF_IDS,
  getMotifDefinition,
  isTerminalMotif,
} from "./motifs";
import {
  ContourTranslationExhaustedError,
  instantiatePitchContour,
  LANDING_STAFF_STEPS,
  supportedContoursForLength,
  type TranslatedContour,
} from "./pitch-contours";
import {
  Mulberry32,
  weightedCandidateSchedule,
  type WeightedCandidate,
} from "./prng";
import {
  ComposerCandidateExhaustedError,
  ComposerConfigurationError,
  type ComposedMotif,
  type CompositionHistory,
  type MotifDefinition,
  type MotifId,
  type PitchContourId,
  type ProfileCalibration,
  type ScoreCompositionSlot,
  type SupportedNoteCount,
} from "./types";

export interface ComposeMotifInput {
  readonly instanceId: string;
  readonly slot: ScoreCompositionSlot;
  readonly history: CompositionHistory;
  readonly calibration: ProfileCalibration;
  readonly prng: Mulberry32;
  readonly terminalProfile: boolean;
}

export type PitchContourResolver = (
  contourId: PitchContourId,
  noteCount: SupportedNoteCount,
  anchorStaffStep: number,
) => TranslatedContour;

function noteCountOf(motif: MotifDefinition): SupportedNoteCount {
  const noteCount = motif.durations.length;

  if (noteCount < 1 || noteCount > 4) {
    throw new ComposerConfigurationError(
      `Motif "${motif.id}" has an unsupported note count.`,
    );
  }

  return noteCount as SupportedNoteCount;
}

function motifSchedule(
  input: ComposeMotifInput,
): readonly MotifId[] {
  const { calibration, history, prng, slot, terminalProfile } = input;
  const candidates: WeightedCandidate<MotifId>[] = AUTOMATIC_MOTIF_IDS.map(
    (motifId) => {
      const motif = getMotifDefinition(motifId);
      const noteCount = noteCountOf(motif);
      const terminalAllowed = !terminalProfile || isTerminalMotif(motifId);
      const hardAllowed =
        terminalAllowed && motifSatisfiesHardConstraints(motif, slot, history);
      const baseWeight = calibration.motifWeights[motifId];
      const densityWeight =
        calibration.noteCountWeightsByDensity[slot.density][noteCount];
      const softPenalty = motifSoftPenalty(
        motif,
        history,
        calibration.denseAfterDensePenalty,
        calibration.thirdSameFamilyPenalty,
      );

      return {
        value: motifId,
        weight: hardAllowed
          ? baseWeight * densityWeight * softPenalty
          : 0,
      };
    },
  );

  return weightedCandidateSchedule(candidates, prng);
}

function contourSchedule(
  noteCount: SupportedNoteCount,
  calibration: ProfileCalibration,
  prng: Mulberry32,
): readonly PitchContourId[] {
  return weightedCandidateSchedule(
    supportedContoursForLength(noteCount).map((contourId) => ({
      value: contourId,
      weight: calibration.contourWeights[contourId],
    })),
    prng,
  );
}

function anchorSchedule(
  calibration: ProfileCalibration,
  prng: Mulberry32,
): readonly number[] {
  return weightedCandidateSchedule(
    LANDING_STAFF_STEPS.map((staffStep) => ({
      value: staffStep,
      weight: calibration.pitchAnchorWeights[staffStep] ?? 0,
    })),
    prng,
  );
}

function createComposedMotif(
  instanceId: string,
  slotId: string,
  motif: MotifDefinition,
  contourId: PitchContourId,
  staffSteps: readonly number[],
  contourTranslation: number,
): ComposedMotif {
  if (!instanceId.startsWith("wf-") || instanceId.length <= 3) {
    throw new ComposerConfigurationError(
      "Composed motif instance IDs must be stable wf-* identifiers.",
    );
  }

  if (staffSteps.length !== motif.durations.length) {
    throw new ComposerConfigurationError(
      `Motif "${motif.id}" requires exactly ${motif.durations.length} composed notes.`,
    );
  }

  const notes = Object.freeze(
    staffSteps.map((staffStep, index) => {
      const duration = motif.durations[index];

      if (!duration) {
        throw new ComposerConfigurationError(
          `Motif "${motif.id}" is missing duration ${index}.`,
        );
      }

      return Object.freeze({ staffStep, duration });
    }),
  );
  const common = {
    id: instanceId,
    slotId,
    motifId: motif.id,
    notes,
    family: motif.family,
    durations: motif.durations,
    staffSteps,
    contourId,
    contourTranslation,
    dense: motif.dense,
  } as const;

  return Object.freeze(
    motif.tuplet ? { ...common, tuplet: motif.tuplet } : common,
  );
}

function composeMotifWithResolver(
  input: ComposeMotifInput,
  resolvePitchContour: PitchContourResolver,
): ComposedMotif {
  const motifIds = motifSchedule(input);
  let attempts = 0;

  for (const motifId of motifIds) {
    const motif = getMotifDefinition(motifId);
    const noteCount = noteCountOf(motif);
    const contours = contourSchedule(noteCount, input.calibration, input.prng);
    const anchors = anchorSchedule(input.calibration, input.prng);

    contourCandidates: for (const contourId of contours) {
      for (const anchorStaffStep of anchors) {
        attempts += 1;

        let translated;

        try {
          translated = resolvePitchContour(
            contourId,
            noteCount,
            anchorStaffStep,
          );
        } catch (error) {
          if (error instanceof ContourTranslationExhaustedError) {
            continue contourCandidates;
          }

          throw error;
        }

        if (
          wouldCreateThreeIdenticalPitches(
            input.history.staffSteps,
            translated.staffSteps,
          )
        ) {
          continue;
        }

        return createComposedMotif(
          input.instanceId,
          input.slot.id,
          motif,
          contourId,
          translated.staffSteps,
          translated.translation,
        );
      }
    }
  }

  throw new ComposerCandidateExhaustedError(input.slot.id, attempts);
}

export function composeMotif(input: ComposeMotifInput): ComposedMotif {
  return composeMotifWithResolver(input, instantiatePitchContour);
}

/** @internal Narrow deterministic rejection seam; production uses composeMotif. */
export function composeMotifWithResolverForTesting(
  input: ComposeMotifInput,
  resolvePitchContour: PitchContourResolver,
): ComposedMotif {
  return composeMotifWithResolver(input, resolvePitchContour);
}
