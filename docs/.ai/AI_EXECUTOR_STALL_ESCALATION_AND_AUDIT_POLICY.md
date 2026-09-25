# AI Executor Stall, Escalation, and Systematic Audit Policy

**Document type:** Technical governance policy  
**Status:** Draft for canonicalization  
**Language:** English (canonical technical documentation)  
**Scope:** AI-assisted implementation workflows, especially long-running successor stages with inherited defects, cross-browser/layout validation, or repeated repair loops  
**Related policy:** `AI-MRP-001` model-routing policy  

---

## 1. Purpose

This document defines how an AI executor must behave when implementation stops making useful progress because it remains on the same problem for too long, repeatedly discovers adjacent defects, or enters a repair-and-retest loop that can consume significant time and model budget without converging.

The objective is not to make the executor abandon difficult problems prematurely. The objective is to make lack of convergence explicit, bounded, evidence-based, recoverable, and economically controlled.

The policy separates five concerns that must not be conflated:

1. **bounded implementation** — a known fix inside an approved contract;
2. **complex diagnosis** — the cause is not yet sufficiently understood;
3. **architecture/governance** — the fix would change ownership, contracts, invariants, or authorized scope;
4. **systematic audit** — repeated inherited findings indicate that sequential remediation is no longer efficient;
5. **human decision** — implementation must stop because a product/owner choice is required.

---

## 2. Problem Definition

An AI executor is considered to be in a **non-convergent problem loop** when one or more of the following conditions occurs:

- the same root cause survives repeated bounded repair attempts;
- each repair exposes another independent inherited defect before the stage can close;
- validation repeatedly moves the blocker to another nearby subsystem without reducing uncertainty;
- the executor starts changing unrelated code to make a failing test pass;
- the executor repeatedly broadens scope without an explicit authorization decision;
- a test harness, measurement system, or audit collector becomes a new open-ended implementation project;
- the work repeatedly escalates and downgrades model tiers without a durable causal checkpoint;
- final validation never reaches completion because the first newly exposed inherited failure always restarts the repair cycle.

A typical failure pattern is:

```text
repair A
  -> rerun validation
  -> discover inherited B
  -> stop
  -> govern B
  -> repair B
  -> rerun validation
  -> discover inherited C
  -> ...
```

This sequence is technically cautious but operationally unbounded.

---

## 3. Core Principles

### 3.1 Do not confuse persistence with progress

An executor must not continue patching merely because tokens, time, or a stronger model are still available.

Progress requires at least one of the following:

- a previously unknown causal relationship is proven;
- the failing surface is narrowed;
- an invariant is validated or eliminated as a cause;
- a failing test moves to a demonstrably later acceptance boundary for a known reason;
- a bounded fix is implemented and validated;
- the remaining task becomes smaller and better specified.

Repeated edits without such progress are not considered convergence.

### 3.2 Preserve the user's experience independently from validator success

A safe runtime fallback may be used to keep the product usable when an enhanced candidate cannot be safely rendered.

However:

```text
safe runtime fallback != validation PASS
```

Fallback protects the user. It must not hide an invalid candidate, weaken the acceptance contract, or erase the underlying finding.

### 3.3 Never repair outside authority merely to keep moving

If the required repair exceeds an approved envelope, the executor must stop and classify the need for broader authority.

It must not:

- redesign neighboring geometry;
- relax a threshold;
- reduce accessibility behavior;
- disable a validator;
- convert an inherited defect into a current-stage exception;
- silently assign itself ownership of a new subsystem.

### 3.4 Stronger validation may expose historical defects

A successor stage may discover failures that existed in an accepted historical baseline.

The correct interpretation is normally:

> A stronger successor acceptance surface exposed an inherited limitation.

This does **not** automatically mean the historical stage must be retroactively declared failed.

---

## 4. Anti-Loop Rules

### 4.1 Same-root bounded-attempt limit

If the **same unresolved root cause survives two bounded, evidence-based implementation attempts without material progress**, the executor must stop before a third speculative patch.

Required action:

```text
BOUNDED_IMPLEMENTATION
        -> two failed bounded attempts
        -> COMPLEX_DIAGNOSIS
```

Default routing:

- bounded implementation: cost-efficient implementation model;
- complex diagnosis: stronger diagnostic model.

