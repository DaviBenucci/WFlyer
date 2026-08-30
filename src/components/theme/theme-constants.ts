export const THEME_STORAGE_KEY = "wf-theme";
export const THEME_CHANGE_EVENT = "wf:theme-change";
export const THEME_REVIEW_ROUTE_PREFIX = "/__visual-lab/story/score-paths";

export const THEME_BROWSER_COLORS = Object.freeze({
  light: "#f7f1e8",
  dark: "#12100f",
} as const);

export const themes = ["light", "dark"] as const;

export type ThemeName = (typeof themes)[number];

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && themes.includes(value as ThemeName);
}

export function resolveReviewRouteTheme(
  pathname: string,
  search: string,
): ThemeName | null {
  const isReviewRoute =
    pathname === THEME_REVIEW_ROUTE_PREFIX ||
    pathname.startsWith(`${THEME_REVIEW_ROUTE_PREFIX}/`);

  if (!isReviewRoute) return null;

  const queryTheme = new URLSearchParams(search).get("theme");

  return isThemeName(queryTheme) ? queryTheme : null;
}
