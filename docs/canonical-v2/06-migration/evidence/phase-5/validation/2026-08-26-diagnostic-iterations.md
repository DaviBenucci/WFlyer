# Phase-5 Diagnostic Iterations

Date: 2026-08-26

The following issues were found by the Gate-5 matrix and resolved within the
Phase-5 boundary before final validation:

1. Mobile diagnostic contrast did not meet the focused accessibility check;
   the lab-only color token use was corrected.
2. The wheel/partial-progress assertion sampled before ScrollTrigger settled;
   the deterministic test now waits for the observed native-scroll state.
3. Same-document compact navigation could race viewport projection rebuild;
   explicit semantic navigation now has bounded priority over preservation.
4. WebKit delivers resize/hash/history events in a different ordering; the
   positioning intent contract now handles the ordering without new history
   ownership.
5. A layout-shift diagnostic measured the intentionally moving transform; it
   was replaced with stable stage/track geometry invariants.
6. A stale Playwright development server briefly served an earlier bundle;
   final runs used fresh server ownership and isolated output directories.
7. Long diagnostic values were ellipsized in visual captures; lab CSS now
   wraps them, and all five screenshots were recaptured.
8. Final boundary review found that `ScrollTrigger.kill(true, false)` already
   killed the attached timeline before the explicit timeline kill. Teardown now
   uses `kill(true, true)` followed by one explicit timeline kill, exposes
   balanced destruction counters, and removes the current debug controller.
9. The same review found literal interaction gaps. Final tests add Page Up,
   plain Space, a real headed scrollbar-thumb drag, an orientation event, 200%
   effective page scale, and a React keyed remount/Strict Mode replay.
10. The first indexing closeout invocation omitted the required production
    environment selector and correctly exercised fail-closed policy instead.
    The documented explicit production invocation then passed; no source or
    evidence policy was changed.

No failing test was disabled or weakened to pass the gate. WebKit scheduler
throttling is disclosed in the lifecycle evidence rather than attributed to
application callback work.
