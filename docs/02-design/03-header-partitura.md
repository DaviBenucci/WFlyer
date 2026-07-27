# Header em partitura

## Anatomia desktop

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Aplicação] [Como funciona] [Benefícios] [Acessar app]                      │
│                                  W_Flyer                                    │
│                      [Empresa] [Serviços] [Portfólio] [Contato]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Na implementação real, os dois grupos ocupam a mesma linha e a marca fica centralizada geometricamente.

## Grupo esquerdo — aplicação

| Rótulo | Destino |
|---|---|
| Aplicação | `/#aplicacao-wflyer` |
| Como funciona | `/#como-funciona` |
| Benefícios | `/#beneficios` |
| Acessar app | `https://app.wflyer.com.br` |

## Grupo direito — empresa

| Rótulo | Destino |
|---|---|
| Empresa | `/#empresa` |
| Serviços | `/#servicos` |
| Portfólio | `/#portfolio` |
| Contato | `/#contato` |

## Componente `NavigationMeasure`

Cada compasso contém:

- cinco linhas de pauta;
- barra inicial e final;
- uma nota indicadora;
- rótulo textual;
- área de clique mínima de 44 × 44 px;
- estados default, hover, focus-visible, active e disabled;
- `aria-current="location"` na seção ativa.

## Ondulação do header

- amplitude de 2 a 4 px;
- sem animação contínua;
- cada compasso pode variar discretamente a altura;
- texto permanece horizontal;
- a ondulação nunca reduz a área de clique.

## Header fixo

- permanece visível durante a cena principal;
- usa fundo translúcido apenas se o contraste for preservado;
- adiciona borda/sombra somente após sair do topo;
- não deve cobrir o destino da âncora; usar `scroll-margin-top`.

## Mobile

- marca textual;
- botão de tema;
- botão de menu;
- menu em painel vertical dividido em Aplicação e Empresa;
- fechamento por `Escape`, clique externo e seleção;
- foco contido enquanto aberto;
- retorno do foco ao botão de origem.
