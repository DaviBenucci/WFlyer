# Music System v0.1 Gate A report

**Date:** 2026-08-15  
**Change:** `implement-music-system-v0-1`  
**Gate:** A — pure geometry and deterministic model validation  
**Result:** PASS; Gate B draft calibration evidence is the next and blocking step.

## Implemented boundaries

- `src/lib/music/geometry/`: 14 pure TypeScript modules covering units, vectors,
  reversal-safe straight/cubic ScorePath frames, coherent staff offsets, pitches,
  ledger lines, stems, beams/hooks, accidentals, key signatures, and barlines.
- `src/lib/music/glyphs/`: three pure registry/calibration modules for all eight
  immutable approved glyph candidates. Canonical manifest metrics remain null and
  every runtime status remains `pending-metrics-and-visual-lab`.
- `src/lib/music/renderer/`: seven pure model modules with canonical fine paint order,
  reversal-safe glyph frames, deterministic IDs, all whitelisted motif topologies,
  centered triplet metadata, key-signature placement checks, and final barline order.
- `src/lib/music/composer/`: ten pure modules implementing the exact motif grammar,
  versioned per-length pitch contours, uniform range translation/rejection, FNV-1a
  plus Mulberry32 determinism, profiles, anti-repetition, reserved slots, and injected
  session-seed interfaces.
- `src/components/score/`: five isolated React/SVG presentation and browser-adapter
  files; precomputed models remain decorative by default.
- `src/app/%5F_visual-lab/music/`: development-only lab. The escaped filesystem
  segment is required by Next.js while preserving the requested public URL
  `/__visual-lab/music/*`.
- `tsconfig.json`: excludes only generated `.next/dev/types/**/*.ts` from standalone
  `tsc`; production `.next/types` stays included. This mirrors Next's own build-time
  filtering and prevents stale encoded dev-route declarations from conflicting with
  normalized production route declarations.
- `tests/unit/music/`: 22 focused unit/static-boundary test files, plus two lab
  fixture-model/export test files colocated with the development fixtures.
- `tests/e2e/music-visual-lab.spec.ts`: development fixtures plus the production 404
  guard.

Canonical governance, renderer/composer contracts, ADRs, and the focused OpenSpec
change were reconciled for the B4/staffStep-4 master guide, traversal-independent
pitch normal, exact contour tables, and deterministic whole-contour boundary policy.
The legacy decision-register path remains only a compatibility pointer.

## Canonical semantics proved

- The ScorePath master guide is the visible B4 middle-line geometry, while all five
  visible lines are still emitted independently.
- Pitch placement uses `(staffStep - 4) * (staffSpace / 2)` along a normal that keeps
  pointing toward increasing pitch when path traversal reverses.
- Pitch contours retain every interval and use only the smallest uniform integer
  translation into `[-2, 10]`; an unfit span is rejected deterministically.
- Isolated and grouped stem rules, all primary/secondary/hook topologies, triplet
  bracket/centered `3`, key signatures `-7..+7`, and thin-before-thick final barlines
  are covered.
- Composition has no `Math.random()`, React, DOM, `window`, `document`, or GSAP import
  dependency in `src/lib/music/**`.
- Future runtime calibration has an explicit fail-closed validator for status,
  complete metrics/anchors, coordinate space, asset key, and immutable checksums;
  every current registry entry and proposal remains pending/draft.

## Validation results

| Validation | Exact result |
|---|---|
| Geometry unit suite | PASS; 5 files, 69 tests |
| Complete Music System and lab-model unit suite | PASS; 24 files, 182 tests |
| Full repository unit suite | PASS; 57 files, 488 tests |
| Pure/import boundary suite | PASS; 2 files, 2 tests |
| Dependency validation | PASS; exact dependency policy satisfied |
| ESLint | PASS; zero warnings |
| Strict TypeScript | PASS, including with the stale generated dev validator intentionally present |
| Next.js production build | PASS; 30 routes compiled |
| Focused OpenSpec strict validation | PASS; 1/1 change, zero issues |
| Development Visual Lab browser suite | PASS; 8 passed, 1 production-only skip |
| Production Visual Lab guard | PASS; 1 passed, 8 development-only skips; every lab child route returned 404 |
| Public production functional regression | PASS; 153/153 across Chromium, Firefox, and WebKit |
| Graphify incremental update | PASS; refreshed to 4,059 nodes, 6,459 edges, and 415 communities |

The 10,000-segment stress case is part of the passing composer suite and checks exact
motif definitions/topologies, triplet metadata, bounds, interval preservation,
anti-repetition, reserved-zone exclusion, key-signature exclusion, and deterministic
repeat hashes.

## Public compatibility and risks

Public behavior changed: **No.** No tracked public landing, chapter, legacy music,
navigation, contact, demo, package, or lockfile source changed. The new route tree is
isolated, absent from navigation/sitemap, and returns 404 in production.

The refreshed graph reports no path from `ScoreSvg` to legacy `ChapterScore` and no
path from `composeSegment` to `SiteExperienceShell`; `ScoreSvg` importers are confined
to Visual Lab fixtures and its presentation test.

Unresolved items:

- All glyph metrics/anchors and optical engraving tokens are proposals only until a
  human completes Gate B.
- Profile weights and ledger frequency remain explicitly draft; no numerical visual
  approval is claimed.
- The host is not the pinned Playwright Noble image. Its representative public visual
  diagnostic reproduced five 8–26-pixel antialiasing mismatches; all 84 committed
  snapshots remained byte-identical. Canonical visual regression belongs to Gate C.
- No staging, provider delivery, physical-device review, production deployment, or
  landing migration is claimed.

## Next gate

Gate B requires draft calibration JSON and screenshots at multiple scales/themes and
in staff context, followed by an explicit human decision. Work must stop there; no
runtime approval or Gate C advancement is authorized before that decision.
