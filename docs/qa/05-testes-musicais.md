# Testes musicais

## Objetivo

Garantir que a transposição esteja musicalmente correta, não apenas visualmente funcional.

## Casos mínimos

| Origem | Destino | Intervalo esperado | Exemplo |
|---|---:|---:|---|
| Piano | Trompete Bb | +2 | C -> D |
| Trompete Bb | Piano | -2 | D escrito -> C escrito |
| Piano | Clarinete Bb | +2 | C -> D |
| Piano | Sax Alto Eb | +9 | C -> A |
| Piano | Trompa F | +7 | C -> G |

Observação: a tabela assume `intervalo = source.written_to_concert - target.written_to_concert`. Validar cada instrumento com seed oficial.

## O que validar

- Notas transpostas.
- Acordes transpostos.
- Armadura alterada.
- Acidentes locais coerentes.
- MusicXML final parseável.
- PDF final renderizado.

## Fixtures

Criar partituras pequenas controladas:

```text
escala de C maior
acordes C/F/G
melodia com acidentes
peça com múltiplas partes
```

## Regra crítica

Teste deve falhar se apenas a armadura for alterada e as notas permanecerem iguais.
