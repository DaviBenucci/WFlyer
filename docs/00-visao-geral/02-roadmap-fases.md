# Roadmap por fases

## Fase 0 — Documentação e contratos

Objetivo: fechar documentação antes do código.

Entregáveis:

- documentação modular;
- contratos de API conceituais;
- modelagem inicial;
- estratégia de segurança;
- estratégia de testes;
- guia de implementação para Codex;
- arquivos de log e decisões.

## Fase 1 — Fundação técnica

Objetivo: criar a base do repositório e os padrões.

Escopo:

- monorepo ou estrutura organizada por `apps/web` e `apps/api`;
- frontend Next.js + TypeScript;
- backend FastAPI + Python 3.12+;
- Docker Compose com Postgres, Redis e storage local/MinIO;
- lint, format, typecheck e testes mínimos;
- health checks.

## Fase 2 — Design system e navegação

Objetivo: implementar a experiência visual base.

Escopo:

- tokens de cor;
- tipografia;
- AppShell;
- DesktopSidebar;
- MobileBottomNav;
- PageContainer;
- PageTransitionCurtain;
- acessibilidade base.

## Fase 3 — Páginas estáticas do MVP

Objetivo: implementar telas sem backend pesado.

Escopo:

- Home;
- Como funciona;
- Instrumentos com dados mockados ou seed local;
- Configurações locais;
- Histórico local vazio.

## Fase 4 — Wizard de transposição

Objetivo: implementar fluxo de upload e seleção.

Escopo:

- FileDropzone;
- validações frontend;
- instrumento origem;
- instrumento destino;
- revisão;
- tela de processamento com polling mockado inicialmente.

## Fase 5 — Backend de jobs

Objetivo: criar jobs reais e status.

Escopo:

- endpoints de instrumentos;
- upload seguro;
- criação de job;
- fila Redis;
- worker inicial;
- status e eventos;
- storage;
- expiração.

## Fase 6 — Pipeline musical mínimo

Objetivo: processar uma partitura simples de ponta a ponta.

Escopo:

- validação de PDF;
- OMR ou caminho intermediário controlado;
- MusicXML;
- music21 para transposição;
- renderização com MuseScore CLI;
- artefatos finais.

## Fase 7 — Qualidade, segurança e observabilidade

Objetivo: reduzir risco operacional.

Escopo:

- testes unitários e integração;
- testes musicais de transposição;
- testes de upload malicioso;
- logs estruturados;
- correlation ID;
- métricas de workers;
- Sentry/OpenTelemetry opcional.

## Fase 8 — Contas e recursos futuros

Objetivo: evoluir o produto.

Escopo futuro:

- login/cadastro;
- dashboard;
- histórico persistente;
- biblioteca;
- compartilhados;
- configurações remotas;
- push notifications;
- admin.
