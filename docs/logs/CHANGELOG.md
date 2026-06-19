# Changelog

## 2026-05-14 — Documentação modular inicial

### Adicionado

- Estrutura modular em Markdown.
- Documentação de páginas MVP e futuras.
- Documentação de frontend responsivo.
- Documentação de backend assíncrono.
- Segurança de upload/storage/workers.
- Estratégia de testes.
- Guia de implementação e arquivo `implementacao_IA`.
- Logs de implementação, testes e decisões.

### Observação

Nenhum código final de aplicação foi criado nesta etapa.
## 2026-06-19 — Guia Codex detalhado e backend-first

### Alterado

- `docs/implementacao/00-guia_de_implementacao.md` foi expandido para fases e etapas detalhadas do início ao fim.
- A implementação agora exige banco de dados e backend antes do frontend final.
- Foi adicionada regra rígida: o Codex só pode avançar quando a etapa anterior estiver `CONCLUIDA`.
- Foi adicionada regra para imprevistos: criar sub-etapa dentro da etapa atual antes de avançar.
- `docs/implementacao/01-implementacao_IA.md` foi reforçado com ordem obrigatória, gates, logs e proibições.
- `docs/implementacao/02-backlog_executavel.md` foi reorganizado por fases e etapas.
- `docs/implementacao/03-checklist_codex.md` e `05-definition_of_done.md` foram ampliados.
- `docs/backend/01-visao-geral.md` foi detalhado e recebeu referência ao guia backend.
- `docs/backend/03-endpoints-api.md` foi expandido com contratos, erros, tokens, status e segurança.
- `docs/frontend/01-layout-responsivo.md` foi detalhado com regra de frontend final após backend.
- `docs/frontend/08-contratos-api-frontend.md` foi expandido com UploadDTO, respostas de job, artefatos, polling, erros e regra de token.
- `docs/00-visao-geral/02-roadmap-fases.md` foi reordenado para backend-first.

### Adicionado

- `docs/backend/15-guia_detalhado_backend.md`
- `docs/frontend/09-guia_detalhado_frontend.md`

### Observação

Nenhum código de aplicação foi implementado nesta alteração. A mudança é documental e operacional para orientar futuras execuções do Codex.