The retry counter applies to the **root cause**, not to superficial symptoms or individual test names.

### 4.2 Unregistered defect rule

If a new defect is encountered outside the current authorized envelope:

1. stop product repair;
2. preserve the worktree;
3. record the exact occurrence;
4. classify whether it is:
   - current regression;
   - inherited defect;
   - validation/measurement defect;
   - non-equivalent reproduction;
   - another proven cause;
5. only then decide whether implementation may resume.

The executor must not allocate a canonical repair ID or expand authority unless the repository's governance process permits it.

### 4.3 Repeated inherited-defect trigger

When **three distinct inherited root defects** are discovered during the same successor stage, sequential defect-by-defect remediation must pause by default.

Repeated occurrences of one root cause do not count separately.

Do not count as separate inherited roots:

- multiple browsers showing the same root;
- multiple viewports showing the same root;
- duplicated test failures caused by one mechanism;
- test-harness or collector defects.

Required transition:

```text
sequential repair
    -> >= 3 distinct inherited roots
    -> pause repairs
    -> bounded systematic audit
```

The threshold may only be changed through explicit governance.

---

## 5. Finding Taxonomy

Every unique root cause discovered during diagnosis or audit must be classified.

### 5.1 `CURRENT_REGRESSION`

The current implementation introduced or materially worsened behavior relative to an equivalent accepted baseline.

**Default stage disposition:** `BLOCK_STAGE`.

### 5.2 `INHERITED_CRITICAL`

The failure already existed historically, but it materially breaks a supported user experience or mandatory invariant.

Examples:

- inaccessible or clipped critical content;
- unusable form or CTA;
- broken navigation;
- accessibility failure;
- material content/geometry collision;
- security or data-integrity issue;
- no supported safe fallback where one is required.

**Default stage disposition:** `BLOCK_STAGE`.

### 5.3 `INHERITED_NONBLOCKING`

The failure is inherited, current behavior is not worse than the equivalent baseline, and user/functionality/accessibility impact is non-critical.

**Default stage disposition:** `OWNER_REVIEW_FOR_DEFER`.

It must never be silently deferred.

### 5.4 `VALIDATION_PIPELINE_DEFECT`

The validator, test harness, measurement lifecycle, readiness protocol, candidate construction, collector, or equivalent infrastructure is incorrect.

**Default disposition:** repair the validation pipeline; do not modify product geometry or product behavior to satisfy a bad measurement.

### 5.5 `UNCLASSIFIED`

The available evidence is insufficient to determine the root class without exceeding current scope.

**Disposition:** owner/governance review.

### 5.6 `OUT_OF_AUDIT_SCOPE`

A potential issue was observed outside a pre-approved systematic-audit manifest.

**Disposition:** record minimal evidence and do not expand the active audit automatically.

### 5.7 `SAFE_FALLBACK`

`SAFE_FALLBACK` is an attribute, not a defect class.

A root may record:

```text
safeFallbackAvailable = true | false
```

Fallback never converts a failing enhanced candidate into PASS.

---

## 6. Systematic Audit Mode

### 6.1 Purpose

A systematic audit is used when sequential remediation is no longer an efficient way to learn how many blockers remain.

Its question is:

> What are all currently known distinct root defects across the approved acceptance surface before more repairs are performed?

### 6.2 Audit-only rule

During the audit:

- do not repair product/runtime code;
- do not weaken validators;
- do not stop at the first ordinary product failure;
- do not allocate repair authority per finding;
- do not expand the audit manifest automatically.

The execution model is:

```text
manifest
  -> automated observations
  -> durable structured results
  -> equivalent baseline/current comparison
  -> occurrence clustering
  -> root-cause deduplication
  -> focused diagnosis of unique/ambiguous roots
  -> one inventory
  -> STOP
```

### 6.3 Prebounded manifest

The audit surface must be declared before execution.

The manifest should define, as applicable:

- viewports;
- responsive modes;
- themes;
- branches/chapters/surfaces;
- UI states;
- external-service states;
- interaction sequences;
- browsers/engines;
- historical/current sources;
- expected observation expansion.

The manifest must not grow silently while the audit runs.

### 6.4 Do not fail fast

