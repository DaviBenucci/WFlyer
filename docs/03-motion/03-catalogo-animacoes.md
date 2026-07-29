# Catálogo de animações

## M-001 — Entrada da pauta

- desenhar cinco linhas por `stroke-dashoffset`;
- duração total alvo: 900–1.200 ms;
- stagger curto;
- executar uma vez por contexto de entrada.

## M-002 — Marca textual/lockup

- opacidade e deslocamento de 8–12 px quando previsto;
- sem blur excessivo;
- duração: 350–500 ms;
- usar paths oficiais quando for o wordmark.

## M-003 — Clave narrativa

- desenho SVG, máscara ou entrada volumétrica controlada;
- atraso após a pauta da Home;
- não girar mais de 4°;
- não tratar como logotipo.

## M-004 — Notas

- entrada progressiva;
- opacidade + deslocamento curto;
- notas próximas ao cursor podem mover 2–6 px;
- sem loop permanente;
- sem sair da pauta a ponto de confundir hierarquia.

## M-005 — Reveals locais por scroll

- usar `transform` e `opacity`;
- deslocamento de 8–24 px;
- sem pin extenso obrigatório;
- conteúdo permanece presente no HTML e legível sem timeline.

## M-006 — Compasso ativo

- nota preenchida;
- deslocamento vertical de 2–4 px;
- barra dupla curta de estado;
- duração máxima de 200 ms;
- não confundir com barra final da jornada.

## M-007 — Cards de serviço

- surgem do compasso com `y` pequeno e opacidade;
- stagger limitado;
- texto permanece legível durante toda a entrada;
- hover eleva 4–8 px no máximo.

## M-008 — Tema

- transição de cores em 180–280 ms;
- sem reconfigurar layout;
- não animar grandes áreas com filtros custosos;
- geometria da pauta e posição dos componentes permanecem idênticas.

## M-009 — Cadência final

- redução gradual de notas decorativas;
- pauta converge para barra dupla;
- CTA ou formulário permanece estável;
- rodapé aparece sem ocultar links;
- executa somente em Benefícios e Contato.

## M-010 — Abertura oficial da marca

- seguir a duração e frames da especificação dedicada;
- underscore representa a origem individual;
- quatro lógicas abstratas representam sites, aplicações, integrações e soluções sob medida;
- trajetórias convergem nos módulos oficiais do símbolo;
- wordmark revelado por Ink Transfer com máscara SVG;
- lock final com overshoot dentro do limite documentado;
- handoff obrigatório para símbolo do header, compassos, clave e duas partituras;
- executar somente uma vez por sessão;
- pular em `prefers-reduced-motion`.

## M-011 — Bifurcação da Home

- linhas nascem próximas à clave e avançam simultaneamente para esquerda e direita;
- diferença de atraso entre ramos: máximo 120 ms;
- conteúdo dos dois lados aparece em sentidos opostos;
- nenhum ramo parece hierarquicamente obrigatório.

## M-012 — Ênfase de ramo

- acionada por hover ou foco de CTA/compasso;
- aumenta opacidade e saturação da pauta correspondente;
- notas podem avançar 2–4 px;
- ramo oposto permanece legível;
- reverte em até 220 ms.

## M-013 — Transição de capítulo à esquerda

- usada ao avançar no ramo da aplicação;
- conteúdo atual desloca para a direita;
- novo conteúdo entra pela esquerda;
- segmento temporário da pauta conecta as duas rotas;
- duração alvo: 620–820 ms.

## M-014 — Transição de capítulo à direita

- usada ao avançar no ramo institucional;
- conteúdo atual desloca para a esquerda;
- novo conteúdo entra pela direita;
- segmento temporário da pauta conecta as duas rotas;
- duração alvo: 620–820 ms.

## M-015 — Alinhamento de continuidade

- anima apenas `transform`, `opacity` e `stroke-dashoffset`;
- mede âncoras uma vez antes da timeline;
- não lê layout em `onUpdate`;
- remove o overlay de conexão ao concluir.

## M-016 — Tablet: inclinação CSS 3D

- rotação máxima absoluta: 6° por eixo;
- sombra e reflexo respondem ao cursor;
- retorno ao repouso em 320–520 ms;
- desativado em reduced motion e em dispositivos sem hover preciso.

## M-017 — Tablet: simulação de transposição

- interação iniciada por botão real;
- estado de processamento local entre 500 e 900 ms;
- notas/armadura da amostra mudam de forma determinística;
- anunciar resultado em `aria-live`;
- nenhuma chamada de rede ou upload.

## M-018 — Navegação anterior/próximo

- seta e nota indicadora respondem em até 180 ms;
- clique inicia M-013 ou M-014 conforme coordenadas;
- foco não é perdido durante a navegação;
- controle terminal aponta para CTA externo ou Home, não para capítulo inexistente.
