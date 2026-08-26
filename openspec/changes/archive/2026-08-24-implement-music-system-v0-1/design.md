## Context

The repository already has Next.js App Router, React, strict TypeScript, Vitest, Storybook, Playwright, GSAP, and a legacy `src/components/music/` implementation used by the public experience. The approved visual library originally provided eight SVG glyph candidates with stable names/checksums while intentionally leaving staff-space-relative metrics and semantic anchors unapproved; those metrics/anchors and the down-flag transform subsequently passed external human Gate-B review on 2026-08-15 without changing glyph geometry.

The implementation must solve two independent problems without conflating them:

1. engraving geometry: where approved pieces go and how primitives connect;
2. visual procedural composition: which approved motifs/pitches appear for a session.

The public story/landing remains outside this change.

## Gate-C review status

The external human review on 2026-08-17 returned **APPROVE WITH TWO NAMED
CHANGES**. At that historical checkpoint the automated evidence and immutable
SVG/snapshot baselines were accepted, while Gate C and task `7.7` still required
both corrections to be implemented, tested, recaptured, and approved:

1. improve triplet-numeral legibility without changing the triplet's semantic
   structure; and
2. replace the literal vertical-staff mobile projection with notation-safe
   left-to-right composition zones joined by event-free connector zones.

That checkpoint did not reopen Gate A or Gate B, did not change any
Gate-B-approved glyph metric/anchor, did not alter any other existing Gate-C
candidate value or Composer weight, and did not authorize landing integration.

The first 2026-08-24 follow-up human review accepted the responsive functional
semantics, approved `maxNotationTangentAngleDeg=18`, and accepted the previously
proposed Gate-C values subject to one final named renderer correction:
`tupletNumeralSizeSp` changes from `0.75` to `0.85`. The four affected triplet
images were then recaptured in the isolated 2026-08-24 evidence bundle.

Final external human review on 2026-08-24 approved the `0.85` result, the exact
reviewed renderer and Composer values, the responsive semantic rules, and the
18-degree limit. This closes Gate C and supplies task `7.7` evidence. The current
returning connector geometry remains a validation-only noncanonical fixture;
final public organic Score Paths still require a separate blocking Phase-9
human review. Public landing integration has not occurred.

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

Every score placement uses `P/T/N` from a `ScorePath`. `P` is the logical master guide coincident with the visible B4/middle staff line (`staffStep 4`), and `N` is explicitly oriented toward increasing pitch independently of path traversal. Staff lines are coherent normal offsets of that guide, including the still-visible middle line. Pitch uses `(staffStep - 4) * (staffSpace / 2)` along `N`; ledger lines extend on `T`. Reversing a branch preserves pitch placement. v0.1 supports straight and cubic Bézier paths.

### 3. Approved glyphs are immutable geometry

SVG paths are repository-controlled visual references. Scaling and anchoring are metadata. Calibration never edits path geometry. Source/runtimes remain checksum-traceable.

### 4. Renderer primitives are code-generated

Staff lines, stems, ledger lines, beams/hooks, and barlines are deterministic primitives derived from staff-space tokens. Legacy SVG primitives are not used.

### 5. Option B controls beam-group stems

The entire group determines stem direction using balance around `B4`, farthest-extreme tie-break, then `DOWN` for perfect symmetry.

### 6. Procedural means seeded selection, not free composition

A versioned PRNG selects only whitelisted motifs and versioned per-length pitch contours. A contour's complete interval vector is immutable: bounds correction uses the minimum-absolute uniform integer translation into `-2..10`, never per-note clamping/reflection/reversal/truncation, and rejects an unfit candidate through a documented deterministic schedule. No independent random pitches and no non-whitelisted beam grouping are allowed. A new session may differ; the same session remains stable across reload/responsive/theme/reduced-motion changes.

### 7. Key signatures are structural configuration

The composer cannot choose or mutate key signatures. Each continuous branch has at most one key signature near its origin. `fifths=0` means no signature.

### 8. Semantic slots isolate composition from layout

The composer targets stable slot IDs, not pixels. Responsive presentation maps
one immutable semantic score into `horizontal-enhanced`, `vertical-wide`,
`vertical-compact`, or `static` projection modes. A mode change may alter
ScorePath geometry, physical slot ranges, spacing, local-zone capacity, and
surrounding scene arrangement, but it does not regenerate or mutate semantic
composition.

### 9. Visual Lab is dev-only and human-gated

The lab provides calibration/debug UI but returns 404 in production. Codex can propose draft calibration; only a human reviewer can authorize runtime-approved metrics/anchors.

