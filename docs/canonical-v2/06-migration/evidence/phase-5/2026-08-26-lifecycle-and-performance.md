# Phase-5 Lifecycle and Performance Evidence

Date: 2026-08-26

## Ownership

- One master GSAP timeline is owned by the Motion Lab runtime.
- One ScrollTrigger with the stable Phase-5 runtime ID is owned in enhanced
  mode.
- No global `ScrollTrigger.getAll().kill()` cleanup is used.
- Replacement/unmount kills the owned ScrollTrigger with
  `kill(true, true)`, preserving its attached animation, and then kills the
  owned timeline explicitly. This prevents ScrollTrigger's default animation
  kill from double-killing the same timeline.
- A second cleanup call changes neither destroy nor cleanup counts.
- A fresh replacement exposes exactly one trigger and one timeline.
- Development Strict Mode/remount replay has balanced mount, destroy,
  ScrollTrigger-kill, timeline-kill, and cleanup deltas.
- Destroying the current runtime removes its development debug controller, so
  no stale DOM/controller closure remains after unmount.
- Visibility changes retain, rather than recreate, the master timeline.

## Render and scroll behavior

- Scroll progress updates diagnostics through DOM text/data attributes.
- React commit count remains unchanged across scroll frames and input modes.
- Partial native scroll produces partial master progress.
- Wheel and touchmove events remain uncancelled.
- Track translation uses a transform; measured stage and track geometry remains
  invariant throughout the motion test.
- No video or audio enters critical bootstrap.

## Performance gate

The deterministic motion test runs 72 native-scroll samples and verifies:

- no observed long task reaches 50ms where the browser exposes `longtask`;
- Chromium and Firefox rAF p95 remain below the two-frame 34ms headless gate;
- track/stage width and height remain identical before and after traversal;
- no per-frame React render;
- no critical media.

The literal headed Chromium review also dragged the native browser scrollbar
thumb. Progress advanced while the React render count remained unchanged.

Headless WebKit under the video-backed Playwright runner reports scheduler
throttling (approximately 151ms p95 in the diagnostic run). That scheduler
metric is recorded rather than misrepresented as application callback work;
WebKit still passes geometry, resource, accessibility, native-scroll, and
render invariants. Physical-device performance remains a later truthful gate.
