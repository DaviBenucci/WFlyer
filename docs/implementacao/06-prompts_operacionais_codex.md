# Prompts operacionais para Codex

## Prompt para iniciar uma tarefa

```text
Leia primeiro:
- docs/implementacao/00-guia_de_implementacao.md
- docs/implementacao/01-implementacao_IA.md
- docs/logs/IMPLEMENTATION_LOG.md
- docs/logs/DECISIONS.md
- docs/logs/TEST_LOG.md

Depois implemente a tarefa: [DESCREVER TAREFA]

Regras:
- manter escopo pequeno;
- seguir documentação existente;
- não inventar contratos;
- criar/atualizar testes;
- rodar lint/typecheck/test/build aplicáveis;
- atualizar logs e documentação.
```

## Prompt para corrigir bug

```text
Investigue o bug: [DESCREVER BUG]

Antes de alterar código:
- identifique área afetada;
- leia docs correspondentes;
- reproduza o problema com teste quando possível.

Depois:
- corrija a menor causa real;
- rode testes de regressão;
- atualize TEST_LOG e IMPLEMENTATION_LOG;
- registre decisão se houver mudança de comportamento.
```

## Prompt para implementar endpoint

```text
Implemente o endpoint [ENDPOINT] seguindo docs/backend/03-endpoints-api.md.

Obrigatório:
- schema Pydantic;
- validação;
- erro público seguro;
- teste de sucesso;
- teste de erro;
- não expor campos internos;
- atualizar contratos se necessário.
```

## Prompt para implementar página

```text
Implemente a página [PÁGINA] seguindo docs/pages/[ARQUIVO].

Obrigatório:
- desktop e mobile;
- loading/error/empty;
- acessibilidade básica;
- reduced motion se houver animação;
- testes de renderização/interação;
- atualizar logs.
```
