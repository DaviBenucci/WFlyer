import { ScoreGlyph } from "@/components/score/ScoreGlyph";
import { MUSIC_GLYPH_REGISTRY } from "@/lib/music/glyphs/registry";
import type { MusicGlyphKey } from "@/lib/music/glyphs/types";
import type {
  GlyphRenderPrimitive,
  RenderPrimitiveRole,
} from "@/lib/music/renderer/types";

import styles from "../music-lab.module.css";

const SCALES = [25, 50, 100, 200] as const;
const THEMES = ["light", "dark"] as const;

function roleFor(assetKey: MusicGlyphKey): RenderPrimitiveRole {
  if (assetKey === "wf-music-treble-clef") return "clef";
  if (assetKey.startsWith("wf-music-notehead")) return "notehead";
  if (assetKey.includes("flag")) return "flag";
  return "accidental";
}

function galleryPrimitive(
  assetKey: MusicGlyphKey,
  ratio: number,
  scale: number,
): GlyphRenderPrimitive {
  const height = 120 * (scale / 100);
  const width = height * ratio;

  return {
    anchorInGlyph: { x: 0.5, y: 0.5 },
    anchorTarget: { x: 200, y: 200 },
    assetKey,
    height,
    id: `${assetKey}-${scale}`,
    kind: "glyph",
    layer: "notes",
    mirrorX: false,
    mirrorY: false,
    role: roleFor(assetKey) as GlyphRenderPrimitive["role"],
    rotationRadians: 0,
    width,
  };
}

export default function MusicGlyphGalleryPage() {
  return (
    <section aria-labelledby="glyph-gallery-heading" data-fixture-page="glyphs">
      <h2 id="glyph-gallery-heading">Immutable glyph gallery</h2>
      <p>
        ViewBox-relative previews of immutable SVG paths. Nominal staff-space
        metrics and semantic anchors passed external human Gate-B review on
        2026-08-15; final renderer/composer presentation remains a separate
        Gate-C decision.
      </p>
      {THEMES.map((theme) => (
        <section className={styles.fixtureSection} key={theme}>
          <h3>{theme === "light" ? "Light context" : "Dark context"}</h3>
          <div className={styles.fixtureGrid}>
            {MUSIC_GLYPH_REGISTRY.flatMap((entry) =>
              SCALES.map((scale) => {
                const primitive = galleryPrimitive(
                  entry.assetKey,
                  entry.viewBox.width / entry.viewBox.height,
                  scale,
                );

                return (
                  <figure
                    className={styles.fixture}
                    data-glyph-scale={scale}
                    data-theme={theme}
                    key={`${theme}-${entry.assetKey}-${scale}`}
                  >
                    <svg
                      aria-label={`${entry.name} at ${scale}% in ${theme}`}
                      role="img"
                      viewBox="0 0 400 400"
                    >
                      <ScoreGlyph primitive={primitive} />
                    </svg>
                    <figcaption className={styles.fixtureLabel}>
                      {entry.assetKey} · {scale}% · {entry.runtimeStatus}
                    </figcaption>
                  </figure>
                );
              }),
            )}
          </div>
        </section>
      ))}
    </section>
  );
}
