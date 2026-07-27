# Acessibilidade

## Semântica

- landmarks `header`, `nav`, `main`, `section` e `footer`;
- um único `h1` por página;
- headings em ordem lógica;
- links do header permanecem links reais;
- notas decorativas usam `aria-hidden="true"`;
- SVG informativo recebe título/descrição; SVG decorativo é ocultado.

## Teclado

- skip link;
- foco visível;
- navegação do header em ordem visual e lógica;
- menu mobile operável por teclado;
- `Escape` fecha diálogos/painéis;
- âncoras movem foco para o destino quando necessário.

## Movimento

- implementar modo reduzido completo;
- evitar grandes escalas, zooms e rotação;
- não piscar;
- não usar movimento automático infinito;
- permitir leitura sem depender do progresso de uma timeline.

## Contraste

- WCAG 2.2 AA para texto e controles;
- área de foco de alto contraste;
- estados não dependem exclusivamente de cor;
- pauta decorativa pode ser sutil, mas os links não.

## Formulário

- labels visíveis;
- mensagens ligadas por `aria-describedby`;
- resumo de erro;
- `aria-live` para envio, sucesso e falha;
- Turnstile com fallback e mensagem compreensível;
- consentimento explícito.
