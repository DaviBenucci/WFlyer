"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ScoreSvg } from "@/components/score/ScoreSvg";
import {
  storyScoreCompositionDiagnostics,
  STORY_SCORE_EXPECTED_FINGERPRINTS,
} from "@/lib/story/score/composition";
import {
  buildStoryScoreProjection,
  STORY_SCORE_PROJECTION_MODES,
  type StoryScoreMeasuredRect,
  type StoryScoreProjectionMode,
  type StoryScoreSceneMeasurements,
} from "@/lib/story/score/projection";
import { DESKTOP_TIMELINE_ORDER } from "@/lib/story/manifest";
import { MOTION_LAB_DRAFT_ELIGIBILITY } from "@/lib/story/motion";

import { normalizeStoryScoreMeasuredRect } from "./measurement";
import styles from "./story-score-layer.module.css";

interface ScoreLayerState {
  readonly height: number;
  readonly measurementSignature: string;
  readonly mode: StoryScoreProjectionMode;
  readonly sceneMeasurements?: StoryScoreSceneMeasurements;
  readonly width: number;
}

const HYDRATION_BASELINE: ScoreLayerState = Object.freeze({
  height: 900,
  measurementSignature: "fallback",
  mode: "static",
  width: 1440,
});

function isProjectionMode(value: string | undefined): value is StoryScoreProjectionMode {
  return STORY_SCORE_PROJECTION_MODES.includes(
    value as StoryScoreProjectionMode,
  );
}

const ATOMIC_EXCLUSION_REASONS = new Set([
  "application-benefits",
  "application-overview",
  "heading-and-body",
  "home-reading-envelope",
  "process-stages",
  "terminal-content",
]);

function exclusionMeasurementOwners(exclusion: HTMLElement): HTMLElement[] {
  const reason = exclusion.dataset.scoreContentExclusion ?? "";

  return ATOMIC_EXCLUSION_REASONS.has(reason)
    ? Array.from(exclusion.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement,
      )
    : [exclusion];
}

function scoreMeasurementOwners(track: HTMLElement): readonly HTMLElement[] {
  const owners = new Set<HTMLElement>(
    track.querySelectorAll<HTMLElement>(
      "[data-service-module], [data-application-how-step], [data-project-card-item]",
    ),
  );

  track
    .querySelectorAll<HTMLElement>("[data-score-content-exclusion]")
    .forEach((exclusion) => {
      exclusionMeasurementOwners(exclusion).forEach((owner) => owners.add(owner));
    });

  return Object.freeze([...owners]);
}

function measureElements(
  elements: readonly HTMLElement[],
  trackRect: DOMRect,
): readonly StoryScoreMeasuredRect[] {
  return Object.freeze(
    elements.flatMap((element) => {
      const rect = element.getBoundingClientRect();

      return rect.width > 0 && rect.height > 0
        ? [normalizeStoryScoreMeasuredRect(rect, trackRect)]
        : [];
    }),
  );
}

function measureScoreScenes(track: HTMLElement): {
  readonly measurements: StoryScoreSceneMeasurements;
  readonly signature: string;
} {
  const trackRect = track.getBoundingClientRect();
  const chapterContentExclusions = Object.freeze(
    Object.fromEntries(
      DESKTOP_TIMELINE_ORDER.map((chapterId) => {
        const chapter = track.querySelector<HTMLElement>(
          `[data-chapter-id="${chapterId}"]`,
        );
        if (!chapter) return [chapterId, Object.freeze([])] as const;

        const rectangles = Array.from(
          chapter.querySelectorAll<HTMLElement>(
            "[data-score-content-exclusion]",
          ),
        ).flatMap((exclusion) => {
          const reason = exclusion.dataset.scoreContentExclusion ?? "";

          return measureElements(
            exclusionMeasurementOwners(exclusion),
            trackRect,
          ).map((rect) => Object.freeze({ ...rect, reason }));
        });

        return [chapterId, Object.freeze(rectangles)] as const;
      }),
    ),
  );
  const measurements = Object.freeze({
    applicationHowItWorksCards: measureElements(
      Array.from(
        track.querySelectorAll<HTMLElement>(
          '[data-application-scene="how-it-works"] [data-application-how-step]',
        ),
      ),
      trackRect,
    ),
    chapterContentExclusions,
    professionalProjectCards: measureElements(
      Array.from(
        track.querySelectorAll<HTMLElement>(
          '[data-professional-scene="projects"] [data-project-card-item]',
        ),
      ),
      trackRect,
    ),
    professionalServicesCards: measureElements(
      Array.from(
        track.querySelectorAll<HTMLElement>(
          '[data-professional-scene="services"] [data-service-module]',
        ),
      ),
      trackRect,
    ),
  });
  return Object.freeze({
    measurements,
    signature: JSON.stringify(measurements),
  });
}

