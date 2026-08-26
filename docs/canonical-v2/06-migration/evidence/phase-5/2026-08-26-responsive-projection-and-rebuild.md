# Phase-5 Responsive Projection and Rebuild

Date: 2026-08-26

## Projection signals

Horizontal eligibility consumes all of:

- effective CSS viewport width;
- viewport height;
- effective width/height capacity;
- any fine-pointer capability;
- hover capability;
- reduced-motion preference.

The runtime uses the smaller of layout-viewport and visual-viewport capacity.
At an actual Chromium page scale of 2, the effective visual viewport becomes
768×450 CSS pixels, enhanced ownership is released, and the semantic chapter
is restored in vertical fallback. Firefox and WebKit validate the same
capacity transaction with the deterministic half-CSS-viewport equivalent.

Width is not the sole signal. The concrete Phase-5 values are explicitly
draft Motion-Lab calibration values, not canonical public thresholds.

## Modes

| Mode | Purpose |
|---|---|
| `horizontal-enhanced` | Eligible wide/full-motion native-scroll projection |
| `vertical-wide` | Unsuitable height/aspect/input capacity or driver failure |
| `vertical-compact` | Compact/mobile native document |
| `static` | Reduced motion |

All fallback modes retain the canonical mobile DOM order and native browser
scroll. A forced driver-build failure proves fail-open vertical usability.

## Rebuild transaction

1. Capture the last stable active semantic chapter before viewport mutation.
2. Allow the old ScrollTrigger resize refresh window to settle.
3. Kill only the owned trigger and timeline.
4. Resolve the new multi-signal projection mode.
5. Rebuild measured geometry when enhanced mode remains eligible.
6. Position the captured semantic chapter in the new projection.

Explicit hash/popstate navigation temporarily outranks a concurrent viewport
preservation request. Chromium, Firefox, and WebKit verify this ordering.

## Validated transitions

- horizontal → compact vertical → tall vertical → horizontal;
- desktop full-motion → reduced static → desktop full-motion;
- orientation-shaped 900×1536 geometry;
- a literal `orientationchange` event;
- 200% effective zoom/page scale and restoration;
- compact 390×844 geometry;
- same-document resize plus application deep link;
- forced master-driver failure.

Every transition retains the expected semantic chapter and ends with either
zero owned ScrollTriggers in fallback or exactly one in enhanced mode.
