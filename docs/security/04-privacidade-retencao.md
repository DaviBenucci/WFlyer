# Privacidade e retenção

## Regra de retenção

Arquivos originais e finais ficam no servidor por até 15 dias.

## Histórico local

O navegador pode manter metadados locais. O usuário deve poder limpar esses dados.

## Dados mínimos

No MVP, armazenar apenas o necessário:

```text
job_id
anonymous_session_id
filename sanitizado
instrumentos
status
artefatos
expiração
```

## Após expiração

- Remover arquivos do storage.
- Marcar job como `expired`.
- Remover/anonimizar metadados sensíveis quando aplicável.
- Preservar métricas agregadas sem identificar usuário.

## Mensagem ao usuário

```text
Arquivos no servidor expiram após 15 dias. Você pode baixar o resultado e manter uma cópia local.
```
