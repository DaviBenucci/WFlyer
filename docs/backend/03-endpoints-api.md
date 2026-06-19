# Endpoints da API

## Objetivo

Definir os contratos públicos iniciais da API do WFlyer para que backend e frontend evoluam sem divergência.

A implementação deve seguir também:

```text
docs/backend/15-guia_detalhado_backend.md
docs/frontend/08-contratos-api-frontend.md
docs/implementacao/00-guia_de_implementacao.md
```

## Convenções gerais

- Prefixo público: `/api`.
- Health simples fora do prefixo: `/health`.
- Respostas JSON em endpoints de dados.
- Upload por `multipart/form-data`.
- Datas em ISO 8601 UTC.
- IDs em UUID, exceto `instrument.id`, que pode ser slug estável.
- Erros com `code`, `message` e `correlation_id`.
- DTO público nunca retorna campos internos/admin.
- Download deve usar token temporário, URL assinada ou stream controlado.
- Storage path/key nunca aparece em resposta pública.

## Autorização no MVP sem login

O MVP não possui login obrigatório.

Para jobs e artefatos sensíveis, usar uma das estratégias documentadas:

```text
X-WFlyer-Access-Token: <token temporario>
```

ou parâmetro temporário quando estritamente necessário:

```text
?access_token=<token temporario>
```

Preferência: header. Query string deve ser evitada quando houver risco de log em proxy/navegador.

O backend deve armazenar apenas hash do token quando viável.

## Erro padrão

```json
{
  "code": "PDF_INVALID",
  "message": "Envie um arquivo PDF válido para continuar.",
  "correlation_id": "req_abc123"
}
```

Regras:

- `message` deve ser segura para usuário.
- `correlation_id` ajuda suporte/debug.
- `details` só pode conter dados públicos.
- nunca retornar stacktrace.
- nunca retornar path interno.
- nunca retornar comando do worker.

## Health

```text
GET /health
```

Uso:

- verificar se API está viva;
- usado por Docker, deploy e frontend debug.

Resposta:

```json
{
  "status": "ok",
  "service": "wflyer-api"
}
```

## Health de dependências

```text
GET /health/dependencies
```

Uso:

- desenvolvimento;
- frontend debug;
- operação interna.

Resposta exemplo:

```json
{
  "status": "ok",
  "service": "wflyer-api",
  "dependencies": {
    "database": "ok",
    "redis": "ok",
    "storage": "ok"
  }
}
```

Segurança:

- não retornar host, senha, DSN, bucket interno ou stacktrace.
- em produção, proteger ou limitar conforme ambiente.

## Instrumentos

### Listar instrumentos

```text
GET /api/instruments
```

Uso:

- preencher seleção de origem;
- preencher seleção de destino;
- exibir tela de instrumentos.

Query params opcionais futuros:

```text
family
supported
q
```

Resposta:

```json
{
  "items": [
    {
      "id": "trumpet-bb",
      "name": "Trompete Bb",
      "family": "metais",
      "written_to_concert": -2,
      "aliases": ["trumpet", "trompete em si bemol"],
      "description": "Instrumento transpositor em Bb.",
      "supported": true
    }
  ]
}
```

Validações:

- retornar apenas campos públicos;
- ordenar por família/nome ou regra documentada;
- não depender de mock no frontend final.

### Buscar instrumento por ID

```text
GET /api/instruments/{id}
```

Resposta 200:

```json
{
  "id": "piano",
  "name": "Piano",
  "family": "teclas",
  "written_to_concert": 0,
  "aliases": ["keyboard"],
  "description": "Instrumento em som real.",
  "supported": true
}
```

Erro 404:

```json
{
  "code": "INSTRUMENT_NOT_FOUND",
  "message": "Instrumento não encontrado.",
  "correlation_id": "req_abc123"
}
```

## Uploads

### Enviar PDF

```text
POST /api/uploads
Content-Type: multipart/form-data
```

Campos:

```text
file: PDF
```

Responsabilidades do endpoint:

1. validar tamanho;
2. detectar MIME real;
3. validar assinatura/estrutura mínima de PDF;
4. rejeitar PDF criptografado se não suportado;
5. sanitizar nome original;
6. gerar storage key interna;
7. salvar arquivo no storage;
8. persistir `uploaded_files`;
9. retornar DTO público.

Resposta 201:

```json
{
  "upload_id": "7b2c89b2-7a7a-4e3e-a91d-6d0d9893a101",
  "original_filename": "partitura.pdf",
  "safe_display_filename": "partitura.pdf",
  "size_bytes": 123456,
  "detected_mime": "application/pdf",
  "status": "uploaded",
  "expires_at": "2026-07-04T12:00:00Z"
}
```

Erros possíveis:

```text
PDF_INVALID
PDF_TOO_LARGE
PDF_EMPTY
PDF_ENCRYPTED_UNSUPPORTED
UPLOAD_STORAGE_FAILED
RATE_LIMITED
```

Segurança:

- não retornar `storage_key`;
- não retornar path temporário;
- não confiar em `Content-Type` informado pelo navegador;
- limpar storage se persistência falhar após upload.

## Transpositions

### Criar job de transposição

```text
POST /api/transpositions
```

Entrada:

```json
{
  "upload_id": "7b2c89b2-7a7a-4e3e-a91d-6d0d9893a101",
  "source_instrument_id": "piano",
  "target_instrument_id": "trumpet-bb",
  "client_session_id": "anonymous-session-id"
}
```

Responsabilidades:

1. validar upload existente e não expirado;
2. validar instrumentos suportados;
3. calcular intervalo;
4. criar `processing_jobs`;
5. criar evento inicial;
6. gerar token temporário;
7. publicar job na fila;
8. retornar status inicial.

Resposta 202:

```json
{
  "job_id": "4986c7e5-47c6-4a4c-9988-d8b0a558fc72",
  "status": "queued",
  "progress": 0,
  "current_step": "queued",
  "source_instrument_id": "piano",
  "target_instrument_id": "trumpet-bb",
  "transpose_interval": 2,
  "access_token": "token-temporario-retornado-uma-vez",
  "expires_at": "2026-07-04T12:00:00Z"
}
```

Observação:

- `access_token` deve ser retornado somente quando necessário e tratado como dado sensível.
- O backend deve preferir armazenar hash do token.

Erros possíveis:

```text
UPLOAD_NOT_FOUND
UPLOAD_EXPIRED
INSTRUMENT_NOT_FOUND
INSTRUMENT_UNSUPPORTED
TRANSPOSITION_INVALID
QUEUE_UNAVAILABLE
RATE_LIMITED
```

## Jobs

### Buscar job

```text
GET /api/jobs/{job_id}
X-WFlyer-Access-Token: <token temporario>
```

Resposta:

```json
{
  "id": "4986c7e5-47c6-4a4c-9988-d8b0a558fc72",
  "status": "transposing",
  "progress": 65,
  "current_step": "transposing",
  "original_filename": "partitura.pdf",
  "source_instrument_id": "piano",
  "target_instrument_id": "trumpet-bb",
  "transpose_interval": 2,
  "detected_key": "C",
  "target_key": "D",
  "public_error_message": null,
  "created_at": "2026-06-19T12:00:00Z",
  "updated_at": "2026-06-19T12:01:00Z",
  "expires_at": "2026-07-04T12:00:00Z",
  "completed_at": null
}
```

Proibido no retorno:

```text
storage_key
internal_error_message
stacktrace
worker_id
confidence_score_omr
download_token_hash
```

### Buscar status resumido

```text
GET /api/jobs/{job_id}/status
X-WFlyer-Access-Token: <token temporario>
```

Resposta:

```json
{
  "id": "4986c7e5-47c6-4a4c-9988-d8b0a558fc72",
  "status": "rendering",
  "progress": 82,
  "current_step": "rendering",
  "public_error_message": null,
  "updated_at": "2026-06-19T12:02:00Z"
}
```

Uso:

- polling do frontend.

### Listar eventos públicos do job

```text
GET /api/jobs/{job_id}/events
X-WFlyer-Access-Token: <token temporario>
```

Resposta:

```json
{
  "items": [
    {
      "type": "queued",
      "message": "Sua partitura entrou na fila de processamento.",
      "created_at": "2026-06-19T12:00:00Z"
    }
  ]
}
```

Eventos públicos não devem conter detalhes internos.

### Cancelar job

```text
DELETE /api/jobs/{job_id}
X-WFlyer-Access-Token: <token temporario>
```

Resposta:

```json
{
  "id": "4986c7e5-47c6-4a4c-9988-d8b0a558fc72",
  "status": "cancelled"
}
```

Regra:

- cancelar somente se job ainda não finalizou ou se o worker permitir cancelamento seguro.
- se cancelamento real não estiver disponível, documentar limitação.

## Artefatos

### Listar artefatos do job

```text
GET /api/jobs/{job_id}/artifacts
X-WFlyer-Access-Token: <token temporario>
```

Resposta:

```json
{
  "items": [
    {
      "id": "c9d3b87a-9c10-46ea-9db7-b76d99a4a01e",
      "job_id": "4986c7e5-47c6-4a4c-9988-d8b0a558fc72",
      "kind": "final_pdf",
      "filename": "partitura-transposta-trompete-bb.pdf",
      "size_bytes": 345678,
      "expires_at": "2026-07-04T12:00:00Z"
    }
  ]
}
```

### Download de artefato

```text
GET /api/artifacts/{artifact_id}/download
X-WFlyer-Access-Token: <token temporario>
```

Opção A — redirecionamento:

```text
302 -> URL assinada temporária
```

Opção B — payload:

```json
{
  "download_url": "https://storage-temporario-assinado",
  "expires_in_seconds": 300
}
```

Opção C — stream controlado pela API:

```text
200 application/pdf
```

A decisão deve ser registrada antes da implementação final.

Erros possíveis:

```text
ARTIFACT_NOT_FOUND
ARTIFACT_EXPIRED
ACCESS_TOKEN_INVALID
ACCESS_TOKEN_EXPIRED
DOWNLOAD_UNAVAILABLE
```

## Admin futuro

Endpoints admin são futuros e exigem autenticação/autorização.

```text
GET /api/admin/jobs
GET /api/admin/jobs/{id}
GET /api/admin/metrics
GET /api/admin/instruments
PATCH /api/admin/instruments/{id}
GET /api/admin/shared-scores
PATCH /api/admin/shared-scores/{id}/moderation
```

Não implementar admin completo no MVP sem decisão explícita.

## Status de job

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

## Regras de segurança dos endpoints

- Não retornar stacktrace.
- Não retornar storage path.
- Não retornar confidence score em endpoints públicos.
- Validar token/sessão em jobs e artefatos.
- Aplicar rate limiting em upload, transposition e download.
- Usar CORS restritivo.
- Retornar mensagens públicas seguras.
- Registrar correlation ID em erros e logs.
