import { composeSegment } from "@/lib/music/composer/compose-segment";
import type {
  ComposedSegment,
  ReservedScoreZone,
  ReservedZoneReason,
  ScoreCompositionSlot,
} from "@/lib/music/composer/types";
import { frameAt, placeAtStaffStep } from "@/lib/music/geometry/score-path";
import { sampleStaffLines } from "@/lib/music/geometry/staff";
import type { ScorePath, Vec2 } from "@/lib/music/geometry/types";
import { buildScoreModel } from "@/lib/music/renderer/build-score-model";
import type {
  ScoreMotifPlacement,
  ScoreRenderModel,
} from "@/lib/music/renderer/types";
import type { StoryChapterId } from "@/lib/story";

import { APPROVED_RENDERER_GLYPH_CALIBRATIONS } from "../../../music/_fixtures/approved-calibration";
import { APPROVED_RENDERER_TOKENS } from "../../../music/_fixtures/draft-calibration";

export const SCORE_PATH_REVIEW_SEED = "phase-9-task-33-review-v1";
export const SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG = 18;
export const SCORE_PATH_REVIEW_GEOMETRY_EPSILON = 1e-7;
export const SCORE_PATH_REVIEW_FLOWING_STATUS = "SELECTED_FOR_REVISION";

export const SCORE_PATH_REVIEW_CANDIDATE_IDS = Object.freeze([
  "organic-soft",
  "organic-flowing",
] as const);
export type ScorePathReviewCandidateId =
  (typeof SCORE_PATH_REVIEW_CANDIDATE_IDS)[number];

export const SCORE_PATH_REVIEW_MODES = Object.freeze([
  "vertical-wide",
  "vertical-compact",
] as const);
export type ScorePathReviewMode = (typeof SCORE_PATH_REVIEW_MODES)[number];

export const SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE = Object.freeze({
  "vertical-wide": 4.5,
  "vertical-compact": 3,
} as const satisfies Record<ScorePathReviewMode, number>);

export const SCORE_PATH_REVIEW_THEMES = Object.freeze([
  "light",
  "dark",
] as const);
export type ScorePathReviewTheme = (typeof SCORE_PATH_REVIEW_THEMES)[number];

export const SCORE_PATH_REVIEW_BRANCHES = Object.freeze([
  "professional",
  "application",
] as const);
export type ScorePathReviewBranch =
  (typeof SCORE_PATH_REVIEW_BRANCHES)[number];

export interface ScorePathReviewBuildOptions {
  readonly compactTrackWidth?: number;
}

const SCORE_PATH_REVIEW_COMPACT_GUTTER = 16;
const SCORE_PATH_REVIEW_COMPACT_MIN_WIDTH = 328;
const SCORE_PATH_REVIEW_COMPACT_MAX_WIDTH = 414;

export function scorePathReviewCompactTrackWidth(
  cssViewportWidth: number,
): number {
  if (!Number.isFinite(cssViewportWidth)) {
    return 390;
  }

  return Math.max(
    SCORE_PATH_REVIEW_COMPACT_MIN_WIDTH,
    Math.min(
      SCORE_PATH_REVIEW_COMPACT_MAX_WIDTH,
      Math.round(cssViewportWidth) - SCORE_PATH_REVIEW_COMPACT_GUTTER,
    ),
  );
}

export const SCORE_PATH_REVIEW_CANDIDATES = Object.freeze({
  "organic-soft": Object.freeze({
    id: "organic-soft",
    label: "Organic Soft",
    description:
      "Calm notation shelves, broad side-corridor drops, and restrained asymmetric drift.",
    tradeoff:
      "Uses more vertical breathing room to maximize clearance around dense scenes.",
    status: "REFERENCE_ONLY",
  }),
  "organic-flowing": Object.freeze({
    id: "organic-flowing",
    label: "Organic Flowing",
    description:
      "Revised alternating side-to-side S transitions with subtly curved shelves and shallow descending notation-safe runs.",
    tradeoff:
      "Uses compact routed crossings and denser side-biased notation shelves to reduce transition-only travel without shrinking scene content.",
    status: SCORE_PATH_REVIEW_FLOWING_STATUS,
  }),
} as const satisfies Record<
  ScorePathReviewCandidateId,
  {
    readonly id: ScorePathReviewCandidateId;
    readonly label: string;
    readonly description: string;
    readonly status: "REFERENCE_ONLY" | typeof SCORE_PATH_REVIEW_FLOWING_STATUS;
    readonly tradeoff: string;
  }
>);

export type ScorePathReservedContentReason =
  | "access-action"
  | "application-benefits"
  | "application-overview"
  | "application-tablet-demo"
  | "contact-form"
  | "heading-and-body"
  | "persona-slot"
  | "process-stages"
  | "project-card-fan"
  | "services-modules"
  | "terminal-content";

