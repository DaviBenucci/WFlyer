"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ScoreSvg } from "@/components/score/ScoreSvg";
import type { ComposerProfile } from "@/lib/music/composer/types";
import { RESPONSIVE_SCORE_PRESENTATION_MODES } from "@/lib/music/geometry/responsive-score-projection";

import styles from "../music-lab.module.css";
import {
  composeLabSegment,
  renderLabSegment,
  type LabComposerViewport,
} from "./lab-score-models";

const PROFILES = ["CALM", "BALANCED", "ACTIVE", "TERMINAL"] as const;
const DEFAULT_SEED = "music-lab-gate-b-seed-v1";
const DEFAULT_CHAPTER = "music-lab-chapter";

type ProfileFilter = ComposerProfile | "ALL";
type LabTheme = "dark" | "light";
type ComposerPerformanceStage =
  | "compositionResult"
  | "geometryResult"
  | "reactRender";

interface ComposerPerformanceCounters {
  compositionResult: number;
  geometryResult: number;
  reactRender: number;
}

const PERFORMANCE_MARK_PREFIX = "wflyer.music-lab.composer";
const PERFORMANCE_MARK_NAMES = {
  compositionResult: `${PERFORMANCE_MARK_PREFIX}.composition-result-commit`,
  geometryResult: `${PERFORMANCE_MARK_PREFIX}.geometry-result-commit`,
  reactRender: `${PERFORMANCE_MARK_PREFIX}.react-render-commit`,
} as const satisfies Record<ComposerPerformanceStage, string>;

function semanticProjection(
  segment: ReturnType<typeof composeLabSegment>,
) {
  return {
    versions: {
      composer: segment.composerVersion,
      pitchContourTable: segment.pitchContourTableVersion,
    },
    branchId: segment.branchId,
    chapterId: segment.chapterId,
    derivedSeed: segment.seed,
    profile: segment.profile,
    motifs: segment.motifs.map((motif) => ({
      instanceId: motif.id,
      slotId: motif.slotId,
      motifId: motif.motifId,
      family: motif.family,
      durations: motif.durations,
      staffSteps: motif.staffSteps,
      contour: {
        id: motif.contourId,
        translation: motif.contourTranslation,
      },
      dense: motif.dense,
      tuplet: motif.tuplet ?? null,
    })),
    emptySlots: segment.emptySlots,
  };
}

function recordPerformanceStage(
  container: HTMLDivElement | null,
  counters: ComposerPerformanceCounters,
  stage: ComposerPerformanceStage,
) {
  // These effects observe committed memo-result identities. They intentionally
  // do not claim to count speculative render-phase function invocations.
  counters[stage] += 1;
  performance.mark(PERFORMANCE_MARK_NAMES[stage]);

  if (!container) return;

  container.dataset[`${stage}Commits`] = String(counters[stage]);
}

function isProfileFilter(value: string): value is ProfileFilter {
  return value === "ALL" || PROFILES.some((profile) => profile === value);
}

function isLabTheme(value: string): value is LabTheme {
  return value === "dark" || value === "light";
}

function isLabViewport(value: string): value is LabComposerViewport {
  return RESPONSIVE_SCORE_PRESENTATION_MODES.some(
    (mode) => mode === value,
  );
}

