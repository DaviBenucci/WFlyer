# Modelo de ameaças

## Ativos

- disponibilidade do site;
- reputação do domínio;
- chaves Turnstile e Resend;
- caixa de entrada institucional;
- dados enviados no formulário;
- integridade do conteúdo;
- cadeia de dependências.

## Ameaças principais

| Ameaça | Impacto | Controle |
|---|---|---|
| spam automatizado | custo e caixa saturada | Turnstile, honeypot, rate limit |
| abuso de endpoint | disponibilidade/custo | limite de payload, origem, Turnstile, timeout e controle Napoleon somente se evidenciado |
| duplicate delivery after a deadline | repeated contact | ephemeral UUID and idempotency key per logical submission |
| header injection | envio malicioso | campos fixos, normalização, validação |
| XSS | execução de script | sem HTML do usuário, CSP, escaping |
| vazamento de segredo | abuso de APIs | env server-only, revisão de bundle |
| supply chain | código comprometido | lockfile, versões exatas, auditoria |
| clickjacking | interface enganosa | `frame-ancestors 'none'` e X-Frame-Options |
| scraping/DoS | recursos consumidos | limites da aplicação/hospedagem, timeouts e controles Napoleon somente se evidenciados |
| vazamento em logs | privacidade | logging mínimo e sanitizado |
| conteúdo enganoso | reputação/jurídico | revisão editorial e sem cases fictícios |

## Limitações aceitas

- nenhum WAF/rate limit de hospedagem é presumido; se aprovado, seu escopo e
  semântica de contagem devem ser evidenciados;
- e-mail permanece sujeito à disponibilidade do provedor;
- retry deduplication is limited to Resend's 24-hour idempotency window;
- não há fila persistente; falha de envio exige nova tentativa do usuário;
- sem banco, o site não possui histórico próprio de mensagens.
