# Stage 1 HGA intersection diagnostic

```text
OFFENDING_PRIMITIVES=wf-phase-9-task-34:horizontal-enhanced:professional:staff:0:canonical:1 (visible staff-line polyline)
OFFENDING_SEGMENTS=segment-126,segment-131
INTERSECTION_COORDINATES=(1498.366239806826,439.04634898011955) horizontal-projection CSS px
AFFECTED_CHAPTER_REGION=Home origin -> professional-about measured-boundary transition
REAL_GEOMETRIC_INTERSECTION=true
VALIDATOR_FALSE_POSITIVE=false
RELATION_TO_SCENE_SPACING=About positioning supplies the measured transition boundary, but the crossing is in visible staff geometry before About content; the other density gaps are separate
```

At 1366×768 and 100% zoom, ordinary desktop eligibility passes. The runtime
selects `vertical-wide` only after the horizontal candidate returns `INVALID`
with `global-visible-segment-intersection`.

The forced `horizontal-enhanced` state was used only to inspect that rejected
candidate. It exposed one real crossing in the top visible staff line. Segment
126 runs from `(1497.949201, 439.066236)` to
`(1500.174643, 438.960113)`; segment 131 runs from
`(1498.257600, 438.918644)` to `(1500.952253, 442.086181)`.
They intersect at `(1498.366239806826, 439.04634898011955)`.

No content, Projects interaction, or measurement envelope participates in the
crossing. Fonts were ready, two animation frames had settled, the result was
reproduced under the repository-managed test server, and the same primitive is
crossing-free at 1440×900. The complete capacity validator is correct. The
coarser sampled `StoryScoreLayer` intersection attribute misses this pair, so
that supplemental telemetry has a false negative; it provides no authority to
accept the invalid candidate.

The structured [diagnostic record](stage-1-hga-intersection-diagnostic.json)
also preserves the pre-change HGA-002 measurements. Internal functional gaps
are 40.96875px (Sobre), 32.78125px (Serviços), 40.96875px (Processo), and
54.625px (Contato). The larger non-functional distances are the outer chapter
gutters and inter-scene travel. HGA-001 and HGA-002 do not share the same exact
failure, although a bounded reduction of the authorized desktop gutters can
move the measured About boundary and may contribute to both. HGA-001 remains
independently gated by the complete visible-segment validator.

Three bounded correction trials were rejected and fully restored: compressing
the four chapter spans introduced another Services-to-Process fold; moving the
origin cut earlier displaced the crossing; extending the descent to the 24px
content boundary left the original crossing intact. The repeated root now meets
the configured Astra High escalation threshold. No trial geometry is retained.

## Astra causal resolution — 2026-09-23

The [causal model](stage-1-hga-001-causal-model.md) now supersedes the open
mechanism question and any suggestion of using generic density compression for
this crossing. It proves an offset-curvature fold, isolates the1394/1395
constructor boundary, and supplies a bounded local design. Original trials and
HGA-002 measurements above remain historical facts. No product repair was made.
The local design exposes residual Projects capacity insufficiency; it does not
establish native1366 horizontal acceptance. See the bounded Sol handoff and its
mandatory capacity STOP boundary.
