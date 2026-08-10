# Repository folder structure

The following tree documents the repository-owned source layout. Generated and
ignored build output is described separately because it must not be committed
or treated as source.

```text
wflyer-site/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── scripts/
│   └── prepare-standalone.mjs
├── public/
│   ├── brand/official/
│   ├── score/
│   │   ├── staffs/
│   │   ├── notes/
│   │   ├── clef/
│   │   └── barlines/
│   ├── demo/
│   ├── portfolio/
│   └── social/
├── content/
│   ├── pages/
│   ├── services/
│   ├── portfolio/
│   └── policies/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts
│   │   ├── aplicacao-wflyer/
│   │   │   ├── como-funciona/page.tsx
│   │   │   ├── beneficios/page.tsx
│   │   │   └── page.tsx
│   │   ├── contato/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── processo/page.tsx
│   │   ├── servicos/
│   │   │   ├── criacao-de-sites/page.tsx
│   │   │   ├── criacao-de-aplicacoes/page.tsx
│   │   │   ├── integracoes/page.tsx
│   │   │   ├── solucoes-sob-medida/page.tsx
│   │   │   └── page.tsx
│   │   ├── sobre/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── primitives/
│   │   ├── brand/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── chapters/
│   │   ├── score/
│   │   ├── demo/
│   │   ├── forms/
│   │   └── experience/
│   ├── config/
│   │   ├── score-chapters.ts
│   │   ├── navigation.ts
│   │   └── site.ts
│   ├── lib/
│   │   ├── content/
│   │   ├── motion/
│   │   ├── score/
│   │   ├── security/
│   │   ├── email/
│   │   ├── seo/
│   │   └── validation/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tokens.css
│   │   ├── score.css
│   │   └── motion.css
│   └── types/
├── tests/
│   ├── unit/
│   ├── e2e/
│   ├── visual/
│   ├── motion/
│   └── accessibility/
├── docs/
│   └── design-reference/        excluded from production output
└── openspec/
```

The tree is a responsibility map, not an assertion that every optional folder
must exist. Actual tracked paths remain authoritative.

## Generated Node.js runtime

`pnpm build` creates ignored `.next/` output. Running
`pnpm prepare:standalone` after the build copies the required public assets and
`.next/static` files into the standalone tree. The resulting persistent Node.js
entry point is:

```text
.next/standalone/server.js
```

The supported start command is:

```bash
node .next/standalone/server.js
```

There is no repository-root `server.js` adapter. The deployment must not use a
static `public_html` document root because `POST /api/contact` requires the
standalone Node.js process.

## Client Component rule

Only components that require browser events, browser state, `localStorage`,
GSAP, or tablet controls receive the `"use client"` directive. Layout, content,
and pages remain Server Components or static output whenever possible.

## Reference asset rule

Production code must not import `docs/design-reference/`, copy it into
`public/`, or include it in any published asset step. Visual tests may read
those files directly from the CI workspace.
