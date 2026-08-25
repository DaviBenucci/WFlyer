# Regression and Isolation

## Development browser regression

The final three-engine run covered:

- Phase-2 static story and JavaScript-disabled fallback;
- Phase-3 typed routes and fail-closed publication allowlists;
- Phase-4 lifecycle, hashes, history, timeout, reduced motion, resize, and no-JS;
- retained Contact validation/security/provider/duplicate-submit behavior;
- public `/`, all retained public/detailed routes, legal routes, sitemap/robots,
  and custom 404.

Result: **159 passed**.

## Accessibility regression

Phase-4 active cover, keyboard skip, revealed deep link, reduced motion, and
degraded mode were tested together with Phase 2, legacy Home, and Contact.

Result: **45 passed** across Chromium, Firefox, and WebKit, with zero serious or
critical axe violations and explicit `aria-hidden-focus` incomplete review.

## Production isolation

- Fresh Next.js production build passed.
- Standalone preparation passed.
- Standalone smoke passed 20 public routes, three development-route 404s, and
  22 static assets.
- Indexing smoke passed.
- Production Playwright passed 93 applicable checks; 81 development-only checks
  were correctly skipped.
- `/__visual-lab/story`, `/__visual-lab/story/bootstrap`, and
  `/__visual-lab/music` return the custom nonindexable HTTP 404 and leak no lab
  fixture markup.
- Sitemap contains no `__visual-lab` path.

## Preserved boundaries

- `src/app/page.tsx` received no Phase-4 edit.
- No Phase-4 source imports Music renderer/composer code.
- No Phase-4 source contains GSAP, ScrollTrigger, pin/scrub story control,
  wheel/touch suppression, or a fixed Home midpoint.
- Phase-2, Phase-3, Music Gate B, Music Gate C, Gate-C delta, final triplet, and
  final approval checksum bundles all revalidated.

The production public-root regression test now deliberately exercises the
retained legacy intro's approved Escape release before landmark/keyboard
assertions; production behavior itself was not shortened or changed.
