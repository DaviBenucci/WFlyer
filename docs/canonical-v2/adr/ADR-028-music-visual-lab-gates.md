# ADR-028 — Music Visual Lab and Human Gates

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Runtime approval of glyph metrics/anchors requires Gate B human approval. Gate A validates geometry; Gate C validates multiple seeds, curved rendering, accessibility, determinism, and performance. Public landing integration is forbidden before all gates.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
