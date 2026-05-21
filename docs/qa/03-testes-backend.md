# Testes backend

## Ferramentas sugeridas

```text
pytest
httpx AsyncClient
pytest-asyncio
factory-boy opcional
Testcontainers opcional
```

## API

- Health.
- Listagem de instrumentos.
- Upload válido.
- Upload inválido.
- Criação de job.
- Status.
- Artefatos.
- Download.

## Segurança

- MIME falso.
- Arquivo acima do limite.
- PDF criptografado.
- Path traversal em filename.
- Token inválido.
- Job expirado.
- Endpoint admin sem role.

## Banco

- Migrations sobem e descem.
- Índices existem.
- `expires_at` preenchido.

## Workers

- Job muda status corretamente.
- Falha gera `failed`.
- Retry respeita regras.
- Timeout gera erro seguro.
