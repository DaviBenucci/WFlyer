# Seleção de instrumento de origem

## Objetivo

Confirmar para qual instrumento a partitura original foi escrita.

## Fluxo

```text
Carregar instrumentos
Opcionalmente sugerir instrumento detectado
Usuário confirma ou escolhe manualmente
Wizard grava source_instrument_id
```

## Detecção automática

No MVP, a detecção pode ser simples ou ausente. Quando existir, a confiança não deve aparecer para usuário comum.

Mensagem pública:

```text
Encontramos uma possível correspondência. Confirme se está correta.
```

Admin pode ver:

```text
Instrumento sugerido
confidence_score_instrument_detection
fonte
método
```

## UI

- Busca por nome/alias.
- Filtros por família.
- Cards com instrumento e família.
- Detalhe com explicação simples de transposição.

## Regras

- Origem é obrigatória.
- Se origem não for detectada, usuário seleciona manualmente.
- Instrumentos experimentais devem ser marcados.

## Testes

- Busca encontra aliases.
- Seleção habilita próxima etapa.
- Confidence score não aparece na UI pública.
