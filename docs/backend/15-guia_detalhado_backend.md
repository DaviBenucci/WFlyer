# Backend — Guia detalhado de implementação

## Objetivo do backend

O backend do WFlyer é responsável por toda regra sensível, persistência, segurança de arquivos e processamento pesado.

Ele deve receber uma partitura em PDF, validar o arquivo, armazenar o original em storage, criar um job, enfileirar o processamento, executar a transposição em worker, gerar artefatos finais e disponibilizar download temporário.

O backend não deve depender do frontend para segurança. Validação de frontend é apenas experiência de usuário.

## Princípios fundamentais

1. **Banco guarda metadados; storage guarda arquivos.**
2. **API responde rápido; worker processa tarefas pesadas.**
3. **PDF é sempre tratado como arquivo potencialmente perigoso.**
4. **DTO público nunca expõe campos internos/admin.**
5. **Arquivos expiram no servidor após 15 dias.**
6. **Todo job precisa de rastreabilidade por eventos e correlation ID.**
7. **Subprocessos devem usar `shell=False` e argumentos em lista.**
8. **O MVP não exige login.**
9. **Admin completo é futuro.**
10. **Frontend final só deve consumir contratos estabilizados.**

## Stack recomendada

```text
Python 3.12+
FastAPI
Pydantic v2
SQLAlchemy 2.0
Alembic
PostgreSQL
Redis
Celery preferencialmente
MinIO/local storage no desenvolvimento
S3/R2/B2/Supabase Storage em produção
music21
Audiveris ou caminho OMR documentado
MuseScore CLI
pytest
Ruff
mypy/pyright quando viável
Docker/Docker Compose
```

## Ordem de implementação do backend

O Codex deve seguir esta ordem:

```text
1. Configuração e estrutura.
2. Banco, migrations e seeds.
3. Health, settings, logs e erros.
4. Instrumentos e cálculo de transposição.
5. Storage.
6. Upload seguro.
7. Jobs.
8. Fila.
9. Worker.
10. Pipeline musical.
11. Artefatos e download.
12. Cleanup de expiração.
13. Segurança.
14. Observabilidade.
15. Testes finais.
```

## Estrutura recomendada de pastas

```text
apps/api/
  app/
    main.py
    config/
      settings.py
      logging.py
      security_headers.py
    db/
      base.py
      session.py
      migrations/
      models/
        instrument.py
        uploaded_file.py
        processing_job.py
        job_event.py
        generated_artifact.py
        admin_processing_metric.py
      repositories/
    api/
      routes/
        health.py
        instruments.py
        uploads.py
        transpositions.py
        jobs.py
        artifacts.py
      schemas/
        common.py
        instruments.py
        uploads.py
        jobs.py
        artifacts.py
    services/
      instruments_service.py
      transposition_rules.py
      upload_validation.py
      storage_service.py
      job_service.py
      artifact_service.py
      cleanup_service.py
    workers/
      celery_app.py
      tasks.py
      pipeline.py
    music/
      musicxml_reader.py
      transposer.py
      renderer.py
      omr.py
      quality.py
    security/
      tokens.py
      rate_limit.py
      file_safety.py
    tests/
```

A estrutura pode variar, mas a separação de responsabilidades deve permanecer clara.

## Camadas do backend

### API routes

Responsáveis por HTTP:

- ler request;
- chamar serviços;
- retornar DTO público;
- converter exceções conhecidas em `ErrorDTO`;
- nunca executar processamento pesado.

### Services

Responsáveis por regra de negócio:

- validar upload;
- calcular intervalo de transposição;
- criar job;
- salvar metadados;
- solicitar storage;
- publicar fila;
- gerar artefatos;
- controlar cleanup.

### Repositories

Responsáveis por persistência:

- encapsular queries;
- reduzir SQL espalhado;
- facilitar testes;
- impedir acoplamento de router com modelo.

### Workers

Responsáveis por processamento pesado:

- OMR;
- leitura MusicXML;
- transposição;
- renderização;
- escrita de artefatos;
- atualização de status;
- registro de eventos.

### Music

Responsável por lógica musical pura:

- cálculo de semitons;
- manipulação de notas;
- acordes;
- armadura;
- acidentes;
- tonalidade resultante;
- validações musicais.

Essa camada deve ser testada com fixtures e sem depender de HTTP.

## Modelo de dados explicado

### `instruments`

Guarda instrumentos disponíveis e suas propriedades de transposição.

Campos esperados:

```text
id
name
family
written_to_concert
aliases
description
supported
created_at
updated_at
```

Exemplo:

```text
Piano: written_to_concert = 0
Trompete Bb: written_to_concert = -2
Sax alto Eb: written_to_concert = -9
```

Regra:

```text
intervalo = source_written_to_concert - target_written_to_concert
```

### `uploaded_files`

Guarda metadados do arquivo original.

Campos esperados:

```text
id
original_filename
safe_display_filename
detected_mime
size_bytes
sha256
storage_key
status
expires_at
created_at
updated_at
```

Não guardar o PDF no banco.

### `processing_jobs`

Guarda o ciclo de vida da transposição.

Campos esperados:

```text
id
upload_id
anonymous_session_id
status
progress
current_step
source_instrument_id
target_instrument_id
transpose_interval
download_token_hash
public_error_message
internal_error_message
expires_at
created_at
updated_at
completed_at
failed_at
```

### `job_events`

Guarda linha do tempo do job.

Campos esperados:

```text
id
job_id
event_type
public_message
internal_message
metadata_json
created_at
```

Eventos públicos devem ser seguros.

### `generated_artifacts`

Guarda metadados dos artefatos.

Campos esperados:

```text
id
job_id
kind
filename
storage_key
size_bytes
mime_type
expires_at
created_at
```

`storage_key` nunca deve sair em DTO público.

### `admin_processing_metrics`

Guarda dados internos de qualidade e performance.

Campos esperados:

```text
id
job_id
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
unrecognized_symbols_count
parsed_measures_count
warnings_count
processing_duration_ms
engine_version
created_at
```

Esses campos não aparecem para usuário comum.

## Status de job recomendados

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

O MVP pode não usar todos, mas não deve inventar status fora da documentação sem decisão.

## Fluxo de upload

```text
1. Frontend envia multipart/form-data.
2. API verifica tamanho.
3. API detecta MIME real e assinatura.
4. API rejeita PDF inválido, vazio, grande demais ou criptografado se não suportado.
5. API sanitiza nome original para exibição.
6. API gera UUID e storage key interna.
7. API salva arquivo em storage.
8. API persiste metadados em uploaded_files.
9. API retorna UploadDTO público.
```

Erros públicos devem ser claros:

```text
PDF_INVALID
PDF_TOO_LARGE
PDF_ENCRYPTED_UNSUPPORTED
UPLOAD_STORAGE_FAILED
```

Nunca retornar detalhes de parser, path temporário ou stacktrace.

## Fluxo de criação de job

```text
1. Frontend envia upload_id, origem, destino e sessão anônima.
2. API valida upload existente e não expirado.
3. API valida instrumentos suportados.
4. API calcula intervalo.
5. API cria processing_job.
6. API cria job_event inicial.
7. API gera token temporário e salva hash.
8. API publica mensagem na fila.
9. API retorna job_id, status, token temporário e expiração.
```

## Fluxo de worker

```text
1. Worker recebe job_id.
2. Worker carrega job e upload.
3. Worker marca status validating.
4. Worker cria workspace temporário.
5. Worker baixa PDF do storage.
6. Worker executa OMR ou caminho documentado.
7. Worker lê MusicXML.
8. Worker aplica transposição.
9. Worker renderiza PDF final.
10. Worker salva artefatos no storage.
11. Worker registra generated_artifacts.
12. Worker registra métricas admin.
13. Worker marca job completed.
14. Worker limpa workspace temporário.
```

