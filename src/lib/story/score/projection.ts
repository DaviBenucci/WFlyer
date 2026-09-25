import type { ComposedSegment } from "@/lib/music/composer/types";
import type { ScorePath, Vec2 } from "@/lib/music/geometry/types";
import { APPROVED_RENDERER_TOKENS } from "@/lib/music/renderer/approved-runtime";
import type {
  GlyphRenderPrimitive,
  PolylineRenderPrimitive,
  RenderLayer,
  ScoreRenderModel,
  ScoreRenderPrimitive,
} from "@/lib/music/renderer/types";
import { DESKTOP_TIMELINE_ORDER } from "@/lib/story/manifest";
import {
  MOTION_LAB_DRAFT_CHAPTER_SPANS,
  MOTION_LAB_DRAFT_ELIGIBILITY,
} from "@/lib/story/motion";
import type { StoryChapterId } from "@/lib/story/types";
import {
  projectStoryTimelineGeometry,
  type StorySpatialProjection,
  type StorySpatialTimelineGeometry,
} from "@/lib/story/motion/geometry";

import {
  STORY_SCORE_BRANCHES,
  STORY_SCORE_BRANCH_CHAPTERS,
  STORY_SCORE_COMPOSITIONS,
  STORY_SCORE_EXPECTED_FINGERPRINTS,
  STORY_SCORE_SEGMENTS,
  STORY_SCORE_SESSION_SEED,
  type StoryScoreBranch,
} from "./composition";
import {
  type AuthoredTrackGeometry,
  buildAuthoredGeometry,
  buildReviewModel,
  buildZones,
  ReviewCubicSplineScorePath,
  SCORE_PATH_REVIEW_GEOMETRY_EPSILON,
  SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
  type ScorePathReviewChapterLayout,
  type ScorePathReviewMode,
  type ScorePathReservedContentReason,
  type ScorePathReviewInteractionProfile,
  type ScorePathReviewProjectVisit,
  type ScorePathReviewZone,
} from "./organic-flowing";
import {
  buildProfessionalOriginPath,
  SCORE_PATH_ORIGIN_REVIEW_ASSET,
  type ScorePathOriginReviewMode,
} from "./shared-origin";
import {
  allocateEventSafePlacements,
  eventPrimitiveFootprintPoints,
  type EventSafePlacementDiagnostics,
} from "./event-safe-placement";
import { projectsSegmentClearance } from "./projects-clearance";

export const STORY_SCORE_PROJECTION_MODES = Object.freeze([
  "horizontal-enhanced",
  "vertical-wide",
  "vertical-compact",
  "static",
] as const);
export type StoryScoreProjectionMode =
  (typeof STORY_SCORE_PROJECTION_MODES)[number];

export interface StoryScoreProjectionOptions {
  readonly sceneMeasurements?: StoryScoreSceneMeasurements;
  readonly viewportHeight?: number;
  readonly viewportWidth?: number;
}

export interface StoryScoreMeasuredRect {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export interface StoryScoreMeasuredInteractionSweep {
  /** Maximum physical-CSS-pixel distance from any between-sample contour. */
  readonly interpolationPadding: number;
  /** Idle bounds followed by ordered production-transition contour samples. */
  readonly polygons: readonly (readonly Vec2[])[];
}

export interface StoryScoreMeasuredExclusionRect
  extends StoryScoreMeasuredRect {
  readonly reason: string;
}

export interface StoryScoreSceneMeasurements {
  readonly chapterContentExclusions?: Readonly<
    Partial<Record<StoryChapterId, readonly StoryScoreMeasuredExclusionRect[]>>
  >;
  readonly professionalProjectCards?: readonly StoryScoreMeasuredRect[];
  readonly professionalProjectInteractionEnvelopes?: Readonly<
    Partial<Record<1 | 2 | 3, StoryScoreMeasuredRect>>
  >;
  readonly professionalProjectInteractionSweeps?: Readonly<
    Partial<Record<1 | 2 | 3, StoryScoreMeasuredInteractionSweep>>
  >;
  readonly professionalServicesCards?: readonly StoryScoreMeasuredRect[];
}

export interface StoryScoreBranchProjection {
  readonly branch: StoryScoreBranch;
  readonly chapters: readonly ScorePathReviewChapterLayout[];
  readonly composition: ComposedSegment;
  readonly eventSafety: EventSafePlacementDiagnostics;
  /** Bounded Stage-1 handoff target geometry; no ownership or motion state. */
  readonly homeEntry: {
    readonly t: number;
    readonly point: Vec2;
    readonly tangent: Vec2;
    readonly staffPoints: readonly Vec2[];
    readonly eventFreeLeadIn: { readonly startT: 0; readonly endT: number };
  };
  readonly height: number;
  readonly model: ScoreRenderModel;
  readonly path: ReviewCubicSplineScorePath;
  readonly semanticSegmentIds: readonly StoryChapterId[];
  readonly staffSpace: number;
  readonly viewBox: string;
  readonly width: number;
  readonly zones: readonly ScorePathReviewZone[];
}

export interface StoryScoreProjectionEvidence {
  readonly chapterBarlines: Readonly<
    Record<StoryChapterId, StoryScoreChapterBarlineClassification>
  >;
  readonly cardScoreInteractions: Readonly<
    Record<
      "professional-services",
      {
        readonly cardCount: number;
        readonly eventCount: 0;
        readonly expandedSpan: number;
        readonly leadInLength: number;
        readonly leadOutLength: number;
        readonly maximumStaffSpread: number;
        readonly measurementSource:
          | "deterministic-fallback"
          | "dom-measured";
        readonly minimumOpacity: number;
        readonly nearestLeadInCardWidth: number;
        readonly nearestLeadOutCardWidth: number;
        readonly zoneCount: number;
      }
    >
  >;
  readonly clef: {
    readonly assetKey: typeof SCORE_PATH_ORIGIN_REVIEW_ASSET.assetKey;
    readonly count: 1;
    readonly mirrorX: false;
    readonly mirrorY: false;
    readonly rotationDegrees: number;
    readonly scenographicScale: number;
  };
  readonly connectorEventCount: 0;
  readonly continuity: {
    readonly maximumCurvatureDelta: number;
    readonly maximumPointGap: number;
    readonly minimumTangentAlignment: number;
  };
  readonly finalBarlines: Readonly<
    Record<StoryScoreBranch, "thin-gap-thick-and-physical-end">
  >;
  readonly fiveLineContinuity: true;
  readonly maximumNotationTangentAngleDeg: number;
  readonly ordinaryBarlineCount: number;
  readonly pathSelfIntersections: Readonly<Record<StoryScoreBranch, number>>;
  readonly projectSerpentine: {
    readonly connectorEventCount: 0;
    readonly connectorEventCounts: readonly number[];
    readonly maximumShelfTangentAngleDeg: number;
    readonly notationShelfCount: number;
    readonly pathSelfIntersections: 0;
    readonly staffLineSelfIntersections: 0;
    readonly visitAnchors: readonly ScorePathReviewProjectVisit[];
  };
  readonly segmentCount: 6;
  readonly staffLineSelfIntersections: Readonly<
    Record<StoryScoreBranch, number>
  >;
}

export type StoryScoreChapterBarlineClassification =
  | Readonly<{
      ordinaryBarlineRendered: true;
      reason: "VALID_MEASURE_BOUNDARY";
      status: "VALID_MEASURE_BOUNDARY";
    }>
  | Readonly<{
      ordinaryBarlineRendered: false;
      reason: "CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION";
      status: "NOT_A_MEASURE_BOUNDARY";
    }>
  | Readonly<{
      ordinaryBarlineRendered: false;
      reason: "BRANCH_FINAL_BARLINE";
      status: "BRANCH_TERMINAL";
    }>;

export interface StoryScoreProjection {
  readonly branches: Readonly<
    Record<StoryScoreBranch, StoryScoreBranchProjection>
  >;
  readonly evidence: StoryScoreProjectionEvidence;
  readonly height: number;
  readonly mode: StoryScoreProjectionMode;
  readonly resolvedGeometryMode:
    | "horizontal-enhanced"
    | ScorePathReviewMode;
  readonly sectionBlockSizes: Readonly<Record<StoryChapterId, number>>;
  readonly sessionSeed: typeof STORY_SCORE_SESSION_SEED;
  readonly spatialGeometry: StorySpatialTimelineGeometry;
  readonly width: number;
}

function projectSpatialGeometry(
  mode: StoryScoreProjectionMode,
  branch: StoryScoreBranchProjection,
  viewportWidth: number,
  viewportHeight: number,
): StorySpatialTimelineGeometry {
  const horizontal = mode === "horizontal-enhanced";
  const frames = horizontal
    ? horizontalChapterFrames(viewportWidth, viewportHeight).frames
    : null;
  const axisEnd = horizontal ? branch.width : branch.height;
  const viewportExtent = horizontal ? viewportWidth : viewportHeight;
  const travel = Math.max(0, axisEnd - viewportExtent);
  const chapters: StorySpatialProjection["chapters"] = branch.chapters.map(
    (chapter, index) => {
      const start = horizontal ? frames![chapter.chapterId].left : chapter.top;
      const next = branch.chapters[index + 1];
      const end = next
        ? horizontal ? frames![next.chapterId].left : next.top
        : axisEnd;
      const contentStart = horizontal
        ? chapter.contentRect.x
        : chapter.contentRect.y;
      const contentExtent = horizontal
        ? chapter.contentRect.width
        : chapter.contentRect.height;
      const contentEnd = next
        ? Math.min(end - 1, Math.max(start + 1, contentStart + contentExtent))
        : end;
      const contentSpan = { start, end: contentEnd };
      const stationLength = (contentEnd - start) / chapter.reservedReasons.length;
      const stations = chapter.reservedReasons.map((id, stationIndex) => ({
        id,
        span: {
          start: start + stationIndex * stationLength,
          end: start + (stationIndex + 1) * stationLength,
        },
      }));
      const entryAnchor = Math.min(contentEnd - 0.5,
        Math.max(start + 0.5, contentStart));
      const interactionSpans = chapter.chapterId === "professional-contact"
        ? [stations.at(-1)!.span]
        : chapter.chapterId === "professional-projects" && !horizontal
          ? []
          : [contentSpan];

      return {
        chapterId: chapter.chapterId,
        structuralStart: start,
        entryAnchor,
        contentSpan,
        interactionSpans,
        exitTransition: next ? { start: contentEnd, end } : null,
        stations,
      };
    },
  );
  const cameraAt = (coordinate: number) =>
    travel * coordinate / axisEnd;
  const cameraSegments: StorySpatialProjection["cameraSegments"] = horizontal
    ? (() => {
        const contactHold = chapters.find(({ chapterId }) =>
          chapterId === "professional-contact")!.interactionSpans[0]!;
        const holdX = cameraAt(contactHold.start);
        return [
          { kind: "traverse", span: { start: 0, end: contactHold.start }, from: { x: 0, y: 0 }, to: { x: holdX, y: 0 } },
          { kind: "local-hold", span: contactHold, from: { x: holdX, y: 0 }, to: { x: holdX, y: 0 } },
          { kind: "traverse", span: { start: contactHold.end, end: axisEnd }, from: { x: holdX, y: 0 }, to: { x: travel, y: 0 } },
        ];
      })()
    : chapters.flatMap((chapter) => {
        const y = (coordinate: number) => cameraAt(coordinate);
        return [
          { kind: "local-hold" as const, span: chapter.contentSpan,
            from: { x: 0, y: y(chapter.contentSpan.start) },
            to: { x: 0, y: y(chapter.contentSpan.end) } },
          ...(chapter.exitTransition ? [{ kind: "traverse" as const,
            span: chapter.exitTransition,
            from: { x: 0, y: y(chapter.exitTransition.start) },
            to: { x: 0, y: y(chapter.exitTransition.end) } }] : []),
        ];
      });

  return projectStoryTimelineGeometry({
    chapters,
    cameraSegments,
    nativeScrollSpan: { start: 0, end: travel },
    trackWidth: horizontal ? branch.width : viewportWidth,
    viewportWidth,
  });
}

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;
const HORIZONTAL_MIN_CHAPTER_WIDTH = 736;
const HORIZONTAL_ORIGIN_CLEARANCE = 960;
const HORIZONTAL_STAFF_SPACE = 12;
export const STORY_SCORE_SCENOGRAPHIC_CLEF_SCALE = Object.freeze({
  "horizontal-enhanced": 3.6,
  "vertical-compact": 2,
  "vertical-wide": 2.6,
} as const);
export const STORY_SCORE_CARD_INTERACTION = Object.freeze({
  id: "CARD_SCORE_INTERACTION",
  maximumStaffSpread: 2.35,
  opacity: 0.34,
} as const);
const CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION = Object.freeze({
  ordinaryBarlineRendered: false as const,
  reason: "CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION" as const,
  status: "NOT_A_MEASURE_BOUNDARY" as const,
});
const BRANCH_FINAL_BARLINE = Object.freeze({
  ordinaryBarlineRendered: false as const,
  reason: "BRANCH_FINAL_BARLINE" as const,
  status: "BRANCH_TERMINAL" as const,
});

/**
 * Composer v1 defines deterministic slots and motif durations, but no meter,
 * time signature, measure grid, or chapter-boundary timing. A visual chapter
 * exit therefore cannot be promoted to a metric barline without a later
 * composition decision. Branch terminals keep their separate final-barline
 * contract.
 */
export const STORY_SCORE_CHAPTER_BARLINES = Object.freeze({
  home: CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-about": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-services": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-process": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-projects": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-contact": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "professional-terminal": BRANCH_FINAL_BARLINE,
} satisfies Readonly<
  Record<StoryChapterId, StoryScoreChapterBarlineClassification>
>);
const PROJECTION_CACHE = new Map<string, StoryScoreProjection>();



function clampViewport(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(320, Math.round(value!));
}

function sceneMeasurementCacheKey(
  measurements: StoryScoreSceneMeasurements | undefined,
): string {
  if (!measurements) return "fallback";

  const serialize = (rects: readonly StoryScoreMeasuredRect[] | undefined) =>
    rects?.map(({ height, width, x, y }) =>
      [x, y, width, height].map((value) => Number(value.toFixed(2))),
    ) ?? [];
  const serializeExclusions = (
    rects: readonly StoryScoreMeasuredExclusionRect[] | undefined,
  ) =>
    rects?.map(({ height, reason, width, x, y }) => [
      reason,
      ...[x, y, width, height].map((value) => Number(value.toFixed(2))),
    ]) ?? [];

  return JSON.stringify({
    chapterContentExclusions: Object.fromEntries(
      DESKTOP_TIMELINE_ORDER.map((chapterId) => [
        chapterId,
        serializeExclusions(
          measurements.chapterContentExclusions?.[chapterId],
        ),
      ]),
    ),
    professionalProjectCards: serialize(
      measurements.professionalProjectCards,
    ),
    professionalProjectInteractionEnvelopes:
      measurements.professionalProjectInteractionEnvelopes,
    professionalProjectInteractionSweeps:
      measurements.professionalProjectInteractionSweeps,
    professionalServicesCards: serialize(
      measurements.professionalServicesCards,
    ),
  });
}

function subtract(left: Vec2, right: Vec2): Vec2 {
  return { x: left.x - right.x, y: left.y - right.y };
}

function cross(left: Vec2, right: Vec2): number {
  return left.x * right.y - left.y * right.x;
}

function segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
  const abC = cross(subtract(b, a), subtract(c, a));
  const abD = cross(subtract(b, a), subtract(d, a));
  const cdA = cross(subtract(d, c), subtract(a, c));
  const cdB = cross(subtract(d, c), subtract(b, c));

