# Phase 8 Gate Report

**Gate 8 — PASS**

Closeout date: 2026-08-28
Phase: 8 — Application branch scenes
OpenSpec task boundary: 30–32

## Entry state

- Branch: `develop/site-institucional`.
- Entry HEAD: `11dc576e7bf663e425a2170f53c53d06343850cd`.
- Phase 7 and its sealed evidence bundle were intact.
- OpenSpec progress was 29/45; task 30 was first incomplete.
- Public `/` remained the retained legacy landing.
- Graphify, Phase-0, `repo-overlay`, and root/import residue remained outside
  the checkpoint.

## Delivered contract

- Application Overview, How It Works, and Benefits use typed public content and
  replace only their isolated Motion Lab placeholders.
- APP-04 is a non-interactive device with the canonical five-state reducer,
  activity/visibility ownership, pause/resume, final-frame, replay, failure,
  reduced-motion, and cleanup behavior.
- No final APP-04 asset exists in this checkpoint. The default contract renders
  a deterministic static missing-media state; sentinel URLs exist only in an
  explicit development test scenario and are intercepted by tests.
- Access W_Flyer is the sole primary Application CTA and opens the separate
  application origin in a new context.
- A structural final barline precedes the Application terminal. Phase 9 has
  only an explicit pending seam; no ScorePath or Music integration exists.

## Gate decisions

| Requirement | Result |
|---|---|
| Overview, five How steps, four Benefits groups | PASS |
| APP-04 starts only on first active entry with a complete media contract | PASS |
| Missing media is deterministic, static, and truthful | PASS |
| Pause/resume, hidden tab, completion, replay, failure, and cleanup | PASS |
| Reduced motion and compact/touch behavior | PASS |
| Simulated screen inert; replay is its only possible control | PASS |
| Access is the only primary Application CTA | PASS |
| Final barline before Application terminal | PASS |
| Phase-9 score remains a seam only | PASS |
| Focused post-fix cross-engine regression | PASS; 27/27 |
| Chromium, Firefox, WebKit Phase-8 matrix | PASS; 36/36 |
| Full unit suite | PASS; 82 files, 652 tests |
| Storybook build and interactions | PASS; 13 files, 63 interactions |
| Accessibility suite | PASS; 181 applicable, 2 intentional skips |
| Phases 4–6 regression | PASS; 90 applicable, 3 intentional skips |
| Phase-7 regression | PASS; 30/30 |
| Contact/security regression | PASS; 15/15 |
| Retained public/detail/legal/navigation/Music | PASS; 62 applicable, 1 production-only skip |
| Dependency policy, lint, strict typecheck | PASS |
| Production build | PASS; 36/36 pages |
| Standalone and indexing | PASS; 20 public routes, 4 dev-route 404s, 22 assets; production indexing passed |
| Production browser isolation | PASS; 5/5 |
| Strict focused OpenSpec | PASS; 1/1, zero issues |
| OpenSpec progress | 32/45; task 33 first incomplete |
| Phase-8 evidence seal | PASS; 27/27 payloads and detached manifest digest verified |

## Timing investigation

The retained Firefox failures were not hidden or rebaselined. A Phase-7
control proved Phase-8 causality for the motion budget: the control passed
three repetitions near 33.3 ms p95, while the Phase-8 tree failed three near
66.4 ms. Profiling isolated the redundant APP-04 shell transform nested inside
the already transformed master track. Removing only that decorative transform
restored approximately 33.2 ms p95; the canonical `<34 ms` threshold was not
changed.

The Back/Forward failure was inconsistent in both control and Phase-8 trees.
A deterministic trace exposed a stale viewport-preservation request cancelling
a newer explicit traversal after ScrollTrigger refresh. The runtime now lets
that newer traversal settle and rebuilds around its resulting semantic
chapter. Traversals already active when rebuild starts retain the accepted
Phase-6 cancellation behavior. Semantic history identity remains chapter-based
and no pixel/progress value entered canonical history.

## Scope protection

- OpenSpec task 33 remains unchecked; Phase 9 is untouched.
- No final Music/ScorePath integration, Persona asset, APP-04 media, product
  footage, public `/` cutover, analytics, provider, infrastructure, staging,
  deployment, or production operation occurred.
- The legacy public demo remains available for later rollback/cutover work.

## Closure

Tasks 30–32 are complete and supported by final evidence. Gate 8 passes.
Phase 9 has not started; task 33, human approval of Score Path layouts, is the
next unchecked task and remains blocking.
