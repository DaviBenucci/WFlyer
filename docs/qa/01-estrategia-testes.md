# Estratégia de testes

## Objetivo

Garantir que cada alteração feita pelo Codex seja validada contra regressões, efeitos colaterais, segurança e regras musicais.

## Pirâmide de testes

```text
unitários: muitos
integração: moderados
e2e: fluxo crítico
segurança: casos essenciais
testes musicais: obrigatórios para transposição
```

## Comandos obrigatórios por PR/tarefa

O Codex deve executar, conforme stack implementada:

```text
lint
typecheck
testes unitários
testes de integração afetados
testes e2e do fluxo alterado
build
```

Se algum comando ainda não existir, o Codex deve registrar em `docs/logs/IMPLEMENTATION_LOG.md` e criar tarefa no backlog.

## Cobertura mínima por área

### Frontend

- renderização das páginas;
- estados loading/error/empty;
- validações do wizard;
- acessibilidade básica;
- bottom navigation;
- histórico local.

### Backend

- endpoints principais;
- validação de upload;
- jobs/status;
- storage/download;
- segurança;
- workers.

### Musical

- cálculo do intervalo;
- transposição de notas;
- armadura;
- MusicXML parseável;
- renderização final.

## Regra anti-side-effect

Após alterar uma área, rodar pelo menos:

1. testes unitários da área alterada;
2. testes de contrato relacionados;
3. teste e2e do fluxo principal se tocar wizard, API, jobs ou downloads;
4. build completo antes de finalizar.

## Evidência

Todo resultado deve ser registrado em `docs/logs/TEST_LOG.md` com:

```text
data
escopo
comandos executados
resultado
falhas
correções
pendências
```