  return abC * abD < -1e-7 && cdA * cdB < -1e-7;
}

function polylineSelfIntersections(points: readonly Vec2[]): number {
  let count = 0;

  for (let left = 0; left < points.length - 1; left += 1) {
    for (let right = left + 4; right < points.length - 1; right += 1) {
      const leftStart = points[left]!;
      const leftEnd = points[left + 1]!;
      const rightStart = points[right]!;
      const rightEnd = points[right + 1]!;
      if (
        Math.max(leftStart.x, leftEnd.x) <
          Math.min(rightStart.x, rightEnd.x) ||
        Math.max(rightStart.x, rightEnd.x) <
          Math.min(leftStart.x, leftEnd.x) ||
        Math.max(leftStart.y, leftEnd.y) <
          Math.min(rightStart.y, rightEnd.y) ||
        Math.max(rightStart.y, rightEnd.y) <
          Math.min(leftStart.y, leftEnd.y)
      ) {
        continue;
      }
      if (
        segmentsIntersect(
          leftStart,
          leftEnd,
          rightStart,
          rightEnd,
        )
      ) {
        count += 1;
      }
    }
  }

  return count;
}

function firstPolylineSelfIntersection(
  points: readonly Vec2[],
): {
  readonly left: number;
  readonly leftEnd: Vec2;
  readonly leftPoint: Vec2;
  readonly right: number;
  readonly rightEnd: Vec2;
  readonly rightPoint: Vec2;
} | null {
  for (let left = 0; left < points.length - 1; left += 1) {
    for (let right = left + 4; right < points.length - 1; right += 1) {
      const leftStart = points[left]!;
      const leftEnd = points[left + 1]!;
      const rightStart = points[right]!;
      const rightEnd = points[right + 1]!;
      if (
        Math.max(leftStart.x, leftEnd.x) <
          Math.min(rightStart.x, rightEnd.x) ||
        Math.max(rightStart.x, rightEnd.x) <
          Math.min(leftStart.x, leftEnd.x) ||
        Math.max(leftStart.y, leftEnd.y) <
          Math.min(rightStart.y, rightEnd.y) ||
        Math.max(rightStart.y, rightEnd.y) <
          Math.min(leftStart.y, leftEnd.y)
      ) {
        continue;
      }
      if (
        segmentsIntersect(
          leftStart,
          leftEnd,
          rightStart,
          rightEnd,
        )
      ) {
        return {
          left,
          leftEnd,
          leftPoint: leftStart,
          right,
          rightEnd,
          rightPoint: rightStart,
        };
      }
    }
  }

  return null;
}

function sampledPath(path: ScorePath, count = 257): readonly Vec2[] {
  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      path.pointAt(index / (count - 1)),
    ),
  );
}

function freezeGeometry(
  geometry: AuthoredTrackGeometry,
): AuthoredTrackGeometry {
  return Object.freeze({
    ...geometry,
    chapters: Object.freeze(geometry.chapters),
    knots: Object.freeze(geometry.knots),
    notationRanges: Object.freeze(geometry.notationRanges),
  });
}

function applyChapterBarlineClassification(
  geometry: AuthoredTrackGeometry,
): AuthoredTrackGeometry {
  return freezeGeometry({
    ...geometry,
    notationRanges: Object.freeze(
      geometry.notationRanges.map((range) =>
        Object.freeze({
          ...range,
          barlineAfter:
            STORY_SCORE_CHAPTER_BARLINES[range.chapterId]
              .ordinaryBarlineRendered,
        }),
      ),
    ),
  });
}

function smoothstep(progress: number): number {
  return progress * progress * (3 - 2 * progress);
}

function horizontalProfessionalBridge(
  start: Vec2,
  target: Vec2,
  servicesDeparture = false,
): readonly Vec2[] {
  const deltaX = target.x - start.x;

  if (deltaX <= 0) {
    throw new RangeError(
      "The Professional horizontal bridge must advance away from Home",
    );
  }

  return Object.freeze(
    [0.18, 0.38, 0.62, 0.82].map((progress) =>
      Object.freeze({
        x: start.x + deltaX * progress,
        y:
          start.y +
          (target.y - start.y) * smoothstep(progress) +
          Math.sin(Math.PI * progress) * 22 -
          // ASM-SI-024: retain a shallow first step leaving Services' short
          // trailing shelf before the existing Process descent resumes.
          (servicesDeparture && progress === 0.18 ? HORIZONTAL_STAFF_SPACE : 0),
      }),
    ),
  );
}

interface HorizontalProfessionalAboutBoundary {
  readonly descentEndX: number;
  readonly originCutoffX: number;
  readonly safeY: number;
}

function horizontalProfessionalAboutBoundaryBridge(
  start: Vec2,
  target: Vec2,
  boundary: HorizontalProfessionalAboutBoundary,
  controlReach = (boundary.descentEndX - start.x) * 0.28,
): readonly Vec2[] {
  const descentWidth = boundary.descentEndX - start.x;

  if (
    descentWidth < HORIZONTAL_STAFF_SPACE * 6 ||
    target.x <= boundary.descentEndX + HORIZONTAL_STAFF_SPACE * 8 ||
    boundary.safeY < target.y - HORIZONTAL_STAFF_SPACE
  ) {
    throw new RangeError(
      `The measured About boundary needs a forward lower corridor: ${JSON.stringify({ boundary, start, target })}`,
    );
  }

  const descent = sampledCubicBridge(
    start,
    Object.freeze({
      x: start.x + controlReach,
      y: start.y,
    }),
    Object.freeze({
      x: boundary.descentEndX - controlReach,
      y: boundary.safeY,
    }),
    Object.freeze({ x: boundary.descentEndX, y: boundary.safeY }),
    9,
  );
  const remainingWidth = target.x - boundary.descentEndX;

  return Object.freeze([
    // ASM-SI-020/021: open the two inner-offset folds while retaining
    // the measured corridor, origin endpoint and About shelf.
    ...descent.map((point, index) => index === 1
      ? Object.freeze({ ...point, x: point.x + HORIZONTAL_STAFF_SPACE / 2 })
      : point),
    Object.freeze({ x: boundary.descentEndX + HORIZONTAL_STAFF_SPACE, y: boundary.safeY }),
    Object.freeze({
      x: boundary.descentEndX + remainingWidth * 0.34,
      y: boundary.safeY,
    }),
    Object.freeze({
      x: boundary.descentEndX + remainingWidth * 0.68,
      y: boundary.safeY + (target.y - boundary.safeY) * 0.5,
    }),
  ]);
}

