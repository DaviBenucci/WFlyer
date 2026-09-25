# Stage-1 Projects first-event ink clearance STOP — 2026-09-10

Status: **STOP; Astra Ultra architecture/governance review required** under the
owner's interrupted-High classification gate and ASM-IMP-DEC-012(J). No new
inherited-defect authorization is created. Diagnostic identity only:
`PROJECTS-FIRST-EVENT-INK-CLEARANCE`.

HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`, branch
`develop/site-institucional`. Preserve the dirty worktree, five existing deltas,
14 Batch-1 repairs, six Batch-2 repairs and ADR-046. OpenSpec remains 7/92;
Human Geometry Approval is pending.

## Finding and classification

The full-ink test rejects the first Projects visit, event
`professional-projects:primary:note:0`, at the three previously staff-positive
horizontal fixtures. Required protected clearance is **12 physical CSS pixels**.

| Saved fixture | Complete notehead-envelope gap | Ledger gap including 0.96px stroke | Minimum staff clearance |
| --- | ---: | ---: | ---: |
| 1440x900 | 1.0290065434475082 | 5.919519992479309 | >17 |
| 1536x900 | 1.0284733524625835 | 5.918756994098771 | >17 |
| 1920x917 | 1.0275674524551732 | 5.917460345319682 | >17 |

Classification **E**: real inherited protected-clearance violation, specifically
`TOO_CLOSE`, not negative-clearance overlap. Classification **D** also applies
to fixture qualification: prior staff-only acceptance did not establish the
complete new predicate. This is not missing interaction data alone: an observed
idle failure is already sufficient to reject capacity. No interaction envelope
was fabricated or applied to produce this failure.

A/B are excluded by independent arithmetic and current DOM evidence. At
1536x900 the normalized first card bottom is 761.84; raw DOM bottom is
761.8405914306641. The raw rendered notehead envelope starts at
762.8684692382812, leaving **1.0278778076171875px**. Projection's complete
notehead envelope starts at 762.8684733524625. The discrepancy is measurement
normalization, not a meaningful safety correction. Both card and score are
expressed in track coordinates by subtracting the same track translation;
horizontal rendering uses physical CSS units without vertical viewBox scaling.

The notehead glyph has no stroke contribution. Independently, the ledger's
centerline endpoints have y=768.444714 and y=768.238757 and stroke width 0.96.
Its actual horizontal span lies wholly inside the card's protected x-range.
Subtracting half the stroke from its upper endpoint yields a gap near 5.92px.
Thus even a glyph-bound interpretation cannot restore 12px acceptance.
The stem also remains below 12px. Full primitive coordinates are in the JSON.

## Lineage and scope

Source fixture is `tests/fixtures/story-score/stage1-batch2-measurements.json`,
SHA-256 `61f26ce52ebffcee4b3751d41b856be60d97c38e1e63ba3dd4a97ad6d569f9e3`,
referenced by the unchanged Batch-2 repair diagnostic.

Original **Professional branch constructors** from Stage 0 and frozen Phase 9,
using identical saved inputs, reproduce all three event primitives exactly at
all three viewports. Historical projection and Organic Flowing source hashes
are identical across those two revisions. All 77 other existing library files
used as shared dependencies match both references byte-for-byte. Scratch copies
only rebase imports and expose the existing branch constructor for diagnosis.

This is not a fresh historical browser claim or a full historical aggregate
PASS. A full aggregate attempt stopped at an unrelated Application invariant
at 1536x900; that error remains recorded. The branch-only replay bypasses no
branch validator and does not change any original implementation or evidence.
Current Chromium at 1536x900 independently confirms the rendered dimensions,
with zero page errors. No final matrix or final captures were run.

The owner is `projection.ts:horizontalChapterShelves` / professional-projects.
At these viewports the cap is inactive: center = cardBottom + 3.5*staffSpace,
which is +42px. The first event extends approximately 40.97px above that
center, leaving ~1.03px. Registered ASM-PC-001 describes the **capped 1100x640**
three-visit capacity failure. These share a source owner but have different
limiting mechanisms and occurrence sets. High does not authorize a merger,
a new defect ID, horizontal repair, or changed positive-mode requirements.

## Worktree and verification

Added before the STOP: unintegrated partial `projects-capacity.ts`, the focused
`story-score-projects-capacity.test.ts`, and the preserved negative fixture.
The evaluator is not wired into eligibility/runtime and is not claimed to prove
the complete production interaction contract. Vertical support is unimplemented.
The interrupted NOT_READY expectation is corrected to assert the now-proven idle
failure; the test still rejects optimistic PASS and retains the independent
ledger/stroke regression. No previous test or validator is weakened.

Focused tests: **5/5 PASS**. Focused lint PASS. Direct `tsc --noEmit` initially
reported stale generated route-type disagreement; the repository's prescribed
`pnpm typecheck` regenerated types and passed. `graphify update .` completed
AST-only. All pre-existing runtime/test/script/public files and prior immutable
successor records are unchanged. Four historical seal pairs / 64 payloads pass
SHA-256 and Git-byte verification. Exact final status and governance checks are
in `stage-1-projects-full-ink-stop-diagnostics.json`.

## Minimum next decision

Ultra must classify and bound the uncapped first-event ink deficit: separately
register it or explicitly extend named scope, then authorize the minimum local
response or reconcile capable-horizontal fixture expectations. The latest owner
instruction forbids forcing old fixtures to PASS, but does not authorize High
to broaden ASM-PC-001 or repair the horizontal event/fan.

Preserve 12px, complete ink, unchanged Composer/glyph semantics, NON-ASSEMBLY,
three visits, global zero, historical integrity and every previous repair.
Do not rerun the completed ASM-PC-001 investigation. No runtime repair proceeds
until this concrete governance question is resolved. No Stage 2+, motion,
refreeze, commit, push, deploy or Human Geometry Approval is authorized.

## Routing and attempt ledger

Policy: AI-MRP-001 at `docs/.ai/AI_MODEL_ROUTING_POLICY.md`.
Routing: UPGRADE_READY / SCOPE_ESCALATION; requested next profile Astra Ultra.
The current requested profile is Astra High; actual configuration is not
independently verified. Owner authorization is required for a new repair scope;
the next Ultra run is diagnosis/proposal only until that approval exists.

1. Initial evaluator/measurement hypothesis: exact idle fixtures reject with
   ~1.03px notehead clearance. Independent ledger/stroke arithmetic and raw
   current Chromium DOM confirm the failure. No numerical repair attempted.
2. Lineage hypothesis: original Professional constructors reproduce identical
   event primitives at all three viewports. Full aggregate attempt aborted on
   an unrelated Application invariant; retained branch-only proof establishes
   inherited local ink behavior without disabling guards.

No speculative coordinate corrections were attempted. Existing inheritance
investigation must not restart. First Ultra action is to reconcile the uncapped
ink failure with ASM-PC-001's explicit scope and present the minimum bounded
owner decision. No pending diagnostic server; it was stopped after measurement.

During this run, a concurrent AGENTS.md model-routing section and
`docs/.ai/AI_MODEL_ROUTING_POLICY.md` appeared. Their contents are preserved.
The one stale reference `docs/ai/...` was corrected to the verified `docs/.ai/...`
path under AI-MRP-INSTALL-001; no duplicate policy or routing section was added.
