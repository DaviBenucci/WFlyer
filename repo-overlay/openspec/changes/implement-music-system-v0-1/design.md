## Context

The repository already has Next.js App Router, React, strict TypeScript, Vitest, Storybook, Playwright, GSAP, and a legacy `src/components/music/` implementation used by the public experience. The approved visual library provides eight SVG glyph candidates with stable names/checksums but intentionally leaves staff-space-relative metrics and semantic anchors unapproved.

The implementation must solve two independent problems without conflating them:

1. engraving geometry: where approved pieces go and how primitives connect;
2. visual procedural composition: which approved motifs/pitches appear for a session.

The public story/landing remains outside this change.

## Goals

- Pure deterministic geometry independent of React/DOM.
- Same geometry model for straight and organically curved staffs.
- Immutable approved glyph paths with explicit calibrated anchors.
- Whitelisted seeded variation that is stable for a browser session.
- Reproducible dev/debug seeds and stress testing.
- Human-gated visual calibration.
- No public landing regression.

## Non-Goals

- General notation-editor correctness.
- Harmony, MIDI, playback, OCR/OMR, transcription, or transposition.
- Final branch Score Path geometry.
- GSAP story integration.
- Public route/content migration.
- Runtime backend or persistence.

## Decisions

### 1. Pure TypeScript model first

`src/lib/music/geometry`, `renderer`, and `composer` do not import React, DOM APIs, or GSAP. React components only transform render models into SVG DOM.

### 2. Local-frame ScorePath geometry

Every score placement uses `P/T/N` from a `ScorePath`. Staff lines are coherent normal offsets of one master guide. Ledger lines extend on `T`; pitch uses `N`. v0.1 supports straight and cubic Bézier paths.

### 3. Approved glyphs are immutable geometry

SVG paths are repository-controlled visual references. Scaling and anchoring are metadata. Calibration never edits path geometry. Source/runtimes remain checksum-traceable.

### 4. Renderer primitives are code-generated

Staff lines, stems, ledger lines, beams/hooks, and barlines are deterministic primitives derived from staff-space tokens. Legacy SVG primitives are not used.

### 5. Option B controls beam-group stems

The entire group determines stem direction using balance around `B4`, farthest-extreme tie-break, then `DOWN` for perfect symmetry.

### 6. Procedural means seeded selection, not free composition

A versioned PRNG selects only whitelisted motifs and pitch contours. No independent random pitches and no non-whitelisted beam grouping are allowed. A new session may differ; the same session remains stable across reload/responsive/theme/reduced-motion changes.

### 7. Key signatures are structural configuration

The composer cannot choose or mutate key signatures. Each continuous branch has at most one key signature near its origin. `fifths=0` means no signature.

### 8. Semantic slots isolate composition from layout

The composer targets stable slot IDs, not pixels. Desktop and mobile may map the same slots to different geometry while preserving the semantic composition.

### 9. Visual Lab is dev-only and human-gated

The lab provides calibration/debug UI but returns 404 in production. Codex can propose draft calibration; only a human reviewer can authorize runtime-approved metrics/anchors.

### 10. Landing integration is a separate future change

Legacy music components remain in place. This change proves the replacement system but does not wire it into the public story.

## Risks / Trade-offs

- **Curved engraving can become visually distorted.** Mitigation: composition zones use gentle local tangents and fixtures explicitly validate curved placement.
- **Session variability can make visual QA nondeterministic.** Mitigation: explicit seed injection and fixed seeded screenshots; no `Math.random()`.
- **Auto-calibrated anchors can be optically wrong.** Mitigation: draft status + human Gate B.
- **A dev-only lab cannot be used in production-build screenshots.** Mitigation: dev-lab evidence plus a separate production 404 assertion; never expose the lab publicly for test convenience.
- **Parallel legacy/new systems temporarily duplicate concepts.** Mitigation: strict isolation and a later controlled landing migration after Gate C.

## Migration Plan

1. Normalize decision register and merge visual-library assets/contracts.
2. Implement pure types, units, vectors, ScorePaths, and geometry tests.
3. Implement glyph registry with pending/draft calibration metadata.
4. Implement renderer models and all whitelisted motif topology.
5. Implement seeded composer and stress tests.
6. Implement dev-only Visual Lab and draft-calibration UI.
7. Reach Gate A.
8. Pause for human Gate B calibration approval.
9. After approved metrics are committed, complete visual/composer evidence for Gate C.
10. Prove public landing unchanged.
11. Validate OpenSpec and update Graphify.
12. Archive only after all tasks and human gates are complete. Landing integration is a separate change.
