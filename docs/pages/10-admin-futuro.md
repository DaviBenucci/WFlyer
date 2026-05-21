# Painel Admin futuro

## Rota

```text
/admin
```

## Objetivo

Permitir suporte, auditoria técnica, métricas internas e moderação sem expor dados indevidos.

## Escopo MVP


Fora do MVP, mas os dados internos devem ser coletados desde cedo quando seguros.

Áreas:

```text
Jobs
Métricas de processamento
Erros internos
Instrumentos
Compartilhamentos
Arquivos expirados
```


## Componentes principais


- `AdminJobsTable`
- `AdminJobDetails`
- `AdminMetricsPanel`
- `AdminInstrumentManager`
- `AdminSharedModerationQueue`
- `AdminAuditLogViewer`


## Dados necessários


Dados internos:

```text
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
warnings_count
processing_duration_ms
engine_version
worker_id
internal_error_message
job_events
```


## Interações


- Filtrar jobs por status.
- Ver timeline do job.
- Ver métricas internas.
- Moderar compartilhamentos.
- Gerenciar instrumentos com auditoria.


## Validações e regras de negócio


- Requer role admin.
- Dados sensíveis mascarados quando possível.
- Logs com acesso auditado.
- Alterações em instrumentos devem gerar registro.


## Estados de tela


Estados:

```text
loading
loaded
forbidden
empty
error
```


## Segurança e privacidade


- RBAC obrigatório.
- Auditoria de acesso.
- Não permitir download direto de arquivos privados sem justificativa/log.
- Segregar métricas de suporte e dados pessoais.


## Acessibilidade


- Tabelas navegáveis por teclado.
- Filtros com labels.
- Erros internos não devem depender de tooltip apenas.


## Critérios de aceite


- Usuário comum não acessa admin.
- Admin vê métricas internas sem expô-las ao frontend público.
- Toda moderação gera log.
