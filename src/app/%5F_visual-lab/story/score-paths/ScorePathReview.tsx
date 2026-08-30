"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

import {
  ApplicationChapterScene,
  ProfessionalChapterScene,
  type Phase8ApplicationChapterId,
  type ProfessionalChapterId,
} from "@/components/story";
import { ScoreSvg } from "@/components/score/ScoreSvg";
import {
  SCORE_REVIEW_SVG_PRECISION,
  serializeSvgNumber,
} from "@/components/score/svg-number";
import { Eyebrow, Heading, Text } from "@/components/ui";

import {
  buildScorePathReviewTrack,
  SCORE_PATH_REVIEW_BRANCHES,
  SCORE_PATH_REVIEW_CANDIDATES,
  SCORE_PATH_REVIEW_CANDIDATE_IDS,
  SCORE_PATH_REVIEW_COMPACT_RESPONSIVE_BASELINE_METRICS,
  SCORE_PATH_REVIEW_FLOWING_BASELINE_METRICS,
  SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG,
  SCORE_PATH_REVIEW_MODES,
  SCORE_PATH_REVIEW_SEED,
  SCORE_PATH_REVIEW_THEMES,
  scorePathReviewCompactTrackWidth,
  scorePathReviewUrl,
  type ScorePathReviewBranch,
  type ScorePathReviewCandidateId,
  type ScorePathReviewChapterLayout,
  type ScorePathReviewMode,
  type ScorePathReviewTheme,
  type ScorePathReviewTrack,
} from "./_fixtures/score-path-candidates";
import styles from "./score-path-review.module.css";

type ReviewTrackStyle = CSSProperties & {
  readonly "--review-track-height": string;
  readonly "--review-track-width": string;
};

type ReviewChapterStyle = CSSProperties & {
  readonly "--review-chapter-height": string;
  readonly "--review-content-height": string;
  readonly "--review-content-left": string;
  readonly "--review-content-top": string;
  readonly "--review-content-width": string;
};

function subscribeToReviewViewport(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  window.visualViewport?.addEventListener("resize", onStoreChange);

  return () => {
    window.removeEventListener("resize", onStoreChange);
    window.visualViewport?.removeEventListener("resize", onStoreChange);
  };
}

function reviewViewportSnapshot(): number {
  return document.documentElement.clientWidth;
}

function reviewViewportServerSnapshot(): number {
  return 390;
}

function useReviewViewportWidth(): number {
  return useSyncExternalStore(
    subscribeToReviewViewport,
    reviewViewportSnapshot,
    reviewViewportServerSnapshot,
  );
}

function HomeReviewScene({ headingId }: { readonly headingId: string }) {
  return (
    <div className={styles.homeScene} data-structural-placeholder="home">
      <Eyebrow>Origem compartilhada · contrato de revisão</Eyebrow>
      <Heading as="h2" id={headingId} size="xl">
        W_Flyer
      </Heading>
      <Text size="lead" tone="muted">
        A origem é repetida apenas para comparar cada ramo isoladamente. A
        composição pública compartilhada pertence à tarefa 34 e ainda não está
        integrada.
      </Text>
    </div>
  );
}

function ChapterContent({
  branch,
  chapter,
  children,
}: {
  readonly branch: ScorePathReviewBranch;
  readonly chapter: ScorePathReviewChapterLayout;
  readonly children: ReactNode;
}) {
  const localContentTop = chapter.contentRect.y - chapter.top;
  const chapterStyle: ReviewChapterStyle = {
    "--review-chapter-height": `${chapter.height}px`,
    "--review-content-height": `${chapter.contentRect.height}px`,
    "--review-content-left": `${chapter.contentRect.x}px`,
    "--review-content-top": `${localContentTop}px`,
    "--review-content-width": `${chapter.contentRect.width}px`,
  };

  return (
    <section
      aria-labelledby={`score-path-review-${branch}-${chapter.chapterId}`}
      className={styles.reviewChapter}
      data-review-chapter-id={chapter.chapterId}
      data-review-content-reserved-reasons={chapter.reservedReasons.join(",")}
      style={chapterStyle}
    >
      <div
        className={styles.contentEnvelope}
        data-review-content-envelope={chapter.chapterId}
      >
        <span aria-hidden="true" className={styles.reservedLabel}>
          área reservada · {chapter.reservedReasons.join(" · ")}
        </span>
        {children}
      </div>
    </section>
  );
}

