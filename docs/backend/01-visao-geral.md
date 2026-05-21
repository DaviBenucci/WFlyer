# Backend — Visão geral

## Objetivo

Planejar o backend do WFlyer do zero, com arquitetura assíncrona, segura e escalável para processamento musical pesado.

## Stack base

```text
FastAPI
Python 3.12+
Pydantic v2
SQLAlchemy 2.0
Alembic
PostgreSQL
Redis
Celery preferencialmente
MinIO/local storage no desenvolvimento
S3/R2/B2/Supabase Storage em produção
Docker/Docker Compose
```

## Responsabilidades

- Validar PDF.
- Armazenar original.
- Criar job.
- Enfileirar processamento.
- Executar OMR.
- Ler MusicXML.
- Confirmar instrumento de origem.
- Calcular transposição.
- Alterar notas, acordes, armadura e acidentes.
- Gerar MusicXML final.
- Renderizar PDF final.
- Salvar artefatos.
- Atualizar status.
- Disponibilizar download.

## Fluxo macro

```text
Frontend
  ↓
API recebe upload e cria job
  ↓
Arquivo vai para storage
  ↓
Job entra em fila
  ↓
Worker processa PDF/OMR/MusicXML/transposição
  ↓
Worker salva artefatos finais
  ↓
API disponibiliza status e download
```

## Princípios

- API deve responder rápido.
- Workers fazem processamento pesado.
- Storage guarda arquivos.
- Banco guarda metadados.
- PDFs são potencialmente perigosos.
- Downloads usam URLs assinadas.
- Retenção padrão é 15 dias.
