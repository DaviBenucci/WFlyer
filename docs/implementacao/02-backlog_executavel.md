# Backlog executável

## Legenda de prioridade

```text
[P0] Base obrigatória do MVP
[P1] Fluxo principal do MVP
[P2] Polimento do MVP
[P3] Futuro, fora do MVP inicial
```

## Regra de execução

Este backlog segue `docs/implementacao/00-guia_de_implementacao.md`.

O Codex deve executar na ordem. Uma etapa só pode mudar para `CONCLUIDA` quando a validação correspondente estiver registrada em `docs/logs/TEST_LOG.md` e a implementação/documentação estiver registrada em `docs/logs/IMPLEMENTATION_LOG.md`.

Formato de status:

```text
[ ] PENDENTE
[-] EM_EXECUCAO
[!] BLOQUEADA
[x] CONCLUIDA
```

Se houver imprevisto, criar sub-etapa abaixo da etapa atual antes de avançar.

---

## Fase 0 — Travamento de escopo, leitura e governança

Prioridade: [P0]

Objetivo: Garantir que o Codex entenda o produto antes de alterar qualquer arquivo.

- [ ] **Etapa 0.1 — Confirmar ideia central do WFlyer**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar que o MVP é upload de PDF, seleção de instrumento de origem, seleção de instrumento de destino, processamento assíncrono, resultado e download.  
  Validação: Conferir README, decisões arquiteturais e docs de features; registrar no log que o escopo foi entendido.  
- [ ] **Etapa 0.2 — Classificar funcionalidades MVP e futuras**  
  Status inicial: `PENDENTE`  
  Entrega: Separar MVP sem login de itens futuros como dashboard, admin, biblioteca, compartilhamento público e push notifications.  
  Validação: Criar ou atualizar checklist de escopo; confirmar que itens futuros não entram no MVP sem decisão explícita.  
- [ ] **Etapa 0.3 — Ler documentos obrigatórios**  
  Status inicial: `PENDENTE`  
  Entrega: Ler os documentos listados no início deste guia antes de propor qualquer estrutura de código.  
  Validação: Registrar em `IMPLEMENTATION_LOG.md` a lista de documentos lidos.  
- [ ] **Etapa 0.4 — Identificar conflitos de documentação**  
  Status inicial: `PENDENTE`  
  Entrega: Comparar guia, decisões arquiteturais, backend, frontend, segurança e QA para detectar divergências.  
  Validação: Registrar conflitos em `DECISIONS.md` como decisão aceita ou pendência.  
- [ ] **Etapa 0.5 — Definir ordem local de execução**  
  Status inicial: `PENDENTE`  
  Entrega: Quebrar a implementação atual em etapas pequenas de acordo com este guia.  
  Validação: Criar entrada de execução com status por fase e etapa.  
- [ ] **Etapa 0.6 — Definir comandos de validação disponíveis**  
  Status inicial: `PENDENTE`  
  Entrega: Mapear comandos esperados de lint, format, typecheck, testes, build, migrations e Docker.  
  Validação: Se comandos ainda não existirem, registrar como pendência da fase de fundação.  
- [ ] **Etapa 0.7 — Criar política de não avanço**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar ao log que nenhuma etapa seguinte será iniciada antes da anterior estar concluída.  
  Validação: Verificar que o texto de gate foi copiado para o log de implementação.  
- [ ] **Etapa 0.8 — Registrar riscos iniciais**  
  Status inicial: `PENDENTE`  
  Entrega: Listar riscos de PDF malicioso, processamento pesado, storage, filas, tokens e exposição de dados internos.  
  Validação: Atualizar documentos de segurança se houver risco novo.  

## Fase 1 — Estrutura do repositório e padrões técnicos

Prioridade: [P0]

Objetivo: Criar a base do projeto sem implementar regra de negócio ainda.

- [ ] **Etapa 1.1 — Criar estrutura raiz do projeto**  
  Status inicial: `PENDENTE`  
  Entrega: Criar organização recomendada, preferencialmente `apps/api`, `apps/web`, `packages` quando necessário, `infra`, `scripts` e `docs`.  
  Validação: Listar árvore final e conferir que documentação existente foi preservada.  
- [ ] **Etapa 1.2 — Definir gerenciadores e versões**  
  Status inicial: `PENDENTE`  
  Entrega: Fixar Python 3.12+, Node LTS, pnpm/npm conforme escolha, e registrar versões em arquivos apropriados.  
  Validação: Executar comandos de versão e registrar em `TEST_LOG.md`.  
- [ ] **Etapa 1.3 — Configurar `.gitignore` seguro**  
  Status inicial: `PENDENTE`  
  Entrega: Ignorar `.env`, storage local, caches, artefatos temporários, uploads, bancos locais e diretórios de build.  
  Validação: Criar teste manual de ausência de secrets e arquivos temporários no controle de versão.  
- [ ] **Etapa 1.4 — Criar `.env.example` sem secrets reais**  
  Status inicial: `PENDENTE`  
  Entrega: Documentar variáveis de API, banco, Redis, storage, CORS, rate limit, retenção e URLs locais.  
  Validação: Conferir que nenhum valor é secret real; usar placeholders explícitos.  
- [ ] **Etapa 1.5 — Configurar lint e format backend**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar Ruff/Black ou ferramenta equivalente para Python.  
  Validação: Executar comando de lint/format quando existir; registrar falhas.  
- [ ] **Etapa 1.6 — Configurar typecheck backend**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar mypy/pyright quando aplicável, sem bloquear indevidamente o início do projeto.  
  Validação: Executar typecheck ou registrar comando ausente como pendência controlada.  
- [ ] **Etapa 1.7 — Configurar lint e format frontend**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar ESLint, Prettier e regras TypeScript/React.  
  Validação: Executar lint/format quando existir.  
- [ ] **Etapa 1.8 — Configurar typecheck frontend**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar `tsc --noEmit` ou comando equivalente.  
  Validação: Executar typecheck ou registrar ausência.  
- [ ] **Etapa 1.9 — Configurar testes base**  
  Status inicial: `PENDENTE`  
  Entrega: Criar estrutura mínima para pytest no backend e testes frontend quando o app web existir.  
  Validação: Criar teste trivial apenas para validar runner, sem simular regra de negócio falsa.  
- [ ] **Etapa 1.10 — Criar README técnico de execução local**  
  Status inicial: `PENDENTE`  
  Entrega: Documentar como subir infra, API, worker e frontend.  
  Validação: Validar comandos documentados localmente quando a infra existir.  
