# Resultado e download

## Objetivo

Disponibilizar artefatos finais com segurança e prazo de expiração.

## Artefatos

```text
final_pdf
final_musicxml
preview_image opcional
```

## Download seguro

- Endpoint valida job/token/ownership.
- Backend gera URL assinada temporária.
- URL expira rapidamente.
- Filename de resposta é sanitizado.
- Não expor path interno.

## Estados

```text
completed
artifact_missing
expired
unauthorized
failed
```

## Retenção

Arquivos expiram após 15 dias no servidor.

## Critérios de aceite

- Usuário baixa apenas artefatos autorizados.
- Job expirado não gera URL.
- Erro de download não expõe storage path.
- Histórico local é atualizado após conclusão.
