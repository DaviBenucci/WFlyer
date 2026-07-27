# Bloqueio tecnológico

## Stack autorizada

| Camada | Decisão |
|---|---|
| Runtime | Node.js 24 LTS |
| Gerenciador | pnpm, fixado no campo `packageManager` |
| Framework | Next.js 16.2, App Router |
| UI | React 19.2 |
| Linguagem | TypeScript estrito |
| Estilização | Tailwind CSS 4 + CSS Custom Properties |
| Motion | GSAP 3 + ScrollTrigger + `@gsap/react` |
| Ilustração | SVG original e CSS |
| Conteúdo | MDX local + objetos TypeScript tipados |
| Validação | Zod |
| E-mail | Resend |
| Antispam | Cloudflare Turnstile |
| Rate limit | Cloudflare WAF Rate Limiting |
| Unitários | Vitest + Testing Library |
| Catálogo UI | Storybook |
| E2E | Playwright |
| Acessibilidade | axe-core + testes manuais |
| Performance | Lighthouse CI + métricas de runtime |
| Entrega | Docker Next.js standalone atrás da Cloudflare |

As versões de patch devem ser fixadas no bootstrap e atualizadas apenas por processo de manutenção. A linha inicial do Next.js deve conter, no mínimo, o patch de segurança `16.2.11`.

## Tecnologias proibidas na primeira versão

- Anime.js;
- Motion ou Framer Motion;
- React Spring;
- Lenis e qualquer smooth scroll global;
- Three.js ou React Three Fiber;
- Lottie;
- bibliotecas de partículas;
- shadcn/ui como sistema visual;
- bibliotecas gerais de componentes;
- CMS;
- banco de dados SQL, NoSQL, Redis ou KV;
- autenticação;
- analytics com rastreamento individual;
- IA em produção;
- código do aplicativo musical.

## Exceções

Uma exceção exige ADR aprovado contendo:

- problema concreto;
- alternativas avaliadas;
- impacto de bundle e runtime;
- impacto de acessibilidade;
- impacto de segurança;
- estratégia de remoção;
- testes adicionais;
- aprovação explícita do responsável pelo projeto.
