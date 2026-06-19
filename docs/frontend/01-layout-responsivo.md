# Layout responsivo

## Objetivo

Definir a base visual para desktop e mobile, garantindo consistência entre páginas e reduzindo retrabalho na implementação.

Este documento descreve a estrutura visual. O guia detalhado de implementação do frontend está em:

```text
docs/frontend/09-guia_detalhado_frontend.md
```

## Regra de ordem

O frontend final só deve ser implementado depois que o backend MVP estiver concluído e os contratos API estiverem documentados.

Antes disso, é permitido apenas um frontend simples de verificação, com rotas `/debug/*`, para provar que backend, banco, storage, fila e worker funcionam.

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
- navegação deve ser acessível por teclado;
- foco visível em todos os itens;
- nenhuma interação deve depender somente de hover.

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
- quando teclado abrir, nav deve subir suavemente ou reduzir interferência;
- botões devem ter área de toque confortável;
- navegação deve funcionar com leitor de tela.

## PageContainer

Responsável por:

- largura máxima do conteúdo;
- padding responsivo;
- espaçamento inferior para bottom nav;
- suporte a títulos e breadcrumbs futuros;
- estados de loading/error/empty por página;
- preservação de foco ao trocar rotas quando aplicável.

## Estados globais

```text
route_loading
offline
reduced_motion
keyboard_open
error_boundary
api_unavailable
job_polling
```

## Frontend de verificação

Durante as fases de backend, o frontend permitido é apenas técnico.

Rotas permitidas:

```text
/debug/health
/debug/instruments
/debug/upload
/debug/transposition
/debug/jobs
/debug/artifacts
```

Essas rotas devem provar integração com backend real e não devem ser confundidas com telas finais.

## Frontend final

Após backend MVP:

- aplicar design system;
- implementar AppShell;
- implementar navegação desktop/mobile;
- implementar páginas do MVP;
- implementar wizard;
- validar contratos com Zod;
- integrar TanStack Query;
- implementar histórico local;
- validar acessibilidade e responsividade.

## Critérios de aceite

- Nenhuma página deve ficar coberta pela bottom navigation.
- Sidebar não deve bloquear conteúdo no desktop.
- Navegação funciona por mouse, toque e teclado.
- Layout não deve gerar salto brusco ao abrir teclado no mobile.
- Estados de erro/loading/empty devem existir.
- Reduced motion deve ser respeitado.
- O frontend final não deve começar antes do backend MVP.
- Nenhum confidence score deve aparecer para usuário comum.
- Nenhum token deve ser logado no console.
