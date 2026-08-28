# Phase 8 Diagnostic Iterations

Closeout date: 2026-08-28

1. The first APP-04 integration caused the retained Phase-5 no-React-render
   assertion to observe activity-driven work in the default no-media story.
   The subscription was bounded to complete media contracts; the real
   missing-media fallback is static. The exact assertion and APP-04 lifecycle
   tests then passed together.
2. That optimization did not clear the two reproduced Firefox timing failures,
   so it was retained as a valid lifecycle correction but not misreported as
   their cause.
3. For motion, the clean Phase-7 control passed three exact repetitions while
   Phase 8 failed three. Recorded p95 values separated near 33.3 ms versus
   66.4 ms. Targeted paint profiling isolated the redundant nested APP-04 shell
   transform. Removing only it restored approximately 33.2 ms p95 and the exact
   test passed three repetitions, followed by the final cross-engine matrix.
4. For Back/Forward, the clean control and Phase-8 tree both varied under
   repetition, so the failure alone did not prove Phase-8 causality. A
   deterministic trace showed a preservation request entering the 240 ms
   ScrollTrigger refresh window before a newer explicit navigation; its later
   stale `position()` cancelled that navigation with reason `positioning`.
   Rebuild now waits for the newer traversal and preserves its semantic result.
   The exact Firefox test passed five repetitions and all retained matrices.
5. The final CSS correction postdated the original screenshots. The canonical
   script regenerated all eight captures and reasserted missing media, scene
   count, CTA count, barline order, overflow, and enhanced-stage containment.
6. The final accessibility run completed uninterrupted: 181 applicable passes
   and two intentional engine-capability skips.

No test or canonical threshold was disabled, loosened, deleted, or rebaselined.
Failed diagnostic history is retained here rather than erased.
