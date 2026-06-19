# Roadmap por fases

## Objetivo

Definir a ordem macro do WFlyer para que a implementação seja previsível, segura e validável.

A implementação detalhada está em:

```text
docs/implementacao/00-guia_de_implementacao.md
```

## Regra de progressão

Nenhuma fase pode começar enquanto a fase anterior não estiver `CONCLUIDA`.

Se uma etapa falhar, criar sub-etapa de correção dentro da fase atual. Não pular para a próxima fase.

## Fase 0 — Documentação, escopo e governança

Objetivo: garantir que o Codex entenda o produto, o MVP e as regras de implementação.

Entregáveis:

- leitura documental registrada;
- escopo MVP separado de futuro;
- regra de progressão registrada;
- riscos iniciais mapeados;
- logs preparados.

## Fase 1 — Fundação técnica do repositório

Objetivo: criar base limpa para código novo.

Escopo:

- estrutura `apps/api` e `apps/web` quando aplicável;
- `.gitignore`;
- `.env.example` sem secrets reais;
- lint, format, typecheck e testes base;
- README técnico;
- scripts seguros.

## Fase 2 — Infra local

Objetivo: preparar dependências para banco/backend.

Escopo:

- Docker Compose;
- Postgres;
- Redis;
- MinIO/storage local;
- healthchecks;
- variáveis de ambiente;
- política de volumes locais.

## Fase 3 — Banco de dados primeiro

Objetivo: criar a persistência antes dos endpoints.

Escopo:

- SQLAlchemy 2.0;
- Alembic;
- tabela de instrumentos;
- seed de instrumentos;
- uploads;
- jobs;
- eventos;
- artefatos;
- métricas admin;
- índices;
- expiração de 15 dias;
- testes de migrations.

## Fase 4 — Backend base

Objetivo: criar FastAPI robusto, sem regra pesada ainda.

Escopo:

- app FastAPI;
- settings;
- health;
- errors;
- CORS;
- correlation ID;
- logs estruturados;
- sessão de banco;
- DTOs públicos/internos;
- testes base.

## Fase 5 — Instrumentos e regra musical inicial

Objetivo: disponibilizar dados musicais estáveis.

Escopo:

- API de instrumentos;
- busca por instrumento;
- cálculo de intervalo;
- validação de suporte;
- testes musicais unitários.

## Fase 6 — Upload seguro e storage

Objetivo: aceitar PDF com segurança.

Escopo:

- storage service;
- validação de tamanho;
- validação real de PDF;
- sanitização;
- hash;
- upload endpoint;
- rollback/cleanup em falha;
- documentação de segurança.

## Fase 7 — Jobs e fila

Objetivo: criar execução assíncrona.

Escopo:

- criação de job;
- token temporário;
- status público;
- eventos;
- publicação em fila;
- validação de acesso anônimo;
- erros públicos seguros.

## Fase 8 — Worker

Objetivo: processar jobs fora da request HTTP.

Escopo:

- app do worker;
- task principal;
- retries;
- timeouts;
- workspace por job;
- atualização de progresso;
- eventos técnicos;
- worker simulado controlado quando necessário.

## Fase 9 — Pipeline musical

Objetivo: implementar o núcleo de transposição.

Escopo:

- fixtures musicais;
- MusicXML;
- music21;
- armadura;
- acidentes;
- MuseScore CLI;
- OMR ou caminho documentado;
- métricas admin;
- testes musicais.

## Fase 10 — Artefatos, download e retenção

Objetivo: fechar resultado backend.

Escopo:

- registro de artefatos;
- endpoint de artefatos;
- download temporário;
- expiração lógica;
- cleanup de 15 dias;
- fluxo backend completo testado.

## Fase 11 — Frontend simples de verificação

Objetivo: provar backend/banco com UI técnica mínima.

Escopo:

- `/debug/health`;
- `/debug/instruments`;
- `/debug/upload`;
- `/debug/transposition`;
- `/debug/jobs`;
- `/debug/artifacts`.

Esta fase não implementa o frontend final.

## Fase 12 — Hardening backend, segurança e observabilidade

Objetivo: concluir backend MVP antes do frontend final.

Escopo:

- rate limiting;
- CORS;
- headers;
- logs sensíveis;
- permissões de worker;
- testes de upload/download;
- testes de DTO público;
- suíte backend completa.

## Fase 13 — Congelamento de contratos

Objetivo: estabilizar API para frontend final.

Escopo:

- DTOs públicos revisados;
- OpenAPI/schemas;
- política de polling;
- mensagens públicas;
- estados de UI por status;
- validação via frontend debug.

## Fase 14 — Frontend final: fundação visual

Objetivo: construir UI definitiva sobre backend real.

Escopo:

- Next.js/TypeScript;
- Tailwind;
- shadcn/ui;
- tokens;
- componentes base;
- AppShell;
- DesktopSidebar;
- MobileBottomNav;
- PageContainer;
- TanStack Query;
- Zod.

## Fase 15 — Frontend final: páginas

Objetivo: implementar telas do MVP.

Escopo:

- Home;
- Como funciona;
- Instrumentos;
- Configurações locais;
- Histórico local;
- Resultado;
- placeholders seguros para futuro;
- responsividade.

## Fase 16 — Wizard integrado

Objetivo: implementar fluxo principal do usuário com backend real.

Escopo:

- Upload;
- Origem;
- Destino;
- Revisão;
- criação de job;
- polling;
- processamento;
- resultado;
- download;
- tratamento de erro.

## Fase 17 — PWA, histórico local e refinamento

Objetivo: polir experiência sem ampliar escopo indevido.

Escopo:

- IndexedDB;
- estado offline;
- limpeza local;
- acessibilidade;
- responsividade;
- animações discretas;
- copy final.

## Fase 18 — QA final e entrega

Objetivo: finalizar MVP com segurança e documentação.

Escopo:

- testes backend;
- testes frontend;
- E2E;
- regressão musical;
- checklist de segurança;
- revisão documental;
- changelog;
- manifesto de validação;
- empacotamento.

## Fase futura — Contas, compartilhamento e admin

Itens fora do MVP inicial:

- login/cadastro;
- dashboard autenticado;
- histórico remoto;
- biblioteca;
- compartilhamento público real;
- push notifications;
- admin completo;
- pagamentos;
- moderação.

Esses itens só podem ser implementados após decisão explícita.
