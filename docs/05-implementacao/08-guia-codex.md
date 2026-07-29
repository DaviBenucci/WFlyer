# Guia operacional para Codex

## Antes de escrever código

1. identificar a fase atual;
2. confirmar que a anterior está concluída;
3. localizar a rota no manifesto de capítulos;
4. confirmar `branch`, `coordinate`, `previous`, `next` e `terminal`;
5. verificar o status em `design-reference/golden-pages/page-matrix.yaml`;
6. abrir a golden reference aprovada e o `.spec.yaml` correspondente;
7. ler requisitos, design, motion, conteúdo, segurança e QA relacionados;
8. localizar a especificação OpenSpec;
9. listar arquivos que serão alterados;
10. apontar riscos e dependências;
11. não instalar pacote sem autorização documental.

## Quando a referência visual estiver pendente

- não inventar layout final;
- não usar a prancha mestra como substituta de uma referência individual quando a página não estiver definida;
- pode criar rota, semântica, tipos, manifesto, conteúdo e testes neutros;
- registrar `BLOCKED_GOLDEN_REFERENCE`;
- aguardar geração e aprovação.

## Durante a implementação

- mudanças pequenas e rastreáveis;
- testes junto do componente;
- nomes alinhados à documentação;
- sem atalhos que eliminem acessibilidade;
- sem conteúdo fictício;
- sem `any` injustificado;
- sem segredo no cliente;
- sem cópia raster das referências;
- sem importar arquivos de `docs/design-reference/` no runtime;
- reconstruir grid, espaço, tipografia, formas e estados com código;
- preservar a mesma árvore estrutural em claro/escuro;
- manter direção do ramo e continuidade da pauta;
- resolver a navegação como `adjacent-score`, `compressed-score-jump`, `home-pivot` ou `neutral`;
- não montar páginas intermediárias em saltos nem conectar diretamente os dois ramos;
- implementar estado estático correto antes da animação;
- não criar motion que não esteja catalogado.

## Comparação visual

1. executar página no viewport da referência;
2. fixar tema, conteúdo e preferência de movimento;
3. capturar screenshot determinístico;
4. comparar lado a lado e por diff;
5. corrigir primeiro estrutura e proporção;
6. depois tipografia, cor, borda e sombra;
7. por último microdetalhes;
8. não atualizar baseline sem aprovação.

## Depois

1. executar lint;
2. executar typecheck;
3. executar unitários;
4. executar Storybook/testes visuais aplicáveis;
5. executar Playwright;
6. executar axe;
7. executar Lighthouse quando a mudança afetar UI ou bundle;
8. validar claro, escuro e reduced motion;
9. atualizar changelog, status da página e decisão quando necessário;
10. registrar limitações reais;
11. somente então marcar a etapa concluída.

## Resposta diante de ambiguidade

Não escolher biblioteca alternativa, inventar conteúdo ou reinterpretar o sentido da partitura. Registrar a dúvida com opções e impacto.
