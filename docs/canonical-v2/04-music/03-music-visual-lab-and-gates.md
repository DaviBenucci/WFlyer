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

**Status:** approved by external human review on 2026-08-15.

Codex proposes draft:

- clef `gLine`;
- notehead optical center, stem-up/down anchors;
- accidental pitch centers;
- flag attachment;
- nominal sizes.

Human approval is recorded in the canonical calibration register and Gate B evidence.
The exact nominal sizes, anchors, and down-flag transform are now runtime approved.
Codex did not self-approve, and the immutable SVG geometry/checksums did not change.

## Gate C — human blocking

**Status:** approved by final external human review on 2026-08-24.

The reviewer approved the automated evidence, immutable SVG/snapshot baselines,
corrected responsive functional semantics, reviewed renderer and Composer
values, `maxNotationTangentAngleDeg=18`, and the final `0.85` triplet result.
Canonical triplet tokens are `0.85` numeral size, `0.18` side gap, `0.65`
clearance, `0.30` end cap, and `0.07` bracket thickness. Gate A and Gate B stay
closed and approved; no Gate-B-approved glyph geometry, metric, or anchor
changed.

- all motifs on straight/curved staff;
- multiple fixed seeds per profile;
- responsive semantic stability;
- reduced-motion semantic stability;
- 10,000-segment stress test;
- accessibility;
- production 404 guard;
- no per-scroll composition/geometry/React work;
- deterministic visual evidence.

Only the two motif matrices and two triplet-detail images were recaptured in a
new evidence directory. Existing responsive evidence and historical Gate-C
evidence remain byte-identical. The final approval record and authority manifest
are under `gate-c/approval-2026-08-24/`. The responsive connector fixture remains
validation-only and noncanonical. Landing integration has not occurred; final
responsive organic path design remains deferred to the blocking Phase-9 human
subgate.
