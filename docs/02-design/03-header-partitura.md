# Header em partitura

## Anatomia desktop

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│ [Aplicação] [Como funciona] [Benefícios] [Acessar app]                             │
│                         [símbolo oficial W_Flyer]                                  │
│                    [Empresa] [Serviços] [Portfólio] [Contato]                      │
└────────────────────────────────────────────────────────────────────────────────────┘
```

Na implementação real, os dois grupos ocupam a mesma linha e o símbolo oficial fica centralizado geometricamente. O wordmark não ocupa o centro do header desktop aprovado.

## Grupo esquerdo — ramo da aplicação

| Rótulo | Destino | Coordenada |
|---|---|---:|
| Aplicação | `/aplicacao-wflyer` | -1 |
| Como funciona | `/aplicacao-wflyer/como-funciona` | -2 |
| Benefícios | `/aplicacao-wflyer/beneficios` | -3 |
| Acessar app | `https://app.wflyer.com.br` | terminal externo |

## Grupo direito — ramo institucional

| Rótulo | Destino | Coordenada |
|---|---|---:|
| Empresa | `/sobre` | +1 |
| Serviços | `/servicos` | +2 |
| Portfólio | `/portfolio` | +4 |
| Contato | `/contato` | +5 |

## Capítulo Processo

`/processo` permanece entre Serviços e Portfólio na partitura institucional, mas não cria um quinto rótulo no header aprovado. Nessa rota:

- `Serviços` permanece como grupo ativo;
- um marcador de subcompasso ou progresso entre Serviços e Portfólio indica a posição;
- a navegação anterior/próximo torna a ordem explícita;
- o layout do header não muda de largura.

## Símbolo central

- usa `wflyer-header-symbol.svg` ou componente equivalente com geometria oficial;
- funciona como link para `/`;
- possui nome acessível `W_Flyer — voltar à página inicial`;
- não recebe rotação, deformação ou glow constante;
- participa do handoff da abertura sem alterar o layout real.

## Componente `NavigationMeasure`

Cada compasso contém:

- cinco linhas de pauta;
- barra inicial e final;
- uma nota indicadora;
- rótulo textual;
- área de clique mínima de 44 × 44 px;
- estados default, hover, focus-visible, active e external;
- `aria-current="page"` na rota ativa;
- indicação adicional, além da cor, para estado ativo.

## Continuidade visual

- as linhas do grupo esquerdo aparentam nascer no símbolo e seguir para a esquerda;
- as linhas do grupo direito aparentam nascer no símbolo e seguir para a direita;
- o compasso ativo pode receber nota preenchida e barra dupla curta, sem confundir com a barra final do ramo;
- o header não reproduz a pauta de fundo da página; ele é uma miniatura estrutural.

## Header fixo

- permanece visível durante navegação e scroll;
- usa fundo translúcido apenas se o contraste for preservado;
- adiciona borda/sombra somente após sair do topo;
- não cobre destinos, headings ou foco;
- transições de rota não removem o header do DOM.

## Mobile

- símbolo ou lockup compacto oficial;
- botão de tema;
- botão de menu;
- menu vertical dividido em `Aplicação` e `Empresa`;
- exibir ordem e rótulo, não depender da direção espacial;
- fechamento por `Escape`, clique externo e seleção;
- foco contido enquanto aberto;
- retorno do foco ao botão de origem.

## Relação com a abertura

No handoff da animação inicial, uma cópia do símbolo se move para a posição medida do header e realiza crossfade com o componente real. A tolerância visual máxima é de 1 px em desktop e 1,5 px em mobile. O header existe no layout desde o primeiro paint.
