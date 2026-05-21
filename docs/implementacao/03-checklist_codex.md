# Checklist Codex por tarefa

## Antes de codar

- [ ] Li `implementacao_IA`.
- [ ] Li o guia de implementação.
- [ ] Li o documento específico da área.
- [ ] Verifiquei logs existentes.
- [ ] Identifiquei se a tarefa é MVP ou futura.
- [ ] Identifiquei riscos de segurança.

## Durante a implementação

- [ ] Mantive escopo pequeno.
- [ ] Não inventei contrato novo sem registrar decisão.
- [ ] Separei DTO público de interno.
- [ ] Não coloquei processamento pesado na API.
- [ ] Não usei `shell=True`.
- [ ] Não salvei arquivo no banco.
- [ ] Não expus storage path.

## Depois de implementar

- [ ] Rodei testes unitários relevantes.
- [ ] Rodei lint/typecheck.
- [ ] Rodei build quando aplicável.
- [ ] Rodei e2e se fluxo crítico mudou.
- [ ] Verifiquei responsividade se UI mudou.
- [ ] Verifiquei acessibilidade se UI mudou.
- [ ] Verifiquei segurança se API/upload/download mudou.

## Documentação e logs

- [ ] Atualizei documento afetado.
- [ ] Atualizei `IMPLEMENTATION_LOG.md`.
- [ ] Atualizei `TEST_LOG.md`.
- [ ] Atualizei `CHANGELOG.md` se comportamento mudou.
- [ ] Atualizei `DECISIONS.md` se decisão nova apareceu.
- [ ] Registrei pendências reais.
