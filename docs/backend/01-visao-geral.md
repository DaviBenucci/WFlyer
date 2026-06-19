# Backend — Visão geral

## Objetivo

Planejar e implementar o backend do WFlyer do zero, com arquitetura assíncrona, segura e escalável para processamento musical pesado.

O backend é a camada de confiança do produto. Ele valida arquivos, guarda metadados, cria jobs, controla fila, executa workers, gera artefatos e protege downloads.

## Documento detalhado

Este arquivo resume a visão geral. A implementação completa deve seguir:

```text
docs/backend/15-guia_detalhado_backend.md
docs/implementacao/00-guia_de_implementacao.md
```

## Stack base

```text
FastAPI
Python 3.12+
Pydantic v2
SQLAlchemy 2.0
Alembic
PostgreSQL
Redis
Celery preferencialmente
MinIO/local storage no desenvolvimento
S3/R2/B2/Supabase Storage em produção
Docker/Docker Compose
music21
MuseScore CLI
Audiveris ou OMR documentado
```

## Responsabilidades do backend

- validar PDF no servidor;
- sanitizar nome de arquivo;
- armazenar original em storage;
- persistir metadados no banco;
- criar job de transposição;
- calcular intervalo entre instrumentos;
- publicar job na fila;
- executar worker assíncrono;
- processar OMR/MusicXML/transposição/renderização;
- gerar PDF e MusicXML finais;
- salvar artefatos;
- atualizar status e progresso;
- registrar eventos de job;
- proteger downloads por token/URL temporária;
- limpar arquivos expirados após 15 dias;
- registrar logs estruturados;
- impedir vazamento de dados internos.

## O que o backend não deve fazer

- processar PDF pesado dentro da request HTTP;
- confiar apenas na validação do frontend;
- salvar arquivos binários no banco;
- expor storage path;
- expor stacktrace;
- logar token;
- retornar confidence score para usuário comum;
- implementar login/admin completo no MVP;
- usar `shell=True` em subprocessos;
- inventar contrato público sem documentação.

## Fluxo macro

```text
Frontend
  ↓
API recebe upload
  ↓
API valida PDF
  ↓
Storage recebe arquivo original
  ↓
Banco recebe metadados
  ↓
API cria job
  ↓
Fila recebe job_id
  ↓
Worker processa PDF/OMR/MusicXML/transposição
  ↓
Worker salva artefatos
  ↓
Banco recebe status/eventos/artefatos
  ↓
API disponibiliza status e download temporário
```

## Ordem de construção

O backend deve ser construído antes do frontend final:

1. banco e migrations;
2. seed de instrumentos;
3. FastAPI base;
4. instrumentos;
5. upload seguro;
6. storage;
7. jobs;
8. fila;
9. worker;
10. pipeline musical;
11. artefatos/download;
12. cleanup;
13. segurança e observabilidade;
14. testes.

Um frontend simples de verificação pode ser criado depois que banco e backend já estiverem funcionais, apenas para validar integração.

## Módulos principais

```text
config
db
models
repositories
schemas
routes
services
storage
security
workers
music
tests
```

## Tabelas principais

```text
instruments
uploaded_files
processing_jobs
job_events
generated_artifacts
admin_processing_metrics
```

Tabelas futuras:

```text
users
user_settings
push_subscriptions
shared_scores
shared_score_downloads
admin_audit_logs
```

## Endpoints públicos do MVP

```text
GET /health
GET /api/instruments
GET /api/instruments/{id}
POST /api/uploads
POST /api/transpositions
GET /api/jobs/{job_id}
GET /api/jobs/{job_id}/status
GET /api/jobs/{job_id}/artifacts
GET /api/artifacts/{artifact_id}/download
DELETE /api/jobs/{job_id}
```

## Princípios de segurança

- PDF é potencialmente perigoso.
- Upload possui limite de tamanho e validação real de tipo.
- Arquivo original nunca define path interno.
- Storage key deve ser UUID ou padrão não previsível.
- Download deve ser temporário.
- Token deve ser protegido.
- Logs não devem conter secrets.
- DTO público deve ser separado de DTO admin.
- Worker deve ter timeout e isolamento.

## Critérios de aceite

- API responde rápido.
- Banco é criado por migration.
- Seed de instrumentos é idempotente.
- Upload seguro funciona.
- Job é assíncrono.
- Worker atualiza status.
- Artefatos são salvos fora do banco.
- Download não expõe path interno.
- Retenção de 15 dias existe.
- Testes backend e segurança passam.
- Documentação está atualizada.
