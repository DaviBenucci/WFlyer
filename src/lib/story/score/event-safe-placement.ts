import type { ComposedMotif, ComposedSegment } from "@/lib/music/composer/types";
import type { ScorePath, Vec2 } from "@/lib/music/geometry/types";
import { buildMotifModel } from "@/lib/music/renderer/build-motif-model";
import {
  APPROVED_RENDERER_GLYPH_CALIBRATIONS,
  APPROVED_RENDERER_TOKENS,
} from "@/lib/music/renderer/approved-runtime";
import type {
  ScoreMotifPlacement,
  ScoreRenderPrimitive,
} from "@/lib/music/renderer/types";
import type { ScorePathReviewZone } from "./organic-flowing";

/** Stage-1 spatial calibration only; these values are not motion metadata. */
export const EVENT_SAFE_GEOMETRY = Object.freeze({
  marginSp: 1.5,
  maximumTangentAngleDeg: 18,
  maximumTangentVariationDeg: 6,
  minimumNoteSpacingSp: 2,
  preferredMaximumNoteSpacingSp: 14,
});

const EPSILON = 1e-7;

export interface EventSafeShelf {
  readonly zoneId: string;
  readonly classification: "EVENT_SAFE_STRAIGHT" | "EVENT_FREE_CURVED";
  readonly startT: number;
  readonly endT: number;
  readonly startDistance: number;
  readonly endDistance: number;
  readonly length: number;
  readonly maximumTangentAngleDeg: number;
  readonly tangentVariationDeg: number;
  readonly startPoint: Vec2;
  readonly endPoint: Vec2;
}

export interface EventGroupSafety {
  readonly slotId: string;
  readonly originalZoneId: string;
  readonly zoneId: string;
  readonly relocated: boolean;
  readonly shelfIndex: number;
  readonly eventCount: number;
  readonly footprintStartT: number;
  readonly footprintEndT: number;
  readonly marginStartT: number;
  readonly marginEndT: number;
  readonly maximumTangentAngleDeg: number;
  readonly tangentVariationDeg: number;
  readonly clearanceBefore: number;
  readonly clearanceAfter: number;
  readonly footprintWidth: number;
  readonly footprintBounds: { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number };
}

export interface EventSafePlacementDiagnostics {
  readonly staffSpace: number;
  readonly shelves: readonly EventSafeShelf[];
  readonly groups: readonly EventGroupSafety[];
  readonly eventCount: number;
  readonly forbiddenEventCount: number;
  readonly candidateCount: number;
  readonly maximumTangentAngleDeg: number;
  readonly maximumTangentVariationDeg: number;
  readonly relocations: readonly EventRelocationDiagnostic[];
}

export interface EventRelocationDiagnostic {
  readonly branch: string;
  readonly chapter: string | null;
  readonly sourceShelf: string;
  readonly slotId: string;
  readonly motifId: string;
  readonly semanticIndex: number;
  readonly reason: "SOURCE_HAS_NO_COMPLETE_FOOTPRINT_INTERVAL" | "SOURCE_CAPACITY_REQUIRED_BY_SEMANTIC_ORDER";
  readonly sourceSafeIntervals: readonly EventSafeShelf[];
  readonly destinationShelf: string;
  readonly destinationChapter: string | null;
  readonly availableSafeInterval: EventSafeShelf;
  readonly footprintRequirement: number;
  readonly safetyMarginEachSide: number;
  readonly maximumTangentAngleDeg: number;
  readonly tangentVariationDeg: number;
  readonly semanticOrderPreserved: boolean;
}

export class EventSafePlacementError extends RangeError {
  readonly diagnostic: Readonly<{
    reason: "INVALID_INPUT" | "INSUFFICIENT_EVENT_SAFE_CAPACITY";
    zoneId: string;
    slotIds: readonly string[];
    safeLength: number;
    staffSpace: number;
  }>;

  constructor(diagnostic: EventSafePlacementError["diagnostic"]) {
    super(`Stage-1 event placement failed: ${JSON.stringify(diagnostic)}`);
    this.name = "EventSafePlacementError";
    this.diagnostic = Object.freeze(diagnostic);
  }
}

interface Sample {
  readonly t: number;
  readonly distance: number;
  readonly point: Vec2;
  readonly angle: number;
}

