# HGA-001A — local offset correction and 1366 capacity stop

```text
HGA_001A_OFFSET_REGULARITY_FIX=PASS
ROOT_MECHANISM_FIXED=true
OFFSET_REGULARITY_INVARIANT=tangent.x>1e-7 and 1-(2*staffSpace+halfStroke)*abs(signedCurvature)>1e-7 across the measured bridge and both joins
NUMERICAL_MARGIN=1e-7 (existing SCORE_PATH_REVIEW_GEOMETRY_EPSILON; excludes the numerical singular boundary)
1366_PREVIOUS_INTERSECTION_PRESENT=false
1440_REGRESSION_PRESENT=false
HGA_001_1366_NATIVE_DESKTOP=BLOCKED
1366_PROJECTS_CAPACITY=INSUFFICIENT_CAPACITY
1366_REMAINING_REJECTION_REASONS=projects-protected-clearance-or-clip
PROJECTS_MODIFIED=false
COMPOSER_SEMANTICS_CHANGED=false
FINGERPRINT_CHANGED=false
TELEMETRY_FINDING_PRESERVED=true
FOCUSED_TESTS=PASS (52 tests, 6 affected files)
TYPECHECK=PASS
LINT=PASS
OPENSPEC_STRICT=PASS
DIFF_CHECK=PASS (scoped changes)
HGA_002_STATUS=PENDING
HUMAN_GEOMETRY_APPROVAL=PENDING (changes requested)
```

The measured Home-to-About bridge now increases horizontal control reach only
when the original spline fails the offset-regularity check. Its seed derives
from the actual descent width, vertical rise, outer staff offset, and approved
stroke thickness. The final B-spline is checked over the connector and both
joins at 64 samples per segment. The threshold uses the existing geometry
epsilon. There is no 1366 branch, new breakpoint, staff-line postprocessing,
or relaxed intersection validator. This sampled guard excludes the observed
fold and its local class at the checked points; it is not an analytic proof of
all intersample extrema. The unchanged complete visible-segment validator
remains authoritative for candidate acceptance.

The saved 1366×768 candidate regression failed before the patch with negative
offset progression, then passed after it. It checks all original 1025-point
staff lines for intersections, not the sampled telemetry. The saved 1440×900
passing control also passed. The previous `staff:0` segments 126/131 crossing
is absent after the repair. The current runtime candidate no longer reports a
global visible-segment intersection.

At **1366×768, 100% zoom**, current Playwright-managed Chromium measured the
mounted runtime with DPR=1, visual viewport scale=1, fonts loaded and two
settled animation frames. Production mode selection was not overridden.
The inert horizontal candidate used the same normalized scene measurements
as the saved causal record (SHA-256
`fc659fd70b33d88bd4580696048457f6fe4a4e666dd2f96342af4a3a6b4f5a02`).
The runtime returned `INSUFFICIENT_CAPACITY`, signature
`projects-capacity:4ef04b46`, with its **only** rejection reason
`projects-protected-clearance-or-clip`; it selected `vertical-wide` for the
whole story. `SAFE_FALLBACK` is not a horizontal validation PASS.

| Projects visit | Minimum CSS-pixel clearance | Limiting rendered primitive | Relation |
| --- | ---: | --- | --- |
| 1 | -37.10076674891491 | `wf-professional-projects:primary:note:0:notehead` | own shelf |
| 2 | 11.91535072258615 | `wf-phase-9-task-34:horizontal-enhanced:professional:staff:8` | incoming |
| 3 | -20.26344607345662 | `wf-phase-9-task-34:horizontal-enhanced:professional:staff:8` | incoming |

The required minimum remains 12 physical CSS pixels. The [structured runtime
record](stage-1-hga-001a-runtime-residual.json) preserves every exact visit,
protected rectangle, limiting edge, candidate signature, viewport/readiness
fact and validation result. The Composer fingerprint remains the approved
`fnv1a32:039bce10`; seed, Projects code/policy, HGA-002 density and historical
evidence were not changed in this package. Task 5.6 remains open at 30/51.

**STOP for architectural review.** The local offset repair is complete, but
native 1366 horizontal presentation cannot be claimed while these Projects
constraints reject the candidate. Review whether the existing whole-story
fallback remains the intended outcome for 1366, or authorize a separately
bounded Projects solution. This record supplies no permission to alter Projects,
capacity thresholds, responsive policy or HGA-002. No final matrix, Human
Geometry Approval, refreeze, Assembly, GSAP, Stage 2+, commit, push or deploy
was performed.