Ordinary product failures are audit data.

Required behavior:

```text
FAIL
  -> persist result
  -> continue independent observations
```

Not:

```text
FAIL -> pretend PASS
```

and not:

```text
FAIL -> abort entire audit
```

### 6.5 Deduplicate by root cause

A failing test is not automatically a defect.

For example:

```text
387 failing observations
        -> 11 occurrence clusters
        -> 4 distinct causal roots
```

Only the four roots should drive governance and repair planning.

---

## 7. Audit-Harness Boundaries

The audit harness itself must not become another open-ended product.

If a new harness/collector issue appears:

1. allow at most one bounded tooling correction for that root;
2. do not alter product/runtime behavior;
3. do not weaken acceptance predicates;
4. if the bounded correction does not restore the affected subset, mark it `INFRASTRUCTURE_BLOCKED`;
5. continue every unaffected observation.

Conceptually:

```text
harness problem
      -> one bounded correction
      -> resolved? yes -> continue
                  no  -> infrastructure-blocked subset
                         + continue remainder
```

Examples of harness issues:

- serialization bugs;
- browser/session loss;
- state cascading between independent observations;
- stale dev-server bundle;
- non-equivalent font/toolchain state;
- collector process interruption.

---

## 8. Equivalent-Input Requirement

Historical/current comparisons are valid only under equivalent inputs.

Where relevant, equivalence must control:

- viewport;
- DPR;
- responsive/projection mode;
- theme;
- content variant;
- form state;
- external-service configuration/state;
- fonts/readiness;
- interaction state;
- seed/composition;
- build/runtime mode;
- relevant environment variables.

A difference observed under non-equivalent inputs must not be labeled a regression.

---

## 9. Model Routing and Cost Control

Model routing must follow the remaining task, not the model used previously.

### 9.1 Remaining task classes

#### `BOUNDED_IMPLEMENTATION`

Cause and repair envelope are known.

Default target: cost-efficient implementation model.

#### `COMPLEX_DIAGNOSIS`

Root cause remains materially uncertain, especially across modules, browsers, measurement systems, or historical/current states.

Default target: stronger diagnostic model.

#### `ARCHITECTURE_GOVERNANCE`

The next action requires a new contract, owner boundary, invariant, repair envelope, or canonical policy.

Default target: highest architecture/governance reasoning tier.

#### `HUMAN_DECISION`

A product/owner decision is required.

Default action: stop. Do not spend a stronger model merely to wait.

#### `COMPLETE`

No remaining work in the current scope.

Default action: stop.

### 9.2 Upgrade progressively; downgrade by direct reclassification

Escalation may be progressive as uncertainty increases.

Downgrade must not mechanically walk the reverse ladder.

When expensive diagnostic/governance work finishes, reclassify the remaining task and select the least costly suitable model directly.

Example:

```text
architecture/governance resolved
        -> remaining work = bounded implementation
        -> direct downgrade to implementation model
```

Do not retain a more expensive model merely because the previous task required it.

---

## 10. Durable Checkpoints

Long-running executor work must be resumable after:

- model usage limit;
- context compaction;
- chat interruption;
- browser crash;
- machine reboot;
- dev-server restart.

### 10.1 Repository state is authoritative

At every meaningful stop, record at minimum:

- branch;
- HEAD SHA;
- dirty-worktree expectation;
- active OpenSpec/change;
- current task/stage;
- current authorization boundary;
- exact durable evidence paths;
- tests/checks completed;
- tests/checks not completed;
- routing status;
- first incomplete action.

### 10.2 Ephemeral state is not completion

Do not treat as durable authority:

- running PIDs;
- shell sessions;
- browser contexts;
- in-memory queues;
- dev servers;
- `/tmp` files unless they have been deliberately copied to durable project evidence.

After a reboot, recover from durable repository artifacts and rebuild only the pending observation queue.

### 10.3 Do not restart completed work unnecessarily

Recovery logic should be:

```text
canonical manifest
    + durable completed observation IDs
    -> pending observation IDs
    -> resume pending only
```

Do not rerun valid persisted observations without cause.

---

## 11. Stage Blocking and Deferred Findings

### 11.1 Always blocking by default

A finding blocks the stage when it is:

