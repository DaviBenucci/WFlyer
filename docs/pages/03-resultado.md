# Página Resultado da transposição

## Rota

```text
/resultado/[id] no MVP; /app/jobs/[id] no futuro autenticado
```

## Objetivo

Exibir o resultado de um job concluído, oferecer preview e downloads seguros.

## Escopo MVP


Desktop:

```text
Título: Resultado da transposição
Subtítulo: Origem -> Destino
Preview da partitura à esquerda
Resumo técnico objetivo à direita
Ações de download abaixo
```

Mobile:

```text
Resumo no topo
Preview em card
Botões empilhados
Aviso de expiração
Bottom navigation
```


## Componentes principais


- `ResultPage`
- `ResultSummary`
- `ScorePreview`
- `DownloadActions`
- `ArtifactList`
- `RetentionBadge`
- `ResultWarnings`
- `CompletionChordEffect`


## Dados necessários


Dados da API:

```text
job_id
status
source_instrument
target_instrument
transpose_interval
detected_key
target_key
artifacts[]
expires_at
public_warnings[]
```

Artefatos esperados:

```text
PDF final
MusicXML final
preview image opcional
```


## Interações


- Ao carregar, buscar `GET /api/jobs/{job_id}`.
- Se concluído, buscar artefatos.
- Botão `Baixar PDF` solicita URL assinada.
- Botão `Baixar MusicXML` solicita URL assinada.
- Botão `Nova transposição` navega para `/transpor`.
- Ao concluir pela primeira vez, pode tocar efeito visual de acorde sem som automático.


## Validações e regras de negócio


- Só permitir download de artefatos de job `completed` e não expirado.
- Se job está em processamento, redirecionar ou mostrar status.
- Se expirado, mostrar estado claro e orientar nova transposição.
- Não mostrar confidence score ao usuário comum.


## Estados de tela


Estados:

```text
loading
completed
processing
failed
expired
not_found
unauthorized_token
artifact_unavailable
```

Mensagem de expiração:

```text
Este resultado expirou no servidor. Se você baixou o arquivo anteriormente, ele pode continuar disponível no seu dispositivo.
```


## Segurança e privacidade


- Downloads devem usar URLs assinadas e temporárias.
- Token não deve aparecer em logs.
- Resposta de erro não deve revelar paths internos.
- Evitar cache público de URLs assinadas.
- Headers de download devem usar filename sanitizado.


## Acessibilidade


- Preview deve ter texto alternativo.
- Botões de download devem indicar formato e tamanho, quando disponível.
- Avisos devem ser lidos por leitores de tela.
- Efeito de conclusão deve ser decorativo e desativável.


## Critérios de aceite


- Resultado concluído mostra origem, destino, intervalo e tonalidade.
- PDF e MusicXML ficam disponíveis se gerados.
- Download usa URL temporária.
- Estado expirado não quebra página.
- Dados internos/admin não aparecem para usuário comum.



## Futuro

Com login, esta página passa a validar ownership por usuário e pode oferecer compartilhar, salvar na biblioteca e reprocessar.
