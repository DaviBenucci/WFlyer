import type { SVGProps } from "react";

import styles from "./music.module.css";

export interface MeasureBarProps
  extends Omit<SVGProps<SVGLineElement>, "children"> {
  readonly x: number;
  readonly top?: number;
  readonly bottom?: number;
}

export function MeasureBar({
  className,
  x,
  top = 22,
  bottom = 86,
  ...lineProps
}: MeasureBarProps) {
  const combinedClassName = className
    ? `${styles.measureBar} ${className}`
    : styles.measureBar;

  return (
    <line
      {...lineProps}
      aria-hidden="true"
      className={combinedClassName}
      data-measure-bar=""
      focusable="false"
      x1={x}
      x2={x}
      y1={top}
      y2={bottom}
    />
  );
}
