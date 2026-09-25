"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ScoreSvg } from "@/components/score/ScoreSvg";
import { SCORE_REVIEW_SVG_PRECISION } from "@/components/score/svg-number";
import {
  storyScoreCompositionDiagnostics,
  STORY_SCORE_EXPECTED_FINGERPRINTS,
} from "@/lib/story/score/composition";
import {
  buildStoryScoreProjection,
  STORY_SCORE_PROJECTION_MODES,
  type StoryScoreProjectionMode,
  type StoryScoreSceneMeasurements,
} from "@/lib/story/score/projection";
import { MOTION_LAB_DRAFT_ELIGIBILITY } from "@/lib/story/motion";

import { measureStoryScoreScenes, storyScoreMeasurementOwners } from "./measurement";
import { serializeStoryScoreEventSafety, serializeStoryScoreGeometry } from "./projection-metadata";
import type { ProjectsHorizontalCandidateSnapshot } from "./projects-capacity-candidate";
import styles from "./story-score-layer.module.css";

interface ScoreLayerState {
  readonly clientReady: boolean;
  readonly height: number;
  readonly measurementSignature: string;
  readonly mode: StoryScoreProjectionMode;
  readonly sceneMeasurements?: StoryScoreSceneMeasurements;
  readonly width: number;
}

const HYDRATION_BASELINE: ScoreLayerState = Object.freeze({
  clientReady: false,
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

export interface StoryScoreLayerProps {
  readonly readHorizontalCandidateSnapshot?: (
    width: number,
    height: number,
    revision: string,
  ) => ProjectsHorizontalCandidateSnapshot | null;
}

export function StoryScoreLayer({
  readHorizontalCandidateSnapshot,
}: StoryScoreLayerProps = {}) {
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

      const revision = `fonts:${document.fonts?.status ?? "loaded"}`;
      const candidateSnapshot =
        nextMode === "horizontal-enhanced"
          ? readHorizontalCandidateSnapshot?.(
              nextWidth,
              nextHeight,
              revision,
            ) ?? null
          : null;
      const sceneMeasurement =
        nextMode === "horizontal-enhanced"
          ? candidateSnapshot === null
            ? measureStoryScoreScenes(track)
            : {
                measurements: candidateSnapshot.measurements,
                signature: candidateSnapshot.signature,
              }
          : undefined;
      const nextMeasurementSignature =
        sceneMeasurement?.signature ?? "fallback";

      setState((current) =>
        current.clientReady &&
        current.mode === nextMode &&
        current.width === nextWidth &&
        current.height === nextHeight &&
        current.measurementSignature === nextMeasurementSignature
          ? current
          : Object.freeze({
              clientReady: true,
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
    storyScoreMeasurementOwners(track).forEach((element) =>
      sizeObserver?.observe(element),
    );
    synchronize();

    return () => {
      cancelAnimationFrame(frame);
      modeObserver.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleSynchronization);
    };
  }, [readHorizontalCandidateSnapshot]);

  const layerStyle = {
    "--story-score-height": `${projection.height}px`,
    "--story-score-width": `${projection.width}px`,
  } as CSSProperties;
  const servicesInteraction =
    projection.evidence.cardScoreInteractions["professional-services"];

  return (
    <div
      aria-hidden="true"
      className={styles.layer}
      data-score-composer-invocations={diagnostics.composerInvocationCount}
      data-score-connector-events={projection.evidence.connectorEventCount}
      data-score-clef-mirror-x={String(projection.evidence.clef.mirrorX)}
      data-score-clef-mirror-y={String(projection.evidence.clef.mirrorY)}
      data-score-clef-rotation={
        projection.evidence.clef.rotationDegrees.toFixed(6)
      }
      data-score-hydration-precision={SCORE_REVIEW_SVG_PRECISION}
      data-score-maximum-notation-tangent={
        projection.evidence.maximumNotationTangentAngleDeg.toFixed(6)
      }
      data-score-professional-fingerprint={
        STORY_SCORE_EXPECTED_FINGERPRINTS.professional
      }
      data-score-path-self-intersections={
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
      data-story-spatial-projection="continuous-story"
      data-story-spatial-landmarks={JSON.stringify(projection.spatialGeometry.chapters.map(
        ({ chapterId, contentSpan, entryAnchor, exitTransition, interactionSpans, stations, structuralStart }) => ({
          chapterId,
          contentSpan,
          entryAnchor,
          exitTransition,
          interactionSpans,
          stations,
          structuralStart,
        }),
      ))}
      data-story-spatial-camera={JSON.stringify(projection.spatialGeometry.cameraSegments)}
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
        projection.evidence.staffLineSelfIntersections.professional
      }
      data-story-score-layer="phase-9-task-34"
      ref={layerRef}
      style={layerStyle}
    >
      {(["professional"] as const).map((branch) => {
        const branchProjection = projection.branches[branch];
        return (
          <div
            className={styles.branch}
            data-score-branch={branch}
            data-score-clef-owner="origin"
            data-score-final-barline="thin-gap-thick-and-physical-end"
            data-score-event-safety={serializeStoryScoreEventSafety(branchProjection.eventSafety)}
            data-score-candidate-count={state.clientReady ? branchProjection.eventSafety.candidateCount : undefined}
            data-score-home-entry={serializeStoryScoreGeometry(branchProjection.homeEntry)}
            data-score-segment-ids={branchProjection.semanticSegmentIds.join(
              " ",
            )}
            key={branch}
          >
            <ScoreSvg
              className={styles.score}
              data-integrated-score={branch}
              model={branchProjection.model}
              numericPrecision={SCORE_REVIEW_SVG_PRECISION}
              viewBox={branchProjection.viewBox}
            />
          </div>
        );
      })}
    </div>
  );
}
