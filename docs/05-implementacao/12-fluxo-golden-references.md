# Fluxo de referências visuais

**Status:** NORMATIVO — IMPLEMENTAÇÃO AUTORIZADA

## Objetivo

Usar os exemplos já aprovados como sistema visual suficiente para o Codex implementar todas as páginas, sem exigir uma nova imagem antes de cada rota.

## Estados

- `approved-individual`: comparação direta com PNG/spec;
- `approved-master-panel`: painel da prancha é canônico e deve ser reconstruído;
- `authorized-derived`: aplicar arquétipo, tokens, especificação e responsividade.

## Processo do Codex

1. ler a página na matriz;
2. localizar o arquétipo;
3. abrir as fontes visuais do arquétipo;
4. listar componentes e regras herdadas;
5. implementar a versão estática clara;
6. derivar tema escuro mantendo geometria;
7. adaptar mobile pelas regras normativas;
8. capturar screenshots determinísticos;
9. comparar com fontes e tokens;
10. executar axe, Playwright e visual regression;
11. submeter à homologação do proprietário.

## Novas referências

Podem ser criadas durante QA quando uma divergência exigir decisão visual. Elas não são pré-condição geral e não devem interromper páginas cobertas por arquétipos.

## Proibições

- inventar identidade nova;
- usar screenshots no frontend;
- autoaprovar divergência;
- alterar tokens para aproximar uma geração incorreta;
- copiar texto inválido de uma imagem.
