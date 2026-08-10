# Accumulated Codex execution report

- **Project:** `wflyer.com.br` institutional site
- **Execution started:** 2026-07-29
- **Current implementation status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **External configuration:** pending
- **Production:** `NOT_AUTHORIZED`
- **Homologation owner:** Davi Benucci

## 1. Scope and publication rule

This report records the implementation of the W_Flyer institutional site from
Phase 0 through Phase 09 under the repository execution contract and normative
sequence.

Work is limited to the institutional-site repository. It does not include music
application code or rules, OCR/OMR, real transposition, authentication, a
database, CMS, analytics, or any modification to `app.wflyer.com.br`.

Repository implementation, tests, workflows, standalone preparation, and
staging preparation are authorized. The following remain prohibited without
Davi Benucci's explicit approval:

- a final merge to `main`;
- a production deployment;
- a destructive or uninventoried DNS, Cloudflare, or Napoleon change;
- any action that could interrupt `app.wflyer.com.br`.

## 2. Current phase state

| Stage | Current state | Gate |
|---|---|---|
| Preflight | `COMPLETE` | historical normative checkpoint |
| Phase 0 — Foundation | `COMPLETE` | historical phase checkpoint |
| Phase 1 — Visual system | `COMPLETE` | historical phase checkpoint |
| Phase 2 — Content and static routes | `COMPLETE` | historical phase checkpoint |
| Phase 3 — Home and dual score | `COMPLETE` | historical phase checkpoint |
| Phase 4 — Archetype pages | `COMPLETE` | historical phase checkpoint |
| Phase 5 — Motion and navigation | `COMPLETE` | historical phase checkpoint |
| Phase 6 — Tablet | `COMPLETE` | historical phase checkpoint |
| Phase 7 — Opening and local motion | `COMPLETE` | historical phase checkpoint |
| Phase 8 — Contact, security, and final content | `COMPLETE` | historical phase checkpoint |
| Phase 09 — Napoleon, staging, and production | `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING` | repository gates complete; remote CI and external gates pending |

Historical phase completion records are retained below. They do not prove the
final state of the exact current working tree. Local completion never authorizes
a production deployment, a merge to `main`, or an infrastructure mutation.

### Current Phase 09 reconciliation — 2026-08-10

- The current package-manager pin is pnpm 11.18.0. Older pnpm values below are
  preserved as dated historical checkpoint evidence and are not the current
  execution contract.
- Napoleon's owner-confirmed integration independently pulls and builds the
  selected Git revision. GitHub Actions validates and checksums the candidate
  for provenance; the Actions archive is not deployed to Napoleon.
- The persistent runtime is `node .next/standalone/server.js`. A repository-root
  adapter or static `public_html` document root is not the supported runtime.
- GitHub Environment values do not automatically transfer to Napoleon. The
  required public build value and server-only runtime values must be configured
  independently in the Napoleon application.
- The exact staging hostname, Napoleon target, panel inventory, values, DNS,
  Cloudflare inventory, and provider validation remain owner/provider external
  dependencies. No hostname is assumed.
- Final repository-owned validation is recorded for the current Phase 09
  content: 306 unit tests, 63 Storybook tests, 318 E2E checks, 102 axe checks,
  30 motion checks, two unchanged 291/291 visual runs, 22-route builds,
  standalone 17-route/20-asset smoke, indexing modes, Lighthouse 15/15,
  dependency audit/peers, OpenSpec, and Graphify integrity. The repository is
  therefore `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`.
- Production remains unauthorized. `app.wflyer.com.br` remains separate and
  protected from all institutional-site work.

### 2.1 Continuidade da execução

Em 2026-07-30, a execução foi retomada na branch
`feature/fase-2-pages`, a partir do commit `6ef3cf5`
(`merge: complete phase 1 design system`). A inspeção inicial confirmou que:

- as Fases 0 e 1 permaneciam concluídas, testadas e integradas em
  `develop/site-institucional`;
- a implementação e as evidências da Fase 2 estavam preservadas no worktree,
  ainda sem commit próprio;
- não havia alteração fora do escopo, segredo versionado, teste desabilitado
  ou artefato gerado indevido;
- o primeiro trabalho incompleto era revalidar e consolidar a Fase 2 antes de
  iniciar a Home e a dupla partitura;
- o cache local de Graphify não continha `graph.json`, por isso a auditoria de
  recuperação usou diretamente Git, contratos e evidências, sem reconstruir
  ou modificar o índice;
- `app.wflyer.com.br` continuava registrado como dependência externa de
  homologação e publicação, sem impedir os gates locais.

A revalidação imediata do estado retomado confirmou dependências exatas, lint,
TypeScript, 52 de 52 testes unitários, build com 22 de 22 páginas estáticas,
smoke standalone de 17 rotas e 14 assets, 35 de 35 cenários concentrados de
rotas, teclado, SEO e axe, além da integridade do diff. A consolidação Git é
registrada na Fase 2 e no histórico abaixo; nenhuma alteração em `main`,
produção, Cloudflare ou Napoleon foi realizada.

### 2.2 Subpasso corretivo de tooling antes da Fase 5

Em 2026-07-30, foi registrado um subpasso restrito a tooling, documentação e CI
para restabelecer uma baseline reproduzível de inteligência do repositório antes
do trabalho funcional da Fase 5. As CLIs verificadas reportam Graphify `0.9.31`
e OpenSpec `1.7.0`; o mapa arquitetural, o workflow de changes e o relatório
desse bootstrap estão documentados, respectivamente, em
`docs/05-implementacao/18-graphify-repository-map.md`,
`docs/05-implementacao/19-openspec-workflow.md` e
`docs/05-implementacao/20-bootstrap-graphify-openspec-report.md`.

Esse subpasso não implementa shell, provider, interceptação, timelines,
transições, foco ou histórico da navegação. Ele também não altera runtime,
produto, dependências de produção ou deploy. At that historical checkpoint,
Phase 05 therefore remained explicitly `PRONTA_PARA_INICIAR`; its completed
implementation and gate are recorded below.

## 3. Pré-voo

### 3.1 Resultado

**Estado:** `CONCLUÍDO`  
**Decisão:** iniciar imediatamente a Fase 0.

Não foi encontrado conflito normativo verdadeiro. O repositório está em `READY_FOR_IMPLEMENTATION`, e o conjunto visual está autorizado para implementação integral por referência individual, painel aprovado ou herança de arquétipo.

### 3.2 Integridade documental e de assets

| Verificação | Resultado |
|---|---|
| `SHA256SUMS.txt` | 201 de 201 entradas válidas; zero falhas |
| `DOCUMENTATION_MANIFEST.json` | 200 arquivos; 5.403.281 bytes |
| JSON do baseline | 10 de 10 parseados; zero erro |
| YAML do baseline | 11 de 11 parseados; zero erro |
| SVG/XML | 27 de 27 parseados; zero erro |
| Links relativos em Markdown | 93 verificados; zero quebrado |
| Markdown abrangido pelo relatório de validação | 117 arquivos |
| Matriz visual | 15 unidades; 60 estados; zero estado bloqueador |
| Distribuição da matriz | 10 `approved-master-panel`; 49 `authorized-derived`; 1 `approved-individual` |
| Rasters | 33 arquivos decodificados |
| Golden references | 2 de 2 hashes válidos |
| Referências de inspiração | 5 de 5 hashes válidos |
| SVG de abertura | 15 de 15 IDs mínimos presentes e únicos |
| Geometria da abertura | 10 de 10 paths oficiais idênticos à fonte |
| Geometria do símbolo do header | 3 de 3 paths oficiais idênticos à fonte |
| Timeline da abertura | frames contínuos de 0 a 336; 337 frames no total |

As duas golden references canônicas foram inspecionadas em resolução de 1536 × 1024:

- `docs/design-reference/golden-pages/master/wflyer-approved-master-board.png`;
- `docs/design-reference/golden-pages/application/application-desktop-light.png`.

Os SVGs de produção validados são:

- `svg/wflyer-intro-master.svg`, `viewBox="0 0 1200 675"`;
- `svg/wflyer-header-symbol.svg`, `viewBox="-1 -2 282 165"`.

Também foram confirmados:

- ausência de IDs duplicados nos SVGs de produção;
- ausência de `<text>`, raster embutido, referência externa, fonte ou animação embutida nos assets oficiais;
- correspondência geométrica byte a byte dos atributos `d` oficiais;
- continuidade da timeline de 5,600 segundos e dos checkpoints documentados;
- coerência entre a matriz visual, os arquétipos e a autorização integral.

### 3.3 Evidências e comandos do pré-voo

Fontes de evidência:

- `PRE-CODE-STATUS.md`;
- `docs/00-governanca/05-registro-decisoes.md`;
- `DOCUMENTATION_MANIFEST.json`;
- `PATCH-MANIFEST.json`;
- `validation-report.json`;
- `visual-docs-validation.json`;
- `manifest.json`;
- `SHA256SUMS.txt`;
- `docs/design-reference/golden-pages/page-matrix.yaml`;
- `docs/design-reference/golden-pages/visual-archetypes.yaml`;
- `docs/design-reference/golden-pages/IMPLEMENTATION-AUTHORIZATION.md`;
- manifests, specs, imagens e SVGs associados.

Comandos e verificações registrados:

```text
git status --short
git branch --show-current
sha256sum -c SHA256SUMS.txt
file docs/design-reference/golden-pages/master/wflyer-approved-master-board.png
file docs/design-reference/golden-pages/application/application-desktop-light.png
```

Além desses comandos, a auditoria somente leitura aplicou parsers JSON, YAML e XML; decodificação dos rasters; verificação de IDs SVG; comparação dos atributos `d`; validação de dimensões e hashes; e inspeção dos links Markdown relativos.

### 3.4 Resolução hierárquica de inconsistências históricas

#### Gate antigo da animação de entrada

`docs/03-motion/06-animacao-entrada-marca.timeline.yaml` ainda contém `status: proposed` e `asset_gate: BLOCKED_ASSET_APPROVAL`. `docs/05-implementacao/10-contrato-assets-animacao.md` também conserva o bloqueio da etapa anterior à entrega dos SVGs.

Esses marcadores são históricos e estão superados por fontes de maior precedência e por fatos verificáveis:

1. ADR-012 aprova a abertura vetorial programática;
2. `manifest.json` declara `APPROVED_FOR_IMPLEMENTATION`;
3. os dois assets produtivos existem e passaram nas verificações de IDs, geometria e checksum;
4. `PRE-CODE-STATUS.md` declara `READY_FOR_IMPLEMENTATION`.