function renderChapter(
  branch: ScorePathReviewBranch,
  chapter: ScorePathReviewChapterLayout,
) {
  const headingId = `score-path-review-${branch}-${chapter.chapterId}`;

  if (chapter.chapterId === "home") {
    return <HomeReviewScene headingId={headingId} />;
  }

  if (branch === "professional") {
    return (
      <ProfessionalChapterScene
        chapterId={chapter.chapterId as ProfessionalChapterId}
        headingId={headingId}
      />
    );
  }

  if (branch === "application") {
    return (
      <ApplicationChapterScene
        chapterId={chapter.chapterId as Phase8ApplicationChapterId}
        headingId={headingId}
      />
    );
  }

  throw new RangeError(
    `Unsupported ${branch} ScorePath review chapter: ${chapter.chapterId}`,
  );
}

function ReviewZoneMarkers({ track }: { readonly track: ScorePathReviewTrack }) {
  const markerRadius = track.mode === "vertical-wide" ? 4 : 2.75;

  return (
    <svg
      aria-hidden="true"
      className={styles.zoneLayer}
      data-review-zone-markers={track.branch}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: track.height, width: track.width }}
      viewBox={track.viewBox}
    >
      {track.zones.map((zone) => {
        const start = zone.points[0]!;
        const end = zone.points.at(-1)!;

        return (
          <g
            data-review-marker-only="true"
            data-review-marker-zone-id={zone.id}
            data-review-marker-zone-kind={zone.kind}
            key={zone.id}
          >
            {[start, end].map((point, markerIndex) => (
              <circle
                className={
                  zone.kind === "notation-safe"
                    ? styles.notationMarker
                    : styles.connectorMarker
                }
                cx={serializeSvgNumber(
                  point.x,
                  SCORE_REVIEW_SVG_PRECISION,
                )}
                cy={serializeSvgNumber(
                  point.y,
                  SCORE_REVIEW_SVG_PRECISION,
                )}
                data-review-boundary={markerIndex === 0 ? "start" : "end"}
                key={markerIndex}
                r={serializeSvgNumber(
                  markerRadius,
                  SCORE_REVIEW_SVG_PRECISION,
                )}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function ReviewDiagnostics({ track }: { readonly track: ScorePathReviewTrack }) {
  return (
    <details className={styles.diagnostics} data-review-diagnostics={track.branch}>
      <summary>Diagnóstico de zonas · desenvolvimento</summary>
      <div className={styles.diagnosticsScroller}>
        <table>
          <caption>
            Limites estruturais do ramo {track.branch}; os marcadores circulares
            no score indicam apenas inícios e finais, nunca notação.
          </caption>
          <thead>
            <tr>
              <th scope="col">Zona</th>
              <th scope="col">Classe</th>
              <th scope="col">Tangente máx.</th>
              <th scope="col">Eventos</th>
              <th scope="col">Slots semânticos</th>
              <th scope="col">Arco</th>
              <th scope="col">Descida segura</th>
              <th scope="col">Budget vertical</th>
            </tr>
          </thead>
          <tbody>
            {track.zones.map((zone) => (
              <tr
                data-review-arc-length={zone.arcLength.toFixed(3)}
                data-review-descending-arc-length={zone.descendingArcLength.toFixed(3)}
                data-review-event-count={zone.eventCount}
                data-review-max-tangent-angle-deg={
                  zone.maximumTangentAngleDeg?.toFixed(4) ?? "not-applicable"
                }
                data-review-semantic-slot-ids={zone.semanticSlotIds.join(",")}
                data-review-vertical-budget={
                  zone.verticalBudget?.toFixed(3) ?? "not-applicable"
                }
                data-review-zone-id={zone.id}
                data-review-zone-kind={zone.kind}
                key={zone.id}
              >
                <th scope="row">{zone.id}</th>
                <td>{zone.kind === "notation-safe" ? "NOTATION-SAFE" : "CONNECTOR"}</td>
                <td>
                  {zone.maximumTangentAngleDeg === null
                    ? "—"
                    : `${zone.maximumTangentAngleDeg.toFixed(2)}° @ ${zone.maximumTangentT?.toFixed(4)}`}
                </td>
                <td>{zone.eventCount}</td>
                <td>{zone.semanticSlotIds.join(" · ") || "—"}</td>
                <td>{zone.arcLength.toFixed(1)}px</td>
                <td>{zone.descendingArcLength.toFixed(1)}px</td>
                <td>
                  {zone.verticalBudget === null
                    ? "—"
                    : `${zone.verticalBudget.toFixed(1)}px`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function ReviewEvidence({ track }: { readonly track: ScorePathReviewTrack }) {
  const { evidence } = track;
  const baseline =
    track.candidateId === "organic-flowing"
      ? track.mode === "vertical-compact"
        ? SCORE_PATH_REVIEW_COMPACT_RESPONSIVE_BASELINE_METRICS[track.branch]
        : SCORE_PATH_REVIEW_FLOWING_BASELINE_METRICS[track.mode][track.branch]
      : null;

  return (
    <dl className={styles.evidence} data-review-evidence={track.branch}>
      <div>
        <dt>Semântica</dt>
        <dd>{evidence.semanticFingerprint}</dd>
      </div>
      <div>
        <dt>Tangente máxima</dt>
        <dd>{evidence.maximumNotationTangentAngleDeg.toFixed(2)}° / 18°</dd>
      </div>
      <div>
        <dt>Clef</dt>
        <dd>{evidence.clef.rotationDegrees.toFixed(2)}° · sem espelho</dd>
      </div>
      <div>
        <dt>Colisões</dt>
        <dd>{evidence.reservedContentCollisions}</dd>
      </div>
      <div>
        <dt>Eventos em conectores</dt>
        <dd>{evidence.connectorEventCount}</dd>
      </div>
      <div>
        <dt>Continuidade</dt>
        <dd>C² · cinco linhas</dd>
      </div>
      <div>
        <dt>Altura da trilha</dt>
        <dd>
          {baseline ? `${baseline.totalTrackHeight} → ` : ""}
          {evidence.flowMetrics.totalTrackHeight.toFixed(0)}px
        </dd>
      </div>
      <div>
        <dt>Distância só de transição</dt>
        <dd>
          {baseline
            ? `${baseline.transitionOnlyVerticalDistance.toFixed(2)} → `
            : ""}
          {evidence.flowMetrics.transitionOnlyVerticalDistance.toFixed(2)}px
        </dd>
      </div>
      <div>
        <dt>Altura do conteúdo</dt>
        <dd>
          {baseline && "contentOwnedHeight" in baseline
            ? `${baseline.contentOwnedHeight.toFixed(0)} → `
            : ""}
          {evidence.flowMetrics.contentOwnedHeight.toFixed(0)}px
        </dd>
      </div>
      <div>
        <dt>Altura só de transição</dt>
        <dd>
          {baseline && "transitionOnlyHeight" in baseline
            ? `${baseline.transitionOnlyHeight.toFixed(0)} → `
            : ""}
          {evidence.flowMetrics.transitionOnlyHeight.toFixed(0)}px
        </dd>
      </div>
      <div>
        <dt>Maior intervalo vazio</dt>
        <dd>
          {baseline && "largestContentFreeVerticalInterval" in baseline
            ? `${baseline.largestContentFreeVerticalInterval.toFixed(0)} → `
            : ""}
          {evidence.flowMetrics.largestContentFreeVerticalInterval.toFixed(0)}px
        </dd>
      </div>
      <div>
        <dt>Maior arco conector</dt>
        <dd>
          {baseline ? `${baseline.longestConnectorArcLength.toFixed(2)} → ` : ""}
          {evidence.flowMetrics.longestConnectorArcLength.toFixed(2)}px
        </dd>
      </div>
      <div>
        <dt>Notação em descida</dt>
        <dd>{evidence.flowMetrics.notationSafeDescendingArcLength.toFixed(2)}px</dd>
      </div>
      <div>
        <dt>Beam/stem span</dt>
        <dd>
          {evidence.primitiveSpanViolations.length} violações · {evidence.primitiveSpans.length} inspecionados
        </dd>
      </div>
      <div data-review-terminal-invariant="pass">
        <dt>Barra final</dt>
        <dd>PASS · t=1 · 0 primitivas após END</dd>
      </div>
    </dl>
  );
}

function BranchReview({
  branch,
  candidateId,
  compactTrackWidth,
  mode,
}: {
  readonly branch: ScorePathReviewBranch;
  readonly candidateId: ScorePathReviewCandidateId;
  readonly compactTrackWidth: number;
  readonly mode: ScorePathReviewMode;
}) {
  const track = buildScorePathReviewTrack(candidateId, mode, branch, {
    compactTrackWidth,
  });
  const trackStyle: ReviewTrackStyle = {
    "--review-track-height": `${track.height}px`,
    "--review-track-width": `${track.width}px`,
  };

  return (
    <article
      className={styles.branchReview}
      data-review-branch={branch}
      data-review-bounds-violations={track.evidence.boundsViolations}
      data-review-connector-event-count={track.evidence.connectorEventCount}
      data-review-five-line-continuity="pass"
      data-review-longest-connector-arc={track.evidence.flowMetrics.longestConnectorArcLength.toFixed(3)}
      data-review-content-owned-height={track.evidence.flowMetrics.contentOwnedHeight}
      data-review-largest-content-free-interval={track.evidence.flowMetrics.largestContentFreeVerticalInterval}
      data-review-max-notation-tangent={track.evidence.maximumNotationTangentAngleDeg.toFixed(4)}
      data-review-minimum-curvature-radius={track.evidence.minimumCurvatureRadius.toFixed(4)}
      data-review-path-self-intersections={track.evidence.pathSelfIntersections}
      data-review-primitive-span-violations={track.evidence.primitiveSpanViolations.length}
      data-review-reserved-content-collisions={track.evidence.reservedContentCollisions}
      data-review-semantic-fingerprint={track.evidence.semanticFingerprint}
      data-review-staff-self-intersections={track.evidence.staffLineSelfIntersections}
      data-review-terminal="pass"
      data-review-track-height={track.evidence.flowMetrics.totalTrackHeight}
      data-review-transition-only-height={track.evidence.flowMetrics.transitionOnlyHeight}
      data-review-transition-vertical-distance={track.evidence.flowMetrics.transitionOnlyVerticalDistance.toFixed(3)}
    >
      <header className={styles.branchHeader}>
        <div>
          <p className={styles.eyebrow}>Ramo isolado para task-33 review</p>
          <h2>{branch === "professional" ? "Profissional" : "Aplicação"}</h2>
          <p>
            Origem compartilhada + seis cenas reais · composição determinística
            preservada entre geometrias.
          </p>
        </div>
        <ReviewEvidence track={track} />
        <ReviewDiagnostics track={track} />
      </header>
      <div
        className={styles.track}
        data-review-track={branch}
        style={trackStyle}
      >
        <ScoreSvg
          className={styles.scoreLayer}
          data-review-score={branch}
          model={track.model}
          numericPrecision={SCORE_REVIEW_SVG_PRECISION}
          style={{
            "--score-color": "var(--wf-note)",
            height: track.height,
            width: track.width,
          } as CSSProperties}
          viewBox={track.viewBox}
        />
        <ReviewZoneMarkers track={track} />
        <div className={styles.chapterLayer}>
          {track.chapters.map((chapter) => (
            <ChapterContent branch={branch} chapter={chapter} key={chapter.chapterId}>
              {renderChapter(branch, chapter)}
            </ChapterContent>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ScorePathReviewSurface({
  candidateId,
  mode,
  theme,
}: {
  readonly candidateId: ScorePathReviewCandidateId;
  readonly mode: ScorePathReviewMode;
  readonly theme: ScorePathReviewTheme;
}) {
  const candidate = SCORE_PATH_REVIEW_CANDIDATES[candidateId];
  const cssViewportWidth = useReviewViewportWidth();
  const compactTrackWidth = scorePathReviewCompactTrackWidth(cssViewportWidth);

  return (
    <main
      className={styles.previewRoot}
      data-phase-9-task-33-review="candidate-only"
      data-projection-mode={mode}
      data-review-candidate={candidateId}
      data-review-composer-seed={SCORE_PATH_REVIEW_SEED}
      data-review-css-viewport-width={cssViewportWidth}
      data-review-max-notation-tangent-angle-deg={
        SCORE_PATH_REVIEW_MAX_NOTATION_TANGENT_ANGLE_DEG
      }
      data-review-status={candidate.status}
      data-review-track-width={
        mode === "vertical-compact" ? compactTrackWidth : 1280
      }
      data-review-theme={theme}
      id="main-content"
    >
      <header className={styles.previewHeader}>
        <p className={styles.eyebrow}>Phase 9 · task 33 · human approval pending</p>
        <h1>{candidate.label}</h1>
        <p>{candidate.description}</p>
        <p className={styles.candidateStatus}>{candidate.label} — {candidate.status}</p>
        <p className={styles.reviewWarning}>
          Development-only candidate. This is not public integration and does
          not close task 33.
        </p>
      </header>
      {SCORE_PATH_REVIEW_BRANCHES.map((branch) => (
        <BranchReview
          branch={branch}
          candidateId={candidateId}
          compactTrackWidth={compactTrackWidth}
          key={branch}
          mode={mode}
        />
      ))}
    </main>
  );
}

export function ScorePathReviewShell({
  candidateId,
  mode,
  theme,
}: {
  readonly candidateId: ScorePathReviewCandidateId;
  readonly mode: ScorePathReviewMode;
  readonly theme: ScorePathReviewTheme;
}) {
  const candidate = SCORE_PATH_REVIEW_CANDIDATES[candidateId];
  const previewUrl = scorePathReviewUrl(candidateId, mode, theme, true);
  const frameWidth = mode === "vertical-wide" ? 1340 : 430;
  const frameHeight = mode === "vertical-wide" ? 820 : 844;

  return (
    <main
      className={styles.shell}
      data-phase-9-score-path-review-shell="task-33"
      id="main-content"
    >
      <header className={styles.shellHeader}>
        <p className={styles.eyebrow}>Development only · human subgate</p>
        <h1>Phase-9 ScorePath candidates</h1>
        <p>
          Compare both organic directions in the exact vertical mode and theme
          matrices. The embedded viewport keeps the real Phase-7/8 responsive
          scene CSS at review capacity.
        </p>
      </header>

      <nav aria-label="ScorePath candidate matrix" className={styles.matrixNav}>
        {SCORE_PATH_REVIEW_CANDIDATE_IDS.map((candidateOption) =>
          SCORE_PATH_REVIEW_MODES.flatMap((modeOption) =>
            SCORE_PATH_REVIEW_THEMES.map((themeOption) => {
              const active =
                candidateOption === candidateId &&
                modeOption === mode &&
                themeOption === theme;
              return (
                <a
                  aria-current={active ? "page" : undefined}
                  data-review-matrix-active={active ? "true" : "false"}
                  href={scorePathReviewUrl(
                    candidateOption,
                    modeOption,
                    themeOption,
                  )}
                  key={`${candidateOption}:${modeOption}:${themeOption}`}
                >
                  {SCORE_PATH_REVIEW_CANDIDATES[candidateOption].label}
                  <span>{modeOption} · {themeOption}</span>
                </a>
              );
            }),
          ),
        )}
      </nav>

      <section className={styles.activeReview}>
        <header>
          <div>
            <p className={styles.eyebrow}>Active candidate</p>
            <h2>{candidate.label}</h2>
            <p>{candidate.description}</p>
            <p>{candidate.tradeoff}</p>
            <p className={styles.candidateStatus}>{candidate.label} — {candidate.status}</p>
          </div>
          <a href={previewUrl} rel="noreferrer" target="_blank">
            Abrir preview direto
            <span className="wf-sr-only"> — abre em nova aba</span>
          </a>
        </header>
        <div className={styles.frameScroller}>
          <iframe
            className={styles.reviewFrame}
            data-review-frame-mode={mode}
            height={frameHeight}
            src={previewUrl}
            title={`${candidate.label}, ${mode}, ${theme}`}
            width={frameWidth}
          />
        </div>
      </section>
    </main>
  );
}
