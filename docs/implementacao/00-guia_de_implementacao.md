# Guia de implementação do WFlyer para Codex

## Objetivo

Este guia orienta a implementação do WFlyer do começo ao fim, mantendo a ideia principal do produto:

```text
Receber uma partitura em PDF, identificar/processar a partitura, aplicar a transposição entre instrumento de origem e instrumento de destino, gerar artefatos finais e disponibilizar download seguro.
```

O foco deste guia é impedir implementação fora de ordem, reduzir alucinação técnica, forçar validação por etapa e manter a documentação como fonte de verdade.

## Regra rígida de progressão

**O Codex somente pode iniciar a próxima etapa quando a etapa anterior estiver marcada como `CONCLUIDA` (status técnico sem acento).**

Esta regra é obrigatória e não possui exceção operacional. A única ação permitida quando uma etapa falhar é criar uma sub-etapa de correção dentro da etapa atual.

### Estados permitidos por etapa

```text
PENDENTE     — a etapa ainda não começou.
EM_EXECUCAO  — a etapa está sendo implementada.
BLOQUEADA    — a etapa não pode avançar por erro, lacuna técnica, falta de comando ou decisão pendente.
CONCLUIDA    — a etapa foi implementada, validada, documentada e registrada em log.
```

### Regra de bloqueio

Uma etapa só pode mudar para `CONCLUIDA` quando todos os itens abaixo forem verdadeiros:

- código ou documentação da etapa foi implementado no local correto;
- validações obrigatórias da própria etapa foram executadas;
- falhas encontradas foram corrigidas ou registradas como impedimento real;
- documentação impactada foi atualizada;
- `docs/logs/IMPLEMENTATION_LOG.md` foi atualizado;
- `docs/logs/TEST_LOG.md` foi atualizado;
- `docs/logs/DECISIONS.md` foi atualizado quando houve decisão nova;
- nenhum secret real, path interno sensível, stacktrace público ou token permanente foi exposto;
- nenhum contrato público foi alterado sem documentação correspondente.

### Regra de imprevisto

Se houver erro, inconsistência, dependência ausente, falha de teste, incompatibilidade entre bibliotecas, lacuna de documentação ou qualquer imprevisto semelhante, o Codex deve:

1. manter a etapa atual como `EM_EXECUCAO` ou `BLOQUEADA`;
2. criar uma sub-etapa dentro da etapa atual no formato `Etapa X.Y.A — Correção de <problema>`;
3. documentar causa, arquivos afetados, correção proposta, testes executados e resultado;
4. concluir a sub-etapa antes de tentar concluir a etapa principal;
5. somente avançar para a próxima etapa quando a etapa principal estiver `CONCLUIDA`.

Exemplo:

```text
Fase 4 — Backend base
Etapa 4.6 — Configurar sessão de banco
Status: BLOQUEADA

Sub-etapa 4.6.A — Corrigir erro de conexão assíncrona do SQLAlchemy
Status: CONCLUIDA
Evidência: pytest de conexão passou; health detalhado retornou dependência db=ok.

Etapa 4.6
Status: CONCLUIDA
```

## Ordem mandatória de implementação

O WFlyer deve ser implementado nesta ordem:

```text
1. Documentação, escopo e governança da implementação.
2. Estrutura do repositório e padrões técnicos.
3. Infra local: Docker Compose, Postgres, Redis e storage.
4. Banco de dados e migrations.
5. Backend base.
6. Backend de instrumentos, uploads, jobs, workers, storage e pipeline musical.
7. Frontend mínimo apenas para validar backend/banco.
8. Segurança, testes e observabilidade do backend.
9. Frontend definitivo com design system e telas finais.
10. Integração ponta a ponta.
11. QA, hardening, documentação final e empacotamento.
```

A interface final do usuário **não pode** ser construída antes da conclusão do backend MVP. Antes disso, é permitido apenas um frontend simples de verificação, sem polimento visual, com a finalidade de provar que banco, API, storage, fila e worker funcionam.

## Documentos que o Codex deve ler antes de qualquer código

```text
README.md
docs/implementacao/00-guia_de_implementacao.md
docs/implementacao/01-implementacao_IA.md
docs/implementacao/02-backlog_executavel.md
docs/implementacao/03-checklist_codex.md
docs/implementacao/05-definition_of_done.md
docs/00-visao-geral/01-decisoes-arquiteturais.md
docs/00-visao-geral/04-stack-recomendada.md
docs/backend/01-visao-geral.md
docs/backend/15-guia_detalhado_backend.md
docs/frontend/09-guia_detalhado_frontend.md
docs/security/02-checklist-seguranca.md
docs/qa/01-estrategia-testes.md
docs/logs/IMPLEMENTATION_LOG.md
docs/logs/TEST_LOG.md
docs/logs/DECISIONS.md
```

## Template obrigatório de registro por etapa

Ao iniciar qualquer etapa, o Codex deve registrar o bloco abaixo em `docs/logs/IMPLEMENTATION_LOG.md` e mantê-lo atualizado:

```text
## Fase X — <titulo da fase>
### Etapa X.Y — <titulo da etapa>

Status: EM_EXECUCAO
Objetivo:
Arquivos/documentos lidos:
Arquivos alterados:
Resumo técnico:
Validações planejadas:
Validações executadas:
Resultado:
Sub-etapas criadas por imprevisto:
Pendências:
Status final: CONCLUIDA | BLOQUEADA
```

