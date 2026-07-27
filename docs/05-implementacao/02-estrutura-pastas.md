# Estrutura de pastas proposta

```text
wflyer-site/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── Dockerfile
├── public/
│   ├── brand/provisional/
│   ├── score/
│   ├── portfolio/
│   └── social/
├── content/
│   ├── services/
│   ├── portfolio/
│   └── policies/
├── src/
│   ├── app/
│   │   ├── api/contact/route.ts
│   │   ├── aplicacao-wflyer/
│   │   ├── contato/
│   │   ├── portfolio/
│   │   ├── servicos/
│   │   ├── sobre/
│   │   └── page.tsx
│   ├── components/
│   │   ├── primitives/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── sections/
│   │   ├── score/
│   │   ├── forms/
│   │   └── experience/
│   ├── lib/
│   │   ├── content/
│   │   ├── motion/
│   │   ├── security/
│   │   ├── email/
│   │   ├── seo/
│   │   └── validation/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── provisional-tokens.css
│   │   └── motion.css
│   └── types/
├── tests/
│   ├── unit/
│   ├── e2e/
│   ├── visual/
│   └── accessibility/
├── docs/
└── openspec/
```

## Regra de Client Components

Somente componentes que precisam de eventos, estado do navegador, localStorage ou GSAP recebem `"use client"`. Layout, conteúdo e páginas permanecem server/static sempre que possível.
