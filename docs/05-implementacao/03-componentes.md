# Arquitetura de componentes

## Marca

- `OfficialBrandSymbol`
- `OfficialBrandLockup`
- `BrandIntroOverlay`

## Navegação

- `SiteHeader`
- `ApplicationMeasureGroup`
- `InstitutionalMeasureGroup`
- `NavigationMeasure`
- `MobileScoreMenu`
- `ThemeToggle`
- `ChapterNavigation`
- `BranchIndicator`

## Partitura

- `MusicalStaff`
- `StaffPath`
- `MusicalNote`
- `MeasureBar`
- `FinalBarline`
- `ScoreSegment`
- `ScoreEntryAnchor`
- `ScoreExitAnchor`
- `ScoreConnectorLayer`
- `ScoreChapterFrame`
- `ScoreFallbackFlow`

## Experiência

- `SiteExperienceShell`
- `ScoreTransitionProvider`
- `ScoreTransitionLayer`
- `HomeBifurcation`
- `PageRevealBoundary`
- `ReducedMotionBoundary`

## Conteúdo principal

- `HomeHero`
- `ApplicationOverviewPage`
- `PublicHowItWorksPage`
- `BenefitsPage`
- `CompanyOverviewPage`
- `ServicesPage`
- `ProcessPage`
- `PortfolioPage`
- `ContactPage`
- `ServiceDetailPage`
- `SiteFooter`

## Tablet demonstrativo

- `ApplicationDemoTablet`
- `TabletShell`
- `TabletScreen`
- `DemoScorePreview`
- `DemoTranspositionControls`
- `DemoStatus`
- `DemoResetButton`

## Formulário

- `ContactForm`
- `ProjectTypeField`
- `ConsentField`
- `TurnstileField`
- `FormStatus`

## Regras

- props tipadas;
- componente visual sem acesso direto a segredo ou ambiente;
- conteúdo separado de animação;
- geometria da pauta separada de copy;
- estados Storybook para cada componente relevante;
- nenhum componente de domínio do aplicativo musical;
- nenhuma abstração genérica prematura;
- o tablet não importa lógica do aplicativo;
- golden references não são importadas no runtime;
- componentes de claro e escuro compartilham a mesma árvore DOM sempre que possível.
