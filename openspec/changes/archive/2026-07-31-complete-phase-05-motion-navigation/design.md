## Context

See `proposal.md` for motivation and verified baseline. Static pages already
provide real links, semantic route metadata, a typed chapter manifest, local SVG
scores, and focus targets. The App Router currently replaces route content with
no persistent navigation lifecycle.

The implementation must follow the approved motion architecture, reduced-motion
contract, performance budget, double-score ADR, chapter manifest, and acceptance
criteria cited in the proposal. Current Next.js, React, and GSAP lifecycle
guidance confirms that persistent client layout state must read `usePathname`,
router requests use `useRouter`, and animation callbacks/listeners require scoped
cleanup.

## Goals / Non-Goals

**Goals:**

- keep topology, link eligibility, lifecycle state, DOM measurement, and GSAP
  execution independently testable;
- keep only the smallest persistent client boundary around shared chrome and
  route content;
- treat native navigation as the durable fallback and decorative animation as
  disposable enhancement;
- expose deterministic visual checkpoints only in non-production tests.

**Non-Goals:**

- create a general animation framework, global store, or second router;
- animate auxiliary routes as main chapters;
- duplicate route DOM, use screenshots/canvas/WebGL, or deform scores
  continuously from pointer input;
- implement work assigned to Phases 06–09.

## Decisions

1. **Manifest-derived pure topology.** A focused `src/lib/motion/` module maps
   normalized pathnames through `scoreChapterByPath` and returns mode, direction,
   coordinate delta, endpoints, and neutral reason. URL relationships are not
   duplicated in timelines. Alternative rejected: derive topology from link
   placement or pathname string patterns, which would diverge from the manifest.
2. **One persistent client coordinator.** `RootLayout` retains server-rendered
   metadata and places header, transition layer, route slot, and footer inside a
   `SiteExperienceShell`. The shell owns transient lifecycle state; route pages
   remain server components and render their own score. Alternative rejected: a
   client wrapper per page, which cannot coordinate unmount/mount cleanly.
3. **Explicit cancelable lifecycle.** The state model is `idle → preparing →
   outgoing → navigating → incoming → settling`, with `recovering` available
   from every active state. A monotonic request id invalidates stale callbacks,
   and only one pending destination is retained. Cleanup is idempotent.
4. **Conservative capture-phase eligibility.** The shell delegates from one
   document click listener and evaluates button, modifier keys, target,
   download, origin, hash, current URL, and manifest membership before calling
   `preventDefault`. Existing anchors remain the no-JavaScript fallback.
5. **Truthful early route request.** Source geometry is captured synchronously;
   the App Router request starts within the 100 ms preparation budget. The URL is
   never changed to Home for a branch pivot. `usePathname` is the commit signal;
   Back/Forward is identified by `popstate` and never calls `push` again.
6. **Measured anchors with deterministic fallback.** Source geometry is retained
   before route replacement, while the incoming anchor is measured after commit.
   If either anchor is unavailable, manifest anchor ratios and viewport edges
   supply bounded deterministic geometry; if rendering still fails, use neutral
   replacement.
7. **Scoped GSAP only.** `@gsap/react` registers once in the motion module.
   Dynamic callbacks execute through `contextSafe`; each request owns one
   timeline and one safety timer, both killed/cleared during recovery or
   supersession. No ScrollTrigger is required for route transitions.
8. **Decorative DOM SVG overlay.** A fixed, `aria-hidden`, pointer-transparent
   layer renders at most two deterministic paths and eight notes. It derives
   colors from existing CSS properties and animates only transform, opacity, and
   stroke dash values. It never locks document scrolling.
9. **Mode-specific choreography under one budget.** Adjacent transitions connect
   endpoints; compressed jumps shorten the central segment without rendering
   intermediate chapters; cross-branch travel uses two overlapping paths around
   the persistent Home mark; neutral transitions use a short crossfade. Desktop
   uses 8–18 vw travel, while mobile retains direction with smaller transforms.
10. **Accessibility after commit.** Ordinary link navigation scrolls to top and
    focuses `main#main-content` once after incoming content is usable. History
    traversal preserves native scroll restoration and does not steal focus.
    Next.js remains the sole route announcer, preventing duplicate announcements.
11. **Live preferences and theme.** One `matchMedia` subscription controls
    reduced motion and is removed on unmount. A runtime change cancels
    incompatible work and settles safely. The overlay consumes the existing
    theme CSS properties, so the current theme applies atomically without a
    duplicate theme store.
12. **Internal deterministic controller.** In development/test only, a typed
    `window` controller can hold the start or midpoint checkpoint. Stable
    `data-*` state remains observable in every environment, but production does
    not accept a public query flag or load test artifacts.

## Risks / Trade-offs

- **App Router commits before destination measurement** → retain source geometry,
  measure in a layout effect, and degrade to manifest geometry or neutral mode.
- **Rapid router requests could commit an older URL** → invalidate its animation
  token and ensure current pathname is the sole truth; the latest eligible
  request supersedes pending presentation work.
- **Back/Forward lacks an outgoing capture window** → animate the incoming page
  coherently from the known coordinate direction while prioritizing native
  history and scroll behavior.
- **Focus can race the incoming animation** → focus from one post-settle callback
  guarded by request id and pathname.
- **Browser/WebKit animation variance affects screenshots** → freeze explicit
  deterministic checkpoints and compare geometry/semantics, not transient
  antialiasing.
- **Missing local browser system libraries** → record the environment dependency
  separately; complete all unaffected gates and rerun the exact Playwright
  command once host libraries exist.

## Verification Strategy

- Vitest covers full manifest topology, link eligibility, state transitions,
  geometry fallback, timing constants, supersession, and cleanup helpers.
- Component tests cover shell semantics, overlay bounds, terminal semantics,
  theme continuity, and development controller behavior.
- Playwright covers the 28 required functional cases, native/no-JavaScript
  fallback, deterministic screenshots, axe, responsive overflow, and animation
  registry stability across Chromium, Firefox, and WebKit where available.
- Storybook build/tests, production standalone build, Lighthouse CI, strict
  OpenSpec validation, and the execution report close the phase gate.

## Migration Plan

1. Land pure topology, eligibility, and lifecycle contracts with unit tests.
2. Add the persistent shell and inert overlay without changing native routes.
3. Enable coordinated navigation, measured geometry, mode timelines, and safe
   fallback.
4. Add history, focus, live reduced motion, theme, terminal, and mobile behavior.
5. Run all gates, inspect deterministic visual checkpoints, update evidence,
   refresh Graphify because central relationships changed, and archive only when
   no required check remains incomplete.

Rollback removes `SiteExperienceShell` from the root layout. Real anchors and
the App Router continue to provide direct, accessible navigation.
