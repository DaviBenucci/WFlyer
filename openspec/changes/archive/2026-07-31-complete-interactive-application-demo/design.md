## Context

See `proposal.md` for motivation. The current `ApplicationPreview` is static markup inside the page archetype module. ADR-016 and `docs/03-motion/08-tablet-interativo.md` require a local DOM demonstration, bounded CSS 3D depth, and GSAP-managed interaction cleanup. The approved Application desktop-light golden controls composition and density; its musical screenshot content is reference-only and cannot be shipped.

## Goals / Non-Goals

**Goals:**

- Isolate the client-side state machine and motion lifecycle in a focused Application demo component while keeping the route a server component.
- Keep all display options and result variants local, typed, deterministic, and explicitly illustrative.
- Make semantic behavior testable independently from presentation and motion.
- Preserve the existing hero and benefit-strip composition across light, dark, tablet, and mobile layouts.

**Non-Goals:**

- Reproduce the musical application, interpret notation, or provide a musically authoritative result.
- Add endpoints, persistence, analytics, upload controls, dependencies, or any change under `app.wflyer.com.br`.
- Flatten the tablet or score into a raster production asset.

## Decisions

### Focused client boundary

Create a dedicated `ApplicationDemoTablet` client component and CSS module, exported through the pages barrel. The route and surrounding chapter remain server-rendered. This avoids turning the entire page into a client component and keeps the behavior boundary explicit. Keeping the interaction in the existing monolithic archetype file was rejected because its timer, event, and motion lifecycle would obscure unrelated page blocks.

### Explicit reducer-like state transitions with controlled native fields

Use typed local option tables and controlled `<select>` elements. A compact state value records `idle`, `configured`, `processing`, `result`, or `reset`; a ref owns the sole timeout and cleanup clears it. The score variant is derived from completed local selections, not computed from music rules. An opaque async abstraction was rejected because the fixed local transition is easier to audit for privacy and teardown.

### Original SVG score grammar

Render a small original staff-and-note SVG whose note emphasis changes in the result state using shape, outline, label, and translation—not color alone. Existing PNG references remain QA inputs only. Reusing a screenshot crop was rejected by the visual-source policy.

### Scoped GSAP pointer lifecycle

Use `useGSAP` with a component scope, `contextSafe` event handlers, bounded `quickTo` setters, a precise-hover media query, viewport observation, focus reset, and `visibilitychange` reset. CSS supplies the resting transform and disables transforms for mobile/reduced motion. This follows ADR-016 and current `@gsap/react` cleanup guidance. CSS-only pointer tracking was rejected because the normative ADR requires coordinated GSAP lifecycle management.

### Acceptance split

Vitest covers states, cleanup, labels, and reset. Storybook supplies stable component states. Playwright covers the end-to-end journey, keyboard/accessibility contract, no-network/no-storage privacy assertions, breakpoints, reduced motion, and seven visual evidence captures. Existing full gates remain regression protection.

## Risks / Trade-offs

- [A decorative 3D shell can reduce legibility] → Reset tilt on focus, cap each axis, keep the screen plane internally stable, and disable tilt for reduced motion/mobile.
- [Timers can update an unmounted component] → Store one timeout ID, clear it before reuse and in Effect teardown, and test unmount during processing.
- [Live regions can announce duplicate status] → Keep a single persistent polite status node and change its text once per completed transition.
- [Visual reference contains misleading real-app detail] → Reproduce only proportion, hierarchy, and density with original SVG and explicit illustrative copy.
- [Client hydration could shift the hero] → Give the shell stable CSS dimensions and render the initial DOM identically before effects attach.

## Migration Plan

1. Introduce the focused component and tests while retaining the existing export name only until the route switches.
2. Replace the static hero visual import and remove obsolete preview styles after targeted tests pass.
3. Run the Phase 06 evidence and full proportional gates, update execution records, sync the new capability spec, and archive the change.
4. Roll back by restoring `ApplicationPreview` and removing the focused files; no persisted state, API, or data migration exists.
