# W_Flyer portfolio and product presentation website

- **Public domain:** `wflyer.com.br`
- **Separate application:** `app.wflyer.com.br`
- **Current status:** `V2_CANONICAL_DOCUMENTATION_APPROVED_IMPLEMENTATION_PENDING`
- **Production:** not authorized
- **Canonical plan:** [`WFLYER_IMPLEMENTATION_PLAN.md`](WFLYER_IMPLEMENTATION_PLAN.md)

This repository is being re-architected from a route-transition institutional-site implementation into a scroll-driven personal portfolio and service-acquisition experience under the W_Flyer brand.

## Approved v2 experience

- W_Flyer is a brand, not a publicly presented company.
- The landing is an immersive summary; detailed pages remain available.
- Desktop uses native vertical scroll mapped to a horizontal story with Home as the semantic origin.
- Mobile/tablet uses a vertical story: professional portfolio first, application presentation second.
- The header is a fast alternative that traverses the same story through intermediate chapters, capped at 3.0 seconds.
- Two continuous organic musical scores connect Home to the application and professional terminals.
- The application access CTA appears only in the terminal `Access W_Flyer` scene.
- The professional branch is About → Services → Process → Projects → Contact.
- The application branch is Application → How It Works → Benefits → Demonstration → Access W_Flyer.

## Required reading

1. [`AGENTS.md`](AGENTS.md)
2. [`PRE-CODE-STATUS.md`](PRE-CODE-STATUS.md)
3. [`WFLYER_CODEX_START_HERE.md`](WFLYER_CODEX_START_HERE.md)
4. [`WFLYER_IMPLEMENTATION_PLAN.md`](WFLYER_IMPLEMENTATION_PLAN.md)
5. [`docs/canonical-v2/README.md`](docs/canonical-v2/README.md)

## Retained architecture

- Next.js App Router, React, strict TypeScript;
- Next.js standalone Node deployment on Napoleon, with Registro.br delegating to
  Napoleon authoritative DNS;
- secure `POST /api/contact` with Zod, strict request/origin controls,
  independent Cloudflare Turnstile, and Resend;
- Cloudflare DNS, proxy, and WAF are not in the active request path;
- no database, authentication, CMS, or analytics for the initial website release;
- `app.wflyer.com.br` remains independent and untouched.

## Local commands

```bash
pnpm install --frozen-lockfile
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
pnpm prepare:standalone
```

The current code still contains legacy v1 behavior until the linear migration plan is executed. Do not treat the old `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING` status as valid for the approved v2 target.
