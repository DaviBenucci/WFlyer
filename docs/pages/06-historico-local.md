# Página Histórico local

## Rota

```text
/historico-local no MVP; /app/historico no futuro
```

## Objetivo

Mostrar transposições recentes armazenadas no navegador/dispositivo, sem depender de retenção permanente no servidor.

## Escopo MVP


O histórico no MVP é majoritariamente local.

Layout:

```text
Título: Histórico
Aviso: arquivos no servidor expiram após 15 dias
Busca/filtro
Lista de transposições
Estado de disponibilidade
Ações: Abrir, Baixar local, Remover
```


## Componentes principais


- `LocalHistoryList`
- `LocalHistoryItem`
- `RetentionBadge`
- `HistorySearch`
- `HistoryFilters`
- `ClearHistoryButton`
- `LocalFileStatusIndicator`


## Dados necessários


Dados em IndexedDB:

```ts
type LocalHistoryItem = {
  id: string
  jobId: string
  originalFilename: string
  sourceInstrumentName: string
  targetInstrumentName: string
  transposeInterval: number
  createdAt: string
  expiresAt?: string
  status: 'available_server' | 'local_only' | 'expired_server' | 'removed_local'
  downloadedPdfLocalRef?: string
  downloadedMusicXmlLocalRef?: string
}
```


## Interações


- Ao concluir job, criar item local.
- Ao abrir item, tentar consultar servidor se ainda não expirou.
- Se expirado, mostrar histórico sem download remoto.
- Remover item local apenas do dispositivo.
- `Limpar histórico local` exige confirmação.


## Validações e regras de negócio


- Não prometer que arquivo estará sempre disponível.
- Expiração do servidor é 15 dias.
- Histórico local pode persistir até usuário limpar ou navegador remover.
- Não armazenar arquivos grandes automaticamente sem consentimento claro.


## Estados de tela


Estados:

```text
empty
loaded
search_empty
server_available
local_only
expired_server
removed_local
indexeddb_unavailable
```


## Segurança e privacidade


- Histórico local pode conter nomes sensíveis; oferecer limpeza clara.
- Não sincronizar histórico sem consentimento futuro.
- Evitar salvar tokens de download permanentes.
- Tokens temporários devem expirar.


## Acessibilidade


- Cada item deve ter ações com labels claros.
- Badges não devem depender apenas de cor.
- Lista deve ser navegável por teclado.
- Confirm dialogs devem ser acessíveis.


## Critérios de aceite


- Histórico aparece após concluir uma transposição.
- Item expirado informa claramente indisponibilidade no servidor.
- Usuário consegue remover histórico local.
- IndexedDB indisponível não quebra a aplicação.



## Futuro

Com login, histórico remoto pode guardar metadados, mas arquivos continuam sujeitos à retenção e permissões.
