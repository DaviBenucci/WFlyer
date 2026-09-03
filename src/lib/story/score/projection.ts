import type { ComposedSegment } from "@/lib/music/composer/types";
import type { ScorePath, Vec2 } from "@/lib/music/geometry/types";
import { distanceBetween, dotVectors } from "@/lib/music/geometry/vectors";
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
  SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
  type ScorePathReviewChapterLayout,
  type ScorePathReviewMode,
  type ScorePathReservedContentReason,
  type ScorePathReviewInteractionProfile,
  type ScorePathReviewProjectVisit,
  type ScorePathReviewZone,
} from "./organic-flowing";
import {
  buildScorePathOriginReviewFixture,
  SCORE_PATH_ORIGIN_REVIEW_ASSET,
  type ScorePathOriginReviewMode,
} from "./shared-origin";

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

export interface StoryScoreMeasuredExclusionRect
  extends StoryScoreMeasuredRect {
  readonly reason: string;
}

export interface StoryScoreSceneMeasurements {
  readonly applicationHowItWorksCards?: readonly StoryScoreMeasuredRect[];
  readonly chapterContentExclusions?: Readonly<
    Partial<Record<StoryChapterId, readonly StoryScoreMeasuredExclusionRect[]>>
  >;
  readonly professionalProjectCards?: readonly StoryScoreMeasuredRect[];
  readonly professionalServicesCards?: readonly StoryScoreMeasuredRect[];
}

export interface StoryScoreBranchProjection {
  readonly branch: StoryScoreBranch;
  readonly chapters: readonly ScorePathReviewChapterLayout[];
  readonly composition: ComposedSegment;
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
      "application-how-it-works" | "professional-services",
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
  readonly commonOrigin: {
    readonly pointGap: number;
    readonly staffLineGap: number;
    readonly staffSpaceDelta: number;
    readonly tangentAlignment: number;
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
  readonly segmentCount: 12;
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
  readonly width: number;
}

const DEFAULT_VIEWPORT_WIDTH = 1440;
const DEFAULT_VIEWPORT_HEIGHT = 900;
const HORIZONTAL_APPLICATION_HOME_START_CLEARANCE = 1150;
const HORIZONTAL_MIN_CHAPTER_WIDTH = 736;
const HORIZONTAL_ORIGIN_CLEARANCE = 960;
const HORIZONTAL_STAFF_SPACE = 12;
const HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS = 16;
const HORIZONTAL_APPLICATION_HOW_INTERACTION_SEGMENTS = 65;
const HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS = 16;
const HORIZONTAL_APPLICATION_HOW_HALF_TURN_RADIUS =
  HORIZONTAL_STAFF_SPACE * 4;
const HORIZONTAL_APPLICATION_HOW_CONNECTOR_SEGMENTS =
  2 +
  HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS * 2 +
  HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS * 2 +
  HORIZONTAL_APPLICATION_HOW_INTERACTION_SEGMENTS;
const HORIZONTAL_APPLICATION_HOW_TRANSFORM_START =
  (1 +
    HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS +
    HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS) /
  HORIZONTAL_APPLICATION_HOW_CONNECTOR_SEGMENTS;
const HORIZONTAL_APPLICATION_HOW_TRANSFORM_END =
  (1 +
    HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS +
    HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS +
    HORIZONTAL_APPLICATION_HOW_INTERACTION_SEGMENTS) /
  HORIZONTAL_APPLICATION_HOW_CONNECTOR_SEGMENTS;
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
  "application-overview": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "application-how-it-works": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "application-benefits": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "application-demo": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "application-access": CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION,
  "application-terminal": BRANCH_FINAL_BARLINE,
} satisfies Readonly<
  Record<StoryChapterId, StoryScoreChapterBarlineClassification>
>);
const PROJECTION_CACHE = new Map<string, StoryScoreProjection>();

class ApplicationOrganicFlowingPath extends ReviewCubicSplineScorePath {
  override normalAt(t: number): Vec2 {
    const tangent = this.tangentAt(t);

    // The approved Application departure travels left from the common origin;
    // a right normal keeps all five physical origin lines coincident with the
    // Professional branch without mirroring the single shared clef.
    return { x: -tangent.y, y: tangent.x };
  }
}

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
    applicationHowItWorksCards: serialize(
      measurements.applicationHowItWorksCards,
    ),
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
      if (
        segmentsIntersect(
          points[left]!,
          points[left + 1]!,
          points[right]!,
          points[right + 1]!,
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
      if (
        segmentsIntersect(
          points[left]!,
          points[left + 1]!,
          points[right]!,
          points[right + 1]!,
        )
      ) {
        return {
          left,
          leftEnd: points[left + 1]!,
          leftPoint: points[left]!,
          right,
          rightEnd: points[right + 1]!,
          rightPoint: points[right]!,
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
          Math.sin(Math.PI * progress) * 22,
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
      x: start.x + descentWidth * 0.28,
      y: start.y,
    }),
    Object.freeze({
      x: boundary.descentEndX - descentWidth * 0.28,
      y: boundary.safeY,
    }),
    Object.freeze({ x: boundary.descentEndX, y: boundary.safeY }),
    9,
  );
  const remainingWidth = target.x - boundary.descentEndX;

  return Object.freeze([
    ...descent,
    Object.freeze({ x: boundary.descentEndX, y: boundary.safeY }),
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

function horizontalApplicationHowArrivalBridge(
  start: Vec2,
  target: Vec2,
): readonly Vec2[] {
  const deltaX = target.x - start.x;

  if (deltaX <= 0) {
    throw new RangeError(
      "The Application How arrival bridge must enter Benefits monotonically",
    );
  }

  return Object.freeze(
    [0.25, 0.5, 0.75].map((progress) =>
      Object.freeze({
        x: start.x + deltaX * progress,
        y: start.y + (target.y - start.y) * smoothstep(progress),
      }),
    ),
  );
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

function applicationOriginBridge(
  start: Vec2,
  target: Vec2,
  mode: ScorePathOriginReviewMode,
): readonly Vec2[] {
  if (mode === "horizontal-enhanced") {
    const deltaX = start.x - target.x;
    const turnStartY = start.y + (target.y - start.y) * 0.08;
    const turnRadius = Math.abs(target.y - turnStartY) / 2;
    const turnCenterY = (turnStartY + target.y) / 2;
    const approachEnd = Object.freeze({ x: target.x, y: turnStartY });
    const approach = sampledCubicBridge(
      start,
      Object.freeze({
        x: start.x - deltaX * 0.34,
        y: start.y,
      }),
      Object.freeze({
        x: target.x + deltaX * 0.24,
        y: turnStartY,
      }),
      approachEnd,
      9,
    );
    const turn = Array.from({ length: 17 }, (_, index) => {
      const angle = -Math.PI / 2 - (Math.PI * index) / 16;

      return Object.freeze({
        x: target.x + Math.cos(angle) * turnRadius,
        y: turnCenterY + Math.sin(angle) * turnRadius,
      });
    }).slice(0, -1);

    return Object.freeze([...approach, ...turn]);
  }

  const handle =
    mode === "vertical-compact"
      ? 42
      : 90;

  return sampledCubicBridge(
    start,
    Object.freeze({ x: start.x - handle, y: start.y }),
    Object.freeze({ x: target.x - handle, y: target.y }),
    target,
    7,
  );
}

function horizontalApplicationReturn(
  start: Vec2,
  target: Vec2,
  laneY: number,
): readonly Vec2[] {
  const exitsDownward = laneY > start.y;
  const arrivesFromBelow = laneY > target.y;
  const departureRadius = Math.abs(laneY - start.y) / 2;
  const arrivalRadius = Math.abs(laneY - target.y) / 2;
  const arrivalCenterX = target.x - 48;

  if (
    departureRadius < 22 ||
    arrivalRadius < 22 ||
    start.x <= arrivalCenterX
  ) {
    throw new RangeError(
      `The Application horizontal return needs a lower clearance lane: ${JSON.stringify({ arrivalCenterX, arrivalRadius, departureRadius, laneY, start, target })}`,
    );
  }
  const departureCenterY = (start.y + laneY) / 2;
  const departureStartAngle = exitsDownward ? -Math.PI / 2 : Math.PI / 2;
  const departureEndAngle = -departureStartAngle;
  const departure = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    const angle =
      departureStartAngle +
      (departureEndAngle - departureStartAngle) * progress;

    return Object.freeze({
      x: start.x + Math.cos(angle) * departureRadius,
      y: departureCenterY + Math.sin(angle) * departureRadius,
    });
  }).slice(1);
  const lane = [0.25, 0.5, 0.75].map((progress) =>
    Object.freeze({
      x: start.x + (arrivalCenterX - start.x) * progress,
      y: laneY,
    }),
  );
  const arrivalCenterY = (laneY + target.y) / 2;
  const arrivalStartAngle = arrivesFromBelow ? Math.PI / 2 : -Math.PI / 2;
  const arrivalEndAngle = arrivesFromBelow
    ? (Math.PI * 3) / 2
    : (-Math.PI * 3) / 2;
  const arrival = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    const angle =
      arrivalStartAngle +
      (arrivalEndAngle - arrivalStartAngle) * progress;

    return Object.freeze({
      x: arrivalCenterX + Math.cos(angle) * arrivalRadius,
      y: arrivalCenterY + Math.sin(angle) * arrivalRadius,
    });
  });

  return Object.freeze([
    ...departure,
    ...lane,
    ...arrival,
    Object.freeze({ x: target.x - 20, y: target.y }),
  ]);
}