export interface ScorePathReviewRect {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export interface ScorePathReviewChapterLayout {
  readonly chapterId: StoryChapterId;
  readonly contentRect: ScorePathReviewRect;
  readonly height: number;
  readonly reservedReasons: readonly ScorePathReservedContentReason[];
  readonly top: number;
}

export interface ScorePathReviewZone {
  readonly arcLength: number;
  readonly descendingArcLength: number;
  readonly endT: number;
  readonly eventCount: number;
  readonly id: string;
  readonly kind: "connector" | "notation-safe";
  readonly maximumTangentAngleDeg: number | null;
  readonly maximumTangentT: number | null;
  readonly points: readonly Vec2[];
  readonly semanticSlotIds: readonly string[];
  readonly startT: number;
  readonly verticalBudget: number | null;
}

export interface ScorePathReviewPrimitiveSpan {
  readonly id: string;
  readonly length: number;
  readonly maximumAllowedLength: number;
  readonly rhythmicGroup: string;
  readonly role: "beam" | "stem";
  readonly semanticSlotId: string;
}

export interface ScorePathReviewFlowMetrics {
  readonly contentOwnedHeight: number;
  readonly largestContentFreeVerticalInterval: number;
  readonly longestConnectorArcLength: number;
  readonly notationSafeDescendingArcLength: number;
  readonly totalConnectorArcLength: number;
  readonly totalTrackHeight: number;
  readonly transitionOnlyHeight: number;
  readonly transitionOnlyVerticalDistance: number;
}

export const SCORE_PATH_REVIEW_FLOWING_BASELINE_METRICS = Object.freeze({
  "vertical-wide": Object.freeze({
    professional: Object.freeze({
      totalTrackHeight: 9310,
      transitionOnlyVerticalDistance: 8248.86,
      longestConnectorArcLength: 3014.66,
    }),
    application: Object.freeze({
      totalTrackHeight: 8140,
      transitionOnlyVerticalDistance: 7078.82,
      longestConnectorArcLength: 2666.85,
    }),
  }),
  "vertical-compact": Object.freeze({
    professional: Object.freeze({
      totalTrackHeight: 12870,
      transitionOnlyVerticalDistance: 11736.37,
      longestConnectorArcLength: 3162.96,
    }),
    application: Object.freeze({
      totalTrackHeight: 9660,
      transitionOnlyVerticalDistance: 8526.33,
      longestConnectorArcLength: 2140.45,
    }),
  }),
} as const);

export const SCORE_PATH_REVIEW_COMPACT_RESPONSIVE_BASELINE_METRICS =
  Object.freeze({
    professional: Object.freeze({
      contentOwnedHeight: 9230,
      largestContentFreeVerticalInterval: 420,
      longestConnectorArcLength: 3016.824,
      totalTrackHeight: 12170,
      transitionOnlyHeight: 2940,
      transitionOnlyVerticalDistance: 10949.731,
    }),
    application: Object.freeze({
      contentOwnedHeight: 6020,
      largestContentFreeVerticalInterval: 420,
      longestConnectorArcLength: 2002.002,
      totalTrackHeight: 8960,
      transitionOnlyHeight: 2940,
      transitionOnlyVerticalDistance: 7739.369,
    }),
  } as const);

export interface ScorePathReviewEvidence {
  readonly boundsViolations: number;
  readonly clef: {
    readonly mirrorX: boolean;
    readonly mirrorY: boolean;
    readonly rotationDegrees: number;
  };
  readonly connectorEventCount: number;
  readonly continuity: {
    readonly maximumCurvatureDelta: number;
    readonly maximumPointGap: number;
    readonly minimumTangentAlignment: number;
  };
  readonly finalBarline: "thin-gap-thick-conventional";
  readonly flowMetrics: ScorePathReviewFlowMetrics;
  readonly fiveLineContinuity: true;
  readonly maximumNotationTangentAngleDeg: number;
  readonly minimumAdjacentStaffLineDistance: number;
  readonly minimumCurvatureRadius: number;
  readonly minimumCurvatureT: number;
  readonly pathSelfIntersections: number;
  readonly primitiveSpanViolations: readonly ScorePathReviewPrimitiveSpan[];
  readonly primitiveSpans: readonly ScorePathReviewPrimitiveSpan[];
  readonly reservedContentCollisions: number;
  readonly reservedContentCollisionsByChapter: Readonly<Record<string, number>>;
  readonly semanticFingerprint: string;
  readonly staffLineSelfIntersections: number;
  readonly terminal: {
    readonly finalBarlineT: 1;
    readonly maximumPrimitiveProgressAfterThickBar: number;
    readonly maximumStaffContinuationPastThinBar: number;
    readonly staffTerminatesAtFinalBarline: true;
    readonly terminalTailConnectorCount: 0;
  };
}

export interface ScorePathReviewTrack {
  readonly branch: ScorePathReviewBranch;
  readonly candidateId: ScorePathReviewCandidateId;
  readonly chapters: readonly ScorePathReviewChapterLayout[];
  readonly composition: ComposedSegment;
  readonly evidence: ScorePathReviewEvidence;
  readonly height: number;
  readonly mode: ScorePathReviewMode;
  readonly model: ScoreRenderModel;
  readonly path: ScorePath;
  readonly staffSpace: number;
  readonly viewBox: string;
  readonly width: number;
  readonly zones: readonly ScorePathReviewZone[];
}

interface CubicSegment {
  readonly control1: Vec2;
  readonly control2: Vec2;
  readonly end: Vec2;
  readonly start: Vec2;
}

interface SplineContinuityEvidence {
  readonly maximumCurvatureDelta: number;
  readonly maximumPointGap: number;
  readonly minimumTangentAlignment: number;
}

function add(left: Vec2, right: Vec2): Vec2 {
  return { x: left.x + right.x, y: left.y + right.y };
}

function subtract(left: Vec2, right: Vec2): Vec2 {
  return { x: left.x - right.x, y: left.y - right.y };
}

function scale(vector: Vec2, scalar: number): Vec2 {
  return { x: vector.x * scalar, y: vector.y * scalar };
}

function magnitude(vector: Vec2): number {
  return Math.hypot(vector.x, vector.y);
}

function normalize(vector: Vec2): Vec2 {
  const length = magnitude(vector);

  if (length <= 1e-9) {
    throw new RangeError("ScorePath review spline contains a cusp");
  }

  return scale(vector, 1 / length);
}

function dot(left: Vec2, right: Vec2): number {
  return left.x * right.x + left.y * right.y;
}

function cross(left: Vec2, right: Vec2): number {
  return left.x * right.y - left.y * right.x;
}

function cubicPoint(segment: CubicSegment, localT: number): Vec2 {
  const inverse = 1 - localT;

  return add(
    add(
      scale(segment.start, inverse ** 3),
      scale(segment.control1, 3 * inverse * inverse * localT),
    ),
    add(
      scale(segment.control2, 3 * inverse * localT * localT),
      scale(segment.end, localT ** 3),
    ),
  );
}

function cubicDerivative(segment: CubicSegment, localT: number): Vec2 {
  const inverse = 1 - localT;

  return add(
    add(
      scale(subtract(segment.control1, segment.start), 3 * inverse * inverse),
      scale(
        subtract(segment.control2, segment.control1),
        6 * inverse * localT,
      ),
    ),
    scale(subtract(segment.end, segment.control2), 3 * localT * localT),
  );
}

function cubicSecondDerivative(
  segment: CubicSegment,
  localT: number,
): Vec2 {
  return scale(
    add(
      scale(
        add(
          subtract(segment.control2, scale(segment.control1, 2)),
          segment.start,
        ),
        1 - localT,
      ),
      scale(
        add(
          subtract(segment.end, scale(segment.control2, 2)),
          segment.control1,
        ),
        localT,
      ),
    ),
    6,
  );
}

function signedCurvature(segment: CubicSegment, localT: number): number {
  const first = cubicDerivative(segment, localT);
  const second = cubicSecondDerivative(segment, localT);
  const speed = magnitude(first);

  if (speed <= 1e-9) {
    throw new RangeError("ScorePath review spline contains a curvature cusp");
  }

  return cross(first, second) / speed ** 3;
}

function buildCubicSplineSegments(knots: readonly Vec2[]): readonly CubicSegment[] {
  if (knots.length < 3) {
    throw new RangeError("ScorePath review spline requires at least three knots");
  }

  const first = knots[0]!;
  const second = knots[1]!;
  const last = knots.at(-1)!;
  const penultimate = knots.at(-2)!;
  const controls = [
    subtract(scale(first, 2), second),
    ...knots,
    subtract(scale(last, 2), penultimate),
  ];

  return Object.freeze(
    Array.from({ length: controls.length - 3 }, (_, index) => {
      const point0 = controls[index]!;
      const point1 = controls[index + 1]!;
      const point2 = controls[index + 2]!;
      const point3 = controls[index + 3]!;

      return Object.freeze({
        start: scale(add(add(point0, scale(point1, 4)), point2), 1 / 6),
        control1: scale(add(scale(point1, 4), scale(point2, 2)), 1 / 6),
        control2: scale(add(scale(point1, 2), scale(point2, 4)), 1 / 6),
        end: scale(add(add(point1, scale(point2, 4)), point3), 1 / 6),
      });
    }),
  );
}

class ReviewCubicSplineScorePath implements ScorePath {
  readonly continuity: SplineContinuityEvidence;
  readonly segmentCount: number;
  readonly #segments: readonly CubicSegment[];

  constructor(knots: readonly Vec2[]) {
    this.#segments = buildCubicSplineSegments(knots);
    this.segmentCount = this.#segments.length;
    this.continuity = this.#measureContinuity();
  }

  #resolve(t: number): { readonly localT: number; readonly segment: CubicSegment } {
    if (!Number.isFinite(t) || t < 0 || t > 1) {
      throw new RangeError("ScorePath review t must be inside 0..1");
    }

    const scaled = t === 1 ? this.segmentCount : t * this.segmentCount;
    const index = Math.min(this.segmentCount - 1, Math.floor(scaled));

    return {
      localT: t === 1 ? 1 : scaled - index,
      segment: this.#segments[index]!,
    };
  }

  #measureContinuity(): SplineContinuityEvidence {
    let maximumCurvatureDelta = 0;
    let maximumPointGap = 0;
    let minimumTangentAlignment = 1;

    for (let index = 0; index < this.#segments.length - 1; index += 1) {
      const current = this.#segments[index]!;
      const next = this.#segments[index + 1]!;
      const pointGap = magnitude(subtract(current.end, next.start));
      const tangentAlignment = dot(
        normalize(cubicDerivative(current, 1)),
        normalize(cubicDerivative(next, 0)),
      );
      const curvatureDelta = Math.abs(
        signedCurvature(current, 1) - signedCurvature(next, 0),
      );

      maximumPointGap = Math.max(maximumPointGap, pointGap);
      minimumTangentAlignment = Math.min(
        minimumTangentAlignment,
        tangentAlignment,
      );
      maximumCurvatureDelta = Math.max(
        maximumCurvatureDelta,
        curvatureDelta,
      );
    }

    return Object.freeze({
      maximumCurvatureDelta,
      maximumPointGap,
      minimumTangentAlignment,
    });
  }

  pointAt(t: number): Vec2 {
    const { localT, segment } = this.#resolve(t);

    return cubicPoint(segment, localT);
  }

  tangentAt(t: number): Vec2 {
    const { localT, segment } = this.#resolve(t);

    return normalize(cubicDerivative(segment, localT));
  }

  normalAt(t: number): Vec2 {
    const tangent = this.tangentAt(t);

    return { x: tangent.y, y: -tangent.x };
  }

  curvatureAt(t: number): number {
    const { localT, segment } = this.#resolve(t);

    return signedCurvature(segment, localT);
  }
}

