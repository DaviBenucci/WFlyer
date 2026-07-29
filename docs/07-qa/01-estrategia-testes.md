# Estratégia de testes

## Pirâmide

1. funções, manifestos e validações unitárias;
2. componentes e estados no Storybook;
3. integração do formulário e da demonstração com mocks locais;
4. E2E de jornadas e rotas;
5. regressão visual contra golden references;
6. motion determinístico e direção de transição;
7. acessibilidade automática e manual;
8. performance;
9. segurança de endpoint.

## Comandos esperados

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:storybook
pnpm test:e2e
pnpm test:visual
pnpm test:motion
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
- navegação direta, anterior, próximo, Back e Forward;
- JavaScript degradado quando aplicável;
- dispositivo real intermediário;
- mouse, teclado, toque e trackpad quando aplicável.

## Dados determinísticos

- conteúdo de portfólio fixo ou estado vazio;
- demonstração do tablet sem randomização;
- notas decorativas em posições fixas no modo de teste;
- relógio/timeline controlável;
- tema e preferência de movimento definidos antes do screenshot;
- nenhum dado de rede necessário para páginas estáticas.
