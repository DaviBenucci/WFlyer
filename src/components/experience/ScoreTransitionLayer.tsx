"use client";

import type {
  TransitionDirection,
  TransitionMode,
} from "@/lib/motion";

import styles from "./experience.module.css";

export interface ViewportPoint {
  readonly x: number;
  readonly y: number;
}

export interface ScoreTransitionGeometry {
  readonly height: number;
  readonly pivot?: ViewportPoint;
  readonly source: ViewportPoint;
  readonly target: ViewportPoint;
  readonly width: number;
}

export interface ScoreTransitionLayerProps {
  readonly active: boolean;
  readonly checkpoint: "completion" | "midpoint" | "start" | null;
  readonly direction: TransitionDirection;
  readonly geometry: ScoreTransitionGeometry | null;
  readonly mode: TransitionMode;
  readonly reducedMotion: boolean;
}

interface SegmentGeometry {
  readonly end: ViewportPoint;
  readonly id: string;
  readonly start: ViewportPoint;
}

const STAFF_LINE_OFFSETS = [-12, -6, 0, 6, 12] as const;
const NOTE_POSITIONS = [0.28, 0.58, 0.82] as const;

function resolveSegments(
  geometry: ScoreTransitionGeometry,
  mode: TransitionMode,
): readonly SegmentGeometry[] {
  if (mode !== "home-pivot") {
    return [
      {
        end: geometry.target,
        id: "direct",
        start: geometry.source,
      },
    ];
  }

  const pivot = geometry.pivot ?? {
    x: geometry.width / 2,
    y: Math.min(geometry.height * 0.18, 120),
  };

  return [
    { end: pivot, id: "to-home", start: geometry.source },
    { end: geometry.target, id: "from-home", start: pivot },
  ];
}

function createPath(
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

function pointBetween(
  start: ViewportPoint,
  end: ViewportPoint,
  progress: number,
): ViewportPoint {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}

function TransitionNote({
  point,
  segment,
}: {
  readonly point: ViewportPoint;
  readonly segment: number;
}) {
  return (
    <g
      className={styles.transitionNote}
      data-transition-note=""
      transform={`translate(${point.x} ${point.y})`}
    >
      <ellipse cx="0" cy="0" rx="6" ry="4.25" />
      <path d={segment % 2 === 0 ? "M5 0V-21" : "M-5 0V21"} />
    </g>
  );
}

export function ScoreTransitionLayer({
  active,
  checkpoint,
  direction,
  geometry,
  mode,
  reducedMotion,
}: ScoreTransitionLayerProps) {
  const segments =
    active && geometry && !reducedMotion && mode !== "neutral"
      ? resolveSegments(geometry, mode)
      : [];

  return (
    <div
      aria-hidden="true"
      className={styles.transitionLayer}
      data-active={active ? "true" : "false"}
      data-checkpoint={checkpoint ?? "none"}
      data-direction={direction}
      data-score-transition-layer=""
      data-transition-mode={mode}
      inert
    >
      {geometry ? (
        <svg
          focusable="false"
          preserveAspectRatio="none"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        >
          {segments.map((segment, segmentIndex) => (
            <g
              data-segment-id={segment.id}
              data-transition-segment=""
              key={segment.id}
            >
              {STAFF_LINE_OFFSETS.map((offset) => (
                <path
                  className={styles.transitionStaffLine}
                  d={createPath(
                    segment.start,
                    segment.end,
                    offset,
                    segmentIndex,
                  )}
                  data-transition-staff-line=""
                  fill="none"
                  key={offset}
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {NOTE_POSITIONS.map((position) => (
                <TransitionNote
                  key={position}
                  point={pointBetween(segment.start, segment.end, position)}
                  segment={segmentIndex}
                />
              ))}
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}
