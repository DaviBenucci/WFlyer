# Fases de implementação

## Regra absoluta

A fase seguinte só começa quando a atual estiver concluída e testada. As páginas usam a referência ou o arquétipo autorizado da matriz.

## Fase 0 — Fundação

- validar documentação e manifests;
- criar projeto Next.js e pnpm;
- fixar versões;
- configurar lint, TypeScript, Vitest, Storybook, Playwright, axe e Lighthouse;
- criar GitHub Actions;
- preparar build standalone;
- registrar inventário Cloudflare somente leitura sem bloquear código.

**Gate:** build, lint, typecheck e testes-base verdes.

## Fase 1 — Sistema visual

- tokens, fontes e temas;
- componentes primitivos;
- header e navegação;
- componentes de pauta;
- catálogo Storybook;
- mapa de arquétipos tipado.

**Gate:** componentes correspondem à prancha e à Aplicação aprovada.

## Fase 2 — Conteúdo e rotas estáticas

- todas as rotas;
- conteúdo local;
- perfil de publicação;
- páginas legais;
- SEO base;
- sem motion.

**Gate:** todas as rotas renderizam e são navegáveis por teclado.

## Fase 3 — Home e dupla partitura

- Home bifurcada;
- pauta contínua;
- âncoras;
- barras finais;
- fallback mobile/vertical.

**Gate:** narrativa correta em claro/escuro e desktop/mobile.

## Fase 4 — Páginas por arquétipo

Ordem: Aplicação, Como funciona, Benefícios, Empresa, Serviços, Processo, Portfólio, Contato, detalhes e políticas.

Para cada página:

1. ler matriz e arquétipo;
2. implementar claro;
3. derivar escuro;
4. adaptar mobile;
5. capturar screenshots;
6. comparar com fontes visuais;
7. executar visual, axe e E2E;
8. registrar gate.

## Fase 5 — Motion e navegação

- transições adjacentes;
- salto comprimido;
- pivô pela Home;
- foco, histórico e deep links;
- reduced motion;
- timeout seguro.

## Fase 6 — Tablet

- CSS 3D;
- tela DOM;
- simulação local;
- teclado, toque e mouse;
- estados Storybook.

## Fase 7 — Abertura e motion local

- introdução oficial;
- handoff para Home;
- reveals, cards, notas e cadências;
- skip e sessão.

## Fase 8 — Contato, segurança e conteúdo final

- Zod, Turnstile, Resend;
- CSP/headers;
- WAF/rate limit;
- portfólio aprovado;
- redes e e-mail;
- sem analytics;
- políticas.

## Fase 9 — Napoleon, staging e produção

- build standalone;
- deploy pela integração GitHub/Napoleon;
- secrets por GitHub Actions;
- staging;
- homologação de Davi Benucci;
- produção via Cloudflare;
- smoke test e rollback;
- verificação de `app.wflyer.com.br`.

**Gate final:** todos os critérios de aceite e homologação registrados.
