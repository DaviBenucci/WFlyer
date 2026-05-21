# Políticas de upload e storage

## Nome de arquivo

O nome original só pode ser usado para exibição, depois de sanitizado.

Path interno sempre usa UUID.

## Storage key

Formato sugerido:

```text
jobs/{job_id}/{kind}/{artifact_id}.{ext}
```

## Quarentena

Uploads entram em área isolada até validação profunda.

## Expiração

Todos os arquivos de job expiram após 15 dias.

## Download

Downloads passam pela API para validação e geração de URL assinada.

## Logs

Não logar:

- URL assinada completa;
- token;
- conteúdo do arquivo;
- path local absoluto quando desnecessário.
