# Music Visual Lab and Gates

## Dev-only surface

`/__visual-lab/music/*` exists only in development/test-enabled environments and returns 404 in production. It is excluded from navigation, sitemap, and public analytics.

## Required labs

- glyph gallery at multiple scales/themes;
- calibration (bounds, scale, anchors, export draft payload);
- pitch ladder `C4..A5`;
- extended ledger cases;
- stem directions;
- flags;
- all approved beams/hooks/triplets;
- key signatures `-7..+7`;
- ordinary/final barlines;
- straight/gentle-arc/gentle-S curved staffs;
- composer seed/profile/chapter/theme/viewport controls;
- debug overlays for motif IDs, staffSteps, stem direction, group, slot ID.

## Gate A

Pure geometry/composer tests, deterministic rules, key signatures, ledger lines, ScorePath frames, and dependency boundaries pass.

## Gate B — human blocking

Codex proposes draft:

- clef `gLine`;
- notehead optical center, stem-up/down anchors;
- accidental pitch centers;
- flag attachment;
- nominal sizes.

Human approves. Codex cannot self-approve.

## Gate C — human blocking

- all motifs on straight/curved staff;
- multiple fixed seeds per profile;
- responsive semantic stability;
- reduced-motion semantic stability;
- 10,000-segment stress test;
- accessibility;
- production 404 guard;
- no per-scroll composition/geometry/React work;
- deterministic visual evidence.

Landing integration follows only after all gates.
