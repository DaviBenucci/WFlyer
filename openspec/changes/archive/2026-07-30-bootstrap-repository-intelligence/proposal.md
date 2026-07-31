## Why

O repositório possui documentação arquitetural extensa, mas o Graphify estava
incompleto e o OpenSpec ainda não tinha uma raiz válida. A correção cria uma
baseline reproduzível antes de iniciar o trabalho funcional da Fase 05, sem
alterar o comportamento do site.

## What Changes

- Configurar a skill de projeto e o corpus filtrado do Graphify.
- Gerar e validar o grafo normal, suas comunidades e consultas arquiteturais.
- Atualizar e inicializar o OpenSpec 1.7 para Codex com contexto e regras do projeto.
- Integrar validação OpenSpec ao CI e fornecer automação manual do Graphify.
- Documentar inventário, decisões de versionamento, comandos e limitações.
- Criar separadamente o change funcional da Fase 05 e mantê-lo ativo.

Não objetivos:

- implementar motion, navegação animada, tablet, contato ou qualquer feature;
- alterar dependências de produção, bundle, deploy, DNS, Cloudflare ou Napoleon;
- substituir ADRs, manifests ou golden references por artefatos gerados.

## Capabilities

### New Capabilities

Nenhuma capacidade de produto. O metadado `skip_specs: true` registra que este
change cobre somente tooling, documentação e validação de CI.

### Modified Capabilities

Nenhuma.

## Impact

Arquivos afetados: `.codex/`, `.graphifyignore`, `graphify-out/`, `openspec/`,
`scripts/`, `AGENTS.md`, `.gitignore`, CI e documentação de implementação.
Graphify e OpenSpec permanecem fora do `package.json` e do bundle de produção.

Documentos normativos preservados: registro de decisões, bloqueio tecnológico,
manifests, specs de páginas/motion e referências visuais aprovadas.

Rollback: remover a integração de tooling e a etapa de validação OpenSpec; o
código do site permanece no mesmo estado funcional porque este change não o
modifica.
