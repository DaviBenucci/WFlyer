# Stage 1 HGA architecture resolution and bounded implementation handoff

> **SUPERSEDED OPERATIONAL PLAN — 2026-09-24:** ADR-057 / ASM-IMP-DEC-020
> replaces the viewport-contained target and pauses/supersedes HGA-002 margin
> remediation. All earlier instructions and status text below are historical.
> Use the [continuous-story implementation package](continuous-story-implementation-package.md)
> and current tasks (25/55); Human Geometry Approval remains pending against the
> unimplemented new target. HGA-001A–D evidence remains preserved.

## Retained pre-continuous-story checkpoint

## Current owner-device verification stop — 2026-09-24

The [bounded owner-profile verification](stage-1-hga-001c-owner-profile-verification.md)
failed at the physical notebook's Firefox 1366×611 and Chromium 1366×639
layout viewports. Both still select `vertical-wide`/desktop with zero complete
staff self-intersections, but the focused Projects card is taller than the
usable area below the sticky header; its top metadata and focus outline are
obscured. The 1366×768 implementation result below remains a valid earlier
viewport checkpoint, not proof for the owner's actual low-height profiles.
No repair was authorized in this verification. HGA-001C owner-device readiness
is blocked; HGA-002 and task 5.6 remain pending. Stop for a bounded owner
decision without changing Projects, capacity, ADR-055 or public integration.

## Current completion — 2026-09-24

The owner-corrected HGA-001C Motion Lab implementation is complete and
[ready for human review](stage-1-hga-001c-result.md). The bounded
[11-capture manifest](stage-1-hga-001c-evidence/manifest.json) and focused
Chromium/Firefox/WebKit checks support 1366×768 unforced `vertical-wide` with
desktop presentation. Projects still rejects horizontal capacity at 1366 as
required. HGA-001A remains resolved, HGA-002 remains pending, and task 5.6
remains unchecked at 30/51. The earlier implementation instructions below are
retained as history, not a request to reimplement. Public immersive integration
was not started or validated. Stop for owner review; do not begin HGA-002 or
Geometry Refreeze automatically.

## Current owner clarification — 2026-09-24

The owner resolved the public-surface conflict below: **HGA-001C acceptance
belongs to the canonical Stage-1 Motion Lab** at
`/__visual-lab/story/motion`. At 1366x768 and 100% browser zoom, measure the
ordinary desktop environment, unforced `vertical-wide` story mode and a
distinct desktop presentation. Use Home, all Professional scenes, header,
Projects fan and terminal on that surface for validation and bounded captures.
Public `/` and independent Professional routes retain their current owners;
immersive public integration is a later authorized Assembly/Motion stage and
is not validated by HGA-001C. No RouteAwareExperienceBoundary exposure change.
ADR-055 / ASM-IMP-DEC-018 and every Projects capacity/clearance contract remain
authoritative. HGA-001A stays resolved; HGA-001B stays an expected rejection;
HGA-002 remains a separate later pass. Resume BOUNDED_IMPLEMENTATION / HIGH,
then stop with representative evidence at task 5.6 without self-approval.

## Historical stop — public-surface acceptance conflict, 2026-09-24

The latest HGA-001C instruction requires `1366_STORY_MODE=vertical-wide` on the
real **public** Home/About/Services/Process/Projects/Contact surface. That
surface does not currently exist as one immersive story. Public `/` renders
`BrandIntroController` and a standalone Home; `/sobre`, `/servicos`,
`/processo`, `/portfolio` and `/contato` are independent `ChapterPage` routes.
Only development `/__visual-lab/story/motion` mounts `MotionStoryLab`, the
Projects capacity evaluator, `data-projection-mode` and the six story scenes.
`RouteAwareExperienceBoundary` confines the story chrome/provider to its lab
subtree; `src/app/layout.tsx` enables that subtree only outside production.
The public shell has no `StoryProjectionMode` or `vertical-wide` decision.

This is a **scope/architecture conflict**, not a reason to change eligibility or
Projects. `WFLYER_IMPLEMENTATION_PLAN.md` explicitly keeps Phase-5 Motion Lab
development-only while public `/` remains a rollback baseline; successor
`ASM-IMP-DEC-018` also names public `/` and Visual Lab Home as separate owners.
Adding the immersive story to public routes would be a public cutover and change
the stage gate. Lab-only styling could be implemented, but could not satisfy the
explicit public-mode acceptance or provide truthful public chapter evidence.

Focused route-boundary/Home tests on 2026-09-24: 2 files, 5 tests PASS. They
corroborate source ownership; no browser matrix was run. HGA-001C remains OPEN,
HGA-002 remains PENDING, Human Geometry Approval remains pending, OpenSpec stays
30/51. Strict active-change and workspace OpenSpec validation pass (17/17), and
the changed handoffs parse as YAML. No HGA-001C product patch was made. Full
`git status --porcelain=v1 -uall` reports 1,040 dirty files, zero staged;
these include the retained successor work and unrelated `.env.example`. No
staging or commit occurred.

