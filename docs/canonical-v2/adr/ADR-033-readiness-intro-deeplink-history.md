# ADR-033 — Readiness Intro, Deep Links, and History

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Initial Home/hash/history position is established before intro exit. The intro is readiness-driven, session-bounded, skippable, reduced-motion aware, and fail-open. Passive scroll replaces history state; successful header traversal pushes state.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
