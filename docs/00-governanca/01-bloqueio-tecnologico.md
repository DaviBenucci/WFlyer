# Bloqueio tecnológico

## Stack autorizada

| Camada | Decisão |
|---|---|
| Runtime | Node.js 24 LTS |
| Gerenciador | pnpm fixado em `packageManager` |
| Framework | Next.js 16.2 App Router |
| UI | React 19.2 |
| Linguagem | TypeScript estrito |
| Estilização | Tailwind CSS 4 + CSS Custom Properties |
| Motion | GSAP 3 + ScrollTrigger + `@gsap/react` |
| Tablet | CSS 3D limitado, sem WebGL |
| Ilustração | SVG original e CSS |
| Conteúdo | MDX local + objetos TypeScript tipados |
| Validação | Zod |
| E-mail | Resend |
| Antispam | Cloudflare Turnstile |
| Rate limit | Cloudflare WAF Rate Limiting |
| Testes | Vitest, Testing Library, Storybook, Playwright, axe-core e Lighthouse CI |
| Repositório/CI | GitHub + GitHub Actions |
| Hospedagem | Napoleon, aplicação Node.js conectada ao GitHub |
| Borda | Cloudflare DNS/proxy/HTTPS/WAF |
| Build | Next.js `output: standalone`, sem Docker obrigatório |

## Tecnologias e serviços proibidos na primeira versão

- Anime.js, Motion/Framer Motion, React Spring;
- Lenis ou smooth scroll global;
- Three.js, React Three Fiber, WebGL, Lottie ou partículas;
- Canvas para páginas, pauta ou tablet;
- shadcn/ui ou biblioteca geral de componentes;
- CMS, SQL, NoSQL, Redis, KV, autenticação;
- analytics, pixels, session replay ou rastreamento comportamental;
- IA em produção;
- código do aplicativo musical;
- golden reference como asset produtivo;
- VPS, EasyPanel ou Docker como requisito operacional do lançamento.

## Exceções

Qualquer exceção exige ADR com problema, alternativas, impacto de bundle, acessibilidade, segurança, testes, remoção e aprovação explícita do responsável.
