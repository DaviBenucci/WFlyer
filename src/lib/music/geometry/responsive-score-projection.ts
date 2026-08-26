import { frameAt } from "./score-path";
import { StraightScorePath } from "./straight-score-path";
import type { Fifths, ScorePath, Vec2 } from "./types";
import {
  requireFiniteNumber,
  requireInteger,
  requireNormalizedPosition,
  requirePositiveNumber,
} from "./units";
import { distanceBetween, dotVectors } from "./vectors";

export const RESPONSIVE_SCORE_PRESENTATION_MODES = Object.freeze([
  "horizontal-enhanced",
  "vertical-wide",
  "vertical-compact",
  "static",
] as const);

export type ResponsiveScorePresentationMode =
  (typeof RESPONSIVE_SCORE_PRESENTATION_MODES)[number];

/** Canonical Gate-C notation-safe tangent limit approved on 2026-08-24. */
export const APPROVED_MAX_NOTATION_TANGENT_ANGLE_DEG = 18;

export type ResponsiveScoreZonePurpose =
  | "body"
  | "origin"
  | "origin-terminal"
  | "terminal";

export interface ResponsiveScoreLocalRange {
  readonly start: number;
  readonly end: number;
}

interface ResponsiveScoreZoneInputBase {
  readonly id: string;
  readonly path: ScorePath;
  /** Relative share of the composite path's normalized parameter range. */
  readonly weight: number;
}

export interface ResponsiveScoreNotationZoneInput
  extends ResponsiveScoreZoneInputBase {
  readonly kind: "notation-safe";
  /** v0.1 uses analytically constant-tangent spans for notation zones. */
  readonly path: StraightScorePath;
  /** Slots remain in semantic order; layout only assigns physical ranges. */
  readonly semanticSlotIds: readonly string[];
  readonly contentRange: ResponsiveScoreLocalRange;
  readonly purpose: ResponsiveScoreZonePurpose;
}

export interface ResponsiveScoreConnectorZoneInput
  extends ResponsiveScoreZoneInputBase {
  readonly kind: "connector";
  readonly semanticSlotIds?: never;
  readonly contentRange?: never;
  readonly purpose?: never;
}

export type ResponsiveScoreProjectionZoneInput =
  | ResponsiveScoreConnectorZoneInput
  | ResponsiveScoreNotationZoneInput;

interface ResponsiveScoreProjectionZoneBase
  extends ResponsiveScoreZoneInputBase {
  readonly globalRange: ResponsiveScoreLocalRange;
}

export interface ResponsiveScoreNotationZone
  extends ResponsiveScoreProjectionZoneBase {
  readonly kind: "notation-safe";
  readonly path: StraightScorePath;
  readonly semanticSlotIds: readonly string[];
  readonly contentRange: ResponsiveScoreLocalRange;
  readonly purpose: ResponsiveScoreZonePurpose;
  readonly maximumTangentAngleDeg: number;
}

export interface ResponsiveScoreConnectorZone
  extends ResponsiveScoreProjectionZoneBase {
  readonly kind: "connector";
  readonly semanticSlotIds?: never;
  readonly contentRange?: never;
  readonly purpose?: never;
}

export type ResponsiveScoreProjectionZone =
  | ResponsiveScoreConnectorZone
  | ResponsiveScoreNotationZone;

export interface ResponsiveScoreStructuralPlacementInput {
  readonly localT: number;
  readonly zoneId: string;
}

export interface ResponsiveScoreStructuralPlacement
  extends ResponsiveScoreStructuralPlacementInput {
  readonly t: number;
}

export interface ResponsiveScoreKeySignaturePlacementInput
  extends ResponsiveScoreStructuralPlacementInput {
  readonly fifths: Fifths;
}

export interface ResponsiveScoreKeySignaturePlacement
  extends ResponsiveScoreStructuralPlacement {
  readonly fifths: Fifths;
}

export interface ResponsiveScoreOrdinaryBarlinePlacementInput
  extends ResponsiveScoreStructuralPlacementInput {
  readonly id: string;
}

