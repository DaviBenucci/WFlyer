# Information Architecture and Routes

## Landing story hashes

```text
/#home
/#aplicacao
/#como-funciona
/#beneficios
/#demonstracao
/#acessar-wflyer
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

`/portfolio` retains the stable URL in this release; public labels use `Projetos`. A future `/projetos` URL migration requires separate explicit approval and redirect/SEO planning.

## Relationship between landing and detailed routes

- Landing: concise narrative, visual movement, conversion sequence.
- Detailed route: full readable content, direct link, independent server rendering, SEO/sharing, no dependency on master timeline.
- Landing cards/secondary links may open detailed routes with native navigation.

## Header targets

Application group:

- Aplicação
- Como funciona
- Benefícios

Professional group:

- Sobre
- Serviços
- Projetos
- Contato

The central W_Flyer symbol targets Home. Process, Demonstration, and Access W_Flyer are story chapters but not required primary header items.
