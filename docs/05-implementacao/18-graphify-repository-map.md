# Mapa arquitetural Graphify

**Status:** GERADO_LOCALMENTE  
**Data da baseline:** 2026-07-30  
**Graphify:** `0.9.31`  
**Modo:** normal, grafo não direcionado  
**Raiz analisada:** repositório do site institucional W_Flyer

## 1. Papel e precedência

O Graphify é um índice auxiliar de descoberta e navegação arquitetural. Ele não
substitui ADRs, contratos, manifests, specs, referências visuais aprovadas nem a
ordem normativa definida em `AGENTS.md`. Uma resposta do grafo deve ser
conferida na fonte indicada antes de orientar implementação.

Consultas transversais sobre rotas, componentes, documentos e dependências
devem começar pelo grafo. Uma busca local pontual continua mais adequada para
um símbolo ou arquivo conhecido.

## 2. Corpus e exclusões

O corpus parte de `.` e é filtrado por `.graphifyignore`. Permanecem incluídos
código, configuração, testes, Storybook, documentação normativa e assets SVG
originais. Duas imagens raster entram por exceção explícita por serem as golden
references canônicas:

- `docs/design-reference/golden-pages/master/wflyer-approved-master-board.png`;
- `docs/design-reference/golden-pages/application/application-desktop-light.png`.

Ficam excluídos:

- `.git`, `node_modules`, `.next`, caches e stores de ferramentas;
- builds, cobertura, relatórios Playwright/Lighthouse e Storybook gerado;
- outputs comuns do próprio `graphify-out`;
- skills vendorizadas em `.codex/skills`;
- lockfiles, source maps, archives e arquivos temporários;
- imagens raster não canônicas, áudio, vídeo e fontes.

Arquivos detectados como sensíveis são omitidos pelo Graphify e precisam ser
revisados separadamente; nenhum segredo deve ser forçado para dentro do grafo.
O Graphify 0.9.31 reinjeta deliberadamente apenas
`graphify-out/memory/*.md` para seu feedback loop, mesmo com a exclusão ampla.
Essa exceção local é validada separadamente e não libera cache, JSON, HTML,
queries brutas ou outros outputs como fonte.

## 3. Geração reproduzível

Pré-requisitos:

```bash
graphify --version
openspec --version
scripts/graphify-repository.sh deps
```

Primeira geração interativa pelo Codex, necessária quando não há chave Gemini:

```text
$graphify .
```

Operações locais posteriores:

```bash
scripts/graphify-repository.sh update
scripts/graphify-repository.sh validate
scripts/graphify-repository.sh query "pergunta arquitetural"
```

O subcomando `generate` aceita o fluxo headless somente quando
`GEMINI_API_KEY` ou `GOOGLE_API_KEY` já está configurada. Sem uma dessas chaves,
ele encerra com orientação explícita para usar a skill interativa; não reduz
silenciosamente o corpus a código.

## 4. Estatísticas da baseline

<!-- GRAPHIFY_STATS_START -->
| Medida | Resultado |
|---|---:|
| Arquivos elegíveis | 307 |
| Palavras detectadas | 247.658 |
| Código | 131 arquivos |
| Documentos | 156 arquivos |
| Imagens | 20 arquivos |
| AST | 887 nós / 1.885 arestas |
| Semântica | 1.230 nós / 1.589 arestas / 59 hiperarestas |
| Extração combinada | 2.117 nós / 3.474 arestas brutas |
| Grafo não direcionado | 2.117 nós / 3.142 arestas |
| Comunidades | 234 |

A extração semântica contém 1.251 relações `EXTRACTED`, 332 `INFERRED` e
6 `AMBIGUOUS`; todas as 1.589 têm `confidence_score`. A extração AST é
estrutural e não precisa simular score probabilístico.

`src/styles/tokens.css` foi o único arquivo omitido pela heurística de
sensibilidade. O arquivo não foi forçado para o corpus; seus efeitos continuam
representados indiretamente pelo código e pela documentação de tema/tokens.

O benchmark interno usou 105.850 palavras efetivamente associadas ao grafo,
estimou 141.133 tokens para leitura ingênua e 5.959 tokens por consulta:
redução média de `23,7×`.