- `CURRENT_REGRESSION`;
- `INHERITED_CRITICAL`;
- material accessibility failure;
- critical content/form/CTA unusable or clipped;
- broken navigation;
- security/data-integrity failure;
- explicit current-stage invariant violation;
- unsupported user experience with no approved safe fallback.

### 11.2 Defer may be considered only when all conditions hold

A finding may be proposed for defer only when:

- it is inherited;
- current equivalent behavior is not worse than historical equivalent behavior;
- impact is non-critical;
- there is no material accessibility/functionality loss;
- there is no security/data-integrity impact;
- the owner explicitly approves defer;
- the finding remains visible in validation evidence;
- the validator remains enabled;
- a future owner/review point is recorded.

There is no automatic defer.

### 11.3 Known inherited issue ledger

Approved deferred inherited findings should be stored in a durable structured registry containing at least:

- stable finding ID;
- root-cause identity;
- affected surfaces;
- occurrence matrix;
- historical evidence;
- current equivalent evidence;
- severity;
- user impact;
- accessibility impact;
- safe fallback availability;
- owner disposition;
- remediation owner/review stage;
- measurable accepted baseline where applicable.

A known inherited finding that becomes worse than its accepted baseline becomes blocking again.

---

## 12. Decision Algorithm

The executor should apply the following logic after every meaningful blocker:

```text
Is current task already complete?
  yes -> STOP / COMPLETE
  no
   |
Does next action require human choice?
  yes -> STOP / HUMAN_DECISION
  no
   |
Does fix require new contract, owner, invariant, or repair envelope?
  yes -> ARCHITECTURE_GOVERNANCE
  no
   |
Is causal explanation materially uncertain across modules/engines/baselines?
  yes -> COMPLEX_DIAGNOSIS
  no
   |
Is cause known and fix bounded?
  yes -> BOUNDED_IMPLEMENTATION
  no  -> STOP and classify uncertainty
```

Additional anti-loop guards:

```text
same root survives 2 bounded attempts
  -> stop speculative patching
  -> COMPLEX_DIAGNOSIS

>= 3 distinct inherited roots in one successor stage
  -> pause sequential remediation
  -> SYSTEMATIC AUDIT
```

---

## 13. Required Stop States

Executors should emit explicit terminal states rather than vague prose.

### 13.1 Upgrade required

```text
ROUTING_STATUS=UPGRADE_READY
UPGRADE_REQUIRED=true
REMAINING_TASK_CLASS=COMPLEX_DIAGNOSIS|ARCHITECTURE_GOVERNANCE
SAFE_TO_CONTINUE_CURRENT_MODEL=false
```

### 13.2 Downgrade ready

```text
ROUTING_STATUS=DOWNGRADE_READY
CURRENT_SCOPE_COMPLETE=true
SAFE_TO_DOWNGRADE=true
REMAINING_TASK_CLASS=BOUNDED_IMPLEMENTATION|COMPLEX_DIAGNOSIS
NEXT_MODEL=<selected profile>
```

### 13.3 Owner decision required

```text
ROUTING_STATUS=BLOCKED_OWNER_DECISION
REMAINING_TASK_CLASS=HUMAN_DECISION
HUMAN_AUTHORIZATION_REQUIRED=true
SAFE_TO_CONTINUE_IMPLEMENTATION=false
```

### 13.4 Audit completion

```text
AUDIT_COMPLETE=true|false
MANIFEST_LOGICAL_CASES=<n>
EXPANDED_OBSERVATIONS=<n>
COMPLETED_OBSERVATIONS=<n>
INFRASTRUCTURE_BLOCKED=<n>
PENDING_OBSERVATIONS=<n>

UNIQUE_ROOT_CAUSES=<n>
CURRENT_REGRESSIONS=<n>
INHERITED_CRITICAL=<n>
INHERITED_NONBLOCKING=<n>
VALIDATION_PIPELINE_DEFECTS=<n>
UNCLASSIFIED=<n>
OUT_OF_AUDIT_SCOPE=<n>

BLOCKING_ROOTS=<IDs>
POTENTIAL_DEFER_ROOTS=<IDs>
AUDIT_REPORT_PATH=<path>
AUDIT_RESULTS_PATH=<path>
```

