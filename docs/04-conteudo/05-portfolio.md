# Portfólio

## Estado inicial

Não criar cases fictícios. A seção deve aceitar três tipos de item:

- `case-real`: projeto publicado com autorização;
- `produto-proprio`: iniciativa própria, identificada como tal;
- `estudo-conceitual`: experimento identificado como conceito.

## Schema editorial

```yaml
slug: string
title: string
type: case-real | produto-proprio | estudo-conceitual
status: publicado | em-desenvolvimento | arquivado
summary: string
problem: string
solution: string
services: string[]
technologies: string[]
results: string[]
permission: required-for-case-real
images: string[]
```

## Resultados

Somente publicar métricas verificáveis. Quando não houver métrica, descrever entrega e contexto sem fabricar impacto.
