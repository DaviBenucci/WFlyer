## Context

O repositório tinha `graphifyy` e `@fission-ai/openspec` instalados globalmente,
mas não uma baseline de projeto utilizável. O Graphify continha apenas um cache
antigo com caminhos absolutos; o OpenSpec possuía templates artesanais e skills,
porém `openspec doctor` reportava `no_openspec_root`.

O corpus local tem aproximadamente 1,84 GB e é dominado por dependências, builds
e relatórios. A fonte de verdade continua sendo a documentação listada em
`AGENTS.md`; os artefatos das ferramentas são índices auxiliares.

## Goals / Non-Goals

**Goals:**

- instalar as integrações oficiais no escopo do projeto;
- produzir um grafo normal, filtrado, consultável e auditável;
- tornar geração, atualização e validação reproduzíveis em Linux;
- validar changes OpenSpec estritamente no CI;
- preservar templates, código, dependências e referências aprovadas.

**Non-Goals:**

- modificar runtime, UI, motion, navegação ou dados do site;
- executar Graphify completo em cada pull request;
- promover tooling ou documentação às specs funcionais principais;
- publicar ou alterar infraestrutura externa.

## Decisions

1. **CLIs externas ao projeto.** Usar as instalações oficiais existentes
   (`graphifyy` via `uv` e OpenSpec via gerenciador global), sem alterar
   `package.json`. Alternativa rejeitada: dependências Node/Python locais, porque
   contaminariam o bundle e o lockfile do site.
2. **Corpus raiz filtrado.** Executar a skill sobre `.` com
   `.graphifyignore`, pois a CLI não expõe uma lista múltipla de entradas para o
   pipeline completo. Dependências, caches, relatórios, skills vendorizadas e
   imagens repetidas ficam fora; a prancha mestra e a referência individual da
   Aplicação permanecem como exceções canônicas.
3. **Primeira geração normal.** Usar AST determinística e síntese semântica dos
   documentos, sem `--mode deep`. Fatos, inferências e ambiguidades permanecem
   marcados no grafo. Alternativa rejeitada: `--code-only`, pois perderia ADRs,
   manifests e contratos da Fase 05.
4. **Versionamento leve.** Manter `GRAPH_REPORT.md`, documentação, checksums e
   scripts no Git; manter `graph.json`, `graph.html`, caches e sidecars apenas
   locais. Alternativa rejeitada: versionar todo o grafo, por custo de diff e
   caminhos/estado gerados.
5. **Graphify manual, OpenSpec no CI.** O script Graphify oferece
   `generate`, `update` e `validate`, mas não roda em todo PR. A validação
   OpenSpec é rápida, determinística e entra no job de qualidade com versão fixa.
6. **Bootstrap sem spec funcional.** O OpenSpec 1.7 reconhece
   `skip_specs: true`; por isso o change não cria delta spec nem promove tooling
   às specs de produto. O arquivamento também usa `--skip-specs`.

## Risks / Trade-offs

- **Instalações Graphify duplicadas (uv e pipx)** → registrar a instalação ativa
  e não remover a alternativa sem uma migração explicitamente autorizada.
- **Grafo ficar desatualizado** → documentar `update`, validar manifesto e
  checksums e exigir atualização após mudanças estruturais relevantes.
- **Inferências sem chave Gemini** → usar subagentes, manter níveis de confiança
  e auditar contaminação por arquivos gerados.
- **Hook local com caminho absoluto** → não depender dele em CI; o script e a
  skill de projeto são a interface reproduzível.
- **Mudança futura no formato das CLIs** → checar versões mínimas/suportadas e
  falhar com mensagem clara.

## Migration Plan

1. Auditar instalações e corpus.
2. Instalar a skill Graphify e inicializar o OpenSpec preservando customizações.
3. Gerar, consultar e validar o grafo filtrado.
4. Adicionar scripts, CI, políticas e documentação.
5. Executar validações estritas e gates do projeto.
6. Arquivar apenas este change com `--skip-specs`.

Rollback: reverter os arquivos de tooling/CI e remover apenas saídas geradas do
Graphify. Nenhum rollback de produto ou dados é necessário.

## Open Questions

Nenhuma bloqueadora. A duplicidade uv/pipx permanece registrada para uma decisão
de manutenção separada; não afeta o executável ativo desta baseline.