Em `docs/logs/TEST_LOG.md`, registrar:

```text
## Fase X / Etapa X.Y — <escopo>

Comandos executados:
- <comando>

Resultado:
Falhas encontradas:
Correções aplicadas:
Testes não executados e motivo:
Evidência para liberar próxima etapa:
```

## Definição de frontend simples de verificação

O frontend simples de verificação é uma UI temporária e técnica. Ele existe apenas para testar a integração real com o backend.

Ele pode conter:

- página `/debug/health` para exibir `/health`;
- página `/debug/instruments` para listar instrumentos vindos do banco;
- página `/debug/upload` para enviar PDF de teste;
- página `/debug/jobs` para consultar status de job;
- página `/debug/artifacts` para testar download temporário;
- logs visuais mínimos de erro público seguro.

Ele não deve conter:

- design final;
- animações;
- wizard definitivo;
- histórico local definitivo;
- compartilhamento;
- login;
- admin completo;
- componentes visuais finais fora do necessário para teste.

## Definição de backend MVP concluído

O backend MVP só pode ser considerado concluído quando:

- migrations foram criadas e aplicadas;
- seed de instrumentos existe;
- API de instrumentos funciona com dados do banco;
- upload seguro valida PDF e grava arquivo no storage;
- job é criado no banco;
- job é enfileirado;
- worker consome job;
- pipeline mínimo gera ao menos um artefato controlado ou simulado de forma explícita;
- status do job reflete a execução;
- eventos do job são persistidos;
- download usa token temporário ou URL assinada;
- limpeza por expiração de 15 dias está implementada ou documentada como scheduler executável;
- testes de API, banco, upload, job, worker e segurança básica passam;
- logs estruturados e correlation ID existem;
- documentação e logs foram atualizados.

## Padrão de validação por etapa

Para cada etapa abaixo, aplicar este padrão:

```text
Status inicial: PENDENTE
Ao iniciar: EM_EXECUCAO
Ao falhar: BLOQUEADA ou EM_EXECUCAO com sub-etapa de correção
Ao validar tudo: CONCLUIDA
Gate: não iniciar a próxima etapa enquanto esta não estiver CONCLUIDA
```

---

## Fase 0 — Travamento de escopo, leitura e governança

**Objetivo da fase:** Garantir que o Codex entenda o produto antes de alterar qualquer arquivo.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 0.1 — Confirmar ideia central do WFlyer

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar que o MVP é upload de PDF, seleção de instrumento de origem, seleção de instrumento de destino, processamento assíncrono, resultado e download.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir README, decisões arquiteturais e docs de features; registrar no log que o escopo foi entendido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.2 — Classificar funcionalidades MVP e futuras

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Separar MVP sem login de itens futuros como dashboard, admin, biblioteca, compartilhamento público e push notifications.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar ou atualizar checklist de escopo; confirmar que itens futuros não entram no MVP sem decisão explícita.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.3 — Ler documentos obrigatórios

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Ler os documentos listados no início deste guia antes de propor qualquer estrutura de código.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar em `IMPLEMENTATION_LOG.md` a lista de documentos lidos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.4 — Identificar conflitos de documentação

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Comparar guia, decisões arquiteturais, backend, frontend, segurança e QA para detectar divergências.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar conflitos em `DECISIONS.md` como decisão aceita ou pendência.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.5 — Definir ordem local de execução

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Quebrar a implementação atual em etapas pequenas de acordo com este guia.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar entrada de execução com status por fase e etapa.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.6 — Definir comandos de validação disponíveis

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Mapear comandos esperados de lint, format, typecheck, testes, build, migrations e Docker.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Se comandos ainda não existirem, registrar como pendência da fase de fundação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.7 — Criar política de não avanço

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar ao log que nenhuma etapa seguinte será iniciada antes da anterior estar concluída.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Verificar que o texto de gate foi copiado para o log de implementação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 0.8 — Registrar riscos iniciais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Listar riscos de PDF malicioso, processamento pesado, storage, filas, tokens e exposição de dados internos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Atualizar documentos de segurança se houver risco novo.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 1 — Estrutura do repositório e padrões técnicos

