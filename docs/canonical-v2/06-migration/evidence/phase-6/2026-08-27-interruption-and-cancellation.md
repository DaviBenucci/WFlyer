# Interruption and Cancellation Matrix

Date: 2026-08-27

| Input/lifecycle event | Owned result | History result | Position result |
|---|---|---|---|
| wheel | cancel `wheel` | no append; passive replace only | user wheel delta remains authoritative |
| touch start/move | cancel `touch` | no append | current native position retained |
| pointer down away from header target | cancel `pointer` | no append | current native position retained |
| Page Up/Down, Space, Home, End, arrows | cancel `keyboard` | no append | native key behavior is not prevented |
| Escape | cancel `escape` | no append | focus context retained |
| hidden document | cancel `hidden-document` | no append | no deferred completion |
| new header target | settle old as `superseded` | old request does not append | new distance starts at current scroll |
| semantic positioning | cancel `positioning` | positioning owns no append | Phase-4 destination wins |
| projection rebuild | cancel `projection-rebuild` | no append | rebuilt projection preserves semantic chapter |
| runtime teardown | cancel `teardown` | no append | tween/style/listeners released |

All wheel/touch/pointer listeners are passive. No Phase-6 path calls
`preventDefault()` for scrolling input, locks the body, installs virtual
scroll, or creates mandatory snapping.

The runtime owns at most one traversal. Settlement is idempotent, kills only
the captured tween, restores the pre-existing root `scroll-behavior` value and
priority, releases reference-counted history suppression, and resolves the
request exactly once. Cross-engine tests prove that the killed traversal does
not resume or correct toward its former target after the user-owned input
delta settles.
