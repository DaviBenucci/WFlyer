# Stage 1 portfolio geometry validation report

`STAGE1_PORTFOLIO_GEOMETRY_VALIDATION=PASS`
`MANIFEST_LOGICAL_CASES=21`
`EXPANDED_OBSERVATIONS=63`
`COMPLETED_OBSERVATIONS=63`
`INFRASTRUCTURE_BLOCKED=0`
`PENDING_OBSERVATIONS=0`
`UNIQUE_ROOT_CAUSES=4`
`CURRENT_REGRESSIONS=0`
`INHERITED_CRITICAL=0`
`INHERITED_NONBLOCKING=0`
`VALIDATION_PIPELINE_DEFECTS=4`
`UNCLASSIFIED=0`
`SAFE_FALLBACK_OCCURRENCES=25`
`BLOCKING_ROOTS=NONE`
`NONBLOCKING_ROOTS=VP-001,VP-002,VP-003,VP-004`
`CHROMIUM=PASS (21/21)`
`FIREFOX=PASS (21/21)`
`WEBKIT=PASS (21/21)`
`DESKTOP_SINGLE_ORIGIN=PASS`
`GLOBAL_OVERFLOW=PASS`
`GLOBAL_INTERSECTIONS=PASS`
`PROJECTS_CAPACITY=PASS`
`PROJECTS_VISIT_CLEARANCE=PASS`
`RESPONSIVE_TRANSITIONS=PASS`
`HYDRATION_DETERMINISM=PASS`
`REDUCED_MOTION_GEOMETRY=PASS`
`DEEP_LINK_GEOMETRY=PASS`
`HUMAN_GEOMETRY_APPROVAL=PENDING`

## Scope and accounting

The locked manifest contains 21 logical cases expanded across Chromium, Firefox,
and WebKit. All 63 observations now have durable PASS results. Pending and
infrastructure-blocked are both zero; they are not additive populations.

No current regression, inherited geometry failure, or unclassified product
failure was observed. The matrix kept complete visible ink, 12px protected
content clearance, global zero visible-segment intersections, Composer
fingerprint `fnv1a32:039bce10`, Projects three-visit NON-ASSEMBLY behavior,
capacity fallback, responsive transitions, hydration equality, reduced motion,
deep links, scroll-lock release, and lifecycle cleanup enabled.

`SAFE_FALLBACK` remains an observation attribute rather than a failure class.
Twenty-five observations selected or directly exercised an authorized
capacity/driver fallback. Responsive vertical and reduced-motion modes were not
counted solely because they are non-horizontal.

## Deduplicated root inventory

- `VP-001` — `VALIDATION_PIPELINE_DEFECT`, resolved and nonblocking. The
  canonical bootstrap terminal states are `REVEALED` and fail-open `DEGRADED`.
  The prior helper correction was applied to two missed inline sibling waits
  after WebKit reproduced the already-recorded Chromium signature. All later
  projection, chapter, driver-failure, cleanup, and usability assertions stayed
  intact; the focused WebKit retry passed.
- `VP-002` — `VALIDATION_PIPELINE_DEFECT`, resolved and nonblocking. Firefox
  correctly selects Projects capacity fallback before driver ownership and uses
  `projects-capacity-insufficient` precedence. Its two affected observations
  remain durably passed.
- `VP-003` — `VALIDATION_PIPELINE_DEFECT`, resolved and nonblocking. Public
  Home waits for BrandIntroController's
  `data-brand-intro-home-state="ready"`; the exact Firefox route observation
  passed under the Playwright-managed test-mode server.
- `VP-004` — `VALIDATION_PIPELINE_DEFECT`, resolved and nonblocking. After
  the owner ran Playwright's supported WebKit dependency installer, WebKit 26.6
  launched with no missing linked libraries and all 21 WebKit observations ran.

No fifth root was created. The WebKit `DEGRADED` mismatch was the same VP-001
signature preserved in the original Chromium evidence, not a product regression
or a new environment blocker.

## WebKit completion evidence

- runtime smoke: `stage-1-portfolio-geometry-validation-data/astra-vp004/runtime-smoke.json`;
- 15 geometry/hydration/capacity passes:
  `astra-vp004/webkit-core-pass.json`;
- five direct lifecycle/route/bootstrap passes and the initial VP-001 sibling
  failure: `astra-vp004/webkit-lifecycle-pass.json`;
- focused `WEBKIT-LIFE-04` retry pass:
  `astra-vp004/webkit-life-04-retry.json`.

The initial lifecycle file records five passes and one failed attempt. The retry
is the durable result for `WEBKIT-LIFE-04`; it is not an additional observation.
The 42 prior Chromium/Firefox passes were not rerun.

## Validation and boundaries

Focused TypeScript/lint, strict active-change OpenSpec, structured JSON and
observation accounting, Graphify update, and scoped diff hygiene are recorded in
the structured results. Earlier focused unit/component, production build,
Storybook, frozen Phase-9 integrity, and portfolio rebaseline gates remain
retained results and were not rerun without cause.

The only full `git diff --check` finding remains the pre-existing unrelated
whitespace in `.env.example`; the scoped check excluding that file passes.

The matrix used only the portfolio topology. Frozen Phase-9 and superseded audit
artifacts were not modified or counted as current passes. No product runtime or
geometry was changed. No final capture, refreeze, Assembly, GSAP work, Stage 2+,
commit, push, or deployment was performed.

Automated Stage-1 portfolio geometry validation is complete. Execution stops at
task 5.6, explicit Human Geometry Approval. Automated PASS does not satisfy that
gate.
