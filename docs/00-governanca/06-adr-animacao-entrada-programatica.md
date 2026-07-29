# ADR-012 — Animação de entrada programática baseada na referência aprovada

**Status:** proposta para aprovação  
**Data:** 2026-07-29

## Contexto

A tentativa de produzir a abertura como vídeo generativo não garantiu consistência geométrica, tipográfica e temática. Um vídeo posterior aprovado como referência demonstrou uma direção de movimento adequada: underscore, crescimento modular, contornos temporários, lock do símbolo e revelação do wordmark.

O site precisa oferecer a mesma linguagem nos modos claro e escuro, adaptar-se aos breakpoints, respeitar movimento reduzido e realizar uma transição imperceptível para a homepage.

## Decisão

A abertura será recriada programaticamente com SVG oficial, GSAP e `@gsap/react`.

O vídeo aprovado será usado como referência de ritmo e composição, não como recurso publicado e não como fonte geométrica.

A abertura terá:

- apresentação da marca até 4,050 s;
- handoff para a interface até 4,850 s;
- hero pronta até 5,600 s;
- execução uma vez por sessão;
- fallback imediato e reduced motion;
- mesmo sistema geométrico nos dois temas.

## Consequências positivas

- preservação exata da marca;
- uma timeline para ambos os temas;
- adaptação responsiva;
- menor dependência de mídia raster;
- handoff real para o DOM;
- depuração por frame de referência;
- acessibilidade e skip controláveis.

## Consequências negativas

- exige SVG preparado para animação;
- exige QA visual detalhado;
- exige medição do target no header;
- aumenta a complexidade da homepage em comparação a um fade simples.

## Restrições

- nenhum asset será gerado pelo Codex;
- nenhuma implementação visual começa antes da aprovação do pacote SVG;
- nenhum segundo motor de animação;
- nenhum vídeo no runtime;
- nenhum áudio automático.

## Referências internas

- `docs/03-motion/06-animacao-entrada-marca.md`;
- `docs/05-implementacao/10-contrato-assets-animacao.md`;
- `docs/07-qa/06-qa-animacao-entrada.md`.
