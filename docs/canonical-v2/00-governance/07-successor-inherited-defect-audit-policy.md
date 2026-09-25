# Successor inherited-defect audit and stage disposition

Contract: **ASM-AUDIT-001**. Status: **APPROVED**, 2026-09-13.

**2026-09-22 execution scope:** ADR-053 / ASM-IMP-DEC-017 supersedes the
incomplete audit of the former bidirectional institutional topology. The old
manifest and raw evidence remain historical; its 500 pending observations are
not current portfolio-only acceptance obligations. Do not resume that execution
or derive repair authority from its partial inventory. The general audit and
disposition rules below remain available for a future authorized scope.
Authority: ADR-052 and ASM-IMP-DEC-016. Access reservation: ADR-051 /
ASM-IMP-DEC-015, diagnostic **ASM-CR-001**.

Owner approval and its execution-efficiency guardrails are retained verbatim in
[`stage-1-inherited-audit-owner-approval.txt`](../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-owner-approval.txt).
The approved A–H proposal remains immutable explanatory history; this policy,
the decision register and the ASM specification are the normalized contracts.
AGENTS precedence and AI-MRP-001 v1.1.0 remain unchanged.

## 1. Trigger, scope and current execution gate

Discovery of **three distinct evidenced inherited roots** during the same
successor stage SHALL pause new individual inherited-defect remediation.
Occurrences, engines, repeated failures and pipeline defects do not increase
this count. ASM-PC-001/002/003 already satisfy it for the current Stage 1;
recounting the repaired intersection batches is unnecessary.

The next step SHALL be one owner-approved, prebounded, systematic audit of the
affected acceptance surface, followed by one deduplicated batch disposition.
This is not authority to reopen the entire repository, repeat completed causal
investigations or roll back valid work. Existing repair authorizations remain
valid; execution is paused at the audit prerequisite. Even the approved Access
repair boundary may not be implemented before the audit and later batch decision.

The current Ultra continuation SHALL normalize governance only, validate it and
STOP. The next task is **COMPLEX_DIAGNOSIS — GPT-6 Astra / High, AUDIT ONLY**.
No product/runtime repair, including geometry, UI, policy implementation or
production measurement-pipeline correction, is permitted during that audit.

## 2. Independent result axes

Every observation/finding SHALL retain:

1. raw validator outcome and original assertion/threshold;
2. root causal classification, with evidence and limitations;
3. runtime candidate disposition and actual selected mode/fallback;
4. stage disposition, its authority and qualification status.

| Classification | Evidence and meaning | Default disposition |
| --- | --- | --- |
| CURRENT_REGRESSION | Introduced or materially worsened by a current change against equivalent frozen input; identify the actual successor or other dirty-change owner. | BLOCK_STAGE, always. |
| INHERITED_CRITICAL | Equivalent inherited behavior violates a mandatory acceptance invariant or materially compromises supported functionality, accessibility, security or data integrity. | BLOCK_STAGE. |
| INHERITED_NONBLOCKING | Equivalent inherited behavior, not worse, noncritical, no mandatory invariant failure and no material functional/accessibility/security loss. | BLOCK_STAGE until individual explicit owner DEFER. |
| VALIDATION_PIPELINE_DEFECT | Causal evidence that the validator, readiness, construction, measurement/order/restoration or equivalent pipeline is wrong. A failing assertion alone is not such evidence. | Block affected evidence qualification; propose pipeline repair separately, not geometry changes to satisfy bad measurements. |
| UNCLASSIFIED / NEEDS_REVIEW | Missing/inequivalent input, unavailable required observation, unexplained discrepancy or uncertain classification/impact. | Block required evidence qualification; continue independent declared observations. |

`PASS` describes only a completed passing observation, not a defect class or a
whole-stage decision. `SAFE_FALLBACK` is solely a runtime disposition. Never
infer inherited equivalence from a historical PASS or label a validator faulty
merely because it detects a new inherited failure.

