# ADR-037 — Branch Terminals and Footer Semantics

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Desktop has visual terminal/footer experiences at both score extremes after final barlines. Mobile has a professional visual ending/transition and one real global footer after the application ending. Data is shared.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
