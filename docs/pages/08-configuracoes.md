# Página Configurações

## Rota

```text
/configuracoes-local no MVP; /app/configuracoes no futuro
```

## Objetivo

Permitir ajustar preferências musicais, visuais, retenção local, notificações e privacidade.

## Escopo MVP


No MVP, configurações são locais.

Seções:

```text
Preferências musicais
Experiência visual
Sons
Notificações
Histórico e privacidade
```


## Componentes principais


- `DefaultInstrumentSettings`
- `MotionSettings`
- `SoundSettings`
- `NotificationSettings`
- `PrivacySettings`
- `ClearLocalDataButton`


## Dados necessários


Dados locais:

```ts
type LocalSettings = {
  defaultInstrumentId?: string
  preferredFormats: ('pdf' | 'musicxml')[]
  musicalAnimations: boolean
  completionSounds: boolean
  respectReducedMotion: boolean
  localHistoryRetention: 'keep' | 'ask' | 'never'
  notificationsEnabled?: boolean
}
```


## Interações


- Alternar animações musicais.
- Sons ficam desligados por padrão.
- Push só solicita permissão após clique explícito.
- Limpar histórico local exige confirmação.
- Instrumento padrão pode pré-preencher wizard futuramente.


## Validações e regras de negócio


- Nunca tocar som automaticamente.
- Respeitar `prefers-reduced-motion` mesmo se animações estiverem ativas.
- Não pedir permissão de notificação na primeira visita sem contexto.
- Limpar dados locais deve informar o impacto.


## Estados de tela


Estados:

```text
loaded
saving_local
saved
save_error
notifications_unsupported
permission_denied
indexeddb_unavailable
```


## Segurança e privacidade


- Configurações locais não devem conter tokens sensíveis permanentes.
- Permissões de notificação devem ser revogáveis.
- Ao limpar dados, remover histórico, cache relacionado e referências locais.


## Acessibilidade


- Switches com labels claros.
- Estado ligado/desligado textual.
- Explicação de sons e notificações.
- Confirmações acessíveis.


## Critérios de aceite


- Sons desligados por padrão.
- Animações obedecem redução de movimento.
- Limpeza local funciona.
- Push não é solicitado sem ação do usuário.



## Futuro

Com login, parte das configurações pode sincronizar com backend. Preferências sensíveis continuam locais quando apropriado.
