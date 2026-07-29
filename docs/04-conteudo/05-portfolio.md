# Portfólio

## Estado inicial

Não criar cases fictícios. A seção aceita três tipos de item:

- `case-real`: projeto publicado com autorização;
- `produto-proprio`: iniciativa própria, identificada como tal;
- `estudo-conceitual`: experimento identificado como conceito.

Enquanto não houver item publicável, mostrar estado vazio honesto e placeholders abstratos originais. Não usar logos de empresas, screenshots inventados ou resultados simulados.

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

## Comportamento visual

- carrossel não possui autoplay obrigatório;
- controles anterior/próximo são operáveis por teclado;
- estado vazio não simula um case;
- a pauta institucional continua visualmente para Contato;
- a página não usa barra final.
