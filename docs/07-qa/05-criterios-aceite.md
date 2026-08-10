# Initial release acceptance criteria

- **Current status:** `CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`
- **External configuration:** pending
- **Production:** not authorized
- **Homologation owner:** Davi Benucci

Checked implementation items below have durable source-level or explicitly
dated phase-checkpoint evidence. They do not assert that the exact current
revision has passed the final validation sequence. Every final-current,
deployed-runtime, infrastructure, and human-review gate remains unchecked until
its own evidence is recorded.

## Product

- [x] Home clearly presents both branches.
- [x] Application, How it works, and Benefits exist as separate pages.
- [x] Company, Services, Process, Portfolio, and Contact exist as separate
  pages.
- [x] Detail pages exist for all four services.
- [x] The portfolio contains no fabricated information or metrics.
- [x] Contact and policy pages exist.
- [ ] The external music application link and availability are verified during
  homologation without changing `app.wflyer.com.br`.
- [x] The institutional site and music application remain separate by source
  contract.

## Score narrative

- [x] Home is the visual origin of both staves.
- [x] The application branch advances left.
- [x] The institutional branch advances right.
- [x] Each main chapter declares the required manifest fields.
- [x] Previous and next navigation match the declared graph.
- [x] Deep links render directly.
- [x] Same-branch jumps do not mount intermediate chapters.
- [x] Cross-branch changes use Home as the conceptual pivot without joining the
  staves directly.
- [x] Benefits ends with a left final double barline.
- [x] Contact ends with a right final double barline.
- [x] Auxiliary pages do not create false chapters.

## Design

- [x] The official symbol is centered in the header.
- [x] The narrative clef is not used as the logo.
- [x] The primary staff uses moderate wave geometry.
- [x] Themes use the approved visual tokens.
- [x] Inspiration images are excluded from the production interface.
- [x] Each page follows an individual reference, approved panel, or authorized
  archetype.
- [x] Golden references are excluded from the production bundle by source and
  packaging contract.
- [x] No page uses a screenshot as its interface.
- [x] Light and dark themes preserve geometry.
- [x] No metric, client, testimonial, team member, or channel is fabricated.
- [ ] Davi Benucci has reviewed and accepted the exact current visual candidate
  in deployed staging.

## Motion

- [x] Route transitions follow the destination coordinate.
- [x] The header remains stable during route transitions.
- [x] The score continuity has no intentional visual discontinuity.
- [x] There is no second animation engine.
- [x] Reduced motion removes lateral travel, tablet tilt, and extended opening
  motion.
- [x] The opening uses the official SVG and is session-bounded.
- [x] Skip, Escape, timeout recovery, and reduced-motion paths exist.
- [x] The final lockup preserves official geometry.
- [x] The opening-to-header symbol handoff is implemented.
- [x] The narrative clef and two scores enter only during the Home handoff.
- [x] Final-barline cadence does not intentionally conceal a CTA or form.
- [x] Final-current motion behavior and performance pass the complete
  cross-browser validation sequence.

## Tablet

- [x] The shell uses bounded CSS 3D without WebGL or Three.js.
- [x] The screen is semantic DOM content.
- [x] Keyboard, pointer, and touch interactions are implemented.
- [x] Results are local, deterministic, and announced.
- [x] The demo performs no upload, network request, or real music processing.
- [x] Tilt is capped at 6°.
- [x] Reduced motion removes tilt.
- [ ] The exact current revision passes mobile and landscape overflow,
  keyboard, pointer, touch, and real-device checks.

## Technical delivery

- [x] The source uses the locked Next.js, React, TypeScript, Tailwind, GSAP, and
  testing architecture.
- [x] The package manifest pins pnpm 11.18.0 through `packageManager`.
- [x] The historical F00–F08 standalone checkpoints built and started locally.
- [x] The repository defines `.next/standalone/server.js` as the generated
  persistent Node.js runtime entry point.
- [x] Napoleon's confirmed handoff model is Git pull/build; the Actions archive
  is candidate-validation and provenance evidence, not the deployed artifact.
- [x] GitHub Environment values and Napoleon build/runtime values are documented
  as independently configured stores.
