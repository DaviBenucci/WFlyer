# Tokens provisórios

Todos os nomes devem conservar o prefixo `--wf-provisional-`.

## Tema claro

```css
:root {
  --wf-provisional-bg: #f4ebdd;
  --wf-provisional-surface: #fff9f0;
  --wf-provisional-surface-muted: #e8dccb;
  --wf-provisional-text: #211915;
  --wf-provisional-text-muted: #66564c;
  --wf-provisional-primary: #5a3a2b;
  --wf-provisional-primary-hover: #704a37;
  --wf-provisional-accent: #a16a43;
  --wf-provisional-staff: #b79d84;
  --wf-provisional-border: #d2bfaa;
  --wf-provisional-focus: #704a37;
}
```

## Tema escuro

```css
[data-theme="dark"] {
  --wf-provisional-bg: #070a18;
  --wf-provisional-surface: #0f1530;
  --wf-provisional-surface-muted: #171e3f;
  --wf-provisional-text: #f5f3ff;
  --wf-provisional-text-muted: #bfc4df;
  --wf-provisional-primary: #315cff;
  --wf-provisional-primary-hover: #5b7dff;
  --wf-provisional-accent: #8b5cff;
  --wf-provisional-staff: #5366a8;
  --wf-provisional-border: #2f3b70;
  --wf-provisional-focus: #a98cff;
}
```

## Dimensões

```css
--wf-provisional-header-height-desktop: 88px;
--wf-provisional-header-height-mobile: 64px;
--wf-provisional-content-max: 1280px;
--wf-provisional-radius-sm: 8px;
--wf-provisional-radius-md: 16px;
--wf-provisional-radius-lg: 28px;
--wf-provisional-shadow-soft: 0 18px 50px rgb(33 25 21 / 0.10);
```

## Regras de contraste

- texto normal deve atingir WCAG AA;
- cores da pauta podem ter contraste inferior quando estritamente decorativas;
- links e botões não dependem apenas de azul, roxo ou marrom para indicar estado;
- foco visível usa contorno, offset e contraste independente de tema.