**Aplicação:** a coreografia e os tempos documentados continuam normativos; somente o antigo gate editorial é considerado obsoleto. Os paths oficiais não podem ser alterados.

#### Estado antigo do portfólio

`docs/design-reference/golden-pages/briefs/08-portfolio-individual.md` conserva a redação histórica “projetos selecionados em breve”.

Ela é superada pela ADR-022 e por `docs/04-conteudo/08-perfil-publicacao.yaml`, que determinam os três projetos oficiais:

1. W_Flyer;
2. MSN Distribuidora;
3. MSN Suprimentos.

**Aplicação:** implementar somente esses três projetos, sem métricas, clientes, resultados ou tecnologias inventadas.

#### HSTS

O catálogo de headers prescreve HSTS, enquanto os documentos operacionais exigem validação prévia de todos os hosts e subdomínios.

**Aplicação:** o suporte pode ser preparado no código e na documentação, mas a ativação efetiva de HSTS permanece gate de publicação após inventário e validação de `wflyer.com.br`, e-mail e `app.wflyer.com.br`.

#### Proveniência absoluta do asset oficial

O campo `source_of_truth` de `manifest.json` aponta para um caminho absoluto de preparação em `/mnt/data/...`, não portável para este workspace.

**Aplicação:** o caminho é tratado somente como proveniência histórica. A implementação usa os assets locais aprovados e verificados por hash, sem depender desse caminho externo.

#### Vídeo de referência ausente

`docs/03-motion/reference-video-manifest.json` referencia um MP4 que não integra o pacote atual.

**Aplicação:** o próprio manifest classifica o vídeo como `motion-reference-only` e nega autoridade sobre geometria ou asset final. A ausência não bloqueia o código, porque SVGs, storyboard, checkpoints e timeline estão presentes e aprovados.

### 3.5 Observações não bloqueadoras

- `index.html` é um placeholder legado anterior à aplicação Next.js.
- `package-lock.json` é um lockfile legado vazio; pnpm é o gerenciador normativo.
- Golden references e imagens de inspiração permanecem exclusivamente em documentação e QA; nunca serão incorporadas ao frontend produtivo.
- A validação de links cobreu referências relativas locais. URLs externas, painéis privados e serviços remotos não foram tratados como verificáveis neste pré-voo local.
- O baseline pré-código, seus manifests e seus checksums são evidência histórica imutável. Este relatório novo não altera retroativamente esse baseline.

### 3.6 External staging and production dependencies

These items do not invalidate the historical Phase 0–08 checkpoints, but they
block the corresponding staging, homologation, and production gates:

- configure the six environment-specific names
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`,
  `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, and
  `CONTACT_ALLOWED_ORIGINS` in the appropriate GitHub Environments without
  exposing their values;
- configure the corresponding public build value and five server-only values
  independently in each Napoleon application; GitHub Environment values are not
  transferred to Napoleon;
- record the actual Napoleon application type, repository, selected branch and
  SHA, build command, start command, injected port, process user, health check,
  restart policy, rollback selector, and target;
- obtain Davi Benucci's approval for the exact staging hostname; no hostname is
  assumed by repository documentation;
- obtain read-only access to inventory the Cloudflare zone, DNS records,
  SSL/TLS, cache, WAF, rate limiting, origin, and the independent
  `app.wflyer.com.br` baseline;
- provision and validate the staging Node.js runtime using
  `node .next/standalone/server.js` from the exact selected Git revision;
- execute real external Turnstile, Resend, HTTPS, cache, header, and email
  delivery checks;
- inspect relevant external logs under an owner-approved retention policy
  without exposing visitor data or configured values;
- exercise and document staging rollback;
- obtain an explicit dated homologation decision from Davi Benucci;
- validate `app.wflyer.com.br` before and after every authorized publication;
- after separate production approval, execute production smoke and rollback
  evidence.

The Napoleon source handoff is already confirmed as Git pull/build. No panel
field, hostname, endpoint, webhook, token, or credential is invented while the
authenticated external inventory remains pending.

## 4. Registro por fase

Cada fase usa os mesmos campos obrigatórios: objetivo, arquivos criados, arquivos modificados, decisões aplicadas, comandos, testes e resultados, screenshots, comparação visual, acessibilidade, performance, riscos, pendências não bloqueadoras, gate e título de commit.

### Fase 0 — Fundação

**Estado:** `CONCLUÍDA`
**Objetivo:** criar a fundação reproduzível com Next.js App Router, Node.js 24, pnpm, dependências exatas, TypeScript estrito, lint, testes, Storybook, Playwright, axe-core, Lighthouse CI, GitHub Actions e build standalone.

- **Arquivos criados:** projeto Next.js em `src/`; manifesto tipado de capítulos e configuração pública; `package.json`, `pnpm-lock.yaml`, configurações Next/TypeScript/ESLint/Tailwind; Vitest, Testing Library, Storybook, Playwright e Lighthouse CI; testes-base; workflows de CI e preparação de release; scripts de validação de dependências, Lighthouse e pacote standalone; este relatório.
- **Arquivos modificados:** `.gitignore`.
- **Arquivos legados removidos após inspeção:** `index.html`, placeholder DirectAdmin sem função na aplicação; `package-lock.json`, lockfile npm vazio e órfão.
- **Decisões aplicadas:** Node 24 e pnpm 11.15.1; Next.js 16.2.12, acima do patch mínimo de segurança; React 19.2.8; Tailwind CSS 4.3.3; GSAP 3.15.0; versões exatas; TypeScript 5.9.3 por compatibilidade declarada com a cadeia ESLint; App Router static-first; `output: "standalone"`; Actions fixadas por SHA; candidato de release sem chamada Napoleon até existir integração aprovada.
- **Política de dependências nativas:** pnpm autoriza explicitamente somente `esbuild`, `sharp` e `unrs-resolver`; o lockfile passou pela política local de supply chain com 986 entradas.
- **Comandos:** `pnpm install --frozen-lockfile`; `pnpm validate:dependencies`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build:storybook`; `pnpm test:storybook`; `pnpm test:e2e`; `pnpm build`; `pnpm prepare:standalone`; smoke HTTP do `server.js`; `pnpm lighthouse`; `actionlint`; `git diff --check`.
- **Testes e resultados:** instalação congelada verde; dependências exatas verdes; lint verde; typecheck verde; 8 testes unitários verdes, incluindo igualdade campo a campo entre o objeto tipado e o YAML normativo; 1 story executada no Chromium; 5 cenários Playwright verdes no Chromium; build Storybook verde; build Next verde; pacote standalone verde; smoke da Home respondeu HTTP 200; workflows passaram no Actionlint 1.7.12.
- **Screenshots:** não foi criado baseline visual prematuro. A suíte de viewport verificou 390 × 844 e 1536 × 1024 sem overflow horizontal; evidências douradas continuam somente em QA.
- **Comparação visual:** a Home desta fase é somente uma fundação sem pretensão de fechar a composição visual. A reconstrução contra a prancha aprovada pertence às Fases 1 a 4.
- **Acessibilidade:** axe-core com tags WCAG 2.0, 2.1 e 2.2 AA encontrou zero violação séria ou crítica na fundação; idioma, `main`, `h1`, nomes dos links, foco visível e reduced motion foram verificados.
- **Performance:** três execuções isoladas do Lighthouse: Performance 100, Acessibilidade 100, SEO 100 e Boas práticas 100 em todas; budgets de LCP e CLS verdes.
- **Riscos controlados:** Storybook 10.5 exigiu normalização isolada do filepath do worker devido ao caminho local não ASCII `Área de trabalho`; o workaround fica apenas no setup de testes e o CI usa caminho ASCII.
- **Pendências não bloqueadoras:** Firefox e WebKit estão configurados e serão exercitados na matriz final; secrets, reviewer obrigatório do Environment `production`, método Napoleon e acessos externos permanecem na seção 3.6.
- **Gate:** `CONCLUÍDO`.
- **Título de commit:** `chore(site): establish reproducible Next.js foundation`.

### Fase 1 — Sistema visual

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar tokens, fontes, temas, primitivos próprios, header, elementos musicais, navegação, Storybook e mapa tipado de arquétipos.

- **Arquivos criados:** camadas `src/styles/tokens.css` e `base.css`; três fontes variáveis WOFF2 locais com licenças e checksums; carregamento por `next/font/local`; componentes próprios de marca oficial, tema, ações, superfícies, tipografia, ícones, pauta, notas, compassos, barra final, header e menu; configuração tipada de navegação e espelho exato dos arquétipos; stories e testes; smoke standalone de assets; quatro evidências visuais locais em `docs/05-implementacao/evidencias/fase-1/`.
- **Arquivos modificados:** layout raiz, folha global e Home temporária; preview global do Storybook; configuração Vitest; suítes de Home, acessibilidade, motion e regressão visual; scripts do `package.json`.
- **Decisões aplicadas:** ADR-006, ADR-008 e ADR-013; prefixo oficial `--wf-*`; geometria oficial imutável no `OfficialBrandSymbol`; Cormorant Garamond e Manrope self-hosted; tema claro/escuro com preferência do sistema, persistência e bootstrap antes do paint; mesma árvore DOM entre temas; `SiteHeader` persistente com oito compassos de 44 px, símbolo central, marcador Processo entre Serviços e Portfólio e link externo explícito; menu mobile modal com `inert`, foco contido, Escape, clique externo, seleção, retorno de foco e fechamento seguro no breakpoint; nenhuma dependência nova.
- **Storybook:** toolbar de tema sincronizada com `documentElement`, storage e fontes de produção; viewport normativo `390 × 844`; estados claro, escuro, hover, focus, active, external, Processo e menu aberto; paleta única derivada dos tokens, sem cópia paralela nas stories.
- **Comandos:** `pnpm validate:dependencies`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build:storybook`; `pnpm test:storybook`; `pnpm test:e2e`; `pnpm build`; `pnpm prepare:standalone`; `pnpm smoke:standalone`; `pnpm lighthouse`; `git diff --check`; capturas Chromium determinísticas; inspeção visual das quatro capturas e comparação com as duas referências aprovadas.
- **Testes e resultados:** dependências exatas verdes; lint e typecheck verdes; 48 de 48 testes unitários em 9 arquivos; 33 de 33 testes de stories em 9 arquivos; 13 de 13 cenários Playwright no Chromium; build Storybook e build Next verdes; pacote standalone verde; smoke validou a Home e 12 assets CSS, JavaScript e WOFF2. A revisão independente não encontrou bloqueador remanescente.
- **Screenshots:** [desktop claro](evidencias/fase-1/desktop-light.png), [desktop escuro](evidencias/fase-1/desktop-dark.png), [mobile claro](evidencias/fase-1/mobile-light.png) e [menu mobile escuro](evidencias/fase-1/mobile-menu-dark.png). São evidências de execução, não novas golden references.
- **Comparação visual:** cores, tipografia editorial, símbolo central, divisão dos ramos, cinco linhas por compasso, notas, barras, densidade, controles e geometrias entre temas correspondem à prancha mestra e ao header da Aplicação aprovada. Desktop claro/escuro preserva exatamente a geometria; o mobile transforma a partitura espacial em ordem vertical explícita. A composição definitiva da Home, incluindo clave narrativa e bifurcação, permanece corretamente reservada à Fase 3.
- **Acessibilidade:** axe-core encontrou zero violação crítica ou séria nos dois temas e no menu aberto; a suíte também bloqueia o caso estrutural `aria-hidden-focus`. Foram validados skip link, nomes acessíveis, indicação de nova aba, contraste determinístico, `aria-current`, foco visível, trap e retorno de foco, Escape, clique externo, resize 390 → 1200 → 390 e reduced motion sem animação ativa.
- **Performance:** três execuções finais isoladas do Lighthouse obtiveram Performance 100, Acessibilidade 100, Boas práticas 100 e SEO 100 em todas; nenhum budget ou assertion falhou.
- **Riscos controlados:** o primeiro smoke standalone verificava somente HTTP 200 e permitia falso positivo sem CSS; ele foi substituído por verificação executável de todos os assets estáticos referenciados. O script inline anti-FOUC precisará receber a política CSP definitiva na Fase 8. O chunk grande de axe aparece apenas no catálogo/teste Storybook e não integra o bundle produtivo.
- **Pendências não bloqueadoras:** a Home desta fase é uma vitrine estática dos primitivos e será substituída pela composição normativa na Fase 3; rotas e conteúdo entram na Fase 2; Firefox/WebKit e matriz ampliada ficam para o QA final; acessos externos e produção continuam limitados pela seção 3.6.
- **Gate:** `CONCLUÍDO`.
- **Título de commit:** `feat(design-system): build visual foundations and musical header`.

