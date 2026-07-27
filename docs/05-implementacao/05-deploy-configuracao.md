# Deploy e configuração

## Topologia

```text
Internet → Cloudflare → proxy/HTTPS → contêiner Next.js standalone
```

## Docker

- build multistage;
- usuário não-root;
- imagem mínima compatível com Node.js 24 LTS;
- `output: "standalone"`;
- somente artefatos necessários no runtime;
- healthcheck sem dados sensíveis;
- filesystem de runtime sem expectativa de persistência.

## Variáveis

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_RECIPIENT_EMAIL
CONTACT_ALLOWED_ORIGINS
```

Somente as três variáveis explicitamente públicas podem usar `NEXT_PUBLIC_`.

## Ambientes

- local;
- preview/staging;
- production.

Cada ambiente usa chaves e origens próprias. Nunca reutilizar segredo de produção em preview.

## DNS e Cloudflare

- proxy habilitado;
- HTTPS obrigatório;
- WAF e rate limit configurados;
- cache exclui `/api/contact`;
- registrar regras em infraestrutura/documentação;
- validar Turnstile para host correto.

## Rollback

- manter imagem anterior identificada;
- deploy imutável por tag/commit;
- rollback sem migrations, pois não há banco;
- smoke test após rollback.