**Objetivo da fase:** Criar a base do projeto sem implementar regra de negócio ainda.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 1.1 — Criar estrutura raiz do projeto

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar organização recomendada, preferencialmente `apps/api`, `apps/web`, `packages` quando necessário, `infra`, `scripts` e `docs`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Listar árvore final e conferir que documentação existente foi preservada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.2 — Definir gerenciadores e versões

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Fixar Python 3.12+, Node LTS, pnpm/npm conforme escolha, e registrar versões em arquivos apropriados.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar comandos de versão e registrar em `TEST_LOG.md`.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.3 — Configurar `.gitignore` seguro

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Ignorar `.env`, storage local, caches, artefatos temporários, uploads, bancos locais e diretórios de build.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar teste manual de ausência de secrets e arquivos temporários no controle de versão.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.4 — Criar `.env.example` sem secrets reais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Documentar variáveis de API, banco, Redis, storage, CORS, rate limit, retenção e URLs locais.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir que nenhum valor é secret real; usar placeholders explícitos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.5 — Configurar lint e format backend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar Ruff/Black ou ferramenta equivalente para Python.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar comando de lint/format quando existir; registrar falhas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.6 — Configurar typecheck backend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar mypy/pyright quando aplicável, sem bloquear indevidamente o início do projeto.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar typecheck ou registrar comando ausente como pendência controlada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.7 — Configurar lint e format frontend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar ESLint, Prettier e regras TypeScript/React.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar lint/format quando existir.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.8 — Configurar typecheck frontend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar `tsc --noEmit` ou comando equivalente.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar typecheck ou registrar ausência.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.9 — Configurar testes base

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar estrutura mínima para pytest no backend e testes frontend quando o app web existir.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar teste trivial apenas para validar runner, sem simular regra de negócio falsa.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.10 — Criar README técnico de execução local

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Documentar como subir infra, API, worker e frontend.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar comandos documentados localmente quando a infra existir.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.11 — Criar scripts utilitários seguros

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar scripts sem `shell=True` e sem acoplar secrets.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Revisar scripts para comandos perigosos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 1.12 — Atualizar logs da fase

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar arquivos criados, comandos executados e pendências reais.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Somente avançar com todos os itens essenciais concluídos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 2 — Infra local, containers e configuração

**Objetivo da fase:** Subir dependências locais necessárias antes de modelar o banco.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 2.1 — Criar Docker Compose inicial

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir serviços para Postgres, Redis, MinIO ou storage local equivalente, API e worker quando aplicável.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar validação de sintaxe do Compose e documentar comando de subida.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.2 — Configurar Postgres local

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir database, usuário local, senha local não real, volume e healthcheck.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir que o serviço fica saudável.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.3 — Configurar Redis local

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir Redis para fila/cache com healthcheck simples.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir conectividade a partir da API quando a API existir.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.4 — Configurar storage local/MinIO

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir bucket de desenvolvimento para uploads, artefatos e temporários.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar criação de bucket por script idempotente ou documentação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.5 — Configurar rede entre serviços

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir que API, worker, Postgres, Redis e storage se resolvam por nome de serviço.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar variáveis de conexão no `.env.example`.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.6 — Configurar limites básicos de containers

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir limites ou observações para CPU/memória, principalmente para worker e ferramentas de PDF.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar decisão se limites não forem aplicados no Compose inicial.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.7 — Criar healthchecks de infraestrutura

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar comandos de verificação para banco, Redis e storage.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar evidência de health no log.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.8 — Definir política de volumes locais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Separar dados persistentes de arquivos temporários; impedir commit de volumes.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir `.gitignore` e documentação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 2.9 — Documentar reset local seguro

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar instrução para derrubar volumes locais sem afetar produção.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar que o comando é claramente marcado como destrutivo local.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 3 — Banco de dados primeiro

**Objetivo da fase:** Construir a modelagem antes dos endpoints e do frontend final.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 3.1 — Inicializar camada de banco

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Configurar SQLAlchemy 2.0, engine, sessão, base declarativa e dependência de sessão da API.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar teste de conexão com banco.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.2 — Inicializar Alembic

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar configuração de migrations integrada aos modelos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar migration vazia ou inicial sem erro.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.3 — Criar tabela `instruments`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Modelar instrumentos com id, nome, família, transposição escrita para som real, aliases, descrição e suporte.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar migration e teste de schema.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.4 — Criar seed de instrumentos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Popular instrumentos base como piano, flauta, violino, trompete Bb, clarinete Bb, sax alto Eb e outros úteis.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar seed idempotente e validar contagem no banco.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.5 — Criar tabela `uploaded_files`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Modelar metadados de upload: id, nome original, MIME detectado, tamanho, hash, storage key, status e expiração.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação e consulta sem armazenar binário no banco.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.6 — Criar tabela `processing_jobs`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Modelar job com status, progresso, instrumento origem, destino, intervalo, sessão anônima, token hash, expiração e timestamps.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação de job com FK de upload e instrumentos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.7 — Criar tabela `job_events`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar histórico de status e mensagens públicas/internas separadas.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar ordenação cronológica e relação com job.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.8 — Criar tabela `generated_artifacts`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar artefatos finais e intermediários autorizados: PDF final, MusicXML final, preview e relatórios internos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Garantir que path interno não seja exposto por DTO público.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.9 — Criar tabela `admin_processing_metrics`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Guardar métricas internas como confiança OMR, duração, símbolos não reconhecidos e versão de engine.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Garantir que a tabela não alimente DTO público comum.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.10 — Criar enums ou constraints de status

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir status aceitos para upload, job, evento e artefato.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar rejeição de status inválido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.11 — Criar índices necessários

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar índices para job status, expiração, sessão anônima, created_at e artifact job_id.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar criação via migration.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.12 — Criar política de expiração no modelo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir `expires_at` padrão de 15 dias para uploads, jobs e artefatos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar cálculo de expiração em UTC.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.13 — Criar testes de migrations

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Testar upgrade e, quando possível, downgrade em ambiente local.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar comando e resultado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 3.14 — Atualizar documentação de modelagem

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar `docs/backend/04-modelagem-banco.md` se qualquer campo mudar.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Somente concluir com documentação alinhada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 4 — Backend base e contratos internos

