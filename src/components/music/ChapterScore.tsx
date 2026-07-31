import type { SVGProps } from "react";

import type { ChapterBranch, ScoreEdge } from "@/config/chapters";

import { FinalBarline } from "./FinalBarline";
import { MusicalNote } from "./MusicalNote";
import styles from "./music.module.css";

type ScoreBranch = Exclude<ChapterBranch, "origin">;

interface Point {
  readonly x: number;
  readonly y: number;
}

const SCORE_WIDTH = 1000;
const SCORE_HEIGHT = 240;
const STAFF_GAP = 12;
const STAFF_LINE_COUNT = 5;
const CURVE_AMPLITUDE = 30;

const NOTES = [
  { filled: true, line: 1, scale: 0.94, stem: "up", t: 0.18 },
  { filled: false, line: 4, scale: 0.82, stem: "down", t: 0.48 },
  { filled: true, line: 2, scale: 1.02, stem: "up", t: 0.8 },
] as const;

function anchorToY(anchor: number): number {
  return 48 + (anchor - 0.5) * 160;
}

function edgeToX(edge: ScoreEdge): number {
  if (edge === "left") {
    return 0;
  }

  if (edge === "right") {
    return SCORE_WIDTH;
  }

  return SCORE_WIDTH / 2;
}

function getControlPoints({
  branch,
  entryAnchorY,
  entryEdge,
  exitAnchorY,
  exitEdge,
  line,
}: {
  readonly branch: ScoreBranch;
  readonly entryAnchorY: number;
  readonly entryEdge: ScoreEdge;
  readonly exitAnchorY: number;
  readonly exitEdge: ScoreEdge;
  readonly line: number;
}): readonly [Point, Point, Point, Point] {
  const lineOffset = line * STAFF_GAP;
  const start = {
    x: edgeToX(entryEdge),
    y: anchorToY(entryAnchorY) + lineOffset,
  };
  const end = {
    x: edgeToX(exitEdge),
    y: anchorToY(exitAnchorY) + lineOffset,
  };
  const horizontalDistance = end.x - start.x;
  const waveSign = branch === "institutional" ? 1 : -1;

  return [
    start,
    {
      x: start.x + horizontalDistance * 0.32,
      y: start.y + CURVE_AMPLITUDE * waveSign,
    },
    {
      x: start.x + horizontalDistance * 0.68,
      y: end.y - CURVE_AMPLITUDE * waveSign,
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

export function getChapterScorePath({
  branch,
  entryAnchorY,
  entryEdge,
  exitAnchorY,
  exitEdge,
  line = 0,
}: Pick<
  ChapterScoreProps,
  "branch" | "entryAnchorY" | "entryEdge" | "exitAnchorY" | "exitEdge"
> & {
  readonly line?: number;
}): string {
  const [start, firstControl, secondControl, end] = getControlPoints({
    branch,
    entryAnchorY,
    entryEdge,
    exitAnchorY,
    exitEdge,
    line,
  });

  return `M ${start.x} ${start.y} C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${end.x} ${end.y}`;
}

export interface ChapterScoreProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  readonly branch: ScoreBranch;
  readonly entryAnchorY: number;
  readonly entryEdge: ScoreEdge;
  readonly exitAnchorY: number;
  readonly exitEdge: ScoreEdge;
  readonly terminal?: boolean;
}

export function ChapterScore({
  branch,
  className,
  entryAnchorY,
  entryEdge,
  exitAnchorY,
  exitEdge,
  terminal = false,
  ...svgProps
}: ChapterScoreProps) {
  const combinedClassName = className
    ? `${styles.chapterScore} ${className}`
    : styles.chapterScore;
  const finalX = exitEdge === "left" ? 14 : SCORE_WIDTH - 14;
  const finalY = anchorToY(exitAnchorY);

  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      className={combinedClassName}
      data-branch={branch}
      data-entry-anchor-y={entryAnchorY}
      data-entry-edge={entryEdge}
      data-exit-anchor-y={exitAnchorY}
      data-exit-edge={exitEdge}
      data-score-segment=""
      data-terminal={terminal ? "true" : "false"}
      focusable="false"
      preserveAspectRatio="none"
      viewBox={`0 0 ${SCORE_WIDTH} ${SCORE_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={edgeToX(entryEdge)}
        cy={anchorToY(entryAnchorY)}
        data-score-anchor="entry"
        r="0"
      />
      <circle
        cx={edgeToX(exitEdge)}
        cy={anchorToY(exitAnchorY)}
        data-score-anchor="exit"
        r="0"
      />
      {Array.from({ length: STAFF_LINE_COUNT }, (_, line) => (
        <path
          className={styles.chapterStaffLine}
          d={getChapterScorePath({
            branch,
            entryAnchorY,
            entryEdge,
            exitAnchorY,
            exitEdge,
            line,
          })}
          data-chapter-staff-line={line + 1}
          fill="none"
          key={line}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {NOTES.map((note, index) => {
        const points = getControlPoints({
          branch,
          entryAnchorY,
          entryEdge,
          exitAnchorY,
          exitEdge,
          line: note.line,
        });
        const point = cubicPoint(points, note.t);
        const pathAngle = cubicAngle(points, note.t);
        const readableAngle =
          branch === "application" ? pathAngle - 180 : pathAngle;

        return (
          <MusicalNote
            data-chapter-note={index + 1}
            filled={note.filled}
            key={note.t}
            rotation={readableAngle}
            scale={note.scale}
            stem={note.stem}
            x={point.x}
            y={point.y}
          />
        );
      })}
      {terminal ? (
        <FinalBarline
          bottom={finalY + STAFF_GAP * 4 + 9}
          side={exitEdge === "left" ? "start" : "end"}
          top={finalY - 9}
          x={finalX}
        />
      ) : null}
    </svg>
  );
}
