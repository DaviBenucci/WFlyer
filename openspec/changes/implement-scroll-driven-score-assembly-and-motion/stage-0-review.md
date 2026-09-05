# Stage-0 completion review

**Review date:** 2026-09-05.

**Status:** Stage 0 COMPLETE; Gate 0 PASS; owner Stage-0 approval recorded.

**Stage 1:** not started; implementation authorization pending.

**Geometry approval/refreeze:** not performed.

## Authority and predecessor provenance

The normative source is
`docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`
under the precedence in `AGENTS.md`. This review is a derived operational
record, not a new technical authority.

- Phase 9 closed on 2026-09-04; Gate 9 PASS; Task 35 complete. These facts are
  recorded in the implementation plan, ADR-043, current handoff, and parent
  OpenSpec task list.
- Frozen implementation/evidence baseline:
  `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
- Closure-record commit and HEAD inspected in this review:
  `a20d52ac9f214d385ea7c210b2ab45aa84095fc8`. Its immediate parent is the
  frozen baseline. No successor runtime commit exists in that range.
- Initial worktree contained only the untracked successor change directory:
  proposal, design, seven specs, and `.openspec.yaml` dated 2026-09-04.
  `tasks.md` was absent. The interrupted artifacts were preserved and completed.
- Historical Phase-9 files and approval claims remain unchanged. Stage-0
  planning does not approve new geometry or reopen Gate 9.

## Historical evidence verification

All paths below are under `docs/canonical-v2/06-migration/evidence/phase-9/`.
Each `SHA256SUMS.txt` matched its recorded digest and was byte-identical to the
baseline and closure commits. `sha256sum --check` from each bundle directory
verified all 64 listed payloads.

| Bundle | Payloads | Manifest SHA-256 |
|---|---:|---|
| `task-33-refinement-2026-08-30/` | 11 | `10ce142087e3e249842f04c2d47a47d988ac499c71f13f7da7a6fd267659cba0` |
| `task-34-integration-review-2026-08-31/` | 11 | `c4bec2d7f6b546c44d9b7bd053ad0b4ff0c42d1d143cc079dd0714068c3fef8a` |
| `task-34-refinement-2026-08-31/` | 28 | `1ce1043412c6ad77b34c0d77bad565cb9aef3af6808c8b54d48b0d7e13fdc442` |
| `task-34-refinement-firefox-correction-2026-09-04/` | 14 | `807a15b57e1a5bbc88011d546e69d4a4b281c552344876cddfc3a17042392923` |

## Verified live owners

Paths are relative to this repository and describe the inspected baseline.
They are navigation aids, not blanket edit permissions.

| Responsibility | Actual file / boundary | Stage-1 treatment |
|---|---|---|
| Module/session semantic compositions and fingerprints | `src/lib/story/score/composition.ts` | Preserve seed, two Composer invocations, `fnv1a32:039bce10` and `fnv1a32:1fe3356b`; no semantic changes. |
| Score geometry | `src/lib/story/score/projection.ts` | Primary owner for the five bounded deltas. |
| Imported zone/event allocation helpers | `src/lib/story/score/organic-flowing.ts` (`buildZones`, `notationZoneForSlot`, `noteTsForSlot`, `buildReviewModel`) | Limit changes to required projection allocation/classification; preserve unrelated shared fixtures. |
| Approved origin geometry/calibration | `src/lib/story/score/shared-origin.ts` | Preserve approved glyph/calibration/topology; use Projection for minimal successor entry geometry. |
| Measurement normalization | `src/components/story-score/measurement.ts` | Bounded layout/content measurement only. The candidate `src/lib/story/score/measurement.ts` is absent. |
| DOM measurement, Projection rebuild and rendering orchestration | `src/components/story-score/StoryScoreLayer.tsx` | Only geometry input/output changes required by Stage 1; no motion binding. |
| Integrated development story and Home placeholder | `src/components/story-motion/MotionStoryLab.tsx` | Minimal Home entry/content-envelope geometry if necessary; retain existing runtime wiring. `StoryChapter.tsx` is a separate static skeleton, not this Home owner. |
| Native-scroll master runtime and traversal | `src/lib/story/motion/runtime.ts` | Retained temporal authority; successor motion implementation deferred. |
| Responsive eligibility, story mapping and traversal duration | `src/lib/story/motion/eligibility.ts`, `geometry.ts`, `positioning.ts`, `traversal.ts` | Preserve mode selection, canonical scroll mapping, restoration and the 3-second maximum. |
| Navigation state and header | `src/components/story/StoryNavigationContext.tsx`, `StoryV2Header.tsx` | Preserve controller/header behavior; compact header/sheet are later stages. |
| Branch scenes, semantic order and footer | `src/components/story/ProfessionalChapterScene.tsx`, `ApplicationChapterScene.tsx`, `StoryGlobalFooter.tsx`; `src/lib/story/manifest.ts` | Preserve content, Projects visits, scene exclusions, order and one mobile footer. |

Geometry landmarks in `projection.ts` include `prependApprovedOrigin`,
`resolveHorizontalHomeOrigin`, `resolveHorizontalApplicationFamilyA`,
`horizontalChapterShelves`, `horizontalApplicationBoundaryBridge`, and
`horizontalGeometry`. Reinspect symbols/paths before implementation.

Existing focused regression entry points include:

- `tests/unit/story/story-score-projection.test.ts`;
- `tests/unit/story/story-score-measurement.test.ts`;
- `tests/unit/story/story-score-composition.test.ts`;
- `src/components/story-score/StoryScoreLayer.test.tsx`;
- `tests/e2e/phase09-score-integration.spec.ts`;
- `tests/e2e/phase09-score-refinement.spec.ts`.

Retain the projection suite's exact Firefox 1920×917 and 1536×864 fixtures,
plus existing 1920×1200 browser coverage and Demo/Launch/Projects audits.

`scripts/capture-phase9-refinement-evidence.mjs` and
`scripts/capture-phase9-firefox-demo-correction-evidence.mjs` hardcode
historical evidence destinations. They are reference fixtures for a new
successor capture workflow, not jobs to rerun into the Phase-9 seals.

## Contract review and corrections

The review covers the proposal, design, seven delta specs, and Stage 0–18
task sequence against canonical §§6–9 and §§25–33.

| Finding | Resolution |
|---|---|
| Stage-0 file-owner reconciliation was deferred until Stage 1. | Recorded the live map above and corrected proposal/design, including the stale conceptual measurement path. |
| Responsive spec used optional simplification. | Require vertical-wide and vertical-compact to reduce Scenic/Structural geometric complexity per `ASM-DEC-031`. |
| Fast Traversal spec made staff progression optional. | Require staff progression, draw/erase, canonical path state, and Assembly when required; Composer events remain disabled per §17.3. This also resolves the initial strict-validation warning. |
| Implementation checklist was missing. | Complete the canonical Stage 0–18 dependency sequence, with Stage 1 and all later work unchecked. |
| Current-status documents still described an uncreated successor. | Reconcile administrative status with the completed planning package, preserving Phase-9 closure and all technical decisions. |

The canonical document actually defines `MOT-DEC-001..009` and
`MOT-DEC-025..035`. `MOT-DEC-010..024` have no defined clauses there. The family
shorthand `MOT-DEC-001..035` is retained; missing identifiers are not invented
requirements or permission to infer behavior. Defined contracts and detailed
state sections remain authoritative.

The five geometry deltas, minimal Stage-1 Home preparation versus Stage-9
Scenic presentation, human approval/refreeze dependency, desktop orientation,
Professional-first mobile order, ownership separation, event safety,
Projects exclusion, deterministic reverse behavior, and traversal
cancellation/replacement agree with the canonical source.

## Gate-0 validation

| Check | Result |
|---|---|
| `openspec status --change implement-scroll-driven-score-assembly-and-motion --json` | All four planning artifacts done: proposal, seven specs, design, tasks. CLI planning completeness does not authorize implementation. |
| `openspec validate implement-scroll-driven-score-assembly-and-motion --strict --no-interactive --json` | PASS, 1/1, no issues. Initial staff-only requirement warning was corrected; validation was rerun. |
| `openspec validate --all --strict --no-interactive --json` | PASS, 17/17 (5 changes, 12 main specs), no failures. Existing main-spec length notices are informational. |
| Task structure and progress | 19 ordered Stage 0–18 groups, 92 tasks; only Stage-0 items 1.1–1.6 complete (6/92). All 86 Stage-1+ tasks remain unchecked. |
| Historical seals | Four manifest digests match; 64/64 listed payload checks pass; no predecessor evidence edit. |
| Canonical contract preservation | Technical sections 1–34 are byte-identical to closure HEAD. Only administrative status wording changes in the canonical successor specification. |
| Diff scope / whitespace / links | `git diff --check` passes; all local successor Markdown links resolve; 20 changed/untracked files are documentation/planning only. |
| Independent contract review | Three substantive planning corrections resolved; final review also clarified that Human Geometry Approval closes Stage 1 and precedes Stage-2 sealing/refreeze. No remaining Stage-0 blocker found. |

Gate 0 is PASS because Phase 9 is closed, the exact baseline is recorded,
historical evidence is immutable, all five successor deltas are registered,
live owners are reconciled, and implementation scope is bounded. This marks
only the six verified bootstrap tasks complete. It is not owner acceptance
of Stage 1, new geometry, or final homologation.

No runtime, browser, build, staging, provider-delivery, or new visual geometry
validation was run for this documentation-only checkpoint. No code, tests,
scripts, dependency files, approved assets, or evidence payloads changed.
Graphify was used for read-only discovery; no code change required an AST
update. During the bootstrap review, no commit, push, archive, deployment, or
public cutover was performed.

## Owner approval and checkpoint authorization

After the completed Stage-0 review, the owner explicitly approved Stage 0 and
authorized one scoped documentation/OpenSpec checkpoint commit with subject
`docs(assembly-motion): checkpoint successor Stage 0`. This permission covers
only the Stage-0 artifacts and bounded status/handoff updates listed below.
All paths must be individually classified and staged; unrelated paths,
runtime, tests, capture scripts, and evidence payloads are excluded.

The pre-commit cached whitespace check exposed trailing spaces and extra EOF
blank lines in seven new Markdown files. These formatting issues were corrected
without changing requirements before repeating the bounded validation.

The approved progress remains 6/92. Stage 1 is UNSTARTED / UNAUTHORIZED,
`stage-1-authorization.md` remains a draft, and the Human Geometry Gate and
subsequent geometry refreeze still block later motion stages. No Phase-9
amendment, push, deployment, or implementation is authorized. The resulting
checkpoint SHA is obtained from Git history and reported after the commit;
it does not replace the frozen predecessor technical SHA.

## Exact review file inventory

Seven tracked administrative-status files changed:

- `WFLYER_IMPLEMENTATION_PLAN.md`;
- `docs/canonical-v2/README.md`;
- `docs/canonical-v2/00-governance/02-scope-status-and-terminology.md`;
- `docs/canonical-v2/00-governance/03-decision-register.md`;
- `docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`;
- `docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`;
- `openspec/changes/rebuild-scroll-driven-wflyer-v2/tasks.md` (hold resolution
  only; predecessor/parent task completion is unchanged).

Thirteen planning files, untracked at the pre-commit review, are present under
`openspec/changes/implement-scroll-driven-score-assembly-and-motion/`:

- `.openspec.yaml` (retained interrupted-bootstrap metadata);
- `proposal.md`;
- `design.md`;
- `tasks.md`;
- `specs/accessible-navigation-lifecycle/spec.md`;
- `specs/brand-opening-motion/spec.md`;
- `specs/continuous-dual-score/spec.md`;
- `specs/music-renderer/spec.md`;
- `specs/responsive-story-mode/spec.md`;
- `specs/score-assembly-motion/spec.md`;
- `specs/score-transition-navigation/spec.md`;
- `stage-0-review.md`;
- `stage-1-authorization.md`.

The review and authorization draft are supporting planning records, not a
successor geometry evidence seal. No new geometry has been produced or approved.

## Next boundary

Stage 0 is owner-approved, including [proposal.md](proposal.md),
[design.md](design.md), [tasks.md](tasks.md), and the seven `specs/*/spec.md`
files. The proposed [Stage-1 authorization](stage-1-authorization.md) remains
an unapproved execution draft. Once Stage 1 is separately authorized, execute
only its bounded geometry work and stop at the Human Geometry Gate. Stage 2 requires the human
decision; Stage 3+ requires the completed geometry refreeze.
