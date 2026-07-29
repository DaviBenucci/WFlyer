# Brief opcional para geração de referências adicionais

## Objetivo

Produzir, quando necessário durante QA, uma imagem adicional de página sem reabrir a autorização de implementação já concedida.

## Invariantes visuais

- fundo marfim e detalhes cobre/marrom no modo claro;
- fundo azul-marinho e detalhes violeta/cobalto no modo escuro;
- símbolo oficial W_Flyer centralizado no header;
- navegação da aplicação à esquerda e institucional à direita;
- títulos serifados editoriais;
- corpo e interface em sans-serif;
- pauta musical ondulada em SVG, com notas coerentes;
- botões em cápsula;
- cards de borda fina;
- sombras suaves no claro e glow focal no escuro;
- amplo espaço negativo;
- nenhuma pessoa;
- nenhuma marca de terceiros;
- nenhuma métrica, cliente, depoimento, contato ou rede social inventada.

## Invariantes estruturais

- imagem individual, não prancha com várias páginas;
- resolução desktop 1536 × 1024 ou mobile 390 × 844;
- mesmo layout entre claro e escuro;
- header, conteúdo, pauta e navegação local completos;
- pontos de entrada/saída da pauta coerentes com o manifesto;
- notas e barras de compasso determinísticas dentro da referência; não preencher a pauta com símbolos aleatórios a cada geração;
- barra final somente em Benefícios e Contato;
- rótulos como `MODO CLARO` são anotação externa e não pertencem ao site;
- textos em português devem ser legíveis;
- a logo deve corresponder ao asset oficial, sem reconstrução tipográfica.

## Tablet da Aplicação

- objeto com profundidade e leve inclinação;
- tela grande e legível;
- interface de partitura e controles públicos;
- a imagem mostra o estado visual, mas a implementação será DOM;
- não apresentar upload real, IA, OCR/OMR ou processamento interno;
- não adicionar teclado, caneta, mãos ou pessoa segurando o dispositivo.

## Continuidade

Antes de gerar:

1. ler capítulo anterior e seguinte;
2. confirmar o ramo e a direção;
3. definir a borda por onde a pauta entra;
4. definir a borda por onde sai;
5. manter o conteúdo afastado dessas zonas;
6. conferir se o terminal possui barra dupla;
7. comparar a borda de saída da página anterior e a borda de entrada da página atual;
8. não tentar conectar diretamente páginas de ramos diferentes.

## Conteúdo

Usar `docs/04-conteudo/02-copy-provisoria-home.md` como base editorial aprovada e os documentos de conteúdo específicos. Não preencher espaço com números, selos ou frases de marketing não aprovadas.

## Saída esperada

- composição plausível de ser reconstruída em HTML/CSS/SVG;
- sem detalhes impossíveis ou ornamentos que dependam de raster;
- sem watermark;
- sem bordas externas de apresentação, salvo quando a referência pedir explicitamente;
- um único tema por arquivo;
- Footer, quando gerado isoladamente, é componente compartilhado e não recebe coordenada ou barra final própria.

## Revisão

Após a geração, a imagem permanece `pending-approval`. Somente o usuário pode aprovar. Uma imagem adicional não bloqueia páginas já `authorized-derived`; após aprovação explícita, ela pode substituir o estado derivado na matriz.
