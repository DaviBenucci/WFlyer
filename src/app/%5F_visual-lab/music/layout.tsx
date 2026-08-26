import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// `%5F_visual-lab` is the routable filesystem escape for `/__visual-lab`.

import styles from "./music-lab.module.css";

const FIXTURES = [
  ["Overview", "/__visual-lab/music"],
  ["Glyphs", "/__visual-lab/music/glyphs"],
  ["Calibration", "/__visual-lab/music/calibration"],
  ["Pitches", "/__visual-lab/music/pitches"],
  ["Beams", "/__visual-lab/music/beams"],
  ["Key signatures", "/__visual-lab/music/key-signatures"],
  ["Curved score", "/__visual-lab/music/curved-score"],
  ["Composer", "/__visual-lab/music/composer"],
] as const;

export const metadata: Metadata = {
  title: "Music Visual Lab | W_Flyer development",
  robots: { follow: false, index: false },
};

export default function MusicVisualLabLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className={styles.lab} data-music-visual-lab="development-only">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Development only · Gate C review</p>
          <h1>W_Flyer Music Visual Lab</h1>
          <p>
            Gate-B glyph metrics, anchors, and the down-flag transform are
            runtime-approved. Renderer/composer optical tuning remains a Gate-C
            proposal, and nothing here is connected to the public landing.
          </p>
        </div>
        <nav aria-label="Music Visual Lab fixtures" className={styles.nav}>
          {FIXTURES.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
