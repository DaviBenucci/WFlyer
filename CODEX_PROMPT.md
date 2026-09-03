You are implementing a narrowly scoped W_Flyer Music System v0.1 inside the existing `wflyer.com.br` institutional-site repository.

This is an implementation task, not a redesign task. Do not infer missing product rules. Do not migrate the main landing yet.

## 0. Mandatory reading and source-of-truth order

Before changing code:

1. Read repository `AGENTS.md`.
2. Read this package `README.md`.
3. Read `CANONICAL_DECISION_DELTA.md` and normalize those ADR decisions into `docs/00-governanca/05-registro-decisoes.md` first.
4. Read `REPOSITORY_CONFLICT_MAP.md`.
5. Merge/read `repo-overlay/docs/05-implementacao/22-music-system-v0.1-implementation-contract.md`.
6. Read `repo-overlay/docs/07-qa/09-music-system-v0.1-validation.md`.
7. Read the normalized visual-library manifest and renderer/composer contracts under `docs/design-reference/visual-library/`.
8. Create/use the focused OpenSpec change `implement-music-system-v0-1` from this package and keep it active throughout implementation.
9. If `graphify-out/graph.json` exists, use Graphify to inspect relationships around `src/components/music`, `src/app`, tests, and motion before structural changes. Treat existing `src/components/music/*` as legacy public compatibility code, not as the target architecture.

If the live repository differs materially from the inspected `WFlyer(10).zip` baseline, report the difference and merge semantically. Do not overwrite newer decisions blindly.

## 1. Hard scope

Implement only:

- pure TypeScript geometry core;
- glyph registry + draft calibration model;
- pure renderer models;
- deterministic Procedural Score Composer;
- React/SVG presentation for the isolated system;
- development-only Music Visual Lab;
- required tests/evidence.

Do NOT:

- replace or refactor the public landing score;
- modify Home/chapter layout;
- wire GSAP story motion to the new system;
- change header traversal;
- implement Persona/project-card/tablet changes;
- change contact API, routes, SEO, deploy, Cloudflare, Napoleon, or `app.wflyer.com.br`;
- add a music library, PRNG package, notation engine, canvas/WebGL library, or second motion engine;
- modify approved SVG path geometry;
- mark glyph calibration/runtime status approved without explicit human approval.

The landing must render and behave exactly as before this change.

## 2. Existing legacy code is not authoritative

The repository currently contains legacy music code including:

- `src/components/music/MusicalNote.tsx` with ellipse noteheads/hard-coded stems;
- `src/components/music/Staff.tsx` with fixed pixel note positions;
- `src/components/music/StaffSegment.tsx` with independently generated line curves;
- `src/components/music/NarrativeClef.tsx` with a legacy custom clef path;
- `ChapterScore.tsx` and `OriginScore.tsx` with static note blueprints.

Do not copy these algorithms into the new core. Leave them in place for public compatibility during this change.

## 3. Target code boundaries

Prefer this structure unless a proven repository constraint requires a small adjustment:

```text
src/lib/music/
  geometry/
    types.ts
    units.ts
    vectors.ts
    score-path.ts
    straight-score-path.ts
    cubic-bezier-score-path.ts
    staff.ts
    pitch.ts
    ledger-lines.ts
    stems.ts
    beams.ts
    accidentals.ts
    key-signatures.ts
    barlines.ts
  glyphs/
    types.ts
    registry.ts
    metrics.ts
  renderer/
    types.ts
    build-note-model.ts
    build-motif-model.ts
    build-score-model.ts
  composer/
    types.ts
    prng.ts
    motifs.ts
    profiles.ts
    pitch-contours.ts
    anti-repetition.ts
    compose-motif.ts
    compose-segment.ts
    session-seed.ts

src/components/score/
  ScoreSvg.tsx
  ScoreGlyph.tsx
  ScoreDebugOverlay.tsx
  score.module.css

src/app/__visual-lab/music/
  layout.tsx
  page.tsx
  glyphs/page.tsx
  calibration/page.tsx
  pitches/page.tsx
  beams/page.tsx
  key-signatures/page.tsx
  curved-score/page.tsx
  composer/page.tsx
```

Pure `src/lib/music/**` modules must not import React, DOM APIs, `window`, `document`, or GSAP.

## 4. Canonical engraving rules

Implement exactly the normative implementation contract. Critical invariants include:

- `staffStep = 0.5 * staffSpace`;
- treble mapping `E4=0`, `G4=2`, `B4=4`, `F5=8`, `C4=-2`, `A5=10`;
- five staff lines are coherent normal offsets of one master ScorePath guide;
- straight and cubic Bézier paths use the same P/T/N local-frame model;
- ledger-line rules and intermediate ledgers are deterministic;
- isolated note: below B4 -> UP; B4 and above -> DOWN;
- beam group Option B: sum balance -> farthest extreme -> DOWN on perfect symmetry;
- renderer primitives: staff, stem, ledgers, primary/secondary beams, hooks, barlines;
- approved glyphs: clef, filled/open noteheads, sharp/flat/natural, eighth flag, sixteenth double flag;
- do not redraw or mutate glyph paths;
- treble key signatures support `-7..+7` with canonical vertical order and deterministic spacing;
- each continuous branch score has at most one explicit key signature near the origin; composer cannot modify it.

