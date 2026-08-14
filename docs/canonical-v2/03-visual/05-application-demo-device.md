# APP-04 Application Demo Device

## Purpose

Present an approved illustrative application flow without implementing a fake interactive product.

## Structure

```text
ApplicationDemoDevice
  Device shell
  Screen mask
    Poster / video / final frame
    Replay control (only interactive screen control)
  Reflection/shadow
  Optional bounded desktop pointer tilt
```

## State machine

```text
NOT_STARTED
  → PLAYING
  → FINAL_FRAME
  → (Replay) PLAYING

Any load/play failure → ERROR_STATIC
Reduced motion initial state → REDUCED_STATIC
```

## Activation

- Preload/mount/readiness/ScrollTrigger refresh/proximity do not authorize playback.
- Desktop first play starts only when `application-demo` becomes the active master-story chapter.
- Mobile first play starts only when the responsive active-section contract is satisfied and the document is visible.
- Header traversal starts it only when traversal actually reaches the active chapter range.

## Playback

- no audio track/use;
- `muted`, `playsInline`, no loop, no native controls;
- simulated UI receives no focus/click/form interaction;
- leaving active range pauses; return may resume the unfinished first run;
- completion switches to exact static final-frame asset;
- returning after completion remains static;
- replay starts from zero and hides replay/final frame during playback.

## Replay

- top center of tablet screen;
- accessible name;
- pointer, Enter, Space, touch;
- visually a media control, not a competing conversion CTA.

## Reduced motion

No autoplay. Show static approved media and allow explicit replay if the user requests it.

## Pending assets

- WebM;
- MP4;
- poster WebP;
- final-frame WebP.
