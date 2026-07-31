import { scoreChapterById, type ScoreEdge } from "@/config/chapters";

import type { ScoreTransition, TransitionMode } from "./topology";

export interface ViewportDimensions {
  readonly width: number;
  readonly height: number;
}

export interface AnchorPoint {
  readonly x: number;
  readonly y: number;
}

export interface RectGeometry {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface MeasuredTransitionAnchors {
  readonly source?: AnchorPoint | null;
  readonly destination?: AnchorPoint | null;
}

export interface ResolvedAnchor extends AnchorPoint {
  readonly source: "measured" | "manifest";
}

export interface ResolvedTransitionGeometry {
  readonly viewport: ViewportDimensions;
  readonly source: ResolvedAnchor | null;
  readonly destination: ResolvedAnchor | null;
  readonly pivot: AnchorPoint;
  readonly travelDistance: number;
}

export interface TransitionSegment {
  readonly id: "primary" | "pivot-in" | "pivot-out";
  readonly path: string;
  readonly start: AnchorPoint;
  readonly end: AnchorPoint;
}

export const DEFAULT_TRANSITION_VIEWPORT = {
  width: 1_280,
  height: 720,
} as const satisfies ViewportDimensions;

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function normalizeViewport(
  viewport: ViewportDimensions,
): ViewportDimensions {
  return {
    width:
      isFiniteNumber(viewport.width) && viewport.width > 0
        ? viewport.width
        : DEFAULT_TRANSITION_VIEWPORT.width,
    height:
      isFiniteNumber(viewport.height) && viewport.height > 0
        ? viewport.height
        : DEFAULT_TRANSITION_VIEWPORT.height,
  };
}

export function anchorPointFromRect(
  rect: RectGeometry,
  edge: ScoreEdge,
  anchorY: number,
): AnchorPoint | null {
  if (
    !isFiniteNumber(rect.left) ||
    !isFiniteNumber(rect.top) ||
    !isFiniteNumber(rect.width) ||
    !isFiniteNumber(rect.height) ||
    rect.width < 0 ||
    rect.height < 0
  ) {
    return null;
  }

  const x =
    edge === "left"
      ? rect.left
      : edge === "right"
        ? rect.left + rect.width
        : rect.left + rect.width / 2;

  return {
    x,
    y: rect.top + rect.height * clamp(anchorY, 0, 1),
  };
}

function fallbackPoint(
  edge: ScoreEdge,
  anchorY: number,
  viewport: ViewportDimensions,
): AnchorPoint {
  return {
    x: edge === "left" ? 0 : edge === "right" ? viewport.width : viewport.width / 2,
    y: viewport.height * clamp(anchorY, 0, 1),
  };
}

function resolvePoint(
  measured: AnchorPoint | null | undefined,
  fallback: AnchorPoint | null,
  viewport: ViewportDimensions,
): ResolvedAnchor | null {
  if (
    measured &&
    isFiniteNumber(measured.x) &&
    isFiniteNumber(measured.y)
  ) {
    return {
      x: clamp(measured.x, 0, viewport.width),
      y: clamp(measured.y, 0, viewport.height),
      source: "measured",
    };
  }

  return fallback ? { ...fallback, source: "manifest" } : null;
}

export function getTransitionTravelDistance(
  mode: TransitionMode,
  viewportValue: ViewportDimensions,
): number {
  const viewport = normalizeViewport(viewportValue);
  const mobile = viewport.width < 768;
  const ratio =
    mode === "home-pivot"
      ? mobile
        ? 0.12
        : 0.18
      : mode === "compressed-score-jump"
        ? mobile
          ? 0.1
          : 0.14
        : mode === "adjacent-score"
          ? mobile
            ? 0.08
            : 0.1
          : 0;

  return viewport.width * ratio;
}

export function resolveTransitionGeometry(
  transition: ScoreTransition,
  viewportValue: ViewportDimensions,
  measured: MeasuredTransitionAnchors = {},
): ResolvedTransitionGeometry {
  const viewport = normalizeViewport(viewportValue);
  const sourceFallback = transition.sourceChapter
    ? fallbackPoint(
        transition.sourceChapter.exit_edge,
        transition.sourceChapter.exit_anchor_y,
        viewport,
      )
    : null;
  const destinationFallback = transition.destinationChapter
    ? fallbackPoint(
        transition.destinationChapter.entry_edge,
        transition.destinationChapter.entry_anchor_y,
        viewport,
      )
    : null;
  const home = scoreChapterById.home;

  return {
    viewport,
    source: resolvePoint(measured.source, sourceFallback, viewport),
    destination: resolvePoint(
      measured.destination,
      destinationFallback,
      viewport,
    ),
    pivot: fallbackPoint(
      home.entry_edge,
      home.entry_anchor_y,
      viewport,
    ),
    travelDistance: getTransitionTravelDistance(transition.mode, viewport),
  };
}

function formatCoordinate(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function createCubicPath(
  start: AnchorPoint,
  end: AnchorPoint,
  travelDistance: number,
): string {
  const horizontalDirection = end.x < start.x ? -1 : 1;
  const firstControlX = start.x + horizontalDirection * travelDistance;
  const secondControlX = end.x - horizontalDirection * travelDistance;

  return [
    `M ${formatCoordinate(start.x)} ${formatCoordinate(start.y)}`,
    `C ${formatCoordinate(firstControlX)} ${formatCoordinate(start.y)}`,
    `${formatCoordinate(secondControlX)} ${formatCoordinate(end.y)}`,
    `${formatCoordinate(end.x)} ${formatCoordinate(end.y)}`,
  ].join(" ");
}

export function createTransitionSegments(
  transition: ScoreTransition,
  geometry: ResolvedTransitionGeometry,
): readonly TransitionSegment[] {
  if (
    transition.mode === "neutral" ||
    !geometry.source ||
    !geometry.destination
  ) {
    return [];
  }

  if (transition.mode === "home-pivot") {
    return [
      {
        id: "pivot-in",
        path: createCubicPath(
          geometry.source,
          geometry.pivot,
          geometry.travelDistance / 2,
        ),
        start: geometry.source,
        end: geometry.pivot,
      },
      {
        id: "pivot-out",
        path: createCubicPath(
          geometry.pivot,
          geometry.destination,
          geometry.travelDistance / 2,
        ),
        start: geometry.pivot,
        end: geometry.destination,
      },
    ];
  }

  return [
    {
      id: "primary",
      path: createCubicPath(
        geometry.source,
        geometry.destination,
        geometry.travelDistance,
      ),
      start: geometry.source,
      end: geometry.destination,
    },
  ];
}
