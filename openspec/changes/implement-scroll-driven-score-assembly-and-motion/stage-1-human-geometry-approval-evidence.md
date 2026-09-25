# Stage 1 Human Geometry Approval evidence

The [owner small-desktop verification](stage-1-hga-001c-owner-profile-verification.md)
now **fails** at the actual Firefox 1366×611 and Chromium 1366×639 layout
profiles: a focused Projects card and its outline are obscured by the sticky
header. Its [six new captures and structured record](stage-1-hga-001c-evidence/owner-small-desktop/verification.json)
are the current HGA-001C review evidence. The prior exact 1366×768 result and
11-capture package below remain valid only for their recorded viewport.
HGA-001C owner-device readiness is blocked; task 5.6 and HGA-002 remain open.

The owner-corrected HGA-001C Motion Lab presentation package is now
[ready for human review](stage-1-hga-001c-result.md), with an
[11-capture manifest](stage-1-hga-001c-evidence/manifest.json). This first
review package and its `CHANGES_REQUESTED` disposition remain historical;
HGA-002 and task 5.6 are still pending. The new evidence does not claim a
public immersive-story integration or Human Geometry Approval.

```text
HUMAN_GEOMETRY_EVIDENCE=READY
EVIDENCE_ITEMS=11
CHROMIUM_ITEMS=9
FIREFOX_ITEMS=1
WEBKIT_ITEMS=1
HORIZONTAL_ENHANCED_INCLUDED=true
SAFE_FALLBACK_INCLUDED=true
TABLET_INCLUDED=true
MOBILE_INCLUDED=true
REDUCED_MOTION_INCLUDED=true
EVIDENCE_PATH=openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-human-geometry-approval-evidence.md
HUMAN_GEOMETRY_APPROVAL=PENDING
```

Owner review result recorded on 2026-09-23:

```text
HUMAN_GEOMETRY_APPROVAL=CHANGES_REQUESTED
```

The requested bounded deltas are `HGA-001` (native 1366×768 desktop support)
and `HGA-002` (desktop composition density). Task 5.6 remains open while those
deltas are implemented, validated, and returned for another owner review.

## Current HGA disposition — ADR-055 / ASM-IMP-DEC-018

| Finding | Status | Review boundary |
| --- | --- | --- |
| HGA-001A | RESOLVED | Local offset loop corrected; dated result and regression retained. |
| HGA-001B | EXPECTED_CAPACITY_REJECTION / NOT_A_PRODUCT_DEFECT | Preserve raw Projects insufficiency and canonical whole-story fallback at 1366. |
| HGA-001C | BLOCKED_OWNER_PROFILE | The 1366×768 Motion Lab result still passes, but real owner-layout heights expose Projects focus/header clipping; see the bounded owner-profile result. |
| HGA-002 | OPEN | Separate measured macro-gutter/inter-scene density work; preserve protected component spacing and Projects. |

The architecture review selects desktop-quality `vertical-wide`, preserves
ADR-048/049/050 and introduces no responsive mode. These eleven captures remain
the first-review package, not post-correction acceptance evidence. The owner
must still judge desktop composition independently from automated geometry.
No new captures or product changes were made in the architecture review.
See [the current continuation contract](stage-1-hga-model-handoff.md).

## Scope and review boundary

This package is the bounded owner-review subset selected from the completed
63-observation portfolio-only validation manifest. It covers the canonical
`HOME / ORIGIN → PROFESSIONAL / PORTFOLIO` topology without rerunning the
matrix or changing product geometry, runtime, Composer, Projection, Projects,
responsive policy, or validation assertions.

Every capture was taken after terminal bootstrap readiness, with the bootstrap
cover absent, the motion lab lifecycle mounted, fonts ready, and two settled
animation frames. The linked [machine-readable manifest](stage-1-human-geometry-approval-evidence/manifest.json)
records the browser version, readiness state, integrity facts, screenshot
SHA-256, and interaction proof. Automated facts support review but do not
constitute Human Geometry Approval.

## Representative evidence

