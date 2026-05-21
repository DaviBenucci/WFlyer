# Contratos API <-> Frontend

## Objetivo

Evitar divergência entre frontend e backend por meio de contratos claros.

## Convenções

- Datas em ISO 8601 UTC.
- IDs em UUID.
- Erros públicos com `code` e `message`.
- Nunca expor paths internos.
- Campos internos/admin não aparecem em respostas públicas.

## Instrument

```ts
type InstrumentDTO = {
  id: string
  name: string
  family: string
  written_to_concert: number
  aliases: string[]
  description?: string
  supported: boolean
}
```

## Job público

```ts
type PublicJobDTO = {
  id: string
  status: JobStatus
  progress: number
  current_step: string
  original_filename: string
  source_instrument_id: string
  target_instrument_id: string
  transpose_interval: number
  detected_key?: string
  target_key?: string
  public_error_message?: string
  created_at: string
  updated_at: string
  expires_at: string
  completed_at?: string
}
```

## JobStatus

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

## ErrorDTO

```ts
type ErrorDTO = {
  code: string
  message: string
  correlation_id?: string
  details?: Record<string, string | number | boolean>
}
```

Detalhes devem ser públicos e seguros. Erros internos ficam em logs/admin.

## ArtifactDTO

```ts
type ArtifactDTO = {
  id: string
  job_id: string
  kind: 'final_pdf' | 'final_musicxml' | 'preview_image'
  filename: string
  size_bytes?: number
  expires_at: string
  download_url?: string
}
```

`download_url` deve ser temporária. Pode ser retornada apenas por endpoint específico de download.

## Polling

Frequência inicial:

```text
1s durante os primeiros 10s
2s até 60s
5s após 60s
parar em completed/failed/cancelled/expired
```

## Testes de contrato

- Frontend valida DTOs com Zod.
- Backend testa schemas Pydantic.
- Erro público nunca contém stacktrace.
- Resposta pública nunca contém confidence_score.
