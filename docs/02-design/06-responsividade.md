# Responsividade

## Desktop — 1200 px ou mais

- header completo com os dois grupos;
- páginas em composições amplas, conforme golden references;
- transições laterais entre capítulos;
- cursor pode gerar reação leve nas notas e no tablet;
- tablet com inclinação CSS 3D;
- cards distribuídos em compassos;
- pauta entra e sai pelas bordas definidas no manifesto.

## Desktop compacto — 1024 a 1199 px

- reduzir espaçamento do header antes de ocultar rótulos;
- manter símbolo central;
- diminuir amplitude e quantidade de notas;
- tablet com profundidade reduzida;
- conteúdo pode reorganizar colunas sem mudar a ordem semântica.

## Tablet — 768 a 1023 px

- header reduzido ou menu híbrido;
- sem interação dependente de hover;
- transição lateral curta, sem pin prolongado;
- tablet permanece operável por toque e teclado;
- cards menores e textos mais compactos;
- pauta usa segmentos locais simplificados.

## Mobile — abaixo de 768 px

- fluxo vertical;
- menu em painel;
- hero em uma coluna;
- tablet abaixo do texto ou após CTA;
- sem tilt vinculado ao cursor;
- microtransições de opacidade e 8–16 px de deslocamento, não viagem horizontal extensa;
- links anterior/próximo explícitos;
- cards empilhados;
- CTAs com largura adequada ao toque;
- textos sem rotação;
- nenhum conteúdo fora do viewport;
- barra final ocupa a largura útil do segmento no terminal.

## Orientação e resize

- recalcular geometria após fontes carregarem;
- usar `ResizeObserver` com debounce;
- preservar rota e foco após mudança de orientação;
- executar `ScrollTrigger.refresh()` somente quando necessário;
- destruir e reconstruir contextos GSAP por breakpoint;
- não reproduzir a transição de entrada de rota após simples resize.
