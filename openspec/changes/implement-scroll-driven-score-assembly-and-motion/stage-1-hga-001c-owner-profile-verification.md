# HGA-001C — owner small-desktop profile verification

```text
OWNER_SMALL_DESKTOP_VERIFICATION=FAIL
FIREFOX_OWNER_PROFILE=FAIL
CHROMIUM_OWNER_PROFILE=FAIL
FIREFOX_MODE=vertical-wide
CHROMIUM_MODE=vertical-wide
FIREFOX_PRESENTATION_CLASS=desktop
CHROMIUM_PRESENTATION_CLASS=desktop
CHROMIUM_LAYOUT_VIEWPORT_AUTHORITY=layout/root width for rendered score; minimum client/visual width for runtime eligibility and Projects candidate
CHROMIUM_VISUAL_VIEWPORT_DIFFERENCE=owner-measured visual width approximately 15px narrower; headless difference not reproduced; decision-inert at 639px height
GLOBAL_OVERFLOW=PASS; none observed in either profile
CONTENT_CLIPPING=FAIL; focused Projects card metadata is covered by the sticky header
FOCUS_CLIPPING=FAIL; complete Projects focus outline cannot fit below the header
STAFF_TEXT_COLLISION=NO_VISIBLE_TEXT_OBSCURATION_IN_REVIEWED_STATES; conservative box contacts recorded
HGA_001A_REGRESSION=PASS
OWNER_PROFILE_EVIDENCE_PATH=openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-hga-001c-evidence/owner-small-desktop/verification.json
HGA_001C_STATUS=BLOCKED
HGA_002_STATUS=PENDING
HUMAN_GEOMETRY_APPROVAL=PENDING
```

The earlier 1366×768 Motion Lab result remains valid for that **layout
viewport**. The owner's physical 1366×768 notebook instead exposes 1366×611
in Firefox and 1366×639 in Chromium at 100% zoom, DPR 1 and GNOME text scale
1. Those owner-reported measurements are preserved in the
[structured record](stage-1-hga-001c-evidence/owner-small-desktop/verification.json).
The six linked screenshots use deterministic Playwright viewports with those
layout dimensions, not a claim of a new physical-device capture.

Both engines kept fine-pointer desktop input, `vertical-wide` story mode,
desktop presentation and `vertical-wide` score projection. The runtime reason
was `insufficient-layout-capacity`: both viewport heights are below the
existing 640px horizontal minimum. The Projects capacity diagnostic attribute
was absent in these runs because the coarse eligibility decision already
selects vertical mode; that absence is not a capacity failure or an acceptance
condition. Header links stayed inside the viewport, the six story chapters
remained scrollable, About/Services/Process/Projects/Contact had no unintended
global horizontal overflow, and Contact name/message controls accepted visible
focus. An independent check of all five complete 1,025-point Professional
staff lines found zero self-intersections in both engines; the focused HGA-001A
unit regression passed 2/2.

The blocking failure is the selected fallback's Projects focus state:

| Engine | Viewport height | Header bottom | Focused card top–bottom | Card height | Available below header |
| --- | ---: | ---: | ---: | ---: | ---: |
| Firefox | 611px | 77px | 2.83–644.98px | 642.15px | 534px |
| Chromium | 639px | 77px | 16.51–658.53px | 642.02px | 562px |

The card is taller than the usable viewport in each engine. After focus and
settled positioning, its upper border, focus outline and top status/position
metadata remain under the sticky header; its bottom extends past the viewport.
The active element is still the first Projects link and native scrolling
remains available, but the whole focus treatment cannot be visible together.
This is a stable selected-mode presentation failure, not a transient DOM
measurement or a reason to force `horizontal-enhanced`. The screenshots show
the actual occlusion. No card dimension, fan interaction, Projects capacity or
clearance rule was changed in this verification.

Home's complete reading envelope initially ends at 639.90px in Firefox and
639.81px in Chromium, respectively 28.90px and 0.81px below the fold. The
content remains reachable by native scroll, so this is an entry-composition
limitation rather than permanently hidden text. Services and Process cards
remain readable when scrolled into view. Conservative staff-versus-element
bounding-box checks touch the Home reading envelope and opaque card/stage
boxes, but the reviewed captures show no musical line obscuring required text;
paint order places chapter content above the score. The bounded verification
does not reinterpret those broad box contacts as a glyph intersection.

Chromium width authority was checked against the owner's observation. The
runtime reads `min(document.documentElement.clientWidth,
visualViewport.width)` for eligibility; the Projects candidate also includes
the rendered root width; the score uses the rendered root width for its layout
geometry. Headless Chromium reported 1366px for both layout and visual width,
whereas the owner measured a visual width near 1351px. A separate test-only
1351px visual-width probe still selected `vertical-wide`/desktop at 639px
height. This proves no mode/presentation decision conflict at these profiles;
it does not claim to reproduce the physical scrollbar or the owner's exact
rendered-root width. No viewport authority was changed.

| Capture | Review state |
| --- | --- |
| [Firefox Home](stage-1-hga-001c-evidence/owner-small-desktop/firefox-1366x611-home.png) | Entry composition and below-fold reading envelope |
| [Firefox Projects focus](stage-1-hga-001c-evidence/owner-small-desktop/firefox-1366x611-projects-focus.png) | Focus/card header occlusion |
| [Firefox Contact](stage-1-hga-001c-evidence/owner-small-desktop/firefox-1366x611-contact.png) | Two-column terminal/form layout |
| [Chromium Home](stage-1-hga-001c-evidence/owner-small-desktop/chromium-1366x639-home.png) | Entry composition |
| [Chromium Projects focus](stage-1-hga-001c-evidence/owner-small-desktop/chromium-1366x639-projects-focus.png) | Focus/card header occlusion |
| [Chromium Contact](stage-1-hga-001c-evidence/owner-small-desktop/chromium-1366x639-contact.png) | Two-column terminal/form layout |

The already-running development server lacked the public Turnstile test key,
so its Contact screenshot shows the verification-unavailable state. Form
submission/provider availability was outside this geometry check; the input
and textarea focus bounds were measured. The original 11 HGA-001C captures
were not regenerated.

No product, ADR, responsive policy, Projects, HGA-002, public route, or
historical evidence change was made. The exact-viewport HGA-001C patch remains
implemented, but owner-device review is blocked until a separately bounded
decision addresses the short-height Projects focus. The Home entry composition
remains documented for owner review.
Task 5.6 and Human Geometry Approval remain pending. No Geometry Refreeze,
Assembly, GSAP integration, Stage 2+, commit, push or deploy occurred.
