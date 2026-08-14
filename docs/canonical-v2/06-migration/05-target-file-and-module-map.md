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
      motion/
```

## Boundary rules

- `lib/story` and `lib/music` pure logic do not import React/DOM/GSAP unless explicitly in motion integration adapters.
- React components do not contain pitch/ledger/beam/composer algorithms.
- Public scene components consume typed story/content models.
- Debug routes/controllers are unavailable in production.
- Existing contact/deployment modules remain separate.
