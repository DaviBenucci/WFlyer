# Phase 3 OpenSpec reconciliation — 2026-08-24

## Conflict

Before reconciliation, `Implement readiness state machine` was CLI task 11 and
therefore the next executable row after Gate 2. Canonical precedence places
content, detailed routes, and conversion contracts in Phase 3; readiness is a
Phase-4 requirement.

## Normalization

The readiness requirement was retained, left unchecked, and moved beneath an
explicit Phase-4 heading. Six stable `P3.1..P3.6` tasks were inserted before
it. Later section headings were renumbered without changing their meaning.
Completed Phase-0/1/2 truth remained checked.

Resulting order:

1. Phase 2 — static v2 story (complete)
2. Phase 3 — content, detailed routes, conversion contracts
3. Phase 4 — intro/bootstrap/readiness/deep links
4. Phase 5 — Desktop Motion Lab and master story

The proposal, design, and delta specs now bind the typed content/publication
domain, retained route namespace, fail-closed project publication, application
CTA boundary, and preserved Contact controls.

## Validation and progress

Command:

`pnpm exec openspec validate rebuild-scroll-driven-wflyer-v2 --strict --json`

Result: PASS, 1/1 change, zero issues.

At the start of Phase 3 the active change was 10/45 complete. P3.1 was the
first incomplete executable task. Gate-3 closure completes P3.1 through P3.6,
resulting in 16/45 complete. The next unchecked row is task 17,
`Implement readiness state machine`, under Phase 4. It was not started.
