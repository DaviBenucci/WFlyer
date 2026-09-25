# Current Model Handoff

Policy: AI-MRP-001 / 1.1.0
Updated: 2026-09-12T10:07:04-03:00
Project / change / task: WFlyer / implement-scroll-driven-score-assembly-and-motion / Stage 1 Projects capacity and clearance
Routing status: UPGRADE_READY
Reason type: SCOPE_ESCALATION
Current configuration: GPT-5.6 SOL / HIGH requested; runtime configuration unverified
Next configuration: GPT-6 ASTRA / HIGH
Owner authorization required: yes — a repair of visit 3's own shelf needs an explicit owner decision

## Authorized objective and boundary

The current implementation authority covers ASM-PC-001 under ADR-048 /
ASM-IMP-DEC-012, ASM-PC-002 under ADR-049 / ASM-IMP-DEC-013 and ASM-PC-003
under ADR-050 / ASM-IMP-DEC-014. Stage 1 must stop at Human Geometry Approval.
No Stage 2+, geometry refreeze, successor motion, commit, push or deployment is
authorized.

The next run is diagnosis/proposal only. It may determine the minimum owner
decision for the newly observed visit-3 interaction-clearance failure and
prepare a concrete bounded proposal. It may not repair visit 3 or normalize
canonical/OpenSpec scope until the owner approves that decision.

## Canonical authority

- `AGENTS.md`.
- `docs/.ai/AI_MODEL_ROUTING_POLICY_v1.1.0.md`, AI-MRP-001.
- `docs/canonical-v2/00-governance/03-decision-register.md`, ADR-048,
  ADR-049 and ADR-050.
- `docs/canonical-v2/05-architecture/WFlyer_Post_Phase9_ASM_Motion_Canonical_Spec.md`,
  ASM-IMP-DEC-012, ASM-IMP-DEC-013 and ASM-IMP-DEC-014.
- Active OpenSpec `stage-1-authorization.md`, especially the
  ADR-050/ASM-IMP-DEC-014 addendum and its explicit visit-3 STOP boundary.
- Detailed evidence:
  `stage-1-projects-visit3-interaction-clearance-stop.md` and
  `stage-1-projects-visit3-interaction-clearance-stop-diagnostics.json`.

## Repository state

HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`

Branch: `develop/site-institucional`

Worktree: dirty, ahead of origin by three commits, with extensive pre-existing
Stage-1 governance, diagnostics, geometry, test and unrelated tool/configuration
changes. Do not reset, clean, stash or overwrite it.

Existing changes include the five successor deltas, 14 Batch-1 repairs, six
Batch-2 repairs, ADR-046 hydration/numeric determinism, governance
normalization and historical evidence.

Current implementation work adds/extends:

- production Projects interaction-envelope measurement;
- an inert independent horizontal candidate and cleanup;
- a pure complete capacity evaluator with physical ink/clip/intersection gates;
- runtime readiness, generation and same-viewport capacity selection;
- focused unit/browser acceptance coverage;
- a derived first-shelf reservation that reaches 12.008125281333946px at
  1536x900;
- diagnostic fields that distinguish incoming, boundary-inclusive and fully
  internal shelf constraints.

A rejected smooth visit-3 arrival-offset variation was reverted. No visit-3
repair remains. No process is pending.

## Reproduction and evidence

Expected: at least one corrected 1440x900, 1536x900 or 1920x917 horizontal
candidate passes the complete ASM-IMP-DEC-012(D) predicate after the bounded
013/014 repairs.

Observed at 1536x900:

- visit 1: 12.008125281333946px, visible;
- visit 2: 29.246151033756192px, visible;
- visit 3 global: 8.372450414027085px;
- visit 3 fully internal shelf: 8.475144370079207px;
- result: `INSUFFICIENT_CAPACITY` /
  `projects-protected-clearance-or-clip`.

Reproduction:

```sh
pnpm exec playwright test tests/e2e/assembly-stage1-projects-capacity.spec.ts --project=chromium --workers=1 --retries=0 -g '1536x900'
```

The exact failed assertion is the required
`{ status: "PASS", reasons: "none" }` candidate state. The structured failure
payload is persisted in
`stage-1-projects-visit3-interaction-clearance-stop-diagnostics.json`.

## Attempt history

| Attempt | Hypothesis | Change/diagnostic | Result | What it established |
| --- | --- | --- | --- | --- |
| 1 | Complete production envelopes plus derived local shelf minima can repair 002/003. | Added the inert candidate, full evaluator, production interaction measurement and local first/second shelf derivation. | Material progress: visit 2 passed above 29px; visit 1 remained capped; visit 3 became the other limiting visit. | The second-shelf repair works and whole-story fallback cannot yet be enabled as a positive candidate. |
| 2 | Releasing only the first-shelf authored cap when the complete ink remains visible can finish 002. | Added a geometry-height guard for insufficient small candidates and applied the derived first-shelf minimum at capable height. | 1536x900 visit 1 reached 12.008px; visit 2 stayed above 29px; global candidate remained structurally valid. | ASM-PC-002 is locally corrected for this candidate. |
| Reverted variation | A direct smooth offset on the visit-2-to-3 arrival can finish the remaining junction clearance. | Applied one derived arrival offset, then ran focused unit/browser checks. | It created a global visible staff self-intersection and was removed. | A direct offset is not an admissible repair shape. |
| Scope diagnostic | The residual visit-3 value might be only the authorized 2-to-3 junction. | Split clearance into global, boundary-inclusive and fully internal shelf sets. | The fully internal visit-3 set is still 8.475px. | Repair needs visit 3's own shelf and exceeds ASM-IMP-DEC-014. |

## Verified facts and uncertainty

Verified:

- The current 1536x900 candidate exercises actual production CSS interaction
  endpoints and conservative transition coverage.
- Visits 1 and 2 pass their local 12px checks in this candidate.
- Visit 3 fails inside its own notation zone.
- ADR-050 / ASM-IMP-DEC-014 preserves visit 3's own shelf and requires STOP.
- Historical Phase-9 evidence was not mutated.

Disproved:

- The remaining visit-3 deficit is solely an authorized visit-2-to-3 junction
  adjustment.
- A direct smooth arrival offset preserves the global zero-intersection
  invariant.

Unresolved:

- Whether the owner wants a distinct defect registration or an explicit
  amendment to a named scope.
- Whether historical Stage-0/Phase-9 constructors reproduce the visit-3
  interaction defect. That lineage was intentionally not investigated in this
  implementation run.
- The minimum geometry owner/envelope required if repair is authorized.

## Validation state

Passed on the preserved source state:

- `pnpm exec vitest run --project=unit tests/unit/story/story-score-projects-capacity.test.ts tests/unit/story/motion-eligibility.test.ts` — 17/17.
- focused ESLint over the changed Projects capacity/runtime files — PASS.
- `git diff --check` — PASS after handoff finalization.
- successor OpenSpec strict validation — PASS.
- workspace OpenSpec strict validation — 17/17.
- OpenSpec planning artifacts — complete; implementation progress 7/92.

Failed as required evidence:

- focused Chromium 1536x900 candidate — expected PASS, received
  INSUFFICIENT_CAPACITY because visit 3 is below 12px.
- standalone `tsc --noEmit --incremental false` — blocked by the pre-existing
  generated `.next/types` versus `.next/dev/types` route alias mismatch
  (`/__visual-lab/music` versus `/%5F_visual-lab/music`); no source-code
  diagnostic was reported.

Unexecuted:

- 1440x900 and 1920x917 internal-shelf classification;
- Firefox/WebKit;
- final browser matrix and final captures;
- final structured/strict/global acceptance.

## Preserve / prohibited

Preserve three Projects visits, Projects NON-ASSEMBLY, card dimensions/content/
fan interaction, full production focus behavior, Composer semantics and
fingerprints, approved glyphs, 12 physical CSS pixels, full visible staff/event
ink, global zero center/staff intersections, all five deltas, Batch 1/2,
ADR-046 determinism, ASM-PC-001/002/003, every historical record and every
validator.

Do not declare old fixtures positive without the complete predicate, conceal a
local defect with universal fallback, weaken interaction coverage, move the
fan/cards, add viewport branches, redesign Projects, mutate historical evidence,
run a broad audit or final matrix, implement Stage 2+, refreeze, commit, push,
deploy or mark Human Geometry Approval.

## Next action

Read the visit-3 STOP and only the relevant 012/013/014 and ADR-048/049/050
sections. Reconcile the proven fully internal visit-3 failure with
ASM-IMP-DEC-014's explicit preservation of visit 3. Present the minimum bounded
owner decision: distinct registration versus explicit named-scope amendment.
Do not restart the completed inheritance investigations and do not implement
the repair before approval.

## Continuation prompt

```text
MODEL: GPT-6 ASTRA
REASONING: HIGH

Resume the exact WFlyer Stage-1 dirty worktree.
Follow AI-MRP-001 at docs/.ai/AI_MODEL_ROUTING_POLICY_v1.1.0.md.

Read AGENTS.md, docs/canonical-v2/06-migration/CURRENT_HANDOFF.md and
openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-projects-capacity-model-handoff.md.
Then read only the canonical/OpenSpec sections and diagnostic paths referenced
by that handoff.

Expected HEAD: 40e6ae1a8996c53ed2ec372c47f16bc073d6cee9
Expected state: dirty Stage-1 worktree; OpenSpec progress 7/92; Human Geometry
Approval pending.
Owner permission: diagnosis/proposal only for the unregistered visit-3
interaction-clearance finding. No visit-3 repair authorization exists.

First action: reconcile the verified 1536x900 fully internal visit-3 clearance
of 8.475144370079207px with ASM-IMP-DEC-014's explicit preservation of visit
3's own shelf. Determine and present the minimum bounded owner decision.

Preserve the locally passing visit-1/visit-2 candidate work, complete production
interaction predicate, capacity evaluator/runtime lifecycle, all five deltas,
Batch 1/2, ADR-046, Composer/glyphs, three visits, NON-ASSEMBLY, 12px, global
zero intersections, historical evidence and unrelated worktree changes.

Do not repeat the completed ASM-PC-001/002/003 lineage investigations. Do not
retry the reverted direct smooth arrival offset. Do not implement visit 3,
normalize new authority, run the final matrix/captures, start Stage 2+, refreeze,
commit, push, deploy or mark Human Geometry Approval.

If the live state differs, reconcile and preserve newer valid work. Model
escalation grants no additional repair authority. STOP with
BLOCKED_OWNER_DECISION and a concrete minimum owner decision.
```
