# ADR-038 — Progressive Enhancement, Reduced Motion, and Performance

**Status:** APPROVED  
**Date:** 2026-08-14

## Context

The legacy v1 website architecture and the approved v2 target differ materially. This ADR records the owner-approved target.

## Decision

Motion failure degrades to the vertical document. Reduced motion removes horizontal pinning/autoplay/easter-egg animation. Owned motion resources clean up, Core Web Vitals are gates, and React does not render per scroll frame.

## Consequences

- Codex must implement the decision through the linear plan and required gates.
- Legacy code/tests that contradict this behavior are migration evidence, not target authority.
- Human visual/asset approvals remain blocking where referenced by the canonical documents.
