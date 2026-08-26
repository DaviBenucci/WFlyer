# Procedural Score Composer v0.1

## Purpose

Make the score feel newly written between sessions through deterministic selection of approved material. It is not free music composition and does not guarantee playable harmonic content.

## Seed lifecycle

- create a secure random session seed once;
- store in session storage;
- derive chapter sub-seeds from session seed + composer version + chapter ID;
- same session/version/chapter/slots → same semantic result;
- new session may differ;
- explicit seed injection for tests/dev;
- no `Math.random()`.

## Whitelisted motifs

Simple:

- `Q1`, `Q2`, `Q3`, `Q4`
- `H1`, `H2`
- `W1`

Beamed:

- `E8_E8`
- `E8_TRIPLET_3` — exactly 3 eighths + centered `3` + bracket
- `S16_S16_S16_S16`
- `E8_S16_S16`
- `S16_S16_E8`
- `S16_E8_S16`

No other automatic group is allowed.

## Density profiles

- `CALM`
- `BALANCED`
- `ACTIVE`
- `TERMINAL`

The exact v0.1 weights/counts recorded in the Gate-C configuration were approved
by final external human review on 2026-08-24. Changing them requires a new
explicit calibration decision; this final triplet correction does not alter
Composer semantics or weights.

Suggested chapter profile:

- About/Contact/Access/terminals: calm/terminal;
- Services/Application/Benefits/Home: balanced;
- Process/Projects/How/Demo: active.

## Anti-repetition

Hard:

- no identical adjacent motif;
- only whitelisted motif IDs;
- pitch bounds respected;
- reserved zones never occupied;
- terminal slots never use dense motifs;
- every triplet includes its mandatory presentation.

Soft:

- penalize three same-family motifs in sequence;
- penalize dense-after-dense;
- insert visual breathing space;
- limit same-height repetitions.

## Pitch

Landing range `C4..A5`, preferred `E4..F5`. Ledger-line pitches are occasional.

Pitch contours are chosen from versioned, explicit per-note-count delta tables. Notes are not independently randomized.

| Contour | 1 note | 2 notes | 3 notes | 4 notes |
|---|---|---|---|---|
| `step-up` | `[0]` | `[0,1]` | `[0,1,2]` | `[0,1,2,3]` |
| `step-down` | `[0]` | `[0,-1]` | `[0,-1,-2]` | `[0,-1,-2,-3]` |
| `arch` | unsupported | unsupported | `[0,1,0]` | `[0,1,1,0]` |
| `valley` | unsupported | unsupported | `[0,-1,0]` | `[0,-1,-1,0]` |
| `alternating` | unsupported | unsupported | `[0,1,-1]` | `[0,1,-1,0]` |
| `repeat-then-step` | unsupported | unsupported | `[0,0,1]` | `[0,0,1,2]` |
| `small-leap-up` | unsupported | `[0,2]` | `[0,2,3]` | `[0,2,3,4]` |
| `small-leap-down` | unsupported | `[0,-2]` | `[0,-2,-3]` | `[0,-2,-3,-4]` |

These arrays are diatonic staffStep deltas from a selected anchor. Table version 1 belongs to Composer version 1; any delta-table behavior change requires a composer-version change.

After a start pitch is selected, the complete contour may receive only one uniform integer staffStep translation. The composer chooses the minimum-absolute translation that places every note in `C4..A5` (`-2..10`), choosing zero whenever zero is valid. It never clamps individual notes, reflects/reverses a contour, truncates it, or mutates one interval independently. If the contour span cannot fit after translation, that motif/contour candidate is rejected and the next candidate is selected through the same seeded sequence or a documented deterministic fallback. The preferred optical range remains `E4..F5` (`0..8`), with extended positions controlled by the profile and ledger-frequency policy.

## Semantic slots

Composer targets stable slot IDs and avoids reserved zones. Horizontal/vertical layouts map the same semantic motifs to different ScorePath coordinates without recomposing.

## Key signature

Not controlled by Composer. It is explicit branch configuration and occurs at most once near branch origin.

## Terminal grammar

Final slots use only simple calm values (`Q1/Q2/H1/H2/W1`) before the final barline. Dense beam groups cannot terminate a branch.
