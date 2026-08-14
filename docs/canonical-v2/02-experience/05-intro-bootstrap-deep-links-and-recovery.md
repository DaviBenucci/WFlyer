# Intro, Bootstrap, Deep Links, and Recovery

## State machine

```text
BOOTING
  → POSITIONING
  → INTRO_EXIT
  → STORY_READY
```

Critical readiness includes base CSS, critical fonts/fallback, logo/Home score availability, DOM measurement, story model/timeline construction, and initial target positioning.

Noncritical video, distant project media, Persona easter-egg variants, and detailed-page media do not block readiness.

## Initial target precedence

1. valid landing hash;
2. reliable history restoration;
3. Home.

The target is set before the intro overlay exits.

## Timing policy

- short minimum visual duration for intentional brand presentation;
- normal duration calibrated in Motion Lab;
- hard fail-open timeout around the approved recovery budget;
- no fixed timeout is allowed to impersonate readiness.

## Once per session

The opening remains session-bounded and skippable. Direct detailed routes do not need the landing opening. Reduced motion applies final state directly.

## Failure cases

Missing asset, GSAP error, layout measurement error, hidden tab, resize/orientation, timeout, or teardown must release locks, restore interaction, clean owned resources, and reveal functional content.
