# Checklist Codex por etapa

Este checklist deve ser usado em toda etapa do `docs/implementacao/00-guia_de_implementacao.md`.

## 1. Antes de iniciar a etapa

- [ ] A etapa anterior está marcada como `CONCLUIDA`.
- [ ] A fase atual permite esta etapa.
- [ ] A etapa foi registrada em `docs/logs/IMPLEMENTATION_LOG.md` como `EM_EXECUCAO`.
- [ ] Li `docs/implementacao/00-guia_de_implementacao.md`.
- [ ] Li `docs/implementacao/01-implementacao_IA.md`.
- [ ] Li o documento específico da área.
- [ ] Verifiquei `docs/logs/DECISIONS.md`.
- [ ] Verifiquei `docs/logs/IMPLEMENTATION_LOG.md`.
- [ ] Verifiquei `docs/logs/TEST_LOG.md`.
- [ ] Identifiquei se a etapa é backend, banco, frontend de verificação, frontend final, segurança, QA ou documentação.
- [ ] Confirmei que não estou iniciando frontend final antes do backend MVP estar concluído.
- [ ] Identifiquei riscos de segurança da etapa.

## 2. Durante a implementação

- [ ] Mantive o escopo pequeno.
- [ ] Alterei apenas arquivos necessários para a etapa.
- [ ] Não misturei banco, backend, worker e frontend final sem necessidade.
- [ ] Não inventei endpoint, DTO, tabela, status ou rota sem documentação.
- [ ] Não implementei item futuro sem decisão explícita.
- [ ] Não usei `shell=True`.
- [ ] Não salvei arquivo no banco.
- [ ] Não expus storage path.
- [ ] Não loguei token.
- [ ] Não retornei stacktrace para usuário.
- [ ] Não retornei confidence score para usuário comum.
- [ ] Separei DTO público de DTO interno/admin.
- [ ] Adicionei sub-etapa se ocorreu imprevisto.

## 3. Banco de dados

Aplicar quando a etapa tocar banco.

- [ ] Migration criada.
- [ ] Migration aplicada.
- [ ] Seed idempotente quando aplicável.
- [ ] Constraints/status validados.
- [ ] Índices relevantes criados.
- [ ] Arquivos binários não foram armazenados no banco.
- [ ] `docs/backend/04-modelagem-banco.md` atualizado.
- [ ] Teste de migration ou criação de schema executado.

## 4. Backend/API

Aplicar quando a etapa tocar backend.

- [ ] Endpoint segue prefixo e contrato documentado.
- [ ] ErrorDTO público seguro.
- [ ] Correlation ID preservado.
- [ ] Logs estruturados sem dados sensíveis.
- [ ] Validação de entrada feita no backend.
- [ ] Testes de sucesso e erro executados.
- [ ] OpenAPI/schema revisado quando aplicável.
- [ ] `docs/backend/03-endpoints-api.md` atualizado.

## 5. Upload/storage/download

Aplicar quando a etapa tocar arquivos.

- [ ] Validação de tamanho implementada.
- [ ] Validação real de PDF implementada.
- [ ] Nome original sanitizado.
- [ ] Storage key usa UUID ou padrão não previsível.
- [ ] Token/URL temporária usada em download.
- [ ] Expiração de 15 dias respeitada.
- [ ] Path interno não aparece em resposta pública.
- [ ] Testes de PDF inválido/path traversal/token inválido executados.
- [ ] Documentação de segurança atualizada.

## 6. Fila/worker/pipeline

Aplicar quando a etapa tocar processamento assíncrono.

- [ ] API não executa processamento pesado na request.
- [ ] Job é enfileirado.
- [ ] Worker atualiza status/progresso.
- [ ] Worker registra eventos.
- [ ] Subprocess usa lista de argumentos e `shell=False`.
- [ ] Timeouts definidos.
- [ ] Workspace temporário isolado por job.
- [ ] Falhas geram mensagem pública segura.
- [ ] Testes de worker executados.

## 7. Frontend simples de verificação

Aplicar somente na fase permitida.

- [ ] UI está em rota debug ou área claramente técnica.
- [ ] Testa backend real.
- [ ] Não implementa design final.
- [ ] Não implementa wizard definitivo.
- [ ] Não implementa PWA/histórico final.
- [ ] Não expõe token em console/log.
- [ ] Registra evidência de integração backend/banco.

## 8. Frontend final

Aplicar somente após backend MVP e contratos concluídos.

- [ ] Backend MVP está `CONCLUIDA`.
- [ ] Contratos públicos estão congelados/documentados.
- [ ] DTOs são validados com Zod ou equivalente.
- [ ] Estados loading/error/empty implementados.
- [ ] Responsividade validada.
- [ ] Acessibilidade básica validada.
- [ ] Reduced motion respeitado.
- [ ] Nenhum confidence score aparece para usuário comum.
- [ ] Testes/lint/typecheck/build executados.

## 9. Depois de implementar

- [ ] Rodei testes unitários relevantes.
- [ ] Rodei testes de integração quando API/banco/worker mudou.
- [ ] Rodei lint.
- [ ] Rodei typecheck.
- [ ] Rodei build quando aplicável.
- [ ] Rodei E2E se fluxo crítico mudou.
- [ ] Registrei comandos executados em `TEST_LOG.md`.
- [ ] Registrei comandos não executados e motivo.
- [ ] Atualizei documentação afetada.
- [ ] Atualizei `IMPLEMENTATION_LOG.md`.
- [ ] Atualizei `CHANGELOG.md` se comportamento mudou.
- [ ] Atualizei `DECISIONS.md` se decisão nova apareceu.
- [ ] Registrei pendências reais.

## 10. Critério para marcar `CONCLUIDA`

- [ ] Todos os itens aplicáveis deste checklist foram cumpridos.
- [ ] Não há falha crítica escondida.
- [ ] A etapa foi validada.
- [ ] Os logs possuem evidência.
- [ ] A próxima etapa está desbloqueada pela regra de progressão.

Se qualquer item obrigatório falhar, a etapa deve permanecer `EM_EXECUCAO` ou `BLOQUEADA`.
