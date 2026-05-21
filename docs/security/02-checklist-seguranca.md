# Checklist de segurança

## Upload

- [ ] Validar magic bytes.
- [ ] Validar MIME real.
- [ ] Limitar tamanho.
- [ ] Limitar páginas.
- [ ] Rejeitar PDF criptografado se não suportado.
- [ ] Sanitizar filename.
- [ ] Usar UUID interno.
- [ ] Não usar filename em path.
- [ ] Salvar fora de pasta pública.

## API

- [ ] Rate limiting.
- [ ] CORS restritivo.
- [ ] Headers de segurança.
- [ ] Validação Pydantic.
- [ ] Erros sem stacktrace.
- [ ] Correlation ID.
- [ ] Logs sem tokens.

## Storage

- [ ] Bucket privado.
- [ ] URLs assinadas temporárias.
- [ ] Storage key não aparece em DTO público.
- [ ] Expiração de 15 dias.
- [ ] Cleanup testado.

## Workers

- [ ] Usuário sem privilégio.
- [ ] `shell=False`.
- [ ] Timeout por etapa.
- [ ] Diretório temporário isolado.
- [ ] Limite de CPU/memória quando disponível.
- [ ] Limpeza de temporários.

## Frontend

- [ ] Não exibir confidence score.
- [ ] Não salvar tokens permanentes.
- [ ] XSS evitado em nomes/metadados.
- [ ] Permissões de push só com ação explícita.

## Admin futuro

- [ ] RBAC.
- [ ] Auditoria.
- [ ] Dados internos em endpoints separados.
- [ ] Moderação registrada.
