# AI Collaboration Protocol — Codex <-> Antigravity Baton Workflow

**Protocol ID:** `AI-COLLAB-001`  
**Version:** `1.1.0`  
**Status:** Approved baseline; repository integration required before claiming local activation  
**Issued:** `2026-09-18`  
**Canonical path:** `docs/.ai/AI_COLLABORATION_PROTOCOL.md`  
**Normative language:** English  
**Scope:** Sequential AI-assisted software-development workflows using Codex and Antigravity, with explicit Codex/Sonnet product-executor baton handoffs and Gemini Flash/Pro specialist roles, in the same repository  
**Related policy:** `AI-MRP-001` (`docs/.ai/AI_MODEL_ROUTING_POLICY.md`) and the repository's executor stall/audit policy

---

## 1. Purpose

This protocol defines how Codex and Antigravity cooperate as **complementary sequential executors** over one software
repository.

The collaboration is designed to:

- reserve Codex context and model budget primarily for product specification, implementation, diagnosis and testing;
- allow Claude Sonnet in Antigravity to act as an alternate product executor only after an explicit safe-boundary baton handoff;
- assign routine engineering-tool discovery, maintenance, generated-state refresh and context preparation to the Gemini Flash class;
- reserve the Gemini Pro class for deep diagnostic/review work, including anti-loop escape analysis and creative root-cause reformulation;
- preserve a durable, repository-local handoff so no incoming executor needs to reconstruct completed work from chat history or rediscover already-proven facts;
- prevent semantic specifications from being rewritten by maintenance/diagnostic agents merely to match implementation;
- keep multi-project use safe by constraining every run to one repository at a time;
- preserve the model-routing, anti-loop, evidence and human-gate rules already defined by project governance.

**Decision `AI-COLLAB-DEC-001`:** Codex and Antigravity operate sequentially, never concurrently, in the normal workflow.
The human owner performs the turn switch in the IDE.

**Decision `AI-COLLAB-DEC-009`:** Executor continuity is baton-controlled. Quota exhaustion, model availability, or remaining
credits do not authorize another executor to take over a task in progress.

---

## 2. Authority and precedence

This protocol does not replace system/developer instructions, applicable `AGENTS.md`, OpenSpec authority, project
architecture/governance, repository safety rules, or explicit owner decisions.

Use the repository's real instruction hierarchy. Within this protocol's scope:

```text
explicit owner decision / applicable higher authority
        -> canonical project specifications and governance
        -> AI-COLLAB-001
        -> current operational handoff
        -> derived toolchain/context state
```

`CURRENT_AGENT_HANDOFF.md`, `TOOLCHAIN_STATE.yaml` and `CODEX_CONTEXT.md` are not new product authorities. They summarize
or derive from live repository state and canonical documents.

If a derived file conflicts with live Git state or canonical project documentation, the live/canonical source wins and
the derived file must be marked stale or regenerated.

---

## 3. Core sequential-execution invariant

Only one AI executor may actively operate on the repository at a time in the normal workflow.

```text
Codex active         -> Antigravity models inactive
Sonnet active        -> Codex/Gemini inactive
Gemini Flash active  -> product executors/Gemini Pro inactive
Gemini Pro active    -> product executors/Gemini Flash inactive
```

The owner controls the transition by stopping/finishing one executor run and starting the other in the IDE.

This protocol therefore does **not** require repository locks, concurrent-write coordination, parallel worktrees, or
automatic process orchestration.

At every executor change:

1. reach a safe operational boundary;
2. preserve the live worktree;
3. write/update the durable handoff with what was done, learned, validated, disproved and intentionally not repeated;
4. set `HANDOFF_STATUS=READY`, identify the exact next actor/model class and the handoff type;
5. stop;
6. the owner starts the next executor separately.

A checkpoint is not automatically a baton handoff. While `HANDOFF_STATUS!=READY`, another executor must not assume the
active task merely because the previous executor is unavailable.

**Decision `AI-COLLAB-DEC-002`:** A handoff is a stop boundary. The outgoing executor must not silently continue into the
incoming executor's ownership area merely because it still has time or tokens available.

---

## 4. Executor and model-class roles

### 4.1 Codex — primary product executor

Codex is the preferred executor for:

- semantic OpenSpec authoring and reconciliation;
- product/application code;
- root-cause product bug fixes;
- product migrations;
- tests and acceptance implementation;
- implementation-linked technical documentation;
- authorized architecture changes and contract implementation;
- resolving specification/implementation drift;
- implementation decisions that require understanding product behavior and approved requirements.

Within Codex, `AI-MRP-001` continues to govern the approved Sol/Astra model-routing, escalation, downgrade and anti-loop
policy. This collaboration protocol does not silently replace that ladder.

Codex may inspect engineering tooling when necessary to do its assigned work, but routine toolchain maintenance is not
its default responsibility.