export function StoryScoreLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScoreLayerState>(HYDRATION_BASELINE);
  const projection = useMemo(
    () =>
      buildStoryScoreProjection(state.mode, {
        ...(state.sceneMeasurements
          ? { sceneMeasurements: state.sceneMeasurements }
          : {}),
        viewportHeight: state.height,
        viewportWidth: state.width,
      }),
    [
      state.height,
      state.mode,
      state.sceneMeasurements,
      state.width,
    ],
  );
  const diagnostics = storyScoreCompositionDiagnostics();

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const root = layer?.closest<HTMLElement>("[data-story-v2]");
    const track = layer?.closest<HTMLElement>("[data-motion-track]");
    if (!layer || !root || !track) return;

    let frame = 0;
    const synchronize = () => {
      const nextMode = isProjectionMode(root.dataset.projectionMode)
        ? root.dataset.projectionMode
        : "static";
      const nextWidth = Math.max(
        320,
        Math.round(root.getBoundingClientRect().width || window.innerWidth),
      );
      const nextHeight = Math.max(320, Math.round(window.innerHeight));
      const hasHorizontalLayoutCapacity =
        nextWidth >= MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumWidth &&
        nextHeight >= MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumHeight &&
        nextWidth / nextHeight >=
          MOTION_LAB_DRAFT_ELIGIBILITY.horizontalMinimumAspectRatio;

      if (nextMode === "horizontal-enhanced" && !hasHorizontalLayoutCapacity) {
        return;
      }

      const sceneMeasurement =
        nextMode === "horizontal-enhanced"
          ? measureScoreScenes(track)
          : undefined;
      const nextMeasurementSignature =
        sceneMeasurement?.signature ?? "fallback";

      setState((current) =>
        current.mode === nextMode &&
        current.width === nextWidth &&
        current.height === nextHeight &&
        current.measurementSignature === nextMeasurementSignature
          ? current
          : Object.freeze({
              height: nextHeight,
              measurementSignature: nextMeasurementSignature,
              mode: nextMode,
              ...(sceneMeasurement
                ? { sceneMeasurements: sceneMeasurement.measurements }
                : {}),
              width: nextWidth,
            }),
      );
    };
    const scheduleSynchronization = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(synchronize);
    };
    const modeObserver = new MutationObserver(scheduleSynchronization);
    const sizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleSynchronization);

    modeObserver.observe(root, {
      attributeFilter: ["data-projection-mode"],
      attributes: true,
    });
    window.addEventListener("resize", scheduleSynchronization, {
      passive: true,
    });
    sizeObserver?.observe(root);
    scoreMeasurementOwners(track).forEach((element) =>
      sizeObserver?.observe(element),
    );
    synchronize();

    return () => {
      cancelAnimationFrame(frame);
      modeObserver.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleSynchronization);
    };
  }, []);

  const layerStyle = {
    "--story-score-height": `${projection.height}px`,
    "--story-score-width": `${projection.width}px`,
  } as CSSProperties;
  const servicesInteraction =
    projection.evidence.cardScoreInteractions["professional-services"];
  const howInteraction =
    projection.evidence.cardScoreInteractions["application-how-it-works"];

  return (
    <div
      aria-hidden="true"
      className={styles.layer}
      data-score-application-fingerprint={
        STORY_SCORE_EXPECTED_FINGERPRINTS.application
      }
      data-score-composer-invocations={diagnostics.composerInvocationCount}
      data-score-connector-events={projection.evidence.connectorEventCount}
      data-score-how-expanded-span={howInteraction.expandedSpan.toFixed(3)}
      data-score-how-lead-in={howInteraction.leadInLength.toFixed(3)}
      data-score-how-lead-out={howInteraction.leadOutLength.toFixed(3)}
      data-score-how-measurement-source={howInteraction.measurementSource}
      data-score-how-minimum-opacity={howInteraction.minimumOpacity.toFixed(3)}
      data-score-how-unsafe-events={howInteraction.eventCount}
      data-score-clef-mirror-x={String(projection.evidence.clef.mirrorX)}
      data-score-clef-mirror-y={String(projection.evidence.clef.mirrorY)}
      data-score-clef-rotation={
        projection.evidence.clef.rotationDegrees.toFixed(6)
      }
      data-score-hydration-precision="6"
      data-score-maximum-notation-tangent={
        projection.evidence.maximumNotationTangentAngleDeg.toFixed(6)
      }
      data-score-professional-fingerprint={
        STORY_SCORE_EXPECTED_FINGERPRINTS.professional
      }
      data-score-origin-point-gap={
        projection.evidence.commonOrigin.pointGap.toFixed(6)
      }
      data-score-origin-staff-line-gap={
        projection.evidence.commonOrigin.staffLineGap.toFixed(6)
      }
      data-score-origin-tangent-alignment={
        projection.evidence.commonOrigin.tangentAlignment.toFixed(6)
      }
      data-score-path-self-intersections={
        projection.evidence.pathSelfIntersections.application +
        projection.evidence.pathSelfIntersections.professional
      }
      data-score-projection={projection.mode}
      data-score-project-connector-events={projection.evidence.projectSerpentine.connectorEventCounts.join(
        " ",
      )}
      data-score-project-maximum-tangent={projection.evidence.projectSerpentine.maximumShelfTangentAngleDeg.toFixed(
        6,
      )}
      data-score-project-visit-anchors={JSON.stringify(
        projection.evidence.projectSerpentine.visitAnchors,
      )}
      data-score-resolved-geometry={projection.resolvedGeometryMode}
      data-score-runtime-owner="precomputed-projection-no-scroll-state"
      data-score-segment-count={projection.evidence.segmentCount}
      data-score-session-seed={projection.sessionSeed}
      data-score-services-expanded-span={servicesInteraction.expandedSpan.toFixed(
        3,
      )}
      data-score-services-lead-in={servicesInteraction.leadInLength.toFixed(3)}
      data-score-services-lead-out={servicesInteraction.leadOutLength.toFixed(
        3,
      )}
      data-score-services-measurement-source={
        servicesInteraction.measurementSource
      }
      data-score-services-minimum-opacity={servicesInteraction.minimumOpacity.toFixed(
        3,
      )}
      data-score-services-unsafe-events={servicesInteraction.eventCount}
      data-score-staff-line-self-intersections={
        projection.evidence.staffLineSelfIntersections.application +
        projection.evidence.staffLineSelfIntersections.professional
      }
      data-story-score-layer="phase-9-task-34"
      ref={layerRef}
      style={layerStyle}
    >
      {(["application", "professional"] as const).map((branch) => {
        const branchProjection = projection.branches[branch];
        return (
          <div
            className={styles.branch}
            data-score-branch={branch}
            data-score-clef-owner={
              branch === "professional" ? "shared-origin" : "none"
            }
            data-score-final-barline="thin-gap-thick-and-physical-end"
            data-score-segment-ids={branchProjection.semanticSegmentIds.join(
              " ",
            )}
            key={branch}
          >
            <ScoreSvg
              className={styles.score}
              data-integrated-score={branch}
              model={branchProjection.model}
              numericPrecision={6}
              viewBox={branchProjection.viewBox}
            />
          </div>
        );
      })}
    </div>
  );
}
