# Filas e Workers

## Objetivo

Processar tarefas pesadas fora da API com controle de retry, timeout e observabilidade.

## Broker/cache

Redis.

## Fila inicial

```text
transposition_default
```

## Filas futuras

```text
omr_heavy
render_pdf
cleanup
notifications
```

## Worker inicial

```text
worker-transposition
```

Pode executar o pipeline completo no MVP. Depois pode separar:

```text
worker-omr
worker-transposition
worker-render
```

## Retries

- Retries limitados por tipo de erro.
- Não repetir erro determinístico, como PDF inválido.
- Retry para falha temporária de storage ou render.
- Backoff exponencial.

## Timeouts

Timeout por etapa:

```text
PDF validation: curto
OMR: longo, mas limitado
Transposition: médio
Rendering: médio/longo
Storage: curto/médio
```

## Dead-letter

Opções:

- fila dead-letter;
- tabela `failed_jobs`;
- eventos em `job_events` com `event_type=failed_permanent`.

## Observabilidade

- logs JSON;
- correlation/job ID;
- duração por etapa;
- worker_id;
- tamanho de fila;
- falhas por tipo.

## Segurança

- Worker sem privilégio root.
- Sem acesso a secrets desnecessários.
- Diretório temporário isolado.
- Limites de CPU/memória.
- Subprocess sem shell.
