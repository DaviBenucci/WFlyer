# Intro, Bootstrap, Deep Links, and Recovery

## State machine

```text
INITIAL
  → WAITING_CRITICAL
  → RESOLVING_DESTINATION
  → POSITIONING
  → READY_TO_REVEAL
  → REVEALING
  → REVEALED

any nonterminal state + critical failure/timeout/recovery condition
  → best-effort semantic positioning
  → DEGRADED (functional vertical content revealed)
```

This is the Phase-4 expansion of the original shorthand:

- `BOOTING` maps to `INITIAL`, `WAITING_CRITICAL`, and
  `RESOLVING_DESTINATION`;
- `POSITIONING` remains explicit;
- `INTRO_EXIT` maps to `READY_TO_REVEAL` and `REVEALING`;
- `STORY_READY` maps to `REVEALED`;
- `FAIL_OPEN_VERTICAL_READY` maps to `DEGRADED`.

Critical readiness in Phase 4 includes base CSS and the static semantic story
DOM/model, a critical font or its documented fallback, the approved opening
mark, the destination resolver, the projection-positioning adapter, and stable
or best-effort initial target positioning.

The Phase-5 master story timeline, horizontal projection, ScrollTrigger
ownership, and the Phase-9 final Home/continuous score are not Phase-4 critical
resources and must not delay reveal. Phase 4 validates their integration seam
through a native static/vertical positioning adapter; it does not construct or
simulate those later systems.

Noncritical video, distant project media, Persona easter-egg variants,
detailed-page media, and other progressive assets do not block readiness.

## Initial target precedence

1. valid landing hash;
2. reliable, validated history restoration;
3. Home.

Landing hashes are accepted only through the story manifest hash allowlist. A
nonempty invalid hash resolves directly to Home, does not consult history, and
does not mutate or remove the invalid URL fragment. History restoration accepts
all 13 typed `StoryChapterId` values from this versioned, namespaced envelope:

```ts
history.state.__wflyerStoryV2 = {
  version: 1,
  chapterId: StoryChapterId,
};
```

The envelope stores semantic identity only: no pixel/progress offset, hash, or
physical projection data. Writes preserve all foreign and Next.js-owned
`history.state` fields. Initial bootstrap may merge or refresh this envelope on
the current entry with `replaceState` only after stable or best-effort
positioning. It never calls `pushState`, never appends an entry, and never
rewrites pathname, search, or hash. A `popstate` positions its validated
semantic destination without mutating history.

The target is positioned behind the overlay before it exits. A positioning
adapter owns the physical projection; the resolver and history contract remain
projection-independent. Home is a semantic origin, never a hard-coded midpoint
or pixel/progress constant.

## Timing policy

- normal first-session minimum visual duration: `1500ms`;
- normal reveal transition duration: `280ms`;
- reduced-motion or already-completed-session minimum/reveal duration: `0ms`;
- owner-normalized hard fail-open timeout: `5000ms` from bootstrap start;
- no fixed timeout is allowed to impersonate readiness.

The `1500ms`, `280ms`, and `0ms` values are exact Phase-4 operational defaults,
but remain tunable and non-final pending later human motion calibration. The
`5000ms` timeout is the owner-normalized Phase-4 safety bound: expiry supersedes
the visual minimum/transition, applies best-effort positioning, releases every
interaction lock, and enters `DEGRADED` immediately.

## Once per session

The opening remains session-bounded and skippable through its visible skip
control and Escape. Direct detailed routes do not need the landing opening.
Reduced motion and an already-completed session still resolve and position the
same semantic destination before applying the final state directly; they skip
only the presentation, not bootstrap semantics.

During Phase 4 this flow exists only at the development-only
`/__visual-lab/story/bootstrap` surface. The public `/` continues to use the
legacy landing until its later approved cutover.

## Failure cases

Missing critical asset, adapter/measurement error, hidden tab,
resize/orientation, timeout, skip, Escape, or teardown must release locks,
restore interaction, clean owned listeners/timers/frames, and reveal functional
content. A Phase-5 GSAP failure must later enter the same fail-open contract,
but GSAP is not a Phase-4 bootstrap dependency.
