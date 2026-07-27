# Estratégia de testes

## Pirâmide

1. funções e validações unitárias;
2. componentes e estados no Storybook;
3. integração do formulário com mocks;
4. E2E de jornadas;
5. regressão visual;
6. acessibilidade automática e manual;
7. performance;
8. segurança de endpoint.

## Comandos esperados

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:storybook
pnpm test:e2e
pnpm test:visual
pnpm test:a11y
pnpm lighthouse
pnpm build
```

## Matriz mínima

- Chromium desktop;
- Firefox desktop;
- WebKit/Safari simulado;
- viewport mobile;
- tema claro e escuro;
- movimento normal e reduzido;
- JavaScript degradado quando aplicável.
