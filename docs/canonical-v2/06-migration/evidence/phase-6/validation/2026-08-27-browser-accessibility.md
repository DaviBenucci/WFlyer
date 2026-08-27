# Phase 6 Browser and Accessibility Validation

Date: 2026-08-27
Result: **PASS**

The uninterrupted core matrix passed 30/30 cases with one worker and no retry:

| Engine | Header/history E2E | Accessibility/axe | Total |
|---|---:|---:|---:|
| Chromium | 8 | 2 | 10 |
| Firefox | 8 | 2 | 10 |
| WebKit | 8 | 2 | 10 |
| **Total** | **24** | **6** | **30** |

After adding duplicate-Home, rejected non-header target, and hidden-document
cancellation assertions to two existing E2E cases, those cases passed 6/6
across the same three engines. No implementation source changed between the
30-case core run and this negative-path expansion.

Coverage includes exact target order/hashes, Home to both branches, measured
Home return, nearby and distant timing, intermediate geometry, passive replace,
successful push, no-op/invalid requests, wheel/keyboard/Escape/touch/pointer/
hidden cancellation, supersession, rebuild, teardown, Back/Forward, compact,
reduced motion, focus, active semantics, and axe.

The tests never retry and all browser runs use isolated contexts. The reviewed
PNG captures are separate evidence, not screenshot baselines.
