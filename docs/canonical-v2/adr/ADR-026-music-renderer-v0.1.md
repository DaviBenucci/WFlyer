# ADR-026 — W_Flyer Music Renderer v0.1

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Approved SVG glyphs define appearance; deterministic pure TypeScript geometry defines staff, pitch, stems, ledger lines, beams/hooks, accidentals, key signatures, and barlines on straight or cubic-Bezier ScorePaths. React only renders precomputed models.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
