# Stage-1 first Projects full-ink owner authorization and High handoff

Owner approval: 2026-09-10. Interrupted normalization resumed: 2026-09-11
(America/Sao_Paulo). Scope: governance only. Policy: AI-MRP-001 at
`docs/.ai/AI_MODEL_ROUTING_POLICY.md`. This is a derived operational handoff;
canonical ADR-049 / ASM-IMP-DEC-013 controls the new bounded repair.

## Decision and retained diagnosis

ADR-049 and ASM-IMP-DEC-013 are APPROVED; **ASM-PC-002 is registered and
repair-authorized, not repaired**. Alias: `PROJECTS-FIRST-EVENT-INK-CLEARANCE`.
The sole event is `professional-projects:primary:note:0`, Projects visit 1.

| Occurrence | Horizontal viewport | Notehead envelope clearance | Ledger/stroke clearance |
| --- | --- | ---: | ---: |
| ASM-PC-002-O01 | 1440x900 | 1.0290065434475082px | 5.919519992479309px |
| ASM-PC-002-O02 | 1536x900 | 1.0284733524625835px | 5.918756994098771px |
| ASM-PC-002-O03 | 1920x917 | 1.0275674524551732px | 5.917460345319682px |

Expected: >=12 physical CSS px from protected content, including complete
rendered staff/event ink and required production interaction envelopes.
Observed: inherited TOO_CLOSE; staff-only clearance does not prove event safety.
Current Chromium DOM at 1536x900 corroborates ~1.02788px notehead gap.

Root: `src/lib/story/score/projection.ts:horizontalChapterShelves`,
professional-projects. The uncapped cardBottom + 3.5*staffSpace (+42px) shelf
reservation omits the event's complete ink needs. ASM-PC-001 is **unchanged**:
the capped 1100x640 three-visit root with approved capacity-based whole-story
fallback under ADR-048 / ASM-IMP-DEC-012. A shared source owner does not merge
the two limiting mechanisms or occurrence sets.

Evidence: immutable `stage-1-projects-full-ink-stop.md` and
`stage-1-projects-full-ink-stop-diagnostics.json`. Saved input:
`tests/fixtures/story-score/stage1-batch2-measurements.json`, SHA-256
`61f26ce52ebffcee4b3751d41b856be60d97c38e1e63ba3dd4a97ad6d569f9e3`.
Original Stage-0 and frozen Phase-9 **Professional branch** constructors
reproduce identical event primitives at all three inputs. This is not fresh
historical DOM or full historical aggregate PASS. The failed unrelated
Application aggregate attempt remains recorded. Do not restart that investigation.
Independent ledger/stroke arithmetic and DOM disprove normalization or missing
interaction data as explanations of the measured idle deficit; absent interaction
measurements cannot erase an already proven failure.

## Exact repair envelope and fixture rule

Only the first horizontal Projects notation shelf, its minimum required entry,
and the minimum continuity necessary for visit 1 -> visit 2 may change.
Reservation derives from complete rendered ink and actual required interaction
envelopes through existing geometry/measurement ownership. No replacement
arbitrary fixed offset, viewport-specific branch, fan redesign or broader
shared valley change. Preserve visits 2/3 shelves except minimum proven necessary
continuity, unrelated connectors/chapters, card dimensions/content/fan interaction,
three visits, Projects NON-ASSEMBLY, approved glyphs, Composer semantics/seed/
fingerprints, 12px, full visible staff/event ink and global zero intersections.

The existing three saved fixtures remain unchanged negative baselines. Their
historical acceptance does not grant complete capacity PASS. A corrected
candidate becomes positive only after **all** ASM-IMP-DEC-012(D) requirements
pass, including idle and interaction envelopes, clip bounds, all three visits,
LTR safety and global geometry. If none of the three registered corrected
candidates can pass within the local envelope, STOP for another owner decision.
Universal fallback cannot masquerade as successful completion of this repair.

## Actual worktree and implementation state

HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
Branch: `develop/site-institucional`.
Active OpenSpec: `implement-scroll-driven-score-assembly-and-motion`.
Progress: **7/92**, only Stage-1 task 2.1 checked; task 2.10 Human Geometry
Approval pending, Stage 2+ unstarted/unauthorized. HEAD is the Stage-0 checkpoint,
not a commit representing this dirty implementation.

Preserve all five existing deltas, all 14 repaired Batch-1 defects/18 original
mode occurrences, all six repaired Batch-2 defects/eight viewport occurrences,
ADR-046 numeric/hydration determinism and the entire unrelated dirty worktree.
Composer fingerprints remain `fnv1a32:039bce10` and `fnv1a32:1fe3356b`.

Existing partial work, unchanged by Ultra:

- `src/lib/story/score/projects-capacity.ts`: pure evaluator with
  PASS/INSUFFICIENT_CAPACITY/NOT_READY/INVALID results; unintegrated and not
  certified as the complete production capacity predicate.
- `tests/unit/story/story-score-projects-capacity.test.ts`: five existing cases,
  including all three first-visit idle failures and independent ledger proof.
