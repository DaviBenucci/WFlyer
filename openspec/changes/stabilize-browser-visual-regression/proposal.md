## Why

The browser quality gates compared visual evidence across mutable runner conditions and a development server, and the repair was interrupted while still partially implemented. The observed WebKit reduced-motion Home retry changed from a 14-pixel delta to more than 2,600 pixels, so the environment and page-state contract had to become deterministic before any baseline could be accepted.

## What Changes

- Pin common CI and manual candidate browser jobs to Ubuntu 24.04, Node.js 24, pnpm 11.18.0, Playwright 1.62.0, and the official Playwright Noble image.
- Run repository-owned browser suites against a controlled production Next.js build while keeping deployed-staging checks free of test-only controls.
- Centralize screenshot readiness and capture options, including fonts, complete document state, application markers, stable animation frames, reduced-motion setup, and defensive removal of development-only UI.
- Repair Phase 07 reduced-motion and checkpoint sequencing, and decide Phase 06 select/3D handling only from inspected diff evidence.
- Make the Phase 06 processing-state capture wait for the pointer-driven tablet tilt to return exactly to its authored rest state without changing productive motion or baselines.
- Keep motion evidence independent of visual-regression failure ordering, preserve complete failure artifacts, and govern any snapshot regeneration in the canonical container.
- Bound Storybook browser-test file concurrency so one Chromium worker remains within the runner memory budget without skipping stories or assertions.
- Update focused English QA/release documentation with verified root causes, inferences, reproduction steps, and remaining external validation.
- Preserve all browser engines, approved production motion and layout, `app.wflyer.com.br`, Napoleon configuration, Cloudflare, mail, and DNS.

### Scope and non-goals

- Scope is limited to the institutional repository's CI workflows, Playwright server/capture harness, Phase 06/07/08 evidence, directly justified deterministic rendering, reviewed baselines, and applicable QA/release documentation.
- This change does not deploy, create a candidate archive, modify external infrastructure, add analytics, or implement musical-product behavior.
- No screenshot-only depth override was adopted. Production tilt remains governed by the interactive-demo specification and its motion tests.

### Verified facts, inferences, and pending work

- Verified: the interrupted tree was preserved and published in commit `065a077f9425943af8bc3ea821660bb356aef1da`, whose parent is the original `5a4ea8529582931e287cc667ab436544c9a176ee` baseline.
- Verified: the original evidence recorded 23 failures, including a WebKit reduced-motion retry whose delta grew to 2,636 pixels.
- Verified: all seven Firefox Phase 06 differences are confined to HTML text-glyph edges; native select arrows, focus outline, SVG score, clef, and tablet geometry are unchanged. Cross-host font rasterization is a high-confidence explanation, not a proven causal attribution.
- Verified: the exact Noble image produced 34 repository-reviewed baseline replacements (7 Phase 06, 16 Phase 07, and 11 Phase 08), five consecutive reduced-motion WebKit passes, and two unchanged complete 291/291 zero-tolerance visual runs for the published tree. A later evidence audit proved that the unchanged Chromium processing baseline still represented the removed test-only flat transform; its governed replacement and the revalidated Firefox processing edge evidence increase the final unique replacement set to 35 images. Human approval of those 35 images remains pending for Davi Benucci.
- Verified: parallel Storybook browser files exhausted the local 1.66 GiB Docker memory limit with exit 137; sequential file execution retained all 63 assertions and passed in 17.5 seconds.
- Verified: ordinary CI run `31118939281` targeted the exact published SHA but no job acquired a runner or executed a step because the GitHub account is locked for billing; this is external evidence, not a code failure.
- Verified: after the governed Phase 06 processing-baseline correction, two complete unchanged 291/291 visual runs, E2E 318/318, axe 102/102, motion 30/30, and the focused Firefox/WebKit repeats passed in the canonical Noble image with zero retries. The 84-PNG manifest remained byte-identical throughout.
- Pending: a green remote GitHub Actions run for the final SHA and Davi Benucci's human visual approval. The active change remains unarchived until those external gates are recorded.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `complete-quality-gate`: Require a pinned browser execution environment, production-like repository test server, deterministic screenshot readiness contract, reviewed baseline governance, and failure-independent motion evidence.
- `governed-release-candidate`: Require the manual candidate browser job to use the same canonical browser environment and repository-owned test runtime as common CI without conflating that build with the deployable Napoleon candidate.

## Impact

- Affected implementation: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `playwright.config.ts`, browser helpers/specs, and test-only capture stabilization; productive tablet presentation code remains unchanged.
- Affected evidence: Linux Playwright baselines may be regenerated only after determinism is proven in the pinned Noble image and reviewed for unauthorized UI or design drift.
- Affected normative documentation: browser/motion QA and release-readiness guidance only; approved golden references and product requirements remain authoritative.
- Dependencies remain locked to the existing stack; no runtime service or API is added.
- Rollback is a normal source revert of the focused workflow/harness/rendering changes and any reviewed baselines; it requires no data migration or external-system mutation.
