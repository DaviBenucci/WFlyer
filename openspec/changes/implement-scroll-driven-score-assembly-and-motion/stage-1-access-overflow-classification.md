# Stage-1 application-access overflow causal classification

Date: 2026-09-13. Policy: AI-MRP-001 v1.1.0.
Scope: diagnosis only; no canonical diagnostic/ADR/ASM-IMP-DEC identity allocated.
HEAD: `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
Branch: `develop/site-institucional`. Change: `implement-scroll-driven-score-assembly-and-motion`.
Progress remains 7/92; Human Geometry Approval remains pending/blocking.

## Result

**C — NON-EQUIVALENT REPRODUCTION / TEST PIPELINE EFFECT** explains the
previous 62px versus 110px comparison. A separate inherited reservation deficit
remains after making the reproduction equivalent. No additional 48px Stage-1
regression is established. The previous attribution to dependency updates was
unsupported and is superseded by this controlled comparison.

All measurements below use Chromium 153.0.8010.12, Playwright 1.63.0, Node
24.18.0, the same installed dependencies, pt-BR, DPR 1, no reduced motion,
light theme and the same semantic preview route. Current uses Turbopack;
the historical source replay uses webpack because nested scratch Turbopack
compilation did not complete. The different bundler is explicit: computed
reservation, form dimensions and overflow still match exactly in every paired
case. This is current-engine historical-source reproduction, not recreation
of the 2026 historical browser installation or a historical aggregate PASS.

The historical source archive is exact HEAD. `git diff 306ccb74..HEAD -- src
 tests/e2e/phase09-score-path-review.spec.ts` is empty, so the relevant sources
also represent the frozen Phase-9 implementation. Its source and dependency
manifests were not edited. Installed modules were linked from the current
worktree; pnpm install was not run in this diagnosis. Dependency changes remain
preserved, but are not needed to reproduce either disputed number.

## Controlled current/historical comparison

Route: `/__visual-lab/story/score-paths/preview?candidate=organic-soft&mode=vertical-wide&theme=light`.
Viewport: 1340x820. Branch/chapter: application/application-access.

| Condition | Current form height | Historical form height | Current / historical overflow Y |
| --- | ---: | ---: | ---: |
| No public Turnstile key; TURNSTILE_FAILED | 398.109375 | 398.109375 | 62 / 62 |
| Public test key; VERIFYING_TURNSTILE; live script | 445.515625 | 445.515625 | 110 / 110 |
| Public test key; script blocked; settled TURNSTILE_FAILED | 454.109375 | 454.109375 | 118 / 118 |

The original previous-turn historical server command omitted
NEXT_PUBLIC_TURNSTILE_SITE_KEY, while Playwright's configured server supplied
`1x00000000000000000000AA`. This run reproduces both numbers simply by toggling
that public configuration on the unchanged current source/dependencies, then
reproduces the same result on historical source. No secret or submission was
used. Blocking the external script is diagnostic-only and never a production
change or a passing acceptance fixture.

The exact causal arithmetic is:

- Key presence adds the verification grid row (44px) and one fieldset gap
  (12px), adding 56px with the same status text.
- Failed-status text wraps to a 56.59375px status block; verifying text occupies
  the 48px minimum. Thus the compared form-height delta is
  `44 + 12 - (56.59375 - 48) = 47.40625px`.
- Envelope `clientHeight=368` in both states. Integer CSSOM scroll heights are
  430 and 478, yielding `430-368=62` and `478-368=110`.
- The nominal 48px overflow delta is rounded CSSOM output, not a missing fixed
  48px spacer or an extra Stage-1 shelf offset.

The explicit mode query resolves vertical-wide; there is no viewport policy or
Projects-capacity runtime decision on this route. Scene/form/review owners are
byte-identical in current, Stage 0 and final Phase 9. The only successor change
to organic-flowing.ts adds optional motif placement input; the Task-33 builder
does not supply it. Stage-1 projection.ts, measurement.ts, candidate transaction
and motion runtime do not own this surface's content reservation.

## Inherited mechanism and bounded affected cases

`organic-flowing.ts:buildChapterLayouts` still allocates application-access
370px at vertical-wide (Soft: 900-200-330; Flowing: 820-200-250).
`ScorePathReview.tsx:ChapterContent` turns this into a fixed CSS block size.
`score-path-review.module.css:.contentEnvelope` uses border-box, two 1px
borders and 32px top/bottom padding, leaving 304px of inner height. The current
PRELAUNCH scene is 445.515625px tall with the configured verifying widget.
It starts 33px below the envelope top and extends 108.515625px beyond the
outer bottom. The CSSOM overflow assertion reports 110px. The envelope has
visible overflow; the enclosing track has overflow:hidden, whose bounds are
persisted separately. The viewport being scrolled away from the chapter does
not change scrollHeight/clientHeight. Adding the observed overflow number to
the reservation is not itself a validated repair.

The historical PRELAUNCH refinement replaced a short access link with a full
launch-interest form via `ApplicationChapterScene.tsx:AccessScene`. It retained
the same Task-33 reserved sizes. The commit path is visible in the saved
Task-33-to-Phase-9 diff (PRELAUNCH introduced at 2ffef25b...). Current all-
application-access content/styles match final Phase 9. This is a reservation
versus changed historical content mismatch, not a stronger successor validator.

Minimum focused shape coverage, **settled failed-script state with key**:

| Candidate | Mode | Viewport | Reservation height | Current / historical overflow Y | X |
| --- | --- | --- | ---: | ---: | ---: |
| Organic Soft | vertical-wide | 1340x820 | 370 | 118 / 118 | 0 |
| Organic Flowing | vertical-wide | 1340x820 | 370 | 118 / 118 | 0 |
| Organic Soft | vertical-compact | 430x844 | 480 | 325 / 325 | 5 |
| Organic Flowing | vertical-compact | 430x844 | 500 | 263 / 263 | 0 |

Compact track width is 414; content widths are 286.6153846153846 and
329.5692307692308 respectively. Compact initial/frame samples vary during
font/style readiness; paired settled values agree. Raw samples and font-face
statuses are retained rather than flattened into a synthetic stable reading.
The Soft compact 5px horizontal overflow is reported, not waived or separately
authorized. These four cases bound this diagnosis; all widths, dark themes,
other browser engines and all form states were not exhaustively measured.
Prior five-combination matrix failures remain prior observations, not five new
fully controlled occurrence measurements.

## Historical acceptance and authority

The zero-X/zero-Y assertion at phase09-score-path-review.spec.ts:256 is present
unchanged at Task-33 approval `74677a762a9d9a53cb7fd375eecb0462b10e18e9`.
Task-33's sealed README records candidate coverage and 27/27 across engines
with the public Turnstile key, before the launch-interest form existed. Its
AccessScene rendered a link. The later two PRELAUNCH/refinement validation
ledgers include integration, refinement and form lanes, but neither lists
phase09-score-path-review.spec.ts. They do not prove a later PASS for this
exact preview/form combination. Their accepted historical status is preserved;
no Phase-9 gate is retroactively changed.

ADR-043 protects PRELAUNCH form content, security and the accepted Phase-9
baseline. ADR-048/049/050 and ASM-IMP-DEC-012/013/014 authorize bounded Projects
work, not an application-access review-reservation repair. The existing
assertion and requirement to expose complete launch-interest controls remain
binding. There is no authority here to register or implement a new repair.

Minimum proposed successor envelope for Ultra to reconcile (NOT approved):
application-access reservation/layout compatibility on the development-only
Task-33 preview, for the existing Soft/Flowing vertical presentations, derived
from complete actual PRELAUNCH content including verification/status states,
padding and available width. Preserve form content, public/shared scene sizing,
security behavior and assertion. A global edit to buildChapterLayouts would
also affect production projection through buildAuthoredGeometry; it cannot be
assumed review-only. Ultra must determine whether a local review adapter can
reserve that content with the existing visible score/corridor, or whether
minimum adjacent review-path support requires separately explicit authority.
No minimum viable geometry adjustment has been proved or authorized. Do not
make a global height addition, shrink text, clip the form, remove Turnstile,
relax the assertion or adjust Projects to hide the failure.

## Evidence, validation and worktree preservation

`stage-1-access-overflow-diagnostic-data/` contains raw live/blocked/no-key
current and historical samples; probe source; source hashes/diffs; the prior
current failure output; and start-state fingerprints/status. JSON captures
include viewport, mode, fonts, DOM readiness, form state, content/reserved/clip
bounds, CSS inputs, rendered sizes and exact overflow calculations. They are
diagnostic measurements, not final visual captures or acceptance evidence.

The first nested historical scratch compilation timed out before a usable
response in Turbopack and webpack. A separate /tmp archive with webpack
completed; only its completed samples count. No timeout was treated as a
product failure or a successful historical reproduction. The original
previous-turn 62px raw diagnostics were not retained; this run recreates that
measurement with explicit inputs instead of inventing missing metadata.

No product/runtime/test/package changes, task completion edits, final matrix,
final captures, canonical ID, commit/push/deploy or human approval in this run.
Only diagnosis artifacts and a derived current-handoff pointer are written.
See validation.json for start/end preservation and historical integrity.

AGENTS_REFERENCE_PENDING: AGENTS.md still names the absent
`docs/.ai/AI_MODEL_ROUTING_POLICY.md`; the owner explicitly selected the existing
`docs/.ai/AI_MODEL_ROUTING_POLICY_v1.1.0.md` for this run. The proposed onboarding
edit is only to replace that stale path; no agent-instruction edit was performed
inside this diagnostic-only scope. This did not prevent applying the policy.

## Routing and ready-to-paste Ultra handoff

```text
ROUTING_STATUS=UPGRADE_READY
UPGRADE_REQUIRED=true
NEXT_MODEL=GPT-6-ASTRA
NEXT_REASONING=ULTRA
REMAINING_TASK_CLASS=ARCHITECTURE_GOVERNANCE
SAFE_TO_CONTINUE_CURRENT_MODEL=false
REASON_TYPE=SCOPE_ESCALATION
```

```text
MODEL: GPT-6 ASTRA
REASONING: ULTRA

