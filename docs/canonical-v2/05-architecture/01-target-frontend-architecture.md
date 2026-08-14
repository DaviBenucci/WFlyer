# Target Frontend Architecture

## Major modules

```text
src/lib/story/
  model, labels, progress, hash/history, responsive mode

src/lib/music/
  geometry, glyphs, renderer, composer

src/lib/motion/
  ownership, lifecycle, traversal, readiness

src/components/story/
  StoryStage, StoryTrack, ChapterSection, BranchTerminal

src/components/score/
  ScoreSvg, ScoreGlyph, ScoreDebugOverlay

src/components/persona/
  PersonaRig, PersonaEasterEggController

src/components/pages/application-demo/
  ApplicationDemoDevice
```

Exact placement may adapt to repository conventions, but pure story/music models must not be embedded inside React components.

## State ownership

Canonical:

```text
native scroll → story progress → timeline/active chapter/hash/header
```

Local UI state:

- Contact form;
- demo state machine;
- mobile menu;
- theme;
- Persona optional controller.

No duplicate route/animation/scroll authority.

## Detailed routes

Detailed pages remain server-renderable independent surfaces. The immersive landing does not replace route content or legal pages.

## Migration pattern

Build v2 in parallel/dev lab, validate, cut over `/`, then remove legacy components after rollback evidence.
