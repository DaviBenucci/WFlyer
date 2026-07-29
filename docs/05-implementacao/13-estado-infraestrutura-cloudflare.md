# Estado da infraestrutura Cloudflare e origem Napoleon

**Status:** configuração de borda confirmada; origem definida.

## Confirmado

- zona W_Flyer já existe na Cloudflare;
- DNS já aponta para Cloudflare;
- `app.wflyer.com.br` é aplicação separada e intocável;
- origem do site institucional será a Napoleon;
- o código será obtido do GitHub;
- não utilizar VPS ou EasyPanel.

## Topologia

```text
Cloudflare
  → registro/proxy de wflyer.com.br
  → hostname/origem fornecida pela Napoleon
  → aplicação Node.js Next.js standalone
```

## Inventário antes de escrever DNS

O Codex/operador deve registrar em modo somente leitura:

- registros existentes;
- registros de e-mail;
- proxy e SSL;
- regras de redirect/cache/WAF;
- estado de `app.wflyer.com.br`;
- hostname de origem da Napoleon;
- disponibilidade de `staging.wflyer.com.br`.

O inventário não bloqueia o desenvolvimento do código. Bloqueia somente alterações de DNS e publicação.

## Regras não destrutivas

- não recriar zona ou nameservers;
- não apagar registros em massa;
- não alterar `app.wflyer.com.br`;
- não capturar subdomínios por wildcard;
- não aplicar cache em `/api/contact`;
- não ativar HSTS antes de validar todos os hosts;
- publicar staging antes de produção.

## Evidências de release

- resolução DNS;
- HTTPS válido;
- origem Napoleon saudável;
- formulário funcional;
- WAF/rate limit;
- `app.wflyer.com.br` operacional;
- rollback testado.