export interface ResponsiveScoreOrdinaryBarlinePlacement
  extends ResponsiveScoreStructuralPlacement {
  readonly id: string;
}

export interface ResponsiveScoreProjectedSlot {
  readonly localRange: ResponsiveScoreLocalRange;
  readonly range: ResponsiveScoreLocalRange;
  readonly slotId: string;
  readonly zoneId: string;
}

export interface ResponsiveScoreProjection {
  readonly finalBarline: ResponsiveScoreStructuralPlacement;
  readonly keySignature?: ResponsiveScoreKeySignaturePlacement;
  readonly maxNotationTangentAngleDeg: number;
  readonly mode: ResponsiveScorePresentationMode;
  readonly ordinaryBarlines: readonly ResponsiveScoreOrdinaryBarlinePlacement[];
  readonly path: ScorePath;
  readonly semanticSlotIds: readonly string[];
  readonly slots: readonly ResponsiveScoreProjectedSlot[];
  readonly trebleClef: ResponsiveScoreStructuralPlacement;
  readonly zones: readonly ResponsiveScoreProjectionZone[];
}

export interface BuildResponsiveScoreProjectionInput {
  readonly finalBarline: ResponsiveScoreStructuralPlacementInput;
  readonly keySignature?: ResponsiveScoreKeySignaturePlacementInput;
  readonly maxNotationTangentAngleDeg: number;
  readonly mode: ResponsiveScorePresentationMode;
  readonly ordinaryBarlines?: readonly ResponsiveScoreOrdinaryBarlinePlacementInput[];
  readonly semanticSlotIds: readonly string[];
  readonly trebleClef: ResponsiveScoreStructuralPlacementInput;
  readonly zones: readonly ResponsiveScoreProjectionZoneInput[];
}

export type ResponsivePointerCapability = "coarse" | "fine" | "none";
export type ResponsiveScoreEffectiveLayoutCapacity = Exclude<
  ResponsiveScorePresentationMode,
  "static"
>;

/**
 * The capacity classification is intentionally supplied by Motion Lab. Gate C
 * defines no numeric width/height breakpoint and therefore cannot select a
 * mode from viewport width alone.
 */
export interface ResponsiveScoreModeSelectionContext {
  readonly pointerCapability: ResponsivePointerCapability;
  readonly prefersReducedMotion: boolean;
  readonly viewportHeight: number;
  readonly viewportWidth: number;
}

/**
 * Motion Lab owns the eventual effective-capacity thresholds. Requiring this
 * classifier keeps width, height, and input capability visible at the policy
 * boundary without embedding a Gate-C breakpoint in the geometry core.
 */
export type ResponsiveScoreCapacityClassifier = (
  context: ResponsiveScoreModeSelectionContext,
) => ResponsiveScoreEffectiveLayoutCapacity;

const PROJECTION_CONTINUITY_EPSILON = 1e-6;
const FRAME_ALIGNMENT_EPSILON = 1e-7;
const NOTATION_ANGLE_EPSILON_DEG = 1e-7;

function requireIdentifier(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new RangeError(`${label} must be a non-empty string`);
  }

  return value;
}

function requireLocalRange(
  range: ResponsiveScoreLocalRange,
  label: string,
): ResponsiveScoreLocalRange {
  const start = requireNormalizedPosition(range.start);
  const end = requireNormalizedPosition(range.end);

  if (start >= end) {
    throw new RangeError(`${label}.start must be before ${label}.end`);
  }

  return Object.freeze({ start, end });
}

function toGlobalT(
  zoneRange: ResponsiveScoreLocalRange,
  localT: number,
): number {
  const normalizedLocalT = requireNormalizedPosition(localT);

  return (
    zoneRange.start +
    (zoneRange.end - zoneRange.start) * normalizedLocalT
  );
}

