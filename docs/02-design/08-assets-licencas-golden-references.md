# Assets, licenças e golden references

## Classes de referência

### Inspiração

Arquivos em `design-reference/inspiration/` são somente direção. Possuem licença desconhecida ou de terceiros e não entram no produto.

### Prancha mestra aprovada

`design-reference/golden-pages/master/wflyer-approved-master-board.png` fixa:

- linguagem visual dos temas;
- estrutura do header;
- uso central do símbolo;
- cards, botões, ícones e pauta;
- densidade e proporção geral.

### Golden reference individual

Imagem de uma única página, um único viewport e um único tema, acompanhada por `.spec.yaml`. Controla a composição daquela página. Não é asset de produção.

### Storyboard

Quadros que mostram estados temporais, continuidade da pauta e direção da transição.

## Imagens de inspiração

Todas são classificadas como:

```yaml
usage: inspiration-only
ship_in_production: false
license_status: unknown-or-third-party
```

Elas não podem ser publicadas, recortadas, vetorizadas por cópia, usadas como textura, incorporadas à marca ou tratadas como material licenciado.

## Assets produtivos

Devem ser originais:

- pauta e conectores;
- clave narrativa;
- notas;
- barras de compasso e barra final;
- ícones musicais e de serviço;
- padrões e texturas;
- ilustrações de serviço;
- casca do tablet e reflexos;
- interface HTML do tablet.

## Gate de golden references

Antes da implementação final de uma página são obrigatórios:

1. PNG individual claro;
2. PNG individual escuro;
3. `.spec.yaml` para cada PNG;
4. marcação `status: approved`;
5. identificação de ramo, ordem, entrada, saída e terminal;
6. ausência de conteúdo fictício;
7. aprovação do usuário registrada no status.

As versões mobile claro/escuro devem existir antes da conclusão responsiva da página.

## Referências já aprovadas

- prancha mestra dos layouts claro/escuro;
- Aplicação W_Flyer — desktop claro, incluindo conceito do tablet.

O status detalhado está em `design-reference/golden-pages/STATUS.md`.

## Regra de reconstrução

O Codex deve reconstruir a composição com HTML, CSS, SVG e componentes. É proibido:

- usar PNG como background;
- cortar partes da golden reference para compor a página;
- inserir screenshot do tablet como tela final;
- mapear cliques sobre imagem;
- aceitar erros de texto da imagem como conteúdo definitivo;
- atualizar baseline para esconder divergência.
