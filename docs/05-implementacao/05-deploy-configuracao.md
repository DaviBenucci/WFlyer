# Deploy e configuração

## Topologia normativa

```text
Internet
  → Cloudflare DNS/proxy/HTTPS/WAF
  → Napoleon (aplicação Node.js conectada ao GitHub)
  → Next.js standalone
```

Não utilizar VPS ou EasyPanel. Docker não é requisito de produção.

## Repositório e branches

- plataforma: GitHub;
- conta: `DaviBenucci`;
- `main`: produção;
- `develop/site-institucional`: staging;
- features por fase;
- Napoleon deve apontar para a branch do ambiente correspondente ou receber artefato produzido pelo workflow.

## Build Node.js

- Node.js 24 LTS;
- `corepack enable`;
- `pnpm install --frozen-lockfile`;
- `pnpm build`;
- `next.config.ts` com `output: 'standalone'`;
- copiar `public` e `.next/static` para a saída standalone;
- iniciar pelo `server.js` da saída standalone ou adaptador mínimo documentado para o gerenciador Node.js da Napoleon;
- expor a porta fornecida pelo ambiente e respeitar `HOSTNAME=0.0.0.0` quando necessário.

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

Valores não entram no Git. A fonte canônica é GitHub Actions Secrets. O workflow deve disponibilizar os valores ao build e ao runtime da Napoleon. GitHub Actions Secrets não são considerados automaticamente presentes no processo Node hospedado.

## Valores públicos fixos

```text
NEXT_PUBLIC_SITE_URL=https://wflyer.com.br
NEXT_PUBLIC_APP_URL=https://app.wflyer.com.br
CONTACT_FROM_EMAIL=davi.benucci@wflyer.com.br
CONTACT_RECIPIENT_EMAIL=davi.benucci@wflyer.com.br
```

O remetente só pode ser usado depois da validação do domínio no Resend.

## Ambientes

- local;
- staging em branch dedicada e, preferencialmente, `staging.wflyer.com.br`;
- produção em `wflyer.com.br`;
- chaves Turnstile separadas;
- produção somente após homologação de Davi Benucci.

## Cloudflare

- preservar zona, nameservers e registros de e-mail;
- manter `app.wflyer.com.br` intocável;
- `www` redireciona para domínio raiz;
- cache não inclui `/api/contact`;
- WAF e rate limit específicos;
- SSL `Full (strict)` após certificado válido na Napoleon;
- HSTS somente após validação de todos os subdomínios.

## Rollback

- release identificada por commit/tag;
- Napoleon deve permitir selecionar o commit anterior ou redeploy da release anterior;
- smoke test após deploy e rollback;
- verificar explicitamente `app.wflyer.com.br`.
