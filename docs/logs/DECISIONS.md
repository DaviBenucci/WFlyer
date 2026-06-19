# Decisions Log

## ADR-001 — Projeto novo do zero

Status: ACEITA

Contexto:
O projeto antigo não deve ser base técnica da nova versão.

Decisão:
Construir nova aplicação do zero, mantendo apenas a ideia central.

Consequências:
Menos dívida técnica herdada e maior controle arquitetural.

## ADR-002 — MVP sem login

Status: ACEITA

Contexto:
A prioridade é validar transposição de PDF para instrumento destino.

Decisão:
Começar sem autenticação obrigatória.

Consequências:
Jobs usam `anonymous_session_id`, `job_id` e `download_token` temporário.

## ADR-003 — Processamento assíncrono

Status: ACEITA

Contexto:
OMR, MusicXML, transposição e renderização são tarefas pesadas.

Decisão:
API cria job e workers processam em fila.

Consequências:
Menor latência percebida e melhor escalabilidade.

## ADR-004 — Retenção de 15 dias

Status: ACEITA

Contexto:
Arquivos musicais podem ser sensíveis e ocupar storage.

Decisão:
Arquivos expiram após 15 dias no servidor.

Consequências:
Necessário scheduler de cleanup e estados de expiração no frontend.

## ADR-005 — Confiança só para admin

Status: ACEITA

Contexto:
Mostrar percentual de confiança pode gerar insegurança e confusão.

Decisão:
Usuário comum vê informações objetivas; admin vê métricas internas.

Consequências:
DTOs públicos e admin devem ser separados.
## ADR-006 — Implementação backend-first com frontend final bloqueado

Status: ACEITA

Contexto:
O guia anterior começava pelo frontend e estava simples demais para orientar o Codex em uma implementação completa, segura e sem alucinação.

Decisão:
A implementação passa a seguir ordem backend-first: infraestrutura, banco de dados, backend, upload, jobs, worker, pipeline musical, artefatos e hardening antes do frontend final. Um frontend simples de verificação é permitido apenas para validar backend e banco.

Consequências:
O Codex só pode iniciar o frontend final após backend MVP concluído, contratos congelados e validações registradas.

## ADR-007 — Gate rígido por etapa

Status: ACEITA

Contexto:
Etapas grandes ou soltas aumentam risco de soluções inventadas, falhas não testadas e documentação desatualizada.

Decisão:
Cada etapa possui status (`PENDENTE`, `EM_EXECUCAO`, `BLOQUEADA`, `CONCLUIDA`) e a próxima etapa só pode iniciar quando a anterior estiver `CONCLUIDA`.

Consequências:
Falhas ou imprevistos devem ser resolvidos por sub-etapas dentro da etapa atual antes de qualquer avanço.

## ADR-008 — Sub-etapas obrigatórias para imprevistos

Status: ACEITA

Contexto:
Durante a implementação podem surgir erros de dependência, incompatibilidade, falhas de teste, lacunas de documentação ou decisões técnicas pendentes.

Decisão:
Todo imprevisto deve gerar sub-etapa na etapa atual, com causa, correção, validação e resultado registrados.

Consequências:
O Codex não pode contornar falhas pulando para outra etapa. A rastreabilidade da implementação aumenta.
