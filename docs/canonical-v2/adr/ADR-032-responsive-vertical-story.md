# ADR-032 — Responsive Vertical Story

**Status:** APPROVED  
**Date:** 2026-08-14
**Clarified:** 2026-08-24 — external Gate-C follow-up responsive functional approval and connector-aesthetic exclusion

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Horizontal story is progressive enhancement. Responsive presentation supports
`horizontal-enhanced`, `vertical-wide`, `vertical-compact`, and `static` modes;
selection can consider width, height, pointer/input capability, reduced-motion
preference, and effective layout capacity, while exact thresholds remain Motion
Lab calibration. Vertical document progression is the universal fallback, not
permission to rotate musical notation into a vertical staff. Every projection
preserves the same semantic score and uses left-to-right notation-safe zones plus
event-free connectors where required. Mobile order is professional first,
application second, with Access W_Flyer last in the application sequence.

The functional modes, semantic preservation, notation/connector zoning, and
`maxNotationTangentAngleDeg=18` are approved. Exact activation thresholds remain
calibration. The current connector fixture is not a final visual design; final
organic vertical Score Paths require the blocking Phase-9 human subgate.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
