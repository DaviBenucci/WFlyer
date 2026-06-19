# Contratos API <-> Frontend

## Objetivo

Evitar divergência entre frontend e backend por meio de contratos claros, validados e seguros.

Este documento deve ser atualizado sempre que endpoint, DTO, status, erro ou fluxo de polling mudar.

## Convenções

- Datas em ISO 8601 UTC.
- IDs em UUID, exceto `InstrumentDTO.id`, que pode ser slug estável.
- Erros públicos com `code`, `message` e `correlation_id`.
- Nunca expor paths internos.
- Nunca expor `storage_key`.
- Nunca expor stacktrace.
- Nunca expor confidence score para usuário comum.
- Campos internos/admin não aparecem em respostas públicas.
- O frontend deve validar DTOs com Zod ou estratégia equivalente.

## InstrumentDTO

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

## InstrumentListDTO

```ts
type InstrumentListDTO = {
  items: InstrumentDTO[]
}
```

## UploadDTO

```ts
type UploadDTO = {
  upload_id: string
  original_filename: string
  safe_display_filename: string
  size_bytes: number
  detected_mime: 'application/pdf'
  status: 'uploaded'
  expires_at: string
}
```

O frontend não deve receber:

```text
storage_key
temporary_path
sha256
internal_scan_result
```

## CreateTranspositionRequest

```ts
type CreateTranspositionRequest = {
  upload_id: string
  source_instrument_id: string
  target_instrument_id: string
  client_session_id: string
}
```

## CreateTranspositionResponse

```ts
type CreateTranspositionResponse = {
  job_id: string
  status: JobStatus
  progress: number
  current_step: string
  source_instrument_id: string
  target_instrument_id: string
  transpose_interval: number
  access_token?: string
  expires_at: string
}
```

`access_token` é sensível. O frontend não deve logar, imprimir, persistir por longo prazo ou compartilhar esse token.

## PublicJobDTO

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
  public_error_message?: string | null
  created_at: string
  updated_at: string
  expires_at: string
  completed_at?: string | null
}
```

## PublicJobStatusDTO

```ts
type PublicJobStatusDTO = {
  id: string
  status: JobStatus
  progress: number
  current_step: string
  public_error_message?: string | null
  updated_at: string
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

## PublicJobEventDTO

```ts
type PublicJobEventDTO = {
  type: string
  message: string
  created_at: string
}
```

## PublicJobEventListDTO

```ts
type PublicJobEventListDTO = {
  items: PublicJobEventDTO[]
}
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

Códigos esperados:

```text
PDF_INVALID
PDF_TOO_LARGE
PDF_EMPTY
PDF_ENCRYPTED_UNSUPPORTED
UPLOAD_STORAGE_FAILED
UPLOAD_NOT_FOUND
UPLOAD_EXPIRED
INSTRUMENT_NOT_FOUND
INSTRUMENT_UNSUPPORTED
TRANSPOSITION_INVALID
QUEUE_UNAVAILABLE
JOB_NOT_FOUND
JOB_EXPIRED
ACCESS_TOKEN_INVALID
ACCESS_TOKEN_EXPIRED
ARTIFACT_NOT_FOUND
ARTIFACT_EXPIRED
DOWNLOAD_UNAVAILABLE
RATE_LIMITED
INTERNAL_ERROR
```

## ArtifactDTO

```ts
type ArtifactDTO = {
  id: string
  job_id: string
  kind: 'final_pdf' | 'final_musicxml' | 'preview_image'
  filename: string
  size_bytes?: number
  expires_at: string
}
```

`download_url` não deve vir na listagem padrão. Deve ser retornada apenas pelo endpoint específico de download, quando a estratégia escolhida for URL assinada.

## ArtifactListDTO

```ts
type ArtifactListDTO = {
  items: ArtifactDTO[]
}
```

## DownloadURLDTO

```ts
type DownloadURLDTO = {
  download_url: string
  expires_in_seconds: number
}
```

## Polling

Frequência inicial:

```text
1s durante os primeiros 10s
2s até 60s
5s após 60s
parar em completed/failed/cancelled/expired
```

Regras:

- parar polling ao desmontar componente;
- parar polling em status final;
- não criar job duplicado por retry visual;
- exibir erro público seguro;
- não exibir detalhes internos do worker.

## Estados de UI por status

```text
queued                  -> aguardando início
validating              -> validando partitura
uploading               -> preparando arquivo
extracting              -> lendo arquivo
reading_score           -> interpretando partitura
detecting_instrument    -> verificando dados musicais
waiting_user_confirmation -> reservado/futuro
transposing             -> transpondo partitura
rendering               -> gerando PDF final
storing_artifacts       -> salvando resultado
completed               -> pronto para download
failed                  -> falha com mensagem pública
expired                 -> resultado expirado
cancelled               -> processamento cancelado
```

## Regras de token no frontend

- Preferir header `X-WFlyer-Access-Token`.
- Não usar `console.log` com payload completo se contiver token.
- Não persistir token além do necessário.
- Se o histórico local precisar retomar job, registrar decisão e limitar retenção.
- Não montar URL de storage manualmente.

## Testes de contrato

- Frontend valida DTOs com Zod.
- Backend testa schemas Pydantic.
- Erro público nunca contém stacktrace.
- Resposta pública nunca contém confidence score.
- Resposta pública nunca contém `storage_key`.
- Resposta pública nunca contém `internal_error_message`.
- UploadDTO não contém hash nem path.
- ArtifactDTO não contém path interno.
