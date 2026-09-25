# AI Model Routing, Escalation, Downgrade and Handoff Policy

**Policy ID:** `AI-MRP-001`  
**Version:** `1.1.0`  
**Status:** Approved operating policy; repository integration is required before claiming local activation.  
**Issued:** `2026-09-10`  
**Normative language:** English. User-facing summaries follow the user's language.  
**Scope:** All of the owner's software-development projects and Codex/executor workflows.  
**Authority:** Owner-approved model-routing, anti-loop and handoff decisions. This policy does not grant product, infrastructure, security, commit or deployment permissions.

## 1. Purpose and operating summary

Use the least costly suitable model/reasoning configuration that can reliably satisfy the authorized task. Optimize **total cost to an accepted result**, including failed attempts, context reconstruction, regression recovery and human review; do not optimize token count by omitting required verification.

The approved **escalation** route is:

```text
BOUNDED_IMPLEMENTATION
        |
        | persistent failure or materially complex investigation
        v
COMPLEX_DIAGNOSIS
        |
        | unresolved architecture, scope, governance or high-risk decision
        v
ARCHITECTURE_GOVERNANCE
```

Downgrade does **not** have to follow that ladder in reverse order. At the next safe operational boundary, reclassify the **remaining task** and select the least costly suitable profile for that remaining work.

Examples:

```text
ARCHITECTURE_GOVERNANCE -> BOUNDED_IMPLEMENTATION
```

when architecture/governance is resolved and only bounded implementation remains;

```text
ARCHITECTURE_GOVERNANCE -> COMPLEX_DIAGNOSIS
```

when the architectural question is resolved but substantial complex diagnosis, cross-module reasoning or cross-engine investigation still remains.

The routing objective is asymmetric:

- **upgrade progressively** when additional capability is actually required;
- **downgrade directly** to the cheapest suitable profile after uncertainty or risk has been reduced.

**Decision ID:** `AI-MRP-DEC-001` — Direct cost-aware downgrade reclassification.

**Automatic means automatic detection, stopping and handoff preparation.** This Markdown file does not change the running model. The owner changes the model/reasoning setting and resumes execution, unless a separately authorized orchestration system actually supports that operation. Writing `MODEL:` in a prompt is a requested configuration, not proof that the configuration changed.

The model names and effort labels in this document are owner-selected operating profiles, not claims about current API identifiers, product availability, pricing, context windows or benchmark superiority. Do not invent mappings to unavailable settings. Verify operational availability when necessary and request a substitution if the selected profile cannot be used.

### 1.1 Non-negotiable rules

- A model switch does not expand scope or replace human approval.
- After two bounded attempts on the same unresolved failure without material progress, stop rather than make a third speculative patch.
- When an upgrade or downgrade condition is met, reach the nearest safe operational boundary, preserve state, prepare the handoff and stop. Do not start optional work.
- A downgrade target is chosen from the remaining task class, not from the current model's adjacent lower tier. Skipping an intermediate tier is allowed and preferred when it reduces cost without weakening correctness or safety.
- Preserve the worktree, historical evidence, tests and acceptance thresholds.
- Keep one repository-local canonical copy of this policy. Reference it instead of copying the entire policy into every prompt or `AGENTS.md`.
- Model choice never excuses missing tests, weaker safety checks or false completion claims.

## 2. Repository integration and first-read registration

**Integration contract ID:** `AI-MRP-INSTALL-001`

This section is an instruction to the executor reading the policy. Its purpose is to make the policy discoverable during future project bootstrap, rather than relying on conversation memory.

### 2.1 First-read responsibility

When first reading this document in a project, the executor MUST check whether the applicable `AGENTS.md` already references the actual canonical policy file.

When documentation/governance edits are within the current authorization, the executor SHALL add or reconcile the reference using the procedure below. This is a bounded onboarding edit, not permission to rewrite project instructions or implement product changes.

When the current run is read-only, changes to agent instructions are prohibited, or applicable instructions require separate approval, the executor SHALL NOT edit `AGENTS.md`. It shall report `AGENTS_REFERENCE_PENDING`, give the exact proposed path and insertion block, and wait for permission. Reading an uploaded file alone does not bypass repository write restrictions.

A repository reference cannot bootstrap itself before anyone reads the policy once. The initial owner/executor must explicitly read or install the file. After registration, future executions must follow the reference through the project's normal instructions-loading workflow.

### 2.2 Choose the canonical file location

Use the real repository path, not a downloaded attachment path or a path from another workstation.

The default location for a project without an established governance tree is:

```text
docs/ai/AI_MODEL_ROUTING_POLICY.md
```

If the project already has a canonical governance directory, use that directory instead. If an authoritative copy already exists, reuse it. Do not create competing copies in both `docs/ai` and the existing governance tree.

Locate the file by its actual path and Policy ID `AI-MRP-001`. Do not treat a guessed filename, a search-result title or an attachment name as proof that it is present in the repository.

Do not overwrite a newer or locally amended policy with this version. Compare versions and approved local amendments first. Unresolved contradictions require an owner decision.

### 2.3 Safe integration procedure

Perform the following once at initial registration, and again only when the policy location or integration block materially changes:

