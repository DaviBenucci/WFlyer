"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { OfficialBrandSymbol } from "@/components/brand";

import styles from "./brand-intro.module.css";

gsap.registerPlugin(useGSAP);

export const BRAND_INTRO_SESSION_KEY = "wflyer.brand-intro.completed.v1";
export const BRAND_INTRO_LABELS = {
  "hero:ready": 5.6,
  "hero:start": 4.25,
  "intro:breath": 2.1,
  "intro:expand": 0.7,
  "intro:handoff": 4.05,
  "intro:hold": 3.3,
  "intro:lock": 1.5,
  "intro:overlay-off": 4.85,
  "intro:seed": 0.3,
  "intro:start": 0,
  "intro:wordmark": 2.5,
} as const;

type IntroState = "resolving" | "waiting" | "playing" | "completed";

type IntroTarget = HTMLElement | SVGElement;

interface AttributeSnapshot {
  readonly present: boolean;
  readonly value: string | null;
}

interface HomeOpeningTargets {
  readonly all: readonly IntroTarget[];
  readonly applicationCopy: readonly HTMLElement[];
  readonly applicationScoreLines: readonly SVGElement[];
  readonly applicationActions: readonly HTMLElement[];
  readonly cue: HTMLElement;
  readonly headerDetails: readonly SVGElement[];
  readonly headerLabels: readonly HTMLElement[];
  readonly headerLines: readonly SVGElement[];
  readonly headerPivot: HTMLElement;
  readonly homeDetails: readonly SVGElement[];
  readonly homeOrigin: HTMLElement;
  readonly institutionalActions: readonly HTMLElement[];
  readonly institutionalCopy: readonly HTMLElement[];
  readonly institutionalScoreLines: readonly SVGElement[];
}

const OWNED_STYLE_PROPERTIES = [
  "opacity",
  "rotate",
  "scale",
  "stroke-dasharray",
  "stroke-dashoffset",
  "transform",
  "transform-origin",
  "translate",
  "visibility",
] as const;

const OWNED_SVG_ATTRIBUTES = ["data-svg-origin", "transform"] as const;

function snapshotAttribute(
  element: Element,
  attribute: string,
): AttributeSnapshot {
  return {
    present: element.hasAttribute(attribute),
    value: element.getAttribute(attribute),
  };
}

function restoreAttribute(
  element: Element,
  attribute: string,
  snapshot: AttributeSnapshot,
): void {
  if (snapshot.present) {
    element.setAttribute(attribute, snapshot.value ?? "");
  } else {
    element.removeAttribute(attribute);
  }
}

function isolateExperienceSiblings(root: HTMLElement): () => void {
  const shell = root.parentElement;

  if (!shell?.hasAttribute("data-site-experience")) {
    return () => undefined;
  }

  const snapshots = Array.from(shell.children)
    .filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element !== root &&
        !element.hasAttribute("data-score-transition-layer"),
    )
    .map((element) => ({
      ariaHidden: snapshotAttribute(element, "aria-hidden"),
      element,
      inert: snapshotAttribute(element, "inert"),
    }));

  for (const { element } of snapshots) {
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("inert", "");
  }

  let restored = false;

  return () => {
    if (restored) return;
    restored = true;

    for (const snapshot of snapshots) {
      restoreAttribute(snapshot.element, "aria-hidden", snapshot.ariaHidden);
      restoreAttribute(snapshot.element, "inert", snapshot.inert);
    }
  };
}

function isVisibleTarget(element: Element): boolean {
  const bounds = element.getBoundingClientRect();

  return bounds.width > 0 || bounds.height > 0;
}

function queryVisible<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector)).filter(
    isVisibleTarget,
  );
}

