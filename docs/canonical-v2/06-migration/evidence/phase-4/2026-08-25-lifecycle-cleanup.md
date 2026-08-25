# Lifecycle and Cleanup Evidence

## Owned resources

- hard-deadline and semantic-navigation timers;
- critical and lifecycle `AbortController` instances;
- two-frame adapter stabilization handles;
- one serialized/cancelable active positioning request;
- `keydown`, `hashchange`, `popstate`, `resize`, `orientationchange`, and
  `visibilitychange` listeners;
- reduced-motion media-query listener;
- temporary document scroll behavior;
- temporary `history.scrollRestoration = "manual"` ownership;
- exact snapshots of underlying `inert` and `aria-hidden` attributes;
- body overflow and root active marker;
- development-only debug trace.

## Cleanup rules

- Every release path is idempotent.
- Original attribute values and priorities are restored rather than assumed.
- Focus moves to `main#main-content` only when the removed intro Skip control
  owned focus.
- Timers and pending frames are canceled on abort/unmount.
- Hash and popstate events from one browser action are coalesced.
- One same-chapter interrupt reuses the active positioning promise; a changed or
  fail-open request aborts and supersedes its predecessor.
- The completed ref prevents a completed lifecycle effect from reacquiring boot
  locks.
- No global GSAP cleanup and no global wheel/touch interception exist.

Component tests cover Strict Mode setup/cleanup symmetry, listener add/remove
counts, media-query cleanup, skip/Escape, focus restoration, session-repeat,
timeout boundaries, hidden-tab return, missing-symbol/critical and noncritical
failures, single positioning ownership, recovery-adapter use, and history-event
coalescing. The real same-session reload is browser-tested. Strict Mode covers
development effect replay/remount behavior; literal Fast Refresh tooling is not
claimed as a separate automated test. The aggregate unit project passed
600/600 tests.