const BRANCH_CHAPTERS = Object.freeze({
  professional: Object.freeze([
    "home",
    "professional-about",
    "professional-services",
    "professional-process",
    "professional-projects",
    "professional-contact",
    "professional-terminal",
  ] as const satisfies readonly StoryChapterId[]),
  application: Object.freeze([
    "home",
    "application-overview",
    "application-how-it-works",
    "application-benefits",
    "application-demo",
    "application-access",
    "application-terminal",
  ] as const satisfies readonly StoryChapterId[]),
});

const CHAPTER_HEIGHTS = Object.freeze({
  "vertical-wide": Object.freeze({
    professional: Object.freeze([840, 1400, 1500, 1350, 1850, 1320, 1050]),
    application: Object.freeze([840, 1450, 1350, 1250, 1300, 900, 1050]),
  }),
  "vertical-compact": Object.freeze({
    professional: Object.freeze([900, 1964, 2134, 1740, 2900, 2240, 1120]),
    application: Object.freeze([900, 1660, 1960, 1540, 1480, 1000, 1120]),
  }),
} as const);

const FLOWING_COMPACT_CONTENT_HEIGHTS = Object.freeze({
  professional: Object.freeze([380, 1380, 1500, 1220, 1880, 1400, 500]),
  application: Object.freeze([380, 1140, 1140, 980, 780, 500, 470]),
} as const);

const FLOWING_COMPACT_CONTENT_TOP_GAP = 170;
// 234px is the first integer transition interval that preserves the minimum
// curvature radius across the complete 344–414px compact-track matrix.
const FLOWING_COMPACT_CONTENT_BOTTOM_GAP = 64;
// The narrow Organic Soft reference shelf needs one extra wrapped text line at
// compact width. This allowance changes only its reserved About envelope.
const SOFT_COMPACT_ABOUT_CONTENT_ALLOWANCE = 16;

const RESERVED_REASONS = Object.freeze({
  home: Object.freeze(["heading-and-body"]),
  "professional-about": Object.freeze([
    "heading-and-body",
    "persona-slot",
  ]),
  "professional-services": Object.freeze([
    "heading-and-body",
    "services-modules",
  ]),
  "professional-process": Object.freeze([
    "heading-and-body",
    "process-stages",
  ]),
  "professional-projects": Object.freeze([
    "heading-and-body",
    "project-card-fan",
  ]),
  "professional-contact": Object.freeze([
    "heading-and-body",
    "contact-form",
  ]),
  "professional-terminal": Object.freeze(["terminal-content"]),
  "application-overview": Object.freeze([
    "heading-and-body",
    "application-overview",
  ]),
  "application-how-it-works": Object.freeze(["heading-and-body"]),
  "application-benefits": Object.freeze([
    "heading-and-body",
    "application-benefits",
  ]),
  "application-demo": Object.freeze([
    "heading-and-body",
    "application-tablet-demo",
  ]),
  "application-access": Object.freeze([
    "heading-and-body",
    "access-action",
  ]),
  "application-terminal": Object.freeze(["terminal-content"]),
} as const satisfies Readonly<
  Record<StoryChapterId, readonly ScorePathReservedContentReason[]>
>);

const RESERVED_COMPOSER_REASON = Object.freeze({
  home: "headline",
  "professional-about": "persona",
  "professional-projects": "project-cards",
  "professional-contact": "form",
  "application-demo": "tablet",
} as const satisfies Partial<Record<StoryChapterId, ReservedZoneReason>>);

const NOTATION_LOCAL_Y = Object.freeze({
  "organic-soft": Object.freeze({
    "vertical-wide": Object.freeze({
      professional: Object.freeze([94, 108, 92, 116, 98, 110, 90]),
      application: Object.freeze([94, 102, 120, 88, 112, 96, 90]),
    }),
    "vertical-compact": Object.freeze({
      professional: Object.freeze([96, 116, 94, 124, 102, 118, 92]),
      application: Object.freeze([96, 106, 126, 92, 120, 100, 92]),
    }),
  }),
  "organic-flowing": Object.freeze({
    "vertical-wide": Object.freeze({
      professional: Object.freeze([100, 124, 86, 118, 94, 132, 88]),
      application: Object.freeze([100, 90, 128, 82, 122, 98, 88]),
    }),
    "vertical-compact": Object.freeze({
      professional: Object.freeze([102, 132, 88, 130, 96, 138, 88]),
      application: Object.freeze([102, 92, 136, 86, 130, 102, 88]),
    }),
  }),
} as const);

const NOTATION_WAVE = Object.freeze({
  "organic-soft": Object.freeze([0, 2, -2, 3, -1, 2, 0]),
  "organic-flowing": Object.freeze([4, -7, 8, -6, 9, -5, 3]),
} as const);

interface AuthoredTrackGeometry {
  readonly chapters: readonly ScorePathReviewChapterLayout[];
  readonly height: number;
  readonly knots: readonly Vec2[];
  readonly notationRanges: readonly {
    readonly chapterId: StoryChapterId;
    readonly endSegmentIndex: number;
    readonly startSegmentIndex: number;
  }[];
  readonly staffSpace: number;
  readonly width: number;
}

function buildChapterLayouts(
  candidateId: ScorePathReviewCandidateId,
  mode: ScorePathReviewMode,
  branch: ScorePathReviewBranch,
  compactTrackWidth = 390,
): readonly ScorePathReviewChapterLayout[] {
  const chapterIds = BRANCH_CHAPTERS[branch];
  const heights = CHAPTER_HEIGHTS[mode][branch];
  const flowingHeightReduction = mode === "vertical-wide" ? 80 : 100;
  const usesCompactContentFlow =
    candidateId === "organic-flowing" && mode === "vertical-compact";
  const contentTop = usesCompactContentFlow
    ? FLOWING_COMPACT_CONTENT_TOP_GAP
    : mode === "vertical-wide"
      ? 200
      : 190;
  const contentBottomGap = usesCompactContentFlow
    ? FLOWING_COMPACT_CONTENT_BOTTOM_GAP
    : candidateId === "organic-flowing"
      ? 330 - flowingHeightReduction
      : 330;
  let top = 0;

  return Object.freeze(
    chapterIds.map((chapterId, index) => {
      const compactScale = compactTrackWidth / 390;
      const contentX =
        mode === "vertical-wide"
          ? 140
          : candidateId === "organic-flowing"
            ? index % 2 === 0
              ? 20 * compactScale
              : 52 * compactScale + 8
            : (60 / 390) * compactTrackWidth;
      const contentWidth =
        mode === "vertical-wide"
          ? 1000
          : candidateId === "organic-flowing"
            ? index % 2 === 0
              ? 372 * compactScale - 14 - contentX
              : 370 * compactScale - contentX
            : (270 / 390) * compactTrackWidth;
      const contentHeight = usesCompactContentFlow
        ? FLOWING_COMPACT_CONTENT_HEIGHTS[branch][index]!
        : null;
      const contentAllowance =
        candidateId === "organic-soft" &&
        mode === "vertical-compact" &&
        chapterId === "professional-about"
          ? SOFT_COMPACT_ABOUT_CONTENT_ALLOWANCE
          : 0;
      const height = usesCompactContentFlow
        ? contentTop + contentHeight! + contentBottomGap
        : heights[index]! -
          (candidateId === "organic-flowing" ? flowingHeightReduction : 0);
      const layout = Object.freeze({
        chapterId,
        height,
        top,
        contentRect: Object.freeze({
          x: contentX,
          y: top + contentTop,
          width: contentWidth,
          height:
            (contentHeight ?? height - contentTop - contentBottomGap) +
            contentAllowance,
        }),
        reservedReasons: RESERVED_REASONS[chapterId],
      });

      top += height;
      return layout;
    }),
  );
}

interface FlowingChapterPath {
  readonly chapter: ScorePathReviewChapterLayout;
  readonly points: readonly Vec2[];
}

