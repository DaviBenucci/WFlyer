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
turnstileToken: obrigatório, máximo 2048
website: honeypot, deve estar vazio
```

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

## Rate limit de borda — baseline

### Regra A

- expressão: método POST e caminho `/api/contact`;
- característica: IP;
- limite inicial: 3 requisições por 60 segundos;
- ação: Managed Challenge ou bloqueio, conforme plano e operação.

### Regra B

- mesma expressão;
- limite inicial: 10 requisições por 10 minutos;
- ação: bloqueio por 1 hora.

Os limites devem ser calibrados com tráfego real. A Cloudflare mantém contadores por características e localização de borda; eles não são um contador global de banco.

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

Nenhuma submissão será gravada pelo site. A retenção ocorrerá apenas nos sistemas de e-mail/provedor conforme políticas aplicáveis.
