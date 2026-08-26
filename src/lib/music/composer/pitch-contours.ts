import {
  ComposerConfigurationError,
  PITCH_CONTOUR_TABLE_VERSION,
  type PitchContourId,
  type SupportedNoteCount,
} from "./types";

export interface PitchRange {
  readonly minimum: number;
  readonly maximum: number;
}

export const LANDING_PITCH_RANGE: PitchRange = Object.freeze({
  minimum: -2,
  maximum: 10,
});
export const PREFERRED_PITCH_RANGE: PitchRange = Object.freeze({
  minimum: 0,
  maximum: 8,
});
export const LANDING_STAFF_STEPS = Object.freeze([
  -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const);

export interface PitchContourTableEntry {
  readonly 1: readonly number[] | null;
  readonly 2: readonly number[] | null;
  readonly 3: readonly number[] | null;
  readonly 4: readonly number[] | null;
}

function immutableDeltas(values: readonly number[]): readonly number[] {
  return Object.freeze([...values]);
}

export const PITCH_CONTOUR_TABLE = Object.freeze({
  "step-up": {
    1: immutableDeltas([0]),
    2: immutableDeltas([0, 1]),
    3: immutableDeltas([0, 1, 2]),
    4: immutableDeltas([0, 1, 2, 3]),
  },
  "step-down": {
    1: immutableDeltas([0]),
    2: immutableDeltas([0, -1]),
    3: immutableDeltas([0, -1, -2]),
    4: immutableDeltas([0, -1, -2, -3]),
  },
  arch: {
    1: null,
    2: null,
    3: immutableDeltas([0, 1, 0]),
    4: immutableDeltas([0, 1, 1, 0]),
  },
  valley: {
    1: null,
    2: null,
    3: immutableDeltas([0, -1, 0]),
    4: immutableDeltas([0, -1, -1, 0]),
  },
  alternating: {
    1: null,
    2: null,
    3: immutableDeltas([0, 1, -1]),
    4: immutableDeltas([0, 1, -1, 0]),
  },
  "repeat-then-step": {
    1: null,
    2: null,
    3: immutableDeltas([0, 0, 1]),
    4: immutableDeltas([0, 0, 1, 2]),
  },
  "small-leap-up": {
    1: null,
    2: immutableDeltas([0, 2]),
    3: immutableDeltas([0, 2, 3]),
    4: immutableDeltas([0, 2, 3, 4]),
  },
  "small-leap-down": {
    1: null,
    2: immutableDeltas([0, -2]),
    3: immutableDeltas([0, -2, -3]),
    4: immutableDeltas([0, -2, -3, -4]),
  },
} as const satisfies Record<PitchContourId, PitchContourTableEntry>);

for (const entry of Object.values(PITCH_CONTOUR_TABLE)) {
  Object.freeze(entry);
}

export const PITCH_CONTOUR_IDS = Object.freeze(
  Object.keys(PITCH_CONTOUR_TABLE) as PitchContourId[],
);

export class UnsupportedPitchContourError extends Error {
  readonly code = "UNSUPPORTED_PITCH_CONTOUR" as const;

  constructor(
    readonly contourId: PitchContourId,
    readonly noteCount: SupportedNoteCount,
  ) {
    super(
      `Pitch contour "${contourId}" is unsupported for ${noteCount} notes in table version ${PITCH_CONTOUR_TABLE_VERSION}.`,
    );
    this.name = "UnsupportedPitchContourError";
  }
}

export class ContourTranslationExhaustedError extends Error {
  readonly code = "CONTOUR_TRANSLATION_EXHAUSTED" as const;

  constructor(
    readonly minimumPitch: number,
    readonly maximumPitch: number,
    readonly rangeMinimum: number,
    readonly rangeMaximum: number,
  ) {
    super(
      `Contour span ${minimumPitch}..${maximumPitch} cannot fit range ${rangeMinimum}..${rangeMaximum} by uniform translation.`,
    );
    this.name = "ContourTranslationExhaustedError";
  }
}

export interface TranslatedContour {
  readonly staffSteps: readonly number[];
  readonly translation: number;
}

export function getPitchContourDeltas(
  contourId: PitchContourId,
  noteCount: SupportedNoteCount,
): readonly number[] {
  const deltas = PITCH_CONTOUR_TABLE[contourId][noteCount];

  if (!deltas) {
    throw new UnsupportedPitchContourError(contourId, noteCount);
  }

  return deltas;
}

export function supportedContoursForLength(
  noteCount: SupportedNoteCount,
): readonly PitchContourId[] {
  return Object.freeze(
    PITCH_CONTOUR_IDS.filter(
      (contourId) => PITCH_CONTOUR_TABLE[contourId][noteCount] !== null,
    ),
  );
}

function assertIntegerSequence(values: readonly number[]): void {
  if (
    values.length === 0 ||
    values.some((value) => !Number.isSafeInteger(value))
  ) {
    throw new ComposerConfigurationError(
      "Pitch contours must be non-empty sequences of integer staffSteps.",
    );
  }
}

/**
 * Applies exactly one minimum-absolute integer translation to the full contour.
 * No pitch is inspected or altered independently.
 */
export function translateCompleteContourIntoRange(
  staffSteps: readonly number[],
  range: PitchRange = LANDING_PITCH_RANGE,
): TranslatedContour {
  assertIntegerSequence(staffSteps);

  if (
    !Number.isSafeInteger(range.minimum) ||
    !Number.isSafeInteger(range.maximum) ||
    range.minimum > range.maximum
  ) {
    throw new ComposerConfigurationError(
      "Pitch range bounds must be ordered integer staffSteps.",
    );
  }

  const minimumPitch = Math.min(...staffSteps);
  const maximumPitch = Math.max(...staffSteps);
  const minimumTranslation = range.minimum - minimumPitch;
  const maximumTranslation = range.maximum - maximumPitch;

  if (minimumTranslation > maximumTranslation) {
    throw new ContourTranslationExhaustedError(
      minimumPitch,
      maximumPitch,
      range.minimum,
      range.maximum,
    );
  }

  const translation =
    minimumTranslation > 0
      ? minimumTranslation
      : maximumTranslation < 0
        ? maximumTranslation
        : 0;

  return Object.freeze({
    staffSteps: Object.freeze(
      staffSteps.map((staffStep) => staffStep + translation),
    ),
    translation,
  });
}

export function instantiatePitchContour(
  contourId: PitchContourId,
  noteCount: SupportedNoteCount,
  anchorStaffStep: number,
): TranslatedContour {
  if (!Number.isSafeInteger(anchorStaffStep)) {
    throw new ComposerConfigurationError(
      "Pitch anchors must be integer staffSteps.",
    );
  }

  const deltas = getPitchContourDeltas(contourId, noteCount);
  const rawContour = deltas.map((delta) => anchorStaffStep + delta);

  return translateCompleteContourIntoRange(rawContour);
}
