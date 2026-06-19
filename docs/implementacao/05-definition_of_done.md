# Definition of Done

Uma fase ou etapa só pode ser considerada concluída quando todos os critérios aplicáveis forem atendidos.

## Status obrigatório

- [ ] A etapa está registrada em `IMPLEMENTATION_LOG.md`.
- [ ] O status inicial foi `PENDENTE` ou `EM_EXECUCAO`.
- [ ] Sub-etapas de imprevisto foram registradas quando necessárias.
- [ ] O status final é `CONCLUIDA`.
- [ ] A próxima etapa não foi iniciada antes da conclusão desta.

## Código

- [ ] Implementado no local correto.
- [ ] Escopo pequeno e coeso.
- [ ] Sem duplicação desnecessária.
- [ ] Tipado quando aplicável.
- [ ] Sem secrets no código.
- [ ] Sem hacks temporários não registrados.
- [ ] Sem contratos públicos improvisados.
- [ ] Sem item futuro implementado fora do escopo.

## Banco de dados

- [ ] Migration criada quando schema mudou.
- [ ] Migration aplicada com sucesso.
- [ ] Seed idempotente quando aplicável.
- [ ] Constraints e status coerentes.
- [ ] Índices necessários criados.
- [ ] Banco guarda metadados; storage guarda arquivos.

## Backend

- [ ] API responde conforme contrato.
- [ ] Processamento pesado não ocorre dentro da request HTTP.
- [ ] Jobs são assíncronos quando aplicável.
- [ ] Workers possuem timeouts e tratamento de falha.
- [ ] Erros públicos usam mensagens seguras.
- [ ] DTO público não expõe dados internos/admin.
- [ ] Logs possuem correlation ID e não vazam dados sensíveis.

## Frontend

- [ ] Frontend final só foi iniciado após backend MVP validado.
- [ ] Frontend simples de verificação ficou restrito a debug/teste de integração.
- [ ] Estados loading/error/empty existem.
- [ ] Mobile e desktop foram verificados.
- [ ] Acessibilidade básica foi revisada.
- [ ] Reduced motion foi respeitado.
- [ ] Tokens e URLs temporárias não foram logados.
- [ ] Confidence score não aparece para usuário comum.

## Segurança

- [ ] Entradas validadas no backend.
- [ ] Upload/download seguros quando aplicável.
- [ ] PDF tratado como potencialmente perigoso.
- [ ] MIME real e tamanho validados.
- [ ] Storage key/path não exposto publicamente.
- [ ] `shell=True` não usado.
- [ ] Rate limit/CORS/headers avaliados.
- [ ] Tokens temporários protegidos.
- [ ] Logs sem stacktrace público e sem secrets.

## Testes

- [ ] Unitários relevantes executados.
- [ ] Integração executada quando API/banco/worker mudou.
- [ ] E2E executado quando fluxo de usuário mudou.
- [ ] Testes musicais executados quando regra de transposição mudou.
- [ ] Lint executado quando disponível.
- [ ] Typecheck executado quando disponível.
- [ ] Build executado quando aplicável.
- [ ] Testes registrados em `TEST_LOG.md`.
- [ ] Testes não executados possuem justificativa.

## Documentação

- [ ] Documentos afetados atualizados.
- [ ] `IMPLEMENTATION_LOG.md` atualizado.
- [ ] `TEST_LOG.md` atualizado.
- [ ] `CHANGELOG.md` atualizado se houve mudança de comportamento.
- [ ] `DECISIONS.md` atualizado se houve decisão nova.
- [ ] Pendências explícitas.
- [ ] Limitações conhecidas documentadas.

## Gate final da etapa

A etapa só pode ser marcada como `CONCLUIDA` se a resposta para a pergunta abaixo for "sim":

```text
A próxima etapa pode começar sem herdar erro, lacuna crítica, contrato instável, falha de segurança ou documentação desatualizada desta etapa?
```

Se a resposta for "não", a etapa permanece `EM_EXECUCAO` ou `BLOQUEADA`.
