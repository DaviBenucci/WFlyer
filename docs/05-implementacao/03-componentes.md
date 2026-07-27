# Arquitetura de componentes

## Navegação

- `SiteHeader`
- `ApplicationMeasureGroup`
- `CompanyMeasureGroup`
- `NavigationMeasure`
- `MobileScoreMenu`
- `ThemeToggle`
- `ScrollProgressNote`

## Marca provisória

- `TextBrand`
- `ProvisionalBrandMark`

## Partitura

- `MusicalStaff`
- `StaffPath`
- `MusicalNote`
- `MeasureBar`
- `ScoreChapter`
- `HorizontalScoreStage`
- `ScoreFallbackFlow`

## Conteúdo

- `HeroPrelude`
- `ApplicationOverview`
- `PublicHowItWorks`
- `BenefitsSection`
- `CompanyOverview`
- `ServicesScore`
- `ProcessSection`
- `PortfolioPreview`
- `ContactSection`
- `SiteFooter`

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
- estados Storybook para cada componente relevante;
- nenhum componente de domínio do aplicativo musical;
- nenhuma abstração genérica prematura.