function angleAt(path: ScorePath, t: number): number {
  const tangent = path.tangentAt(t);
  if (!Number.isFinite(tangent.x) || !Number.isFinite(tangent.y) ||
      Math.hypot(tangent.x, tangent.y) < EPSILON) return Number.NaN;
  return Math.atan2(tangent.y, tangent.x) * 180 / Math.PI;
}

/** Sampling is bounded by both authored segments and physical staff distance. */
function sampleZone(
  path: ScorePath,
  zone: ScorePathReviewZone,
  staffSpace: number,
): readonly Sample[] {
  const segmentCount = "segmentCount" in path && typeof path.segmentCount === "number"
    ? path.segmentCount : 1;
  const count = Math.min(16384, Math.max(
    128,
    Math.ceil(segmentCount * (zone.endT - zone.startT) * 64),
    Math.ceil(zone.arcLength / staffSpace * 8),
  ));
  const samples: Sample[] = [];
  let distance = 0;
  let previous = path.pointAt(zone.startT);
  for (let index = 0; index <= count; index += 1) {
    const t = zone.startT + (zone.endT - zone.startT) * index / count;
    const point = path.pointAt(t);
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      throw new EventSafePlacementError({
        reason: "INVALID_INPUT", zoneId: zone.id, slotIds: zone.semanticSlotIds,
        safeLength: 0, staffSpace,
      });
    }
    distance += Math.hypot(point.x - previous.x, point.y - previous.y);
    samples.push({ t, point, distance, angle: angleAt(path, t) });
    previous = point;
  }
  return samples;
}

function interpolateT(samples: readonly Sample[], distance: number): number {
  if (distance <= 0) return samples[0]!.t;
  if (distance >= samples.at(-1)!.distance) return samples.at(-1)!.t;
  let left = 0;
  let right = samples.length - 1;
  while (right - left > 1) {
    const middle = Math.floor((left + right) / 2);
    if (samples[middle]!.distance < distance) left = middle;
    else right = middle;
  }
  const a = samples[left]!;
  const b = samples[right]!;
  return a.t + (b.t - a.t) * (distance - a.distance) / (b.distance - a.distance);
}

function distanceAtT(samples: readonly Sample[], t: number): number {
  const firstT = samples[0]!.t;
  const fraction = (t - firstT) / (samples.at(-1)!.t - firstT);
  const scaled = Math.max(0, Math.min(samples.length - 1, fraction * (samples.length - 1)));
  const index = Math.min(samples.length - 2, Math.floor(scaled));
  const a = samples[index]!;
  const b = samples[index + 1]!;
  return a.distance + (b.distance - a.distance) * (scaled - index);
}

function shelvesForSamples(
  zone: ScorePathReviewZone,
  samples: readonly Sample[],
): readonly EventSafeShelf[] {
  const shelves: EventSafeShelf[] = [];
  let start = 0;
  while (start < samples.length - 1) {
    let end = start + 1;
    let minimum = Math.min(samples[start]!.angle, samples[end]!.angle);
    let maximum = Math.max(samples[start]!.angle, samples[end]!.angle);
    const safe = (min: number, max: number) =>
      Number.isFinite(min) && Number.isFinite(max) &&
      Math.max(Math.abs(min), Math.abs(max)) <= EVENT_SAFE_GEOMETRY.maximumTangentAngleDeg &&
      max - min <= EVENT_SAFE_GEOMETRY.maximumTangentVariationDeg;
    const isSafe = safe(minimum, maximum);
    while (end + 1 < samples.length) {
      const next = samples[end + 1]!;
      const nextMin = Math.min(minimum, next.angle);
      const nextMax = Math.max(maximum, next.angle);
      if (isSafe ? !safe(nextMin, nextMax) : safe(samples[end]!.angle, next.angle)) break;
      minimum = nextMin;
      maximum = nextMax;
      end += 1;
    }
    const first = samples[start]!;
    const last = samples[end]!;
    shelves.push(Object.freeze({
      zoneId: zone.id,
      classification: isSafe ? "EVENT_SAFE_STRAIGHT" : "EVENT_FREE_CURVED",
      startT: first.t,
      endT: last.t,
      startDistance: first.distance,
      endDistance: last.distance,
      length: last.distance - first.distance,
      maximumTangentAngleDeg: Math.max(Math.abs(minimum), Math.abs(maximum)),
      tangentVariationDeg: maximum - minimum,
      startPoint: Object.freeze(first.point),
      endPoint: Object.freeze(last.point),
    }));
    start = end;
  }
  return shelves;
}

