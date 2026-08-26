# Procedural Score Composer Specification

## Purpose

Define session-seeded composition of approved rhythmic motifs and bounded pitch
contours while preserving semantic identity across responsive projections.

## Requirements

### Requirement: Score variation is deterministic within a session
The Procedural Score Composer SHALL derive all motif and pitch-contour selection from a versioned session seed and stable semantic identifiers and SHALL NOT use `Math.random()`.

#### Scenario: The same session reloads
- **WHEN** the same composer version, session seed, chapter ID, and slot set are composed again
- **THEN** the semantic motif IDs, durations, pitches, and slot assignments are identical

#### Scenario: A new session is created
- **WHEN** a new session seed is generated
- **THEN** the composer MAY produce a different arrangement but every selected motif and pitch MUST still satisfy the approved grammar and constraints

### Requirement: Composer uses an explicit rhythmic whitelist
The composer SHALL select only approved simple motifs and the six approved beamed motifs and SHALL reject any automatically generated grouping outside that whitelist.

#### Scenario: Three eighth notes are selected as one linked group
- **WHEN** three linked eighth notes occur
- **THEN** the motif is `E8_TRIPLET_3` and carries mandatory triplet bracket and centered `3` metadata

#### Scenario: Mixed sixteenth-eighth-sixteenth is selected
- **WHEN** `S16_E8_S16` is emitted
- **THEN** the model requires one primary beam and separate left/right secondary hooks, not a continuous secondary beam

### Requirement: Composer uses controlled pitch contours and bounds
The landing composer SHALL keep pitches within C4..A5, SHALL favor E4..F5, SHALL use whitelisted contours rather than independently randomizing each note, and SHALL allow no more than two identical consecutive staffSteps.

#### Scenario: A selected contour crosses a landing boundary
- **WHEN** a complete versioned contour can fit in staffSteps `-2..10` after translation
- **THEN** the composer applies the minimum-absolute uniform integer translation to every note, preserves every interval, and never clamps, reflects, reverses, truncates, or independently mutates a note

#### Scenario: A selected contour span cannot fit the landing range
- **WHEN** no uniform integer translation places the complete contour inside staffSteps `-2..10`
- **THEN** the candidate is rejected and the next candidate is evaluated through the same documented deterministic seeded schedule

### Requirement: Composer prevents structural and visual repetition
The composer SHALL prevent adjacent identical motif IDs, SHALL apply density profiles, SHALL keep reserved zones empty, and SHALL restrict terminal slots to calm simple motifs.

#### Scenario: A candidate violates a hard structural constraint
- **WHEN** a candidate would repeat the previous motif, create three identical consecutive pitches, populate a reserved zone, or place a dense motif in a terminal slot
- **THEN** the composer rejects it deterministically without mutating the candidate into a different illegal or unversioned shape

### Requirement: Responsive layouts preserve semantic composition
The `horizontal-enhanced`, `vertical-wide`, `vertical-compact`, and `static`
ScorePath projections SHALL map the same semantic slot IDs to different physical
zones without recomposing or mutating the semantic score. For the same composer
version, session seed, branch, chapter, semantic slots, and configuration, every
mode SHALL preserve motif IDs/order, durations, staffSteps, contour IDs, contour
translations, reserved slots, and key-signature configuration. Only ScorePath
geometry, physical slot ranges, spacing, local notation-zone capacity, and
surrounding scene arrangement may change.

The final 2026-08-24 external human Gate-C decision approves this semantic responsive
contract. That approval does not approve the current validation fixture's
connector curve aesthetic or responsive activation thresholds.

#### Scenario: Responsive projection mode changes
- **WHEN** eligibility or effective capacity switches the layout among `horizontal-enhanced`, `vertical-wide`, `vertical-compact`, or `static` while the same session remains active
- **THEN** the semantic composition remains deeply equal, the seed and active semantic chapter remain unchanged, and only responsive projection ownership and geometric mapping are rebuilt

#### Scenario: Compact projection has less local notation capacity
- **WHEN** a `vertical-compact` projection fits fewer motifs in each local notation-safe span than `horizontal-enhanced`
- **THEN** it distributes the same ordered semantic slots across additional physical notation zones/connectors without deleting motifs, changing pitches, or generating a new score

#### Scenario: Reduced motion selects static projection
- **WHEN** the same semantic score is presented in `static` mode
- **THEN** it retains the same seed, motif IDs, pitches, contour metadata, and semantic slot IDs without depending on horizontal pinning, scrub, or reveal motion

### Requirement: Key signatures are outside procedural variation
The composer SHALL NOT choose, randomize, repeat, or mutate a key signature. Each continuous branch score MAY have at most one explicitly configured key-signature occurrence near its origin.

#### Scenario: The same branch is composed under different seeds
- **WHEN** an explicitly configured key signature is present near the branch origin
- **THEN** it remains unchanged and absent from composer output and selection state for every seed
