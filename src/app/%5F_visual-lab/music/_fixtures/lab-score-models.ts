import { composeSegment } from "@/lib/music/composer/compose-segment";
import {
  AUTOMATIC_MOTIF_IDS,
  getMotifDefinition,
} from "@/lib/music/composer/motifs";
import {
  getPitchContourDeltas,
  supportedContoursForLength,
} from "@/lib/music/composer/pitch-contours";
import type {
  ComposedMotif,
  ComposedSegment,
  ComposerProfile,
  MotifId,
  NoteDuration,
  PitchContourId,
  RhythmFamily,
  ScoreCompositionSlot,
  SupportedNoteCount,
} from "@/lib/music/composer/types";
import {
  COMPOSER_VERSION,
  PITCH_CONTOUR_TABLE_VERSION,
} from "@/lib/music/composer/types";
import { CubicBezierScorePath } from "@/lib/music/geometry/cubic-bezier-score-path";
import {
  buildResponsiveScoreProjection,
  APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
  projectSemanticSlotNoteTs,
  RESPONSIVE_SCORE_PRESENTATION_MODES,
  type ResponsiveScorePresentationMode,
  type ResponsiveScoreProjection,
  type ResponsiveScoreProjectionZoneInput,
} from "@/lib/music/geometry/responsive-score-projection";
import { frameAt, placeAtStaffStep } from "@/lib/music/geometry/score-path";
import { sampleStaffLines } from "@/lib/music/geometry/staff";
import { resolveBeamGroupStemDirection } from "@/lib/music/geometry/stems";
import { StraightScorePath } from "@/lib/music/geometry/straight-score-path";
import { requireNormalizedPosition } from "@/lib/music/geometry/units";
import type {
  Fifths,
  ScorePath,
  StemDirection,
  Vec2,
} from "@/lib/music/geometry/types";
import {
  addVectors,
  distanceBetween,
  dotVectors,
  scaleVector,
} from "@/lib/music/geometry/vectors";
import { APPROVED_DOWN_FLAG_TRANSFORM } from "@/lib/music/glyphs/metrics";
import { buildNoteModel } from "@/lib/music/renderer/build-note-model";
import { buildScoreModel } from "@/lib/music/renderer/build-score-model";
import type {
  BuildMotifModelInput,
  NoteRenderModel,
  RenderLayer,
  ScoreMotifPlacement,
  ScoreRenderModel,
} from "@/lib/music/renderer/types";

import { APPROVED_RENDERER_GLYPH_CALIBRATIONS } from "./approved-calibration";
import { APPROVED_RENDERER_TOKENS } from "./draft-calibration";

/** Fixed development-harness unit; it is not a public-layout measurement. */
export const LAB_STAFF_SPACE = 16;

/**
 * Prevents coordinate-rounding cancellation when a curved triplet fixture is
 * placed at the renderer's exact minimum clearance. This is many orders of
 * magnitude below a visible pixel and is not an engraving token.
 */
const LAB_TUPLET_CLEARANCE_NUMERIC_GUARD_SP = 1e-9;

const HORIZONTAL_VIEW_BOX = "0 0 1280 280";
const TRIPLET_DETAIL_VIEW_BOX = "320 20 640 240";
const RESPONSIVE_VIEW_BOXES = Object.freeze({
  "horizontal-enhanced": HORIZONTAL_VIEW_BOX,
  "vertical-wide": "0 0 760 940",
  "vertical-compact": "0 0 520 1280",
  static: "0 0 760 940",
} as const satisfies Record<ResponsiveScorePresentationMode, string>);
const ALL_RHYTHM_FAMILIES = Object.freeze([
  "eighth",
  "half",
  "mixed",
  "quarter",
  "sixteenth",
  "triplet",
  "whole",
] as const satisfies readonly RhythmFamily[]);

export type LabComposerViewport = ResponsiveScorePresentationMode;
export type LabPathShape = "gentle-arc" | "gentle-s" | "straight";

export interface LabScoreFixture {
  readonly model: ScoreRenderModel;
  readonly viewBox: string;
}

export interface ComposerLabFixture extends LabScoreFixture {
  readonly projection: ResponsiveScoreProjection;
  readonly segment: ComposedSegment;
}

export interface ResponsiveProjectionZoneEvidence {
  /** Exact for straight notation zones; display-only sampling for connectors. */
  readonly displayTangentAngleDeg: number;
  readonly eventCount: number;
  readonly id: string;
  readonly kind: "connector" | "notation-safe";
  readonly minimumCurvatureRadiusSp: number | null;
  readonly notationAngleLimitApplies: boolean;
  readonly semanticSlotIds: readonly string[];
  readonly tangentMeasurement: "analytic-constant" | "display-sampled";
}

export interface ResponsiveProjectionReviewFixture
  extends ComposerLabFixture {
  readonly evidence: {
    readonly clef: {
      readonly mirrorX: boolean;
      readonly mirrorY: boolean;
      readonly rotationRadians: number;
    };
    readonly finalBarlineOrientation: "thin-gap-thick-vertical";
    readonly keySignature: {
      readonly fifths: Fifths;
      readonly renderedAccidentalGlyphs: number;
    };
    readonly musicalEventCount: number;
    readonly ordinaryBarlineCount: number;
    readonly semanticSlotIds: readonly string[];
    readonly zones: readonly ResponsiveProjectionZoneEvidence[];
  };
}

export interface MotifPathMatrixFixture extends LabScoreFixture {
  readonly label: string;
  readonly motifId: MotifId;
  readonly pathShape: LabPathShape;
  readonly semanticMotif: ComposedMotif;
}

export interface TripletDetailFixture extends LabScoreFixture {
  readonly label: string;
  readonly pathShape: LabPathShape;
  readonly semanticMotif: ComposedMotif;
  readonly stemDirection: StemDirection;
}

export interface KeySignatureStructuralEvidence {
  readonly configuredOccurrences: 0 | 1;
  readonly firstNoteT: number;
  readonly keySignatureT: number | null;
  readonly nearOriginAndBeforeMusic: boolean;
  readonly renderedAccidentalGlyphs: number;
  readonly rendererInputCardinality: "zero-or-one";
}

export interface KeySignatureLabFixture extends LabScoreFixture {
  readonly structuralEvidence: KeySignatureStructuralEvidence;
}

