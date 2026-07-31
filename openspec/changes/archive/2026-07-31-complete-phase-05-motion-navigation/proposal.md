## Why

Phases 00–04 delivered every public route and the static double-score topology,
but Phase 05 still lacks the coordinated navigation lifecycle required by the
approved motion contracts. This change adds that lifecycle while preserving
deep links, truthful browser history, accessible focus, reduced motion, and the
native no-JavaScript fallback.

## What Changes

- Classify route changes as `adjacent-score`, `compressed-score-jump`,
  `home-pivot`, or `neutral`, with direction derived from the normative chapter
  manifest.
- Add a persistent site shell and decorative SVG transition layer that
  coordinate route exit, route commit, and route entry with GSAP.
- Intercept only eligible same-tab links between main chapters; retain native
  behavior for external, auxiliary, hash, download, modified, and new-context
  navigation.
- Coordinate browser Back/Forward, focus, scroll, route announcements, header
  state, theme changes, direct loads, and terminal branch states.
- Provide the approved mobile and reduced-motion variants, supersession,
  interruption cleanup, animation-error recovery, and the 1,100 ms safety
  timeout.
- Add deterministic, non-production transition checkpoints and cover the Phase
  05 scenario matrix with unit, component, Playwright, visual, accessibility,
  and performance evidence.

Out of scope: the Phase 06 interactive tablet, Phase 07 local reveals and brand
opening, Phase 08 contact delivery, Phase 09 deployment, and any modification to
the musical application at `app.wflyer.com.br`.

## Capabilities

### New Capabilities

- `score-transition-navigation`: deterministic topology, direction, visual
  score continuity, budgets, themes, terminal states, responsive variants,
  interruption, and fallback for route transitions.
- `accessible-navigation-lifecycle`: conservative link eligibility, deep links,
  truthful history, route announcements, focus, scroll, reduced motion,
  keyboard operation, and no-JavaScript behavior.

### Modified Capabilities

None. The main OpenSpec catalog does not yet contain these capabilities; both
are new behavioral contracts grounded in already approved repository documents.

## Verified Baseline

- The execution report records Phases 00–04 as complete with corresponding
  evidence.
- `src/config/chapters.ts` is the typed runtime mirror of the normative chapter
  manifest.
- Main routes expose semantic score metadata, `main#main-content`, and real
  links; direct routes and no-JavaScript navigation already render normally.
- GSAP, ScrollTrigger, and `@gsap/react` are already part of the locked stack.
- No persistent transition shell, transition provider, topology classifier,
  navigation interceptor, or Phase 05 route timeline exists at this baseline.

## Impact

Expected implementation areas are `src/app/layout.tsx`, a focused
`src/lib/motion/` domain, persistent transition components, and related tests.
No production dependency, public API, content model, external infrastructure,
analytics, or deployment operation is introduced.

Normative sources:

- `docs/00-governanca/05-registro-decisoes.md`
- `docs/00-governanca/07-adr-dupla-partitura-e-paginas-visuais.md`
- `docs/01-produto/05-requisitos.md`
- `docs/02-design/09-sistema-dupla-partitura.md`
- `docs/03-motion/01-arquitetura-gsap.md`
- `docs/03-motion/04-reduced-motion.md`
- `docs/03-motion/05-orcamento-performance.md`
- `docs/03-motion/07-transicoes-entre-capitulos.md`
- `docs/05-implementacao/11-manifesto-capitulos-partitura.yaml`
- `docs/07-qa/05-criterios-aceite.md`

Rollback removes the persistent transition coordinator and returns all real
links to their native behavior; routes, content, and static score rendering
remain operational.
