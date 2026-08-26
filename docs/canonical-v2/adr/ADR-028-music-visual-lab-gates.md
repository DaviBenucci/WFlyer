# ADR-028 — Music Visual Lab and Human Gates

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Runtime approval of glyph metrics/anchors requires Gate B human approval. Gate A validates geometry; Gate C validates multiple seeds, curved rendering, accessibility, determinism, and performance. Public landing integration is forbidden before all gates.

Gate B was approved on 2026-08-15. Gate C was approved by final external human
review on 2026-08-24 for the isolated Music System v0.1 foundation. The approval
canonicalizes the reviewed renderer/Composer values, final triplet evidence,
responsive semantics, and `maxNotationTangentAngleDeg=18`. It does not approve
responsive activation thresholds, the current connector aesthetic, public
landing integration, or the Phase-9 organic Score Path decision.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical
  documents, including the separate Phase-9 Score Path subgate.
