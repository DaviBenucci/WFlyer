# Tokens visuais v1

**Status:** NORMATIVO
Os tokens usam prefixo `--wf-`. Alterações cromáticas relevantes exigem comparação com a prancha mestra e atualização de golden references.

## Tema claro

```css
:root {
  --wf-bg: #f7f1e8;
  --wf-surface: #fffaf3;
  --wf-surface-elevated: #fffdf8;
  --wf-surface-muted: #eee2d4;
  --wf-text: #24180f;
  --wf-text-muted: #665548;
  --wf-primary: #4d280d;
  --wf-primary-hover: #633612;
  --wf-accent: #9a6237;
  --wf-staff: #c9a17c;
  --wf-note: #70401f;
  --wf-border: #ddc9b5;
  --wf-focus: #75421f;
  --wf-shadow-soft: 0 18px 50px rgb(58 32 17 / 0.12);
  --wf-tablet-edge: #3a210f;
  --wf-tablet-reflection: rgb(255 255 255 / 0.28);
}
```

## Tema escuro

```css
[data-theme="dark"] {
  --wf-bg: #020b22;
  --wf-surface: #07132e;
  --wf-surface-elevated: #0b193a;
  --wf-surface-muted: #111f43;
  --wf-text: #f7f4ff;
  --wf-text-muted: #c5c5dc;
  --wf-primary: #7437ff;
  --wf-primary-hover: #915eff;
  --wf-accent: #a348ff;
  --wf-staff: #5834bd;
  --wf-note: #933fff;
  --wf-border: #2b3167;
  --wf-focus: #b58cff;
  --wf-shadow-soft: 0 22px 60px rgb(0 0 0 / 0.34);
  --wf-glow-soft: 0 0 28px rgb(126 55 255 / 0.28);
  --wf-tablet-edge: #10153a;
  --wf-tablet-reflection: rgb(171 132 255 / 0.18);
}
```

## Dimensões

```css
:root {
  --wf-header-height-desktop: 88px;
  --wf-header-height-mobile: 64px;
  --wf-content-max: 1440px;
  --wf-page-gutter: clamp(20px, 4vw, 72px);
  --wf-radius-sm: 8px;
  --wf-radius-md: 16px;
  --wf-radius-lg: 28px;
  --wf-radius-pill: 999px;
  --wf-staff-gap-desktop: 12px;
  --wf-staff-gap-mobile: 8px;
  --wf-transition-chapter: 720ms;
}
```

## Motion tokens

```css
:root {
  --wf-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --wf-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --wf-duration-fast: 180ms;
  --wf-duration-medium: 360ms;
  --wf-duration-chapter: 720ms;
  --wf-tablet-tilt-max: 6deg;
}
```

## Regras de contraste

- texto normal deve atingir WCAG 2.2 AA;
- cores da pauta podem ter contraste inferior quando estritamente decorativas;
- links e botões não dependem exclusivamente de cor para indicar estado;
- foco visível usa contorno, offset e contraste independente de tema;
- glow não pode reduzir nitidez de texto, ícone ou borda de controle.
