import { ScoreSvg } from "@/components/score/ScoreSvg";

import { ComposerFixtureControls } from "../_fixtures/ComposerFixtureControls";
import {
  buildGateCFixedSeedMatrix,
  GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD,
  GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD,
  GATE_C_FIXED_SEED_CHAPTER_ID,
  GATE_C_SEMANTIC_PROJECTION_VERSION,
} from "../_fixtures/gate-c-review";
import {
  buildResponsiveProjectionReviewFixtures,
  renderLabSegment,
} from "../_fixtures/lab-score-models";
import styles from "../music-lab.module.css";

const FIXED_SEED_MATRIX = buildGateCFixedSeedMatrix().map((entry) => ({
  ...entry,
  fixture: renderLabSegment(entry.segment, "horizontal-enhanced"),
}));
const RESPONSIVE_PROJECTION_REVIEW =
  buildResponsiveProjectionReviewFixtures();

export default function MusicComposerFixturesPage() {
  return (
    <section aria-labelledby="composer-fixtures-heading" data-fixture-page="composer">
      <h2 id="composer-fixtures-heading">Deterministic composer profiles</h2>
      <p>
        CALM, BALANCED, ACTIVE, and TERMINAL use an explicit versioned seed and
        stable chapter/slot IDs. Theme and responsive projection controls do not
        alter motif IDs or pitches; they only change presentation context,
        physical slot ranges, and ScorePath mapping. Renderer and Composer
        calibration values are the approved Music System v0.1 contract.
      </p>
      <ComposerFixtureControls />

      <section
        aria-labelledby="responsive-projection-review-heading"
        className={styles.reviewSection}
        data-max-notation-tangent-angle-deg="18"
        data-responsive-calibration-status="semantics-approved-thresholds-noncanonical"
        data-responsive-projection-review="gate-c-delta-v1"
      >
        <h3 id="responsive-projection-review-heading">
          Responsive ScorePath projection review
        </h3>
        <p>
          One semantic segment is projected into horizontal-enhanced,
          vertical-wide, vertical-compact, and static geometry. Vertical modes
          use left-to-right notation zones joined by event-free returning
          connectors; viewport thresholds remain Motion Lab inputs and are not
          defined here. The 18-degree notation tangent limit is approved; the
          current connector geometry remains validation-only and noncanonical.
        </p>
        <div className={styles.responsiveProjectionGrid}>
          {RESPONSIVE_PROJECTION_REVIEW.map(
            ({ evidence, model, projection, segment, viewBox }) => (
              <figure
                className={`${styles.fixture} ${styles.responsiveProjectionFixture}`}
                data-clef-mirror-x={String(evidence.clef.mirrorX)}
                data-clef-mirror-y={String(evidence.clef.mirrorY)}
                data-clef-rotation-radians={evidence.clef.rotationRadians}
                data-clef-transform={`mirrorX=${evidence.clef.mirrorX};mirrorY=${evidence.clef.mirrorY};rotationRadians=${evidence.clef.rotationRadians}`}
                data-final-barline-orientation={
                  evidence.finalBarlineOrientation
                }
                data-five-line-continuity="one-master-guide"
                data-key-signature-fifths={evidence.keySignature.fifths}
                data-key-signature-rendered-accidentals={
                  evidence.keySignature.renderedAccidentalGlyphs
                }
                data-empty-slot-ids={segment.emptySlots
                  .map(({ slotId }) => slotId)
                  .join(",")}
                data-motif-ids={segment.motifs
                  .map(({ motifId }) => motifId)
                  .join(",")}
                data-musical-event-count={evidence.musicalEventCount}
                data-note-durations={segment.motifs
                  .flatMap(({ durations }) => durations)
                  .join(",")}
                data-ordinary-barline-count={evidence.ordinaryBarlineCount}
                data-responsive-mode={projection.mode}
                data-semantic-slot-ids={evidence.semanticSlotIds.join(",")}
                data-staff-steps={segment.motifs
                  .flatMap(({ staffSteps }) => staffSteps)
                  .join(",")}
                data-contour-ids={segment.motifs
                  .map(({ contourId }) => contourId)
                  .join(",")}
                data-contour-translations={segment.motifs
                  .map(({ contourTranslation }) => contourTranslation)
                  .join(",")}
                key={projection.mode}
              >
                <ScoreSvg
                  ariaLabel={`${projection.mode} responsive score projection fixture`}
                  model={model}
                  viewBox={viewBox}
                />
                <figcaption className={styles.fixtureLabel}>
                  {projection.mode} · same segment {segment.chapterId} · same
                  slots/motifs/pitches · geometry-only remap
                </figcaption>
                <ol
                  aria-label={`${projection.mode} projection zones`}
                  className={styles.responsiveZoneList}
                  data-responsive-zone-list={projection.mode}
                >
                  {evidence.zones.map((zone) => (
                    <li
                      data-event-count={zone.eventCount}
                      data-tangent-angle-deg={
                        zone.displayTangentAngleDeg
                      }
                      data-tangent-measurement={zone.tangentMeasurement}
                      data-notation-angle-limit-applies={String(
                        zone.notationAngleLimitApplies,
                      )}
                      data-minimum-curvature-radius-sp={
                        zone.minimumCurvatureRadiusSp ??
                        "not-applicable"
                      }
                      data-semantic-slot-ids={zone.semanticSlotIds.join(",")}
                      data-zone-id={zone.id}
                      data-zone-kind={zone.kind}
                      key={zone.id}
                    >
                      <strong>{zone.kind}</strong> · {zone.id} · slots{" "}
                      {zone.semanticSlotIds.length > 0
                        ? zone.semanticSlotIds.join(", ")
                        : "none"}{" "}
                      · events {zone.eventCount} · tangent{" "}
                      {zone.displayTangentAngleDeg.toFixed(2)}°{" "}
                      {zone.notationAngleLimitApplies
                        ? "(18° approved limit applies)"
                        : "(event-free connector; notation limit does not apply)"}
                    </li>
                  ))}
                </ol>
              </figure>
            ),
          )}
        </div>
      </section>

      <section
        aria-labelledby="fixed-seed-matrix-heading"
        className={styles.reviewSection}
        data-fixed-seed-matrix="gate-c-v1"
        data-semantic-projection-version={GATE_C_SEMANTIC_PROJECTION_VERSION}
      >
        <h3 id="fixed-seed-matrix-heading">
          Gate-C fixed-seed review matrix
        </h3>
        <p>
          Three named seeds are composed under every profile against chapter{" "}
          <code>{GATE_C_FIXED_SEED_CHAPTER_ID}</code>. Each card exposes the
          canonical semantic JSON and its versioned FNV-1a 32-bit hash. The
          hash covers semantics, not SVG pixels or responsive geometry.
        </p>
        <div className={styles.fixtureGrid}>
          {FIXED_SEED_MATRIX.map(
            ({
              canonicalJson,
              fixture,
              profile,
              seedId,
              seedLabel,
              semanticHash,
              sessionSeed,
            }) => (
              <figure
                className={styles.fixture}
                data-composer-profile={profile}
                data-composer-tuning-status="approved"
                data-fixed-seed-id={seedId}
                data-glyph-calibration-status="runtime-approved"
                data-optical-token-status="approved"
                data-semantic-hash={semanticHash}
                key={`${seedId}:${profile}`}
              >
                <ScoreSvg
                  model={fixture.model}
                  viewBox={fixture.viewBox}
                />
                <figcaption className={styles.fixtureLabel}>
                  {seedLabel} · {profile} · seed <code>{sessionSeed}</code>
                </figcaption>
                <p className={styles.hashValue}>
                  Semantic hash: <code>{semanticHash}</code>
                </p>
                <pre
                  className={styles.semanticJson}
                  data-canonical-composer-semantics={`${seedId}:${profile}`}
                >
                  <code>{canonicalJson}</code>
                </pre>
              </figure>
            ),
          )}
        </div>
      </section>

      <section
        aria-labelledby="renderer-token-review-heading"
        className={styles.reviewSection}
        data-optical-token-status={
          GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD.status
        }
      >
        <h3 id="renderer-token-review-heading">
          Approved renderer-token configuration
        </h3>
        <p className={styles.status}>
          Status: {GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD.status}. These are the
          exact Gate-C-approved optical values; the embedded flag transform is
          the unchanged Gate-B-approved input.
        </p>
        <pre className={styles.semanticJson} data-approved-renderer-tokens="v1">
          <code>
            {JSON.stringify(GATE_C_APPROVED_RENDERER_TOKEN_PAYLOAD, null, 2)}
          </code>
        </pre>
      </section>

      <section
        aria-labelledby="composer-weight-review-heading"
        className={styles.reviewSection}
        data-composer-tuning-status={
          GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD.status
        }
      >
        <h3 id="composer-weight-review-heading">
          Approved Composer weights
        </h3>
        <p className={styles.status}>
          Status: {GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD.status}. The motif,
          contour, anchor, density, and anti-repetition weights are the exact
          Gate-C-approved v0.1 calibration.
        </p>
        <pre
          className={styles.semanticJson}
          data-approved-composer-calibration="v1"
        >
          <code>
            {JSON.stringify(
              GATE_C_APPROVED_COMPOSER_CALIBRATION_PAYLOAD,
              null,
              2,
            )}
          </code>
        </pre>
      </section>
    </section>
  );
}