Em falha:

```text
1. Registrar erro interno seguro.
2. Definir public_error_message genérica.
3. Marcar job failed.
4. Registrar job_event failed.
5. Limpar workspace.
6. Não vazar path, stacktrace ou comando.
```

## Pipeline musical

### Entrada

- PDF original validado;
- instrumento de origem;
- instrumento de destino;
- intervalo de semitons;
- parâmetros de processamento.

### Etapas

1. Extração/OMR;
2. MusicXML intermediário;
3. leitura de score;
4. transposição de notas;
5. transposição de acordes;
6. ajuste de armadura;
7. tratamento de acidentes locais;
8. geração de MusicXML final;
9. renderização de PDF final;
10. validação de artefatos.

### Saída

- PDF final;
- MusicXML final;
- avisos públicos seguros;
- métricas internas para admin.

## Segurança backend

### Upload

- limite de tamanho;
- limite de páginas quando implementado;
- validação real de tipo;
- bloqueio de arquivos suspeitos;
- nomes sanitizados;
- UUID interno;
- storage isolado;
- exclusão de arquivo parcial em falha.

### Storage

- buckets separados por ambiente;
- URLs assinadas e temporárias;
- sem path público permanente;
- retenção de 15 dias;
- cleanup idempotente;
- logs sem storage key pública.

### Worker

- usuário sem privilégio;
- workspace por job;
- timeouts;
- limites de CPU/memória quando possível;
- subprocess sem shell;
- limpeza em erro;
- retries controlados.

### API

- CORS restritivo;
- rate limiting;
- headers de segurança;
- ErrorDTO seguro;
- correlation ID;
- DTO público separado de admin;
- tokens temporários protegidos.

## Observabilidade

O backend deve registrar:

- request_id/correlation_id;
- endpoint;
- status HTTP;
- duração;
- job_id quando aplicável;
- transições de status;
- falhas por tipo;
- duração do worker;
- quantidade de retries;
- limpeza de arquivos expirados.

Não registrar:

- token em claro;
- storage key em resposta pública;
- conteúdo de arquivo;
- stacktrace em erro público;
- dados sensíveis sem necessidade.

## Testes backend obrigatórios

### Banco

- migrations sobem do zero;
- seeds idempotentes;
- constraints rejeitam status inválido;
- relationships funcionam.

### API

- health;
- instruments;
- upload válido;
- upload inválido;
- criação de job;
- status de job;
- artefatos;
- download;
- erro padrão.

### Segurança

- MIME falso;
- arquivo grande;
- path traversal no nome;
- token ausente;
- token inválido;
- token expirado;
- DTO público sem campos internos;
- logs sem token.

### Worker

- job sucesso;
- job falha;
- retry controlado;
- timeout;
- cleanup de workspace;
- atualização de eventos.

### Musical

- C para C;
- C para Bb;
- C para Eb;
- Bb para C;
- acordes;
- armadura;
- acidentes;
- MusicXML inválido.

## Critérios de conclusão do backend MVP

O backend MVP está concluído quando:

- `docker compose` sobe dependências;
- Alembic aplica migrations;
- seed de instrumentos funciona;
- API de instrumentos usa banco;
- upload seguro grava em storage;
- job é criado e enfileirado;
- worker processa job;
- artefatos são registrados;
- download temporário funciona;
- cleanup de 15 dias existe;
- testes principais passam;
- segurança básica foi validada;
- documentação e logs estão atualizados.

## O que fica fora do backend MVP

- login real;
- autorização por usuário autenticado;
- planos/pagamentos;
- dashboard completo;
- biblioteca remota;
- compartilhamento público real;
- push notifications reais;
- admin completo;
- moderação pública.

Esses itens podem ter documentação, mas não devem ser implementados antes do MVP sem decisão explícita.