### Fase 2 — Conteúdo e rotas estáticas

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar todas as rotas, conteúdo local, páginas legais, SEO, sitemap, robots, estados de erro, 404, footer e navegação funcional sem depender de motion.

- **Arquivos criados:** 17 páginas públicas no App Router; conteúdo tipado local em `src/content/site-content.ts`; contrato central de SEO; JSON-LD de `Organization`, `WebSite`, `Service` e `BreadcrumbList`; componentes compartilhados de capítulo, seção, cards, etapas, detalhes de serviço, páginas legais e estados; footer global; `sitemap.ts`, `robots.ts`, `not-found.tsx`, `error.tsx` e `global-error.tsx`; testes de conteúdo, rotas, teclado e axe; runner robusto do servidor Lighthouse; seis evidências visuais e seu índice.
- **Arquivos modificados:** layout raiz para metadata global, dados estruturados e footer; Home estática com os dois caminhos; estilos da Home; smoke standalone; configuração do Lighthouse; este relatório.
- **Rotas entregues:** Home; três páginas da aplicação; Sobre; Serviços; Processo; Portfólio; Contato; quatro detalhes de serviço; Privacidade; Cookies; Termos de uso; Acessibilidade. O build também gera 404, favicon, sitemap e robots.
- **Decisões aplicadas:** ADR-002, ADR-014, ADR-015, ADR-017 e ADR-022; conteúdo essencial server-rendered e static-first; nenhum motion nesta fase; portfólio limitado a W_Flyer, MSN Distribuidora e MSN Suprimentos; aplicação declarada como produto em desenvolvimento e ferramenta de apoio com revisão humana; Contato somente informativo nesta fase, sem simular envio ou sucesso antes da Fase 8; quatro detalhes condicionais, sem preço, prazo ou garantia; políticas conservadoras baseadas apenas na implementação aprovada e marcadas para revisão jurídica/homologação; e-mail, Instagram e GitHub como únicos canais; nenhum analytics ou cookie de marketing.
- **SEO:** títulos e descrições únicos; canonical e Open Graph próprios nas 17 rotas; card social textual `summary`, sem imagem não aprovada ou handle de rede inexistente; sitemap com somente as 17 rotas; robots permite conteúdo público, bloqueia `/api/` e referencia o sitemap; 404 recebe `noindex` do App Router sem meta duplicada; dados estruturados contêm somente fatos autorizados.
- **Comandos:** `pnpm validate:dependencies`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build:storybook`; `pnpm test:storybook`; `pnpm test:e2e`; `pnpm build`; `pnpm prepare:standalone`; `pnpm smoke:standalone`; `pnpm lighthouse`; `git diff --check`; capturas Chromium em 1536 × 1024 e 390 × 844; inspeção visual das seis capturas; crawl independente de rotas, links, metadata e JSON-LD.
- **Testes e resultados:** dependências exatas, lint e typecheck verdes; 52 de 52 testes unitários em 10 arquivos; 33 de 33 testes Storybook; 48 de 48 cenários Playwright no Chromium; as 17 rotas respondem diretamente com um `main`, um `h1`, canonical próprio e footer; sitemap/robots/404 verdes; build Next gerou 22 de 22 páginas estáticas; build Storybook verde; revisão independente validou 17 páginas, 21 destinos e JSON-LD parseável sem bloqueador.
- **Standalone:** o smoke foi ampliado para recusar falso positivo e validou as 17 rotas públicas, landmarks, um `h1`, canonicals e 14 assets CSS, JavaScript e WOFF2 com payload real. O runner do Lighthouse agora aguarda uma resposta HTTP válida do servidor standalone antes de liberar a coleta.
- **Screenshots:** [Home desktop claro](evidencias/fase-2/home-desktop-light.png), [Aplicação desktop escuro](evidencias/fase-2/application-desktop-dark.png), [Serviços desktop claro](evidencias/fase-2/services-desktop-light.png), [Privacidade desktop escuro](evidencias/fase-2/privacy-desktop-dark.png), [Contato mobile escuro](evidencias/fase-2/contact-mobile-dark.png) e [detalhe de serviço mobile claro](evidencias/fase-2/service-detail-mobile-light.png). O [índice de evidências](evidencias/fase-2/README.md) distingue essas capturas das golden references.
- **Comparação visual:** tokens, tipografia, header em partitura, cards, navegação anterior/próximo, pauta estática, footer e geometrias entre temas permanecem coerentes com a prancha mestra. As páginas são deliberadamente estáticas e preservam espaço/contratos para a Home bifurcada, o tablet e os arquétipos finais das Fases 3 e 4. Desktop e mobile não apresentam overflow horizontal.
- **Acessibilidade:** todas as 17 rotas foram exercitadas por URL direta e teclado; o primeiro Tab alcança o skip link e Enter conduz foco ao `main`; cada página possui um único `h1`, headings lógicos, landmarks, foco visível, links reais e indicação de nova aba. Axe encontrou zero violação crítica ou séria na Home clara/escura, no menu mobile aberto e nas outras 16 rotas; o caso estrutural `aria-hidden-focus` continua bloqueador.
- **Performance:** três coletas finais do Lighthouse no pacote standalone obtiveram Performance 100, Acessibilidade 100, Boas práticas 100 e SEO 100 em todas. LCP variou de aproximadamente 604 ms a 620 ms e CLS foi 0 nas três execuções.
- **Riscos controlados:** a base jurídica não inventa razão social, CNPJ, endereço, telefone, DPO ou prazo legal; revisão jurídica e homologação continuam obrigatórias antes da produção. O status público dos projetos será reconferido próximo ao lançamento. Golden references não foram incorporadas ao frontend. Nenhuma dependência ou integração externa nova foi adicionada.
- **Pendências não bloqueadoras:** em 2026-07-29, Instagram, GitHub, MSN Distribuidora e MSN Suprimentos responderam publicamente, mas `app.wflyer.com.br` não resolveu DNS durante a revisão independente. O link configurado corresponde ao perfil aprovado, portanto isso não bloqueia o gate local da Fase 2; restaurações/validações do subdomínio e o smoke externo são bloqueadores de homologação e publicação. Firefox/WebKit e matriz final permanecem para a Fase 9.
- **Gate:** `CONCLUÍDO`; revisão independente sem bloqueador de implementação após a atualização deste registro.
- **Título de commit:** `feat(content): publish static routes and verified public content`.

### Fase 3 — Home e dupla partitura

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar Home, origem, bifurcação, pautas, âncoras, continuidade, terminações e fallback mobile conforme o manifesto de capítulos.

- **Arquivos criados:** `NarrativeClef`, clave SVG original e separada da marca; `OriginScore`, bifurcação determinística com variantes desktop e compacta; `ChapterScore`, segmento vetorial dirigido pelas bordas e alturas do manifesto; stories e testes unitários do sistema; suíte E2E de continuidade; oito evidências visuais e seu índice.
- **Arquivos modificados:** Home e seus estilos; exportações e estilos musicais; `MusicalNote` para rotação limitada a ±6°; templates compartilhados de capítulos, detalhes de serviço e páginas legais; testes do manifesto, Home, axe, reduced motion e responsividade; este relatório.
- **Decisões aplicadas:** ADR-007, ADR-013, ADR-014, ADR-015 e ADR-017; Home como origem `0`, com `h1` semântico único e dois `h2` equivalentes; clave narrativa não usada como logo; CTA primário esquerdo para o aplicativo e CTA primário direito para Serviços; escolha secundária de Aplicação e Empresa preservada; pauta enfatizada por hover/foco somente com cor, opacidade e deslocamento curto das notas, sem morph; nenhuma escolha automática por scroll; conteúdo essencial server-rendered; nenhuma animação GSAP antecipada.
- **Continuidade:** os oito capítulos não centrais expõem no DOM ramo, coordenada, bordas e alturas de entrada/saída, terminalidade e segmento correspondente. As alturas internas coincidem com o próximo capítulo; o ramo da aplicação avança visualmente para a esquerda e retorna pela direita, enquanto o institucional faz o inverso. Detalhes de serviço usam pauta local e `data-parent-chapter`; páginas legais usam pauta local no contexto neutro da origem, sem pai. Todas declaram `data-route-kind="auxiliary"` e nenhuma cria capítulo falso. A exceção `.50 → .46` da origem é tratada pela curva própria da bifurcação, sem alterar o manifesto.
- **Barras finais:** Benefícios encerra à esquerda depois do CTA e do conteúdo; Contato encerra à direita depois do conteúdo atualmente disponível. A barra de Contato será revalidada após os estados do formulário na Fase 8. Nenhuma rota auxiliar ou capítulo intermediário exibe barra final.
- **Comandos:** Context7 para documentação atual do Next.js 16; `pnpm validate:dependencies`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build:storybook`; `pnpm test:storybook`; `pnpm test:e2e`; seleções concentradas Playwright; `pnpm verify`; `pnpm build`; `pnpm prepare:standalone`; `pnpm smoke:standalone`; `pnpm lighthouse`; capturas Chromium no standalone; inspeção visual; `git diff --check`.
- **Testes e resultados:** dependências exatas, lint e typecheck verdes; 58 de 58 testes unitários em 11 arquivos; 38 de 38 testes Storybook em 10 arquivos; 73 de 73 cenários Playwright Chromium; 13 de 13 cenários finais de Home/regressão visual após o ajuste de composição; build Storybook verde; build Next gerou 22 de 22 páginas estáticas; standalone validou 17 rotas e 14 assets.
- **Screenshots:** [Home desktop claro](evidencias/fase-3/home-desktop-light.png), [Home desktop escuro](evidencias/fase-3/home-desktop-dark.png), [Home mobile claro](evidencias/fase-3/home-mobile-light.png), [Home mobile escuro](evidencias/fase-3/home-mobile-dark.png), fluxos mobile completos [claro](evidencias/fase-3/home-mobile-flow-light.png) e [escuro](evidencias/fase-3/home-mobile-flow-dark.png), [Benefícios terminal claro](evidencias/fase-3/benefits-terminal-desktop-light.png) e [Contato terminal escuro](evidencias/fase-3/contact-terminal-desktop-dark.png). O [índice de evidências](evidencias/fase-3/README.md) registra a proveniência no standalone.
- **Comparação visual:** a Home reproduz o arquétipo `origin-bifurcation` dos painéis aprovados: símbolo oficial no header, aplicação à esquerda, clave volumétrica central, institucional à direita, CTAs equivalentes, pautas saindo da origem e indicação discreta de exploração. Claro e escuro mantêm caixas e geometria idênticas. O mobile reorganiza a origem e os ramos em uma coluna, usa pauta compacta de 8 px e rótulos direcionais explícitos. Nenhum PNG, recorte ou golden reference integra o frontend.
- **Acessibilidade:** um `h1` semântico e dois títulos subordinados equivalentes; landmarks e ordem DOM estáveis; skip link e foco visível; CTAs reais com alvo mínimo; pauta, notas, clave e barras ocultadas da árvore acessível; ênfase equivalente por foco e mouse; navegação convencional e barras disponíveis sem JavaScript; axe sem violação crítica ou séria em 1536 × 1024 e 390 × 844, nos dois temas; reduced motion sem animação ativa.
- **Responsividade:** zero overflow em 390 × 844 e 1536 × 1024, além dos limites 767/768, 1023/1024 e 1199/1200 px. A troca de tema preservou exatamente as caixas da origem, dos ramos e da pauta.
- **Performance:** três execuções Lighthouse no pacote standalone obtiveram 100 em Performance, Acessibilidade, Boas práticas e SEO. LCP variou de aproximadamente 604 ms a 617 ms; FCP, de 250 ms a 258 ms; CLS permaneceu 0.
- **Riscos controlados:** `:has()` aprimora a ênfase dos ramos em navegadores modernos, mas o fallback mantém ambas as pautas visíveis e todos os links operáveis. A clave usa poucas camadas vetoriais, sem filtro pesado, Canvas, WebGL ou raster. O conteúdo do formulário não foi antecipado; o gate terminal de Contato é explicitamente reaberto na Fase 8.
- **Pendências não bloqueadoras:** acabamento individual das outras páginas pertence à Fase 4; transições GSAP, tablet e abertura pertencem às Fases 5 a 7; Firefox/WebKit permanecem para a matriz final; `app.wflyer.com.br` continua dependência externa de homologação/publicação.
- **Gate:** `CONCLUÍDO`; narrativa correta em claro/escuro e desktop/mobile, com continuidade estática, acessibilidade, performance e evidências verdes.
- **Título de commit:** `feat(score): compose bifurcated home and chapter continuity`.