## 3. Mandatory blocking and explicit defer

BLOCK_STAGE when there is any current regression; inherited critical finding;
material accessibility loss; clipped/unreachable/unusable required content,
form or CTA; navigation failure; security/data-integrity impact; mandatory
current invariant failure; missing required safe fallback; or unresolved required
classification/coverage. Findings on a required development review surface can
block its acceptance without implying unproved public data loss.

The following protections remain mandatory: all existing tests/validators and
their current required acceptance; zero global center/visible-staff intersections;
full visible staff/event ink; 12 physical CSS pixel clearance; tangent and
event-safe constraints; Composer/seed/fingerprints; approved glyphs; three
Projects visits/NON-ASSEMBLY; ADR-046 numerical/hydration equality; protected
content, zero required overflow, functionality/accessibility and owned cleanup.
The registered Access overflow is blocking; this approval does not defer it.

DEFER is eligible only if **all** are evidenced and recorded: inherited;
equivalent current behavior not worse than frozen input; noncritical; no
mandatory invariant violation; no material functionality/accessibility loss;
no security/data-integrity impact; explicit finding-specific owner approval;
enabled detecting validator and visible raw result; accountable remediation
owner and review date/stage; measurable approved baseline, comparison domain,
tolerance authority and expiration/reblock conditions.

No finding is automatically deferred by this policy. Missing evidence is not
equivalence. New/worse impact, worsened metrics, a new occurrence outside the
approved comparison domain, missing/expired approval, missed review point or
new invariant failure SHALL reblock it. Do not compare aggregate failure counts
when they can conceal changed individual occurrences.

The stage-disposition report SHALL use:

- **BLOCKED** for any blocking item or unresolved required observation;
- **ELIGIBLE_WITH_APPROVED_DEFERRALS** only when mandatory checks pass and the
  sole remaining debt is individually approved, noncritical supplementary
  findings within their documented bounds;
- **ELIGIBLE** when required coverage is complete and mandatory checks are clear.

Eligibility never marks Human Geometry Approval or authorizes the next stage.
Raw assertions, exit codes and failures SHALL remain intact; do not publish
`ALL_TESTS_PASS` for a failing raw run. No existing must-pass test/invariant may
be silently relabeled supplementary. Waiving one is outside this approval and
requires a separate explicit owner decision through canonical precedence.
ASM-AC-025's required automated gates and subsequent human approval remain.
The disposition report recognizes supplementary approved debt; it does not
disable, loosen or delete a failing test to pass a gate.

## 4. Durable registry and diagnostic identity

The governed registry is [`known-inherited-findings.json`](known-inherited-findings.json),
validated by [`known-inherited-findings.schema.json`](known-inherited-findings.schema.json).
It stores registered inherited findings and append-only disposition/evidence
history. It is not a replacement for older approved Batch/Projects registers;
their immutable source records are linked, not renumbered or assigned guessed
current dispositions. The audit's full batch inventory may also contain current
regressions, pipeline defects and unresolved roots.

Identifier namespaces are distinct:

- `ASM-CR-NNN`: content-reservation root; first registration **ASM-CR-001**.
  `ASM-AC-*` already denotes acceptance contracts and SHALL NOT be reused.
- Existing `ASM-PC-*` and `ASM-SI-*` keep their established identities and
  occurrence mappings; duplicate audit observations reference them.
- `ASM-AUD-NNN`: newly identified audit diagnostic root, allocated only after
  evidence supports grouping, using the next unused live integer across the
  registry and audit inventories. This grants diagnostic identity only, never
  repair or DEFER permission. Do not preallocate speculative defects.
- Occurrences append `-O01`, `-O02`, etc.; preserve existing occurrence identities.
  Mechanical observation-slot keys are not root IDs. Unresolved clusters may
  retain stable collector keys until grouping is supportable.

