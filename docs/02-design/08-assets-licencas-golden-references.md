# Assets, licenças e referências visuais

## Classes

### Inspiração

Arquivos de terceiros em `design-reference/inspiration/` são somente direção e nunca entram no produto.

### Prancha mestra aprovada

A prancha mestra fixa identidade, temas, header, densidade, cards, botões, pauta e os painéis canônicos de Home, Serviços, Portfólio, Contato e Footer.

### Referência individual

Imagem de página/viewport/tema com spec. Aplicação — desktop claro é a referência individual aprovada atual.

### Arquétipo autorizado

Contrato reutilizável que permite implementar páginas relacionadas sem exigir um PNG separado. O arquétipo define fontes visuais, estrutura, densidade, seções, tema e adaptação responsiva.

## Gate atualizado

A implementação é autorizada quando o estado da matriz for:

- `approved-individual`;
- `approved-master-panel`;
- `authorized-derived`.

`authorized-derived` não significa liberdade criativa. Exige herança fiel de `visual-archetypes.yaml`, tokens, especificação da página e componentes aprovados.

## Reconstrução

O Codex deve usar HTML, CSS, SVG e componentes. É proibido usar PNG como background, recortar elementos, mapear cliques sobre imagem, usar screenshot como tablet ou copiar conteúdo errado da imagem.

## Mobile e tema escuro

Mobile e tema escuro podem ser derivados quando a matriz autorizar:

- geometria e hierarquia preservadas;
- tokens oficiais aplicados;
- regras de `06-responsividade.md` seguidas;
- QA visual, axe e Playwright executados;
- homologação final pelo proprietário.
