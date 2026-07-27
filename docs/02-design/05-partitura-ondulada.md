# Partitura ondulada

## Objetivo

Evitar uma faixa rígida e completamente reta. A pauta deve parecer uma linha musical que respira e conduz o olhar, sem ondulação extrema.

## Construção

- SVG original;
- uma curva central Bézier cúbica;
- cinco linhas derivadas da mesma geometria;
- espaçamento visual constante;
- notas posicionadas pelo comprimento do caminho;
- textos e cards não acompanham a rotação da curva.

## Parâmetros desktop

| Propriedade | Limite |
|---|---|
| amplitude vertical | 24–36 px |
| comprimento de onda | 900–1.300 px |
| inclinação local | máximo aproximado de 7° |
| distância entre linhas | 12 px |
| mudanças de direção | no máximo 2 por viewport |
| largura do SVG | definida pela narrativa, alvo inicial 6.400–7.200 unidades |
| altura do viewBox | alvo inicial 820–920 unidades |

## Tablet

- amplitude máxima de 24 px;
- distância de 10 px;
- menos símbolos;
- narrativa horizontal mais curta.

## Mobile

- amplitude máxima de 14 px;
- distância de 8 px;
- pautas por seção, sem longa cena fixada;
- conteúdo em fluxo vertical.

## Zonas

| Zona | Forma |
|---|---|
| Aplicação | descida leve |
| Como funciona | subida suave |
| Benefícios | estabilização |
| Centro W_Flyer | quase horizontal |
| Empresa | subida curta |
| Serviços | descida suave |
| Saída | estabilização para o fluxo vertical |

## Notas

Cada nota recebe um progresso de `0` a `1` no caminho. A posição usa `getPointAtLength`; a tangente pode orientar detalhes com limite de rotação de ±6°.

## Proibições

- morph contínuo do atributo `d` durante o scroll;
- linhas cruzadas;
- amplitude que faça cards saírem do viewport;
- deformação da pauta pelo cursor;
- rasterização da pauta;
- cópia de uma partitura de banco de imagens.
