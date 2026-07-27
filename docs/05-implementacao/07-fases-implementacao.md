# Fases de implementação

## Regra absoluta

A fase seguinte só começa quando a atual estiver `CONCLUÍDA` segundo os gates definidos.

## Fase 0 — Preparação e governança

- criar repositório separado;
- copiar documentação;
- configurar Node/pnpm;
- fixar versões;
- configurar lint, format, TypeScript e CI;
- configurar OpenSpec e AGENTS;
- registrar baseline.

**Gate:** build vazio, lint, typecheck e testes de infraestrutura verdes.

## Fase 1 — Fundações estáticas

- App Router;
- rotas básicas;
- layout, metadata e fontes provisórias;
- tokens claro/escuro;
- conteúdo local;
- componentes primitivos;
- Storybook inicial.

**Gate:** todas as rotas renderizam sem GSAP e sem formulário.

## Fase 2 — Header e navegação

- compassos;
- marca textual central;
- menu mobile;
- tema;
- âncoras;
- estado ativo;
- teclado e foco.

**Gate:** E2E de navegação e axe sem violações críticas.

## Fase 3 — Partitura SVG estática

- geometria ondulada;
- cinco linhas;
- barras e notas originais;
- capítulos posicionados;
- fallback vertical.

**Gate:** golden references estáticas aprovadas em todos os breakpoints.

## Fase 4 — Motion

- entrada;
- ScrollTrigger;
- deslocamento horizontal;
- sincronização do header;
- reações discretas;
- reduced motion.

**Gate:** regressão visual, testes de direção e orçamento de performance.

## Fase 5 — Conteúdo completo

- empresa;
- serviços;
- aplicação pública;
- processo;
- portfólio vazio honesto;
- páginas internas;
- políticas provisórias.

**Gate:** revisão editorial e SEO técnico.

## Fase 6 — Contato e segurança

- Route Handler;
- Zod;
- Turnstile;
- Resend;
- headers;
- WAF/rate limit;
- logs mínimos;
- testes de abuso.

**Gate:** testes de segurança e entrega real em ambiente de staging.

## Fase 7 — QA, performance e release

- Playwright completo;
- Storybook;
- Lighthouse CI;
- dispositivos reais;
- revisão de licenças;
- revisão legal;
- rollback;
- checklist de release.

**Gate:** todos os critérios de aceite aprovados.
