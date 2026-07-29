# Catálogo de animações

## M-001 — Entrada da pauta

- desenhar cinco linhas por `stroke-dashoffset`;
- duração total alvo: 900–1.200 ms;
- stagger curto;
- executar uma vez.

## M-002 — Marca textual

- opacidade e deslocamento de 8–12 px;
- sem blur excessivo;
- duração: 350–500 ms.

## M-003 — Clave provisória

- desenho SVG ou máscara;
- atraso após a pauta;
- não girar mais de 4°.

## M-004 — Notas

- entrada progressiva;
- opacidade + deslocamento curto;
- notas próximas ao cursor podem mover 2–6 px;
- sem loop permanente.

## M-005 — Scroll principal

- transform somente no grupo da trilha;
- usar `xPercent` ou `x` calculado;
- sem alteração contínua do path.

## M-006 — Compasso ativo

- nota preenchida;
- deslocamento vertical de 2–4 px;
- barra dupla;
- duração máxima de 200 ms.

## M-007 — Cards de serviço

- surgem do compasso com `y` pequeno e opacidade;
- stagger limitado;
- texto permanece legível durante toda a entrada.

## M-008 — Tema

- transição de cores em 180–280 ms;
- sem reconfigurar layout;
- não animar grandes áreas com filtros custosos.

## M-009 — Cadência final

- redução gradual de notas decorativas;
- pauta converge para barra dupla;
- rodapé aparece sem ocultar links.


## M-010 — Abertura oficial da marca

- duração alvo: 4,8 s;
- underscore representa a origem individual;
- quatro lógicas abstratas representam sites, aplicações, integrações e soluções sob medida;
- trajetórias convergem nos módulos oficiais do símbolo;
- wordmark revelado por Ink Transfer com máscara SVG;
- lock final com overshoot máximo de `1.012`;
- handoff obrigatório para o símbolo do header, os compassos, a clave e a partitura;
- executar somente uma vez por sessão;
- pular em `prefers-reduced-motion`;
- especificação completa em `06-animacao-entrada-marca.md`.
