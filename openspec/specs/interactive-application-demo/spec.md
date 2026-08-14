# interactive-application-demo Specification — v2 media demonstration

## Purpose

Provide a safe, illustrative device demonstration through approved media without implementing a fake interactive application.

## Requirements

### Requirement: Playback starts only when APP-04 is active
Preload, mount, readiness, refresh, or proximity SHALL NOT start playback. The first run starts only when the demonstration is the active chapter/section and the document is visible.

### Requirement: Single play then exact final frame
The muted/no-audio video SHALL not loop. On ended, the approved final-frame image and top-center replay control SHALL appear.

### Requirement: Simulated UI is inert
No simulated application control SHALL receive focus/click/form events. Replay is the only interactive screen control.

### Requirement: Reduced motion and failure are static-safe
Reduced motion SHALL not autoplay. Media failure SHALL preserve a valid poster/final static state and never an empty screen.
