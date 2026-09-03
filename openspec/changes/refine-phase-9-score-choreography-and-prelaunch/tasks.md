## 1. Governance and canonical contracts

- [x] 1.1 Add the parent Phase-9 prose blocker, ADR-043, plan/handoff status, and in-place canonical owner updates; verify Task 34 remains checked, Task 35 remains unchecked, and the historical Task-34 evidence digest is unchanged
- [ ] 1.2 Update the story chapter manifest and public content for the explicit semantic header plus PRELAUNCH state; verify manifest/content unit tests cover Lançamento, Processo, hidden Demonstration, and no unavailable access action

## 2. Launch-interest server boundary

- [ ] 2.1 Implement the strict four-field schema, 4 KiB body boundary, host/origin checks, request IDs, dedicated Turnstile action, and generic no-store responses; verify focused domain and route rejection tests pass
- [ ] 2.2 Implement bounded hashed-key process-local rate limiting and logical registration/deduplication without raw-address storage; verify window, bound, retry, duplicate, and restart-limitation contracts in pure tests
- [ ] 2.3 Implement fixed sequential operational/acknowledgment delivery with stable logical idempotency, deadlines, and honest partial success; verify operational failure prevents acknowledgment and acknowledgment failure preserves registration
- [ ] 2.4 Implement escaped W_Flyer HTML/text transactional templates and dev-only previews; verify fixed recipients/subjects, machine fields, palette/layout markers, injection resistance, no tracking pixel, and production isolation

## 3. PRELAUNCH experience

- [ ] 3.1 Implement the typed PRELAUNCH/LIVE seam and replace the unavailable access action with the purpose-limited form; verify current scene rendering and future LIVE branch component tests
- [ ] 3.2 Implement all ten explicit form states, Turnstile lifecycle/cleanup, accessible validation/live feedback, Privacy Policy link, and honest acknowledgment outcome; verify component and axe coverage passes

## 4. Header, footer, and scene semantics

- [ ] 4.1 Wire the explicit semantic header lists and stable timeline-label mapping; prove pointer/keyboard activation, exact scene, hash/history result, active item, and tab order for all ten entries plus existing native-scroll duration, cancellation, and no-teleport contracts
- [ ] 4.2 Remove only the immersive motion route's duplicate appended visual footer and integrate one semantic mobile close into the Application terminal; verify standalone/internal footer regressions remain green
- [ ] 4.3 Add explicit scene exclusion/interaction markers for Persona reservation, shared card interaction, Projects visits, Contact, tablet, and launch form; verify foreground/pointer/keyboard ownership in component tests

## 5. Projection choreography

- [ ] 5.1 Move the common origin to the lower Home corridor and scale the single approved treble clef scenographically per mode; verify one asset, no mirror/rotation, coincident origin, dual departures, and Home exclusion evidence
- [ ] 5.2 Implement Professional About, measured Services lead-in/expanded/lead-out, restrained Process, rendered-bound-driven three-visit Projects, Contact, and terminal horizontal recipes; verify content clearance, event-free unsafe geometry/connectors, and physical final-barline termination
- [ ] 5.3 Implement Application Overview, measured How It Works lead-in/expanded/lead-out, calm Benefits, protected Demonstration, lower-corridor Launch, and terminal recipes; verify negative-space routing, tablet/form exclusions, and physical final-barline termination
- [ ] 5.4 Apply responsive simplifications and variable staff-envelope presentation without changing semantic composition; verify all four modes have zero path/staff intersections, notation tangent maximum at most 18 degrees, connector events zero, progressive opacity/spread, and unchanged fingerprints
- [ ] 5.5 Classify every non-terminal chapter exit as `VALID_MEASURE_BOUNDARY` or `NOT_A_MEASURE_BOUNDARY`; render one ordinary barline only for proven valid boundaries and report all others as `CHAPTER_BARLINE_REQUIRES_COMPOSITION_DECISION` without changing Composer output or fingerprints

## 6. Focused integration and regression

- [ ] 6.1 Add browser coverage for all required choreography, header, footer, launch-interest outcomes, keyboard operation, reduced motion, hydration, and responsive modes; verify affected Chromium, Firefox, and WebKit runs with retries/skips reported
- [ ] 6.2 Run affected lint, typecheck, unit, Storybook, browser, accessibility, build, immutable asset/manifest, and strict OpenSpec gates; record exact counts and failures honestly

## 7. Human-review evidence

- [ ] 7.1 Capture and inspect the 13 required dark desktop scene frames, 9 Services/How/Projects diagnostic frames, plus representative light and compact regressions from deterministic URLs; verify every image is readable and matches its scene contract
- [ ] 7.2 Create the new Phase-9 refinement evidence bundle with manifests, commands, results, URLs, screenshots, and checksums while preserving the Task-34 bundle byte-for-byte
- [ ] 7.3 Stop for explicit external human visual acceptance before completing this refinement, starting parent Task 35, or claiming Gate 9 PASS
