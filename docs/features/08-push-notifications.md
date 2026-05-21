# Push notifications

## Objetivo

Notificar usuário quando job concluir, falhar ou quando arquivo estiver perto de expirar.

## Fase

Recurso futuro, não obrigatório no MVP.

## Regras de UX

- Nunca pedir permissão na primeira visita sem contexto.
- Mostrar botão `Ativar notificações`.
- Explicar finalidade.
- Permitir descadastro.

## Backend

- Registrar subscription Web Push.
- Salvar endpoint e chaves com segurança.
- Notificar job concluído/falhado.
- Notificar expiração futura.

## Tecnologias

```text
Service Worker
Web Push API
Notification API
pywebpush ou equivalente
Firebase Cloud Messaging no app futuro
Expo Notifications se mobile com Expo
APNs para iOS nativo
```

## Segurança

- Subscription vinculada ao usuário/sessão.
- Não enviar dados sensíveis na notificação.
- Permitir revogação.

## Testes

- Permissão negada é tratada.
- Notificação não é disparada sem consentimento.
- Descadastro remove subscription.
