# Cálculo de transposição

## Objetivo

Definir a regra musical central do WFlyer.

## Fórmula oficial

```text
intervalo = source.written_to_concert - target.written_to_concert
```

## Exemplo principal

```text
Piano.written_to_concert = 0
TrompeteBb.written_to_concert = -2
intervalo = 0 - (-2) = +2
```

Resultado:

```text
C maior -> D maior
Notas sobem 2 semitons na escrita
Armadura passa a ter F# e C#
```

## Elementos alterados

- notas;
- acordes;
- armadura de clave;
- acidentes locais;
- tonalidade escrita;
- partes musicais em scores multiparte.

## Validações musicais

Após transpor, validar:

- MusicXML final existe;
- partes musicais existem;
- intervalo aplicado;
- armadura mudou quando esperado;
- notas foram alteradas;
- arquivo final renderizado;
- artefatos baixáveis.

## Testes musicais mínimos

```text
Piano C -> Trompete Bb = D
Trompete Bb D -> Piano C = C
Piano C -> Sax Alto Eb = A
Trompa F C escrita -> Piano F concert, conforme regra inversa no cenário
```

Observação: cada teste deve documentar nota escrita, som real esperado e nota escrita final.

## Risco

Não basta alterar a armadura. O sistema deve alterar as notas também.
