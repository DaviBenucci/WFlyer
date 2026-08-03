# Transições entre capítulos

**Status:** NORMATIVO

## 1. Escopo

Este documento define a troca entre rotas da linha principal. Não se aplica a links externos, download, âncoras internas, políticas ou abertura em nova aba.

## 2. Resolução do modo de transição

```ts
const delta = destination.coordinate - origin.coordinate;
const sameBranch = origin.branch === destination.branch;
const adjacent = sameBranch && Math.abs(delta) === 1;

type ChapterTransitionMode =
  | "adjacent-score"
  | "compressed-score-jump"
  | "home-pivot"
  | "neutral";
```

- origem desconhecida, carregamento direto ou rota auxiliar: `neutral`;
- ramos principais diferentes: `home-pivot`;
- mesmo ramo e `Math.abs(delta) === 1`: `adjacent-score`;
- mesmo ramo e `Math.abs(delta) > 1`: `compressed-score-jump`;
- `delta < 0`: destino está à esquerda;
- `delta > 0`: destino está à direita;
- `delta === 0`: transição neutra.

A direção visual reflete a coordenada. O modo reflete a topologia do grafo. Não conectar diretamente as pautas de ramos diferentes.

## 3. Comportamento por modo

### `adjacent-score`

Usa a âncora de saída real da origem, segmento vetorial temporário e âncora de entrada do destino. É o único modo que representa continuidade de compassos vizinhos.

### `compressed-score-jump`

Mantém a direção do destino, mas usa um segmento abstrato curto com duas ou três marcas de compasso. Não renderiza conteúdo, thumbnails ou screenshots das páginas intermediárias e não aumenta a duração além do orçamento.

### `home-pivot`

Executa duas fases sobrepostas: origem em direção ao centro e destino a partir do centro. O símbolo do header é o pivô visual estável. A clave narrativa da Home pode ser sugerida por traço/eco curto na camada de transição, mas a Home não é montada nem anunciada como navegação intermediária.

### `neutral`

Crossfade curto ou troca direta. É obrigatório em carregamento inicial, políticas, detalhes de serviço, destino externo e situações em que a medição falhar.

## 4. Lifecycle

### Preparação

1. validar que o clique pode ser interceptado;
2. resolver metadados de origem/destino;
3. registrar elemento que possui foco;
4. medir âncora de saída;
5. preparar camada de conexão;
6. iniciar navegação sem bloquear por mais de 100 ms.

### Saída

- reduzir opacidade do conteúdo para aproximadamente 0,72;
- deslocar conteúdo de 8–12% do viewport no sentido oposto ao destino;
- manter header estável;
- revelar segmento de pauta temporário;
- notas seguem a tangente do path.

### Entrada

- nova página existe no DOM antes da fase final;
- alinhar âncora de entrada com o segmento temporário;
- revelar pauta local;
- conteúdo entra com deslocamento inverso de 8–12%;
- opacidade chega a 1 antes de liberar foco;
- remover camada temporária e atributos de performance.

## 5. Duração

```yaml
prepare: 0-100ms
outgoing: 260-360ms
overlap: 120-220ms
incoming: 300-420ms
total_target: 620-820ms
hard_limit: 900ms
```

- `compressed-score-jump` usa o mesmo limite, independentemente da distância;
- `home-pivot` pode ocupar 760–900 ms, com sobreposição entre as duas fases;
- `neutral` deve durar no máximo 220 ms;
- nenhuma transição aguarda asset decorativo para concluir.

## 6. Foco e scroll

- ao concluir, mover foco programaticamente somente conforme estratégia definida para navegação de SPA;
- preferir foco no `main` com `tabindex="-1"` ou no `h1`, sem anunciar conteúdo duas vezes;
- scroll da nova página inicia no topo em navegação normal;
- `Back/Forward` pode restaurar posição quando o navegador fornecer estado confiável;
- nunca mover foco para elemento decorativo da pauta.

## 7. Links externos

`Acessar aplicação` não recebe transição de capítulo completa. Pode usar microestado de CTA e então seguir o comportamento normal do link. Não atrasar abertura de nova aba.

## 8. Mudança de tema durante transição

- bloquear somente a animação visual do toggle por menos de 900 ms, não o controle inteiro;
- aplicar o tema ao layout persistente e à página entrante no mesmo frame;
- não permitir um frame claro entre duas páginas escuras ou o inverso.

## 9. Falha e interrupção

- se a rota carregar antes da medição, mostrar a nova página sem continuidade animada;
- se a timeline falhar, finalizar estilos e remover overlay;
- cliques repetidos não criam filas ilimitadas;
- aceitar somente um destino pendente; o último clique válido pode substituir o anterior antes da navegação;
- timeout obrigatório de 1.100 ms.

## 10. Testabilidade

A implementação deve expor modo determinístico para:

- congelar em início, sobreposição e fim;
- informar origem, destino e direção via atributo `data-*` em ambiente de teste;
- desativar randomização de notas;
- capturar screenshot sem dependência de relógio real.

## 11. Phase 05 audit reconciliation

The delegated coordinator evaluates eligible main-chapter anchors during capture. An anchor that must retain native behavior declares `data-score-transition="native"`; this explicit contract is observable before descendant bubble handlers and does not depend on event-ordering assumptions. Modified activations, downloads, external destinations, hashes, non-self targets, and events already cancelled before capture remain native as documented elsewhere.

Rapid activation has two distinct history rules:

- before the first destination commits, retain only the latest pending destination and do not preserve a route that was never available to the visitor;
- after a destination commits, any continued chapter navigation creates a new history entry, even while the incoming animation is still settling, so Back returns through every committed chapter.

DOM measurement stays in the experience coordinator. Anchor-kind selection, manifest fallback, Home-pivot fallback, segment topology, SVG path construction, and point interpolation use the single pure runtime geometry module that is covered directly by unit tests.
