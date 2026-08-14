# ADR-039 — Designer-Owned Visual Asset Governance

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Source master, approved asset, and runtime representation are distinct. Stable IDs, manifest status, checksum, safety validation, semantic anchors, and no Codex redesign are mandatory.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
