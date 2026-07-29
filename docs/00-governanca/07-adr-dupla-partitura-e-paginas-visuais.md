# ADR — dupla partitura e páginas visuais

**ID:** ADR-014/015/016/017
**Status:** aprovado
**Data:** 2026-07-29

## Contexto

A primeira arquitetura documental descrevia uma única cena horizontal controlada pelo scroll. Após a aprovação da direção visual, ficou definido que a clave de sol da Home deve ser a origem de duas partituras independentes e que cada página do site deve funcionar como parte real da respectiva composição.

Também foi aprovado o uso de um tablet com aparência tridimensional e interface demonstrativa na página da aplicação. Era necessário preservar acessibilidade, SEO, deep links, performance e a separação entre o site e o motor musical.

## Decisão

1. A Home é um hub central, não apenas um capítulo intermediário.
2. O ramo da aplicação se desenvolve visualmente para a esquerda.
3. O ramo institucional se desenvolve visualmente para a direita.
4. Cada capítulo possui rota própria e conteúdo estático indexável.
5. Transições laterais comunicam direção, mas não substituem scroll, links, histórico ou carregamento direto.
6. A pauta é persistente em conceito e contínua por âncoras vetoriais padronizadas; ela não precisa permanecer em um único SVG gigante entre todas as rotas.
7. O fim de cada ramo é marcado por barra dupla final.
8. O tablet é construído com DOM, CSS 3D e GSAP, sem Three.js/WebGL.
9. A geração e aprovação de referências individuais precede a implementação visual final.

## Alternativas rejeitadas

### Um único canvas horizontal com todas as páginas

Rejeitado por aumentar o custo de hidratação, dificultar rotas independentes, acessibilidade, SEO, histórico, manutenção e carregamento direto.

### Navegação horizontal por arraste obrigatório

Rejeitada porque não funciona de forma consistente com teclado, leitores de tela, roda do mouse e dispositivos móveis.

### Tablet em vídeo ou imagem estática

Rejeitado porque não oferece interação real, legibilidade adaptativa nem estados acessíveis.

### Three.js/React Three Fiber

Rejeitado porque a profundidade necessária é limitada, a tela deve permanecer DOM e a dependência violaria o orçamento e o bloqueio tecnológico.

## Consequências

- será necessário um manifesto tipado de capítulos;
- o layout compartilhado precisa conhecer direção e posição relativa da rota;
- as referências visuais devem incluir pontos de continuidade da pauta;
- testes E2E devem validar direção, histórico, deep links e reduced motion;
- o Codex não pode inventar uma página sem referência aprovada;
- páginas legais e detalhes de serviços permanecem fora da linha principal, mas reutilizam a linguagem visual.
