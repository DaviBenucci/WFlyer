# W_Flyer semantic visual tokens

**Status:** NORMATIVE
**Canonical language:** English
**Dark-theme decision:** ADR-041, approved by external human Task-33 review on
2026-08-30

Tokens use the `--wf-` prefix. Material color changes require comparison with
the approved visual references, deterministic representative screenshots, and
updated golden references where those references are owned by the changed
surface.

## Canonical theme provenance and scope

The warm dark neutral palette and copper emphasis direction derived from the
approved Phase-9 Task-33 origin-review surface supersede the previous W_Flyer
dark neutral and general dark UI accent language. The light palette remains
unchanged. Purple/cobalt remain available where they are intrinsic to approved
W_Flyer brand and Music assets, but they no longer own general dark-theme text,
interaction, or ornament.

The approved dark-neutral provenance is:

- `#12100f`: warm near-black canvas;
- `rgb(29 26 24 / 92%)`: warm-charcoal panel/surface;
- `#f4ecdf`: ivory/off-white primary foreground;
- `#c1b9ad`: restrained warm muted foreground;
- `rgb(245 235 218 / 20%)`: low-contrast warm divider/border source.

The fixture supplies `#e79271` as the approved source for canonical dark UI
emphasis and `rgb(159 75 54 / 20%)` as the source for the dark Home atmospheric
falloff. Hover, active, subtle, and focus treatments derive systematically from
the copper emphasis token. The fixture does not independently supply status
colors, shadows, device chrome, or connector semantics; those roles retain
their existing owners and must not be falsely promoted from review diagnostics.

### Dark semantic mapping and classification

