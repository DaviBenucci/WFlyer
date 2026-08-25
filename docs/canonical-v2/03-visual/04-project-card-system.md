# Project Card System

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

Click/Enter follows the semantic card link to an allowlisted
`/portfolio/[slug]` detail. Unknown or nonpublic records generate neither a
card nor a route/sitemap entry. Hover is preview only and never the exclusive
access path.

## Mobile

Use a staggered vertical stack. Do not copy the full desktop fan, require hover, or force horizontal carousel/swipe.

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
