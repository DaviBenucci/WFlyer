# Golden pages e arquétipos

## Objetivo

Orientar a implementação visual sem exigir uma imagem independente para cada combinação de página, tema e viewport.

## Fontes aprovadas

- `master/wflyer-approved-master-board.png` — linguagem global e painéis canônicos;
- `application/application-desktop-light.png` — Aplicação e tablet;
- `visual-archetypes.yaml` — herança das páginas restantes;
- `page-matrix.yaml` — autorização por estado.

## Status permitidos

- `approved-individual`;
- `approved-master-panel`;
- `authorized-derived`;
- `superseded`.

Não existem estados bloqueadores de geração no pacote 1.4.

## Regra

- `approved-individual`: comparar diretamente com o PNG e spec;
- `approved-master-panel`: reconstruir o painel em alta resolução usando o sistema global;
- `authorized-derived`: aplicar o arquétipo indicado, sem criar linguagem nova;
- qualquer estado precisa de QA visual e homologação humana antes de produção.
