# Supersession Map

## Directly superseded legacy target documents

| Legacy path | Reason | Canonical replacement |
|---|---|---|
| `docs/00-governanca/07-adr-dupla-partitura-e-paginas-visuais.md` | route-per-page topology | ADR-025, 030–032, 037 |
| `docs/01-produto/04-arquitetura-informacao.md` | old chapter graph/header | `01-product/02-information-architecture-and-routes.md` |
| `docs/02-design/09-sistema-dupla-partitura.md` | independent chapter scores | `03-visual/01-continuous-dual-score-system.md` |
| `docs/03-motion/02-narrativa-dupla-partitura.md` | route transition coordinator | `02-experience/03-desktop-scroll-header-history.md` |
| `docs/03-motion/08-tablet-interativo.md` | interactive DOM demo | `03-visual/05-application-demo-device.md` |
| `docs/05-implementacao/07-fases-implementacao.md` | old phases | root `WFLYER_IMPLEMENTATION_PLAN.md` |
| `docs/05-implementacao/14-contrato-execucao-integral-codex.md` | old execution authority | root prompt/plan + v2 migration docs |
| `docs/07-qa/05-criterios-aceite.md` | old route/tablet acceptance | `07-quality/**` |
| `openspec/specs/score-transition-navigation/spec.md` old content | route-transition model | replaced v2 capability content |
| `openspec/specs/interactive-application-demo/spec.md` old content | interactive controls | replaced v2 capability content |

## Retained domains

The following remain authoritative unless a v2 document explicitly refines them:

- technology lock and dependency policy;
- separate application boundary;
- contact endpoint, validation, Turnstile, Resend, origin/content-type checks, no persistence;
- legal pages and no-analytics policy;
- Registro.br delegation, Napoleon authoritative DNS and Node hosting, and
  independent Cloudflare Turnstile topology;
- exact-SHA deployment and owner homologation;
- theme and approved brand identity geometry;
- standalone Next.js runtime.

ADR-040 explicitly refines the retained infrastructure domain. Any
lower-precedence record that describes Cloudflare as authoritative DNS, proxy,
WAF, redirect, cache-purge, or DNS-API owner is historical for that topology.
Cloudflare Turnstile references remain retained where they describe the
independent anti-abuse integration.

## Current tests

A test that encodes a superseded behavior is migration evidence, not a target requirement. It may be replaced only after equivalent v2 coverage exists and the phase gate is satisfied.