function tangentAngleDeg(path: ScorePath, t: number): number {
  const tangent = frameAt(path, t).tangent;

  return (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
}

function requireNotationSafeTangent(
  path: ScorePath,
  t: number,
  maxNotationTangentAngleDeg: number,
  label: string,
): number {
  const normalizedT = requireNormalizedPosition(t);
  const frame = frameAt(path, normalizedT);
  const absoluteAngleDeg = Math.abs(tangentAngleDeg(path, normalizedT));

  if (frame.tangent.x <= 0) {
    throw new RangeError(`${label} must read left-to-right`);
  }

  if (
    absoluteAngleDeg >
    maxNotationTangentAngleDeg + NOTATION_ANGLE_EPSILON_DEG
  ) {
    throw new RangeError(`${label} exceeds maxNotationTangentAngleDeg`);
  }

  return absoluteAngleDeg;
}

function validateNotationZone(
  zone: ResponsiveScoreNotationZoneInput,
  maxNotationTangentAngleDeg: number,
): number {
  if (!(zone.path instanceof StraightScorePath)) {
    throw new RangeError(
      `Notation-safe zone ${zone.id} must use an analytically constant-tangent StraightScorePath in v0.1`,
    );
  }

  return requireNotationSafeTangent(
    zone.path,
    0.5,
    maxNotationTangentAngleDeg,
    `Notation-safe zone ${zone.id}`,
  );
}

function validateZoneContinuity(
  zones: readonly ResponsiveScoreProjectionZoneInput[],
): void {
  for (let index = 1; index < zones.length; index += 1) {
    const previous = zones[index - 1];
    const current = zones[index];

    if (!previous || !current) continue;

    if (
      distanceBetween(previous.path.pointAt(1), current.path.pointAt(0)) >
      PROJECTION_CONTINUITY_EPSILON
    ) {
      throw new RangeError(
        `Responsive score zones ${previous.id} and ${current.id} must share an endpoint`,
      );
    }

    if (
      dotVectors(previous.path.tangentAt(1), current.path.tangentAt(0)) <
      1 - FRAME_ALIGNMENT_EPSILON
    ) {
      throw new RangeError(
        `Responsive score zones ${previous.id} and ${current.id} must preserve tangent continuity`,
      );
    }

    if (
      dotVectors(previous.path.normalAt(1), current.path.normalAt(0)) <
      1 - FRAME_ALIGNMENT_EPSILON
    ) {
      throw new RangeError(
        `Responsive score zones ${previous.id} and ${current.id} must preserve pitch-normal continuity`,
      );
    }
  }
}

function requireSemanticSlotIds(
  semanticSlotIds: readonly string[],
): readonly string[] {
  const copied = semanticSlotIds.map((slotId, index) =>
    requireIdentifier(slotId, `semanticSlotIds[${index}]`),
  );

  if (new Set(copied).size !== copied.length) {
    throw new RangeError("Responsive semantic slot IDs must be unique");
  }

  return Object.freeze(copied);
}

class ZonedResponsiveScorePath implements ScorePath {
  readonly #zones: readonly ResponsiveScoreProjectionZone[];

  constructor(zones: readonly ResponsiveScoreProjectionZone[]) {
    this.#zones = zones;
  }

  #resolve(t: number): {
    readonly localT: number;
    readonly zone: ResponsiveScoreProjectionZone;
  } {
    const normalizedT = requireNormalizedPosition(t);
    const zone =
      this.#zones.find(
        ({ globalRange }) => normalizedT < globalRange.end,
      ) ?? this.#zones.at(-1);

    if (!zone) {
      throw new RangeError("Responsive score path requires at least one zone");
    }

    const span = zone.globalRange.end - zone.globalRange.start;
    const localT = Math.min(
      1,
      Math.max(0, (normalizedT - zone.globalRange.start) / span),
    );

    return { localT, zone };
  }

  pointAt(t: number): Vec2 {
    const { localT, zone } = this.#resolve(t);

    return zone.path.pointAt(localT);
  }

  tangentAt(t: number): Vec2 {
    const { localT, zone } = this.#resolve(t);

    return zone.path.tangentAt(localT);
  }

  normalAt(t: number): Vec2 {
    const { localT, zone } = this.#resolve(t);

    return zone.path.normalAt(localT);
  }
}

