## Context

Ver `proposal.md` para motivação e baseline. O layout atual já possui páginas
estáticas, links reais, manifesto tipado e pontos de foco; ainda não existe um
lifecycle persistente entre trocas do App Router.

As restrições vêm de `docs/03-motion/07-transicoes-entre-capitulos.md`,
`docs/03-motion/04-reduced-motion.md`, do manifesto de capítulos e das ADRs
citadas na proposta.

## Goals / Non-Goals

**Goals:**

- separar topologia pura, estado de navegação, medição DOM e timelines;
- falhar de forma aberta para navegação convencional e fechada para overlays;
- manter o header e a camada de transição persistentes;
- oferecer observabilidade determinística sem código específico na experiência normal.

**Non-Goals:**

- generalizar um sistema de componentes ou motor de animação;
- animar rotas auxiliares como capítulos;
- duplicar páginas em snapshots, canvas, WebGL ou imagens;
- resolver features das Fases 06–09.

## Decisions

1. **Topologia pura a partir do manifesto.** Um módulo em `src/lib/motion/`
   receberá origem/destino tipados de `scoreManifest` e retornará modo, direção e
   razão neutra. Não lerá DOM nem GSAP. Alternativa rejeitada: inferir pela URL
   dentro da timeline, porque mistura regra de negócio e medição e dificulta
   testes.
2. **Composição persistente.** `RootLayout` hospedará
   `SiteExperienceShell -> header / transition layer / route content / footer`.
   O provider será a única autoridade do lifecycle; páginas continuam
   renderizando sua pauta local. Isso segue a arquitetura do documento
   normativo, sem manter cópias completas de rotas.
3. **Máquina de estados cancelável.** Estados explícitos (`idle`, `preparing`,
   `outgoing`, `navigating`, `incoming`, `settling`, `recovering`) usarão um
   identificador monotônico. Um novo destino válido invalida callbacks antigos e
   substitui no máximo um pendente.
4. **Intercepção conservadora.** O shell observa apenas links reais e testa
   botão, modificadores, `target`, `download`, origem, hash e presença no
   manifesto antes de impedir o padrão. Rotas auxiliares e externos passam pelo
   navegador.
5. **Rota iniciada cedo, timeline coordenada.** Preparação/medição não bloqueia
   mais de 100 ms. A saída começa com a navegação pendente; a entrada final só
   ocorre após o novo conteúdo e sua âncora existirem. Se medição ou montagem
   falhar, o lifecycle converte para `neutral`.
6. **GSAP com escopo e reversão.** `useGSAP`, `gsap.context()` e
   `gsap.matchMedia()` criam e revertem timelines. CSS mantém apenas estados
   simples/profundidade; o scroll continua nativo. Não há animação infinita.
7. **Overlay SVG original em DOM.** A camada temporária desenha path, barras e
   notas a partir das âncoras `data-*`; não recorta golden references nem monta
   screenshots. `pointer-events: none`, `aria-hidden` e limpeza garantida evitam
   interferência.
8. **Foco e histórico após consolidação.** Apenas o destino aceito atualiza
   histórico. Navegação comum vai ao topo e foca `main#main-content` ou `h1`;
   `popstate` respeita restauração confiável do navegador. A Home nunca vira
   entrada intermediária no histórico.
9. **Tema aplicado antes da pintura entrante.** O estado persistente de tema
   alcança overlay e nova página no mesmo frame; somente o microestado visual do
   toggle pode ser bloqueado, por menos de 900 ms.
10. **Modo de teste fora da produção comum.** Flags controladas pelo ambiente de
    teste expõem fase e metadados `data-*`, desativam aleatoriedade e permitem
    checkpoints. A experiência normal usa relógio real e não fica congelável por
    input público.

## Security, Accessibility, Testing and Performance

- Não há dados, rede, HTML do visitante ou mudança na API de contato.
- Overlay é decorativo; links e foco continuam semânticos.
- Unidade cobre classificador, elegibilidade, reducer e timeout com relógio falso.
- Componentes/Storybook cobrem shell, temas, reduced motion e falhas.
- Playwright cobre quatro modos, deep link, sem JS, Back/Forward, teclado,
  cliques concorrentes e checkpoints visuais.
- axe e smoke confirmam ausência de foco preso/overlay; Lighthouse e budgets de
  `docs/03-motion/05-orcamento-performance.md` guardam regressão.
- Timelines usam apenas transform/opacity quando possível, têm limite de 900 ms
  e não aguardam asset decorativo.

## Risks / Trade-offs

- **App Router concluir antes/depois da medição** → degradar para `neutral` e
  sempre revelar o conteúdo.
- **Eventos concorrentes e callbacks obsoletos** → token monotônico, `kill()` e
  cleanup idempotente.
- **Foco duplicado por remount** → uma única rotina pós-consolidação e teste com
  leitor semântico.
- **Mudança de tema durante frames intermediários** → estado no shell
  persistente aplicado antes da fase entrante.
- **Teste determinístico vazar para produção** → habilitação restrita ao
  ambiente de teste e ausência de query pública permanente.

## Migration Plan

1. Implementar e testar topologia/elegibilidade puras.
2. Introduzir shell/provider/layer em estado neutro, preservando navegação atual.
3. Adicionar interceptação e lifecycle com fallback.
4. Implementar timelines por modo, reduced motion, foco/histórico e tema.
5. Executar suites, comparações visuais, axe, performance e atualizar evidências.

Rollback: manter uma saída de navegação convencional; se o coordenador for
removido/desativado, os links reais e o App Router continuam funcionando.
