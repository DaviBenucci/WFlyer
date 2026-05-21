# Layout responsivo

## Objetivo

Definir a base visual para desktop e mobile, garantindo consistência entre páginas e reduzindo retrabalho na implementação.

## Estrutura geral

```text
AppShell
  DesktopSidebar
  MobileBottomNav
  PageTransitionCurtain
  PageContainer
    PageHeader
    PageContent
```

## Breakpoints recomendados

```text
mobile: < 768px
tablet: 768px a 1023px
desktop: >= 1024px
large: >= 1280px
```

## Desktop

No desktop, usar sidebar fixa à esquerda.

```text
┌───────┬─────────────────────────────────────┐
│Sidebar│ Conteúdo principal                  │
│       │                                     │
└───────┴─────────────────────────────────────┘
```

Regras:

- sidebar recolhida por padrão;
- expande no hover/focus;
- conteúdo principal tem margem compatível com largura recolhida;
- item ativo destacado com gradiente roxo/azul;
- textos de menu aparecem apenas quando expandido;
- navegação deve ser acessível por teclado.

## Mobile

No mobile, usar bottom navigation fixa.

```text
┌──────────────────────────┐
│ Conteúdo                 │
│                          │
├──────────────────────────┤
│ Logo + trilho de abas    │
└──────────────────────────┘
```

Regras:

- bottom nav respeita `env(safe-area-inset-bottom)`;
- logo fixa à esquerda leva para Home;
- trilho animado centraliza página ativa;
- conteúdo deve ter padding-bottom suficiente para não ficar oculto;
- quando teclado abrir, nav deve subir suavemente ou reduzir interferência.

## PageContainer

Responsável por:

- largura máxima do conteúdo;
- padding responsivo;
- espaçamento inferior para bottom nav;
- suporte a títulos e breadcrumbs futuros.

## Estados globais

```text
route_loading
offline
reduced_motion
keyboard_open
error_boundary
```

## Critérios de aceite

- Nenhuma página deve ficar coberta pela bottom navigation.
- Sidebar não deve bloquear conteúdo no desktop.
- Navegação funciona por mouse, toque e teclado.
- Layout não deve gerar salto brusco ao abrir teclado no mobile.