### Fase 4 — Páginas por arquétipo

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar, na ordem normativa, Aplicação, Como funciona, Benefícios, Empresa, Serviços, Processo, Portfólio, Contato, quatro detalhes de serviço e páginas legais.

- **Arquivos criados:** catálogo de ícones SVG originais; blocos semânticos para os arquétipos normativos `product-demo`, `editorial-sequence`, `editorial-benefits-terminal`, `service-grid`, `process-timeline`, `portfolio-grid`, `contact-terminal`, `service-detail` e `legal-editorial`; seletor cliente isolado para refletir a pré-seleção validada do tipo de projeto sem tornar Contato dinâmico; estilos próprios; testes unitários, stories, cenários E2E e matriz visual; gerador de capturas e 15 evidências documentadas.
- **Arquivos modificados:** as oito rotas principais após a Home; templates compartilhados de capítulo, detalhe de serviço e documento legal; header legal simplificado, preservando símbolo e os dois grupos; footer terminal; configuração Lighthouse; exportações; conteúdo tipado com ícones, tipos de contato e datas ISO; testes de conteúdo e acessibilidade.
- **Decisões aplicadas:** Aplicação deriva da referência individual aprovada e usa tablet estático construído em DOM e SVG, sem upload, rede ou simulação de resultado; a faixa canônica e o cue permanecem no primeiro viewport 1536 × 1024. Como funciona e Processo usam sequências semânticas distintas; Benefícios, Serviços e detalhes usam os arquétipos autorizados sem criar uma linguagem paralela; Serviços segue a ordem canônica cards → CTA → pauta e usa o SVG Bézier oficial do sistema, não gradiente CSS; Empresa conserva a clave como elemento narrativo, nunca como logo; Portfólio publica somente W_Flyer, MSN Distribuidora e MSN Suprimentos, sem métricas; Contato exibe os canais oficiais e um shell explicitamente indisponível até a implementação segura da Fase 8, mas reflete de forma segura a query `tipo` dos CTAs de serviço; documentos legais permanecem institucionais, honestos e navegáveis por seções.
- **Continuidade e terminais:** todas as rotas principais preservam os metadados e segmentos da dupla partitura implementados na Fase 3. Benefícios e Contato apresentam conteúdo, navegação anterior/próximo e somente então a barra dupla final; a pauta decorativa do footer é suprimida após capítulos terminais. Rotas auxiliares continuam sem criar capítulos falsos.
- **Comandos:** Context7 para a documentação atual do Next.js 16 e o contrato `useSearchParams` + `Suspense` em rota prerenderizada; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build:storybook`; `pnpm test:storybook`; `pnpm test:e2e`; suíte visual concentrada; suíte axe concentrada; `pnpm build`; `pnpm prepare:standalone`; `pnpm smoke:standalone`; `pnpm lighthouse`; capturas Chromium no standalone; inspeção visual; verificações finais de integridade do diff.
- **Testes e resultados:** lint e TypeScript verdes; 65 de 65 testes unitários em 12 arquivos; build Storybook verde e 46 de 46 testes em 11 arquivos; 147 de 147 cenários Playwright Chromium; 52 de 52 verificações visuais concentradas, incluindo a composição completa da Aplicação em 1536 × 1024, a separação geométrica entre pautas e texto legível, a ordem canônica de Serviços, presença dos blocos no primeiro viewport, igualdade geométrica entre temas, reduced motion e limites 767/768, 1023/1024 e 1199/1200; build Next gerou 22 de 22 páginas estáticas; standalone validou 17 rotas e 17 assets.
- **Screenshots:** as matrizes das 16 rotas em [desktop claro](evidencias/fase-4/matrix-desktop-light.png), [desktop escuro](evidencias/fase-4/matrix-desktop-dark.png), [mobile claro](evidencias/fase-4/matrix-mobile-light.png) e [mobile escuro](evidencias/fase-4/matrix-mobile-dark.png) cobrem 64 estados. As vistas detalhadas incluem [Aplicação desktop claro](evidencias/fase-4/application-desktop-light.png), [Aplicação mobile escuro](evidencias/fase-4/application-mobile-dark.png), [Como funciona mobile claro](evidencias/fase-4/how-it-works-mobile-light.png), [Benefícios desktop escuro](evidencias/fase-4/benefits-desktop-dark.png), [Empresa mobile claro](evidencias/fase-4/company-mobile-light.png), [Serviços](evidencias/fase-4/services-desktop-light.png), [Processo](evidencias/fase-4/process-desktop-light.png), [Portfólio](evidencias/fase-4/portfolio-desktop-dark.png), [Contato](evidencias/fase-4/contact-desktop-light.png), [detalhe de serviço](evidencias/fase-4/service-detail-mobile-light.png) e [documento legal](evidencias/fase-4/legal-mobile-dark.png). As seis capturas detalhadas desktop usam exatamente 1536 × 1024; o [índice de evidências](evidencias/fase-4/README.md) registra viewport, tema, rota e proveniência.
- **Comparação visual:** Aplicação reproduz no mesmo viewport da golden a composição em dois campos, título editorial, tablet inclinado, pauta, faixa de cinco benefícios e cue, preservando conteúdo oficial e removendo qualquer impressão de processamento real. As demais páginas herdam exclusivamente os painéis e arquétipos autorizados: abertura editorial, densidade suficiente para manter os blocos canônicos no primeiro viewport, cards contidos, ícones lineares, fundos quentes e continuidade musical. Nenhuma pauta atravessa texto legível; os segmentos editoriais ficam em fluxo após a descrição, a legenda da Aplicação isola sua copy e Serviços reproduz cards → CTA → pauta. O header legal simplificado mantém símbolo e ambos os grupos sem os compassos decorativos. A comparação automatizada protege geometria, presença, enquadramento e paridade entre temas; a inspeção direta usa a golden e a prancha sem transformar divergências editoriais obrigatórias em baseline falso. Claro e escuro preservam a geometria; o mobile converte as composições em ordem vertical sem overflow. Nenhum PNG, screenshot ou golden reference foi incorporado ao frontend.
- **Acessibilidade:** um `h1` por rota, hierarquia de headings, landmarks, breadcrumbs e listas semânticas; links e CTAs reais; shell do formulário nativamente desabilitado e descrito; documentos legais com índice focável; SVGs decorativos fora da árvore acessível; foco visível, skip link e alvos operáveis. Foram executadas 64 varreduras axe nas 16 rotas da Fase 4, em desktop/mobile e claro/escuro, além das quatro varreduras da Home; nenhuma apresentou violação crítica ou séria.
- **Responsividade:** zero overflow na matriz desktop/mobile e nos seis limites de breakpoint. O tablet perde inclinação no mobile, grids viram colunas e documentos legais preservam leitura e índice sem alterar a ordem DOM.
- **Performance:** 15 coletas no pacote standalone final — três para Home, Aplicação, Serviços, Contato e Privacidade — obtiveram 100 em Performance, Acessibilidade, Boas práticas e SEO. FCP variou de 247 ms a 263 ms; LCP, de 492 ms a 669 ms; o maior CLS foi 0,039 na Aplicação e TBT foi 0 ms em todas.
- **Riscos controlados:** o tablet desta fase é somente uma prévia estática e determinística; sua operação acessível pertence à Fase 6 e sua inclinação já é removida em reduced motion. O shell de Contato não aceita nem transmite dados até que validação, Turnstile, Resend e falha fechada sejam implementados na Fase 8; a pré-seleção atual somente apresenta um valor permitido no controle desabilitado. Não foram adicionadas dependências, métricas, depoimentos, clientes, analytics, CMS ou lógica da aplicação musical.
- **Pendências não bloqueadoras:** reabrir o tablet na Fase 6; reabrir o formulário e a barra terminal de Contato na Fase 8; reconferir o estado público dos projetos próximo ao lançamento; obter revisão jurídica e homologação de Davi Benucci antes da produção; executar Firefox/WebKit na matriz final. `app.wflyer.com.br` permanece uma dependência externa de homologação/publicação, não do gate local.
- **Gate:** `CONCLUÍDO`; as 16 rotas da fase têm composição autorizada, conteúdo oficial, responsividade, acessibilidade, performance, testes e evidências verdes. Três revisões independentes finais — requisitos, código e auditoria integral — retornaram `NÃO BLOQUEIA`.
- **Título de commit:** `feat(pages): implement authorized visual archetypes`.

### Fase 5 — Motion e navegação

**Status:** `COMPLETE`
**Objective:** implement adjacent score transitions, compressed same-branch
jumps, cross-branch Home pivots, deep links, truthful history, focus,
deterministic recovery, and reduced-motion behavior without changing the
server-rendered page contract.

#### Interruption recovery — 2026-07-31

The interrupted implementation was recovered non-destructively on branch
`feature/fase-5-motion-navigation` at commit `d8e0d7f367ce7ebe877e6c1c2eecde7fa8a31ae5`.
There were no staged changes. The Phase 05 worktree contained reconciled but
unchecked OpenSpec artifacts, a persistent experience shell and score overlay,
the pure motion domain, real score anchor markers, a header Home-pivot marker,
Playwright configuration, unit/component/Storybook coverage, four focused
Playwright suites, and deterministic evidence tooling. The unrelated one-line
indentation change in the repository `README.md` was detected after the
interruption and is being preserved without modification.

The previous session stopped during final cross-browser validation. Static
gates were already green: exact dependency validation, ESLint, TypeScript,
201/201 unit tests, Storybook build, and 57/57 Storybook tests. The focused new
Chromium matrix passed 44/44. Two WebKit stress assertions initially exposed
driver-timing and engine-load sensitivity; after measuring reduced-motion time
inside the page and requiring full cleanup for either normal settlement or the
specified 1,100 ms safety recovery, the affected scenarios passed 9/9 across
Chromium, Firefox, and WebKit. The work below completed every item that was
still unverified at that recovery point.

At recovery time, OpenSpec change `complete-phase-05-motion-navigation`
remained active and valid with 0/33 tasks checked. The evidence-based recovery
classification was:

- `verified-complete`: contract reconciliation; versions; pure topology,
  eligibility, lifecycle, timing, geometry, and cleanup contracts; persistent
  shell/overlay integration; deterministic controller; unit/component and
  Storybook coverage; focused Chromium behavior.
- `implemented-but-unverified`: the complete Firefox/WebKit matrix, durable
  visual captures, axe matrix, production build boundaries, standalone smoke,
  Lighthouse, and final Graphify relationships.
- `partially-implemented`: execution-report evidence and OpenSpec task
  completion markers.
- `not-started`: canonical spec synchronization and archival, which must wait
  for every gate.
- `blocked`: none; the WebKit host libraries are available through a reversible
  user-local Playwright shim because system package installation requires
  interactive administrator authentication.
- `obsolete-or-duplicated`: none.

#### Continuation recovery audit — 2026-07-31

The next Codex session resumed from the same branch and commit after the work
above had already completed its local gate but before the dirty worktree was
consolidated into a commit. The initial state still had no staged changes. The
Phase 05 implementation, tests, evidence, canonical specs, archive, Graphify
refresh, and report were present as intentional unstaged or untracked work;
the unrelated one-line `README.md` indentation remained preserved and was not
folded into Phase 05. No implementation file was found partially wired, no
test referred to missing behavior, and the last Playwright result recorded
`passed` with no failed tests.

Repository timestamps and diffs place the latest interruption after OpenSpec
archival at 11:24, canonical-spec synchronization and Graphify refresh at
11:25, and final report/map updates at 11:27–11:29. Consequently, the next
coherent action was verification and handoff rather than reopening the change
or replacing any valid code. `openspec list --json` correctly returned no
active changes; the archived contract remains
`2026-07-31-complete-phase-05-motion-navigation`, its 33 checkboxes remain
evidence-backed, and both canonical capabilities pass strict validation.

The evidence-based task classification for this continuation is:

- `verified-complete`: tasks 1.1–1.3 (contracts/tooling), 2.1–2.3 (pure
  navigation contracts), 3.1–3.4 (persistent shell and rendering), 4.1–4.5
  (score choreography and persistent state), 5.1–5.6 (accessibility, history,
  reduced motion, native fallback, terminals, and responsive safety), 6.1–6.7
  (required test matrix), and 7.1–7.5 (gates, evidence, Graphify, sync, and
  archive).
- `implemented-but-unverified`, `partially-implemented`, `not-started`,
  `blocked`, and `obsolete-or-duplicated`: none.

The continuation baseline passed ESLint, TypeScript, 136/136 focused Phase 05
unit/component tests, 22/22 focused Chromium navigation scenarios, and strict
OpenSpec validation. The complete rerun then passed 201/201 unit tests, 57/57
Storybook tests, Storybook and Next production builds with 22/22 static pages,
192/192 Chromium checks, 30/30 cross-browser motion checks, 207/207
cross-browser visual checks, and 252/252 cross-browser functional E2E checks.
The broad accessibility command passed 86/87 before the final WebKit case lost
its execution context to a Next development HMR `ChunkLoadError` under load;
the exact case immediately passed 1/1 in isolation and the complete WebKit axe
suite passed 29/29 serially without changing product code, assertions, or
timeouts. This is the already documented development-server saturation risk,
not an axe violation or product failure.

Standalone packaging and smoke passed for 17 routes plus 18 assets. Lighthouse
processed all 15 local runs with every configured assertion green and all four
category scores at 100; FCP ranged from 248.0852 to 255.6946 ms, LCP from
633.1278 to 663.5419 ms, and both CLS and TBT remained zero. Manual
reinspection of the seven durable captures
confirmed the two-segment central Home pivot, correct light/dark continuity,
left/right terminal barlines, absent reduced-motion overlay, and single-column
mobile completion without horizontal clipping. Graphify validation remained
green at 2,493 nodes, 3,699 edges, and 257 communities, so no second refresh was
run: this continuation changed documentation only, not architectural
relationships. `git diff --check` also passed. No Phase 05 implementation task
or blocker remains; Phase 06 is still the exact next phase.

#### Final implementation

- **Architecture:** `RootLayout` now mounts one persistent
  `SiteExperienceShell` around the existing server-rendered routes. A pure
  motion domain derives topology from the chapter manifest, evaluates links
  conservatively, controls a cancelable finite-state lifecycle, owns timing
  budgets, measures anchors, and guarantees idempotent cleanup. No duplicate
  route map, provider, global store, scroll engine, or client conversion of
  page components was introduced.
- **Navigation contract:** eligible real anchors are intercepted in capture
  phase, the App Router request starts within 56 ms, and pathname commit drives
  incoming presentation. Adjacent travel uses one measured score segment;
  non-adjacent travel uses one constant-duration compressed segment;
  cross-branch travel uses two overlapping segments through the actual Home
  pivot without adding Home to history. Auxiliary, hash, download, modified,
  external, new-context, and no-JavaScript navigation remains native.
- **Lifecycle and recovery:** only the latest request survives rapid repeated
  activation. Each request owns at most one active timeline and one safety
  timer. Timelines, GSAP contexts, listeners, temporary styles, and timers are
  killed or reverted on supersession, route mismatch, preference change,
  visibility loss, error, timeout, and unmount. A committed route recovers in
  place; an uncommitted route falls back to native loading within 1,100 ms.
- **Motion:** GSAP and `@gsap/react` remain the only coordinated animation
  engine. Desktop transitions draw at most two five-line score segments and six
  notes. Mobile suppresses the overlay and limits movement to 12 px horizontally
  and 8 px vertically. Scroll remains native; no infinite animation,
  `ScrollTrigger`, interval, parallax loop, Canvas, WebGL, or forced-layout loop
  was added.
- **Accessibility:** ordinary link navigation scrolls to the top and transfers
  focus once to `main#main-content`; Back and Forward preserve native scroll and
  do not steal focus. The overlay is inert, `aria-hidden`, unfocusable, and
  pointer-transparent. The framework retains one route announcer. A live
  `prefers-reduced-motion` listener suppresses score drawing and lateral travel
  and safely resolves incompatible active work.
