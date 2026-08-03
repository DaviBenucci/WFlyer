# Decisões operacionais e de publicação

**Status:** aprovado em 2026-07-29.

## Repositório

- plataforma: GitHub;
- proprietário: `DaviBenucci`;
- repositório normativo: o repositório GitHub que contém este pacote W_Flyer;
- aplicação musical permanece em projeto separado;
- GitHub Actions executes CI, tests, and immutable candidate packaging. It has
  read-only repository permission and does not author or push deployment
  commits.

## Hospedagem

- provedor de origem: Napoleon;
- modelo: aplicação Node.js vinculada ao repositório GitHub;
- confirmed source integration: Napoleon pulls/builds the selected GitHub
  branch; staging uses `develop/site-institucional` and production remains
  gated on `main` plus explicit homologation;
- Cloudflare continua responsável por DNS, proxy, HTTPS, WAF, rate limit e Turnstile;
- não utilizar VPS ou EasyPanel;
- Docker pode existir apenas como ferramenta local opcional, nunca como dependência normativa de produção.

## Segredos

A fonte canônica dos valores confidenciais é GitHub Actions Secrets. The
corresponding runtime values must be configured explicitly in the Napoleon
application panel because a Git branch link does not transfer GitHub Secrets.
The workflow validates names and candidate configuration but does not print or
transport values through an invented integration. Secrets nunca entram no
repositório, logs, screenshots ou artefatos públicos.

## Contato e redes

- e-mail público: `davi.benucci@wflyer.com.br`;
- destinatário do formulário: `davi.benucci@wflyer.com.br`;
- Instagram: `https://www.instagram.com/davibenucci/`;
- GitHub: `https://github.com/DaviBenucci`;
- outras redes devem ser omitidas.

## Portfólio inicial

1. W_Flyer — produto próprio e site institucional;
2. MSN Distribuidora — e-commerce em `https://msndistribuidora.com.br`;
3. MSN Suprimentos — site comercial/institucional em `https://msnsuprimentos.com.br`.

Não publicar métricas ou resultados não comprovados. O estado de cada projeto deve refletir o que estiver publicamente disponível no momento do lançamento.

## Analytics

Não instalar analytics, pixels, session replay ou cookies de marketing na versão inicial. Logs técnicos mínimos da Cloudflare, Napoleon e aplicação não devem ser tratados como analytics de produto.

## Homologação

- responsável final: Davi Benucci;
- produção somente após homologação em staging;
- qualquer divergência visual ou funcional apontada pelo responsável reabre o gate da fase correspondente.
