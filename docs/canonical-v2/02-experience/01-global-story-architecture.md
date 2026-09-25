# Continuous Spatial Story

**Authority:** ADR-057 / ASM-IMP-DEC-020, owner-approved on 2026-09-24.
**Status:** canonical target; product implementation and Human Geometry Approval pending.
**Scope:** institutional landing, initially implemented and reviewed in the development Motion Lab.

This is the single normative spatial contract. Other documents reference it;
OpenSpec expresses its acceptance scenarios and execution order. Historical
Phase-9 geometry and the preserved Stage-1 implementation are evidence, not proof
that this target exists. No product geometry changes are made by this decision.

## 1. One story and one coordinate authority

```text
HOME → ABOUT → SERVICES → PROCESS → PROJECTS → CONTACT → TERMINAL
```

Reuse the existing `StoryChapterId`, `STORY_CHAPTERS`, timeline labels, hashes,
semantic slots and canonical content records. `professional-terminal` is the
terminal landmark; `global-footer` remains its semantic document close, not a
second story or duplicated interactive footer. Home is the sole origin.

A canonical ordered story coordinate `s` increases from Home to Terminal.
Landmark identity and content order are presentation-independent. A projection
assigns finite ordered spans in story units and a finite two-dimensional spatial
frame to that order; their physical lengths may change with content capacity.
`storyProgress` is the normalized traversal coordinate derived from those spans,
not elapsed time, a chapter index or the fraction of a DOM block visible.

The viewport is a camera/window over that projected story. It is not the unit
of chapter size. A chapter may occupy several viewports or successive moments.
Intentional partial visibility is valid only with a demonstrated reachable next
state. No content is discarded or made permanently inaccessible to fit a frame.

Story traversal coordinate, score-path parameter/arc length, native scroll
pixels and viewport pixels are distinct. Projection publishes their mappings;
callers must not equate them or create a second coordinate authority. Responsive
physical lengths do not change semantic identity or Composer composition.

## 2. Landmarks, content spans and interaction spans

Extend existing chapter geometry and projection records; do not create a
parallel story manifest or independent mobile chapter graph. The conceptual
fields below may reuse equivalent existing names, with an explicit mapping.

| Field | Contract |
| --- | --- |
| `entryAnchor` | Canonical semantic landing in story coordinates plus the projected camera pose and native-scroll target needed to identify this landmark immediately. Not necessarily the structural start, DOM top/center, score entry or scenic `homeEntry`. |
| `contentSpan` | Ordered interval containing the required content stations for this landmark. Stations retain stable content identity and reading order; the interval expands rather than shrinking content to fit. |
| `interactionSpan` | Reachable interval(s) and protected envelopes in which required controls can be operated. Empty for a landmark without controls. Contact has a stable interaction region. |
| `exitTransition` | Explicit interval connecting this landmark to the next. Describes meaningful score/content continuity and hands off active semantic ownership; no disconnected section-margin gap. Terminal has a settled end instead of another chapter. |

All intervals have finite ordered bounds. Entry anchors are ordered by canonical
chapter sequence and identify a station within the owning landmark's content
span. Interaction spans lie within the corresponding accessible content span.
Successive exits and entries share a continuous boundary/mapping; transitional
content may overlap visually without duplicating semantic ownership. Every
traversable interval is owned by content, interaction or an intentional
transition. A transition may be quiet but must maintain narrative/score
continuity and a finite reachable destination. No mandatory snap or auto-advance.

Reuse current chapter ownership and timeline labels for half-open semantic
ranges (the final endpoint belongs to Terminal). Reverse travel restores the
same state at the same coordinate. Contact focus alone does not create another
progress clock. Preserve the existing native-scroll position as the input state.

## 3. Projection, camera and ownership

Composer owns semantic music and the seed/fingerprints. Projection owns stable
story spans, spatial coordinates, safe regions, full ink, interaction envelopes,
score anchors and camera landing mappings. Layout/scene owners provide bounded,
versioned content measurements; they do not independently resize chapter blocks
after Projection has assigned coordinates.

