# ASM-PC-001 fallback authorization review — 2026-09-10

Owner decision: capacity-based responsive fallback APPROVED. Canonical authority:
**ADR-048 / ASM-IMP-DEC-012**, begun on 2026-09-09 and completed under the
2026-09-10 vertical-support continuation. This resumes the existing decisions;
no new ADR/ASM number or second inherited defect is invented.

## Current implementation boundary

ASM-PC-001 is one inherited PROJECTS-P3 root, O01/O02/O03 at 1100x640. Original
STOP and lineage/capacity review/JSON remain immutable. The full-constructor
proof on actual saved inputs is sufficient; no new historical DOM claim.
Current HEAD is `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`; the dirty worktree
contains the completed five-delta work, 14 Batch-1 repairs, six Batch-2 repairs
and ADR-046 hydration/numeric correction. Preserve all of it.

The new boundary consists of four related items: inherited horizontal capacity
failure; capacity-based enhanced eligibility; compatible whole-story vertical
fallback; and minimum vertical Projects three-visit support required by that
fallback. The last item is an implementation dependency, not another defect.

| Owner / module | Permitted responsibility |
| --- | --- |
| `src/lib/story/motion/eligibility.ts` | Existing coarse eligibility plus complete candidate capacity; final whole-story mode decision |
| `src/lib/story/motion/runtime.ts` | Readiness/build/rebuild transaction, latest generation, one commit, cancellation and cleanup |
| `src/lib/story/motion/geometry.ts`, `positioning.ts` | Chapter/branch/projectIndex and representable semantic fraction or same/nearest valid visit anchor |
| `src/components/story-motion/MotionStoryLab.tsx` | Inject measurement callback into runtime, preserve bootstrap identity |
| `src/components/story-score/measurement.ts`, `StoryScoreLayer.tsx` | Share actual collection/normalization, measure selected vertical Projects, synchronize only committed mode |
| Focused component-side candidate measurement helper | Inert nonpainted production-style horizontal layout probe, independent of current fallback; exact equivalent shared interaction envelopes |
| `src/components/projects/project-cards.module.css` | Only production/probe state aliases or shared state parameters; no visible fan redesign |
| `src/lib/story/score/projects-capacity.ts` (planned pure helper) | Immutable candidate geometry/ink/bounds input → PASS/INSUFFICIENT_CAPACITY/NOT_READY/INVALID with per-visit reasons; no mode policy or DOM |
| `src/lib/story/score/projection.ts` | Candidate/selected-mode geometry authority, local vertical Projects adapter, measurements in cache key and explicit coordinate conversion |
| `src/lib/story/score/organic-flowing.ts` | Existing base/range structures; only a necessary shared type/facility extension, not generic builder rewrite |
| Scoped unit/component/e2e helpers and capture script | Required capacity/visit/clearance/ink/lifecycle regression and successor evidence |

Existing AuthoredTrackGeometry.notationRanges already supports repeated
chapterId, semanticSlotIds and projectVisit; buildZones propagates visits and
creates event-free gap connectors. Reuse that capability for three local safe
regions, not a new vertical framework. Preserve the first visit's primary event
and complete ink, reserved/empty visits 2/3, local horizontal/LTR notation,
12px actual clearance and full staff visibility. Scope is the existing Projects
chapter interval and minimum Process/Contact join support. If that scope cannot
pass, STOP; no card/section dimension or unrelated geometry change is authorized.
Numerical implementation acceptance is pending, not inferred from structure.

Candidate evaluation uses immutable normalized layout/scene inputs, raw
protected/interaction bounds, clip/coordinate transforms, stable layout revision
and existing Composer-backed Projection. It runs through existing post-hydration
font/readiness/build lifecycle. Current fallback geometry cannot be candidate
input. Equal external inputs have one decision; mode/probe observer effects
cannot create generations, stale work cannot commit, ordinary scrub/scroll
cannot measure. SSR/first client and candidate telemetry separation stay intact.

Resize preserves projectIndex across modes and semantic progress where valid.
If sub-visit progress cannot map, settle at that visit's safe anchor; for a gap
choose nearest bracketing visit, lower index on ties. No chapter-start/Home reset,
Home replay, composition regeneration, bootstrap remount or new scroll owner.

## Focused acceptance and subsequent High work

First add fixtures/tests before implementation:

- Negative: `stage-1-projects-lineage-and-capacity-diagnostics.json`,
  `reproduction.replayInput` plus occurrences' raw card bounds and saved full
  rendered metrics from the linked STOP diagnostic. 1100x640 is a fixture,
  not the policy trigger.
- Positive: measured 1536x900 in
  `tests/fixtures/story-score/stage1-batch2-measurements.json`; keep 1440x900
  and 1920x917 regressions. Prior Chromium passes are not a complete new
  interaction-capacity PASS.
- Cases A–J in responsive-story-mode: negative/positive and same-viewport
  capacity variations; three vertical regions; first event/full ink; empty
  visits 2/3; both resize directions; no oscillation/Home replay; hydration;
  Professional-first mobile/static narrative; complete global geometry.
- Keep all earlier projection/event-safety/successor/Batch-2/component/hydration
  tests enabled. Retain the **pure horizontal** 1100x640 Batch-2 fixture; changing
  the browser's final mode must not hide those five repaired Professional defects.
- Replace vertical visits:[]/count-only audit exemptions with actual mode-local
  visit, clearance, full-ink and visibility checks. Keep complete cross-run
  segments, 1025 staff points, 2049 center replay and 1e-7 guards.

After focused and deterministic global geometry is clean, run a fresh full
serial Chromium/Firefox/WebKit matrix on the new candidate: the previous five
files (assembly-stage1-geometry, assembly-stage1-hydration, phase09-score-
integration, phase09-score-path-review, phase09-score-refinement) plus new
capacity/transition cases, workers=1 and retries=0. Previous result 3 passes /
1 failure / 128 unexecuted is historical checkpoint evidence, not reusable
acceptance for the changed implementation. Do not resume at test 5.

Then finish and inspect successor-only Stage-1 evidence: both batches' mappings,
ASM-PC-001 root/three occurrences, baseline/capacity-rejection/accepted fallback,
mode/viewport/engine, exact worktree provenance, and four historical seals/64
payloads. STOP at Human Geometry Approval. OpenSpec remains 7/92; no human gate
or repair checkbox is satisfied by this normalization. Stage 2+, successor
motion, commit, push, deploy, archive and public cutover remain unauthorized.

## Governance validation

Results and exact worktree status are recorded in
`stage-1-projects-capacity-governance-validation.json`. This run performs only
strict successor/workspace, structured/YAML, diff and historical integrity
checks, with a byte inventory proving no runtime/test/script/public changes.
No browser matrix, broad test suite, final capture or runtime repair runs here.

Final result: **PASS**. Successor strict validation passed; workspace strict
validation passed 17/17. Four canonical YAML blocks, the handoff YAML and active
JSON records validate. All four Phase-9 manifest/seal pairs and 64 payloads are
unchanged against the saved Stage-0 and frozen Phase-9 references. Ten immutable
successor records and all 543 protected runtime/test/script/public files retain
their recorded bytes. `git diff --check` passes. Progress remains 7/92 and Human
Geometry Approval remains pending. Governance is complete; STOP Ultra and hand
off the bounded implementation to Astra High.
