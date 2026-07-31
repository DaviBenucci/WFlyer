# Relatório do bootstrap Graphify e OpenSpec

**Data:** 2026-07-30  
**Escopo:** tooling, documentação e CI  
**Produto:** comportamento inalterado  
**Deploy e infraestrutura externa:** não executados

## 1. Resultado executivo

O repositório passou a ter uma baseline local reproduzível para inteligência
arquitetural e changes orientados por especificação:

- Graphify ativo atualizado de `0.9.23` para `0.9.31`;
- skill Graphify `0.9.31` instalada somente no projeto;
- OpenSpec atualizado de `1.6.0` para `1.7.0`;
- raiz OpenSpec válida, configurada e preservando os templates artesanais;
- grafo normal filtrado, consultável e validado;
- mudança funcional da Fase 05 planejada e mantida ativa;
- validação OpenSpec estrita adicionada ao CI;
- nenhuma feature, dependência de runtime, lockfile ou configuração de deploy
  alterada.

## 2. Inventário inicial

O inventário físico encontrou aproximadamente `1,84 GB` e `57.534` itens,
incluindo `.git`. Fora de `.git`, havia `49.473` entradas do tipo arquivo:

| Classe Git | Quantidade inicial |
|---|---:|
| Rastreada | 387 |
| Não rastreada | 0 |
| Ignorada | 49.086 |

Os maiores volumes eram gerados ou externos ao corpus:

| Área | Volume aproximado | Entradas tipo arquivo |
|---|---:|---:|
| `node_modules` | 887 MB | 45.886 |
| `.next` | 817 MB | 3.002 |
| `.lighthouseci` | 66 MB | não material para arquitetura |
| `.git` | 34,84 MB | metadados Git |
| `docs` | 21,87 MB | 191 |

O resíduo Graphify consistia somente em
`graphify-out/cache/stat-index.json`, rastreado e com caminhos absolutos
obsoletos; não havia `graph.json`, HTML nem relatório utilizável. O resíduo
OpenSpec continha `openspec/README.md`, templates artesanais e seis skills, mas
nenhuma raiz reconhecida pela CLI.

## 3. Instalações e decisões

### Graphify

- executável ativo: instalação `uv` em `/home/davi-benucci/.local/bin/graphify`;
- versão ativa: `0.9.31`;
- Python do ambiente da ferramenta: `3.13.14`;
- skill local: `.codex/skills/graphify`;
- hook local portável: `graphify hook-check`;
- modo inicial: normal, não direcionado.

O hash do prompt de extração permaneceu igual durante o upgrade:

```text
32d7decad42d58129c6694ea4e4ce1f72a531bc5161827d2095787e9448735e9
```

Portanto, fragmentos semânticos já extraídos com esse prompt puderam ser
reaproveitados. Uma instalação `pipx` `0.9.28` permanece inativa; removê-la
seria uma alteração global destrutiva fora deste bootstrap.

### OpenSpec

- CLI global: `@fission-ai/openspec 1.7.0`, gerenciada por pnpm;
- schema: `spec-driven`;
- perfil inicializado: Codex `core`;
- contexto/regras: `openspec/config.yaml`;
- skills locais: seis diretórios `.codex/skills/openspec-*`;
- templates em `openspec/templates/`: preservados.

A limpeza de prompts globais antigos `opsx-*` foi adiada pela própria CLI, sem
deleção forçada. Isso não afeta a raiz local nem a validação dos changes.

## 4. Arquivos criados, modificados e preservados

Criados:

- `.graphifyignore`;
- `.codex/hooks.json`;
- `.codex/skills/graphify/`;
- `openspec/config.yaml`;
- changes OpenSpec do bootstrap e da Fase 05;
- `scripts/graphify-repository.sh`;
- documentação `18`, `19` e `20`;
- relatório e checksums leves em `graphify-out/`.

Modificados:

- seis skills OpenSpec para a geração `1.7.0`;
- `.github/workflows/ci.yml`;
- `.gitignore`;
- `AGENTS.md`;
- continuidade e índices documentais.

Preservados:

- código e testes do produto;
- `package.json`, `pnpm-lock.yaml` e dependências de runtime;
- `openspec/README.md` e templates artesanais;
- ADRs, manifests, golden references e demais fontes normativas;
- configurações de produção, DNS, Cloudflare, Napoleon e
  `app.wflyer.com.br`.

## 5. Grafo e consultas

<!-- BOOTSTRAP_GRAPH_START -->
O snapshot filtrado detectou 307 arquivos e 247.658 palavras: 131 arquivos de
código, 156 documentos e 20 imagens. `src/styles/tokens.css` foi omitido pela
heurística de sensibilidade sem bypass manual.

O grafo final desta rodada contém:

| Medida | Resultado |
|---|---:|
| Nós | 2.117 |
| Arestas não direcionadas | 3.142 |
| Arestas brutas | 3.474 |
| Hiperarestas | 59 |
| Comunidades rotuladas | 234 |
| Redução média no benchmark | 23,7× |

