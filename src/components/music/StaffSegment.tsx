import type { SVGProps } from "react";

import styles from "./music.module.css";

const STAFF_LINE_COUNT = 5;

export type StaffDirection = "left" | "right";

export interface StaffSegmentProps
  extends Omit<SVGProps<SVGGElement>, "children"> {
  readonly startX?: number;
  readonly endX?: number;
  readonly baseY?: number;
  readonly lineGap?: number;
  readonly amplitude?: number;
  readonly direction?: StaffDirection;
}

export function getStaffPath({
  amplitude,
  direction,
  endX,
  startX,
  y,
}: {
  readonly amplitude: number;
  readonly direction: StaffDirection;
  readonly endX: number;
  readonly startX: number;
  readonly y: number;
}) {
  const length = endX - startX;
  const directionSign = direction === "right" ? 1 : -1;
  const firstControlX = startX + length * 0.32;
  const secondControlX = startX + length * 0.68;
  const firstControlY = y - amplitude * directionSign;
  const secondControlY = y + amplitude * directionSign;

  return `M ${startX} ${y} C ${firstControlX} ${firstControlY}, ${secondControlX} ${secondControlY}, ${endX} ${y}`;
}

export function StaffSegment({
  amplitude = 14,
  baseY = 30,
  className,
  direction = "right",
  endX = 640,
  lineGap = 12,
  startX = 0,
  ...groupProps
}: StaffSegmentProps) {
  const combinedClassName = className
    ? `${styles.staffSegment} ${className}`
    : styles.staffSegment;

  return (
    <g
      {...groupProps}
      aria-hidden="true"
      className={combinedClassName}
      data-direction={direction}
      data-staff-segment=""
      focusable="false"
    >
      {Array.from({ length: STAFF_LINE_COUNT }, (_, index) => {
        const y = baseY + lineGap * index;

        return (
          <path
            className={styles.staffLine}
            d={getStaffPath({
              amplitude,
              direction,
              endX,
              startX,
              y,
            })}
            data-staff-line={index + 1}
            fill="none"
            key={y}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </g>
  );
}
