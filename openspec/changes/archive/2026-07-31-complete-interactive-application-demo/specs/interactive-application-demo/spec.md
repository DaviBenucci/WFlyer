## Purpose

Provide a safe, accessible, and visibly illustrative tablet demonstration that communicates the Application concept without implementing or contacting the musical product.

## ADDED Requirements

### Requirement: Semantic local demonstration
The Application hero SHALL expose a real DOM interface with labelled origin and destination instrument and key controls, a native action button, an original SVG score preview, and a visible statement that the result is illustrative.

#### Scenario: Initial tablet is operable
- **WHEN** a visitor reaches `/aplicacao-wflyer`
- **THEN** the four labelled controls and the transpose action are keyboard operable and the initial Piano in Dó maior sample is visible

### Requirement: Deterministic state flow
The demonstration SHALL transition through idle, configured, processing, result, and reset behavior using only local deterministic data, with processing lasting between 500 and 900 milliseconds unless reduced motion is requested.

#### Scenario: Complete illustrative transformation
- **WHEN** the visitor chooses a destination and activates the transpose action
- **THEN** the action becomes busy, one illustrative result is announced politely, and a restore action becomes available without moving focus unexpectedly

#### Scenario: Restore initial state
- **WHEN** the visitor activates the restore action after a result
- **THEN** all fields, score markings, status copy, and action availability return to the initial state

### Requirement: No product behavior or visitor-data transport
The demonstration MUST NOT upload or read files, make fetch, XHR, WebSocket, or application API calls, persist selections, authenticate a visitor, execute OCR/OMR, or claim real musical transposition.

#### Scenario: Use remains local and private
- **WHEN** a visitor changes every field, completes the demonstration, and restores it
- **THEN** no network request, file access, storage write, or visitor-selection log is produced

### Requirement: Bounded and optional depth motion
Pointer-driven depth motion SHALL run only for precise-hover devices while the tablet is relevant, SHALL remain within six degrees per axis, and SHALL return to rest on pointer exit, control focus, document hiding, or component teardown.

#### Scenario: Precise pointer tilts safely
- **WHEN** a precise-hover pointer moves across the tablet shell
- **THEN** the shell eases toward a bounded transform while all controls retain their position within the screen plane

#### Scenario: Motion preference disables tilt
- **WHEN** `prefers-reduced-motion: reduce` is active or the viewport is mobile/touch-only
- **THEN** pointer tilt and animated result transitions are absent while every control and state remains functional

### Requirement: Responsive and accessible state communication
The tablet SHALL avoid horizontal overflow, retain at least 44 by 44 pixel touch targets on mobile, expose processing with `aria-busy`, announce the result once through a polite live region, and preserve visible focus and AA-compatible contrast.

#### Scenario: Mobile keyboard and touch use
- **WHEN** the demonstration is used at a 320 CSS-pixel viewport or with keyboard-only navigation
- **THEN** its controls remain visible in logical order, touch targets meet the minimum size, focus stays visible, and no horizontal page overflow occurs

### Requirement: Required visual evidence states
Phase 06 acceptance SHALL capture and compare idle light, idle dark, focused control, processing, result, reduced-motion, and mobile tablet states against the approved page language and component contract.

#### Scenario: Evidence suite completes
- **WHEN** the Phase 06 visual evidence command finishes
- **THEN** each required state has a deterministic screenshot and no unauthorized screenshot asset is shipped in the production interface
