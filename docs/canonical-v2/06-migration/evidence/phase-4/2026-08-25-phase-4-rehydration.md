# Phase 4 Rehydration

Date: 2026-08-25

## Verified before implementation

- `AGENTS.md` and the root execution/status documents were read in canonical
  precedence order.
- Applicable experience, architecture, migration, quality, ADR, manifest, and
  active OpenSpec files were reconciled.
- Phase-2 and Phase-3 checksum bundles passed.
- Active OpenSpec progress was 16/45 and task 17 was the first incomplete
  executable task.
- Public `/` still mounted the retained `BrandIntroController` and legacy
  landing.
- `RouteAwareExperienceBoundary` already isolated the full
  `/__visual-lab/story/**` subtree from the legacy motion shell.
- The typed Phase-2 manifest exposed exactly 13 chapter IDs and 11 public story
  hashes.
- No current Phase-4 readiness, destination, history, positioning, component,
  route, test, or evidence implementation existed.
- The older `scripts/capture-phase4-evidence.mjs` belongs to a superseded July
  chronology and was not reused.

## Architecture conclusion

The safe seam was a nested development route plus pure contracts under
`src/lib/story/bootstrap/`. This preserved public `/`, avoided the legacy
route-transition/history owner, and allowed Phase 5 to replace only the
physical positioning adapter.

Graphify was used as the repository-relationship map and its useful result was
saved after implementation. Current Next.js and React documentation confirmed
production `notFound()` behavior and effect-cleanup/Strict-Mode requirements.