1. Confirm the repository root and inspect the current Git status, when Git is available. Record pre-existing changes without resetting them.
2. Read the applicable root `AGENTS.md` and any scoped instructions relevant to the files being edited. Respect their actual precedence.
3. Determine the canonical policy path and confirm that it exists inside the repository. Record the repository-relative path.
4. Search the applicable `AGENTS.md` for `AI-MRP-001`, the markers below and existing equivalent model-routing instructions. Do not duplicate an existing reference under another heading.
5. If the marked block is absent and there is no equivalent reference, append the short block from Section 2.4 in an appropriate governance/execution section.
6. If the marked block already exists and is correct, make no change. If its policy path is stale, update only that block after confirming the new path.
7. If equivalent instructions exist without markers, reconcile them with a minimal edit. Preserve any stricter project-specific safety requirements. If they conflict with an approved decision, report the conflict instead of silently choosing a rule.
8. Preserve all unrelated text, formatting conventions and existing worktree changes. Do not replace the whole `AGENTS.md` or regenerate it from a template.
9. Update a documentation manifest or start-here index only if the project's existing convention requires it. Add a link/status entry, not another normative copy of the policy.
10. Validate the actual link target, uniqueness of the reference and scope of the diff. When applicable, run `git diff --check`.
11. Report the policy path, `AGENTS.md` path, whether the reference was created/updated/already present, and every file changed by integration.

Do not install plugins, update models/dependencies, alter global user configuration, modify skills, edit another repository, commit, push or deploy as a side effect of this procedure.

If the project has no `AGENTS.md`, create a minimal root file only when permitted by the current authorization and existing project convention. Do not replace another established instruction mechanism without approval.

A root reference is preferred for project-wide coverage. Do not copy it into every nested directory. Add scoped references only where the execution environment and project instruction layout actually require them.

### 2.4 Exact block to insert in `AGENTS.md`

The following is a template. Replace **every** occurrence of `<REPOSITORY_RELATIVE_POLICY_PATH>` with the verified path before writing it to `AGENTS.md`.

```markdown
<!-- AI-MODEL-ROUTING:BEGIN -->
## AI model routing and execution handoffs

Follow [AI-MRP-001](<REPOSITORY_RELATIVE_POLICY_PATH>) before substantial
implementation, debugging, architecture review or model-switch handoff.

- Read the policy through the actual repository-relative path. Do not rely on
  conversational memory as the authority for routing.
- Use the approved escalation ladder: BOUNDED_IMPLEMENTATION -> COMPLEX_DIAGNOSIS ->
  ARCHITECTURE_GOVERNANCE. At downgrade boundaries, reclassify the remaining task
  and select the least costly suitable profile; downgrade is not required to
  proceed one tier at a time.
- Apply the policy's anti-loop and automatic upgrade/downgrade gates. Stop when
  a gate triggers, preserve the worktree, write the durable handoff and provide
  the next-run prompt. Do not claim to have changed the model automatically.
- Model escalation does not authorize a new scope, changed invariants or human
  approval. Preserve the project's existing governance and safety boundaries.
- Reference the policy rather than duplicating it. Project-specific execution
  instructions may narrow scope but must not silently weaken its stop,
  handoff, evidence-integrity or repository-safety requirements.
<!-- AI-MODEL-ROUTING:END -->
```

The link above assumes a root `AGENTS.md`. For a permitted scoped `AGENTS.md`, resolve the Markdown link relative to that file and state the repository-relative canonical path when useful. Validate the actual resolved target.

**Default-path example:** a root `AGENTS.md` links to `docs/ai/AI_MODEL_ROUTING_POLICY.md`. Do not put `/mnt/data/...`, a local home-directory path or an unresolved placeholder in the installed reference.

### 2.5 Idempotence and bootstrap checks

Installation is complete only when all checks pass:

| Check | Required result |
| --- | --- |
| Canonical copy | One authoritative repository file with Policy ID `AI-MRP-001` |
| Reference | Exactly one applicable routing block or equivalent reference, without duplication |
| Link target | Resolves to the actual canonical file |
| Existing instructions | Unrelated text and stricter safety rules preserved |
| Repeated installation | Second execution produces no diff |
| Scope | Documentation/instruction edits only; no product/runtime mutation |
| Status | Installation reported accurately; no claim of active model switching |

On later sessions, read `AGENTS.md`, then this policy and the relevant current project handoff. Do not repeat the installation audit, search the whole repository or rewrite the block on every turn when nothing changed.

## 3. Model profiles and routing defaults

**Contract ID:** `AI-MRP-ROUTE-001`

| Profile | Default use | Expected output |
| --- | --- | --- |
| `SOL_HIGH` - BOUNDED_IMPLEMENTATION | Approved, bounded implementation; known local bugs; predictable refactoring; tests; operational documentation/evidence | Implemented and verified authorized result, or a precise escalation handoff |
| `ASTRA_HIGH` - COMPLEX_DIAGNOSIS | Persistent failures; materially cross-module or cross-engine diagnosis; accumulated investigation context; interacting runtime owners | Verified root cause, bounded repair or an explicit architecture/scope blocker |
| `ASTRA_ULTRA` - ARCHITECTURE_GOVERNANCE | Unresolved architectural/normative conflict; significant security/data-integrity decision; governance exception; high-impact review | Decision analysis, authorized canonical normalization and an implementation-ready handoff |

These are assignments of work, not claims that another profile is incapable of the task. Apply the cheapest suitable profile to the current task, not to the entire project forever.

