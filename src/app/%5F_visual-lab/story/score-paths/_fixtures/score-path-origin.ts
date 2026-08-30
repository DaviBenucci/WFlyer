import type { ScorePath, Vec2 } from "@/lib/music/geometry/types";
import { requireNormalizedPosition } from "@/lib/music/geometry/units";
import { distanceBetween, normalizeVector } from "@/lib/music/geometry/vectors";
import { buildScoreModel } from "@/lib/music/renderer/build-score-model";
import type {
  GlyphRenderPrimitive,
  ScoreRenderModel,
} from "@/lib/music/renderer/types";

import { APPROVED_RENDERER_GLYPH_CALIBRATIONS } from "../../../music/_fixtures/approved-calibration";
import { APPROVED_RENDERER_TOKENS } from "../../../music/_fixtures/draft-calibration";
import { SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE } from "./score-path-candidates";

export const SCORE_PATH_ORIGIN_REVIEW_STATUS = "HUMAN_APPROVAL_PENDING";
export const SCORE_PATH_ORIGIN_REVIEW_LABEL =
  "ORIGIN_CURVE — HUMAN_APPROVAL_PENDING";
export const SCORE_PATH_ORIGIN_REVIEW_ASSET = Object.freeze({
  assetId: "MUS-GLYPH-001",
  assetKey: "wf-music-treble-clef",
  runtimePath: "src/assets/visuals/musical/wf-music-treble-clef.svg",
  sha256: "44a96b7cdcf968cf02c4f12673ed848fff387836f56e1fcb9a74070ae4c9064d",
} as const);

export const SCORE_PATH_ORIGIN_REVIEW_MODES = Object.freeze([
  "horizontal-enhanced",
  "vertical-wide",
  "vertical-compact",
] as const);
export type ScorePathOriginReviewMode =
  (typeof SCORE_PATH_ORIGIN_REVIEW_MODES)[number];

export const SCORE_PATH_ORIGIN_REVIEW_THEMES = Object.freeze([
  "light",
  "dark",
] as const);
export type ScorePathOriginReviewTheme =
  (typeof SCORE_PATH_ORIGIN_REVIEW_THEMES)[number];

export const SCORE_PATH_ORIGIN_REVIEW_BRANCHES = Object.freeze([
  "application",
  "professional",
] as const);
export type ScorePathOriginReviewBranch =
  (typeof SCORE_PATH_ORIGIN_REVIEW_BRANCHES)[number];

interface OriginGeometry {
  readonly amplitude: number;
  readonly height: number;
  readonly origin: Vec2;
  readonly pathWidth: number;
  readonly staffSpace: number;
  readonly viewBox: {
    readonly height: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
  };
}

interface CubicControls {
  readonly end: Vec2;
  readonly first: Vec2;
  readonly second: Vec2;
  readonly start: Vec2;
}

export interface ScorePathOriginReviewZone {
  readonly endT: number;
  readonly eventCount: 0;
  readonly kind: "connector" | "notation-safe";
  readonly maximumReadableTangentAngleDeg: number;
  readonly points: readonly Vec2[];
  readonly semanticSlotIds: readonly [];
  readonly startT: number;
}

export interface ScorePathOriginBranchReview {
  readonly branch: ScorePathOriginReviewBranch;
  readonly controls: CubicControls;
  readonly initialTangent: Vec2;
  readonly model: ScoreRenderModel;
  readonly path: ScorePath;
  readonly zones: readonly [
    ScorePathOriginReviewZone,
    ScorePathOriginReviewZone,
  ];
}

export interface ScorePathOriginReviewFixture {
  readonly branches: Readonly<
    Record<ScorePathOriginReviewBranch, ScorePathOriginBranchReview>
  >;
  readonly evidence: {
    readonly clef: {
      readonly anchorInGlyph: Vec2;
      readonly assetKey: "wf-music-treble-clef";
      readonly height: number;
      readonly mirrorX: false;
      readonly mirrorY: false;
      readonly rotationDegrees: 0;
      readonly width: number;
    };
    readonly commonOriginGap: number;
    readonly connectorEventCount: 0;
    readonly downstreamGrammar: "ORGANIC_FLOWING_ALTERNATING_S_APPROVED_UNCHANGED";
    readonly fiveLineContinuity: true;
    readonly maximumStaffSpaceDelta: number;
    readonly minimumFrameContentClearance: number;
  };
  readonly geometry: OriginGeometry;
  readonly mode: ScorePathOriginReviewMode;
  readonly status: typeof SCORE_PATH_ORIGIN_REVIEW_STATUS;
  readonly viewBox: string;
}

