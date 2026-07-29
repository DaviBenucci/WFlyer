# Decisões operacionais e de publicação

**Status:** aprovado em 2026-07-29.

## Repositório

- plataforma: GitHub;
- proprietário: `DaviBenucci`;
- repositório normativo: o repositório GitHub que contém este pacote W_Flyer;
- aplicação musical permanece em projeto separado;
- GitHub Actions executa CI, testes e automação de deploy.

## Hospedagem

- provedor de origem: Napoleon;
- modelo: aplicação Node.js vinculada ao repositório GitHub;
- Cloudflare continua responsável por DNS, proxy, HTTPS, WAF, rate limit e Turnstile;
- não utilizar VPS ou EasyPanel;
- Docker pode existir apenas como ferramenta local opcional, nunca como dependência normativa de produção.

## Segredos

A fonte canônica dos valores confidenciais é GitHub Actions Secrets. O workflow deve validar e transmitir os valores ao ambiente de execução da Napoleon. Secrets nunca entram no repositório, logs, screenshots ou artefatos públicos.

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
