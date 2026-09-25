# Target Frontend Architecture

## Major modules

```text
src/lib/story/
  model, labels, progress, destination/history, readiness,
  projection-positioning adapter, responsive mode

src/lib/music/
  geometry, glyphs, renderer, composer

src/lib/motion/
  ownership, lifecycle, traversal, later master-story integration

src/components/story/
  StoryStage, StoryTrack, ChapterSection, BranchTerminal

src/components/story-bootstrap/
  StoryBootstrapExperience, intro overlay, owned interaction locks

src/components/score/
  ScoreSvg, ScoreGlyph, ScoreDebugOverlay

src/components/persona/
  PersonaRig, PersonaEasterEggController
```

Exact placement may adapt to repository conventions, but pure story/music models must not be embedded inside React components.

## State ownership

Canonical:

```text
native scroll → story progress → timeline/active chapter/hash/header
```

Local UI state:

- Contact form;
- mobile menu;
- theme;
- Persona optional controller.

No duplicate route/animation/scroll authority.

## Bootstrap and projection boundary

Phase-4 bootstrap resolves only a typed semantic `StoryChapterId`. A
projection-positioning adapter converts that destination to current physical
geometry. The initial adapter targets the native static/vertical story; it does
not calculate a future horizontal timeline, import GSAP, or hard-code Home as a
midpoint/progress value.

Phase 5 owns the master story timeline and horizontal progressive enhancement.
It may supply a new adapter implementation while preserving the Phase-4
readiness, destination, and versioned history contracts. The Phase-9 final
Home/continuous score is likewise outside bootstrap readiness.

The Phase-4 composition surface is the development-only
`/__visual-lab/story/bootstrap` route. It must be unavailable in production.
The public `/` remains the legacy rollback baseline until the approved cutover;
Phase 4 does not mount the new bootstrap experience there.

## Detailed routes

Detailed pages remain server-renderable independent surfaces. The immersive landing does not replace route content or legal pages.

## Migration pattern

The portfolio-only successor retains the development labs needed for validation,
but the public and lab story compositions share the same Home → Professional
topology. Removed institutional Application modules are not compatibility
surfaces.
