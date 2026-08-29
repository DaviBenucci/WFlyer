# interactive-application-demo Specification — v2 media demonstration

## Purpose

Provide a safe, illustrative device demonstration through approved media without implementing a fake interactive application.

## Requirements

### Requirement: Playback starts only when APP-04 is active
Preload, mount, readiness, refresh, or proximity SHALL NOT start playback. The first run starts only when the demonstration is the active chapter/section and the document is visible.

#### Scenario: APP-04 becomes actively visible
- **WHEN** APP-04 is the active chapter or section and the document is visible for the first run
- **THEN** playback may start
- **AND** preload, mount, readiness, refresh, or proximity alone never starts it

### Requirement: Single play then exact final frame
The muted/no-audio video SHALL not loop. On ended, the approved final-frame image and top-center replay control SHALL appear.

#### Scenario: Demonstration playback ends
- **WHEN** the muted demonstration reaches its end
- **THEN** it does not loop and the approved final-frame image appears with the top-center replay control

### Requirement: Simulated UI is inert
No simulated application control SHALL receive focus/click/form events. Replay is the only interactive screen control.

#### Scenario: User explores the simulated interface
- **WHEN** the user navigates, clicks, or taps within the simulated application UI
- **THEN** simulated controls remain inert and replay is the only interactive screen control

### Requirement: Reduced motion and failure are static-safe
Reduced motion SHALL not autoplay. Media failure SHALL preserve a valid poster/final static state and never an empty screen.

#### Scenario: Motion is reduced or media fails
- **WHEN** reduced motion is active or demonstration media cannot play
- **THEN** autoplay does not occur and a valid poster or final static state remains visible