A camera pose is a precomputed function of story progress. Global traversal may
remain lateral; lateral camera advancement may hold while local content is read
vertically. Local vertical staging is part of the same span, not a nested story
or a second scroll-progress timeline. The camera and score renderer consume the
same projection revision so chapter, score and navigation cannot drift apart.

Native scroll is authoritative. GSAP remains the only programmatic motion
engine for future binding; React has no frame clock. Ordinary scrub must not
invoke Composer, rebuild Projection, measure ordinary DOM geometry or run React
state updates per frame. Bounded semantic transitions may update UI state.
### Stage-1 structural mapping boundary

Stage 1 may implement deterministic native-offset → story-progress → camera
mapping, landmark entry targets, reachability, responsive restoration and
portrait local hold/reflow. These are structural geometry/positioning contracts,
not Assembly or decorative motion. Extend the existing native-position/camera
adapter to consume precomputed mappings; forward and reverse native traversal
must actually exercise them. Station snapshots alone do not prove reachability.

For a local hold interval, increasing native offset continues increasing story
coordinate and local content progress while the lateral camera coordinate stays
constant. Its vertical content/camera mapping exposes the ordered stations at
readable scale. At exit, lateral travel resumes continuously from the same
spatial boundary; reversing uses the same mapping and exposes the same stations
in reverse. A hold is a finite allocated span, not a timer, nested scroll clock,
interaction-required pause or global scroll lock. Piecewise mappings are
continuous and deterministic at joins; zero-travel fallback remains usable.

Minimal spatial span/anchor metadata is a **Stage-1 prerequisite** for geometry
review. Stage 1 must not add final temporal choreography, decorative motion
language, Assembly sequencing, per-frame structural recomputation or new GSAP
presentation behavior reserved for later authorization. Existing adapter
consumption is allowed; new timelines/reveal/choreography are not. Stage-3
additional draw/reveal/Assembly metadata remains behind approved refreeze.

## 4. Capability-adaptive presentation

These are conceptual presentation classes, not an instruction to add another
runtime mode enum beside equivalent existing classification:

| Class | Expected use | Required adaptation |
| --- | --- | --- |
| `EXPANDED_LANDSCAPE` | Large desktop / high usable capacity | More simultaneous content on the same journey. |
| `COMPACT_LANDSCAPE` | Notebook, low-height desktop, suitable tablet landscape | Fewer simultaneous elements and longer content spans where needed; no whole-chapter fit requirement. |
| `PORTRAIT_TRAVERSE` | Narrow/tall effective content area | Readable local vertical reflow with sequential stations on the same journey. |

Selection considers layout/visual viewport width, usable height after header,
safe areas and virtual keyboard, aspect ratio, pointer and hover capability,
actual content capacity and reduced-motion preference. Neither device name,
width alone nor `orientation: portrait` alone is authoritative. Reduced motion
is a behavior constraint across presentation classes, not a device class.

Calibrate class boundaries against measured content; do not invent final
breakpoints or special cases for the owner's dimensions. Existing
`horizontal-enhanced`, `vertical-wide`, `vertical-compact`, `static` are retained
implementation vocabulary, not a forced one-to-one mapping to these classes.
Until replaced with equivalent new-target coverage, their current eligibility
and fan safety predicates remain enabled. A failed candidate is never a PASS
because fallback renders. A new sequential presentation must be evaluated on
its own complete reachable states, not on the old simultaneous fan's bounds.

## 5. Native input to story progress

The initial implementation reuses native vertical scrolling as the single
input axis in all classes. Wheel, trackpad, keyboard, scrollbar and assistive
scroll changes map through a monotone, bounded, reversible native-offset-to-story
mapping. Desktop/suitable landscape can thus advance the lateral camera
directly through native input. A native horizontal desktop adapter is permitted
only as an alternative mapping to this same position, with equivalent keyboard,
restoration and accessibility coverage; it is not required by this rebaseline.