const EMPTY_MOTIFS = Object.freeze([]);
const EMPTY_SEMANTIC_SLOT_IDS = Object.freeze([]) as readonly [];
const FIRST_ZONE_MAX_ANGLE_DEG = 18;
const FIRST_CONNECTOR_TRANSITION_ANGLE_DEG =
  FIRST_ZONE_MAX_ANGLE_DEG / 2;

function scaledDesktopGeometry(staffSpace: number): OriginGeometry {
  const scale = staffSpace / 12;
  const pathWidth = 1440 * scale;
  const height = 280 * scale;
  const horizontalPadding = staffSpace * 3;

  return Object.freeze({
    amplitude: 108 * scale,
    height,
    origin: Object.freeze({ x: 720 * scale, y: 82 * scale }),
    pathWidth,
    staffSpace,
    viewBox: Object.freeze({
      height,
      width: pathWidth + horizontalPadding * 2,
      x: -horizontalPadding,
      y: 0,
    }),
  });
}

function scaledCompactGeometry(): OriginGeometry {
  const staffSpace = SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE["vertical-compact"];
  const scale = staffSpace / 8;
  const pathWidth = 390 * scale;
  const height = 144 * scale;
  const horizontalPadding = staffSpace * 3;

  return Object.freeze({
    amplitude: 42 * scale,
    height,
    origin: Object.freeze({ x: 195 * scale, y: 42 * scale }),
    pathWidth,
    staffSpace,
    viewBox: Object.freeze({
      height,
      width: pathWidth + horizontalPadding * 2,
      x: -horizontalPadding,
      y: 0,
    }),
  });
}

const ORIGIN_GEOMETRY_BY_MODE = Object.freeze({
  "horizontal-enhanced": scaledDesktopGeometry(12),
  "vertical-wide": scaledDesktopGeometry(
    SCORE_PATH_REVIEW_STAFF_SPACE_BY_MODE["vertical-wide"],
  ),
  "vertical-compact": scaledCompactGeometry(),
} as const satisfies Record<ScorePathOriginReviewMode, OriginGeometry>);

function buildControls(
  branch: ScorePathOriginReviewBranch,
  geometry: OriginGeometry,
): CubicControls {
  const direction = branch === "application" ? -1 : 1;
  const endX = branch === "application" ? 0 : geometry.pathWidth;
  const distance = Math.abs(endX - geometry.origin.x);

  return Object.freeze({
    start: geometry.origin,
    first: Object.freeze({
      x: geometry.origin.x + direction * distance * 0.28,
      y: geometry.origin.y,
    }),
    second: Object.freeze({
      x: geometry.origin.x + direction * distance * 0.64,
      y: geometry.origin.y + geometry.amplitude,
    }),
    end: Object.freeze({
      x: endX,
      y: geometry.origin.y + geometry.amplitude * 0.48,
    }),
  });
}

class OriginCubicScorePath implements ScorePath {
  constructor(
    private readonly branch: ScorePathOriginReviewBranch,
    private readonly controls: CubicControls,
  ) {}

  pointAt(t: number): Vec2 {
    requireNormalizedPosition(t);
    const inverse = 1 - t;
    const { start, first, second, end } = this.controls;

    return {
      x:
        inverse ** 3 * start.x +
        3 * inverse ** 2 * t * first.x +
        3 * inverse * t ** 2 * second.x +
        t ** 3 * end.x,
      y:
        inverse ** 3 * start.y +
        3 * inverse ** 2 * t * first.y +
        3 * inverse * t ** 2 * second.y +
        t ** 3 * end.y,
    };
  }

  tangentAt(t: number): Vec2 {
    requireNormalizedPosition(t);
    const inverse = 1 - t;
    const { start, first, second, end } = this.controls;

    return normalizeVector({
      x:
        3 * inverse ** 2 * (first.x - start.x) +
        6 * inverse * t * (second.x - first.x) +
        3 * t ** 2 * (end.x - second.x),
      y:
        3 * inverse ** 2 * (first.y - start.y) +
        6 * inverse * t * (second.y - first.y) +
        3 * t ** 2 * (end.y - second.y),
    });
  }

  normalAt(t: number): Vec2 {
    const tangent = this.tangentAt(t);

    return this.branch === "professional"
      ? { x: tangent.y, y: -tangent.x }
      : { x: -tangent.y, y: tangent.x };
  }
}

