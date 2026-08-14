# Test Strategy and Evidence

## Layers

- pure unit: story progress, geometry, composer, history decisions, state machines;
- component: header, cards, demo, Contact, Persona controller;
- Storybook/Visual Lab: deterministic states/calibration;
- E2E: scroll, traversal, hashes/history, responsive rebuild, detail routes;
- motion: wheel/trackpad/key/resize/reduced motion/cleanup;
- visual: deterministic seeds/checkpoints/themes/viewports;
- accessibility: axe + keyboard + physical screen-reader review;
- performance: Lighthouse/trace/render instrumentation;
- staging: exact-SHA public behavior and provider/infrastructure validation.

## Required evidence

- screenshots at deterministic chapter/timeline progress;
- Playwright videos/traces for wheel/touch/header traversal/interruption;
- cleanup/resource counts;
- fixed-seed music screenshots;
- calibration screenshots and approval record;
- APP-04 playback/final/replay/failure evidence;
- responsive breakpoint preservation evidence;
- reduced-motion static-story evidence;
- staging/rollback exact SHA.

## Evidence truthfulness

Generated snapshots are not self-approving. Human review compares them to approved references/contracts. Baselines cannot be updated merely to hide a regression.
