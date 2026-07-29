# Pacote de revisão — dupla partitura e referências visuais W_Flyer

**Versão documental:** 1.2
**Data:** 2026-07-29

## Objetivo

Consolidar a direção visual aprovada e transformar o conceito da partitura em uma arquitetura executável por páginas. A Home passa a ser a origem de dois caminhos; cada rota principal é um capítulo da respectiva partitura e possui direção, continuidade, anterior, próximo e estado terminal.

## Decisões incorporadas

- logo oficial no centro do header;
- prancha visual mestra aprovada;
- ramo da aplicação para a esquerda;
- ramo institucional para a direita;
- barra dupla final em Benefícios e Contato;
- páginas independentes, indexáveis e acessíveis;
- transições laterais por GSAP sem cena horizontal monolítica;
- quatro modos de troca: capítulo adjacente, salto comprimido, pivô pela Home e transição neutra;
- tablet da Aplicação em DOM com CSS 3D e simulação local;
- golden reference individual como gate de implementação;
- proibição de usar screenshots como frontend.

## Referências incluídas

- `docs/design-reference/golden-pages/master/wflyer-approved-master-board.png`;
- `docs/design-reference/golden-pages/application/application-desktop-light.png`;
- specs, checksums, matriz de páginas, briefs de geração e status;
- brief individual de Footer e regras para estados do tablet.

## Ordem de leitura para revisão

1. `docs/00-governanca/07-adr-dupla-partitura-e-paginas-visuais.md`;
2. `docs/02-design/09-sistema-dupla-partitura.md`;
3. `docs/02-design/10-especificacao-visual-paginas.md`;
4. `docs/03-motion/02-narrativa-dupla-partitura.md`;
5. `docs/03-motion/07-transicoes-entre-capitulos.md`;
6. `docs/03-motion/08-tablet-interativo.md`;
7. `docs/05-implementacao/11-manifesto-capitulos-partitura.yaml`;
8. `docs/05-implementacao/12-fluxo-golden-references.md`;
9. `docs/design-reference/golden-pages/STATUS.md`;
10. `docs/07-qa/07-qa-dupla-partitura-tablet.md`.

## Pendências visuais

Apenas a página Aplicação em desktop claro possui golden reference individual aprovada. Os painéis de Home, Serviços, Portfólio, Contato e Footer estão aprovados na prancha mestra, mas ainda precisam ser gerados isoladamente. Como funciona, Benefícios, Empresa, Processo, detalhes de serviço e versões mobile permanecem pendentes.

## Código

Este pacote não implementa o frontend. Ele atualiza documentação, manifests e referências visuais para orientar a geração dos exemplos restantes e a implementação posterior pelo Codex.


## Validação do pacote

O arquivo `visual-docs-validation.json` registra parse de JSON/YAML, integridade dos links Markdown, validação do grafo de capítulos, coerência da matriz visual, schemas, dimensões e checksums das referências aprovadas.
