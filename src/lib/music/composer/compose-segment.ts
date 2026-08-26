import {
  appendCompositionHistory,
  EMPTY_COMPOSITION_HISTORY,
} from "./anti-repetition";
import { composeMotif } from "./compose-motif";
import { getMotifDefinition } from "./motifs";
import { APPROVED_COMPOSER_CALIBRATION_V1 } from "./profiles";
import {
  deriveChapterSeed,
  formatVersionedChapterSeed,
  hashSeedParts,
  Mulberry32,
} from "./prng";
import {
  COMPOSER_VERSION,
  ComposerConfigurationError,
  PITCH_CONTOUR_TABLE_VERSION,
  type ComposedMotif,
  type ComposedSegment,
  type ComposeSegmentInput,
  type CompositionHistory,
  type EmptyCompositionSlot,
  type ReservedScoreZone,
  type ScoreCompositionSlot,
} from "./types";

function assertFiniteUnitInterval(
  start: number,
  end: number,
  label: string,
): void {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end > 1 ||
    start >= end
  ) {
    throw new ComposerConfigurationError(
      `${label} must use an ordered interval inside 0..1.`,
    );
  }
}

function validateSlots(slots: readonly ScoreCompositionSlot[]): void {
  const ids = new Set<string>();

  for (const slot of slots) {
    if (slot.id.length === 0) {
      throw new ComposerConfigurationError("Composition slot IDs cannot be empty.");
    }

    if (ids.has(slot.id)) {
      throw new ComposerConfigurationError(
        `Composition slot ID "${slot.id}" is duplicated.`,
      );
    }

    ids.add(slot.id);
    assertFiniteUnitInterval(slot.start, slot.end, `Slot "${slot.id}"`);
  }
}

function validateReservedZones(zones: readonly ReservedScoreZone[]): void {
  for (const [index, zone] of zones.entries()) {
    assertFiniteUnitInterval(zone.start, zone.end, `Reserved zone ${index}`);
  }
}

function overlappingReservedZone(
  slot: ScoreCompositionSlot,
  zones: readonly ReservedScoreZone[],
): ReservedScoreZone | undefined {
  return zones.find(
    (zone) => slot.start < zone.end && slot.end > zone.start,
  );
}

function slotSeed(
  chapterSeed: number,
  branchId: string,
  slotId: string,
  profile: string,
): number {
  return hashSeedParts([
    "wflyer-music-composer-slot",
    COMPOSER_VERSION,
    chapterSeed,
    branchId,
    slotId,
    profile,
  ]);
}

function stableMotifInstanceId(
  branchId: string,
  chapterId: string,
  slotId: string,
): string {
  const digest = hashSeedParts([
    "wflyer-music-motif-instance",
    COMPOSER_VERSION,
    branchId,
    chapterId,
    slotId,
  ]);
  const readableSlot = slotId
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 48);

  return `wf-motif-${readableSlot || "slot"}-${digest
    .toString(16)
    .padStart(8, "0")}`;
}

export function composeSegment(input: ComposeSegmentInput): ComposedSegment {
  if (input.branchId.length === 0 || input.chapterId.length === 0) {
    throw new ComposerConfigurationError(
      "Branch and chapter IDs must both be non-empty.",
    );
  }

  validateSlots(input.slots);

  const reservedZones = input.reservedZones ?? [];
  validateReservedZones(reservedZones);

  const calibration = input.calibration ?? APPROVED_COMPOSER_CALIBRATION_V1;
  const chapterSeed = deriveChapterSeed(input.sessionSeed, input.chapterId);
  const motifs: ComposedMotif[] = [];
  const emptySlots: EmptyCompositionSlot[] = [];
  let history: CompositionHistory = EMPTY_COMPOSITION_HISTORY;

  // Array order is the authored semantic order. Geometry is never an input to
  // seeded selection, so responsive layouts reuse these slot IDs and results.
  for (const slot of input.slots) {
    const reservedZone = overlappingReservedZone(slot, reservedZones);

    if (reservedZone) {
      emptySlots.push(
        Object.freeze({
          slotId: slot.id,
          reason: "reserved-zone",
          reservedReason: reservedZone.reason,
        }),
      );
      continue;
    }

    const motif = composeMotif({
      instanceId: stableMotifInstanceId(
        input.branchId,
        input.chapterId,
        slot.id,
      ),
      slot,
      history,
      calibration: calibration[input.profile],
      prng: new Mulberry32(
        slotSeed(chapterSeed, input.branchId, slot.id, input.profile),
      ),
      terminalProfile: input.profile === "TERMINAL",
    });

    motifs.push(motif);
    history = appendCompositionHistory(
      history,
      getMotifDefinition(motif.motifId),
      motif.staffSteps,
    );
  }

  return Object.freeze({
    composerVersion: COMPOSER_VERSION,
    pitchContourTableVersion: PITCH_CONTOUR_TABLE_VERSION,
    branchId: input.branchId,
    chapterId: input.chapterId,
    seed: formatVersionedChapterSeed(chapterSeed),
    profile: input.profile,
    motifs: Object.freeze(motifs),
    emptySlots: Object.freeze(emptySlots),
  });
}
