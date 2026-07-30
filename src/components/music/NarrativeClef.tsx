import type { SVGProps } from "react";

import styles from "./music.module.css";

export type NarrativeClefProps = Omit<
  SVGProps<SVGSVGElement>,
  "children"
>;

const CLEF_PATH =
  "M 111 389 C 153 389 164 360 145 340 C 127 322 90 327 79 354 C 67 383 91 408 117 393 C 145 377 130 325 120 292 L 82 151 C 72 112 78 70 108 38 C 133 11 155 33 151 68 C 147 107 117 133 91 160 C 55 196 42 241 61 273 C 82 308 130 310 157 281 C 181 256 173 216 149 199 C 126 183 93 190 78 214 C 65 236 76 264 98 272 C 117 279 138 269 146 251";

/**
 * Clave narrativa original da Home. Ela é decorativa e não reutiliza a
 * geometria da marca oficial nem o asset de abertura.
 */
export function NarrativeClef({
  className,
  ...svgProps
}: NarrativeClefProps) {
  const combinedClassName = className
    ? `${styles.narrativeClef} ${className}`
    : styles.narrativeClef;

  return (
    <svg
      {...svgProps}
      aria-hidden="true"
      className={combinedClassName}
      data-narrative-clef=""
      focusable="false"
      viewBox="0 0 220 420"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={styles.clefOrbits}>
        <ellipse cx="110" cy="214" rx="94" ry="150" />
        <ellipse cx="110" cy="214" rx="73" ry="124" />
        <ellipse cx="110" cy="214" rx="52" ry="98" />
      </g>
      <ellipse
        className={styles.clefGroundShadow}
        cx="118"
        cy="402"
        rx="55"
        ry="10"
      />
      <path
        className={styles.clefDepth}
        d={CLEF_PATH}
        transform="translate(6 7)"
      />
      <path className={styles.clefBody} d={CLEF_PATH} />
      <path className={styles.clefHighlight} d={CLEF_PATH} />
    </svg>
  );
}
