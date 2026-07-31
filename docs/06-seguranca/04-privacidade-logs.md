# Privacidade e logs

## Dados recebidos

- nome;
- e-mail;
- empresa opcional;
- tipo de projeto;
- mensagem;
- consentimento;
- sinais técnicos necessários à segurança.

## Não armazenar no site

- submissões em arquivo;
- banco de leads;
- cópias em analytics;
- tokens Turnstile;
- corpo integral em logs.

## Logs permitidos

- timestamp;
- request ID;
- status interno abstrato;
- duração;
- resultado agregado de Turnstile;
- resultado do provedor;
- código de erro sem payload;
- hash efêmero de IP somente se necessário e com retenção curta definida.

## Logs proibidos

- mensagem;
- e-mail completo;
- nome completo;
- token;
- segredo;
- headers completos;
- corpo bruto;
- IP bruto retido indefinidamente.

## Retenção

Definir política operacional curta para logs técnicos. O conteúdo da mensagem permanecerá nos provedores de e-mail envolvidos, sujeito à política institucional e legal final.

## Phase 08 operational gate

The application emits no contact-payload log. Before staging approval, the
owner must define and configure a short retention period for Napoleon and
Cloudflare technical logs, document who can access them, and verify that raw
request bodies, complete addresses, Turnstile tokens, and secrets are absent.
No retention duration is invented by the repository.