### 10. Landing integration is a separate future change

Legacy music components remain in place. This change proves the replacement system but does not wire it into the public story.

### 11. Triplet typography is a renderer concern

`E8_TRIPLET_3` still contains exactly three eighth notes, one primary beam, one
visible bracket, and the numeral `3`. The numeral is centered from the complete
group bounding span, remains external to the beam, uses score
foreground/`currentColor`, and is protected by a split horizontal bracket whose
central gap is:

```text
renderedNumeralWidth + 2 * tupletNumeralSideGapSp
```

The final named Gate-C correction uses:

```text
tupletNumeralSizeSp    = 0.85  # approved 2026-08-24
tupletNumeralSideGapSp = 0.18
```

The follow-up decision accepts and preserves the side gap and existing values:

```text
bracketClearanceSp = 0.65
bracketEndCapSp    = 0.30
bracketThicknessSp = 0.07
```

Final external human optical review on 2026-08-24 approved the `0.85` result and
all five triplet values above after reviewing the four corrected fixtures.

### 12. Responsive ScorePath projection uses zones

Responsive mode selection must be capable of considering viewport width,
viewport height, pointer/input capability, reduced-motion preference, and
effective layout capacity. Exact activation thresholds remain Motion Lab draft
calibration and are outside Gate-C approval.

A physical ScorePath projection distinguishes:

- **notation-safe composition zones**, which are locally horizontal or gently
  inclined, read left-to-right, and may contain musical events; and
- **connector zones**, which preserve all five continuous staff lines while
  providing displacement/turns and contain no musical events.

The final 2026-08-24 external human Gate-C decision approves
`maxNotationTangentAngleDeg = 18` for notation-safe zoning. Exact responsive
mode activation thresholds remain noncanonical Motion Lab calibration.
Notation zones must also reject 180-degree-returning tangents: a returning path
span is a connector, not a reversed notation zone.

The approved treble-clef path stays byte-identical and is always upright,
unmirrored, and aligned through its approved `gLine` anchor inside a
notation-safe origin zone. The terminal final barline stays conventional—thin
vertical bar, gap, thick vertical bar—inside a notation-safe terminal zone.
`normalAt()` continues to point toward increasing pitch independently of path
traversal.

For the same composer version, session seed, branch, chapter, semantic slot, and
configuration, every projection mode preserves motif IDs/order, durations,
staffSteps, contour IDs/translations, reserved slots, and key signature. Resize
destroys/rebuilds only responsive projection ownership and reprojects the same
semantic composition.

The current piecewise returning connector is retained only as a validation
fixture for continuity, safe offsets, event-free connectors, and semantic
equivalence. It is not the final mobile aesthetic and must not be promoted as
the public Score Path. Phase 9 must author `Organic Soft` and `Organic Flowing`
candidates against the real chapter/reserved-zone layouts in both vertical
modes and both themes, then stop for explicit human Score Path approval.

## Risks / Trade-offs

- **Curved engraving can become visually distorted.** Mitigation: composition zones use gentle local tangents and fixtures explicitly validate curved placement.
- **Session variability can make visual QA nondeterministic.** Mitigation: explicit seed injection and fixed seeded screenshots; no `Math.random()`.
- **Auto-calibrated anchors can be optically wrong.** Mitigation: draft status + human Gate B.
- **A dev-only lab cannot be used in production-build screenshots.** Mitigation: dev-lab evidence plus a separate production 404 assertion; never expose the lab publicly for test convenience.
- **Escaped lab routes can leave differently encoded Next.js dev/production route declarations.** Mitigation: keep production `.next/types` in the standalone TypeScript program and exclude only generated `.next/dev/types`, matching Next's production stale-dev filtering.
- **Parallel legacy/new systems temporarily duplicate concepts.** Mitigation: strict isolation and a later controlled landing migration after Gate C.
- **A vertical document can be mistaken for vertically rotated notation.**
  Mitigation: explicit notation-safe and connector zones; musical events are
  emitted only on left-to-right spans within the approved 18-degree tangent
  limit.
- **The triplet bracket can obscure a small numeral.** Mitigation: size the
  numeral with a staff-space token and split the bracket using the rendered
  numeral width plus two explicit side gaps.

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
10. Apply the two named 2026-08-17 Gate-C corrections, then apply the final
    2026-08-24 numeral-size correction, recapture only the four affected
    triplet fixtures, and record final external human approval.
11. Prove public landing unchanged.
12. Validate OpenSpec and update Graphify.
13. Archive after all tasks, human gates, evidence authority, and strict
    validation are complete. Landing integration is a separate change.
