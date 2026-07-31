import {
  auxiliaryRouteByPath,
  scoreChapterByPath,
  type AuxiliaryRoute,
  type ChapterBranch,
  type ChapterRoute,
  type ScoreChapter,
} from "@/config/chapters";

export type TransitionMode =
  | "adjacent-score"
  | "compressed-score-jump"
  | "home-pivot"
  | "neutral";

export type TransitionDirection = "left" | "right" | "none";
export type EffectiveScoreBranch = Exclude<ChapterBranch, "origin">;
export type RouteKind = "main-chapter" | "auxiliary" | "unknown";

export type NeutralTransitionReason =
  | "same-route"
  | "same-coordinate"
  | "source-auxiliary"
  | "destination-auxiliary"
  | "source-unknown"
  | "destination-unknown"
  | "both-not-main-chapters";

export interface ScoreTransition {
  readonly mode: TransitionMode;
  readonly direction: TransitionDirection;
  readonly coordinateDelta: number | null;
  readonly coordinateDistance: number | null;
  readonly sourcePathname: string;
  readonly destinationPathname: string;
  readonly sourceKind: RouteKind;
  readonly destinationKind: RouteKind;
  readonly sourceChapter: ScoreChapter | null;
  readonly destinationChapter: ScoreChapter | null;
  readonly effectiveBranch: EffectiveScoreBranch | null;
  readonly neutralReason: NeutralTransitionReason | null;
}

function isAbsoluteUrl(value: string): boolean {
  return /^[a-z][a-z\d+.-]*:\/\//iu.test(value) || value.startsWith("//");
}

/**
 * Normalizes a route-like value without decoding or rewriting meaningful path
 * segments. Invalid absolute URLs remain unknown paths instead of being mapped
 * to a chapter accidentally.
 */
export function normalizePathname(value: string | URL): string {
  let pathname: string;

  if (value instanceof URL) {
    pathname = value.pathname;
  } else {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return "/";
    }

    if (isAbsoluteUrl(trimmedValue)) {
      try {
        pathname = new URL(trimmedValue, "https://wflyer.invalid").pathname;
      } catch {
        pathname = trimmedValue;
      }
    } else {
      pathname = trimmedValue.split(/[?#]/u, 1)[0] ?? "/";
    }
  }

  const rootedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (rootedPathname === "/") {
    return rootedPathname;
  }

  const withoutTrailingSlash = rootedPathname.replace(/\/+$/u, "");
  return withoutTrailingSlash.length === 0 ? "/" : withoutTrailingSlash;
}

function getChapter(pathname: string): ScoreChapter | null {
  return (
    scoreChapterByPath[pathname as ChapterRoute] as ScoreChapter | undefined
  ) ?? null;
}

function getRouteKind(pathname: string): RouteKind {
  if (getChapter(pathname)) {
    return "main-chapter";
  }

  if (auxiliaryRouteByPath[pathname as AuxiliaryRoute]) {
    return "auxiliary";
  }

  return "unknown";
}

function getNeutralReason(
  sourceKind: RouteKind,
  destinationKind: RouteKind,
): NeutralTransitionReason {
  if (sourceKind !== "main-chapter" && destinationKind !== "main-chapter") {
    return "both-not-main-chapters";
  }

  if (sourceKind === "auxiliary") {
    return "source-auxiliary";
  }

  if (sourceKind === "unknown") {
    return "source-unknown";
  }

  if (destinationKind === "auxiliary") {
    return "destination-auxiliary";
  }

  return "destination-unknown";
}

function resolveEffectiveBranch(
  sourceChapter: ScoreChapter,
  destinationChapter: ScoreChapter,
): EffectiveScoreBranch | null {
  if (sourceChapter.branch === "origin") {
    return destinationChapter.branch === "origin"
      ? null
      : destinationChapter.branch;
  }

  if (destinationChapter.branch === "origin") {
    return sourceChapter.branch;
  }

  return sourceChapter.branch === destinationChapter.branch
    ? sourceChapter.branch
    : null;
}

function createNeutralTransition(
  sourcePathname: string,
  destinationPathname: string,
  sourceKind: RouteKind,
  destinationKind: RouteKind,
  sourceChapter: ScoreChapter | null,
  destinationChapter: ScoreChapter | null,
  neutralReason: NeutralTransitionReason,
): ScoreTransition {
  return {
    mode: "neutral",
    direction: "none",
    coordinateDelta: null,
    coordinateDistance: null,
    sourcePathname,
    destinationPathname,
    sourceKind,
    destinationKind,
    sourceChapter,
    destinationChapter,
    effectiveBranch: null,
    neutralReason,
  };
}

/** Resolves visual topology solely from the normative chapter manifest. */
export function classifyScoreTransition(
  source: string | URL,
  destination: string | URL,
): ScoreTransition {
  const sourcePathname = normalizePathname(source);
  const destinationPathname = normalizePathname(destination);
  const sourceKind = getRouteKind(sourcePathname);
  const destinationKind = getRouteKind(destinationPathname);
  const sourceChapter = getChapter(sourcePathname);
  const destinationChapter = getChapter(destinationPathname);

  if (sourcePathname === destinationPathname) {
    return createNeutralTransition(
      sourcePathname,
      destinationPathname,
      sourceKind,
      destinationKind,
      sourceChapter,
      destinationChapter,
      "same-route",
    );
  }

  if (!sourceChapter || !destinationChapter) {
    return createNeutralTransition(
      sourcePathname,
      destinationPathname,
      sourceKind,
      destinationKind,
      sourceChapter,
      destinationChapter,
      getNeutralReason(sourceKind, destinationKind),
    );
  }

  const coordinateDelta =
    destinationChapter.coordinate - sourceChapter.coordinate;

  if (coordinateDelta === 0) {
    return createNeutralTransition(
      sourcePathname,
      destinationPathname,
      sourceKind,
      destinationKind,
      sourceChapter,
      destinationChapter,
      "same-coordinate",
    );
  }

  const sourceIsMainBranch = sourceChapter.branch !== "origin";
  const destinationIsMainBranch = destinationChapter.branch !== "origin";
  const crossesMainBranches =
    sourceIsMainBranch &&
    destinationIsMainBranch &&
    sourceChapter.branch !== destinationChapter.branch;
  const coordinateDistance = Math.abs(coordinateDelta);

  return {
    mode: crossesMainBranches
      ? "home-pivot"
      : coordinateDistance === 1
        ? "adjacent-score"
        : "compressed-score-jump",
    direction: coordinateDelta < 0 ? "left" : "right",
    coordinateDelta,
    coordinateDistance,
    sourcePathname,
    destinationPathname,
    sourceKind,
    destinationKind,
    sourceChapter,
    destinationChapter,
    effectiveBranch: crossesMainBranches
      ? null
      : resolveEffectiveBranch(sourceChapter, destinationChapter),
    neutralReason: null,
  };
}
