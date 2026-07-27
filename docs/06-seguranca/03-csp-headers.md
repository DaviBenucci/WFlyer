# CSP e cabeçalhos HTTP

## Cabeçalhos obrigatórios

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

## CSP baseline

A CSP deve iniciar em `Report-Only`, ser testada com Next.js, GSAP e Turnstile, e depois ser aplicada. Diretriz inicial:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
form-action 'self';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' https://challenges.cloudflare.com https://api.resend.com;
frame-src https://challenges.cloudflare.com;
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com;
style-src 'self';
style-src-attr 'unsafe-inline';
upgrade-insecure-requests;
```

## Observações

- `api.resend.com` normalmente é acessado apenas pelo servidor; remover do CSP se não houver chamada cliente;
- `unsafe-eval` é proibido em produção;
- `unsafe-inline` em script deve ser reduzido se a estratégia de nonce/hash puder ser aplicada sem destruir a geração estática;
- não habilitar origem que não seja realmente usada;
- Turnstile exige diretivas compatíveis com seus recursos;
- a CSP final deve ser derivada do build real e testada.

## API

`/api/contact` deve adicionar:

```http
Cache-Control: no-store
Content-Type: application/json; charset=utf-8
```

Não expor detalhes de stack, IDs internos ou corpo recebido.