function requireMode(
  mode: ResponsiveScorePresentationMode,
): ResponsiveScorePresentationMode {
  if (!RESPONSIVE_SCORE_PRESENTATION_MODES.includes(mode)) {
    throw new RangeError(`Unsupported responsive score mode: ${mode}`);
  }

  return mode;
}

function resolveStructuralPlacement(
  placement: ResponsiveScoreStructuralPlacementInput,
  expectedPurpose: "origin" | "terminal",
  zones: readonly ResponsiveScoreProjectionZone[],
  maxNotationTangentAngleDeg: number,
): ResponsiveScoreStructuralPlacement {
  const zone = zones.find(({ id }) => id === placement.zoneId);

  if (!zone || zone.kind !== "notation-safe") {
    throw new RangeError(
      `${expectedPurpose} placement must reference a notation-safe zone`,
    );
  }

  const allowedPurpose =
    zone.purpose === expectedPurpose || zone.purpose === "origin-terminal";

  if (!allowedPurpose) {
    throw new RangeError(
      `${expectedPurpose} placement must reference a ${expectedPurpose} zone`,
    );
  }

  const localT = requireNormalizedPosition(placement.localT);
  requireNotationSafeTangent(
    zone.path,
    localT,
    maxNotationTangentAngleDeg,
    `${expectedPurpose} placement`,
  );

  if (
    expectedPurpose === "origin" &&
    localT >= zone.contentRange.start
  ) {
    throw new RangeError(
      "Treble clef must precede the origin notation content range",
    );
  }

  if (
    expectedPurpose === "terminal" &&
    localT <= zone.contentRange.end
  ) {
    throw new RangeError(
      "Final barline must follow the terminal notation content range",
    );
  }

  return Object.freeze({
    zoneId: zone.id,
    localT,
    t: toGlobalT(zone.globalRange, localT),
  });
}

function resolveNotationStructuralPlacement(
  placement: ResponsiveScoreStructuralPlacementInput,
  label: string,
  zones: readonly ResponsiveScoreProjectionZone[],
  maxNotationTangentAngleDeg: number,
): ResponsiveScoreStructuralPlacement {
  const zone = zones.find(({ id }) => id === placement.zoneId);

  if (!zone || zone.kind !== "notation-safe") {
    throw new RangeError(`${label} must reference a notation-safe zone`);
  }

  const localT = requireNormalizedPosition(placement.localT);
  requireNotationSafeTangent(
    zone.path,
    localT,
    maxNotationTangentAngleDeg,
    label,
  );

  return Object.freeze({
    zoneId: zone.id,
    localT,
    t: toGlobalT(zone.globalRange, localT),
  });
}

