# Testes de acessibilidade

## Automáticos

- axe-core em páginas e stories;
- contraste;
- labels;
- landmarks;
- nomes acessíveis;
- `aria-current`;
- foco em menu;
- ordem do DOM independente da direção visual;
- campos e estado do tablet;
- formulário e mensagens.

## Manuais

- navegação somente por teclado;
- leitor de tela em cada jornada principal;
- zoom 200% e 400%;
- tema de alto contraste quando disponível;
- `prefers-reduced-motion`;
- foco após mudança de rota;
- Back/Forward;
- links anterior/próximo;
- mensagens de formulário;
- menu mobile;
- tablet por teclado;
- resultado do tablet anunciado;
- conteúdo sem JavaScript quando aplicável.

## Regras para direção visual

- o ramo esquerdo não pode inverter a ordem lógica de leitura;
- a ordem DOM segue heading, descrição, controles e navegação;
- anterior/próximo possuem rótulos completos, não somente setas;
- a pauta é decorativa e não entra na árvore de acessibilidade;
- barra final decorativa usa `aria-hidden`; o encerramento deve ser compreensível pelo texto/CTA.

## Critérios bloqueadores

- conteúdo inacessível por teclado;
- foco invisível ou perdido após rota;
- erro não anunciado;
- movimento extenso no modo reduzido;
- contraste insuficiente em texto/controle;
- ordem de leitura diferente da ordem lógica;
- tablet operável apenas por cursor;
- CTA externo sem indicação adequada quando abre nova aba;
- página dependente de animação para revelar conteúdo.
