# Phase-4 Commit Boundary Decision

Date: 2026-08-25  
Decision: **NO COMMIT — Phase-4-only boundary is not self-contained**

## Audited base

- Branch: `develop/site-institucional`
- HEAD: `784856b5b34ef87c8be24ab666d5d37756573ded`
- Index before and after audit: empty

## Reproducibility failure

A Phase-4-only tree checked out atop HEAD would not compile or preserve its
tested contract:

- bootstrap destination/history imports Phase-2 `story/manifest.ts` and
  `story/types.ts`, which do not exist at HEAD;
- the bootstrap review page imports the Phase-2 `components/story` surface,
  which does not exist at HEAD;
- the inherited development-only `noindex` and production `notFound()` owner is
  the uncommitted Phase-2 Visual-Lab parent layout;
- the story skeleton transitively consumes Phase-2/3 typed content that is also
  absent at HEAD;
- the tested route-aware shell and hash controls depend on accepted Phase-2/3
  root wiring absent at HEAD.

`src/lib/story/index.ts` is itself a mixed whole-file boundary: it contains
Phase-2 exports and the Phase-4 bootstrap export. Staging the current file as
Phase 4 would silently absorb prerequisite history.

## Smallest coherent boundary

The smallest runnable and contract-valid source boundary is cumulative Phase 2
+ Phase 3 + Phase 4. Whole-file evidence coherence expands further because the
live checkpoint, OpenSpec, calibration, and status records include accepted
Phase-0/Music history. Constructing ordered historical commits would require
hunk-level reconstruction or a separately authorized cumulative commit.

Music runtime is not a Phase-4 dependency and must not be staged merely to hide
this boundary problem.

## Controlled-commit result

The prompt authorized exactly one self-contained Phase-4 completion commit and
required a stop if that boundary could not be reproduced. Therefore:

- no file was staged;
- no local commit was created;
- HEAD was not moved;
- no pre-existing work was reset, rewritten, or lost;
- no push, PR, merge, rebase, or deployment occurred.

Separate authorization and an explicit ordered prerequisite/cumulative commit
plan are required before committing this dirty historical stack.