O diagnóstico registrou zero endpoint ausente, zero self-loop e zero nó de
código não verificado. Também encontrou 165 arestas pendentes, 109 duplicatas
exatas e 167 relações que compartilham o mesmo par de endpoints e colapsam no
grafo não direcionado — 159 no equivalente direcionado. A baseline é
consultável, mas essa perda de
multirrelações deve permanecer visível e ser reavaliada em upgrades futuros.
<!-- GRAPHIFY_STATS_END -->

## 5. Comunidades e nós de maior impacto

<!-- GRAPHIFY_COMMUNITIES_START -->
As dez maiores comunidades:

| Comunidade | Nós |
|---|---:|
| UI Foundations | 86 |
| Musical Score Components | 65 |
| Theme and Storybook | 53 |
| Intro Brand Vectors | 52 |
| Security and Operations | 48 |
| Reference Manifest Schema | 47 |
| Package and Automation | 46 |
| Header Navigation | 45 |
| Brand Symbols and Icon | 41 |
| Brand Asset Documentation | 40 |

As 234 comunidades receberam rótulos únicos de duas a cinco palavras. A
quantidade alta decorre de ADRs, dependências e schemas pouco conectados; o
relatório omite 93 comunidades finas na listagem expandida, sem removê-las do
JSON ou do HTML.

God nodes por grau:

1. `scripts` — 21;
2. `LinkButton()` — 20;
3. `createPageMetadata()` — 18;
4. `compilerOptions` — 18;
5. `Relatório acumulado de execução do Codex` — 18;
6. `Mapa arquitetural Graphify` — 17;
7. `Relatório do bootstrap Graphify e OpenSpec` — 17;
8. `.next` — 16;
9. `Manifesto de capítulos da partitura` — 16;
10. `classNames()` — 15.
<!-- GRAPHIFY_COMMUNITIES_END -->

Comunidades são agrupamentos probabilísticos. Um nó central indica alto impacto
na topologia extraída, não prioridade normativa nem autorização para alteração.

## 6. Consultas de aceitação

Cada resultado abaixo deve ser classificado como:

- `EXTRAÍDO`: apoiado diretamente por nós, relações e localizações do corpus;
- `INFERIDO`: síntese plausível a partir de mais de uma fonte do grafo;
- `AMBÍGUO`: corpus insuficiente ou implementação ainda inexistente.

<!-- GRAPHIFY_QUERIES_START -->
1. **Como as rotas principais se conectam ao sistema da dupla partitura?**
   `EXTRAÍDO`: `src/config/chapters.ts` declara capítulos, ramo, ordem, paths,
   vizinhança e índices por rota; `ChapterScore.tsx` transforma esses dados em
   geometria e `NavigationMeasure.tsx` os expõe no header. `INFERIDO`: páginas
   estáticas e header compartilham o mesmo manifesto como costura visual e
   semântica. `AMBÍGUO`: isso não prova transição animada entre documentos; o
   lifecycle da Fase 05 ainda não existe.
2. **Quais componentes, hooks e serviços controlam as transições GSAP entre os
   capítulos?** `EXTRAÍDO`: hoje existem `chapters.ts`, `ChapterScore`,
   `OriginScore`, `NavigationMeasure` e a dependência `gsap`. `INFERIDO`: o
   OpenSpec planeja `SiteExperienceShell`, provider, classificador, máquina
   cancelável e timelines. `AMBÍGUO`: não há hooks/serviços ou shell de
   transição implementados; os nós correspondentes vêm de proposta/design/tasks.
3. **Como a Home se conecta aos ramos Aplicação e Institucional?**
   `EXTRAÍDO`: `OriginScore.tsx`, `scoreManifest`, `scoreChapterByPath` e as
   medidas do header modelam Home como origem, Aplicação à esquerda e
   Institucional à direita. `INFERIDO`: a troca de ramo usa a Home como pivô
   conceitual. `AMBÍGUO`: o modo animado `home-pivot` continua somente
   especificado.
4. **Como o tema claro e escuro percorre os componentes?** `EXTRAÍDO`:
   `RootLayout` importa `ThemeProvider`/`ThemeToggle`; o provider lê storage,
   resolve preferência do sistema, aplica tema e expõe `useTheme`. Stories
   cobrem Claro/Escuro. `INFERIDO`: componentes descendentes herdam o estado
   visual global. `AMBÍGUO`: o grafo não comprova consumo individual por todo
   componente.
