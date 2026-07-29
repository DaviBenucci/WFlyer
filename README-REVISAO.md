# Pacote de revisão — animação de entrada W_Flyer

Este pacote contém somente documentação. Nenhuma imagem, SVG ou implementação visual foi criada.

## Objetivo da revisão

Aprovar o funcionamento da animação antes da confecção dos SVGs. Após a aprovação, será criada a versão consolidada no repositório e começará a etapa de assets.

## Ordem de leitura

1. `docs/03-motion/06-animacao-entrada-marca.md`;
2. `docs/05-implementacao/10-contrato-assets-animacao.md`;
3. `docs/03-motion/06-animacao-entrada-marca.timeline.yaml`;
4. `docs/03-motion/06-animacao-entrada-marca.frames.csv`;
5. `docs/07-qa/06-qa-animacao-entrada.md`;
6. `docs/00-governanca/06-adr-animacao-entrada-programatica.md`.

## Decisões pendentes de aprovação

- duração total de 5,600 s;
- apresentação da marca até 4,050 s;
- hold do lockup entre 3,300 e 4,050 s;
- handoff do símbolo para o header;
- desaparecimento do wordmark durante o handoff;
- início da hero em 4,250 s;
- uso de dois ecos de contorno;
- comportamento mobile e reduced motion;
- contrato que impede o Codex de gerar assets.