- [x] The exact current revision passes install, dependency policy, lint,
  typecheck, unit/component tests, Storybook, Playwright, build, standalone
  preparation, local start, smoke, and Lighthouse in the required sequence.
- [ ] The exact checksummed candidate starts with
  `node .next/standalone/server.js` in the actual Napoleon staging application.
- [ ] Branch head, green CI, release manifest, and Napoleon build identify the
  same immutable full SHA.
- [ ] The actual Napoleon application fields, target, build command, injected
  port, process user, health check, restart, and rollback controls are recorded.
- [ ] The exact staging hostname is approved by Davi Benucci and recorded; no
  hostname is inferred from repository examples.
- [x] Static pages are generated where allowed and `/api/contact` retains its
  Node.js runtime.
- [x] The site has no database dependency and contains no music-application
  implementation.
- [x] The chapter manifest and transition fail-safe exist in source.

## Security

- [x] Turnstile verification is server-side by source contract.
- [x] Contact source validates method, Content-Type, size, origin, schema,
  Turnstile metadata, and honeypot and fails closed.
- [x] Provider credentials are server-only by source contract.
- [x] The source does not intentionally log the Contact message, full email
  address, Turnstile token, or secret.
- [ ] The exact current revision's source, browser/server bundles, release
  archive, and validation logs are inspected for secret values.
- [ ] Deployed staging headers, report-only CSP, robots behavior, cache
  exclusion, WAF, and rate limit are verified.
- [ ] Real Turnstile and Resend success and failure paths are verified in
  deployed staging.
- [ ] GitHub, Napoleon, Cloudflare, Turnstile, and Resend logs are inspected
  under the owner-approved retention policy without exposing values.
- [ ] HTTPS is inventoried for every covered host before any HSTS change.

## Quality and evidence

- [x] Final-current dependency and supply-chain validation is green.
- [x] Final-current lint and typecheck are green.
- [x] Final-current unit and component suites are green.
- [x] Final-current Storybook build and browser suite are green.
- [x] Final-current Playwright is green in every required engine.
- [x] Final-current visual regression changes have been reviewed against
  approved references; snapshots are not accepted blindly.
- [x] Final-current axe results have no unjustified critical or serious
  finding.
- [x] Final-current Lighthouse results satisfy the documented budgets.
- [ ] Final-current standalone build/start/smoke evidence identifies the exact
  candidate SHA.
- [x] Final documentation, current manifests, Graphify outputs, and
  repository-owned evidence are coherent with the exact candidate.
- [ ] Real-device and physical screen-reader reviews are recorded.

## Publication and operations

- [x] The public and recipient email contract is
  `davi.benucci@wflyer.com.br`.
- [x] Instagram points to `@davibenucci` and GitHub points to `DaviBenucci`.
- [x] The portfolio contains W_Flyer, MSN Distribuidora, and MSN Suprimentos
  without invented metrics.
- [x] Analytics, pixels, and session replay remain disabled.
- [x] The repository defines the GitHub → Napoleon → Cloudflare topology
  without VPS or EasyPanel.
- [ ] Required values exist with correct scopes in GitHub Environments.
- [ ] Required build/runtime values exist independently in Napoleon.
- [ ] The owner-approved staging hostname and actual Napoleon target are
  recorded.
- [ ] The exact candidate is deployed to staging and the full staging runbook
  evidence is complete.
- [ ] Contact delivers to the approved address in real staging without exposing
  visitor data.
- [ ] The independent `app.wflyer.com.br` DNS and availability baseline is
  unchanged before and after authorized infrastructure work.
- [ ] Staging rollback is exercised and evidence identifies both SHAs.
- [ ] Davi Benucci records an explicit dated homologation decision.
- [ ] Davi Benucci explicitly authorizes any production deployment or merge.
- [ ] Production smoke and rollback evidence is recorded after an authorized
  production deployment.

## Status interpretation

Repository-owned final-current gates are complete and are not inferred from
historical evidence. The operational state is
`CODE_COMPLETE_EXTERNAL_CONFIGURATION_PENDING`. Remote CI, external
configuration, staging deployment/validation, physical review, homologation,
and production approval remain distinct later states. Production remains
unauthorized until Davi Benucci explicitly approves it.
