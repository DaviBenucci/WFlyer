# ADR-031 — Native Scroll and Header Traversal

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Native vertical scroll is canonical progress. Desktop maps it to one horizontal master timeline. Header clicks animate the same scroll through intermediate chapters with distance-proportional duration capped at 3 seconds and abort on explicit user input.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
