# Continuous-story implementation package

**Authority:** ADR-057 / ASM-IMP-DEC-020.
**Routing:** `BOUNDED_IMPLEMENTATION` / `HIGH`, resolved through the
[canonical registry](../../../docs/canonical-v2/00-governance/ai-model-routing-registry.yaml).
**Readiness:** `IMPLEMENTATION_READY=true`; the owner-approved
[ADR-058 historical provenance exception](../../../docs/canonical-v2/00-governance/03-decision-register.md#adr-058--historical-baseline-provenance-exception)
makes the unresolved byte discrepancy non-blocking without claiming integrity
PASS. Exact preservation remains uncertified; no work loss is known. No other
blocker is identified. Task 5.7 remains NOT_STARTED; this normalization session
does not execute it.

## Bootstrap and scope

Read `AGENTS.md`, the current handoff, the
[canonical spatial model](../../../docs/canonical-v2/02-experience/01-global-story-architecture.md)
and [tasks](tasks.md). Preserve the exact dirty worktree. Baseline branch is
`develop/site-institucional`, HEAD `40e6ae1a8996c53ed2ec372c47f16bc073d6cee9`.
The [governance checkpoint](continuous-story-governance-checkpoint.md) records
any later commit and the pre-edit capture location. Reconcile newer live state;
do not force it to match this checkpoint.

The **first bounded implementation slice is task 5.7 only**: extend the existing pure
spatial contracts and deterministic mapping. The next implementation session
must be explicitly invoked; this ready package does not resume it automatically.
Do not resume HGA-002 macro-gap remediation or re-diagnose HGA-001A–D.
Task 5.7 has no dependency on the disputed historical audit output or byte.
Preserve both historical versions and their capture manifest. Do not repair,
regenerate, replace or normalize either side, and do not resume baseline
forensics. Reopen only for new independent provenance under ADR-058.

## Existing owners to reuse

| Concern | Existing owner / boundary |
| --- | --- |
| Semantic chapter identity/order | `src/lib/story/types.ts`, `src/lib/story/manifest.ts`; preserve IDs, labels, hashes and data authority. |
| Native/story geometry mapping | `src/lib/story/motion/geometry.ts`; extend `StoryChapterGeometry` and `StoryTimelineGeometry` rather than invent another registry. Current DOM-center target is migration evidence, not canonical entry. |
| Physical score geometry | `src/lib/story/score/projection.ts`, `organic-flowing.ts`, existing chapter layouts/zones; one stable output generation. `homeEntry` remains the musical scenic handoff, distinct from a chapter's semantic entry. |
| Scene measurement | `src/components/story-score/measurement.ts` and existing scene-owned reservations; bounded rebuild inputs, no frame measurements. |
| Positioning/navigation | Existing projection-positioning adapter and `src/lib/story/motion/runtime.ts`; later task 5.9 replaces DOM-top/center assumptions at the shared adapter, not one patch per caller. |
| Presentation and form | Existing Motion Lab/chapter/form owners; untouched in first slice. No public route integration. |

Read actual callers before changing an owner. Filenames describe current seams,
not an instruction to create a class, dependency or duplicate API.

## First slice deliverables and checks

1. Map existing records to canonical entry/content/interaction/exit semantics.
   Add only missing fields to existing geometry ownership. Represent finite
   ordered spans and deterministic native-offset/story/camera mappings.
2. Keep canonical story identity independent of physical span lengths. Support
   the finite local-hold and join semantics in canonical §3 while the same story
   coordinate advances; publish enough
   stable identity to restore a station after capacity change. Do not change
   history schema or calculate target anchors from DOM centers by definition.
3. Add focused pure tests for finite/ordered intervals, coverage at shared
   boundaries, Terminal endpoint, forward/reverse mapping, entry different from
   structural start, a portrait local hold, zero-travel fallback, and semantic
   restoration between two projected lengths. Reject nonfinite/malformed inputs
   at the appropriate trust boundary; do not silently build unsafe geometry.
4. Preserve runtime output in this initial contract slice until its consumer
   integration is separately exercised in 5.8–5.10. Verify affected existing
   geometry tests, TypeScript and lint; record the exact commands/results.

Stop after 5.7 and report its implementation/checks. This package does not
require completing the whole rebaseline in a single executor run. If the pure
contract cannot be introduced without changing runtime geometry, stop and return
the coupling evidence before widening this first slice.

## Remaining dependency order

- **5.8:** projected continuous layout, capability selection and local portrait
  reflow. Record final Projects target disposition: retain safe teaser behavior
  or expose authorized projects sequentially across its span with complete
  reachability. Do not silently declare the existing teaser rule final. No new
  routes, facts, weakened fan clearance or Assembly. Calibrate physical lengths
  from role tokens and measured capacity, not owner-dimension branches.
- **5.9:** semantic entry mapping, header/hash/history and stable Contact
  interaction on the existing native-position/lifecycle owner. No new GSAP
  presentation language or Assembly. Check error/success, IME, keyboard, focus,
  user cancellation, reverse traversal and explicit exit. This slice may adapt
  the existing camera/native-position adapter to consume precomputed mappings,
  lateral holds and local vertical spans. It may not add new choreography,
  timelines, reveal or Assembly. Station snapshots alone cannot prove native
  traversal/content reachability before HGA.
- **5.10:** semantic restoration across resize/content/keyboard/motion changes;
  full reduced-motion/no-JS/failure access and scoped cleanup.
- **5.1–5.5:** fresh canonical §13 matrix and successor evidence after the
  candidate stabilizes. Retain both owner profiles and representative large/
  medium desktop, tablet landscape/portrait, mobile portrait, reduced motion,
  themes and all three browser engines. Record unsupported/infrastructure cases
  honestly; screenshots alone do not prove reachability or focus.
- **5.6:** stop for explicit owner Human Geometry Approval of this candidate.
  Refreeze and later temporal metadata/Assembly/GSAP are subsequent gated work.

## Preservation and stop rules

Keep HGA-001A offset regularity and its regression; B/C capacity/desktop evidence;
D valid transitional disclosure and captures; all raw candidate failures,
Phase-9 seals, 63/63 historical checkpoint and audit records. General full-ink,
12px clearance, event safety, zero invalid intersections, Composer fingerprint
`fnv1a32:039bce10`, seed, approved glyphs, hydration, accessibility and Contact
security remain. Retained full-fan states keep their complete predicates.

No new numerical thresholds, dependencies, global scale, generic measurement
framework, per-frame structural work, new project routes, public Motion Lab
exposure, refreeze, Assembly, new GSAP integration, commit/push/deploy is granted
by this package. Stop on unapproved scope/invariant changes or two bounded
attempts without causal progress. Reclassify unresolved fundamental rules as
`ARCHITECTURE_GOVERNANCE`; complex implementation diagnosis follows the registry.

## Next implementation instruction — task 5.7 only

```text
ROUTING_CLASS=BOUNDED_IMPLEMENTATION
REASONING_PROFILE=HIGH
Resume WFlyer from the preserved dirty worktree. Read AGENTS.md, the current
handoff and continuous-story-implementation-package.md in the active successor.
Implement task 5.7 only using the ADR-057 canonical spatial contract. Preserve
all prior work and evidence, including the ADR-058 non-blocking historical
exception. Do not repair disputed evidence or resume baseline forensics or
HGA-002 spacing repairs. Run the
focused checks and stop at the first-slice boundary. Do not implement later
layout/Projects/navigation work, new GSAP/Assembly, public integration or release.
```
