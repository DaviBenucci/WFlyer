import type { ComponentPropsWithRef } from "react";

import { classNames } from "./class-names";
import styles from "./primitives.module.css";

export type TextTone = "accent" | "default" | "muted";

const toneClasses: Record<TextTone, string> = {
  accent: styles.toneAccent!,
  default: styles.toneDefault!,
  muted: styles.toneMuted!,
};

export interface EyebrowProps
  extends Omit<ComponentPropsWithRef<"p">, "color"> {
  readonly tone?: TextTone;
}

export function Eyebrow({
  className,
  tone = "accent",
  ...eyebrowProps
}: EyebrowProps) {
  return (
    <p
      {...eyebrowProps}
      className={classNames(styles.eyebrow, toneClasses[tone], className)}
    />
  );
}

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "display" | "lg" | "md" | "sm" | "xl";

export interface HeadingProps
  extends Omit<ComponentPropsWithRef<"h2">, "color"> {
  readonly as?: HeadingLevel;
  readonly size?: HeadingSize;
  readonly tone?: TextTone;
}

const headingSizeClasses: Record<HeadingSize, string> = {
  display: styles.headingDisplay!,
  lg: styles.headingLarge!,
  md: styles.headingMedium!,
  sm: styles.headingSmall!,
  xl: styles.headingExtraLarge!,
};

export function Heading({
  as: Component = "h2",
  className,
  size = "xl",
  tone = "default",
  ...headingProps
}: HeadingProps) {
  return (
    <Component
      {...headingProps}
      className={classNames(
        styles.heading,
        headingSizeClasses[size],
        toneClasses[tone],
        className,
      )}
    />
  );
}

export type TextSize = "body" | "lead" | "small";

export interface TextProps extends Omit<ComponentPropsWithRef<"p">, "color"> {
  readonly size?: TextSize;
  readonly tone?: TextTone;
}

const textSizeClasses: Record<TextSize, string> = {
  body: styles.textBody!,
  lead: styles.textLead!,
  small: styles.textSmall!,
};

export function Text({
  className,
  size = "body",
  tone = "default",
  ...textProps
}: TextProps) {
  return (
    <p
      {...textProps}
      className={classNames(
        styles.text,
        textSizeClasses[size],
        toneClasses[tone],
        className,
      )}
    />
  );
}
