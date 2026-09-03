# Phase 9 Task-34 Integration Review Evidence

Capture date: 2026-08-31  
Status: Task-34 review evidence; not a Gate-9 seal

## Scope and rollback boundary

This bundle records the final implementation and validation of one shared
musical origin plus six Professional and six Application score segments in the
real Phase-5 story. The stable rollback boundary remains the sealed Task-33
commit `74677a762a9d9a53cb7fd375eecb0462b10e18e9`. Task 34 advances OpenSpec
from 33/45 to 34/45 only; Task 35 remains open, so Gate 9 is not sealed.

The exact Task-34 boundary is 55 paths:

- 40 implementation, documentation, test, and regression-harness paths frozen
  before final closeout;
- 13 files in this review bundle: this record, ten PNG captures, the checksum
  manifest, and its detached digest;
- two closeout-control paths:
  `openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md` and
  `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`.

The 40 frozen implementation/test paths are:

```text
docs/02-design/02-tokens-visuais-v1.md
src/app/%5F_visual-lab/story/score-paths/_fixtures/score-path-candidates.ts
src/app/%5F_visual-lab/story/score-paths/_fixtures/score-path-origin.ts
src/components/score/score.module.css
src/components/story-motion/MotionStoryLab.test.tsx
src/components/story-motion/MotionStoryLab.tsx
src/components/story-motion/motion-story-lab.module.css
src/components/story-score/StoryScoreLayer.tsx
src/components/story-score/index.ts
src/components/story-score/story-score-layer.module.css
src/components/story/ApplicationChapterScene.test.tsx
src/components/story/ApplicationChapterScene.tsx
src/components/story/ProfessionalChapterScene.test.tsx
src/components/story/ProfessionalChapterScene.tsx
src/components/story/StaticStorySkeleton.test.tsx
src/components/story/application-chapter-scene.module.css
src/components/story/professional-chapter-scene.module.css
src/lib/music/renderer/approved-runtime.ts
src/lib/story/manifest.ts
src/lib/story/score/composition.ts
src/lib/story/score/organic-flowing.ts
src/lib/story/score/projection.ts
src/lib/story/score/shared-origin.ts
src/lib/story/types.ts
src/styles/tokens.css
tests/e2e/phase04-bootstrap.spec.ts
tests/e2e/phase05-master-story.spec.ts
tests/e2e/phase05-navigation.spec.ts
tests/e2e/phase06-story-header.spec.ts
tests/e2e/phase07-professional-scenes.spec.ts
tests/e2e/phase08-v2-application-scenes.spec.ts
tests/e2e/phase09-dark-theme.spec.ts
tests/e2e/phase09-score-integration.spec.ts
tests/helpers/transition.ts
tests/unit/music/public-isolation.test.ts
tests/unit/music/score-presentation-tokens.test.ts
tests/unit/story/manifest.test.ts
tests/unit/story/story-score-composition.test.ts
tests/unit/story/story-score-projection.test.ts
tests/unit/theme-tokens.test.ts
```

The unrelated `.gitignore` edit, root/import artifacts, Phase-0 residue,
`gate-b-evidence-2026-08-15.zip`, and `repo-overlay/` remain excluded and
untouched. Ignored Playwright reports and build output are validation products,
not Task-34 source paths.

## Architecture ownership

| Concern | Sole Task-34 owner |
|---|---|
| Session composition and semantic fingerprints | `src/lib/story/score/composition.ts` |
| Organic Flowing geometry promoted from the approved Task-33 fixture | `src/lib/story/score/organic-flowing.ts` |
| Shared origin contract | `src/lib/story/score/shared-origin.ts` |
| Responsive production projection and invariant fail-safe | `src/lib/story/score/projection.ts` |
| Approved Music renderer calibration/tokens | `src/lib/music/renderer/approved-runtime.ts` |
| DOM/SVG score presentation | `src/components/story-score/StoryScoreLayer.tsx` |
| Native-scroll timeline and sole GSAP/ScrollTrigger ownership | existing `src/lib/story/motion/**` runtime consumed by `MotionStoryLab.tsx` |

The score layer observes the story runtime's published projection mode and
viewport size; it does not own scroll progress, a GSAP timeline, or a
ScrollTrigger. Fixture-path shims preserve review imports while the production
owners live under `src/lib/story/score/`.

## Shared origin and 12 real segments

- Shared origin count: exactly one.
- Treble-clef count: exactly one, owned by the shared Professional-origin
  model; Application starts from the same physical origin frame without a
  second clef.
- Professional real segments: six — About, Services, Process, Projects,
  Contact, Terminal.
- Application real segments: six — Overview, How it works, Benefits, Demo,
  Access, Terminal.
- The two branches share a zero-gap point and all five zero-gap staff-line
  starts. `staffSpaceDelta` is zero and their opposing departure tangents have
  alignment `-1.000000` by design.
- The approved immutable treble-clef calibration remains
  `nominalWidthSp=2.614`, `nominalHeightSp=6.4`, with `gLine=(0.5, 0.62)`;
  rotation is zero and neither axis is mirrored. The captures show its final
  production prominence without editing the approved SVG bytes.

