# Information Architecture and Routes

## Landing story hashes

```text
/#home
/#aplicacao
/#como-funciona
/#beneficios
/#demonstracao
/#lancamento
/#sobre
/#servicos
/#processo
/#projetos
/#contato
```

`/` without a valid hash starts at Home after readiness positioning.

## Detailed routes retained

```text
/
/aplicacao-wflyer
/aplicacao-wflyer/como-funciona
/aplicacao-wflyer/beneficios
/sobre
/servicos
/processo
/portfolio
/contato
```

Service detail routes and legal routes remain.

`/portfolio` retains the stable URL in this release; public labels use `Projetos`.
Phase 3 adds only allowlisted project details beneath that stable namespace as
`/portfolio/[slug]`. Unknown or nonpublic project slugs fail closed as
non-indexable `404` responses and never enter the sitemap. A future
`/projetos` URL migration still requires separate explicit approval and
redirect/SEO planning.

## Relationship between landing and detailed routes

- Landing: concise narrative, visual movement, conversion sequence.
- Detailed route: full readable content, direct link, independent server rendering, SEO/sharing, no dependency on master timeline.
- Landing cards/secondary links may open detailed routes with native navigation.

## Header targets

Application group:

- Aplicação
- Como funciona
- Benefícios
- Lançamento

Professional group:

- Sobre
- Serviços
- Processo
- Projetos
- Contato

The central W_Flyer symbol targets Home. Header order is this explicit semantic
manifest and is never inferred from physical X position, story progress, or the
Application branch's reversed desktop travel. Demonstration remains a story
chapter without a dedicated header item. `Lançamento` targets the stable final
Application content chapter in its current PRELAUNCH state.
