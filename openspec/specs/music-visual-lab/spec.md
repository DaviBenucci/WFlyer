# Music Visual Lab Specification

## Purpose

Provide a development-only calibration and validation surface for music glyphs,
geometry, responsive projections, and deterministic Composer output.

## Requirements

### Requirement: Music Visual Lab is development-only
The repository SHALL provide `/__visual-lab/music/*` calibration and validation routes in development and SHALL return 404 for those routes in production.

#### Scenario: Public production build requests the lab
- **WHEN** `/__visual-lab/music` or a child route is requested in production
- **THEN** the application returns 404 and exposes no calibration UI

### Requirement: Calibration does not mutate approved glyph paths
The Visual Lab SHALL expose bounds, scales, and semantic anchor controls and MAY export draft calibration metadata, but SHALL NOT edit the approved SVG path geometry.

#### Scenario: A reviewer adjusts and exports a draft anchor
- **WHEN** a calibration control changes an optical center or attachment anchor and exports draft JSON
- **THEN** only local draft metadata changes, every approved path/checksum remains byte-identical, and runtime status remains unapproved

### Requirement: Runtime approval is human-gated
Codex-generated calibration values SHALL remain `draft-calibration` until explicit human approval is recorded for every required glyph anchor and nominal metric.

#### Scenario: Codex reaches Gate B
- **WHEN** draft calibration fixtures are available and automated tests pass
- **THEN** implementation stops for human review instead of automatically changing asset status to runtime-approved

### Requirement: Visual Lab covers the complete v0.1 grammar
The lab SHALL provide fixtures for glyph scales/themes, pitch ladder, extended ledger lines, stems, flags, all whitelisted beam motifs, triplet bracket/3, key signatures -7..+7, final barline, straight/curved staffs, and seeded composer density profiles.

#### Scenario: A reviewer opens the Music Visual Lab fixture index
- **WHEN** the development-only index and its fixture routes are inspected
- **THEN** every required scale/theme, pitch/ledger, stem/flag, beam/triplet, key-signature/barline, path-shape, and seeded composer-profile fixture is reachable

### Requirement: Public experience is unchanged during isolated implementation
Until Gate C and later landing-migration approval, the new Music Visual Lab and renderer SHALL NOT alter public landing layout, existing score behavior, navigation, contact handling, or application-demo behavior.

#### Scenario: The isolated system is added before landing migration
- **WHEN** public routes and legacy score relationships are checked against the preserved Phase 0 baseline
- **THEN** no public module imports the new renderer or Visual Lab and the governed public regression suite remains unchanged

### Requirement: Final Gate-C approval preserves evidence authority
The final 2026-08-24 external human decision SHALL approve the reviewed
renderer and Composer values, responsive functional semantics,
`maxNotationTangentAngleDeg=18`, and the final `tupletNumeralSizeSp=0.85`
presentation. The approval SHALL be recorded separately from the original,
corrective-delta, and final-triplet bundles so historical evidence is not
overwritten.

#### Scenario: Final triplet evidence is generated
- **WHEN** the final named numeral-size change has automated coverage and deterministic captures
- **THEN** only `01-motif-matrix-light.png`, `02-motif-matrix-dark.png`, `10-triplet-detail-light.png`, and `11-triplet-detail-dark.png` are recaptured, while existing responsive evidence remains byte-identical

#### Scenario: Final human approval is recorded
- **WHEN** the external human reviewer approves the four final triplet captures and exact reviewed configuration
- **THEN** Gate C and task `7.7` may close with a dated authority manifest while public landing integration remains a separate future phase

#### Scenario: Validation connector evidence is reviewed
- **WHEN** responsive projection fixtures demonstrate continuity, safe offsets, event-free connectors, and semantic equivalence
- **THEN** those facts are accepted without promoting the fixture's piecewise returning curve aesthetic as the final public Score Path

#### Scenario: Future public Score Paths are considered
- **WHEN** Phase 9 prepares final responsive dual-score integration
- **THEN** `Organic Soft` and `Organic Flowing` candidates for both vertical modes and both themes are authored against real content zones and stop for separate human approval
