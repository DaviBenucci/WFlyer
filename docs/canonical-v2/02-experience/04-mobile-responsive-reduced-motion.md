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
- score becomes a gentle vertical/serpentine thread;
- concise editorial variants;
- normal document scrolling and landmarks;
- application access appears last in application sequence.

## Horizontal eligibility

Exact thresholds are calibration values. Eligibility considers width, height, motion preference, and interaction context; width alone is insufficient. Vertical mode is universal fallback.

## Breakpoint rebuild

```text
RUNNING → FREEZE → CAPTURE ACTIVE CHAPTER → DESTROY OWNED CONTEXT → BUILD NEW MODE → RESTORE EQUIVALENT CHAPTER → RUNNING
```

The semantic score composition and session seed do not change.

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
