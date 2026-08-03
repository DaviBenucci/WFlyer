# Governed Release Candidate Specification

## Purpose

Defines a traceable, approval-aware release artifact and safe Napoleon Git
branch handoff without assuming credentials or unobserved provider settings.

## Requirements

### Requirement: Candidate identity and integrity are immutable
Each release candidate SHALL identify one resolved commit, deployment
environment, normalized standalone archive, SHA-256 checksum, source ref,
workflow run and attempt, and creation time without including secrets. The
checksum proves the selected archive's integrity; it does not assert
byte-reproducible output from independent Next.js builds on floating hosted
environments.

#### Scenario: Candidate packaging succeeds
- **WHEN** the environment configuration and repository gates pass
- **THEN** the workflow uploads the checksummed artifact and a non-secret manifest tied to the resolved commit

### Requirement: Environment configuration is explicit and isolated
Staging and production candidates MUST use their matching GitHub Environment,
validate exactly one public build value
(`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) and five server runtime values
(`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`,
`CONTACT_RECIPIENT_EMAIL`, and `CONTACT_ALLOWED_ORIGINS`) without printing
values, expose only the public value to the environment-specific build, exclude
the five server values from the build and archive, and document that Napoleon
needs those five values through its approved runtime mechanism.

#### Scenario: Required configuration is missing
- **WHEN** any environment-scoped value required by the application is absent
- **THEN** candidate preparation fails with variable names only and uploads no deployable artifact

### Requirement: Deployable packaging is isolated from common CI
Pull requests and ordinary pushes SHALL run the production quality baseline
and all four indexing-mode builds without creating or uploading a deployable
standalone archive. Normalized environment-specific archive, checksum, and
manifest creation MUST remain exclusive to the manual workflow job protected
by the selected GitHub Environment.

#### Scenario: Common CI validates a revision
- **WHEN** a pull request or ordinary push runs the repository CI workflow
- **THEN** build, standalone smoke, Lighthouse, and indexing checks complete without packaging or uploading a release candidate

### Requirement: Production requires owner approval
Production candidate preparation and deployment MUST require a protected
`production` Environment, an approved main/tag revision, and Davi Benucci's
recorded homologation; pull requests and unapproved revisions SHALL never
deploy production.

#### Scenario: Production confirmation or protection is absent
- **WHEN** the request lacks the approved revision, exact confirmation, or required environment review
- **THEN** the workflow stops before accessing production secrets or packaging the candidate

### Requirement: Git branch handoff preserves the validated revision
The repository SHALL document Napoleon's owner-confirmed Git pull/build
integration, keep GitHub Actions read-only, and require the selected staging
branch head, complete CI result, and release manifest to identify the same full
commit SHA before the Napoleon staging application is attached or restarted.
The selected environment branch MUST remain at that SHA until Napoleon records
the same selected revision; an intervening branch advance SHALL invalidate the
handoff and require validation of the new head.
Staging MUST use `develop/site-institucional`. The workflow MUST NOT create or
push a deployment commit, invoke an undocumented webhook, API, SSH transport,
token, or DNS mutation.

#### Scenario: Audited staging branch is handed to Napoleon
- **WHEN** `develop/site-institucional` points to the reviewed SHA and the complete CI run for that SHA passes
- **THEN** the operator can select that repository and branch in Napoleon, record the same deployed SHA, configure the approved build/runtime settings, and begin public staging validation

#### Scenario: Staging branch advances before provider selection
- **WHEN** the environment branch head changes after validation but before Napoleon records the selected SHA
- **THEN** the operator aborts the handoff and repeats CI and candidate validation for the new full SHA

#### Scenario: Napoleon application settings remain unknown
- **WHEN** the branch integration is known but build, start, environment-scope, health, or rollback controls have not been inventoried
- **THEN** the repository publishes no invented command or credential and does not claim that staging has started

### Requirement: Rollback preserves the separate application
Release documentation SHALL identify the previous known-good institutional
revision, restore procedure, post-rollback smoke checks, contact-form fallback,
and explicit verification that `app.wflyer.com.br` remains operational.

#### Scenario: A release must be reversed
- **WHEN** staging or an authorized production deployment fails acceptance
- **THEN** operators can select the previous institutional revision without changing application or mail DNS records
