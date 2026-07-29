import type { SVGProps } from "react";

import styles from "./music.module.css";

export interface FinalBarlineProps
  extends Omit<SVGProps<SVGGElement>, "children"> {
  readonly x: number;
  readonly top?: number;
  readonly bottom?: number;
  readonly side?: "start" | "end";
}

export function FinalBarline({
  className,
  x,
  top = 22,
  bottom = 86,
  side = "end",
  ...groupProps
}: FinalBarlineProps) {
  const combinedClassName = className
    ? `${styles.finalBarline} ${className}`
    : styles.finalBarline;
  const thinLineX = side === "start" ? x + 7 : x - 7;

  return (
    <g
      {...groupProps}
      aria-hidden="true"
      className={combinedClassName}
      data-final-barline=""
      data-side={side}
      focusable="false"
    >
      <line
        className={styles.finalBarlineThin}
        x1={thinLineX}
        x2={thinLineX}
        y1={top}
        y2={bottom}
      />
      <line
        className={styles.finalBarlineThick}
        x1={x}
        x2={x}
        y1={top}
        y2={bottom}
      />
    </g>
  );
}
