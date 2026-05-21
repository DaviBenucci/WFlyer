# Decisões arquiteturais principais

## ADR-001 — Projeto novo, sem reaproveitar código antigo

A nova versão do WFlyer deve ser construída do zero. O código antigo pode ser usado apenas como referência conceitual, nunca como base direta.

### Motivo

O objetivo é evitar herdar decisões técnicas antigas, dependências sem controle, vulnerabilidades e acoplamentos que dificultem a arquitetura assíncrona.

### Consequência

O Codex deve criar uma estrutura limpa e documentada, com contratos explícitos entre frontend, backend, workers, banco e storage.

## ADR-002 — MVP sem login

O MVP começa sem autenticação obrigatória para validar rapidamente o núcleo do produto:

```text
Upload PDF -> instrumento origem -> instrumento destino -> processamento -> resultado -> download
```

### Motivo

Autenticação, permissões, planos, histórico persistente e biblioteca aumentam complexidade antes da validação principal: transpor corretamente partituras.

### Implicação técnica

No MVP, jobs usam:

```text
job_id
download_token temporário
anonymous_session_id/client_session_id
expires_at
```

Quando login for adicionado, entram:

```text
user_id
permissions
ownership
quotas
plan_limits
```

## ADR-003 — Processamento sempre assíncrono

A API não deve executar PDF/OMR/MusicXML/transposição/renderização dentro da requisição HTTP.

Fluxo correto:

```text
Frontend envia PDF
API valida o mínimo necessário
API salva arquivo em storage
API cria job
API publica job na fila
Worker processa
Frontend acompanha status
Usuário baixa artefatos
```

## ADR-004 — Banco guarda metadados; storage guarda arquivos

PDFs originais, MusicXML intermediários e PDFs finais não devem ser armazenados no banco.

O banco armazena:

```text
ids
status
progresso
instrumentos
intervalo de transposição
paths/referências no storage
métricas internas
expiração
eventos
```

## ADR-005 — Retenção de 15 dias no servidor

Arquivos originais e artefatos finais expiram após 15 dias no servidor.

### Motivo

Reduzir custo, risco de vazamento, responsabilidade sobre dados antigos e volume de storage.

### Consequência

O frontend pode manter histórico local, mas deve informar quando o arquivo está expirado no servidor.

## ADR-006 — Confiança visível apenas para admin

Usuário comum não deve ver porcentagens de confiança de OMR, detecção de instrumento ou tonalidade.

Usuário comum vê:

```text
Origem
Destino
Transposição aplicada
Tonalidade resultante
Avisos objetivos
```

Admin vê:

```text
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
unrecognized_symbols_count
parsed_measures_count
warnings_count
processing_duration_ms
engine_version
```

## ADR-007 — Segurança por padrão para PDFs

Todo PDF deve ser tratado como arquivo potencialmente perigoso.

Isso exige:

- validação real de MIME;
- limite de tamanho;
- limite de páginas;
- bloqueio de PDF criptografado quando não suportado;
- sanitização de nome;
- UUID interno;
- quarentena/isolamento;
- subprocess sem `shell=True`;
- workers sem privilégio;
- timeouts e limites de CPU/memória.
