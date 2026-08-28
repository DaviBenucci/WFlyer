# Phase 7 Diagnostic Iterations

Closeout date: 2026-08-28

1. Desktop fan and compact Contact review exposed the two known geometry
   defects: selected-card clipping and approximately 35 px Contact overflow.
   Phase-7 CSS density/scene composition corrections resolved both.
2. WebKit intermittently closed a page while a transformed fan ancestor also
   animated `filter: drop-shadow`. The redundant ancestor filter was removed;
   card-level shadow and shared hover/focus selection remain. Five focused
   WebKit repetitions passed, followed by the final 30/30 matrix.
3. The Phases 4–6 long regression exposed Projects semantic-center drift at the
   `768×450` vertical-wide fallback. A Phase-7-only two-column intermediate fan
   keeps the chapter stable; affected Firefox/WebKit tests passed 4/4.
4. An early accessibility run reused a development server without the required
   transition-test environment. The exact server was stopped and the complete
   configured matrix was rerun uninterrupted: 181 applicable passes and two
   intentional skips.
5. The first indexing smoke omitted the production environment at invocation
   and correctly rejected the fail-closed artifact policy. The same exact build
   passed when the smoke used `WFLYER_DEPLOYMENT_ENVIRONMENT=production`.
6. A supplemental `768×450` screenshot was intentionally excluded because the
   standalone capture script did not reproduce the controlled Playwright
   lifecycle. The final regression, not a cosmetic recapture, is authoritative.

No test was disabled, loosened, deleted, or rebaselined to hide a failure.
