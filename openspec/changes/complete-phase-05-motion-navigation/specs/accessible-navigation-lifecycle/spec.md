## Purpose

Preservar semântica, foco, histórico, deep links e preferências de movimento
durante a navegação coordenada entre páginas do site institucional.

## ADDED Requirements

### Requirement: Only eligible internal chapter links are intercepted
O site SHALL preservar o comportamento nativo de qualquer navegação que não seja
um clique primário elegível entre capítulos principais.

#### Scenario: Eligible chapter link
- **GIVEN** um link interno para capítulo principal sem modificadores
- **WHEN** o clique primário ocorre no mesmo contexto de navegação
- **THEN** o lifecycle coordenado pode interceptar a navegação

#### Scenario: Native link categories
- **GIVEN** link externo, download, âncora interna, rota auxiliar, nova aba ou clique com modificador
- **WHEN** a pessoa ativa o link
- **THEN** o navegador mantém o comportamento nativo sem transição completa de capítulo

#### Scenario: Public application CTA
- **GIVEN** o CTA para `app.wflyer.com.br`
- **WHEN** ele é ativado
- **THEN** nenhum atraso de transição de capítulo bloqueia sua abertura normal

### Requirement: Deep links and no-JavaScript navigation remain valid
Cada rota SHALL renderizar diretamente e links reais MUST continuar navegáveis
quando o coordenador não estiver disponível.

#### Scenario: Direct page load
- **GIVEN** uma URL interna acessada sem origem conhecida
- **WHEN** a página carrega diretamente
- **THEN** o conteúdo é exibido sem depender de uma timeline e qualquer estado visual é neutro

#### Scenario: JavaScript unavailable
- **GIVEN** JavaScript desativado ou falha antes da hidratação
- **WHEN** um link interno real é acionado
- **THEN** o navegador carrega a URL de destino normalmente

### Requirement: Focus and scroll follow page navigation semantics
Após uma navegação concluída, o site SHALL levar foco ao conteúdo principal ou
título sem anúncio duplicado e SHALL evitar foco em decoração.

#### Scenario: Forward navigation
- **GIVEN** uma navegação interna comum concluída
- **WHEN** o conteúdo entrante está visível
- **THEN** o foco é movido para `main` ou `h1` e o scroll inicia no topo

#### Scenario: Browser history restoration
- **GIVEN** uma navegação Back/Forward com posição confiável fornecida pelo navegador
- **WHEN** o destino é restaurado
- **THEN** a posição pode ser preservada sem impedir acesso por teclado ao conteúdo

### Requirement: Browser history is truthful
O site MUST registrar somente o destino efetivamente consolidado e SHALL tratar
Back/Forward sem criar entradas ou rotas intermediárias falsas.

#### Scenario: Branch pivot
- **GIVEN** uma transição `home-pivot`
- **WHEN** a navegação termina
- **THEN** o histórico contém origem e destino, mas não uma visita artificial à Home

#### Scenario: Superseded pending destination
- **GIVEN** um destino pendente substituído antes da consolidação
- **WHEN** a transição termina
- **THEN** o histórico não contém a navegação descartada

### Requirement: Reduced motion preserves all functionality
Quando `prefers-reduced-motion: reduce` estiver ativo, o site MUST evitar viagem
espacial extensa e SHALL manter links, foco, histórico, scroll e conteúdo.

#### Scenario: Reduced route transition
- **GIVEN** preferência de movimento reduzido
- **WHEN** ocorre uma navegação elegível
- **THEN** a rota troca diretamente ou com crossfade de 150–200 ms sem segmento animado

#### Scenario: Preference changes at runtime
- **GIVEN** uma sessão hidratada
- **WHEN** a preferência do sistema muda
- **THEN** timelines incompatíveis são revertidas e o estado permanece utilizável

### Requirement: Accessibility survives failure and interruption
Falhas, timeouts ou cliques concorrentes MUST NOT deixar conteúdo oculto, foco
preso, overlay interceptando eventos ou atributos temporários ativos.

#### Scenario: Timeout recovery
- **GIVEN** um lifecycle que excede o prazo
- **WHEN** 1.100 ms são atingidos
- **THEN** o destino é liberado, o overlay é removido e o foco pode alcançar o conteúdo

#### Scenario: Keyboard activation
- **GIVEN** um link elegível com foco
- **WHEN** ele é ativado pelo teclado
- **THEN** a navegação produz o mesmo destino e a mesma estratégia de foco do clique
