## Why

The browser quality gates compared visual evidence across mutable runner conditions and a development server, and the repair was interrupted while still partially implemented. The observed WebKit reduced-motion Home retry changed from a 14-pixel delta to more than 2,600 pixels, so the environment and page-state contract had to become deterministic before any baseline could be accepted.

## What Changes

- Pin common CI and manual candidate browser jobs to Ubuntu 24.04, Node.js 24, pnpm 11.18.0, Playwright 1.62.0, and the official Playwright Noble image.
- Run repository-owned browser suites against a controlled production Next.js build while keeping deployed-staging checks free of test-only controls.
- Centralize screenshot readiness and capture options, including fonts, complete document state, application markers, stable animation frames, reduced-motion setup, and defensive removal of development-only UI.
- Repair Phase 07 reduced-motion and checkpoint sequencing, and decide Phase 06 select/3D handling only from inspected diff evidence.
- Keep motion evidence independent of visual-regression failure ordering, preserve complete failure artifacts, and govern any snapshot regeneration in the canonical container.
- Bound Storybook browser-test file concurrency so one Chromium worker remains within the runner memory budget without skipping stories or assertions.
- Update focused English QA/release documentation with verified root causes, inferences, reproduction steps, and remaining external validation.
- Preserve all browser engines, approved production motion and layout, `app.wflyer.com.br`, Napoleon configuration, Cloudflare, mail, and DNS.

### Scope and non-goals

- Scope is limited to the institutional repository's CI workflows, Playwright server/capture harness, Phase 06/07/08 evidence, directly justified deterministic rendering, reviewed baselines, and applicable QA/release documentation.
- This change does not deploy, push, create a candidate archive, modify external infrastructure, add analytics, or implement musical-product behavior.
- No screenshot-only depth override was adopted. Production tilt remains governed by the interactive-demo specification and its motion tests.

### Verified facts, inferences, and pending work

- Verified: the interrupted tree is uncommitted at `5a4ea852`, contains partial workflow/test/rendering changes, and is aligned with `origin/develop/site-institucional` after fetch.
- Verified: the original evidence recorded 23 failures, including a WebKit reduced-motion retry whose delta grew to 2,636 pixels.
- Verified: all seven Firefox Phase 06 differences are confined to HTML text-glyph edges; native select arrows, focus outline, SVG score, clef, and tablet geometry are unchanged. Cross-host font rasterization is a high-confidence explanation, not a proven causal attribution.
- Verified: the exact Noble image produced 34 reviewed baseline replacements (7 Phase 06, 16 Phase 07, and 11 Phase 08), five consecutive reduced-motion WebKit passes, and two unchanged complete 291/291 zero-tolerance visual runs.
- Verified: parallel Storybook browser files exhausted the local 1.66 GiB Docker memory limit with exit 137; sequential file execution retained all 63 assertions and passed in 17.5 seconds.
- Pending: the remaining complete local gates and a remote GitHub Actions run after an authorized push.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `complete-quality-gate`: Require a pinned browser execution environment, production-like repository test server, deterministic screenshot readiness contract, reviewed baseline governance, and failure-independent motion evidence.
- `governed-release-candidate`: Require the manual candidate browser job to use the same canonical browser environment and repository-owned test runtime as common CI without conflating that build with the deployable Napoleon candidate.

## Impact

- Affected implementation: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `playwright.config.ts`, browser helpers/specs, and only evidence-justified tablet presentation code.
- Affected evidence: Linux Playwright baselines may be regenerated only after determinism is proven in the pinned Noble image and reviewed for unauthorized UI or design drift.
- Affected normative documentation: browser/motion QA and release-readiness guidance only; approved golden references and product requirements remain authoritative.
- Dependencies remain locked to the existing stack; no runtime service or API is added.
- Rollback is a normal source revert of the focused workflow/harness/rendering changes and any reviewed baselines; it requires no data migration or external-system mutation.
