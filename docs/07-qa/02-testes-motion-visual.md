# Testes de motion e regressão visual

## Golden screenshots

Para cada página principal:

- desktop claro;
- desktop escuro;
- mobile claro;
- mobile escuro;
- reduced motion quando houver diferença visual;
- estados interativos relevantes.

## Casos de direção

- Home mostra duas partituras saindo da clave;
- Home → Aplicação desloca narrativamente para a esquerda;
- Aplicação → Como funciona mantém direção à esquerda;
- Como funciona → Benefícios mantém direção à esquerda;
- Home → Empresa desloca narrativamente para a direita;
- Empresa → Serviços → Processo → Portfólio → Contato mantém direção à direita;
- links anteriores usam direção inversa;
- Back/Forward usa direção coerente quando o histórico é conhecido;
- rotas auxiliares usam transição neutra;
- link externo do app não executa transição de capítulo completa.

## Continuidade da pauta

- âncora de saída e entrada permanecem dentro da tolerância definida;
- segmento temporário não salta verticalmente;
- linhas mantêm espaçamento;
- notas não cruzam texto ou controles;
- overlay é removido ao concluir;
- falha de overlay não impede navegação;
- Benefícios termina à esquerda com barra dupla;
- Contato termina à direita com barra dupla.

## Header

- símbolo permanece centralizado;
- compasso ativo acompanha rota;
- header não salta entre temas;
- transição não desmonta o header;
- foco e `aria-current` são atualizados;
- menu mobile fecha e devolve foco.

## Tablet

- tilt respeita limite de 6°;
- controles não se deslocam dentro da tela;
- sair do componente retorna ao repouso;
- foco reduz tilt;
- processamento e resultado são determinísticos;
- reduced motion remove tilt e deslocamentos;
- nenhum request de rede é emitido;
- mobile não cria overflow horizontal.

## Canonical browser evidence contract

Repository-owned end-to-end, accessibility, motion, and visual suites use one
exact environment in common CI and the manual candidate browser gate:

- GitHub runner: `ubuntu-24.04`;
- job image: `mcr.microsoft.com/playwright:v1.62.0-noble`, pinned at
  `sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`;
- Node.js major: `24`;
- pnpm: `11.18.0`;
- `@playwright/test` and `playwright`: `1.62.0`;
- bundled image browsers at the image-declared
  `PLAYWRIGHT_BROWSERS_PATH`; no second `playwright install` is allowed.

The job retains the container's default user because GitHub Actions must mount
and operate on `GITHUB_WORKSPACE` and action directories. This is acceptable
for the trusted repository-owned loopback site. Before dependency installation,
the job verifies that the workspace, actual pnpm store, `.next`,
`test-results`, `playwright-report`, and `HOME` are writable. After dependency
installation, the fingerprint fails closed unless the operating system,
Node.js, pnpm, Playwright package, browser path, expected revisions, and every
package-derived browser installation marker match the contract. Playwright's
global `install --list` is deliberately not used because the official image's
build-time registry link is absent after image assembly; `install --dry-run`
provides the package-expected paths without downloading or modifying the
bundle. Local ad-hoc containers should use the invoking user's UID when the
runner-mounted GitHub directories are not involved.

Repository browser suites build with deterministic test configuration, run
`pnpm prepare:standalone`, and start
`node .next/standalone/server.js` at `http://127.0.0.1:3000`. Production-test
mode rejects any other origin and cannot reuse an existing development server.
The ordinary local authoring path may still use `next dev`. Public deployed
staging uses only `test:staging`, starts no local server, and receives no
internal checkpoint controller.

### Observed canonical result — 2026-08-05

This subsection preserves the execution record written on 2026-08-05. A
2026-08-10 audit found that the retained local `playwright-report` represented
an enumeration run with skipped tests and that the original expected/actual/
diff attachments were no longer present. The historical counts below therefore
must not be cited as current branch-head evidence. Current rerun results and
their limitations belong in `08-phase-09-release-readiness-report.md`.

The exact image was exercised at digest
`sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`.
The recorded CI fingerprint is Ubuntu 24.04.4 Noble, container user `root`,
Node.js 24.18.0, pnpm 11.18.0, Playwright 1.62.0,
`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`, Chromium 1234, Firefox 1538, and
WebKit 2336. Local source-mounted reproduction used the invoking UID while
preserving that image, browser bundle, standalone server, and screenshot
contract.

