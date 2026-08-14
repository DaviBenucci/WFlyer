# Cutover and Rollback

## Parallel build

Develop the music system and story foundation in isolated/dev-only surfaces first. Preserve the legacy public landing until the applicable gates pass.

## Cutover prerequisites

- Music Gates A/B/C complete;
- vertical semantic landing complete;
- desktop Motion Lab complete;
- header/history complete;
- professional/application scenes complete;
- continuous Score Paths approved;
- accessibility/performance gates complete;
- final required assets approved or explicitly accepted as pending blockers.

## Cutover sequence

1. Freeze legacy baseline SHA/tag.
2. Switch `/` to v2 story.
3. Keep detailed routes and contact/deployment unchanged.
4. Run full repository and browser matrices.
5. Remove legacy transition/music/tablet code only after replacement evidence.
6. Update Graphify and OpenSpec.
7. Deploy staging exact SHA.

## Rollback

Rollback restores the prior verified SHA through the existing Napoleon/Git branch mechanism. No data migration exists because the website has no database. Contact provider configuration and `app.wflyer.com.br` remain unchanged.

## Production

No production deployment or merge authorization is implied by code completion. Davi Benucci must explicitly homologate the staging candidate and authorize production.
