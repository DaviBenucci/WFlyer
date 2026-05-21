# Storage e retenção

## Objetivo

Guardar arquivos fora do banco, com isolamento, URLs temporárias e expiração automática.

## Ambientes

```text
Desenvolvimento: storage local ou MinIO
Produção: S3, Cloudflare R2, Backblaze B2 ou Supabase Storage
```

## Organização de chaves

Sugestão:

```text
jobs/{job_id}/original/{uuid}.pdf
jobs/{job_id}/intermediate/{uuid}.musicxml
jobs/{job_id}/final/{uuid}.pdf
jobs/{job_id}/final/{uuid}.musicxml
jobs/{job_id}/preview/{uuid}.png
```

Nunca usar filename original como path real.

## URLs assinadas

- Downloads devem usar URLs temporárias.
- Tempo sugerido: 5 a 15 minutos.
- Não armazenar URL assinada no banco como valor permanente.
- Gerar sob demanda após validar autorização.

## Retenção

Regra principal:

```text
Arquivos originais e artefatos finais expiram após 15 dias no servidor.
```

## Scheduler de limpeza

```text
Buscar jobs expirados
Remover arquivos do storage
Marcar jobs como expired
Remover/anonimizar metadados sensíveis
Preservar métricas agregadas quando necessário
Registrar evento de limpeza
```

## Segurança

- Bucket privado.
- Storage key não exposta publicamente.
- Path traversal impossível por design.
- Nomes internos com UUID.
- Separação por job/usuário.
- Não servir arquivos diretamente por pasta pública.

## Testes

- Job expirado não gera URL.
- Limpeza remove arquivos.
- Metadata fica consistente após expiração.
- Storage key não aparece em resposta pública.
