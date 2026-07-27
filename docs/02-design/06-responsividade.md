# Responsividade

## Desktop — 1024 px ou mais

- header completo com oito compassos;
- cena horizontal fixada;
- cursor com reação leve;
- cards distribuídos em compassos;
- notas decorativas em quantidade controlada.

## Tablet — 768 a 1023 px

- header reduzido ou menu híbrido;
- cena horizontal curta;
- menos parallax;
- cards menores e textos mais compactos;
- nenhuma interação dependente de hover.

## Mobile — abaixo de 768 px

- fluxo vertical;
- menu em painel;
- pautas locais por seção;
- microdeslocamentos laterais, sem pin prolongado;
- cards empilhados;
- CTAs com largura adequada ao toque;
- textos sem rotação;
- nenhum conteúdo fora do viewport.

## Orientação e resize

- recalcular geometria após fontes carregarem;
- usar `ResizeObserver` com debounce;
- preservar a seção ativa após mudança de orientação;
- executar `ScrollTrigger.refresh()` somente quando necessário;
- destruir e reconstruir contextos GSAP por breakpoint.
