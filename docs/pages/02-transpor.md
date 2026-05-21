# Página Transpor / Wizard de nova transposição

## Rota

```text
/transpor no MVP; /app/novo no futuro autenticado
```

## Objetivo

Guiar o usuário por um fluxo profissional de upload, seleção de instrumentos, revisão, processamento e resultado.

## Escopo MVP


A página deve funcionar como um assistente inteligente, não como formulário simples.

Etapas obrigatórias:

```text
1. Upload
2. Instrumento de origem
3. Instrumento de destino
4. Revisão
5. Processamento
```

Desktop:

```text
Sidebar fixa
Cabeçalho "Nova transposição"
Stepper vertical ou lateral
Card principal da etapa
Painel de dicas musicais opcional
```

Mobile:

```text
Título compacto
Indicador Etapa X de 5
Stepper horizontal
Card principal
Ações fixas Voltar/Avançar
Bottom navigation no rodapé
```


## Componentes principais


- `TranspositionWizard`
- `WizardStepper`
- `WizardStepCard`
- `FileDropzone`
- `InstrumentSearch`
- `InstrumentFamilyFilter`
- `InstrumentCard`
- `TranspositionPreview`
- `ReviewCard`
- `ProcessingProgressBar`
- `MusicalProgressParticles`
- `WizardNavigationActions`
- `ProcessingStatusTimeline`


## Dados necessários


Estado mínimo do wizard:

```ts
type TranspositionDraft = {
  upload?: {
    localFile: File
    originalFilename: string
    sizeBytes: number
    mimeType: string
    pageCount?: number
  }
  sourceInstrumentId?: string
  targetInstrumentId?: string
  transposeInterval?: number
  expectedSourceKey?: string
  expectedTargetKey?: string
  jobId?: string
  downloadToken?: string
}
```

Dados externos:

```text
GET /api/instruments
POST /api/uploads
POST /api/transpositions
GET /api/jobs/{job_id}/status
GET /api/jobs/{job_id}/artifacts
```


## Interações


### Etapa 1 — Upload

- Usuário arrasta ou seleciona PDF.
- Dropzone valida tipo, tamanho e estado inicial.
- Após validação local, botão `Avançar` é liberado.

### Etapa 2 — Instrumento de origem

- Usuário escolhe para qual instrumento a partitura original foi escrita.
- Sugestão automática pode aparecer, mas sem percentual de confiança.
- Mensagem: "Encontramos uma possível correspondência. Confirme se está correta."

### Etapa 3 — Instrumento de destino

- Usuário escolhe instrumento final.
- Sistema mostra feedback imediato: `Piano -> Trompete Bb`, `+2 semitons`, `C maior -> D maior`.

### Etapa 4 — Revisão

- Mostrar arquivo, tamanho, instrumentos, alterações previstas e resultado esperado.
- CTA: `Processar agora`.

### Etapa 5 — Processamento

- Criar job no backend.
- Mostrar progresso por polling/SSE no futuro.
- Ao concluir, navegar para `/resultado/[id]`.


## Validações e regras de negócio


- Arquivo obrigatório.
- Apenas PDF no MVP.
- Limite inicial sugerido: 25 MB.
- Bloquear PDF criptografado se backend não suportar.
- Impedir avançar sem origem e destino.
- Origem e destino podem ser iguais, mas deve mostrar aviso: "Nenhuma transposição de instrumento será necessária".
- Não permitir processo se upload já falhou.
- Ao cancelar, limpar draft local com confirmação se houver arquivo selecionado.


## Estados de tela


Estados por etapa:

```text
idle
validating
valid
invalid
loading_instruments
submitting_job
queued
processing
completed
failed
cancelled
expired
```

Erros públicos:

```text
PDF inválido
Arquivo grande demais
Instrumento não selecionado
Falha ao criar job
Timeout de processamento
Erro de leitura musical
```

Mensagem musical padrão:

```text
Ocorreu um acidente na leitura da partitura.
Não foi possível concluir a transposição deste arquivo.
```


## Segurança e privacidade


- Frontend valida, mas backend é fonte final de validação.
- Nunca confiar em `file.type` isoladamente.
- Não expor path local do arquivo.
- Não logar nome completo de arquivo se puder conter dados sensíveis; usar sanitização.
- Não exibir confidence score ao usuário comum.
- Download posterior deve exigir `download_token` ou login/autorização.


## Acessibilidade


- Dropzone deve ser acessível por teclado.
- Botões com `aria-label` claro.
- Stepper deve indicar etapa atual com texto, não apenas cor.
- Erros devem ser anunciados em região `aria-live`.
- Animações do wizard devem respeitar `prefers-reduced-motion`.
- Área de toque mínima de 44x44px no mobile.


## Critérios de aceite


- Usuário não consegue processar sem PDF válido.
- Usuário não consegue processar sem origem e destino.
- Feedback de transposição aparece imediatamente após origem/destino.
- Ao criar job, tela muda para processamento sem travar a UI.
- Polling encerra quando status é `completed`, `failed`, `cancelled` ou `expired`.
- Testes cobrem navegação entre etapas, validações e tratamento de erro.



## Futuro

Com login, o wizard deve salvar rascunho por usuário e permitir retomar jobs. A rota futura será `/app/novo`.
