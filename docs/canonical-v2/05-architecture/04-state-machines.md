# State Machines

## Story readiness

```text
INITIAL
  → WAITING_CRITICAL
  → RESOLVING_DESTINATION
  → POSITIONING
  → READY_TO_REVEAL
  → REVEALING
  → REVEALED

any nonterminal state + critical failure/timeout/recovery condition
  → best-effort POSITIONING
  → DEGRADED
```

`REVEALED` and `DEGRADED` are usable terminal states. `DEGRADED` means the
static vertical story is revealed and interactive; it is not an error overlay.
The legacy shorthand maps as follows: `BOOTING` = `INITIAL` through
`RESOLVING_DESTINATION`, `INTRO_EXIT` = `READY_TO_REVEAL` plus `REVEALING`,
`STORY_READY` = `REVEALED`, and `FAIL_OPEN_VERTICAL_READY` = `DEGRADED`.

Skip/Escape bypass the presentation hold but do not bypass semantic destination
resolution or best-effort positioning. Reduced motion and an already-completed
session use zero-duration presentation transitions while following the same
semantic state progression. Timeout or critical failure supersedes presentation
timing, releases owned locks/resources, and terminates in `DEGRADED`.

## Header traversal

```text
MANUAL
  → RESOLVING_TARGET
  → AUTO_TRAVERSAL
  → COMPLETED
  → MANUAL

AUTO_TRAVERSAL + explicit input/new target/Escape
  → CANCELLED or SUPERSEDED
  → MANUAL / RESOLVING_TARGET
```

## Responsive mode rebuild

```text
RUNNING → FREEZE → CAPTURE_CHAPTER → DESTROY_OWNED_CONTEXT
        → BUILD_NEW_MODE → RESTORE_CHAPTER → RUNNING
```

## APP-04

```text
NOT_STARTED → PLAYING → FINAL_FRAME
                 ↓ error      ↑ replay
             ERROR_STATIC ────┘

Reduced motion initial → REDUCED_STATIC → explicit replay → PLAYING
```

Rules:

- preload readiness is not a state transition to PLAYING;
- leaving active range pauses unfinished PLAYING;
- returning after FINAL_FRAME stays FINAL_FRAME.

## Persona easter-egg controller

```text
SESSION_PLANNED
  → ELIGIBLE_CHAPTER_ENTERED
  → CHECK_EXCLUSIONS
  → SHOWING
  → HIDDEN
```

Exclusion failure goes directly to HIDDEN without consuming an appearance unless implementation evidence justifies consumption.

## Music composer

```text
NO_SESSION_SEED → CREATE_SECURE_SEED → DERIVE_CHAPTER_SEEDS
→ SELECT_WHITELISTED_MOTIFS → SELECT_CONTROLLED_CONTOURS
→ VALIDATE_CONSTRAINTS → COMPOSED_SEMANTIC_SCORE → RENDER_LAYOUT
```

Resize/theme/reduced motion reuse `COMPOSED_SEMANTIC_SCORE`; they do not return to motif selection.

## Contact

Retain existing validated states, with duplicate submission bounded:

```text
IDLE → VALIDATING → SUBMITTING → SUCCESS
                 ↘ FIELD_ERROR / PROVIDER_ERROR → EDITABLE
```
