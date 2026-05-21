# Pipeline de processamento musical

## Objetivo

Converter uma partitura PDF em artefatos finais transpostos.

## Pipeline

```text
1. PDF validation
2. PDF text extraction opcional
3. OMR started
4. MusicXML generated
5. MusicXML parsed
6. Source instrument confirmed
7. Target instrument confirmed
8. Transposition interval calculated
9. Score transposed
10. PDF rendered
11. Artifacts stored
12. Job completed
```

## Ferramentas possíveis

```text
Audiveris para OMR
music21 para manipulação musical
MuseScore CLI para renderização PDF
```

## Cálculo de transposição

```text
intervalo = source.written_to_concert - target.written_to_concert
```

## Alterações obrigatórias

- notas;
- acordes;
- armadura de clave;
- acidentes locais;
- tonalidade escrita;
- partes musicais quando houver múltiplos instrumentos.

## Pseudocódigo conceitual

```text
load MusicXML
for each part in score:
  identify applicable source instrument
  transpose notes by interval
  transpose chords by interval
  update key signature
  normalize accidentals when needed
write final MusicXML
render final PDF
validate artifacts
```

## Validação pós-processamento

- MusicXML final existe.
- PDF final existe.
- Arquivo final tem tamanho > 0.
- Score tem partes detectadas.
- Intervalo foi aplicado.
- Armadura mudou quando esperado.
- Artefatos salvos no storage.

## Erros públicos

```text
PDF_INVALID
PDF_ENCRYPTED_UNSUPPORTED
OMR_FAILED
MUSICXML_PARSE_FAILED
TRANSPOSITION_FAILED
RENDER_FAILED
ARTIFACT_STORAGE_FAILED
PROCESSING_TIMEOUT
```

## Segurança

- Subprocessos com timeout.
- `shell=False`.
- Diretório temporário isolado por job.
- Limites de CPU/memória quando possível.
- Remover temporários ao final.
