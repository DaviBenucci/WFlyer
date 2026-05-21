# Guia de implementação do WFlyer

## Objetivo

Guiar o Codex na construção do WFlyer de forma incremental, segura e documentada, reduzindo perda de contexto e alucinação.

## Regra principal

Nenhuma implementação deve começar sem leitura dos documentos essenciais:

```text
docs/implementacao/01-implementacao_IA.md
docs/00-visao-geral/01-decisoes-arquiteturais.md
docs/frontend/05-design-system.md
docs/pages/02-transpor.md
docs/backend/01-visao-geral.md
docs/backend/08-seguranca-backend.md
docs/qa/01-estrategia-testes.md
```

## Sequência recomendada de implementação

### Etapa 0 — Preparação do repositório

- Criar estrutura do projeto.
- Configurar lint/format/typecheck.
- Configurar testes base.
- Criar Docker Compose inicial.
- Criar `.env.example` sem secrets reais.
- Garantir que nenhum arquivo sensível seja commitado.

### Etapa 1 — Frontend base

- Next.js + TypeScript.
- Tailwind/shadcn/ui.
- Tokens do design system.
- AppShell.
- DesktopSidebar.
- MobileBottomNav.
- PageContainer.

### Etapa 2 — Páginas MVP estáticas

- Home.
- Como funciona.
- Instrumentos com mock/seed.
- Configurações locais.
- Histórico local vazio.

### Etapa 3 — Wizard Transpor

- Etapas do wizard.
- FileDropzone.
- Seleção de origem.
- Seleção de destino.
- Revisão.
- Processamento mockado.
- Resultado mockado.

### Etapa 4 — Backend base

- FastAPI.
- Health.
- Config.
- Logging com correlation ID.
- Postgres.
- Alembic.
- Redis.
- Storage local/MinIO.

### Etapa 5 — API de instrumentos e upload

- Seed de instrumentos.
- `GET /api/instruments`.
- Upload seguro.
- Validação real de PDF.
- Storage key por UUID.

### Etapa 6 — Jobs e fila

- `POST /api/transpositions`.
- `GET /api/jobs/{id}/status`.
- Worker inicial.
- Eventos de job.
- Polling no frontend.

### Etapa 7 — Pipeline musical

- OMR/MusicXML.
- Transposição com music21.
- Renderização com MuseScore CLI.
- Artefatos finais.
- Validações musicais.

### Etapa 8 — Segurança, QA e observabilidade

- Rate limiting.
- CORS restritivo.
- Headers.
- Testes de segurança.
- Logs estruturados.
- Cleanup de 15 dias.

## Regra de tarefa pequena

Cada tarefa do Codex deve ter escopo pequeno e verificável. Evitar mudanças grandes que alterem frontend, backend, banco e worker ao mesmo tempo sem necessidade.

## Regra de side-effect

Depois de alterar qualquer módulo, o Codex deve:

1. identificar áreas impactadas;
2. executar testes dessas áreas;
3. executar lint/typecheck/build conforme disponível;
4. verificar que contratos públicos não mudaram sem documentação;
5. registrar resultados em `docs/logs/TEST_LOG.md`.

## Regra de documentação

Toda alteração relevante deve atualizar:

- documento da página/feature afetada;
- contrato API, se endpoint/DTO mudar;
- modelagem, se banco mudar;
- segurança, se fluxo sensível mudar;
- `IMPLEMENTATION_LOG.md`;
- `CHANGELOG.md`;
- `DECISIONS.md`, se houver decisão nova.

## Ordem de verdade

Quando houver conflito:

1. `docs/implementacao/01-implementacao_IA.md`
2. `docs/00-visao-geral/01-decisoes-arquiteturais.md`
3. documentação específica da área;
4. código existente;
5. comentários antigos no código.

O código existente não deve vencer a documentação quando a documentação for mais recente e explícita.
