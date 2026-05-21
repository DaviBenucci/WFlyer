# Validação e confiança

## Objetivo

Separar informações públicas de métricas internas, garantindo clareza para o usuário e diagnósticos para admin.

## Usuário comum vê

```text
Origem
Destino
Transposição aplicada
Tonalidade resultante
Arquivos disponíveis
Avisos claros
```

## Usuário comum não vê

```text
confidence_score_omr
confidence_score_instrument_detection
confidence_score_key_detection
unrecognized_symbols_count
parsed_measures_count
warnings_count
processing_duration_ms
engine_version
stacktrace
```

## Admin vê

Todas as métricas internas necessárias para suporte e melhoria do sistema.

## Validações automáticas antes da entrega

- MusicXML gerado.
- Partes musicais detectadas.
- Transposição aplicada.
- Armadura alterada quando esperado.
- PDF final renderizado.
- Artefato baixável.

## Mensagem pública de cautela

```text
Confira a prévia antes de usar a partitura em apresentação ou ensaio.
```

## Testes

- DTO público não contém métricas internas.
- Admin endpoint contém métricas com autorização.
- Resultado falha se artefato final não existir.
