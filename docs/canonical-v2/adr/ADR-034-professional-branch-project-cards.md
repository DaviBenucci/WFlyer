# ADR-034 — Professional Branch and Project Cards

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Professional order is About, Services, Process, Projects, Contact. Process is not a required header item. Projects use accessible hand/fan cards on desktop and a staggered stack on mobile.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
