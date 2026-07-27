# Assets, licenças e golden references

## Imagens recebidas

As imagens em `design-reference/inspiration/` são exclusivamente referências de direção. Algumas possuem marcas de bancos de imagem. Todas estão classificadas como:

```yaml
usage: inspiration-only
ship_in_production: false
license_status: unknown-or-third-party
```

Elas não podem ser:

- publicadas no site;
- recortadas para uso produtivo;
- vetorizadas por cópia;
- usadas como textura;
- incorporadas ao logotipo;
- tratadas como material licenciado.

## Assets produtivos

Devem ser originais:

- pauta;
- clave provisória;
- notas;
- barras de compasso;
- ícones musicais;
- padrões e texturas;
- ilustrações de serviço.

## Golden references obrigatórias antes do frontend final

```text
golden-pages/home/home-desktop-light.png
golden-pages/home/home-desktop-dark.png
golden-pages/home/home-mobile-light.png
golden-pages/home/home-mobile-dark.png
components/header/header-default.png
components/header/header-application-active.png
components/header/header-company-active.png
components/header/header-mobile-open.png
storyboards/entry.png
storyboards/horizontal-scroll.png
storyboards/theme-transition.png
storyboards/footer-cadence.png
```

Cada imagem deve ter especificação YAML com viewport, tema, conteúdo, tokens, componentes, estados e tolerância de regressão.
