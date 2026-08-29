# Current-State Audit — `Wflyer(20260814-194446).zip`

**Source SHA-256:** `39659cf3f039317a0b8140adad988a1adb279d4ba6bbd0cf81bab6696994325d`

## Executive finding

The repository is a technically substantial v1 implementation, but its product/motion architecture is not the approved v2 target. It is built around independent chapter routes and coordinated route-transition overlays, whereas v2 requires a native-scroll master landing story with detailed routes preserved separately.

## Retainable foundations

- Next.js/React/TypeScript toolchain and pinned dependencies;
- theme system and official brand asset handling;
- legal/static routes;
- secure contact Route Handler and form validation foundation;
- SEO/deployment/indexing/standalone infrastructure;
- Storybook, Vitest, Playwright, axe, Lighthouse, CI/release infrastructure;
- approved official logo/intro source assets, subject to readiness refactor;
- public project/channel allowlist;
- Cloudflare/Napoleon/exact-SHA operational boundaries.

> **Current-topology supersession — 2026-08-29:** the preceding item records
> the audited source snapshot. DNS was subsequently migrated by the owner:
> Registro.br now delegates to Napoleon authoritative DNS, Napoleon hosts the
> standalone Node application, and Cloudflare DNS/proxy are no longer in the
> active request path. Cloudflare Turnstile remains independent and supported.

## Primary architectural conflicts

1. `src/config/chapters.ts` models route coordinates, previous/next, `institutional/company`, and route terminals.
2. `src/components/experience/SiteExperienceShell.tsx` intercepts eligible links, calls `event.preventDefault()`, uses router navigation/transition overlays, and resets scroll to top.
3. `src/components/experience/ScoreTransitionLayer.tsx` represents compressed route travel instead of continuous scroll travel.
4. `src/config/navigation.ts` exposes `Empresa` and external header `Acessar app`.
5. `src/app/page.tsx` contains large CTA buttons and branch-click selection rather than scroll-primary exploration.
6. `src/components/music/*` creates hard-coded/programmatic noteheads, pixel note positions, independent staff paths, and per-chapter scores.
7. `ApplicationDemoTablet.tsx` is a mini interactive DOM application with local configured/processing/result/reset states.
8. `src/app/layout.tsx` renders one global footer for all routes and has no branch-terminal story model.
9. Current tests explicitly require old previous/next route controls, route-transition modes, interactive tablet states, and legacy chapter manifest.
10. Current public copy still uses company/team language and plural corporate voice.

## Intro finding

The current brand intro has a deterministic fixed 5.6-second choreography and useful accessibility/session/recovery infrastructure. V2 retains official geometry, skip/Escape, session bounding, and fail-open behavior, but readiness/initial target positioning must become authoritative rather than the fixed elapsed time.

## Music asset finding

A normalized visual-library folder exists as a nested package but is not integrated as the canonical repository paths. This overlay integrates its manifest/source/runtime candidates. Metrics/anchors remain intentionally pending human Gate B.

## Status correction

The old `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING` status applies only to the superseded v1 target. The v2 target is implementation-pending.