### 4.2 Claude Sonnet — alternate product continuation executor

Claude Sonnet, when selected inside Antigravity, is an approved **alternate product executor** for bounded implementation
and continuation work. It may:

- continue a well-defined implementation from Codex;
- implement bounded product changes against existing semantic specifications;
- fix a known/root-caused product defect inside the authorized envelope;
- write or update tests required by that bounded implementation;
- perform focused refactoring or migration work when the contract is explicit;
- hand the task back to Codex at a safe boundary.

Sonnet does **not** gain a task automatically because Codex quota is low/exhausted. It may continue only when an explicit
`CONTINUATION` baton handoff authorizes it. Semantic OpenSpec changes remain Codex-owned by default; when a semantic
specification decision is required, Sonnet must stop and return the baton to Codex or the human owner.

**Decision `AI-COLLAB-DEC-010`:** Sonnet is an alternate product executor, not an automatic quota failover.

### 4.3 Gemini Flash class — engineering maintenance executor

Gemini Flash-class models are the default Antigravity executors for routine engineering-environment maintenance. Their
normal responsibilities are:

- automatic discovery of engineering/agent tooling actually used by the current repository;
- installation-provenance detection;
- checking current upstream versions/documentation;
- maintenance of Graphify, Ponytail, OpenSpec tooling/integration, Serena, Storybook, Context7/MCP, skills, plugins and
  other comparable engineering tools detected with sufficient evidence;
- safe tooling upgrades within the maintenance envelope;
- official tool-generated integration refreshes;
- Graphify graph regeneration and other derived repository artifacts;
- engineering-tool health checks;
- stale-state detection;
- generation of `CODEX_CONTEXT.md`;
- preparation of bounded maintenance handoffs.

Gemini Flash is **not** the designated loop-breaker for difficult product problems and must not be routed into deep
anti-loop diagnosis merely because it has available quota.

**Decision `AI-COLLAB-DEC-011`:** Gemini Flash is the routine maintenance/update class.

### 4.4 Gemini Pro class — diagnostic and review specialist

Gemini Pro-class models are the designated Antigravity specialists for:

- deep product/root-cause diagnosis after an anti-loop gate;
- creative reformulation of a stubborn problem when existing repair strategies are not converging;
- independent post-implementation review after meaningful changes;
- architecture/code analysis;
- security, data-integrity, accessibility, frontend/responsive, performance and integration-risk analysis;
- identifying alternative algorithms, geometric formulations, platform primitives, state decompositions, fallbacks or
  other non-obvious approaches that preserve the approved user experience and acceptance invariants.

Gemini Pro must not obtain a fresh patch-attempt budget when receiving a diagnostic baton. In `DIAGNOSTIC` mode it
primarily investigates and proposes. It may not weaken requirements, validators, accessibility, security, data
integrity, or user experience to make a problem disappear. Unless an explicit handoff authorizes implementation, it
returns the diagnosis/proposal to the product executor that owns the task.

Gemini Pro may detect semantic specification drift but does not rewrite semantic OpenSpec specifications as part of a
review/diagnostic turn.

**Decision `AI-COLLAB-DEC-012`:** Gemini Pro is the only Gemini class designated for anti-loop escape diagnosis and
creative product-level review. Gemini Flash is not a substitute for this role.

### 4.5 Human owner — governance authority

The human owner remains responsible for decisions that exceed approved executor authority, including when applicable:

- substantial architecture or ownership changes;
- requirement changes;
- exceptions to safety/governance;
- major-version upgrade approval when migration impact is material or uncertain;
- installation-manager changes;
- cross-project changes;
- defer/acceptance decisions that policies reserve for the owner;
- commit/push/deploy permission where not separately authorized.

---

## 5. Semantic-specification boundary

**Decision `AI-COLLAB-DEC-003`:** Antigravity may detect semantic specification drift but must not rewrite semantic
OpenSpec artifacts to make them match the code.

During ordinary maintenance, semantic OpenSpec content is read-only evidence for Antigravity.

Allowed for Antigravity:

- read semantic specs to understand intended behavior;
- run official OpenSpec tooling health/update commands;
- refresh generated OpenSpec agent/integration files when the official tool defines them as generated;
- validate OpenSpec tooling/integration;
- report a suspected drift with exact paths/evidence;
- hand the issue to Codex.

Not allowed for Antigravity without an explicit role reassignment:

- rewrite requirements/specifications to mirror implementation;
- invent a requirement to unblock an upgrade;
- close an OpenSpec change semantically;
- treat current code as proof that the spec is wrong.

Required transition on semantic drift:

```text
ANTIGRAVITY
  -> detect/report drift
  -> NEXT_ACTOR=CODEX
  -> stop
```

Codex then determines whether code, tests, specs, or an owner decision must change.

---

## 6. Shared repository artifacts

The collaboration uses these repository-local files:

### 6.1 `CURRENT_AGENT_HANDOFF.md`

Durable current checkpoint between executors. It records:

- source/next actor;
- handoff reason;
- repository HEAD/branch/worktree expectation;
- active task/change;
- completed and incomplete work;
- validation state;
- root-cause/attempt history references;
- authorized and prohibited actions;
- findings requiring action;
- first next action.

It is operational state, not a second specification.

### 6.2 `TOOLCHAIN_STATE.yaml`

Gemini Flash-maintained derived state containing:

- detected tools;
- evidence/confidence;
- installation scope and manager/provenance;
- installed and last-checked available versions;
- integration health;
- generated artifacts and the repository HEAD they represent;
- last maintenance result;
- global-tool changes observed during the current repository run.

It is a cache. The repository and actual installed environment remain authoritative.

### 6.3 `CODEX_CONTEXT.md`

Gemini Flash-maintained compact context pack intended to reduce product-executor rediscovery work. The filename is
retained for compatibility, but both Codex and Sonnet may consume it after a valid baton handoff.

It should contain only the context likely to matter to the next product-executor task, such as:

- repository HEAD/branch;
- active OpenSpec change/spec paths;
- relevant architecture/Graphify nodes;
- relevant symbols/modules/tests;
- current handoff summary;
- known findings;
- toolchain readiness;
- exact recommended first reads/actions.

It must link to canonical evidence instead of copying large documents.

---

## 7. Repository-scope lock

Every Gemini Flash maintenance run is scoped to the current Git repository.

At start, resolve and record the actual root, normally with the repository's Git tooling. Treat that root as the logical
maintenance boundary.

Gemini Flash must not:

- search the user's machine for other repositories to update;
- mutate another repository as a side effect;
- run one prompt as a multi-project maintenance sweep;
- copy project-specific generated state from one repository into another;
- infer that a globally installed tool means the current repository uses it.

If the user wants another project maintained, the owner opens that project and runs a separate maintenance turn.

---

## 8. Tool discovery

### 8.1 Discovery-first rule

The tool list must be discovered from repository evidence rather than maintained as one rigid universal list.

Potential evidence includes, as applicable:

- `package.json` and lockfiles;
- `pyproject.toml`, `uv.lock`, requirements files;
- `composer.json`, `Cargo.toml`, `go.mod`;
- `.storybook/`, `.serena/`, `openspec/`, `graphify-out/`, `.agents/`, `.vscode/`;
- MCP configuration;
- agent/plugin manifests;
- CI workflows;
- Makefiles/Taskfiles/package scripts;
- repository-local configuration and generated integration metadata.

Documentation-only references are weaker evidence than actual configuration/dependency/runtime integration.

### 8.2 Confidence classes

Use at least:

- `HIGH` — concrete dependency/configuration/runtime integration in the repository;
- `MEDIUM` — scripts/CI/tool references plus supporting evidence, but ownership remains ambiguous;
- `LOW` — documentation mention or stale-looking trace only.

Default maintenance behavior:

```text
HIGH   -> eligible for normal maintenance analysis/action
MEDIUM -> investigate/report before mutation
LOW    -> do not auto-maintain
```

A tool installed globally with no repository evidence is not sufficient to justify updating it for this run.

### 8.3 Tool ownership classes

Classify detected tools as one of:

1. `REPOSITORY_DEPENDENCY` — version owned by project manifests/lockfiles (for example Storybook);
2. `GLOBAL_TOOL_PROJECT_INTEGRATION` — global/user-level executable with repository integration (for example some CLI/MCP tools);
3. `REMOTE_SERVICE` — remotely hosted service/MCP where local package update may not exist (for example a remote Context7 setup);
4. `DERIVED_REPOSITORY_STATE` — generated graph/index/integration output derived from the repository.

This classification determines how maintenance is performed.

---

## 9. Installation provenance and update safety

Before changing a tool, determine how the active installation is managed.

Examples of provenance categories:

- repository package manager (`npm`, `pnpm`, `yarn`, `bun`, etc.);
- `uv tool` / `pipx` / Python environment;
- standalone installer;
- Codex/Antigravity plugin mechanism;
- remote MCP endpoint;
- operating-system package manager;
- another verified mechanism.

**Invariant:** never silently switch the installation manager/provenance during routine maintenance.

For example, an existing standalone installation must not be replaced with a Snap/npm/other installation merely because
that mechanism is convenient. If a provenance change is actually required, stop for an explicit decision and document
how duplicate binaries/configuration will be avoided.

This rule exists to prevent split installations and PATH ambiguity.

---

## 10. Update policy

### 10.1 Read current upstream instructions before mutation

When checking a library/tool/API/CLI whose current behavior may have changed, use the repository's approved current-doc
mechanism (for example Context7 when configured for that class of request) and authoritative upstream sources as needed.