- **Terminal and visual continuity:** Benefits and Contact retain their real
  double final barlines, previous/header access, and correct branch sides in
  desktop, mobile, both themes, and reduced motion. The Application exploration
  cue was moved upward by 12 px after Firefox and WebKit measured it 10.6–10.8 px
  beyond the canonical 1536 × 1024 viewport; the complete visual matrix then
  passed without updating a baseline to hide the mismatch.

#### Files and evidence

- **Created:** `src/lib/motion/` with topology, eligibility, lifecycle, timing,
  geometry, cleanup, exports, and six unit suites;
  `src/components/experience/` with the persistent shell, SVG transition
  layer, scoped styles, component tests, and 11 Storybook states; shared
  Playwright transition helpers; dedicated Phase 05 E2E, motion, visual, and
  accessibility suites; and `scripts/capture-phase5-evidence.mjs`.
- **Modified:** root layout, header Home-pivot metadata, `OriginScore` and
  `ChapterScore` SVG anchors, Playwright test-mode configuration, the existing
  static-route HTTP assertion, the product-demo cue spacing, OpenSpec artifacts,
  Graphify outputs/map, and this report. The unrelated one-line `README.md`
  indentation remains untouched and is not part of Phase 05.
- **Durable captures:** [transition start](evidencias/fase-5/phase05-transition-start.png),
  [dark Home-pivot midpoint](evidencias/fase-5/phase05-home-pivot-midpoint-dark.png),
  [transition completion](evidencias/fase-5/phase05-transition-completion.png),
  [Benefits terminal](evidencias/fase-5/phase05-benefits-terminal-light.png),
  [Contact terminal](evidencias/fase-5/phase05-contact-terminal-dark.png),
  [reduced-motion completion](evidencias/fase-5/phase05-reduced-motion-completion.png),
  and [mobile completion](evidencias/fase-5/phase05-mobile-completion.png).
  The [evidence index](evidencias/fase-5/README.md) records route, viewport,
  theme, state, and deterministic capture provenance. Direct inspection
  confirmed the two-path Home pivot, correct terminal sides, absent decorative
  overlay under reduced motion, and zero mobile horizontal overflow. These are
  QA evidence, not replacement golden references, and no raster is used by the
  frontend.

