# Compartilhamento

## Objetivo

Permitir compartilhamento explícito de partituras entre usuários em fase futura autenticada.

## Regras

- Compartilhamento deve ser explícito.
- Arquivos privados não aparecem publicamente.
- Usuário pode remover compartilhamento.
- Download usa URL assinada.
- Admin pode moderar.
- Limites por usuário/plano podem ser aplicados.

## Endpoints futuros

```text
POST /api/shared-scores
GET /api/shared-scores
GET /api/shared-scores/{id}
POST /api/shared-scores/{id}/download
DELETE /api/shared-scores/{id}
```

## Segurança

- Verificar ownership ao criar/remover.
- Não expor arquivo original se não for permitido.
- Registrar downloads.
- Sanitizar título e metadados.
- Moderação para abuso.

## Testes

- Arquivo privado não aparece.
- Usuário sem permissão não baixa.
- Remover compartilhamento invalida novos downloads.
- Admin modera conteúdo.
