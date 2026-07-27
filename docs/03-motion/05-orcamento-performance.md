# Orçamento de performance para motion

## Metas

- 60 FPS em desktop comum durante a cena;
- ausência de long tasks recorrentes acima de 50 ms;
- usar apenas `transform` e `opacity` em animação contínua;
- evitar layout thrashing;
- não recalcular caminho a cada frame;
- pausar reações de cursor quando a aba estiver oculta;
- não manter RAF customizado quando GSAP já gerencia o frame.

## Bundle

- GSAP somente na homepage e componentes que o usam;
- Turnstile carregado próximo ao contato;
- nenhum framework de UI completo;
- alvo inicial de JavaScript da homepage: até 260 KB comprimidos após módulos interativos, sujeito à medição real;
- código do primeiro viewport deve ser menor por lazy loading da cena quando tecnicamente viável.

## Imagens

- preferir SVG para música;
- raster em AVIF/WebP;
- dimensões declaradas;
- nenhuma imagem de inspiração no build produtivo;
- preload apenas do recurso LCP real.

## Teste

Medir em desktop e mobile com CPU/rede simuladas e com dispositivo real de capacidade intermediária.