function readableTangentAngleDeg(path: ScorePath, t: number): number {
  const tangent = path.tangentAt(t);

  return Math.abs((Math.atan2(tangent.y, Math.abs(tangent.x)) * 180) / Math.PI);
}

function firstNotationSafeEnd(path: ScorePath): number {
  const sampleCount = 4096;
  let lower = 0;

  for (let index = 1; index <= sampleCount; index += 1) {
    const upper = index / sampleCount;

    if (
      readableTangentAngleDeg(path, upper) >
      FIRST_CONNECTOR_TRANSITION_ANGLE_DEG
    ) {
      let left = lower;
      let right = upper;

      for (let refinement = 0; refinement < 32; refinement += 1) {
        const middle = (left + right) / 2;

        if (
          readableTangentAngleDeg(path, middle) <=
          FIRST_CONNECTOR_TRANSITION_ANGLE_DEG
        ) {
          left = middle;
        } else {
          right = middle;
        }
      }

      return left;
    }

    lower = upper;
  }

  return 1;
}

function sampleZone(
  path: ScorePath,
  kind: ScorePathOriginReviewZone["kind"],
  startT: number,
  endT: number,
): ScorePathOriginReviewZone {
  const points = Object.freeze(
    Array.from({ length: 65 }, (_, index) =>
      Object.freeze(path.pointAt(startT + (endT - startT) * (index / 64))),
    ),
  );

  return Object.freeze({
    endT,
    eventCount: 0 as const,
    kind,
    maximumReadableTangentAngleDeg: Math.max(
      ...Array.from({ length: 257 }, (_, index) =>
        readableTangentAngleDeg(
          path,
          startT + (endT - startT) * (index / 256),
        ),
      ),
    ),
    points,
    semanticSlotIds: EMPTY_SEMANTIC_SLOT_IDS,
    startT,
  });
}

function buildBranchReview(
  branch: ScorePathOriginReviewBranch,
  geometry: OriginGeometry,
): ScorePathOriginBranchReview {
  const controls = buildControls(branch, geometry);
  const path = Object.freeze(new OriginCubicScorePath(branch, controls));
  const notationSafeEndT = firstNotationSafeEnd(path);
  const model = buildScoreModel({
    id: `phase-9-task-33:origin:${branch}`,
    path,
    staffSpace: geometry.staffSpace,
    staffSampleCount: 129,
    calibration: APPROVED_RENDERER_GLYPH_CALIBRATIONS,
    tokens: APPROVED_RENDERER_TOKENS,
    ...(branch === "professional" ? { clef: { t: 0 } } : {}),
    motifs: EMPTY_MOTIFS,
  });

  return Object.freeze({
    branch,
    controls,
    initialTangent: Object.freeze(path.tangentAt(0)),
    model,
    path,
    zones: Object.freeze([
      sampleZone(path, "notation-safe", 0, notationSafeEndT),
      sampleZone(path, "connector", notationSafeEndT, 1),
    ] as const),
  });
}

function maximumStaffSpaceDelta(
  branches: readonly ScorePathOriginBranchReview[],
  staffSpace: number,
): number {
  return Math.max(
    0,
    ...branches.flatMap(({ model }) =>
      model.staff.lines.slice(1).flatMap((line, lineIndex) =>
        line.points.map((point, pointIndex) =>
          Math.abs(
            distanceBetween(
              model.staff.lines[lineIndex]!.points[pointIndex]!,
              point,
            ) - staffSpace,
          ),
        ),
      ),
    ),
  );
}

function renderedPoints(
  branches: readonly ScorePathOriginBranchReview[],
): readonly Vec2[] {
  return branches.flatMap(({ model }) =>
    model.primitives.flatMap((primitive) => {
      if (primitive.kind === "polyline") return primitive.points;
      if (primitive.kind !== "glyph") return [];

      const x = primitive.anchorTarget.x - primitive.anchorInGlyph.x * primitive.width;
      const y = primitive.anchorTarget.y - primitive.anchorInGlyph.y * primitive.height;

      return [
        { x, y },
        { x: x + primitive.width, y },
        { x, y: y + primitive.height },
        { x: x + primitive.width, y: y + primitive.height },
      ];
    }),
  );
}

