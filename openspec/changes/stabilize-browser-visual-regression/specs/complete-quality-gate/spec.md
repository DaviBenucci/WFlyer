## ADDED Requirements

### Requirement: Canonical browser evidence environment
Repository-owned functional, accessibility, motion, and visual browser evidence SHALL run in a pinned Linux operating-system and browser-toolchain environment, SHALL verify its Node.js, package-manager, and browser-runner versions before testing, and SHALL use the same environment in common CI and the manual candidate browser gate.

#### Scenario: Canonical fingerprint differs
- **WHEN** a browser job reports an operating system, Node.js, package-manager, browser package, or bundled browser environment outside the approved versions
- **THEN** the job fails before accepting browser evidence or updating a baseline

#### Scenario: Canonical browser jobs execute
- **WHEN** common CI or the manual candidate browser gate evaluates a revision
- **THEN** every supported engine runs without downloading a second mutable browser bundle into the pinned environment

### Requirement: Deterministic repository browser runtime
Repository-owned browser suites SHALL exercise one controlled production-like build whose public test configuration is established before the build, while deployed-staging checks MUST remain independent of test-only timeline controllers or forced checkpoints.

#### Scenario: Repository browser suites start
- **WHEN** end-to-end, accessibility, motion, or visual tests run in repository CI
- **THEN** they use the configured production-like origin and do not depend on development mode, Fast Refresh, hot reload, or development overlays

#### Scenario: Deployed staging is evaluated
- **WHEN** staging-gate checks target an external HTTPS origin
- **THEN** no local test server starts and no deterministic internal controller is required

### Requirement: Deterministic visual capture and baseline governance
Visual assertions SHALL establish media, viewport, theme, document, font, application-state, and stable-frame readiness before capture; SHALL disable screenshot animation and caret rendering centrally; and SHALL exclude development-only UI without hiding productive interface regions. Linux baselines MUST be generated and reviewed only in the canonical browser environment after repeated deterministic execution.

#### Scenario: Reduced-motion Home is captured
- **WHEN** the final Home state is captured with reduced motion requested before navigation
- **THEN** the opening overlay and timeline are absent, the final Home shell and intended controls are visible, fonts are loaded, development UI is absent, and layout remains stable across consecutive animation frames

#### Scenario: A baseline update is proposed
- **WHEN** a visual mismatch remains after environment and state stabilization
- **THEN** reviewers inspect expected, actual, and diff evidence for unauthorized UI or design drift before accepting a canonical-environment snapshot

#### Scenario: A changing retry is observed
- **WHEN** repeated captures of the same state produce materially different diff regions or counts
- **THEN** the gate treats the result as a determinism defect and rejects baseline regeneration or broad tolerance changes

### Requirement: Browser evidence remains independently observable
Motion validation SHALL execute even when visual regression later fails, and browser evidence uploads SHALL remain available after any non-cancelled success or failure without weakening required gates.

#### Scenario: Visual comparison fails
- **WHEN** a browser job reaches motion and visual validation and the visual suite fails
- **THEN** motion results from that revision already exist and expected, actual, diff, trace, video, error-context, and report evidence is uploaded when produced
