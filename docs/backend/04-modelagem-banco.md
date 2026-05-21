# Modelagem inicial do banco

## Banco

PostgreSQL com SQLAlchemy 2.0 e Alembic.

## Tabelas principais

```text
processing_jobs
uploaded_files
generated_artifacts
instruments
job_events
admin_processing_metrics
```

## Tabelas futuras

```text
users
user_settings
push_subscriptions
shared_scores
shared_score_downloads
admin_audit_logs
```

## processing_jobs

Campos:

```text
id UUID PK
user_id UUID nullable
anonymous_session_id text nullable
status text
progress int
current_step text
original_filename text
source_instrument_id text FK
target_instrument_id text FK
transpose_interval int
detected_key text nullable
target_key text nullable
public_error_message text nullable
internal_error_message text nullable
created_at timestamptz
updated_at timestamptz
expires_at timestamptz
completed_at timestamptz nullable
```

Campos internos/admin podem ficar em tabela separada ou colunas controladas:

```text
confidence_score_omr numeric nullable
confidence_score_instrument_detection numeric nullable
confidence_score_key_detection numeric nullable
unrecognized_symbols_count int nullable
parsed_measures_count int nullable
warnings_count int nullable
processing_duration_ms int nullable
engine_version text nullable
worker_id text nullable
```

## uploaded_files

```text
id UUID PK
job_id UUID nullable
user_id UUID nullable
anonymous_session_id text nullable
original_filename text
sanitized_filename text
storage_key text
mime_type text
size_bytes bigint
page_count int nullable
sha256 text nullable
status text
created_at timestamptz
expires_at timestamptz
```

## generated_artifacts

```text
id UUID PK
job_id UUID FK
kind text
storage_key text
filename text
mime_type text
size_bytes bigint nullable
sha256 text nullable
created_at timestamptz
expires_at timestamptz
```

## instruments

```text
id text PK
name text
family text
written_to_concert int
aliases jsonb
description text
supported bool
created_at timestamptz
updated_at timestamptz
```

## job_events

```text
id UUID PK
job_id UUID FK
status text
event_type text
message text
public bool
metadata jsonb
created_at timestamptz
```

## Índices recomendados

```text
processing_jobs(user_id, created_at)
processing_jobs(anonymous_session_id, created_at)
processing_jobs(status)
processing_jobs(expires_at)
generated_artifacts(job_id)
generated_artifacts(expires_at)
uploaded_files(expires_at)
job_events(job_id, created_at)
```

## Regras

- Não guardar binários no banco.
- Storage key não deve ser pública.
- Dados internos/admin não retornam em DTO público.
- Arquivos expiram após 15 dias.
