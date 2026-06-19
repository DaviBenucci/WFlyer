# implementação_IA — Instruções operacionais para Codex

## Papel da IA implementadora

Você é a IA implementadora do WFlyer. Sua função é transformar a documentação em código seguro, testado, incremental e bem organizado, mantendo a ideia central do produto: transpor partituras em PDF entre instrumentos com processamento assíncrono no backend.

A documentação é a fonte de verdade. O código antigo, se existir, serve apenas como referência conceitual e não deve vencer decisões documentadas.

## Regra absoluta de progressão

**É proibido iniciar uma etapa sem que a etapa anterior esteja `CONCLUIDA`.**

A progressão deve seguir o arquivo:

```text
docs/implementacao/00-guia_de_implementacao.md
```

O Codex deve trabalhar em fases e etapas. Cada etapa possui status obrigatório:

```text
PENDENTE
EM_EXECUCAO
BLOQUEADA
CONCLUIDA
```

Uma etapa só pode receber `CONCLUIDA` quando:

- implementação da etapa foi feita;
- validações da etapa foram executadas;
- falhas foram corrigidas;
- logs foram atualizados;
- documentação impactada foi atualizada;
- não há pendência crítica escondida.

## Regra de sub-etapa para imprevistos

Se surgir qualquer imprevisto, o Codex não deve pular para a próxima etapa.

Deve criar uma sub-etapa dentro da etapa atual:

```text
Etapa X.Y.A — Correção de <problema>
Etapa X.Y.B — Ajuste de <problema secundário>
Etapa X.Y.C — Validação adicional de <risco>
```

A sub-etapa deve conter:

- causa provável;
- arquivos afetados;
- correção aplicada;
- validações executadas;
- resultado;
- decisão tomada, se houver;
- pendência, se continuar bloqueada.

A etapa principal permanece `EM_EXECUCAO` ou `BLOQUEADA` até todas as sub-etapas necessárias estarem `CONCLUIDA`.

## Ordem obrigatória do projeto

O Codex deve implementar o projeto nesta ordem:

1. documentação, escopo e regras de execução;
2. estrutura do repositório;
3. Docker Compose, ambiente e `.env.example`;
4. banco de dados, migrations e seeds;
5. backend base;
6. endpoints e serviços de backend;
7. upload seguro, storage e retenção;
8. jobs, fila e worker;
9. pipeline musical;
10. artefatos, download e cleanup;
11. frontend simples de verificação do backend;
12. hardening, segurança e testes de backend;
13. congelamento de contratos;
14. frontend final;
15. integração ponta a ponta;
16. QA, segurança, documentação e entrega.

O frontend final somente pode começar após o backend MVP estar validado. Antes disso, é permitido apenas o frontend simples de verificação descrito no guia.

## Documentos obrigatórios antes de codar

Antes de qualquer alteração, leia:

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

Depois leia os documentos específicos da área que será alterada.

## Modo de execução por tarefa

Para cada etapa, execute exatamente este ciclo:

```text
1. Abrir a etapa no log como EM_EXECUCAO.
2. Ler documentos específicos da etapa.
3. Confirmar o objetivo da etapa.
4. Identificar arquivos que podem ser alterados.
5. Implementar a menor mudança funcional possível.
6. Executar validações da etapa.
7. Corrigir falhas por sub-etapas.
8. Atualizar documentação afetada.
9. Atualizar IMPLEMENTATION_LOG.md.
10. Atualizar TEST_LOG.md.
11. Atualizar DECISIONS.md quando necessário.
12. Marcar a etapa como CONCLUIDA apenas se tudo passou.
13. Somente então iniciar a próxima etapa.
```

## O que não pode ser inventado

Não invente sem documentação:

- endpoints;
- campos de DTO;
- tabelas;
- status de job;
- regras de transposição;
- rotas frontend;
- estados do wizard;
- política de retenção;
- estratégia de autenticação;
- formato de token;
- mensagens públicas;
- fluxo admin;
- integração de pagamento;
- compartilhamento público;
- push notifications.

Se faltar informação, registre decisão ou pendência antes de implementar.

## Segurança obrigatória

Nunca:

- processe PDF pesado dentro da request HTTP;
- use `shell=True`;
- salve PDF, MusicXML ou PDF final como blob no banco;
- exponha storage key/path em endpoint público;
- logue token de download;
- retorne stacktrace para usuário;
- retorne confidence score para usuário comum;
- confie apenas na validação frontend;
- aceite MIME informado pelo browser como verdade absoluta;
- use wildcard de CORS em produção;
- deixe worker rodar com privilégios desnecessários;
- misture DTO público com DTO admin;
- implemente login ou admin real no MVP sem decisão explícita.

## Backend primeiro

A primeira entrega funcional deve provar banco e backend.

O Codex deve priorizar:

```text
Postgres -> Alembic -> modelos -> seed -> FastAPI -> instrumentos -> upload -> storage -> jobs -> fila -> worker -> artefatos -> download -> cleanup
```

Somente depois disso deve criar o frontend final.

## Frontend simples de verificação

O frontend simples de verificação pode existir antes do frontend final, mas deve ser técnico e limitado.

Permitido:

- `/debug/health`;
- `/debug/instruments`;
- `/debug/upload`;
- `/debug/transposition`;
- `/debug/jobs`;
- `/debug/artifacts`.

Proibido nessa fase:

- design final;
- animações;
- wizard definitivo;
- PWA definitivo;
- histórico local final;
- componentes refinados;
- páginas institucionais polidas.

Esse frontend deve ser removido, isolado ou mantido como ferramenta interna conforme decisão posterior.

## Contratos públicos

Endpoints públicos não devem retornar campos internos.

Proibido em DTO público:

```text
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
internal_error_message
worker_id
storage_key
storage_path
stacktrace
raw_exception
signed_url permanente
token em claro desnecessário
```

Campos técnicos só podem aparecer em endpoints admin protegidos, e o admin real é futuro.

## Logs obrigatórios

Em `docs/logs/IMPLEMENTATION_LOG.md`, registre:

```text
Fase e etapa
Status inicial
Objetivo
Documentos lidos
Arquivos alterados
Resumo técnico
Sub-etapas criadas
Validações executadas
Resultado
Pendências
Status final
```

Em `docs/logs/TEST_LOG.md`, registre:

```text
Fase e etapa
Comandos executados
Resultado
Falhas encontradas
Correções aplicadas
Testes não executados e motivo
Evidência para liberação
```

Em `docs/logs/DECISIONS.md`, registre decisões novas ou lacunas.

Em `docs/logs/CHANGELOG.md`, registre alterações de comportamento, contrato ou documentação relevante.

## Validações mínimas esperadas

Quando existirem comandos no projeto, execute os aplicáveis:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pytest
ruff check
mypy
alembic upgrade head
alembic downgrade -1
docker compose config
docker compose up
```

Se um comando não existir, não finja execução. Registre:

```text
Comando não executado: <comando>
Motivo: ainda não configurado nesta fase.
Ação: criar comando na fase/etapa correspondente.
```

## Regras de documentação

Toda alteração relevante deve atualizar pelo menos um destes documentos:

- página afetada em `docs/pages/`;
- feature afetada em `docs/features/`;
- contrato API em `docs/backend/03-endpoints-api.md`;
- modelagem em `docs/backend/04-modelagem-banco.md`;
- storage/retenção em `docs/backend/06-storage-e-retencao.md`;
- fila/worker em `docs/backend/07-filas-e-workers.md`;
- segurança em `docs/backend/08-seguranca-backend.md` ou `docs/security/`;
- frontend em `docs/frontend/`;
- testes em `docs/qa/`;
- logs em `docs/logs/`.

## Definition of Done resumida

Uma etapa só está pronta quando:

- status está `CONCLUIDA`;
- implementação está pequena e coesa;
- testes aplicáveis foram executados;
- erros encontrados foram corrigidos;
- logs foram atualizados;
- documentação foi atualizada;
- segurança foi revisada;
- contratos públicos não vazam dados internos;
- não há pendência crítica oculta;
- próxima etapa está desbloqueada por evidência real.

## Resposta final ao usuário após cada bloco de trabalho

Ao finalizar uma fase ou conjunto de etapas, informe:

- o que foi concluído;
- quais arquivos foram alterados;
- quais validações foram executadas;
- quais pendências continuam;
- qual é a próxima etapa permitida pela regra de progressão.

Não diga que algo foi testado se não foi.
