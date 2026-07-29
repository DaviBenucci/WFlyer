# Relatório acumulado de execução do Codex

**Projeto:** site institucional `wflyer.com.br`  
**Início da execução:** 2026-07-29  
**Implementação:** `EM_EXECUÇÃO_LOCAL`  
**Publicação:** `NÃO_AUTORIZADA`  
**Responsável pela homologação:** Davi Benucci

## 1. Escopo e regra de publicação

Este relatório acompanha a implementação integral do site institucional W_Flyer, das Fases 0 a 9, conforme o contrato de execução e a ordem normativa do repositório.

O trabalho está limitado ao repositório do site institucional. Não inclui código ou regras da aplicação musical, OCR/OMR, transposição real, autenticação, banco de dados, CMS, analytics ou alteração de `app.wflyer.com.br`.

A execução local, os testes, os workflows, o build standalone e a preparação de staging estão autorizados. Permanecem proibidos, sem homologação explícita de Davi Benucci:

- merge final em `main`;
- publicação em produção;
- alteração destrutiva ou não inventariada de DNS, Cloudflare ou Napoleon;
- qualquer ação que possa interromper `app.wflyer.com.br`.

## 2. Estado inicial das fases

| Etapa | Estado inicial | Gate |
|---|---|---|
| Pré-voo | `CONCLUÍDO` | sem bloqueio normativo real |
| Fase 0 — Fundação | `CONCLUÍDA` | gate local verde |
| Fase 1 — Sistema visual | `CONCLUÍDA` | gate local verde |
| Fase 2 — Conteúdo e rotas estáticas | `EM_EXECUÇÃO` | aberto |
| Fase 3 — Home e dupla partitura | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 4 — Páginas por arquétipo | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 5 — Motion e navegação | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 6 — Tablet | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 7 — Abertura e motion local | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 8 — Contato, segurança e conteúdo final | `AGUARDANDO_GATE_ANTERIOR` | não avaliado |
| Fase 9 — Napoleon, staging e produção | `AGUARDANDO_GATES_LOCAIS_E_ACESSOS_EXTERNOS` | não avaliado |

Nenhum teste de implementação é declarado verde neste estado inicial. Cada fase somente poderá mudar para `CONCLUÍDA` depois de satisfazer integralmente seu gate.

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

### 3.6 Dependências externas de staging e produção

As pendências abaixo não bloqueiam as Fases 0 a 8 nem o preparo local da Fase 9:

- cadastrar, nos GitHub Environments adequados, os valores reais de `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL` e `CONTACT_ALLOWED_ORIGINS`;
- definir o mecanismo real disponibilizado pela Napoleon e, somente se aplicável, cadastrar a credencial correspondente;
- configurar as variáveis também no runtime da aplicação Napoleon quando o provedor operar por pull do GitHub;
- obter acesso somente leitura para inventário de zona, registros, SSL/TLS, cache, WAF, rate limiting e origem Cloudflare;
- provisionar e validar staging;
- executar testes externos reais de Turnstile, Resend, HTTPS, cache, headers e entrega de e-mail;
- obter homologação explícita de Davi Benucci;
- validar `app.wflyer.com.br` antes e depois de qualquer publicação;
- executar smoke test de produção e teste de rollback após a homologação.

Nenhum endpoint, webhook, token ou credencial Napoleon será inventado.

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

