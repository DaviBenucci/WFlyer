# W_Flyer — documentação do site institucional

**Domínio previsto:** `wflyer.com.br`  
**Aplicação separada:** `app.wflyer.com.br`  
**Status:** especificação normativa atualizada — versão 1.1  
**Data-base:** 2026-07-29

Este pacote documenta o site institucional da futura empresa W_Flyer. O site apresenta a empresa, seus serviços, a aplicação musical em linguagem comercial, o portfólio, o contato e as políticas institucionais.

O site institucional é um projeto independente do aplicativo musical. A documentação técnica do motor musical, OCR, transposição, harmonização, processamento de partituras, banco de dados e administração da aplicação **não integra o escopo deste repositório**.

## Classificação arquitetural

O projeto é **static-first**, e não um `static export` puro:

- páginas, textos, imagens e políticas serão gerados estaticamente no build;
- não haverá banco de dados, CMS, autenticação ou painel administrativo na primeira versão;
- somente `POST /api/contact` requer execução no servidor para validar o formulário e enviar e-mail;
- o site será publicado em um contêiner Next.js standalone, atrás da Cloudflare.

## Decisões consolidadas

- Next.js 16.2, React 19.2 e TypeScript estrito;
- Tailwind CSS 4 e CSS Custom Properties;
- GSAP, ScrollTrigger e `@gsap/react` como único conjunto de animação programática;
- SVG original para pauta, clave de sol, notas e compassos;
- conteúdo local em MDX/TypeScript;
- formulário por Route Handler, Zod, Cloudflare Turnstile, Cloudflare WAF Rate Limiting e Resend;
- Storybook, Vitest, Playwright, axe-core e Lighthouse CI;
- ausência de banco de dados na versão inicial;
- logo W_Flyer oficial; paleta e tokens de interface ainda versionáveis;
- abertura vetorial com SVG oficial, GSAP, Ink Transfer e handoff para a homepage.

## Leitura obrigatória

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/00-indice.md`](docs/00-indice.md)
3. [`docs/00-governanca/00-fonte-da-verdade.md`](docs/00-governanca/00-fonte-da-verdade.md)
4. [`docs/00-governanca/01-bloqueio-tecnologico.md`](docs/00-governanca/01-bloqueio-tecnologico.md)
5. [`docs/02-design/04-homepage.md`](docs/02-design/04-homepage.md)
6. [`docs/05-implementacao/07-fases-implementacao.md`](docs/05-implementacao/07-fases-implementacao.md)
7. [`docs/03-motion/06-animacao-entrada-marca.md`](docs/03-motion/06-animacao-entrada-marca.md)
8. [`docs/07-qa/05-criterios-aceite.md`](docs/07-qa/05-criterios-aceite.md)

## Regra de implementação

A IA só pode avançar para a fase seguinte quando todos os critérios da fase atual estiverem concluídos, testados e registrados. Alterações de stack, arquitetura, identidade oficial ou escopo exigem decisão registrada.