function measuredAboutBridgeIsRegular(
  knots: readonly Vec2[],
  firstConnectorIndex: number,
  connectorLength: number,
): boolean {
  const path = new ReviewCubicSplineScorePath(knots);
  const halfStroke =
    APPROVED_RENDERER_TOKENS.score.staffLineThicknessSp * HORIZONTAL_STAFF_SPACE / 2;
  const outerInkOffset = HORIZONTAL_STAFF_SPACE * 2 + halfStroke;
  // The guide's right normal has N' = kappa*T. Both outer staff edges must
  // therefore retain 1 + d*kappa > 0 through the B-spline joins, not just
  // through the provisional cubic or its rendered samples.
  for (
    let segment = Math.max(0, firstConnectorIndex - 3);
    segment <= Math.min(path.segmentCount - 1, firstConnectorIndex + connectorLength + 1);
    segment += 1
  ) {
    for (let sample = 0; sample <= 64; sample += 1) {
      const t = (segment + sample / 64) / path.segmentCount;
      if (
        path.tangentAt(t).x <= SCORE_PATH_REVIEW_GEOMETRY_EPSILON ||
        1 - outerInkOffset * Math.abs(path.curvatureAt(t)) <=
          SCORE_PATH_REVIEW_GEOMETRY_EPSILON
      ) return false;
    }
  }
  return true;
}



function sampledCubicBridge(
  start: Vec2,
  control1: Vec2,
  control2: Vec2,
  target: Vec2,
  sampleCount: number,
): readonly Vec2[] {
  return Object.freeze(
    Array.from({ length: sampleCount - 1 }, (_, index) => {
      const progress = (index + 1) / sampleCount;
      const inverse = 1 - progress;

      return Object.freeze({
        x:
          inverse ** 3 * start.x +
          3 * inverse ** 2 * progress * control1.x +
          3 * inverse * progress ** 2 * control2.x +
          progress ** 3 * target.x,
        y:
          inverse ** 3 * start.y +
          3 * inverse ** 2 * progress * control1.y +
          3 * inverse * progress ** 2 * control2.y +
          progress ** 3 * target.y,
      });
    }),
  );
}





function prependApprovedOrigin(
  geometry: AuthoredTrackGeometry,
  mode: ScorePathOriginReviewMode,
  branch: StoryScoreBranch,
  originX: number,
  horizontalOriginY?: number,
  professionalAboutBoundary?: HorizontalProfessionalAboutBoundary,
): AuthoredTrackGeometry {
  const origin = buildProfessionalOriginPath(mode);
  const originPath = origin.path;
  const translateX = originX - origin.origin.x;
  const translateY =
    mode === "horizontal-enhanced"
      ? (horizontalOriginY ?? geometry.height * 0.47) -
        origin.origin.y
      : 54;
  const originSampleCount = 33;
  const sampledOriginPoints = Array.from(
    { length: originSampleCount },
    (_, index) => {
    const point = originPath.pointAt(index / (originSampleCount - 1));
    return Object.freeze({
      x: point.x + translateX,
      y: point.y + translateY,
    });
    },
  );
  const measuredOriginCutIndex =
    mode === "horizontal-enhanced" &&
    professionalAboutBoundary !== undefined
      ? sampledOriginPoints.findLastIndex(
          ({ x }) => x <= professionalAboutBoundary.originCutoffX,
        )
      : sampledOriginPoints.length - 1;
  if (measuredOriginCutIndex < 2) {
    throw new RangeError(
      `The measured About boundary cannot truncate the approved origin safely: ${JSON.stringify({ measuredOriginCutIndex, professionalAboutBoundary })}`,
    );
  }
  const originPoints = sampledOriginPoints.slice(0, measuredOriginCutIndex + 1);
  originPoints[1] = Object.freeze({
    ...originPoints[1]!,
    y: originPoints[0]!.y,
  });
  const cutIndex = Math.max(
        0,
        geometry.notationRanges[1]!.startSegmentIndex -
          (mode === "horizontal-enhanced" ? 1 : 8),
      );
  const downstreamKnots = geometry.knots.slice(cutIndex);
  const departureEnd = originPoints.at(-1)!;
  const target = downstreamKnots[0]!;
  const supportsMeasuredAboutBoundary =
    professionalAboutBoundary !== undefined &&
    professionalAboutBoundary.descentEndX - departureEnd.x >=
      HORIZONTAL_STAFF_SPACE * 6 &&
    target.x >
      professionalAboutBoundary.descentEndX + HORIZONTAL_STAFF_SPACE * 8 &&
    professionalAboutBoundary.safeY >= target.y - HORIZONTAL_STAFF_SPACE;
  let connector =
    mode === "horizontal-enhanced"
        ? !supportsMeasuredAboutBoundary
          ? horizontalProfessionalBridge(departureEnd, target)
          : horizontalProfessionalAboutBoundaryBridge(
              departureEnd,
              target,
              professionalAboutBoundary!,
            )
      : (() => {
          const routeY =
            Math.max(departureEnd.y, target.y) +
            (mode === "vertical-compact" ? 30 : 72);
          const deltaX = target.x - departureEnd.x;
          const departureDirection = 1;
          const turnRadius = mode === "vertical-compact" ? 54 : 118;

          return Object.freeze([
            Object.freeze({
              x:
                departureEnd.x +
                departureDirection * turnRadius * 0.55 +
                (mode === "vertical-compact" ? geometry.staffSpace * 3 : 0),
              // ASM-SI-010: preserve the outgoing origin tangent before descent.
              y: departureEnd.y + (mode === "vertical-compact" ? 0 : 8),
            }),
            Object.freeze({
              x: departureEnd.x + departureDirection * turnRadius,
              y: routeY - 18,
            }),
            Object.freeze({
              x:
                departureEnd.x +
                departureDirection * turnRadius * 0.72 +
                deltaX * 0.34,
              y: routeY,
            }),
            Object.freeze({
              x: departureEnd.x + deltaX * 0.76,
              y: routeY - 12,
            }),
            // ASM-SI-006/007/011..014: approach the leftward About turn
            // from its right; the former wrong-side knot reversed twice.
            Object.freeze({ x: target.x + 36, y: target.y + 16 }),
          ]);
        })();
  if (mode === "horizontal-enhanced" && supportsMeasuredAboutBoundary) {
    const firstConnectorIndex = originPoints.length;
    const fullKnots = () => [...originPoints, ...connector, ...downstreamKnots];
    if (!measuredAboutBridgeIsRegular(fullKnots(), firstConnectorIndex, connector.length)) {
      const boundary = professionalAboutBoundary!;
      const width = boundary.descentEndX - departureEnd.x;
      const rise = Math.abs(boundary.safeY - departureEnd.y);
      const outerInkOffset = HORIZONTAL_STAFF_SPACE * (
        2 + APPROVED_RENDERER_TOKENS.score.staffLineThicknessSp / 2
      );
      // Endpoint curvature of the provisional cubic is 2*rise/(3*reach²).
      // Use this as a measured seed, then check the actual smoothed spline.
      const reach = Math.max(width * 0.28, Math.sqrt(2 * outerInkOffset * rise / 3));
      if (reach >= width) {
        throw new RangeError("The measured About bridge has no forward control reach");
      }
      connector = horizontalProfessionalAboutBoundaryBridge(
        departureEnd, target, boundary, reach,
      );
      if (!measuredAboutBridgeIsRegular(fullKnots(), firstConnectorIndex, connector.length)) {
        throw new RangeError("The measured About bridge folds a visible staff offset");
      }
    }
  }
  const prefix = originPoints.length + connector.length;
  const downstreamRanges = geometry.notationRanges.slice(1);
  const notationRanges = downstreamRanges.map((range) =>
    Object.freeze({
      ...range,
      startSegmentIndex:
        range.startSegmentIndex -
        cutIndex +
        prefix,
      endSegmentIndex: range.endSegmentIndex - cutIndex + prefix,
    }),
  );

  {
    const approvedNotationEndT = origin.notationSafeEndT;
    notationRanges.unshift(
      Object.freeze({
        chapterId: "home" as const,
        startSegmentIndex: 0,
        endSegmentIndex: Math.max(
          3,
          Math.floor(approvedNotationEndT * (originPoints.length - 1)) - 1,
        ),
      }),
    );
  }

  return freezeGeometry({
    ...geometry,
    knots: Object.freeze([
      ...originPoints,
      ...connector,
      ...downstreamKnots,
    ]),
    notationRanges,
  });
}

function verticalGeometry(
  mode: ScorePathReviewMode,
  branch: StoryScoreBranch,
  compactTrackWidth: number,
): AuthoredTrackGeometry {
  const base = buildAuthoredGeometry(
    "organic-flowing",
    mode,
    branch,
    compactTrackWidth,
  );

  return prependApprovedOrigin(base, mode, branch, base.width / 2);
}

interface HorizontalChapterFrame {
  readonly height: number;
  readonly left: number;
  readonly width: number;
}

function horizontalChapterFrames(
  viewportWidth: number,
  viewportHeight: number,
): {
  readonly frames: Readonly<Record<StoryChapterId, HorizontalChapterFrame>>;
  readonly totalWidth: number;
} {
  let left = 0;
  const frames = {} as Record<StoryChapterId, HorizontalChapterFrame>;

  for (const chapterId of DESKTOP_TIMELINE_ORDER) {
    const width = Math.max(
      HORIZONTAL_MIN_CHAPTER_WIDTH,
      MOTION_LAB_DRAFT_CHAPTER_SPANS[chapterId] * viewportWidth,
    );
    frames[chapterId] = Object.freeze({
      height: viewportHeight,
      left,
      width,
    });
    left += width;
  }

  return Object.freeze({ frames: Object.freeze(frames), totalWidth: left });
}

interface HorizontalNotationShelf {
  readonly barlineAfter: boolean;
  readonly connectorInteraction?: "CARD_SCORE_INTERACTION";
  readonly connectorInteractionExpandedY?: number;
  readonly connectorInteractionProfile?: ScorePathReviewInteractionProfile;
  readonly connectorKind?: "project-rise" | "project-valley";
  readonly connectorValleyY?: number;
  readonly points: readonly Vec2[];
  readonly projectVisit?: ScorePathReviewProjectVisit;
  readonly semanticSlotIds: readonly string[];
}

type ProjectShelfMinimumYs = Readonly<
  Partial<Record<1 | 2 | 3, number>>
>;

interface ResolvedSceneCards {
  readonly cards: readonly StoryScoreMeasuredRect[];
  readonly source: "deterministic-fallback" | "dom-measured";
}









interface HorizontalHomeOriginRecipe {
  readonly shelfY: number;
  readonly x: number;
  readonly y: number;
}



