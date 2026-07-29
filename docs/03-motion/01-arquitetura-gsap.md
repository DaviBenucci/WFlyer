# Arquitetura GSAP

## Bibliotecas

- `gsap`;
- `ScrollTrigger`;
- `@gsap/react`.

Nenhum segundo motor de animação será instalado.

## Fronteiras

- GSAP controla timelines, transições laterais, handoff, transformações coordenadas e sincronização da pauta;
- CSS controla hover, foco, cor, perspectiva e aparência estrutural do tablet;
- React controla estado, rota, preferência de tema e estado da demonstração;
- SVG define a geometria musical;
- o scroll permanece nativo;
- a tela do tablet permanece DOM.

## Organização sugerida

```text
src/lib/motion/
├── register-gsap.ts
├── motion-preferences.ts
├── create-intro-timeline.ts
├── create-home-bifurcation.ts
├── create-chapter-transition.ts
├── create-score-continuity.ts
├── create-header-sync.ts
├── create-tablet-tilt.ts
├── create-page-reveals.ts
└── cleanup.ts
```

## Layout persistente

O header, o provedor de tema e a camada de transição devem permanecer em um layout compartilhado. A rota atual fornece os metadados do capítulo. O conteúdo da página pode ser substituído, mas a camada de transição não deve remontar no meio de uma navegação.

```text
RootLayout
└── SiteExperienceShell
    ├── SiteHeader
    ├── ScoreTransitionLayer
    ├── RouteChapterContent
    └── SiteFooter
```

A camada persistente pode desenhar um segmento temporário da pauta durante a troca. Ela não deve manter screenshots, clones pesados do DOM nem conteúdo inacessível após a conclusão.

## Regras React

- usar `useGSAP()` com escopo;
- usar `gsap.context()` para limpeza;
- não criar timeline durante render;
- não consultar DOM global quando uma ref local resolve;
- destruir ScrollTriggers na desmontagem;
- não duplicar listeners após navegação;
- não manter estado de transição em componentes que serão desmontados;
- carregar módulos de motion por divisão de código quando possível;
- garantir timeout/falha segura que libere a navegação.

## Navegação

- links continuam links reais;
- o interceptador de transição só atua em navegação interna entre capítulos conhecidos;
- `Ctrl/Cmd + clique`, abrir em nova aba, download e links externos não são interceptados;
- a URL muda de forma compatível com histórico;
- em carregamento direto, a página aparece sem simular o caminho desde a Home;
- em reduced motion, a camada de transição não é montada ou realiza crossfade curto.

## Abertura da marca

A animação inicial é um Client Component isolado e usa o SVG oficial inline. A timeline completa está normatizada em `06-animacao-entrada-marca.md` e `06-animacao-entrada-marca.timeline.yaml`.

Regras adicionais:

- não usar vídeo, Canvas, WebGL ou Lottie na abertura;
- manter a Home renderizada atrás do overlay;
- iniciar somente depois de definir tema, estado inicial e medidas do handoff;
- medir a posição da logo real do header uma vez antes do handoff;
- remover `will-change`, listeners e overlay ao concluir;
- falhas devem liberar a Home imediatamente;
- a abertura termina na bifurcação da Home, não em uma cena horizontal monolítica.