#### Commands and measured results

- **Primary commands:** `pnpm verify`; `pnpm test:storybook`;
  `pnpm test:e2e --workers=2`; `pnpm test:motion --workers=2`;
  `pnpm test:visual --workers=2`; `pnpm test:a11y --workers=2`;
  `pnpm exec playwright test tests/e2e --workers=2`; focused Firefox/WebKit
  recovery commands; `pnpm prepare:standalone`; `pnpm smoke:standalone`;
  `pnpm lighthouse`; production-bundle inspection; deterministic evidence
  capture; `scripts/graphify-repository.sh update`; strict OpenSpec text/JSON
  validation; and final diff-integrity checks.
- **Static and component gates:** exact dependency validation, ESLint, and
  TypeScript passed. Vitest passed 201/201 unit tests in 20 files. Storybook
  built successfully and its browser project passed 57/57 tests in 12 files.
  Next produced 22/22 static pages.
- **Playwright:** the complete Chromium command passed 192/192 with the
  historical two-worker Phase 05 closure profile. The focused Phase 05 matrix
  passed 135/135 across
  Chromium, Firefox, and WebKit. The broader category runs passed motion 30/30,
  visual 207/207, and axe/accessibility 87/87 across all three engines. Every
  one of the 252 functional cross-browser E2E cases has a passing final run.
- **Transparent harness corrections:** an initial four-worker Chromium batch
  passed 172 before one valid post-commit safety recovery was treated as a
  nominal animation failure; the historical two-worker closure rerun passed
  192/192.
  The first cross-browser visual batch passed 205/207 and exposed the genuine
  12 px cue issue described above; the full rerun passed 207/207. The first
  accessibility batch passed 80 with one recovery-result mismatch and six
  serial skips; the corrected full rerun passed 87/87. One broad functional
  batch passed 232 with a Firefox XML-DOM harness defect and a saturated WebKit
  development fallback causing 18 serial skips. Reading sitemap/robots through
  their HTTP response passed 3/3, and the isolated WebKit Phase 05 file passed
  22/22. No product timeout or visual mismatch was waived.
- **Standalone:** packaging and smoke validation passed for 17 public routes
  and 18 static assets. No deploy, DNS, Cloudflare, Napoleon, production, or
  `app.wflyer.com.br` action was performed.
- **Lighthouse:** 15 final standalone runs over Home, Application, Services,
  Contact, and Privacy scored 100 in Performance, Accessibility, Best
  Practices, and SEO. FCP ranged from 246.5904 to 259.0004 ms; LCP from
  633.4194 to 666.0020 ms; CLS remained 0; maximum TBT was 1.5 ms.
- **Bundle/runtime inspection:** the transition/GSAP client chunk is 111,399
  bytes raw and 40,036 bytes gzip. The private test controller has zero
  production occurrences, as do OpenSpec and Graphify imports. GSAP registers
  once, `ScrollTrigger` is absent, and repeated navigation leaves one shell,
  zero timelines, no scroll lock, and no listener/timer growth.

#### Tooling closure, risk, and gate

- **Graphify:** version `0.9.31` refreshed the existing filtered graph from
  2,117 nodes / 3,142 edges / 234 communities to 2,493 / 3,699 / 257 and passed
  integrity validation. Ten vocabulary-expanded queries covered route motion,
  score branches, state ownership, coordinates, GSAP cleanup, history/deep
  links, focus, reduced motion, tests, and high-impact nodes. Eight results were
  saved as useful and two corrected stale pre-implementation memories.
  `SiteExperienceShell()` is now the highest-degree code node at 22 edges.
- **OpenSpec:** change `complete-phase-05-motion-navigation` was reconciled in
  English against the normative repository, completed 33/33 evidence-bearing
  tasks, passed strict text and JSON validation, and is archived as
  `openspec/changes/archive/2026-07-31-complete-phase-05-motion-navigation`.
  Canonical specifications are synchronized under `openspec/specs/`; no
  duplicate active Phase 05 change remains. The CLI emitted only its
  non-blocking advisory about changes with more than ten deltas; the two
  cohesive Phase 05 capabilities remain separately canonicalized.
- **Controlled risk:** local WebKit requires a reversible user-level Playwright
  host-library shim because administrator authentication is unavailable. The
  shim is outside the repository and production artifact. Next development
  mode can emit HMR chunk-load warnings under saturated multi-engine runs;
  production is prebuilt, standalone smoke is green, and isolated browser runs
  confirm the intended native fallback. Graphify warns about an inactive global
  0.9.23 skill copy, while the repository-local 0.9.31 skill and CLI take
  precedence. None is a product blocker.
- **Rollback:** remove the shell wrapper from `RootLayout` to restore fully
  native navigation, then remove the experience/motion modules and anchor data
  attributes. Server pages, real links, static scores, and content remain
  independently operable throughout that rollback.
- **Gate:** `COMPLETE`; implementation, tests, cross-browser behavior, visual
  comparison, accessibility, reduced motion, responsiveness, production build,
  standalone smoke, performance, evidence, Graphify, and OpenSpec are green.
- **Suggested commit:** `feat(motion): complete score-driven chapter navigation`.
- **Next exact phase:** Phase 06 — interactive Application tablet.

### Fase 6 — Tablet

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar o tablet em DOM e CSS 3D, com demonstração local determinística, teclado, toque, estados acessíveis e sem rede ou motor musical.

