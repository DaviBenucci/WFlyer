# Política de logs e documentação

## Objetivo

Manter memória operacional do projeto para que o Codex não perca contexto entre sessões.

## Arquivos obrigatórios

```text
docs/logs/IMPLEMENTATION_LOG.md
docs/logs/TEST_LOG.md
docs/logs/DECISIONS.md
docs/logs/CHANGELOG.md
```

## IMPLEMENTATION_LOG.md

Registrar cada tarefa implementada:

```text
Data
Tarefa
Objetivo
Arquivos alterados
Resumo técnico
Riscos
Pendências
```

## TEST_LOG.md

Registrar:

```text
Data
Comandos executados
Resultado
Falhas encontradas
Correções aplicadas
Testes não executados e motivo
```

## DECISIONS.md

Registrar decisões novas:

```text
ID
Status
Contexto
Decisão
Consequências
Documentos afetados
```

Status:

```text
ACEITA
PENDENTE
REVOGADA
```

## CHANGELOG.md

Registrar mudanças de comportamento percebidas pelo usuário ou contrato técnico.

## Regra anti-alucinação

Quando a IA precisar decidir algo não documentado:

1. preferir opção conservadora;
2. registrar decisão como `PENDENTE`;
3. não espalhar a decisão como se fosse definitiva;
4. atualizar documentação se a decisão for aceita.