| Semantic token or role | Classification | Previous dark value | Fixture source | Final canonical dark value | Rationale |
|---|---|---|---|---|---|
| `--wf-bg` / page background / browser `theme-color` | `GLOBAL_THEME_NEUTRAL` | `#020b22` | `#12100f` | `#12100f` | Replaces the blue-heavy canvas with the approved warm near-black. Browser chrome projects this token; metadata is not a separate palette authority. |
| `--wf-surface` | `GLOBAL_THEME_NEUTRAL` | `#07132e` | `rgb(29 26 24 / 92%)` | `rgb(29 26 24 / 92%)` | Promotes the fixture panel surface exactly. |
| `--wf-surface-elevated` | `GLOBAL_THEME_NEUTRAL` | `#0b193a` | Derived from the panel and ivory foreground | `color-mix(in oklab, var(--wf-surface) 92%, var(--wf-text) 8%)` | Supplies subtle warm elevation without inventing another fixture literal. |
| `--wf-surface-muted` | `GLOBAL_THEME_NEUTRAL` | `#111f43` | Derived from the panel and canvas | `color-mix(in oklab, var(--wf-surface) 72%, var(--wf-bg) 28%)` | Keeps muted surfaces warm and lower than the primary surface. |
| `--wf-text` / primary foreground | `GLOBAL_THEME_NEUTRAL` | `#f7f4ff` | `#f4ecdf` | `#f4ecdf` | Replaces lavender-white with the approved ivory foreground. |
| `--wf-text-muted` | `GLOBAL_THEME_NEUTRAL` | `#c5c5dc` | `#c1b9ad` | `#c1b9ad` | Promotes the approved warm muted foreground. |
| Subtle foreground | `GLOBAL_THEME_NEUTRAL` | Contextual `--wf-text-muted` | `#c1b9ad` | `var(--wf-text-muted)` with component-owned opacity only where the content is decorative or disabled | Avoids an unnecessary duplicate token while retaining the approved warm muted source. |
| `--wf-border` | `GLOBAL_THEME_NEUTRAL` | `#2b3167` | `rgb(245 235 218 / 20%)` | `rgb(245 235 218 / 20%)` | Default low-contrast warm boundary. |
| Divider role | `GLOBAL_THEME_NEUTRAL` | Shared `--wf-border` | `rgb(245 235 218 / 20%)` | `var(--wf-border)` | Decorative dividers continue to share the low-contrast border token; no unnecessary alias is introduced. |
| `--wf-border-strong` | `GLOBAL_THEME_NEUTRAL` | No distinct token | Same ivory source, strengthened for perception | `rgb(245 235 218 / 38%)` | Used only where a boundary must be perceivable, including required control/form boundaries. |
| Input background | `GLOBAL_THEME_NEUTRAL` | `var(--wf-bg)` | `#12100f` | `var(--wf-bg)` | Existing form ownership automatically follows the approved canvas without a component literal. |
| Site/story header background | `GLOBAL_THEME_NEUTRAL` | Derived from old `--wf-bg` | `#12100f` | Site header `color-mix(in srgb, var(--wf-bg) 88%, transparent)`; story header `color-mix(in oklab, var(--wf-bg) 94%, transparent)` | Existing translucent header formulas now resolve from the warm canvas. |
| Site/story footer background | `GLOBAL_THEME_NEUTRAL` | Derived from old surfaces | Warm promoted surfaces | Site footer surface gradient; story footer `var(--wf-surface-muted)` | Footer ownership remains component-specific and derives only from shared warm surfaces. |
| `--wf-shadow-soft` | `GLOBAL_THEME_NEUTRAL` | `0 22px 60px rgb(0 0 0 / 0.34)` | No fixture override | `0 22px 60px rgb(0 0 0 / 0.34)` | Preserves the neutral shadow while the surfaces become warm. |
| `--wf-tablet-edge` | `GLOBAL_THEME_NEUTRAL` | `#10153a` | Derived from promoted warm surfaces | `color-mix(in oklab, var(--wf-surface) 82%, var(--wf-bg) 18%)` | Removes stale blue device chrome without inventing a new accent. |
| `--wf-tablet-reflection` | `GLOBAL_THEME_NEUTRAL` | `rgb(171 132 255 / 0.18)` | Derived from the ivory foreground | `color-mix(in srgb, var(--wf-text) 18%, transparent)` | Makes the reflection theme-neutral. |
| Neutral score/staff review foreground | `GLOBAL_THEME_NEUTRAL` | Component-specific | `#f4ecdf` fixture score | `var(--wf-text)` | A neutral score projection uses the foreground token; no duplicate score-neutral token is created. |
| `--wf-emphasis` | `CANONICAL_DARK_UI_ACCENT` | Purple roles split across `--wf-primary`, `--wf-accent`, and `--wf-note`-derived text | `#e79271` | `#e79271` | Canonical selective copper emphasis for dark UI text, interaction, and ornament. It is not a body foreground. |
| `--wf-emphasis-hover` | `CANONICAL_DARK_UI_ACCENT` | Purple primary hover | Derived from copper and ivory | `color-mix(in oklab, var(--wf-emphasis) 88%, var(--wf-text) 12%)` | Provides one systematic lighter hover/focus state. |
| `--wf-emphasis-active` | `CANONICAL_DARK_UI_ACCENT` | Purple primary active | Derived from copper and canvas | `color-mix(in oklab, var(--wf-emphasis) 88%, var(--wf-bg) 12%)` | Provides one systematic pressed state. |
| `--wf-emphasis-subtle` | `CANONICAL_DARK_UI_ACCENT` | Component-local purple washes | Derived from copper | `color-mix(in srgb, var(--wf-emphasis) 20%, transparent)` | Owns restrained ornamental washes without scattering literals. |
| `--wf-ui-ornament` | `CANONICAL_DARK_UI_ACCENT` | Purple/cobalt non-musical lines | Derived from copper | `var(--wf-emphasis)` | Separates UI ornament from intrinsic Music staff color. |
| `--wf-primary` / `--wf-primary-hover` / `--wf-primary-active` | `CANONICAL_DARK_UI_ACCENT` | `#7437ff` and purple-derived states | Copper emphasis family | `var(--wf-emphasis)` / `var(--wf-emphasis-hover)` / `var(--wf-emphasis-active)` | Routes filled controls and primary interaction through the approved warm system. |
| `--wf-accent` | `CANONICAL_DARK_UI_ACCENT` | `#a348ff` | `#e79271` | `var(--wf-emphasis)` | Routes general dark ornament and borders through copper. |
| `--wf-focus` / focus ring | `CANONICAL_DARK_UI_ACCENT` | `#b58cff` | Copper-derived hover state | `var(--wf-emphasis-hover)` | Keeps focus visible and consistent with the approved UI language. |
| `--wf-text-accent` / `--wf-accent-text` / `--wf-primary-text` / `--wf-link` | `CANONICAL_DARK_UI_ACCENT` | Purple note/primary/accent-derived text | `#e79271` | `var(--wf-emphasis)` through the existing aliases | Makes eyebrow, index, label, link, and other selective emphasis warm and AA-capable. |
| `--wf-home-atmosphere` | `CANONICAL_DARK_ATMOSPHERE` | Purple Home glow/haze | Origin warm falloff | `rgb(159 75 54 / 20%)` | Establishes warm brown/near-black depth without filters, blur layers, or geometry. |
| `--wf-glow-soft` | `CANONICAL_DARK_UI_ACCENT` | `0 0 28px rgb(126 55 255 / 0.28)` | No glow required | `none` | Removes the general purple/neon glow language. Copper subtle emphasis remains available through its dedicated token. |
| `--wf-on-primary` | `CANONICAL_DARK_UI_ACCENT` | `var(--wf-text)` | Contrast-derived | `var(--wf-bg)` | Dark foreground on copper passes AA; ivory on copper does not. |
| `--wf-score-primary` | `MUSIC_PRESENTATION` | Purple `--wf-note` | Warm ivory foreground | `var(--wf-text)` | Task 34 makes clefs, notes, stems, beams, accidentals, tuplets, ledgers, and principal barlines theme-aware instead of purple by default. |
| `--wf-score-muted` | `MUSIC_PRESENTATION` | Purple/cobalt `--wf-staff` | Warm muted foreground | `var(--wf-text-muted)` | Owns five-line staff, ordinary bars, and the thin final-bar stroke. |
| `--wf-score-accent` | `MUSIC_PRESENTATION` | No selective owner | Canonical copper | `var(--wf-emphasis)` | Copper is limited to key-signature and thick final-bar emphasis; it is not whole-score ink. |
| `--wf-note` / `--wf-staff` | `MUSIC_COMPATIBILITY_ALIAS` | `#933fff` / `#7b5dda` | Task-34 score roles | `var(--wf-score-primary)` / `var(--wf-score-muted)` | Keeps legacy consumers on the semantic Music presentation without retaining purple default notation. Purple/cobalt survives only inside immutable approved brand assets. |
| `--wf-danger` | `SEMANTIC_STATUS` | Component fallback `#a12b2b` | Not a fixture neutral | `#d45c5c` | Provides a dark-theme error role independent of pending/review orange. |
| `--wf-success` | `SEMANTIC_STATUS` | Component fallback `#23623b` | Not a fixture neutral | `#3f9e63` | Provides a dark-theme success role independent of review diagnostics. |

