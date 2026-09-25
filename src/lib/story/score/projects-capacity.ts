import type { Vec2 } from "@/lib/music/geometry/types";
import { eventPrimitiveFootprintPoints } from "./event-safe-placement";
import { STORY_SCORE_EXPECTED_FINGERPRINTS } from "./composition";
import { scorePathReviewSemanticFingerprint } from "./organic-flowing";
import type {
  StoryScoreMeasuredInteractionSweep,
  StoryScoreMeasuredRect,
  StoryScoreProjection,
} from "./projection";
import {
  projectsSegmentClearance,
  projectsSegmentPolygonClearance,
} from "./projects-clearance";

export {
  projectsSegmentClearance,
  projectsSegmentPolygonClearance,
} from "./projects-clearance";

export type ProjectsCapacityStatus = "PASS" | "INSUFFICIENT_CAPACITY" | "NOT_READY" | "INVALID";
export interface ProjectsCapacityCard {
  readonly projectIndex: 1 | 2 | 3;
  readonly idle: StoryScoreMeasuredRect;
  /** Conservative union of production idle/hover/focus/touch transition ink. */
  readonly interactionEnvelope?: StoryScoreMeasuredRect;
  /** Spatially correlated production transition contours with a continuous bound. */
  readonly interactionSweep?: StoryScoreMeasuredInteractionSweep;
}
export interface ProjectsCapacityInput {
  readonly projection: StoryScoreProjection;
  /** All rectangles and projection coordinates use physical CSS pixels. */
  readonly clip: StoryScoreMeasuredRect;
  readonly cards: readonly ProjectsCapacityCard[];
  readonly revision: string;
}
export interface ProjectsCapacityResult {
  readonly status: ProjectsCapacityStatus;
  readonly signature: string;
  readonly reasons: readonly string[];
  readonly visits: readonly {
    readonly limitingConstraint: {
      readonly end: Vec2;
      readonly endT?: number;
      readonly kind: "event-ink" | "staff-ink";
      readonly ownerId: string;
      readonly radius: number;
      readonly start: Vec2;
      readonly startT?: number;
      readonly visitZoneEndT: number;
      readonly visitZoneRelation: "incoming" | "outgoing" | "own-shelf";
      readonly visitZoneStartT: number;
    };
    readonly projectIndex: number;
    readonly minimumClearance: number;
    readonly internalShelfMinimumClearance: number;
    readonly ownShelfMinimumClearance: number;
    readonly protectedRect: StoryScoreMeasuredRect;
    readonly visible: boolean;
  }[];
}

const EPSILON = 1e-7;
const REQUIRED_CLEARANCE = 12;
const orientation = (a: { readonly x: number; readonly y: number }, b: { readonly x: number; readonly y: number }, c: { readonly x: number; readonly y: number }) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

/** Complete segment pairs, including adjacent-run pairs; no point thinning. */
function hasCrossing(points: readonly { readonly x: number; readonly y: number }[]): boolean {
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i]!;
    const b = points[i + 1]!;
    for (let j = i + 2; j < points.length - 1; j += 1) {
      const c = points[j]!;
      const d = points[j + 1]!;
      if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
          Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) continue;
      if (orientation(a, b, c) * orientation(a, b, d) < -EPSILON &&
          orientation(c, d, a) * orientation(c, d, b) < -EPSILON) return true;
    }
  }
  return false;
}

const validRect = (r: StoryScoreMeasuredRect) =>
  Object.values(r).every(Number.isFinite) && r.width > 0 && r.height > 0;
const validSweep = (sweep: StoryScoreMeasuredInteractionSweep) =>
  Number.isFinite(sweep.interpolationPadding) &&
  sweep.interpolationPadding >= 0 &&
  sweep.polygons.length >= 2 &&
  sweep.polygons.every(
    (polygon) =>
      polygon.length >= 3 &&
      polygon.every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y)),
  );
