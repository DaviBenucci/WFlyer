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
