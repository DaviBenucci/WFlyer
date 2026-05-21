# Observabilidade

## Objetivo

Permitir diagnóstico de jobs, falhas e performance sem expor dados sensíveis.

## Logs estruturados

Formato JSON recomendado:

```json
{
  "timestamp": "2026-05-14T21:00:00Z",
  "level": "info",
  "service": "worker-transposition",
  "correlation_id": "req_abc",
  "job_id": "uuid",
  "event": "job_step_completed",
  "step": "transposing",
  "duration_ms": 1234
}
```

## Correlation ID

- Gerado na API se não enviado.
- Propagado para fila.
- Incluído em eventos e logs.
- Retornado em erros públicos.

## Métricas

```text
duração por etapa
taxa de sucesso do OMR
taxa de falha por erro
tempo médio de fila
tamanho da fila
jobs expirados
uso de storage
jobs por instrumento origem/destino
```

## Ferramentas possíveis

```text
OpenTelemetry
Prometheus
Grafana
Sentry
Loki
```

## Alertas

- Falhas recorrentes de OMR.
- Renderização falhando em lote.
- Fila crescendo demais.
- Storage indisponível.
- Jobs presos em status não terminal.
- Cleanup não executando.

## Privacidade

- Não enviar PDFs para ferramentas externas de observabilidade.
- Mascarar tokens.
- Reduzir dados pessoais.
- Separar métricas agregadas de dados de usuário.
