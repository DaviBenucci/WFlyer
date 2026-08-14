# ADR-025 — Continuous Organic Dual-Score Narrative

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Home is the common origin of two continuous organic five-line scores. Desktop branches travel in opposite horizontal directions; mobile uses vertical/serpentine geometry with shared semantic IDs. Modular segment entry/exit geometry must be compatible, and each branch ends with a final barline before its terminal.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