After a higher-cost profile resolves its assigned uncertainty, do not inherit that profile for the next task by default. Reclassify what remains. A completed ARCHITECTURE_GOVERNANCE architecture/governance run may therefore hand off directly to BOUNDED_IMPLEMENTATION when the remaining work is bounded implementation with explicit contracts and tests.

BOUNDED_IMPLEMENTATION XHigh/Extra-High and BOUNDED_IMPLEMENTATION ARCHITECTURE_GOVERNANCE are not normal escalation steps. COMPLEX_DIAGNOSIS XHigh/Extra-High is also not the default intermediate step. Exceptions require a stated reason such as explicit owner choice, verified workload benefit or temporary operational availability.

Other models may be evaluated for low-risk, mechanical work under explicit authorization. Do not silently change this ladder, invent model availability or upgrade dependencies merely because a new model exists.

## 4. Per-run declaration and actual configuration

For a substantial run, provide a compact declaration:

```text
ROUTING_CLASS: BOUNDED_IMPLEMENTATION
REASONING: HIGH
TASK: <authorized task and stage>
POLICY: <actual repository-relative policy path>, AI-MRP-001
WHY: <one sentence>
UPGRADE: <applicable triggers from this policy>
DOWNGRADE: <safe boundary, remaining task class and selected target profile, if relevant>
STOP: <human gate, scope limit and repository restrictions>
```

A recommendation does not prove the model currently executing it. Do not claim a setting was changed without reliable environment confirmation. If unavailable, state `CURRENT_CONFIGURATION=UNVERIFIED` and ask the owner to select/confirm the requested configuration at the handoff boundary.

Keep user-specific credentials, account identifiers and billing details out of declarations and handoffs.

## 5. Anti-loop discipline and material progress

**Contract ID:** `AI-MRP-LOOP-001`

### 5.1 What counts as a bounded attempt

One repair attempt consists of a causal hypothesis, a limited change or diagnostic intervention, the smallest relevant validation, and a recorded outcome. A test execution by itself is not a new repair attempt.

Initial reproduction, a browser failing before the code under test runs, or a command interrupted by infrastructure limits must be recorded accurately. Do not describe them as successful product tests or as evidence disproving a hypothesis they never exercised.

### 5.2 Material progress

Progress is material when new evidence narrows the failure mechanism, disproves a plausible cause, identifies the responsible owner, resolves a distinct failure, or establishes a previously unknown dependency/constraint.

Changing constants, control points or nearby syntax without a new causal explanation is not material progress. Changing a hypothesis label or weakening a test also does not reset the retry budget.

If a repair genuinely resolves one failure and a different independently reproduced failure appears, record the relationship. Do not automatically call it the same loop, and do not use a moving assertion as an excuse for indefinite speculative work.

### 5.3 Stop threshold

After **two bounded attempts on the same unresolved root failure without material progress**, stop before a third speculative patch. Preserve the attempt history across context compaction, new chats and model switches.

BOUNDED_IMPLEMENTATION escalates to COMPLEX_DIAGNOSIS. COMPLEX_DIAGNOSIS requests ARCHITECTURE_GOVERNANCE when deeper diagnosis or an architectural decision is required. ARCHITECTURE_GOVERNANCE stops for owner review if it cannot reduce the problem to a safe bounded next action; it must not create an endless higher-tier retry cycle.

An immediate scope, safety or authorization blocker takes precedence over the two-attempt budget.

## 6. Upgrade gates

**Contract ID:** `AI-MRP-UPGRADE-001`

### 6.1 BOUNDED_IMPLEMENTATION -> COMPLEX_DIAGNOSIS

Stop and prepare the upgrade when:

- the anti-loop threshold is reached;
- the failure becomes materially cross-module/cross-browser and its cause remains unclear;
- reconstruction of accumulated diagnostic context dominates the assigned bounded task;
- interactions among runtime owners cannot be explained with the existing local diagnosis.

Merely touching several files or running three browser engines is not by itself a failure. Use the gate when the task has actually become a substantial investigation.

### 6.2 COMPLEX_DIAGNOSIS -> ARCHITECTURE_GOVERNANCE

Stop for architecture/governance review when:

- approved requirements conflict;
- the correct fix may require changing an invariant, frozen scope or ownership contract;
- a new inherited defect lies outside explicitly authorized repair envelopes;
- the necessary security or data-integrity decision exceeds the approved implementation contract;
- a cross-system decision has material regression impact and is not settled by current documentation;
- the anti-loop threshold is reached and the remaining uncertainty requires deeper review.

An implementation that violates a clear specification normally needs repair, not a new ADR. Do not manufacture normative conflicts simply because debugging is difficult.

### 6.3 Escalation classification

Classify the reason rather than describing every escalation as model failure:

| Type | Meaning |
| --- | --- |
| `FAILURE_ESCALATION` | Bounded repair attempts failed without material progress |
| `COMPLEXITY_ESCALATION` | Investigation exceeds the current task's intended profile |
| `SCOPE_ESCALATION` | The needed work lies outside existing authorization |
| `RISK_ESCALATION` | Unresolved security, data integrity or high-impact risk requires review |

A model that discovers an out-of-scope defect and stops correctly has performed a successful escalation.

### 6.4 Authority is a separate gate

