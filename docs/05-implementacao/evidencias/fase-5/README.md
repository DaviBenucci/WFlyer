# Visual evidence — Phase 5

This directory is the durable QA evidence target for the score-transition and
navigation work completed in Phase 5. The reproducible capture script is
`scripts/capture-phase5-evidence.mjs`.

## Evidence set

The script generates exactly seven PNG files:

- `phase05-transition-start.png`: the light desktop start checkpoint for the
  Application-to-Company Home-pivot transition;
- `phase05-home-pivot-midpoint-dark.png`: the same two-segment Home pivot held
  at its midpoint in the dark theme;
- `phase05-transition-completion.png`: the light desktop completion checkpoint
  for the adjacent Company-to-Services transition;
- `phase05-benefits-terminal-light.png`: the full Benefits page and its final
  barline on the application side;
- `phase05-contact-terminal-dark.png`: the full Contact page and its final
  barline on the institutional side;
- `phase05-reduced-motion-completion.png`: the full Company-to-Services
  completion state with `prefers-reduced-motion: reduce` and no decorative
  score segment;
- `phase05-mobile-completion.png`: the full 390 × 844 Company-to-Services
  completion state with no decorative overlay, horizontal overflow, or scroll
  lock.

Desktop transition checkpoints use a 1536 × 1024 viewport. The start,
midpoint, completion, reduced-motion, and mobile states are held by the private
non-production transition controller before capture. The script also checks
the expected transition mode, source and destination routes, segment count,
terminal side, and mobile layout safety before writing each image.

## Reproduction

Start a dedicated local Next.js development server from the repository root:

```sh
WFLYER_TRANSITION_TEST_MODE=1 \
  pnpm exec next dev --hostname 127.0.0.1 --port 43118
```

In a second terminal, run:

```sh
WFLYER_EVIDENCE_BASE_URL=http://127.0.0.1:43118 \
  node scripts/capture-phase5-evidence.mjs
```

The base URL defaults to `http://127.0.0.1:43118`, so the environment variable
may be omitted when using that address. The capture intentionally stops with a
clear error if the server was not started with
`WFLYER_TRANSITION_TEST_MODE=1` or if the private controller is otherwise
unavailable. The controller is not exposed by an ordinary production build.

## Provenance and limits

These files are local Chromium QA evidence. They are not golden references,
visual-regression baselines, or production assets, and the frontend must never
import them. The approved master board, page-specific references, archetype
manifests, and normative documentation remain the visual sources of truth.

The script performs no deployment and does not contact external infrastructure.
It writes only the seven named PNG files in this directory.
