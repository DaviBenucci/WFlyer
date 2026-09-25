# Project AI Documentation

**Directory:** `docs/.ai/`  
**Status:** Approved baseline for repository integration  
**Issued:** 2026-09-18  
**Canonical language:** English for technical governance; user-facing summaries may use Portuguese.

## 1. Purpose

This directory is the repository-local coordination and governance surface for AI-assisted development.
It is designed for a **sequential Codex <-> Antigravity baton workflow** in which only one AI executor operates
on the repository at a time and the owner manually switches between them in the IDE. Codex is the primary product
executor; Claude Sonnet may receive explicit bounded continuation batons; Gemini Flash owns routine engineering-tool
maintenance; Gemini Pro owns deep anti-loop diagnosis and independent review.

The system has four objectives:

1. keep product executors focused on product specifications, code, diagnosis and tests;
2. delegate routine engineering-tool maintenance, repository context preparation and derived-artifact refresh to Gemini Flash;
3. use Gemini Pro as a separate deep diagnostic/review specialist when difficult product work stops converging or merits independent audit;
4. make every executor switch an explicit baton handoff recoverable from repository state instead of chat history.

## 2. File classes and authority

| File | Class | Authority / purpose |
| --- | --- | --- |
| `AI_COLLABORATION_PROTOCOL.md` | **Normative** | Canonical Codex <-> Antigravity collaboration contract |
| `AI_MODEL_ROUTING_POLICY.md` | **Normative** | Existing approved model-routing, escalation, downgrade and handoff policy (`AI-MRP-001`) |
| `AI_EXECUTOR_STALL_AUDIT_POLICY.md` | **Normative candidate** | Existing stall/escalation/systematic-audit policy; preserve its own declared status |
| `CURRENT_AGENT_HANDOFF.md` | **Operational mutable** | The current durable executor-to-executor checkpoint |
| `TOOLCHAIN_STATE.yaml` | **Derived mutable** | Antigravity-maintained snapshot of detected engineering tooling and maintenance state |
| `CODEX_CONTEXT.md` | **Derived mutable** | Gemini Flash-generated compact context pack for the next Codex/Sonnet product-executor run |

Normative files define rules. Operational and derived files describe the current state. A derived file must never
silently override Git, OpenSpec, an approved normative policy, or an explicit owner decision.

## 3. Required read order

### Codex / Sonnet product executor

For substantial implementation or diagnosis after an explicit baton handoff:

1. applicable `AGENTS.md` instructions;
2. `docs/.ai/AI_COLLABORATION_PROTOCOL.md`;
3. `docs/.ai/AI_MODEL_ROUTING_POLICY.md` when model-routing/anti-loop rules apply;
4. `docs/.ai/CURRENT_AGENT_HANDOFF.md`;
5. `docs/.ai/CODEX_CONTEXT.md` if it is current for the live repository HEAD;
6. the active OpenSpec change/specification and the exact canonical project documentation referenced by the handoff/context pack.

The product executor should not re-audit the whole engineering toolchain merely to begin product work. If maintenance
is required, hand it to Gemini Flash at a safe boundary. Sonnet must return semantic OpenSpec decisions to Codex by
default.

### Gemini Flash in Antigravity

For repository maintenance:

1. applicable `AGENTS.md` instructions;
2. `docs/.ai/AI_COLLABORATION_PROTOCOL.md`;
3. `docs/.ai/CURRENT_AGENT_HANDOFF.md`;
4. live Git status/HEAD and repository evidence;
5. `docs/.ai/TOOLCHAIN_STATE.yaml` as a cache, never as authority;
6. current upstream/tool documentation as required by the repository's documentation/MCP rules;
7. semantic OpenSpec artifacts only as read-only evidence.

### Gemini Pro in Antigravity

For `DIAGNOSTIC` or `REVIEW` batons:

1. applicable `AGENTS.md` instructions;
2. `docs/.ai/AI_COLLABORATION_PROTOCOL.md`;
3. `docs/.ai/AI_MODEL_ROUTING_POLICY.md` and stall/audit policy as referenced by the handoff;
4. `docs/.ai/CURRENT_AGENT_HANDOFF.md`, especially attempt history and `DO_NOT_REDISCOVER`;
5. only the code/graph/spec/evidence needed to establish new causal information;
6. return the diagnosis/review to the recorded `return_actor` unless owner authorization changes ownership.

## 4. Sequential execution invariant

```text
OWNER
  |
  +--> GEMINI FLASH (optional maintenance pre-flight)
  |        |
  |        +--> READY baton
  |
  +--> CODEX (primary product executor)
  |        |
  |        +--> CONTINUATION baton --> SONNET (alternate product executor)
  |        |                              |
  |        |<--------- baton -------------+
  |        |
  |        +--> DIAGNOSTIC/REVIEW baton --> GEMINI PRO
  |        |                                  |
  |        |<------------ return baton -------+
  |        |
  |        +--> MAINTENANCE baton --> GEMINI FLASH
  |
  +--> COMPLETE / HUMAN DECISION
```

All roles are sequential partners, **not** concurrent writers. A new executor receives normal task ownership only from a
`HANDOFF_STATUS=READY` baton. Quota exhaustion does not transfer ownership automatically.

## 5. Minimal project `AGENTS.md` integration

Do not copy the complete contents of this directory into `AGENTS.md`. Add one small reference block and keep the
canonical rules here.

```markdown
<!-- AI-COLLABORATION:BEGIN -->
## AI collaboration

This repository uses sequential Codex <-> Antigravity baton collaboration.
Only one AI executor operates on the repository at a time; the human owner controls turn changes.
A new executor may assume normal task ownership only from a READY handoff that explicitly names it.

Before substantial work, read:
- `docs/.ai/AI_COLLABORATION_PROTOCOL.md`
- `docs/.ai/CURRENT_AGENT_HANDOFF.md`
- `docs/.ai/CODEX_CONTEXT.md` when assigned to Codex/Sonnet and the context pack matches the live HEAD

Follow `docs/.ai/AI_MODEL_ROUTING_POLICY.md` when its routing/anti-loop rules apply.
Repository state and canonical project documentation are authoritative; derived AI state is not.
<!-- AI-COLLABORATION:END -->
```

If an equivalent block already exists, reconcile it minimally instead of duplicating it.

## 6. Owner workflow

Typical implementation cycle:

```text
1. Optional: run Gemini Flash pre-flight when engineering-tool/context state is stale.
2. Open Codex and continue from the READY handoff + context pack.
3. Codex implements/tests; it may explicitly pass bounded continuation to Sonnet at a safe boundary.
4. If a product root stops converging, pass a DIAGNOSTIC baton to Gemini Pro; Pro returns analysis to the recorded product executor.
5. After meaningful implementation, optionally pass a REVIEW baton to Gemini Pro.
6. When tooling/derived state is stale, pass a MAINTENANCE baton to Gemini Flash.
7. Each executor writes a complete READY handoff before the owner switches to the next partner.
```

A pre-flight/post-flight/review is conditional, not ceremonial. Do not spend an executor run when the relevant state is
already current and no maintenance/review value exists. Gemini Pro is not used for routine Graphify/OpenSpec/framework
updates; those belong to Gemini Flash.

## 7. Multi-project rule

Every maintenance run is scoped to the **current Git repository only**. Antigravity must not scan the user's machine for
other projects, update another repository, or perform a batch multi-repository migration as a side effect.

A global tool update may affect the machine globally. When that occurs, record the before/after version and installation
provenance in the current repository's toolchain state and handoff. Other repositories are revalidated only when the
owner later opens them; they are not modified proactively.

## 8. Existing global agent baseline

The owner may maintain user-level agent instructions (for example Context7 and Ponytail rules) outside this repository.
Project documentation should reference or inherit those instructions through the normal agent hierarchy rather than
copying them into multiple independently editable normative files.