export function buildResponsiveScoreProjection(
  input: BuildResponsiveScoreProjectionInput,
): ResponsiveScoreProjection {
  const mode = requireMode(input.mode);
  const maxNotationTangentAngleDeg = requirePositiveNumber(
    input.maxNotationTangentAngleDeg,
    "maxNotationTangentAngleDeg",
  );

  if (maxNotationTangentAngleDeg >= 90) {
    throw new RangeError(
      "maxNotationTangentAngleDeg must be less than 90 degrees",
    );
  }

  if (input.zones.length === 0) {
    throw new RangeError("Responsive score projection requires zones");
  }

  const semanticSlotIds = requireSemanticSlotIds(input.semanticSlotIds);
  const zoneIds = input.zones.map(({ id }, index) =>
    requireIdentifier(id, `zones[${index}].id`),
  );

  if (new Set(zoneIds).size !== zoneIds.length) {
    throw new RangeError("Responsive score zone IDs must be unique");
  }

  validateZoneContinuity(input.zones);
  const totalWeight = input.zones.reduce(
    (total, zone, index) =>
      total + requirePositiveNumber(zone.weight, `zones[${index}].weight`),
    0,
  );
  let accumulatedWeight = 0;
  const zones: readonly ResponsiveScoreProjectionZone[] = Object.freeze(
    input.zones.map((zone, index) => {
      const start = accumulatedWeight / totalWeight;
      accumulatedWeight += zone.weight;
      const end =
        index === input.zones.length - 1
          ? 1
          : accumulatedWeight / totalWeight;
      const common = {
        id: zone.id,
        path: zone.path,
        weight: zone.weight,
        globalRange: Object.freeze({ start, end }),
      } as const;

      if (zone.kind === "connector") {
        return Object.freeze({ ...common, kind: zone.kind });
      }

      const contentRange = requireLocalRange(
        zone.contentRange,
        `zones[${index}].contentRange`,
      );
      const semanticIds = requireSemanticSlotIds(zone.semanticSlotIds);

      return Object.freeze({
        ...common,
        kind: zone.kind,
        path: zone.path,
        purpose: zone.purpose,
        contentRange,
        semanticSlotIds: semanticIds,
        maximumTangentAngleDeg: validateNotationZone(
          zone,
          maxNotationTangentAngleDeg,
        ),
      });
    }),
  );
  const projectedSemanticOrder = zones.flatMap((zone) =>
    zone.kind === "notation-safe" ? zone.semanticSlotIds : [],
  );

  if (
    projectedSemanticOrder.length !== semanticSlotIds.length ||
    projectedSemanticOrder.some(
      (slotId, index) => slotId !== semanticSlotIds[index],
    )
  ) {
    throw new RangeError(
      "Responsive projection must preserve every semantic slot exactly once and in order",
    );
  }

  const slots: readonly ResponsiveScoreProjectedSlot[] = Object.freeze(
    zones.flatMap((zone) => {
      if (zone.kind === "connector") return [];

      const count = zone.semanticSlotIds.length;

      return zone.semanticSlotIds.map((slotId, index) => {
        const span = zone.contentRange.end - zone.contentRange.start;
        const localStart = zone.contentRange.start + (span * index) / count;
        const localEnd =
          zone.contentRange.start + (span * (index + 1)) / count;

        return Object.freeze({
          slotId,
          zoneId: zone.id,
          localRange: Object.freeze({
            start: localStart,
            end: localEnd,
          }),
          range: Object.freeze({
            start: toGlobalT(zone.globalRange, localStart),
            end: toGlobalT(zone.globalRange, localEnd),
          }),
        });
      });
    }),
  );
  const trebleClef = resolveStructuralPlacement(
    input.trebleClef,
    "origin",
    zones,
    maxNotationTangentAngleDeg,
  );
  const finalBarline = resolveStructuralPlacement(
    input.finalBarline,
    "terminal",
    zones,
    maxNotationTangentAngleDeg,
  );
  const keySignatureBase = input.keySignature
    ? resolveStructuralPlacement(
        input.keySignature,
        "origin",
        zones,
        maxNotationTangentAngleDeg,
      )
    : undefined;
  const keySignature = keySignatureBase
    ? Object.freeze({
        ...keySignatureBase,
        fifths: input.keySignature?.fifths ?? 0,
      })
    : undefined;

  if (keySignature) {
    requireInteger(keySignature.fifths, "keySignature.fifths");

    if (keySignature.fifths < -7 || keySignature.fifths > 7) {
      throw new RangeError("keySignature.fifths must be between -7 and 7");
    }

    if (keySignature.t <= trebleClef.t) {
      throw new RangeError("Key signature must follow the treble clef");
    }

    const firstSlotStart = slots[0]?.range.start;

    if (firstSlotStart !== undefined && keySignature.t >= firstSlotStart) {
      throw new RangeError("Key signature must precede the first semantic slot");
    }
  }

  const ordinaryBarlineIds = (input.ordinaryBarlines ?? []).map(
    ({ id }, index) => requireIdentifier(id, `ordinaryBarlines[${index}].id`),
  );

  if (new Set(ordinaryBarlineIds).size !== ordinaryBarlineIds.length) {
    throw new RangeError("Responsive ordinary barline IDs must be unique");
  }

  const ordinaryBarlines = Object.freeze(
    (input.ordinaryBarlines ?? []).map((barline, index) =>
      Object.freeze({
        ...resolveNotationStructuralPlacement(
          barline,
          `ordinaryBarlines[${index}]`,
          zones,
          maxNotationTangentAngleDeg,
        ),
        id: barline.id,
      }),
    ),
  );

  return Object.freeze({
    finalBarline,
    maxNotationTangentAngleDeg,
    mode,
    ordinaryBarlines,
    path: new ZonedResponsiveScorePath(zones),
    semanticSlotIds,
    slots,
    trebleClef,
    zones,
    ...(keySignature ? { keySignature } : {}),
  });
}