### Runtime ownership

| Role | Authoritative owner |
|---|---|
| Global light/dark semantic tokens and no-JavaScript fallback | `src/styles/tokens.css` |
| Browser light/dark color constants | `src/components/theme/theme-constants.ts` |
| Next.js viewport metadata projection | `src/app/layout.tsx` |
| Site and story header surface formulas | `src/components/header/site-header.module.css`; `src/components/story/story.module.css` |
| Site and story footer surface formulas | `src/components/footer/site-footer.module.css`; `src/components/story/story.module.css` |
| Contact input background, required boundary, and status consumers | `src/components/pages/contact/contact-form.module.css` |
| Public and Motion Lab dark Home atmospheric projection | `src/app/page.module.css`; `src/components/story-motion/motion-story-lab.module.css` |
| Task-34 score primary/muted/accent presentation | `src/styles/tokens.css`; `src/components/score/score.module.css` |
| Task-33 origin review-only diagnostic colors | `src/app/%5F_visual-lab/story/score-paths/score-path-origin-review.module.css` |

### Explicit non-promotion boundary

| Fixture/debug value or role | Classification | Rule |
|---|---|---|
| Dark origin status, notation-zone, and origin-marker use of `#e79271` | `DUAL_CLASSIFIED_BY_OWNER` | The literal is canonical only when projected through the production `--wf-emphasis` family. Its fixture-local status and geometry-marker semantics remain review-only and do not become public status semantics. |
| Dark origin connector cyan `#7fc5d7` | `REVIEW_ONLY` | Connector diagnostic only; not a theme or brand color. |
| Dark origin radial wash `rgb(159 75 54 / 20%)` | `DUAL_CLASSIFIED_BY_OWNER` | Canonical only as `--wf-home-atmosphere`; the fixture-local background remains part of the development review surface. |
| Light origin review values `#f4efe5`, `rgb(255 252 246 / 88%)`, `#625d55`, `#171513`, `#9f4b36`, `#295f73`, and `rgb(201 154 107 / 22%)` | `REVIEW_ONLY` | The light theme remains unchanged; the review fixture is not a replacement light palette. |
| Score calibration/debug overlays, including the default `--score-debug-color` | `DEBUG_ONLY` | Must remain isolated from public semantic color tokens. |

