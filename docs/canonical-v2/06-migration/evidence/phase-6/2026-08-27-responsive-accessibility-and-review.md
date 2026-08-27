# Responsive, Accessibility, and Screenshot Review

Date: 2026-08-27

## Projection behavior

| Projection | Header result |
|---|---|
| `horizontal-enhanced` | proportional native-scroll traversal through Phase-5 geometry |
| `vertical-wide` | proportional native document-scroll traversal |
| `vertical-compact` | functional native document-scroll traversal; no horizontal pin |
| `static` / reduced motion | immediate semantic positioning, `0s`, no owned traversal |

Responsive activation thresholds were not changed or promoted to canonical
values. Rebuild cancels stale traversal, destroys only owned projection
resources, and restores the preserved semantic chapter.

## Accessibility

- The header remains a semantic `<nav>` of real hash links.
- Ordinary keyboard activation delegates to runtime; modifier activations keep
  native link behavior.
- Focus remains on the activating link after completion or cancellation.
- Exactly one active approved target exposes `aria-current="location"`.
- Focus visibility remains CSS-driven and does not depend on hover.
- Reduced motion keeps all targets functional and immediate.
- Phase-6 axe checks found no critical/serious violations or relevant
  `aria-hidden-focus` incomplete result in enhanced or reduced states across
  Chromium, Firefox, and WebKit.

## Reviewed captures

1. `01-header-home-enhanced-1536x900.png`
2. `02-header-professional-projects-1536x900.png`
3. `03-header-application-benefits-1536x900.png`
4. `04-header-professional-about-compact-390x844.png`
5. `05-header-application-benefits-reduced-1536x900.png`

Review result: all eight targets are readable; active emphasis is visible;
desktop and compact headers are unclipped; compact wrapping remains operable;
and reduced motion lands immediately. The translucent sticky header may overlay
the Phase-5 diagnostic inspector while scrolling. These development placeholder
captures are evidence only, not final visual goldens or approval of Phase-7/9
scene design.
