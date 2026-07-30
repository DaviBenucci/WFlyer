import type { HTMLAttributes } from "react";

import { MusicalNote } from "./MusicalNote";
import styles from "./music.module.css";

type OriginBranch = "application" | "institutional";
type OriginLayout = "compact" | "desktop";

interface Point {
  readonly x: number;
  readonly y: number;
}

interface OriginGeometry {
  readonly amplitude: number;
  readonly gap: number;
  readonly height: number;
  readonly originX: number;
  readonly originY: number;
  readonly width: number;
}

const STAFF_LINE_COUNT = 5;

const ORIGIN_GEOMETRIES = {
  desktop: {
    amplitude: 108,
    gap: 12,
    height: 280,
    originX: 720,
    originY: 58,
    width: 1440,
  },
  compact: {
    amplitude: 42,
    gap: 8,
    height: 144,
    originX: 195,
    originY: 26,
    width: 390,
  },
} as const satisfies Record<OriginLayout, OriginGeometry>;

const NOTE_BLUEPRINTS = {
  desktop: [
    { filled: true, line: 1, scale: 0.92, stem: "up", t: 0.2 },
    { filled: false, line: 3, scale: 0.84, stem: "down", t: 0.45 },
    { filled: true, line: 0, scale: 1.06, stem: "up", t: 0.7 },
    { filled: true, line: 4, scale: 0.9, stem: "down", t: 0.88 },
  ],
  compact: [
    { filled: true, line: 1, scale: 0.86, stem: "up", t: 0.34 },
    { filled: false, line: 3, scale: 0.78, stem: "down", t: 0.76 },
  ],
} as const;

function getOriginControlPoints(
  branch: OriginBranch,
  geometry: OriginGeometry,
  line: number,
): readonly [Point, Point, Point, Point] {
  const direction = branch === "application" ? -1 : 1;
  const lineOffset = line * geometry.gap;
  const start = {
    x: geometry.originX,
    y: geometry.originY + lineOffset,
  };
  const end = {
    x: branch === "application" ? 0 : geometry.width,
    y: geometry.originY + geometry.amplitude * 0.48 + lineOffset,
  };
  const distance = Math.abs(end.x - start.x);

  return [
    start,
    {
      x: start.x + direction * distance * 0.28,
      y: start.y + geometry.amplitude * 0.2,
    },
    {
      x: start.x + direction * distance * 0.64,
      y: start.y + geometry.amplitude,
    },
    end,
  ];
}

function cubicPoint(
  [start, firstControl, secondControl, end]: readonly [
    Point,
    Point,
    Point,
    Point,
  ],
  t: number,
): Point {
  const inverse = 1 - t;

  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * firstControl.x +
      3 * inverse * t ** 2 * secondControl.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * firstControl.y +
      3 * inverse * t ** 2 * secondControl.y +
      t ** 3 * end.y,
  };
}

function cubicAngle(
  points: readonly [Point, Point, Point, Point],
  t: number,
): number {
  const [start, firstControl, secondControl, end] = points;
  const inverse = 1 - t;
  const dx =
    3 * inverse ** 2 * (firstControl.x - start.x) +
    6 * inverse * t * (secondControl.x - firstControl.x) +
    3 * t ** 2 * (end.x - secondControl.x);
  const dy =
    3 * inverse ** 2 * (firstControl.y - start.y) +
    6 * inverse * t * (secondControl.y - firstControl.y) +
    3 * t ** 2 * (end.y - secondControl.y);

  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function getOriginStaffPath(
  branch: OriginBranch,
  layout: OriginLayout,
  line: number,
): string {
  const [start, firstControl, secondControl, end] = getOriginControlPoints(
    branch,
    ORIGIN_GEOMETRIES[layout],
    line,
  );

  return `M ${start.x} ${start.y} C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${end.x} ${end.y}`;
}

function OriginScoreGraphic({ layout }: { readonly layout: OriginLayout }) {
  const geometry = ORIGIN_GEOMETRIES[layout];

  return (
    <svg
      className={
        layout === "desktop"
          ? styles.originScoreDesktop
          : styles.originScoreCompact
      }
      data-origin-score-layout={layout}
      focusable="false"
      preserveAspectRatio="none"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {(["application", "institutional"] as const).map((branch) => (
        <g data-score-branch={branch} key={branch}>
          {Array.from({ length: STAFF_LINE_COUNT }, (_, line) => (
            <path
              className={styles.originStaffLine}
              d={getOriginStaffPath(branch, layout, line)}
              data-origin-staff-line={line + 1}
              fill="none"
              key={line}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {NOTE_BLUEPRINTS[layout].map((note, index) => {
            const points = getOriginControlPoints(
              branch,
              geometry,
              note.line,
            );
            const point = cubicPoint(points, note.t);
            const pathAngle = cubicAngle(points, note.t);
            const readableAngle =
              branch === "application" ? pathAngle - 180 : pathAngle;

            return (
              <MusicalNote
                data-origin-note={index + 1}
                filled={note.filled}
                key={`${branch}-${note.t}`}
                rotation={readableAngle}
                scale={note.scale}
                stem={note.stem}
                x={point.x}
                y={point.y}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export type OriginScoreProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

export function OriginScore({
  className,
  ...wrapperProps
}: OriginScoreProps) {
  const combinedClassName = className
    ? `${styles.originScore} ${className}`
    : styles.originScore;

  return (
    <div
      {...wrapperProps}
      aria-hidden="true"
      className={combinedClassName}
      data-origin-score=""
    >
      <OriginScoreGraphic layout="desktop" />
      <OriginScoreGraphic layout="compact" />
    </div>
  );
}
