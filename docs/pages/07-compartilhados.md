# Página Compartilhados

## Rota

```text
/app/compartilhados no futuro; pode ficar fora do MVP
```

## Objetivo

Permitir que usuários encontrem e baixem partituras compartilhadas explicitamente por outros usuários, respeitando permissões e limites.

## Escopo MVP


Esta página é futura e depende de autenticação.

Layout:

```text
Título
Descrição
Busca
Filtros: instrumento, família, tonalidade
Grid de partituras compartilhadas
Ação de download
Ação de denunciar/moderar no admin
```


## Componentes principais


- `SharedScoresGrid`
- `SharedScoreCard`
- `SharedScoreFilters`
- `DownloadSharedScoreButton`
- `ShareToggle`
- `ModerationBadge`


## Dados necessários


Dados:

```ts
type SharedScore = {
  id: string
  title: string
  sourceInstrumentName: string
  targetInstrumentName: string
  key?: string
  ownerDisplayName?: string
  createdAt: string
  downloadsCount: number
  moderationStatus: 'visible' | 'pending' | 'hidden' | 'removed'
}
```


## Interações


- Usuário lista compartilhamentos permitidos.
- Download gera URL temporária.
- Compartilhamento é sempre explícito.
- Usuário pode remover compartilhamento próprio.
- Admin pode ocultar/moderar.


## Validações e regras de negócio


- Requer autenticação.
- Aplicar limite por plano/regra.
- Não listar arquivos privados.
- Não permitir download sem permissão.
- Registrar download para auditoria/limites.


## Estados de tela


Estados:

```text
loading
empty
loaded
filter_empty
unauthenticated
forbidden
rate_limited
moderated_hidden
```


## Segurança e privacidade


- URLs assinadas e temporárias.
- Controle de ownership.
- Moderação e denúncia.
- Sanitização de títulos e metadados.
- Não expor storage path.


## Acessibilidade


- Grid responsivo.
- Cards com nomes acessíveis.
- Filtros com labels claros.
- Status de moderação textual.


## Critérios de aceite


- Apenas compartilhamentos explícitos aparecem.
- Usuário sem permissão não baixa.
- Remover compartilhamento tira item da listagem pública.
- Admin consegue moderar.
