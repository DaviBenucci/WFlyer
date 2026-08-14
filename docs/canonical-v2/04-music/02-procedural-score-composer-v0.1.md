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

Exact weights/counts are Visual Lab calibration values.

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

Pitch contours are chosen from a whitelist such as step-up, step-down, arch, valley, alternating, repeat-then-step, small-leap-up/down. Notes are not independently randomized.

## Semantic slots

Composer targets stable slot IDs and avoids reserved zones. Horizontal/vertical layouts map the same semantic motifs to different ScorePath coordinates without recomposing.

## Key signature

Not controlled by Composer. It is explicit branch configuration and occurs at most once near branch origin.

## Terminal grammar

Final slots use only simple calm values (`Q1/Q2/H1/H2/W1`) before the final barline. Dense beam groups cannot terminate a branch.