const contains = (r: StoryScoreMeasuredRect, p: Vec2, radius = 0) =>
  p.x - radius >= r.x && p.x + radius <= r.x + r.width &&
  p.y - radius >= r.y && p.y + radius <= r.y + r.height;
const containsRect = (outer: StoryScoreMeasuredRect, inner: StoryScoreMeasuredRect) =>
  contains(outer, { x: inner.x, y: inner.y }) &&
  contains(outer, { x: inner.x + inner.width, y: inner.y + inner.height });

function projectsProtectedClearance(
  a: Vec2,
  b: Vec2,
  card: ProjectsCapacityCard,
  radius: number,
): number {
  const idleClearance = projectsSegmentClearance(a, b, card.idle, radius);

  if (!card.interactionSweep) return idleClearance;

  let clearance = idleClearance;
  for (const polygon of card.interactionSweep.polygons) {
    clearance = Math.min(
      clearance,
      projectsSegmentPolygonClearance(
        a,
        b,
        polygon,
        radius,
        card.interactionSweep.interpolationPadding,
      ),
    );
  }

  return clearance;
}

interface ProjectsInkEdge {
  readonly a: Vec2;
  readonly b: Vec2;
  readonly kind: "event-ink" | "staff-ink";
  readonly ownerId: string;
  readonly radius: number;
  readonly startT?: number;
  readonly endT?: number;
}

function protectedSweepBounds(
  card: ProjectsCapacityCard,
): StoryScoreMeasuredRect {
  const padding = card.interactionSweep?.interpolationPadding ?? 0;
  let left = card.idle.x;
  let top = card.idle.y;
  let right = card.idle.x + card.idle.width;
  let bottom = card.idle.y + card.idle.height;

  for (const polygon of card.interactionSweep?.polygons ?? []) {
    for (const point of polygon) {
      left = Math.min(left, point.x - padding);
      top = Math.min(top, point.y - padding);
      right = Math.max(right, point.x + padding);
      bottom = Math.max(bottom, point.y + padding);
    }
  }

  return Object.freeze({
    height: bottom - top,
    width: right - left,
    x: left,
    y: top,
  });
}

function minimumProtectedClearance(
  edges: readonly ProjectsInkEdge[],
  card: ProjectsCapacityCard,
  bounds: StoryScoreMeasuredRect,
  cache: Map<ProjectsInkEdge, number>,
): { readonly clearance: number; readonly edge: ProjectsInkEdge } {
  const ordered = edges
    .map((edge, index) => ({
      edge,
      index,
      lowerBound: projectsSegmentClearance(
        edge.a,
        edge.b,
        bounds,
        edge.radius,
      ),
    }))
    .sort(
      (left, right) =>
        left.lowerBound - right.lowerBound || left.index - right.index,
    );
  let selected = ordered[0]!;
  let minimum = Number.POSITIVE_INFINITY;

  for (const candidate of ordered) {
    if (candidate.lowerBound > minimum + EPSILON) break;
    let clearance = cache.get(candidate.edge);
    if (clearance === undefined) {
      clearance = projectsProtectedClearance(
        candidate.edge.a,
        candidate.edge.b,
        card,
        candidate.edge.radius,
      );
      cache.set(candidate.edge, clearance);
    }
    if (
      clearance < minimum ||
      (clearance === minimum && candidate.index < selected.index)
    ) {
      minimum = clearance;
      selected = candidate;
    }
  }

  return Object.freeze({ clearance: minimum, edge: selected.edge });
}