function validMeasuredRect(
  rect: StoryScoreMeasuredRect | undefined,
): rect is StoryScoreMeasuredRect {
  return (
    rect !== undefined &&
    Number.isFinite(rect.x) &&
    Number.isFinite(rect.y) &&
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function measuredChapterExclusions(
  measurements: StoryScoreSceneMeasurements | undefined,
  chapterId: StoryChapterId,
): readonly StoryScoreMeasuredExclusionRect[] {
  return (
    measurements?.chapterContentExclusions?.[chapterId]?.filter(
      (rect): rect is StoryScoreMeasuredExclusionRect =>
        validMeasuredRect(rect),
    ) ?? []
  );
}

function measuredChapterBottom(
  measurements: StoryScoreSceneMeasurements | undefined,
  chapterId: StoryChapterId,
): number | undefined {
  const exclusions = measuredChapterExclusions(measurements, chapterId);

  return exclusions.length > 0
    ? Math.max(...exclusions.map((rect) => rect.y + rect.height))
    : undefined;
}

function resolveHorizontalHomeOrigin(
  frame: HorizontalChapterFrame,
  viewportHeight: number,
): HorizontalHomeOriginRecipe {
  // Keep the accepted origin elevation and center both corridors. The Home
  // reading envelope sits below the complete scenic clef, outside both exits.
  return Object.freeze({
    shelfY: viewportHeight * 0.68,
    x: frame.left + frame.width / 2,
    y: viewportHeight * 0.47,
  });
}



function measuredLowerCorridorY(
  chapterId: StoryChapterId,
  measurements: StoryScoreSceneMeasurements | undefined,
  viewportHeight: number,
): number | undefined {
  const contentBottom = measuredChapterBottom(measurements, chapterId);
  if (contentBottom === undefined) return undefined;

  const recipes: Partial<
    Record<
      StoryChapterId,
      { readonly bottomGap: number; readonly viewportGap: number }
    >
  > = {
    // Successor delta 003 reserves an unconstricted return corridor between
    // the protected Benefits content and its complete five-line event shelf.
    "professional-about": { bottomGap: 3.5, viewportGap: 7 },
    "professional-process": { bottomGap: 3.5, viewportGap: 7 },
    "professional-terminal": { bottomGap: 4, viewportGap: 7 },
  };
  const recipe = recipes[chapterId];
  if (!recipe) return undefined;

  return Math.min(
    viewportHeight - HORIZONTAL_STAFF_SPACE * recipe.viewportGap,
    contentBottom + HORIZONTAL_STAFF_SPACE * recipe.bottomGap,
  );
}

function resolveHorizontalProfessionalAboutBoundary(
  measurements: StoryScoreSceneMeasurements | undefined,
  viewportHeight: number,
): HorizontalProfessionalAboutBoundary | undefined {
  const exclusions = measuredChapterExclusions(
    measurements,
    "professional-about",
  );
  const heading = exclusions.filter(
    ({ reason }) => reason === "heading-and-body",
  );
  const persona = exclusions.filter(
    ({ reason }) => reason === "persona-slot",
  );
  const safeY = measuredLowerCorridorY(
    "professional-about",
    measurements,
    viewportHeight,
  );
  if (heading.length === 0 || persona.length === 0 || safeY === undefined) {
    return undefined;
  }

  const contentLeft = Math.min(...heading.map(({ x }) => x));

  return Object.freeze({
    descentEndX: contentLeft - HORIZONTAL_STAFF_SPACE * 4,
    originCutoffX: contentLeft - HORIZONTAL_STAFF_SPACE * 12,
    safeY,
  });
}



function fallbackSceneCards(
  chapterId:
    | "professional-projects"
    | "professional-services",
  frame: HorizontalChapterFrame,
  viewportHeight: number,
): readonly StoryScoreMeasuredRect[] {
  const count =
    chapterId === "professional-services"
      ? 4
      : 3;
  const bounds =
    chapterId === "professional-projects"
      ? { end: 0.86, start: 0.36 }
      : { end: 0.78, start: 0.3 };
  const totalWidth = frame.width * (bounds.end - bounds.start);
  const gap = chapterId === "professional-projects" ? 16 : 12;
  const cardWidth =
    (totalWidth - gap * (count - 1)) / count;
  const top =
    chapterId === "professional-projects"
      ? viewportHeight * 0.176
      : chapterId === "professional-services"
        ? viewportHeight * 0.59
        : viewportHeight * 0.61;
  const height =
    chapterId === "professional-projects"
      ? viewportHeight * 0.66
      : chapterId === "professional-services"
        ? viewportHeight * 0.29
        : viewportHeight * 0.2;

  return Object.freeze(
    Array.from({ length: count }, (_, index) =>
      Object.freeze({
        height,
        width: cardWidth,
        x:
          frame.left +
          frame.width * bounds.start +
          index * (cardWidth + gap),
        y: top,
      }),
    ),
  );
}

function resolveSceneCards(
  chapterId:
    | "professional-projects"
    | "professional-services",
  frame: HorizontalChapterFrame,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
): ResolvedSceneCards {
  const measured =
    chapterId === "professional-services"
      ? measurements?.professionalServicesCards
      : measurements?.professionalProjectCards;
  const expectedCount =
    chapterId === "professional-services"
      ? 4
      : 3;
  const valid = measured
    ?.filter(validMeasuredRect)
    .slice(0, expectedCount)
    .sort((left, right) => left.x - right.x);

  if (valid?.length === expectedCount) {
    return Object.freeze({
      cards: Object.freeze(valid.map((rect) => Object.freeze({ ...rect }))),
      source: "dom-measured" as const,
    });
  }

  return Object.freeze({
    cards: fallbackSceneCards(chapterId, frame, viewportHeight),
    source: "deterministic-fallback" as const,
  });
}

function horizontalShelfPoints(
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  waveAmplitude = 1.5,
): readonly Vec2[] {
  return Object.freeze(
    Array.from({ length: 8 }, (_, index) => {
      const progress = index / 7;
      return Object.freeze({
        x: startX + (endX - startX) * progress,
        y:
          startY +
          (endY - startY) * progress +
          Math.sin(progress * Math.PI * 2) * waveAmplitude,
      });
    }),
  );
}

function horizontalChapterY(
  chapterId: StoryChapterId,
  viewportHeight: number,
): number {
  const ratio: Readonly<Record<StoryChapterId, number>> = {
    home: 0.68,
    "professional-about": 0.84,
    "professional-services": 0.69,
    "professional-process": 0.8,
    "professional-projects": 0.36,
    "professional-contact": 0.9,
    "professional-terminal": 0.84,
  };

  return viewportHeight * ratio[chapterId];
}

function horizontalChapterShelves(
  frame: HorizontalChapterFrame,
  chapterId: StoryChapterId,
  chapterIndex: number,
  originX: number,
  homeShelfY: number | undefined,
  viewportHeight: number,
  semanticSlotIds: readonly string[],
  measurements: StoryScoreSceneMeasurements | undefined,
  projectShelfMinimumYs?: ProjectShelfMinimumYs,
): readonly HorizontalNotationShelf[] {
  const padding = Math.min(132, frame.width * 0.14);
  const midpoint = frame.left + frame.width / 2;
  const authoredStartX =
    chapterIndex === 0 ? midpoint + padding * 0.35 : frame.left + padding;
  const authoredEndX = frame.left + frame.width - padding;
  const unadjustedStartX =
    chapterIndex === 1
      ? Math.max(authoredStartX, originX + HORIZONTAL_ORIGIN_CLEARANCE)
      : authoredStartX;
  const maximumEndX = frame.left + frame.width - padding;
  const startX = Math.min(unadjustedStartX, maximumEndX - 48);
  const endX = Math.min(
    maximumEndX,
    Math.max(authoredEndX, startX + HORIZONTAL_STAFF_SPACE * 8),
  );
  const measuredCorridorY = measuredLowerCorridorY(
    chapterId,
    measurements,
    viewportHeight,
  );
  const baseY =
    (chapterId === "home" ? homeShelfY : undefined) ??
    measuredCorridorY ??
    horizontalChapterY(chapterId, viewportHeight);
  const descent = Math.min(14, viewportHeight * 0.016);
  const standardShelf: HorizontalNotationShelf = Object.freeze({
    barlineAfter: true,
    points: horizontalShelfPoints(startX, endX, baseY, baseY + descent, -1.5),
    semanticSlotIds: Object.freeze([...semanticSlotIds]),
  });

  if (chapterId === "professional-services") {
    const { cards, source } = resolveSceneCards(
      chapterId,
      frame,
      viewportHeight,
      measurements,
    );
    const firstCard = cards[0]!;
    const lastCard = cards.at(-1)!;
    const entryCard = firstCard;
    const exitCard = lastCard;
    const firstCardX = firstCard.x;
    const lastCardEndX = lastCard.x + lastCard.width;
    const leadInLength = Math.max(
      HORIZONTAL_STAFF_SPACE * 8,
      entryCard.width * 0.25,
    );
    const leadOutLength = Math.max(
      HORIZONTAL_STAFF_SPACE * 8,
      exitCard.width * 0.25,
    );
    const expandedWidth = lastCardEndX - firstCardX;
    const interactionWidth =
      leadInLength + expandedWidth + leadOutLength;
    const fallbackInteractionY = Math.min(
      viewportHeight * 0.78,
      Math.max(
        viewportHeight * 0.68,
        cards.reduce(
          (sum, card) => sum + card.y + card.height / 2,
          0,
        ) / cards.length,
      ),
    );
    const measuredCardCenterY =
      cards.reduce(
        (sum, card) => sum + card.y + card.height / 2,
        0,
      ) / cards.length;
    const expandedY = measuredCardCenterY;
    const headingBottom = measurements?.chapterContentExclusions?.[
      chapterId
    ]
      ?.filter(
        (rect) =>
          rect.reason === "heading-and-body" && validMeasuredRect(rect),
      )
      .reduce(
        (maximum, rect) => Math.max(maximum, rect.y + rect.height),
        Number.NEGATIVE_INFINITY,
      );
    const canonicalGap = HORIZONTAL_STAFF_SPACE * 4;
    const canonicalY = Number.isFinite(headingBottom)
      ? Math.min(
          viewportHeight - HORIZONTAL_STAFF_SPACE * 3,
          headingBottom! + canonicalGap,
        )
      : fallbackInteractionY;
    // Keep the centerline migration inset behind each complete edge card.
    // Staff spread and opacity still transform through the visible outer leads.
    const firstCardEntryLength = entryCard.width;
    const lastCardExitLength = exitCard.width;
    const firstCardMigrationInset = Math.min(
      HORIZONTAL_STAFF_SPACE * 2,
      firstCardEntryLength * 0.12,
    );
    const lastCardMigrationInset = Math.min(
      HORIZONTAL_STAFF_SPACE * 2,
      lastCardExitLength * 0.12,
    );
    const interactionProfile = Object.freeze({
      cardCount: cards.length,
      expandedFraction:
        (expandedWidth - firstCardEntryLength - lastCardExitLength) /
        interactionWidth,
      firstCardStartFraction:
        (leadInLength + firstCardMigrationInset) / interactionWidth,
      leadInFraction:
        (leadInLength + firstCardEntryLength) / interactionWidth,
      leadOutFraction:
        (leadOutLength + lastCardExitLength) / interactionWidth,
      lastCardEndFraction:
        1 -
        (leadOutLength + lastCardMigrationInset) / interactionWidth,
      measurementSource: source,
      nearestLeadInCardWidth: entryCard.width,
      nearestLeadOutCardWidth: exitCard.width,
    });
    const interactionStartX = firstCardX - leadInLength;
    const interactionEndX = lastCardEndX + leadOutLength;

    const preShelfStartX = Math.min(
      frame.left + frame.width * 0.08,
      interactionStartX - 132,
    );
    const postShelfEndX = Math.max(
      interactionEndX + 24,
      Math.min(
        frame.left + frame.width * 0.98,
        interactionEndX + 72,
      ),
    );

    return Object.freeze([
      Object.freeze({
        barlineAfter: false,
        points: horizontalShelfPoints(
          preShelfStartX,
          interactionStartX,
          canonicalY - descent * 0.45,
          canonicalY,
        ),
        semanticSlotIds: Object.freeze([...semanticSlotIds]),
      }),
      Object.freeze({
        barlineAfter: true,
        connectorInteraction: "CARD_SCORE_INTERACTION" as const,
        connectorInteractionExpandedY: expandedY,
        connectorInteractionProfile: interactionProfile,
        points: horizontalShelfPoints(
          interactionEndX,
          postShelfEndX,
          fallbackInteractionY,
          fallbackInteractionY + descent * 0.45,
          // ASM-SI-022/023: the short trailing shelf cannot carry an offset
          // sinusoidal fold. Keep its endpoints and straight inclination.
          0,
        ),
        semanticSlotIds: Object.freeze([]),
      }),
    ]);
  }

  if (chapterId === "professional-projects") {
    const { cards, source } = resolveSceneCards(
      chapterId,
      frame,
      viewportHeight,
      measurements,
    );
    const [primarySlot, reservedSlot] = semanticSlotIds;
    const anchors = cards.map((card, index) => {
      const projectIndex = (index + 1) as 1 | 2 | 3;
      const authoredY = card.y + card.height + HORIZONTAL_STAFF_SPACE * 3.5;
      const minimumY = projectShelfMinimumYs?.[projectIndex];
      const authoredCapY =
        viewportHeight - HORIZONTAL_STAFF_SPACE * 7;
      const completeInkCapY =
        viewportHeight - HORIZONTAL_STAFF_SPACE * 3;
      return Object.freeze({
        x: card.x + card.width / 2,
        y:
          minimumY === undefined || minimumY > completeInkCapY
            ? Math.min(authoredCapY, authoredY)
            : Math.max(
                Math.min(authoredCapY, authoredY),
                minimumY,
              ),
      });
    });
    const valleyY = Math.min(
      viewportHeight - HORIZONTAL_STAFF_SPACE * 3,
      Math.max(...anchors.map(({ y }) => y)) + HORIZONTAL_STAFF_SPACE * 3,
    );

    return Object.freeze(
      cards.map((card, index) => {
        const projectIndex = (index + 1) as 1 | 2 | 3;
        const anchor = anchors[index]!;
        const halfShelfWidth = Math.max(
          64,
          Math.min(90, card.width * 0.24),
        );
        const slotIds =
          index === 0 && primarySlot !== undefined
            ? [primarySlot]
            : index === 1 && reservedSlot !== undefined
              ? [reservedSlot]
              : [];

        return Object.freeze({
          barlineAfter: index === cards.length - 1,
          connectorKind:
            index === 0
              ? ("project-rise" as const)
              : ("project-valley" as const),
          connectorValleyY: valleyY,
          points: horizontalShelfPoints(
            anchor.x - halfShelfWidth,
            anchor.x + halfShelfWidth,
            anchor.y,
            anchor.y + 1,
            0.45,
          ),
          projectVisit: Object.freeze({
            anchor,
            cardRect: Object.freeze({ ...card }),
            measurementSource: source,
            projectIndex,
          }),
          semanticSlotIds: Object.freeze(slotIds),
        });
      }),
    );
  }

  return Object.freeze([standardShelf]);
}

function horizontalProjectConnector(
  start: Vec2,
  target: Vec2,
  valleyY: number,
  kind: "project-rise" | "project-valley",
): readonly Vec2[] {
  const deltaX = target.x - start.x;
  if (deltaX <= 0) {
    throw new RangeError("Project connectors must progress left-to-right");
  }
  const sampleCount = kind === "project-rise" ? 15 : 25;

  return Object.freeze(
    Array.from({ length: sampleCount - 1 }, (_, index) => {
      const progress = (index + 1) / sampleCount;
      const eased = smoothstep(progress);
      const baseline = start.y + (target.y - start.y) * eased;
      const valleyInfluence =
        kind === "project-rise"
          ? Math.sin(Math.PI * progress) ** 2 * 0.08
          : Math.sin(Math.PI * progress) ** 2;

      return Object.freeze({
        x: start.x + deltaX * progress,
        y: baseline + (valleyY - baseline) * valleyInfluence,
      });
    }),
  );
}

function horizontalCardInteractionBridge(
  start: Vec2,
  target: Vec2,
  profile: ScorePathReviewInteractionProfile,
  expandedY: number,
  direction: "left-to-right" | "right-to-left" = "left-to-right",
): readonly Vec2[] {
  const deltaX = target.x - start.x;
  const hasRequiredDirection =
    direction === "left-to-right"
      ? deltaX >= HORIZONTAL_STAFF_SPACE * 8
      : deltaX <= -HORIZONTAL_STAFF_SPACE * 8;

  if (!hasRequiredDirection) {
    throw new RangeError(
      `Card interaction bridges need a full measured ${direction} traversal corridor`,
    );
  }

  return Object.freeze(
    Array.from({ length: 64 }, (_, index) => {
      const progress = (index + 1) / 65;
      const leadOutStart = 1 - profile.leadOutFraction;
      const firstCardStart =
        profile.firstCardStartFraction ?? profile.leadInFraction;
      const lastCardEnd =
        profile.lastCardEndFraction ?? leadOutStart;
      const interactionProgress =
        progress < profile.leadInFraction
          ? (progress / profile.leadInFraction) ** 3
          : progress > leadOutStart
            ? ((1 - progress) / profile.leadOutFraction) ** 3
            : 1;
      const canonicalY =
        start.y + (target.y - start.y) * smoothstep(progress);
      const verticalProgress =
        progress < firstCardStart
          ? 0
          : progress < profile.leadInFraction
            ? smoothstep(
                (progress - firstCardStart) /
                  (profile.leadInFraction - firstCardStart),
              )
            : progress <= leadOutStart
              ? 1
              : progress < lastCardEnd
                ? smoothstep(
                    (lastCardEnd - progress) /
                      (lastCardEnd - leadOutStart),
                  )
                : 0;

      return Object.freeze({
        x: start.x + deltaX * progress,
        y:
          canonicalY +
          (expandedY - canonicalY) * verticalProgress +
          Math.sin(Math.PI * progress * 2) * 1.5 * interactionProgress,
      });
    }),
  );
}

function pushHorizontalConnector(
  knots: Vec2[],
  target: Vec2,
  viewportHeight: number,
  targetChapterId: StoryChapterId,
  connectorKind?: HorizontalNotationShelf["connectorKind"],
  connectorValleyY?: number,
  connectorInteraction?: HorizontalNotationShelf["connectorInteraction"],
  connectorInteractionExpandedY?: number,
  connectorInteractionProfile?: ScorePathReviewInteractionProfile,
): void {
  const start = knots.at(-1)!;

  knots.push(
    ...(connectorInteraction
      ? horizontalCardInteractionBridge(
          start,
          target,
          connectorInteractionProfile!,
          connectorInteractionExpandedY!,
        )
      : connectorKind
      ? horizontalProjectConnector(
          start,
          target,
          connectorValleyY ?? viewportHeight * 0.72,
          connectorKind,
        )
      : horizontalProfessionalBridge(start, target, targetChapterId === "professional-process")),
  );
}

function horizontalGeometry(
  branch: StoryScoreBranch,
  viewportWidth: number,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
  projectShelfMinimumYs?: ProjectShelfMinimumYs,
): AuthoredTrackGeometry {
  const { frames, totalWidth } = horizontalChapterFrames(
    viewportWidth,
    viewportHeight,
  );
  const chapterIds = STORY_SCORE_BRANCH_CHAPTERS[branch];
  const chapters = chapterIds.map((chapterId) => {
    const frame = frames[chapterId];
    const reservedReasons = {
      home: ["heading-and-body"],
      "professional-about": ["heading-and-body", "persona-slot"],
      "professional-services": ["heading-and-body", "services-modules"],
      "professional-process": ["heading-and-body", "process-stages"],
      "professional-projects": ["heading-and-body", "project-card-fan"],
      "professional-contact": ["heading-and-body", "contact-form"],
      "professional-terminal": ["terminal-content"],
    } satisfies Readonly<
      Record<StoryChapterId, readonly ScorePathReservedContentReason[]>
    >;
    return Object.freeze({
      chapterId,
      contentRect: Object.freeze({
        x: chapterId === "home" ? frame.left + (frame.width - Math.min(672, frame.width * 0.8)) / 2 : frame.left + frame.width * 0.1,
        y: chapterId === "home" ? viewportHeight * 0.47 + 96 : viewportHeight * 0.08,
        width: chapterId === "home" ? Math.min(672, frame.width * 0.8) : frame.width * 0.8,
        height: chapterId === "home" ? 224 :
          viewportHeight *
          (chapterId === "professional-contact" ? 0.72 : 0.62),
      }),
      height: viewportHeight,
      reservedReasons: Object.freeze([...reservedReasons[chapterId]]),
      top: 0,
    });
  });
  const measuredHomeOrigin = resolveHorizontalHomeOrigin(
    frames.home,
    viewportHeight,
  );
  const professionalAboutBoundary = resolveHorizontalProfessionalAboutBoundary(
    measurements,
    viewportHeight,
  );
  const originX =
    measuredHomeOrigin?.x ?? frames.home.left + frames.home.width / 2;
  const originY = measuredHomeOrigin?.y ?? viewportHeight * 0.47;
  const allSlotIds = [
    ...STORY_SCORE_COMPOSITIONS[branch].motifs.map(({ slotId }) => slotId),
    ...STORY_SCORE_COMPOSITIONS[branch].emptySlots.map(({ slotId }) => slotId),
  ];
  const shelves = chapters.flatMap((chapter, index) =>
    horizontalChapterShelves(
      frames[chapter.chapterId],
      chapter.chapterId,
      index,
      originX,
      measuredHomeOrigin?.shelfY,
      viewportHeight,
      allSlotIds.filter((slotId) =>
        slotId.startsWith(`${chapter.chapterId}:`),
      ),
      measurements,
      projectShelfMinimumYs,
    ).map((shelf) => Object.freeze({ chapterId: chapter.chapterId, shelf })),
  );

  const knots: Vec2[] = [];
  const notationRanges: Array<{
    readonly barlineAfter?: boolean;
    readonly chapterId: StoryChapterId;
    readonly connectorInteraction?: "CARD_SCORE_INTERACTION";
    readonly connectorInteractionProfile?: ScorePathReviewInteractionProfile;
    readonly endSegmentIndex: number;
    readonly projectVisit?: ScorePathReviewProjectVisit;
    readonly semanticSlotIds?: readonly string[];
    readonly startSegmentIndex: number;
  }> = [];

  shelves.forEach(({ chapterId, shelf }, index) => {
    if (index > 0) {
      pushHorizontalConnector(
        knots,
        shelf.points[0]!,
        viewportHeight,
        chapterId,
        shelf.connectorKind,
        shelf.connectorValleyY,
        shelf.connectorInteraction,
        shelf.connectorInteractionExpandedY,
        shelf.connectorInteractionProfile,
      );
    }

    const startKnotIndex = knots.length;
    knots.push(...shelf.points);
    notationRanges.push(
      Object.freeze({
        barlineAfter: shelf.barlineAfter,
        chapterId,
        ...(shelf.connectorInteraction
          ? { connectorInteraction: shelf.connectorInteraction }
          : {}),
        ...(shelf.connectorInteractionProfile
          ? {
              connectorInteractionProfile:
                shelf.connectorInteractionProfile,
            }
          : {}),
        ...(shelf.projectVisit ? { projectVisit: shelf.projectVisit } : {}),
        startSegmentIndex: index === 0 ? 0 : startKnotIndex + 1,
        endSegmentIndex:
          index === shelves.length - 1
            ? -1
            : startKnotIndex + shelf.points.length - 2,
        semanticSlotIds: shelf.semanticSlotIds,
      }),
    );
  });

  notationRanges[notationRanges.length - 1] = Object.freeze({
    ...notationRanges.at(-1)!,
    endSegmentIndex: knots.length - 1,
  });

  const geometry = freezeGeometry({
    chapters: Object.freeze(chapters),
    height: viewportHeight,
    knots: Object.freeze(knots.map((point) => Object.freeze(point))),
    notationRanges: Object.freeze(notationRanges),
    staffSpace: HORIZONTAL_STAFF_SPACE,
    width: totalWidth,
  });

  return prependApprovedOrigin(
    geometry,
    "horizontal-enhanced",
    branch,
    originX,
    originY,
    professionalAboutBoundary,
  );
}

interface CardInteractionState {
  readonly phase:
    | "canonical"
    | "expanded"
    | "post-transition"
    | "pre-transition";
  readonly progress: number;
}

function cardInteractionState(
  t: number,
  zones: readonly ScorePathReviewZone[],
): CardInteractionState {
  let current: CardInteractionState = Object.freeze({
    phase: "canonical",
    progress: 0,
  });

  for (const zone of zones) {
    if (
      zone.interactionId !== STORY_SCORE_CARD_INTERACTION.id ||
      t < zone.startT ||
      t > zone.endT
    ) {
      continue;
    }
    const local = (t - zone.startT) / (zone.endT - zone.startT);
    const transformStart =
      zone.interactionProfile?.transformStartFraction ?? 0;
    const transformEnd =
      zone.interactionProfile?.transformEndFraction ?? 1;

    if (local < transformStart || local > transformEnd) continue;

    const interactionLocal =
      (local - transformStart) / (transformEnd - transformStart);
    const leadIn = zone.interactionProfile?.leadInFraction ?? 0.24;
    const leadOut = zone.interactionProfile?.leadOutFraction ?? 0.24;
    const leadOutStart = 1 - leadOut;
    const state: CardInteractionState =
      interactionLocal < leadIn
        ? Object.freeze({
            phase: "pre-transition" as const,
            progress: (interactionLocal / leadIn) ** 3,
          })
        : interactionLocal > leadOutStart
          ? Object.freeze({
              phase: "post-transition" as const,
              progress: ((1 - interactionLocal) / leadOut) ** 3,
            })
          : Object.freeze({
              phase: "expanded" as const,
              progress: 1,
            });

    if (state.progress >= current.progress) current = state;
  }

  return current;
}

function interactionProgress(
  t: number,
  zones: readonly ScorePathReviewZone[],
): number {
  return cardInteractionState(t, zones).progress;
}


function splitInteractionStaffLine(
  line: PolylineRenderPrimitive,
  zones: readonly ScorePathReviewZone[],
): readonly PolylineRenderPrimitive[] {
  const opacitySteps = 32;
  const runs: PolylineRenderPrimitive[] = [];
  let currentKey = "canonical:0";
  let currentOpacity: number | undefined;
  let currentPhase: CardInteractionState["phase"] = "canonical";
  let currentPoints: Vec2[] = [];

  const commit = () => {
    if (currentPoints.length < 2) return;
    runs.push(
      Object.freeze({
        ...line,
        id:
          currentPhase === "canonical"
            ? `${line.id}:canonical:${runs.length + 1}`
            : `${line.id}:card-score-interaction:${currentPhase}:${runs.length + 1}`,
        ...(currentOpacity === undefined ? {} : { opacity: currentOpacity }),
        points: Object.freeze(currentPoints),
      }),
    );
  };

  line.points.forEach((point, index) => {
    const t = index / (line.points.length - 1);
    const state = cardInteractionState(t, zones);
    const opacityBucket = Math.round(state.progress * opacitySteps);
    const key = `${state.phase}:${opacityBucket}`;

    if (index > 0 && key !== currentKey) {
      const boundary = currentPoints.at(-1)!;
      commit();
      currentPoints = [boundary];
    }
    currentKey = key;
    currentPhase = state.phase;
    currentOpacity =
      state.phase === "canonical"
        ? undefined
        : 1 -
          (1 - STORY_SCORE_CARD_INTERACTION.opacity) *
            (opacityBucket / opacitySteps);
    currentPoints.push(point);
  });
  commit();

  return Object.freeze(runs);
}

function choreographModel(
  model: ScoreRenderModel,
  path: ReviewCubicSplineScorePath,
  zones: readonly ScorePathReviewZone[],
  mode: "horizontal-enhanced" | ScorePathReviewMode,
  staffSpace: number,
): ScoreRenderModel {
  const interactionZones = zones.filter(
    ({ interactionId }) =>
      interactionId === STORY_SCORE_CARD_INTERACTION.id,
  );
  const spreadLines = model.staff.lines.map((line) =>
    Object.freeze({
      ...line,
      points: Object.freeze(
        line.points.map((point, index) => {
          const t = index / (line.points.length - 1);
          const progress = interactionProgress(t, interactionZones);
          if (progress === 0) return point;
          const center = path.pointAt(t);
          const spread =
            1 +
            (STORY_SCORE_CARD_INTERACTION.maximumStaffSpread - 1) * progress;

          return Object.freeze({
            x: center.x + (point.x - center.x) * spread,
            y: center.y + (point.y - center.y) * spread,
          });
        }),
      ),
    }),
  );
  const scale = STORY_SCORE_SCENOGRAPHIC_CLEF_SCALE[mode];
  const transformPrimitive = (
    primitive: ScoreRenderPrimitive,
  ): ScoreRenderPrimitive => {
    if (primitive.kind === "polyline" && primitive.role === "staff-line") {
      const lineIndex = model.staff.lines.findIndex(
        ({ id }) => id === primitive.id,
      );
      return spreadLines[lineIndex] ?? primitive;
    }
    if (primitive.kind !== "glyph" || primitive.role !== "clef") {
      return primitive;
    }

    return Object.freeze({
      ...primitive,
      anchorTarget: Object.freeze({
        x: primitive.anchorTarget.x,
        y:
          primitive.anchorTarget.y -
          (mode === "horizontal-enhanced" ? staffSpace * 5 : staffSpace * 1.5),
      }),
      height: primitive.height * scale,
      width: primitive.width * scale,
    });
  };
  const layers: readonly RenderLayer[] = model.layers.map((layer) => {
    if (layer.id === "staff") {
      return Object.freeze({
        ...layer,
        primitives: Object.freeze(
          spreadLines.flatMap((line) =>
            interactionZones.length > 0
              ? splitInteractionStaffLine(line, interactionZones)
              : [line],
          ),
        ),
      });
    }

    return Object.freeze({
      ...layer,
      primitives: Object.freeze(layer.primitives.map(transformPrimitive)),
    });
  });

  return Object.freeze({
    ...model,
    layers: Object.freeze(layers),
    primitives: Object.freeze(layers.flatMap(({ primitives }) => primitives)),
    staff: Object.freeze({
      ...model.staff,
      lines: Object.freeze(spreadLines),
    }),
  });
}

function buildBranchProjectionAttempt(
  mode: "horizontal-enhanced" | ScorePathReviewMode,
  branch: StoryScoreBranch,
  viewportWidth: number,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
  projectShelfMinimumYs?: ProjectShelfMinimumYs,
): StoryScoreBranchProjection {
  const authoredGeometry =
    mode === "horizontal-enhanced"
      ? horizontalGeometry(
          branch,
          viewportWidth,
          viewportHeight,
          measurements,
          projectShelfMinimumYs,
        )
      : verticalGeometry(mode, branch, viewportWidth);
  const geometry = applyChapterBarlineClassification(authoredGeometry);
  const path = new ReviewCubicSplineScorePath(geometry.knots);
  const composition = STORY_SCORE_COMPOSITIONS[branch];
  const authoredZones = buildZones(path, geometry, composition);
  const firstNotationZone = authoredZones.find(
    ({ kind }) => kind === "notation-safe",
  );

  if (!firstNotationZone) {
    throw new RangeError("Task 34 requires an event-free approved origin departure");
  }
  const modelOptions = {
    clef: true, clefT: 0, keySignature: true,
    keySignatureT: firstNotationZone.startT + (firstNotationZone.endT - firstNotationZone.startT) * 0.12,
    staffSampleCount: 1025,
  };
  let structuralStartT: number | undefined;
  {
    // Measure the existing approved structural ink at its rendered scenic scale.
    // A short Home shelf may remain event-free; Composer groups continue later.
    const structuralModel = choreographModel(buildReviewModel(
      "stage-1-structural-footprint", path, geometry.staffSpace, authoredZones, composition,
      { ...modelOptions, motifPlacements: [], staffSampleCount: 2 },
    ), path, authoredZones, mode, geometry.staffSpace);
    const maximumX = Math.max(...structuralModel.primitives.filter(({ role }) =>
      role === "clef" || role === "key-signature").flatMap(eventPrimitiveFootprintPoints).map(({ x }) => x));
    let left = firstNotationZone.startT;
    let right = firstNotationZone.endT;
    for (let iteration = 0; iteration < 40; iteration += 1) {
      const middle = (left + right) / 2;
      if (path.pointAt(middle).x < maximumX) left = middle;
      else right = middle;
    }
    structuralStartT = Math.max(right, Math.min(firstNotationZone.endT, 16 / path.segmentCount));
  }
  const allocation = allocateEventSafePlacements({
    path, staffSpace: geometry.staffSpace, zones: authoredZones, composition,
    ...(structuralStartT === undefined ? {} : { structuralStartT }),
  });
  const zones = allocation.zones;
  const baseModel = buildReviewModel(
    `phase-9-task-34:${mode}:${branch}`,
    path,
    geometry.staffSpace,
    zones,
    composition,
    { ...modelOptions, motifPlacements: allocation.motifs },
  );
  const model = choreographModel(
    baseModel,
    path,
    zones,
    mode,
    geometry.staffSpace,
  );
  const firstEvent = allocation.diagnostics.groups[0]!;
  const entryT = Math.min(8 / path.segmentCount, firstEvent.marginStartT / 2);
  const entryPoint = path.pointAt(entryT);
  const entryNormal = path.normalAt(entryT);
  const homeEntry = Object.freeze({
    t: entryT,
    point: Object.freeze(entryPoint),
    tangent: Object.freeze(path.tangentAt(entryT)),
    staffPoints: Object.freeze(Array.from({ length: 5 }, (_, index) => Object.freeze({
      x: entryPoint.x + entryNormal.x * (index - 2) * geometry.staffSpace,
      y: entryPoint.y + entryNormal.y * (index - 2) * geometry.staffSpace,
    }))),
    eventFreeLeadIn: Object.freeze({ startT: 0 as const, endT: firstEvent.marginStartT }),
  });

  return Object.freeze({
    branch,
    chapters: geometry.chapters,
    composition,
    eventSafety: allocation.diagnostics,
    height: geometry.height,
    homeEntry,
    model,
    path,
    semanticSegmentIds: Object.freeze(
      STORY_SCORE_SEGMENTS.filter((segment) => segment.branch === branch).map(
        ({ chapterId }) => chapterId,
      ),
    ),
    staffSpace: geometry.staffSpace,
    viewBox: `0 0 ${geometry.width} ${geometry.height}`,
    width: geometry.width,
    zones,
  });
}

const PROJECTS_REQUIRED_CLEARANCE = HORIZONTAL_STAFF_SPACE;

function projectVisitClearance(
  projection: StoryScoreBranchProjection,
  projectIndex: 1 | 2 | 3,
  rect: StoryScoreMeasuredRect,
): number {
  const zone = projection.zones.find(
    (candidate) =>
      candidate.chapterId === "professional-projects" &&
      candidate.kind === "notation-safe" &&
      candidate.projectVisit?.projectIndex === projectIndex,
  );

  if (!zone) return Number.NEGATIVE_INFINITY;

  const staffEdges = projection.model.staff.lines.flatMap((line) =>
    line.points.slice(1).map((end, index) => ({
      start: line.points[index]!,
      end,
      radius: line.thickness / 2,
    })),
  );
  const eventEdges = projection.model.primitives
    .filter((primitive) =>
      zone.semanticSlotIds.some((slotId) =>
        primitive.id.startsWith(`wf-${slotId}:`),
      ),
    )
    .flatMap((primitive) => {
      const points = eventPrimitiveFootprintPoints(primitive);

      if (points.length === 0) return [];

      const xs = points.map(({ x }) => x);
      const ys = points.map(({ y }) => y);
      const left = Math.min(...xs);
      const right = Math.max(...xs);
      const top = Math.min(...ys);
      const bottom = Math.max(...ys);

      return [
        { start: { x: left, y: top }, end: { x: right, y: bottom }, radius: 0 },
        { start: { x: right, y: top }, end: { x: left, y: bottom }, radius: 0 },
      ];
    });

  return Math.min(
    ...[...staffEdges, ...eventEdges].map(({ start, end, radius }) =>
      projectsSegmentClearance(start, end, rect, radius),
    ),
  );
}

function requiredProjectShelfMinimumYs(
  projection: StoryScoreBranchProjection,
  measurements: StoryScoreSceneMeasurements | undefined,
): ProjectShelfMinimumYs | undefined {
  const cards = measurements?.professionalProjectCards
    ?.filter(validMeasuredRect)
    .slice(0, 3)
    .sort((left, right) => left.x - right.x);

  if (cards?.length !== 3) return undefined;

  const minimumYs: Partial<Record<1 | 2 | 3, number>> = {};
  const envelopes = measurements?.professionalProjectInteractionEnvelopes;
  let firstVisitShift = 0;

  for (const projectIndex of [1, 2] as const) {
    const zone = projection.zones.find(
      (candidate) =>
        candidate.chapterId === "professional-projects" &&
        candidate.kind === "notation-safe" &&
        candidate.projectVisit?.projectIndex === projectIndex,
    );
    const envelope = envelopes?.[projectIndex];
    const rect = envelope && validMeasuredRect(envelope)
      ? envelope
      : projectIndex === 1
        ? cards[0]!
        : undefined;

    if (!zone?.projectVisit || !rect) continue;

    const clearance = projectVisitClearance(projection, projectIndex, rect);
    if (clearance >= PROJECTS_REQUIRED_CLEARANCE) continue;

    const magnitude = Math.max(
      1,
      Math.abs(rect.x),
      Math.abs(rect.y),
      Math.abs(rect.x + rect.width),
      Math.abs(rect.y + rect.height),
      Math.abs(zone.projectVisit.anchor.x),
      Math.abs(zone.projectVisit.anchor.y),
    );
    const svgNumericPadding = magnitude * 2 ** -21;
    const requiredY =
      zone.projectVisit.anchor.y +
      PROJECTS_REQUIRED_CLEARANCE -
      clearance +
      svgNumericPadding;
    if (
      projectIndex === 1 &&
      requiredY >
        projection.height - HORIZONTAL_STAFF_SPACE * 3
    ) {
      continue;
    }
    minimumYs[projectIndex] = requiredY;
    if (projectIndex === 1) {
      firstVisitShift = requiredY - zone.projectVisit.anchor.y;
    }
  }

  if (firstVisitShift > 0) {
    const secondVisit = projection.zones.find(
      (candidate) =>
        candidate.chapterId === "professional-projects" &&
        candidate.kind === "notation-safe" &&
        candidate.projectVisit?.projectIndex === 2,
    )?.projectVisit;

    if (secondVisit) {
      minimumYs[2] = Math.max(
        minimumYs[2] ?? Number.NEGATIVE_INFINITY,
        secondVisit.anchor.y + firstVisitShift,
      );
    }
  }

  return Object.keys(minimumYs).length > 0
    ? Object.freeze(minimumYs)
    : undefined;
}

function buildBranchProjection(
  mode: "horizontal-enhanced" | ScorePathReviewMode,
  branch: StoryScoreBranch,
  viewportWidth: number,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
): StoryScoreBranchProjection {
  const initial = buildBranchProjectionAttempt(
    mode,
    branch,
    viewportWidth,
    viewportHeight,
    measurements,
  );

  if (mode !== "horizontal-enhanced") {
    return initial;
  }

  const projectShelfMinimumYs = requiredProjectShelfMinimumYs(
    initial,
    measurements,
  );
  return projectShelfMinimumYs
    ? buildBranchProjectionAttempt(
        mode,
        branch,
        viewportWidth,
        viewportHeight,
        measurements,
        projectShelfMinimumYs,
      )
    : initial;
}

function clefs(
  branches: Readonly<Record<StoryScoreBranch, StoryScoreBranchProjection>>,
): readonly GlyphRenderPrimitive[] {
  return STORY_SCORE_BRANCHES.flatMap((branch) =>
    branches[branch].model.primitives.filter(
      (primitive): primitive is GlyphRenderPrimitive =>
        primitive.kind === "glyph" && primitive.role === "clef",
    ),
  );
}

function finalBarlineIsPhysicalEnd(
  projection: StoryScoreBranchProjection,
): boolean {
  const roles = projection.model.layers.at(-1)?.primitives.map(
    ({ role }) => role,
  );
  const notationZones = projection.zones.filter(
    ({ kind }) => kind === "notation-safe",
  );
  const terminal = notationZones.at(-1);

  return (
    roles?.at(-2) === "final-barline-thin" &&
    roles.at(-1) === "final-barline-thick" &&
    terminal?.endT === 1 &&
    !projection.zones.some(
      ({ kind, startT }) => kind === "connector" && startT >= terminal.endT,
    ) &&
    projection.model.motifs.every(({ notes }) =>
      notes.every(({ t }) => t <= 1),
    )
  );
}

function projectionEvidence(
  branches: Readonly<Record<StoryScoreBranch, StoryScoreBranchProjection>>,
  mode: "horizontal-enhanced" | ScorePathReviewMode,
): StoryScoreProjectionEvidence {
  const branchClefs = clefs(branches);
  const clef = branchClefs[0];
  const maximumNotationTangentAngleDeg = Math.max(
    ...STORY_SCORE_BRANCHES.flatMap((branch) =>
      branches[branch].zones
        .filter(({ kind }) => kind === "notation-safe")
        .map(({ maximumTangentAngleDeg }) => maximumTangentAngleDeg ?? 0),
    ),
  );
  const connectorEventCount = STORY_SCORE_BRANCHES.reduce(
    (total, branch) =>
      total +
      branches[branch].zones
        .filter(({ kind }) => kind === "connector")
        .reduce((count, { eventCount }) => count + eventCount, 0),
    0,
  );
  const pathSelfIntersections = Object.freeze(
    Object.fromEntries(
      STORY_SCORE_BRANCHES.map((branch) => [
        branch,
        polylineSelfIntersections(sampledPath(branches[branch].path)),
      ]),
    ),
  ) as Readonly<Record<StoryScoreBranch, number>>;
  const staffLineSelfIntersections = Object.freeze(
    Object.fromEntries(
      STORY_SCORE_BRANCHES.map((branch) => [
        branch,
        branches[branch].model.staff.lines.reduce((count, line) => {
          const sampled = line.points.filter((_, index) => index % 4 === 0);
          if (sampled.at(-1) !== line.points.at(-1)) {
            sampled.push(line.points.at(-1)!);
          }
          return count + polylineSelfIntersections(sampled);
        }, 0),
      ]),
    ),
  ) as Readonly<Record<StoryScoreBranch, number>>;
  const continuity = Object.freeze({
    maximumCurvatureDelta: Math.max(
      ...STORY_SCORE_BRANCHES.map(
        (branch) => branches[branch].path.continuity.maximumCurvatureDelta,
      ),
    ),
    maximumPointGap: Math.max(
      ...STORY_SCORE_BRANCHES.map(
        (branch) => branches[branch].path.continuity.maximumPointGap,
      ),
    ),
    minimumTangentAlignment: Math.min(
      ...STORY_SCORE_BRANCHES.map(
        (branch) => branches[branch].path.continuity.minimumTangentAlignment,
      ),
    ),
  });
  const cardInteractionEvidence = (
    branch: StoryScoreBranch,
    chapterId: "professional-services",
  ) => {
    const interactionZones = branches[branch].zones.filter(
      (zone) =>
        zone.chapterId === chapterId &&
        zone.interactionId === STORY_SCORE_CARD_INTERACTION.id,
    );
    const zone = interactionZones[0];
    const profile = zone?.interactionProfile;
    const interactionFraction = profile
      ? (profile.transformEndFraction ?? 1) -
        (profile.transformStartFraction ?? 0)
      : 0;
    const interactionArcLength = zone
      ? zone.arcLength * interactionFraction
      : 0;

    return Object.freeze({
      cardCount: profile?.cardCount ?? 0,
      eventCount: interactionZones.reduce<number>(
        (count, interactionZone) => count + interactionZone.eventCount,
        0,
      ) as 0,
      expandedSpan:
        profile ? interactionArcLength * profile.expandedFraction : 0,
      leadInLength:
        profile ? interactionArcLength * profile.leadInFraction : 0,
      leadOutLength:
        profile ? interactionArcLength * profile.leadOutFraction : 0,
      maximumStaffSpread:
        mode === "horizontal-enhanced"
          ? STORY_SCORE_CARD_INTERACTION.maximumStaffSpread
          : 1,
      measurementSource:
        profile?.measurementSource ?? ("deterministic-fallback" as const),
      minimumOpacity:
        mode === "horizontal-enhanced" && zone
          ? STORY_SCORE_CARD_INTERACTION.opacity
          : 1,
      nearestLeadInCardWidth: profile?.nearestLeadInCardWidth ?? 0,
      nearestLeadOutCardWidth: profile?.nearestLeadOutCardWidth ?? 0,
      zoneCount: interactionZones.length,
    });
  };
  const cardScoreInteractions = Object.freeze({
    "professional-services": cardInteractionEvidence(
      "professional",
      "professional-services",
    ),
  });
  const projectNotationZones = branches.professional.zones.filter(
    ({ chapterId, kind }) =>
      chapterId === "professional-projects" && kind === "notation-safe",
  );
  const projectConnectorZones = branches.professional.zones.filter(
    ({ chapterId, kind }) =>
      chapterId === "professional-projects" && kind === "connector",
  );
  const projectVisitAnchors = Object.freeze(
    projectNotationZones.flatMap(({ projectVisit }) =>
      projectVisit ? [projectVisit] : [],
    ),
  );
  const finalProjectZoneIndex = branches.professional.zones.reduce(
    (lastIndex, zone, index) =>
      zone.chapterId === "professional-projects" &&
      zone.kind === "notation-safe"
        ? index
        : lastIndex,
    -1,
  );
  const projectExitConnector =
    finalProjectZoneIndex < 0
      ? undefined
      : branches.professional.zones
          .slice(finalProjectZoneIndex + 1)
          .find(({ kind }) => kind === "connector");
  const projectConnectorEventCounts = Object.freeze([
    ...projectConnectorZones.map(({ eventCount }) => eventCount),
    ...(projectExitConnector ? [projectExitConnector.eventCount] : []),
  ]);
  const projectSerpentine = Object.freeze({
    connectorEventCount: (projectConnectorZones.reduce<number>(
      (count, zone) => count + zone.eventCount,
      0,
    ) + (projectExitConnector?.eventCount ?? 0)) as 0,
    connectorEventCounts: projectConnectorEventCounts,
    maximumShelfTangentAngleDeg: Math.max(
      ...projectNotationZones.map(
        ({ maximumTangentAngleDeg }) => maximumTangentAngleDeg ?? 0,
      ),
    ),
    notationShelfCount: projectNotationZones.length,
    pathSelfIntersections: pathSelfIntersections.professional as 0,
    staffLineSelfIntersections:
      staffLineSelfIntersections.professional as 0,
    visitAnchors: projectVisitAnchors,
  });
  const ordinaryBarlineCount = STORY_SCORE_BRANCHES.reduce(
    (count, branch) =>
      count +
      branches[branch].model.primitives.filter(
        ({ role }) => role === "barline",
      ).length,
    0,
  );

  if (
    branchClefs.length !== 1 ||
    !clef ||
    clef.assetKey !== SCORE_PATH_ORIGIN_REVIEW_ASSET.assetKey ||
    clef.mirrorX ||
    clef.mirrorY ||
    Math.abs(clef.rotationRadians) > 1e-7 ||
    maximumNotationTangentAngleDeg >
      SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG + 1e-7 ||
    connectorEventCount !== 0 ||
    continuity.maximumCurvatureDelta > 1e-7 ||
    continuity.maximumPointGap > 1e-7 ||
    continuity.minimumTangentAlignment < 1 - 1e-7 ||
    ordinaryBarlineCount !== 0 ||
    (mode === "horizontal-enhanced" &&
      (cardScoreInteractions["professional-services"].zoneCount !== 1 ||
        cardScoreInteractions["professional-services"].cardCount !== 4 ||
        cardScoreInteractions["professional-services"].eventCount !== 0 ||
        Object.values(cardScoreInteractions).some(
          (interaction) =>
            interaction.leadInLength + 1e-7 <
              Math.max(
                HORIZONTAL_STAFF_SPACE * 8,
                interaction.nearestLeadInCardWidth * 0.25,
              ) ||
            interaction.leadOutLength + 1e-7 <
              Math.max(
                HORIZONTAL_STAFF_SPACE * 8,
                interaction.nearestLeadOutCardWidth * 0.25,
              ),
        ) ||
        projectSerpentine.notationShelfCount !== 3 ||
        projectSerpentine.visitAnchors.length !== 3 ||
        projectSerpentine.connectorEventCount !== 0 ||
        projectSerpentine.connectorEventCounts.some((count) => count !== 0) ||
        projectSerpentine.maximumShelfTangentAngleDeg >
          SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG + 1e-7)) ||
    STORY_SCORE_BRANCHES.some(
      (branch) =>
        pathSelfIntersections[branch] !== 0 ||
        staffLineSelfIntersections[branch] !== 0,
    ) ||
    !STORY_SCORE_BRANCHES.every((branch) =>
      finalBarlineIsPhysicalEnd(branches[branch]),
    )
  ) {
    throw new RangeError(
      `Task 34 score projection violates an approved invariant: ${JSON.stringify({
        clefCount: branchClefs.length,
        clefMirrorX: clef?.mirrorX,
        clefMirrorY: clef?.mirrorY,
        clefRotationRadians: clef?.rotationRadians,
        cardScoreInteractions,
        connectorEventCount,
        continuity,
        finalBarlines: Object.fromEntries(
          STORY_SCORE_BRANCHES.map((branch) => [
            branch,
            finalBarlineIsPhysicalEnd(branches[branch]),
          ]),
        ),
        maximumNotationTangentAngleDeg,
        ordinaryBarlineCount,
        pathSelfIntersections,
        projectSerpentine,
        pathDiagnostics: Object.fromEntries(
          STORY_SCORE_BRANCHES.map((branch) => [
            branch,
            {
              segmentCount: branches[branch].path.segmentCount,
              width: branches[branch].width,
              zones: branches[branch].zones.map(({ id, startT, endT }) => ({
                id,
                startT,
                endT,
              })),
            },
          ]),
        ),
        firstPathIntersections: Object.fromEntries(
          STORY_SCORE_BRANCHES.map((branch) => [
            branch,
            firstPolylineSelfIntersection(sampledPath(branches[branch].path)),
          ]),
        ),
        firstStaffLineIntersections: Object.fromEntries(
          STORY_SCORE_BRANCHES.map((branch) => [
            branch,
            branches[branch].model.staff.lines.map((line) => {
              const sampled = line.points.filter(
                (_, index) => index % 4 === 0,
              );
              if (sampled.at(-1) !== line.points.at(-1)) {
                sampled.push(line.points.at(-1)!);
              }
              return firstPolylineSelfIntersection(sampled);
            }),
          ]),
        ),
        staffLineSelfIntersections,
      })}`,
    );
  }

  return Object.freeze({
    cardScoreInteractions,
    chapterBarlines: STORY_SCORE_CHAPTER_BARLINES,
    clef: Object.freeze({
      assetKey: clef.assetKey,
      count: 1 as const,
      mirrorX: false as const,
      mirrorY: false as const,
      rotationDegrees: (clef.rotationRadians * 180) / Math.PI,
      scenographicScale: STORY_SCORE_SCENOGRAPHIC_CLEF_SCALE[mode],
    }),
    connectorEventCount: 0 as const,
    continuity,
    finalBarlines: Object.freeze({
      professional: "thin-gap-thick-and-physical-end" as const,
    }),
    fiveLineContinuity: true as const,
    maximumNotationTangentAngleDeg,
    ordinaryBarlineCount,
    pathSelfIntersections,
    projectSerpentine,
    segmentCount: 6 as const,
    staffLineSelfIntersections,
  });
}

function verticalSectionBlockSizes(
  mode: ScorePathReviewMode,
  compactWidth: number,
): Readonly<Record<StoryChapterId, number>> {
  const professional = buildAuthoredGeometry(
    "organic-flowing",
    mode,
    "professional",
    compactWidth,
  );
  return Object.freeze(
    Object.fromEntries(
      professional.chapters.map(
        ({ chapterId, height }) => [chapterId, height],
      ),
    ),
  ) as Readonly<Record<StoryChapterId, number>>;
}

function horizontalSectionBlockSizes(
  viewportWidth: number,
  viewportHeight: number,
): Readonly<Record<StoryChapterId, number>> {
  const { frames } = horizontalChapterFrames(viewportWidth, viewportHeight);
  return Object.freeze(
    Object.fromEntries(
      DESKTOP_TIMELINE_ORDER.map((chapterId) => [
        chapterId,
        frames[chapterId].height,
      ]),
    ),
  ) as Readonly<Record<StoryChapterId, number>>;
}

export const STORY_SCORE_APPROVED_SECTION_BLOCK_SIZES = Object.freeze({
  "vertical-wide": verticalSectionBlockSizes("vertical-wide", 1280),
  "vertical-compact": verticalSectionBlockSizes("vertical-compact", 390),
} as const);

export function buildStoryScoreProjection(
  mode: StoryScoreProjectionMode,
  options: StoryScoreProjectionOptions = {},
): StoryScoreProjection {
  const viewportWidth = clampViewport(
    options.viewportWidth,
    DEFAULT_VIEWPORT_WIDTH,
  );
  const viewportHeight = clampViewport(
    options.viewportHeight,
    DEFAULT_VIEWPORT_HEIGHT,
  );
  const resolvedGeometryMode =
    mode === "static"
      ? viewportWidth < 768
        ? "vertical-compact"
        : "vertical-wide"
      : mode;
  const geometryWidth =
    resolvedGeometryMode === "horizontal-enhanced"
      ? Math.max(
          MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumWidth,
          viewportWidth,
        )
      : resolvedGeometryMode === "vertical-compact"
      ? Math.max(328, Math.min(414, viewportWidth - 16))
      : viewportWidth;
  const geometryHeight =
    resolvedGeometryMode === "horizontal-enhanced"
      ? Math.max(
          MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumHeight,
          viewportHeight,
        )
      : viewportHeight;
  const cacheKey = `${mode}:${resolvedGeometryMode}:${geometryWidth}:${geometryHeight}:${
    resolvedGeometryMode === "horizontal-enhanced"
      ? sceneMeasurementCacheKey(options.sceneMeasurements)
      : "vertical"
  }`;
  const cached = PROJECTION_CACHE.get(cacheKey);
  if (cached) return cached;

  const professional = buildBranchProjection(
      resolvedGeometryMode,
      "professional",
      geometryWidth,
      geometryHeight,
      options.sceneMeasurements,
    );
  const branches = Object.freeze({ professional });
  const horizontal = resolvedGeometryMode === "horizontal-enhanced";
  const sectionBlockSizes = horizontal
    ? horizontalSectionBlockSizes(geometryWidth, geometryHeight)
    : verticalSectionBlockSizes(resolvedGeometryMode, geometryWidth);
  const evidence = projectionEvidence(branches, resolvedGeometryMode);
  const spatialGeometry = projectSpatialGeometry(
    resolvedGeometryMode,
    professional,
    viewportWidth,
    viewportHeight,
  );
  const projection = Object.freeze({
    branches,
    evidence,
    height: horizontal
      ? geometryHeight
      : branches.professional.height,
    mode,
    resolvedGeometryMode,
    sectionBlockSizes,
    sessionSeed: STORY_SCORE_SESSION_SEED,
    spatialGeometry,
    width: branches.professional.width,
  });

  for (const branch of STORY_SCORE_BRANCHES) {
    if (
      branches[branch].semanticSegmentIds.length !== 6 ||
      STORY_SCORE_EXPECTED_FINGERPRINTS[branch] === undefined
    ) {
      throw new RangeError(`Task 34 ${branch} projection is incomplete`);
    }
  }

  PROJECTION_CACHE.set(cacheKey, projection);
  return projection;
}
