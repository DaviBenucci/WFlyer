# Phase 6 Diagnostic Iterations

Date: 2026-08-27

These non-authoritative failures are retained to distinguish harness defects
from implementation defects.

1. Diff review found Boolean history suppression could be restored out of
   order by overlapping aborted positioning requests. It was replaced with an
   idempotent reference-counted release before authoritative validation.
2. Firefox/WebKit apply a dispatched native wheel delta after the cancellation
   event. The original no-snap assertion sampled too early and treated the
   user's own delta as automation. It now proves immediate cancellation first,
   then measures stability after that native delta. Corrective run: 3/3.
3. WebKit frame cadence sometimes crossed Home's narrow closest-chapter window
   without emitting that discrete active label. The proof now checks measured
   Home geometry strictly between source/destination and separately requires
   multiple observed intermediate boundaries. Corrective run: 3/3.
4. The first retained Phase-5 regression sampled the target chapter before the
   traversal completed. The assertion now waits for `completed`, matching the
   approved successful-push contract. Corrective run: 1/1.
5. The first indexing smoke used a production expectation against a build made
   without the production build-time environment. A fresh production build,
   standalone preparation, public/dev-route smoke, and indexing smoke passed.

After corrections, the core Phase-6 cross-engine matrix passed 30/30, expanded
negative paths passed 6/6, the applicable retained regression set passed
66/66, full unit passed 613/613, and the exact production artifact passed all
standalone/indexing/isolation checks. No failing test was disabled or loosened;
each correction asserts the intended contract more directly.