Portrait/mobile uses native vertical scrolling as its primary expected gesture.
Vertical progress may drive a lateral camera. Horizontal swiping is never
required. No global wheel/touch interception, synthetic scroll clock or forced
chapter snap is allowed. The mapping allocates real scroll distance to local
reading and interaction; reaching a stationary lateral pose does not exhaust
scroll reachability or discard remaining content.

## 6. Portrait reflow and readability

Use available height: an About landmark may stage title, copy, Persona and
supporting material vertically before lateral progression continues. These
stations reuse the same content IDs, chapter identity, score semantics and
ordered span. Ordinary document/native scrolling reaches them without a nested
scroll trap. When space is insufficient, increase the span rather than clipping
its end or scaling the desktop composition into portrait width.

Adapt in this order: **reflow → redistribute → progressively reveal → increase
story/content span → bounded typography adaptation**. No global interface scale.
Progressive reveal must leave content available without motion and make a
keyboard target visible before/when focus reaches it.

Reuse role-specific typography and control/focus tokens in
[`src/styles/tokens.css`](../../../src/styles/tokens.css): body and body-sm,
heading roles, `--wf-control-min-size`, `--wf-focus-width` and
`--wf-focus-offset`. Do not demote body text to label size to solve capacity.
Do not lower an existing role's readable floor or reduce control/focus tokens
for fit. Preserve browser text zoom and 200% zoom behavior. Final class
thresholds, span lengths and typography calibration remain measured outputs of
implementation, not invented numerical governance constants.

## 7. Header, hashes, history and focus

Traversal/discovery is primary. Header navigation is an optional shortcut to
landmark `entryAnchor`, through the same native position and projection adapter.
Landing must immediately identify the chapter and expose a safe starting point;
it need not display the entire chapter. Never derive its target merely from
scene structural start, DOM center or the beginning of a musical segment.

Retain current semantic header/hash allowlists, destination precedence, version-1
chapter history envelope, preservation of foreign history fields, and passive
replace/explicit-success push policy. Deep links and Back/Forward resolve the
landmark anchor in the current projection; cancelled traversal adds no history.
Responsive restoration uses a transient semantic checkpoint (landmark, stable
content station and local fraction/focused control), not stale pixel offsets.
This does not require a new persisted history schema. Legacy chapter-only
history resolves to the landmark entry.

Future animated header traversal is capped at the existing 3.0 seconds; user
input/Escape/new target cancels or supersedes it. Reduced motion positions
immediately or briefly without long travel. Focus must become visible below the
header and within usable safe areas, including at 200% zoom or with the mobile
keyboard. Passive scrolling does not repeatedly steal focus. Keyboard/assistive
navigation into offscreen content must resolve its reachable station before or
with focus visibility; hidden/inert controls cannot trap navigation.

## 8. Stable interaction regions

Contact's interaction span is a stable region of the same story: on reaching
its form, lateral camera advancement holds while native vertical document
movement exposes the whole form, validation/status messages and alternate
channels. A tall form does not need to fit simultaneously. No nested obligatory
scroll container, body lock or timed advance is introduced to hold the camera.

While text entry, IME composition, selection, validation or submission is in
progress, input keys belong to the control and programmatic drift/scene exits
must not move the focused field out of view. Virtual-keyboard viewport changes
preserve focus, values and readable reachability. Submission success/error does
not navigate, reset traversal or silently discard values. Existing Contact
security, consent, Turnstile, duplicate-submit and provider recovery remain.

Deliberate native scroll or explicit navigation takes precedence over the
focus hold, even if a field remains focused or submission is pending. The
stability rule prohibits unsolicited/programmatic drift, not user-directed
exit; never auto-snap the reader back to the form. The user can scroll onward,
reverse, or explicitly navigate to leave; there is no focus trap. Deliberate exit/cancellation releases the stable-region
presentation state without stale locks or automatic correction. Return retains
valid form state through projection rebuilds; unmount/submission lifecycle rules
remain owned by the existing form. No Persona easter egg while editing.

