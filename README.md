# W_Flyer institutional site

- **Domain:** `wflyer.com.br`
- **Separate application:** `app.wflyer.com.br`
- **Current status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **External configuration:** pending
- **Production:** not authorized
- **Status date:** 2026-08-10

This repository contains the normative documentation and implementation of the
W_Flyer institutional site. It presents the company, services, the music
application in public language, the delivery process, the portfolio, contact
channels, and institutional policies.

The institutional site is independent from the music application. OCR/OMR,
real transposition, harmonization, a database, authentication, and music
application administration are outside this repository.

## Delivery architecture

The project is static-first, but it is not a pure static export:

- pages, copy, images, and policies are statically generated where possible;
- the initial release has no database, CMS, authentication, or administration
  panel;
- only `POST /api/contact` requires a Node.js runtime;
- Napoleon's owner-confirmed integration independently pulls and builds the
  selected GitHub revision;
- the persistent runtime entry point is `.next/standalone/server.js`;
- GitHub Actions validates and records candidate provenance; it does not deploy
  the Actions archive to Napoleon;
- GitHub Environment values do not transfer automatically to Napoleon, so the
  Napoleon build/runtime values must be configured independently;
- Cloudflare remains the DNS, proxy, HTTPS, WAF, rate-limit, and Turnstile
  edge;
- VPS, EasyPanel, Docker, and a static `public_html` document root are not
  production requirements;
- `app.wflyer.com.br` remains separate and must not be modified.

The exact staging hostname and Napoleon target are owner-approved external
inputs that have not yet been recorded. No staging hostname is assumed by this
repository. Production deployment, production DNS changes, and a merge to
`main` require Davi Benucci's explicit approval.

## Authorized visual references

The implementation uses the approved examples as a visual system rather than
waiting for independent screenshots for every state:

1. [`wflyer-approved-master-board.png`](docs/design-reference/golden-pages/master/wflyer-approved-master-board.png)
   defines the global identity and approved panels;
2. [`application-desktop-light.png`](docs/design-reference/golden-pages/application/application-desktop-light.png)
   defines the Application page and tablet;
3. [`visual-archetypes.yaml`](docs/design-reference/golden-pages/visual-archetypes.yaml)
   defines how the remaining pages inherit composition;
4. [`10-especificacao-visual-paginas.md`](docs/02-design/10-especificacao-visual-paginas.md)
   defines route-specific content and structure;
5. the token, motion, and responsive specifications complete dark and mobile
   states.

Reference images must never become a background, texture, click map, or
frontend implementation. The production interface is semantic and original.

## Consolidated visual decisions

- the official symbol is centered in the desktop header;
- Home is the origin of two score branches;
- application branch: Application → How it works → Benefits → app →
  final barline;
- institutional branch: Company → Services → Process → Portfolio →
  Contact → final barline;
- the tablet is operable DOM content with bounded CSS 3D and GSAP motion;
- light and dark themes preserve the same geometry;
- mobile follows the normative responsive rules rather than copying the
  desktop composition literally.

## Publication profile

- public contact and form recipient: `davi.benucci@wflyer.com.br`;
- Instagram: [`@davibenucci`](https://www.instagram.com/davibenucci/);
- GitHub: [`DaviBenucci`](https://github.com/DaviBenucci);
- initial portfolio: W_Flyer, MSN Distribuidora, and MSN Suprimentos;
- analytics: disabled for the initial release;
- homologation owner: Davi Benucci.

## Required reading

1. [`AGENTS.md`](AGENTS.md)
2. [`PRE-CODE-STATUS.md`](PRE-CODE-STATUS.md)
3. [`docs/00-governanca/00-fonte-da-verdade.md`](docs/00-governanca/00-fonte-da-verdade.md)
4. [`docs/00-governanca/01-bloqueio-tecnologico.md`](docs/00-governanca/01-bloqueio-tecnologico.md)
5. [`docs/00-governanca/08-decisoes-operacionais-publicacao.md`](docs/00-governanca/08-decisoes-operacionais-publicacao.md)
6. [`docs/design-reference/golden-pages/IMPLEMENTATION-AUTHORIZATION.md`](docs/design-reference/golden-pages/IMPLEMENTATION-AUTHORIZATION.md)
7. [`docs/design-reference/golden-pages/visual-archetypes.yaml`](docs/design-reference/golden-pages/visual-archetypes.yaml)
8. [`docs/02-design/09-sistema-dupla-partitura.md`](docs/02-design/09-sistema-dupla-partitura.md)
9. [`docs/02-design/10-especificacao-visual-paginas.md`](docs/02-design/10-especificacao-visual-paginas.md)
10. [`docs/03-motion/03-catalogo-animacoes.md`](docs/03-motion/03-catalogo-animacoes.md)
11. [`docs/05-implementacao/14-contrato-execucao-integral-codex.md`](docs/05-implementacao/14-contrato-execucao-integral-codex.md)
12. [`docs/05-implementacao/16-github-actions-secrets-napoleon.md`](docs/05-implementacao/16-github-actions-secrets-napoleon.md)
13. [`docs/05-implementacao/22-napoleon-node-runtime-runbook.md`](docs/05-implementacao/22-napoleon-node-runtime-runbook.md)
14. [`docs/07-qa/05-criterios-aceite.md`](docs/07-qa/05-criterios-aceite.md)
15. [`docs/07-qa/09-staging-homologation-runbook.md`](docs/07-qa/09-staging-homologation-runbook.md)

## Execution rule

The implementation authorization and authorized-derived visual states remain
valid. The complete repository-owned source, browser, build, standalone,
indexing, dependency, documentation, OpenSpec, and Graphify gates are recorded
for the Phase 09 candidate. The current operational status is therefore
`CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`. Exact-SHA remote CI, external
configuration, staging deployment, human homologation, and production approval
remain separate gates.

## Local execution

Prerequisites:

- Node.js 24;
- Corepack enabled;
- pnpm 11.18.0.

Primary commands:

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build:storybook
pnpm test:storybook
pnpm test:e2e
pnpm build
pnpm prepare:standalone
pnpm lighthouse
```

After `pnpm build`, run `pnpm prepare:standalone` to copy public assets and
`.next/static` into the standalone tree. Start the deployable runtime with:

```bash
node .next/standalone/server.js
```

The manual release workflow validates and checksums a candidate while recording
`deployment.performed=false`. Napoleon separately pulls and builds the selected
Git revision. No current workflow publishes production, changes DNS, or touches
`app.wflyer.com.br`.

The accumulated phase record is maintained in
[`docs/05-implementacao/17-relatorio-execucao-codex.md`](docs/05-implementacao/17-relatorio-execucao-codex.md).
