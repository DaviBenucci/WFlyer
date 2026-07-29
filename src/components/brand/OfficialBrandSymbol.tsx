import { useId, type SVGProps } from "react";

import styles from "./official-brand-symbol.module.css";

export interface OfficialBrandSymbolProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  readonly decorative?: boolean;
  readonly title?: string;
}

/**
 * Símbolo vetorial oficial W_Flyer. Os três `d` são cópias imutáveis de
 * `svg/wflyer-header-symbol.svg`, conforme ADR-008.
 */
export function OfficialBrandSymbol({
  className,
  decorative = false,
  title = "W_Flyer",
  ...svgProps
}: OfficialBrandSymbolProps) {
  const generatedTitleId = useId();
  const titleId = `wf-brand-title-${generatedTitleId.replaceAll(":", "")}`;
  const combinedClassName = className
    ? `${styles.mark} ${className}`
    : styles.mark;

  return (
    <svg
      {...svgProps}
      aria-hidden={decorative ? "true" : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      className={combinedClassName}
      data-asset-name="wflyer-header-symbol"
      data-asset-version="1.0.0"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      role={decorative ? undefined : "img"}
      viewBox="-1 -2 282 165"
      xmlns="http://www.w3.org/2000/svg"
    >
      {decorative ? null : <title id={titleId}>{title}</title>}
      <g fill="currentColor" fillRule="evenodd">
        <path
          data-brand-path="anchor"
          d="M 3.00 2.00 L 43.00 158.00 L 70.00 158.00 L 101.00 117.00 L 106.00 112.00 L 119.00 112.00 L 120.00 113.00 L 86.00 158.00 L 145.00 158.00 L 182.00 105.00 L 87.00 105.00 L 85.00 101.00 L 85.00 97.00 L 79.00 76.00 L 78.00 68.00 L 76.00 64.00 L 76.00 60.00 L 65.00 19.00 L 62.00 3.00 L 61.00 2.00 Z"
        />
        <path
          data-brand-path="upper-wing"
          d="M 95.00 94.00 L 97.00 93.00 L 116.00 93.00 L 117.00 94.00 L 119.00 93.00 L 150.00 53.00 L 159.00 43.00 L 254.00 43.00 L 276.00 2.00 L 129.00 2.00 L 86.00 57.00 Z"
        />
        <path
          data-brand-path="lower-wing"
          d="M 134.00 93.00 L 226.00 93.00 L 248.00 55.00 L 164.00 55.00 Z"
        />
      </g>
    </svg>
  );
}
