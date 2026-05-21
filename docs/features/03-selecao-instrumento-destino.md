# Seleção de instrumento de destino

## Objetivo

Escolher para qual instrumento a nova partitura será escrita.

## Fluxo

```text
Usuário busca ou filtra instrumento
Seleciona destino
Sistema calcula intervalo
Sistema exibe feedback imediato
```

## Feedback imediato

Exemplo:

```text
Piano -> Trompete Bb
A partitura será escrita 1 tom acima.
Exemplo: C maior se transforma em D maior.
```

## Cálculo

```text
intervalo = source.written_to_concert - target.written_to_concert
```

## UI

- Cards para mais usados.
- Busca por instrumento.
- Filtros por família.
- Microinteração por família.

## Regras

- Destino é obrigatório.
- Se origem e destino forem iguais, permitir, mas avisar que não haverá transposição instrumental.
- Não permitir instrumentos não suportados.

## Testes

- Piano -> Trompete Bb retorna +2.
- Trompete Bb -> Piano retorna -2.
- Feedback muda quando destino muda.