Resume the exact WFlyer dirty worktree, branch develop/site-institucional,
HEAD 40e6ae1a8996c53ed2ec372c47f16bc073d6cee9. Active OpenSpec:
implement-scroll-driven-score-assembly-and-motion; 7/92; Human Geometry
Approval pending/blocking. Diagnosis/proposal only. No new repair approval.

Read AGENTS.md, docs/.ai/AI_MODEL_ROUTING_POLICY_v1.1.0.md,
docs/canonical-v2/06-migration/CURRENT_HANDOFF.md, and active-change
stage-1-access-overflow-classification.md with its diagnostic-data directory.
Read only relevant ADR-043/048/049/050 and ASM-IMP-DEC-012/013/014 sections.
Verify HEAD/status and preserve all current dirty work.

FIRST ACTION: reconcile the inherited application-access Task-33 preview
reservation deficit with ADR-043's accepted historical baseline and the
Projects-only successor repair authority. Determine the minimum owner decision
for the actual content-reservation owner and any strictly necessary local
review-path compatibility, without silently broadening shared vertical geometry.
Do not repeat the completed 62/110 delta investigation.

The delta is C: non-equivalent Turnstile configuration/status. Same dependencies,
engine and semantic inputs give current/historical 62/62 without key, 110/110
with key verifying, and 118/118 with key failed script at 1340x820. Form heights
are 398.109375/445.515625/454.109375; reservation remains 370px. Historical-source
replay uses current dependencies/engine and webpack, not a historical browser
installation. Current uses Turbopack; paired computed values match.

