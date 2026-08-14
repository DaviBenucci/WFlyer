# Legacy Test Migration Map

## Replace after v2 equivalents exist

| Legacy coverage | Why obsolete | Required v2 replacement |
|---|---|---|
| `tests/unit/chapters.test.ts` old route graph | previous/next/company coordinates | story-v2 manifest/hash/labels/branch-length tests |
| `tests/unit/navigation.test.ts` old header | Empresa + Acessar app | approved header target/traversal tests |
| `tests/motion/score-transitions.motion.spec.ts` | route overlay transitions | native-scroll, header traversal, cancellation, history, cleanup |
| `tests/e2e/phase05-navigation.spec.ts` | route chapter lifecycle | story scroll + detailed-route independence |
| `tests/e2e/score-continuity.spec.ts` old per-route continuity | continuous branch score | segment seam/ScorePath/semantic stability |
| `phase06-application-demo` tests/snapshots | interactive DOM tablet | video state machine/replay/error/reduced motion |
| `phase07` intro fixed-time assertions | fixed 5.6s authority | readiness, positioning, timeout, skip, deep links |
| old home visual snapshots | click/CTA branch Home | scroll-primary Home/score origin |

## Retain/regression protect

- contact domain/route/security tests;
- deployment environment/indexing/release workflow tests;
- legal/static route accessibility;
- theme and official brand symbol tests;
- no-secret/no-analytics checks;
- standalone build/start/smoke;
- exact-SHA release manifest checks.

## Replacement rule

Do not delete an old test until:

1. the corresponding v2 behavior is implemented;
2. v2 unit/browser/visual/a11y tests pass;
3. the phase gate records the replacement;
4. rollback remains possible.
