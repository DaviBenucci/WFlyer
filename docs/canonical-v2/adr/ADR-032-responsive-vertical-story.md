# ADR-032 — Responsive Vertical Story

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Horizontal story is progressive enhancement. Vertical story is universal fallback and mobile order is professional first, application second, with Access W_Flyer last in the application sequence.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