The semantic slots are exactly `<chapter>:primary` and
`<chapter>:reserved` for each real segment. Projection tests compare the
complete projected slot set with every composed motif and empty slot; no slot
is absent or duplicated.

## Deterministic composition

| Branch | Seed | Fingerprint |
|---|---|---|
| Professional | `phase-9-task-33-review-v1` | `fnv1a32:039bce10` |
| Application | `phase-9-task-33-review-v1` | `fnv1a32:1fe3356b` |

The module invokes `composeSegment` exactly twice, once per branch, and caches
the two frozen compositions for the session/module lifetime. Every projection
mode references those same objects. Theme, breakpoint, resize, transient mode
handoff, reduced motion, and static fallback therefore project but do not
recompose the score.

The Professional model owns one key signature after the shared clef and before
the first relevant notation material. Application owns no second key
signature. Both branches end with a deterministic final barline at `t=1`.

## Projection geometry and responsive fail-safe

| Projection | Canonical `staffSpace` | Maximum notation tangent | Path crossings | Staff-line crossings | Connector events |
|---|---:|---:|---:|---:|---:|
| horizontal-enhanced | 12 | 7.939474 degrees | 0 | 0 | 0 |
| vertical-wide | 4.5 | 13.926740 degrees | 0 | 0 | 0 |
| vertical-compact | 3 | 16.542818 degrees | 0 | 0 | 0 |
| static at 1200x900, resolving to vertical-wide | 4.5 | 13.926740 degrees | 0 | 0 | 0 |

All values remain below the approved 18-degree maximum. Every mode retains
five continuous staff lines, with maximum point/curvature discontinuity at or
below `1e-7` and minimum tangent alignment at or above `1 - 1e-7`. No true
connector contains a Music event.

Fourteen focused projection contracts cover all modes, projection caching,
semantic object identity, compact and Firefox transient handoffs, and the real
horizontal boundary matrix at 1100x640, 1100x800, 1280x720, 1366x768,
1440x900, and 1920x1080. During the sole story runtime's brief stale
`horizontal-enhanced` handoff, projection geometry clamps only its geometry
inputs to the unchanged eligibility minima of 1100x640. It does not change
eligibility or introduce another responsive owner. Explicit transient probes
at 700x900 and 768x450 remain crossing-free until the published mode settles.

Both terminal models end physically with `final-barline-thin`, the canonical
gap, and `final-barline-thick`; no connector or event follows the terminal.

## Theme-aware Music presentation

| Theme | Primary notation | Muted staff/bar ink | Selective accent |
|---|---|---|---|
| dark | `#f4ecdf` / `rgb(244, 236, 223)` | `#c1b9ad` / `rgb(193, 185, 173)` | copper `#e79271` / `rgb(231, 146, 113)` |
| light | `#24180f` / `rgb(36, 24, 15)` | `#665548` / `rgb(102, 85, 72)` | warm brown `#9a6237` / `rgb(154, 98, 55)` |

Primary notation owns the clef, notes, stems, beams, accidentals, tuplets, and
ledger lines. Muted notation owns the five-line staff, ordinary barlines, and
thin final stroke. Accent is limited to the key signature and thick final
stroke. Ordinary header notation consumes the same warm `--wf-note` and
`--wf-staff` compatibility aliases.

The semantic-token test proves `tokens.css` contains neither legacy default
purple `#933fff` nor cobalt `#7b5dda`; browser probes also prove the rendered
primary/muted/accent roles are the warm values above. Purple/cobalt remains
only where intrinsic to immutable approved brand assets or isolated diagnostic
fixtures, never as default Music ink. No approved SVG byte changed.

## Runtime and hydration

- Composer calls remain `2` before any scrolling and do not increase per
  frame.
- The Motion Lab's React render counter remains unchanged after native wheel
  progress; the score layer has no React render per scroll frame.
- Horizontal mode retains the existing one owned master timeline and one owned
  ScrollTrigger. Vertical-wide, compact, static, reduced-motion, and failure
  fallbacks own none.
- The score layer's Resize listener, MutationObserver, and animation-frame
  synchronization are locally owned and explicitly cleaned up.
- The final 12-case Chromium/Firefox/WebKit integration lane recorded zero
  hydration warnings, deterministic six-decimal SVG serialization, and no
  framework error overlay.

## Final authoritative validation

