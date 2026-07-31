## Why

As Fases 0–4 entregaram as páginas e a topologia estática da dupla partitura,
mas a Fase 05 ainda não possui o lifecycle de navegação animada previsto nos
contratos de motion. Este change implementará essa continuidade sem comprometer
deep links, histórico, foco, reduced motion ou o fallback sem JavaScript.

## What Changes

- Classificar transições entre capítulos como `adjacent-score`,
  `compressed-score-jump`, `home-pivot` ou `neutral`, com direção derivada da
  coordenada do manifesto.
- Introduzir shell, provider e camada persistentes no layout para coordenar
  saída, troca de rota e entrada com GSAP.
- Interceptar somente navegações elegíveis e preservar links externos,
  downloads, modificadores, hash e outros casos nativos.
- Coordenar histórico, Back/Forward, foco, scroll, tema e deep links.
- Fornecer reduced motion, fallback por erro, interrupção segura e timeout
  obrigatório de 1.100 ms.
- Expor estado determinístico de teste e cobrir unidade, componentes, E2E,
  visual, acessibilidade e performance.

Não objetivos:

- tablet interativo (Fase 06);
- abertura de marca e reveals locais (Fase 07);
- formulário/entrega de contato (Fase 08);
- deploy, staging ou produção (Fase 09);
- alterar a aplicação musical em `app.wflyer.com.br`.

## Capabilities

### New Capabilities

- `score-transition-navigation`: classificação, direção, continuidade visual,
  timings, tema, interrupção e fallback das transições entre capítulos.
- `accessible-navigation-lifecycle`: elegibilidade de links, histórico, deep
  links, foco, scroll, reduced motion e operação sem JavaScript.

### Modified Capabilities

Nenhuma spec OpenSpec principal existe ainda; os requisitos são novos e
rastreiam os contratos documentais já aprovados.

## Verified Baseline

- Fases 0–4 estão registradas como concluídas em
  `docs/05-implementacao/17-relatorio-execucao-codex.md`, com gates e evidências.
- `src/config/chapters.ts` espelha o manifesto tipado de capítulos.
- Rotas principais já expõem metadados semânticos, `main#main-content` e links
  reais; deep links e navegação sem JavaScript já renderizam diretamente.
- GSAP, ScrollTrigger e `@gsap/react` já pertencem à stack bloqueada.

Esses itens são pré-condições, não tarefas concluídas deste change. Não existem
ainda shell/provider/layer persistentes, classificador, interceptador ou
timelines de transição da Fase 05.

## Impact

Áreas previstas: `src/app/layout.tsx`, novo domínio em `src/lib/motion/`,
componentes do shell/camada de transição, links internos e testes relacionados.
Não há nova dependência de produção prevista.

Fontes normativas:

- `docs/00-governanca/05-registro-decisoes.md`;
- `docs/00-governanca/07-adr-dupla-partitura-e-paginas-visuais.md`;
- `docs/01-produto/05-requisitos.md`;
- `docs/02-design/09-sistema-dupla-partitura.md`;
- `docs/03-motion/01-arquitetura-gsap.md`;
- `docs/03-motion/04-reduced-motion.md`;
- `docs/03-motion/05-orcamento-performance.md`;
- `docs/03-motion/07-transicoes-entre-capitulos.md`;
- `docs/05-implementacao/11-manifesto-capitulos-partitura.yaml`;
- `docs/07-qa/05-criterios-aceite.md`.

Rollback: desativar/remover o shell de transição e voltar à navegação nativa
pelos links reais; páginas, URLs e conteúdo permanecem funcionais.