- `tests/fixtures/story-score/stage1-projects-capacity-negative.json`: retained
  measured ASM-PC-001 1100x640 input.

Candidate measurement bridge, final eligibility policy, readiness/generation
lifecycle integration and local vertical three-visit support remain pending.
No new runtime implementation or tests were run in this governance scope.
Five focused tests, focused lint and `pnpm typecheck` passed at the prior High
STOP; these are retained historical checks, not final current-worktree proof.
The newer maintenance changes observed on resume affect package/lock/tooling/
CI/deploy/operational docs and are preserved without runtime certification.
Exact final dirty status, changed governance paths, 546 protected hashes,
immutable diagnostics, and separate unrelated-maintenance provenance are in
`stage-1-projects-full-ink-governance-validation.json`.

## First action and remaining bounded High work

1. Verify HEAD/status, then extend the existing focused capacity test with
   explicit ASM-PC-002-O01..O03 baseline and corrected-candidate assertions.
   Keep saved measurement bytes and retained negative/ledger proof. Cover full
   ink plus production interaction envelope reservation, first-shelf entry/
   visit-1-to-2 continuity and unchanged geometry outside the local envelope.
   Start with `pnpm exec vitest run --project=unit tests/unit/story/story-score-projects-capacity.test.ts`.
2. Implement only the authorized first horizontal shelf repair in
   `projection.ts:horizontalChapterShelves`, reusing complete footprint math in
   `event-safe-placement.ts` and the partial evaluator. No arbitrary offset or
   source-level bypass of global validation. Prove the bounded deterministic
   geometry before policy integration; complete PASS needs actual interaction
   inputs, not fabricated envelopes.
3. Continue existing 012(C–I) implementation afterward: independent inert
   production-style horizontal candidate measurement injected from
   MotionStoryLab/StoryScoreLayer; pure geometry evaluation; one policy owner
   `story/motion/eligibility.ts:resolveStoryProjectionMode`; runtime readiness/
   latest generation in `buildOwnedDriver`/`rebuildPreservingActiveChapter`;
   semantic resize mapping in `motion/geometry.ts`/positioning; local
   `projection.ts:verticalGeometry` adapter with measured mode-local visits,
   notationRanges/projectVisit/semanticSlotIds, cache identity and explicit
   coordinates. Preserve the generic Organic Flowing base. Only minimum
   Projects/Process/Contact joins are allowed by 012(H).
4. Prove responsive cases A–J: ASM-PC-001 whole-story vertical-wide fallback,
   three genuine vertical visits, first event/full ink on visit 1 and empty
   visits 2/3; same-viewport capacity boundaries, actual positive horizontal
   candidate, candidate/live measurement equivalence, both resize directions,
   chapter/branch/projectIndex/fraction/seed preservation, one settled mode,
   no oscillation/Home replay, SSR/first-client equality, font readiness,
   stale generations, cleanup, input modes and denied enhancement.

Keep full visible-segment/cross-run validation, 2049-point center replay,
1025-point staff input and 1e-7 guards enabled, plus both Batch suites,
ADR-046 exact canonical/semantic equality and hydration checks. Do not weaken,
delete or bypass a failing test. Necessary test updates must retain equivalent
or stronger before/after coverage; old fixture bytes never change.

After focused tests and deterministic global geometry are clean, run the fresh
serial Chromium/Firefox/WebKit matrix, workers=1/retries=0: the complete prior
132-test scope (Stage-1 geometry, Stage-1 hydration, score integration,
Phase-9 score-path review and Phase-9 refinement) plus new capacity/interaction/
resize/lifecycle cases. Preserve pure horizontal 1100x640 Batch-2 coverage;
replace obsolete enhanced browser expectations with stronger whole-story
fallback and all-three-visit acceptance. No reuse of prechange browser passes.
Then complete successor-only Stage-1 evidence with distinct PC-001/PC-002
before/repair/final occurrence mappings and historical integrity; STOP at
Human Geometry Approval, without sealing/refreezing the geometry.

## Governance validation and routing boundary

`stage-1-projects-full-ink-governance-validation.json` records the actual bounded
strict successor/workspace, structured/YAML, diff, historical seal/payload and
546-file integrity results. This document is an authorization handoff, not final
Stage-1 geometry evidence or a claim of runtime acceptance. No runtime test,
browser matrix or final capture is authorized in Ultra. No processes were
started for runtime diagnosis or left running by this normalization.

When all governance checks pass, routing is DOWNGRADE_READY to Astra High;
owner permission for this exact implementation is present. The requested Ultra
profile is not a claim that tooling changed the model. Follow AI-MRP-001:
STOP immediately for a new unregistered defect, expanded envelope, invariant/
architecture conflict, or inability to qualify a registered horizontal candidate.
After two bounded attempts on the same unresolved root without material progress,
stop before a third speculative patch and hand off for appropriate review.
No Stage 2+, refreeze, motion, public cutover, archive, commit, push, deploy or
self-recorded Human Geometry Approval.