5. **Como o formulário chega a `/api/contact`, Turnstile e Resend?**
   `EXTRAÍDO`: o fluxo atual termina em `ContactPage` → `ContactWorkspace` →
   `ContactProjectTypeSelect`; `resend` aparece como dependência. `INFERIDO`: os
   documentos prescrevem POST, validação Turnstile e envio Resend. `AMBÍGUO`:
   não há Route Handler, chamada Turnstile ou chamada Resend no código; a Fase
   08 continua aguardando.
6. **Quais arquivos implementam o tablet interativo da Aplicação?**
   `EXTRAÍDO`: a apresentação atual usa
   `src/app/aplicacao-wflyer/page.tsx`,
   `ArchetypeBlocks.tsx` e `site-content.ts`.
   `INFERIDO`: eles formam o preview estático atual. `AMBÍGUO`:
   `ApplicationDemoTablet`, `DemoState`, tilt e simulação determinística aparecem
   apenas em `docs/03-motion/08-tablet-interativo.md`; a Fase 06 ainda não foi
   implementada.
7. **Quais testes cobrem navegação, animações, reduced motion e
   acessibilidade?** `EXTRAÍDO`: há cobertura de configuração/navegação em
   `tests/unit/chapters.test.ts`, stories de `NavigationMeasure`, testes do
   sistema de pauta, `tests/motion/reduced-motion.motion.spec.ts` e specs axe de
   Home/rotas estáticas. `INFERIDO`: a baseline cobre o comportamento estático
   existente. `AMBÍGUO`: os cenários específicos das transições da Fase 05
   continuam somente nas tasks/specs.
8. **Quais componentes da Fase 05 possuem maior impacto arquitetural?**
   `EXTRAÍDO`: os maiores pontos de integração atuais são `chapters.ts`,
   `ChapterScore`, `OriginScore`, `NavigationMeasure`, `ThemeProvider` e GSAP.
   `INFERIDO`: shell/provider persistente, classificador, máquina cancelável,
   overlay vetorial e coordenação de foco/histórico terão maior impacto.
   `AMBÍGUO`: esses novos componentes ainda são planejamento OpenSpec, não nós
   de código implementado.

As saídas brutas estão em `graphify-out/queries/`, permanecem locais e foram
executadas com expansão limitada ao vocabulário do próprio grafo. Todas
atingiram o budget configurado; “sem evidência” não deve ser lido como prova
absoluta de inexistência sem confirmar no código.
<!-- GRAPHIFY_QUERIES_END -->

## 7. Integridade e versionamento

São versionados:

- `graphify-out/GRAPH_REPORT.md`, como relatório textual auditável;
- `graphify-out/CHECKSUMS.sha256`, para verificar os outputs locais;
- este mapa, a política de exclusão e o script operacional.

Permanecem locais e ignorados:

- `graphify-out/graph.json`;
- `graphify-out/graph.html`;
- caches, manifests, sidecars, vocabulário, memória e resultados brutos de
  consultas.

O cache legado rastreado foi retirado do índice Git porque continha caminhos
absolutos da máquina. A baseline atual usa manifesto portável, relativo à raiz,
e pode ser reconstruída pelo workflow documentado.

O HTML exportado pelo Graphify 0.9.31 ainda aponta para `vis-network` por CDN. O
script baixa somente a versão pinada `9.1.6`, confere o SRI declarado e incorpora
o JavaScript no próprio HTML. O output validado não depende de script ou
stylesheet remoto.

## 8. Limitações

- A extração semântica por subagentes não expõe contagem de tokens ao
  orquestrador atual; o custo registrado fica em zero/desconhecido, sem estimar
  valores.
- A instalação ativa é a versão `0.9.31` via `uv`; existe uma instalação
  alternativa `pipx` inativa e não removida.
- A skill global do usuário ainda é `0.9.23`. A skill de projeto é `0.9.31` e
  tem precedência neste repositório; por isso a CLI pode emitir um aviso benigno
  sobre a cópia global.
- O mapa representa o snapshot local na data acima. Mudanças estruturais exigem
  `scripts/graphify-repository.sh update`, nova validação e novos checksums.
- Funcionalidades das Fases 05–08 ainda ausentes só podem aparecer como planos
  documentados; o grafo não prova que elas já existam no produto.
