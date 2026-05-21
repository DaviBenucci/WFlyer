# Histórico local

## Objetivo

Preservar metadados de transposições no dispositivo sem exigir conta.

## Storage

Usar IndexedDB via Dexie.

## Dados

```text
job_id
nome sanitizado da partitura
instrumento origem
instrumento destino
intervalo
data
status final
expires_at
estado local/remoto
```

## Estados

```text
Disponível no servidor
Disponível apenas localmente
Expirado no servidor
Arquivo removido localmente
```

## Privacidade

- Usuário pode limpar histórico.
- Não salvar tokens permanentes.
- Não sincronizar sem consentimento.
- Avisar que histórico é deste dispositivo.

## Testes

- Criar histórico após job concluído.
- Atualizar estado expirado.
- Limpar histórico remove registros.
- App continua funcionando sem IndexedDB.
