## Why

The approved official brand opening and page-local reveal catalog remain the first unimplemented experience layer after Phase 06. Completing them now provides the intended first-session identity while preserving an immediately rendered, recoverable Home.

## What Changes

- Add a Home-only, once-per-session brand opening using the approved immutable SVG geometry and the normative 5.600-second GSAP timeline.
- Add a real skip button, Escape behavior, reduced-motion shortcut, safe timeout/error/visibility/orientation fallbacks, scroll and interaction release, and final-state handoff.
- Add coordinated local reveals for approved hero, card, note, score, and final-barline elements without changing navigation semantics.
- Add deterministic unit, Storybook, motion, accessibility, visual checkpoint, performance, and cleanup coverage.
- Keep video, raster logo reconstruction, particle libraries, audio, infinite animation, and changes to the musical application out of scope.

## Capabilities

### New Capabilities

- `brand-opening-motion`: Covers first-session eligibility, official vector choreography, accessible skip/reduced motion, final-state handoff, recovery, and local reveal constraints.

### Modified Capabilities

None.

## Impact

- Affects the root experience composition, Home presentation hooks, focused brand-intro and local-reveal modules, tests, evidence, and Phase 07 documentation.
- Uses existing GSAP, `@gsap/react`, sessionStorage, approved local SVGs, motion tokens, and the persistent experience shell; adds no dependency or endpoint.
- Normative sources include ADR-012, the asset manifest/checksums, `06-animacao-entrada-marca.*`, motion catalog, accessibility/performance contracts, and approved Home references.
- Rollback removes the intro controller and local reveal hooks; server-rendered Home, header, links, and navigation remain available.
