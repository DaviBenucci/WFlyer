# Phase 9 Task-33 Refinement Evidence

Capture date: 2026-08-30
Status: HUMAN-APPROVED Task-33 closure evidence; not a Gate-9 seal

## Scope

This bundle records deterministic visual, responsive, accessibility, and
runtime evidence for the approved Task-33 dark-theme, copper-emphasis, warm
Home atmosphere, Project-card, hydration, and review-fixture refinements. It
also records the reviewed real-origin topology and Organic Flowing production
direction. The final production treble-clef optical prominence may still be
calibrated during real Task-34 integration without redesigning the approved
musical anchor or origin topology.

Task 33 is HUMAN-APPROVED and complete. Task 34 has not started. OpenSpec is
33/45.

## Final authoritative validation

| Lane | Result |
|---|---:|
| Exact dependency policy | PASS |
| ESLint | PASS |
| Strict typecheck | PASS |
| Unit/component | 87 files, 688 tests PASS |
| Storybook interactions | 13 files, 63 tests PASS |
| Storybook static build | PASS |
| Approved Music SVG integrity manifest | 16/16 PASS |
| Committed visual snapshot integrity manifest | 84/84 PASS |
| Chromium retained scenes/theme/a11y | 40/40 PASS |
| Firefox retained scenes/theme/a11y | 40/40 PASS |
| WebKit retained scenes/theme/a11y | 40/40 PASS |
| Chromium Task-33 ScorePath | 24/24 PASS |
| Firefox Task-33 hydration/candidates | 13/13 PASS |
| WebKit Task-33 hydration/candidates | 13/13 PASS |
| Authoritative browser scope | 170/170 PASS |
| Explicit zero-hydration-warning matrix | 12/12 PASS |
| `git diff --check` | PASS |

The final Playwright lanes used one worker, zero configured retries, and no
skips. The development server used the repository's public Turnstile test key
and transition-test mode.

## Preserved diagnostic history

These failures are retained as diagnostics and are not counted as final
authoritative failures:

- Firefox exposed Node/Firefox SVG text differences, including
  `22.344874609817275` versus `22.34487460981728` in a staff-line point. The
  shared SVG presentation boundary now serializes computed primitives to six
  decimal places while preserving full internal renderer precision.
- A review query originally owned theme state on the review subtree. Theme
  ownership now resolves on the document root before hydration.
- One invalidated regression run reused a server without the public Turnstile
  test key. The correctly configured Phase-7 preflight passed 10/10, and the
  final Contact/security lanes passed on all engines.
- Organic Soft's review-only descending-arc evidence used a discontinuous
  `deltaY > 0` classifier. Node/Firefox values included `2019.55` versus
  `2022.38` and `551.06` versus `551.02`. A `1e-7` tolerance now treats only
  sub-resolution near-horizontal diagnostic deltas as level; composition,
  authored paths, semantic fingerprints, and Music meaning are unchanged.
- WebKit cold development-route navigation destroyed evaluation contexts and
  canceled a redundant Contact reload. Stored theme is now seeded before the
  first Contact navigation, and affected development routes wait for
  `networkidle`; no assertion or console filter was weakened. The corrected
  WebKit Contact/dark-theme lane passed 14/14.
- WebKit measured a 15 px text wrap overflow in the reference-only Organic Soft
  compact About envelope. A scoped 16 px reserved-envelope allowance fixed the
  overflow with a one-pixel rounding buffer. Track height, path geometry,
  Organic Flowing, collision thresholds, and Music semantics are unchanged;
  the final candidate matrix passed 27/27 across all engines.

Firefox report-only CSP messages from Next development `eval` chunks were
classified separately from hydration mismatches, layout failures, and
application exceptions. Hydration assertions remained explicit and unchanged.

## Captures

| Capture | Dimensions | Evidence role |
|---|---:|---|
| `home-dark-1536x1024.png` | 1536×1024 | Warm dark Home atmosphere with unchanged geometry and no filter layer |
| `mobile-dark-full-390.png` | 390×20706 | Complete compact Organic Flowing dark review |
| `mobile-dark-top-390x932.png` | 390×932 | Header, score, and opening scenes inherit document theme |
| `mobile-dark-projects-390x932.png` | 390×932 | Compact Project cards and copper UI emphasis |
| `mobile-dark-contact-390x932.png` | 390×932 | Contact scene and controls under canonical dark theme |
| `mobile-dark-app04-390x932.png` | 390×932 | APP-04 deterministic fallback under canonical dark theme |
| `mobile-dark-terminal-390x932.png` | 390×932 | Application ending and terminal theme inheritance |
| `origin-dark-horizontal-1440x900.png` | 1440×900 | Pending origin fixture under document-owned dark theme |
| `hydration-clean-firefox-390x932.png` | 390×932 | Representative Firefox render after zero-warning assertion |
| `light-regression-organic-flowing-390x932.png` | 390×932 | Representative compact light-theme regression |

## Runtime assertions

- Dark review queries resolved through `<html data-theme="dark">`; reviewed
  descendants did not own competing `data-theme` attributes.
- Twelve representative surfaces inherited `--wf-bg: #12100f`,
  `--wf-surface: rgb(29 26 24 / 92%)`, `--wf-text: #f4ecdf`,
  `--wf-text-muted: #c1b9ad`, and `--wf-emphasis: #e79271`.
- The full 390 px dark capture and both new captures had zero document
  horizontal overflow.
- Home used `rgb(159 75 54 / 20%)`; computed `filter` and
  `backdrop-filter` were `none`, and its measured box remained
  `x=0`, `y=89`, `width=1536`, `height=936`.
- The Firefox evidence probe reported `hydrationMessages: []`,
  `overlayMatched: false`, and ten rendered staff lines.
- Purple/cobalt remain valid in intrinsic approved brand roles. The Task-33
  review fixtures retain their pre-integration score presentation; Task 34 owns
  the final theme-aware notation ink. No Music semantic or approved glyph
  geometry changed.

## Integrity

`SHA256SUMS.txt` covers this record and all ten screenshots. The detached
`SHA256SUMS.txt.sha256` authenticates that manifest. These are the integrity
records for the closed Task-33 human gate, not a shippable page background, a
Task-34 implementation seal, or a cross-host pixel golden.