The interaction region uses these transitions of the same story position:

| Event | Required outcome |
| --- | --- |
| Enter by traversal or Contact entry shortcut | Resolve a recognizable form entry station; enter the finite lateral hold, keeping native vertical access to remaining fields/status. Do not focus an input merely because passive scrolling arrived. |
| Operate form, keyboard/IME or submission | Preserve field ownership, values, selection/focus and security; suppress unsolicited camera drift and automatic navigation on form state. |
| Intentionally scroll onward | Native user intent wins even if focus or pending submission remains; expose the remaining form span, then leave through its exit transition. No preventDefault, trap or snap-back. |
| Reverse traversal | Evaluate the same mapping backward; leave through the entry or re-enter at the corresponding content station, preserving form lifecycle state without forced return to its first field. |
| Header navigation away | Cancel any prior automation; use the target landmark's entry through the same native position. Retain form state under its existing lifecycle; no Contact hold overrides deliberate navigation. |
| User cancels automated traversal | Stop at actual native progress, release traversal-owned locks and keep the form usable if still inside its region. No corrective snap to Contact or abandoned target. |
| Responsive/presentation transition inside | Capture semantic station/local fraction plus focused control and form state; rebuild once through §10, restore equivalent reachable focus and hold membership, and never remount/reset the form for layout alone. |


## 9. Reduced motion and failure

Keep the same landmark/content order and required interactions. The safe
baseline is the existing semantic vertical document with settled score/content;
short or immediate anchor transitions can replace long/scrubbed camera travel.
Lateral travel, pinning, animation and reveal are never required to understand,
reach or operate content. No-JS, missing motion, initialization failure and
mid-transition failure leave this document and native navigation usable.

## 10. Responsive transition lifecycle

On meaningful capacity, layout, font/content revision or motion-preference
change: capture semantic checkpoint and active focus/form state; cancel obsolete
automation; tear down only owned presentation resources; measure at the bounded
layout seam; build and validate one new projection generation; restore the
same content station (or its nearest safe entry) without replaying Home; resume.
Never commit stale async measurements. Preserve Composer and seed. Coalesce
visual-viewport/keyboard changes; transient changes must not thrash class
selection or reconstruct the form. Exact debounce/hysteresis tuning is a
calibration concern, not a new governance number.

If projection validation fails, retain its raw failure and expose the usable
semantic fallback. Repeated teardown is safe; no orphan GSAP context,
ScrollTrigger, listener, observer, timer, focus trap or scroll lock remains.

## 11. Continuity and retained safety

Transition spans replace disconnected macro-margin thinking. Score paths remain
coherent across landmarks, including intentional negative space. Preserve
HGA-001A's offset-curve regularity invariant and unthinned whole visible-line
intersection checks; shortening margins is not a substitute for valid offsets.

Full rendered ink, existing 12 physical CSS pixel protected-content clearance,
LTR notation-safe shelves, approved tangent constraints, event-free connectors,
immutable glyphs, deterministic Composer, hydration and interaction envelopes
remain mandatory. Intentional offscreen staging is not permission for accidental
score/content overlap, inaccessible clipping or obscured focus.

ADR-048/049/050 remain historical decisions and binding safety for the full fan
while it exists. Their fixed first/second shelf repair envelopes, three fan
visits, simultaneous card envelopes and fan-triggered whole-story fallback are
specific to that presentation. They do not require every future sequential
Projects station to coexist in one viewport. Raw rejected fixtures and their
negative assertions are preserved; no earlier failure is relabeled PASS.

ADR-056's one teaser in vertical modes is valid **transitional Stage-1 behavior**,
not the final continuous-story Projects target. Sequential project disclosure
across a span is allowed but its final disposition is an explicit implementation
checkpoint before target acceptance. Retain factual canonical project records,
NON-ASSEMBLY, accessibility, route withdrawal and no dead navigation affordance.
This pass neither redesigns Projects nor creates portfolio routes.