Do not assume an old install/update command remains correct.

### 10.2 Compatibility-first

Do not equate `latest` with `safe`.

Default decision model:

- patch update: may be applied when release notes/current docs show no relevant incompatibility and focused validation exists;
- minor update: analyze compatibility/migrations first, then apply when bounded and validated;
- major update: analyze and stop for owner approval by default when material migration or behavior risk exists;
- uncertain provenance or breaking migration: do not mutate until the uncertainty is resolved.

A repository may later define a stricter or more permissive tool-specific policy, but it must be explicit.

### 10.3 General application dependencies are out of scope by default

Repository maintenance must not turn into an indiscriminate dependency-upgrade sweep.

Focus on engineering/agent tooling and dependencies that directly implement those tools. General product/runtime
dependencies may be reported as outdated, but changing them belongs to a separate Codex/owner-authorized workflow unless
they are required for an approved tooling migration.

---

## 11. Global-tool changes in a multi-project environment

A tool may be global/user-level while maintenance is initiated from one repository.

If the current repository uses that tool with `HIGH` confidence and the update is authorized, Gemini Flash may update the
global tool according to its verified installation provenance.

Required recording:

- tool name;
- manager/provenance;
- before version;
- after version;
- reason/source checked;
- current repository compatibility result.

The update does not authorize Gemini Flash to open or mutate other repositories.

When another repository is later opened, its Gemini Flash maintenance run compares the **actual current global tool** to
that repository's prior recorded state and revalidates compatibility there.

No central cross-project mutation sweep is required.

---

## 12. Tool-specific behavioral contracts

The protocol intentionally avoids hardcoding permanent installation commands for fast-moving tools. The maintenance
executor must consult current documentation and installation provenance at execution time.

### 12.1 Graphify

When detected and maintained:

- verify the current Graphify installation/integration;
- update through its verified current mechanism when authorized;
- regenerate the code graph **after** product implementation is stable when the previous graph no longer represents the
  current code HEAD;
- record the HEAD represented by generated graph artifacts;
- do not claim the graph is current when source changes occurred after generation.

Graphify is primarily a representation of what the implemented system currently is; it is not a substitute for semantic
requirements.

### 12.2 OpenSpec tooling

Gemini Flash may maintain the OpenSpec executable/tool integration and official generated agent files.

Semantic OpenSpec specs/changes remain Codex-owned during normal collaboration. See Section 5.

### 12.3 Ponytail

When Ponytail is part of the active agent environment:

- verify its actual plugin/rule installation state and version through the active manager;
- update when the maintenance envelope permits;
- verify project/global instructions still compose correctly;
- do not copy multiple competing normative Ponytail instruction blocks into the repository merely to prove installation.

### 12.4 Serena

When repository evidence confirms Serena usage:

- determine current installation provenance;
- verify tool/project configuration health;
- update through the existing verified manager when authorized;
- preserve project-specific Serena configuration unless an official migration requires a bounded change.

### 12.5 Storybook

When Storybook is a repository dependency:

- treat project manifest/lockfile as version authority;
- use official compatibility/upgrade analysis before mutation;
- keep tooling-only migrations inside the maintenance envelope;
- if a migration requires product component behavior, semantic spec changes or non-trivial application-source work,
  hand that portion to Codex.

### 12.6 Context7 / remote MCP services

First determine whether the integration is remote or locally packaged.

For remote service usage, maintenance normally means configuration/connectivity/auth health and current usage guidance,
not installing/upgrading an unrelated local package.

For locally packaged usage, preserve its verified manager/provenance.

---

## 13. Gemini Flash maintenance lifecycle

### 13.1 Pre-flight — optional, freshness-driven

Pre-flight is useful when any of the following is true:

- tooling state is unknown or materially stale;
- the recorded toolchain no longer matches the live environment;
- a global tool changed since the repository's last maintenance;
- Graphify/context artifacts are stale for the work about to start;
- the owner explicitly requests a maintenance/context refresh;
- a previous handoff requires Gemini Flash maintenance action before the product executor can proceed.

Pre-flight should:

1. verify repository root, branch, HEAD and worktree expectation;
2. read the current handoff;
3. discover/reconcile the engineering toolchain;
4. perform only authorized safe maintenance;
5. refresh derived context needed by the next product executor;
6. generate/update `CODEX_CONTEXT.md`;
7. write a maintenance handoff to the explicitly designated next actor (`CODEX`, `SONNET`, `HUMAN`, or `NONE`);
8. stop.

Do not run pre-flight merely as a ritual when nothing is stale or useful.

### 13.2 Post-flight — implementation-aware maintenance

After a meaningful Codex or Sonnet implementation, Gemini Flash may:

1. verify the final live repository state;
2. reconcile the detected toolchain;
3. check/update eligible engineering tooling;
4. refresh official generated integrations;
5. rebuild Graphify/other stale derived artifacts from the stable current code;
6. run tool health/compatibility checks;
7. detect semantic drift without rewriting semantic specs;
8. refresh `TOOLCHAIN_STATE.yaml`;
9. regenerate `CODEX_CONTEXT.md` when another product-executor turn is needed;
10. write the next handoff;
11. stop.

Post-flight is not required for trivial changes when no relevant derived/tooling state became stale.

---

## 14. Product-executor lifecycle — Codex / Sonnet

On receiving a product-executor baton:

1. verify only the minimum live Git state needed to prove that the handoff still describes the active worktree;
2. read the active semantic specification/change and relevant canonical project docs;
3. consume the handoff's completed-work, decisions, verified facts, disproved hypotheses and `DO_NOT_REDISCOVER` section;
4. use `CODEX_CONTEXT.md` only when its recorded HEAD/state remains applicable;
5. implement/diagnose/test within the authorized product scope;
6. preserve anti-loop/root-cause attempt history across executor/model changes;
7. do not repeat broad repository/Git archaeology merely to rediscover work the partner already documented;
8. when the current ownership unit is complete, reach a safe boundary and deliberately choose the next baton target;
9. write a complete handoff, set `HANDOFF_STATUS=READY`, identify `NEXT_ACTOR`, then stop.

Codex remains the default semantic-specification owner. Sonnet must return to Codex when continuation discovers a
semantic specification decision that is not already authorized.

A product executor should not spend a normal run re-performing broad tool version discovery that Gemini Flash owns,
unless that information is directly necessary to diagnose the assigned product task.

---

## 15. `CODEX_CONTEXT.md` generation contract

`CODEX_CONTEXT.md` exists to reduce rediscovery, not to create another long specification.

It should be compact and task-oriented. Prefer:

- exact paths;
- stable IDs;
- Graphify node/symbol summaries;
- relevant test paths;
- a concise handoff summary;
- current environment readiness;
- links/references to large canonical artifacts.

Avoid:

- copying full OpenSpec specifications;
- pasting large Graphify reports;
- duplicating the entire collaboration/routing policies;
- long historical narratives already captured in durable evidence;
- unverified hypotheses stated as facts.

It must carry at least:

```text
GENERATED_BY=ANTIGRAVITY
BASED_ON_HEAD=<sha>
CONTEXT_STATUS=CURRENT|STALE|UNINITIALIZED
```

If the live repository no longer matches the basis of the context pack, Codex may still use it as historical orientation
but must not treat it as current fact.

---

## 16. Baton and handoff state model

### 16.1 Baton status

Use:

```text
HANDOFF_STATUS=NOT_READY|READY
```

`NOT_READY` means the current executor still owns the task, even if its session is paused or quota-limited. `READY` means
the outgoing executor deliberately reached a safe boundary and explicitly passed the baton.

Use `NEXT_ACTOR` values:

```text
CODEX
SONNET
GEMINI_FLASH
GEMINI_PRO
HUMAN
NONE
```

Use one primary `HANDOFF_TYPE`:

```text
CONTINUATION
MAINTENANCE
DIAGNOSTIC
REVIEW
OWNER_DECISION
COMPLETE
RECOVERY
```

Recommended `HANDOFF_REASON` values include:

```text
IMPLEMENTATION_BOUNDARY_REACHED
IMPLEMENTATION_COMPLETE
REPOSITORY_MAINTENANCE_REQUIRED
REPOSITORY_MAINTENANCE_COMPLETE
PRODUCT_CONTINUATION_REQUESTED
ANTI_LOOP_DIAGNOSIS_REQUIRED
INDEPENDENT_REVIEW_REQUIRED
DIAGNOSIS_COMPLETE
REVIEW_COMPLETE
CODEX_ACTION_REQUIRED
SPEC_IMPLEMENTATION_DRIFT
TOOL_MIGRATION_REQUIRES_CODE
MAJOR_TOOL_UPGRADE_DECISION
OWNER_DECISION_REQUIRED
TASK_COMPLETE
PAUSED_INTERRUPTED
```

### 16.2 Codex <-> Sonnet continuation baton

A `CONTINUATION` handoff authorizes the receiving product executor to continue the bounded task. Typical form:

```text
FROM_ACTOR=CODEX
NEXT_ACTOR=SONNET
HANDOFF_TYPE=CONTINUATION
HANDOFF_STATUS=READY
CONTINUATION_AUTHORIZED=true
FIRST_NEXT_ACTION=<specific bounded action>
```

The inverse Sonnet -> Codex handoff uses the same contract. The outgoing executor must record enough completed work and
causal knowledge that the receiver does not need to reconstruct the task from Git history or broad repository search.

### 16.3 Product executor -> Gemini Flash maintenance baton

Use `MAINTENANCE` only for engineering-tooling/derived-state work:

```text
NEXT_ACTOR=GEMINI_FLASH
HANDOFF_TYPE=MAINTENANCE
HANDOFF_STATUS=READY
```

Gemini Flash performs the bounded maintenance task, then hands back to the explicitly designated product executor or
finishes with `NEXT_ACTOR=NONE`.

### 16.4 Product executor -> Gemini Pro diagnostic baton

Use when anti-loop policy or difficult diagnosis justifies a fresh specialist perspective:

```text
NEXT_ACTOR=GEMINI_PRO
HANDOFF_TYPE=DIAGNOSTIC
HANDOFF_STATUS=READY
RETURN_ACTOR=<CODEX|SONNET>
PRODUCT_PATCHING_AUTHORIZED=false
```

Gemini Pro receives the same root-cause attempt history. Its default job is to establish new causal evidence and/or a
materially different solution formulation, not to perform the third speculative patch. It returns the baton to
`RETURN_ACTOR` with diagnosis, proposal, invariants, risks and minimum validation.

### 16.5 Product executor -> Gemini Pro review baton

After a meaningful implementation, an independent review may use:

```text
NEXT_ACTOR=GEMINI_PRO
HANDOFF_TYPE=REVIEW
HANDOFF_STATUS=READY
RETURN_ACTOR=<CODEX|SONNET|NONE>
PRODUCT_PATCHING_AUTHORIZED=false
```

The review may inspect security, data integrity, architecture, frontend/responsive behavior, accessibility, performance,
integration risks and test gaps. Findings requiring changes return to the authorized product executor.

### 16.6 Any executor -> Human / Complete

For a required owner decision:

```text
NEXT_ACTOR=HUMAN
HANDOFF_TYPE=OWNER_DECISION
HANDOFF_STATUS=READY
```

For completion:

```text
NEXT_ACTOR=NONE
HANDOFF_TYPE=COMPLETE
HANDOFF_STATUS=READY
```

---

## 17. Baton integrity, interruption and quota exhaustion

**Decision `AI-COLLAB-DEC-009`:** availability does not transfer ownership.

If the active executor hits a quota/usage limit before it has deliberately prepared a safe baton handoff:

```text
HANDOFF_STATUS=NOT_READY
HANDOFF_REASON=PAUSED_INTERRUPTED
NEXT_ACTOR=NONE
```

The task remains owned by that executor. The owner should resume the same executor when available so it can reach a safe
boundary and either continue or pass the baton deliberately.

A different executor may assume an interrupted task only through an explicit owner-authorized `RECOVERY` handoff. That
recovery starts from the last durable checkpoint, treats any uncheckpointed work as uncertain, and does not pretend that
a normal baton was passed.

Quota state may influence **which eligible executor the outgoing executor chooses at a safe boundary**, but it must never
trigger a mid-task automatic takeover.

**Decision `AI-COLLAB-DEC-013`:** incoming executors perform minimal integrity verification, then consume the partner's
recorded work. They must not spend a normal continuation turn rediscovering already-documented Git history, repository
ownership, disproved hypotheses or completed tests without evidence that the handoff is stale/inconsistent.

---

## 18. Shared anti-loop and root-cause budget

The root-cause retry budget belongs to the **problem**, not to the executor.

A handoff must not reset attempt count.

Example:

```text
ROOT-042
Codex attempt 1
Codex attempt 2
-> diagnostic handoff to Gemini Pro
```

Gemini Pro receives `attempt_count=2`; it does not gain two fresh speculative product-repair attempts. Gemini Flash is
not an anti-loop product-diagnosis target.

Apply `AI-MRP-001` and the executor stall/audit policy for routing, material-progress, systematic-audit and human-gate
rules. This protocol adds executor-role boundaries but does not weaken those existing stop conditions.

Gemini Flash may perform a maintenance-specific diagnostic that is genuinely different from product repair, but it must
not relabel a third speculative product patch as tooling work. Gemini Pro may perform the designated deep product
diagnosis under Section 19, while preserving the inherited attempt count.

---

## 19. Gemini Pro anti-loop diagnosis and independent review contract

### 19.1 Anti-loop diagnostic trigger

Gemini Pro is the designated Gemini class for the specialist intervention that follows a qualifying non-convergent
product problem. Normal triggers include the anti-loop gates defined by `AI-MRP-001` and the executor stall/audit policy,
especially two bounded attempts on the same unresolved root without material progress.

Gemini Flash must not be substituted for this role. Flash may continue maintenance work independently, but difficult
product loop-breaking is routed to Gemini Pro.

### 19.2 Diagnostic objective

Gemini Pro should answer:

> What causal explanation or materially different problem formulation can move this issue toward the required user-visible
> outcome without weakening approved invariants?

It may explore non-obvious alternatives such as:

- a different algorithm or data structure;
- a different geometry/layout formulation;
- a capability-based or state-based fallback;
- another native/platform primitive;
- a different decomposition of synchronous/asynchronous work;
- a different ownership boundary already permitted by the architecture;
- a bounded heuristic with an explicit ceiling/upgrade path when policy permits.

The solution space may be creative. The acceptance space is not: security, accessibility, data integrity, required user
experience, approved semantics and enabled validators remain binding.

### 19.3 Required diagnostic return

A Gemini Pro diagnostic handoff back to the product executor must state:

- exact root/problem identity and inherited attempt count;
- what the previous approaches assumed and why they failed or remained unproven;
- new verified evidence;
- the proposed alternative formulation/solution;
- affected files/modules/surfaces;
- invariants preserved;
- known risks/ceilings;
- smallest meaningful validation for the proposed approach;
- whether owner/architecture authorization is required before implementation;
- `RETURN_ACTOR` and exact first next action.

### 19.4 Independent review mode

Gemini Pro may also receive a `REVIEW` baton after large or risk-significant implementations. Review is normally
non-mutating and may examine:

- security and authorization boundaries;
- data-integrity and persistence risks;
- frontend/responsive regressions and visual breakage;
- accessibility;
- performance/concurrency/pathological complexity;
- architecture/coupling drift;
- error handling and failure recovery;
- integration and migration risks;
- missing/weak tests;
- semantic specification drift.

Findings are evidence for the product executor/owner; Gemini Pro does not silently rewrite semantic specs or lower
acceptance criteria.

---

## 20. Validation and evidence

Each executor validates the work it owns.

Codex validation may include:

- focused/full product tests;
- lint/static analysis;
- migration checks;
- acceptance checks required by the active specification.

Gemini Flash maintenance validation may include:

- tool version/provenance verification;
- official tool diagnostics;
- generated-artifact freshness checks;
- graph generation success;
- integration/MCP health;
- tooling-focused repository checks;
- product test execution when required to prove a tool update did not break the repository.

A previous executor's test result is historical evidence once the source/tooling state changes. Do not claim it proves a
later state unless equivalence is established.

---

## 21. Maintenance mutation envelope

Gemini Flash may mutate, when authorized and supported by current tooling documentation:

- engineering tool versions/configuration;
- lockfiles/manifests required by a tooling-only update;
- generated Graphify/index artifacts;
- generated OpenSpec/agent integration files;
- MCP/tool configuration;
- `TOOLCHAIN_STATE.yaml`;
- `CODEX_CONTEXT.md`;
- `CURRENT_AGENT_HANDOFF.md`;
- other clearly tool-owned generated/configuration artifacts.

Gemini Flash must hand work to a product executor before making non-trivial changes to:

- product behavior;
- business logic;
- semantic requirements/specifications;
- product data migrations;
- application architecture outside a bounded tooling migration;
- tests whose semantics define product acceptance rather than tool compatibility.

When classification is ambiguous, stop and report the ambiguity rather than broadening scope silently.

---

## 22. Repository safety

Neither executor receives implicit permission from this protocol to:

- `git reset`/`git clean` destructive work;
- overwrite intentional dirty-worktree changes;
- commit, push, merge or deploy;
- expose secrets in handoffs/context/state;
- disable tests/validators to obtain green status;
- rewrite canonical evidence to make a migration appear successful;
- change another repository;
- claim human approval.

Preserve the live worktree and the repository's existing safety/governance requirements.

---

## 23. Freshness rules

Maintenance should be demand/freshness-driven.

Consider Gemini Flash pre/post-flight when at least one relevant condition exists:

- current handoff explicitly requests it;
- toolchain state is uninitialized;
- an installed tool version/provenance differs from recorded state;
- generated artifacts represent a different HEAD than the code they are meant to describe;
- relevant tooling configuration changed;
- a material implementation makes graph/context refresh useful;
- an upstream update check is due under project policy;
- a tool health issue was detected.

Do not require a maintenance run after every trivial documentation or one-line code change if none of the relevant state
became stale.

---

## 24. Initial repository integration

Installation of this protocol in a repository is complete when:

1. `docs/.ai/AI_COLLABORATION_PROTOCOL.md` exists as the single canonical collaboration protocol;
2. `docs/.ai/AI_MODEL_ROUTING_POLICY.md` points to the actual approved routing policy copy;
3. the stall/audit policy is present or referenced according to its own canonicalization status;
4. `CURRENT_AGENT_HANDOFF.md`, `TOOLCHAIN_STATE.yaml` and `CODEX_CONTEXT.md` exist in their intended operational/derived roles;
5. root/scoped `AGENTS.md` contains one short collaboration reference block, not duplicated full policies;
6. all links resolve to real repository-relative paths;
7. a second integration pass produces no unnecessary diff;
8. no product/runtime change, global tool update, commit, push or deploy occurs merely because the documentation was installed.

---

## 25. Acceptance scenarios

