# Timeout and Degraded-Mode Evidence

| Case | Expected result | Evidence |
|---|---|---|
| slow critical resource (`3500ms`) | cover remains while within policy, then normal reveal | three-engine browser test |
| noncritical rejection | no readiness delay or degraded state | component and three-engine browser tests |
| critical exception | best-effort semantic positioning, locks released, `DEGRADED` | component tests |
| missing official intro SVG | explicit critical probe fails; semantic Home positioning and usable `DEGRADED` | component test |
| projection exception | fresh static recovery adapter positions target, `DEGRADED` | component/browser/a11y tests |
| hard timeout | covered before deadline; at `5000ms` position best-effort and reveal `DEGRADED` | exact `4999ms`/`5000ms` component test and real-time browser test |
| hidden document during boot | immediate usable degraded release; return does not re-lock | component and three-engine browser tests |
| no JavaScript | CSS cover fail-open after `5000ms`; semantic SSR story remains usable | Chromium/Firefox/WebKit browser test |
| hydration delayed beyond CSS deadline | SSR story becomes usable at the CSS deadline; hydration detects release and does not reacquire locks | Chromium/Firefox/WebKit browser test |
| storage denial | read/write errors are caught and never block reveal | component boundary implementation |

The fixed CSS cover has an independent `5000ms` visibility/pointer-events
failsafe. The JavaScript deadline aborts pending critical work, performs the
adapter's synchronous physical move before releasing interaction, restores all
locks, and exposes the degraded reason diagnostically.

Screenshot `03-bootstrap-timeout-contact-degraded-mobile-390x844.png` shows
usable Contact content after the injected timeout. It is review evidence, not a
visual golden.
