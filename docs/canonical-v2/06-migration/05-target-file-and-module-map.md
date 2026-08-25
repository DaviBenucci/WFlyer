# Target File and Module Map

Suggested target; adapt only when repository conventions justify it.

```text
src/
  lib/
    story/
      types.ts
      manifest.ts
      progress.ts
      active-chapter.ts
      hashes.ts
      history.ts
      responsive-mode.ts
      readiness.ts
      bootstrap/
        destination.ts
        history.ts
        positioning.ts
        readiness.ts
        timing.ts
    music/
      geometry/
      glyphs/
      renderer/
      composer/
    motion/
      ownership.ts
      master-story.ts
      header-traversal.ts
      cleanup.ts
  components/
    story/
      StoryExperienceShell.tsx
      StoryStage.tsx
      StoryTrack.tsx
      StoryChapter.tsx
      BranchTerminal.tsx
    story-bootstrap/
      StoryBootstrapExperience.tsx
      story-bootstrap.module.css
    score/
      ScoreSvg.tsx
      ScoreGlyph.tsx
      ContinuousBranchScore.tsx
      ScoreDebugOverlay.tsx
    persona/
      PersonaRig.tsx
      PersonaEasterEggController.tsx
    projects/
      ProjectCardFan.tsx
      ProjectCard.tsx
    pages/application-demo/
      ApplicationDemoDevice.tsx
  app/
    __visual-lab/
      music/
      story/
        bootstrap/
      motion/
```

## Boundary rules

- `lib/story` and `lib/music` pure logic do not import React/DOM/GSAP unless explicitly in motion integration adapters.
- React components do not contain pitch/ledger/beam/composer algorithms.
- Public scene components consume typed story/content models.
- Bootstrap resolves typed semantic destinations independently from physical
  projection; `positioning.ts` is the adapter seam for Phase-5 motion.
- Phase-4 bootstrap must not require the Phase-5 master timeline or Phase-9
  final score, and must not hard-code Home geometry.
- Debug routes/controllers are unavailable in production.
- `__visual-lab/story/bootstrap` is the only Phase-4 composition surface; the
  public `/` remains on the legacy controller until approved cutover.
- Existing contact/deployment modules remain separate.
