# Admin API futura

## Objetivo

Fornecer suporte operacional, métricas internas e moderação.

## Requisitos

- Autenticação obrigatória.
- RBAC com role admin.
- Auditoria de ações.
- Separação entre dados públicos e internos.

## Endpoints possíveis

```text
GET /api/admin/jobs
GET /api/admin/jobs/{id}
GET /api/admin/metrics
GET /api/admin/instruments
PATCH /api/admin/instruments/{id}
GET /api/admin/shared-scores
PATCH /api/admin/shared-scores/{id}/moderation
```

## Jobs admin

Pode mostrar:

```text
status
progress
current_step
internal_error_message
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
unrecognized_symbols_count
parsed_measures_count
warnings_count
processing_duration_ms
engine_version
worker_id
job_events
```

## Instrumentos admin

Permitir:

- editar aliases;
- habilitar/desabilitar suporte;
- ajustar descrição;
- revisar `written_to_concert` com auditoria.

## Moderação

Permitir:

- ocultar compartilhamento;
- restaurar;
- remover;
- registrar motivo;
- auditar admin responsável.

## Segurança

- Usuário comum nunca acessa.
- Acesso admin deve ser logado.
- Dados sensíveis mascarados quando possível.
- Downloads administrativos devem exigir justificativa ou ação auditada.
