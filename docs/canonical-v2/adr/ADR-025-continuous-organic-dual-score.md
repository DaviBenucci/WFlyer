# ADR-025 — Continuous Organic Dual-Score Narrative

**Status:** APPROVED  
**Date:** 2026-08-14
**Clarified:** 2026-08-24 — external Gate-C follow-up responsive functional approval and Phase-9 visual boundary

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Home is the common origin of two continuous organic five-line scores. Desktop branches travel in opposite horizontal directions. Mobile uses vertical document progression, but musical material remains in locally horizontal or gently inclined, left-to-right notation-safe zones joined by event-free connector zones; it does not become a literal vertical staff. Responsive projections share semantic IDs and composition. Modular segment entry/exit geometry must be compatible, and each branch ends with a conventionally oriented final barline inside a notation-safe terminal zone before its terminal.

The functional zoning contract and `maxNotationTangentAngleDeg=18` are approved.
The current piecewise returning connector is validation-only and noncanonical.
Final public Score Paths require separate Phase-9 `Organic Soft`/`Organic
Flowing` candidate evidence and explicit human approval against real layouts.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
