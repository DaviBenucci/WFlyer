# Orçamento de performance para motion

## Metas

- 60 FPS em desktop comum durante transições e tilt;
- ausência de long tasks recorrentes acima de 50 ms;
- usar somente `transform`, `opacity` e `stroke-dashoffset` em animação contínua;
- evitar layout thrashing;
- não recalcular path a cada frame;
- pausar reações de cursor quando a aba estiver oculta;
- não manter RAF customizado quando GSAP já gerencia o frame;
- liberar `will-change` após cada timeline.

## Bundle

- GSAP carregado somente onde necessário;
- tablet interativo por DOM/CSS, sem biblioteca 3D;
- Turnstile carregado próximo ao contato;
- nenhum framework de UI completo;
- alvo inicial de JavaScript da página Aplicação, incluindo demo: até 290 KB comprimidos, sujeito à medição real;
- demais páginas devem permanecer abaixo do orçamento da homepage sempre que possível;
- nenhum pacote da aplicação musical no bundle institucional.

## Transições

- camada persistente sem screenshots ou canvas de página;
- máximo de dois segmentos de pauta animados simultaneamente;
- máximo de oito notas decorativas em movimento simultâneo durante rota;
- duração total até 900 ms;
- timeout de segurança libera a navegação em até 1.100 ms;
- leituras de layout concentradas antes da timeline.

## Tablet

- tilt atualizado por `gsap.quickTo`, CSS variables ou técnica equivalente sem criar timeline por evento;
- limitar processamento a um frame por ciclo de renderização;
- desativar listener quando fora do viewport;
- não animar box-shadow complexo a cada frame se um pseudo-elemento transformado resolver;
- sample de partitura em SVG/HTML leve;
- nenhum upload, decodificação de PDF ou processamento de imagem.

## Imagens

- preferir SVG para música;
- raster em AVIF/WebP somente para conteúdo editorial autorizado;
- dimensões declaradas;
- nenhuma imagem de inspiração ou golden reference no build produtivo;
- preload apenas do recurso LCP real.

## Teste

Medir em desktop e mobile com CPU/rede simuladas e em dispositivo real intermediário, incluindo GPU integrada, tema claro/escuro e reduced motion.

## Orçamento específico da abertura

- máximo de 12 elementos animados simultaneamente;
- máximo de quatro paths com `stroke-dashoffset` simultâneo;
- SVGs combinados preferencialmente abaixo de 100 KB comprimidos;
- preparação com timeout máximo de 1.200 ms;
- nenhuma leitura de layout dentro de `onUpdate`;
- `getTotalLength()` calculado e armazenado;
- duração conforme timeline normativa;
- nenhuma animação ambiental permanece após o handoff.