function transformedPoint(
  point: Vec2,
  origin: Vec2,
  rotation: number,
): Vec2 {
  return {
    x: origin.x + point.x * Math.cos(rotation) - point.y * Math.sin(rotation),
    y: origin.y + point.x * Math.sin(rotation) + point.y * Math.cos(rotation),
  };
}

/** Conservative complete ink bounds, including stroke width and tuplet numeral. */
export function eventPrimitiveFootprintPoints(
  primitive: ScoreRenderPrimitive,
): readonly Vec2[] {
  if (primitive.kind === "glyph") {
    return [0, 1].flatMap((x) => [0, 1].map((y) => transformedPoint({
      x: (x - primitive.anchorInGlyph.x) * primitive.width * (primitive.mirrorX ? -1 : 1),
      y: (y - primitive.anchorInGlyph.y) * primitive.height * (primitive.mirrorY ? -1 : 1),
    }, primitive.anchorTarget, primitive.rotationRadians)));
  }
  const expanded = (point: Vec2, width: number) => [-1, 1].flatMap((x) =>
    [-1, 1].map((y) => ({ x: point.x + x * width / 2, y: point.y + y * width / 2 })));
  if (primitive.kind === "tuplet") {
    return [
      ...primitive.bracket.flatMap(({ start, end }) =>
        [start, end].flatMap((point) => expanded(point, primitive.thickness))),
      ...[-1, 1].flatMap((x) => [-1, 1].map((y) => transformedPoint({
        x: x * primitive.numeralWidth / 2,
        y: y * primitive.numeralSize / 2,
      }, primitive.labelPosition, primitive.numeralRotationRadians))),
    ];
  }
  const points = primitive.kind === "polyline" ? primitive.points : [primitive.start, primitive.end];
  return points.flatMap((point) => expanded(point, primitive.thickness));
}

function tAtX(path: ScorePath, shelf: EventSafeShelf, x: number): number {
  let left = shelf.startT;
  let right = shelf.endT;
  for (let iteration = 0; iteration < 40; iteration += 1) {
    const middle = (left + right) / 2;
    if (path.pointAt(middle).x < x) left = middle;
    else right = middle;
  }
  return (left + right) / 2;
}

interface TrialPlacement {
  readonly placement: ScoreMotifPlacement;
  readonly safety: EventGroupSafety;
  readonly endDistance: number;
}

