# Testes E2E

## Objetivo

Validar fluxos completos do ponto de vista do usuário.

## Ferramenta sugerida

Playwright.

## Fluxos MVP

### Fluxo principal

```text
Abrir Home
Clicar Começar transposição
Enviar PDF válido mockado
Selecionar Piano
Selecionar Trompete Bb
Ver revisão
Processar
Acompanhar status
Abrir resultado
Baixar PDF/MusicXML mockados
```

### Fluxo de erro de upload

```text
Enviar arquivo inválido
Ver mensagem clara
Não avançar
```

### Fluxo de erro de processamento

```text
Criar job mockado que falha
Ver mensagem musical clara
Não exibir stacktrace
```

### Fluxo histórico local

```text
Concluir job
Abrir histórico local
Ver item
Remover item
```

## Critérios

- Sem erros no console.
- Sem navegação quebrada.
- Sem confidence score público.
- Estados terminais tratados.