- [ ] **Etapa 1.11 — Criar scripts utilitários seguros**  
  Status inicial: `PENDENTE`  
  Entrega: Criar scripts sem `shell=True` e sem acoplar secrets.  
  Validação: Revisar scripts para comandos perigosos.  
- [ ] **Etapa 1.12 — Atualizar logs da fase**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar arquivos criados, comandos executados e pendências reais.  
  Validação: Somente avançar com todos os itens essenciais concluídos.  

## Fase 2 — Infra local, containers e configuração

Prioridade: [P0]

Objetivo: Subir dependências locais necessárias antes de modelar o banco.

- [ ] **Etapa 2.1 — Criar Docker Compose inicial**  
  Status inicial: `PENDENTE`  
  Entrega: Definir serviços para Postgres, Redis, MinIO ou storage local equivalente, API e worker quando aplicável.  
  Validação: Executar validação de sintaxe do Compose e documentar comando de subida.  
- [ ] **Etapa 2.2 — Configurar Postgres local**  
  Status inicial: `PENDENTE`  
  Entrega: Definir database, usuário local, senha local não real, volume e healthcheck.  
  Validação: Conferir que o serviço fica saudável.  
- [ ] **Etapa 2.3 — Configurar Redis local**  
  Status inicial: `PENDENTE`  
  Entrega: Definir Redis para fila/cache com healthcheck simples.  
  Validação: Conferir conectividade a partir da API quando a API existir.  
- [ ] **Etapa 2.4 — Configurar storage local/MinIO**  
  Status inicial: `PENDENTE`  
  Entrega: Definir bucket de desenvolvimento para uploads, artefatos e temporários.  
  Validação: Validar criação de bucket por script idempotente ou documentação.  
- [ ] **Etapa 2.5 — Configurar rede entre serviços**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir que API, worker, Postgres, Redis e storage se resolvam por nome de serviço.  
  Validação: Registrar variáveis de conexão no `.env.example`.  
- [ ] **Etapa 2.6 — Configurar limites básicos de containers**  
  Status inicial: `PENDENTE`  
  Entrega: Definir limites ou observações para CPU/memória, principalmente para worker e ferramentas de PDF.  
  Validação: Registrar decisão se limites não forem aplicados no Compose inicial.  
- [ ] **Etapa 2.7 — Criar healthchecks de infraestrutura**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar comandos de verificação para banco, Redis e storage.  
  Validação: Registrar evidência de health no log.  
- [ ] **Etapa 2.8 — Definir política de volumes locais**  
  Status inicial: `PENDENTE`  
  Entrega: Separar dados persistentes de arquivos temporários; impedir commit de volumes.  
  Validação: Conferir `.gitignore` e documentação.  
- [ ] **Etapa 2.9 — Documentar reset local seguro**  
  Status inicial: `PENDENTE`  
  Entrega: Criar instrução para derrubar volumes locais sem afetar produção.  
  Validação: Validar que o comando é claramente marcado como destrutivo local.  

## Fase 3 — Banco de dados primeiro

Prioridade: [P0]

Objetivo: Construir a modelagem antes dos endpoints e do frontend final.

- [ ] **Etapa 3.1 — Inicializar camada de banco**  
  Status inicial: `PENDENTE`  
  Entrega: Configurar SQLAlchemy 2.0, engine, sessão, base declarativa e dependência de sessão da API.  
  Validação: Executar teste de conexão com banco.  
- [ ] **Etapa 3.2 — Inicializar Alembic**  
  Status inicial: `PENDENTE`  
  Entrega: Criar configuração de migrations integrada aos modelos.  
  Validação: Executar migration vazia ou inicial sem erro.  
- [ ] **Etapa 3.3 — Criar tabela `instruments`**  
  Status inicial: `PENDENTE`  
  Entrega: Modelar instrumentos com id, nome, família, transposição escrita para som real, aliases, descrição e suporte.  
  Validação: Criar migration e teste de schema.  
- [ ] **Etapa 3.4 — Criar seed de instrumentos**  
  Status inicial: `PENDENTE`  
  Entrega: Popular instrumentos base como piano, flauta, violino, trompete Bb, clarinete Bb, sax alto Eb e outros úteis.  
  Validação: Executar seed idempotente e validar contagem no banco.  
- [ ] **Etapa 3.5 — Criar tabela `uploaded_files`**  
  Status inicial: `PENDENTE`  
  Entrega: Modelar metadados de upload: id, nome original, MIME detectado, tamanho, hash, storage key, status e expiração.  
  Validação: Testar criação e consulta sem armazenar binário no banco.  
- [ ] **Etapa 3.6 — Criar tabela `processing_jobs`**  
  Status inicial: `PENDENTE`  
  Entrega: Modelar job com status, progresso, instrumento origem, destino, intervalo, sessão anônima, token hash, expiração e timestamps.  
  Validação: Testar criação de job com FK de upload e instrumentos.  
- [ ] **Etapa 3.7 — Criar tabela `job_events`**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar histórico de status e mensagens públicas/internas separadas.  
  Validação: Testar ordenação cronológica e relação com job.  
- [ ] **Etapa 3.8 — Criar tabela `generated_artifacts`**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar artefatos finais e intermediários autorizados: PDF final, MusicXML final, preview e relatórios internos.  
  Validação: Garantir que path interno não seja exposto por DTO público.  
- [ ] **Etapa 3.9 — Criar tabela `admin_processing_metrics`**  
  Status inicial: `PENDENTE`  
  Entrega: Guardar métricas internas como confiança OMR, duração, símbolos não reconhecidos e versão de engine.  
  Validação: Garantir que a tabela não alimente DTO público comum.  
- [ ] **Etapa 3.10 — Criar enums ou constraints de status**  
  Status inicial: `PENDENTE`  
  Entrega: Definir status aceitos para upload, job, evento e artefato.  
  Validação: Testar rejeição de status inválido.  
- [ ] **Etapa 3.11 — Criar índices necessários**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar índices para job status, expiração, sessão anônima, created_at e artifact job_id.  
  Validação: Validar criação via migration.  
- [ ] **Etapa 3.12 — Criar política de expiração no modelo**  
  Status inicial: `PENDENTE`  
  Entrega: Definir `expires_at` padrão de 15 dias para uploads, jobs e artefatos.  
  Validação: Testar cálculo de expiração em UTC.  
- [ ] **Etapa 3.13 — Criar testes de migrations**  
  Status inicial: `PENDENTE`  
  Entrega: Testar upgrade e, quando possível, downgrade em ambiente local.  
  Validação: Registrar comando e resultado.  
