# Mobile Bottom Navigation

## Especificação oficial

A navegação mobile usa uma bottom navigation bar fixa com logo à esquerda e trilho animado de 5 páginas. A logo leva para Início. A página ativa fica sempre centralizada. Ao trocar de página, o trilho desliza com animação spring e exibe um rastro musical leve. Ao tocar na página já ativa, a tela volta ao topo. Quando o teclado virtual estiver aberto, a barra sobe levemente sem quebrar o layout. O componente deve respeitar safe-area, acessibilidade e prefers-reduced-motion.

## Itens do trilho no MVP

```text
Transpor
Instrumentos
Como funciona
Histórico local
Configurações locais
```

## Itens futuros com conta

```text
Transpor
Instrumentos
Histórico
Compartilhados
Configurações
```

A Home fica acessível pela logo fixa.

## Comportamento da logo

- Fixa no canto esquerdo.
- Não participa do trilho animado.
- Tocar leva para `/`.
- Área mínima de toque: 44x44px.

## Centralização da página ativa

Ao tocar em uma aba:

```text
1. aba tocada vira ativa
2. trilho calcula deslocamento
3. item ativo encaixa no centro visual
4. indicador acompanha movimento
5. vizinhos reduzem escala/opacidade
6. rastro musical leve aparece
```

Pseudológica:

```ts
trackOffset = centerX - activeItemCenterX
```

## Toque na aba ativa

Se tocar na página já ativa:

```ts
window.scrollTo({ top: 0, behavior: 'smooth' })
```

Preservar filtros ativos em listas.

## Teclado aberto

Usar VisualViewport API quando disponível.

CSS base:

```css
.mobile-bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: max(12px, env(safe-area-inset-bottom));
  z-index: 50;
}
```

Classe possível:

```css
.mobile-bottom-nav.keyboard-open {
  transform: translateY(-8px);
}
```

## Acessibilidade

- `aria-label` em todos os botões.
- `aria-current="page"` na aba ativa.
- Contraste adequado.
- Não depender apenas de cor.
- Respeitar `prefers-reduced-motion`.
- Desativar rastro musical para redução de movimento.

## Componentes

```text
MobileBottomNav
  MobileNavLogoButton
  MobileNavTrack
  MobileNavItem
  MobileNavActiveIndicator
  MobileNavMusicTrail
  MobileNavKeyboardAwareContainer
```

## Testes

- Item ativo fica centralizado.
- Logo navega para Home.
- Tocar aba ativa executa scroll to top.
- Rastro musical não aparece com reduced motion.
- Nav não cobre inputs com teclado aberto.
