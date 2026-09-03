## ADDED Requirements

### Requirement: Header navigation order is semantic and explicit
The story header SHALL use an explicit navigation manifest independent of physical X position, master-story progress, or branch travel direction. Its order MUST be Aplicação, Como funciona, Benefícios, Lançamento; W_Flyer; Sobre, Serviços, Processo, Projetos, Contato. Demonstration MUST remain a story chapter without a dedicated header item.

#### Scenario: Header renders from either branch position
- **WHEN** the visitor is at an Application or Professional chapter
- **THEN** header DOM order remains the canonical semantic order, Processo and Lançamento are present, and Demonstration is absent

#### Scenario: Every semantic header item resolves independently of branch direction
- **WHEN** each of the ten items is activated by pointer or keyboard
- **THEN** it traverses to its exact canonical scene, applies the established explicit-navigation hash/history behavior, marks that same item active, and preserves canonical tab order even though Application physical progress decreases away from Home

#### Scenario: Lançamento target resolves
- **WHEN** the visitor activates Lançamento
- **THEN** the existing navigation controller traverses native story progress to the PRELAUNCH scene, updates history only under the established explicit-navigation rules, and never teleports

### Requirement: Header traversal lifecycle remains unchanged
The semantic manifest correction MUST preserve proportional native-scroll traversal capped at 3.0 seconds, interruption by explicit user input, cancellation on supersession or unmount, focus behavior, and passive `replaceState` versus successful explicit `pushState` semantics.

#### Scenario: User interrupts a long traversal
- **WHEN** the visitor provides supported navigation input during an extreme-branch header traversal
- **THEN** the automated traversal cancels cleanly, native scrolling takes precedence, and no parallel story state or orphaned resource remains

### Requirement: Application final scene reflects current availability
The Application final content scene SHALL use `PRELAUNCH` behavior until a later approved state change sets it to `LIVE`. PRELAUNCH MUST expose launch status, the launch-interest form, explicit consent, and no unavailable application-access action; LIVE MAY later replace that form with the canonical application URL through the same minimal scene-state seam.

#### Scenario: Current public state is pre-launch
- **WHEN** the Application final scene renders under the approved current configuration
- **THEN** it explains that the application is in development, offers notification registration, and contains no `Acessar W_Flyer` link

### Requirement: Story closing avoids duplicate visual footers
The immersive story SHALL render one visual closing/footer presentation at its terminal boundary while preserving one semantic navigation close in vertical fallback and leaving unrelated route footers intact.

#### Scenario: Immersive visual close
- **WHEN** a branch terminal already presents the shared footer groups
- **THEN** the route boundary does not append a second visually duplicated global footer block
