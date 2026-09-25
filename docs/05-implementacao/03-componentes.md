# Arquitetura de componentes

## Marca e navegação

- `OfficialBrandSymbol`, `OfficialBrandLockup`, `BrandIntroOverlay`;
- `SiteHeader`, `NavigationMeasure`, `MobileScoreMenu`, `ThemeToggle`;
- `ChapterNavigation`, `SiteFooter`.

## Partitura e experiência

- `NarrativeClef`, `OriginScore`, `ChapterScore`, `StoryScoreLayer`;
- `ScoreTransitionLayer`, `StoryBootstrapExperience`, `MotionStoryLab`;
- `ProfessionalChapterScene`, `StaticStorySkeleton`.

Home usa uma origem e uma pauta de cinco linhas. A experiência ativa segue
somente a narrativa profissional/portfólio. Não existe componente institucional
de ramificação, demo ou acesso ao produto separado.

## Conteúdo principal

- Home, Sobre, Serviços, Processo, Projetos e Contato;
- detalhes de serviço e projeto autorizados;
- páginas legais e de acessibilidade;
- formulário seguro de Contato.

## Regras

- props tipadas e nenhum segredo no cliente;
- conteúdo separado de animação e geometria separada de copy;
- GSAP como única autoridade programática de movimento;
- nenhum componente do produto musical independente;
- nenhuma abstração genérica prematura;
- golden references nunca entram no runtime;
- temas compartilham a mesma árvore DOM sempre que possível.