- [ ] **Etapa 3.14 — Atualizar documentação de modelagem**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar `docs/backend/04-modelagem-banco.md` se qualquer campo mudar.  
  Validação: Somente concluir com documentação alinhada.  

## Fase 4 — Backend base e contratos internos

Prioridade: [P0]

Objetivo: Criar API mínima robusta antes das regras específicas.

- [ ] **Etapa 4.1 — Criar aplicação FastAPI**  
  Status inicial: `PENDENTE`  
  Entrega: Estruturar app, routers, configurações, dependências e ciclo de vida.  
  Validação: Executar teste de importação e health básico.  
- [ ] **Etapa 4.2 — Configurar Pydantic Settings**  
  Status inicial: `PENDENTE`  
  Entrega: Ler variáveis de ambiente com validação e defaults seguros para desenvolvimento.  
  Validação: Testar falha clara quando variável obrigatória faltar.  
- [ ] **Etapa 4.3 — Criar endpoint `/health`**  
  Status inicial: `PENDENTE`  
  Entrega: Retornar status da API sem expor segredos.  
  Validação: Testar HTTP 200 e payload esperado.  
- [ ] **Etapa 4.4 — Criar endpoint `/health/dependencies` interno**  
  Status inicial: `PENDENTE`  
  Entrega: Verificar banco, Redis e storage de forma segura para desenvolvimento/admin.  
  Validação: Não expor secrets nem stacktrace.  
- [ ] **Etapa 4.5 — Configurar CORS restritivo**  
  Status inicial: `PENDENTE`  
  Entrega: Permitir apenas origens configuradas; evitar wildcard em produção.  
  Validação: Testar headers em ambiente local.  
- [ ] **Etapa 4.6 — Configurar middleware de correlation ID**  
  Status inicial: `PENDENTE`  
  Entrega: Gerar ou propagar ID por request e incluir em logs e erros.  
  Validação: Testar presença em resposta e log.  
- [ ] **Etapa 4.7 — Configurar erro padrão**  
  Status inicial: `PENDENTE`  
  Entrega: Criar `ErrorDTO` com `code`, `message` e `correlation_id`.  
  Validação: Testar erro 404/422 sem stacktrace.  
- [ ] **Etapa 4.8 — Configurar logs estruturados**  
  Status inicial: `PENDENTE`  
  Entrega: Padronizar logs JSON ou formato estruturado com nível, serviço, request_id e evento.  
  Validação: Gerar log de request e verificar ausência de dados sensíveis.  
- [ ] **Etapa 4.9 — Configurar dependência de sessão de banco**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir abertura/fechamento correto da sessão por request.  
  Validação: Testar query simples.  
- [ ] **Etapa 4.10 — Criar separação de DTO público e interno**  
  Status inicial: `PENDENTE`  
  Entrega: Definir schemas públicos sem campos internos/admin.  
  Validação: Testar serialização de DTO público.  
- [ ] **Etapa 4.11 — Criar estrutura de módulos backend**  
  Status inicial: `PENDENTE`  
  Entrega: Separar `config`, `db`, `instruments`, `uploads`, `jobs`, `storage`, `workers`, `music`, `artifacts`, `security`.  
  Validação: Conferir imports sem ciclos.  
- [ ] **Etapa 4.12 — Criar testes base de API**  
  Status inicial: `PENDENTE`  
  Entrega: Configurar TestClient/AsyncClient e fixtures de banco.  
  Validação: Executar teste de health e erro padrão.  

## Fase 5 — Backend de instrumentos e regras de transposição

Prioridade: [P0]

Objetivo: Implementar dados musicais estáveis antes de upload e jobs.

- [ ] **Etapa 5.1 — Implementar repositório de instrumentos**  
  Status inicial: `PENDENTE`  
  Entrega: Criar camada de consulta ao banco sem acoplar diretamente ao router.  
  Validação: Testar busca por id e lista.  
- [ ] **Etapa 5.2 — Implementar `GET /api/instruments`**  
  Status inicial: `PENDENTE`  
  Entrega: Retornar instrumentos suportados com aliases e transposição escrita para som real.  
  Validação: Testar schema público e ordenação.  
- [ ] **Etapa 5.3 — Implementar `GET /api/instruments/{id}`**  
  Status inicial: `PENDENTE`  
  Entrega: Retornar instrumento específico ou erro público seguro.  
  Validação: Testar 200 e 404.  
- [ ] **Etapa 5.4 — Implementar cálculo de intervalo**  
  Status inicial: `PENDENTE`  
  Entrega: Calcular `intervalo = source_written_to_concert - target_written_to_concert` em semitons.  
  Validação: Testar Piano C para Trompete Bb resultando em +2.  
- [ ] **Etapa 5.5 — Criar validação de instrumentos suportados**  
  Status inicial: `PENDENTE`  
  Entrega: Bloquear instrumentos não suportados no MVP sem quebrar seed futura.  
  Validação: Testar erro público.  
- [ ] **Etapa 5.6 — Criar serviço de tonalidade alvo**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar função para estimar tonalidade escrita resultante quando tonalidade origem estiver disponível.  
  Validação: Testar casos simples sem depender de OMR real.  
- [ ] **Etapa 5.7 — Documentar regra musical**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar docs de feature de cálculo de transposição se houver ajuste.  
  Validação: Conferir exemplo principal do README.  
- [ ] **Etapa 5.8 — Criar testes musicais unitários**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar testes para intervalos C, Bb, Eb, F e instrumentos sem transposição.  
  Validação: Registrar resultados.  

## Fase 6 — Upload seguro, storage e retenção

Prioridade: [P0]

Objetivo: Receber PDFs com segurança antes de criar jobs reais.

- [ ] **Etapa 6.1 — Criar serviço de storage**  
  Status inicial: `PENDENTE`  
  Entrega: Abstrair operações `put`, `get_signed_url`, `delete`, `exists` e metadados.  
  Validação: Testar com MinIO/local sem expor path interno.  
- [ ] **Etapa 6.2 — Criar política de chaves UUID**  
  Status inicial: `PENDENTE`  
  Entrega: Gerar storage keys independentes do nome original.  
  Validação: Testar que nome malicioso não aparece na key.  
- [ ] **Etapa 6.3 — Implementar validação de tamanho**  
  Status inicial: `PENDENTE`  
  Entrega: Bloquear arquivos acima do limite configurado.  
  Validação: Testar limite válido e inválido.  
- [ ] **Etapa 6.4 — Implementar validação real de PDF**  
  Status inicial: `PENDENTE`  
  Entrega: Conferir assinatura, MIME detectado e regras mínimas de PDF; não confiar no header do browser.  
  Validação: Testar arquivo renomeado `.pdf` que não é PDF.  
