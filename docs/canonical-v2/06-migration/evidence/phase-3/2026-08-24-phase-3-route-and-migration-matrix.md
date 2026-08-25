# Phase 3 route and migration matrix — 2026-08-24

## Public route contract

| Surface | Route(s) | Phase-3 disposition | Publication/indexing |
|---|---|---|---|
| Legacy landing | `/` | KEEP as rollback baseline; no v2 cutover | Public |
| Application | `/aplicacao-wflyer` | REFACTOR to public problem/proposal + APP-04 contract only | Public |
| How it works | `/aplicacao-wflyer/como-funciona` | REFACTOR to exact five public steps | Public |
| Benefits | `/aplicacao-wflyer/beneficios` | REFACTOR to exact four groups | Public |
| About | `/sobre` | REFACTOR to personal professional positioning + Persona seam | Public |
| Services | `/servicos` | REFACTOR to exactly four categories and stable `#processo` | Public |
| Service details | four retained `/servicos/*` routes | REFACTOR through typed service records | Public |
| Unknown service | `/servicos/[other]` | ADD explicit `notFound()` denial | Non-indexable 404 |
| Process | `/processo` | KEEP/REFINE compatibility route with four stages | Public |
| Projects | `/portfolio` | KEEP stable URL; public label `Projetos` | Public |
| Project details | three allowlisted `/portfolio/[slug]` routes | ADD under stable namespace | Public |
| Unknown/nonpublic project | `/portfolio/[other]` | ADD explicit public-lookup + `notFound()` denial | Non-indexable 404 |
| Contact | `/contato` and `/api/contact` | KEEP secure backend; REFACTOR page copy only | Page public; API excluded |
| Legal/accessibility | four retained routes | KEEP | Public |
| Story/Music labs | `/__visual-lab/story`, `/__visual-lab/music/**` | KEEP dev-only | Absent from sitemap; 404 in production |

The sitemap contains exactly 20 public routes: the prior 17 plus the three
authorized project details. It contains no API, unpublished/private record,
application-host URL, or Visual Lab path.

## Namespace and compatibility decisions

- No `/empresa` route was added.
- No `/projetos`, `/como-funciona`, or `/beneficios` alias was added.
- `/portfolio` remains canonical; the owner-authorized detail extension is
  `/portfolio/[slug]` only.
- `/processo` remains a retained compatibility/detail route while Process is
  also available at `/servicos#processo` and in the narrative.
- The nested application detail URLs remain canonical for this release.

## Migration classification

| Class | Phase-3 paths/behavior |
|---|---|
| KEEP | legacy `/` implementation; legal routes; Contact API/domain/provider controls; deployment/indexing topology; Phase-2 story and Music System isolation |
| REFACTOR | detailed page copy; header/footer public labels; route SEO; structured data; service/project presentation adapters |
| REPLACE | old interactive tablet embedding on the application detail route with the noninteractive APP-04 content contract; ad-hoc detailed-route records with typed public-domain records |
| ADD | typed public domain; project detail routes; invalid-service denial; publication tests; Phase-3 capture/evidence tooling |
| DEFER | public landing cutover; readiness/intro/deep links; motion; final Persona; APP-04 media/state machine; public Music/Score Path integration; responsive thresholds; staging/production authorization |