function trialPlacement(
  motif: ComposedMotif,
  originalZoneId: string,
  centerDistance: number,
  spacing: number,
  shelf: EventSafeShelf,
  shelfIndex: number,
  samples: readonly Sample[],
  path: ScorePath,
  staffSpace: number,
  minimumDistance: number,
): TrialPlacement | null {
  const noteDistances = motif.notes.map((_, index) =>
    centerDistance + (index - (motif.notes.length - 1) / 2) * spacing);
  if (noteDistances[0]! < shelf.startDistance || noteDistances.at(-1)! > shelf.endDistance) return null;
  const noteTs = Object.freeze(noteDistances.map((distance) => interpolateT(samples, distance)));
  const model = buildMotifModel({
    motif, noteTs, path, staffSpace,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
  });
  const points = model.primitives.flatMap(eventPrimitiveFootprintPoints);
  // Browser SVG matrices/geometry can quantize large track coordinates to
  // float32. Expand the ink reservation by four relative float32 units;
  // the full canonical margin is then added outside this larger footprint.
  let maximumMagnitude = 1e-6;
  let rawMinimumX = Number.POSITIVE_INFINITY;
  let rawMaximumX = Number.NEGATIVE_INFINITY;
  let rawMinimumY = Number.POSITIVE_INFINITY;
  let rawMaximumY = Number.NEGATIVE_INFINITY;
  for (const point of points) {
    maximumMagnitude = Math.max(
      maximumMagnitude,
      Math.abs(point.x),
      Math.abs(point.y),
    );
    rawMinimumX = Math.min(rawMinimumX, point.x);
    rawMaximumX = Math.max(rawMaximumX, point.x);
    rawMinimumY = Math.min(rawMinimumY, point.y);
    rawMaximumY = Math.max(rawMaximumY, point.y);
  }
  const svgPadding = maximumMagnitude * 2 ** -21;
  const minimumX = rawMinimumX - svgPadding;
  const maximumX = rawMaximumX + svgPadding;
  if (minimumX < path.pointAt(shelf.startT).x || maximumX > path.pointAt(shelf.endT).x) return null;
  const footprintStartT = tAtX(path, shelf, minimumX);
  const footprintEndT = tAtX(path, shelf, maximumX);
  const startDistance = distanceAtT(samples, footprintStartT);
  const endDistance = distanceAtT(samples, footprintEndT);
  const margin = EVENT_SAFE_GEOMETRY.marginSp * staffSpace;
  if (startDistance - margin < Math.max(shelf.startDistance, minimumDistance) - EPSILON ||
      endDistance + margin > shelf.endDistance + EPSILON) return null;
  const marginStartT = interpolateT(samples, startDistance - margin);
  const marginEndT = interpolateT(samples, endDistance + margin);
  // Check the complete footprint interval again, including margins. This also
  // protects against an interval whose note centers alone looked valid.
  let minimumAngle = Number.POSITIVE_INFINITY;
  let maximumAngle = Number.NEGATIVE_INFINITY;
  let maximumTangentAngleDeg = 0;
  for (let index = 0; index <= 128; index += 1) {
    const angle = angleAt(
      path,
      marginStartT + ((marginEndT - marginStartT) * index) / 128,
    );
    minimumAngle = Math.min(minimumAngle, angle);
    maximumAngle = Math.max(maximumAngle, angle);
    maximumTangentAngleDeg = Math.max(maximumTangentAngleDeg, Math.abs(angle));
  }
  const tangentVariationDeg = maximumAngle - minimumAngle;
  if (!Number.isFinite(maximumTangentAngleDeg) || !Number.isFinite(tangentVariationDeg) ||
      maximumTangentAngleDeg > EVENT_SAFE_GEOMETRY.maximumTangentAngleDeg + EPSILON ||
      tangentVariationDeg > EVENT_SAFE_GEOMETRY.maximumTangentVariationDeg + EPSILON) return null;
  return {
    placement: Object.freeze({ motif, noteTs }),
    safety: Object.freeze({
      slotId: motif.slotId, zoneId: shelf.zoneId, shelfIndex,
      originalZoneId, relocated: originalZoneId !== shelf.zoneId,
      eventCount: motif.notes.length,
      footprintStartT, footprintEndT, marginStartT, marginEndT,
      maximumTangentAngleDeg, tangentVariationDeg,
      clearanceBefore: startDistance - shelf.startDistance,
      clearanceAfter: shelf.endDistance - endDistance,
      footprintWidth: endDistance - startDistance,
      footprintBounds: Object.freeze({ left: minimumX, right: maximumX,
        top: rawMinimumY - svgPadding, bottom: rawMaximumY + svgPadding }),
    }),
    endDistance: endDistance + margin,
  };
}

export interface AllocateEventSafePlacementsInput {
  readonly path: ScorePath;
  readonly staffSpace: number;
  readonly zones: readonly ScorePathReviewZone[];
  readonly composition: ComposedSegment;
  /** Excludes the already owned clef/key-signature geometry from event placement. */
  readonly structuralStartT?: number;
}

interface Candidate extends TrialPlacement {
  readonly cost: number;
}

interface AllocatorZone {
  readonly zone: ScorePathReviewZone;
  readonly samples: readonly Sample[];
  readonly shelves: readonly { readonly shelf: EventSafeShelf; readonly index: number }[];
}

/**
 * Forward dynamic programming keeps complete groups in semantic order. A group
 * may use its owner shelf or a later notation shelf;
 * authored project visits remain pinned. Candidate generation and selection are
 * bounded, with no recursive backtracking or Composer invocation.
 */
