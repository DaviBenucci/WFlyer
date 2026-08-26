# W_Flyer Procedural Score Composer v0.1 — Canonical Contract

## Purpose

Create the perception of a score being freshly written for each new session while technically assembling only pre-approved rhythmic motifs and controlled pitch contours.

The Composer returns semantic score data only. It does not render SVG/DOM and does not know React or GSAP.

## Session determinism

- Create one versioned score seed per browser session.
- Persist it in session storage.
- Reload in the same session keeps the same semantic score.
- A new session may produce another approved arrangement.
- Derive independent chapter sub-seeds from `sessionSeed + chapterId + composerVersion`.
- Tests and Visual Lab must support explicit fixed seeds.
- Unseeded `Math.random()` is prohibited.

## Whitelisted rhythmic motifs

Simple motifs:
- `Q1`, `Q2`, `Q3`, `Q4` — one to four quarter notes
- `H1`, `H2` — one or two half notes
- `W1` — one whole note

Beamed motifs:
- `E8_E8` — exactly two beamed eighth notes
- `E8_TRIPLET_3` — exactly three beamed eighth-note triplets, mandatory centered `3` and bracket
- `S16_S16_S16_S16` — exactly four beamed sixteenth notes
- `E8_S16_S16`
- `S16_S16_E8`
- `S16_E8_S16` — requires deterministic secondary beam hooks around the central eighth note

The Composer must not invent unlisted rhythmic groups.

## Diversity rules

Hard rules:
- identical motif IDs may not occur consecutively
- notes stay inside landing range `C4..A5`
- no illegal rhythmic motif
- triplet always contains exactly 3 notes + `3` + bracket

Soft diversity rules:
- penalize three consecutive motifs from the same rhythm family
- reduce probability of another dense motif immediately after a dense motif
- quarter/half/whole notes are optional; a chapter may contain none of a particular family
- ledger-line pitches are allowed but should be occasional rather than dominant
- prefer the internal staff range for most generated pitches

## Pitch contours

Generate pitches through whitelisted contours rather than independently random pitches:

- `step-up`
- `step-down`
- `arch`
- `valley`
- `alternating`
- `repeat-then-step`
- `small-leap-up`
- `small-leap-down`

Avoid more than two consecutive notes at the same pitch unless a future explicitly approved motif requires otherwise.

Version 1 uses these diatonic `staffStep` deltas from the selected anchor (`—` means unsupported for that note count):

| contour | n=1 | n=2 | n=3 | n=4 |
| --- | --- | --- | --- | --- |
| `step-up` | `[0]` | `[0,1]` | `[0,1,2]` | `[0,1,2,3]` |
| `step-down` | `[0]` | `[0,-1]` | `[0,-1,-2]` | `[0,-1,-2,-3]` |
| `arch` | — | — | `[0,1,0]` | `[0,1,1,0]` |
| `valley` | — | — | `[0,-1,0]` | `[0,-1,-1,0]` |
| `alternating` | — | — | `[0,1,-1]` | `[0,1,-1,0]` |
| `repeat-then-step` | — | — | `[0,0,1]` | `[0,0,1,2]` |
| `small-leap-up` | — | `[0,2]` | `[0,2,3]` | `[0,2,3,4]` |
| `small-leap-down` | — | `[0,-2]` | `[0,-2,-3]` | `[0,-2,-3,-4]` |

Contour deltas are explicit and versioned per supported motif length. A selected contour preserves its complete interval structure. Boundary correction may apply only one uniform integer `staffStep` translation to the complete contour, choosing the smallest-magnitude translation that places every note inside `C4..A5 (-2..10)`. Individual notes are never clamped, reflected, reversed, truncated, or independently changed.

If the complete contour cannot fit after a uniform translation, the candidate is rejected deterministically and the composer evaluates the next candidate using the documented seeded schedule. Preferred-range weighting may favor `E4..F5 (0..8)` but may not violate these hard rules.

## Chapter density profiles

Supported profiles:
- `calm`
- `balanced`
- `active`
- `terminal`

The exact v0.1 numeric motif weights captured in the Gate-C configuration were
approved by final external human review on 2026-08-24. They remain
version-controlled calibration data and cannot change implicitly with the final
triplet renderer correction.

Suggested semantic use:

Professional:
- About: calm
- Services: balanced
- Process: active
- Projects: active
- Contact: calm
- Terminal: terminal

Application:
- Application: balanced
- How it works: active
- Benefits: balanced
- Demonstration: active
- Access W_Flyer: calm
- Terminal: terminal

## ScorePath slots and reserved zones

The Composer may place motifs only in explicit composition slots authored by the Score Path layout. It may not choose free arbitrary X/Y coordinates.
Reserved zones for Persona, project cards, tablet, forms, headings and transitions must remain motif-free when the segment contract marks them reserved.

## Terminal grammar

The end of each branch is semi-procedural and restricted to calm values before the final barline. Terminal slots may use only:
- `Q1`
- `Q2`
- `H1`
- `H2`
- `W1`

Dense sixteenth/eighth combinations may not terminate directly into the final barline.

## Key signatures

The Composer does not choose key signatures. They are explicit continuous-score configuration and occur at most once near the beginning of each branch.

## Responsive/reduced-motion stability

Desktop/mobile breakpoint changes preserve the same semantic motifs and pitches for the current session. Only ScorePath geometry and spatial spacing adapt. Reduced motion preserves the same composed score and renders it statically.
