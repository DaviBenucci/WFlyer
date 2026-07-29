import type { SVGProps } from "react";

import { FinalBarline } from "./FinalBarline";
import { MeasureBar } from "./MeasureBar";
import { MusicalNote } from "./MusicalNote";
import { StaffSegment, type StaffDirection } from "./StaffSegment";
import styles from "./music.module.css";

export interface StaffProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  readonly direction?: StaffDirection;
  readonly terminal?: boolean;
  readonly density?: "quiet" | "regular";
}

const NOTE_POSITIONS = {
  left: [
    { x: 492, y: 42, stem: "down" },
    { x: 326, y: 67, stem: "up" },
    { x: 142, y: 51, stem: "up" },
  ],
  right: [
    { x: 148, y: 42, stem: "up" },
    { x: 314, y: 67, stem: "down" },
    { x: 498, y: 51, stem: "down" },
  ],
} as const;

export function Staff({
  className,
  density = "regular",
  direction = "right",
  terminal = false,
  ...svgProps
}: StaffProps) {
  const combinedClassName = className
    ? `${styles.staff} ${className}`
    : styles.staff;
  const notes =
    density === "quiet"
      ? NOTE_POSITIONS[direction].slice(1, 2)
      : NOTE_POSITIONS[direction];

  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      className={combinedClassName}
      data-direction={direction}
      data-staff=""
      data-terminal={terminal ? "true" : "false"}
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 640 112"
      xmlns="http://www.w3.org/2000/svg"
    >
      <StaffSegment direction={direction} />
      {terminal && direction === "left" ? (
        <FinalBarline side="start" x={12} />
      ) : (
        <MeasureBar x={4} />
      )}
      {notes.map((note, index) => (
        <MusicalNote
          filled={index !== 1}
          key={`${note.x}-${note.y}`}
          scale={index === 1 ? 0.9 : 1}
          stem={note.stem}
          x={note.x}
          y={note.y}
        />
      ))}
      {terminal && direction === "right" ? (
        <FinalBarline x={628} />
      ) : (
        <MeasureBar x={636} />
      )}
    </svg>
  );
}

export const MusicalStaff = Staff;