function flowingChapterPoints(
  chapter: ScorePathReviewChapterLayout,
  chapterIndex: number,
  mode: ScorePathReviewMode,
  branch: ScorePathReviewBranch,
  trackWidth: number,
): readonly Vec2[] {
  const compact = mode === "vertical-compact";
  const compactScale = trackWidth / 390;
  const branchSign = branch === "professional" ? 1 : -1;
  const localY = NOTATION_LOCAL_Y["organic-flowing"][mode][branch][chapterIndex]!;
  const y = chapter.top + localY;
  const isOrigin = chapterIndex === 0;
  const isLeftBiased = chapterIndex % 2 === 1;
  const branchDrift =
    branchSign * (chapterIndex % 3 - 1) * (compact ? compactScale : 3);
  const shelfStart = isOrigin
    ? compact
      ? 20 * compactScale
      : 60
    : isLeftBiased
      ? (compact ? 20 * compactScale : 45) + branchDrift
      : (compact ? 338 * compactScale : 1150) + branchDrift;
  const shelfEnd = isOrigin
    ? compact
      ? 350 * compactScale
      : 1180
    : isLeftBiased
      ? compact
        ? 37 * compactScale
        : 95
      : compact
        ? 350 * compactScale
        : 1185;
  const pointCount = isOrigin ? 9 : 7;
  const descent = isOrigin
    ? compact
      ? 28 * compactScale
      : 34
    : compact
      ? 2.5 * compactScale
      : 7;
  const wave = isOrigin
    ? compact
      ? 0.8 * compactScale
      : 3
    : compact
      ? 0.03 * compactScale
      : 0.18;

  return Object.freeze(
    Array.from({ length: pointCount }, (_, pointIndex) => {
      const progress = pointIndex / (pointCount - 1);

      return Object.freeze({
        x: shelfStart + (shelfEnd - shelfStart) * progress,
        y:
          y +
          descent * progress +
          wave * branchSign * Math.sin(progress * Math.PI * 2),
      });
    }),
  );
}

function buildRevisedFlowingGeometry(
  mode: ScorePathReviewMode,
  branch: ScorePathReviewBranch,
  compactTrackWidth: number,
): AuthoredTrackGeometry {
  const compact = mode === "vertical-compact";
  const width = compact ? compactTrackWidth : 1280;
  const chapters = buildChapterLayouts(
    "organic-flowing",
    mode,
    branch,
    width,
  );
  const staffSpace = SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE[mode];
  const chapterPaths: readonly FlowingChapterPath[] = Object.freeze(
    chapters.map((chapter, index) =>
      Object.freeze({
        chapter,
        points: flowingChapterPoints(chapter, index, mode, branch, width),
      }),
    ),
  );
  const knots: Vec2[] = [];
  const notationRanges: Array<{
    readonly chapterId: StoryChapterId;
    readonly endSegmentIndex: number;
    readonly startSegmentIndex: number;
  }> = [];

  const firstPath = chapterPaths[0]!;
  knots.push(...firstPath.points);
  notationRanges.push({
    chapterId: firstPath.chapter.chapterId,
    startSegmentIndex: 0,
    endSegmentIndex: firstPath.points.length - 1,
  });

  for (let chapterIndex = 1; chapterIndex < chapterPaths.length; chapterIndex += 1) {
    const previous = chapterPaths[chapterIndex - 1]!;
    const current = chapterPaths[chapterIndex]!;
    const start = knots.at(-1)!;
    const target = current.points[0]!;
    const targetIsLeft = chapterIndex % 2 === 1;
    const corridorX =
      start.x > width / 2
        ? compact
          ? 372 * (width / 390)
          : 1225
        : compact
          ? 52 * (width / 390)
          : 130;
    const contentTop = previous.chapter.contentRect.y;
    const contentBottom =
      previous.chapter.contentRect.y + previous.chapter.contentRect.height;
    const branchAsymmetry =
      ((chapterIndex + (branch === "professional" ? 0 : 2)) % 3 - 1) *
      (compact ? 4 * (width / 390) : 12);
    const turnDirection = Math.sign(corridorX - start.x) || 1;
    const turnRadius = Math.abs(corridorX - start.x);
    const quarterTurn = Array.from({ length: 7 }, (_, turnIndex) => {
      const angle = -Math.PI / 2 + (Math.PI * turnIndex) / 12;

      return {
        x: start.x + Math.cos(angle) * turnRadius * turnDirection,
        y: start.y + turnRadius + Math.sin(angle) * turnRadius,
      };
    });
    const turnEnd = quarterTurn.at(-1)!;
    const upperTurnY = Math.max(
      contentTop - (compact ? 24 : 28),
      turnEnd.y + (compact ? 18 : 24),
    );
    const lowerTurnY = contentBottom + (compact ? 28 : 36);

    // Hold the staff in the real side corridor for the full reserved-content
    // envelope. Multiple vertical guides prevent the C2 spline from cutting a
    // corner through a scene while it begins and ends the turn.
    knots.push(
      ...quarterTurn.slice(1),
      { x: corridorX, y: upperTurnY },
      { x: corridorX, y: contentTop + (compact ? 42 : 54) },
      {
        x: corridorX + branchAsymmetry * 0.08,
        y: (contentTop + contentBottom) / 2,
      },
      { x: corridorX, y: contentBottom - (compact ? 42 : 54) },
      { x: corridorX, y: lowerTurnY },
    );

    let notationStartSegmentIndex: number;

    if (!targetIsLeft) {
      // LEFT -> RIGHT: the latter part of the single lateral crossing is a
      // long, shallow descent. It is structurally notation-safe and carries
      // the target chapter's unchanged semantic material.
      const horizontal = target.x - corridorX;
      const compactScale = width / 390;
      const safeStartY = target.y - (compact ? 66 * compactScale : 156);
      knots.push(
        {
          x: corridorX,
          y: safeStartY - (compact ? 54 * compactScale : 72),
        },
        {
          x: corridorX + horizontal * 0.06,
          y: safeStartY - (compact ? 24 * compactScale : 34),
        },
        {
          x: corridorX + horizontal * 0.18,
          y: safeStartY,
        },
        {
          x: corridorX + horizontal * 0.38,
          y:
            target.y -
            (compact ? 50 * compactScale : 100) +
            branchAsymmetry * 0.04,
        },
        {
          x: corridorX + horizontal * 0.64,
          y:
            target.y -
            (compact ? 29 * compactScale : 50) -
            branchAsymmetry * 0.03,
        },
        {
          x: corridorX + horizontal * 0.86,
          y: target.y - (compact ? 12 * compactScale : 20),
        },
      );
      notationStartSegmentIndex = knots.length - 3;
    } else {
      // RIGHT -> LEFT: make one dominant crossing, then use a compact,
      // asymmetric S settle to recover a left-to-right readable tangent.
      // Only that final shallow descent is notation-safe.
      const turnRadius = compact ? 10 * (width / 390) : 30;
      const turnCenter = {
        x: target.x,
        y: target.y - turnRadius,
      };
      const turn = Array.from({ length: 7 }, (_, turnIndex) => {
        const angle = -Math.PI / 2 - (Math.PI * turnIndex) / 6;

        return {
          x: turnCenter.x + Math.cos(angle) * turnRadius,
          y: turnCenter.y + Math.sin(angle) * turnRadius,
        };
      });
      const turnStart = turn[0]!;
      const crossingSpan = corridorX - turnStart.x;

      knots.push(
        {
          x: corridorX - crossingSpan * 0.18,
          y: lowerTurnY + (turnStart.y - lowerTurnY) * 0.26,
        },
        {
          x: corridorX - crossingSpan * 0.52 + branchAsymmetry,
          y: lowerTurnY + (turnStart.y - lowerTurnY) * 0.58,
        },
        {
          x: turnStart.x + turnRadius * (compact ? 4.2 : 4.8),
          y: turnStart.y - turnRadius * (compact ? 2.8 : 2.2),
        },
        {
          x: turnStart.x + turnRadius * 2.1,
          y: turnStart.y - turnRadius * 0.7,
        },
        ...turn.slice(0, -1),
      );
      notationStartSegmentIndex = knots.length + 1;
    }

    const startKnotIndex = knots.length;
    knots.push(...current.points);
    notationRanges.push({
      chapterId: current.chapter.chapterId,
      startSegmentIndex: notationStartSegmentIndex,
      endSegmentIndex:
        chapterIndex === chapterPaths.length - 1
          ? -1
          : startKnotIndex + current.points.length - 1,
    });
  }

  const finalSegmentIndex = knots.length - 1;
  const terminalRange = notationRanges.at(-1)!;
  notationRanges[notationRanges.length - 1] = {
    ...terminalRange,
    endSegmentIndex: finalSegmentIndex,
  };

  return Object.freeze({
    chapters,
    height: chapters.at(-1)!.top + chapters.at(-1)!.height,
    knots: Object.freeze(knots),
    notationRanges: Object.freeze(notationRanges.map((range) => Object.freeze(range))),
    staffSpace,
    width,
  });
}

