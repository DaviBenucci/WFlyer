# Diagnostic Iterations

Only the final `final-*` Playwright directories and the correctly configured
production sequence are authoritative Gate results. Earlier diagnostic runs
were retained rather than hidden:

- initial deep-link browser assertions assumed literal top `0`; they were
  corrected to respect canonical scroll margin while static Home remained the
  true document origin;
- one Firefox restoration setup used a fragile initialization hook; the test
  was rewritten to establish state during an intentionally held bootstrap;
- accessibility assertions were narrowed to the actual interaction lock and
  same-document theme transition contract;
- the first production-root regression assertion waited less than the retained
  legacy intro duration; the test now exercises the approved Escape release,
  without changing public behavior;
- one final local verification built without
  `WFLYER_DEPLOYMENT_ENVIRONMENT=production`, and indexing correctly failed
  closed; rebuilding with the environment set at build time passed the full
  production build, standalone, and indexing sequence;
- the pre-seal evidence audit found an early reduced-motion CSS fail-open,
  missing direct tabletop coverage, and overlapping positioning ownership; the
  CSS policy, delayed-hydration guard, serialized positioning ownership, and
  focused tests were corrected before the authoritative closeout runs.

The last narrow CSS-fail-open ownership hook postdated the first complete
aggregates. Closeout therefore reran only its affected scopes: 600/600 unit,
39/39 focused browser, 12/12 focused accessibility, a fresh production build
and smokes, and 6/6 production isolation checks. The unaffected parts of the
159/159 development, 45/45 accessibility, and 93-pass/81-skip production
aggregates remain the regression baseline; the post-source focused runs close
the changed subset.

No failing test was disabled, loosened to ignore a product defect, or deleted.
The final runs passed after contract-accurate code/test corrections.
