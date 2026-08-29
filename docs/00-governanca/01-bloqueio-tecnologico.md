# Bloqueio tecnológico

## Stack autorizada

| Camada | Decisão |
|---|---|
| Runtime | Node.js 24 LTS |
| Gerenciador | pnpm fixado em `packageManager` |
| Framework | Next.js 16.3 App Router |
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
| Rate limit | Controle de aplicação/provedor somente quando suportado, configurado e evidenciado |
| Testes | Vitest, Testing Library, Storybook, Playwright, axe-core e Lighthouse CI |
| Repositório/CI | GitHub + GitHub Actions |
| Hospedagem | Napoleon, DNS autoritativo e aplicação Node.js conectada ao GitHub |
| Entrega | Registro.br delega ao DNS autoritativo Napoleon; HTTPS/redirect/cache/WAF dependem de controles Napoleon observados |
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
