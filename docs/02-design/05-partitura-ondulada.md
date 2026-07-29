# Partitura ondulada

## Objetivo

A pauta é a infraestrutura visual do site. Ela conecta páginas, orienta direção, organiza conteúdo e encerra cada jornada. Não deve parecer uma faixa rígida nem um ornamento aleatório.

## Construção

- SVG original;
- uma curva central Bézier cúbica por segmento;
- cinco linhas derivadas da mesma geometria;
- espaçamento visual constante;
- notas posicionadas pelo comprimento do caminho;
- textos e cards não acompanham a rotação da curva;
- entrada e saída padronizadas por âncoras;
- barra final como componente vetorial separado.

## Sistema de segmentos

Cada página principal possui um `ScoreSegment` com:

```text
entryAnchor → localCurve → contentMeasures → exitAnchor
```

As âncoras usam coordenadas normalizadas:

```yaml
entryAnchor:
  edge: left | right
  y: 0.00..1.00
  tangent: -7..7
exitAnchor:
  edge: left | right
  y: 0.00..1.00
  tangent: -7..7
```

A página seguinte deve começar na mesma altura normalizada e com tangente visual compatível. A continuidade é verificada por storyboard de transição, não pela justaposição física dos PNGs.

## Direção por ramo

### Aplicação

- conexão com a Home no lado direito;
- avanço para o próximo capítulo no lado esquerdo;
- página terminal encerra no extremo esquerdo com barra dupla.

### Institucional

- conexão com a Home no lado esquerdo;
- avanço para o próximo capítulo no lado direito;
- página terminal encerra no extremo direito com barra dupla.

## Parâmetros desktop

| Propriedade | Limite |
|---|---|
| amplitude vertical | 24–36 px |
| comprimento de onda | 900–1.300 px |
| inclinação local | máximo aproximado de 7° |
| distância entre linhas | 12 px |
| mudanças de direção | no máximo 2 por viewport |
| símbolos visíveis | quantidade controlada por página |
| margem de conteúdo | pauta não pode atravessar texto legível |

## Tablet

- amplitude máxima de 24 px;
- distância de 10 px;
- menos símbolos;
- continuidade preservada mesmo sem transição extensa.

## Mobile

- amplitude máxima de 14 px;
- distância de 8 px;
- segmentos locais por seção;
- direção indicada por rótulos e anterior/próximo, não por deslocamento horizontal longo;
- barra final permanece visível em terminais.

## Determinismo da notação visual

- a posição das notas e barras é definida por dados estáticos ou pela golden reference aprovada;
- nenhuma nota é sorteada no cliente em produção;
- claro e escuro usam a mesma sequência e as mesmas posições;
- a troca de viewport pode reduzir a quantidade de ornamentos, mas não altera as âncoras de continuidade;
- páginas de ramos diferentes não compartilham um segmento de conexão direta;
- a notação é decorativa e silenciosa nesta versão; qualquer reprodução de áudio exige decisão separada.

## Notas

Cada nota recebe progresso de `0` a `1` no caminho. A posição pode usar `getPointAtLength`; a tangente orienta detalhes com limite de rotação de ±6°. Notas decorativas usam `aria-hidden="true"`.

## Barra final

- duas barras verticais, sendo a última mais espessa;
- alinhada às cinco linhas;
- não confundir com divisor de conteúdo ou borda de card;
- aparece apenas em Benefícios e Contato na linha principal;
- pode ser acompanhada de cadência curta de notas e CTA concluído.

## Proibições

- morph contínuo do atributo `d` durante o scroll;
- linhas cruzadas;
- amplitude que faça cards saírem do viewport;
- deformação da pauta pelo cursor;
- rasterização da pauta;
- cópia de partitura de banco de imagens;
- notas sem relação com a linha ou cobrindo controles.
