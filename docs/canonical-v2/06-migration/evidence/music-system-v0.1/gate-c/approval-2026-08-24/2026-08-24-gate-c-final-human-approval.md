# Music System v0.1 Gate C — final external-human approval

**Decision:** `APPROVED`  
**Decision date:** 2026-08-24  
**Authority type:** `external-human-review`  
**Authority role:** repository owner  
**Scope:** isolated W_Flyer Music System v0.1 Gate C only

## Final decision

The external human reviewer completed the final optical review of the Gate-C
evidence, including the four final triplet captures, and approved the isolated
Music System v0.1 foundation for future landing integration. This record is the
canonical decision authority for OpenSpec task `7.7`.

Gate-B-approved glyph metrics, anchors, path geometry, checksums, and down-flag
transform remain unchanged. Their authority remains the 2026-08-15 Gate-B
record at
`docs/canonical-v2/06-migration/evidence/music-system-v0.1/gate-b/2026-08-15-gate-b-calibration-review.md`.

## Canonical triplet contract

The following values are approved exactly:

- `tupletNumeralSizeSp = 0.85`;
- `tupletNumeralSideGapSp = 0.18`;
- `bracketClearanceSp = 0.65`;
- `bracketEndCapSp = 0.30`;
- `bracketThicknessSp = 0.07`.

`E8_TRIPLET_3` contains exactly three eighth notes, one primary beam, one split
tuplet bracket, and the numeral `3`. The numeral is centered using the complete
beam-group span. The bracket opening is
`renderedNumeralWidth + 2 * tupletNumeralSideGapSp`; it does not collide with
the numeral. The result is approved for stem-up and stem-down presentation on
straight, gentle-arc, and gentle-S ScorePaths with equivalent light/dark
behavior.

The final approved triplet presentation is represented by:

- `../final-triplet-2026-08-24/01-motif-matrix-light.png`;
- `../final-triplet-2026-08-24/02-motif-matrix-dark.png`;
- `../final-triplet-2026-08-24/10-triplet-detail-light.png`;
- `../final-triplet-2026-08-24/11-triplet-detail-dark.png`.

## Other approved Gate-C values

All unchanged renderer optical tokens and the complete four-profile Composer
configuration in the reviewed Gate-C configuration are approved within the
Music System v0.1 scope. The exact immutable source, JSON pointers, checksum,
and final triplet overlay are recorded in
`gate-c-approved-evidence-manifest.v1.json`. The note flag transform contained
in that configuration remains inherited Gate-B authority rather than a new
Gate-C approval.

## Responsive approval

The following responsive semantics are approved:

- semantic composition is independent from physical projection;
- supported conceptual modes are `horizontal-enhanced`, `vertical-wide`,
  `vertical-compact`, and `static`;
- notation-safe composition zones contain musical events and read
  left-to-right;
- connector zones are event-free;
- treble clef geometry remains upright and unmirrored;
- the final barline remains conventionally oriented;
- responsive projection and resize do not change seed, motif IDs/order,
  durations, pitches/staffSteps, contour metadata, semantic slots, reserved
  slots, key-signature configuration, or musical meaning;
- reduced motion preserves the same semantic composition;
- `maxNotationTangentAngleDeg = 18`.

Responsive activation thresholds remain noncanonical calibration parameters.
The current connector geometry remains classified exactly as:

`VALIDATION-ONLY NONCANONICAL RESPONSIVE PROJECTION FIXTURE`

It proves continuity, safe five-line offsets, conventional orientation,
event-free connector behavior, and semantic equivalence. It is not the final
public mobile/tablet Score Path aesthetic.

## Evidence authority and history

The original Gate-C candidate, the `delta-2026-08-17` correction bundle, and the
`final-triplet-2026-08-24` bundle remain immutable historical evidence. Their
embedded pending/draft statuses truthfully describe the time when each artifact
was captured; this later decision and its approved-evidence manifest supersede
those statuses without changing the files.

The approval chain is:

```text
original Gate-C candidate
  -> superseded where corrected by delta-2026-08-17
  -> delta triplet-size evidence superseded by final-triplet-2026-08-24
  -> final triplet artifacts approved by this external-human decision
```

## Explicit boundary

This approval does not approve responsive activation thresholds, final public
Score Path control points, the current connector aesthetic, landing-specific
geometry, landing integration, staging, deployment, production, Napoleon,
Cloudflare, DNS, or `app.wflyer.com.br`.

Before public responsive dual-score integration, Phase 9 must create `Organic
Soft` and `Organic Flowing` candidates for `vertical-wide` and
`vertical-compact`, each in light and dark and authored against the real chapter
layouts and reserved zones. That subgate remains blocked on separate explicit
human approval.

Final isolated-foundation status:

`Music System v0.1 — APPROVED FOR FUTURE LANDING INTEGRATION`
