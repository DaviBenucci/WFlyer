# AGENTS.md — W_Flyer v2 normative agent rules

## 1. Repository boundary

This repository contains the public website at `wflyer.com.br`.

`app.wflyer.com.br` is a separate application and MUST NOT be modified by this repository work.

The website is a personal professional portfolio and service-acquisition site under the W_Flyer brand. W_Flyer is not presented publicly as a company.

## 2. Canonical precedence

Use this order when sources conflict:

1. this `AGENTS.md`;
2. `WFLYER_IMPLEMENTATION_PLAN.md`;
3. `docs/canonical-v2/00-governance/03-decision-register.md`;
4. other `docs/canonical-v2/**` files and machine-readable manifests;
5. active v2 OpenSpec changes/specifications;
6. retained deployment, contact-security, legal, and infrastructure records;
7. legacy documentation;
8. current code behavior and tests.

Current code is the migration baseline, not the target specification.

## 3. Phase discipline

- Execute `WFLYER_IMPLEMENTATION_PLAN.md` strictly in order.
- Do not advance until the current gate is complete and evidence is recorded.
- Do not disable, loosen, or delete a failing test merely to pass a gate.
- Replace obsolete tests only after equivalent v2 coverage exists.
- Stop at human approval gates.

## 4. Locked technical stack

Retain:

- Next.js App Router;
- React;
- strict TypeScript;
- Tailwind CSS 4 and CSS Custom Properties;
- GSAP, ScrollTrigger, and `@gsap/react` as the only programmatic motion engine;
- semantic HTML and approved inline SVG;
- local TypeScript/MDX content;
- Zod, Resend, Cloudflare Turnstile;
- Vitest, Testing Library, Storybook, Playwright, axe-core, Lighthouse CI.

Do not add Anime.js, Framer Motion, React Spring, Lenis, a smooth-scroll library, Three.js, React Three Fiber, WebGL, Lottie, a particle engine, a CMS, or a second general animation system.

## 5. Scroll and motion rules

- Native vertical scroll is the canonical story progress source.
- Desktop horizontal movement is progressive enhancement.
- Never use global `wheel` or `touchmove` `preventDefault()` to drive the story.
- Header traversal animates the same native scroll position and master timeline; it does not use a parallel animation state.
- Maximum extreme header traversal duration is 3.0 seconds.
- User input cancels/supersedes automated traversal.
- Reduced motion uses the vertical static story.
- Every GSAP timeline, ScrollTrigger, observer, listener, timer, and frame loop has explicit ownership and cleanup.

## 6. Visual asset rules

- Approved glyph paths are immutable without explicit human reapproval.
- Codex may compose approved geometry; it may not redesign it.
- Music metrics/anchors remain draft until human Gate B approval.
- The final W_Flyer Persona and final APP-04 media are owner-supplied/approved assets. Codex may build contracts and placeholders but may not invent final assets.
- Golden/reference images are never shipped as page backgrounds, click maps, or flattened UI.

## 7. Content and publication rules

- Technical documentation, code comments, tests, schemas, manifests, and ADRs are in English.
- Public site copy and legal documents are in pt-BR unless explicitly approved otherwise.
- Do not invent metrics, clients, testimonials, team members, company structure, results, awards, or case-study outcomes.
- Initial approved projects are W_Flyer, MSN Distribuidora, and MSN Suprimentos.
- Analytics, advertising pixels, and session replay remain disabled for the initial release.

## 8. Security and infrastructure

Preserve:

- contact validation and anti-abuse controls;
- server-only provider secrets;
- no database/CMS/authentication for this website release;
- Cloudflare as existing DNS/proxy/security boundary;
- Napoleon as the standalone Next.js Node runtime;
- GitHub as source repository;
- exact-SHA staging/production evidence;
- production and DNS changes only after explicit owner approval.

## 9. Definition of truthful completion

A feature is not complete because the main flow works. Test invalid input, denied/unsupported interaction, integration failure, duplicate action, interruption, recovery, empty state, resize, touch, keyboard, reduced motion, hidden tab, and cleanup where applicable.

Never claim staging, provider delivery, physical-device review, asset approval, homologation, or production validation without evidence.