Thirty-four replacement baselines received the recorded repository-side
automated and agent-assisted comparison against the productive UI and approved
references:
7 Phase 06, 16 Phase 07, and 11 Phase 08. Human approval is not inferred from
that comparison and remains pending for Davi Benucci, as recorded in the
granular review table below. Five consecutive reduced-motion WebKit runs
passed. The complete zero-tolerance visual matrix then passed 291/291 twice
without changing any of the 84 baseline hashes. The final corrective browser
gate also passed E2E 318/318, axe 102/102, and motion 30/30 across Chromium,
Firefox, and WebKit with retries disabled.

The Storybook browser project runs test files sequentially. Parallel files were
reproduced exceeding a 1.66 GiB Docker memory limit and ended with exit 137
after completed assertions had passed; one browser worker retained all 63
assertions and completed in 17.5 seconds.

## Stabilization and assertion order

Visual media, viewport, and persisted theme are configured before navigation.
After navigation, the shared contract requires:

1. `document.readyState === "complete"`;
2. `document.fonts.ready` and `document.fonts.status === "loaded"`;
3. an explicit application marker for the requested state;
4. two consecutive `requestAnimationFrame` callbacks;
5. the same state assertion again immediately before capture.

Layout-sensitive Phase 07 checkpoints finish document/font readiness before
the GSAP handle is acquired and sought. The timeline is paused at the exact
authored time, stable frames are observed, and checkpoint-specific state is
asserted before capture. The reduced-motion Home case requires its terminal
Home marker, accessible/unlocked final controls, no overlay or active timeline,
loaded fonts, and no development portal.

Screenshot mechanics are centralized: animations are disabled, carets are
hidden, and `tests/visual/screenshot.css` hides only `nextjs-portal`. Productive
regions must never be masked. The repository uses Playwright's default exact
mismatch budget: every pixel that the standard comparator recognizes as
different fails the assertion. Explicit pixel-count or ratio allowances,
custom color thresholds, broad masks, and any other mismatch allowance are
prohibited. An intentional rendering change requires a separately reviewed
baseline; it must never be absorbed by comparison tolerance.

## Investigated failures and evidence status

The public failing artifact establishes the following facts:

- The WebKit reduced-motion Home initial attempt and first retry ended at 14
  mismatched pixels. The final retry changed through 14, 57, 2,565, and 2,636
  pixels and visibly captured the Next.js development `Compiling...` surface.
  The changing large region was therefore development-runtime UI, not a stable
  product image. All three pre-correction reduced-motion Home baselines also
  contained the black Next.js development indicator; they were invalid and
  were replaced.
- Each of the seven Firefox Phase 06 retained results is byte-identical across
  the initial attempt and two retries, with only 9–13 thresholded differences.
  Every failing location is on HTML text-glyph edges. The four native select
  arrow regions, focus outline, SVG score, and clef are pixel-identical; mobile
  and processing remain affected when tablet depth is already neutralized.
  This disproves native-select chrome and CSS 3D as causes. Cross-host font
  rasterization/antialiasing remains the high-confidence explanation, not a
  proven causal attribution. Canonical Noble regeneration establishes the
  stable expected rendering but cannot prove the host rasterizer's causality.

The approved native selects and production tablet depth must remain unchanged.
No screenshot-only 3D override is justified by this evidence. The motion and
E2E suites continue to own tilt, reduced-motion, mobile transform, keyboard,
and focus behavior.

## Baseline generation and review

Linux snapshots may be generated only inside the exact Noble image after the
production standalone server and readiness assertions pass repeatedly. For
each proposed image:

1. retain and inspect expected, actual, diff, trace/video, and error context;
2. reject development indicators, portals, overlays, missing controls, layout
   drift, or branding drift;
3. compare against the approved golden reference and normative page/motion
   specification;
4. update only the invalidated engine/state snapshot;
5. run the focused Phase 06/07/08 cases again without updates;
6. run reduced-motion WebKit at least five consecutive times;
7. run the complete visual matrix twice without `--update-snapshots` and
   confirm that neither run modifies the worktree.

### Granular replacement-baseline review

This table records the repository-side comparison between parent baseline
`5a4ea8529582931e287cc667ab436544c9a176ee`, committed revision
`065a077f9425943af8bc3ea821660bb356aef1da`, and the later governed processing-
capture correction included in the forward-only Phase 09 closure. The
automated status
refers only to inspected PNG evidence and agent-assisted visual classification.
It does not replace the required human decision.

