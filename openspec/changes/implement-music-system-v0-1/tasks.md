## 0. Canonicalization and baseline protection

- [ ] 0.1 Apply `CANONICAL_DECISION_DELTA.md` to the decision register without deleting historical ADR text
- [ ] 0.2 Merge normalized visual-library source/runtime assets and verify SHA-256/checksum metadata
- [ ] 0.3 Record the inspected legacy music files and prove the landing baseline before any new music-system code
- [ ] 0.4 Confirm no new dependency is required and no public route/infrastructure change is planned

## 1. Pure geometry core — Gate A foundation

- [ ] 1.1 Add strict music types, `staffSpace/staffStep` units, vectors, normalization, and numeric guards
- [ ] 1.2 Implement `StraightScorePath` and `CubicBezierScorePath` with point/tangent/normal functions
- [ ] 1.3 Implement coherent five-line staff offsets from one master guide
- [ ] 1.4 Implement pitch mapping and ledger-line generation above/below the staff
- [ ] 1.5 Implement isolated stem direction and approved Option-B beam-group stem resolution
- [ ] 1.6 Implement primary/secondary beam geometry and forward/backward hooks
- [ ] 1.7 Implement accidentals, treble key signatures `-7..+7`, ordinary barline, and final barline primitives
- [ ] 1.8 Add unit tests covering deterministic geometry, edge cases, and curved local frames

## 2. Glyph registry and renderer model

- [ ] 2.1 Register all eight approved glyph candidates with stable IDs, source/runtime paths, checksums, status, metrics, and anchor schemas
- [ ] 2.2 Reject missing required anchor/metric fields at runtime-approved status while permitting explicit draft-calibration state in the lab
- [ ] 2.3 Implement pure note/motif/score render models that reference glyph IDs rather than redraw paths
- [ ] 2.4 Implement every approved simple and beamed motif topology, including triplet bracket/3 and `S16_E8_S16` hooks
- [ ] 2.5 Add React/SVG presentation components that only render precomputed models and remain decorative/aria-hidden by default

## 3. Procedural Score Composer

- [ ] 3.1 Implement versioned seed hashing + internal deterministic PRNG with explicit golden tests
- [ ] 3.2 Implement semantic slot/reserved-zone model and stable chapter sub-seeds
- [ ] 3.3 Implement the exact rhythmic whitelist and motif-family metadata
- [ ] 3.4 Implement controlled pitch contours, landing pitch ranges, and ledger-frequency preference
- [ ] 3.5 Implement CALM/BALANCED/ACTIVE/TERMINAL profiles with weights kept as calibratable constants
- [ ] 3.6 Implement hard anti-repetition, terminal, reserved-zone, and pitch-bound constraints
- [ ] 3.7 Implement session-seed lifecycle and explicit dev/test seed injection without using `Math.random()`
- [ ] 3.8 Add 10,000-segment stress validation and deterministic deep-equality/hash tests

## 4. Music Visual Lab

- [ ] 4.1 Add a dev-only parent layout that returns 404 for `/__visual-lab/music/*` in production
- [ ] 4.2 Add glyph gallery and calibration UI with visible bounds/anchors and exportable draft payload
- [ ] 4.3 Add pitch/ledger/stem/flag fixtures
- [ ] 4.4 Add beam/mixed-hook/triplet fixtures
- [ ] 4.5 Add key-signature and barline fixtures
- [ ] 4.6 Add straight, gentle-arc, and gentle-S curved-score fixtures
- [ ] 4.7 Add composer controls for explicit seed/profile/chapter/theme/viewport and debug overlays
- [ ] 4.8 Ensure lab is absent from sitemap/public navigation and all public analytics surfaces

## 5. Gate A — geometry validation

- [ ] 5.1 Run focused/full unit tests, lint, typecheck, and dependency validation
- [ ] 5.2 Prove pure music modules have no React/DOM/GSAP imports
- [ ] 5.3 Review geometry fixtures for deterministic correctness
- [ ] 5.4 Mark Gate A complete only after all geometry requirements pass

## 6. Gate B — human calibration (blocking)

- [ ] 6.1 Produce draft `gLine`, notehead anchors, accidental centers, flag attachments, and nominal scales
- [ ] 6.2 Capture required calibration evidence at multiple scales/themes and in staff context
- [ ] 6.3 STOP and request explicit human review; Codex MUST NOT self-approve this task
- [ ] 6.4 After human approval, update manifest/runtime metrics/anchors with approval metadata and new checksums as applicable
- [ ] 6.5 Re-run geometry/renderer tests after approved calibration is committed

## 7. Gate C — visual composer validation

- [ ] 7.1 Validate all rhythmic motifs and triplet/hook behavior on straight and curved staffs
- [ ] 7.2 Validate every key signature and single-occurrence structural contract
- [ ] 7.3 Review multiple fixed seeds for each density profile and confirm controlled visual variation
- [ ] 7.4 Verify responsive semantic stability and reduced-motion semantic stability
- [ ] 7.5 Run accessibility checks and production-404 guard tests
- [ ] 7.6 Instrument and prove no composer/geometry/React work is tied to scroll animation frames
- [ ] 7.7 Record deterministic screenshot/evidence artifacts and explicit human Gate-C approval

## 8. Regression and repository completion

- [ ] 8.1 Prove public landing, navigation, legacy score, contact flow, and existing demo behavior are unchanged
- [ ] 8.2 Run repository `validate:dependencies`, `lint`, `typecheck`, unit tests, applicable Storybook/browser gates, and build
- [ ] 8.3 Validate the OpenSpec change strictly
- [ ] 8.4 Run `graphify update .` after structural changes and inspect relevant relationships
- [ ] 8.5 Update implementation/evidence documentation with verified facts and remaining future landing-integration work
- [ ] 8.6 Do not archive until Gates A/B/C and all required human approvals are complete