interface StandaloneNoteFixture {
  readonly duration: NoteDuration;
  readonly id: string;
  readonly staffStep: number;
  readonly t: number;
}

export interface LabResponsiveStructuralConfiguration {
  readonly includeOrdinaryBarline?: boolean;
  readonly keySignatureFifths?: Fifths;
}

function horizontalPath(
  y = 140,
  startX = 40,
  endX = 1240,
): StraightScorePath {
  return new StraightScorePath(
    { x: startX, y },
    { x: endX, y },
    { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
  );
}

function pathShapeFixtures(): readonly {
  readonly id: LabPathShape;
  readonly label: string;
  readonly path: ScorePath;
}[] {
  return Object.freeze([
    {
      id: "straight",
      label: "Straight master guide",
      path: new StraightScorePath(
        { x: 40, y: 140 },
        { x: 1240, y: 140 },
        { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
      ),
    },
    {
      id: "gentle-arc",
      label: "Gentle cubic arc",
      path: new CubicBezierScorePath(
        { x: 40, y: 150 },
        { x: 360, y: 82 },
        { x: 920, y: 82 },
        { x: 1240, y: 150 },
        { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
      ),
    },
    {
      id: "gentle-s",
      label: "Gentle cubic S-curve",
      path: new CubicBezierScorePath(
        { x: 40, y: 140 },
        { x: 360, y: 72 },
        { x: 920, y: 208 },
        { x: 1240, y: 140 },
        { at: 0.5, towardIncreasingPitch: { x: 0, y: -1 } },
      ),
    },
  ]);
}

function immutableFixtureMotif(
  motifId: MotifId,
  staffSteps: readonly number[],
  slotId: string,
): ComposedMotif {
  const definition = getMotifDefinition(motifId);

  if (definition.durations.length !== staffSteps.length) {
    throw new RangeError(
      `${motifId} requires ${definition.durations.length} fixture pitches`,
    );
  }

  const { contourId, contourTranslation } =
    resolveFixturePitchContour(staffSteps);

  const common = {
    id: `wf-motif-${slotId}`,
    slotId,
    motifId,
    notes: Object.freeze(
      staffSteps.map((staffStep, index) =>
        Object.freeze({
          staffStep,
          duration: definition.durations[index]!,
        }),
      ),
    ),
    family: definition.family,
    durations: definition.durations,
    staffSteps: Object.freeze([...staffSteps]),
    contourId,
    contourTranslation,
    dense: definition.dense,
  } as const;

  return Object.freeze(
    definition.tuplet ? { ...common, tuplet: definition.tuplet } : common,
  );
}

function evenlySpacedTs(
  count: number,
  start: number,
  end: number,
): readonly number[] {
  if (count === 1) return Object.freeze([(start + end) / 2]);

  return Object.freeze(
    Array.from(
      { length: count },
      (_, index) => start + ((end - start) * index) / (count - 1),
    ),
  );
}

function resolveFixturePitchContour(staffSteps: readonly number[]): {
  readonly contourId: PitchContourId;
  readonly contourTranslation: number;
} {
  if (
    ![1, 2, 3, 4].includes(staffSteps.length) ||
    staffSteps.some((staffStep) => !Number.isSafeInteger(staffStep))
  ) {
    throw new RangeError(
      "Fixture pitches require one to four integer staffSteps",
    );
  }

  const noteCount = staffSteps.length as SupportedNoteCount;

  for (const contourId of supportedContoursForLength(noteCount)) {
    const deltas = getPitchContourDeltas(contourId, noteCount);
    const firstStaffStep = staffSteps[0];
    const firstDelta = deltas[0];

    if (firstStaffStep === undefined || firstDelta === undefined) continue;

    const contourTranslation = firstStaffStep - firstDelta;
    const matchesAuthoredIntervals = staffSteps.every(
      (staffStep, index) =>
        staffStep === (deltas[index] ?? Number.NaN) + contourTranslation,
    );

    if (matchesAuthoredIntervals) {
      return { contourId, contourTranslation };
    }
  }

  throw new RangeError(
    `Fixture pitches ${staffSteps.join(",")} do not match a versioned contour`,
  );
}

function noteheadStemAttachment(
  path: ScorePath,
  t: number,
  staffStep: number,
  direction: StemDirection,
): Vec2 {
  const calibration =
    APPROVED_RENDERER_GLYPH_CALIBRATIONS["wf-music-notehead-filled"];
  const frame = frameAt(path, t);
  const center = placeAtStaffStep(path, t, staffStep, LAB_STAFF_SPACE);
  const requestedAnchor =
    direction === "up"
      ? calibration.anchors.stemUp
      : calibration.anchors.stemDown;
  const alignedAnchor = calibration.anchors.opticalCenter;
  const width = calibration.nominalWidthSp * LAB_STAFF_SPACE;
  const height = calibration.nominalHeightSp * LAB_STAFF_SPACE;
  const localX = (requestedAnchor.x - alignedAnchor.x) * width;
  const localY = -(requestedAnchor.y - alignedAnchor.y) * height;

  return addVectors(
    center,
    addVectors(
      scaleVector(frame.tangent, localX),
      scaleVector(frame.normal, localY),
    ),
  );
}

function crossVectors(left: Vec2, right: Vec2): number {
  return left.x * right.y - left.y * right.x;
}

function averagePoints(points: readonly Vec2[]): Vec2 {
  if (points.length === 0) {
    throw new RangeError("Beam fixtures require notehead attachments");
  }

  const sum = points.reduce(
    (total, point) => ({ x: total.x + point.x, y: total.y + point.y }),
    { x: 0, y: 0 },
  );

  return scaleVector(sum, 1 / points.length);
}

/**
 * Intersects a caller-owned straight beam axis with every note-local normal.
 * The deterministic offset search is fixture-only optical layout: it keeps
 * stems locally normal on curved paths without promoting a Gate-C token.
 */
function resolvePrimaryBeamAttachments(
  path: ScorePath,
  noteTs: readonly number[],
  stemAttachments: readonly Vec2[],
  direction: StemDirection,
  draftStemReach: number,
): {
  readonly axisDirection: Vec2;
  readonly primaryAttachments: readonly Vec2[];
  readonly secondaryOffsetDirection: Vec2;
} {
  const firstT = noteTs[0];
  const lastT = noteTs.at(-1);

  if (firstT === undefined || lastT === undefined) {
    throw new RangeError("Beam fixtures require note positions");
  }

  const beamFrame = frameAt(path, (firstT + lastT) / 2);
  const axisDirection = beamFrame.tangent;
  const directionSign = direction === "up" ? 1 : -1;
  const attachmentCenter = averagePoints(stemAttachments);

  for (let offsetMultiplier = 1; offsetMultiplier <= 32; offsetMultiplier += 1) {
    const beamReference = addVectors(
      attachmentCenter,
      scaleVector(
        beamFrame.normal,
        directionSign * draftStemReach * offsetMultiplier,
      ),
    );
    const intersections = stemAttachments.map((attachment, index) => {
      const noteT = noteTs[index];

      if (noteT === undefined) {
        throw new RangeError("Beam fixture notes and positions must align");
      }

      const noteNormal = frameAt(path, noteT).normal;
      const denominator = crossVectors(noteNormal, axisDirection);

      if (Math.abs(denominator) <= 1e-9) {
        throw new RangeError(
          "Beam axis must intersect every note-local stem normal",
        );
      }

      const deltaToReference = {
        x: beamReference.x - attachment.x,
        y: beamReference.y - attachment.y,
      };
      const stemLength =
        crossVectors(deltaToReference, axisDirection) / denominator;

      return {
        end: addVectors(attachment, scaleVector(noteNormal, stemLength)),
        directedLength: stemLength * directionSign,
      };
    });
    const allStemsExtendInDirection = intersections.every(
      ({ directedLength }) => directedLength > 1e-7,
    );
    const progresses = intersections.map(({ end }) =>
      dotVectors(
        { x: end.x - beamReference.x, y: end.y - beamReference.y },
        axisDirection,
      ),
    );
    const progressesInSemanticOrder = progresses.every(
      (progress, index) =>
        index === 0 || progress > (progresses[index - 1] ?? Number.NaN) + 1e-7,
    );

    if (allStemsExtendInDirection && progressesInSemanticOrder) {
      return {
        axisDirection,
        primaryAttachments: intersections.map(({ end }) => end),
        secondaryOffsetDirection: scaleVector(
          beamFrame.normal,
          -directionSign,
        ),
      };
    }
  }

  throw new RangeError(
    "Unable to place the draft beam axis across all note-local stem normals",
  );
}

function layoutBeamedMotif(
  path: ScorePath,
  motif: ComposedMotif,
  noteTs: readonly number[],
): Pick<ScoreMotifPlacement, "beamLayout" | "tupletLayout"> {
  const direction = resolveBeamGroupStemDirection(motif.staffSteps);
  const attachments = motif.staffSteps.map((staffStep, index) =>
    noteheadStemAttachment(
      path,
      noteTs[index] ?? Number.NaN,
      staffStep,
      direction,
    ),
  );
  const draftStemReach =
    APPROVED_RENDERER_TOKENS.note.stemLengthSp * LAB_STAFF_SPACE;
  const resolvedBeam = resolvePrimaryBeamAttachments(
    path,
    noteTs,
    attachments,
    direction,
    draftStemReach,
  );
  const towardNoteheads = resolvedBeam.secondaryOffsetDirection;
  const beamLayout: NonNullable<
    BuildMotifModelInput["beamLayout"]
  > = {
    axisDirection: resolvedBeam.axisDirection,
    primaryAttachments: resolvedBeam.primaryAttachments,
    secondaryOffsetDirection: towardNoteheads,
  };

  if (!motif.tuplet) return { beamLayout };

  const first = resolvedBeam.primaryAttachments[0];
  const last = resolvedBeam.primaryAttachments.at(-1);

  if (!first || !last) {
    throw new RangeError("Triplet fixtures require beam endpoints");
  }

  const awayFromNoteheads = scaleVector(towardNoteheads, -1);
  const bracketOffset = scaleVector(
    awayFromNoteheads,
    (APPROVED_RENDERER_TOKENS.tuplet.bracketClearanceSp +
      LAB_TUPLET_CLEARANCE_NUMERIC_GUARD_SP) *
      LAB_STAFF_SPACE,
  );
  const bracketStart = addVectors(first, bracketOffset);
  const bracketEnd = addVectors(last, bracketOffset);

  return {
    beamLayout,
    tupletLayout: {
      bracketStart,
      bracketEnd,
      endCapDirection: towardNoteheads,
      labelPosition: {
        x: (bracketStart.x + bracketEnd.x) / 2,
        y: (bracketStart.y + bracketEnd.y) / 2,
      },
    },
  };
}

function baseScoreModel(
  id: string,
  path: ScorePath,
  sampleCount = 49,
): ScoreRenderModel {
  return buildScoreModel({
    id,
    path,
    staffSpace: LAB_STAFF_SPACE,
    staffSampleCount: sampleCount,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    motifs: [],
  });
}

function withStandaloneNotes(
  base: ScoreRenderModel,
  notes: readonly NoteRenderModel[],
): ScoreRenderModel {
  const notePrimitives = notes.flatMap((note) => note.primitives);
  const layers: readonly RenderLayer[] = base.layers.map((layer) =>
    layer.id === "notes"
      ? { ...layer, primitives: notePrimitives }
      : layer,
  );

  return {
    ...base,
    layers,
    primitives: layers.flatMap((layer) => layer.primitives),
  };
}

function buildStandaloneNoteScore(
  id: string,
  path: ScorePath,
  notes: readonly StandaloneNoteFixture[],
): ScoreRenderModel {
  const base = baseScoreModel(id, path);
  const noteModels = notes.map((note) =>
    buildNoteModel({
      id: `${id}:${note.id}`,
      beamed: false,
      calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
      duration: note.duration,
      path,
      staffSpace: LAB_STAFF_SPACE,
      staffStep: note.staffStep,
      t: note.t,
      tokens: APPROVED_RENDERER_TOKENS.note,
    }),
  );

  return withStandaloneNotes(base, noteModels);
}

export function buildPitchLadderFixture(): LabScoreFixture {
  const path = horizontalPath(140, 40, 1240);
  const staffSteps = Array.from({ length: 13 }, (_, index) => index - 2);
  const ts = evenlySpacedTs(staffSteps.length, 0.04, 0.96);

  return {
    model: buildStandaloneNoteScore(
      "lab-pitch-ladder",
      path,
      staffSteps.map((staffStep, index) => ({
        duration: "whole",
        id: `staff-step-${staffStep}`,
        staffStep,
        t: ts[index] ?? Number.NaN,
      })),
    ),
    viewBox: HORIZONTAL_VIEW_BOX,
  };
}

export function buildLedgerFixture(): LabScoreFixture {
  const path = horizontalPath(140, 40, 1240);
  const staffSteps = [-4, -3, -2, -1, 9, 10, 11, 12, 13, 14] as const;
  const ts = evenlySpacedTs(staffSteps.length, 0.05, 0.95);

  return {
    model: buildStandaloneNoteScore(
      "lab-ledger-cases",
      path,
      staffSteps.map((staffStep, index) => ({
        duration: "whole",
        id: `staff-step-${staffStep}`,
        staffStep,
        t: ts[index] ?? Number.NaN,
      })),
    ),
    viewBox: HORIZONTAL_VIEW_BOX,
  };
}

export function buildStemAndFlagFixture(): LabScoreFixture {
  const path = horizontalPath(140, 40, 1240);
  const notes = [
    { duration: "quarter", id: "stem-up", staffStep: 3 },
    { duration: "quarter", id: "stem-down", staffStep: 4 },
    { duration: "eighth", id: "eighth-up", staffStep: 2 },
    { duration: "eighth", id: "eighth-down", staffStep: 6 },
    { duration: "sixteenth", id: "sixteenth-up", staffStep: 2 },
    { duration: "sixteenth", id: "sixteenth-down", staffStep: 6 },
  ] as const;
  const ts = evenlySpacedTs(notes.length, 0.12, 0.88);

  return {
    model: buildStandaloneNoteScore(
      "lab-stems-flags",
      path,
      notes.map((note, index) => ({
        ...note,
        t: ts[index] ?? Number.NaN,
      })),
    ),
    viewBox: HORIZONTAL_VIEW_BOX,
  };
}

export function buildBeamFixture(
  motifId: Extract<
    MotifId,
    | "E8_E8"
    | "E8_S16_S16"
    | "E8_TRIPLET_3"
    | "S16_E8_S16"
    | "S16_S16_E8"
    | "S16_S16_S16_S16"
  >,
  staffSteps: readonly number[],
  fixtureId: string,
): LabScoreFixture {
  const path = horizontalPath(140, 40, 1240);
  const motif = immutableFixtureMotif(motifId, staffSteps, fixtureId);
  const noteTs = evenlySpacedTs(staffSteps.length, 0.3, 0.7);
  const layout = layoutBeamedMotif(path, motif, noteTs);

  return {
    model: buildScoreModel({
      id: fixtureId,
      path,
      staffSpace: LAB_STAFF_SPACE,
      staffSampleCount: 49,
      calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
      tokens: APPROVED_RENDERER_TOKENS,
      motifs: [{ motif, noteTs, ...layout }],
    }),
    viewBox: HORIZONTAL_VIEW_BOX,
  };
}

export function buildKeySignatureFixture(
  fifths: Fifths,
): KeySignatureLabFixture {
  const path = horizontalPath(140, 40, 1240);
  const keySignatureT = fifths === 0 ? null : 0.14;
  const firstNoteT = 0.32;
  const model = buildScoreModel({
    id: `lab-key-signature-${fifths}`,
    path,
    staffSpace: LAB_STAFF_SPACE,
    staffSampleCount: 49,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    clef: { t: 0.05 },
    ...(keySignatureT === null
      ? {}
      : { keySignature: { fifths, t: keySignatureT } }),
    motifs: [
      {
        motif: immutableFixtureMotif(
          "Q1",
          [4],
          `lab-key-signature-${fifths}:opening-note`,
        ),
        noteTs: [firstNoteT],
      },
    ],
    barlines: [{ id: "ordinary", t: 0.72 }],
    finalBarline: { id: "terminal", t: 0.9 },
  });
  const renderedAccidentalGlyphs = model.primitives.filter(
    ({ role }) => role === "key-signature",
  ).length;

  return {
    model,
    structuralEvidence: Object.freeze({
      configuredOccurrences: keySignatureT === null ? 0 : 1,
      firstNoteT,
      keySignatureT,
      nearOriginAndBeforeMusic:
        keySignatureT === null || keySignatureT < firstNoteT,
      renderedAccidentalGlyphs,
      rendererInputCardinality: "zero-or-one",
    }),
    viewBox: HORIZONTAL_VIEW_BOX,
  };
}

function curvedScoreModel(
  id: string,
  path: ScorePath,
): ScoreRenderModel {
  const motifSteps = [0, 4, 8] as const;
  const noteTs = [0.25, 0.5, 0.75] as const;

  return buildScoreModel({
    id,
    path,
    staffSpace: LAB_STAFF_SPACE,
    staffSampleCount: 65,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    clef: { t: 0.07 },
    motifs: motifSteps.map((staffStep, index) => ({
      motif: immutableFixtureMotif(
        "W1",
        [staffStep],
        `${id}:slot:${index}`,
      ),
      noteTs: [noteTs[index] ?? Number.NaN],
    })),
    barlines: [{ id: "ordinary", t: 0.84 }],
    finalBarline: { id: "terminal", t: 0.94 },
  });
}

const MOTIF_PATH_MATRIX_STAFF_STEPS = Object.freeze({
  Q1: Object.freeze([0]),
  Q2: Object.freeze([0, 2]),
  Q3: Object.freeze([0, 1, -1]),
  Q4: Object.freeze([0, 1, -1, 0]),
  H1: Object.freeze([4]),
  H2: Object.freeze([4, 2]),
  W1: Object.freeze([8]),
  E8_E8: Object.freeze([1, 2]),
  E8_TRIPLET_3: Object.freeze([0, 1, 2]),
  S16_S16_S16_S16: Object.freeze([2, 3, 4, 5]),
  E8_S16_S16: Object.freeze([2, 3, 4]),
  S16_S16_E8: Object.freeze([6, 5, 4]),
  S16_E8_S16: Object.freeze([1, 2, 3]),
} as const satisfies Record<MotifId, readonly number[]>);

function motifPathMatrixModel(
  motif: ComposedMotif,
  pathShape: LabPathShape,
  path: ScorePath,
): ScoreRenderModel {
  const motifId = motif.motifId;
  const staffSteps = motif.staffSteps;
  const fixtureId = `lab-motif-path-${pathShape}-${motifId}`;
  const noteTs = evenlySpacedTs(staffSteps.length, 0.34, 0.66);
  const definition = getMotifDefinition(motifId);
  const layout = definition.primaryBeam
    ? layoutBeamedMotif(path, motif, noteTs)
    : {};

  return buildScoreModel({
    id: fixtureId,
    path,
    staffSpace: LAB_STAFF_SPACE,
    staffSampleCount: 65,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    motifs: [{ motif, noteTs, ...layout }],
  });
}

/**
 * Gate-C matrix: every automatic motif is rendered from the same semantic
 * definition on every supported ScorePath shape. Glyph calibrations are the
 * Gate-B-approved runtime values; optical engraving tokens are the exact
 * external-human-approved Gate-C values.
 */
export function buildMotifPathMatrixFixtures(): readonly MotifPathMatrixFixture[] {
  return Object.freeze(
    pathShapeFixtures().flatMap((pathFixture) =>
      AUTOMATIC_MOTIF_IDS.map((motifId) => {
        const semanticMotif = immutableFixtureMotif(
          motifId,
          MOTIF_PATH_MATRIX_STAFF_STEPS[motifId],
          `lab-motif-path-${pathFixture.id}-${motifId}`,
        );

        return Object.freeze({
          label: `${motifId} on ${pathFixture.label}`,
          motifId,
          pathShape: pathFixture.id,
          semanticMotif,
          model: motifPathMatrixModel(
            semanticMotif,
            pathFixture.id,
            pathFixture.path,
          ),
          viewBox: HORIZONTAL_VIEW_BOX,
        });
      }),
    ),
  );
}

/**
 * Corrective Gate-C review matrix for the split triplet bracket. These six
 * fixtures isolate path shape and group stem direction without changing the
 * semantic E8_TRIPLET_3 grammar or promoting the optical tokens.
 */
export function buildTripletDetailFixtures(): readonly TripletDetailFixture[] {
  return Object.freeze(
    pathShapeFixtures().flatMap((pathFixture) =>
      ([
        { stemDirection: "up", staffSteps: [0, 1, 2] },
        { stemDirection: "down", staffSteps: [6, 7, 8] },
      ] as const).map(({ staffSteps, stemDirection }) => {
        const semanticMotif = immutableFixtureMotif(
          "E8_TRIPLET_3",
          staffSteps,
          `lab-triplet-detail-${pathFixture.id}-${stemDirection}`,
        );

        if (
          resolveBeamGroupStemDirection(semanticMotif.staffSteps) !==
          stemDirection
        ) {
          throw new RangeError(
            `Triplet detail ${pathFixture.id}/${stemDirection} resolved an unexpected stem direction`,
          );
        }

        return Object.freeze({
          label: `${pathFixture.label} · stems ${stemDirection}`,
          pathShape: pathFixture.id,
          semanticMotif,
          stemDirection,
          model: motifPathMatrixModel(
            semanticMotif,
            pathFixture.id,
            pathFixture.path,
          ),
          viewBox: TRIPLET_DETAIL_VIEW_BOX,
        });
      }),
    ),
  );
}

export function buildCurvedScoreFixtures(): readonly (LabScoreFixture & {
  readonly id: LabPathShape;
  readonly label: string;
})[] {
  return Object.freeze(
    pathShapeFixtures().map(({ id, label, path }) => ({
      id,
      label,
      model: curvedScoreModel(`lab-path-${id}`, path),
      viewBox: HORIZONTAL_VIEW_BOX,
    })),
  );
}

export const COMPOSER_LAB_SLOTS = Object.freeze([
  {
    id: "opening",
    start: 0.08,
    end: 0.18,
    density: "sparse",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "response",
    start: 0.2,
    end: 0.3,
    density: "normal",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "reserved-transition",
    start: 0.32,
    end: 0.4,
    density: "normal",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "development-a",
    start: 0.42,
    end: 0.52,
    density: "dense",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "development-b",
    start: 0.54,
    end: 0.64,
    density: "dense",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "release",
    start: 0.66,
    end: 0.76,
    density: "normal",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
  {
    id: "terminal",
    start: 0.8,
    end: 0.92,
    density: "sparse",
    role: "terminal",
    allowedMotifFamilies: ALL_RHYTHM_FAMILIES,
  },
] as const satisfies readonly ScoreCompositionSlot[]);

function responsiveNotationPath(
  start: Vec2,
  end: Vec2,
): StraightScorePath {
  return new StraightScorePath(start, end, {
    at: 0.5,
    towardIncreasingPitch: { x: 0, y: -1 },
  });
}

function cubicCurvatureRadiusAt(
  start: Vec2,
  control1: Vec2,
  control2: Vec2,
  end: Vec2,
  t: number,
): number {
  const inverse = 1 - t;
  const firstDerivative = {
    x:
      3 * inverse * inverse * (control1.x - start.x) +
      6 * inverse * t * (control2.x - control1.x) +
      3 * t * t * (end.x - control2.x),
    y:
      3 * inverse * inverse * (control1.y - start.y) +
      6 * inverse * t * (control2.y - control1.y) +
      3 * t * t * (end.y - control2.y),
  };
  const secondDerivative = {
    x:
      6 *
      (inverse * (control2.x - 2 * control1.x + start.x) +
        t * (end.x - 2 * control2.x + control1.x)),
    y:
      6 *
      (inverse * (control2.y - 2 * control1.y + start.y) +
        t * (end.y - 2 * control2.y + control1.y)),
  };
  const curvatureNumerator = Math.abs(
    crossVectors(firstDerivative, secondDerivative),
  );

  if (curvatureNumerator <= 1e-9) return Number.POSITIVE_INFINITY;

  return (
    Math.hypot(firstDerivative.x, firstDerivative.y) ** 3 /
    curvatureNumerator
  );
}

interface WeightedConnectorSegment {
  readonly path: ScorePath;
  readonly weight: number;
}

class LabResponsiveConnectorPath implements ScorePath {
  readonly minimumCurvatureRadius: number;
  readonly #segments: readonly (WeightedConnectorSegment & {
    readonly end: number;
    readonly start: number;
  })[];

  constructor(
    rightX: number,
    leftX: number,
    startY: number,
    endY: number,
    radius: number,
  ) {
    const verticalLength = (endY - startY - 4 * radius) / 2;

    if (verticalLength <= 0) {
      throw new RangeError(
        "Responsive connector requires vertical room for four quarter-turns",
      );
    }

    const handle = ((4 * (Math.SQRT2 - 1)) / 3) * radius;
    const middleY = startY + 2 * radius + verticalLength;
    const q1 = [
      { x: rightX, y: startY },
      { x: rightX + handle, y: startY },
      { x: rightX + radius, y: startY + radius - handle },
      { x: rightX + radius, y: startY + radius },
    ] as const;
    const q2 = [
      { x: rightX + radius, y: middleY - radius },
      { x: rightX + radius, y: middleY - radius + handle },
      { x: rightX + handle, y: middleY },
      { x: rightX, y: middleY },
    ] as const;
    const q3 = [
      { x: leftX, y: middleY },
      { x: leftX - handle, y: middleY },
      { x: leftX - radius, y: middleY + radius - handle },
      { x: leftX - radius, y: middleY + radius },
    ] as const;
    const q4 = [
      { x: leftX - radius, y: endY - radius },
      { x: leftX - radius, y: endY - radius + handle },
      { x: leftX - handle, y: endY },
      { x: leftX, y: endY },
    ] as const;
    const curves = [q1, q2, q3, q4] as const;
    const quarterArcWeight = (Math.PI * radius) / 2;
    const sourceSegments: readonly WeightedConnectorSegment[] = [
      {
        path: new CubicBezierScorePath(...q1, {
          at: 0,
          towardIncreasingPitch: { x: 0, y: -1 },
        }),
        weight: quarterArcWeight,
      },
      {
        path: new StraightScorePath(q1[3], q2[0], {
          at: 0.5,
          towardIncreasingPitch: { x: 1, y: 0 },
        }),
        weight: verticalLength,
      },
      {
        path: new CubicBezierScorePath(...q2, {
          at: 0,
          towardIncreasingPitch: { x: 1, y: 0 },
        }),
        weight: quarterArcWeight,
      },
      {
        path: new StraightScorePath(q2[3], q3[0], {
          at: 0.5,
          towardIncreasingPitch: { x: 0, y: 1 },
        }),
        weight: rightX - leftX,
      },
      {
        path: new CubicBezierScorePath(...q3, {
          at: 0,
          towardIncreasingPitch: { x: 0, y: 1 },
        }),
        weight: quarterArcWeight,
      },
      {
        path: new StraightScorePath(q3[3], q4[0], {
          at: 0.5,
          towardIncreasingPitch: { x: 1, y: 0 },
        }),
        weight: verticalLength,
      },
      {
        path: new CubicBezierScorePath(...q4, {
          at: 0,
          towardIncreasingPitch: { x: 1, y: 0 },
        }),
        weight: quarterArcWeight,
      },
    ];

    for (let index = 1; index < sourceSegments.length; index += 1) {
      const previous = sourceSegments[index - 1]?.path;
      const current = sourceSegments[index]?.path;

      if (!previous || !current) continue;

      const pointGap = distanceBetween(
        previous.pointAt(1),
        current.pointAt(0),
      );
      const tangentAlignment = dotVectors(
        previous.tangentAt(1),
        current.tangentAt(0),
      );
      const normalAlignment = dotVectors(
        previous.normalAt(1),
        current.normalAt(0),
      );

      if (
        pointGap > 1e-6 ||
        tangentAlignment < 1 - 1e-7 ||
        normalAlignment < 1 - 1e-7
      ) {
        throw new RangeError(
          "Responsive connector segments must preserve point, tangent, and pitch-normal continuity",
        );
      }
    }

    const totalWeight = sourceSegments.reduce(
      (total, { weight }) => total + weight,
      0,
    );
    let accumulatedWeight = 0;

    this.#segments = Object.freeze(
      sourceSegments.map((segment, index) => {
        const start = accumulatedWeight / totalWeight;
        accumulatedWeight += segment.weight;

        return Object.freeze({
          ...segment,
          start,
          end:
            index === sourceSegments.length - 1
              ? 1
              : accumulatedWeight / totalWeight,
        });
      }),
    );
    this.minimumCurvatureRadius = Math.min(
      ...curves.flatMap((curve) =>
        Array.from({ length: 2049 }, (_, index) =>
          cubicCurvatureRadiusAt(
            curve[0],
            curve[1],
            curve[2],
            curve[3],
            index / 2048,
          ),
        ),
      ),
    );

    if (this.minimumCurvatureRadius <= 2 * LAB_STAFF_SPACE) {
      throw new RangeError(
        "Responsive connector curvature must clear the outer staff-line offset",
      );
    }
  }

  #resolve(t: number) {
    const normalizedT = requireNormalizedPosition(t);
    const segment =
      this.#segments.find(({ end }) => normalizedT < end) ??
      this.#segments.at(-1);

    if (!segment) {
      throw new RangeError("Responsive connector requires segments");
    }

    return {
      path: segment.path,
      localT: Math.min(
        1,
        Math.max(0, (normalizedT - segment.start) / (segment.end - segment.start)),
      ),
    };
  }

  pointAt(t: number): Vec2 {
    const { localT, path } = this.#resolve(t);

    return path.pointAt(localT);
  }

  tangentAt(t: number): Vec2 {
    const { localT, path } = this.#resolve(t);

    return path.tangentAt(localT);
  }

  normalAt(t: number): Vec2 {
    const { localT, path } = this.#resolve(t);

    return path.normalAt(localT);
  }
}

