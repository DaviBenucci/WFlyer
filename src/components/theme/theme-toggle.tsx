"use client";

import type { ComponentPropsWithoutRef } from "react";

import { useTheme } from "./theme-provider";
import styles from "./theme-toggle.module.css";

export interface ThemeToggleProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "aria-label" | "aria-pressed" | "children" | "onClick" | "type"
  > {
  showLabel?: boolean;
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M20.2 15.4A8.7 8.7 0 0 1 8.6 3.8a8.7 8.7 0 1 0 11.6 11.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ThemeToggle({
  className,
  showLabel = false,
  title,
  ...buttonProps
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleLabel = "Tema escuro";
  const actionLabel = isDark ? "Ativar tema claro" : "Ativar tema escuro";
  const classes = className ? `${styles.toggle} ${className}` : styles.toggle;

  return (
    <button
      {...buttonProps}
      aria-label={toggleLabel}
      aria-pressed={isDark}
      className={classes}
      data-with-label={showLabel ? "" : undefined}
      onClick={toggleTheme}
      title={title ?? actionLabel}
      type="button"
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      {showLabel ? <span className={styles.label}>{toggleLabel}</span> : null}
    </button>
  );
}
