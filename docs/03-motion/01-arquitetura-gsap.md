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