- [ ] **Etapa 6.5 — Bloquear PDF criptografado se não suportado**  
  Status inicial: `PENDENTE`  
  Entrega: Detectar criptografia ou registrar limitação conservadora.  
  Validação: Testar PDF criptografado quando fixture existir.  
- [ ] **Etapa 6.6 — Sanitizar nome original**  
  Status inicial: `PENDENTE`  
  Entrega: Guardar nome original sanitizado para exibição, sem usar como path.  
  Validação: Testar path traversal e caracteres problemáticos.  
- [ ] **Etapa 6.7 — Calcular hash do arquivo**  
  Status inicial: `PENDENTE`  
  Entrega: Salvar hash para auditoria e deduplicação futura sem expor ao usuário comum.  
  Validação: Testar persistência do hash.  
- [ ] **Etapa 6.8 — Implementar `POST /api/uploads`**  
  Status inicial: `PENDENTE`  
  Entrega: Receber multipart, validar, salvar no storage e registrar `uploaded_files`.  
  Validação: Testar sucesso e erros seguros.  
- [ ] **Etapa 6.9 — Criar status de upload**  
  Status inicial: `PENDENTE`  
  Entrega: Usar status como `uploaded`, `rejected`, `expired` conforme modelo.  
  Validação: Testar transições básicas.  
- [ ] **Etapa 6.10 — Implementar limpeza de arquivo rejeitado**  
  Status inicial: `PENDENTE`  
  Entrega: Remover arquivo do storage se upload falhar após gravação parcial.  
  Validação: Testar rollback ou compensação.  
- [ ] **Etapa 6.11 — Documentar políticas de upload**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar docs de segurança e storage se limites forem definidos.  
  Validação: Concluir somente com docs alinhadas.  

## Fase 7 — Jobs, fila e lifecycle de processamento

Prioridade: [P0]

Objetivo: Criar execução assíncrona sem pipeline musical completo ainda.

- [ ] **Etapa 7.1 — Implementar serviço de criação de job**  
  Status inicial: `PENDENTE`  
  Entrega: Criar job a partir de upload e instrumentos validados.  
  Validação: Testar criação com status `queued`.  
- [ ] **Etapa 7.2 — Gerar token temporário seguro**  
  Status inicial: `PENDENTE`  
  Entrega: Criar token de download/consulta e armazenar apenas hash quando aplicável.  
  Validação: Testar que token em claro não aparece em logs.  
- [ ] **Etapa 7.3 — Implementar `POST /api/transpositions`**  
  Status inicial: `PENDENTE`  
  Entrega: Criar job, calcular intervalo e enfileirar processamento.  
  Validação: Testar payload válido e inválido.  
- [ ] **Etapa 7.4 — Implementar produtor de fila**  
  Status inicial: `PENDENTE`  
  Entrega: Publicar mensagem com job_id e metadados mínimos.  
  Validação: Testar publicação no Redis/Celery broker.  
- [ ] **Etapa 7.5 — Implementar status públicos de job**  
  Status inicial: `PENDENTE`  
  Entrega: Criar `GET /api/jobs/{job_id}` e/ou `/status` com DTO público.  
  Validação: Testar que campos internos não aparecem.  
- [ ] **Etapa 7.6 — Implementar validação de acesso anônimo**  
  Status inicial: `PENDENTE`  
  Entrega: Exigir token temporário ou sessão anônima para consultar job sensível.  
  Validação: Testar token inválido e ausente.  
- [ ] **Etapa 7.7 — Criar registro de eventos de job**  
  Status inicial: `PENDENTE`  
  Entrega: Persistir eventos como queued, validating, transposing, rendering, completed e failed.  
  Validação: Testar evento inicial e atualização.  
- [ ] **Etapa 7.8 — Criar tratamento de falha pública**  
  Status inicial: `PENDENTE`  
  Entrega: Separar `internal_error_message` de `public_error_message`.  
  Validação: Testar falha sem stacktrace público.  
- [ ] **Etapa 7.9 — Criar cancelamento/expiração básico**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar status `cancelled` e `expired` ainda que UI final venha depois.  
  Validação: Testar endpoint DELETE se implementado.  
- [ ] **Etapa 7.10 — Atualizar contratos API**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar docs de endpoints e contratos frontend quando DTO mudar.  
  Validação: Validar consistência entre backend e frontend docs.  

## Fase 8 — Worker e processamento assíncrono controlado

Prioridade: [P0]

Objetivo: Criar worker real antes do pipeline musical completo.

- [ ] **Etapa 8.1 — Criar aplicação do worker**  
  Status inicial: `PENDENTE`  
  Entrega: Configurar Celery/RQ/Dramatiq conforme decisão e conectar ao broker.  
  Validação: Executar worker local e registrar inicialização.  
- [ ] **Etapa 8.2 — Criar tarefa `process_transposition_job`**  
  Status inicial: `PENDENTE`  
  Entrega: Consumir job_id, buscar dados no banco e atualizar status.  
  Validação: Testar execução com job fake.  
- [ ] **Etapa 8.3 — Configurar retries controlados**  
  Status inicial: `PENDENTE`  
  Entrega: Definir tentativas, backoff e erros não retentáveis.  
  Validação: Testar falha simulada.  
- [ ] **Etapa 8.4 — Configurar timeouts por etapa**  
  Status inicial: `PENDENTE`  
  Entrega: Definir limite para validação, OMR, transposição, renderização e upload de artefatos.  
  Validação: Registrar limites em documentação.  
- [ ] **Etapa 8.5 — Impedir subprocess inseguro**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir que subprocessos futuros usem lista de argumentos e `shell=False`.  
  Validação: Criar teste ou revisão documentada.  
- [ ] **Etapa 8.6 — Isolar diretório temporário por job**  
  Status inicial: `PENDENTE`  
  Entrega: Criar workspace temporário por UUID e limpar ao final.  
  Validação: Testar limpeza em sucesso e falha.  
- [ ] **Etapa 8.7 — Persistir progresso do worker**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar `progress` e `current_step` no banco.  
  Validação: Testar sequência de status.  
- [ ] **Etapa 8.8 — Persistir eventos técnicos**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar eventos internos sem vazar para DTO público.  
  Validação: Testar evento de erro interno.  
- [ ] **Etapa 8.9 — Criar worker simulado controlado**  
  Status inicial: `PENDENTE`  
  Entrega: Antes do OMR real, gerar artefato de teste explicitamente marcado como mock técnico quando necessário.  
  Validação: Não apresentar mock como pipeline musical final.  
