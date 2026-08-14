# ADR-030 — Alternative A: Immersive Landing and Detailed Routes

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

The landing is a concise immersive story while detailed routes remain independent, indexable, accessible, and shareable. The landing does not need to contain all detailed content.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
