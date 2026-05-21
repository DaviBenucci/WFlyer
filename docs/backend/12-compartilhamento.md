# Compartilhamento — Backend futuro

## Objetivo

Permitir compartilhamento explícito de partituras entre usuários autenticados.

## Tabelas possíveis

```text
shared_scores
shared_score_downloads
shared_score_reports
moderation_events
```

## shared_scores

```text
id UUID PK
owner_user_id UUID
job_id UUID
artifact_id UUID
title text
source_instrument_id text
target_instrument_id text
key text nullable
visibility text
moderation_status text
created_at timestamptz
updated_at timestamptz
removed_at timestamptz nullable
```

## Endpoints

```text
POST /api/shared-scores
GET /api/shared-scores
GET /api/shared-scores/{id}
POST /api/shared-scores/{id}/download
DELETE /api/shared-scores/{id}
```

## Regras

- Usuário só compartilha artefatos próprios.
- Compartilhamento é opt-in.
- Arquivos privados não aparecem.
- Download usa URL temporária.
- Downloads podem consumir limite de plano.
- Admin pode moderar.

## Segurança

- Validar ownership.
- Sanitizar título.
- Não expor storage key.
- Registrar downloads.
- Permitir remoção.
- Bloquear compartilhamento moderado/removido.
