# Traversal Duration and Home Geometry

Date: 2026-08-27

## Architecture

```text
manifest header target
  → active projection chapter progress
  → projection-derived native scrollTop
  → owned GSAP tween of a numeric scroll proxy
  → native window.scrollTo({ top })
  → existing ScrollTrigger/master timeline
```

No chapter transform or second story-progress model is tweened by Phase 6.

## Timing

For normalized physical distance `d`:

```text
duration = clamp(0.65 + 2.35d, 0.65, 3.0) seconds
```

- Unit proof: `d=0 → 0.65`, `d=0.25 → 1.2375`, `d=1 → 3.0`, and
  out-of-range `d=2 → 3.0` after normalization.
- Non-finite distance rejects with `RangeError`.
- Same-position duplicate activation is a `0s` no-op and does not append.
- Reduced/static mode uses immediate `0s` positioning.
- Enhanced and compact animated paths expose their measured distance/duration
  and never exceed `3.0s`.

## Reviewed runtime samples

| State | Projection | Progress | Duration |
|---|---|---:|---:|
| Home | horizontal enhanced | `0.46141672123990396` | idle |
| Professional Projects | horizontal enhanced | `0.8260750927745034` | `1.5069471731063087s` |
| Application Benefits | horizontal enhanced | `0.21373608382449247` | `1.232049497926217s` |
| Professional About | vertical compact | `0.12775500561855144` | `0.950224263203596s` |
| Application Benefits | static/reduced | `0.7284634224257268` | `0s` |

The enhanced Home target equals the live `homeProgress` returned by measured
Phase-5 geometry and is asserted not to equal `0.5`. Traversal from Application
Benefits to Professional Contact proves that Home and Process geometry lie
strictly inside the crossed continuous progress range while multiple semantic
intermediate boundaries are observed.
