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

## Chapter density profiles

Supported profiles:
- `calm`
- `balanced`
- `active`
- `terminal`

Exact numeric motif weights are intentionally **not canonical yet**. They must be calibrated in the Composer Visual Lab across many fixed seeds.

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