Pending-status labels remain `SEMANTIC_STATUS` only when implemented through a
dedicated public status token. A Task-33 pending label rendered with a local
review color remains `REVIEW_ONLY`; its presence never promotes that literal.

## Light theme

The light palette remains unchanged. Task 34 routes notation through explicit
primary, muted, and selective accent roles.

```css
:root,
[data-theme="light"] {
  --wf-bg: #f7f1e8;
  --wf-surface: #fffaf3;
  --wf-surface-elevated: #fffdf8;
  --wf-surface-muted: #eee2d4;
  --wf-text: #24180f;
  --wf-text-muted: #665548;
  --wf-emphasis: var(--wf-accent);
  --wf-emphasis-hover: var(--wf-primary-hover);
  --wf-emphasis-active: var(--wf-primary-active);
  --wf-emphasis-subtle: color-mix(in srgb, var(--wf-emphasis) 18%, transparent);
  --wf-ui-ornament: var(--wf-staff);
  --wf-home-atmosphere: transparent;
  --wf-primary: #4d280d;
  --wf-primary-hover: #633612;
  --wf-primary-active: var(--wf-primary-hover);
  --wf-accent: #9a6237;
  --wf-score-primary: var(--wf-text);
  --wf-score-muted: var(--wf-text-muted);
  --wf-score-accent: var(--wf-accent);
  --wf-staff: var(--wf-score-muted);
  --wf-note: var(--wf-score-primary);
  --wf-border: #ddc9b5;
  --wf-border-strong: var(--wf-border);
  --wf-focus: #75421f;
  --wf-text-accent: var(--wf-note);
  --wf-accent-text: var(--wf-accent);
  --wf-primary-text: var(--wf-primary);
  --wf-link: var(--wf-text);
  --wf-danger: #a12b2b;
  --wf-success: #23623b;
  --wf-shadow-soft: 0 18px 50px rgb(58 32 17 / 0.12);
  --wf-glow-soft: none;
  --wf-tablet-edge: #3a210f;
  --wf-tablet-reflection: rgb(255 255 255 / 0.28);
  --wf-on-primary: var(--wf-surface-elevated);
}
```

## Dark theme

