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

The exact image was exercised at digest
`sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`.
The recorded CI fingerprint is Ubuntu 24.04.4 Noble, container user `root`,
Node.js 24.18.0, pnpm 11.18.0, Playwright 1.62.0,
`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`, Chromium 1234, Firefox 1538, and
WebKit 2336. Local source-mounted reproduction used the invoking UID while
preserving that image, browser bundle, standalone server, and screenshot
contract.

Thirty-four replacement baselines were reviewed against the productive UI and
approved references: 7 Phase 06, 16 Phase 07, and 11 Phase 08. Five consecutive
reduced-motion WebKit runs passed. The complete zero-tolerance visual matrix
then passed 291/291 twice without changing any of the 84 baseline hashes.
The final corrective browser gate also passed E2E 318/318, axe 102/102, and
motion 30/30 across Chromium, Firefox, and WebKit with retries disabled.

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
regions must never be masked. Comparison allows zero thresholded differing
pixels under Playwright's standard pixel comparator (`maxDiffPixels: 0`). A
ratio tolerance and any broadened color threshold are prohibited. A narrowly
scoped positive `maxDiffPixels` value may be proposed only after canonical
regeneration and repeated proof, with inspected evidence showing that it still
rejects the historical 2,636-pixel failure.

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
