# Project Card System

> **Current Stage-1 scope (ADR-056 / ASM-IMP-DEC-019):** the full fan below is
> active only in `horizontal-enhanced`. `vertical-wide` and `vertical-compact`
> display one noninteractive teaser chosen from canonical featured-public order.
> The prior route/link and mobile-stack contracts below are historical and
> superseded. No current project listing/detail route is defined.

## Desktop composition

3–5 highlighted project cards form a controlled hand/fan:

- partially overlapped;
- each remains identifiable;
- small stable rotations;
- predictable z-index order;
- sufficient overflow space for raised/focused cards.

## Interaction

Rest → hover/focus:

- moderate upward translation;
- rotation approaches zero;
- subtle scale increase;
- selected card moves to foreground;
- focus ring remains visible.

Click/Enter selects a card within the fan without navigation. Unknown or
nonpublic records generate neither a card nor a route/sitemap entry. Hover is
preview only and never the exclusive access path.

## Mobile

Use one static teaser. Do not mount the fan, require hover, or force horizontal
carousel/swipe. The horizontal capacity candidate may construct an inert fan
only for measurement, outside the active interaction/accessibility tree.

## Content anatomy

- project index/status;
- name;
- type/category;
- concise purpose;
- artwork/media;
- owner role/competencies;
- verified status.

Text remains semantic HTML; SVG is used for frame/art language, not flattened text.

## Initial projects

- W_Flyer;
- MSN Distribuidora;
- MSN Suprimentos.

No invented metrics or results.
