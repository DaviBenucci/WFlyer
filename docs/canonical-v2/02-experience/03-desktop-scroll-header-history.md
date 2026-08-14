# Desktop Scroll, Header Traversal, URL, and History

## Native scroll

- `scrollTop` is the source of truth.
- No global wheel/touch `preventDefault()`.
- No required chapter snapping.
- Trackpad inertia and scrollbar dragging remain native.
- The story uses one master timeline with stable labels.

## Header traversal duration

```text
distance = abs(targetProgress - currentProgress)
duration = clamp(minDuration, minDuration + range * distance, 3.0s)
```

Exact minimum/ease is calibrated in Motion Lab. Maximum is normative: 3.0 seconds.

## Cancellation/supersession

Automated traversal ends immediately on explicit wheel, touch, navigation key, Escape, or a new header target. No corrective snap follows cancellation. A new target recalculates from the current canonical progress.

## History

- passive chapter dominance change: `history.replaceState`;
- successful explicit header traversal: `history.pushState`;
- cancelled traversal: no new entry;
- `popstate`: cancel automation, resolve requested canonical target, restore scroll, derive all visual state.

## Hashes

Hashes represent semantic chapters, not arbitrary pixel offsets. Invalid hashes fall back to Home. A deep link is positioned before intro exit and does not traverse from Home.

## Active chapter

Desktop active chapter is derived from master-story ranges/labels. Header state and hash follow it. React updates are bounded to chapter changes, never every animation frame.