function signatureOf(input: ProjectsCapacityInput): string {
  const value = JSON.stringify({ revision: input.revision, clip: input.clip, cards: input.cards,
    mode: input.projection.mode, geometry: Object.values(input.projection.branches).map(({ path }) => Array.from({ length: 2049 }, (_, i) => path.pointAt(i / 2048))) });
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) hash = Math.imul(hash ^ value.charCodeAt(i), 0x01000193);
  return `projects-capacity:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

/** Geometry acceptance only. Responsive policy and DOM lifecycle are separate owners. */
export function evaluateProjectsCapacity(input: ProjectsCapacityInput): ProjectsCapacityResult {
  const { projection, cards, clip } = input;
  const signature = signatureOf(input);
  const result = (status: ProjectsCapacityStatus, reasons: readonly string[], visits: ProjectsCapacityResult["visits"] = []) =>
    Object.freeze({ status, signature, reasons: Object.freeze([...reasons]), visits: Object.freeze([...visits]) });
  if (!validRect(clip) || projection.resolvedGeometryMode !== "horizontal-enhanced" ||
      cards.some(({ idle, interactionEnvelope, interactionSweep }) =>
        !validRect(idle) ||
        (interactionEnvelope !== undefined && !validRect(interactionEnvelope)) ||
        (interactionSweep !== undefined && !validSweep(interactionSweep)))) {
    return result("INVALID", ["inconsistent-candidate-input"]);
  }
  if (cards.length !== 3) return result("NOT_READY", ["three-card-measurement-required"]);
  if (cards.some(({ projectIndex }, index) => projectIndex !== index + 1)) return result("INVALID", ["project-identity-order"]);
  for (const branch of Object.values(projection.branches)) {
    if (scorePathReviewSemanticFingerprint(branch.composition) !== STORY_SCORE_EXPECTED_FINGERPRINTS[branch.branch] ||
        branch.eventSafety.forbiddenEventCount !== 0 || branch.eventSafety.maximumTangentAngleDeg > 18 ||
        branch.eventSafety.maximumTangentVariationDeg > 6 || branch.model.staff.lines.length !== 5 ||
        branch.path.continuity.maximumPointGap > EPSILON || branch.path.continuity.minimumTangentAlignment < 1 - EPSILON) {
      return result("INVALID", ["semantic-or-global-event-safety"]);
    }
    const center = Array.from({ length: 2049 }, (_, index) => branch.path.pointAt(index / 2048));
    if (hasCrossing(center) || branch.model.staff.lines.some(({ points }) => hasCrossing(points))) {
      return result("INVALID", ["global-visible-segment-intersection"]);
    }
  }
  const professional = projection.branches.professional;
  const zones = professional.zones.filter(({ chapterId, kind }) => chapterId === "professional-projects" && kind === "notation-safe");
  if (zones.length !== 3 || zones.some(({ projectVisit }, i) => projectVisit?.projectIndex !== i + 1) ||
      projection.evidence.projectSerpentine.connectorEventCount !== 0) return result("INVALID", ["three-visit-topology"]);
  const staffEdges = professional.model.staff.lines.flatMap((line) => line.points.slice(1).map((b, index) => ({
    a: line.points[index]!, b, kind: "staff-ink" as const, ownerId: line.id,
    radius: line.thickness / 2, startT: index / (line.points.length - 1),
    endT: (index + 1) / (line.points.length - 1),
  })));
  const visits = zones.map((zone, index) => {
    const card = cards[index]!;
    const rect = card.interactionEnvelope ?? card.idle;
    const primitives = professional.model.primitives.filter((primitive) =>
      zone.semanticSlotIds.some((slot) => primitive.id.startsWith(`wf-${slot}:`)));
    const inkPoints = primitives.flatMap(eventPrimitiveFootprintPoints);
    // Conservative full primitive boxes include glyph/ledger/stem interior too.
    const inkEdges = primitives.flatMap((primitive) => {
      const points = eventPrimitiveFootprintPoints(primitive);
      if (!points.length) return [];
      const xs = points.map(({ x }) => x);
      const ys = points.map(({ y }) => y);
      const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
      const topLeft = { x: left, y: top };
      const topRight = { x: right, y: top };
      const bottomRight = { x: right, y: bottom };
      const bottomLeft = { x: left, y: bottom };
      const edge = (a: Vec2, b: Vec2) => ({
        a,
        b,
        kind: "event-ink" as const,
        ownerId: primitive.id,
        radius: 0,
      });

      return [
        edge(topLeft, topRight),
        edge(topRight, bottomRight),
        edge(bottomRight, bottomLeft),
        edge(bottomLeft, topLeft),
        edge(topLeft, bottomRight),
        edge(topRight, bottomLeft),
      ];
    });
    const allEdges: readonly ProjectsInkEdge[] = [...staffEdges, ...inkEdges];
    const bounds = protectedSweepBounds(card);
    const clearanceCache = new Map<ProjectsInkEdge, number>();
    const limiting = minimumProtectedClearance(
      allEdges,
      card,
      bounds,
      clearanceCache,
    );
    const ownShelfEdges = allEdges.filter(
      ({ kind, startT, endT }) =>
        kind === "event-ink" ||
        (endT! >= zone.startT && startT! <= zone.endT),
    );
    const internalShelfEdges = allEdges.filter(
      ({ kind, startT, endT }) =>
        kind === "event-ink" ||
        (startT! >= zone.startT && endT! <= zone.endT),
    );
    const ownShelfMinimumClearance = minimumProtectedClearance(
      ownShelfEdges,
      card,
      bounds,
      clearanceCache,
    ).clearance;
    const internalShelfMinimumClearance = minimumProtectedClearance(
      internalShelfEdges,
      card,
      bounds,
      clearanceCache,
    ).clearance;
    const minimumClearance = limiting.clearance;
    const visible =
      containsRect(clip, rect) &&
      staffEdges
        .filter(
          ({ startT, endT }) =>
            endT >= zone.startT && startT <= zone.endT,
        )
        .every(
          ({ a, b, radius }) =>
            contains(clip, a, radius) && contains(clip, b, radius),
        ) &&
      inkPoints.every((point) => contains(clip, point));
    return Object.freeze({
      limitingConstraint: Object.freeze({
        end: Object.freeze({ ...limiting.edge.b }),
        kind: limiting.edge.kind,
        ownerId: limiting.edge.ownerId,
        radius: limiting.edge.radius,
        start: Object.freeze({ ...limiting.edge.a }),
        visitZoneEndT: zone.endT,
        visitZoneRelation:
          limiting.edge.kind === "event-ink" ||
          (limiting.edge.endT! >= zone.startT &&
            limiting.edge.startT! <= zone.endT)
            ? "own-shelf"
            : limiting.edge.endT! < zone.startT
              ? "incoming"
              : "outgoing",
        visitZoneStartT: zone.startT,
        ...(limiting.edge.kind === "staff-ink"
          ? {
              endT: limiting.edge.endT,
              startT: limiting.edge.startT,
            }
          : {}),
      }),
      projectIndex: card.projectIndex,
      minimumClearance,
      internalShelfMinimumClearance,
      ownShelfMinimumClearance,
      protectedRect: Object.freeze({ ...rect }),
      visible,
    });
  });
  if (visits.some(({ minimumClearance, visible }) => minimumClearance < REQUIRED_CLEARANCE || !visible)) {
    return result("INSUFFICIENT_CAPACITY", ["projects-protected-clearance-or-clip"], visits);
  }
  if (cards.some(({ interactionEnvelope, interactionSweep }) =>
    !interactionEnvelope || !interactionSweep)) {
    return result(
      "NOT_READY",
      ["production-interaction-geometry-required"],
      visits,
    );
  }
  if (cards.some(({ idle, interactionEnvelope: envelope }) => !contains(envelope!, { x: idle.x, y: idle.y }) ||
      !contains(envelope!, { x: idle.x + idle.width, y: idle.y + idle.height }))) return result("INVALID", ["interaction-envelope-excludes-idle"], visits);
  return result("PASS", [], visits);
}
