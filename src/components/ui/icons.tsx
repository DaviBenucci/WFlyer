import type { ComponentPropsWithRef, ReactNode } from "react";

import { classNames } from "./class-names";
import styles from "./primitives.module.css";

export interface IconProps
  extends Omit<ComponentPropsWithRef<"svg">, "children"> {
  readonly size?: number | string;
  readonly title?: string;
}

interface IconFrameProps extends IconProps {
  readonly children: ReactNode;
}

function IconFrame({
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
  focusable = "false",
  role,
  size = 20,
  title,
  ...svgProps
}: IconFrameProps) {
  const hasAccessibleName = Boolean(title || ariaLabel || ariaLabelledBy);

  return (
    <svg
      {...svgProps}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={classNames(styles.icon, className)}
      fill="none"
      focusable={focusable}
      height={size}
      role={role ?? (hasAccessibleName ? "img" : undefined)}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export type ArrowDirection = "down" | "left" | "right" | "up";

const arrowTransforms: Record<ArrowDirection, string | undefined> = {
  down: "rotate(90 12 12)",
  left: "rotate(180 12 12)",
  right: undefined,
  up: "rotate(-90 12 12)",
};

export interface ArrowIconProps extends IconProps {
  readonly direction?: ArrowDirection;
}

export function ArrowIcon({
  direction = "right",
  ...iconProps
}: ArrowIconProps) {
  return (
    <IconFrame {...iconProps}>
      <g transform={arrowTransforms[direction]}>
        <path d="M5 12h14" vectorEffect="non-scaling-stroke" />
        <path d="m13 6 6 6-6 6" vectorEffect="non-scaling-stroke" />
      </g>
    </IconFrame>
  );
}

export function MenuIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="M4 7h16" vectorEffect="non-scaling-stroke" />
      <path d="M4 12h16" vectorEffect="non-scaling-stroke" />
      <path d="M4 17h16" vectorEffect="non-scaling-stroke" />
    </IconFrame>
  );
}

export function CloseIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="m6 6 12 12" vectorEffect="non-scaling-stroke" />
      <path d="M18 6 6 18" vectorEffect="non-scaling-stroke" />
    </IconFrame>
  );
}

export function SunIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <circle cx="12" cy="12" r="3.75" vectorEffect="non-scaling-stroke" />
      <path d="M12 2.75v2" vectorEffect="non-scaling-stroke" />
      <path d="M12 19.25v2" vectorEffect="non-scaling-stroke" />
      <path d="m5.46 5.46 1.42 1.42" vectorEffect="non-scaling-stroke" />
      <path d="m17.12 17.12 1.42 1.42" vectorEffect="non-scaling-stroke" />
      <path d="M2.75 12h2" vectorEffect="non-scaling-stroke" />
      <path d="M19.25 12h2" vectorEffect="non-scaling-stroke" />
      <path d="m5.46 18.54 1.42-1.42" vectorEffect="non-scaling-stroke" />
      <path d="m17.12 6.88 1.42-1.42" vectorEffect="non-scaling-stroke" />
    </IconFrame>
  );
}

export function MoonIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path
        d="M20.15 15.65A8.6 8.6 0 0 1 8.35 3.85a8.6 8.6 0 1 0 11.8 11.8Z"
        vectorEffect="non-scaling-stroke"
      />
    </IconFrame>
  );
}

export function ExternalIcon(iconProps: IconProps) {
  return (
    <IconFrame {...iconProps}>
      <path d="M14 5h5v5" vectorEffect="non-scaling-stroke" />
      <path d="m19 5-8 8" vectorEffect="non-scaling-stroke" />
      <path
        d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        vectorEffect="non-scaling-stroke"
      />
    </IconFrame>
  );
}
