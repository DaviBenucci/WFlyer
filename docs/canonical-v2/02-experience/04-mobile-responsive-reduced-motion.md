# Responsive Presentation, Portrait Traversal and Reduced Motion

The current normative spatial authority is ADR-057 / ASM-IMP-DEC-020:
[Continuous Spatial Story](01-global-story-architecture.md), especially §§4–6
and §§9–10. This document maps predecessor vocabulary; it is not another model.

One semantic order remains Home → About → Services → Process → Projects →
Contact → Terminal, followed by the shared global footer. Portrait uses primary
native vertical input and readable local vertical staging on this same story;
the global camera may remain lateral. It is not a miniature desktop or a
separate vertical narrative. No horizontal swipe is required.

## Current conceptual classes

- `EXPANDED_LANDSCAPE`: high capacity; more simultaneous content.
- `COMPACT_LANDSCAPE`: constrained landscape; fewer simultaneous elements.
- `PORTRAIT_TRAVERSE`: narrow/tall; local reflow and sequential content stations.

Use the canonical contract for capability selection, token readability, input
mapping, interaction islands, reduced motion and responsive restoration. No
numerical class boundaries are approved by this documentation change.

## Transitional implementation vocabulary

ADR-055's `horizontal-enhanced`, `vertical-wide`, `vertical-compact` and `static`
remain the current implementation modes. Their existence does not force the
new classes into a one-to-one mode mapping or require vertical story geometry
whenever a simultaneous fan fails capacity. Capability, input axis, story
geometry and presentation remain separate concerns.

ADR-056's full horizontal fan and one vertical teaser are preserved implemented
Stage-1 behavior. The fan retains its full capacity/interaction/visit contracts
while it exists. Final Projects presentation across continuous spans is pending
implementation; route withdrawal and factual canonical data remain binding.

The prior vertical/static implementation is the usable fallback and historical
responsive evidence. Reduced motion preserves the same semantic story with
settled or short/immediate transitions, no required long camera travel, pinning
or scrub. Responsive changes restore local semantic position/focus, not just a
chapter's DOM top or a stale physical offset. Composer, seed and score semantics
remain unchanged. Frozen Gate-C/Phase-9 approval and HGA evidence are not rewritten.