A stronger model does not automatically gain permission to repair newly discovered defects, change acceptance criteria or approve itself. If owner authorization is absent, the next run is **diagnosis/proposal only**. Mark that limitation explicitly in the handoff.

Once the owner approves a decision, normalize it into the canonical project records before using it to guide implementation.

## 7. Downgrade and remaining-task reclassification

**Contract ID:** `AI-MRP-DOWNGRADE-001`  
**Decision:** `AI-MRP-DEC-001`

Downgrade is a **task reclassification**, not a mandatory reverse walk through the escalation ladder.

When the current expensive profile reaches a safe boundary, classify the remaining work before choosing the next model.

### 7.1 Remaining task classes

Use exactly one primary remaining-task class when making a downgrade recommendation:

| Remaining task class | Meaning | Default target |
| --- | --- | --- |
| `BOUNDED_IMPLEMENTATION` | Architecture, ownership, invariants and acceptance are explicit; remaining work is predictable implementation/validation | `BOUNDED_IMPLEMENTATION` |
| `COMPLEX_DIAGNOSIS` | Material cross-module/cross-engine investigation or difficult unresolved runtime reasoning remains, but no architecture decision is pending | `COMPLEX_DIAGNOSIS` |
| `ARCHITECTURE_GOVERNANCE` | Architecture, scope, normative, security/data-integrity or high-impact ownership questions remain unresolved | `ARCHITECTURE_GOVERNANCE` |
| `HUMAN_DECISION` | The next required action is an owner/human choice rather than model work | Stop; do not recommend another expensive run merely to wait |
| `COMPLETE` | No further model work is required inside the current authorized scope | Stop |

A task-specific prompt may define a narrower classification vocabulary, but it must preserve this semantic distinction.

### 7.2 ARCHITECTURE_GOVERNANCE completion and direct downgrade

ARCHITECTURE_GOVERNANCE-specific work is complete when:

1. The difficult architecture/governance/risk question has been resolved with explicit evidence and a known scope.
2. Necessary owner decisions have been obtained; unresolved options are not presented as approvals.
3. Authorized canonical decisions and affected contracts are reconciled and validated.
4. The implementation owner, repair envelope, invariants and tests are explicit.
5. The preserved worktree and the exact next action are documented.
6. The remaining task can be classified without inventing unresolved rules.

At that boundary, **do not default automatically to COMPLEX_DIAGNOSIS**.

Instead:

- choose `BOUNDED_IMPLEMENTATION` when `REMAINING_TASK_CLASS=BOUNDED_IMPLEMENTATION`;
- choose `COMPLEX_DIAGNOSIS` when `REMAINING_TASK_CLASS=COMPLEX_DIAGNOSIS`;
- remain in or later return to `ARCHITECTURE_GOVERNANCE` only when a new authorized `ARCHITECTURE_GOVERNANCE` task actually exists;
- stop without model continuation when `REMAINING_TASK_CLASS=HUMAN_DECISION` or `COMPLETE`.

A direct `ARCHITECTURE_GOVERNANCE -> BOUNDED_IMPLEMENTATION` handoff is expected when governance is complete and the remaining work is bounded implementation. There is no requirement to pay for an intermediate COMPLEX_DIAGNOSIS run merely because it is one tier below ARCHITECTURE_GOVERNANCE.

Stop at the safe boundary. Do not begin optional repairs, the browser matrix or final evidence merely because the ARCHITECTURE_GOVERNANCE run still has time or credits available.

If a human decision is still required, emit `BLOCKED_OWNER_DECISION`, not a false `SAFE_TO_DOWNGRADE=true`.

### 7.3 ARCHITECTURE_GOVERNANCE -> COMPLEX_DIAGNOSIS

Use COMPLEX_DIAGNOSIS after ARCHITECTURE_GOVERNANCE only when substantial complex diagnosis still remains after the architecture/governance decision has been normalized, for example:

- unresolved cross-browser/cross-engine behavior still requires focused causal investigation;
- several interacting runtime owners remain difficult to reconcile;
- a long accumulated diagnostic state still materially affects the next task;
- the next step is investigative rather than predictable implementation.

Do not use COMPLEX_DIAGNOSIS merely as a ceremonial intermediate downgrade step.

### 7.4 COMPLEX_DIAGNOSIS -> BOUNDED_IMPLEMENTATION

Recommend BOUNDED_IMPLEMENTATION when the root cause and implementation contract are settled, tests define success, material cross-environment ambiguity is resolved and remaining work is predictable.

COMPLEX_DIAGNOSIS may also downgrade directly to stop/complete when no implementation remains.

Do not switch mid-transaction, mid-test evidence generation or halfway through a tightly coupled repair solely because one subtask looks simple. Reach a natural completed-subtask boundary. A task-specific instruction may retain COMPLEX_DIAGNOSIS through a defined cross-browser repair batch or human gate when that continued complexity is real and documented.

### 7.5 Direct target selection algorithm

At a safe routing boundary, apply this order:

```text
1. Is an owner/human decision required?
   YES -> HUMAN_DECISION -> STOP

2. Does unresolved architecture/governance/security/data-integrity scope remain?
   YES -> ARCHITECTURE_GOVERNANCE -> ARCHITECTURE_GOVERNANCE

3. Does substantial complex diagnosis remain?
   YES -> COMPLEX_DIAGNOSIS -> COMPLEX_DIAGNOSIS

4. Is the remaining work bounded implementation/validation?
   YES -> BOUNDED_IMPLEMENTATION -> BOUNDED_IMPLEMENTATION

5. Otherwise:
   COMPLETE -> STOP
```