/**
 * Four generous quarter turns plus two verticals and one returning horizontal
 * keep the continuous staff offsets outside their curvature-singularity limit.
 */
function responsiveConnectorPath(
  rightX: number,
  leftX: number,
  startY: number,
  endY: number,
  radius: number,
): LabResponsiveConnectorPath {
  return new LabResponsiveConnectorPath(
    rightX,
    leftX,
    startY,
    endY,
    radius,
  );
}

function responsiveProjectionZones(
  mode: LabComposerViewport,
): readonly ResponsiveScoreProjectionZoneInput[] {
  const slotIds = COMPOSER_LAB_SLOTS.map(({ id }) => id);

  if (mode === "horizontal-enhanced") {
    return Object.freeze([
      {
        id: "horizontal-notation",
        kind: "notation-safe",
        path: responsiveNotationPath(
          { x: 40, y: 140 },
          { x: 1240, y: 140 },
        ),
        weight: 1,
        purpose: "origin-terminal",
        contentRange: { start: 0.18, end: 0.8 },
        semanticSlotIds: slotIds,
      },
    ]);
  }

  if (mode === "vertical-compact") {
    const leftX = 100;
    const rightX = 420;

    return Object.freeze([
      {
        id: "compact-origin-notation",
        kind: "notation-safe",
        path: responsiveNotationPath(
          { x: leftX, y: 150 },
          { x: rightX, y: 150 },
        ),
        weight: 1,
        purpose: "origin",
        contentRange: { start: 0.2, end: 0.86 },
        semanticSlotIds: slotIds.slice(0, 2),
      },
      {
        id: "compact-connector-a",
        kind: "connector",
        path: responsiveConnectorPath(rightX, leftX, 150, 590, 50),
        weight: 1.35,
      },
      {
        id: "compact-body-notation",
        kind: "notation-safe",
        path: responsiveNotationPath(
          { x: leftX, y: 590 },
          { x: rightX, y: 590 },
        ),
        weight: 1,
        purpose: "body",
        contentRange: { start: 0.1, end: 0.9 },
        semanticSlotIds: slotIds.slice(2, 4),
      },
      {
        id: "compact-connector-b",
        kind: "connector",
        path: responsiveConnectorPath(rightX, leftX, 590, 1030, 50),
        weight: 1.35,
      },
      {
        id: "compact-terminal-notation",
        kind: "notation-safe",
        path: responsiveNotationPath(
          { x: leftX, y: 1030 },
          { x: rightX, y: 1030 },
        ),
        weight: 1,
        purpose: "terminal",
        contentRange: { start: 0.08, end: 0.7 },
        semanticSlotIds: slotIds.slice(4),
      },
    ]);
  }

  const leftX = 130;
  const rightX = 630;
  const originY = 160;
  const terminalY = 720;
  const prefix = mode === "static" ? "static" : "wide";

  return Object.freeze([
    {
      id: `${prefix}-origin-notation`,
      kind: "notation-safe",
      path: responsiveNotationPath(
        { x: leftX, y: originY },
        { x: rightX, y: originY },
      ),
      weight: 1,
      purpose: "origin",
      contentRange: { start: 0.2, end: 0.88 },
      semanticSlotIds: slotIds.slice(0, 4),
    },
    {
      id: `${prefix}-connector`,
      kind: "connector",
      path: responsiveConnectorPath(
        rightX,
        leftX,
        originY,
        terminalY,
        70,
      ),
      weight: 1.25,
    },
    {
      id: `${prefix}-terminal-notation`,
      kind: "notation-safe",
      path: responsiveNotationPath(
        { x: leftX, y: terminalY },
        { x: rightX, y: terminalY },
      ),
      weight: 1,
      purpose: "terminal",
      contentRange: { start: 0.08, end: 0.72 },
      semanticSlotIds: slotIds.slice(4),
    },
  ]);
}

