# Phase-5 Master Story Contract

Date: 2026-08-26

## Authority flow

```text
native document scrollTop
  → ScrollTrigger normalized progress
  → one paused GSAP master timeline
  → horizontal transform of one story track
```

No custom virtual-scroll state, global wheel/touch interception, autonomous
chapter snap, or per-frame React state exists in this path.

## Exact desktop label order

1. `app-terminal`
2. `app-access`
3. `app-demo`
4. `app-benefits`
5. `app-how`
6. `app-overview`
7. `home`
8. `pro-about`
9. `pro-services`
10. `pro-process`
11. `pro-projects`
12. `pro-contact`
13. `pro-terminal`

The labels are read from `src/lib/story/manifest.ts`; the lab does not create a
second label registry.

## Geometry

For each chapter, the target horizontal travel is:

```text
clamp(chapterCenter - viewportWidth / 2, 0, trackWidth - viewportWidth)
```

The label progress is that travel divided by total track travel. Home uses the
same formula as every other chapter. The sealed 1536×900 review values are:

| Label | Progress |
|---|---:|
| `app-terminal` | 0.000000 |
| `app-access` | 0.052827 |
| `app-demo` | 0.131167 |
| `app-benefits` | 0.213736 |
| `app-how` | 0.294204 |
| `app-overview` | 0.374673 |
| `home` | **0.461417** |
| `pro-about` | 0.555774 |
| `pro-services` | 0.645847 |
| `pro-process` | 0.731773 |
| `pro-projects` | 0.826075 |
| `pro-contact` | 0.924580 |
| `pro-terminal` | 1.000000 |

The chapter spans that produce this proof geometry are Motion-Lab-only draft
values. Final scene weights remain a calibration item.

## Phase-4 handoff

Phase 4 continues to own readiness, destination resolution, the history
envelope, overlay release, and failure recovery. Phase 5 extends only physical
positioning intent:

- `position-destination` for initial bootstrap positioning;
- `semantic-navigation` for hash/popstate destination priority;
- `preserve-active-chapter` for viewport projection rebuilds.

The semantic-navigation priority closes cross-engine ordering races between a
resize event and a simultaneous hash/history request without creating Phase-6
history or cinematic traversal behavior.
