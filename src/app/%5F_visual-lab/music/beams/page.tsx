import { ScoreSvg } from "@/components/score/ScoreSvg";

import { buildBeamFixture } from "../_fixtures/lab-score-models";
import styles from "../music-lab.module.css";

const BEAM_FIXTURES = [
  {
    id: "E8_E8",
    label: "E8_E8 · primary beam",
    staffSteps: [1, 2],
    variant: "default",
  },
  {
    id: "E8_TRIPLET_3",
    label: "E8_TRIPLET_3 · stems UP · bracket + centered 3",
    staffSteps: [0, 1, 2],
    variant: "up",
  },
  {
    id: "E8_TRIPLET_3",
    label: "E8_TRIPLET_3 · stems DOWN · bracket + centered 3",
    staffSteps: [6, 7, 8],
    variant: "down",
  },
  {
    id: "S16_S16_S16_S16",
    label: "S16_S16_S16_S16 · full primary + secondary",
    staffSteps: [2, 3, 4, 5],
    variant: "default",
  },
  {
    id: "E8_S16_S16",
    label: "E8_S16_S16 · trailing secondary pair",
    staffSteps: [2, 3, 4],
    variant: "default",
  },
  {
    id: "S16_S16_E8",
    label: "S16_S16_E8 · leading secondary pair",
    staffSteps: [6, 5, 4],
    variant: "default",
  },
  {
    id: "S16_E8_S16",
    label: "S16_E8_S16 · left/right secondary hooks",
    staffSteps: [1, 2, 3],
    variant: "default",
  },
] as const;

const BUILT_FIXTURES = BEAM_FIXTURES.map((fixture, index) => ({
  ...fixture,
  ...buildBeamFixture(
    fixture.id,
    fixture.staffSteps,
    `lab-beam-${fixture.id}-${fixture.variant}-${index}`,
  ),
}));

export default function MusicBeamFixturesPage() {
  return (
    <section aria-labelledby="beam-fixtures-heading" data-fixture-page="beams">
      <h2 id="beam-fixtures-heading">Beams, mixed hooks, and triplets</h2>
      <p>
        All six automatic beamed motif IDs are rendered below. Beam axis,
        thickness, gap, hook length, and bracket clearance use the approved
        Gate-C layout tokens; no additional automatic topology is introduced.
      </p>
      <div className={styles.fixtureGrid}>
        {BUILT_FIXTURES.map((fixture, index) => (
          <figure
            className={styles.fixture}
            data-beam-motif={fixture.id}
            data-glyph-calibration-status="runtime-approved"
            data-optical-token-status="approved"
            data-semantic-debug="score-primitive-attributes"
            data-triplet-direction={fixture.variant}
            key={`${fixture.id}-${fixture.variant}-${index}`}
          >
            <ScoreSvg
              ariaLabel={fixture.label}
              model={fixture.model}
              viewBox={fixture.viewBox}
            />
            <figcaption className={styles.fixtureLabel}>
              {fixture.label} · pitches {fixture.staffSteps.join(", ")}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