The executor must stop after the inventory and wait for one batch owner/governance disposition before repairs begin.

---

## 14. Batch Governance After Audit

After a systematic audit:

1. do not route one model per defect;
2. review the deduplicated root inventory once;
3. decide the disposition of the complete batch;
4. normalize any new contracts/repair envelopes in one governance pass;
5. create one bounded implementation package for all approved blocking repairs;
6. run a fresh validation matrix after the package is implemented;
7. proceed to the human gate only after automated acceptance stabilizes.

Preferred flow:

```text
systematic audit
   -> one root-cause inventory
   -> one owner/governance decision
   -> one bounded repair package
   -> one fresh final validation
   -> human approval gate
```

This is the primary mechanism for reducing repeated token-heavy escalation loops.

---

## 15. Required Evidence for Every Long-Running Problem

Before escalating or stopping, persist:

- exact failing invariant;
- exact reproduction inputs;
- observed vs required value;
- affected module/owner;
- current/historical lineage if applicable;
- attempt count for the same root;
- what changed between attempts;
- which hypotheses were eliminated;
- which authority boundary was reached;
- tests executed and their results;
- worktree provenance;
- files modified;
- what remains incomplete;
- recommended next task class.

The next model must not be forced to rediscover this information from chat history.

---

## 16. Forbidden Behaviors

When an executor is stuck, the following are prohibited unless separately authorized:

- third speculative patch of the same unresolved root after two bounded failed attempts;
- destructive reset/clean/checkout of an intentionally dirty worktree;
- changing acceptance thresholds merely to obtain green tests;
- disabling/skipping/fixing tests as a substitute for disposition;
- silently broadening repair scope;
- changing unrelated product code during audit-only work;
- treating safe fallback as validation PASS;
- automatic defer of inherited findings;
- automatically expanding a bounded audit manifest;
- narrating thousands of passing observations individually;
- using a stronger model merely because the previous task used one;
- claiming human approval;
- treating usage-limit interruption as task completion;
- relying on ephemeral state after reboot or context loss.

---

## 17. Acceptance Criteria for This Policy

The policy is functioning correctly when all of the following are true:

1. the executor can identify the current root cause or explicitly classify it as uncertain;
2. the same root cannot receive unlimited speculative patches;
3. repeated inherited findings trigger systematic inventory rather than endless sequential repair;
4. audit scope is finite before execution;
5. ordinary audit failures do not terminate unrelated observations;
6. findings are deduplicated by root cause;
7. runtime fallback can protect users without hiding validation failure;
8. current regressions remain blocking;
9. inherited non-critical findings require explicit owner disposition to defer;
10. expensive models are used only for work that requires them;
11. completed diagnostic/governance work can downgrade directly to a cheaper suitable executor;
12. machine reboot or model interruption does not force a full restart;
13. the executor produces a durable handoff before every scope/model boundary;
14. the final repair phase begins from one bounded, owner-approved batch rather than a stream of newly discovered individual defects.

---

## 18. Recommended Repository Integration

If approved as canonical policy, integrate it through existing project governance rather than duplicating multiple editable normative copies.

Recommended references:

- `AGENTS.md` — short mandatory execution/routing rules;
- `docs/.ai/AI_MODEL_ROUTING_POLICY.md` — model-selection and anti-loop routing;
- project canonical architecture/governance documentation — systematic audit and stage-blocking rules;
- `CURRENT_HANDOFF.md` — exact current execution checkpoint only;
- OpenSpec — change-specific repair/audit contracts and acceptance criteria.

The canonical source must be singular. Other files should reference it instead of maintaining divergent copies.

---

## 19. Executive Summary

When an AI executor remains on a problem for too long, the correct response is not unlimited retries and not premature abandonment.

The required behavior is:

```text
bounded attempt
   -> evidence
   -> bounded attempt
   -> still same root?
        yes -> stop speculative patching
               -> stronger diagnosis

repeated inherited roots?
        yes -> stop sequential remediation
               -> systematic finite audit
               -> deduplicated inventory
               -> one owner decision
               -> one bounded repair batch
```

The goal is convergence: each expensive execution must either reduce uncertainty, close a bounded repair, or produce a durable decision boundary.

If it does none of those, it must stop rather than continue consuming time and model budget.