export function ComposerFixtureControls() {
  const instrumentationRef = useRef<HTMLDivElement>(null);
  const performanceCountersRef = useRef<ComposerPerformanceCounters>({
    compositionResult: 0,
    geometryResult: 0,
    reactRender: 0,
  });
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [chapterId, setChapterId] = useState(DEFAULT_CHAPTER);
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>("ALL");
  const [theme, setTheme] = useState<LabTheme>("light");
  const [viewport, setViewport] =
    useState<LabComposerViewport>("horizontal-enhanced");
  const [debug, setDebug] = useState(true);
  const effectiveSeed = seed.trim() || DEFAULT_SEED;
  const effectiveChapterId = chapterId.trim() || DEFAULT_CHAPTER;
  const segments = useMemo(
    () => {
      const visibleProfiles =
        profileFilter === "ALL" ? PROFILES : [profileFilter];

      return visibleProfiles.map((profile) =>
        composeLabSegment(profile, effectiveSeed, effectiveChapterId),
      );
    },
    [effectiveChapterId, effectiveSeed, profileFilter],
  );
  const fixtures = useMemo(
    () => segments.map((segment) => renderLabSegment(segment, viewport)),
    [segments, viewport],
  );

  useEffect(() => {
    recordPerformanceStage(
      instrumentationRef.current,
      performanceCountersRef.current,
      "reactRender",
    );
  });

  useEffect(() => {
    recordPerformanceStage(
      instrumentationRef.current,
      performanceCountersRef.current,
      "compositionResult",
    );
  }, [segments]);

  useEffect(() => {
    recordPerformanceStage(
      instrumentationRef.current,
      performanceCountersRef.current,
      "geometryResult",
    );
  }, [fixtures]);

  return (
    <div
      data-composer-performance="memo-result-commit-v1"
      data-composition-result-commits="0"
      data-geometry-result-commits="0"
      data-react-render-commits="0"
      ref={instrumentationRef}
    >
      <form
        className={styles.fixtureGrid}
        data-fixture-component="composer-controls"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>Explicit session seed</span>
          <input
            data-composer-control="seed"
            onChange={(event) => setSeed(event.currentTarget.value)}
            spellCheck={false}
            type="text"
            value={seed}
          />
        </label>
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>Stable chapter ID</span>
          <input
            data-composer-control="chapter"
            onChange={(event) => setChapterId(event.currentTarget.value)}
            spellCheck={false}
            type="text"
            value={chapterId}
          />
        </label>
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>Profile fixture</span>
          <select
            data-composer-control="profile"
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isProfileFilter(value)) setProfileFilter(value);
            }}
            value={profileFilter}
          >
            <option value="ALL">All four profiles</option>
            {PROFILES.map((profile) => (
              <option key={profile} value={profile}>
                {profile}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>Theme context</span>
          <select
            data-composer-control="theme"
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isLabTheme(value)) setTheme(value);
            }}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>
            Geometry viewport / responsive projection mode
          </span>
          <select
            data-composer-control="viewport"
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (isLabViewport(value)) setViewport(value);
            }}
            value={viewport}
          >
            <option value="horizontal-enhanced">Horizontal enhanced</option>
            <option value="vertical-wide">Vertical wide</option>
            <option value="vertical-compact">Vertical compact</option>
            <option value="static">Static / reduced-motion fallback</option>
          </select>
        </label>
        <label className={styles.fixture}>
          <span className={styles.fixtureLabel}>Debug overlay</span>
          <input
            checked={debug}
            data-composer-control="debug"
            onChange={(event) => setDebug(event.currentTarget.checked)}
            type="checkbox"
          />
        </label>
      </form>

      <p className={styles.status} role="status">
        Semantic inputs: seed={effectiveSeed} · chapter={effectiveChapterId} ·
        responsive mode only remaps ScorePath geometry and physical slot ranges
      </p>

      <div className={styles.fixtureGrid}>
        {fixtures.map(({ model, projection, segment, viewBox }) => (
          <figure
            className={styles.fixture}
            data-composer-tuning-status="approved"
            data-composer-profile={segment.profile}
            data-composer-version={segment.composerVersion}
            data-glyph-calibration-status="runtime-approved"
            data-optical-token-status="approved"
            data-theme={theme}
            data-viewport={projection.mode}
            data-responsive-mode={projection.mode}
            data-semantic-slot-ids={projection.semanticSlotIds.join(",")}
            data-responsive-zone-count={projection.zones.length}
            key={segment.profile}
          >
            <ScoreSvg
              debug={debug}
              model={model}
              viewBox={viewBox}
            />
            <figcaption className={styles.fixtureLabel}>
              {segment.profile} · composer v{segment.composerVersion} · contour
              table v{segment.pitchContourTableVersion} · seed {effectiveSeed}
            </figcaption>
            <pre
              className={styles.fixtureLabel}
              data-composer-semantics={segment.profile}
            >
              <code>
                {JSON.stringify(semanticProjection(segment), null, 2)}
              </code>
            </pre>
          </figure>
        ))}
      </div>
    </div>
  );
}
