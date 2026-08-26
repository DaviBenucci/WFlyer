# Phase-5 Browser, Accessibility, and Motion Validation

Date: 2026-08-26
Result: **PASS**

The final focused Phase-5 matrix passed 33/33 applicable headless cases, plus
one dedicated headed Chromium interaction:

| Engine/run | Applicable passes | Intentional skips |
|---|---:|---:|
| Chromium headless | 11 | 1 headed-only scrollbar case |
| Firefox headless | 11 | 1 headed-only scrollbar case |
| WebKit headless | 11 | 1 headed-only scrollbar case |
| Chromium headed | 1 | 0 |
| **Total** | **34** | **3 non-applicable rows** |

The matrix covers direct Home boot, exact label order, both branches and
extremes, partial progress, wheel/trackpad-equivalent wheel, a literal native
scrollbar-thumb drag, Page Up/Down, Space/Shift+Space, Home/End,
compact/touch/static fallback, reduced motion, resize, a literal orientation
event, 200% effective visual viewport, deep links, Back/Forward semantics,
hidden-tab continuity, forced failure, Strict Mode/remount and idempotent
unmount cleanup, exact trigger/timeline kill counts, duplicate-resource
prevention, render-count invariance, semantic landmarks, focus, and contrast.

Chromium and Firefox also meet the deterministic headless rAF p95 gate. WebKit
passes the application invariants while its video-backed test runner's
scheduler throttle is recorded separately in the lifecycle evidence.
