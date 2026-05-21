# Testes do backend

## Categorias

```text
unitários
integração
contrato API
segurança
pipeline musical
workers/fila
storage/retencao
```

## Unitários

- cálculo de transposição;
- sanitização de filename;
- geração de storage key;
- validação de status;
- mapeamento de erro público.

## Integração API

- `GET /health`.
- `GET /api/instruments`.
- upload de PDF válido.
- rejeição de PDF inválido.
- criação de job.
- consulta de status.
- download autorizado.

## Segurança

- PDF falso com extensão `.pdf`.
- filename com `../`.
- arquivo acima do limite.
- token inválido.
- job expirado.
- endpoint admin sem permissão.
- resposta pública sem stacktrace.

## Workers

- job concluído atualiza status.
- falha marca `failed`.
- timeout marca erro público adequado.
- retry não ocorre para PDF inválido.

## Musical

- Piano -> Trompete Bb = +2.
- Trompete Bb -> Piano = -2.
- Armadura é alterada quando esperado.
- MusicXML final existe e é parseável.

## Retenção

- cleanup remove arquivos expirados.
- job vira `expired`.
- artefato expirado não baixa.
