"use client";

import type {
  ScoreTransitionGeometry,
  TransitionDirection,
  TransitionMode,
  ViewportPoint,
} from "@/lib/motion";
import {
  createScoreTransitionPath,
  pointBetween,
  resolveTransitionSegments,
} from "@/lib/motion";

import styles from "./experience.module.css";

export type { ScoreTransitionGeometry, ViewportPoint } from "@/lib/motion";

export interface ScoreTransitionLayerProps {
  readonly active: boolean;
  readonly checkpoint: "completion" | "midpoint" | "start" | null;
  readonly direction: TransitionDirection;
  readonly geometry: ScoreTransitionGeometry | null;
  readonly mode: TransitionMode;
  readonly reducedMotion: boolean;
}

const STAFF_LINE_OFFSETS = [-12, -6, 0, 6, 12] as const;
const NOTE_POSITIONS = [0.28, 0.58, 0.82] as const;

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
      ? resolveTransitionSegments(geometry, mode)
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
                  d={createScoreTransitionPath(
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
