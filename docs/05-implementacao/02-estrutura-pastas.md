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
│   └── design-reference/        não enviado ao build
└── openspec/
```

## Regra de Client Components

Somente componentes que precisam de eventos, estado do navegador, `localStorage`, GSAP ou controles do tablet recebem `"use client"`. Layout, conteúdo e páginas permanecem server/static sempre que possível.

## Regra para assets de referência

`docs/design-reference/` não pode ser importado por código produtivo, não pode ser copiado para `public/` e deve ser excluído de qualquer etapa que publique assets. Testes visuais podem ler os arquivos diretamente no workspace de CI.
