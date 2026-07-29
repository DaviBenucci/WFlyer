import type { ComponentPropsWithRef } from "react";

import { classNames } from "./class-names";
import styles from "./primitives.module.css";

export type SurfacePadding = "large" | "medium" | "none" | "small";
export type SurfaceTone = "default" | "elevated" | "muted";

interface SurfaceVisualProps {
  readonly bordered?: boolean;
  readonly elevation?: "flat" | "raised";
  readonly padding?: SurfacePadding;
  readonly tone?: SurfaceTone;
}

const paddingClasses: Record<SurfacePadding, string> = {
  large: styles.paddingLarge!,
  medium: styles.paddingMedium!,
  none: styles.paddingNone!,
  small: styles.paddingSmall!,
};

const toneClasses: Record<SurfaceTone, string> = {
  default: styles.surfaceDefault!,
  elevated: styles.surfaceElevated!,
  muted: styles.surfaceMuted!,
};

export interface SurfaceProps
  extends Omit<ComponentPropsWithRef<"div">, "color">,
    SurfaceVisualProps {}

export function Surface({
  bordered = true,
  className,
  elevation = "flat",
  padding = "medium",
  tone = "default",
  ...surfaceProps
}: SurfaceProps) {
  return (
    <div
      {...surfaceProps}
      className={classNames(
        styles.surface,
        toneClasses[tone],
        paddingClasses[padding],
        bordered && styles.bordered,
        elevation === "raised" && styles.raised,
        className,
      )}
    />
  );
}

export interface CardProps
  extends Omit<ComponentPropsWithRef<"article">, "color"> {
  readonly interactive?: boolean;
  readonly padding?: SurfacePadding;
}

export function Card({
  className,
  interactive = false,
  padding = "medium",
  ...cardProps
}: CardProps) {
  return (
    <article
      {...cardProps}
      className={classNames(
        styles.card,
        styles.bordered,
        paddingClasses[padding],
        className,
      )}
      data-interactive={interactive ? "true" : undefined}
    />
  );
}

export type ContainerSize = "content" | "full" | "wide";

export interface ContainerProps
  extends Omit<ComponentPropsWithRef<"div">, "color"> {
  readonly size?: ContainerSize;
}

const containerSizeClasses: Record<ContainerSize, string> = {
  content: styles.containerContent!,
  full: styles.containerFull!,
  wide: styles.containerWide!,
};

export function Container({
  className,
  size = "wide",
  ...containerProps
}: ContainerProps) {
  return (
    <div
      {...containerProps}
      className={classNames(
        styles.container,
        containerSizeClasses[size],
        className,
      )}
    />
  );
}
