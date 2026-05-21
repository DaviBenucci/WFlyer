# Estado local, cache e PWA

## Objetivo

Definir como o frontend guarda histórico local, preferências e cache sem depender de conta de usuário no MVP.

## Armazenamentos

### IndexedDB/Dexie

Usar para:

- histórico local;
- configurações locais;
- metadados de jobs concluídos;
- referências locais a arquivos baixados quando aplicável.

### Cache Storage API

Usar para:

- assets da PWA;
- páginas estáticas;
- eventualmente previews pequenos, se seguro e consentido.

### File System Access API

Uso futuro e opcional:

- permitir salvar arquivos em pasta escolhida pelo usuário;
- manter referência local quando navegador suportar.

## O que não salvar

- tokens de download permanentes;
- paths internos de storage;
- dados de admin;
- PDFs grandes sem ação explícita do usuário.

## Histórico local

Estados:

```text
available_server
local_only
expired_server
removed_local
```

## PWA

Regras:

- Páginas explicativas podem funcionar offline.
- Processamento requer conexão.
- Histórico local pode ser visível offline.
- Downloads remotos não funcionam offline.

## Privacidade

O usuário deve ter botão para:

```text
Limpar histórico local
Limpar arquivos locais/referências
Resetar preferências
```

## Testes

- IndexedDB indisponível não quebra app.
- Histórico é criado ao concluir job.
- Expiração é exibida corretamente.
- Limpeza local remove dados esperados.