## 5. Exact procedural grammar

Only these automatically generated motif IDs are allowed:

```text
Q1 Q2 Q3 Q4
H1 H2
W1
E8_E8
E8_TRIPLET_3
S16_S16_S16_S16
E8_S16_S16
S16_S16_E8
S16_E8_S16
```

Rules:

- linked 3 eighth notes are only `E8_TRIPLET_3`;
- triplet always has exactly 3 eighth notes, a visible bracket, and centered `3`;
- pure linked sixteenth group is max/exactly 4 in the v0.1 whitelist;
- `S16_E8_S16` uses a full primary beam + left/right secondary hooks;
- no other automatic beam group may be invented;
- landing pitch range is C4..A5, favor E4..F5;
- pitches come from whitelisted contours, not independent random picks;
- maximum two identical consecutive pitches;
- same motif may not occur immediately twice;
- terminal profile uses only calm simple motifs;
- reserved zones are never populated.

## 6. Determinism

Use a small internal versioned PRNG; do not add a package. A stable hash + PRNG such as FNV-1a 32-bit + Mulberry32 is acceptable if fully tested and documented.

Production session seed:

- create with `crypto.getRandomValues`;
- store in `sessionStorage` under a versioned W_Flyer key;
- derive chapter sub-seeds from session seed + composer version + stable chapter ID;
- expose explicit seed injection for Visual Lab and tests.

`Math.random()` is forbidden in composition code.

The same semantic composition must survive reload, theme change, reduced-motion change, and responsive horizontal/vertical geometry change within the same session.

## 7. Glyph calibration

The normalized manifest intentionally has null metrics/anchors.

Implement the registry and lab so that Codex can propose `draft-calibration` values for:

- treble clef `gLine`;
- filled/open notehead optical center, stem-up, stem-down anchors;
- accidental pitch centers;
- flag stem-attachment anchors;
- nominal width/height in staff-space units.

Do not alter source glyph paths. Do not change `runtimeStatus` to approved. When Gate A is complete and draft calibration screenshots are ready, STOP and present the calibration evidence to the human reviewer. This is a hard blocking gate.

## 8. Visual Lab production guard

`/__visual-lab/music/*` is a development-only UI and must return 404 in production. Do not expose it in sitemap/public navigation. Do not weaken the guard to make CI screenshots convenient.

If governed production-like browser tests cannot access the lab, use development-harness evidence for lab screenshots and separately test that the production build returns 404.

## 9. Required tests before Gate B

At minimum:

- staffStep/pitch mapping;
- ScorePath P/T/N math;
- coherent five-line offsets;
- ledger cases above/below staff including intermediates;
- isolated stem direction;
- beam Option-B balance/ties;
- every beam/mixed-hook topology;
- triplet metadata;
- key signatures -7..+7;
- final barline ordering;
- PRNG golden outputs;
- same seed deep equality;
- 10,000 generated segments with zero illegal motifs/pitches/repetitions;
- pure-module import-boundary test or static check proving no React/DOM/GSAP imports.

Run the repository's dependency validation, lint, typecheck, and applicable unit tests at Gate A.

## 10. Required Visual Lab fixtures

Implement:

- glyph gallery at 25/50/100/200% in light/dark;
- calibration controls with bounds/anchors and exportable draft JSON;
- C4..A5 pitch ladder;
- extended ledger cases A3..E6 listed in the contract;
- isolated stems and flags up/down;
- every whitelisted beamed motif;
- triplet up/down with bracket+3;
- key signatures -7..+7;
- ordinary/final barlines;
- straight, gentle arc, gentle S-curve scores;
- composer CALM/BALANCED/ACTIVE/TERMINAL with explicit seed and debug overlay.

## 11. Sequential gates — do not skip

### Gate A — Geometry
Complete pure implementation/tests. If any geometry rule is ambiguous, stop and report it instead of inventing behavior.

### Gate B — Human calibration
Produce draft values/screenshots and STOP. Do not continue to runtime approval until the human explicitly approves the metrics/anchors.

### Gate C — Visual Composer
Only after Gate B approval: complete fixed-seed visual evidence, accessibility, responsive/reduced-motion semantic stability, performance instrumentation, and public-regression proof.

No main landing integration is allowed even after Gate C in this change. Landing migration is a separate future OpenSpec change.

## 12. Completion/reporting

Update OpenSpec tasks only after the corresponding implementation and evidence exist. Run strict OpenSpec validation and `graphify update .` after structural code changes.

At each gate report:

- files added/modified;
- tests run and exact result;
- evidence paths;
- unresolved risks;
- whether any public behavior changed (expected answer: no);
- next gate and whether human input is required.

Start now with canonicalization + baseline inspection + Gate A. Do not ask for permission between routine implementation steps. Stop only for a real normative conflict, an unsatisfied hard gate, or the mandatory human Gate-B calibration review.
