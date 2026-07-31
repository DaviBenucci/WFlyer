## Purpose

Define a continuidade visual previsível entre capítulos da dupla partitura sem
transformar rotas intermediárias em conteúdo nem comprometer o orçamento.

## ADDED Requirements

### Requirement: Transition topology is deterministic
O site SHALL resolver o modo e a direção da transição exclusivamente pelos
metadados normativos dos capítulos de origem e destino.

#### Scenario: Adjacent chapters in the same branch
- **GIVEN** origem e destino conhecidos no mesmo ramo
- **WHEN** a diferença absoluta entre coordenadas é 1
- **THEN** o modo é `adjacent-score` e a direção segue o sinal do delta

#### Scenario: Non-adjacent chapters in the same branch
- **GIVEN** origem e destino conhecidos no mesmo ramo
- **WHEN** a diferença absoluta entre coordenadas é maior que 1
- **THEN** o modo é `compressed-score-jump` sem representar páginas intermediárias

#### Scenario: Chapters in different main branches
- **GIVEN** origem e destino pertencem a ramos diferentes
- **WHEN** a navegação é classificada
- **THEN** o modo é `home-pivot` e a Home atua somente como pivô conceitual

#### Scenario: Unknown or auxiliary route
- **GIVEN** a origem ou o destino não possui metadados de capítulo principal
- **WHEN** a navegação ocorre
- **THEN** o modo é `neutral`

#### Scenario: Equal coordinates
- **GIVEN** origem e destino têm a mesma coordenada
- **WHEN** a navegação é classificada
- **THEN** a transição é neutra e não declara direção espacial

### Requirement: Each mode preserves its visual meaning
O site SHALL distinguir continuidade adjacente, salto comprimido, pivô pela Home
e troca neutra sem usar screenshots como interface produtiva.

#### Scenario: Adjacent score continuity
- **GIVEN** o modo `adjacent-score`
- **WHEN** a transição é executada
- **THEN** a âncora real de saída se conecta temporariamente à âncora de entrada do destino

#### Scenario: Compressed jump
- **GIVEN** o modo `compressed-score-jump`
- **WHEN** a transição é executada
- **THEN** um segmento abstrato curto indica distância sem montar conteúdo intermediário

#### Scenario: Home pivot
- **GIVEN** o modo `home-pivot`
- **WHEN** a transição é executada
- **THEN** as fases se sobrepõem em torno do centro sem montar nem anunciar a Home como rota intermediária

#### Scenario: Neutral transition
- **GIVEN** o modo `neutral`
- **WHEN** a troca visual é possível
- **THEN** ela usa troca direta ou crossfade de no máximo 220 ms

### Requirement: Transition time is bounded
O lifecycle animado SHALL mirar 620–820 ms, MUST terminar em até 900 ms e MUST
liberar a navegação por fallback em até 1.100 ms.

#### Scenario: Long compressed distance
- **GIVEN** um salto comprimido entre capítulos distantes
- **WHEN** a timeline é executada
- **THEN** sua duração não cresce proporcionalmente à quantidade de capítulos

#### Scenario: Home pivot upper bound
- **GIVEN** uma troca de ramo por `home-pivot`
- **WHEN** as duas fases se sobrepõem
- **THEN** a transição termina em até 900 ms

#### Scenario: Timeline failure
- **GIVEN** uma exceção, medição indisponível ou asset decorativo atrasado
- **WHEN** o lifecycle não pode continuar
- **THEN** estilos temporários e overlay são removidos e o destino fica utilizável até 1.100 ms

### Requirement: Concurrent navigation is bounded
O site MUST manter no máximo um destino pendente e não SHALL criar uma fila
ilimitada de transições.

#### Scenario: Repeated valid clicks
- **GIVEN** uma transição ainda não consolidada
- **WHEN** outro destino interno válido é acionado
- **THEN** o último destino permitido substitui o pendente sem overlays órfãos

### Requirement: Theme continuity is atomic
O tema do layout persistente e da página entrante SHALL ser aplicado no mesmo
frame visual.

#### Scenario: Theme toggle during transition
- **GIVEN** uma transição em andamento
- **WHEN** a pessoa altera o tema
- **THEN** o controle continua operável e nenhum frame de tema incorreto é exibido

### Requirement: Transition state is testable
O site SHALL oferecer um modo determinístico exclusivo de teste para observar
origem, destino, direção e fases sem depender de relógio ou aleatoriedade reais.

#### Scenario: Visual checkpoint
- **GIVEN** ambiente de teste determinístico
- **WHEN** início, sobreposição ou fim é solicitado
- **THEN** a fase congela com metadados `data-*` e notas não aleatórias para captura