**Minimum owner decision:** either retain HGA-001C as a Stage-1 Visual Lab
presentation gate and defer the new public-mode acceptance until an explicitly
authorized later public cutover, or explicitly revise stage/cutover authority to
bring the immersive story onto public routes now. The first option preserves the
existing phase order. The latter needs a separate architectural scope decision;
the latest commit authorization does not itself supply it. Do not silently
weaken the public criterion or begin either implementation path until decided.

The implementation-ready text below is active again under the owner-corrected
Motion Lab acceptance surface above. The public-mode requirement that caused
this historical stop is superseded.

```text
ARCHITECTURE_REVIEW=RESOLVED
1366_HORIZONTAL_REQUIRED=false
1366_SUPPORTED_DESKTOP_REQUIRED=true
DESKTOP_INSUFFICIENT_CAPACITY_MODE=vertical-wide
MOBILE_MODE=vertical-compact
VERTICAL_WIDE_IS_DESKTOP_PRESENTATION=true
ADR_048_STATUS=PRESERVED
ADR_049_STATUS=PRESERVED
ADR_050_STATUS=PRESERVED
HGA_001A_STATUS=RESOLVED
HGA_001B_STATUS=EXPECTED_CAPACITY_REJECTION_NOT_A_PRODUCT_DEFECT
HGA_001C_STATUS=OPEN
HGA_002_STATUS=OPEN
NEXT_ROUTING_CLASS=BOUNDED_IMPLEMENTATION
NEXT_REASONING_PROFILE=HIGH
IMPLEMENTATION_SCOPE=HGA-001C_DESKTOP_PRESENTATION_THEN_SEPARATE_HGA-002_NON_PROJECTS_MACRO_SPACING_UNDER_ASM-IMP-DEC-018
HUMAN_GEOMETRY_APPROVAL=PENDING_CHANGES_REQUESTED
PRODUCT_CODE_CHANGED_IN_ARCHITECTURE_REVIEW=false
```

`vertical-wide` supports desktop presentation and appropriate wide tablets; it
is not a claim that every wide viewport has desktop input. Reduced motion uses
`static` with wide/compact presentation. No `vertical-mobile` mode or new enum.

## Authority and exact state

ADR-055 in the canonical decision register selects A; ASM-IMP-DEC-018 specifies
its bounded implementation. Alternatives B (Projects redesign), C (new compact
horizontal mode) and D (weakened clearance) are not authorized. The canonical
responsive document and active responsive spec distinguish capability,
orientation and presentation. Existing 048/049/050 and 012/013/014 remain intact.

Branch `develop/site-institucional`, HEAD
`40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`, exact dirty worktree retained. Active
change `implement-scroll-driven-score-assembly-and-motion`: 30/51, task 5.6 open.
The previous prompt to implement HGA-001A is superseded because that repair is
complete; do not execute it again. Dated diagnostics and result files remain
unchanged, including the prior STOP now resolved by this architecture decision.

## Evidence retained without reinterpretation

[HGA-001A result](stage-1-hga-001a-result.md) and
[runtime evidence](stage-1-hga-001a-runtime-residual.json) prove the former loop
is absent and the actual unforced 1366x768 candidate still fails Projects:

| Visit | Minimum clearance (CSS px) |
| --- | ---: |
| 1 | -37.10076674891491 |
| 2 | 11.91535072258615 |
| 3 | -20.26344607345662 |

Required minimum remains 12px. Sole rejection:
`projects-protected-clearance-or-clip`; selected mode: `vertical-wide`.
The failing raw candidate stays `INSUFFICIENT_CAPACITY`. That is expected policy,
not a numerical-tolerance issue, product defect or proof of fallback validation.
Do not force horizontal mode, relax assertions or make density a capacity fix.

The completed 63/63 matrix and 11-item capture package remain prior checkpoints.
No matrix or browser capture was run during this architecture review. The
selected 1366 vertical presentation must be measured and reviewed in the next
bounded work; the original forced-horizontal diagnostics do not establish it.
Existing source already retains desktop header/grids at 1366; the owner's
quality concern remains OPEN and cannot be decided by mode name or unit PASS.

## First action and implementation owners

Read AGENTS, CURRENT_AGENT_HANDOFF and ASM-IMP-DEC-018, then measure stable
actual `vertical-wide` presentation at 1366x768 with ordinary desktop input and
100% zoom as a reproduction condition only. Record readiness, selected mode,
capacity result and actual content/staff bounds. Compare use of width,
alignment and gutters with the existing desktop controls. No zoom detection,
zoom workaround, device sniffing or new breakpoint.

The smallest presentation owners are:

- `src/components/story/professional-chapter-scene.module.css`: non-Projects
  scene widths, grids and alignment; exclude Projects selectors.
- `src/components/story-motion/motion-story-lab.module.css`: scoped Home and
  non-Projects chapter macro padding/alignment; avoid shared effects on Projects.
- Verify public `/` separately (`src/app/page.tsx`, `page.module.css` and
  BrandIntro lifecycle); it is not the Visual Lab Home. Verify header/footer
  usability without presuming new navigation or duplicate terminal controls.

Eligibility/runtime, Projects capacity and Projects geometry are not repair
owners for HGA-001C. Reuse existing responsive selectors. HGA-002 is a separate
subsequent delta; do not couple it to obtaining horizontal capacity.

## Preserved HGA-002 baseline and safe density boundary

The original forced-horizontal diagnostic at 1366 records:

| Chapter | Internal gap | Leading / trailing macro gutter | Adjacent distance |
| --- | ---: | ---: | ---: |
| About | 40.96875 | 94.796875 / 95.796875 | 293.046875 to Services |
| Services | 32.78125 | 197.25 / 198.25 | 266.546875 to Process |
| Process | 40.96875 | 68.296875 / 69.296875 | 437.296875 to Projects |
| Contact | 54.625 | 94.796875 / 95.796875 | 463.796875 from Projects |

All values are CSS pixels; source:
[intersection diagnostics](stage-1-hga-intersection-diagnostic.json), with
[causal model](stage-1-hga-001-causal-model.json). Retain these historical inputs;
measure the current selected mode separately before choosing a density change.
Prioritize excessive macro gutters and non-Projects inter-scene distances over
internal spacing. Visual cohesion is the aim, not global scaling. Preserve any
space necessary for protected ink, interaction and continuity.

Vertical-wide chapter block sizes are set by `--story-score-wide-block-size`
from `STORY_SCORE_APPROVED_SECTION_BLOCK_SIZES`, supplied through MotionStoryLab
and Projection/organic-flowing. They are not arbitrary CSS whitespace.
Do not shrink CSS heights independently. Any bounded non-Projects distance
adjustment must keep DOM/Projection coordinates coherent; stop if it requires
Projects geometry/entry/exit changes or a new geometry architecture. Changing
these spans is not the first action, and this review made no such change.

## Validation and stops for the later implementation

- Keep HGA-001A's saved 1366 regression and 1440 passing control, Batch-1/2,
  ADR-046, semantic fingerprints, full original-segment intersection, event-safe,
  full-ink, all three Projects visit/focus and 12px validators enabled.
- After a local edit, run the smallest affected deterministic/layout checks,
  focused lint/typecheck and affected readiness/a11y/browser controls. Include
  the actual unforced 1366 vertical layout, a still-qualifying horizontal control,
  and relevant tablet/compact/static checks. Retain raw candidate status separately.
- Persist HGA-001C and HGA-002 evidence separately. Do not restart all 63 completed
  observations as diagnosis; use bounded representative post-change evidence
  for the owner, never substitute old screenshots or auto-PASS for human judgment.
- Preserve Projects dimensions/content/fan, visits/NON-ASSEMBLY, Composer/seed,
  approved glyphs, all existing repairs and frozen/history/audit artifacts.
- Stop for new defects, required scope/architecture/invariant changes, or two
  bounded attempts without material causal progress; use the canonical routing
  registry for the diagnosis handoff. Do not resume ASM-AUDIT-001.
- Stop at task 5.6 for owner review. No self-approval, Geometry Refreeze, Assembly,
  GSAP, Stage 2+, commit, push or deploy.

## Governance validation

Completed on 2026-09-23:

- `openspec validate implement-scroll-driven-score-assembly-and-motion --strict`:
  PASS; workspace `openspec validate --all --strict`: 17/17 PASS.
- Changed handoff YAML blocks: 2/2 parse; referenced HGA JSON: 3/3 parse.
- ADR-055 and ASM-IMP-DEC-018: unique live identifiers; prior ADR-048/049/050
  and ASM-IMP-DEC-012/013/014 sections remain byte-identical to turn entry.
- Preservation snapshot: 1,470 source/test/tooling/historical/evidence/spec
  files outside the documentation edit set remain SHA-256 identical, including
  HGA-001A results, raw diagnostics, captures and density measurements.
- Scoped `git diff --check -- . ':!.env.example'`: PASS. Full diff check
  retains only the pre-existing `.env.example:9` trailing whitespace/blank EOF;
  that unrelated file was not changed in this review.
- OpenSpec remains 30/51; task 5.6 is unchecked. HEAD/branch unchanged.

Fourteen existing documentation files were reconciled. No product code, tests,
browser matrix or captures changed. This is bounded implementation readiness,
not implementation completion, selected-mode validation or human visual PASS.