Each record SHALL include ID, root signature/lineage, surface and files/owner,
known occurrences, frozen/current paired evidence with hashes/configuration,
equivalence status/limitations, severity and rationale, actual user/functional/
accessibility/security impact, invariant violations, raw validator outcome,
independent candidate/fallback result, stage disposition, registration approval,
separate disposition approval, remediation owner/review point, measurement
baseline/units/domain/tolerance authority, repair boundary and verification state,
reblock conditions and immutable history links. Unsupported impacts remain
explicitly unknown rather than exaggerated.

DEFER validation SHALL reject incomplete approval/remediation/baseline fields,
non-equivalent input, critical/current-regression classification, mandatory
invariant violations or worsened metrics. A future batch decision must supply
the accountable person; an anonymous future assignment is insufficient.
Never store secrets, real submitted email addresses or live verification tokens.
Corrections append supersession metadata; never overwrite old raw evidence or
silently replace a defer baseline.

## 5. Candidate safety and validation separation

ASM-PC-001's supported capacity-selected whole-story fallback remains valid.
Record `candidate.status`, rejection reasons, actual selected mode and fallback
evidence independently from raw geometric checks and stage disposition.
An expected insufficient-capacity rejection can correctly pass a **classification
assertion** without making that candidate PASS or qualifying unrelated geometry.
Supported capacity rejection alone is not automatically a new defect.

Conversely, usable fallback never waives a mandatory invariant, the required
qualified horizontal candidate under 013/014, or owner disposition. Old negative
fixtures stay negative. Preserve pure horizontal 1100x640 checks, full visible
segments/global intersection checks and the complete ink/interaction predicate.
Neither missing inputs nor universal fallback may manufacture qualification.

## 6. Frozen audit manifest and equivalent inputs

The approved execution manifest is
[`stage-1-inherited-audit-manifest.json`](../../../openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-manifest.json).
Its exact source-pinned selectors/profiles/states/sequences are the boundary:

- 150 existing current cases, plus 150 frozen-source comparison obligations;
- 3,240 Access state-observation slots: 18 profiles × 15 states/variants × two
  themes × three engines × two source revisions;
- 48 lifecycle and 24 static-accessibility sequences;
- all cases/fixtures in the seven score-unit and two component-test sources
  already specified in the approved manifest.

These are automated observation slots, not thousands of independent reasoning
tasks, browser builds, screenshots or narrative reports. Matching captured
inputs may satisfy overlapping obligations by reference; each slot must still
have a result/provenance or explicit blocker. No uncovered slot becomes PASS.
The audit SHALL not stop at the first inherited finding or first failed assertion
inside a case; complete the safe independent declared surface.

Compare frozen Phase-9 source `306ccb74da6c7bbf8f187e360c0776c571b5fc3d` with the
fingerprinted actual dirty Stage-1 tree. Control viewport/DPR, requested and
actual mode, theme, release/content/form/Turnstile state, fonts/readiness,
locale/timezone, seed/composition, interactions, policy/configuration and
build/runtime/bundler. Record both source lockfile hashes and use the same
installed toolchain/engines for paired source replay. This is not recreation
of historical dependency/browser installations or a historical aggregate PASS.

Use explicit common-mode comparison separately from each revision's actual
policy-selected mode; historical horizontal/current fallback is not an
equivalent geometry pair. Missing successor-only telemetry in history is not
an invented product failure. Preserve raw original tests and assertions;
supplemental collectors may obtain later observation inputs independently,
without weakening tests, changing product geometry or bypassing readiness.

The established 62/110/118 Access classification SHALL be reused for exactly
matching saved inputs, not rediscovered. Gather new declared coverage. States
include all ten UI states, acknowledgment-pending success and configuration/
visible-verification/expired-token variants. The 44px widget minimum and 118px
overflow observation are not maximum-envelope proof. Record actual provider
contract/occupied/focus bounds; a placeholder is insufficient. A transient
VALIDATING state with no committed frame is reported truthfully, with its
remaining source-derived envelope obligation. Uncontrolled provider state or
unexplained toolchain differences remain UNCLASSIFIED; do not extend retries
or scope indefinitely. No real registration or provider mail is sent.

