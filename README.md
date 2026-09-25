# W_Flyer portfolio website

- **Public domain:** `wflyer.com.br`
- **Separate product:** `app.wflyer.com.br`
- **Current scope:** portfolio-only institutional website
- **Production:** not authorized
- **Canonical plan:** [`WFLYER_IMPLEMENTATION_PLAN.md`](WFLYER_IMPLEMENTATION_PLAN.md)

This repository implements Davi Benucci's personal professional portfolio and
service-acquisition website under the W_Flyer brand. W_Flyer is not presented
publicly as a company.

## Approved experience

- Home is the single musical and spatial origin.
- Desktop uses native vertical scroll as the source for one progressively
  enhanced story: Home → Sobre → Serviços → Processo → Projetos → Contato.
- Mobile uses the same semantic order followed by the global footer.
- Detailed service, project, contact, legal, and accessibility routes remain
  independently readable and indexable where approved.
- Header traversal uses the same native-scroll story position and is capped at
  3.0 seconds.
- The separate musical application is not exposed as an institutional story
  branch by this website.

## Required reading

1. [`AGENTS.md`](AGENTS.md)
2. [`WFLYER_IMPLEMENTATION_PLAN.md`](WFLYER_IMPLEMENTATION_PLAN.md)
3. [`docs/canonical-v2/README.md`](docs/canonical-v2/README.md)
4. [`docs/canonical-v2/06-migration/CURRENT_HANDOFF.md`](docs/canonical-v2/06-migration/CURRENT_HANDOFF.md)

## Retained architecture

- Next.js App Router, React, strict TypeScript;
- Tailwind CSS 4, GSAP/ScrollTrigger, semantic HTML, and approved inline SVG;
- secure `POST /api/contact` with Zod, strict request/origin controls,
  Cloudflare Turnstile, and Resend;
- standalone Next.js Node deployment on Napoleon with Registro.br delegation;
- no database, authentication, CMS, analytics, advertising pixels, or session
  replay for the initial website release;
- `app.wflyer.com.br` remains independent and untouched.

## Local validation

```bash
pnpm validate:dependencies
pnpm lint
pnpm typecheck
pnpm test
pnpm build:storybook
pnpm test:storybook
pnpm test:e2e
pnpm test:motion
pnpm test:visual
pnpm test:a11y
pnpm build
```

ADR-053 / `ASM-IMP-DEC-017` supersedes the former bidirectional institutional
story. Frozen Phase-9 and audit records retain that historical topology only as
historical evidence.