function resolveHomeOpeningTargets(): HomeOpeningTargets | null {
  const headerPivot = queryVisible<HTMLElement>(
    "[data-brand-intro-header-pivot]",
  ).at(0);
  const homeOrigin = queryVisible<HTMLElement>(
    "[data-brand-intro-home-origin]",
  ).at(0);
  const cue = queryVisible<HTMLElement>(
    "[data-brand-intro-home-cue]",
  ).at(0);
  const applicationCopy = queryVisible<HTMLElement>(
    '[data-brand-intro-home-copy="application"]',
  );
  const institutionalCopy = queryVisible<HTMLElement>(
    '[data-brand-intro-home-copy="institutional"]',
  );
  const applicationActions = queryVisible<HTMLElement>(
    '[data-brand-intro-home-actions="application"]',
  );
  const institutionalActions = queryVisible<HTMLElement>(
    '[data-brand-intro-home-actions="institutional"]',
  );
  const homeScoreLines = queryVisible<SVGElement>(
    "[data-brand-intro-home-score] [data-origin-staff-line]",
  );
  const applicationScoreLines = homeScoreLines.filter(
    (line) =>
      line.closest('[data-score-branch="application"]') !== null,
  );
  const institutionalScoreLines = homeScoreLines.filter(
    (line) =>
      line.closest('[data-score-branch="institutional"]') !== null,
  );

  if (
    !headerPivot ||
    !homeOrigin ||
    !cue ||
    applicationCopy.length === 0 ||
    institutionalCopy.length === 0 ||
    applicationActions.length === 0 ||
    institutionalActions.length === 0 ||
    applicationScoreLines.length === 0 ||
    institutionalScoreLines.length === 0
  ) {
    return null;
  }

  const headerDetails = queryVisible<SVGElement>(
    "[data-brand-intro-header-score-detail]",
  );
  const headerLabels = queryVisible<HTMLElement>(
    "[data-brand-intro-header-label]",
  );
  const headerLines = queryVisible<SVGElement>(
    "[data-brand-intro-header-score-lines] [data-staff-line]",
  );
  const homeDetails = queryVisible<SVGElement>(
    "[data-brand-intro-home-score] [data-origin-note]",
  );
  const all = Array.from(
    new Set<IntroTarget>([
      headerPivot,
      homeOrigin,
      cue,
      ...applicationCopy,
      ...institutionalCopy,
      ...applicationActions,
      ...institutionalActions,
      ...applicationScoreLines,
      ...institutionalScoreLines,
      ...headerDetails,
      ...headerLabels,
      ...headerLines,
      ...homeDetails,
    ]),
  );

  return {
    all,
    applicationActions,
    applicationCopy,
    applicationScoreLines,
    cue,
    headerDetails,
    headerLabels,
    headerLines,
    headerPivot,
    homeDetails,
    homeOrigin,
    institutionalActions,
    institutionalCopy,
    institutionalScoreLines,
  };
}

function snapshotAnimatedTargets(
  targets: readonly IntroTarget[],
): () => void {
  const snapshots = targets.map((element) => ({
    attributes: OWNED_SVG_ATTRIBUTES.map((attribute) => ({
      attribute,
      snapshot: snapshotAttribute(element, attribute),
    })),
    element,
    hadStyleAttribute: element.hasAttribute("style"),
    styles: OWNED_STYLE_PROPERTIES.map((property) => ({
      priority: element.style.getPropertyPriority(property),
      property,
      value: element.style.getPropertyValue(property),
    })),
  }));
  let restored = false;

  return () => {
    if (restored) return;
    restored = true;

    for (const snapshot of snapshots) {
      for (const style of snapshot.styles) {
        if (style.value) {
          snapshot.element.style.setProperty(
            style.property,
            style.value,
            style.priority,
          );
        } else {
          snapshot.element.style.removeProperty(style.property);
        }
      }
      for (const attribute of snapshot.attributes) {
        restoreAttribute(
          snapshot.element,
          attribute.attribute,
          attribute.snapshot,
        );
      }
      if (
        !snapshot.hadStyleAttribute &&
        snapshot.element.getAttribute("style") === ""
      ) {
        snapshot.element.removeAttribute("style");
      }
    }
  };
}

function safelyCompleteSession(): void {
  try {
    sessionStorage.setItem(BRAND_INTRO_SESSION_KEY, "1");
  } catch {
    // Storage is progressive enhancement; never block the Home.
  }
}

