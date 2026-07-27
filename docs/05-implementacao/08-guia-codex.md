# Guia operacional para Codex

## Antes de escrever código

1. identificar a fase atual;
2. confirmar que a anterior está concluída;
3. ler requisitos, design, segurança e QA relacionados;
4. localizar especificação OpenSpec;
5. listar arquivos que serão alterados;
6. apontar riscos e dependências;
7. não instalar pacote sem autorização documental.

## Durante a implementação

- mudanças pequenas e rastreáveis;
- testes junto do componente;
- nomes alinhados à documentação;
- sem atalhos que eliminem acessibilidade;
- sem conteúdo fictício;
- sem `any` injustificado;
- sem segredo no cliente;
- sem cópia das referências visuais.

## Depois

1. executar lint;
2. executar typecheck;
3. executar unitários;
4. executar Storybook/testes visuais aplicáveis;
5. executar Playwright;
6. executar Lighthouse quando a mudança afetar UI ou bundle;
7. atualizar changelog e decisão quando necessário;
8. registrar limitações reais;
9. somente então marcar a etapa concluída.

## Resposta diante de ambiguidade

Não escolher uma biblioteca alternativa nem reinterpretar o produto. Registrar a dúvida com opções e impacto.