Do not choose the next profile from the identity of the current model. Choose it from the remaining task.

### 7.6 Prevent model ping-pong

Do not revisit the routing recommendation every few minutes without new evidence. Base it on an actual change in task class.

A downgrade must occur at a safe task boundary, not every time a single function becomes simple. Conversely, do not retain an expensive model through a long predictable implementation merely because the preceding investigation required it.

Once downgraded, the receiving model must consume the handoff instead of rebuilding the expensive investigation. If it later hits a genuine upgrade gate, follow Section 6 normally.

## 8. Stop, preserve and handoff lifecycle

**Contract ID:** `AI-MRP-HANDOFF-001`

The routing lifecycle is:

```text
ASSIGNED -> RUNNING
RUNNING -> UPGRADE_READY -> WAITING_FOR_MODEL_SWITCH
RUNNING -> DOWNGRADE_READY -> WAITING_FOR_MODEL_SWITCH
RUNNING -> BLOCKED_OWNER_DECISION
RUNNING -> PAUSED_INTERRUPTED
RUNNING -> HUMAN_REVIEW_REQUIRED
RUNNING -> TASK_COMPLETE
```

On an upgrade/downgrade trigger:

1. Stop initiating new substantive work.
2. Reach a safe interruption point. Do not interrupt an active write or critical operation destructively just to satisfy the routing label.
3. Recover the status/output of any running command when available. Record incomplete commands as incomplete.
4. Preserve valid implementation, tests and diagnostics. Do not reset, clean, overwrite or commit them unless separately authorized.
5. Write the durable handoff and, if useful, one short pointer from the project's existing current handoff.
6. Reclassify the remaining task when this is a downgrade boundary, select the least costly suitable target profile, then emit the terminal routing status and a bounded next-run prompt.
7. Wait. Do not execute the next-profile prompt in the same run.

At a human review gate, stop for the human decision even if a cheaper model could perform the next step. A routing recommendation never bypasses a stage gate.

A usage limit or machine shutdown is an interruption, not evidence that a task or governance decision succeeded. On resume, verify the recorded state against live files before proceeding.

## 9. Durable handoff artifact

Use the project's established handoff directory and naming convention when one exists. Otherwise use:

```text
docs/ai/handoffs/CURRENT_MODEL_HANDOFF.md
```

This handoff is an operational checkpoint, not a second canonical specification. Link to existing detailed diagnostics instead of duplicating them. Preserve prior useful findings through the project's history convention or compact attempt log.

Do not use `/tmp` as the only source of recovery. Promote the minimum necessary replay inputs, command outputs and hypotheses to an authorized durable location. Record temporary files as optional scratch material. Never include secrets, private form submissions, access tokens or credentials.

### 9.1 Required content

The handoff must identify:

- The objective, active project/change/task and authorized stop boundary.
- Canonical document paths and exact decision/requirement IDs relevant to the blocker.
- Current Git HEAD, actual worktree/diff scope, and which changes predate this run.
- Expected behavior, observed behavior and the exact failing test/assertion.
- Reproduction command, environment/viewport/mode inputs and persisted evidence paths.
- Attempts already performed, their causal hypotheses, outcomes and disproved hypotheses.
- Known facts, assumptions and unresolved questions, clearly distinguished.
- Passing, failing, interrupted and unexecuted checks, with the source state each actually tested.
- Invariants that must not change and prohibited fixes.
- The routing reason, next model/reasoning, whether owner authorization is still required, and the first next action.

Test results from a prior source state are historical evidence, not proof of a later edited worktree. Do not label HEAD as representing uncommitted implementation. A successful focused suite is not a successful full matrix.

### 9.2 Handoff template

```markdown
# Current Model Handoff

Policy: AI-MRP-001 / <effective version>
Updated: <timestamp with timezone>
Project / change / task: <identifiers>
Routing status: <terminal status>
Reason type: <escalation type or completed-scope downgrade>
Current configuration: <confirmed model/effort or UNVERIFIED>
Next configuration: <requested model/effort>
Owner authorization required: <yes/no and exact decision>

## Authorized objective and boundary
<What may continue, what must not continue, and the next human gate.>

## Canonical authority
<Actual paths and stable IDs. No copied full specification.>

## Repository state
HEAD: <full SHA or not applicable>
Worktree: <clean/dirty, including relevant untracked files>
Existing changes: <preserved prior work>
Current-run changes: <bounded list>
Pending processes: <command/status/output location or none>

## Reproduction and evidence
Expected: <behavior>
Observed: <behavior>
Command: <exact command>
Inputs/environment: <minimum reproducible inputs>
Failure: <exact meaningful assertion/error>
Evidence: <durable paths; identify optional scratch paths separately>

## Attempt history
| Attempt | Hypothesis | Change/diagnostic | Result | What it established |
| --- | --- | --- | --- | --- |
| 1 | ... | ... | ... | ... |
| 2 | ... | ... | ... | ... |

## Verified facts and uncertainty
Verified: <facts>
Disproved: <hypotheses and evidence>
Unresolved: <precise question>

## Validation state
<Passed/failed/interrupted/not run; source revision/digest where available.>

## Preserve / prohibited
<Invariants, evidence boundaries, unauthorized stages and dangerous fixes.>

## Next action
<First diagnostic or implementation step; no restart of the whole audit.>

## Continuation prompt
<Use Section 11; make owner permission limits explicit.>
```

