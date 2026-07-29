# W_Flyer Brand Motion Assets — v1.0 review

## Status

`PENDING_USER_APPROVAL`

Este pacote contém os primeiros SVGs preparados especificamente para a animação de entrada documentada na versão `2.0-review`. Nenhum arquivo deste pacote deve ser considerado aprovado para produção antes da revisão visual do usuário.

## Assets de produção propostos

- `svg/wflyer-intro-master.svg`
  - palco vetorial 16:9 sem fundo embutido;
  - underscore de origem;
  - símbolo oficial dividido em três módulos animáveis;
  - dois ecos de contorno construídos com `<use>` da geometria oficial;
  - wordmark oficial integralmente convertido em paths;
  - clip de revelação persistente;
  - faixa `wf-ink-sweep` para o efeito de transferência;
  - tokens de cor por CSS Custom Properties;
  - nenhum vídeo, raster, fonte ou animação embutida.

- `svg/wflyer-header-symbol.svg`
  - símbolo oficial com IDs exclusivos para evitar colisão com o SVG da introdução;
  - mesma geometria dos três módulos do master;
  - `currentColor` para temas claro e escuro.

## Regras de uso

1. `wflyer-intro-master.svg` deve ser importado **inline** como componente React/SVGR. Não usar `<img>`, pois GSAP precisa acessar os IDs internos.
2. O wrapper `wf-intro-lockup-position` contém a posição estática aprovada. Ele não deve ser animado.
3. GSAP deve animar `wf-intro-logo`, `wf-logo`, os módulos, os ecos, o clip e o sweep.
4. O fundo pertence ao overlay HTML/CSS e não ao asset de produção.
5. Os arquivos em `review/` são somente pranchas de inspeção; não devem ser enviados ao build da aplicação.
6. Não editar os paths. Mudanças de geometria exigem nova versão do pacote.

## Estados estáticos suportados pelo master

O atributo `data-state` existe para fallback, QA e reduced motion:

- `initial`: somente underscore;
- `symbol`: símbolo oficial, sem wordmark;
- `final`: lockup oficial completo.

A timeline normal deve controlar os elementos diretamente com GSAP.
