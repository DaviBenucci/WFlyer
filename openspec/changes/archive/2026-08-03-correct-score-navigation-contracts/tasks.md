## 1. Canonical geometry

- [x] 1.1 Replace the disconnected geometry model with pure helpers matching the current runtime anchor, pivot, segment, curve, and interpolation behavior.
- [x] 1.2 Make the experience coordinator and transition layer consume the shared helpers and remove their duplicate algorithms.
- [x] 1.3 Rewrite geometry tests against exact production behavior and confirm approved visual output does not drift.

## 2. Navigation contracts

- [x] 2.1 Add explicit native opt-out to link eligibility and wire `data-score-transition="native"` through delegated activation.
- [x] 2.2 Preserve a committed destination with `push` when navigation continues during incoming animation while retaining pre-commit consolidation.
- [x] 2.3 Add unit/DOM coverage for opt-out and Playwright coverage for the post-commit Back sequence.

## 3. Evidence and synchronization

- [x] 3.1 Update the Phase 05 motion documentation with the opt-out and pre-/post-commit history distinction.
- [x] 3.2 Run targeted lint, typecheck, unit, Phase 05 E2E, motion, accessibility, and visual gates and record results.
- [x] 3.3 Strict-validate OpenSpec and prepare the corrective change for synchronized archival and a focused durable checkpoint.
