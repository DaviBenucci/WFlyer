# ADR-036 — Video-Based Application Demonstration

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

APP-04 uses muted/no-audio media, starts once only when active, ends on an exact final-frame image, and exposes one top-center replay control. Simulated UI remains inert.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
