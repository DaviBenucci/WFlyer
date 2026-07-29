# W_Flyer — assets vetoriais de motion

## Status

`APPROVED_FOR_IMPLEMENTATION`

Os SVGs deste pacote são os assets oficiais para a abertura programática e o símbolo do header. Devem ser usados conforme as especificações de motion e não como animações embutidas.

## Assets

- `svg/wflyer-intro-master.svg`: palco vetorial inline para GSAP;
- `svg/wflyer-header-symbol.svg`: símbolo oficial com `currentColor`.

## Regras

1. importar o master inline como componente React/SVGR;
2. não editar paths oficiais;
3. usar GSAP para módulos, ecos, clip e sweep;
4. manter fundo no overlay HTML/CSS;
5. excluir arquivos `review/` do bundle;
6. usar estados `initial`, `symbol` e `final` para fallback, QA e reduced motion.

A homologação da animação completa ocorre no site em staging, mas os assets estão liberados para implementação.
