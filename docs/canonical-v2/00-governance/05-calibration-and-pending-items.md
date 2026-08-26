# Calibration and Pending-Asset Register

## Calibration parameters

These rules are approved; exact values are not yet canonical:

- horizontal-story eligibility breakpoint/height/pointer conditions;
- mobile active-chapter threshold;
- APP-04 mobile activation threshold;
- exact branch/chapter timeline weights;
- exact Score Path control points and segment lengths;
- final motion eases/durations below approved caps.

Codex may propose values in a Visual/Motion Lab. Human approval is required before final status.

## Approved calibration records

- Music glyph nominal sizes and required anchors passed external human Gate B review
  on 2026-08-15 and are canonical in
  `docs/canonical-v2/manifests/calibration-register.v2.yaml` and
  `docs/design-reference/visual-library/manifest.json`.
- The down-flag transform is approved as `mirrorX=false`, `mirrorY=true`, and
  `rotationRadians=0`.
- The final 2026-08-24 external Gate-C review approved the reviewed Composer
  weights, renderer optical tokens, responsive functional semantics,
  `maxNotationTangentAngleDeg=18`, and the final triplet presentation.
- Canonical triplet values are `tupletNumeralSizeSp=0.85`,
  `tupletNumeralSideGapSp=0.18`, `bracketClearanceSp=0.65`,
  `bracketEndCapSp=0.30`, and `bracketThicknessSp=0.07`.
- Responsive activation thresholds remain calibration values. The current
  piecewise returning connector is validation-only and noncanonical.

## Gate-C review record

- External human review on 2026-08-17 returned
  `approve-with-two-named-changes`.
- External human follow-up review on 2026-08-24 accepted the corrected
  responsive functional behavior and requested one final named change:
  `tupletNumeralSizeSp: 0.75 -> 0.85`.
- The four affected triplet images were recaptured in the isolated 2026-08-24
  evidence bundle. Final external human optical review on 2026-08-24 approved
  that result, closed Gate C, and supplied the evidence for OpenSpec task `7.7`.
- Historical evidence remains immutable. The current connector curve aesthetic
  is not approved as a final public Score Path.
- The final decision record and approved-evidence manifest are under
  `docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-c/approval-2026-08-24/`.

## Phase-9 Score Path pending approval

Final public responsive Score Paths are a blocking Phase-9 human visual item.
Phase 9 must produce `Organic Soft` and `Organic Flowing` candidates for both
`vertical-wide` and `vertical-compact`, in light and dark, against the real
chapter and reserved-content layouts. Responsive activation thresholds and exact
final control points remain noncanonical until their respective approvals.

## Pending assets

- W_Flyer Persona master SVG and rig;
- APP-04 WebM, MP4, poster, final-frame image;
- final project artwork/screenshots where approved;
- optional scene-specific SVG elements not included in the music glyph library.

## Pending editorial review

Public pt-BR copy may be implemented from the approved semantic intent and existing drafts, but final marketing/legal wording requires owner review. Legal documents retain their approved pt-BR authority.