- [ ] **Etapa 8.10 — Documentar execução do worker**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar docs de filas/workers com comandos e limites.  
  Validação: Somente concluir com worker reproduzível localmente.  

## Fase 9 — Pipeline musical backend

Prioridade: [P0]

Objetivo: Implementar o núcleo musical de forma incremental e testável.

- [ ] **Etapa 9.1 — Definir fixtures musicais**  
  Status inicial: `PENDENTE`  
  Entrega: Criar arquivos de teste pequenos e controlados para MusicXML/PDF quando disponíveis.  
  Validação: Registrar origem e finalidade dos fixtures.  
- [ ] **Etapa 9.2 — Implementar leitura MusicXML**  
  Status inicial: `PENDENTE`  
  Entrega: Ler MusicXML com biblioteca escolhida e extrair estrutura mínima.  
  Validação: Testar MusicXML simples.  
- [ ] **Etapa 9.3 — Implementar transposição com music21**  
  Status inicial: `PENDENTE`  
  Entrega: Aplicar intervalo de semitons em notas, acordes e armadura quando suportado.  
  Validação: Testar intervalos positivos e negativos.  
- [ ] **Etapa 9.4 — Validar armadura e acidentes**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir alteração coerente de tonalidade escrita e acidentes locais.  
  Validação: Criar testes musicais de tonalidade.  
- [ ] **Etapa 9.5 — Implementar saída MusicXML final**  
  Status inicial: `PENDENTE`  
  Entrega: Salvar MusicXML final em storage como artefato.  
  Validação: Testar criação e metadados.  
- [ ] **Etapa 9.6 — Integrar OMR ou caminho controlado**  
  Status inicial: `PENDENTE`  
  Entrega: Integrar Audiveris ou definir caminho intermediário documentado para MVP técnico.  
  Validação: Registrar limitações explícitas se OMR real não estiver completo.  
- [ ] **Etapa 9.7 — Integrar MuseScore CLI**  
  Status inicial: `PENDENTE`  
  Entrega: Renderizar PDF final a partir do MusicXML final.  
  Validação: Testar subprocess sem shell e timeout.  
- [ ] **Etapa 9.8 — Criar validações de qualidade musical**  
  Status inicial: `PENDENTE`  
  Entrega: Calcular avisos objetivos sem exibir confidence score ao usuário comum.  
  Validação: Testar warnings públicos seguros.  
- [ ] **Etapa 9.9 — Criar métricas admin internas**  
  Status inicial: `PENDENTE`  
  Entrega: Persistir confiança, duração, contagens e versão de engine apenas para admin.  
  Validação: Testar que DTO público não contém métricas internas.  
- [ ] **Etapa 9.10 — Atualizar pipeline do worker**  
  Status inicial: `PENDENTE`  
  Entrega: Substituir mock técnico por pipeline real quando os testes passarem.  
  Validação: Marcar etapa concluída somente com artefato real ou limitação formal documentada.  
- [ ] **Etapa 9.11 — Criar testes musicais de regressão**  
  Status inicial: `PENDENTE`  
  Entrega: Testar pelo menos casos C->Bb, C->Eb, instrumento sem transposição e erro de arquivo inválido.  
  Validação: Registrar resultados no log.  
- [ ] **Etapa 9.12 — Documentar limitações musicais**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar docs se o MVP não suportar algum tipo de partitura.  
  Validação: Não ocultar limitação crítica.  

## Fase 10 — Artefatos, downloads e retenção

Prioridade: [P0]

Objetivo: Fechar fluxo backend de resultado e expiração.

- [ ] **Etapa 10.1 — Implementar registro de artefatos**  
  Status inicial: `PENDENTE`  
  Entrega: Persistir PDF final, MusicXML final e previews quando gerados.  
  Validação: Testar relação artefato-job.  
- [ ] **Etapa 10.2 — Implementar endpoint de artefatos**  
  Status inicial: `PENDENTE`  
  Entrega: Criar `GET /api/jobs/{job_id}/artifacts` com DTO público seguro.  
  Validação: Testar autorização por token/sessão.  
- [ ] **Etapa 10.3 — Implementar download temporário**  
  Status inicial: `PENDENTE`  
  Entrega: Criar endpoint que retorna URL assinada ou stream seguro temporário.  
  Validação: Testar expiração e token inválido.  
- [ ] **Etapa 10.4 — Impedir exposição de storage path**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir que nenhuma resposta pública contenha bucket, key interna ou path local.  
  Validação: Criar teste de DTO público.  
- [ ] **Etapa 10.5 — Implementar expiração lógica**  
  Status inicial: `PENDENTE`  
  Entrega: Jobs e artefatos expirados não devem permitir download normal.  
  Validação: Testar job expirado.  
- [ ] **Etapa 10.6 — Implementar scheduler de cleanup**  
  Status inicial: `PENDENTE`  
  Entrega: Criar comando/tarefa para apagar arquivos expirados e marcar registros.  
  Validação: Testar dry-run e execução local.  
- [ ] **Etapa 10.7 — Registrar evento de cleanup**  
  Status inicial: `PENDENTE`  
  Entrega: Persistir evento ou log auditável de remoção.  
  Validação: Testar log sem dados sensíveis.  
- [ ] **Etapa 10.8 — Criar documentação de retenção**  
  Status inicial: `PENDENTE`  
  Entrega: Atualizar `docs/backend/06-storage-e-retencao.md` e segurança.  
  Validação: Conferir regra de 15 dias.  
- [ ] **Etapa 10.9 — Criar testes de fluxo completo backend**  
  Status inicial: `PENDENTE`  
  Entrega: Upload -> job -> worker -> artefato -> download.  
  Validação: Somente concluir com fluxo backend reprodutível.  

## Fase 11 — Frontend simples de verificação do backend

Prioridade: [P0]

Objetivo: Criar UI temporária para provar que backend e banco funcionam, sem iniciar frontend final.

- [ ] **Etapa 11.1 — Criar app web mínimo**  
  Status inicial: `PENDENTE`  
  Entrega: Inicializar Next.js/React/TypeScript apenas se ainda não existir.  
  Validação: Executar build mínimo.  
- [ ] **Etapa 11.2 — Criar cliente HTTP técnico**  
  Status inicial: `PENDENTE`  
  Entrega: Configurar base URL da API e tratamento de erro padrão.  
  Validação: Testar chamada `/health`.  
- [ ] **Etapa 11.3 — Criar página `/debug/health`**  
  Status inicial: `PENDENTE`  
  Entrega: Exibir status da API e dependências permitidas.  
  Validação: Validar resposta real.  