As maiores comunidades cobrem UI, componentes de partitura, tema/Storybook,
vetores de marca, segurança/operação e conteúdo/arquétipos. Os god nodes
principais são `scripts`, `LinkButton()`, `createPageMetadata()`,
`compilerOptions`, o relatório acumulado, o mapa Graphify, este relatório,
`.next`, o manifesto de capítulos e `classNames()`.

O diagnóstico não encontrou endpoint ausente, self-loop ou nó de código não
verificado. Encontrou 165 arestas pendentes, 109 duplicatas exatas e 167
relações colapsadas no grafo simples não direcionado; a limitação está
documentada, sem ocultar o aviso.

As oito consultas confirmaram a arquitetura estática existente de rotas,
partitura, Home bifurcada e tema. Também distinguiram corretamente planos de
implementação: shell/transições da Fase 05, tablet da Fase 06 e endpoint
Turnstile/Resend da Fase 08 não aparecem como código concluído. Resultados
detalhados e classificações `EXTRAÍDO`/`INFERIDO`/`AMBÍGUO` estão em
`18-graphify-repository-map.md`.
<!-- BOOTSTRAP_GRAPH_END -->

O relatório textual e os checksums são versionados. JSON, HTML, cache, manifest,
vocabulário, memória e saídas brutas de consulta permanecem locais e ignorados
para evitar diffs volumosos e caminhos dependentes da máquina. Apenas a memória
de consultas é reinjetada pelo feedback loop nativo do Graphify; os demais
outputs continuam proibidos como fonte.

## 6. Changes OpenSpec

### Bootstrap

`bootstrap-repository-intelligence` usa `skip_specs: true`, pois não introduz
comportamento de produto. Foi arquivado, com 17/17 tasks e gates verdes, em:

```bash
openspec archive bootstrap-repository-intelligence \
  --yes \
  --skip-specs
```

Destino:
`openspec/changes/archive/2026-07-30-bootstrap-repository-intelligence`.
Nenhuma spec principal foi sincronizada.

### Fase 05

`complete-phase-05-motion-navigation` contém proposta, design, tasks e os delta
specs:

- `score-transition-navigation`;
- `accessible-navigation-lifecycle`.

As tasks funcionais continuam desmarcadas. A mudança permanece ativa; este
bootstrap não implementa shell de motion, timelines GSAP, foco pós-transição,
histórico animado nem reduced motion.

## 7. Comandos principais

```bash
uv tool upgrade graphifyy
graphify install --project --platform codex
pnpm add --global @fission-ai/openspec@1.7.0
openspec update .
scripts/graphify-repository.sh deps
scripts/graphify-repository.sh validate
openspec doctor --json
openspec validate --all --strict --no-interactive
pnpm lint
pnpm typecheck
pnpm test
pnpm build:storybook
pnpm test:storybook
pnpm build
git diff --check
```

## 8. Validações

<!-- BOOTSTRAP_VALIDATION_START -->
- `scripts/graphify-repository.sh deps`: versões e dependências válidas;
- `scripts/graphify-repository.sh validate`: 2.117 nós, 3.142 arestas e 234
  comunidades; JSON, HTML offline e checksums válidos;
- bootstrap validado estritamente com 17/17 tasks antes do arquivamento;
- `openspec validate --all --strict`: 1 change ativo válido, zero falha;
- validação OpenSpec JSON: 1 ativo válido, zero falha;
- `openspec doctor --json`: raiz saudável;
- pin de CI `@fission-ai/openspec@1.7.0`: 1 ativo válido, zero falha;
- política de dependências: todas as versões exatas;
- ESLint: zero warning/erro;
- TypeScript: zero erro;
- Vitest unitário: 12 arquivos, 65 testes;
- Storybook build: concluído;
- Vitest Storybook: 11 arquivos, 46 testes;
- Next.js build: 22 páginas estáticas geradas;
- `git diff --check`: sem erro;
- auditoria de escopo: nenhum diff em `src/`, `tests/`, `package.json`,
  `pnpm-lock.yaml`, configuração de deploy ou infraestrutura externa.
<!-- BOOTSTRAP_VALIDATION_END -->

## 9. Limitações e pendências não bloqueadoras

- Sem chave Gemini/Google, a síntese documental e visual foi feita por
  subagentes do host. O mecanismo atual não retorna o consumo de tokens; nenhum
  valor foi estimado.
- A skill global Graphify `0.9.23` permanece fora do projeto e pode gerar aviso;
  a cópia local `0.9.31` é a integração normativa deste repositório.
- A instalação alternativa `pipx 0.9.28` não foi removida.
- Os prompts globais OpenSpec antigos não foram apagados à força.
- Graphify não roda em todo PR; OpenSpec roda no CI com versão fixa.
- Outputs pesados e caches continuam locais, reconstruíveis e não versionados.
- O site não foi publicado e nenhuma configuração externa foi tocada.

## 10. Commit sugerido

```text
chore(tooling): bootstrap Graphify 0.9.31 and OpenSpec 1.7
```
