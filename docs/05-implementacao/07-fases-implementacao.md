# Fases de implementação

## Regra absoluta

A fase seguinte só começa quando a atual estiver `CONCLUÍDA` segundo os gates definidos. Dentro da Fase 4, cada página possui seu próprio ciclo e não pode ser marcada como concluída sem referência aprovada.

## Fase 0 — Preparação e governança

- criar repositório separado;
- copiar documentação e assets oficiais;
- configurar Node/pnpm;
- fixar versões;
- configurar lint, format, TypeScript e CI;
- configurar OpenSpec e AGENTS;
- validar manifests e links;
- registrar baseline.

**Gate:** build vazio, lint, typecheck e testes de infraestrutura verdes; documentação sem conflito conhecido.

## Fase 1 — Referências visuais e contrato de páginas

- validar prancha mestra;
- gerar referências individuais na ordem do `page-matrix.yaml`;
- criar claro/escuro para desktop;
- criar `.spec.yaml` de cada estado;
- revisar conteúdo fictício e legibilidade;
- registrar aprovação do usuário;
- criar storyboards de continuidade e tablet.

**Gate:** Home, Aplicação, Como funciona, Benefícios, Empresa, Serviços, Processo, Portfólio, Contato e Footer possuem referências desktop claro/escuro aprovadas. Nenhum PNG contém conteúdo factual inventado.

## Fase 2 — Fundações estáticas

- App Router e rotas básicas;
- layout, metadata e fontes;
- tokens claro/escuro;
- conteúdo local;
- componentes primitivos;
- manifesto tipado de capítulos;
- Storybook inicial.

**Gate:** todas as rotas renderizam conteúdo sem GSAP, tablet interativo ou formulário.

## Fase 3 — Header, Home e partitura estática

- símbolo oficial central;
- grupos de compassos;
- menu mobile;
- tema;
- Home bifurcada estática;
- geometria da pauta;
- âncoras de continuidade;
- barra final;
- fallback vertical.

**Gate:** Home e estrutura compartilhada correspondem às referências aprovadas em claro/escuro; E2E de navegação e axe sem violações críticas.

## Fase 4 — Implementação visual página por página

Para cada página, seguir obrigatoriamente:

1. confirmar golden reference `approved`;
2. implementar tema claro estático;
3. implementar tema escuro com a mesma geometria;
4. capturar screenshots;
5. comparar com a referência;
6. corrigir hierarquia, espaçamento e tipografia;
7. criar/aprovar referências mobile;
8. implementar responsividade;
9. executar Storybook, visual e axe;
10. marcar a página como `CONCLUÍDA`.

Ordem:

1. Aplicação;
2. Como funciona;
3. Benefícios;
4. Empresa;
5. Serviços;
6. Processo;
7. Portfólio;
8. Contato;
9. detalhes de serviço;
10. políticas.

**Gate:** todas as páginas principais correspondem às golden references estáticas e funcionam sem motion.

## Fase 5 — Navegação e continuidade animada

- provider de transição;
- cálculo de direção por coordenadas e topologia do grafo;
- modo adjacente, salto comprimido, pivô pela Home e transição neutra;
- conectores temporários da pauta;
- navegação anterior/próximo;
- histórico e deep links;
- reveals locais;
- reduced motion;
- falha segura e timeout.

**Gate:** testes de direção, histórico, foco, deep link, resize e performance verdes; storyboards aprovados.

## Fase 6 — Tablet demonstrativo

- casca CSS 3D;
- tela DOM;
- estados locais;
- dados determinísticos;
- interação teclado/mouse/toque;
- tilt e reflexo;
- reduced motion;
- Storybook de todos os estados.

**Gate:** nenhuma rede ou lógica do app; axe sem violações; performance dentro do orçamento; referências de componente aprovadas.

## Fase 7 — Abertura e motion final

- animação oficial da marca;
- handoff para header e Home;
- bifurcação animada;
- cards, notas, tema e cadências;
- integração da barra final;
- sessão, skip e Escape.

**Gate:** QA dedicado da abertura, motion e regressão visual aprovado.

## Fase 8 — Conteúdo, contato e segurança

- revisão editorial completa;
- SEO;
- portfólio vazio honesto;
- políticas provisórias;
- Route Handler;
- Zod;
- Turnstile;
- Resend;
- headers;
- WAF/rate limit;
- logs mínimos;
- testes de abuso.

**Gate:** revisão editorial, SEO, segurança e entrega real em staging.

## Fase 9 — QA, performance e release

- Playwright completo;
- Storybook;
- Lighthouse CI;
- dispositivos reais;
- revisão de licenças;
- revisão legal;
- rollback;
- checklist de release;
- atualização de manifests e checksums.

**Gate:** todos os critérios de aceite aprovados e nenhuma fase marcada por suposição.