**Objetivo da fase:** Criar API mínima robusta antes das regras específicas.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 4.1 — Criar aplicação FastAPI

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Estruturar app, routers, configurações, dependências e ciclo de vida.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar teste de importação e health básico.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.2 — Configurar Pydantic Settings

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Ler variáveis de ambiente com validação e defaults seguros para desenvolvimento.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar falha clara quando variável obrigatória faltar.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.3 — Criar endpoint `/health`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Retornar status da API sem expor segredos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar HTTP 200 e payload esperado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.4 — Criar endpoint `/health/dependencies` interno

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Verificar banco, Redis e storage de forma segura para desenvolvimento/admin.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não expor secrets nem stacktrace.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.5 — Configurar CORS restritivo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Permitir apenas origens configuradas; evitar wildcard em produção.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar headers em ambiente local.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.6 — Configurar middleware de correlation ID

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Gerar ou propagar ID por request e incluir em logs e erros.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar presença em resposta e log.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.7 — Configurar erro padrão

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar `ErrorDTO` com `code`, `message` e `correlation_id`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar erro 404/422 sem stacktrace.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.8 — Configurar logs estruturados

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Padronizar logs JSON ou formato estruturado com nível, serviço, request_id e evento.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Gerar log de request e verificar ausência de dados sensíveis.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.9 — Configurar dependência de sessão de banco

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir abertura/fechamento correto da sessão por request.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar query simples.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.10 — Criar separação de DTO público e interno

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir schemas públicos sem campos internos/admin.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar serialização de DTO público.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.11 — Criar estrutura de módulos backend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Separar `config`, `db`, `instruments`, `uploads`, `jobs`, `storage`, `workers`, `music`, `artifacts`, `security`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir imports sem ciclos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 4.12 — Criar testes base de API

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Configurar TestClient/AsyncClient e fixtures de banco.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar teste de health e erro padrão.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 5 — Backend de instrumentos e regras de transposição

**Objetivo da fase:** Implementar dados musicais estáveis antes de upload e jobs.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 5.1 — Implementar repositório de instrumentos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar camada de consulta ao banco sem acoplar diretamente ao router.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar busca por id e lista.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.2 — Implementar `GET /api/instruments`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Retornar instrumentos suportados com aliases e transposição escrita para som real.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar schema público e ordenação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.3 — Implementar `GET /api/instruments/{id}`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Retornar instrumento específico ou erro público seguro.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar 200 e 404.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.4 — Implementar cálculo de intervalo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Calcular `intervalo = source_written_to_concert - target_written_to_concert` em semitons.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar Piano C para Trompete Bb resultando em +2.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.5 — Criar validação de instrumentos suportados

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Bloquear instrumentos não suportados no MVP sem quebrar seed futura.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar erro público.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.6 — Criar serviço de tonalidade alvo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar função para estimar tonalidade escrita resultante quando tonalidade origem estiver disponível.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar casos simples sem depender de OMR real.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.7 — Documentar regra musical

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar docs de feature de cálculo de transposição se houver ajuste.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir exemplo principal do README.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 5.8 — Criar testes musicais unitários

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar testes para intervalos C, Bb, Eb, F e instrumentos sem transposição.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 6 — Upload seguro, storage e retenção

**Objetivo da fase:** Receber PDFs com segurança antes de criar jobs reais.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 6.1 — Criar serviço de storage

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Abstrair operações `put`, `get_signed_url`, `delete`, `exists` e metadados.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar com MinIO/local sem expor path interno.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.2 — Criar política de chaves UUID

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Gerar storage keys independentes do nome original.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar que nome malicioso não aparece na key.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.3 — Implementar validação de tamanho

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Bloquear arquivos acima do limite configurado.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar limite válido e inválido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.4 — Implementar validação real de PDF

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Conferir assinatura, MIME detectado e regras mínimas de PDF; não confiar no header do browser.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar arquivo renomeado `.pdf` que não é PDF.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.5 — Bloquear PDF criptografado se não suportado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Detectar criptografia ou registrar limitação conservadora.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar PDF criptografado quando fixture existir.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.6 — Sanitizar nome original

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Guardar nome original sanitizado para exibição, sem usar como path.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar path traversal e caracteres problemáticos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.7 — Calcular hash do arquivo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Salvar hash para auditoria e deduplicação futura sem expor ao usuário comum.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar persistência do hash.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.8 — Implementar `POST /api/uploads`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Receber multipart, validar, salvar no storage e registrar `uploaded_files`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar sucesso e erros seguros.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.9 — Criar status de upload

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Usar status como `uploaded`, `rejected`, `expired` conforme modelo.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar transições básicas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.10 — Implementar limpeza de arquivo rejeitado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Remover arquivo do storage se upload falhar após gravação parcial.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar rollback ou compensação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 6.11 — Documentar políticas de upload

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar docs de segurança e storage se limites forem definidos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Concluir somente com docs alinhadas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 7 — Jobs, fila e lifecycle de processamento