- [ ] **Etapa 11.4 — Criar página `/debug/instruments`**  
  Status inicial: `PENDENTE`  
  Entrega: Listar instrumentos vindos do banco via API.  
  Validação: Conferir dados do seed.  
- [ ] **Etapa 11.5 — Criar página `/debug/upload`**  
  Status inicial: `PENDENTE`  
  Entrega: Enviar PDF de teste para `POST /api/uploads`.  
  Validação: Testar sucesso e erro de arquivo inválido.  
- [ ] **Etapa 11.6 — Criar página `/debug/transposition`**  
  Status inicial: `PENDENTE`  
  Entrega: Criar job com upload e instrumentos selecionados.  
  Validação: Testar criação de job real.  
- [ ] **Etapa 11.7 — Criar página `/debug/jobs`**  
  Status inicial: `PENDENTE`  
  Entrega: Consultar status por job_id e token quando aplicável.  
  Validação: Testar polling simples.  
- [ ] **Etapa 11.8 — Criar página `/debug/artifacts`**  
  Status inicial: `PENDENTE`  
  Entrega: Listar e baixar artefatos de teste com token temporário.  
  Validação: Testar download e erro de expiração/token.  
- [ ] **Etapa 11.9 — Bloquear evolução visual indevida**  
  Status inicial: `PENDENTE`  
  Entrega: Não implementar design final, animações ou wizard definitivo nesta fase.  
  Validação: Revisar arquivos alterados para garantir escopo técnico.  
- [ ] **Etapa 11.10 — Registrar resultados de integração**  
  Status inicial: `PENDENTE`  
  Entrega: Documentar o que foi comprovado no backend e o que ainda falta.  
  Validação: Somente avançar quando o frontend de verificação provar o backend.  

## Fase 12 — Hardening backend, segurança e observabilidade

Prioridade: [P0]

Objetivo: Concluir backend MVP antes do frontend final.

- [ ] **Etapa 12.1 — Aplicar rate limiting**  
  Status inicial: `PENDENTE`  
  Entrega: Proteger upload, criação de job, status e download contra abuso.  
  Validação: Testar limite básico.  
- [ ] **Etapa 12.2 — Revisar CORS por ambiente**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir origens explícitas em desenvolvimento e produção.  
  Validação: Testar headers.  
- [ ] **Etapa 12.3 — Aplicar headers de segurança**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar headers apropriados na API ou proxy.  
  Validação: Validar presença sem quebrar CORS.  
- [ ] **Etapa 12.4 — Revisar logs sensíveis**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir que tokens, paths, nomes sensíveis e stacktraces não vazem.  
  Validação: Criar teste ou checklist documentado.  
- [ ] **Etapa 12.5 — Revisar permissões de worker**  
  Status inicial: `PENDENTE`  
  Entrega: Worker deve rodar sem privilégio e com diretórios restritos.  
  Validação: Documentar limitações se ambiente local não aplicar tudo.  
- [ ] **Etapa 12.6 — Adicionar testes de segurança de upload**  
  Status inicial: `PENDENTE`  
  Entrega: Cobrir MIME falso, tamanho excedido, path traversal, PDF inválido e arquivo vazio.  
  Validação: Registrar resultados.  
- [ ] **Etapa 12.7 — Adicionar testes de segurança de download**  
  Status inicial: `PENDENTE`  
  Entrega: Cobrir token ausente, inválido, expirado e artefato inexistente.  
  Validação: Registrar resultados.  
- [ ] **Etapa 12.8 — Adicionar testes de DTO público**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir ausência de confidence score, storage key, worker id e stacktrace.  
  Validação: Executar testes.  
- [ ] **Etapa 12.9 — Adicionar métricas e logs operacionais**  
  Status inicial: `PENDENTE`  
  Entrega: Instrumentar duração de job, status, falhas e filas sem expor dados pessoais.  
  Validação: Validar logs.  
- [ ] **Etapa 12.10 — Revisar migrations e seeds**  
  Status inicial: `PENDENTE`  
  Entrega: Executar banco do zero, aplicar migrations e seeds.  
  Validação: Registrar evidência.  
- [ ] **Etapa 12.11 — Executar suíte backend completa**  
  Status inicial: `PENDENTE`  
  Entrega: Rodar pytest, lint, typecheck e migrations.  
  Validação: A fase só conclui com backend MVP aprovado ou pendência não crítica documentada.  

## Fase 13 — Congelamento de contratos para frontend final

Prioridade: [P0]

Objetivo: Evitar que o frontend final seja construído sobre contratos instáveis.

- [ ] **Etapa 13.1 — Revisar DTOs públicos**  
  Status inicial: `PENDENTE`  
  Entrega: Conferir InstrumentDTO, UploadDTO, PublicJobDTO, ArtifactDTO e ErrorDTO.  
  Validação: Atualizar docs frontend/backend.  
- [ ] **Etapa 13.2 — Gerar schemas compartilháveis**  
  Status inicial: `PENDENTE`  
  Entrega: Quando possível, expor OpenAPI e/ou tipos derivados para o frontend.  
  Validação: Validar que tipos não incluem campos internos.  
- [ ] **Etapa 13.3 — Definir política de polling**  
  Status inicial: `PENDENTE`  
  Entrega: Fixar intervalos e parada em status final.  
  Validação: Atualizar docs de contrato frontend.  
- [ ] **Etapa 13.4 — Definir mensagens públicas**  
  Status inicial: `PENDENTE`  
  Entrega: Mapear erros públicos seguros para upload, job, download e expiração.  
  Validação: Validar ausência de mensagens técnicas.  
- [ ] **Etapa 13.5 — Definir estados de UI por status**  
  Status inicial: `PENDENTE`  
  Entrega: Mapear queued, validating, transposing, rendering, completed, failed, expired e cancelled.  
  Validação: Documentar no frontend.  
- [ ] **Etapa 13.6 — Validar contratos com frontend debug**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir que debug pages usam os mesmos contratos do frontend final.  
  Validação: Corrigir divergências antes de iniciar UI final.  
- [ ] **Etapa 13.7 — Registrar contrato congelado**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar decisão ou log informando que o frontend final pode começar.  
  Validação: Status da fase deve ser CONCLUIDA.  

## Fase 14 — Frontend definitivo: fundação visual

Prioridade: [P0]

Objetivo: Construir a base visual somente após backend MVP e contratos concluídos.

