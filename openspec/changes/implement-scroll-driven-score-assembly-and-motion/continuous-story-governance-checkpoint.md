# Continuous-story governance checkpoint — 2026-09-24

## Current disposition — owner-approved historical provenance exception

[ADR-058](../../../docs/canonical-v2/00-governance/03-decision-register.md#adr-058--historical-baseline-provenance-exception)
records the narrow non-blocking exception. ADR-057 / ASM-IMP-DEC-020 remains
approved and normalized; no architecture or task semantics are reopened.

```text
BASELINE_INTEGRITY=UNRESOLVED_NON_BLOCKING_EXCEPTION
ROOT_CAUSE=UNRESOLVED_PROVENANCE_FAILURE
PREEXISTING_DIRTY_WORK_EXACT_PRESERVATION_CERTIFIED=false
PREEXISTING_DIRTY_WORK_KNOWN_LOST=false
TASK_5_7_DEPENDS_ON_DISPUTED_CONTENT=false
IMPLEMENTATION_READY=true
FIRST_IMPLEMENTATION_TASK=5.7
TASK_5_7_STATUS=NOT_STARTED
NEXT_ROUTING_CLASS=BOUNDED_IMPLEMENTATION
HUMAN_GEOMETRY_APPROVAL=PENDING
GOVERNANCE_COMMIT_CREATED=false
```

The owner accepts the forensic evidence ceiling without choosing an original
byte or certifying exact preservation. Both historical files and their original
manifest remain untouched. Do not repair, regenerate, replace or normalize
them; do not resume baseline forensics. Only new independent provenance may
reopen this question. There is no demonstrated runtime/product impact or known
work loss, and task 5.7 has no dependency on the disputed content.

The [implementation package](continuous-story-implementation-package.md) is
ready for task 5.7 only in the next executor session. This pass performs no
implementation. The 25/55 checklist and pending human/geometry/refreeze gates
remain unchanged. No commit retry: overlap with earlier dirty governance remains
the reason no checkpoint commit exists, and is not an implementation blocker.

ADR-058 normalization validation: active OpenSpec strict PASS; repository
routing/governance validator PASS; affected traceability and 36 local references
PASS; scoped diff PASS. Six Markdown documents changed, no product source or
disputed evidence writes. Task 5.7 remains unchecked and progress stays 25/55.
Validation records: `.git/continuous-story-governance/20260924T171616Z/provenance-exception/`.

The prior blocker, forensic result, hashes and capture details below are
preserved as historical checkpoints. Their blocking readiness states and the
old ambiguous preservation boolean are superseded only by the disposition above.
The raw discrepancy is not relabeled PASS and no evidence is rewritten.

<details>
<summary>Historical governance and diagnosis checkpoints before ADR-058</summary>

**Authority:** ADR-057 / ASM-IMP-DEC-020.
**Scope:** documentation/governance only; no runtime, geometry, Projects,
Composer, CSS, GSAP, Assembly, public integration, push or deployment.

## Pre-edit baseline and isolation

Branch: `develop/site-institucional`.
HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
The preserved local baseline is
`.git/continuous-story-governance/20260924T171616Z/`.
It contains `baseline.json` (2,343 tracked/untracked paths and hashes),
`status.txt` (1,089 dirty entries), `tracked.diff`, `index.diff`, `index`,
`index-files.txt`, pre-edit documentation copies under `files/`, and
`intended-files.json` / `intended-before.diff` for 27 governance paths.
The index was empty. No reset, clean, revert or prior-work staging occurred.

`governance.delta.patch` isolates the current session against the captured
worktree. A read-only `git apply --cached --check` fails against the original
index on overlapping canonical/OpenSpec hunks and pre-existing untracked
handoffs. The new package depends on those earlier uncommitted contracts;
selecting whole files would absorb predecessor work. No staging or commit is
attempted. Missing commit does not invalidate architectural normalization.

```text
GOVERNANCE_COMMIT_CREATED=false
GOVERNANCE_COMMIT_SHA=none
GOVERNANCE_COMMIT_SUBJECT=none
STAGED_FILES_BEFORE_COMMIT=0
COMMITTED_FILES=0
PRODUCT_SOURCE_FILES_COMMITTED=0
COMMIT_SCOPE_VERIFICATION=PASS
```

## Validation results

- OpenSpec strict active change: PASS; workspace: 17 passed / 0 failed.
- Canonical ADR/ASM identifier uniqueness, next-ID lineage and preserved
  ADR-048/049/050/055/056 text: PASS.
- Decision/contract/OpenSpec traceability: PASS.
- YAML/frontmatter parsing, duplicate-key checks, manifest shape, IDs and
  references: PASS. No formal JSON schema or JSON data was edited; formal
  schema migration is not applicable.
- Local documentation links/anchors: 55 checked, zero broken.
- Repository `node scripts/validate-ai-routing.mjs`: PASS.
- Scoped `git diff --check` and new-file whitespace: PASS.
- Runtime/source scope, unchanged HEAD and empty index: PASS.
- Exact baseline preservation: NOT CERTIFIED, due to the single historical
  audit-byte discrepancy documented below. Do not label this an implementation
  regression or silently restore either version.

The canonical architecture is approved and normalized. Final executor readiness
is **BLOCKED_BY_BASELINE_INTEGRITY**; `IMPLEMENTATION_READY=false`. This is not a
commit-isolation failure and does not reopen the owner architecture decision.
The next route is `COMPLEX_DIAGNOSIS` for a bounded read-only integrity
reconciliation of that one path/captured copy only. Do not restart story
analysis, baseline discovery or the old audit, and do not patch either file.
Task 5.7 remains the first future implementation slice after that check is
resolved; it is not started or released by this checkpoint.

Final worktree count: **1,091 dirty entries**, including the 1,089 baseline
entries and the two new governance Markdown files. 27 intended governance paths
were written; 25 existed before this session. No files are staged or committed.
`PREEXISTING_DIRTY_WORK_PRESERVED=false` means exact preservation could not be
certified for the one discrepancy, not that this session discarded prior work.

The runnable local check and detailed reports live beside the preserved
baseline (`validate-governance.py`, `final-validation.json`); none is product
source or part of a proposed commit. Graphify was queried for navigation;
no code/AST changed, canonical paths were reused and regeneration is not required.
The existing graph is historical derived navigation, not authority for ADR-057.

## Preservation qualification

All governance writes are limited to the 27 intended documentation/manifest
paths. Phase-9, HGA results/captures, product/runtime, tests, `.env.example` and
Graphify receive no writes. One historical audit input has an unexplained
single-byte discrepancy against its captured copy:

`stage-1-inherited-audit-data/access-paired-comparisons.json` in this change,
byte offset `10998499` (zero based): baseline byte `107`, live byte `105`.
Baseline SHA-256: `b4a2aeab70b27103a853e9dbd334df12de38ff8c04266baf9fd9909391b93603`.
Live SHA-256: `1f2482af6d698365d9f0a9d00cd6af8244761d8a03a8903b0be98cc8681ed57a`.
Size is unchanged and filesystem modification/change timestamps predate this
session. The captured text reads `kntegrated-static`; live text reads
`integrated-static`. This suggests a capture/read integrity anomaly but does
not prove its cause. Neither file is rewritten. Both versions and their hashes
remain preserved. Exact byte-for-byte worktree preservation cannot be certified
for that path; the final preservation flag must report this limitation rather
than falsely assert a clean integrity result. No new-target conclusion relies
on that superseded audit input.

## Architecture and next boundary

The [single canonical spatial contract](../../../docs/canonical-v2/02-experience/01-global-story-architecture.md)
owns coordinate/span, presentation, camera, Contact deliberate-exit, lifecycle
and validation semantics. The [bounded package](continuous-story-implementation-package.md)
starts with task 5.7 in a subsequently invoked implementation session.
Tasks were recalculated: 30/51 before, 25/55 after. Five old-target validation
tasks reopen and four unchecked implementation prerequisites are added. HGA-002
old macro-gap work is superseded, not completed. Human Geometry Approval,
Geometry Refreeze, Assembly, GSAP and public completion remain pending.

## Focused diagnosis follow-up

The [binary/provenance diagnosis](continuous-story-baseline-integrity-diagnosis.md)
confirms one changed byte, equal lengths and no trailing bytes. B matches C,
but the shared capture read and conflicting pre-session source timestamps do
not prove mutation or capture defect. Classification remains
`UNRESOLVED_PROVENANCE_FAILURE`; no repair was performed. Readiness stays false.
Independent provenance is required; repeated comparison is not a next attempt.
The 1,091 count above is the prior checkpoint; the added diagnosis report is
separate diagnostic work. No commit attempt was repeated.

</details>