**Objetivo da fase:** Criar execução assíncrona sem pipeline musical completo ainda.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 7.1 — Implementar serviço de criação de job

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar job a partir de upload e instrumentos validados.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação com status `queued`.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.2 — Gerar token temporário seguro

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar token de download/consulta e armazenar apenas hash quando aplicável.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar que token em claro não aparece em logs.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.3 — Implementar `POST /api/transpositions`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar job, calcular intervalo e enfileirar processamento.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar payload válido e inválido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.4 — Implementar produtor de fila

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Publicar mensagem com job_id e metadados mínimos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar publicação no Redis/Celery broker.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.5 — Implementar status públicos de job

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar `GET /api/jobs/{job_id}` e/ou `/status` com DTO público.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar que campos internos não aparecem.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.6 — Implementar validação de acesso anônimo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Exigir token temporário ou sessão anônima para consultar job sensível.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar token inválido e ausente.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.7 — Criar registro de eventos de job

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Persistir eventos como queued, validating, transposing, rendering, completed e failed.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar evento inicial e atualização.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.8 — Criar tratamento de falha pública

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Separar `internal_error_message` de `public_error_message`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar falha sem stacktrace público.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.9 — Criar cancelamento/expiração básico

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar status `cancelled` e `expired` ainda que UI final venha depois.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar endpoint DELETE se implementado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 7.10 — Atualizar contratos API

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar docs de endpoints e contratos frontend quando DTO mudar.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar consistência entre backend e frontend docs.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 8 — Worker e processamento assíncrono controlado

**Objetivo da fase:** Criar worker real antes do pipeline musical completo.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 8.1 — Criar aplicação do worker

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Configurar Celery/RQ/Dramatiq conforme decisão e conectar ao broker.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar worker local e registrar inicialização.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.2 — Criar tarefa `process_transposition_job`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Consumir job_id, buscar dados no banco e atualizar status.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar execução com job fake.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.3 — Configurar retries controlados

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir tentativas, backoff e erros não retentáveis.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar falha simulada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.4 — Configurar timeouts por etapa

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir limite para validação, OMR, transposição, renderização e upload de artefatos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar limites em documentação.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.5 — Impedir subprocess inseguro

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir que subprocessos futuros usem lista de argumentos e `shell=False`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar teste ou revisão documentada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.6 — Isolar diretório temporário por job

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar workspace temporário por UUID e limpar ao final.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar limpeza em sucesso e falha.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.7 — Persistir progresso do worker

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar `progress` e `current_step` no banco.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar sequência de status.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.8 — Persistir eventos técnicos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar eventos internos sem vazar para DTO público.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar evento de erro interno.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.9 — Criar worker simulado controlado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Antes do OMR real, gerar artefato de teste explicitamente marcado como mock técnico quando necessário.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não apresentar mock como pipeline musical final.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 8.10 — Documentar execução do worker

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar docs de filas/workers com comandos e limites.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Somente concluir com worker reproduzível localmente.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 9 — Pipeline musical backend

**Objetivo da fase:** Implementar o núcleo musical de forma incremental e testável.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 9.1 — Definir fixtures musicais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar arquivos de teste pequenos e controlados para MusicXML/PDF quando disponíveis.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar origem e finalidade dos fixtures.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.2 — Implementar leitura MusicXML

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Ler MusicXML com biblioteca escolhida e extrair estrutura mínima.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar MusicXML simples.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.3 — Implementar transposição com music21

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Aplicar intervalo de semitons em notas, acordes e armadura quando suportado.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar intervalos positivos e negativos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.4 — Validar armadura e acidentes

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir alteração coerente de tonalidade escrita e acidentes locais.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar testes musicais de tonalidade.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.5 — Implementar saída MusicXML final

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Salvar MusicXML final em storage como artefato.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação e metadados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.6 — Integrar OMR ou caminho controlado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Integrar Audiveris ou definir caminho intermediário documentado para MVP técnico.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar limitações explícitas se OMR real não estiver completo.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.7 — Integrar MuseScore CLI

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Renderizar PDF final a partir do MusicXML final.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar subprocess sem shell e timeout.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.8 — Criar validações de qualidade musical

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Calcular avisos objetivos sem exibir confidence score ao usuário comum.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar warnings públicos seguros.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.9 — Criar métricas admin internas

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Persistir confiança, duração, contagens e versão de engine apenas para admin.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar que DTO público não contém métricas internas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.10 — Atualizar pipeline do worker

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Substituir mock técnico por pipeline real quando os testes passarem.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Marcar etapa concluída somente com artefato real ou limitação formal documentada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.11 — Criar testes musicais de regressão

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Testar pelo menos casos C->Bb, C->Eb, instrumento sem transposição e erro de arquivo inválido.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar resultados no log.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 9.12 — Documentar limitações musicais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar docs se o MVP não suportar algum tipo de partitura.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não ocultar limitação crítica.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 10 — Artefatos, downloads e retenção

