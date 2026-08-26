import styles from "./music-lab.module.css";

const FIXTURE_GROUPS = [
  {
    href: "/__visual-lab/music/glyphs",
    title: "Immutable glyph gallery",
    detail: "Eight assets at 25%, 50%, 100%, and 200% in light and dark contexts.",
  },
  {
    href: "/__visual-lab/music/calibration",
    title: "Approved calibration baseline",
    detail:
      "Reviewed bounds, anchors, nominal staff-space sizes, plus an isolated draft editor for future proposals.",
  },
  {
    href: "/__visual-lab/music/pitches",
    title: "Pitch, ledger, stems, and flags",
    detail: "C4..A5 ladder plus the required A3..E6 extended cases.",
  },
  {
    href: "/__visual-lab/music/beams",
    title: "Beams and tuplets",
    detail: "Every whitelisted topology, mixed hooks, and triplet bracket with centered 3.",
  },
  {
    href: "/__visual-lab/music/key-signatures",
    title: "Key signatures and barlines",
    detail: "Treble fifths -7..+7 and ordinary/final barline ordering.",
  },
  {
    href: "/__visual-lab/music/curved-score",
    title: "ScorePath equivalence",
    detail: "Straight, gentle arc, and gentle S-curve local-frame fixtures.",
  },
  {
    href: "/__visual-lab/music/composer",
    title: "Seeded composer",
    detail: "CALM, BALANCED, ACTIVE, and TERMINAL with explicit semantic seeds.",
  },
] as const;

export default function MusicVisualLabPage() {
  return (
    <section aria-labelledby="fixture-index-heading" data-fixture-page="index">
      <p className={styles.status} role="status">
        Gate B approved · Gate C approved for future landing integration
      </p>
      <h2 id="fixture-index-heading">Fixture index</h2>
      <div className={styles.cardGrid}>
        {FIXTURE_GROUPS.map(({ detail, href, title }) => (
          <article className={styles.card} key={href}>
            <h3>{title}</h3>
            <p>{detail}</p>
            <a href={href}>Open fixture</a>
          </article>
        ))}
      </div>
    </section>
  );
}