function buildEvidence(
  geometry: OriginGeometry,
  branches: Readonly<
    Record<ScorePathOriginReviewBranch, ScorePathOriginBranchReview>
  >,
): ScorePathOriginReviewFixture["evidence"] {
  const branchList = SCORE_PATH_ORIGIN_REVIEW_BRANCHES.map(
    (branch) => branches[branch],
  );
  const applicationLines = branches.application.model.staff.lines;
  const professionalLines = branches.professional.model.staff.lines;
  const commonOriginGap = Math.max(
    ...applicationLines.map((line, index) =>
      distanceBetween(line.points[0]!, professionalLines[index]!.points[0]!),
    ),
  );
  const clefs = branchList
    .flatMap(({ model }) => model.primitives)
    .filter(
      (primitive): primitive is GlyphRenderPrimitive =>
        primitive.kind === "glyph" && primitive.role === "clef",
    );
  const clef = clefs[0];

  if (
    clefs.length !== 1 ||
    !clef ||
    clef.assetKey !== SCORE_PATH_ORIGIN_REVIEW_ASSET.assetKey ||
    clef.mirrorX ||
    clef.mirrorY ||
    clef.rotationRadians !== 0
  ) {
    throw new RangeError("Origin review requires one upright approved treble clef");
  }

  const frameRight = geometry.viewBox.x + geometry.viewBox.width;
  const frameBottom = geometry.viewBox.y + geometry.viewBox.height;
  const minimumFrameContentClearance = Math.min(
    ...renderedPoints(branchList).flatMap((point) => [
      point.x - geometry.viewBox.x,
      frameRight - point.x,
      point.y - geometry.viewBox.y,
      frameBottom - point.y,
    ]),
  );

  if (minimumFrameContentClearance < -1e-7) {
    throw new RangeError("Origin review primitives must remain inside the review frame");
  }

  return Object.freeze({
    clef: Object.freeze({
      anchorInGlyph: Object.freeze({ ...clef.anchorInGlyph }),
      assetKey: clef.assetKey,
      height: clef.height,
      mirrorX: false as const,
      mirrorY: false as const,
      rotationDegrees: 0 as const,
      width: clef.width,
    }),
    commonOriginGap,
    connectorEventCount: 0 as const,
    downstreamGrammar:
      "ORGANIC_FLOWING_ALTERNATING_S_APPROVED_UNCHANGED" as const,
    fiveLineContinuity: true as const,
    maximumStaffSpaceDelta: maximumStaffSpaceDelta(
      branchList,
      geometry.staffSpace,
    ),
    minimumFrameContentClearance,
  });
}

const FIXTURE_CACHE = new Map<
  ScorePathOriginReviewMode,
  ScorePathOriginReviewFixture
>();

export function buildScorePathOriginReviewFixture(
  mode: ScorePathOriginReviewMode,
): ScorePathOriginReviewFixture {
  const cached = FIXTURE_CACHE.get(mode);

  if (cached) return cached;

  const geometry = ORIGIN_GEOMETRY_BY_MODE[mode];
  const branches = Object.freeze({
    application: buildBranchReview("application", geometry),
    professional: buildBranchReview("professional", geometry),
  });
  const fixture = Object.freeze({
    branches,
    evidence: buildEvidence(geometry, branches),
    geometry,
    mode,
    status: SCORE_PATH_ORIGIN_REVIEW_STATUS,
    viewBox: `${geometry.viewBox.x} ${geometry.viewBox.y} ${geometry.viewBox.width} ${geometry.viewBox.height}`,
  });

  FIXTURE_CACHE.set(mode, fixture);
  return fixture;
}

export function resolveScorePathOriginReviewSelection(
  input: Readonly<Record<string, string | string[] | undefined>>,
): {
  readonly mode: ScorePathOriginReviewMode;
  readonly theme: ScorePathOriginReviewTheme;
} {
  const first = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;
  const mode = first(input.mode);
  const theme = first(input.theme);

  return Object.freeze({
    mode: SCORE_PATH_ORIGIN_REVIEW_MODES.includes(
      mode as ScorePathOriginReviewMode,
    )
      ? (mode as ScorePathOriginReviewMode)
      : "horizontal-enhanced",
    theme: SCORE_PATH_ORIGIN_REVIEW_THEMES.includes(
      theme as ScorePathOriginReviewTheme,
    )
      ? (theme as ScorePathOriginReviewTheme)
      : "light",
  });
}

export function scorePathOriginReviewUrl(
  mode: ScorePathOriginReviewMode,
  theme: ScorePathOriginReviewTheme,
): string {
  const search = new URLSearchParams({ mode, theme });

  return `/__visual-lab/story/score-paths/origin?${search.toString()}`;
}