**Objetivo da fase:** Fechar fluxo backend de resultado e expiração.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 10.1 — Implementar registro de artefatos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Persistir PDF final, MusicXML final e previews quando gerados.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar relação artefato-job.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.2 — Implementar endpoint de artefatos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar `GET /api/jobs/{job_id}/artifacts` com DTO público seguro.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar autorização por token/sessão.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.3 — Implementar download temporário

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar endpoint que retorna URL assinada ou stream seguro temporário.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar expiração e token inválido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.4 — Impedir exposição de storage path

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir que nenhuma resposta pública contenha bucket, key interna ou path local.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar teste de DTO público.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.5 — Implementar expiração lógica

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Jobs e artefatos expirados não devem permitir download normal.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar job expirado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.6 — Implementar scheduler de cleanup

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar comando/tarefa para apagar arquivos expirados e marcar registros.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar dry-run e execução local.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.7 — Registrar evento de cleanup

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Persistir evento ou log auditável de remoção.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar log sem dados sensíveis.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.8 — Criar documentação de retenção

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Atualizar `docs/backend/06-storage-e-retencao.md` e segurança.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir regra de 15 dias.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 10.9 — Criar testes de fluxo completo backend

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Upload -> job -> worker -> artefato -> download.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Somente concluir com fluxo backend reprodutível.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 11 — Frontend simples de verificação do backend

**Objetivo da fase:** Criar UI temporária para provar que backend e banco funcionam, sem iniciar frontend final.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 11.1 — Criar app web mínimo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Inicializar Next.js/React/TypeScript apenas se ainda não existir.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar build mínimo.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.2 — Criar cliente HTTP técnico

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Configurar base URL da API e tratamento de erro padrão.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar chamada `/health`.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.3 — Criar página `/debug/health`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Exibir status da API e dependências permitidas.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar resposta real.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.4 — Criar página `/debug/instruments`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Listar instrumentos vindos do banco via API.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir dados do seed.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.5 — Criar página `/debug/upload`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Enviar PDF de teste para `POST /api/uploads`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar sucesso e erro de arquivo inválido.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.6 — Criar página `/debug/transposition`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Criar job com upload e instrumentos selecionados.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação de job real.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.7 — Criar página `/debug/jobs`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Consultar status por job_id e token quando aplicável.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar polling simples.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.8 — Criar página `/debug/artifacts`

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Listar e baixar artefatos de teste com token temporário.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar download e erro de expiração/token.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.9 — Bloquear evolução visual indevida

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Não implementar design final, animações ou wizard definitivo nesta fase.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Revisar arquivos alterados para garantir escopo técnico.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 11.10 — Registrar resultados de integração

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Documentar o que foi comprovado no backend e o que ainda falta.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Somente avançar quando o frontend de verificação provar o backend.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 12 — Hardening backend, segurança e observabilidade

**Objetivo da fase:** Concluir backend MVP antes do frontend final.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 12.1 — Aplicar rate limiting

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Proteger upload, criação de job, status e download contra abuso.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar limite básico.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.2 — Revisar CORS por ambiente

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir origens explícitas em desenvolvimento e produção.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar headers.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.3 — Aplicar headers de segurança

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar headers apropriados na API ou proxy.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar presença sem quebrar CORS.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.4 — Revisar logs sensíveis

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir que tokens, paths, nomes sensíveis e stacktraces não vazem.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar teste ou checklist documentado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.5 — Revisar permissões de worker

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Worker deve rodar sem privilégio e com diretórios restritos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Documentar limitações se ambiente local não aplicar tudo.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.6 — Adicionar testes de segurança de upload

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Cobrir MIME falso, tamanho excedido, path traversal, PDF inválido e arquivo vazio.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.7 — Adicionar testes de segurança de download

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Cobrir token ausente, inválido, expirado e artefato inexistente.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.8 — Adicionar testes de DTO público

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir ausência de confidence score, storage key, worker id e stacktrace.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar testes.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.9 — Adicionar métricas e logs operacionais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Instrumentar duração de job, status, falhas e filas sem expor dados pessoais.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar logs.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.10 — Revisar migrations e seeds

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Executar banco do zero, aplicar migrations e seeds.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar evidência.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 12.11 — Executar suíte backend completa

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Rodar pytest, lint, typecheck e migrations.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- A fase só conclui com backend MVP aprovado ou pendência não crítica documentada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 13 — Congelamento de contratos para frontend final

**Objetivo da fase:** Evitar que o frontend final seja construído sobre contratos instáveis.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 13.1 — Revisar DTOs públicos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Conferir InstrumentDTO, UploadDTO, PublicJobDTO, ArtifactDTO e ErrorDTO.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Atualizar docs frontend/backend.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.2 — Gerar schemas compartilháveis

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Quando possível, expor OpenAPI e/ou tipos derivados para o frontend.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar que tipos não incluem campos internos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.3 — Definir política de polling

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Fixar intervalos e parada em status final.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Atualizar docs de contrato frontend.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.4 — Definir mensagens públicas

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Mapear erros públicos seguros para upload, job, download e expiração.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar ausência de mensagens técnicas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.5 — Definir estados de UI por status

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Mapear queued, validating, transposing, rendering, completed, failed, expired e cancelled.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Documentar no frontend.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.6 — Validar contratos com frontend debug

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir que debug pages usam os mesmos contratos do frontend final.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Corrigir divergências antes de iniciar UI final.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 13.7 — Registrar contrato congelado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar decisão ou log informando que o frontend final pode começar.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Status da fase deve ser CONCLUIDA.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 14 — Frontend definitivo: fundação visual