export function buildLabResponsiveProjection(
  mode: LabComposerViewport,
  configuration: LabResponsiveStructuralConfiguration = {},
): ResponsiveScoreProjection {
  const zones = responsiveProjectionZones(mode);
  const firstNotationZone = zones.find(
    ({ kind }) => kind === "notation-safe",
  );
  const terminalNotationZone = zones.findLast(
    ({ kind }) => kind === "notation-safe",
  );

  if (!firstNotationZone || !terminalNotationZone) {
    throw new RangeError("Responsive lab projection requires notation zones");
  }

  return buildResponsiveScoreProjection({
    mode,
    maxNotationTangentAngleDeg:
      APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG,
    semanticSlotIds: COMPOSER_LAB_SLOTS.map(({ id }) => id),
    zones,
    trebleClef: { zoneId: firstNotationZone.id, localT: 0.04 },
    finalBarline: {
      zoneId: terminalNotationZone.id,
      localT: 0.94,
    },
    ...(configuration.keySignatureFifths === undefined
      ? {}
      : {
          keySignature: {
            fifths: configuration.keySignatureFifths,
            zoneId: firstNotationZone.id,
            localT: 0.12,
          },
        }),
    ...(configuration.includeOrdinaryBarline
      ? {
          ordinaryBarlines: [
            {
              id: "responsive-ordinary",
              zoneId: terminalNotationZone.id,
              localT: 0.84,
            },
          ],
        }
      : {}),
  });
}

