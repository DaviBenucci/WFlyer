# Estrutura de pastas sugerida para backend

```text
apps/api/
  app/
    main.py
    core/
      config.py
      security.py
      logging.py
      rate_limit.py
    api/
      routes/
        health.py
        instruments.py
        uploads.py
        transpositions.py
        jobs.py
        artifacts.py
        admin.py
    domain/
      instruments.py
      transposition.py
      score.py
      jobs.py
      artifacts.py
    schemas/
      instruments.py
      jobs.py
      uploads.py
      artifacts.py
    services/
      upload_service.py
      pdf_validation_service.py
      storage_service.py
      job_service.py
      transposition_service.py
      artifact_service.py
      notification_service.py
    workers/
      tasks.py
      omr_worker.py
      render_worker.py
    repositories/
      job_repository.py
      artifact_repository.py
      instrument_repository.py
    db/
      base.py
      session.py
      models/
    tests/
```

## Regras de organização

- `api/routes`: somente camada HTTP.
- `schemas`: DTOs Pydantic.
- `services`: casos de uso.
- `repositories`: acesso ao banco.
- `domain`: regras puras de negócio/música.
- `workers`: tarefas Celery/RQ/Dramatiq.
- `core`: config, segurança, logging.
- `tests`: organizado por unidade, integração e segurança.

## Anti-padrões

- Regra musical dentro de route.
- SQL espalhado por services sem repository.
- Subprocess sem wrapper seguro.
- DTO público reutilizado para admin com campos internos.