- **Arquivos criados:** componente focado `ApplicationDemoTablet`, CSS module, teste unitário, suíte E2E de jornada/privacidade/motion/responsividade, suíte visual de sete estados, 21 baselines por engine e change OpenSpec `complete-interactive-application-demo`.
- **Arquivos modificados:** rota e barrels da Aplicação, bloco/estilos/testes/stories de arquétipos, composição do primeiro viewport, configuração Vitest/Vite, contratos E2E/visuais existentes, este relatório e grafo Graphify.
- **Decisões aplicadas:** estado local tipado `idle/configured/processing/result/reset`; quatro selects nativos; processamento cancelável de 650 ms e troca direta em reduced motion; resultado explicitamente ilustrativo; SVG original; foco transferido de modo previsível à restauração; tilt GSAP limitado a 6° no desktop e 3° no tablet, restrito a precise hover e viewport; retorno ao repouso em saída, foco e aba oculta; nenhum upload, FileReader, fetch, XHR, WebSocket, storage, log de escolhas ou motor musical.
- **Comandos:** `openspec validate --strict`; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm test:storybook`; `pnpm build:storybook`; `pnpm build`; Playwright focado e cross-browser; axe da aplicação; geração e repetição das evidências; `graphify update .`; consulta Graphify de integração.
- **Testes e resultados:** 204/204 unitários; 62/62 Storybook; 15 cenários Phase 06 executados em Chromium/Firefox/WebKit (a verificação de jornada final passou 3/3 depois do ajuste de timing transitório); 21/21 comparações visuais cross-browser; 3 rotas do ramo Aplicação passaram axe nos quatro estados normativos; composição 1536 × 1024 e 320 px verdes; build Storybook e build Next com 22 rotas verdes.
- **Screenshots:** `tests/visual/phase06-tablet.visual.spec.ts-snapshots/` contém idle claro, idle escuro, foco, processamento, resultado, reduced motion e mobile para Chromium, Firefox e WebKit. As 21 imagens foram inspecionadas; o indicador de desenvolvimento foi explicitamente excluído das evidências.
- **Comparação visual:** a página preserva a divisão copy/tablet, a densidade, profundidade, moldura, hierarquia de controles e faixa de cinco benefícios da golden Aplicação desktop claro. A tela é DOM/SVG original e não reutiliza o raster nem simula precisão musical.
- **Acessibilidade:** labels, fieldset, botão nativo, `aria-busy`, região única `aria-live=polite`, foco previsível após resultado, reset, 44 × 44 px no mobile, ausência de overflow e reduced motion funcional foram automatizados; axe não encontrou violação nos estados do ramo.
- **Performance:** zero canvas contínuo, WebGL, rede ou listener de pointer fora do viewport; timers, media queries, observer e GSAP context são limpos; build de produção verde. Lighthouse completo permanece no gate acumulado da Fase 9.
- **Riscos controlados:** o teste revelou e corrigiu leitura tardia de SyntheticEvent e a mutação cross-engine do tipo do botão no fluxo reduced motion; botões agora têm identidade DOM distinta. Logs de Fast Refresh são filtrados apenas da asserção de privacidade de escolha, sem mascarar rede/storage/file access.
- **Graphify/OpenSpec:** grafo atualizado para 2.556 nós, 3.759 arestas e 265 comunidades; consulta localizou componente, rota, specs, stories e suítes. O change OpenSpec foi validado, sincronizado e arquivado como `2026-07-31-complete-interactive-application-demo`.
- **Pendências não bloqueadoras:** validação externa real não se aplica à demonstração local. A referência em vídeo ausente continua sem autoridade geométrica. Firefox/WebKit e as variantes autorizadas já foram cobertos localmente.
- **Gate:** `CONCLUÍDO`.
- **Título de commit:** `feat(application): complete interactive tablet demo`.

### Fase 7 — Abertura e motion local

**Estado:** `CONCLUÍDA`
**Objetivo:** implementar a abertura oficial, handoff, reveals, cards, notas, barras finais, skip, sessão, timeout e reduced motion.

- **Arquivos criados:** `BrandIntroController`, `LocalRevealController`, CSS module, barrel e story; cópia pública byte a byte do SVG oficial; testes unitários de controller, reveals e paridade do asset; suítes E2E, axe e visual; 30 baselines de checkpoints por engine; change OpenSpec `complete-brand-opening-motion`.
- **Arquivos modificados:** Home para montar a abertura sobre conteúdo já renderizado; layout para o lifecycle dos reveals locais; configuração e evidências acumuladas deste relatório; grafo Graphify.
- **Decisões aplicadas:** ADR-012 e especificação de 5,600 segundos; Home é o único ponto elegível; chave de sessão `wflyer.brand-intro.completed.v1`; SVG público idêntico à fonte aprovada, com `data-state="final"` e cor do tema aplicados somente à instância runtime; overlay progressivo e fail-open; GSAP limitado à timeline e reveals finitos; handoff por medição real ao pivot visível do header; reduced motion entrega diretamente a Home final, conforme a especificação da Home.
- **Comandos:** Context7 para React, `@gsap/react` e Vite; consultas Graphify; ciclo OpenSpec completo; `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm test:storybook`; `pnpm build:storybook`; Playwright E2E, visual, motion e axe nos três engines; `pnpm build`; `pnpm prepare:standalone`; `pnpm smoke:standalone`; `pnpm lighthouse`; `graphify update .`; validação OpenSpec estrita e inspeção de diff.
- **Testes e resultados:** lint e TypeScript verdes; 214/214 unitários em 24 arquivos; 63/63 Storybook em 13 arquivos; 21 verificações Phase 07 cross-browser considerando a suíte integral e o cenário dedicado de timeout; 30/30 snapshots Phase 07; 6/6 axe da abertura; 30/30 testes motion acumulados com dois workers; build Storybook verde; build Next com 22 páginas; standalone com 17 rotas e 21 assets.
- **Screenshots:** `tests/visual/phase07-brand-intro.visual.spec.ts-snapshots/` contém sete labels normativos, hold escuro, wordmark mobile e Home final reduced motion para Chromium, Firefox e WebKit. As variantes foram inspecionadas; os snapshots são evidência de QA, não golden references novas.
- **Comparação visual:** a sequência progride de origem mínima para símbolo, ecos cromáticos, lockup oficial e transferência ao símbolo do header, preservando a superfície e o contraste da Home em claro e escuro. A instância runtime usa exclusivamente os paths e IDs oficiais; nenhum raster, vídeo, recorte, logo substituto ou filtro de deformação foi usado.
- **Acessibilidade:** nome acessível `W_Flyer`, botão nativo `Pular introdução` com alvo mínimo de 44 px, Escape, desbloqueio de scroll, sessão, timeout, falha de asset, resize/orientação e teardown foram cobertos. Reduced motion não monta overlay nem motion modular. Axe encontrou zero violação crítica ou séria em claro/escuro, desktop/mobile e nos três engines.
- **Performance:** a abertura não altera o HTML server-rendered nem o LCP reduzido; o asset local é cacheável, a timeline é única e cancelável, o timeout é finito e os observers/reveals limpam estilos. Quinze execuções Lighthouse em cinco rotas obtiveram 100 em Performance, Acessibilidade, Boas práticas e SEO.
- **Corrective Home-opening audit (2026-08-03):** a post-archive review
  confirmed that the normative `hero:start` (4.25 s) to `hero:ready`
  (5.60 s) interval had labels but no authored Home choreography. Stable,
  layout-neutral targets now expose the existing header score, Home score,
  origin, branch copy, actions, and exploration cue. One deterministic GSAP
  timeline reveals score lines from their branch origins, then details,
  origin, copy with at most 20 px of directional travel, actions, and the cue;
  the prior intro, official asset, handoff, final DOM, and reduced-motion
  delivery remain unchanged.
- **Corrective interaction boundary:** while the overlay is waiting or playing,
  its direct experience-shell siblings are `inert` and `aria-hidden`, except
  the decorative score-transition layer. Their exact previous attribute states
  are restored on skip, Escape, completion, timeout, resize/orientation,
  visibility loss, asset failure, and unmount. The native skip button is the
  only keyboard-operable control during the opening.
- **Corrective validation:** focused lint and repository TypeScript passed;
  12/12 component/unit checks and 63/63 Storybook checks passed. The complete
  Phase 07 cross-browser runs passed 30/30 functional cases, 6/6 axe checks,
  and 36/36 visual comparisons across Chromium, Firefox, and WebKit. The full
  visual matrix passed once
  during the authorized baseline update and again unchanged; all 33 changed or
  new images were inspected manually in light, dark, desktop, and mobile
  variants.
- **Reviewed baseline correction:** 27 legacy Phase 07 checkpoints were
  regenerated only after expected/actual/diff review proved that they captured
  Next's development-only `N` indicator, which the visual harness intentionally
  excludes. Six new baselines cover the real Home-opening interval on light
  desktop and dark mobile across all three engines. Reduced-motion baselines
  did not change, and no product image, approved golden reference, or baseline
  outside Phase 07 was modified.
- **Controlled risks:** the first SVG document instance exposed a white
  dark-theme background and an initial state without the wordmark; an in-memory
  local Blob instance replaced it while preserving the approved file byte for
  byte and enabling only its authored final state. A four-worker motion run
  saturated Firefox/WebKit and timed out on two older Phase 05 cases; both
  passed in isolation, and the historical two-worker closure matrix passed
  30/30. The current Phase 09 release profile is one worker.
- **Pendências não bloqueadoras:** o vídeo externo ausente continua sem autoridade geométrica; a sessão é deliberadamente por aba; validação em staging permanece na Fase 9. Nenhuma integração, secret ou publicação externa é necessária para este gate local.
- **Graphify/OpenSpec:** Graphify `0.9.31` atualizou o mapa final para 2.651 nós, 3.859 arestas e 282 comunidades e conectou controller, Home, header, specs e testes; o subcomando legado `validate` não existe nessa versão, sem afetar os rebuilds e a consulta concluídos. O change OpenSpec concluiu 14/14 tarefas, passou validação estrita, foi sincronizado na capability canônica `brand-opening-motion` e arquivado como `2026-07-31-complete-brand-opening-motion`.
- **Gate:** `CONCLUÍDO`; timeline, recuperação, reduced motion, motion local, visual, acessibilidade, performance, standalone, Graphify e OpenSpec verdes.
- **Título de commit:** `feat(brand): complete accessible opening motion`.

### Phase 08 — Final content, secure contact, and browser security

**Status:** `COMPLETE`
**Objective:** finish the approved public content and legal routes, implement
the private `POST /api/contact` boundary, and establish the locally enforceable
security baseline without persistence, analytics, fabricated claims, or
premature production policy.

- **Created files:** the contact route; focused schema/configuration,
  Turnstile, Resend, and barrel modules under `src/lib/contact/`; the accessible
  `ContactForm`, styles, barrel, and component tests; three Phase 08 Playwright
  suites; 27 cross-engine visual baselines; the security validation report;
  and OpenSpec change `complete-content-contact-security`.
- **Modified files:** Contact composition and its archetype tests/styles;
  official content and legal dates; the contact/content policy; privacy and
  release-security documentation; safe response headers and report-only CSP;
  Playwright's public Turnstile test key; dependency resolution; the mobile
  header's conditional `aria-controls`; accumulated E2E/content tests;
  Graphify outputs/map; and this report. The unrelated `README.md` indentation
  remains untouched and excluded from the phase commit.
- **Implementation:** the API applies an exact finite order for media type,
  streamed 16 KiB size, server configuration, origin, JSON, honeypot, strict
  Zod data, Turnstile action/hostname, and fixed-address plain-text Resend
  delivery. It returns generic no-store JSON and never persists or logs contact
  payloads. The client provides native labels and constraints, enum-only query
  preselection, explicit widget lifecycle, an eight-second unavailable
  fallback, reset/expiry/error recovery, focusable live status, success/error
  states, 44 px mobile controls, and the official email fallback.
- **Content and policy:** all official routes retain Portuguese public copy and
  the documented email, application, Instagram, GitHub, and three-project
  portfolio facts. Privacy and cookie content now match runtime storage:
  `wf-theme` in local storage and the session-only opening marker. No analytics,
  pixel, replay, marketing cookie, consent banner, metric, testimonial, legal
  identifier, or unsupported claim was introduced.
- **Security:** browser responses include `nosniff`, `DENY`, same-origin COOP,
  restrictive referrer and permissions policies, and a report-only CSP limited
  to the application and Turnstile with no `unsafe-eval`. HSTS and CSP
  enforcement remain deliberately deferred until HTTPS and CSP-report
  observation in staging. The production dependency audit reports zero known
  vulnerabilities after pinned transitive overrides; peer validation is
  clean, and source inspection found no secret, analytics, attachment,
  persistence, visitor-HTML, or contact logging path.
- **Commands:** exact dependency validation; ESLint; TypeScript; unit and
  Storybook builds/tests; production build; standalone packaging/smoke;
  focused and complete Playwright matrices; Lighthouse; production audit and
  peer check; secret/source inspection; strict OpenSpec validation; Graphify
  update/query/diagnostics; and final worktree integrity checks.
- **Measured results:** 239/239 unit/component tests in 28 files and 63/63
  Storybook tests in 13 files passed. The complete Chromium matrix passed
  239/239 with the then-established two-worker Phase 08 profile. The focused
  cross-browser Phase 08 matrix passed 48/48: 12 functional/security checks,
  9 axe executions,
  and 27 visual comparisons across Chromium, Firefox, and WebKit. Next built 22
  routes with `/api/contact` correctly dynamic; standalone smoke passed 17
  public routes and 19 assets.
- **Visual/accessibility/responsive evidence:** nine reviewed states—idle,
  field error, verified, submitting, success, provider error, dark, mobile, and
  reduced motion—pass in all three engines. Automated evidence covers labels,
  constraints, announcements, focus transfer, keyboard operation, 320 px
  portrait, 844 × 320 landscape, zoom/reflow invariants, theme parity, reduced
  motion, the Contact final barline, and zero horizontal overflow. No physical
  screen-reader or independent legal/accessibility review is falsely claimed;
  both remain homologation gates.
- **Performance:** 15 final Lighthouse runs over Home, Application, Services,
  Contact, and Privacy scored 100/100/100/100. FCP was
  249.1132–262.39 ms, LCP 638.62115–719.94585 ms, maximum CLS 0.0034082042,
  and TBT 0 ms. The contact provider work remains server-only and finite; the
  only browser third-party script is Turnstile on Contact.
- **Graphify/OpenSpec:** the filtered Graphify graph advanced from 2,651 nodes,
  3,859 edges, and 282 communities to 2,793 / 4,038 / 287. Diagnostics report
  zero missing/dangling endpoints, self-loops, or duplicate edges. A bounded
  contact-flow query connected UI, API, schema, Turnstile, Resend, tests, and
  runtime gates and corrected the stale memory that the endpoint was still
  unimplemented. The OpenSpec change completed 21/21 tasks, was strictly
  validated, synchronized into two canonical capabilities, and archived as
  `2026-07-31-complete-content-contact-security`.
- **External gates:** provider secrets, verified Resend sender, environment-
  specific Turnstile keys, Napoleon runtime variables, read-only Cloudflare
  inventory, edge rate limit/WAF decision, staging CSP observation, HSTS review,
  log-retention approval, and professional legal review remain Phase 09 owner
  or infrastructure actions. No external system was mutated.
- **Gate:** `COMPLETE`; local implementation, content, tests, cross-browser
  behavior, reviewed visuals, accessibility automation, responsiveness,
  dependency/security inspection, build, standalone, Lighthouse, Graphify, and
  OpenSpec are green.
- **Commit title:** `feat(contact): complete secure contact workflow`.

### Phase 09 — Napoleon, staging, and production

**State:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`