Do not add a new logging framework just to populate this template. Use existing tests, Git information and diagnostic artifacts.

## 10. Machine-readable terminal response

**Contract ID:** `AI-MRP-STATUS-001`

Begin the final response with one routing status block when a routing or task boundary is reached. Select exactly one `ROUTING_STATUS`:

```text
UPGRADE_READY
DOWNGRADE_READY
BLOCKED_OWNER_DECISION
PAUSED_INTERRUPTED
HUMAN_REVIEW_REQUIRED
TASK_COMPLETE
CONTINUE_CURRENT
```

### 10.1 Upgrade ready

```text
ROUTING_STATUS=UPGRADE_READY
UPGRADE_REQUIRED=true
NEXT_MODEL=COMPLEX_DIAGNOSIS
NEXT_REASONING=HIGH
MODEL_CHANGE_REQUIRED=true
SAFE_TO_CONTINUE_CURRENT_MODEL=false
HUMAN_AUTHORIZATION_REQUIRED=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

Use `ULTRA` for an COMPLEX_DIAGNOSIS escalation requiring that profile. Set `HUMAN_AUTHORIZATION_REQUIRED=true` when the next task is blocked by scope/decision permission; in that case, the next prompt must be diagnosis-only, or use `BLOCKED_OWNER_DECISION` if the owner's choice is required before any further analysis.

### 10.2 Downgrade ready after remaining-task reclassification

Do not hardcode the downgrade target from the current profile. First set `REMAINING_TASK_CLASS`, then select the least costly suitable `NEXT_MODEL`.

Generic form:

```text
ROUTING_STATUS=DOWNGRADE_READY
CURRENT_SCOPE_COMPLETE=true
SAFE_TO_DOWNGRADE=true
REMAINING_TASK_CLASS=<BOUNDED_IMPLEMENTATION|COMPLEX_DIAGNOSIS>
NEXT_MODEL=<selected profile>
NEXT_REASONING=<selected effort>
MODEL_CHANGE_REQUIRED=true
HUMAN_AUTHORIZATION_REQUIRED=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

For an ARCHITECTURE_GOVERNANCE run, also include:

```text
ULTRA_SCOPE_COMPLETE=true
```

**Example — ARCHITECTURE_GOVERNANCE directly to BOUNDED_IMPLEMENTATION:**

```text
ROUTING_STATUS=DOWNGRADE_READY
ULTRA_SCOPE_COMPLETE=true
CURRENT_SCOPE_COMPLETE=true
SAFE_TO_DOWNGRADE=true
REMAINING_TASK_CLASS=BOUNDED_IMPLEMENTATION
NEXT_MODEL=BOUNDED_IMPLEMENTATION
NEXT_REASONING=HIGH
DOWNGRADE_REASON=BOUNDED_IMPLEMENTATION
MODEL_CHANGE_REQUIRED=true
HUMAN_AUTHORIZATION_REQUIRED=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

**Example — ARCHITECTURE_GOVERNANCE to COMPLEX_DIAGNOSIS because complex diagnosis remains:**

```text
ROUTING_STATUS=DOWNGRADE_READY
ULTRA_SCOPE_COMPLETE=true
CURRENT_SCOPE_COMPLETE=true
SAFE_TO_DOWNGRADE=true
REMAINING_TASK_CLASS=COMPLEX_DIAGNOSIS
NEXT_MODEL=COMPLEX_DIAGNOSIS
NEXT_REASONING=HIGH
DOWNGRADE_REASON=COMPLEX_DIAGNOSIS_REMAINS
MODEL_CHANGE_REQUIRED=true
HUMAN_AUTHORIZATION_REQUIRED=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

**Example — COMPLEX_DIAGNOSIS to BOUNDED_IMPLEMENTATION:**

```text
ROUTING_STATUS=DOWNGRADE_READY
CURRENT_SCOPE_COMPLETE=true
SAFE_TO_DOWNGRADE=true
REMAINING_TASK_CLASS=BOUNDED_IMPLEMENTATION
NEXT_MODEL=BOUNDED_IMPLEMENTATION
NEXT_REASONING=HIGH
DOWNGRADE_REASON=BOUNDED_IMPLEMENTATION
MODEL_CHANGE_REQUIRED=true
HUMAN_AUTHORIZATION_REQUIRED=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

If the remaining class is `HUMAN_DECISION`, use `BLOCKED_OWNER_DECISION` instead of `DOWNGRADE_READY`. If it is `COMPLETE`, use `TASK_COMPLETE` or the appropriate human-review terminal state rather than inventing another model handoff.

### 10.3 Unresolved owner decision

```text
ROUTING_STATUS=BLOCKED_OWNER_DECISION
SAFE_TO_DOWNGRADE=false
ARCHITECTURE_REVIEW_REQUIRED=true
HUMAN_AUTHORIZATION_REQUIRED=true
SAFE_TO_CONTINUE_IMPLEMENTATION=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

