# Motion Lifecycle and Performance

## Ownership

Every animation system owns and cleans its own timelines, ScrollTriggers, observers, listeners, timers, RAF loops, inline styles, and media actions. Do not kill unrelated global triggers.

Use `gsap.context`/`useGSAP` and match-media/rebuild boundaries. Cleanup after unmount or mode change must leave zero owned resources.

## Master architecture

- one desktop master story driver/timeline;
- local CSS/GSAP microinteractions for cards/buttons/tilt;
- Persona easter eggs outside master timeline;
- APP-04 media state separate from timeline but activated by canonical chapter;
- geometry/composition calculated outside scroll frames.

## Performance gates

- LCP p75 target ≤ 2.5 s;
- INP p75 target ≤ 200 ms;
- CLS ≤ 0.10;
- avoid >50 ms long tasks during scroll;
- no React render per scroll frame;
- no demo video bytes in critical load;
- no significant motion-caused layout shift.

## Asset loading

- critical: CSS, fonts/fallback, logo, Home structure/score origin;
- near-story: first adjacent scenes/Persona candidate;
- deferred: project media, demo video, optional easter-egg variants.

## Visibility

Hidden tab pauses video and nonessential optional animation. It does not destroy the master timeline. Video resumes only if still PLAYING and active.

## Failure fallback

GSAP/ScrollTrigger/score/Persona/media failure must preserve a readable vertical document and native links.
