# Golden pages

## Objetivo

Fornecer uma referência individual, clara e verificável para cada página, tema e viewport. Essas imagens orientam o Codex, mas nunca são assets de produção.

## Arquivos aprovados

- `master/wflyer-approved-master-board.png` — prancha mestra;
- `application/application-desktop-light.png` — página Aplicação, desktop claro.

## Padrão de nomes

```text
<page-id>-desktop-light.png
<page-id>-desktop-light.spec.yaml
<page-id>-desktop-dark.png
<page-id>-desktop-dark.spec.yaml
<page-id>-mobile-light.png
<page-id>-mobile-light.spec.yaml
<page-id>-mobile-dark.png
<page-id>-mobile-dark.spec.yaml
```

## Viewports padrão

```yaml
desktop:
  width: 1536
  height: 1024
mobile:
  width: 390
  height: 844
```

## Status permitidos

- `approved`: imagem individual aprovada;
- `approved-master-panel`: composição aprovada dentro da prancha mestra, mas ainda requer versão individual;
- `pending-generation`: ainda não gerada;
- `pending-approval`: gerada, aguardando revisão;
- `superseded`: preservada apenas como histórico.

## Gate

Uma página só pode receber implementação visual final com PNG individual e spec ambos marcados como `approved`. Painel na prancha mestra autoriza a direção, mas não encerra o gate de alta resolução.

Consultar:

- `STATUS.md`;
- `page-matrix.yaml`;
- `GENERATION-BRIEF.md`;
- `../../05-implementacao/12-fluxo-golden-references.md`.
