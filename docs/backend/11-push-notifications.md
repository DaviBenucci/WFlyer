# Push notifications — Backend

## Objetivo

Permitir notificações futuras para conclusão, falha e expiração próxima.

## Endpoints futuros

```text
POST /api/push-subscriptions
DELETE /api/push-subscriptions/{id}
GET /api/push-subscriptions
```

## Dados

```text
id
user_id ou anonymous_session_id
endpoint
p256dh
auth
user_agent opcional
created_at
revoked_at
```

## Segurança

- Salvar chaves com cuidado.
- Não logar endpoint completo quando não necessário.
- Vincular subscription ao usuário/sessão.
- Permitir revogação.
- Não enviar dados sensíveis na notificação.

## Eventos de notificação

```text
job_completed
job_failed
artifact_expiring_soon
```

## Exemplo de conteúdo

```text
WFlyer
Sua transposição Piano -> Trompete Bb foi concluída.
Toque para baixar a partitura.
```

## Scheduler

Para expiração próxima:

```text
buscar jobs com expires_at em 24h/48h
notificar usuários que optaram por isso
evitar duplicidade com notification_events
```