| Lane | Result |
|---|---:|
| Exact dependency policy | PASS |
| ESLint, zero warnings | PASS |
| Next route type generation + strict TypeScript | PASS |
| Unit/component | 90 files, 707 tests PASS |
| Focused production projection contracts | 14/14 PASS, included above |
| Storybook interactions | 13 files, 63 tests PASS |
| Storybook static build | PASS |
| Task-34 integration/hydration — Chromium | 4/4 PASS |
| Task-34 integration/hydration — Firefox | 4/4 PASS |
| Task-34 integration/hydration — WebKit | 4/4 PASS |
| Task-34 integration/hydration total | 12/12 PASS; retries 0; skips 0 |
| Affected regression — Chromium | 98/98 PASS |
| Affected regression — Firefox | 98/98 PASS |
| Affected regression — WebKit | 98/98 PASS |
| Authoritative affected-browser total | 294/294 PASS; retries 0; skips 0 |
| Production Next.js build | PASS; 39 pages generated |
| Standalone retained public routes | `/`, `/sobre`, `/servicos`, `/portfolio`, `/contato`, `/aplicacao-wflyer`: HTTP 200 |
| Standalone Visual Lab isolation | Motion, Score Paths, Origin, and Preview: HTTP 404 |
| Public `/` Task-34 cutover marker | ABSENT |
| Approved Music SVG immutable manifest | 16/16 PASS; aggregate `38ad23abbd642bac57bae9781f66124a46efde90b2921de2c0811966d93bab65` |
| Committed Music visual snapshots | 84/84 PASS; aggregate `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63` |

The final WebKit report began at 2026-08-31 00:37:58 -0300, after the last
shared-test edit at 00:37:16, and passed 98/98. Its HTML SHA-256 is
`d6bd4087d3c7980b0d630c91628187ff1270a15cea59bfd6eaea9ca810be5c97`.
The final combined Chromium/Firefox report passed 196/196 and has SHA-256
`c16c6020aba6cad632a49139c4deef43d5e8aea484e4221da72512d7773f54df`.
The fresh three-engine Task-34 report passed 12/12 and has SHA-256
`588babe46488c6481547985b075077f757448f8831467201849eb7c917228c72`.
Reports are ignored local validation output rather than review-bundle payload.

## Preserved diagnostic history and exclusions

Intermediate failures remain classified rather than rewritten as green:

- Product geometry diagnostics exposed and fixed a Professional origin-bridge
  crossing, Application horizontal-return crossings, Application Home
  clearance, and a stale-mode responsive handoff at effective Firefox height.
  Final production guards fail closed on crossings and retain the existing
  runtime thresholds.
- A Phase-4 deep-link test used a stale literal `<64px`; it now compares the
  measured header plus canonical CSS scroll margin (observed approximately
  77px + 24px).
- Debug `position(...)` never promised focus preservation; the Space-key test
  now explicitly restores focus before invoking the native behavior.
- A compact test targeted the retired structural duplicate rather than the
  real thin/thick score barline, and dark-token assertions expected unresolved
  aliases rather than computed warm colors. Both now inspect real output.
- Destination routes are warmed before source navigation to prevent Next
  development HMR from replacing the current document during compilation.
  Focus acquisition tolerates that development-only replacement.
- The transition helper treats only a destroyed navigation execution context
  as “controller not ready”; every other error still fails.
- WebKit delayed hydration can receive one full-document Next development HMR
  replacement. The harness still proves DEGRADED/css-fail-open per document,
  cover removal, non-inert content, and the unchanged 5000ms production
  deadline. No product timeout or retry was added.
- MutationObserver sampling can miss a short intermediate traversal chapter;
  analytical master-timeline label progress remains authoritative.

Six obsolete Phase-6 tests for the retired interactive tablet are excluded
from the 294 denominator without deletion. Current APP-04 behavior is covered
by the Phase-8 v2 suite plus unit/Storybook contracts. One literal
headed-only native-scrollbar drag is also outside the headless denominator.
Neither exclusion is reported as a Task-34 skip.

## Deterministic human-review captures

| Capture | Dimensions | Evidence role |
|---|---:|---|
| `home-origin-dark-horizontal-1440x900.png` | 1440x900 | Real shared origin and prominent approved clef, dark |
| `home-origin-light-horizontal-1440x900.png` | 1440x900 | Same origin/composition, light |
| `professional-integrated-score-1440x900.png` | 1440x900 | Real Professional Services segment and notation |
| `application-integrated-score-1440x900.png` | 1440x900 | Real APP-04 segment and notation-safe routing |
| `horizontal-enhanced-professional-projects-1536x900.png` | 1536x900 | Enhanced projection around the real project fan |
| `vertical-wide-professional-1024x900.png` | 1024x900 | Vertical-wide Professional process routing |
| `vertical-compact-application-390x844.png` | 390x844 | Compact Application routing and reserved content |
| `reduced-static-home-1200x900.png` | 1200x900 | Reduced-motion static vertical-wide projection |
| `professional-final-barline-1440x900.png` | 1440x900 | Professional thin+thick physical terminal |
| `application-final-barline-1440x900.png` | 1440x900 | Application thin+thick physical terminal |

All captures were generated from the configured local review server with the
public Turnstile test key, production deployment boundary, and transition test
mode. They are review evidence only, never shippable backgrounds or pixel
goldens.

## Integrity and safety

`SHA256SUMS.txt` covers this record and all ten screenshots (11 payload files).
`SHA256SUMS.txt.sha256` authenticates that manifest. Both are verified with
`sha256sum --check --strict` after the payload is closed.

This record authorizes human review of Task 34 only. Task 35 is unchecked,
Phase 10 is untouched, public `/` is not cut over, and no Task-34 commit, push,
deployment, production mutation, or DNS change is included.
