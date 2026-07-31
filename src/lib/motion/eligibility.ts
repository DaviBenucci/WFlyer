import { classifyScoreTransition, normalizePathname } from "./topology";

export interface LinkActivation {
  readonly button: number;
  readonly defaultPrevented: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
}

export interface LinkCandidate {
  readonly href: string | null | undefined;
  readonly target?: string | null;
  readonly download?: boolean;
}

export type LinkIneligibilityReason =
  | "default-prevented"
  | "non-primary-button"
  | "modified-activation"
  | "missing-href"
  | "download"
  | "new-context"
  | "invalid-current-url"
  | "invalid-destination-url"
  | "unsupported-protocol"
  | "external-origin"
  | "hash-destination"
  | "same-pathname"
  | "source-not-main-chapter"
  | "destination-not-main-chapter";

export interface EligibleNavigationLink {
  readonly eligible: true;
  readonly sourcePathname: string;
  readonly destinationPathname: string;
  readonly destinationHref: string;
  readonly transition: ReturnType<typeof classifyScoreTransition>;
}

export interface IneligibleNavigationLink {
  readonly eligible: false;
  readonly reason: LinkIneligibilityReason;
}

export type LinkEligibility =
  | EligibleNavigationLink
  | IneligibleNavigationLink;

function ineligible(reason: LinkIneligibilityReason): IneligibleNavigationLink {
  return { eligible: false, reason };
}

function parseUrl(value: string | URL, base?: URL): URL | null {
  try {
    if (value instanceof URL) {
      return new URL(value.href);
    }

    return base ? new URL(value, base) : new URL(value);
  } catch {
    return null;
  }
}

function isHttpProtocol(protocol: string): boolean {
  return protocol === "http:" || protocol === "https:";
}

export function isUnmodifiedPrimaryActivation(
  activation: LinkActivation,
): boolean {
  return (
    !activation.defaultPrevented &&
    activation.button === 0 &&
    !activation.metaKey &&
    !activation.ctrlKey &&
    !activation.shiftKey &&
    !activation.altKey
  );
}

/**
 * Determines whether a real anchor may be enhanced by the chapter coordinator.
 * Returning ineligible always means the browser retains native link behavior.
 */
export function evaluateLinkEligibility(
  activation: LinkActivation,
  link: LinkCandidate,
  currentUrlValue: string | URL,
): LinkEligibility {
  if (activation.defaultPrevented) {
    return ineligible("default-prevented");
  }

  if (activation.button !== 0) {
    return ineligible("non-primary-button");
  }

  if (
    activation.metaKey ||
    activation.ctrlKey ||
    activation.shiftKey ||
    activation.altKey
  ) {
    return ineligible("modified-activation");
  }

  if (!link.href || link.href.trim().length === 0) {
    return ineligible("missing-href");
  }

  if (link.download) {
    return ineligible("download");
  }

  const target = link.target?.trim().toLowerCase();

  if (target && target !== "_self") {
    return ineligible("new-context");
  }

  const currentUrl = parseUrl(currentUrlValue);

  if (!currentUrl) {
    return ineligible("invalid-current-url");
  }

  const destinationUrl = parseUrl(link.href, currentUrl);

  if (!destinationUrl) {
    return ineligible("invalid-destination-url");
  }

  if (!isHttpProtocol(destinationUrl.protocol)) {
    return ineligible("unsupported-protocol");
  }

  if (destinationUrl.origin !== currentUrl.origin) {
    return ineligible("external-origin");
  }

  if (destinationUrl.hash.length > 0) {
    return ineligible("hash-destination");
  }

  const sourcePathname = normalizePathname(currentUrl.pathname);
  const destinationPathname = normalizePathname(destinationUrl.pathname);

  if (sourcePathname === destinationPathname) {
    return ineligible("same-pathname");
  }

  const transition = classifyScoreTransition(
    sourcePathname,
    destinationPathname,
  );

  if (transition.sourceKind !== "main-chapter") {
    return ineligible("source-not-main-chapter");
  }

  if (transition.destinationKind !== "main-chapter") {
    return ineligible("destination-not-main-chapter");
  }

  return {
    eligible: true,
    sourcePathname,
    destinationPathname,
    destinationHref: destinationUrl.href,
    transition,
  };
}
