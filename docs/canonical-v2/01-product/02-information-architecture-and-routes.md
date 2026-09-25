# Information Architecture and Routes

## Landing story hashes

```text
/#home
/#sobre
/#servicos
/#processo
/#projetos
/#contato
```

`/` without a valid hash starts at Home after readiness positioning.

## Public routes

```text
/
/sobre
/servicos
/processo
/contato
/servicos/criacao-de-sites
/servicos/criacao-de-aplicacoes
/servicos/integracoes
/servicos/solucoes-sob-medida
/politica-de-privacidade
/politica-de-cookies
/termos-de-uso
/acessibilidade
```

The software-application service route is a generic professional service and is
not an institutional product branch. Unknown/nonpublic service slugs fail
closed as non-indexable 404 responses. The former `/portfolio` listing and
`/portfolio/[slug]` details are no longer public routes under ADR-056; they
also fail closed as non-indexable 404 responses. Project-detail IA and URLs
are deferred without a replacement destination.

The removed `/aplicacao-wflyer` URLs use the existing Not Found behavior. No
redirect or compatibility page is authorized.

## Header targets

Home is central. The surviving targets are Sobre, Serviços, Processo, Projetos,
and Contato. The header uses semantic manifest order and the same native-scroll
story position; it never infers order from physical X coordinates.
