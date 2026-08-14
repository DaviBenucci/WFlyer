# ADR-027 — Seeded Procedural Score Composition

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

A versioned session seed selects only whitelisted rhythmic motifs and pitch contours. Same semantic inputs yield the same score across reload/theme/responsive/reduced motion. No Math.random and no free music generation.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