function pushOrganicConnectorSpan(
  knots: Vec2[],
  target: Vec2,
  maximumKnotDistance: number,
  bulge: number,
  phase: number,
): void {
  const start = knots.at(-1);

  if (!start) {
    knots.push(target);
    return;
  }

  const delta = subtract(target, start);
  const distance = magnitude(delta);
  const subdivisions = Math.max(1, Math.ceil(distance / maximumKnotDistance));
  const perpendicular = distance <= 1e-9
    ? { x: 0, y: 0 }
    : { x: -delta.y / distance, y: delta.x / distance };
  const direction = phase % 2 === 0 ? 1 : -1;

  for (let index = 1; index <= subdivisions; index += 1) {
    const progress = index / subdivisions;
    const organicOffset =
      index === subdivisions
        ? 0
        : Math.sin(Math.PI * progress) * bulge * direction;

    knots.push({
      x: start.x + delta.x * progress + perpendicular.x * organicOffset,
      y: start.y + delta.y * progress + perpendicular.y * organicOffset,
    });
  }
}

function buildAuthoredGeometry(
  candidateId: ScorePathReviewCandidateId,
  mode: ScorePathReviewMode,
  branch: ScorePathReviewBranch,
  compactTrackWidth: number,
): AuthoredTrackGeometry {
  if (candidateId === "organic-flowing") {
    return buildRevisedFlowingGeometry(mode, branch, compactTrackWidth);
  }

  const width = mode === "vertical-wide" ? 1280 : compactTrackWidth;
  const chapters = buildChapterLayouts(candidateId, mode, branch, width);
  const staffSpace = SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE[mode];
  const compactScale = width / 390;
  const outerLeft = mode === "vertical-wide" ? 65 : 24 * compactScale;
  const outerRight = mode === "vertical-wide" ? 1215 : width - 24 * compactScale;
  const baseLeft = mode === "vertical-wide" ? 100 : 35 * compactScale;
  const baseRight = mode === "vertical-wide" ? 1180 : width - 35 * compactScale;
  const leftVariation =
    candidateId === "organic-soft"
      ? [0, 18, -10, 12, -16, 8, -4]
      : [4, 28, -18, 20, -24, 14, -8];
  const rightVariation =
    candidateId === "organic-soft"
      ? [0, -14, 12, -8, 16, -12, 4]
      : [-6, -26, 18, -16, 24, -20, 8];
  const branchSign = branch === "professional" ? 1 : -1;
  const modeScale = mode === "vertical-wide" ? 1 : 0.42 * compactScale;
  const notationY = NOTATION_LOCAL_Y[candidateId][mode][branch];
  const wave = NOTATION_WAVE[candidateId];
  const knots: Vec2[] = [];
  const notationRanges: Array<{
    readonly chapterId: StoryChapterId;
    readonly endSegmentIndex: number;
    readonly startSegmentIndex: number;
  }> = [];

  chapters.forEach((chapter, index) => {
    const left = baseLeft + (leftVariation[index] ?? 0) * modeScale;
    const right = baseRight + (rightVariation[index] ?? 0) * modeScale;
    const localY = notationY[index] ?? 96;
    const y = chapter.top + localY;
    const authoredWave = (wave[index] ?? 0) * modeScale * branchSign;
    const notationPoints = [
      { x: left, y: y - authoredWave * 0.25 },
      { x: left + (right - left) * 0.14, y: y - authoredWave * 0.1 },
      { x: left + (right - left) * 0.3, y: y + authoredWave * 0.4 },
      { x: (left + right) / 2, y: y + authoredWave },
      { x: left + (right - left) * 0.7, y: y + authoredWave * 0.4 },
      { x: left + (right - left) * 0.86, y: y - authoredWave * 0.1 },
      { x: right, y: y - authoredWave * 0.2 },
    ] as const;
    const startKnotIndex = knots.length;

    knots.push(...notationPoints);
    notationRanges.push(
      Object.freeze({
        chapterId: chapter.chapterId,
        startSegmentIndex: startKnotIndex + 1,
        endSegmentIndex:
          index === chapters.length - 1
            ? startKnotIndex + 6
            : startKnotIndex + 5,
      }),
    );

    const next = chapters[index + 1];
    if (!next) return;

    const connectorIndex = index + (branch === "professional" ? 0 : 2);
    const earlyDrop =
      (candidateId === "organic-soft" ? 142 : 166) +
      ((connectorIndex * 17) % 37);
    const bottomApproach = 172 + ((connectorIndex * 23) % 54);
    const crossOffset =
      candidateId === "organic-soft"
        ? ((connectorIndex % 3) - 1) * 54
        : ((connectorIndex % 4) - 1.5) * 92;
    const sideDrift =
      candidateId === "organic-soft"
        ? ((connectorIndex % 2) * 2 - 1) * 12
        : ((connectorIndex % 3) - 1) * 24;

    const maximumKnotDistance = mode === "vertical-wide" ? 210 : 145;
    const bulge =
      (candidateId === "organic-soft" ? 11 : 19) *
      (mode === "vertical-wide" ? 1 : 0.42);
    const connectorKnots = [
      {
        x: outerRight - sideDrift * modeScale,
        y: y + earlyDrop * (mode === "vertical-wide" ? 1 : 0.82),
      },
      {
        x: outerRight + sideDrift * modeScale * 0.35,
        y: chapter.top + chapter.height - bottomApproach,
      },
      {
        x: width / 2 + crossOffset * modeScale * branchSign,
        y:
          chapter.top +
          chapter.height +
          (candidateId === "organic-soft" ? -78 : -94) +
          ((connectorIndex % 3) - 1) * 12,
      },
      {
        x: outerLeft + sideDrift * modeScale * 0.25,
        y: next.top - 18 + ((connectorIndex * 11) % 28),
      },
    ] as const;

    connectorKnots.forEach((target, targetIndex) => {
      pushOrganicConnectorSpan(
        knots,
        target,
        maximumKnotDistance,
        bulge * (targetIndex === 1 ? 1.2 : 0.7),
        connectorIndex + targetIndex,
      );
    });
  });

  return Object.freeze({
    chapters,
    height: chapters.at(-1)!.top + chapters.at(-1)!.height,
    knots: Object.freeze(knots),
    notationRanges: Object.freeze(notationRanges),
    staffSpace,
    width,
  });
}

function buildCompositionSlots(
  branch: ScorePathReviewBranch,
): {
  readonly reservedZones: readonly ReservedScoreZone[];
  readonly slots: readonly ScoreCompositionSlot[];
} {
  const chapters = BRANCH_CHAPTERS[branch];
  const slotIds = chapters.flatMap((chapterId) => [
    `${chapterId}:primary`,
    `${chapterId}:reserved`,
  ]);
  const slotCount = slotIds.length;
  const slots = slotIds.map((id, index) => {
    const start = (index + 0.14) / slotCount;
    const end = (index + 0.86) / slotCount;

    return Object.freeze({
      id,
      start,
      end,
      density: id.endsWith(":reserved") ? "sparse" : "normal",
      allowedMotifFamilies: Object.freeze(["quarter"] as const),
      ...(id.startsWith(`${chapters.at(-1)}:`)
        ? { role: "terminal" as const }
        : {}),
    });
  });
  const reservedZones = chapters.flatMap((chapterId, chapterIndex) => {
    const reason = RESERVED_COMPOSER_REASON[chapterId as keyof typeof RESERVED_COMPOSER_REASON];

    if (!reason) return [];

    const slot = slots[chapterIndex * 2 + 1]!;
    return [Object.freeze({ start: slot.start, end: slot.end, reason })];
  });

  return Object.freeze({
    slots: Object.freeze(slots),
    reservedZones: Object.freeze(reservedZones),
  });
}

function composeReviewBranch(branch: ScorePathReviewBranch): ComposedSegment {
  const { reservedZones, slots } = buildCompositionSlots(branch);

  return composeSegment({
    sessionSeed: SCORE_PATH_REVIEW_SEED,
    branchId: `score-path-review:${branch}`,
    chapterId: `score-path-layout:${branch}`,
    profile: "CALM",
    slots,
    reservedZones,
  });
}