export function projectSemanticSlotNoteTs(
  projection: ResponsiveScoreProjection,
  slotId: string,
  noteCount: number,
  paddingRatio = 0.12,
): readonly number[] {
  requireInteger(noteCount, "noteCount");
  const padding = requireFiniteNumber(paddingRatio, "paddingRatio");

  if (noteCount < 1) {
    throw new RangeError("noteCount must be at least one");
  }

  if (padding < 0 || padding >= 0.5) {
    throw new RangeError("paddingRatio must be between zero and 0.5");
  }

  const slot = projection.slots.find(
    (candidate) => candidate.slotId === slotId,
  );

  if (!slot) {
    throw new RangeError(`Unknown responsive semantic slot: ${slotId}`);
  }

  const span = slot.range.end - slot.range.start;
  const start = slot.range.start + span * padding;
  const end = slot.range.end - span * padding;

  if (noteCount === 1) {
    const onlyT = (start + end) / 2;
    validateResponsiveScoreEventPlacement(
      projection,
      onlyT,
      `semantic slot ${slotId}`,
    );

    return Object.freeze([onlyT]);
  }

  const noteTs = Object.freeze(
    Array.from(
      { length: noteCount },
      (_, index) => start + ((end - start) * index) / (noteCount - 1),
    ),
  );

  for (const t of noteTs) {
    validateResponsiveScoreEventPlacement(
      projection,
      t,
      `semantic slot ${slotId}`,
    );
  }

  return noteTs;
}

export function zoneForResponsiveScoreT(
  projection: ResponsiveScoreProjection,
  t: number,
): ResponsiveScoreProjectionZone {
  const normalizedT = requireNormalizedPosition(t);
  const zone =
    projection.zones.find(
      ({ globalRange }) => normalizedT < globalRange.end,
    ) ?? projection.zones.at(-1);

  if (!zone) {
    throw new RangeError("Responsive score projection requires zones");
  }

  return zone;
}

/** Exact guard used by notes and any caller-authored structural event. */
export function validateResponsiveScoreEventPlacement(
  projection: ResponsiveScoreProjection,
  t: number,
  label = "musical event",
): ResponsiveScoreNotationZone {
  const zone = zoneForResponsiveScoreT(projection, t);

  if (zone.kind !== "notation-safe") {
    throw new RangeError(`${label} cannot occupy connector zone ${zone.id}`);
  }

  requireNotationSafeTangent(
    projection.path,
    t,
    projection.maxNotationTangentAngleDeg,
    label,
  );

  return zone;
}

export function selectResponsiveScorePresentationMode(
  context: ResponsiveScoreModeSelectionContext,
  classifyEffectiveCapacity: ResponsiveScoreCapacityClassifier,
): ResponsiveScorePresentationMode {
  requirePositiveNumber(context.viewportWidth, "viewportWidth");
  requirePositiveNumber(context.viewportHeight, "viewportHeight");

  if (context.prefersReducedMotion) return "static";

  const capacityCandidate: unknown = classifyEffectiveCapacity(context);

  if (
    capacityCandidate !== "horizontal-enhanced" &&
    capacityCandidate !== "vertical-wide" &&
    capacityCandidate !== "vertical-compact"
  ) {
    throw new RangeError(
      "Capacity classifier must return a non-static responsive score mode",
    );
  }
  const effectiveLayoutCapacity = capacityCandidate;

  if (effectiveLayoutCapacity === "horizontal-enhanced") {
    return context.pointerCapability === "fine"
      ? "horizontal-enhanced"
      : "vertical-wide";
  }

  return effectiveLayoutCapacity;
}
