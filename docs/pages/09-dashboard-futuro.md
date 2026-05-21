# Dashboard futuro

## Rota

```text
/app
```

## Objetivo

Fornecer visão geral para usuário autenticado: transposições recentes, ações rápidas, notificações e limites.

## Escopo MVP


Fora do MVP inicial.

Blocos:

```text
Ação rápida: Nova transposição
Jobs recentes
Arquivos perto de expirar
Limites do plano
Avisos/notificações
```


## Componentes principais


- `DashboardSummaryCards`
- `RecentJobsList`
- `QuickActionNewTransposition`
- `ExpiringArtifactsNotice`
- `QuotaUsageCard`


## Dados necessários


Dados autenticados:

```text
user
recent_jobs
quota_usage
expiring_artifacts
notifications
```


## Interações


- Clique em job abre `/app/jobs/[id]`.
- Nova transposição abre `/app/novo`.
- Avisos de expiração levam ao histórico.


## Validações e regras de negócio


- Requer login.
- Exibir apenas jobs do usuário.
- Não listar artefatos expirados como baixáveis.


## Estados de tela


Estados:

```text
loading
empty
loaded
unauthenticated
error
```


## Segurança e privacidade


- Controle de ownership no backend.
- Não expor dados de outros usuários.
- Evitar informações sensíveis em cards.


## Acessibilidade


- Cards com hierarquia clara.
- Labels visíveis.
- Sem depender só de cor para limites.


## Critérios de aceite


- Usuário vê apenas seus próprios jobs.
- Limites de plano são claros.
- Ações rápidas funcionam.