export function composeLabSegment(
  profile: ComposerProfile,
  sessionSeed: string,
  chapterId: string,
): ComposedSegment {
  return composeSegment({
    sessionSeed,
    branchId: "visual-lab-branch",
    chapterId,
    profile,
    slots: COMPOSER_LAB_SLOTS,
    reservedZones: [
      { start: 0.31, end: 0.41, reason: "transition" },
    ],
  });
}

function slotForMotif(slotId: string): ScoreCompositionSlot {
  const slot = COMPOSER_LAB_SLOTS.find((candidate) => candidate.id === slotId);

  if (!slot) throw new RangeError(`Unknown lab slot: ${slotId}`);

  return slot;
}

export function renderLabSegment(
  segment: ComposedSegment,
  viewport: LabComposerViewport,
  structuralConfiguration: LabResponsiveStructuralConfiguration = {},
): ComposerLabFixture {
  const projection = buildLabResponsiveProjection(
    viewport,
    structuralConfiguration,
  );
  const path = projection.path;
  const placements: ScoreMotifPlacement[] = segment.motifs.map((motif) => {
    slotForMotif(motif.slotId);
    const noteTs = projectSemanticSlotNoteTs(
      projection,
      motif.slotId,
      motif.durations.length,
    );
    const definition = getMotifDefinition(motif.motifId);
    const layout = definition.primaryBeam
      ? layoutBeamedMotif(path, motif, noteTs)
      : {};

    return { motif, noteTs, ...layout };
  });

  return {
    projection,
    segment,
    model: buildScoreModel({
      id: `lab-composer-${segment.profile}-${viewport}`,
      path,
      staffSpace: LAB_STAFF_SPACE,
      // Piecewise responsive connectors need enough samples for their cubic
      // quarter turns to remain optically smooth at evidence scale. This is a
      // lab projection density, not a canonical engraving token.
      staffSampleCount: Math.max(129, projection.zones.length * 129),
      calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
      tokens: APPROVED_RENDERER_TOKENS,
      clef: { t: projection.trebleClef.t },
      ...(projection.keySignature
        ? {
            keySignature: {
              fifths: projection.keySignature.fifths,
              t: projection.keySignature.t,
            },
          }
        : {}),
      motifs: placements,
      barlines: projection.ordinaryBarlines.map(({ id, t }) => ({ id, t })),
      finalBarline: { id: "terminal", t: projection.finalBarline.t },
    }),
    viewBox: RESPONSIVE_VIEW_BOXES[viewport],
  };
}

