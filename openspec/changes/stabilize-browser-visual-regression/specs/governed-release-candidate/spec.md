## ADDED Requirements

### Requirement: Candidate browser evidence matches common CI
The manual candidate browser gate SHALL use the same pinned supported-browser environment, version fingerprint, production-like repository test runtime, and required browser suites as common CI for the selected revision. Its browser-test build MUST remain distinct from the environment-specific standalone archive prepared for Napoleon.

#### Scenario: Manual candidate browser gate runs
- **WHEN** an authorized staging or production candidate revision reaches browser validation
- **THEN** the revision is tested with the canonical common-CI browser environment before any environment-specific candidate package is accepted

#### Scenario: Browser-test build completes
- **WHEN** the candidate workflow builds the application for repository-owned browser suites
- **THEN** that build is used only as test input and is not represented as the checksummed Napoleon deployment candidate

#### Scenario: Browser environment drifts between workflows
- **WHEN** the manual candidate browser job no longer matches common CI's pinned runner or supported-browser toolchain
- **THEN** workflow contract tests fail and candidate readiness remains unproven