## 7. Execution and artifact efficiency

The Astra High executor SHALL:

1. Generate/collect manifest observations mechanically into structured records.
2. Persist raw current/frozen measurements with exact input keys and source hashes.
3. Compare equivalent baseline/current pairs automatically, retaining both
   values, raw outcomes and comparison limitations.
4. Group equivalent occurrences and deduplicate candidate roots.
5. Spend model analysis only on differences, failures, unclassified observations
   and candidate root clusters. Summarize passing groups by counts/fingerprints;
   do not copy thousands of identical PASS observations into model context.
6. Produce one human-readable root inventory and occurrence matrices, linked
   to the complete machine-readable coverage/evidence. Do not write a narrative
   for every observation.

Structured canonical measurements are the primary audit evidence. Screenshots
are not required per observation. Capture only representative root evidence,
ambiguous classifications or material visual defects; later Human Geometry
Approval captures belong to the later acceptance stage. If an existing canonical
contract explicitly requires another artifact, retain that obligation and cite
its authority. Audit diagnostic images never substitute for later final captures
or mutate sealed historical images.

Audit automation/collectors may be created in an isolated diagnostic workspace;
they SHALL NOT alter product/runtime source, original validators or historical
source. Preserve instrumentation provenance and all failed attempts. A collector
defect permits at most two bounded evidence-based diagnostic corrections without
material progress; production pipeline repairs still require later disposition.
Use serial engines/workers=1, retries=0; any separately justified bounded
diagnostic retry is recorded rather than hidden as an automatic test retry.

An uncovered surface that might require expansion SHALL be recorded as
**OUT_OF_AUDIT_SCOPE / NEEDS_REVIEW**, with available evidence and proposed
follow-up boundary. Do not automatically add profiles, states or investigation
scope, start another broad audit, or repair it. Safety/authority blockers stop
the affected action immediately; independent safe in-manifest collection may
continue. Unavailable required cases remain blocking coverage gaps.

## 8. Completion, batch disposition and routing

The audit finishes collection only when every declared slot has an explicit
result or documented blocker and one deduplicated inventory/coverage ledger is
persisted. It is not qualified as complete evidence while material classification
or required coverage remains unresolved. Every root report contains lineage,
equivalent-input proof, occurrences, owner, severity, actual impact, fallback,
recommended disposition, minimum repair envelope and evidence paths.

After the audit, **STOP** for one owner/governance disposition covering the
complete batch. Do not begin repairs, even for an already bounded Access root.
Unknowns remain blocking; no blanket authorization for future discoveries.
Only after this disposition and resolution of architecture/governance ambiguity
may the bounded blocking package normally route to **GPT-5.6 Sol / High**.
That implementation uses focused checks before deterministic global qualification
and a fresh serial final matrix/evidence. It SHALL STOP at Human Geometry
Approval. No Stage 2+, refreeze, new motion, commit/push/deploy or self-approval.

## 9. Normalization and preservation checks

Before the Ultra handoff, validate successor/workspace OpenSpec strict,
decision/ID uniqueness and references, structured JSON/YAML, manifest counts and
source pins, registry schema/semantic conditions, `git diff --check`, four
historical seals/64 payloads and preservation of unrelated dirty files.
Correct only AGENTS' stale routing-policy path; do not rewrite AI-MRP-001.

Preserve the five deltas; 14 Batch-1 repairs/18 occurrences; six Batch-2 repairs/
eight occurrences; ASM-PC-001/002/003; current measurement/order/restoration and
candidate/runtime/policy work; ADR-046; Composer semantics/seed/fingerprints;
approved glyphs; three visits/NON-ASSEMBLY; 12px/full ink/global zero; all negative
fixtures, validators, prior diagnostics and historical evidence. Progress remains
7/92 and Human Geometry Approval pending. Governance PASS is not runtime PASS.
