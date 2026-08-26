import { ScoreSvg } from "@/components/score/ScoreSvg";

import {
  buildCurvedScoreFixtures,
  buildMotifPathMatrixFixtures,
  buildTripletDetailFixtures,
} from "../_fixtures/lab-score-models";
import styles from "../music-lab.module.css";

const PATH_FIXTURES = buildCurvedScoreFixtures();
const MOTIF_PATH_MATRIX = buildMotifPathMatrixFixtures();
const TRIPLET_DETAIL_FIXTURES = buildTripletDetailFixtures();

export default function MusicCurvedScoreFixturesPage() {
  return (
    <section aria-labelledby="curved-score-heading" data-fixture-page="curved-score">
      <h2 id="curved-score-heading">Straight and cubic ScorePath equivalence</h2>
      <p>
        The same E4/B4/F5 whole-note semantics are mapped onto a straight guide,
        gentle arc, and gentle S-curve. In every case the master guide remains
        B4/staffStep 4 and all five visible staff lines are coherent normal offsets.
      </p>
      <div className={styles.fixtureGrid}>
        {PATH_FIXTURES.map((fixture) => (
          <figure
            className={styles.fixture}
            data-glyph-calibration-status="runtime-approved"
            data-optical-token-status="approved"
            data-path-shape={fixture.id}
            key={fixture.id}
          >
            <ScoreSvg
              ariaLabel={`${fixture.label} music geometry fixture`}
              debug
              model={fixture.model}
              viewBox={fixture.viewBox}
            />
            <figcaption className={styles.fixtureLabel}>
              {fixture.label} · E4=0 · B4=4/master · F5=8
            </figcaption>
          </figure>
        ))}
      </div>

      <section
        aria-labelledby="motif-path-matrix-heading"
        className={styles.fixtureSection}
      >
        <h3 id="motif-path-matrix-heading">
          Automatic motif × ScorePath matrix
        </h3>
        <p>
          All 13 automatic motif IDs are rendered on every supported path
          shape. Glyph calibration is runtime-approved; beam, hook, triplet,
          and other optical engraving tokens use the external-human-approved
          Gate-C values.
        </p>
        <div className={styles.fixtureGrid}>
          {MOTIF_PATH_MATRIX.map((fixture) => (
            <figure
              className={styles.fixture}
              data-glyph-calibration-status="runtime-approved"
              data-matrix-motif-id={fixture.motifId}
              data-matrix-path-shape={fixture.pathShape}
              data-motif-path-case={`${fixture.pathShape}:${fixture.motifId}`}
              data-optical-token-status="approved"
              key={`${fixture.pathShape}:${fixture.motifId}`}
            >
              <ScoreSvg
                ariaLabel={`${fixture.label} Gate C fixture`}
                model={fixture.model}
                viewBox={fixture.viewBox}
              />
              <figcaption className={styles.fixtureLabel}>
                {fixture.label} · approved glyph calibration · approved
                optical tokens
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="triplet-detail-review-heading"
        className={styles.fixtureSection}
        data-triplet-detail-review="gate-c-final-approved-v1"
        data-triplet-numeral-status="approved-external-human-review"
      >
        <h3 id="triplet-detail-review-heading">
          Split-bracket triplet detail review
        </h3>
        <p>
          The numeral remains exactly 3, centered on the complete beam-group
          span, external to the primary beam, and isolated by the exact
          rendered-width plus side-gap opening. The 0.85 sp numeral size and
          preserved 0.18 sp side gap are the approved Gate-C values; approved
          glyph geometry remains unchanged.
        </p>
        <div className={styles.tripletDetailGrid}>
          {TRIPLET_DETAIL_FIXTURES.map((fixture) => (
            <figure
              className={`${styles.fixture} ${styles.tripletDetailFixture}`}
              data-glyph-calibration-status="runtime-approved"
              data-optical-token-status="approved"
              data-triplet-path-shape={fixture.pathShape}
              data-triplet-stem-direction={fixture.stemDirection}
              key={`${fixture.pathShape}:${fixture.stemDirection}`}
            >
              <ScoreSvg
                ariaLabel={`${fixture.label} triplet detail fixture`}
                model={fixture.model}
                viewBox={fixture.viewBox}
              />
              <figcaption className={styles.fixtureLabel}>
                {fixture.label} · split bracket · numeral 3 · approved
                optical tokens
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </section>
  );
}
