# Canonical Header Target Matrix

Date: 2026-08-27

`HEADER_NAVIGATION_ORDER` is derived from the frozen `HEADER_NAVIGATION`
branch lists. Labels, hashes, branches, and timeline labels resolve through
`STORY_CHAPTER_BY_ID`; the header contains no duplicate chapter-ID list.

| Order | Chapter ID | Public label | Branch | Timeline label | Hash |
|---:|---|---|---|---|---|
| 1 | `application-overview` | Aplicação | application | `app-overview` | `#aplicacao` |
| 2 | `application-how-it-works` | Como funciona | application | `app-how` | `#como-funciona` |
| 3 | `application-benefits` | Benefícios | application | `app-benefits` | `#beneficios` |
| 4 | `home` | Home / center W_Flyer label | origin | `home` | `#home` |
| 5 | `professional-about` | Sobre | professional | `pro-about` | `#sobre` |
| 6 | `professional-services` | Serviços | professional | `pro-services` | `#servicos` |
| 7 | `professional-projects` | Projetos | professional | `pro-projects` | `#projetos` |
| 8 | `professional-contact` | Contato | professional | `pro-contact` | `#contato` |

Excluded narrative chapters are `professional-process`, `application-demo`,
and `application-access`; both terminal chapters are also excluded. A direct
runtime request for a non-header chapter rejects with `RangeError` and does not
create traversal or history.

The active approved target receives `aria-current="location"` and
`data-story-active="true"`. Semantic changes are reported only when the
closest canonical chapter changes; continuous progress never enters React
state.
