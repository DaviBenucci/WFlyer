# Music System v0.1 Gate C — conditional human decision

**Decision date:** 2026-08-24  
**Decision:** `approve-with-one-final-named-renderer-change-and-one-phase-9-deferred-visual-requirement`  
**Decision authority:** external human reviewer / repository owner  
**Gate C:** pending final triplet optical approval  
**OpenSpec task 7.7:** incomplete

## Approved Gate-C scope

The reviewer accepted the existing automated contracts, semantic responsive
projection, glyph calibration, renderer and Composer behavior, accessibility,
performance, isolation, immutable baselines, and previously proposed Gate-C
values subject to the final triplet correction below.

The responsive functional contract is approved:

- one semantic composition is projected through `horizontal-enhanced`,
  `vertical-wide`, `vertical-compact`, and `static` modes;
- notation-safe zones read left-to-right and contain musical events;
- connector zones remain event-free;
- clef and conventional notation orientation remain upright;
- responsive mode, resize, and reduced motion do not recompose semantics;
- `maxNotationTangentAngleDeg=18` is approved.

Responsive activation thresholds remain noncanonical Motion Lab calibration.

## Final named triplet correction

Only `tupletNumeralSizeSp` changes from `0.75` to `0.85`.

The following values remain exactly unchanged:

- `tupletNumeralSideGapSp=0.18`;
- `bracketClearanceSp=0.65`;
- `bracketEndCapSp=0.30`;
- `bracketThicknessSp=0.07`.

The triplet remains exactly three eighth notes, one primary beam, one split
bracket, and a centered numeral `3`. The central opening remains
`renderedNumeralWidth + 2 * tupletNumeralSideGapSp`, centered from the complete
beam-group span. Task `7.7` remains incomplete until the four affected images
are recaptured and `0.85` receives final human optical approval.

## Responsive connector boundary

The current piecewise returning connector geometry is accepted only as a
validation-only noncanonical responsive projection fixture. It proves
continuity, safe five-line offsets, event-free connectors, notation orientation,
and semantic equivalence. It is not the final mobile design or a canonical
public Score Path aesthetic.

## Phase-9 deferred human requirement

Phase 9 must author `Organic Soft` and `Organic Flowing` candidates for both
`vertical-wide` and `vertical-compact`, each in light and dark. They must be
authored against real chapter and reserved-content layouts and must stop for
explicit human Score Path approval before public integration.

This decision does not authorize Phase 2, Phase 9 implementation, landing
integration, archival, staging, deployment, SVG edits, Gate-B calibration
changes, Composer changes, or committed-snapshot updates.
