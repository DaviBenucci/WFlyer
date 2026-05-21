# Arquitetura API + Worker

## Componentes

```text
api
worker-omr
worker-transposition
worker-render
scheduler-cleanup
redis
postgres
storage
```

## API

Responsável por:

- autenticação futura;
- rate limiting;
- validação inicial;
- criação de jobs;
- consulta de status;
- geração de URLs assinadas;
- endpoints de instrumentos;
- endpoints admin futuros.

## Workers

Responsáveis por:

- validação profunda de PDF;
- OMR;
- MusicXML;
- transposição;
- renderização;
- storage de artefatos;
- eventos e métricas.

## Fluxo de criação de job

```text
POST /api/transpositions
  validar request
  validar upload existente
  criar processing_jobs(status=queued)
  publicar tarefa no Redis/Celery
  retornar job_id + status inicial
```

## Fluxo de worker

```text
task process_transposition(job_id)
  carregar job
  marcar validating
  validar PDF
  marcar extracting
  executar OMR
  marcar reading_score
  ler MusicXML
  marcar transposing
  aplicar transposição
  marcar rendering
  renderizar PDF
  marcar storing_artifacts
  salvar artefatos
  marcar completed
```

## Comunicação de status

MVP:

```text
polling em GET /api/jobs/{job_id}/status
```

Futuro:

```text
SSE ou WebSocket para atualizações em tempo real
```

## Falhas

- Retries limitados.
- Timeout por etapa.
- Estado `failed` com mensagem pública segura.
- Erro interno guardado para admin.
- Evento registrado em `job_events`.

## Critérios de aceite

- API não processa transposição dentro da request.
- Worker pode falhar sem derrubar API.
- Status terminal sempre é definido.
- Frontend consegue acompanhar progresso.
