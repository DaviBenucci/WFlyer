# Desktop Sidebar

## Objetivo

Implementar sidebar fixa, escura, recolhida por padrão e expandida ao passar o mouse ou receber foco.

## Especificação visual

```text
Largura recolhida: ~5em
Largura expandida: ~16em
Posição: fixed left/top/bottom
Fundo: #0F1020 ou variação escura
Item ativo: gradiente #7C3AED -> #2563EB
Ícones: sempre visíveis
Texto: visível apenas expandido
```

## Itens do MVP

```text
Home -> /
Transpor -> /transpor
Instrumentos -> /instrumentos
Como funciona -> /como-funciona
Histórico local -> /historico-local
Configurações locais -> /configuracoes-local
```

## Itens futuros autenticados

```text
Dashboard -> /app
Nova transposição -> /app/novo
Histórico -> /app/historico
Biblioteca -> /app/biblioteca
Compartilhados -> /app/compartilhados
Configurações -> /app/configuracoes
Admin -> /admin, somente admin
```

## Comportamento

- Expandir em hover.
- Expandir em focus-within para teclado.
- Manter tooltip ou texto acessível quando recolhida.
- Item ativo deve usar `aria-current="page"`.
- Logo no topo deve navegar para Home.

## Componentes

```text
DesktopSidebar
  SidebarLogo
  SidebarNavList
  SidebarNavItem
  SidebarFooter
```

## Segurança

- Não renderizar link admin para usuário não autorizado quando houver auth.
- Mesmo sem link visível, backend deve proteger rotas admin.

## Testes

- Item ativo muda conforme rota.
- Sidebar expande no hover e focus.
- Textos continuam acessíveis a leitores de tela.
- Menu não cobre conteúdo principal.