function sampleRange(
  path: ScorePath,
  startT: number,
  endT: number,
  sampleCount: number,
): readonly Vec2[] {
  return Object.freeze(
    Array.from({ length: sampleCount }, (_, index) =>
      path.pointAt(startT + ((endT - startT) * index) / (sampleCount - 1)),
    ),
  );
}

function tangentAngleDegrees(path: ScorePath, t: number): number {
  const tangent = path.tangentAt(t);

  return Math.abs((Math.atan2(tangent.y, tangent.x) * 180) / Math.PI);
}

function polylineArcLength(points: readonly Vec2[]): number {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    length += magnitude(subtract(points[index]!, points[index - 1]!));
  }

  return length;
}

export function scorePathReviewDescendingPolylineArcLength(
  points: readonly Vec2[],
): number {
  let length = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]!;
    const current = points[index]!;
    const verticalDelta = current.y - previous.y;

    // Cross-runtime floating-point noise around a level shelf must not flip an
    // entire sampled segment between ascending and descending evidence.
    if (verticalDelta > SCORE_PATH_REVIEW_GEOMETRY_EPSILON) {
      length += magnitude(subtract(current, previous));
    }
  }

  return length;
}

function buildZones(
  path: ReviewCubicSplineScorePath,
  geometry: AuthoredTrackGeometry,
  composition: ComposedSegment,
): readonly ScorePathReviewZone[] {
  const segmentCount = path.segmentCount;
  const slotIds = [
    ...composition.motifs.map(({ slotId }) => slotId),
    ...composition.emptySlots.map(({ slotId }) => slotId),
  ];
  const zones: ScorePathReviewZone[] = [];
  let cursor = 0;

  for (const [index, range] of geometry.notationRanges.entries()) {
    const startT = range.startSegmentIndex / segmentCount;
    const endT = range.endSegmentIndex / segmentCount;

    if (startT > cursor) {
      const points = sampleRange(path, cursor, startT, 65);
      zones.push(
        Object.freeze({
          arcLength: polylineArcLength(points),
          descendingArcLength:
            scorePathReviewDescendingPolylineArcLength(points),
          id: `connector:${index}`,
          kind: "connector",
          startT: cursor,
          endT: startT,
          semanticSlotIds: Object.freeze([]),
          eventCount: 0,
          maximumTangentAngleDeg: null,
          maximumTangentT: null,
          points,
          verticalBudget: Math.abs(points.at(-1)!.y - points[0]!.y),
        }),
      );
    }

    const chapterSlotIds = slotIds.filter((slotId) =>
      slotId.startsWith(`${range.chapterId}:`),
    );
    const eventCount = composition.motifs
      .filter(({ slotId }) => chapterSlotIds.includes(slotId))
      .reduce((count, motif) => count + motif.notes.length, 0);
    const tangentSamples = Array.from({ length: 129 }, (_, sampleIndex) => {
      const t = startT + ((endT - startT) * sampleIndex) / 128;

      return Object.freeze({ angle: tangentAngleDegrees(path, t), t });
    });
    const maximumTangent = tangentSamples.reduce((maximum, sample) =>
      sample.angle > maximum.angle ? sample : maximum,
    );

    const points = sampleRange(path, startT, endT, 65);
    zones.push(
      Object.freeze({
        arcLength: polylineArcLength(points),
        descendingArcLength:
          scorePathReviewDescendingPolylineArcLength(points),
        id: `notation:${range.chapterId}`,
        kind: "notation-safe",
        startT,
        endT,
        semanticSlotIds: Object.freeze(chapterSlotIds),
        eventCount,
        maximumTangentAngleDeg: maximumTangent.angle,
        maximumTangentT: maximumTangent.t,
        points,
        verticalBudget: null,
      }),
    );
    cursor = endT;
  }

  if (cursor < 1) {
    const points = sampleRange(path, cursor, 1, 65);
    zones.push(
      Object.freeze({
        arcLength: polylineArcLength(points),
        descendingArcLength:
          scorePathReviewDescendingPolylineArcLength(points),
        id: "connector:terminal-tail",
        kind: "connector",
        startT: cursor,
        endT: 1,
        semanticSlotIds: Object.freeze([]),
        eventCount: 0,
        maximumTangentAngleDeg: null,
        maximumTangentT: null,
        points,
        verticalBudget: Math.abs(points.at(-1)!.y - points[0]!.y),
      }),
    );
  }

  return Object.freeze(zones);
}

function notationZoneForSlot(
  zones: readonly ScorePathReviewZone[],
  slotId: string,
): ScorePathReviewZone {
  const zone = zones.find(
    (candidate) =>
      candidate.kind === "notation-safe" &&
      candidate.semanticSlotIds.includes(slotId),
  );

  if (!zone) {
    throw new RangeError(`Missing notation zone for review slot ${slotId}`);
  }

  return zone;
}

function noteTsForSlot(
  zone: ScorePathReviewZone,
  slotId: string,
  noteCount: number,
): readonly number[] {
  const slotIndex = zone.semanticSlotIds.indexOf(slotId);
  const slotCount = zone.semanticSlotIds.length;

  if (slotIndex < 0 || slotCount === 0) {
    throw new RangeError(`Review slot ${slotId} is outside its notation zone`);
  }

  const zoneSpan = zone.endT - zone.startT;
  const contentStart = zone.startT + zoneSpan * 0.2;
  const contentEnd = zone.endT - zoneSpan * 0.2;
  const slotSpan = (contentEnd - contentStart) / slotCount;
  const start = contentStart + slotSpan * slotIndex + slotSpan * 0.18;
  const end = contentStart + slotSpan * (slotIndex + 1) - slotSpan * 0.18;

  if (noteCount === 1) return Object.freeze([(start + end) / 2]);

  return Object.freeze(
    Array.from(
      { length: noteCount },
      (_, index) => start + ((end - start) * index) / (noteCount - 1),
    ),
  );
}

function zonePlacementT(
  zone: ScorePathReviewZone,
  localT: number,
): number {
  return zone.startT + (zone.endT - zone.startT) * localT;
}

function buildReviewModel(
  id: string,
  path: ReviewCubicSplineScorePath,
  staffSpace: number,
  zones: readonly ScorePathReviewZone[],
  composition: ComposedSegment,
): ScoreRenderModel {
  const notationZones = zones.filter(
    (zone) => zone.kind === "notation-safe",
  );
  const origin = notationZones[0];
  const terminal = notationZones.at(-1);

  if (!origin || !terminal) {
    throw new RangeError("Review model requires origin and terminal notation zones");
  }

  const motifs: readonly ScoreMotifPlacement[] = composition.motifs.map(
    (motif) => {
      const zone = notationZoneForSlot(zones, motif.slotId);
      return Object.freeze({
        motif,
        noteTs: noteTsForSlot(zone, motif.slotId, motif.notes.length),
      });
    },
  );

  return buildScoreModel({
    id,
    path,
    staffSpace,
    staffSampleCount: Math.max(1025, path.segmentCount * 25),
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    clef: { t: zonePlacementT(origin, 0.07) },
    keySignature: { fifths: 2, t: zonePlacementT(origin, 0.15) },
    motifs,
    barlines: notationZones.slice(0, -1).map((zone, index) => ({
      id: `chapter-${index + 1}`,
      t: zonePlacementT(zone, 0.88),
    })),
    finalBarline: {
      id: "terminal",
      t: 1,
    },
  });
}

function pointInsideRect(point: Vec2, rect: ScorePathReviewRect): boolean {
  return (
    point.x > rect.x &&
    point.x < rect.x + rect.width &&
    point.y > rect.y &&
    point.y < rect.y + rect.height
  );
}

function orientation(a: Vec2, b: Vec2, c: Vec2): number {
  return cross(subtract(b, a), subtract(c, a));
}

function segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
  const abC = orientation(a, b, c);
  const abD = orientation(a, b, d);
  const cdA = orientation(c, d, a);
  const cdB = orientation(c, d, b);

  return abC * abD < -1e-7 && cdA * cdB < -1e-7;
}