export function allocateEventSafePlacements({
  path, staffSpace, zones, composition, structuralStartT,
}: AllocateEventSafePlacementsInput): {
  readonly motifs: readonly ScoreMotifPlacement[];
  readonly zones: readonly ScorePathReviewZone[];
  readonly diagnostics: EventSafePlacementDiagnostics;
} {
  const fail = (reason: EventSafePlacementError["diagnostic"]["reason"], zoneId: string,
    slotIds: readonly string[], safeLength = 0): never => {
    throw new EventSafePlacementError({ reason, zoneId, slotIds, safeLength, staffSpace });
  };
  if (!Number.isFinite(staffSpace) || staffSpace <= 0 ||
      (structuralStartT !== undefined && (!Number.isFinite(structuralStartT) || structuralStartT < 0 || structuralStartT > 1))) {
    fail("INVALID_INPUT", "input", []);
  }
  const zoneIds = new Set<string>();
  let previousEnd = 0;
  for (const zone of zones) {
    if (zoneIds.has(zone.id) || !Number.isFinite(zone.startT) || !Number.isFinite(zone.endT) ||
        zone.startT < previousEnd - EPSILON || zone.startT < 0 || zone.endT > 1 || zone.startT >= zone.endT ||
        !Number.isFinite(zone.arcLength) || zone.arcLength <= 0 ||
        new Set(zone.semanticSlotIds).size !== zone.semanticSlotIds.length ||
        (zone.kind === "connector" && zone.semanticSlotIds.length > 0)) {
      fail("INVALID_INPUT", zone.id, zone.semanticSlotIds);
    }
    zoneIds.add(zone.id);
    previousEnd = zone.endT;
  }
  const motifIds = new Set<string>();
  const owners = composition.motifs.map((motif) => {
    const matched = zones.filter((zone) => zone.kind === "notation-safe" && zone.semanticSlotIds.includes(motif.slotId));
    if (matched.length !== 1 || motifIds.has(motif.slotId) || motif.notes.length === 0) {
      fail("INVALID_INPUT", "semantic-owner", [motif.slotId]);
    }
    motifIds.add(motif.slotId);
    return matched[0]!;
  });
  if (owners.some((owner, index) => index > 0 && owner.startT < owners[index - 1]!.startT)) {
    fail("INVALID_INPUT", "semantic-order", composition.motifs.map(({ slotId }) => slotId));
  }
  const allShelves: EventSafeShelf[] = [];
  const allocatorZones: AllocatorZone[] = zones.filter(({ kind }) => kind === "notation-safe").map((zone) => {
    const samples = sampleZone(path, zone, staffSpace);
    if (samples.some(({ angle }) => !Number.isFinite(angle)) || samples.at(-1)!.distance <= EPSILON) {
      fail("INVALID_INPUT", zone.id, zone.semanticSlotIds);
    }
    const shelves = shelvesForSamples(zone, samples);
    const offset = allShelves.length;
    allShelves.push(...shelves);
    return { zone, samples, shelves: shelves.map((shelf, index) => ({ shelf, index: index + offset }))
      .filter(({ shelf }) => shelf.classification === "EVENT_SAFE_STRAIGHT") };
  });
  const allowedZones = owners.map((owner) => {
    const ownerIndex = allocatorZones.findIndex(({ zone }) => zone.id === owner.id);
    const own = allocatorZones[ownerIndex]!;
    if (owner.projectVisit || owner.chapterId?.endsWith("-terminal")) return [own];
    // Existing project-card visits keep both their event ownership and their
    // reserved event-free visits; relocation cannot populate a different card.
    return [own, ...allocatorZones.slice(ownerIndex + 1).filter(({ zone }) => !zone.projectVisit)];
  });
  const trialCache = new Map<string, TrialPlacement | null>();
  let candidateCount = 0;
  const buildCandidates = (destinations: readonly (readonly AllocatorZone[])[]): readonly Candidate[][] => composition.motifs.map((motif, motifIndex) => {
    const result: Candidate[] = [];
    for (const allocationZone of destinations[motifIndex]!) {
      const { zone, samples, shelves } = allocationZone;
      const safeLength = shelves.reduce((total, { shelf }) => total + shelf.length, 0);
      const eligibleGroups = destinations.flatMap((allowed, index) => allowed.includes(allocationZone) ? [index] : []);
      const rank = eligibleGroups.indexOf(motifIndex);
      const firstDistance = structuralStartT !== undefined && structuralStartT > zone.startT
        ? distanceAtT(samples, Math.min(zone.endT, structuralStartT)) : 0;
      const ideal = firstDistance + (samples.at(-1)!.distance - firstDistance) * (rank + 0.5) / eligibleGroups.length;
      const eventCount = eligibleGroups.reduce((total, index) => total + composition.motifs[index]!.notes.length, 0);
      const preferredSpacing = Math.min(EVENT_SAFE_GEOMETRY.preferredMaximumNoteSpacingSp * staffSpace,
        Math.max(EVENT_SAFE_GEOMETRY.minimumNoteSpacingSp * staffSpace, safeLength / (eventCount + eligibleGroups.length + 1)));
      const spacings = [...new Set([preferredSpacing, EVENT_SAFE_GEOMETRY.minimumNoteSpacingSp * staffSpace])];
      for (const [spacingIndex, spacing] of spacings.entries()) {
        for (const { shelf, index } of shelves) {
          const start = Math.max(firstDistance, shelf.startDistance);
          if (start >= shelf.endDistance) continue;
          // Half-staff-space search resolves optical placement without making
          // runtime work proportional to an unbounded viewport/path length.
          const steps = Math.min(1024, Math.max(1, Math.ceil((shelf.endDistance - start) / (staffSpace * 0.5))));
          const centers = [...new Set([Math.max(start, Math.min(shelf.endDistance, ideal)),
            (start + shelf.endDistance) / 2,
            ...Array.from({ length: steps + 1 }, (_, step) => start + (shelf.endDistance - start) * step / steps)])];
          for (const center of centers) {
            candidateCount += 1;
            const trialKey = [
              motif.slotId,
              zone.id,
              index,
              spacing,
              center,
              firstDistance,
            ].join(":");
            let trial = trialCache.get(trialKey);
            if (trial === undefined) {
              trial = trialPlacement(motif, owners[motifIndex]!.id, center, spacing, shelf, index,
                samples, path, staffSpace, firstDistance);
              trialCache.set(trialKey, trial);
            }
            if (!trial) continue;
            const relocationCost = zone.id === owners[motifIndex]!.id ? 0
              : 1e9 + allowedZones[motifIndex]!.indexOf(allocationZone) * 1e6;
            result.push({ ...trial, cost: relocationCost + spacingIndex * 1e5 + ((center - ideal) / staffSpace) ** 2 });
          }
        }
      }
    }
    return result;
  });
  interface State { readonly candidate: Candidate; readonly cost: number; readonly previous?: State }
  const selectCandidates = (candidates: readonly (readonly Candidate[])[]): Candidate[] => {
  let states: readonly State[] = [];
  for (const [motifIndex, choices] of candidates.entries()) {
    const sortedChoices = [...choices].sort((left, right) => left.safety.marginStartT - right.safety.marginStartT);
    const previous = [...states].sort((left, right) => left.candidate.safety.marginEndT - right.candidate.safety.marginEndT);
    let previousIndex = 0;
    let best: State | undefined;
    const next: State[] = [];
    for (const candidate of sortedChoices) {
      while (previousIndex < previous.length &&
          previous[previousIndex]!.candidate.safety.marginEndT <= candidate.safety.marginStartT + EPSILON) {
        const state = previous[previousIndex++]!;
        if (!best || state.cost < best.cost) best = state;
      }
      if (motifIndex === 0 || best) next.push({ candidate, cost: candidate.cost + (best?.cost ?? 0), ...(best ? { previous: best } : {}) });
    }
    if (next.length === 0) {
      const motif = composition.motifs[motifIndex]!;
      fail("INSUFFICIENT_EVENT_SAFE_CAPACITY", owners[motifIndex]!.id, [motif.slotId],
        allowedZones[motifIndex]!.reduce((total, zone) => total + zone.shelves.reduce((sum, { shelf }) => sum + shelf.length, 0), 0));
    }
    states = next;
  }
  const selected: Candidate[] = [];
  let state = states.reduce<State | undefined>((best, candidate) => !best || candidate.cost < best.cost ? candidate : best, undefined);
  while (state) { selected.push(state.candidate); state = state.previous; }
  selected.reverse();
  return selected;
  };
  const candidates = buildCandidates(allowedZones);
  const assigned = selectCandidates(candidates);
  // Once capacity and order fix the shelf ownership, calibrate distribution
  // against only the groups actually assigned there. Hypothetical incoming
  // groups must not crowd existing Professional notation at a shelf's end.
  const assignedZones = assigned.map(({ safety }) => [allocatorZones.find(({ zone }) => zone.id === safety.zoneId)!]);
  const calibratedCandidates = buildCandidates(assignedZones).map((choices, index) => [
    ...choices,
    // Retain the proven candidate as a deterministic fallback if re-spacing
    // cannot improve a tightly packed shelf without violating its margins.
    { ...assigned[index]!, cost: assigned[index]!.cost + 1e8 },
  ]);
  const selected = selectCandidates(calibratedCandidates);
  const motifs = Object.freeze(selected.map(({ placement }) => placement));
  const groups = Object.freeze(selected.map(({ safety }) => safety));
  const relocations = Object.freeze(selected.flatMap(({ placement, safety }, index) => safety.relocated ? [Object.freeze({
    branch: composition.branchId.split(":").at(-1)!,
    chapter: owners[index]!.chapterId,
    sourceShelf: safety.originalZoneId,
    slotId: placement.motif.slotId,
    motifId: placement.motif.motifId,
    semanticIndex: index,
    reason: candidates[index]!.some(({ safety: candidate }) => !candidate.relocated)
      ? "SOURCE_CAPACITY_REQUIRED_BY_SEMANTIC_ORDER" as const
      : "SOURCE_HAS_NO_COMPLETE_FOOTPRINT_INTERVAL" as const,
    sourceSafeIntervals: Object.freeze(allShelves.filter((shelf) =>
      shelf.zoneId === safety.originalZoneId && shelf.classification === "EVENT_SAFE_STRAIGHT")),
    destinationShelf: safety.zoneId,
    destinationChapter: zones.find(({ id }) => id === safety.zoneId)!.chapterId,
    availableSafeInterval: allShelves[safety.shelfIndex]!,
    footprintRequirement: safety.footprintWidth,
    safetyMarginEachSide: EVENT_SAFE_GEOMETRY.marginSp * staffSpace,
    maximumTangentAngleDeg: safety.maximumTangentAngleDeg,
    tangentVariationDeg: safety.tangentVariationDeg,
    semanticOrderPreserved: index === 0 || safety.marginStartT >= groups[index - 1]!.marginEndT - EPSILON,
  })] : []));
  // Count actual selected event footprints that touch a forbidden region, rather
  // than publishing a constant as evidence. Recheck note ownership separately.
  const forbiddenIntervals = [
    ...zones.filter(({ kind }) => kind === "connector"),
    ...allShelves.filter(({ classification }) => classification === "EVENT_FREE_CURVED"),
  ];
  const forbiddenEventCount = selected.reduce((count, { placement, safety }) => {
    const shelf = allShelves[safety.shelfIndex]!;
    const forbidden = safety.marginStartT < shelf.startT - EPSILON || safety.marginEndT > shelf.endT + EPSILON ||
      placement.noteTs.some((t) => t < safety.footprintStartT - EPSILON || t > safety.footprintEndT + EPSILON) ||
      forbiddenIntervals.some((interval) => safety.marginStartT < interval.endT - EPSILON && safety.marginEndT > interval.startT + EPSILON);
    return count + (forbidden ? placement.motif.notes.length : 0);
  }, 0);
  if (forbiddenEventCount > 0) fail("INSUFFICIENT_EVENT_SAFE_CAPACITY", "footprint-audit", groups.map(({ slotId }) => slotId));
  const projectedZones = Object.freeze(zones.map((zone) => {
    if (zone.kind !== "notation-safe") return zone;
    const assigned = selected.filter(({ safety }) => safety.zoneId === zone.id);
    return Object.freeze({ ...zone,
      semanticSlotIds: Object.freeze([
        ...zone.semanticSlotIds.filter((slotId) => !motifIds.has(slotId)),
        ...assigned.map(({ placement }) => placement.motif.slotId),
      ]),
      eventCount: assigned.reduce((total, { placement }) => total + placement.motif.notes.length, 0),
    });
  }));
  return Object.freeze({ motifs, zones: projectedZones,
    diagnostics: Object.freeze({ staffSpace, shelves: Object.freeze(allShelves), groups, relocations,
      eventCount: motifs.reduce((total, { motif }) => total + motif.notes.length, 0),
      forbiddenEventCount, candidateCount,
      maximumTangentAngleDeg: Math.max(0, ...groups.map((group) => group.maximumTangentAngleDeg)),
      maximumTangentVariationDeg: Math.max(0, ...groups.map((group) => group.tangentVariationDeg)),
    }),
  });
}
