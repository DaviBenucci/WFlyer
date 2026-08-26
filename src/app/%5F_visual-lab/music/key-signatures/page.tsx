import { ScoreSvg } from "@/components/score/ScoreSvg";
import type { Fifths } from "@/lib/music/geometry/types";

import { buildComposerKeySignatureBoundaryEvidence } from "../_fixtures/gate-c-review";
import { buildKeySignatureFixture } from "../_fixtures/lab-score-models";
import styles from "../music-lab.module.css";

const FIFTHS = Array.from({ length: 15 }, (_, index) => (index - 7) as Fifths);
const KEY_SIGNATURE_FIXTURES = FIFTHS.map((fifths) => ({
  fifths,
  ...buildKeySignatureFixture(fifths),
}));
const COMPOSER_BOUNDARY_EVIDENCE =
  buildComposerKeySignatureBoundaryEvidence();

export default function MusicKeySignatureFixturesPage() {
  return (
    <section aria-labelledby="key-signature-heading" data-fixture-page="key-signatures">
      <h2 id="key-signature-heading">Treble key signatures and barlines</h2>
      <p>
        Every fifths value from -7 through +7 uses canonical accidental order
        and deterministic spacing. Each fixture also shows one ordinary barline
        followed by the ordered thin-gap-thick final barline, with no repeat dots.
      </p>
      <p
        className={styles.status}
        data-composer-key-signature-fields={
          COMPOSER_BOUNDARY_EVIDENCE.forbiddenFieldPaths.length
        }
        data-key-signature-ownership={
          COMPOSER_BOUNDARY_EVIDENCE.keySignatureOwnership
        }
      >
        Composer boundary: {COMPOSER_BOUNDARY_EVIDENCE.composerCasesInspected}
        fixed-seed/profile cases inspected · key-signature/fifths fields found:{" "}
        {COMPOSER_BOUNDARY_EVIDENCE.forbiddenFieldPaths.length} · ownership:{" "}
        {COMPOSER_BOUNDARY_EVIDENCE.keySignatureOwnership}
      </p>
      <div className={styles.tableWrapper}>
        <table className={styles.table} data-key-signature-structural-evidence="v1">
          <caption>
            One renderer-authored occurrence near the origin for nonzero fifths;
            fifths=0 authors no occurrence.
          </caption>
          <thead>
            <tr>
              <th scope="col">Fifths</th>
              <th scope="col">Occurrences</th>
              <th scope="col">Rendered accidentals</th>
              <th scope="col">Key t</th>
              <th scope="col">First note t</th>
              <th scope="col">Order valid</th>
            </tr>
          </thead>
          <tbody>
            {KEY_SIGNATURE_FIXTURES.map(
              ({ fifths, structuralEvidence }) => (
                <tr key={fifths}>
                  <th scope="row">{fifths > 0 ? `+${fifths}` : fifths}</th>
                  <td>{structuralEvidence.configuredOccurrences}</td>
                  <td>{structuralEvidence.renderedAccidentalGlyphs}</td>
                  <td>{structuralEvidence.keySignatureT ?? "none"}</td>
                  <td>{structuralEvidence.firstNoteT}</td>
                  <td>
                    {structuralEvidence.nearOriginAndBeforeMusic
                      ? "yes"
                      : "no"}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.fixtureGrid}>
        {KEY_SIGNATURE_FIXTURES.map(
          ({ fifths, model, structuralEvidence, viewBox }) => (
          <figure
            className={styles.fixture}
            data-configured-key-signature-occurrences={
              structuralEvidence.configuredOccurrences
            }
            data-fifths={fifths}
            data-glyph-calibration-status="runtime-approved"
            data-optical-token-status="approved"
            data-rendered-key-signature-accidentals={
              structuralEvidence.renderedAccidentalGlyphs
            }
            key={fifths}
          >
            <ScoreSvg
              ariaLabel={`Treble key signature with ${fifths} fifths, ordinary barline, and final barline`}
              model={model}
              viewBox={viewBox}
            />
            <figcaption className={styles.fixtureLabel}>
              fifths={fifths > 0 ? `+${fifths}` : fifths} · ordinary · final
              thin → configured gap → thick
            </figcaption>
          </figure>
          ),
        )}
      </div>
    </section>
  );
}
