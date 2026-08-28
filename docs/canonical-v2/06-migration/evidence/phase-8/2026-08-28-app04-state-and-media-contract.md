# APP-04 State and Media Contract

Closeout date: 2026-08-28

## State authority

APP-04 exposes exactly the canonical states `NOT_STARTED`, `PLAYING`,
`FINAL_FRAME`, `ERROR_STATIC`, and `REDUCED_STATIC`. A pure reducer owns state
transitions. Chapter activity, document visibility, media events, explicit
replay, and reduced-motion preference are inputs to that authority.

- A complete media contract does not start on mount, preload, refresh, or
  proximity. Its first active chapter entry requests playback.
- Leaving the active chapter or hiding the document pauses the owned media.
- Returning while still in `PLAYING` resumes; completion yields the final frame.
- Replay resets time and is the only possible control inside the simulated
  screen.
- Rejected playback and media/static-asset errors fail to a deterministic
  static state without blocking navigation.
- Unmount invalidates pending play requests and pauses the owned element.

## Intentionally absent final media

No WebM, MP4, poster, or final-frame asset is shipped by Phase 8. With no
complete contract APP-04 creates no `video`, `img`, `picture`, or `canvas`,
installs no active-chapter observer, and renders `ERROR_STATIC` with explicit
pt-BR pending-approval copy.

The URLs under `/__phase8-app04-contract/` are sentinel identifiers exposed
only by an explicit development scenario. Playwright intercepts them with
minimal fixtures to prove lifecycle behavior. They are not files, product
footage, placeholders presented as final, or an asset approval. Final media
remains OpenSpec task 37 / Phase 11 and requires owner supply and approval.