| Scenario | Required behavior |
| --- | --- |
| Owner opens a repo whose toolchain state is current | Gemini Flash pre-flight may be skipped; the current product executor can begin from handoff/context |
| Codex completes a bounded unit and explicitly wants Sonnet to continue | Write `CONTINUATION`, `HANDOFF_STATUS=READY`, `NEXT_ACTOR=SONNET`; Sonnet consumes the recorded work instead of rediscovering it |
| Sonnet needs a semantic OpenSpec decision | Stop and hand back to Codex/human; do not reinterpret semantic authority |
| Codex/Sonnet quota ends before a safe baton boundary | `PAUSED_INTERRUPTED`, `HANDOFF_STATUS=NOT_READY`, `NEXT_ACTOR=NONE`; no automatic takeover |
| Product executor completes meaningful implementation and tooling/graph state is stale | `MAINTENANCE` baton to `GEMINI_FLASH` |
| Gemini Flash sees Graphify output based on an old HEAD | Rebuild after code is stable; record represented HEAD |
| Gemini Flash sees semantic OpenSpec drift | Report exact drift; hand to Codex; no semantic spec rewrite |
| Storybook/tool update requires product component migration | Flash performs bounded tooling analysis; hand product migration to Codex/Sonnet as explicitly authorized |
| A tool is globally installed but absent from repo evidence | Do not update it as part of this repository run |
| A global tool used by this repo is updated | Record before/after/provenance; validate current repo only; do not mutate other projects |
| Current tool was installed through manager A | Preserve manager A unless an explicit migration decision authorizes a change |
| A major upgrade has material/uncertain migration impact | Stop for owner decision by default |
| Same product root survives two bounded attempts without material progress | Product executor writes `DIAGNOSTIC` baton to `GEMINI_PRO`; attempt count is preserved |
| Gemini Flash has abundant quota while product loop diagnosis is needed | Do not use Flash as loop breaker; use Gemini Pro or stop if unavailable |
| Gemini Pro finds a creative alternative | Return diagnosis/proposal to `RETURN_ACTOR`; no silent product patch unless explicitly authorized |
| Large implementation merits an independent review | `REVIEW` baton to `GEMINI_PRO`; return actionable findings to the product executor/owner |
| Current handoff asks only for human choice | `NEXT_ACTOR=HUMAN`; do not start another executor turn |
| Maintenance/review finishes with no remaining action | `NEXT_ACTOR=NONE`; `HANDOFF_TYPE=COMPLETE` |

---

## 26. Decision registry

| Decision | Description |
| --- | --- |
| `AI-COLLAB-DEC-001` | Codex and Antigravity are sequential, human-switched execution environments; no normal parallel operation |
| `AI-COLLAB-DEC-002` | Executor handoff is a stop boundary; the outgoing executor does not continue into the incoming role |
| `AI-COLLAB-DEC-003` | Antigravity maintenance/diagnostic roles may detect semantic spec drift but may not rewrite semantic OpenSpec to match code |
| `AI-COLLAB-DEC-004` | Tool discovery is repository-evidence-driven; global installation alone is insufficient evidence of project use |
| `AI-COLLAB-DEC-005` | Installation provenance is preserved during routine maintenance; manager migration requires explicit decision |
| `AI-COLLAB-DEC-006` | Product context packs are derived/compact and never replace canonical specifications or live repository state |
| `AI-COLLAB-DEC-007` | Retry/anti-loop history follows the root cause across executor handoffs; switching agents/models does not reset the budget |
| `AI-COLLAB-DEC-008` | Pre-flight/post-flight are freshness/value driven, not mandatory rituals after every run |
| `AI-COLLAB-DEC-009` | Quota/model availability never causes automatic task takeover; only a READY baton handoff transfers normal ownership |
| `AI-COLLAB-DEC-010` | Claude Sonnet is an alternate product executor for explicit bounded continuation handoffs, not automatic quota failover |
| `AI-COLLAB-DEC-011` | Gemini Flash is the routine Graphify/OpenSpec-tooling/framework/MCP/agent-tool maintenance class |
| `AI-COLLAB-DEC-012` | Gemini Pro is the sole Gemini class designated for product anti-loop escape diagnosis and independent deep review |
| `AI-COLLAB-DEC-013` | Handoffs must carry completed work and causal knowledge so the receiving partner does minimal integrity verification instead of rediscovery |

---

## 27. Revision history

| Version | Date | Change |
| --- | --- | --- |
| `1.1.0` | 2026-09-18 | Added explicit baton protocol, Codex/Sonnet product-continuation roles, Gemini Flash maintenance-only role, Gemini Pro anti-loop/review specialist role, quota-interruption non-takeover rule, and do-not-rediscover handoff requirements |
| `1.0.0` | 2026-09-17 | Initial approved Codex <-> Antigravity sequential collaboration baseline |
