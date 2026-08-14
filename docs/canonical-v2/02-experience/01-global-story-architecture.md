# Global Story Architecture

## Desktop topology

```text
[APP TERMINAL] — [ACCESS] — [DEMO] — [BENEFITS] — [HOW] — [APPLICATION] — [HOME] — [ABOUT] — [SERVICES] — [PROCESS] — [PROJECTS] — [CONTACT] — [PRO TERMINAL]
```

The browser scroll axis remains vertical. An eligible desktop viewport pins the story stage and maps normalized native scroll progress to horizontal track movement and one GSAP master timeline.

## Canonical progress

```text
native scrollTop
  → normalized storyProgress
  → horizontal track transform
  → master timeline progress
  → active chapter
  → header state
  → score reveal
  → hash/history state
```

React state is not updated every frame. The active chapter may update only at bounded semantic transitions.

## Home position

Home progress is calculated from actual application/professional branch lengths. It is not hardcoded to 0.5.

## Progressive enhancement

If horizontal mode is ineligible or motion fails, render the vertical semantic story. Content, links, form, replay, and detailed routes remain functional.
