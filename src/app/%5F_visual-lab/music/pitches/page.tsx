import { ScoreSvg } from "@/components/score/ScoreSvg";
import { getLedgerLineSteps } from "@/lib/music/geometry/ledger-lines";
import {
  pitchToStaffStep,
  staffStepToPitch,
  type NaturalPitch,
} from "@/lib/music/geometry/pitch";

import {
  buildLedgerFixture,
  buildPitchLadderFixture,
  buildStemAndFlagFixture,
  APPROVED_DOWN_FLAG_TRANSFORM,
} from "../_fixtures/lab-score-models";
import styles from "../music-lab.module.css";

const PITCH_LADDER_STEPS = Array.from(
  { length: 13 },
  (_, index) => index - 2,
);
const EXTENDED_LEDGER_PITCHES = [
  "A3",
  "B3",
  "C4",
  "D4",
  "G5",
  "A5",
  "B5",
  "C6",
  "D6",
  "E6",
] as const satisfies readonly NaturalPitch[];
const STEM_FLAG_LABELS = [
  "quarter stem UP (staffStep 3)",
  "quarter stem DOWN (staffStep 4)",
  "eighth flag UP",
  "eighth flag DOWN",
  "sixteenth double flag UP",
  "sixteenth double flag DOWN",
] as const;
const pitchLadder = buildPitchLadderFixture();
const ledgerCases = buildLedgerFixture();
const stemAndFlagCases = buildStemAndFlagFixture();

export default function MusicPitchFixturesPage() {
  return (
    <section aria-labelledby="pitch-fixtures-heading" data-fixture-page="pitches">
      <h2 id="pitch-fixtures-heading">Pitch, ledger, stem, and flag fixtures</h2>
      <p>
        The B4 middle line is the logical ScorePath guide. Every preview uses
        Gate-B-approved glyph anchors and approved Gate-C engraving tokens.
        The fixtures remain isolated from the public landing.
      </p>

      <section className={styles.fixtureSection}>
        <h3>C4..A5 landing pitch ladder</h3>
        <figure
          className={styles.fixture}
          data-fixture="landing-pitch-ladder"
          data-glyph-calibration-status="runtime-approved"
          data-optical-token-status="approved"
        >
          <ScoreSvg
            ariaLabel="Diatonic pitch ladder from C4 through A5"
            model={pitchLadder.model}
            viewBox={pitchLadder.viewBox}
          />
          <figcaption className={styles.fixtureLabel}>
            {PITCH_LADDER_STEPS.map(
              (staffStep) => `${staffStepToPitch(staffStep)}=${staffStep}`,
            ).join(" · ")}
          </figcaption>
        </figure>
      </section>

      <section className={styles.fixtureSection}>
        <h3>Extended ledger cases</h3>
        <figure
          className={styles.fixture}
          data-fixture="extended-ledger-cases"
          data-glyph-calibration-status="runtime-approved"
          data-optical-token-status="approved"
        >
          <ScoreSvg
            ariaLabel="Extended ledger-line cases from A3 through E6"
            model={ledgerCases.model}
            viewBox={ledgerCases.viewBox}
          />
          <figcaption className={styles.fixtureLabel}>
            A3, B3, C4, D4, G5, A5, B5, C6, D6, E6
          </figcaption>
        </figure>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Pitch</th>
              <th scope="col">staffStep</th>
              <th scope="col">Ledger steps emitted</th>
            </tr>
          </thead>
          <tbody>
            {EXTENDED_LEDGER_PITCHES.map((pitch) => {
              const staffStep = pitchToStaffStep(pitch);
              const ledgers = getLedgerLineSteps(staffStep);

              return (
                <tr key={pitch}>
                  <th scope="row">{pitch}</th>
                  <td>{staffStep}</td>
                  <td>{ledgers.length > 0 ? ledgers.join(", ") : "none"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={styles.fixtureSection}>
        <h3>Isolated stems and flags</h3>
        <figure
          className={styles.fixture}
          data-down-flag-transform-status="approved"
          data-fixture="isolated-stems-flags"
          data-glyph-calibration-status="runtime-approved"
          data-optical-token-status="approved"
        >
          <ScoreSvg
            ariaLabel="Isolated stems and eighth and sixteenth flags in up and down directions"
            debug
            model={stemAndFlagCases.model}
            viewBox={stemAndFlagCases.viewBox}
          />
          <figcaption className={styles.fixtureLabel}>
            {STEM_FLAG_LABELS.join(" · ")}
          </figcaption>
        </figure>
        <p className={styles.status}>
          Down-flag transform is Gate-B approved: mirrorX={String(
            APPROVED_DOWN_FLAG_TRANSFORM.mirrorX,
          )}, mirrorY={String(APPROVED_DOWN_FLAG_TRANSFORM.mirrorY)}, rotation=
          {APPROVED_DOWN_FLAG_TRANSFORM.rotationRadians}rad.
        </p>
      </section>
    </section>
  );
}