- [ ] **Etapa 14.1 — Configurar stack frontend final**  
  Status inicial: `PENDENTE`  
  Entrega: Next.js, TypeScript, Tailwind, shadcn/ui, TanStack Query, Zod e ferramentas definidas.  
  Validação: Executar lint, typecheck e build.  
- [ ] **Etapa 14.2 — Implementar tokens do design system**  
  Status inicial: `PENDENTE`  
  Entrega: Cores, gradientes, tipografia, radius, sombras, espaçamento e dark/light mode.  
  Validação: Validar contraste e consistência.  
- [ ] **Etapa 14.3 — Implementar componentes base**  
  Status inicial: `PENDENTE`  
  Entrega: Button, Card, Input, Select/Combobox, Badge, Progress, Toast, Dialog, Tabs, Skeleton e Alert.  
  Validação: Criar testes ou exemplos mínimos.  
- [ ] **Etapa 14.4 — Implementar AppShell**  
  Status inicial: `PENDENTE`  
  Entrega: Base comum com área de conteúdo e suporte a desktop/mobile.  
  Validação: Validar layout sem sobreposição.  
- [ ] **Etapa 14.5 — Implementar DesktopSidebar**  
  Status inicial: `PENDENTE`  
  Entrega: Sidebar recolhida/expandida, foco visível e item ativo.  
  Validação: Testar teclado e mouse.  
- [ ] **Etapa 14.6 — Implementar MobileBottomNav**  
  Status inicial: `PENDENTE`  
  Entrega: Bottom nav com safe-area, trilho ativo e padding inferior correto.  
  Validação: Testar viewport mobile.  
- [ ] **Etapa 14.7 — Implementar PageContainer**  
  Status inicial: `PENDENTE`  
  Entrega: Padronizar largura, padding, header, breadcrumbs futuros e estados globais.  
  Validação: Validar em páginas vazias.  
- [ ] **Etapa 14.8 — Implementar reduced motion**  
  Status inicial: `PENDENTE`  
  Entrega: Respeitar `prefers-reduced-motion` e permitir animações discretas.  
  Validação: Testar classe/configuração.  
- [ ] **Etapa 14.9 — Configurar TanStack Query**  
  Status inicial: `PENDENTE`  
  Entrega: Definir client, retries seguros, cache e tratamento de erro.  
  Validação: Testar query de instrumentos.  
- [ ] **Etapa 14.10 — Configurar validação Zod**  
  Status inicial: `PENDENTE`  
  Entrega: Validar DTOs recebidos da API.  
  Validação: Testar falha de schema.  

## Fase 15 — Frontend definitivo: páginas e navegação

Prioridade: [P0]

Objetivo: Implementar telas do produto sem quebrar contratos.

- [ ] **Etapa 15.1 — Implementar Home**  
  Status inicial: `PENDENTE`  
  Entrega: Apresentar proposta do WFlyer, CTA para transpor e explicação curta.  
  Validação: Testar desktop/mobile.  
- [ ] **Etapa 15.2 — Implementar Como Funciona**  
  Status inicial: `PENDENTE`  
  Entrega: Explicar upload, processamento, transposição e download sem expor complexidade interna.  
  Validação: Validar copy segura.  
- [ ] **Etapa 15.3 — Implementar Instrumentos**  
  Status inicial: `PENDENTE`  
  Entrega: Listar instrumentos da API, famílias, aliases e suporte.  
  Validação: Testar loading/error/empty.  
- [ ] **Etapa 15.4 — Implementar Configurações locais**  
  Status inicial: `PENDENTE`  
  Entrega: Permitir preferências locais sem backend de usuário.  
  Validação: Testar persistência local.  
- [ ] **Etapa 15.5 — Implementar Histórico local vazio**  
  Status inicial: `PENDENTE`  
  Entrega: Preparar estado vazio e estrutura para IndexedDB futura.  
  Validação: Testar sem login.  
- [ ] **Etapa 15.6 — Implementar Resultado**  
  Status inicial: `PENDENTE`  
  Entrega: Exibir status, origem, destino, transposição aplicada e downloads quando disponíveis.  
  Validação: Não exibir confidence score.  
- [ ] **Etapa 15.7 — Implementar Compartilhados futuro como placeholder**  
  Status inicial: `PENDENTE`  
  Entrega: Manter fora do MVP real se não houver backend de compartilhamento.  
  Validação: Marcar como futuro com copy clara.  
- [ ] **Etapa 15.8 — Implementar Dashboard/Admin futuro como bloqueado**  
  Status inicial: `PENDENTE`  
  Entrega: Não criar funcionalidade real sem autenticação e autorização.  
  Validação: Documentar como fora do MVP.  
- [ ] **Etapa 15.9 — Validar navegação completa**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir rotas, foco, active states e responsividade.  
  Validação: Executar testes frontend.  

## Fase 16 — Frontend definitivo: wizard de transposição integrado

Prioridade: [P0]

Objetivo: Implementar o fluxo principal do usuário com backend real.

- [ ] **Etapa 16.1 — Criar estrutura do TranspositionWizard**  
  Status inicial: `PENDENTE`  
  Entrega: Separar etapas Upload, Origem, Destino, Revisão, Processamento e Resultado.  
  Validação: Testar avanço e retrocesso.  
- [ ] **Etapa 16.2 — Implementar FileDropzone**  
  Status inicial: `PENDENTE`  
  Entrega: Validar extensão/tamanho no cliente sem confiar nessa validação como segurança final.  
  Validação: Testar drag/drop e input.  
- [ ] **Etapa 16.3 — Integrar upload real**  
  Status inicial: `PENDENTE`  
  Entrega: Enviar PDF para backend e tratar ErrorDTO público.  
  Validação: Testar sucesso e erro.  
- [ ] **Etapa 16.4 — Implementar seleção de origem**  
  Status inicial: `PENDENTE`  
  Entrega: Buscar instrumentos da API e permitir pesquisa/filtro.  
  Validação: Testar instrumento suportado.  
- [ ] **Etapa 16.5 — Implementar seleção de destino**  
  Status inicial: `PENDENTE`  
  Entrega: Aplicar regras de instrumentos suportados e impedir origem/destino inválidos.  
  Validação: Testar combinações.  
- [ ] **Etapa 16.6 — Implementar revisão**  
  Status inicial: `PENDENTE`  
  Entrega: Exibir resumo com nome do arquivo, origem, destino e intervalo calculado quando disponível.  
  Validação: Validar copy.  
- [ ] **Etapa 16.7 — Criar job real**  
  Status inicial: `PENDENTE`  
  Entrega: Chamar `POST /api/transpositions` e armazenar job_id/token de forma segura no cliente.  
  Validação: Não logar token.  