Settled failed-script compact 430x844 cases also match: Soft Y325/X5 (reservation
480), Flowing Y263/X0 (reservation 500). Do not silently absorb or waive X5.
No exhaustive viewport/theme/engine/form-state scope is claimed. Task-33's zero
XY assertion predates PRELAUNCH and originally passed with the old access link;
later refinement ledgers do not establish this exact preview/form PASS.
Phase 9 remains historically accepted; no stronger validator was introduced.

Propose only successor application-access development-review content reservation
and strictly necessary local support. buildChapterLayouts is shared with
production projection, so a global edit is not automatically local. Preserve
complete form/security/status/focus, full ink, 12px, zero global intersections,
all ASM-PC work, interaction measurement order/restoration, Batch 1/2, ADR-046,
Composer fingerprints, approved glyphs and historical seals/payloads. No fixed
viewport exception, arbitrary text shrink, hidden verification or weaker tests.

If owner approval is absent, STOP with the concrete minimum decision. Do not
register an approved repair or implement it. If later approved, normalize only
the necessary canonical/OpenSpec contracts, run bounded governance checks, then
STOP with a bounded implementation handoff; no repairs during Ultra.
Do not run final matrix/captures, alter task completion, refreeze, Stage 2+,
motion, commit, push, deploy or mark Human Geometry Approval.
```
