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

## Semantic header manifest

Header order is explicit and independent of physical X position, active
progress, timeline order, or branch direction:

```text
Aplicação → Como funciona → Benefícios → Lançamento
W_Flyer / Home
Sobre → Serviços → Processo → Projetos → Contato
```

Demonstration remains in the master story but is intentionally absent from the
header. `Lançamento` resolves the stable final Application content chapter and
its current `PRELAUNCH` scene. Adding these semantic targets changes neither
native-scroll traversal ownership nor timing/history/cancellation policy.

## Cancellation/supersession

Automated traversal ends immediately on explicit wheel, touch, navigation key, Escape, or a new header target. No corrective snap follows cancellation. A new target recalculates from the current canonical progress.

## History

History stores semantic identity in a typed, namespaced envelope and never
stores a pixel offset, progress value, hash copy, or physical projection:

```ts
history.state.__wflyerStoryV2 = {
  version: 1,
  chapterId: StoryChapterId,
};
```

Every write preserves foreign and Next.js-owned `history.state` fields.

Phase-4 initial bootstrap may merge or refresh the validated envelope on the
current entry with `history.replaceState` after stable or best-effort
positioning. It never calls `pushState`, appends an entry, or rewrites the
current pathname, search, or hash. `popstate` validates the envelope, resolves
the semantic destination through the current projection adapter, and positions
without any history mutation.

Phase 6 owns the later story-navigation policy:

- passive chapter dominance change: `history.replaceState`;
- successful explicit header traversal: `history.pushState`;
- cancelled traversal: no new entry;
- `popstate`: cancel automation, resolve requested canonical target, restore
  scroll, derive all visual state, and add no entry.

## Hashes

Hashes represent semantic chapters, not arbitrary pixel offsets, and are
accepted only through the story manifest allowlist. A valid explicit landing
hash outranks history restoration. A nonempty invalid hash falls directly back
to Home without consulting history or mutating/removing that URL fragment. A
deep link is positioned behind the overlay through the current projection
adapter before intro exit and does not visibly traverse from Home.

## Active chapter

Desktop active chapter is derived from master-story ranges/labels. Header state and hash follow it. React updates are bounded to chapter changes, never every animation frame.
