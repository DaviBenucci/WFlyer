import type { CSSProperties } from "react";

import { ScoreSvg } from "@/components/score/ScoreSvg";
import {
  SCORE_REVIEW_SVG_PRECISION,
  serializeSvgNumber,
  serializeSvgPoints,
} from "@/components/score/svg-number";

import {
  buildScorePathOriginReviewFixture,
  SCORE_PATH_ORIGIN_REVIEW_ASSET,
  SCORE_PATH_ORIGIN_REVIEW_BRANCHES,
  SCORE_PATH_ORIGIN_REVIEW_LABEL,
  SCORE_PATH_ORIGIN_REVIEW_MODES,
  SCORE_PATH_ORIGIN_REVIEW_THEMES,
  scorePathOriginReviewUrl,
  type ScorePathOriginReviewBranch,
  type ScorePathOriginReviewMode,
  type ScorePathOriginReviewTheme,
} from "./_fixtures/score-path-origin";
import styles from "./score-path-origin-review.module.css";

function branchLabel(branch: ScorePathOriginReviewBranch): string {
  return branch === "application" ? "Application · left" : "Professional · right";
}

function pointsAttribute(points: readonly { readonly x: number; readonly y: number }[]) {
  return serializeSvgPoints(points, SCORE_REVIEW_SVG_PRECISION);
}

