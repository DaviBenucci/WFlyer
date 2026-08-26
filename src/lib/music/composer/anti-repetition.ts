import { isTerminalMotif } from "./motifs";
import type {
  CompositionHistory,
  MotifDefinition,
  ScoreCompositionSlot,
} from "./types";

export const EMPTY_COMPOSITION_HISTORY: CompositionHistory = Object.freeze({
  motifIds: Object.freeze([]),
  families: Object.freeze([]),
  denseStates: Object.freeze([]),
  staffSteps: Object.freeze([]),
});

function trailingPitchRun(staffSteps: readonly number[]): {
  readonly pitch: number | undefined;
  readonly length: number;
} {
  const pitch = staffSteps.at(-1);

  if (pitch === undefined) {
    return { pitch: undefined, length: 0 };
  }

  let length = 0;

  for (let index = staffSteps.length - 1; index >= 0; index -= 1) {
    if (staffSteps[index] !== pitch) {
      break;
    }

    length += 1;
  }

  return { pitch, length };
}

export function wouldCreateThreeIdenticalPitches(
  historyStaffSteps: readonly number[],
  candidateStaffSteps: readonly number[],
): boolean {
  const combined = [...historyStaffSteps.slice(-2), ...candidateStaffSteps];
  let runLength = 0;
  let previous: number | undefined;

  for (const staffStep of combined) {
    if (staffStep === previous) {
      runLength += 1;
    } else {
      previous = staffStep;
      runLength = 1;
    }

    if (runLength > 2) {
      return true;
    }
  }

  return false;
}

export function motifSatisfiesHardConstraints(
  motif: MotifDefinition,
  slot: ScoreCompositionSlot,
  history: CompositionHistory,
): boolean {
  if (!slot.allowedMotifFamilies.includes(motif.family)) {
    return false;
  }

  if (history.motifIds.at(-1) === motif.id) {
    return false;
  }

  if (slot.role === "terminal" && !isTerminalMotif(motif.id)) {
    return false;
  }

  return true;
}

export function appendCompositionHistory(
  history: CompositionHistory,
  motif: MotifDefinition,
  staffSteps: readonly number[],
): CompositionHistory {
  return Object.freeze({
    motifIds: Object.freeze([...history.motifIds, motif.id]),
    families: Object.freeze([...history.families, motif.family]),
    denseStates: Object.freeze([...history.denseStates, motif.dense]),
    staffSteps: Object.freeze([...history.staffSteps, ...staffSteps]),
  });
}

export function motifSoftPenalty(
  motif: MotifDefinition,
  history: CompositionHistory,
  denseAfterDensePenalty: number,
  thirdSameFamilyPenalty: number,
): number {
  let penalty = 1;

  if (motif.dense && history.denseStates.at(-1) === true) {
    penalty *= denseAfterDensePenalty;
  }

  const previousFamilies = history.families.slice(-2);

  if (
    previousFamilies.length === 2 &&
    previousFamilies.every((family) => family === motif.family)
  ) {
    penalty *= thirdSameFamilyPenalty;
  }

  return penalty;
}

export function currentTrailingPitchRun(
  history: CompositionHistory,
): ReturnType<typeof trailingPitchRun> {
  return trailingPitchRun(history.staffSteps);
}
