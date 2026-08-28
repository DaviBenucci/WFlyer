# File-by-File Migration Map

## Root/governance

| Path | Action | Notes |
|---|---|---|
| `README.md` | REPLACE | v2 positioning/status/reading order |
| `AGENTS.md` | REPLACE | v2 precedence and phase rules |
| `PRE-CODE-STATUS.md` | REPLACE | implementation-pending status |
| old conflicting docs | MARK SUPERSEDED | use canonical-v2 |

## Story/configuration

| Path | Action | Notes |
|---|---|---|
| `src/config/chapters.ts` | REPLACE AFTER PARALLEL V2 MODEL | old route graph/previous-next/company terminology |
| `src/config/navigation.ts` | REFACTOR | landing hash targets; remove `Empresa` and header app-access link |
| `src/config/seo.ts` | KEEP/UPDATE COPY | detailed routes retained |
| `src/config/site.ts` | KEEP | application URL/domain boundaries |
| `src/content/site-content.ts` | REFACTOR | personal voice, Projects label, approved chapter summaries |

## Landing/experience

| Path | Action | Notes |
|---|---|---|
| `src/app/page.tsx` | REPLACE AT APPROVED CUTOVER | semantic v2 story host; keep the legacy public `/` unchanged through isolated Phase 8 |
| `src/app/page.module.css` | REPLACE | new vertical fallback/horizontal stage |
| `src/components/experience/SiteExperienceShell.tsx` | REPLACE/RENAME AFTER CUTOVER | route coordinator becomes story lifecycle shell |
| `ScoreTransitionLayer.tsx` | REMOVE AFTER CUTOVER | no route overlay in v2 landing |
| `experience.module.css` | REPLACE | story stage/track/lifecycle styles |
| `src/app/layout.tsx` | REFACTOR | shared data + branch terminals/global footer semantics |
| `src/lib/story/motion/**` | ADD PARALLEL | Phase-5 eligibility/geometry/master-story runtime plus Phase-6 owned native-scroll header traversal |
| `src/components/story-motion/**` | ADD PARALLEL | development-only Motion Lab and diagnostics with Phase-7 professional scenes and Phase-8 Application scenes; score integration remains deferred |
| `/__visual-lab/story/motion` | ADD DEV-ONLY | Phase-5 native-scroll projection, Phase-6 header traversal/history, Phase-7 professional scenes, and Phase-8 Application scenes; production must fail closed |

## Header/footer

| Path | Action | Notes |
|---|---|---|
| `SiteHeader.tsx` | REFACTOR | story traversal, active chapter, Home target, mobile menu |
| `NavigationMeasure.tsx` | REVIEW/REUSE | retain only useful measurement/brand geometry |
| `SiteFooter.tsx` | REFACTOR | shared footer data; terminal/global variants |

## Intro

| Path | Action | Notes |
|---|---|---|
| `BrandIntroController.tsx` | KEEP LEGACY THROUGH PHASE 4; REPLACE/REFACTOR AT CUTOVER | retain public `/` rollback behavior while parallel bootstrap is validated |
| `src/lib/story/bootstrap/**` | ADD | pure readiness, semantic destination, versioned history envelope, timing, and projection-positioning contracts |
| `StoryBootstrapExperience.tsx` | ADD PARALLEL | owns overlay, interaction locks, readiness effects, skip/Escape, fail-open, and exact cleanup |
| `/__visual-lab/story/bootstrap` | ADD DEV-ONLY | Phase-4 composition and validation surface; production must fail closed |
| `LocalRevealController.tsx` | REFACTOR/REDUCE | local finite reveals only; avoid competing scroll authority |
| intro tests/stories | MIGRATE | retain skip/session/recovery, replace fixed target assumptions as required |

## Music

| Path | Action | Notes |
|---|---|---|
| `MusicalNote.tsx` | REMOVE AFTER MUSIC CUTOVER | hard-coded ellipse/stem |
| `Staff.tsx` | REMOVE AFTER CUTOVER | static pixel note positions |
| `StaffSegment.tsx` | REMOVE AFTER CUTOVER | independent line curves |
| `NarrativeClef.tsx` | REPLACE | approved glyph registry |
| `OriginScore.tsx` | REPLACE | shared origin + semantic composer/renderer |
| `ChapterScore.tsx` | REPLACE | continuous branch segments |
| `FinalBarline.tsx` | REIMPLEMENT | staffSpace/local-normal primitive |
| `src/lib/music/**` | ADD | pure geometry/glyph/renderer/composer |
| `src/components/score/**` | ADD | SVG presentation only |
| `/__visual-lab/music/**` | ADD DEV-ONLY | Gate A/B/C surface |

## Application demo

| Path | Action | Notes |
|---|---|---|
| `ApplicationDemoTablet.tsx` | REPLACE | non-interactive video state machine |
| tablet CSS | REPLACE/REUSE SHELL TOKENS | no internal form/UI controls |
| tablet tests/stories | REPLACE | activation/final frame/replay/error/reduced motion |

## Detailed pages

| Path | Action | Notes |
|---|---|---|
| `/sobre` | REFACTOR | personal About + Persona |
| `/servicos` and details | KEEP/REFINE | personal voice and approved offers |
| `/processo` | KEEP/REFINE | approved four stages |
| `/portfolio` and allowlisted `/portfolio/[slug]` | KEEP URL/REFINE + ADD DETAILS | public label Projects; authorized cases only; invalid/nonpublic slugs fail closed |
| `/contato` | KEEP/REFINE | secure conversion page |
| application routes | KEEP/REFINE | approved public content; no internal details |
| legal/accessibility routes | KEEP | update naming references only if necessary |

## Security/deployment

| Area | Action |
|---|---|
| contact route/library/tests | KEEP; regression protect |
| Cloudflare/Napoleon docs/workflows | KEEP |
| staging indexing | KEEP |
| release exact-SHA/checksums | KEEP |
| analytics disabled | KEEP |
