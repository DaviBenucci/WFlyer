## ADDED Requirements

### Requirement: Refined choreography has four functional projections
The approved refinement SHALL remain functional in horizontal-enhanced, vertical-wide, vertical-compact, and static/reduced-motion presentations. Physical geometry MAY simplify by mode, but composition identity, semantic slot ownership, chapter association, content exclusions, final barlines, and form functionality MUST remain invariant.

#### Scenario: Compact story avoids theatrical empty travel
- **WHEN** the story selects vertical-compact presentation
- **THEN** Projects and card interactions use compact content-safe routing without copying the full desktop travel or adding excessive empty scroll

#### Scenario: Reduced motion remains complete
- **WHEN** reduced motion is requested or enhanced motion cannot initialize
- **THEN** the vertical static story exposes every chapter, semantic navigation destination, launch-interest control, validation message, and terminal without horizontal pinning or lost information

### Requirement: Score refinement is non-blocking and bounded
The score SHALL remain decorative, pointer-inert, absent from reading order, and computed only when projection inputs change. Scrolling MUST NOT invoke Composer, update React score state per frame, or introduce a second motion owner.

#### Scenario: Visitor operates foreground controls
- **WHEN** a visitor points, focuses, types, submits, or traverses any card, link, Contact control, launch-interest control, or footer link
- **THEN** the score cannot intercept the interaction or obscure visible focus and no programmatic score update is scheduled from that input alone

#### Scenario: Native scrolling advances the story
- **WHEN** continuous scroll progress changes without a resize or projection-mode change
- **THEN** the existing master timeline may transform the story while Composer invocation count and React score-render count remain unchanged

