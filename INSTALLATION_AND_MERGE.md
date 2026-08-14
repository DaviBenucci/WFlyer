# W_Flyer Canonical Implementation Package v1.0 — Installation

This ZIP is a **repository-root overlay** prepared against the source archive:

- `Wflyer(20260814-194446).zip`
- SHA-256: `39659cf3f039317a0b8140adad988a1adb279d4ba6bbd0cf81bab6696994325d`
- Audit date: `2026-08-14`

## Installation

1. Create a backup branch from the current W_Flyer repository state.
2. Extract this ZIP **at the repository root**, not inside a new nested folder.
3. Allow the documented governance files to replace their legacy versions.
4. Inspect `git status` before committing.
5. Read, in order:
   1. `WFLYER_CODEX_START_HERE.md`
   2. `WFLYER_IMPLEMENTATION_PLAN.md`
   3. `WFLYER_CANONICAL_DOCUMENTATION_MANIFEST.md`
   4. `docs/canonical-v2/README.md`
6. Verify package integrity with `WFLYER_V2_SHA256SUMS.txt`.

## What this overlay changes

This package primarily adds or replaces **documentation, OpenSpec specifications, and approved visual-library assets**. It does not implement the target landing experience by itself.

The package intentionally replaces the root governance entry points (`AGENTS.md`, `README.md`, `PRE-CODE-STATUS.md`, and `DOCUMENTATION_MANIFEST.json`) so Codex cannot treat the legacy route-per-chapter implementation as the approved target.

## Current implementation status after merge

The code remains a legacy v1 baseline until Codex executes the linear plan. The correct status is:

`V2_CANONICAL_DOCUMENTATION_APPROVED_IMPLEMENTATION_PENDING`

Production remains unauthorized.