```css
[data-theme="dark"] {
  --wf-bg: #12100f;
  --wf-surface: rgb(29 26 24 / 92%);
  --wf-surface-elevated: color-mix(
    in oklab,
    var(--wf-surface) 92%,
    var(--wf-text) 8%
  );
  --wf-surface-muted: color-mix(
    in oklab,
    var(--wf-surface) 72%,
    var(--wf-bg) 28%
  );
  --wf-text: #f4ecdf;
  --wf-text-muted: #c1b9ad;
  --wf-emphasis: #e79271;
  --wf-emphasis-hover: color-mix(
    in oklab,
    var(--wf-emphasis) 88%,
    var(--wf-text) 12%
  );
  --wf-emphasis-active: color-mix(
    in oklab,
    var(--wf-emphasis) 88%,
    var(--wf-bg) 12%
  );
  --wf-emphasis-subtle: color-mix(
    in srgb,
    var(--wf-emphasis) 20%,
    transparent
  );
  --wf-ui-ornament: var(--wf-emphasis);
  --wf-home-atmosphere: rgb(159 75 54 / 20%);
  --wf-primary: var(--wf-emphasis);
  --wf-primary-hover: var(--wf-emphasis-hover);
  --wf-primary-active: var(--wf-emphasis-active);
  --wf-accent: var(--wf-emphasis);
  --wf-score-primary: var(--wf-text);
  --wf-score-muted: var(--wf-text-muted);
  --wf-score-accent: var(--wf-emphasis);
  --wf-staff: var(--wf-score-muted);
  --wf-note: var(--wf-score-primary);
  --wf-border: rgb(245 235 218 / 20%);
  --wf-border-strong: rgb(245 235 218 / 38%);
  --wf-focus: var(--wf-emphasis-hover);
  --wf-text-accent: var(--wf-emphasis);
  --wf-accent-text: var(--wf-text-accent);
  --wf-primary-text: var(--wf-text-accent);
  --wf-link: var(--wf-text-accent);
  --wf-danger: #d45c5c;
  --wf-success: #3f9e63;
  --wf-shadow-soft: 0 22px 60px rgb(0 0 0 / 0.34);
  --wf-glow-soft: none;
  --wf-tablet-edge: color-mix(
    in oklab,
    var(--wf-surface) 82%,
    var(--wf-bg) 18%
  );
  --wf-tablet-reflection: color-mix(
    in srgb,
    var(--wf-text) 18%,
    transparent
  );
  --wf-on-primary: var(--wf-bg);
}
```

The no-JavaScript `prefers-color-scheme: dark` fallback must resolve to these
same values. Tailwind aliases and component styles consume the `--wf-*`
semantics; they do not duplicate this literal palette.

## Dimensions

```css
:root {
  --wf-header-height-desktop: 88px;
  --wf-header-height-mobile: 64px;
  --wf-content-max: 1440px;
  --wf-page-gutter: clamp(20px, 4vw, 72px);
  --wf-radius-sm: 8px;
  --wf-radius-md: 16px;
  --wf-radius-lg: 28px;
  --wf-radius-pill: 999px;
  --wf-staff-gap-desktop: 12px;
  --wf-staff-gap-mobile: 8px;
  --wf-transition-chapter: 720ms;
}
```

## Motion tokens

```css
:root {
  --wf-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --wf-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --wf-duration-fast: 180ms;
  --wf-duration-medium: 360ms;
  --wf-duration-chapter: 720ms;
  --wf-tablet-tilt-max: 6deg;
}
```

## Contrast rules

- Normal public text and interactive states must meet WCAG 2.2 AA.
- Staff colors may have lower contrast only when strictly decorative; any staff
  or boundary that conveys information uses the validated perceivable token.
- Links and buttons must not depend on color alone to communicate state.
- Visible focus uses an outline, offset, and theme-independent contrast.
- Copper is selective emphasis, never the normal body foreground.
- Copper-filled controls use the validated warm near-black foreground; ivory on
  copper is not an AA text pairing.
- Purple/cobalt remains only in immutable approved brand-asset bytes. Default
  notation consumes the warm semantic score roles in both themes.
- Required form/control boundaries use `--wf-border-strong`; decorative dividers
  continue to use `--wf-border`.
- Disabled states remain identifiable without relying on opacity alone.
- General dark UI uses no purple/neon glow. Any local atmospheric wash must not
  reduce the legibility of text, icons, or control borders.
