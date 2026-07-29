# Especificação da homepage

## Função

A Home é o ponto zero da composição e apresenta simultaneamente os dois caminhos da W_Flyer. Ela não é um capítulo entre Aplicação e Empresa; é a origem comum das duas partituras.

## Estrutura aprovada

```text
Header em compassos
────────────────────────────────────────────────────
Mensagem da aplicação   CLAVE DE SOL   Mensagem institucional
CTA aplicação                              CTA serviços
     pauta segue para a esquerda ←  → pauta segue para a direita
────────────────────────────────────────────────────
Indicação discreta de exploração
```

## Elementos obrigatórios

- símbolo oficial no centro do header;
- clave de sol tridimensional ou volumétrica no centro do hero, como elemento narrativo;
- bloco da aplicação à esquerda;
- bloco da empresa/serviços à direita;
- dois CTAs principais com peso equivalente;
- duas pautas onduladas saindo visualmente da região da clave;
- notas coerentes com cada pauta;
- indicação discreta de que existem dois caminhos;
- tema claro e escuro equivalentes em estrutura.

## Conteúdo da esquerda

- título centrado na transformação musical;
- descrição pública curta;
- CTA `Acessar aplicação` ou `Conhecer aplicação`;
- CTA secundário para explorar o ramo;
- nenhuma descrição de motor interno.

## Conteúdo da direita

- título centrado em soluções digitais sob medida;
- descrição dos tipos de serviço;
- CTA `Conheça nossos serviços`;
- CTA secundário para a empresa, quando necessário.

## Comportamento da bifurcação

- a pauta esquerda se enfatiza ao focar/hover um elemento do ramo da aplicação;
- a pauta direita se enfatiza ao focar/hover um elemento do ramo institucional;
- a ênfase usa cor, opacidade e pequeno deslocamento de nota, nunca deformação do path;
- ao selecionar um ramo, a transição segue a direção correspondente;
- nenhuma direção é escolhida automaticamente pelo scroll;
- o símbolo central do header sempre retorna a este estado.

## Relação com a abertura oficial

A abertura termina na Home real:

1. símbolo chega ao header;
2. compassos do header crescem para os lados;
3. a clave narrativa aparece no hero;
4. duas pautas são desenhadas a partir do centro;
5. conteúdo da aplicação entra pela esquerda;
6. conteúdo institucional entra pela direita;
7. CTAs e navegação tornam-se interativos.

A Home deve existir e estar legível antes do término da timeline. Em reduced motion, ela aparece diretamente no estado final.

## Proibições

- wordmark grande central competindo com a clave;
- terceira trilha narrativa;
- scroll horizontal obrigatório;
- pauta como mero wallpaper sem conexão com a navegação;
- partículas em loop permanente;
- conteúdo fictício;
- vídeo como hero principal.