| Evidence | Browser | Viewport | Route / chapter | Responsive mode | Projects capacity | Safe fallback | Motion | Source validation observation | Review purpose |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| [HGE-001](stage-1-human-geometry-approval-evidence/screenshots/hge-001-chromium-home-1536x900.png) | Chromium | 1536×900 | `/__visual-lab/story/motion` / `home` | `horizontal-enhanced` | `PASS` | `false` | `no-preference` | `CHROMIUM-GEO-02` | Home / single spatial origin |
| [HGE-002](stage-1-human-geometry-approval-evidence/screenshots/hge-002-chromium-professional-process-1536x900.png) | Chromium | 1536×900 | `/__visual-lab/story/motion` / `professional-process` | `horizontal-enhanced` | `PASS` | `false` | `no-preference` | `CHROMIUM-LIFE-01` | Normal desktop Professional progression |
| [HGE-003](stage-1-human-geometry-approval-evidence/screenshots/hge-003-webkit-professional-projects-1536x900.png) | WebKit | 1536×900 | `/__visual-lab/story/motion` / `professional-projects` | `horizontal-enhanced` | `PASS` | `false` | `no-preference` | `WEBKIT-PC-04` | Horizontal Projects and representative WebKit rendering |
| [HGE-004](stage-1-human-geometry-approval-evidence/screenshots/hge-004-chromium-professional-projects-1920x917.png) | Chromium | 1920×917 | `/__visual-lab/story/motion` / `professional-projects` | `vertical-wide` | `INSUFFICIENT_CAPACITY` | `true` | `no-preference` | `CHROMIUM-PC-05` | Capacity-selected whole-story fallback |
| [HGE-005](stage-1-human-geometry-approval-evidence/screenshots/hge-005-chromium-professional-projects-1100x640.png) | Chromium | 1100×640 | `/__visual-lab/story/motion` / `professional-projects` | `vertical-wide` | `INSUFFICIENT_CAPACITY` | `true` | `no-preference` | `CHROMIUM-PC-06` | Registered capacity/breakpoint boundary candidate; fan framed at its start |
| [HGE-006](stage-1-human-geometry-approval-evidence/screenshots/hge-006-chromium-professional-projects-900x1024.png) | Chromium | 900×1024 | `/__visual-lab/story/motion` / `professional-projects` | `vertical-wide` | `n/a` | `false` | `no-preference` | `CHROMIUM-GEO-05` | Tablet composition |
| [HGE-007](stage-1-human-geometry-approval-evidence/screenshots/hge-007-chromium-professional-projects-390x844.png) | Chromium | 390×844 | `/__visual-lab/story/motion` / `professional-projects` | `vertical-compact` | `n/a` | `false` | `no-preference` | `CHROMIUM-GEO-06` | Mobile composition |
| [HGE-008](stage-1-human-geometry-approval-evidence/screenshots/hge-008-chromium-professional-projects-1536x900.png) | Chromium | 1536×900 | `/__visual-lab/story/motion` / `professional-projects` | `horizontal-enhanced` | `PASS` | `false` | `no-preference` | `CHROMIUM-PC-02` | Keyboard focus on the first Projects card; focus, transform, stack, and outline recorded |
| [HGE-009](stage-1-human-geometry-approval-evidence/screenshots/hge-009-firefox-professional-contact-1536x900.png) | Firefox | 1536×900 | `/__visual-lab/story/motion` / `professional-contact` | `vertical-wide` | `INSUFFICIENT_CAPACITY` | `true` | `no-preference` | `FIREFOX-GEO-02` | Contact geometry and representative Firefox rendering |
| [HGE-010](stage-1-human-geometry-approval-evidence/screenshots/hge-010-chromium-professional-terminal-1536x900.png) | Chromium | 1536×900 | `/__visual-lab/story/motion` / `professional-terminal` | `horizontal-enhanced` | `PASS` | `false` | `no-preference` | `CHROMIUM-GEO-02` | Professional terminal and global-footer handoff |
| [HGE-011](stage-1-human-geometry-approval-evidence/screenshots/hge-011-chromium-professional-projects-1440x900.png) | Chromium | 1440×900 | `/__visual-lab/story/motion` / `professional-projects` | `static` | `n/a` | `false` | `reduce` | `CHROMIUM-GEO-07` | Reduced Motion static Projects presentation |

`projects_capacity_result=n/a` means the capacity predicate is not applicable
to that responsive mode. `safe_fallback` is reported independently and does
not imply validation approval. HGE-003 reached the canonical stable fail-open
bootstrap state (`DEGRADED`) with no cover, mounted lifecycle, no page error,
and the validated geometry intact; it is not a transitional loading capture.

## Owner checklist

- [ ] Home is clearly the single spatial origin.
- [ ] No obsolete Application-side reservation is visible.
- [ ] Professional chapters form a coherent continuous progression.
- [ ] Staff/score continuity is visually credible.
- [ ] No content is visibly clipped.
- [ ] No unexpected horizontal overflow is visible.
- [ ] Projects fan remains recognizable and usable.
- [ ] Projects visits/focus states retain required clearance.
- [ ] Fallback mode looks intentional rather than broken.
- [ ] Tablet/mobile composition is coherent.
- [ ] No gross browser-specific visual divergence is apparent.
- [ ] Terminal Contact/footer geometry is correct.

## Approval record

The owner completed the first review with `CHANGES_REQUESTED`; this is not an
approval. Task 5.6 remains open. Geometry Refreeze and every later stage remain
blocked until a later explicit approval exists.
