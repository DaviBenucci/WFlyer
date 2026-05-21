# Upload de PDF

## Objetivo

Receber uma partitura em PDF com validação em frontend e backend, tratando o arquivo como potencialmente perigoso.

## Fluxo

```text
Usuário seleciona PDF
Frontend valida tipo/tamanho básico
Frontend mostra resumo
Usuário avança
API valida MIME real e tamanho
API sanitiza nome
API gera UUID interno
API salva em storage/quarentena
API cria registro uploaded_files
```

## Validação frontend

- Campo obrigatório.
- Extensão `.pdf` apenas como indício visual.
- `file.type` pode ser checado, mas não é confiável como única validação.
- Limite sugerido: 25 MB.
- Mostrar nome sanitizado/truncado no card.

## Validação backend obrigatória

- Validar assinatura/magic bytes.
- Validar MIME real.
- Validar tamanho máximo.
- Validar número de páginas.
- Rejeitar PDF criptografado se não suportado.
- Rejeitar PDF vazio ou corrompido.
- Sanitizar filename.
- Usar UUID interno.
- Salvar fora de diretório público.
- Proteger contra path traversal.

## Segurança

PDFs são potencialmente perigosos. Não abrir com ferramentas privilegiadas. Qualquer subprocess deve ter timeout, diretório isolado e `shell=False`.

## Estados públicos

```text
idle
file_selected
validating
valid
invalid
uploading
uploaded
failed
```

## Critérios de aceite

- Arquivo inválido não avança.
- Nome interno não depende do nome original.
- Backend rejeita PDF falso com extensão `.pdf`.
- Erro público é claro e sem detalhes internos.