function responsiveReviewSegment(): ComposedSegment {
  return Object.freeze({
    composerVersion: COMPOSER_VERSION,
    pitchContourTableVersion: PITCH_CONTOUR_TABLE_VERSION,
    branchId: "visual-lab-responsive-review-branch",
    chapterId: "visual-lab-responsive-review-chapter",
    seed: "manual-responsive-review-v1",
    profile: "BALANCED",
    motifs: Object.freeze([
      immutableFixtureMotif("Q1", [0], "opening"),
      immutableFixtureMotif("H1", [4], "response"),
      immutableFixtureMotif("E8_E8", [1, 2], "development-a"),
      immutableFixtureMotif(
        "E8_TRIPLET_3",
        [0, 1, 2],
        "development-b",
      ),
      immutableFixtureMotif("Q2", [4, 2], "release"),
      immutableFixtureMotif("H1", [4], "terminal"),
    ]),
    emptySlots: Object.freeze([
      Object.freeze({
        slotId: "reserved-transition",
        reason: "reserved-zone",
        reservedReason: "transition",
      }),
    ]),
  });
}

function responsiveReviewEvidence(
  fixture: ComposerLabFixture,
): ResponsiveProjectionReviewFixture["evidence"] {
  const clef = fixture.model.primitives.find(
    (primitive) => primitive.kind === "glyph" && primitive.role === "clef",
  );
  const finalBarlines = fixture.model.primitives.filter(
    (primitive) =>
      primitive.kind === "line" &&
      (primitive.role === "final-barline-thin" ||
        primitive.role === "final-barline-thick"),
  );
  const keySignatureGlyphs = fixture.model.primitives.filter(
    (primitive) =>
      primitive.kind === "glyph" && primitive.role === "key-signature",
  );
  const ordinaryBarlines = fixture.model.primitives.filter(
    (primitive) => primitive.kind === "line" && primitive.role === "barline",
  );

  if (!clef || clef.kind !== "glyph") {
    throw new RangeError("Responsive review fixture requires a treble clef");
  }

  if (
    clef.mirrorX ||
    clef.mirrorY ||
    Math.abs(clef.rotationRadians) > 1e-9
  ) {
    throw new RangeError(
      "Responsive review treble clef must remain upright and unmirrored",
    );
  }

  if (
    finalBarlines.length !== 2 ||
    finalBarlines[0]?.role !== "final-barline-thin" ||
    finalBarlines[1]?.role !== "final-barline-thick" ||
    finalBarlines.some(
      (line) => line.kind !== "line" || Math.abs(line.start.x - line.end.x) > 1e-9,
    )
  ) {
    throw new RangeError(
      "Responsive review final barline must be vertical thin-gap-thick",
    );
  }

  const zones = fixture.projection.zones.map((zone) => {
    const semanticSlotIds =
      zone.kind === "notation-safe" ? zone.semanticSlotIds : [];
    const slotSet = new Set(semanticSlotIds);
    const eventCount = fixture.segment.motifs
      .filter(({ slotId }) => slotSet.has(slotId))
      .reduce((count, motif) => count + motif.notes.length, 0);

    return Object.freeze({
      id: zone.id,
      kind: zone.kind,
      eventCount,
      displayTangentAngleDeg:
        zone.kind === "notation-safe"
          ? zone.maximumTangentAngleDeg
          : Math.max(
              ...Array.from({ length: 65 }, (_, index) => {
                const tangent = zone.path.tangentAt(index / 64);

                return Math.abs(
                  (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI,
                );
              }),
            ),
      minimumCurvatureRadiusSp:
        zone.path instanceof LabResponsiveConnectorPath
          ? zone.path.minimumCurvatureRadius / LAB_STAFF_SPACE
          : null,
      notationAngleLimitApplies: zone.kind === "notation-safe",
      semanticSlotIds: Object.freeze([...semanticSlotIds]),
      tangentMeasurement:
        zone.kind === "notation-safe"
          ? "analytic-constant"
          : "display-sampled",
    });
  });

  return Object.freeze({
    clef: Object.freeze({
      mirrorX: clef.mirrorX,
      mirrorY: clef.mirrorY,
      rotationRadians: clef.rotationRadians,
    }),
    finalBarlineOrientation: "thin-gap-thick-vertical",
    keySignature: Object.freeze({
      fifths: fixture.projection.keySignature?.fifths ?? 0,
      renderedAccidentalGlyphs: keySignatureGlyphs.length,
    }),
    musicalEventCount: fixture.segment.motifs.reduce(
      (count, motif) => count + motif.notes.length,
      0,
    ),
    ordinaryBarlineCount: ordinaryBarlines.length,
    semanticSlotIds: fixture.projection.semanticSlotIds,
    zones: Object.freeze(zones),
  });
}

/**
 * One authored semantic review segment is remapped onto all four responsive
 * modes; quarter/half, beam, triplet, reserved slot, clef, and final barline
 * semantics are identical while only ScorePath geometry/grouping changes.
 */
export function buildResponsiveProjectionReviewFixtures(): readonly ResponsiveProjectionReviewFixture[] {
  const segment = responsiveReviewSegment();

  return Object.freeze(
    RESPONSIVE_SCORE_PRESENTATION_MODES.map((mode) => {
      const fixture = renderLabSegment(segment, mode, {
        includeOrdinaryBarline: true,
        keySignatureFifths: 2,
      });

      return Object.freeze({
        ...fixture,
        evidence: responsiveReviewEvidence(fixture),
      });
    }),
  );
}

/** Exposes the exact Gate-B-approved down-flag transform for fixture evidence. */
export { APPROVED_DOWN_FLAG_TRANSFORM };

/** Keeps the five visible staff lines available for focused fixture assertions. */
export function sampleLabStaff(path: ScorePath) {
  return sampleStaffLines(path, LAB_STAFF_SPACE, 17);
}
