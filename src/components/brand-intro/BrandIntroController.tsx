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
  const lockupUrlRef = useRef<string | null>(null);
  const completedRef = useRef(false);
  const [state, setState] = useState<IntroState>("resolving");
  const [lockupUrl, setLockupUrl] = useState<string | null>(null);

  const complete = useCallback((): void => {
    if (completedRef.current) return;
    completedRef.current = true;
    timelineRef.current?.kill();
    timelineRef.current = null;
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

      const timeline = gsap.timeline({ onComplete: complete });
      const symbol = rootRef.current.querySelector<SVGSVGElement>(
        "[data-intro-symbol]",
      );
      const symbolStage = rootRef.current.querySelector<HTMLElement>(
        "[data-intro-symbol-stage]",
      );
      const homePivot = Array.from(
        document.querySelectorAll<HTMLElement>("[data-home-pivot]"),
      ).find((candidate) => candidate.getBoundingClientRect().width > 0);
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
        .to(rootRef.current, { duration: 0.8, opacity: 0, ease: "power1.inOut" }, "intro:handoff")
        .to({}, { duration: 0.75 }, "intro:overlay-off");
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
