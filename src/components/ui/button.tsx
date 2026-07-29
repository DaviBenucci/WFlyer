import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

import { classNames } from "./class-names";
import { ExternalIcon } from "./icons";
import styles from "./primitives.module.css";

export type ControlSize = "compact" | "default" | "spacious";
export type ControlVariant = "ghost" | "primary" | "secondary";

interface ControlVisualProps {
  readonly fullWidth?: boolean;
  readonly iconOnly?: boolean;
  readonly leadingIcon?: ReactNode;
  readonly size?: ControlSize;
  readonly trailingIcon?: ReactNode;
  readonly variant?: ControlVariant;
}

export interface ButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "children">,
    ControlVisualProps {
  readonly children: ReactNode;
}

const sizeClasses: Record<ControlSize, string> = {
  compact: styles.compact!,
  default: styles.defaultSize!,
  spacious: styles.spacious!,
};

const variantClasses: Record<ControlVariant, string> = {
  ghost: styles.ghost!,
  primary: styles.primary!,
  secondary: styles.secondary!,
};

function controlClassName({
  className,
  fullWidth,
  iconOnly,
  size,
  variant,
}: {
  readonly className: string | undefined;
  readonly fullWidth: boolean;
  readonly iconOnly: boolean;
  readonly size: ControlSize;
  readonly variant: ControlVariant;
}): string {
  return classNames(
    styles.control,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    className,
  );
}

export function Button({
  "aria-disabled": ariaDisabled,
  children,
  className,
  fullWidth = false,
  iconOnly = false,
  leadingIcon,
  size = "default",
  trailingIcon,
  type = "button",
  variant = "primary",
  onClick,
  ...buttonProps
}: ButtonProps) {
  const semanticallyDisabled =
    ariaDisabled === true || ariaDisabled === "true";

  return (
    <button
      {...buttonProps}
      aria-disabled={ariaDisabled}
      className={classNames(
        styles.button,
        controlClassName({
          className,
          fullWidth,
          iconOnly,
          size,
          variant,
        }),
      )}
      onClick={(event) => {
        if (semanticallyDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        onClick?.(event);
      }}
      type={type}
    >
      {leadingIcon ? (
        <span aria-hidden="true" className={styles.iconSlot}>
          {leadingIcon}
        </span>
      ) : null}
      {children}
      {trailingIcon ? (
        <span aria-hidden="true" className={styles.iconSlot}>
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
}

export interface LinkButtonProps
  extends Omit<ComponentPropsWithRef<"a">, "children" | "href">,
    ControlVisualProps {
  readonly children: ReactNode;
  readonly external?: boolean;
  readonly href: string;
}

function secureBlankTargetRel(
  rel: string | undefined,
  target: string | undefined,
): string | undefined {
  if (target !== "_blank") {
    return rel;
  }

  return Array.from(
    new Set([...(rel?.split(/\s+/u).filter(Boolean) ?? []), "noopener", "noreferrer"]),
  ).join(" ");
}

export function LinkButton({
  children,
  className,
  external = false,
  fullWidth = false,
  href,
  iconOnly = false,
  leadingIcon,
  rel,
  size = "default",
  target,
  trailingIcon,
  variant = "primary",
  ...anchorProps
}: LinkButtonProps) {
  const descriptionId = `wf-new-tab-${useId().replaceAll(":", "")}`;
  const resolvedTrailingIcon =
    trailingIcon ?? (external ? <ExternalIcon size={18} /> : null);
  const describedBy =
    target === "_blank"
      ? [anchorProps["aria-describedby"], descriptionId]
          .filter(Boolean)
          .join(" ")
      : anchorProps["aria-describedby"];

  return (
    <>
      <a
        {...anchorProps}
        aria-describedby={describedBy}
        className={classNames(
          styles.linkButton,
          controlClassName({
            className,
            fullWidth,
            iconOnly,
            size,
            variant,
          }),
        )}
        data-external={external ? "true" : undefined}
        href={href}
        rel={secureBlankTargetRel(rel, target)}
        target={target}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className={styles.iconSlot}>
            {leadingIcon}
          </span>
        ) : null}
        {children}
        {resolvedTrailingIcon ? (
          <span aria-hidden="true" className={styles.iconSlot}>
            {resolvedTrailingIcon}
          </span>
        ) : null}
      </a>
      {target === "_blank" ? (
        <span className="wf-sr-only" id={descriptionId}>
          Abre em nova aba
        </span>
      ) : null}
    </>
  );
}
