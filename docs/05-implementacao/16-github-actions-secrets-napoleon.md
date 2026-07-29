# GitHub Actions Secrets e Napoleon

## Decisão

Os valores de ambiente e credenciais de automação serão mantidos em GitHub Actions Secrets. Nenhum segredo entra no repositório.

## Secrets obrigatórios

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_RECIPIENT_EMAIL
CONTACT_ALLOWED_ORIGINS
```

Quando a integração de deploy exigir autenticação adicional, usar nomes explícitos como:

```text
NAPOLEON_DEPLOY_TOKEN
NAPOLEON_DEPLOY_WEBHOOK
NAPOLEON_SSH_HOST
NAPOLEON_SSH_USER
NAPOLEON_SSH_KEY
```

Criar somente os secrets compatíveis com o método efetivamente disponibilizado pela Napoleon. Não inventar endpoint ou token.

## Regra de runtime

GitHub Actions Secrets existem dentro do job do Actions. O workflow deve:

1. validar presença sem imprimir valor;
2. usar no build quando necessário;
3. transmitir ou configurar no ambiente da aplicação Napoleon pelo método aprovado;
4. validar no smoke test que o runtime recebeu as variáveis;
5. mascarar logs;
6. separar staging e produção por GitHub Environments.

Se a Napoleon fizer somente pull do Git, configurar as mesmas variáveis no painel da aplicação Node.js e manter GitHub Environments como fonte documental/operacional. O deploy deve falhar de forma explícita quando alguma variável obrigatória estiver ausente.

## Ambientes GitHub

- `staging`: branch `develop/site-institucional`, aprovação opcional;
- `production`: branch/tag de release, aprovação obrigatória de Davi Benucci.

## CI

Pull requests executam lint, typecheck, unitários, Storybook, Playwright, axe e Lighthouse sem acesso a segredos de produção. Testes externos usam chaves próprias de staging/teste.