function polylineSelfIntersections(points: readonly Vec2[]): number {
  let intersections = 0;

  for (let leftIndex = 0; leftIndex < points.length - 1; leftIndex += 1) {
    const a = points[leftIndex]!;
    const b = points[leftIndex + 1]!;

    for (
      let rightIndex = leftIndex + 4;
      rightIndex < points.length - 1;
      rightIndex += 1
    ) {
      if (
        segmentsIntersect(
          a,
          b,
          points[rightIndex]!,
          points[rightIndex + 1]!,
        )
      ) {
        intersections += 1;
      }
    }
  }

  return intersections;
}

function fnv1a(value: string): string {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function scorePathReviewSemanticFingerprint(
  composition: ComposedSegment,
): string {
  return fnv1a(
    JSON.stringify({
      composerVersion: composition.composerVersion,
      pitchContourTableVersion: composition.pitchContourTableVersion,
      seed: composition.seed,
      branchId: composition.branchId,
      chapterId: composition.chapterId,
      profile: composition.profile,
      motifs: composition.motifs.map((motif) => ({
        slotId: motif.slotId,
        motifId: motif.motifId,
        durations: motif.durations,
        staffSteps: motif.staffSteps,
        contourId: motif.contourId,
        contourTranslation: motif.contourTranslation,
      })),
      emptySlots: composition.emptySlots,
    }),
  );
}

function primitiveLength(
  primitive: Extract<
    ScoreRenderModel["primitives"][number],
    { readonly kind: "beam" | "line" }
  >,
): number {
  return magnitude(subtract(primitive.end, primitive.start));
}

function buildPrimitiveSpanEvidence(
  model: ScoreRenderModel,
  staffSpace: number,
): readonly ScorePathReviewPrimitiveSpan[] {
  const spans: ScorePathReviewPrimitiveSpan[] = [];

  for (const motif of model.motifs) {
      const centers = motif.notes.map(({ center }) => center);
      const groupSpan = centers.reduce(
        (maximum, center, index) =>
          Math.max(
            maximum,
            ...centers
              .slice(index + 1)
              .map((other) => magnitude(subtract(other, center))),
          ),
        0,
      );
      const rhythmicGroup = `${motif.motifId}:${motif.id}`;

      for (const primitive of motif.primitives) {
        if (primitive.kind === "beam") {
          spans.push(
            Object.freeze({
              id: primitive.id,
              length: primitiveLength(primitive),
              maximumAllowedLength:
                groupSpan + APPROVED_RENDERER_TOKENS.beam.hookLengthSp * staffSpace,
              rhythmicGroup,
              role: "beam" as const,
              semanticSlotId: motif.id,
            }),
          );
          continue;
        }

        if (primitive.kind === "line" && primitive.role === "stem") {
          spans.push(
            Object.freeze({
              id: primitive.id,
              length: primitiveLength(primitive),
              maximumAllowedLength: Math.max(
                groupSpan * 1.5,
                APPROVED_RENDERER_TOKENS.note.stemLengthSp * staffSpace * 1.75,
              ),
              rhythmicGroup,
              role: "stem" as const,
              semanticSlotId: motif.id,
            }),
          );
        }
      }
  }

  return Object.freeze(spans);
}

function midpoint(start: Vec2, end: Vec2): Vec2 {
  return scale(add(start, end), 0.5);
}

function buildEvidence(
  path: ReviewCubicSplineScorePath,
  geometry: AuthoredTrackGeometry,
  zones: readonly ScorePathReviewZone[],
  composition: ComposedSegment,
  model: ScoreRenderModel,
): ScorePathReviewEvidence {
  const staffLines = sampleStaffLines(path, geometry.staffSpace, 769);
  const allStaffPoints = staffLines.flatMap(({ points }) => points);
  const maximumNotationTangentAngleDeg = Math.max(
    ...zones.flatMap((zone) =>
      zone.maximumTangentAngleDeg === null
        ? []
        : [zone.maximumTangentAngleDeg],
    ),
  );
  const reservedContentCollisionsByChapter = Object.freeze(
    Object.fromEntries(
      geometry.chapters.map((chapter) => [
        chapter.chapterId,
        allStaffPoints.filter((point) =>
          pointInsideRect(point, chapter.contentRect),
        ).length,
      ]),
    ),
  );
  const reservedContentCollisions = Object.values(
    reservedContentCollisionsByChapter,
  ).reduce((total, count) => total + count, 0);
  const boundsViolations = allStaffPoints.filter(
    (point) =>
      point.x < 0 ||
      point.x > geometry.width ||
      point.y < 0 ||
      point.y > geometry.height,
  ).length;
  const clef = model.primitives.find(
    (primitive) => primitive.kind === "glyph" && primitive.role === "clef",
  );
  const finalStrokes = model.primitives.filter(
    (primitive) =>
      primitive.kind === "line" &&
      (primitive.role === "final-barline-thin" ||
        primitive.role === "final-barline-thick"),
  );

  if (!clef || clef.kind !== "glyph") {
    throw new RangeError("ScorePath review candidate is missing its treble clef");
  }

  if (
    finalStrokes.length !== 2 ||
    finalStrokes[0]?.role !== "final-barline-thin" ||
    finalStrokes[1]?.role !== "final-barline-thick"
  ) {
    throw new RangeError("ScorePath review final barline is not thin-gap-thick");
  }

  const finalThin = finalStrokes[0]!;
  const finalThick = finalStrokes[1]!;
  const connectors = zones.filter(({ kind }) => kind === "connector");
  const notationZones = zones.filter(({ kind }) => kind === "notation-safe");
  const primitiveSpans = buildPrimitiveSpanEvidence(model, geometry.staffSpace);
  const primitiveSpanViolations = Object.freeze(
    primitiveSpans.filter(
      ({ length, maximumAllowedLength }) =>
        length > maximumAllowedLength + 1e-7,
    ),
  );
  const pathEnd = path.pointAt(1);
  const endTangent = path.tangentAt(1);
  const finalThinCenter = midpoint(finalThin.start, finalThin.end);
  const finalThickCenter = midpoint(finalThick.start, finalThick.end);
  const thickOuterEdgeProgress =
    dot(subtract(finalThickCenter, pathEnd), endTangent) +
    finalThick.thickness / 2;
  const maximumStaffContinuationPastThinBar = Math.max(
    0,
    ...model.staff.lines.map(({ points }) =>
      dot(subtract(points.at(-1)!, pathEnd), endTangent),
    ),
  );
  const maximumPrimitiveT = Math.max(
    0,
    ...model.motifs.flatMap(({ notes }) => notes.map(({ t }) => t)),
  );
  const maximumPrimitiveProgressAfterThickBar = Math.max(
    0,
    maximumPrimitiveT - 1,
  );
  const terminalTailConnectorCount = zones.filter(
    (zone) =>
      zone.kind === "connector" && zone.startT >= notationZones.at(-1)!.endT,
  ).length;

  if (
    magnitude(subtract(finalThinCenter, pathEnd)) > 1e-7 ||
    thickOuterEdgeProgress <= 0 ||
    maximumStaffContinuationPastThinBar > 1e-7 ||
    maximumPrimitiveProgressAfterThickBar > 1e-7 ||
    terminalTailConnectorCount !== 0
  ) {
    throw new RangeError("ScorePath review final barline does not terminate the staff");
  }

  let minimumAdjacentStaffLineDistance = Number.POSITIVE_INFINITY;
  for (let lineIndex = 0; lineIndex < staffLines.length - 1; lineIndex += 1) {
    const current = staffLines[lineIndex]!.points;
    const next = staffLines[lineIndex + 1]!.points;

    for (let pointIndex = 0; pointIndex < current.length; pointIndex += 1) {
      minimumAdjacentStaffLineDistance = Math.min(
        minimumAdjacentStaffLineDistance,
        magnitude(subtract(current[pointIndex]!, next[pointIndex]!)),
      );
    }
  }

  const curvatureSamples = Array.from({ length: 2049 }, (_, index) => {
    const t = index / 2048;
    const curvature = Math.abs(path.curvatureAt(t));

    return Object.freeze({
      radius: curvature <= 1e-12 ? Number.POSITIVE_INFINITY : 1 / curvature,
      t,
    });
  });
  const minimumCurvature = curvatureSamples.reduce((minimum, sample) =>
    sample.radius < minimum.radius ? sample : minimum,
  );
  const evidence = Object.freeze({
    boundsViolations,
    clef: Object.freeze({
      mirrorX: clef.mirrorX,
      mirrorY: clef.mirrorY,
      rotationDegrees: (clef.rotationRadians * 180) / Math.PI,
    }),
    connectorEventCount: zones
      .filter(({ kind }) => kind === "connector")
      .reduce((count, zone) => count + zone.eventCount, 0),
    continuity: path.continuity,
    finalBarline: "thin-gap-thick-conventional" as const,
    flowMetrics: Object.freeze({
      contentOwnedHeight: geometry.chapters.reduce(
        (total, chapter) => total + chapter.contentRect.height,
        0,
      ),
      largestContentFreeVerticalInterval: geometry.chapters
        .slice(1)
        .reduce((largest, chapter, index) => {
          const previous = geometry.chapters[index]!;
          const previousContentEnd =
            previous.contentRect.y + previous.contentRect.height;

          return Math.max(largest, chapter.contentRect.y - previousContentEnd);
        }, 0),
      longestConnectorArcLength: Math.max(
        0,
        ...connectors.map(({ arcLength }) => arcLength),
      ),
      notationSafeDescendingArcLength: notationZones.reduce(
        (total, zone) => total + zone.descendingArcLength,
        0,
      ),
      totalConnectorArcLength: connectors.reduce(
        (total, zone) => total + zone.arcLength,
        0,
      ),
      totalTrackHeight: geometry.height,
      transitionOnlyHeight:
        geometry.height -
        geometry.chapters.reduce(
          (total, chapter) => total + chapter.contentRect.height,
          0,
        ),
      transitionOnlyVerticalDistance: connectors.reduce(
        (total, zone) => total + (zone.verticalBudget ?? 0),
        0,
      ),
    }),
    fiveLineContinuity: true as const,
    maximumNotationTangentAngleDeg,
    minimumAdjacentStaffLineDistance,
    minimumCurvatureRadius: minimumCurvature.radius,
    minimumCurvatureT: minimumCurvature.t,
    pathSelfIntersections: polylineSelfIntersections(
      sampleRange(path, 0, 1, 769),
    ),
    primitiveSpanViolations,
    primitiveSpans,
    reservedContentCollisions,
    reservedContentCollisionsByChapter,
    semanticFingerprint: scorePathReviewSemanticFingerprint(composition),
    staffLineSelfIntersections: staffLines.reduce(
      (count, line) => count + polylineSelfIntersections(line.points),
      0,
    ),
    terminal: Object.freeze({
      finalBarlineT: 1 as const,
      maximumPrimitiveProgressAfterThickBar,
      maximumStaffContinuationPastThinBar,
      staffTerminatesAtFinalBarline: true as const,
      terminalTailConnectorCount: 0 as const,
    }),
  });

  if (
    evidence.maximumNotationTangentAngleDeg >
      SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG + 1e-7 ||
    evidence.connectorEventCount !== 0 ||
    evidence.continuity.maximumPointGap > 1e-7 ||
    evidence.continuity.minimumTangentAlignment < 1 - 1e-7 ||
    evidence.continuity.maximumCurvatureDelta > 1e-7 ||
    evidence.reservedContentCollisions !== 0 ||
    evidence.boundsViolations !== 0 ||
    evidence.pathSelfIntersections !== 0 ||
    evidence.staffLineSelfIntersections !== 0 ||
    evidence.minimumCurvatureRadius <= geometry.staffSpace * 2 ||
    evidence.minimumAdjacentStaffLineDistance < geometry.staffSpace - 1e-6 ||
    evidence.primitiveSpanViolations.length !== 0 ||
    !evidence.terminal.staffTerminatesAtFinalBarline ||
    evidence.clef.mirrorX ||
    evidence.clef.mirrorY ||
    Math.abs(evidence.clef.rotationDegrees) >
      SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG
  ) {
    throw new RangeError(
      `ScorePath review candidate failed structural validation: ${JSON.stringify({
        ...evidence,
        notationZoneAngles: Object.fromEntries(
          notationZones.map((zone) => [
            zone.id,
            { angle: zone.maximumTangentAngleDeg, t: zone.maximumTangentT },
          ]),
        ),
      })}`,
    );
  }

  return evidence;
}

const REVIEW_TRACK_CACHE = new Map<string, ScorePathReviewTrack>();

export function buildScorePathReviewTrack(
  candidateId: ScorePathReviewCandidateId,
  mode: ScorePathReviewMode,
  branch: ScorePathReviewBranch,
  options: ScorePathReviewBuildOptions = {},
): ScorePathReviewTrack {
  const compactTrackWidth =
    mode === "vertical-compact"
      ? Math.max(
          SCORE_PATH_REVIEW_COMPACT_MIN_WIDTH,
          Math.min(
            SCORE_PATH_REVIEW_COMPACT_MAX_WIDTH,
            Math.round(options.compactTrackWidth ?? 390),
          ),
        )
      : 1280;
  const cacheKey = `${candidateId}:${mode}:${branch}:${compactTrackWidth}`;
  const cached = REVIEW_TRACK_CACHE.get(cacheKey);

  if (cached) return cached;

  const geometry = buildAuthoredGeometry(
    candidateId,
    mode,
    branch,
    compactTrackWidth,
  );
  const path = new ReviewCubicSplineScorePath(geometry.knots);
  const composition = composeReviewBranch(branch);
  const zones = buildZones(path, geometry, composition);
  const model = buildReviewModel(
    `phase-9-task-33:${candidateId}:${mode}:${branch}`,
    path,
    geometry.staffSpace,
    zones,
    composition,
  );
  const evidence = buildEvidence(
    path,
    geometry,
    zones,
    composition,
    model,
  );
  const track = Object.freeze({
    branch,
    candidateId,
    chapters: geometry.chapters,
    composition,
    evidence,
    height: geometry.height,
    mode,
    model,
    path,
    staffSpace: geometry.staffSpace,
    viewBox: `0 0 ${geometry.width} ${geometry.height}`,
    width: geometry.width,
    zones,
  });

  REVIEW_TRACK_CACHE.set(cacheKey, track);
  return track;
}

export function resolveScorePathReviewSelection(
  input: Readonly<Record<string, string | string[] | undefined>>,
): {
  readonly candidateId: ScorePathReviewCandidateId;
  readonly mode: ScorePathReviewMode;
  readonly theme: ScorePathReviewTheme;
} {
  const first = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;
  const candidate = first(input.candidate);
  const mode = first(input.mode);
  const theme = first(input.theme);

  return Object.freeze({
    candidateId: SCORE_PATH_REVIEW_CANDIDATE_IDS.includes(
      candidate as ScorePathReviewCandidateId,
    )
      ? (candidate as ScorePathReviewCandidateId)
      : "organic-flowing",
    mode: SCORE_PATH_REVIEW_MODES.includes(mode as ScorePathReviewMode)
      ? (mode as ScorePathReviewMode)
      : "vertical-wide",
    theme: SCORE_PATH_REVIEW_THEMES.includes(theme as ScorePathReviewTheme)
      ? (theme as ScorePathReviewTheme)
      : "light",
  });
}

export function scorePathReviewUrl(
  candidateId: ScorePathReviewCandidateId,
  mode: ScorePathReviewMode,
  theme: ScorePathReviewTheme,
  preview = false,
): string {
  const route = preview
    ? "/__visual-lab/story/score-paths/preview"
    : "/__visual-lab/story/score-paths";
  const search = new URLSearchParams({ candidate: candidateId, mode, theme });

  return `${route}?${search.toString()}`;
}

export function scorePathReviewEventPlacements(
  track: ScorePathReviewTrack,
): readonly {
  readonly slotId: string;
  readonly tangentAngleDeg: number;
  readonly t: number;
  readonly zoneId: string;
}[] {
  return Object.freeze(
    track.composition.motifs.flatMap((motif) => {
      const zone = notationZoneForSlot(track.zones, motif.slotId);

      return noteTsForSlot(zone, motif.slotId, motif.notes.length).map((t) =>
        Object.freeze({
          slotId: motif.slotId,
          tangentAngleDeg: tangentAngleDegrees(track.path, t),
          t,
          zoneId: zone.id,
        }),
      );
    }),
  );
}

export function scorePathReviewFrameAt(
  track: ScorePathReviewTrack,
  t: number,
) {
  return frameAt(track.path, t);
}

export function scorePathReviewStaffPoint(
  track: ScorePathReviewTrack,
  t: number,
  staffStep: number,
) {
  return placeAtStaffStep(track.path, t, staffStep, track.staffSpace);
}
