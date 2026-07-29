export const THEME_STORAGE_KEY = "wf-theme";
export const THEME_CHANGE_EVENT = "wf:theme-change";

export const themes = ["light", "dark"] as const;

export type ThemeName = (typeof themes)[number];

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && themes.includes(value as ThemeName);
}