**Objective:** complete repository-owned release preparation, prove the exact
candidate, prepare the Napoleon Git pull/build handoff and rollback procedure,
deploy and validate staging after external configuration, obtain homologation,
and only then request separate production approval.

- **Repository work complete:** the manual candidate workflow, standalone
  preparation and smoke corrections, release/operations documentation, the
  Napoleon Node.js runtime runbook, the staging homologation runbook and factual
  pending report, and the Napoleon rollback runbook passed repository-owned
  review and validation. Their forward-only commit series preserves the
  published `065a077f9425943af8bc3ea821660bb356aef1da` checkpoint.
- **Git identity boundary:**
  `065a077f9425943af8bc3ea821660bb356aef1da` is the preserved published
  checkpoint before the forward-only Phase 09 closure series. The final
  containing commit is resolved with `git rev-parse HEAD` after creation and
  recorded in the external handoff; it is not self-embedded in this document.
- **Remote CI evidence:** ordinary CI run `31118939281` for that revision
  failed before any job steps were recorded; all four jobs have no runner or
  steps, and the retained workflow annotation reports that the GitHub account
  is locked for billing. This is an external account blocker, not a code result.
- **Release-workflow bootstrap:** remote branch
  `ci/napoleon-release-workflow-bootstrap` identifies
  `d67554be7ceee4f2e744380275860781d302d145` and carries the release workflow
  bootstrap. Owner review and merge into the protected execution path remain
  pending; the bootstrap branch is not a deployment.
- **Runtime and handoff:** Napoleon independently pulls and builds the selected
  Git revision, then runs `node .next/standalone/server.js` as a persistent
  Node.js process. The Actions archive is candidate-validation and provenance
  evidence only.
- **Configuration boundary:** GitHub Environment values and Napoleon
  build/runtime values are separate and must be configured independently. No
  secret value is recorded in this report.
- **Current validation:** frozen install, dependency policy, lint, typecheck,
  306 unit tests, 63 Storybook tests, four 22-route build modes, Node-only
  standalone/indexing smoke, Lighthouse 15/15 with all four category scores at
  1.00, production audit, peers, strict OpenSpec 11/11, actionlint, syntax,
  documentation, and Graphify integrity passed. In the pinned Noble image,
  E2E passed 318/318 in 593 seconds, axe 102/102 in 293 seconds, motion 30/30
  in 81 seconds, and two unchanged visual runs passed 291/291 in 501 and 521
  seconds. Focused repeats passed Firefox 10/10 and WebKit 5/5 + 5/5. The
  84-PNG manifest remained byte-identical at `ba4f23c08613c1c1c9a1481fa6d8466dd7bfa0641cf3b6ae898424966ccc6b63`.
- **External evidence pending:** GitHub Environment configuration; actual
  Napoleon panel inventory, values, target, and source-build SHA; Davi
  Benucci-approved staging hostname; read-only Cloudflare inventory; deployed
  staging; real Turnstile and Resend checks; HTTPS/cache/WAF/rate-limit checks;
  log review; physical-device and screen-reader review; rollback exercise; and
  dated homologation.
- **Visual, accessibility, and performance:** current repository-side evidence
  is complete at zero tolerance. All 35 replacement paths have a granular
  repository review; Davi Benucci's human visual decision and deployed-staging
  evidence remain pending.
- **Protection:** production is unauthorized. No merge to `main`, production
  deployment, production DNS mutation, or change to `app.wflyer.com.br` is
  authorized by repository preparation.
- **Gate:** repository-owned work complete; remote CI, default-branch bootstrap
  merge, GitHub Environments, Napoleon, Cloudflare/DNS, deployed staging,
  physical review, rollback, and homologation remain external.
- **Reviewed commit series:** `fix(deps): override vulnerable nanoid`,
  `fix(quality): align Node release and browser evidence`, and
  `docs(release): prepare Napoleon staging and homologation`. Full SHAs are
  recorded by Git after creation and in the final execution handoff rather than
  self-embedded into their own content.

## 5. Histórico de atualizações

| Data | Atualização |
|---|---|
| 2026-07-29 | Relatório criado; pré-voo registrado como concluído; Fase 0 iniciada sem declarar testes antecipadamente. |
| 2026-07-29 | Fase 0 concluída após correção do manifesto tipado, WCAG 2.2 AA, favicon oficial, 8 testes unitários, Storybook, Playwright, standalone, Actionlint e Lighthouse 100/100/100/100. Fase 1 iniciada. |
| 2026-07-29 | Fase 1 concluída com design system, fontes locais, temas, marca oficial, pauta, header, navegação e catálogo; 48 unitários, 33 stories e 13 cenários Playwright verdes; standalone com 12 assets verificados; Lighthouse 100/100/100/100 em três execuções. Fase 2 iniciada. |
| 2026-07-30 | Execução retomada sem perda de trabalho. A Fase 2 foi revalidada com dependências exatas, lint, tipos, 52 unitários, build de 22 páginas, standalone de 17 rotas e 14 assets e 35 cenários concentrados; o relatório recebeu o registro de continuidade e a Fase 3 foi alinhada como pronta para iniciar após a consolidação Git. |
| 2026-07-30 | Fase 3 concluída com Home bifurcada, clave narrativa original, pauta de origem, anchors de oito capítulos, navegação direcional, barras finais e fallback vertical; 58 unitários, 38 stories, 73 Playwright, standalone 17+14 e Lighthouse 100/100/100/100 em três execuções. Fase 4 liberada. |
| 2026-07-30 | Fase 4 concluída após auditoria e recomposição de densidade no viewport normativo, com 16 páginas pelos arquétipos autorizados, tablet estático em DOM, pautas separadas do texto, Serviços em ordem canônica, header legal simplificado, terminais corrigidos e 15 evidências; 65 unitários, 46 stories, 147 Playwright, standalone 17+17 e Lighthouse 100/100/100/100 em 15 execuções sobre cinco rotas. Três revisões independentes finais retornaram `NÃO BLOQUEIA`; Fase 5 liberada. |
| 2026-07-30 | Registrado subpasso corretivo exclusivamente de tooling, documentação e CI com Graphify `0.9.31` e OpenSpec `1.7.0`, acompanhado pelos documentos 18, 19 e 20. Nenhuma feature de motion ou navegação foi implementada; a Fase 5 permanece `PRONTA_PARA_INICIAR`. |
| 2026-07-31 | Phase 05 completed with a persistent score-transition shell, manifest-derived topology, cancelable GSAP lifecycle, truthful history/focus behavior, live reduced motion, seven deterministic evidence captures, 201 unit tests, 57 Storybook tests, 192 Chromium checks, 135 focused cross-browser Phase 05 checks, 30 motion, 207 visual, 87 axe/accessibility, standalone 17+18, and Lighthouse 100/100/100/100 in 15 final runs. Graphify refreshed to 2,493 nodes and OpenSpec archived after 33/33 tasks; Phase 06 released. |
| 2026-07-31 | Phase 06 completed with a semantic local tablet, deterministic five-state interaction, cancellable processing, original SVG score, precise-hover GSAP tilt, privacy instrumentation, 204 unit tests, 62 Storybook tests, 15 focused cross-browser interactions, 21 cross-browser state baselines, four-state axe coverage for all three Application routes, responsive 320 px and canonical 1536 × 1024 checks, and production/Storybook builds. Graphify refreshed to 2,556 nodes and the new OpenSpec capability was synchronized and archived; Phase 07 released. |
| 2026-07-31 | Phase 07 completed with the immutable official SVG, a 5.600-second labeled GSAP opening, measured symbol-to-header handoff, one-session eligibility, skip/Escape/timeout/fail-open recovery, direct reduced-motion Home, route-aware finite local reveals, 214 unit tests, 63 Storybook tests, 21 focused cross-browser behaviors, 30 visual baselines, 6 axe audits, 30 accumulated motion checks, standalone 17+21, and Lighthouse 100/100/100/100 across 15 runs. OpenSpec and Graphify were refreshed before Phase 08 was released. |
| 2026-07-31 | Phase 08 completed with strict 16 KiB contact validation, Turnstile and Resend boundaries, accessible recoverable client states, truthful privacy/legal content, report-only CSP and browser headers, zero known production dependency vulnerabilities, 239 unit/component tests, 63 Storybook tests, 239 complete Chromium checks, a 48-case dedicated cross-browser matrix, 27 reviewed form baselines, standalone 17+19, and Lighthouse 100/100/100/100 across 15 runs. Graphify advanced to 2,793 nodes and OpenSpec was synchronized and archived before Phase 09. |
| 2026-08-10 | Phase 09 facts reconciled without declaring final gates: pnpm 11.18.0; Napoleon Git pull/build with `.next/standalone/server.js`; separate GitHub and Napoleon values; owner-approved staging hostname pending; final current-revision validation and external configuration pending; production unauthorized. Historical dated checkpoints above remain unchanged. |
| 2026-08-10 | Phase 09 repository closure completed: Node-only standalone, two immutable 291/291 visual matrices, 318 E2E, 102 axe, 30 motion, focused repeats, source/build/dependency gates, runbooks, additive integrity manifest, strict OpenSpec, and Graphify passed. GitHub billing, bootstrap PR/merge, provider configuration, staging, human review, rollback, and homologation remain external; production is unauthorized. |