Do not recommend another expensive run when the remaining need is simply an owner choice. Report the exact options and required decision.

### 10.4 Human gate reached

```text
ROUTING_STATUS=HUMAN_REVIEW_REQUIRED
CURRENT_SCOPE_COMPLETE=true
HUMAN_APPROVAL_REQUIRED=true
SAFE_TO_CONTINUE_IMPLEMENTATION=false
HANDOFF_PATH=<actual repository-relative handoff path>
```

`CURRENT_SCOPE_COMPLETE` means the authorized automated work is complete, not that the human gate or whole feature passed. State any remaining failed or unexecuted checks; do not emit this success form while claiming a known required test failure is resolved.

When no model change is needed at a continuation checkpoint, use `CONTINUE_CURRENT` with `CURRENT_MODEL_STILL_APPROPRIATE=true`. Do not mistake a stop due to missing credits for permission to mark the task complete.

Never emit contradictory fields, such as `SAFE_TO_DOWNGRADE=true` alongside an unresolved architecture decision needed to implement the next action.

## 11. Receiving-model continuation contract

The outgoing model provides a ready-to-paste prompt derived from the **actual final worktree**, not the initial assignment. For downgrade handoffs, the outgoing model must first classify the remaining task under Section 7 and select the least costly suitable target profile; it must not mechanically inherit the adjacent lower tier. Keep the prompt bounded; place detailed diagnostics in the handoff rather than reproducing the complete project history.

Template:

```text
MODEL: <next model>
REASONING: <next effort>

Resume <project/change/task> from the preserved live worktree.
Follow AI-MRP-001 at <actual policy path>.

Read applicable AGENTS.md instructions, <current handoff path> and only the
canonical sections/test artifacts referenced there. Treat prior hypotheses as
diagnostic evidence, not unquestionable truth.

Expected HEAD: <full SHA>
Expected state: <clean/dirty and material work in progress>
Owner permission: <implementation authorized / diagnosis only / decision pending>

First action: <specific action based on the completed diagnosis>
Preserve: <critical tested work and evidence>
Do not repeat: <completed audits/disproved approaches>
Validate: <focused checks, then final matrix only when candidate is stable>
Stop at: <routing trigger or exact human gate>
Forbidden: <unauthorized stages, resets, commits, pushes, deployments, etc.>

If the live state differs, reconcile and preserve newer valid work. Do not
force the repository to match this summary. Apply the policy's upgrade,
downgrade and anti-loop gates, then produce a durable handoff if stopped.
```

The receiving executor SHALL first verify the live HEAD/worktree and the strongest unresolved hypothesis. Reuse valid results. Reproduce only what is necessary to establish the current blocker. A model switch does not justify a broad legacy audit.

## 12. Test, token and tool discipline

**Contract ID:** `AI-MRP-EFFICIENCY-001`

Use focused reproductions during repair and a defined final regression matrix after the candidate is stable. Keep skipped, interrupted and unexecuted tests distinct from passes. Preserve failing evidence where useful and authorized.

Do not repeatedly:

- read the entire specification when only one section changed;
- re-run broad suites after documentation-only edits without a concrete requirement;
- rebuild a code graph because a chat/model changed;
- spawn parallel agents for the same already-resolved investigation;
- rewrite governance on each geometry/code iteration;
- paste hundreds of lines of old instructions when a short handoff reference suffices.

Use graph/index tools and parallel agents only when their targeted benefit justifies their cost and the current instructions allow them. Tool usage follows existing project permissions. This policy does not mandate a particular graph tool or plugin.

When usage/cost data is available, compare accepted outcomes, retries and handoff overhead across task classes. Do not invent measurements or infer token cost from changed line count or elapsed time alone. Any change to the preferred escalation ladder requires explicit owner approval, not a single anecdotal result. Direct downgrade under `AI-MRP-DEC-001` is not a ladder change; it is the approved cost-aware target-selection rule after the remaining task has been reclassified.

## 13. Repository, evidence and safety boundaries

**Contract ID:** `AI-MRP-SAFETY-001`

A model-switch checkpoint does not authorize `git reset`, `git clean`, destructive checkout, broad staging, commit, push, deploy, environment changes or modifications to sealed evidence.

Preserve local edits and untracked files. Compare baselines through safe reads/replays or separately authorized worktrees rather than replacing the current dirty tree. Do not misclassify an inherited defect as a current regression merely to fit a repair authorization.

Operational handoffs must survive ordinary session loss, but must not leak secrets. Redact credentials and sensitive payloads from persisted logs. Respect the project's retention and private-storage rules. If durable handoff writes are not authorized, return the full recoverable handoff in the response and mark persistence pending.

A blocker is not a reason to weaken tests, suppress real errors, omit required evidence or report success. A stronger model remains subject to the same constraints.

## 14. Decision precedence and maintenance

Use the actual instruction hierarchy supplied by the environment and the project's declared canonical precedence. This policy does not override system/developer instructions, applicable `AGENTS.md`, repository safety controls or explicit human gates.

An authorized current request may narrow scope. Any deliberate exception to routing must state its rationale; it does not silently waive handoff, safety or acceptance requirements.

On future model/effort changes, review the available profiles and update this policy deliberately with owner approval. Do not hardcode pricing or benchmark claims into the policy. Preserve stable contract IDs and record amendments so old handoffs remain interpretable.

