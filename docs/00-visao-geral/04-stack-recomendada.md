# Stack recomendada

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
Lucide React
React Hook Form
Zod
TanStack Query
Dexie/IndexedDB
Service Worker/PWA
```

### Justificativa

- Next.js oferece estrutura robusta para aplicação web moderna.
- TypeScript reduz erros de contrato entre componentes e API.
- Tailwind + shadcn/ui aceleram a criação de UI consistente.
- Framer Motion atende às animações musicais com controle de acessibilidade.
- Zod e React Hook Form ajudam a validar formulários e uploads.
- TanStack Query organiza cache, polling e estados assíncronos.
- Dexie/IndexedDB sustenta histórico local.

## Backend

```text
FastAPI
Python 3.12+
Pydantic v2
SQLAlchemy 2.0
Alembic
PostgreSQL
Redis
Celery, RQ ou Dramatiq
MinIO/local storage no desenvolvimento
S3/R2/B2/Supabase Storage em produção
Docker/Docker Compose
```

### Escolha recomendada para fila

Para o WFlyer, a recomendação inicial é Celery com Redis, por maturidade e capacidade de lidar com retries, timeouts e workers separados.

RQ é mais simples, mas menos completo para pipelines complexos.

Dramatiq é uma boa alternativa moderna, mas Celery tende a ter mais documentação e exemplos para cenários pesados.

## Processamento musical

```text
Audiveris para OMR
music21 para leitura/manipulação/transposição musical
MuseScore CLI para renderizar PDF final
```

## Observabilidade

```text
Logs JSON
Correlation ID
OpenTelemetry
Prometheus
Grafana
Sentry
Loki
```

## Segurança

```text
Rate limiting
CORS restritivo
Headers de segurança
Validação real de MIME
Storage com URLs assinadas
Workers sem privilégio
Subprocess sem shell=True
Quarentena de arquivos
Timeout por etapa
Limite de CPU/memória
```
