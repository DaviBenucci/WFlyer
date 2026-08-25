# continuous-dual-score Specification

## ADDED Requirements

### Requirement: Each branch is perceptually continuous
The application and professional branches SHALL each use a continuous five-line score from Home origin to final barline.

#### Scenario: Segment boundary
- **WHEN** adjacent modular segments meet
- **THEN** entry/exit point, tangent, and staffSpace are compatible and no intentional seam is visible

### Requirement: Score supports responsive geometry
Horizontal and vertical layouts SHALL preserve semantic slot IDs and session composition while mapping to different ScorePaths.

#### Scenario: Projection changes
- **WHEN** one semantic branch score is presented in a different responsive mode
- **THEN** its semantic slot IDs and session composition remain unchanged while only its ScorePath projection changes

### Requirement: Terminal follows final barline
Each branch terminal SHALL begin after a deterministic final barline.

#### Scenario: A branch reaches its ending
- **WHEN** the last content chapter completes
- **THEN** the deterministic final barline precedes the branch terminal
