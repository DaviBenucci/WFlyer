## ADDED Requirements

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

### Requirement: Composer prevents structural and visual repetition
The composer SHALL prevent adjacent identical motif IDs, SHALL apply density profiles, SHALL keep reserved zones empty, and SHALL restrict terminal slots to calm simple motifs.

### Requirement: Responsive layouts preserve semantic composition
Desktop and mobile Score Path implementations SHALL map the same semantic slot IDs to different geometry without recomposing motif IDs or pitches.

#### Scenario: Viewport crosses the horizontal/vertical breakpoint
- **WHEN** the layout switches while the same session remains active
- **THEN** the semantic composition remains unchanged and only its geometric mapping is recomputed

### Requirement: Key signatures are outside procedural variation
The composer SHALL NOT choose, randomize, repeat, or mutate a key signature. Each continuous branch score MAY have at most one explicitly configured key-signature occurrence near its origin.