Invalidation reasons:

- **R1 — Canonical Noble rerasterization:** the pinned Noble environment
  invalidated a prior host rendering through stable text-glyph,
  antialiasing, or low-delta edge differences; productive layout, controls,
  SVG content, and geometry remain unchanged.
- **R2 — Deterministic intro capture:** document/font readiness, stable frames,
  application state, and exact GSAP checkpoints replace timing-dependent
  capture; no productive visual redesign is intended.
- **R3 — Development contamination removal:** the prior reduced-motion Home
  baseline contained Next.js development UI; the standalone final Home removes
  only that development-only surface.
- **R4 — Authored contact validation state:** deterministic authored form
  validation replaces browser-native constraint popup or focus decoration;
  visible state evidence changes while production form implementation remains
  unchanged.
- **R5 — Productive processing depth restoration:** the historical Chromium
  processing spec alone wrote `transform: none !important` onto the tablet
  shell. Removing that test-only flattening restored the approved perspective
  already present in idle/result captures. Canonical expected/actual/diff
  inspection and ten identical focused actual captures justified replacing
  Chromium and the stable four-pixel Firefox edge evidence; WebKit remained
  unchanged.

| Snapshot path | Browser | Invalidation reason | Productive UI/code change | Automated review status | Human review status |
|---|---|---|---|---|---|
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-processing-chromium-linux.png` | Chromium | R5 | Evidence yes / code no — the capture now retains the same productive perspective as idle/result instead of a test-only flat transform. | Reviewed — expected/actual/diff inspected; ten pre-update actuals were byte-identical and matched approved tablet depth. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-focus-control-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; native focus, controls, and tablet geometry are unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-idle-dark-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; controls, SVG score, and tablet geometry are unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-idle-light-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; controls, SVG score, and tablet geometry are unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-mobile-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; mobile layout and controls are unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-processing-firefox-linux.png` | Firefox | R1 + R5 | No — productive processing state and tablet depth are unchanged; only four stable edge pixels invalidated the prior evidence. | Reviewed — expected/actual/diff inspected and ten pre-update actuals were byte-identical. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-reduced-motion-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; reduced-motion geometry is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase06-tablet.visual.spec.ts-snapshots/tablet-result-firefox-linux.png` | Firefox | R1 | No — rendering evidence only; result content and tablet geometry are unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-dark-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-expand-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-handoff-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive handoff composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-hero-opening-chromium-linux.png` | Chromium | R2 | No — deterministic capture only; non-visual readiness instrumentation does not restyle the Home. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-hero-opening-dark-mobile-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive mobile composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-hero-opening-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive Home composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-hero-opening-webkit-linux.png` | WebKit | R2 | No — deterministic capture only; productive Home composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-hold-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-lock-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-mobile-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive mobile intro is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-reduced-home-chromium-linux.png` | Chromium | R3 | No — only development UI is removed; productive final Home pixels are preserved. | Reviewed — development contamination removal confirmed. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-reduced-home-firefox-linux.png` | Firefox | R3 | No — only development UI is removed; productive final Home pixels are preserved. | Reviewed — development contamination removal confirmed. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-reduced-home-webkit-linux.png` | WebKit | R3 | No — only development UI is removed; productive final Home pixels are preserved. | Reviewed — development contamination removal confirmed. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-seed-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-start-firefox-linux.png` | Firefox | R1 + R2 | No — exact time zero replaces a 0.001-second capture; productive authored state is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/intro-wordmark-firefox-linux.png` | Firefox | R1 + R2 | No — capture/readiness and raster evidence only; productive intro composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-dark-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive form composition is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-field-error-chromium-linux.png` | Chromium | R4 | Yes / No — the captured UI state changes by removing native validation chrome; production form code is unchanged. | Reviewed — intentional state-capture difference identified. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-field-error-firefox-linux.png` | Firefox | R4 | Yes / No — the authored invalid-state borders become visible; production form code is unchanged. | Reviewed — intentional state-capture difference identified. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-field-error-webkit-linux.png` | WebKit | R4 | Yes / No — unstable focus decoration is removed from the captured state; production form code is unchanged. | Reviewed — intentional state-capture difference identified. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-idle-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive idle form is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-mobile-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive mobile form is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-provider-error-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive provider-error state is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-reduced-motion-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive reduced-motion form is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-submitting-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive submitting state is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-success-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive success state is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |
| `tests/visual/phase08-contact.visual.spec.ts-snapshots/contact-verified-firefox-linux.png` | Firefox | R1 | No — raster evidence only; productive verified state is unchanged. | Reviewed — no unauthorized drift detected. | Pending — Davi Benucci |

### Processing-capture correction — 2026-08-10

The pinned Noble image reproduced the pre-update processing actual ten times
per failing engine with byte-identical output: Chromium differed from its flat
historical baseline by 318 comparator pixels, while Firefox differed by four
edge pixels; WebKit was unchanged. After the inspected update, the single
three-engine update run passed 3/3 and a read-only validation passed 15/15
(`5/5` per engine, retries disabled). Exactly two of the 84 PNGs changed, none
were added or removed:

- Chromium: `d6ff9e25…` →
  `9399641a46c788c36fa9fa4c4c624a293b952778641e7ade10c109b06d4a0c22`;
- Firefox: `a4ee2966…` →
  `1cde6ce9121ca0f23ef55a52cd0a27838fef51bb697668500ab3a295f4875bdb`;
- WebKit remained
  `3ea90592bbac0c9f59efec0088d7e47121d252d107b3386ee49bd68cdd467840`.

The final unique replacement register therefore contains 35 paths: 8 Phase
06, 16 Phase 07, and 11 Phase 08. Repository-side inspection is complete;
Davi Benucci's human approval remains pending for every row.

### Final canonical browser sequence — 2026-08-10

The final read-only sequence used the official Playwright 1.62.0 Noble image
at digest
`sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`,
Ubuntu 24.04.4, Node.js 24.18.0, pnpm 11.18.0, the bundled Chromium 1234,
Firefox 1538, and WebKit 2336, the generated standalone production server,
one worker, and zero retries. No browser port was published. The 27-file test
and helper manifest had aggregate SHA-256
`5c8b522461d254dfd89104669a519255512037ac16797d2415a156c2a69761e8`.

| Gate | Result | Duration | Evidence boundary |
|---|---:|---:|---|
| Complete E2E | 318/318; 106 per engine | 593 s | Three engines, zero retries |
| Complete axe | 102/102; 34 per engine | 293 s | No critical or serious violation |
| Complete motion | 30/30; 10 per engine | 81 s | Motion ran before final visual evidence |
| Complete visual run 1 | 291/291; 97 per engine | 501 s | No update; 84-PNG manifest unchanged |
| Complete visual run 2 | 291/291; 97 per engine | 521 s | No update; 84-PNG manifest unchanged |
| Firefox branch-direction repeat | 10/10 | 58 s | Exact focused case, one worker |
| WebKit mobile/reduced final-barlines repeat | 5/5 | 24 s | Exact focused case, one worker |
| WebKit reduced-motion final Home repeat | 5/5 | 18 s | Exact focused case, one worker |

The 84-PNG manifest was byte-identical before and after every final stage at
`ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`.
The second complete visual log had SHA-256
`f4ca50e0f1ed8b94b13a0e7cd0cd685bd4c39ead0bbc91fd27c22ae8225577a5`,
and the complete sequence summary had SHA-256
`dce40df46fc2d5733ae771d614bd4e673c47e4dfc204bda3bdefa0df00f3f58a`.
This closes repository-side canonical browser proof. Exact-SHA GitHub Actions
and Davi Benucci's review of all 35 replacement paths remain separate gates.

Snapshots produced on a mutable host are diagnostic only. Canonical local proof
does not replace the exact-SHA GitHub Actions run. Motion runs before visual
comparison, and every non-cancelled browser job uploads complete
`playwright-report/` and `test-results/` trees.

## Testes manuais

- scroll rápido;
- trackpad;
- roda de mouse;
- teclado PageUp/PageDown;
- navegação Tab/Shift+Tab;
- resize contínuo;
- zoom 200% e 400%;
- mudança de orientação;
- dispositivos com GPU integrada;
- interrupção da transição por navegação rápida;
- aba oculta e retomada.

## Abertura da marca

- capturar frames definidos em `06-qa-animacao-entrada.md`;
- congelar timeline de maneira determinística;
- comparar lock com SVG oficial;
- validar bounding box do handoff para o header;
- testar skip, Escape, sessão, falha, aba oculta e movimento reduzido;
- confirmar que o handoff revela a Home bifurcada, não a cena histórica.
