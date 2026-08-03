## Purpose

Prevents non-production builds from entering search indexes while preserving
the approved public discoverability contract for production releases.

## ADDED Requirements

### Requirement: Staging is non-indexable at independent layers
A staging build SHALL disallow crawling through `robots.txt`, emit noindex and
nofollow metadata, and send an `X-Robots-Tag` response header for public routes.

#### Scenario: A staging candidate is built
- **WHEN** the explicit deployment environment is `staging`
- **THEN** HTML, `robots.txt`, and response headers independently instruct compliant crawlers not to index or follow the site

### Requirement: Production remains explicitly indexable
A production build SHALL expose the approved sitemap, allow public crawling
outside `/api/`, and omit staging-only noindex instructions.

#### Scenario: A production candidate is built
- **WHEN** the explicit deployment environment is `production`
- **THEN** public metadata and `robots.txt` remain indexable while `/api/` remains disallowed

### Requirement: Unknown deployment environments fail safe
An absent or unsupported deployment environment MUST behave as non-production
for indexing and MUST fail release-candidate validation.

#### Scenario: Environment input is absent or invalid
- **WHEN** a release workflow cannot prove `staging` or `production`
- **THEN** it stops before packaging and the application does not become accidentally indexable as production
