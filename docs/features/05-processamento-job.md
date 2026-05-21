# Processamento de job

## Objetivo

Gerenciar a transposição como job assíncrono, evitando travar requisições HTTP.

## Fluxo

```text
POST /api/transpositions
API cria processing_jobs
API publica tarefa na fila
Worker executa pipeline
Worker registra job_events
Worker atualiza progress/status
Frontend acompanha status
```

## Status oficiais

```text
queued
validating
uploading
extracting
reading_score
detecting_instrument
waiting_user_confirmation
transposing
rendering
storing_artifacts
completed
failed
expired
cancelled
```

## Progresso sugerido

```text
queued: 0
validating: 5
extracting: 15
reading_score: 30
detecting_instrument: 45
transposing: 60
rendering: 80
storing_artifacts: 95
completed: 100
```

## Erros

Cada erro deve ter:

```text
public_error_message
internal_error_message
error_code
correlation_id
job_event
```

O público nunca recebe stacktrace.

## Critérios de aceite

- API responde rápido com `job_id`.
- Worker processa fora da API.
- Status atualiza por etapa.
- Falha registra evento e mensagem pública segura.
- Job finaliza em estado terminal.
