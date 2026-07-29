# Arquitetura GSAP

## Bibliotecas

- `gsap`;
- `ScrollTrigger`;
- `@gsap/react`.

Nenhum segundo motor de animação será instalado.

## Fronteiras

- GSAP controla timelines e transformações coordenadas;
- CSS controla hover, foco, cor e transições simples;
- React controla estado sem tentar reproduzir frames de animação;
- SVG define a geometria;
- o scroll permanece nativo.

## Organização sugerida

```text
src/lib/motion/
├── register-gsap.ts
├── motion-preferences.ts
├── create-intro-timeline.ts
├── create-score-scroll.ts
├── create-header-sync.ts
└── cleanup.ts
```

## Regras React

- usar `useGSAP()` com escopo;
- usar `gsap.context()` para limpeza;
- não criar timeline durante render;
- não consultar DOM global quando uma ref local resolve;
- destruir ScrollTriggers na desmontagem;
- não duplicar listeners após navegação;
- carregar o módulo de experiência por divisão de código quando possível.


## Abertura da marca

A animação inicial é um Client Component isolado e usa o SVG oficial inline. A timeline completa está normatizada em `06-animacao-entrada-marca.md` e em `06-animacao-entrada-marca.timeline.yaml`.

Regras adicionais:

- não usar vídeo, Canvas, WebGL ou Lottie na abertura;
- manter a homepage renderizada atrás do overlay;
- iniciar a timeline somente depois de definir tema, estado inicial e medidas do handoff;
- medir a posição da logo real do header uma vez antes do handoff;
- remover `will-change`, listeners e overlay ao concluir;
- falhas devem liberar a homepage imediatamente.
