# Formulário de contato

## Endpoint

```http
POST /api/contact
Content-Type: application/json
Cache-Control: no-store
```

Runtime: Node.js.

## Payload máximo

16 KB. Não aceitar anexos, HTML, campos desconhecidos ou arrays arbitrários.

## Schema

```text
name: 2..100 caracteres
email: formato válido, máximo 254
company: opcional, máximo 120
projectType: enum permitido
message: 20..3000 caracteres
privacyConsent: true
submissionId: required logical-submission UUID
turnstileToken: obrigatório, máximo 2048
website: honeypot, deve estar vazio
```

`submissionId` is created with browser Web Crypto only when a logical
submission begins. A retry without form edits reuses the same UUID. After
success, or as soon as any field in a failed attempt is edited, the identifier
is discarded and the next send creates another. It is not a visible field,
credential, rate-limit mechanism, or visitor identifier.

## Sequência de validação

1. método e rota;
2. `Content-Type`;
3. tamanho do corpo;
4. origem permitida;
5. parse JSON com tratamento de erro;
6. honeypot;
7. Zod;
8. Turnstile no Siteverify;
9. conferir `success`, `hostname` e `action=contact`;
10. montar e-mail com campos escapados;
11. destinatário e remetente fixos no servidor;
12. enviar pelo Resend;
13. retornar resposta genérica.

## Rate limit de hospedagem — proposta condicional

Não há WAF/rate limit ativo presumido. As regras abaixo são somente uma
proposta de calibração caso a Napoleon exponha capacidade equivalente e o
responsável a aprove após inventário e validação em staging.

### Regra A

- expressão: método POST e caminho `/api/contact`;
- característica: IP;
- limite inicial: 3 requisições por 60 segundos;
- ação: Managed Challenge ou bloqueio, conforme plano e operação.

### Regra B

- mesma expressão;
- limite inicial: 10 requisições por 10 minutos;
- ação: bloqueio por 1 hora.

Os limites devem ser calibrados com tráfego real. A semântica e o escopo dos
contadores dependem do controle Napoleon efetivamente disponível e devem ser
registrados; eles nunca são tratados como um contador global de banco.

## CORS e origem

- não enviar `Access-Control-Allow-Origin: *`;
- aceitar somente os hosts oficiais e ambientes autorizados;
- rejeitar `Origin` externo;
- não confiar apenas em `Referer`;
- o endpoint não usa cookies de sessão.

## E-mail

- `from` controlado pelo servidor;
- `to` controlado pelo servidor;
- `replyTo` somente após validar o e-mail;
- assunto construído com valores enumerados e texto normalizado;
- mensagem do visitante tratada como texto;
- não interpolar entrada em cabeçalhos sem sanitização.
- use `contact/<submissionId>` as the Resend idempotency key;
- retain the eight-second application deadline and generic public response;
- the key prevents a second delivery for an unchanged retry during the
  provider's 24-hour idempotency window, including when the first send finishes
  after the local deadline; the deadline does not imply SDK cancellation.

## Códigos

| Código | Situação |
|---|---|
| 200 | mensagem enviada |
| 400 | payload inválido ou Turnstile inválido |
| 403 | origem não permitida |
| 413 | payload excessivo |
| 415 | Content-Type inválido |
| 429 | rate limit |
| 502/503 | provedor indisponível |

## Sem persistência

Nenhuma submissão será gravada pelo site. The UUID remains only in page memory
during the logical attempt and MUST NOT be logged or returned by the API.
A retenção ocorrerá apenas nos sistemas de e-mail/provedor conforme políticas
aplicáveis.