export function ScorePathOriginReview({
  mode,
  theme,
}: {
  readonly mode: ScorePathOriginReviewMode;
  readonly theme: ScorePathOriginReviewTheme;
}) {
  const fixture = buildScorePathOriginReviewFixture(mode);
  const stageStyle = {
    "--origin-review-aspect": `${fixture.geometry.viewBox.width} / ${fixture.geometry.viewBox.height}`,
    "--origin-review-max-width":
      mode === "vertical-compact" ? "430px" : "1440px",
  } as CSSProperties;

  return (
    <main
      className={styles.root}
      data-origin-review-mode={mode}
      data-origin-review-status={fixture.status}
      data-origin-review-theme={theme}
      data-phase-9-task-33-origin-review="development-only"
      id="main-content"
    >
      <header className={styles.header}>
        <p className={styles.eyebrow}>Phase 9 · task 33 · isolated origin review</p>
        <h1>Approved clef → canonical initial staff → first departure</h1>
        <p className={styles.status}>{SCORE_PATH_ORIGIN_REVIEW_LABEL}</p>
        <p>
          The approved downstream Organic Flowing alternating-S grammar is not
          modified here. This renderer-only fixture isolates the proposed
          shared origin for human optical review before Task 34.
        </p>
      </header>

      <nav aria-label="Origin review variants" className={styles.variantNav}>
        {SCORE_PATH_ORIGIN_REVIEW_MODES.flatMap((modeOption) =>
          SCORE_PATH_ORIGIN_REVIEW_THEMES.map((themeOption) => {
            const active = modeOption === mode && themeOption === theme;

            return (
              <a
                aria-current={active ? "page" : undefined}
                href={scorePathOriginReviewUrl(modeOption, themeOption)}
                key={`${modeOption}:${themeOption}`}
              >
                {modeOption}
                <span>{themeOption}</span>
              </a>
            );
          }),
        )}
      </nav>

      <section
        aria-labelledby="origin-stage-title"
        className={styles.stageSection}
        style={stageStyle}
      >
        <div className={styles.stageHeading}>
          <div>
            <p className={styles.eyebrow}>Real renderer · actual approved asset</p>
            <h2 id="origin-stage-title">{mode}</h2>
          </div>
          <dl className={styles.stageMetrics}>
            <div>
              <dt>staffSpace</dt>
              <dd>{fixture.geometry.staffSpace}px</dd>
            </div>
            <div>
              <dt>common-origin gap</dt>
              <dd>{fixture.evidence.commonOriginGap.toFixed(3)}px</dd>
            </div>
            <div>
              <dt>frame clearance</dt>
              <dd>{fixture.evidence.minimumFrameContentClearance.toFixed(3)}px</dd>
            </div>
          </dl>
        </div>

        <div
          className={styles.stage}
          data-origin-common-gap={fixture.evidence.commonOriginGap}
          data-origin-frame-clearance={
            fixture.evidence.minimumFrameContentClearance
          }
          data-origin-review-stage="real-clef-and-first-departure"
        >
          {SCORE_PATH_ORIGIN_REVIEW_BRANCHES.map((branch) => (
            <ScoreSvg
              ariaLabel={`${branchLabel(branch)} initial five-line staff`}
              className={styles.originScore}
              data-origin-score-branch={branch}
              key={branch}
              model={fixture.branches[branch].model}
              numericPrecision={SCORE_REVIEW_SVG_PRECISION}
              style={
                {
                  "--score-color": "var(--origin-score)",
                  height: "100%",
                  width: "100%",
                } as CSSProperties
              }
              viewBox={fixture.viewBox}
            />
          ))}

          <svg
            aria-hidden="true"
            className={styles.zoneOverlay}
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            viewBox={fixture.viewBox}
          >
            <rect
              className={styles.frameBoundary}
              data-origin-content-clearance-frame="true"
              height={serializeSvgNumber(
                fixture.geometry.viewBox.height,
                SCORE_REVIEW_SVG_PRECISION,
              )}
              width={serializeSvgNumber(
                fixture.geometry.viewBox.width,
                SCORE_REVIEW_SVG_PRECISION,
              )}
              x={serializeSvgNumber(
                fixture.geometry.viewBox.x,
                SCORE_REVIEW_SVG_PRECISION,
              )}
              y={serializeSvgNumber(
                fixture.geometry.viewBox.y,
                SCORE_REVIEW_SVG_PRECISION,
              )}
            />
            {SCORE_PATH_ORIGIN_REVIEW_BRANCHES.flatMap((branch) =>
              fixture.branches[branch].zones.map((zone) => (
                <polyline
                  className={`${styles.zone} ${
                    zone.kind === "notation-safe"
                      ? styles.notationZone
                      : styles.connectorZone
                  }`}
                  data-origin-review-branch={branch}
                  data-origin-zone-kind={zone.kind}
                  key={`${branch}:${zone.kind}`}
                  points={pointsAttribute(zone.points)}
                />
              )),
            )}
            <circle
              className={styles.originMarker}
              cx={serializeSvgNumber(
                fixture.geometry.origin.x,
                SCORE_REVIEW_SVG_PRECISION,
              )}
              cy={serializeSvgNumber(
                fixture.geometry.origin.y,
                SCORE_REVIEW_SVG_PRECISION,
              )}
              data-origin-shared-anchor="true"
              r={serializeSvgNumber(
                fixture.geometry.staffSpace * 0.36,
                SCORE_REVIEW_SVG_PRECISION,
              )}
            />
          </svg>
        </div>

        <div className={styles.legend}>
          <span><i className={styles.notationKey} />first notation-safe zone</span>
          <span><i className={styles.connectorKey} />first connector transition</span>
          <span><i className={styles.originKey} />shared origin</span>
        </div>
      </section>

      <section aria-labelledby="origin-diagnostics-title" className={styles.diagnostics}>
        <div className={styles.diagnosticIntro}>
          <div>
            <p className={styles.eyebrow}>Review diagnostics</p>
            <h2 id="origin-diagnostics-title">Geometry and provenance</h2>
          </div>
          <p>
            Dashed overlays are review markers only. They are not production
            score primitives and introduce no musical events.
          </p>
        </div>

        <dl className={styles.provenance}>
          <div>
            <dt>Approved asset</dt>
            <dd>{SCORE_PATH_ORIGIN_REVIEW_ASSET.assetId} · {SCORE_PATH_ORIGIN_REVIEW_ASSET.assetKey}</dd>
          </div>
          <div>
            <dt>Runtime source</dt>
            <dd><code>{SCORE_PATH_ORIGIN_REVIEW_ASSET.runtimePath}</code></dd>
          </div>
          <div>
            <dt>SHA-256</dt>
            <dd><code>{SCORE_PATH_ORIGIN_REVIEW_ASSET.sha256}</code></dd>
          </div>
          <div>
            <dt>Clef transform</dt>
            <dd>
              0° · mirrorX=false · mirrorY=false · {fixture.evidence.clef.width.toFixed(3)}×{fixture.evidence.clef.height.toFixed(3)}px
            </dd>
          </div>
          <div>
            <dt>Clef g-line anchor</dt>
            <dd>
              ({fixture.evidence.clef.anchorInGlyph.x.toFixed(2)}, {fixture.evidence.clef.anchorInGlyph.y.toFixed(2)})
            </dd>
          </div>
          <div>
            <dt>Five-line consistency</dt>
            <dd>
              PASS · max staff-space delta {fixture.evidence.maximumStaffSpaceDelta.toExponential(2)}
            </dd>
          </div>
        </dl>

        <div
          aria-label="Initial departure diagnostics table"
          className={styles.tableScroller}
          role="region"
          tabIndex={0}
        >
          <table>
            <caption>Initial departure by branch</caption>
            <thead>
              <tr>
                <th scope="col">Branch</th>
                <th scope="col">Local tangent</th>
                <th scope="col">Notation-safe</th>
                <th scope="col">First connector</th>
                <th scope="col">Events</th>
              </tr>
            </thead>
            <tbody>
              {SCORE_PATH_ORIGIN_REVIEW_BRANCHES.map((branch) => {
                const review = fixture.branches[branch];
                const [notation, connector] = review.zones;

                return (
                  <tr data-origin-diagnostic-branch={branch} key={branch}>
                    <th scope="row">{branchLabel(branch)}</th>
                    <td>
                      ({review.initialTangent.x.toFixed(3)}, {review.initialTangent.y.toFixed(3)})
                    </td>
                    <td>
                      t {notation.startT.toFixed(3)}–{notation.endT.toFixed(3)} · max {notation.maximumReadableTangentAngleDeg.toFixed(2)}°
                    </td>
                    <td>
                      t {connector.startT.toFixed(3)}–{connector.endT.toFixed(3)} · max {connector.maximumReadableTangentAngleDeg.toFixed(2)}°
                    </td>
                    <td>{connector.eventCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>{SCORE_PATH_ORIGIN_REVIEW_LABEL}</p>
        <p>Task 34 integration is intentionally absent.</p>
      </footer>
    </main>
  );
}