- [ ] **Etapa 16.8 — Implementar polling**  
  Status inicial: `PENDENTE`  
  Entrega: Consultar status até completed/failed/expired/cancelled conforme política.  
  Validação: Testar parada do polling.  
- [ ] **Etapa 16.9 — Implementar tela de processamento**  
  Status inicial: `PENDENTE`  
  Entrega: Mostrar progresso, etapa atual e mensagens seguras.  
  Validação: Não expor detalhes internos.  
- [ ] **Etapa 16.10 — Implementar resultado/download**  
  Status inicial: `PENDENTE`  
  Entrega: Listar artefatos e acionar download temporário.  
  Validação: Testar token inválido e expirado.  
- [ ] **Etapa 16.11 — Persistir histórico local mínimo**  
  Status inicial: `PENDENTE`  
  Entrega: Salvar metadados não sensíveis em IndexedDB/local storage conforme docs.  
  Validação: Não salvar PDF local sem decisão explícita.  
- [ ] **Etapa 16.12 — Criar tratamento de erro UX**  
  Status inicial: `PENDENTE`  
  Entrega: Mostrar erros claros para PDF inválido, falha de processamento e expiração.  
  Validação: Testar estados de erro.  

## Fase 17 — PWA, histórico local e refinamento de experiência

Prioridade: [P0]

Objetivo: Polir a aplicação sem adicionar funcionalidades futuras indevidas.

- [ ] **Etapa 17.1 — Configurar PWA básica**  
  Status inicial: `PENDENTE`  
  Entrega: Adicionar manifest e service worker quando decidido.  
  Validação: Testar instalação local se aplicável.  
- [ ] **Etapa 17.2 — Implementar IndexedDB com Dexie**  
  Status inicial: `PENDENTE`  
  Entrega: Guardar histórico local de jobs e preferências não sensíveis.  
  Validação: Testar criação, leitura e limpeza.  
- [ ] **Etapa 17.3 — Implementar estado offline**  
  Status inicial: `PENDENTE`  
  Entrega: Avisar quando a API não estiver acessível.  
  Validação: Testar desconexão simulada.  
- [ ] **Etapa 17.4 — Implementar limpeza local**  
  Status inicial: `PENDENTE`  
  Entrega: Permitir apagar histórico local.  
  Validação: Testar remoção.  
- [ ] **Etapa 17.5 — Refinar acessibilidade**  
  Status inicial: `PENDENTE`  
  Entrega: Revisar labels, foco, contraste, navegação por teclado e mensagens de status.  
  Validação: Executar checklist de acessibilidade.  
- [ ] **Etapa 17.6 — Refinar responsividade**  
  Status inicial: `PENDENTE`  
  Entrega: Validar mobile, tablet, desktop e safe-area.  
  Validação: Registrar evidências.  
- [ ] **Etapa 17.7 — Refinar animações musicais**  
  Status inicial: `PENDENTE`  
  Entrega: Aplicar microinterações discretas respeitando reduced motion.  
  Validação: Testar preferências de movimento.  
- [ ] **Etapa 17.8 — Revisar conteúdo textual**  
  Status inicial: `PENDENTE`  
  Entrega: Garantir linguagem clara, sem termos técnicos desnecessários para usuário comum.  
  Validação: Validar mensagens de erro.  

## Fase 18 — QA final, segurança, documentação e entrega

Prioridade: [P0]

Objetivo: Finalizar o projeto com testes e documentação coerentes.

- [ ] **Etapa 18.1 — Executar testes backend completos**  
  Status inicial: `PENDENTE`  
  Entrega: Rodar pytest, testes de integração, segurança e migrations.  
  Validação: Registrar comandos e resultados.  
- [ ] **Etapa 18.2 — Executar testes frontend completos**  
  Status inicial: `PENDENTE`  
  Entrega: Rodar lint, typecheck, testes e build.  
  Validação: Registrar comandos e resultados.  
- [ ] **Etapa 18.3 — Executar testes E2E**  
  Status inicial: `PENDENTE`  
  Entrega: Validar fluxo upload -> job -> processamento -> resultado -> download.  
  Validação: Registrar ambiente e evidência.  
- [ ] **Etapa 18.4 — Executar regressão musical**  
  Status inicial: `PENDENTE`  
  Entrega: Validar casos de transposição definidos em `docs/qa/05-testes-musicais.md`.  
  Validação: Registrar resultados.  
- [ ] **Etapa 18.5 — Executar checklist de segurança**  
  Status inicial: `PENDENTE`  
  Entrega: Conferir upload, storage, tokens, CORS, headers, logs, DTOs e workers.  
  Validação: Atualizar `docs/security/02-checklist-seguranca.md`.  
- [ ] **Etapa 18.6 — Executar revisão de documentação**  
  Status inicial: `PENDENTE`  
  Entrega: Conferir README, guias backend/frontend, endpoints, modelagem, QA e logs.  
  Validação: Corrigir divergências.  
- [ ] **Etapa 18.7 — Atualizar changelog**  
  Status inicial: `PENDENTE`  
  Entrega: Registrar comportamento novo, mudanças de contrato e limitações conhecidas.  
  Validação: Conferir data e escopo.  
- [ ] **Etapa 18.8 — Gerar manifesto de validação**  
  Status inicial: `PENDENTE`  
  Entrega: Resumir status das fases, testes executados e pendências.  
  Validação: Manter pendências explícitas.  
- [ ] **Etapa 18.9 — Preparar empacotamento**  
  Status inicial: `PENDENTE`  
  Entrega: Remover caches, uploads locais, secrets e artefatos temporários.  
  Validação: Conferir `.gitignore` e pacote final.  
- [ ] **Etapa 18.10 — Marcar projeto como finalizado para MVP**  
  Status inicial: `PENDENTE`  
  Entrega: Somente se todas as fases anteriores estiverem `CONCLUIDA`.  
  Validação: Registrar conclusão final no log.  

## Futuro fora do MVP inicial

Estes itens só podem ser iniciados após decisão explícita:

- [ ] Login/cadastro.
- [ ] Dashboard autenticado.
- [ ] Histórico remoto.
- [ ] Biblioteca persistente.
- [ ] Compartilhamento público real.
- [ ] Push notifications reais.
- [ ] Admin completo.
- [ ] Planos/pagamentos.
- [ ] Moderação de partituras compartilhadas.
- [ ] Multiusuário com permissões.

## Bloqueio de escopo

Qualquer item futuro iniciado antes do MVP deve ser marcado como `BLOQUEADA` e registrado em `DECISIONS.md`, salvo se o usuário alterar explicitamente o escopo.