function prependApprovedOrigin(
  geometry: AuthoredTrackGeometry,
  mode: ScorePathOriginReviewMode,
  branch: StoryScoreBranch,
  originX: number,
  horizontalOriginY?: number,
  professionalAboutBoundary?: HorizontalProfessionalAboutBoundary,
): AuthoredTrackGeometry {
  const fixture = buildScorePathOriginReviewFixture(mode);
  const originPath = fixture.branches[branch].path;
  const translateX = originX - fixture.geometry.origin.x;
  const translateY =
    mode === "horizontal-enhanced"
      ? (horizontalOriginY ?? geometry.height * 0.47) -
        fixture.geometry.origin.y
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
    branch === "professional" &&
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
  const trimsReviewedHomeShelf = branch === "professional";
  const cutIndex = trimsReviewedHomeShelf
    ? Math.max(
        0,
        geometry.notationRanges[1]!.startSegmentIndex -
          (mode === "horizontal-enhanced" ? 1 : 8),
      )
    : 0;
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
  const connector =
    branch === "application"
      ? applicationOriginBridge(departureEnd, target, mode)
      : mode === "horizontal-enhanced"
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
          const departureDirection = branch === "professional" ? 1 : -1;
          const turnRadius = mode === "vertical-compact" ? 54 : 118;

          return Object.freeze([
            Object.freeze({
              x:
                departureEnd.x +
                departureDirection * turnRadius * 0.55,
              y: departureEnd.y + 8,
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
            Object.freeze({ x: target.x - 36, y: target.y + 16 }),
          ]);
        })();
  const prefix = originPoints.length + connector.length;
  const downstreamRanges = geometry.notationRanges.slice(
    trimsReviewedHomeShelf ? 1 : 0,
  );
  const notationRanges = downstreamRanges.map((range, index) =>
    Object.freeze({
      ...range,
      startSegmentIndex:
        range.startSegmentIndex -
        cutIndex +
        prefix +
        (!trimsReviewedHomeShelf && index === 0 ? 1 : 0),
      endSegmentIndex: range.endSegmentIndex - cutIndex + prefix,
    }),
  );

  if (trimsReviewedHomeShelf) {
    const approvedNotationEndT = fixture.branches.professional.zones[0].endT;
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

  if (branch === "professional") {
    return prependApprovedOrigin(
      base,
      mode,
      branch,
      base.width / 2,
    );
  }

  const professional = buildAuthoredGeometry(
    "organic-flowing",
    mode,
    "professional",
    compactTrackWidth,
  );
  const homeHeight = base.chapters[0]!.height;
  const homeClearance = mode === "vertical-wide" ? 160 : 72;
  const interveningProfessionalHeight = professional.height - homeHeight;
  const professionalKnots = professional.knots;
  const homeRange = base.notationRanges[0]!;
  const knots = base.knots.map((point, index) => {
    // Both branches own the exact same origin point and initial tangent frame.
    const commonFramePoint =
      index <= 1 ? professionalKnots[index]! : point;

    return Object.freeze({
      x: commonFramePoint.x,
      y:
        commonFramePoint.y > homeHeight
          ? commonFramePoint.y + interveningProfessionalHeight
          : commonFramePoint.y + homeClearance,
    });
  });
  const chapters = base.chapters.map((chapter, index) =>
    index === 0
      ? chapter
      : Object.freeze({
          ...chapter,
          top: chapter.top + interveningProfessionalHeight,
          contentRect: Object.freeze({
            ...chapter.contentRect,
            y: chapter.contentRect.y + interveningProfessionalHeight,
          }),
        }),
  );

  if (homeRange.startSegmentIndex !== 0) {
    throw new RangeError("The approved Organic Flowing origin must start at t=0");
  }

  const integrated = freezeGeometry({
    ...base,
    chapters,
    height: base.height + interveningProfessionalHeight,
    knots,
  });

  return prependApprovedOrigin(
    integrated,
    mode,
    branch,
    integrated.width / 2,
  );
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
  readonly applicationBridge?: HorizontalApplicationBridge;
  readonly applicationHowArrivalBridge?: boolean;
  readonly applicationHowInteraction?: HorizontalApplicationHowInteraction;
  readonly applicationReturnLaneY?: number;
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

interface ResolvedSceneCards {
  readonly cards: readonly StoryScoreMeasuredRect[];
  readonly source: "deterministic-fallback" | "dom-measured";
}

interface HorizontalApplicationBridge {
  readonly lowerLaneY: number;
  readonly transitionX: number;
  readonly upperLaneY: number;
}

interface HorizontalApplicationHowInteraction {
  readonly canonicalY: number;
  readonly interactionEndX: number;
  readonly interactionStartX: number;
  readonly overviewExitCorridor?: HorizontalApplicationOverviewExitCorridor;
}

interface HorizontalApplicationOverviewExitCorridor {
  readonly contentClearX: number;
  readonly lowerLaneY: number;
  readonly turnClearX: number;
}

interface HorizontalApplicationFamilyARecipe {
  readonly accessReturnLaneY: number;
  readonly accessShelfEndX: number;
  readonly accessShelfStartX: number;
  readonly accessShelfY: number;
  readonly demoBridge: HorizontalApplicationBridge;
  readonly demoShelfEndX: number;
  readonly demoShelfStartX: number;
  readonly demoShelfY: number;
  readonly terminalReturnLaneY: number;
  readonly terminalShelfY: number;
}

interface HorizontalHomeOriginRecipe {
  readonly shelfY: number;
  readonly x: number;
  readonly y: number;
}

interface HorizontalApplicationOverviewRecipe {
  readonly endX: number;
  readonly howExitCorridor: HorizontalApplicationOverviewExitCorridor;
  readonly returnLaneY: number;
  readonly shelfY: number;
  readonly startX: number;
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
  measurements: StoryScoreSceneMeasurements | undefined,
  frame: HorizontalChapterFrame,
  viewportHeight: number,
): HorizontalHomeOriginRecipe | undefined {
  const exclusions = measuredChapterExclusions(measurements, "home");
  if (exclusions.length === 0) return undefined;

  const fixture = buildScorePathOriginReviewFixture("horizontal-enhanced");
  // The immutable 1,440 px origin needs twelve staff spaces of runway at
  // both frame edges before its DOM-derived placement can remain five-line
  // crossing-free. Narrower enhanced frames retain the deterministic origin
  // placement while all downstream scene measurements stay active.
  const minimumMeasuredOriginFrameWidth =
    fixture.geometry.pathWidth + HORIZONTAL_STAFF_SPACE * 24;
  if (frame.width < minimumMeasuredOriginFrameWidth) return undefined;

  const contentBottom = Math.max(
    ...exclusions.map((rect) => rect.y + rect.height),
  );
  const contentRight = Math.max(
    ...exclusions.map((rect) => rect.x + rect.width),
  );
  const clef = fixture.evidence.clef;
  const clefHalfWidth =
    (clef.width * STORY_SCORE_SCENOGRAPHIC_CLEF_SCALE["horizontal-enhanced"]) /
    2;
  const x = Math.min(
    frame.left + frame.width - HORIZONTAL_STAFF_SPACE * 8,
    contentRight + clefHalfWidth + HORIZONTAL_STAFF_SPACE,
  );
  const y = Math.min(
    viewportHeight - HORIZONTAL_STAFF_SPACE * 7,
    contentBottom + HORIZONTAL_STAFF_SPACE * 7,
  );

  return Object.freeze({
    shelfY: Math.min(
      viewportHeight - HORIZONTAL_STAFF_SPACE * 9,
      y + HORIZONTAL_STAFF_SPACE * 10,
    ),
    x,
    y,
  });
}

function resolveHorizontalApplicationOverview(
  measurements: StoryScoreSceneMeasurements | undefined,
  frame: HorizontalChapterFrame,
  homeFrame: HorizontalChapterFrame,
  viewportHeight: number,
): HorizontalApplicationOverviewRecipe | undefined {
  const exclusions = measuredChapterExclusions(
    measurements,
    "application-overview",
  );
  const heading = exclusions.filter(
    ({ reason }) => reason === "heading-and-body",
  );
  const overviewItems = exclusions.filter(
    ({ reason }) => reason === "application-overview",
  );
  if (heading.length === 0 || overviewItems.length === 0) return undefined;

  const headingRight = Math.max(
    ...heading.map((rect) => rect.x + rect.width),
  );
  const headingBottom = Math.max(
    ...heading.map((rect) => rect.y + rect.height),
  );
  const shelfY = viewportHeight - HORIZONTAL_STAFF_SPACE * 9;
  const returnLaneY = viewportHeight - HORIZONTAL_STAFF_SPACE * 2;
  const arrivalRadius = (returnLaneY - shelfY) / 2;
  const desiredStartX = Math.max(
    frame.left + HORIZONTAL_STAFF_SPACE * 8,
    headingRight + HORIZONTAL_STAFF_SPACE * 24,
  );
  // End before the measured Home-arrival turn. The following explicit How
  // departure owns the upper corridor; keeping the two boundary turns in
  // disjoint X ranges prevents the opposite-direction connectors from
  // becoming a trapped loop.
  const baselineEndX = frame.left + frame.width * 0.68;
  const minimumShelfWidth = HORIZONTAL_STAFF_SPACE * 8;
  const homeShelfStartX =
    homeFrame.left +
    homeFrame.width / 2 -
    Math.min(
      HORIZONTAL_APPLICATION_HOME_START_CLEARANCE,
      homeFrame.width * 0.7,
    );
  const maximumSafeEndX =
    Math.min(
      frame.left + frame.width - HORIZONTAL_STAFF_SPACE * 8,
      homeShelfStartX - HORIZONTAL_STAFF_SPACE * 8,
    );
  const endX = Math.min(
    maximumSafeEndX,
    Math.max(baselineEndX, desiredStartX + minimumShelfWidth),
  );
  const startX = Math.min(desiredStartX, endX - minimumShelfWidth);
  const minimumCorridorStartX =
    headingRight +
    HORIZONTAL_STAFF_SPACE * 12 +
    arrivalRadius +
    1;

  if (
    startX < minimumCorridorStartX ||
    endX - startX < minimumShelfWidth
  ) {
    return undefined;
  }

  return Object.freeze({
    endX,
    howExitCorridor: Object.freeze({
      contentClearX: headingRight + HORIZONTAL_STAFF_SPACE * 4,
      lowerLaneY: Math.min(
        viewportHeight - HORIZONTAL_STAFF_SPACE * 3,
        headingBottom + HORIZONTAL_STAFF_SPACE * 4,
      ),
      // The Home return arrives at startX from its lower lane. Clear its
      // leftmost edge plus one complete staff before lowering the later,
      // event-free How connector beside the measured reading column.
      turnClearX:
        startX -
        HORIZONTAL_STAFF_SPACE * 4 -
        arrivalRadius -
        HORIZONTAL_STAFF_SPACE * 4,
    }),
    returnLaneY,
    shelfY,
    startX,
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
    "application-benefits": { bottomGap: 5, viewportGap: 7 },
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

function resolveHorizontalApplicationFamilyA(
  measurements: StoryScoreSceneMeasurements | undefined,
  viewportHeight: number,
): HorizontalApplicationFamilyARecipe | undefined {
  const exclusions = measurements?.chapterContentExclusions;
  const readChapter = (chapterId: StoryChapterId) =>
    exclusions?.[chapterId]?.filter(
      (rect): rect is StoryScoreMeasuredExclusionRect =>
        validMeasuredRect(rect),
    ) ?? [];
  const demo = readChapter("application-demo");
  const access = readChapter("application-access");
  const terminal = readChapter("application-terminal");
  const hasReason = (
    rects: readonly StoryScoreMeasuredExclusionRect[],
    reason: string,
  ) => rects.some((rect) => rect.reason === reason);

  if (
    !hasReason(demo, "heading-and-body") ||
    !hasReason(demo, "application-tablet-demo") ||
    !hasReason(access, "heading-and-body") ||
    !hasReason(access, "access-action") ||
    !hasReason(terminal, "terminal-content")
  ) {
    return undefined;
  }

  const chapterBottom = (rects: readonly StoryScoreMeasuredExclusionRect[]) =>
    Math.max(...rects.map((rect) => rect.y + rect.height));
  const demoBottom = chapterBottom(demo);
  const accessBottom = chapterBottom(access);
  const terminalBottom = chapterBottom(terminal);
  const demoLeft = Math.min(...demo.map((rect) => rect.x));
  const accessLeft = Math.min(...access.map((rect) => rect.x));
  const accessRight = Math.max(
    ...access.map((rect) => rect.x + rect.width),
  );
  const demoRight = Math.max(
    ...demo.map((rect) => rect.x + rect.width),
  );
  const terminalRight = Math.max(
    ...terminal.map((rect) => rect.x + rect.width),
  );
  const demoShelfStartX = accessRight + HORIZONTAL_STAFF_SPACE;
  const demoShelfEndX = demoLeft - HORIZONTAL_STAFF_SPACE * 5.75;
  const accessShelfStartX = terminalRight + HORIZONTAL_STAFF_SPACE * 10;
  const accessShelfEndX = Math.max(
    accessLeft - HORIZONTAL_STAFF_SPACE * 2,
    accessShelfStartX + HORIZONTAL_STAFF_SPACE * 8,
  );
  const demoShelfY = viewportHeight * 0.86;
  const accessShelfY = Math.max(
    viewportHeight * 0.74,
    accessBottom + HORIZONTAL_STAFF_SPACE * 8.83,
  );
  const terminalShelfY = Math.max(
    viewportHeight * 0.74,
    terminalBottom + HORIZONTAL_STAFF_SPACE * 7 - 1,
  );
  const benefitsSafeY = measuredLowerCorridorY(
    "application-benefits",
    measurements,
    viewportHeight,
  );
  const demoBridge = Object.freeze({
    lowerLaneY: viewportHeight - HORIZONTAL_STAFF_SPACE * 2,
    transitionX: demoRight + HORIZONTAL_STAFF_SPACE * 2 + 1,
    upperLaneY:
      benefitsSafeY === undefined
        ? viewportHeight * 0.74 - HORIZONTAL_STAFF_SPACE * 5.5
        : benefitsSafeY - HORIZONTAL_STAFF_SPACE * 3,
  });
  const accessReturnLaneY = accessBottom + HORIZONTAL_STAFF_SPACE * 4;
  const terminalReturnLaneY = viewportHeight - HORIZONTAL_STAFF_SPACE * 2;

  if (
    demoBridge.lowerLaneY - demoBottom < HORIZONTAL_STAFF_SPACE * 4 ||
    demoBridge.transitionX - demoRight < HORIZONTAL_STAFF_SPACE * 2 ||
    demoShelfEndX - demoShelfStartX < HORIZONTAL_STAFF_SPACE * 6 ||
    accessShelfEndX - accessShelfStartX < HORIZONTAL_STAFF_SPACE * 6 ||
    accessReturnLaneY - accessBottom < HORIZONTAL_STAFF_SPACE * 4 ||
    terminalShelfY - terminalBottom < HORIZONTAL_STAFF_SPACE * 6 ||
    terminalReturnLaneY - terminalShelfY <
      HORIZONTAL_STAFF_SPACE * 4 - 4
  ) {
    return undefined;
  }

  return Object.freeze({
    accessReturnLaneY,
    accessShelfEndX,
    accessShelfStartX,
    accessShelfY,
    demoBridge,
    demoShelfEndX,
    demoShelfStartX,
    demoShelfY,
    terminalReturnLaneY,
    terminalShelfY,
  });
}

function fallbackSceneCards(
  chapterId:
    | "application-how-it-works"
    | "professional-projects"
    | "professional-services",
  frame: HorizontalChapterFrame,
  viewportHeight: number,
): readonly StoryScoreMeasuredRect[] {
  const count =
    chapterId === "professional-services"
      ? 4
      : chapterId === "application-how-it-works"
        ? 5
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
    | "application-how-it-works"
    | "professional-projects"
    | "professional-services",
  frame: HorizontalChapterFrame,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
): ResolvedSceneCards {
  const measured =
    chapterId === "professional-services"
      ? measurements?.professionalServicesCards
      : chapterId === "application-how-it-works"
        ? measurements?.applicationHowItWorksCards
        : measurements?.professionalProjectCards;
  const expectedCount =
    chapterId === "professional-services"
      ? 4
      : chapterId === "application-how-it-works"
        ? 5
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
    "application-overview": 0.74,
    "application-how-it-works": 0.72,
    "application-benefits": 0.74,
    "application-demo": 0.74,
    "application-access": 0.74,
    "application-terminal": 0.74,
  };

  return viewportHeight * ratio[chapterId];
}

function horizontalChapterShelves(
  frame: HorizontalChapterFrame,
  chapterId: StoryChapterId,
  chapterIndex: number,
  branch: StoryScoreBranch,
  originX: number,
  homeShelfY: number | undefined,
  viewportHeight: number,
  semanticSlotIds: readonly string[],
  measurements: StoryScoreSceneMeasurements | undefined,
  frames: Readonly<Record<StoryChapterId, HorizontalChapterFrame>>,
): readonly HorizontalNotationShelf[] {
  const padding = Math.min(132, frame.width * 0.14);
  const midpoint = frame.left + frame.width / 2;
  const familyA =
    branch === "application"
      ? resolveHorizontalApplicationFamilyA(measurements, viewportHeight)
      : undefined;
  const applicationOverview =
    branch === "application" && chapterId === "application-overview"
      ? resolveHorizontalApplicationOverview(
          measurements,
          frame,
          frames.home,
          viewportHeight,
        )
      : undefined;
  const authoredStartX =
    chapterIndex === 0 && branch === "professional"
      ? midpoint + padding * 0.35
      : chapterIndex === 0 && branch === "application"
        ? midpoint -
          Math.min(
            HORIZONTAL_APPLICATION_HOME_START_CLEARANCE,
            frame.width * 0.7,
          )
        : frame.left + padding;
  const authoredEndX =
    chapterIndex === 0 && branch === "application"
      ? midpoint - padding * 1.15
      : chapterId === "application-overview"
        ? frame.left + frame.width * 0.26
        : chapterId === "application-access"
          ? frame.left + frame.width * 0.68
          : chapterId === "application-benefits"
          ? frame.left + frame.width * 0.6
          : chapterId === "application-demo"
            ? frame.left + frame.width * 0.68
      : frame.left + frame.width - padding;
  const unadjustedStartX =
    branch === "professional" && chapterIndex === 1
      ? Math.max(authoredStartX, originX + HORIZONTAL_ORIGIN_CLEARANCE)
      : authoredStartX;
  const unadjustedEndX =
    branch === "application" && chapterIndex === 1
      ? Math.min(authoredEndX, originX - HORIZONTAL_ORIGIN_CLEARANCE)
      : authoredEndX;
  const maximumEndX = frame.left + frame.width - padding;
  const authoredShelfStartX = Math.min(unadjustedStartX, maximumEndX - 48);
  const authoredShelfEndX = Math.min(
    maximumEndX,
    Math.max(
      unadjustedEndX,
      authoredShelfStartX + HORIZONTAL_STAFF_SPACE * 8,
    ),
  );
  const familyAShelf:
    | {
        readonly applicationBridge?: HorizontalApplicationBridge;
        readonly applicationReturnLaneY?: number;
        readonly endX: number;
        readonly startX: number;
        readonly y: number;
      }
    | undefined = applicationOverview
    ? {
        applicationReturnLaneY: applicationOverview.returnLaneY,
        endX: applicationOverview.endX,
        startX: applicationOverview.startX,
        y: applicationOverview.shelfY,
      }
    : familyA
      ? chapterId === "application-demo"
      ? {
          applicationBridge: familyA.demoBridge,
          endX: familyA.demoShelfEndX,
          startX: familyA.demoShelfStartX,
          y: familyA.demoShelfY,
        }
      : chapterId === "application-access"
        ? {
            applicationReturnLaneY: familyA.accessReturnLaneY,
            endX: familyA.accessShelfEndX,
            startX: familyA.accessShelfStartX,
            y: familyA.accessShelfY,
          }
        : chapterId === "application-terminal"
          ? {
              applicationReturnLaneY: familyA.terminalReturnLaneY,
              endX: authoredShelfEndX,
              startX: authoredShelfStartX,
              y: familyA.terminalShelfY,
            }
          : undefined
    : undefined;
  const startX = familyAShelf?.startX ?? authoredShelfStartX;
  const measuredApplicationHomeEndX =
    branch === "application" &&
    chapterId === "home" &&
    homeShelfY !== undefined
      ? originX -
        buildScorePathOriginReviewFixture("horizontal-enhanced").geometry
          .origin.x -
        HORIZONTAL_STAFF_SPACE * 8
      : undefined;
  const endX =
    familyAShelf?.endX ??
    (measuredApplicationHomeEndX === undefined
      ? authoredShelfEndX
      : Math.max(
          startX + HORIZONTAL_STAFF_SPACE * 8,
        Math.min(authoredShelfEndX, measuredApplicationHomeEndX),
      ));
  const measuredCorridorY = measuredLowerCorridorY(
    chapterId,
    measurements,
    viewportHeight,
  );
  const baseY =
    familyAShelf?.y ??
    (chapterId === "home" ? homeShelfY : undefined) ??
    measuredCorridorY ??
    horizontalChapterY(chapterId, viewportHeight);
  const descent = Math.min(14, viewportHeight * 0.016);
  const standardShelf: HorizontalNotationShelf = Object.freeze({
    ...(familyAShelf?.applicationBridge
      ? { applicationBridge: familyAShelf.applicationBridge }
      : {}),
    ...(familyAShelf?.applicationReturnLaneY !== undefined
      ? { applicationReturnLaneY: familyAShelf.applicationReturnLaneY }
      : {}),
    ...(!familyAShelf &&
    branch === "application" &&
    chapterId === "application-benefits"
      ? { applicationHowArrivalBridge: true }
      : {}),
    barlineAfter: true,
    points: horizontalShelfPoints(
      startX,
      endX,
      baseY,
      baseY + descent,
      branch === "professional" ? -1.5 : 1.5,
    ),
    semanticSlotIds: Object.freeze([...semanticSlotIds]),
  });

  if (
    chapterId === "professional-services" ||
    chapterId === "application-how-it-works"
  ) {
    const { cards, source } = resolveSceneCards(
      chapterId,
      frame,
      viewportHeight,
      measurements,
    );
    const firstCard = cards[0]!;
    const lastCard = cards.at(-1)!;
    const reversesForApplication =
      chapterId === "application-how-it-works";
    const entryCard = reversesForApplication ? lastCard : firstCard;
    const exitCard = reversesForApplication ? firstCard : lastCard;
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
    const canonicalGap =
      chapterId === "professional-services"
        ? HORIZONTAL_STAFF_SPACE * 4
        : HORIZONTAL_STAFF_SPACE * 3 + 3;
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
    const interactionStartX = reversesForApplication
      ? lastCardEndX + leadInLength
      : firstCardX - leadInLength;
    const interactionEndX = reversesForApplication
      ? firstCardX - leadOutLength
      : lastCardEndX + leadOutLength;

    if (reversesForApplication) {
      const benefitsFrame = frames["application-benefits"];
      const measuredOverview = resolveHorizontalApplicationOverview(
        measurements,
        frames["application-overview"],
        frames.home,
        viewportHeight,
      );
      const benefitsPadding = Math.min(
        132,
        benefitsFrame.width * 0.14,
      );
      const benefitsShelfStartX = benefitsFrame.left + benefitsPadding;
      const landingShelfStartX =
        benefitsShelfStartX - HORIZONTAL_STAFF_SPACE * 6;
      const landingShelfEndX =
        benefitsShelfStartX - HORIZONTAL_STAFF_SPACE * 2;
      const benefitsY =
        measuredLowerCorridorY(
          "application-benefits",
          measurements,
          viewportHeight,
        ) ??
        horizontalChapterY("application-benefits", viewportHeight);
      const landingPoints = horizontalShelfPoints(
        landingShelfStartX,
        landingShelfEndX,
        benefitsY,
        benefitsY + descent * 0.45,
      );
      const routedInteractionProfile = Object.freeze({
        ...interactionProfile,
        transformEndFraction: HORIZONTAL_APPLICATION_HOW_TRANSFORM_END,
        transformStartFraction: HORIZONTAL_APPLICATION_HOW_TRANSFORM_START,
      });

      return Object.freeze([
        Object.freeze({
          applicationHowInteraction: Object.freeze({
            canonicalY,
            interactionEndX,
            interactionStartX,
            ...(measuredOverview === undefined
              ? {}
              : {
                  overviewExitCorridor:
                    measuredOverview.howExitCorridor,
                }),
          }),
          barlineAfter: true,
          connectorInteraction: "CARD_SCORE_INTERACTION" as const,
          connectorInteractionExpandedY: expandedY,
          connectorInteractionProfile: routedInteractionProfile,
          points: landingPoints,
          semanticSlotIds: Object.freeze([...semanticSlotIds]),
        }),
      ]);
    }

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
    const anchors = cards.map((card) =>
      Object.freeze({
        x: card.x + card.width / 2,
        y: Math.min(
          viewportHeight - HORIZONTAL_STAFF_SPACE * 7,
          card.y + card.height + HORIZONTAL_STAFF_SPACE * 3.5,
        ),
      }),
    );
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

/**
 * Projection-only boundary route for Application / How It Works. The musical
 * shelf remains forward-readable; this connector alone owns the physical
 * right-to-left card traversal.
 */
function horizontalApplicationHowInteractionRoute(
  start: Vec2,
  target: Vec2,
  viewportHeight: number,
  interaction: HorizontalApplicationHowInteraction,
  profile: ScorePathReviewInteractionProfile,
  expandedY: number,
): readonly Vec2[] {
  const radius = HORIZONTAL_APPLICATION_HOW_HALF_TURN_RADIUS;
  const coreStart = Object.freeze({
    x: interaction.interactionStartX,
    y: interaction.canonicalY,
  });
  const coreEnd = Object.freeze({
    x: interaction.interactionEndX,
    y: interaction.canonicalY,
  });
  const approachEnd = Object.freeze({
    x: target.x,
    y: target.y + radius * 2,
  });

  if (
    start.x <= coreStart.x + radius * 2 ||
    coreStart.x <= coreEnd.x ||
    coreEnd.x <= target.x + radius * 2
  ) {
    throw new RangeError(
      `The Application How route needs ordered right-to-left corridors: ${JSON.stringify({ interaction, start, target })}`,
    );
  }

  const departureCenterY = start.y - radius;
  const departureTurn = Array.from(
    { length: HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS },
    (_, index) => {
      const progress =
        (index + 1) / HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS;
      const angle = Math.PI / 2 - Math.PI * progress;

      return Object.freeze({
        x: start.x + Math.cos(angle) * radius,
        y: departureCenterY + Math.sin(angle) * radius,
      });
    },
  );
  const departureEnd = departureTurn.at(-1)!;
  const overviewExitCorridor = interaction.overviewExitCorridor;
  const entryLaneY = Math.max(
    HORIZONTAL_STAFF_SPACE * 6,
    Math.min(departureEnd.y, coreStart.y) - radius * 3,
  );
  const overviewLowerLaneY =
    overviewExitCorridor === undefined
      ? undefined
      : Math.max(overviewExitCorridor.lowerLaneY, coreStart.y);

  if (
    overviewExitCorridor !== undefined &&
    (overviewExitCorridor.turnClearX >= departureEnd.x ||
      overviewExitCorridor.turnClearX <=
        overviewExitCorridor.contentClearX ||
      overviewExitCorridor.contentClearX <= coreStart.x ||
      overviewLowerLaneY! < departureEnd.y)
  ) {
    throw new RangeError(
      `The measured Overview exit needs an open lower corridor: ${JSON.stringify({ coreStart, departureEnd, overviewExitCorridor })}`,
    );
  }
  const canonicalApproach = Array.from(
    { length: HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS },
    (_, index) => {
      const progress =
        (index + 1) / HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS;
      const corridorProgress =
        progress < 0.22
          ? smoothstep(progress / 0.22)
          : progress <= 0.7
            ? 1
            : 1 - smoothstep((progress - 0.7) / 0.3);
      const baselineY =
        departureEnd.y +
        (coreStart.y - departureEnd.y) * smoothstep(progress);
      const x =
        departureEnd.x + (coreStart.x - departureEnd.x) * progress;
      const measuredCorridorY =
        overviewExitCorridor === undefined
          ? undefined
          : x >= overviewExitCorridor.turnClearX
            ? departureEnd.y
            : x > overviewExitCorridor.contentClearX
              ? departureEnd.y +
                (overviewLowerLaneY! - departureEnd.y) *
                  smoothstep(
                    (overviewExitCorridor.turnClearX - x) /
                      (overviewExitCorridor.turnClearX -
                        overviewExitCorridor.contentClearX),
                  )
              : overviewLowerLaneY! +
                (coreStart.y - overviewLowerLaneY!) *
                  smoothstep(
                    (overviewExitCorridor.contentClearX - x) /
                      (overviewExitCorridor.contentClearX - coreStart.x),
                  );

      return Object.freeze({
        x,
        y:
          measuredCorridorY ??
          baselineY + (entryLaneY - baselineY) * corridorProgress,
      });
    },
  );
  const interactionCore = [
    ...horizontalCardInteractionBridge(
      coreStart,
      coreEnd,
      profile,
      expandedY,
      "right-to-left",
    ),
    coreEnd,
  ];
  const lowLaneY = viewportHeight - HORIZONTAL_STAFF_SPACE * 2;
  const approach = Array.from(
    { length: HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS },
    (_, index) => {
      const progress =
        (index + 1) / HORIZONTAL_APPLICATION_HOW_APPROACH_SEGMENTS;
      const verticalProgress =
        progress < 0.25
          ? smoothstep(progress / 0.25)
          : progress <= 0.75
            ? 1
            : 1 - smoothstep((progress - 0.75) / 0.25);
      const baselineY =
        coreEnd.y + (approachEnd.y - coreEnd.y) * smoothstep(progress);

      return Object.freeze({
        x: coreEnd.x + (approachEnd.x - coreEnd.x) * progress,
        y: baselineY + (lowLaneY - baselineY) * verticalProgress,
      });
    },
  );
  const arrivalCenterY = target.y + radius;
  const arrivalTurn = Array.from(
    { length: HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS },
    (_, index) => {
      const progress =
        (index + 1) / HORIZONTAL_APPLICATION_HOW_HALF_TURN_SEGMENTS;
      const angle = Math.PI / 2 + Math.PI * progress;

      return Object.freeze({
        x: target.x + Math.cos(angle) * radius,
        y: arrivalCenterY + Math.sin(angle) * radius,
      });
    },
  );
  return Object.freeze([
    ...departureTurn,
    ...canonicalApproach,
    ...interactionCore,
    ...approach,
    ...arrivalTurn.slice(0, -1),
  ]);
}

function horizontalApplicationBoundaryBridge(
  start: Vec2,
  target: Vec2,
  bridge: HorizontalApplicationBridge,
): readonly Vec2[] {
  const departureRadius = Math.abs(bridge.upperLaneY - start.y) / 2;
  const arrivalRadius = Math.abs(bridge.lowerLaneY - target.y) / 2;
  const arrivalCenterX = target.x - HORIZONTAL_STAFF_SPACE * 4;

  if (
    departureRadius < HORIZONTAL_STAFF_SPACE * 2 ||
    arrivalRadius < HORIZONTAL_STAFF_SPACE * 2 ||
    bridge.upperLaneY >= start.y ||
    bridge.lowerLaneY <= target.y ||
    bridge.transitionX >= start.x ||
    bridge.transitionX <= arrivalCenterX
  ) {
    throw new RangeError(
      `The measured Application boundary bridge needs ordered outer corridors: ${JSON.stringify({ bridge, start, target })}`,
    );
  }

  const departureCenterY = (start.y + bridge.upperLaneY) / 2;
  const departure = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    const angle = Math.PI / 2 - Math.PI * progress;

    return Object.freeze({
      x: start.x + Math.cos(angle) * departureRadius,
      y: departureCenterY + Math.sin(angle) * departureRadius,
    });
  }).slice(1);
  const upperLane = [0.22, 0.44, 0.66, 0.82, 1].map((progress) =>
    Object.freeze({
      x: start.x + (bridge.transitionX - start.x) * progress,
      y: bridge.upperLaneY,
    }),
  );
  const transition = [0.12, 0.28, 0.46, 0.64, 0.8, 0.93, 1].map(
    (progress) =>
      Object.freeze({
        x: bridge.transitionX,
        y:
          bridge.upperLaneY +
          (bridge.lowerLaneY - bridge.upperLaneY) * progress,
      }),
  );
  const lowerLane = [0.2, 0.4, 0.6, 0.8, 1].map((progress) =>
    Object.freeze({
      x:
        bridge.transitionX +
        (arrivalCenterX - bridge.transitionX) * progress,
      y: bridge.lowerLaneY,
    }),
  );
  const arrivalCenterY = (bridge.lowerLaneY + target.y) / 2;
  const arrival = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    const angle = Math.PI / 2 + Math.PI * progress;

    return Object.freeze({
      x: arrivalCenterX + Math.cos(angle) * arrivalRadius,
      y: arrivalCenterY + Math.sin(angle) * arrivalRadius,
    });
  });

  return Object.freeze([
    ...departure,
    ...upperLane,
    ...transition,
    ...lowerLane,
    ...arrival,
    Object.freeze({ x: target.x - 20, y: target.y }),
  ]);
}

function pushHorizontalConnector(
  knots: Vec2[],
  target: Vec2,
  viewportHeight: number,
  connectorIndex: number,
  branch: StoryScoreBranch,
  connectorKind?: HorizontalNotationShelf["connectorKind"],
  connectorValleyY?: number,
  connectorInteraction?: HorizontalNotationShelf["connectorInteraction"],
  connectorInteractionExpandedY?: number,
  connectorInteractionProfile?: ScorePathReviewInteractionProfile,
  applicationBridge?: HorizontalApplicationBridge,
  applicationHowArrivalBridge?: boolean,
  applicationReturnLaneY?: number,
  applicationHowInteraction?: HorizontalApplicationHowInteraction,
): void {
  const start = knots.at(-1)!;
  const preferredApplicationLaneY =
    viewportHeight * (connectorIndex % 2 === 1 ? 0.94 : 0.58);
  const alternateApplicationLaneY =
    viewportHeight * (connectorIndex % 2 === 1 ? 0.7 : 0.66);
  const applicationLaneY =
    applicationReturnLaneY ??
    (Math.abs(preferredApplicationLaneY - start.y) >= 60 &&
    Math.abs(preferredApplicationLaneY - target.y) >= 60
      ? preferredApplicationLaneY
      : alternateApplicationLaneY);

  knots.push(
    ...(applicationBridge
      ? horizontalApplicationBoundaryBridge(start, target, applicationBridge)
      : applicationHowArrivalBridge
        ? horizontalApplicationHowArrivalBridge(start, target)
      : applicationHowInteraction
        ? horizontalApplicationHowInteractionRoute(
            start,
            target,
            viewportHeight,
            applicationHowInteraction,
            connectorInteractionProfile!,
            connectorInteractionExpandedY!,
          )
      : connectorInteraction
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
      : target.x > start.x
      ? horizontalProfessionalBridge(start, target)
      : horizontalApplicationReturn(start, target, applicationLaneY)),
  );
}

function horizontalGeometry(
  branch: StoryScoreBranch,
  viewportWidth: number,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
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
      "application-overview": ["heading-and-body", "application-overview"],
      "application-how-it-works": ["heading-and-body"],
      "application-benefits": ["heading-and-body", "application-benefits"],
      "application-demo": ["heading-and-body", "application-tablet-demo"],
      "application-access": ["heading-and-body", "access-action"],
      "application-terminal": ["terminal-content"],
    } satisfies Readonly<
      Record<StoryChapterId, readonly ScorePathReservedContentReason[]>
    >;
    return Object.freeze({
      chapterId,
      contentRect: Object.freeze({
        x: frame.left + frame.width * (chapterId === "home" ? 0.08 : 0.1),
        y: viewportHeight * 0.08,
        width: frame.width * (chapterId === "home" ? 0.36 : 0.8),
        height:
          viewportHeight *
          (chapterId === "home"
            ? 0.36
            : chapterId === "professional-contact" ||
                chapterId === "application-demo" ||
                chapterId === "application-access"
              ? 0.72
              : 0.62),
      }),
      height: viewportHeight,
      reservedReasons: Object.freeze([...reservedReasons[chapterId]]),
      top: 0,
    });
  });
  const measuredHomeOrigin = resolveHorizontalHomeOrigin(
    measurements,
    frames.home,
    viewportHeight,
  );
  const professionalAboutBoundary =
    branch === "professional"
      ? resolveHorizontalProfessionalAboutBoundary(
          measurements,
          viewportHeight,
        )
      : undefined;
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
      branch,
      originX,
      measuredHomeOrigin?.shelfY,
      viewportHeight,
      allSlotIds.filter((slotId) =>
        slotId.startsWith(`${chapter.chapterId}:`),
      ),
      measurements,
      frames,
    ).map((shelf) => Object.freeze({ chapterId: chapter.chapterId, shelf })),
  );

  const knots: Vec2[] = [];
  let applicationReturnIndex = 0;
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
      if (
        branch === "application" &&
        shelf.applicationHowInteraction === undefined &&
        shelf.points[0]!.x < knots.at(-1)!.x
      ) {
        applicationReturnIndex += 1;
      }
      pushHorizontalConnector(
        knots,
        shelf.points[0]!,
        viewportHeight,
        branch === "application" ? applicationReturnIndex : index,
        branch,
        shelf.connectorKind,
        shelf.connectorValleyY,
        shelf.connectorInteraction,
        shelf.connectorInteractionExpandedY,
        shelf.connectorInteractionProfile,
        shelf.applicationBridge,
        shelf.applicationHowArrivalBridge,
        shelf.applicationReturnLaneY,
        shelf.applicationHowInteraction,
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

function familyABoundaryContraction(
  t: number,
  path: ReviewCubicSplineScorePath,
  zones: readonly ScorePathReviewZone[],
  familyA: HorizontalApplicationFamilyARecipe | undefined,
): number {
  if (!familyA) return 0;

  const boundaryZone = zones.find(
    (zone) =>
      zone.kind === "connector" &&
      zone.chapterId === "application-demo",
  );
  if (
    !boundaryZone ||
    t < boundaryZone.startT ||
    t > boundaryZone.endT
  ) {
    return 0;
  }

  const center = path.pointAt(t);
  const transition = familyA.demoBridge;
  const verticalPadding = HORIZONTAL_STAFF_SPACE * 2;
  if (
    center.y < transition.upperLaneY - verticalPadding ||
    center.y > transition.lowerLaneY + verticalPadding
  ) {
    return 0;
  }

  const departure = path.pointAt(boundaryZone.startT);
  const departureHeight = departure.y - transition.upperLaneY;
  const departureContraction =
    departureHeight > 0 && center.x >= transition.transitionX
      ? 1.5 *
        smoothstep(
          Math.max(
            0,
            Math.min(
              1,
              (departure.y - center.y) / departureHeight,
            ),
          ),
        )
      : 0;
  const transitionWidth = HORIZONTAL_STAFF_SPACE * 8;
  const transitionContraction = smoothstep(
    Math.max(
      0,
      1 - Math.abs(center.x - transition.transitionX) / transitionWidth,
    ),
  );

  return Math.max(departureContraction, transitionContraction);
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
  familyA?: HorizontalApplicationFamilyARecipe,
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
          const contraction = familyABoundaryContraction(
            t,
            path,
            zones,
            familyA,
          );
          if (progress === 0 && contraction === 0) return point;
          const center = path.pointAt(t);
          const spread =
            (1 +
              (STORY_SCORE_CARD_INTERACTION.maximumStaffSpread - 1) *
                progress) *
            (1 - contraction * 0.5);

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

function buildBranchProjection(
  mode: "horizontal-enhanced" | ScorePathReviewMode,
  branch: StoryScoreBranch,
  viewportWidth: number,
  viewportHeight: number,
  measurements: StoryScoreSceneMeasurements | undefined,
): StoryScoreBranchProjection {
  const authoredGeometry =
    mode === "horizontal-enhanced"
      ? horizontalGeometry(
          branch,
          viewportWidth,
          viewportHeight,
          measurements,
        )
      : verticalGeometry(mode, branch, viewportWidth);
  const geometry = applyChapterBarlineClassification(authoredGeometry);
  const path =
    branch === "application"
      ? new ApplicationOrganicFlowingPath(geometry.knots)
      : new ReviewCubicSplineScorePath(geometry.knots);
  const composition = STORY_SCORE_COMPOSITIONS[branch];
  const zones = buildZones(path, geometry, composition);
  const firstNotationZone = zones.find(
    ({ kind }) => kind === "notation-safe",
  );

  if (
    !firstNotationZone ||
    (branch === "application" && firstNotationZone.startT <= 0)
  ) {
    throw new RangeError("Task 34 requires an event-free approved origin departure");
  }
  const baseModel = buildReviewModel(
    `phase-9-task-34:${mode}:${branch}`,
    path,
    geometry.staffSpace,
    zones,
    composition,
    branch === "professional"
      ? {
          clef: true,
          clefT: 0,
          keySignature: true,
          keySignatureT:
            firstNotationZone.startT +
            (firstNotationZone.endT - firstNotationZone.startT) * 0.12,
          staffSampleCount: 1025,
        }
      : { clef: false, keySignature: false, staffSampleCount: 1025 },
  );
  const model = choreographModel(
    baseModel,
    path,
    zones,
    mode,
    geometry.staffSpace,
    mode === "horizontal-enhanced" && branch === "application"
      ? resolveHorizontalApplicationFamilyA(measurements, viewportHeight)
      : undefined,
  );

  return Object.freeze({
    branch,
    chapters: geometry.chapters,
    composition,
    height: geometry.height,
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
  const originPoints = STORY_SCORE_BRANCHES.map((branch) =>
    branches[branch].path.pointAt(0),
  );
  const originTangents = STORY_SCORE_BRANCHES.map((branch) =>
    branches[branch].path.tangentAt(0),
  );
  const originStaffLineGap = Math.max(
    ...branches.professional.model.staff.lines.map((line, index) =>
      distanceBetween(
        line.points[0]!,
        branches.application.model.staff.lines[index]!.points[0]!,
      ),
    ),
  );
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
    chapterId:
      | "application-how-it-works"
      | "professional-services",
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
    "application-how-it-works": cardInteractionEvidence(
      "application",
      "application-how-it-works",
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
    distanceBetween(originPoints[0]!, originPoints[1]!) > 1e-7 ||
    originStaffLineGap > 1e-7 ||
    maximumNotationTangentAngleDeg >
      SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG + 1e-7 ||
    connectorEventCount !== 0 ||
    continuity.maximumCurvatureDelta > 1e-7 ||
    continuity.maximumPointGap > 1e-7 ||
    continuity.minimumTangentAlignment < 1 - 1e-7 ||
    ordinaryBarlineCount !== 0 ||
    (mode === "horizontal-enhanced" &&
      (cardScoreInteractions["professional-services"].zoneCount !== 1 ||
        cardScoreInteractions["application-how-it-works"].zoneCount !== 1 ||
        cardScoreInteractions["professional-services"].cardCount !== 4 ||
        cardScoreInteractions["application-how-it-works"].cardCount !== 5 ||
        cardScoreInteractions["professional-services"].eventCount !== 0 ||
        cardScoreInteractions["application-how-it-works"].eventCount !== 0 ||
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
        originPointGap: distanceBetween(originPoints[0]!, originPoints[1]!),
        originStaffLineGap,
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
    commonOrigin: Object.freeze({
      pointGap: distanceBetween(originPoints[0]!, originPoints[1]!),
      staffLineGap: originStaffLineGap,
      staffSpaceDelta: Math.abs(
        branches.professional.staffSpace - branches.application.staffSpace,
      ),
      tangentAlignment: dotVectors(originTangents[0]!, originTangents[1]!),
    }),
    connectorEventCount: 0 as const,
    continuity,
    finalBarlines: Object.freeze({
      application: "thin-gap-thick-and-physical-end" as const,
      professional: "thin-gap-thick-and-physical-end" as const,
    }),
    fiveLineContinuity: true as const,
    maximumNotationTangentAngleDeg,
    ordinaryBarlineCount,
    pathSelfIntersections,
    projectSerpentine,
    segmentCount: 12 as const,
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
  const application = buildAuthoredGeometry(
    "organic-flowing",
    mode,
    "application",
    compactWidth,
  );

  return Object.freeze(
    Object.fromEntries(
      [...professional.chapters, ...application.chapters.slice(1)].map(
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

  const branches = Object.freeze({
    application: buildBranchProjection(
      resolvedGeometryMode,
      "application",
      geometryWidth,
      geometryHeight,
      options.sceneMeasurements,
    ),
    professional: buildBranchProjection(
      resolvedGeometryMode,
      "professional",
      geometryWidth,
      geometryHeight,
      options.sceneMeasurements,
    ),
  });
  const horizontal = resolvedGeometryMode === "horizontal-enhanced";
  const sectionBlockSizes = horizontal
    ? horizontalSectionBlockSizes(geometryWidth, geometryHeight)
    : verticalSectionBlockSizes(resolvedGeometryMode, geometryWidth);
  const projection = Object.freeze({
    branches,
    evidence: projectionEvidence(branches, resolvedGeometryMode),
    height: horizontal
      ? geometryHeight
      : branches.application.height,
    mode,
    resolvedGeometryMode,
    sectionBlockSizes,
    sessionSeed: STORY_SCORE_SESSION_SEED,
    width: horizontal
      ? branches.application.width
      : branches.application.width,
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
