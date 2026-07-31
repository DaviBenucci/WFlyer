## Context

See `proposal.md`. ADR-012 resolves the historical asset gate: `svg/wflyer-intro-master.svg` and `svg/wflyer-header-symbol.svg` are approved and checksum-controlled. `SiteExperienceShell` already owns persistent route motion, so Phase 07 must add a sibling focused opening controller without coupling first-load identity to navigation transitions.

## Goals / Non-Goals

**Goals:** isolate eligibility/state/timeline cleanup; preserve server-rendered Home; use the exact SVG IDs and timeline labels; make skip, reduced motion, timeout, and teardown deterministic; reuse approved data attributes for finite local reveals.

**Non-Goals:** redraw paths, animate the narrative clef as a logo, introduce video/audio/particles, persist beyond sessionStorage, replay on internal navigation, or alter the musical application.

## Decisions

### Home-mounted controller with fail-open initial markup

Mount a client controller from the Home page, not the global layout. The overlay is created only after hydration and eligibility resolution, so no-JavaScript can never remain covered. A global controller was rejected because route filtering and replay prevention would become harder to audit.

### Approved SVG as a build-time React asset

Represent the approved master as repo-native SVG markup with unchanged path data/IDs and animate only documented wrappers. A raster, video, external request during playback, or improvised wordmark is forbidden. Hash/geometry tests guard parity.

### One scoped master timeline and idempotent completion

Compose brand formation, handoff, and Home reveal segments under the normative labels in one GSAP context. A single idempotent completion function kills the timeline/deadline, removes locks/listeners, writes the session key, and unmounts the overlay for normal completion, skip, error, or teardown.

### Local reveals remain progressive enhancement

Use a small observer-driven GSAP layer over existing semantic data attributes. Targets render in final state on the server; JavaScript opts them into a short reveal only when safe, preventing invisible content on failure.

## Risks / Trade-offs

- [SVG duplication can drift] → compare IDs and path geometry against the approved master in tests and never edit geometry during animation work.
- [Overlay can trap visitors] → fail-open mounting, visible skip, Escape, hard deadline, idempotent cleanup, and no-JS coverage.
- [Session storage can throw] → wrap reads/writes and treat failure as a completed/final Home state rather than blocking.
- [Intro and route motion could overlap] → intro exists only on first Home hydration and completes before exposing route controls; navigation retains its independent lifecycle.
- [Observers can retain nodes] → disconnect and revert GSAP context on teardown; reduced motion avoids observer animation.

## Migration Plan

Add the controller and guarded local reveal layer, validate official geometry and all recovery paths, then enable it only on Home. Rollback removes the Home mount and reveal hook; the static Home and persistent route shell remain unchanged.
