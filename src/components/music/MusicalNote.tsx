import type { SVGProps } from "react";

import styles from "./music.module.css";

export interface MusicalNoteProps
  extends Omit<SVGProps<SVGGElement>, "children"> {
  readonly x?: number;
  readonly y?: number;
  readonly filled?: boolean;
  readonly stem?: "up" | "down";
  readonly scale?: number;
}

/**
 * Glifo original e silencioso para uso estritamente decorativo nas pautas.
 */
export function MusicalNote({
  className,
  filled = true,
  scale = 1,
  stem = "up",
  x = 0,
  y = 0,
  ...groupProps
}: MusicalNoteProps) {
  const stemDirection = stem === "up" ? -1 : 1;
  const stemX = stem === "up" ? 5.5 : -5.5;
  const combinedClassName = className
    ? `${styles.note} ${className}`
    : styles.note;

  return (
    <g
      {...groupProps}
      aria-hidden="true"
      className={combinedClassName}
      data-filled={filled ? "true" : "false"}
      data-musical-note=""
      focusable="false"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <ellipse
        className={styles.noteHead}
        cx="0"
        cy="0"
        fill={filled ? "currentColor" : "none"}
        rx="6.4"
        ry="4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        transform="rotate(-18)"
      />
      <path
        d={`M ${stemX} 0 V ${stemDirection * 24}`}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </g>
  );
}
