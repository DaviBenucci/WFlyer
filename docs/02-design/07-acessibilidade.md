# Acessibilidade

## Semântica

- landmarks `header`, `nav`, `main`, `section` e `footer`;
- um único `h1` por página;
- headings em ordem lógica;
- links do header, anterior e próximo permanecem links reais;
- notas e pautas decorativas usam `aria-hidden="true"`;
- SVG informativo recebe título/descrição; SVG decorativo é ocultado;
- direção visual esquerda/direita não altera a ordem lógica do DOM;
- barra final decorativa não é a única indicação de encerramento.

## Navegação entre capítulos

- mudança de rota preserva histórico;
- foco é conduzido de forma previsível para o conteúdo principal;
- não anunciar a página duas vezes;
- deep links não dependem de timeline;
- anterior/próximo possui texto completo, não somente ícone;
- símbolo central do header possui nome acessível de retorno à Home;
- o capítulo Processo é indicado sem adicionar um rótulo que quebre a composição aprovada do header.

## Teclado

- skip link;
- foco visível;
- navegação do header em ordem visual e lógica;
- menu mobile operável por teclado;
- `Escape` fecha diálogos, menu e abertura quando permitido;
- âncoras movem foco para o destino quando necessário;
- controles do tablet usam Tab, Shift+Tab, Enter, Space e setas quando o controle nativo as suporta;
- transição não prende foco na camada temporária.

## Movimento

- implementar modo reduzido completo;
- evitar grandes escalas, zooms e rotação;
- não piscar;
- não usar movimento automático infinito;
- permitir leitura sem depender do progresso de timeline;
- remover tilt do tablet em reduced motion;
- não exigir arraste horizontal.

## Contraste

- WCAG 2.2 AA para texto e controles;
- área de foco de alto contraste;
- estados não dependem exclusivamente de cor;
- pauta decorativa pode ser sutil, mas links e indicadores não;
- glow não pode apagar contornos ou texto.

## Tablet demonstrativo

- tela construída em DOM;
- labels visíveis ou programaticamente associados;
- estado de processamento anunciado;
- resultado em `aria-live="polite"`;
- botão de reset acessível;
- inclinação reduzida quando um controle recebe foco;
- funcionalidade completa sem hover;
- amostra musical deve ter alternativa textual suficiente para compreender a mudança ilustrativa.

## Formulário

- labels visíveis;
- mensagens ligadas por `aria-describedby`;
- resumo de erro;
- `aria-live` para envio, sucesso e falha;
- Turnstile com fallback e mensagem compreensível;
- consentimento explícito;
- barra final não pode interromper a ordem de leitura ou ocultar feedback.
