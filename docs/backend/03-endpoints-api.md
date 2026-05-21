# Endpoints da API

## Convenções

- Prefixo público: `/api`.
- Health fora do prefixo: `/health`.
- Respostas JSON.
- Erros com `code`, `message`, `correlation_id`.
- Datas ISO 8601 UTC.

## Health

```text
GET /health
```

Resposta:

```json
{
  "status": "ok",
  "service": "wflyer-api"
}
```

## Instrumentos

```text
GET /api/instruments
GET /api/instruments/{id}
```

Uso: preencher busca, filtros e cálculo de transposição.

## Uploads

```text
POST /api/uploads
```

Entrada: multipart/form-data com PDF.

Resposta pública:

```json
{
  "upload_id": "uuid",
  "original_filename": "partitura.pdf",
  "size_bytes": 123456,
  "status": "uploaded"
}
```

## Transpositions

```text
POST /api/transpositions
```

Entrada:

```json
{
  "upload_id": "uuid",
  "source_instrument_id": "piano",
  "target_instrument_id": "trumpet-bb",
  "client_session_id": "anonymous-session-id"
}
```

Resposta:

```json
{
  "job_id": "uuid",
  "status": "queued",
  "download_token": "temporary-token",
  "expires_at": "2026-05-29T00:00:00Z"
}
```

## Jobs

```text
GET /api/jobs/{job_id}
GET /api/jobs/{job_id}/status
GET /api/jobs/{job_id}/artifacts
DELETE /api/jobs/{job_id}
```

No MVP, exigir `download_token` ou `client_session_id` para consulta de dados sensíveis.

## Downloads

```text
GET /api/artifacts/{artifact_id}/download
```

Deve retornar redirecionamento para URL assinada ou payload com URL temporária, conforme decisão técnica.

## Admin futuro

```text
GET /api/admin/jobs
GET /api/admin/jobs/{id}
GET /api/admin/metrics
GET /api/admin/instruments
PATCH /api/admin/instruments/{id}
GET /api/admin/shared-scores
PATCH /api/admin/shared-scores/{id}/moderation
```

## Erro padrão

```json
{
  "code": "PDF_INVALID",
  "message": "Envie um arquivo PDF válido para continuar.",
  "correlation_id": "req_abc123"
}
```

## Regras de segurança

- Não retornar stacktrace.
- Não retornar storage path.
- Não retornar confidence score em endpoints públicos.
- Validar ownership/token em jobs e artefatos.
