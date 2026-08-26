# Mobile, Responsive Rebuild, and Reduced Motion

## Vertical semantic order

```text
Home
About
Services
Process
Projects
Contact
Professional final barline / visual transition
Application
How It Works
Benefits
Demonstration
Access W_Flyer
Application final barline
Global footer
```

## Mobile presentation

- no horizontal pinning;
- no required swipe/carousel;
- document/narrative progression is vertical, while musical notation remains
  locally horizontal or gently inclined and reads left-to-right;
- the continuous five-line score uses notation-safe composition zones joined by
  event-free connector zones for vertical displacement;
- no literal vertical staff and no 180-degree-reversed notation groups;
- concise editorial variants;
- normal document scrolling and landmarks;
- application access appears last in application sequence.

## Responsive score presentation modes

### `horizontal-enhanced`

Immersive horizontal story progression for viewports with sufficient effective
width, height, input capability, and motion allowance. It uses long
notation-safe zones, fewer connector turns, and higher local motif capacity.

### `vertical-wide`

Vertical document progression for tablets, narrow desktop windows, low-height
notebooks, and other layouts without sufficient horizontal-story capacity. It
uses medium-length left-to-right notation zones and connectors for vertical
displacement.

### `vertical-compact`

Vertical document progression for narrow layouts. It preserves readable glyph
scale and spacing by shortening notation zones, placing fewer semantic motifs
in each local zone, and using more connectors. It does not rotate notation,
discard semantic motifs, or recompose the score.

### `static`

Vertical functional/reduced-motion fallback using the same semantic score,
seed, motif IDs, pitches, and slot IDs without horizontal pinning, scrub, or
complex reveal motion.

The functional responsive semantics above and
`maxNotationTangentAngleDeg=18` were approved by external Gate-C follow-up
review on 2026-08-24. That approval does not promote the current piecewise
returning connector fixture as the final mobile aesthetic. It remains
validation-only and noncanonical; final organic public geometry is a blocking
Phase-9 human Score Path decision.

## Mode eligibility

Exact activation thresholds are Motion Lab calibration values. Selection must
be capable of considering width, height, pointer/input capability,
`prefers-reduced-motion`, and effective layout capacity; width alone is
insufficient. A wide mobile landscape viewport does not automatically receive
`horizontal-enhanced`, and an insufficient-height desktop may use
`vertical-wide`. Vertical/static presentation remains the universal fallback.

## Semantic composition and physical grouping

Responsive projection can distribute one ordered semantic slot sequence across
different numbers of local notation zones. Smaller capacities add connector
zones rather than deleting motifs, shrinking notation disproportionately, or
generating a different score. Only ScorePath geometry, physical slot ranges,
spacing, local-zone capacity, and surrounding scene arrangement may vary.

## Breakpoint rebuild

```text
RUNNING → FREEZE → CAPTURE ACTIVE CHAPTER → DESTROY OWNED CONTEXT → BUILD NEW MODE → RESTORE EQUIVALENT CHAPTER → RUNNING
```

The semantic score composition and session seed do not change. The transition
preserves the active semantic chapter, slot IDs, motif IDs/order, durations,
staffSteps, contour IDs/translations, reserved slots, and key signature;
destroys only the prior responsive projection ownership; rebuilds geometry; and
restores the equivalent chapter without returning the user to Home.

## Bootstrap positioning seam

Phase-4 bootstrap resolves a semantic `StoryChapterId` before selecting physical
geometry. Its initial projection-positioning adapter targets the native
static/vertical document and is shared by compact, reduced-motion, and failure
recovery paths. The adapter seam must accept later responsive projections
without changing destination precedence, history shape, or Home semantics.

Horizontal projection and responsive rebuild ownership begin in Phase 5. They
are not Phase-4 critical readiness resources. The Phase-9 final score and Home
score geometry are also outside Phase-4 readiness and cannot block bootstrap.

## Reduced motion

- force vertical static mode;
- resolve and position the same valid hash/history/Home destination as the
  full-motion path before reveal;
- use the Phase-4 `0ms` minimum/reveal operational default; this skips the
  opening presentation, not destination/bootstrap semantics;
- no horizontal pinning/scrub requirement;
- score and Persona render final states;
- header navigation uses immediate/short non-narrative positioning;
- no APP-04 autoplay;
- no animated Persona easter eggs;
- all content and controls remain.