**Objetivo da fase:** Construir a base visual somente após backend MVP e contratos concluídos.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 14.1 — Configurar stack frontend final

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Next.js, TypeScript, Tailwind, shadcn/ui, TanStack Query, Zod e ferramentas definidas.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar lint, typecheck e build.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.2 — Implementar tokens do design system

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Cores, gradientes, tipografia, radius, sombras, espaçamento e dark/light mode.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar contraste e consistência.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.3 — Implementar componentes base

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Button, Card, Input, Select/Combobox, Badge, Progress, Toast, Dialog, Tabs, Skeleton e Alert.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Criar testes ou exemplos mínimos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.4 — Implementar AppShell

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Base comum com área de conteúdo e suporte a desktop/mobile.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar layout sem sobreposição.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.5 — Implementar DesktopSidebar

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Sidebar recolhida/expandida, foco visível e item ativo.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar teclado e mouse.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.6 — Implementar MobileBottomNav

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Bottom nav com safe-area, trilho ativo e padding inferior correto.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar viewport mobile.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.7 — Implementar PageContainer

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Padronizar largura, padding, header, breadcrumbs futuros e estados globais.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar em páginas vazias.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.8 — Implementar reduced motion

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Respeitar `prefers-reduced-motion` e permitir animações discretas.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar classe/configuração.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.9 — Configurar TanStack Query

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Definir client, retries seguros, cache e tratamento de erro.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar query de instrumentos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 14.10 — Configurar validação Zod

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Validar DTOs recebidos da API.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar falha de schema.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 15 — Frontend definitivo: páginas e navegação

**Objetivo da fase:** Implementar telas do produto sem quebrar contratos.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 15.1 — Implementar Home

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Apresentar proposta do WFlyer, CTA para transpor e explicação curta.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar desktop/mobile.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.2 — Implementar Como Funciona

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Explicar upload, processamento, transposição e download sem expor complexidade interna.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar copy segura.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.3 — Implementar Instrumentos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Listar instrumentos da API, famílias, aliases e suporte.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar loading/error/empty.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.4 — Implementar Configurações locais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Permitir preferências locais sem backend de usuário.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar persistência local.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.5 — Implementar Histórico local vazio

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Preparar estado vazio e estrutura para IndexedDB futura.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar sem login.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.6 — Implementar Resultado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Exibir status, origem, destino, transposição aplicada e downloads quando disponíveis.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não exibir confidence score.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.7 — Implementar Compartilhados futuro como placeholder

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Manter fora do MVP real se não houver backend de compartilhamento.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Marcar como futuro com copy clara.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.8 — Implementar Dashboard/Admin futuro como bloqueado

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Não criar funcionalidade real sem autenticação e autorização.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Documentar como fora do MVP.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 15.9 — Validar navegação completa

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir rotas, foco, active states e responsividade.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar testes frontend.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 16 — Frontend definitivo: wizard de transposição integrado

**Objetivo da fase:** Implementar o fluxo principal do usuário com backend real.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 16.1 — Criar estrutura do TranspositionWizard

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Separar etapas Upload, Origem, Destino, Revisão, Processamento e Resultado.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar avanço e retrocesso.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.2 — Implementar FileDropzone

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Validar extensão/tamanho no cliente sem confiar nessa validação como segurança final.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar drag/drop e input.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.3 — Integrar upload real

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Enviar PDF para backend e tratar ErrorDTO público.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar sucesso e erro.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.4 — Implementar seleção de origem

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Buscar instrumentos da API e permitir pesquisa/filtro.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar instrumento suportado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.5 — Implementar seleção de destino

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Aplicar regras de instrumentos suportados e impedir origem/destino inválidos.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar combinações.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.6 — Implementar revisão

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Exibir resumo com nome do arquivo, origem, destino e intervalo calculado quando disponível.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar copy.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.7 — Criar job real

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Chamar `POST /api/transpositions` e armazenar job_id/token de forma segura no cliente.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não logar token.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.8 — Implementar polling

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Consultar status até completed/failed/expired/cancelled conforme política.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar parada do polling.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.9 — Implementar tela de processamento

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Mostrar progresso, etapa atual e mensagens seguras.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não expor detalhes internos.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.10 — Implementar resultado/download

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Listar artefatos e acionar download temporário.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar token inválido e expirado.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.11 — Persistir histórico local mínimo

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Salvar metadados não sensíveis em IndexedDB/local storage conforme docs.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Não salvar PDF local sem decisão explícita.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 16.12 — Criar tratamento de erro UX

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Mostrar erros claros para PDF inválido, falha de processamento e expiração.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar estados de erro.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 17 — PWA, histórico local e refinamento de experiência

**Objetivo da fase:** Polir a aplicação sem adicionar funcionalidades futuras indevidas.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 17.1 — Configurar PWA básica

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Adicionar manifest e service worker quando decidido.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar instalação local se aplicável.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.2 — Implementar IndexedDB com Dexie

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Guardar histórico local de jobs e preferências não sensíveis.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar criação, leitura e limpeza.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.3 — Implementar estado offline

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Avisar quando a API não estiver acessível.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar desconexão simulada.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.4 — Implementar limpeza local

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Permitir apagar histórico local.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar remoção.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.5 — Refinar acessibilidade

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Revisar labels, foco, contraste, navegação por teclado e mensagens de status.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Executar checklist de acessibilidade.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.6 — Refinar responsividade

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Validar mobile, tablet, desktop e safe-area.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar evidências.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.7 — Refinar animações musicais

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Aplicar microinterações discretas respeitando reduced motion.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Testar preferências de movimento.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 17.8 — Revisar conteúdo textual

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Garantir linguagem clara, sem termos técnicos desnecessários para usuário comum.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Validar mensagens de erro.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Fase 18 — QA final, segurança, documentação e entrega

