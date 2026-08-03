## Purpose

Defines the reproducible automated and reviewed evidence required before an
institutional-site revision can become a staging or production candidate.

## ADDED Requirements

### Requirement: Complete repository gate
The release process SHALL reject a candidate unless exact dependency policy,
lint, strict types, unit/component tests, Storybook, OpenSpec, production build,
standalone smoke, dependency audit, and Lighthouse budgets pass for the same
revision.

#### Scenario: A static or build gate fails
- **WHEN** any required repository command exits unsuccessfully
- **THEN** no release candidate is declared ready or handed to Napoleon

### Requirement: Supported browser and accessibility gate
The release process SHALL validate functional, motion, visual, responsive,
reduced-motion, and axe behavior in Chromium, Firefox, and WebKit using the
repository's meaningful assertions and reviewed baselines.

#### Scenario: A supported engine diverges
- **WHEN** a supported engine fails a functional assertion, accessibility audit, or reviewed visual comparison
- **THEN** the candidate remains blocked without weakening, skipping, or blindly updating the evidence

### Requirement: Evidence distinguishes local and external validation
The quality report MUST state which checks ran locally, which require physical
devices or assistive technology, and which require deployed staging or
production infrastructure.

#### Scenario: Local gates pass without staging access
- **WHEN** all repository-owned checks pass but external access is unavailable
- **THEN** the report declares code complete with external configuration pending and does not claim staging or production validation

### Requirement: Deployed staging uses production-safe checks
The deployed-staging gate MUST exercise only public production behavior and
MUST NOT depend on deterministic test controllers, forced timeline
checkpoints, or other development-only hooks.

#### Scenario: A staging candidate is deployed
- **WHEN** automated staging verification runs against its HTTPS origin
- **THEN** route metadata, indexing isolation, navigation, accessibility, and critical public journeys are checked through the same surface available to real visitors
