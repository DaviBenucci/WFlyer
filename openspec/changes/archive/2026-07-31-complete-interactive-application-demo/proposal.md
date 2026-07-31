## Why

The Application page still presents a static tablet even though the approved Phase 06 contract requires a real, keyboard-operable DOM demonstration. Completing the local deterministic interaction now closes that implementation gap without importing any behavior from the musical application.

## What Changes

- Replace the static Application preview with an interactive `ApplicationDemoTablet` built from semantic HTML and original SVG.
- Add local instrument and key controls, deterministic configured/processing/result/reset states, and a visibly illustrative result.
- Add bounded pointer tilt using GSAP only for precise-hover devices, with focus, visibility, viewport, and reduced-motion safeguards.
- Add unit, Storybook, browser, accessibility, privacy, responsive, and visual evidence coverage for the required tablet states.
- Update Phase 06 execution evidence and acceptance documentation.
- Keep uploads, OCR/OMR, real transposition, authentication, persistence, network access, and changes to `app.wflyer.com.br` out of scope.

## Capabilities

### New Capabilities

- `interactive-application-demo`: Covers the semantic tablet interface, deterministic local state machine, accessibility, privacy, bounded motion, responsiveness, and required evidence states.

### Modified Capabilities

None.

## Impact

- Affects the `/aplicacao-wflyer` hero visual, focused tablet component styles and tests, Storybook coverage, Playwright suites, and Phase 06 evidence/documentation.
- Uses existing React, GSAP, `@gsap/react`, design tokens, and local content; adds no runtime dependency, endpoint, storage, or external integration.
- Normative sources remain `docs/03-motion/08-tablet-interativo.md`, ADR-016, product and QA requirements, and the approved Application desktop-light golden reference.
- Rollback is limited to restoring the static `ApplicationPreview` and removing the focused tablet files/tests; no data migration or external rollback is required.
- Verified: the current page uses a static HTML/SVG preview and the approved reference requires a DOM tablet. Inference: a focused component boundary is the smallest maintainable implementation. Pending: implementation and proportional validation.
