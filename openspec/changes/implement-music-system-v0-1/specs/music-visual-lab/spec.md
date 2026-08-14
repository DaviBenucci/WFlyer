## ADDED Requirements

### Requirement: Music Visual Lab is development-only
The repository SHALL provide `/__visual-lab/music/*` calibration and validation routes in development and SHALL return 404 for those routes in production.

#### Scenario: Public production build requests the lab
- **WHEN** `/__visual-lab/music` or a child route is requested in production
- **THEN** the application returns 404 and exposes no calibration UI

### Requirement: Calibration does not mutate approved glyph paths
The Visual Lab SHALL expose bounds, scales, and semantic anchor controls and MAY export draft calibration metadata, but SHALL NOT edit the approved SVG path geometry.

### Requirement: Runtime approval is human-gated
Codex-generated calibration values SHALL remain `draft-calibration` until explicit human approval is recorded for every required glyph anchor and nominal metric.

#### Scenario: Codex reaches Gate B
- **WHEN** draft calibration fixtures are available and automated tests pass
- **THEN** implementation stops for human review instead of automatically changing asset status to runtime-approved

### Requirement: Visual Lab covers the complete v0.1 grammar
The lab SHALL provide fixtures for glyph scales/themes, pitch ladder, extended ledger lines, stems, flags, all whitelisted beam motifs, triplet bracket/3, key signatures -7..+7, final barline, straight/curved staffs, and seeded composer density profiles.

### Requirement: Public experience is unchanged during isolated implementation
Until Gate C and later landing-migration approval, the new Music Visual Lab and renderer SHALL NOT alter public landing layout, existing score behavior, navigation, contact handling, or application-demo behavior.
