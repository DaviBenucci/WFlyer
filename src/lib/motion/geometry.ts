import type { ScoreEdge } from "@/config/chapters";

import type { ScoreTransition, TransitionMode } from "./topology";

export interface ViewportDimensions {
  readonly width: number;
  readonly height: number;
}

export interface ViewportPoint {
  readonly x: number;
  readonly y: number;
}

export type AnchorPoint = ViewportPoint;

export interface MeasuredTransitionAnchors {
  readonly source?: ViewportPoint | null;
  readonly destination?: ViewportPoint | null;
  readonly pivot?: ViewportPoint | null;
}

export interface ScoreTransitionGeometry {
  readonly height: number;
  readonly pivot: ViewportPoint;
  readonly source: ViewportPoint;
  readonly target: ViewportPoint;
  readonly width: number;
}

export interface ScoreTransitionSegment {
  readonly end: ViewportPoint;
  readonly id: "direct" | "from-home" | "to-home";
  readonly start: ViewportPoint;
}

export const DEFAULT_TRANSITION_VIEWPORT = {
  width: 1_280,
  height: 720,
} as const satisfies ViewportDimensions;

function isFinitePoint(
  point: ViewportPoint | null | undefined,
): point is ViewportPoint {
  return Boolean(
    point && Number.isFinite(point.x) && Number.isFinite(point.y),
  );
}

export function normalizeViewport(
  viewport: ViewportDimensions,
): ViewportDimensions {
  return {
    width:
      Number.isFinite(viewport.width) && viewport.width > 0
        ? viewport.width
        : DEFAULT_TRANSITION_VIEWPORT.width,
    height:
      Number.isFinite(viewport.height) && viewport.height > 0
        ? viewport.height
        : DEFAULT_TRANSITION_VIEWPORT.height,
  };
}

function edgeFallbackPoint(
  edge: ScoreEdge,
  anchorY: number,
  viewport: ViewportDimensions,
): ViewportPoint {
  return {
    x:
      edge === "left"
        ? 0
        : edge === "right"
          ? viewport.width
          : viewport.width / 2,
    y: viewport.height * Math.min(1, Math.max(0, anchorY)),
  };
}

function movesAwayFromHome(transition: ScoreTransition): boolean {
  const sourceCoordinate = transition.sourceChapter?.coordinate ?? 0;
  const destinationCoordinate =
    transition.destinationChapter?.coordinate ?? 0;

  return Math.abs(destinationCoordinate) > Math.abs(sourceCoordinate);
}

export function sourceAnchorKind(
  transition: ScoreTransition,
): "entry" | "exit" {
  if (transition.mode === "home-pivot") {
    return "entry";
  }

  return movesAwayFromHome(transition) ? "exit" : "entry";
}

export function destinationAnchorKind(
  transition: ScoreTransition,
): "entry" | "exit" {
  if (transition.mode === "home-pivot") {
    return "entry";
  }

  return movesAwayFromHome(transition) ? "entry" : "exit";
}

function fallbackChapterPoint(
  transition: ScoreTransition,
  endpoint: "destination" | "source",
  viewport: ViewportDimensions,
): ViewportPoint {
  const chapter =
    endpoint === "source"
      ? transition.sourceChapter
      : transition.destinationChapter;

  if (!chapter) {
    return { x: viewport.width / 2, y: viewport.height / 2 };
  }

  const kind =
    endpoint === "source"
      ? sourceAnchorKind(transition)
      : destinationAnchorKind(transition);

  return edgeFallbackPoint(
    kind === "entry" ? chapter.entry_edge : chapter.exit_edge,
    kind === "entry" ? chapter.entry_anchor_y : chapter.exit_anchor_y,
    viewport,
  );
}

export function resolveTransitionGeometry(
  transition: ScoreTransition,
  viewportValue: ViewportDimensions,
  measured: MeasuredTransitionAnchors = {},
): ScoreTransitionGeometry {
  const viewport = normalizeViewport(viewportValue);

  return {
    height: viewport.height,
    pivot: isFinitePoint(measured.pivot)
      ? measured.pivot
      : {
          x: viewport.width / 2,
          y: Math.min(120, viewport.height * 0.14),
        },
    source: isFinitePoint(measured.source)
      ? measured.source
      : fallbackChapterPoint(transition, "source", viewport),
    target: isFinitePoint(measured.destination)
      ? measured.destination
      : fallbackChapterPoint(transition, "destination", viewport),
    width: viewport.width,
  };
}

export function resolveTransitionSegments(
  geometry: ScoreTransitionGeometry,
  mode: TransitionMode,
): readonly ScoreTransitionSegment[] {
  if (mode === "neutral") {
    return [];
  }

  if (mode !== "home-pivot") {
    return [
      {
        end: geometry.target,
        id: "direct",
        start: geometry.source,
      },
    ];
  }

  return [
    { end: geometry.pivot, id: "to-home", start: geometry.source },
    { end: geometry.target, id: "from-home", start: geometry.pivot },
  ];
}

export function createScoreTransitionPath(
  start: ViewportPoint,
  end: ViewportPoint,
  offset: number,
  segmentIndex: number,
): string {
  const distance = Math.abs(end.x - start.x);
  const curve = Math.min(72, Math.max(24, distance * 0.09));
  const curveSign = segmentIndex % 2 === 0 ? 1 : -1;
  const startY = start.y + offset;
  const endY = end.y + offset;

  return [
    `M ${start.x} ${startY}`,
    `C ${start.x + (end.x - start.x) * 0.32} ${startY + curve * curveSign},`,
    `${start.x + (end.x - start.x) * 0.68} ${endY - curve * curveSign},`,
    `${end.x} ${endY}`,
  ].join(" ");
}

export function pointBetween(
  start: ViewportPoint,
  end: ViewportPoint,
  progress: number,
): ViewportPoint {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}