**Objetivo da fase:** Finalizar o projeto com testes e documentação coerentes.

**Gate da fase:** todas as etapas abaixo devem estar `CONCLUIDA` antes de iniciar a fase seguinte.

### Etapa 18.1 — Executar testes backend completos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Rodar pytest, testes de integração, segurança e migrations.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar comandos e resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.2 — Executar testes frontend completos

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Rodar lint, typecheck, testes e build.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar comandos e resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.3 — Executar testes E2E

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Validar fluxo upload -> job -> processamento -> resultado -> download.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar ambiente e evidência.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.4 — Executar regressão musical

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Validar casos de transposição definidos em `docs/qa/05-testes-musicais.md`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar resultados.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.5 — Executar checklist de segurança

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Conferir upload, storage, tokens, CORS, headers, logs, DTOs e workers.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Atualizar `docs/security/02-checklist-seguranca.md`.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.6 — Executar revisão de documentação

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Conferir README, guias backend/frontend, endpoints, modelagem, QA e logs.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Corrigir divergências.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.7 — Atualizar changelog

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Registrar comportamento novo, mudanças de contrato e limitações conhecidas.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir data e escopo.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.8 — Gerar manifesto de validação

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Resumir status das fases, testes executados e pendências.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Manter pendências explícitas.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.9 — Preparar empacotamento

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Remover caches, uploads locais, secrets e artefatos temporários.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Conferir `.gitignore` e pacote final.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

### Etapa 18.10 — Marcar projeto como finalizado para MVP

**Status:** `PENDENTE` → `EM_EXECUCAO` → `CONCLUIDA`.

**O Codex deve fazer:**

- Somente se todas as fases anteriores estiverem `CONCLUIDA`.

- Alterar apenas os arquivos necessários para esta etapa.

- Registrar qualquer decisão nova antes de depender dela em código.

**Validação obrigatória:**

- Registrar conclusão final no log.

- Atualizar `IMPLEMENTATION_LOG.md` e `TEST_LOG.md` com evidências.

**Gate de saída:** esta etapa só pode ser marcada como `CONCLUIDA` quando a validação obrigatória passar ou quando uma limitação não crítica estiver registrada com justificativa.

---

## Critérios globais de aceite do MVP

O MVP do WFlyer está pronto quando os critérios abaixo forem atendidos:

- a aplicação sobe localmente por documentação reproduzível;
- banco é criado por migrations;
- seed de instrumentos é idempotente;
- API responde health, instrumentos, upload, criação de job, status, artefatos e download;
- upload de PDF é validado no backend;
- arquivos são armazenados fora do banco;
- jobs são processados de forma assíncrona;
- worker não usa `shell=True`;
- pipeline musical mínimo está testado ou suas limitações estão claramente documentadas;
- frontend final usa contratos reais do backend;
- usuário consegue executar o fluxo principal de ponta a ponta;
- histórico local não depende de login;
- arquivos expiram no servidor em 15 dias;
- DTOs públicos não expõem métricas internas, storage key, stacktrace ou token permanente;
- testes principais foram executados;
- documentação foi atualizada junto com o código;
- logs registram o que foi feito, testado, corrigido e pendente.

## Proibições explícitas

O Codex não deve:

- implementar login no MVP sem decisão explícita;
- começar frontend final antes do backend MVP estar concluído;
- processar PDF pesado dentro da request HTTP;
- salvar PDF, MusicXML ou PDF final como blob no banco;
- expor storage path em resposta pública;
- logar token de download;
- retornar confidence score para usuário comum;
- criar endpoint novo sem atualizar documentação;
- alterar contrato público sem atualizar frontend e testes;
- usar subprocess com `shell=True`;
- ignorar falha de teste para avançar fase;
- marcar etapa como `CONCLUIDA` sem evidência no log;
- criar solução improvisada sem registrar sub-etapa de correção.

## Como lidar com lacunas

Quando faltar informação na documentação:

1. consultar os documentos mais específicos da área;
2. escolher a opção mais conservadora para segurança;
3. registrar a lacuna em `DECISIONS.md`;
4. criar sub-etapa na etapa atual;
5. implementar apenas se a decisão estiver documentada;
6. atualizar o guia ou documento específico para evitar repetição da lacuna.

## Ordem de verdade

Quando houver conflito entre fontes, seguir esta ordem:

1. `docs/implementacao/00-guia_de_implementacao.md`;
2. `docs/implementacao/01-implementacao_IA.md`;
3. `docs/00-visao-geral/01-decisoes-arquiteturais.md`;
4. documentação específica da área;
5. contratos API documentados;
6. código existente;
7. comentários antigos no código.

O código existente não vence a documentação quando a documentação for mais recente, explícita e segura.