## 12. Evidence and HGA disposition

| Finding | Disposition under this decision |
| --- | --- |
| HGA-001A | PRESERVED_GEOMETRIC_INVARIANT_AND_EVIDENCE; revalidate its offset safety under changed projection. |
| HGA-001B | PRESERVED_HISTORICAL_CAPACITY_EVIDENCE; old fan rejection does not predetermine sequential target capacity. |
| HGA-001C | PRESERVED_RESPONSIVE_EVIDENCE; retain desktop and owner-height findings, not new-target approval. |
| HGA-001D | VALID_TRANSITIONAL_IMPLEMENTATION_AND_EVIDENCE; final Projects disposition pending target implementation. |
| HGA-002 | SUPERSEDED_PLAN; pause the old macro-gap reduction work. Its visual-disconnection concern becomes continuous-span validation. |

Phase-9 remains frozen at `306ccb74da6c7bbf8f187e360c0776c571b5fc3d`.
The prior 63/63 portfolio matrix and HGA captures retain their exact scope.
Human Geometry Approval remains **PENDING** until new-target geometry is
implemented and freshly reviewed. No refreeze, Assembly, GSAP integration,
public cutover or landing-page completion follows from governance validation.

## 13. Validation contract

| Class | Required proof |
| --- | --- |
| `LANDMARK_RECOGNIZABILITY` | Entry/header arrival identifies the intended chapter, with a readable starting point. |
| `CONTENT_REACHABILITY` | Enumerate every required content station; forward and reverse native traversal reaches each, including long content. |
| `INTERACTION_REACHABILITY` | Every required control/state is reachable and usable by keyboard, pointer/touch and assistive navigation. |
| `FOCUS_VISIBILITY` | Focus is not irrecoverably clipped, obscured by header/keyboard or lost during rebuild/navigation. |
| `STORY_CONTINUITY` | Every span has content/interaction/intentional transition ownership; no unexplained dead zone or unreachable boundary. |
| `SCORE_CONTINUITY` | Joined score paths, tangents, offsets, event-safe zones and terminal remain coherent. |
| `NO_INVALID_SELF_INTERSECTION` | Complete visible canonical score geometry satisfies enabled intersection validators. |
| `NO_UNRECOVERABLE_CLIPPING` | Partial content has a demonstrated reachable exposure; no hidden endpoint, inaccessible field or trapped interaction. |
| `PRESENTATION_READABILITY` | Reflow/staging preserves role tokens, controls and zoom readability; no miniature desktop. |
| `NAVIGATION_LANDING` | Header/hash/history adapter resolves semantic entry anchors; scene start/center is not assumed equivalent. |

These replace whole-chapter viewport containment as a global invariant. Retain
local complete-ink and active-control safety assertions. Obsolete containment
tests may be replaced only with explicit equivalent reachability/focus coverage
and documented lineage; never weaken checks just to make a candidate pass.

Canonical stress evidence: Firefox-equivalent **1366×611, DPR 1** and
Chromium-equivalent **1366×639, DPR 1**. They are low-height small desktops, not
breakpoints or special cases. Include representative large/medium desktop,
tablet landscape, tablet portrait, mobile portrait, both themes and reduced
motion in Chromium, Firefox and WebKit. Record exact inputs, selected class,
projection revision, raw capacity/geometry, fallback and validation separately.

Use pure deterministic span/mapping/continuity checks first, then focused browser
reachability, header entry, focus, Contact error/success/keyboard, resize/zoom,
forward/reverse, cancellation, no-JS/failure and reduced-motion cases. Include a
qualifying enhanced control and rejected-capacity controls. After implementation
stabilizes, produce fresh successor evidence and owner review; historical
captures and governance checks alone cannot pass this matrix.