A local project may reference a controlled organizational master, but must identify its effective version. Avoid two independently editable normative copies with unclear precedence.

## 15. Acceptance scenarios for the policy itself

| Scenario | Required behavior |
| --- | --- |
| First read; docs edits authorized; no `AGENTS.md` reference | Add the verified-path block without altering unrelated instructions |
| First read; run is read-only | No write; report `AGENTS_REFERENCE_PENDING` and exact proposed block |
| Second read after successful installation | No duplicate reference; no integration diff |
| Existing conflicting policy/version | Preserve it; report discrepancy for owner resolution |
| BOUNDED_IMPLEMENTATION repeats the same unsuccessful causal approach twice | Stop before a third speculative patch; durable handoff to COMPLEX_DIAGNOSIS |
| BOUNDED_IMPLEMENTATION/High discovers a new unapproved repair envelope | Scope escalation; no automatic implementation authorization |
| ARCHITECTURE_GOVERNANCE resolves architecture/governance and remaining work is bounded implementation | Reclassify as `BOUNDED_IMPLEMENTATION`; direct downgrade handoff to BOUNDED_IMPLEMENTATION; do not begin repairs in ARCHITECTURE_GOVERNANCE |
| ARCHITECTURE_GOVERNANCE resolves architecture/governance but substantial complex diagnosis remains | Reclassify as `COMPLEX_DIAGNOSIS`; downgrade handoff to COMPLEX_DIAGNOSIS |
| ARCHITECTURE_GOVERNANCE needs an owner choice | `BLOCKED_OWNER_DECISION`; do not claim safe downgrade |
| High finishes difficult diagnosis; remaining work is bounded | Reclassify as `BOUNDED_IMPLEMENTATION`; recommend BOUNDED_IMPLEMENTATION at a safe completed-subtask boundary |
| ARCHITECTURE_GOVERNANCE finishes governance; no further model work remains | Reclassify as `COMPLETE`; stop instead of routing through COMPLEX_DIAGNOSIS or BOUNDED_IMPLEMENTATION |
| ARCHITECTURE_GOVERNANCE/High reaches a pure owner-choice boundary | Reclassify as `HUMAN_DECISION`; emit the owner-decision stop rather than consuming another model tier |
| Context compaction/reboot after a partial patch | Read durable handoff and live diff; preserve attempts and incomplete tests |
| Final matrix stopped after one failure | Report executed passes/failure and unexecuted cases separately |
| Human gate reached | Stop for explicit approval; no automatic stage advance |
| Next profile unavailable | Report actual limitation; request approved substitution; no false switch claim |

## 16. Initial installation instruction

The owner may give an executor this single bootstrap instruction after placing the policy in the repository:

```text
Read <actual repository-relative policy path> and perform AI-MRP-INSTALL-001.
Within this documentation-only authorization, add or reconcile its reference
in the applicable AGENTS.md using the real path. Preserve existing instructions,
avoid duplicates and validate the link and diff. Do not change runtime, tests,
dependencies, user-level configuration, sealed evidence, commits or deployment.
Report the installed policy path, AGENTS.md path and exact files changed.
```

Once installed, ordinary task prompts need only reference `AI-MRP-001`, declare the selected profile and provide task-specific scope/gates. They do not need to repeat this entire document.

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.1.0 | 2026-09-11 | Added `AI-MRP-DEC-001`: cost-aware remaining-task reclassification at downgrade boundaries. Removed the implicit requirement for sequential ARCHITECTURE_GOVERNANCE -> COMPLEX_DIAGNOSIS -> BOUNDED_IMPLEMENTATION downgrades; ARCHITECTURE_GOVERNANCE may hand off directly to BOUNDED_IMPLEMENTATION when only bounded implementation remains. Added remaining-task classes, direct target-selection algorithm, dynamic machine-readable downgrade states, updated `AGENTS.md` integration wording and acceptance scenarios. |
| 1.0.0 | 2026-09-10 | Consolidated the owner-approved model ladder, anti-loop policy, automatic upgrade/downgrade handoffs and repository safety rules; included explicit, idempotent first-read `AGENTS.md` registration instructions. |

Successor Inherited-Defect Gate

When three or more distinct inherited defects are discovered during the same successor stage, sequential defect-by-defect remediation SHALL pause.

A bounded systematic audit SHALL inventory the complete affected acceptance surface before further remediation.

Findings SHALL be classified as CURRENT_REGRESSION, INHERITED_CRITICAL, INHERITED_NONBLOCKING, or VALIDATION_PIPELINE_DEFECT.

A successor stage SHALL NOT be blocked solely because a stronger validator discovers an unchanged inherited defect unless that defect is critical to the stage acceptance contract or produces materially degraded user experience without an approved safe fallback.

An inherited finding SHALL block when it affects accessibility, usable content, navigation, critical forms/CTAs, data integrity, security, or produces materially broken presentation on a supported path.

Deferred inherited findings SHALL remain visible in validation evidence and SHALL require an explicit owner-approved disposition. Validators SHALL NOT be disabled, weakened, skipped or rewritten to conceal them.

Any current regression relative to an equivalent frozen baseline SHALL remain blocking.

Safe runtime fallback MAY protect the user experience but SHALL NOT convert an invalid enhanced candidate into a validation PASS.