**Estado:** `EM_EXECUÇÃO`
**Objetivo:** implementar todas as rotas, conteúdo local, páginas legais, SEO, sitemap, robots, estados de erro, 404, footer e navegação funcional sem depender de motion.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** a registrar.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar.
- **Comparação visual:** pendente.
- **Acessibilidade:** pendente, incluindo teclado, foco e semântica.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** a registrar.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 3 — Home e dupla partitura

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar Home, origem, bifurcação, pautas, âncoras, continuidade, terminações e fallback mobile conforme o manifesto de capítulos.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** a registrar.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar por tema e viewport.
- **Comparação visual:** pendente contra painéis Home da prancha mestra.
- **Acessibilidade:** pendente.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** a registrar.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 4 — Páginas por arquétipo

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar, na ordem normativa, Aplicação, Como funciona, Benefícios, Empresa, Serviços, Processo, Portfólio, Contato, quatro detalhes de serviço e páginas legais.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** a registrar por página, matriz e arquétipo.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar por página, tema e viewport.
- **Comparação visual:** pendente contra referência individual, painel ou arquétipo autorizado.
- **Acessibilidade:** pendente, incluindo axe e navegação por teclado.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** a registrar.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 5 — Motion e navegação

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar transições adjacentes, saltos comprimidos, pivô pela Home, deep links, histórico, foco, fallback, timeout e reduced motion.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** GSAP como único motor coordenado; scroll nativo; navegação semântica preservada.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar quando aplicável.
- **Comparação visual:** pendente.
- **Acessibilidade:** pendente, incluindo foco e reduced motion.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** a registrar.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 6 — Tablet

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar o tablet em DOM e CSS 3D, com demonstração local determinística, teclado, toque, estados acessíveis e sem rede ou motor musical.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** tilt máximo documentado; remoção de tilt no mobile e reduced motion; nenhuma imagem achatada, WebGL ou upload.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar.
- **Comparação visual:** pendente contra Aplicação desktop claro e derivação autorizada.
- **Acessibilidade:** pendente, incluindo anúncio do resultado.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** a registrar.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 7 — Abertura e motion local

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar a abertura oficial, handoff, reveals, cards, notas, barras finais, skip, sessão, timeout e reduced motion.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** ADR-012; SVGs oficiais imutáveis; timeline de 5,600 segundos; execução uma vez por sessão.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar nos checkpoints normativos.
- **Comparação visual:** pendente contra SVGs, storyboards e timeline.
- **Acessibilidade:** pendente, incluindo Escape, botão de pular e desbloqueio seguro.
- **Performance:** pendente.
- **Riscos:** a registrar.
- **Pendências não bloqueadoras:** vídeo externo de referência ausente, sem autoridade geométrica e sem efeito no gate local.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 8 — Contato, segurança e conteúdo final

**Estado:** `AGUARDANDO_GATE_ANTERIOR`  
**Objetivo:** implementar `POST /api/contact`, Zod, Turnstile, Resend, honeypot, limites, origem, logs sanitizados, headers, CSP, políticas e conteúdo oficial, sem persistência ou analytics.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** ADR-009, ADR-010, ADR-021 e ADR-022.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar.
- **Comparação visual:** pendente.
- **Acessibilidade:** pendente, incluindo erros e confirmações do formulário.
- **Performance:** pendente.
- **Riscos:** integração externa real indisponível sem secrets; ativação prematura de HSTS proibida.
- **Pendências não bloqueadoras:** testes locais poderão usar mocks fechados; testes reais dependem dos acessos da seção 3.6.
- **Gate:** `NÃO_AVALIADO`.
- **Título de commit:** a definir.

### Fase 9 — Napoleon, staging e produção

**Estado:** `AGUARDANDO_GATES_LOCAIS_E_ACESSOS_EXTERNOS`  
**Objetivo:** validar build standalone, preparar o procedimento Napoleon, workflows e rollback; publicar staging; executar QA externo; obter homologação; somente então publicar produção.

- **Arquivos criados:** a registrar.
- **Arquivos modificados:** a registrar.
- **Decisões aplicadas:** ADR-018, ADR-020, ADR-021 e ADR-023.
- **Comandos:** a registrar.
- **Testes e resultados:** não executados.
- **Screenshots:** a registrar para staging e evidências externas.
- **Comparação visual:** pendente em staging.
- **Acessibilidade:** pendente em staging.
- **Performance:** pendente em staging e produção.
- **Riscos:** credenciais, método real de deploy, inventário Cloudflare, HSTS e preservação da aplicação existente.
- **Pendências não bloqueadoras:** preparação local; as dependências externas tornam-se bloqueadoras somente no ponto de integração correspondente.
- **Gate:** `NÃO_AVALIADO`; produção exige homologação explícita.
- **Título de commit:** a definir.

## 5. Histórico de atualizações

| Data | Atualização |
|---|---|
| 2026-07-29 | Relatório criado; pré-voo registrado como concluído; Fase 0 iniciada sem declarar testes antecipadamente. |
| 2026-07-29 | Fase 0 concluída após correção do manifesto tipado, WCAG 2.2 AA, favicon oficial, 8 testes unitários, Storybook, Playwright, standalone, Actionlint e Lighthouse 100/100/100/100. Fase 1 iniciada. |
| 2026-07-29 | Fase 1 concluída com design system, fontes locais, temas, marca oficial, pauta, header, navegação e catálogo; 48 unitários, 33 stories e 13 cenários Playwright verdes; standalone com 12 assets verificados; Lighthouse 100/100/100/100 em três execuções. Fase 2 iniciada. |