export function BrandIntroController({
  force = false,
  testMode = false,
}: {
  readonly force?: boolean;
  readonly testMode?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const deadlineRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isolationReleaseRef = useRef<(() => void) | null>(null);
  const lockupUrlRef = useRef<string | null>(null);
  const targetReleaseRef = useRef<(() => void) | null>(null);
  const completedRef = useRef(false);
  const [state, setState] = useState<IntroState>("resolving");
  const [lockupUrl, setLockupUrl] = useState<string | null>(null);

  const complete = useCallback((): void => {
    if (completedRef.current) return;
    completedRef.current = true;
    timelineRef.current?.kill();
    timelineRef.current = null;
    targetReleaseRef.current?.();
    targetReleaseRef.current = null;
    isolationReleaseRef.current?.();
    isolationReleaseRef.current = null;
    if (deadlineRef.current !== null) clearTimeout(deadlineRef.current);
    deadlineRef.current = null;
    if (lockupUrlRef.current) URL.revokeObjectURL(lockupUrlRef.current);
    lockupUrlRef.current = null;
    document.documentElement.removeAttribute("data-brand-intro-active");
    document.body.style.removeProperty("overflow");
    delete (
      window as typeof window & { __wfBrandIntroTimeline?: gsap.core.Timeline }
    ).__wfBrandIntroTimeline;
    safelyCompleteSession();
    setState("completed");
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") complete();
    };
    const handleViewportChange = (): void => complete();
    const handleVisibility = (): void => {
      if (document.hidden) complete();
    };
    const eligibilityId = window.setTimeout(() => {
      let completed = false;
      const forcedInTest =
        testMode && new URLSearchParams(location.search).get("intro") === "1";
      try {
        completed =
          !force &&
          ((testMode && !forcedInTest) ||
            sessionStorage.getItem(BRAND_INTRO_SESSION_KEY) === "1");
      } catch {
        completed = true;
      }

      if (completed) {
        completedRef.current = true;
        setState("completed");
        return;
      }

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        completedRef.current = true;
        safelyCompleteSession();
        setState("completed");
        return;
      }

      document.documentElement.setAttribute("data-brand-intro-active", "true");
      document.body.style.setProperty("overflow", "hidden");
      setState("waiting");
      deadlineRef.current = setTimeout(complete, 7_000);
      window.addEventListener("orientationchange", handleViewportChange);
      window.addEventListener("resize", handleViewportChange);
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("visibilitychange", handleVisibility);
    }, 0);

    return () => {
      clearTimeout(eligibilityId);
      window.removeEventListener("orientationchange", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("visibilitychange", handleVisibility);
      timelineRef.current?.kill();
      targetReleaseRef.current?.();
      targetReleaseRef.current = null;
      isolationReleaseRef.current?.();
      isolationReleaseRef.current = null;
      if (deadlineRef.current !== null) clearTimeout(deadlineRef.current);
      document.documentElement.removeAttribute("data-brand-intro-active");
      document.body.style.removeProperty("overflow");
      if (lockupUrlRef.current) URL.revokeObjectURL(lockupUrlRef.current);
      lockupUrlRef.current = null;
      delete (
        window as typeof window & {
          __wfBrandIntroTimeline?: gsap.core.Timeline;
        }
      ).__wfBrandIntroTimeline;
    };
  }, [complete, force, testMode]);

  const introActive = state === "waiting" || state === "playing";

  useEffect(() => {
    if (!introActive || !rootRef.current) return;

    const release = isolateExperienceSiblings(rootRef.current);
    isolationReleaseRef.current = release;

    return () => {
      release();
      if (isolationReleaseRef.current === release) {
        isolationReleaseRef.current = null;
      }
    };
  }, [introActive]);

  useEffect(() => {
    if (state !== "waiting" || !rootRef.current) return;

    const controller = new AbortController();
    void fetch("/brand/wflyer-intro-master.svg", {
      cache: "force-cache",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("brand intro asset unavailable");
        const source = await response.text();
        const documentNode = new DOMParser().parseFromString(
          source,
          "image/svg+xml",
        );
        const master = documentNode.documentElement;
        if (
          master.localName !== "svg" ||
          master.getAttribute("data-asset-name") !== "wflyer-intro-master"
        ) {
          throw new Error("brand intro asset invalid");
        }
        master.setAttribute("data-state", "final");
        master.style.setProperty("color", getComputedStyle(rootRef.current!).color);
        const serialized = new XMLSerializer().serializeToString(master);
        if (controller.signal.aborted) return;
        const url = URL.createObjectURL(
          new Blob([serialized], { type: "image/svg+xml" }),
        );
        lockupUrlRef.current = url;
        setLockupUrl(url);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          complete();
        }
      });

    return () => controller.abort();
  }, [complete, state]);

  useGSAP(
    () => {
      if (state !== "playing" || !rootRef.current) return;

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        gsap.set("[data-intro-lockup]", { opacity: 1, scale: 1 });
        complete();
        return;
      }

      const homeTargets = resolveHomeOpeningTargets();
      const symbol = rootRef.current.querySelector<SVGSVGElement>(
        "[data-intro-symbol]",
      );
      const symbolStage = rootRef.current.querySelector<HTMLElement>(
        "[data-intro-symbol-stage]",
      );

      if (!homeTargets || !symbol || !symbolStage) {
        complete();
        return;
      }

      targetReleaseRef.current?.();
      targetReleaseRef.current = snapshotAnimatedTargets(homeTargets.all);

      const timeline = gsap.timeline({ onComplete: complete });
      const homePivot = homeTargets.headerPivot;
      const handoffX = (): number => {
        if (!symbol || !homePivot) return 0;
        const from = symbol.getBoundingClientRect();
        const to = homePivot.getBoundingClientRect();
        return to.left + to.width / 2 - (from.left + from.width / 2);
      };
      const handoffY = (): number => {
        if (!symbol || !homePivot) return 0;
        const from = symbol.getBoundingClientRect();
        const to = homePivot.getBoundingClientRect();
        return to.top + to.height / 2 - (from.top + from.height / 2);
      };
      const handoffScale = (): number => {
        if (!symbol || !homePivot) return 0.2;
        const from = symbol.getBoundingClientRect();
        const to = homePivot.getBoundingClientRect();
        return from.width > 0 ? (to.width / from.width) * 0.96 : 0.2;
      };
      for (const [label, at] of Object.entries(BRAND_INTRO_LABELS)) {
        timeline.addLabel(label, at);
      }
      timeline
        .set("[data-intro-lockup]", { opacity: 0, scale: 0.72 })
        .set("[data-intro-symbol]", { opacity: 0, scale: 0.45 })
        .set("[data-intro-echo]", { opacity: 0, scale: 0.45 })
        .set(homeTargets.headerPivot, { opacity: 0 }, 0);
      if (homeTargets.headerLines.length > 0) {
        timeline.set(
          homeTargets.headerLines,
          { opacity: 0, scaleX: 0.04, transformOrigin: "50% 50%" },
          0,
        );
      }
      if (homeTargets.headerDetails.length > 0) {
        timeline.set(homeTargets.headerDetails, { opacity: 0 }, 0);
      }
      if (homeTargets.headerLabels.length > 0) {
        timeline.set(homeTargets.headerLabels, { opacity: 0, y: 6 }, 0);
      }
      timeline
        .set(
          homeTargets.applicationScoreLines,
          { opacity: 0, scaleX: 0.04, transformOrigin: "100% 50%" },
          0,
        )
        .set(
          homeTargets.institutionalScoreLines,
          { opacity: 0, scaleX: 0.04, transformOrigin: "0% 50%" },
          0,
        )
        .set(homeTargets.homeDetails, { opacity: 0 }, 0)
        .set(
          homeTargets.homeOrigin,
          { opacity: 0, rotation: -1, scale: 0.94 },
          0,
        )
        .set(homeTargets.applicationCopy, { opacity: 0, x: -20 }, 0)
        .set(homeTargets.institutionalCopy, { opacity: 0, x: 20 }, 0)
        .set(
          [
            ...homeTargets.applicationActions,
            ...homeTargets.institutionalActions,
          ],
          { opacity: 0, y: 10 },
          0,
        )
        .set(homeTargets.cue, { opacity: 0, y: 8 }, 0)
        .fromTo(
          "[data-intro-origin]",
          { opacity: 0, scaleX: 0.08 },
          { duration: 0.3, opacity: 1, scaleX: 1, ease: "power2.out" },
          "intro:start",
        )
        .to(
          "[data-intro-symbol]",
          { duration: 0.4, opacity: 1, scale: 1, ease: "power3.out" },
          "intro:seed",
        )
        .to(
          "[data-intro-echo]",
          { duration: 0.8, opacity: 0.32, scale: 1.14, stagger: 0.06, ease: "expo.out" },
          "intro:expand",
        )
        .to(
          "[data-intro-echo]",
          { duration: 0.6, opacity: 0, scale: 1, ease: "power3.out" },
          "intro:lock",
        )
        .to("[data-intro-symbol]", { duration: 0.4, scale: 0.96 }, "intro:breath")
        .to("[data-intro-origin]", { duration: 0.2, opacity: 0 }, "intro:wordmark")
        .to(
          "[data-intro-lockup]",
          { duration: 0.8, opacity: 1, scale: 1, ease: "power2.inOut" },
          "intro:wordmark",
        )
        .to(
          "[data-intro-symbol-stage]",
          { duration: 0.35, opacity: 0, ease: "power2.out" },
          "intro:wordmark",
        )
        .set(symbolStage, { opacity: 1 }, "intro:handoff")
        .to(
          symbol,
          {
            duration: 0.8,
            ease: "power3.inOut",
            scale: handoffScale,
            x: handoffX,
            y: handoffY,
          },
          "intro:handoff",
        )
        .to(
          "[data-intro-lockup]",
          { duration: 0.26, opacity: 0, ease: "power2.out" },
          "intro:handoff",
        )
        .to(
          rootRef.current,
          { duration: 0.8, opacity: 0, ease: "power1.inOut" },
          "intro:handoff",
        );
      if (homeTargets.headerLines.length > 0) {
        timeline.to(
          homeTargets.headerLines,
          {
            duration: 0.4,
            ease: "power2.out",
            opacity: 1,
            scaleX: 1,
            stagger: 0.003,
          },
          "hero:start",
        );
      }
      timeline
        .to(
          homeTargets.applicationScoreLines,
          {
            duration: 0.38,
            ease: "power2.out",
            opacity: 1,
            scaleX: 1,
            stagger: 0.004,
          },
          "hero:start+=0.05",
        )
        .to(
          homeTargets.institutionalScoreLines,
          {
            duration: 0.38,
            ease: "power2.out",
            opacity: 1,
            scaleX: 1,
            stagger: 0.004,
          },
          "hero:start+=0.05",
        );
      if (homeTargets.headerDetails.length > 0) {
        timeline.to(
          homeTargets.headerDetails,
          {
            duration: 0.24,
            ease: "power2.out",
            opacity: 1,
            stagger: 0.006,
          },
          "hero:start+=0.33",
        );
      }
      timeline.to(
        homeTargets.homeDetails,
        {
          duration: 0.24,
          ease: "power2.out",
          opacity: 1,
          stagger: 0.018,
        },
        "hero:start+=0.33",
      );
      if (homeTargets.headerLabels.length > 0) {
        timeline.to(
          homeTargets.headerLabels,
          {
            duration: 0.28,
            ease: "power2.out",
            opacity: 1,
            stagger: 0.008,
            y: 0,
          },
          "hero:start+=0.35",
        );
      }
      timeline
        .to(
          homeTargets.homeOrigin,
          {
            duration: 0.32,
            ease: "power2.out",
            opacity: 1,
            rotation: 0,
            scale: 1,
          },
          "hero:start+=0.41",
        )
        .set(homeTargets.headerPivot, { opacity: 1 }, "intro:overlay-off-=0.01")
        .to(
          homeTargets.applicationCopy,
          {
            duration: 0.22,
            ease: "power3.out",
            opacity: 1,
            stagger: 0.018,
            x: 0,
          },
          "hero:start+=0.77",
        )
        .to(
          homeTargets.institutionalCopy,
          {
            duration: 0.22,
            ease: "power3.out",
            opacity: 1,
            stagger: 0.018,
            x: 0,
          },
          "hero:start+=0.77",
        )
        .to(
          [
            ...homeTargets.applicationActions,
            ...homeTargets.institutionalActions,
          ],
          {
            duration: 0.14,
            ease: "power2.out",
            opacity: 1,
            y: 0,
          },
          "hero:start+=1.05",
        )
        .to(
          homeTargets.cue,
          { duration: 0.15, ease: "power2.out", opacity: 1, y: 0 },
          "hero:start+=1.2",
        );
      timelineRef.current = timeline;
      if (
        testMode &&
        new URLSearchParams(location.search).get("introCheckpoint") === "1"
      ) {
        timeline.pause(0);
        (
          window as typeof window & {
            __wfBrandIntroTimeline?: gsap.core.Timeline;
          }
        ).__wfBrandIntroTimeline = timeline;
      }
    },
    { dependencies: [state, testMode], scope: rootRef },
  );

  if (state === "resolving" || state === "completed") return null;

  return (
    <div className={styles.overlay} data-brand-intro={state} ref={rootRef}>
      <div aria-label="W_Flyer" className={styles.stage} role="img">
        <span aria-hidden="true" className={styles.origin} data-intro-origin="" />
        <div aria-hidden="true" className={styles.symbolStage} data-intro-symbol-stage="">
          <OfficialBrandSymbol className={styles.echoOne} data-intro-echo="" decorative />
          <OfficialBrandSymbol className={styles.echoTwo} data-intro-echo="" decorative />
          <OfficialBrandSymbol className={styles.symbol} data-intro-symbol="" decorative />
        </div>
        {lockupUrl ? (
          <Image
            aria-hidden="true"
            alt=""
            className={styles.lockup}
            data-intro-lockup=""
            fill
            onError={complete}
            onLoad={() => setState("playing")}
            src={lockupUrl}
            unoptimized
          />
        ) : null}
      </div>
      <button className={styles.skip} onClick={complete} type="button">
        Pular introdução
      </button>
    </div>
  );
}
