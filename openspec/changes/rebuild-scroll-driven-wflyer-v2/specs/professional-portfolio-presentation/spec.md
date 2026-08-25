# professional-portfolio-presentation Specification

## ADDED Requirements

### Requirement: Personal professional positioning
The site SHALL present the owner’s work/services without claiming a company/team structure.

#### Scenario: Professional copy is presented
- **WHEN** a visitor reads the professional branch
- **THEN** the copy uses personal professional positioning without invented company or team claims

### Requirement: Approved professional sequence
The landing SHALL present About, Services, Process, Projects, and Contact in order.

#### Scenario: The vertical professional branch renders
- **WHEN** the landing is presented as a normal vertical document
- **THEN** About, Services, Process, Projects, and Contact occur once in that exact order

### Requirement: Accessible project cards
Desktop project cards SHALL form a readable hand/fan and provide equivalent hover/focus selection. Mobile SHALL use a staggered vertical stack.

#### Scenario: A project is reached without hover
- **WHEN** a keyboard or touch user reaches an authorized project
- **THEN** its identity and destination remain available without requiring hover or a horizontal carousel

### Requirement: Phase-3 public content is a typed independent domain
Chapter copy, detailed-route associations, SEO metadata, services, projects,
and publication status SHALL be represented by typed semantic content that does
not depend on layout coordinates, GSAP progress, or ScorePath geometry.

#### Scenario: A detailed route renders without the immersive story
- **WHEN** a visitor opens a Phase-3 public route directly or with motion unavailable
- **THEN** its typed semantic content, single page heading, metadata, and navigation render without story-motion or score-geometry state

### Requirement: Current-release professional routes remain stable
The current-release professional routes SHALL be `/sobre`, `/servicos`, the
four approved service-detail paths, `/processo`, `/portfolio`, authorized
`/portfolio/[slug]` project details, and `/contato`. Public labels SHALL use
`Projetos`, while any future migration away from `/portfolio` requires separate
owner approval plus redirect and SEO evidence.

#### Scenario: A preferred or retained professional URL is opened directly
- **WHEN** a visitor opens a current-release professional URL directly
- **THEN** readable content is returned with canonical metadata and without exposing a company narrative

### Requirement: Project publication fails closed
Only explicitly public project records SHALL appear in listings, static
generation, sitemap output, and dynamic detail routes. The initial public
allowlist SHALL contain only W_Flyer, MSN Distribuidora, and MSN Suprimentos.

#### Scenario: A project slug is unknown or unpublished
- **WHEN** a visitor requests a nonexistent or nonpublic project slug
- **THEN** the route returns the normal non-indexable 404 and does not disclose the record

### Requirement: Contact conversion remains protected
Phase-3 content and route work SHALL retain the existing Contact Route Handler,
server validation, origin/content-type/size checks, honeypot, Turnstile,
provider boundary, no-persistence rule, safe failures, and duplicate-submit
protection.

#### Scenario: Contact delivery fails after valid input
- **WHEN** a provider or anti-abuse integration rejects a valid submission
- **THEN** the form returns safe feedback, preserves recoverable user input, and does not navigate away automatically
