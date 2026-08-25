# Readiness State-Machine Contract

## Deterministic states

| State | Meaning | Legal success event |
|---|---|---|
| `INITIAL` | Controller exists; no resource authority claimed | `START` |
| `WAITING_CRITICAL` | Only critical readiness may block | `CRITICAL_READY` |
| `RESOLVING_DESTINATION` | URL/history input is validated semantically | `DESTINATION_RESOLVED` |
| `POSITIONING` | Active adapter maps chapter to physical projection | `POSITIONED` |
| `READY_TO_REVEAL` | Position is stable behind the cover | `START_REVEAL` |
| `REVEALING` | One finite visual exit owns the cover | `REVEAL_COMPLETE` |
| `REVEALED` | Normal usable terminal state | none |
| `DEGRADED` | Fail-open usable terminal state | none |

Out-of-order events are ignored. The first terminal result is immutable.
`FAIL_OPEN` from any nonterminal state enters `DEGRADED` with one reason:
`hard-timeout`, `critical-resource-error`, `positioning-error`,
`hidden-document`, `aborted`, or `teardown`.

## Resource policy

Critical now:

- base CSS/layout delivery;
- mounted static story model/DOM;
- active positioning adapter;
- approved inline intro symbol;
- critical fonts or the approved finite fallback;
- resolved semantic destination and stable/best-effort positioning.

Noncritical and never awaited by reveal authority:

- APP-04 media;
- project/detailed-route media;
- Persona variants and easter eggs;
- other distant/decorative progressive assets.

The Phase-5 master timeline/ScrollTrigger driver and Phase-9 final score are
explicitly not Phase-4 critical resources.

## Timing policy

| Constant | Value | Role |
|---|---:|---|
| first eligible presentation minimum | `1500ms` | tunable Phase-4 default; readiness remains authoritative |
| normal reveal | `280ms` | tunable Phase-4 visual default |
| reduced-motion presentation | `0ms` | destination/positioning still run |
| completed-session presentation | `0ms` | destination/positioning still run |
| hard fail-open | `5000ms` | owner-normalized safety deadline |

The component suite verifies that `4999ms` remains covered and the next
millisecond enters `DEGRADED` and removes the cover. Delayed hydration after
the independent CSS deadline detects the already-released server cover,
avoids reacquiring interaction locks, and enters usable `DEGRADED` immediately.
