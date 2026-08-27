# Phase 6 Retained-Surface Validation

Date: 2026-08-27
Result: **PASS**

The focused Chromium regression command listed 68 rows. Its first run produced
65 passes, two intentional skips, and one obsolete Phase-5 timing assertion:
the test observed `professional-projects` before Phase-6 traversal had completed
and therefore sampled the prior hash. Phase 6 intentionally pushes only on
successful completion.

The retained assertion was migrated to require both the target chapter and
`lastTraversalStatus="completed"`; its focused rerun passed 1/1. The final
composite is therefore 66/66 applicable retained contracts, with two expected
non-applicable rows:

- literal headed scrollbar drag in a headless run;
- production-only Music 404 inside the development run.

The regression scope covers legacy Home, Phase 3 routes/publication, Phase 4
bootstrap/history, Phase 5 native-scroll/rebuild/lifecycle/motion budget,
Contact/security, all retained static/legal routes, accessible 404,
sitemap/robots, and development Music isolation.

The exact production artifact separately passed 3/3 Playwright isolation tests
and standalone smoke for all four guarded development-route roots.
