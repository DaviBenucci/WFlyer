# Referências visuais

## Estrutura

- `inspiration/`: somente inspiração;
- `golden-pages/master/`: prancha mestra aprovada;
- `golden-pages/application/`: referência individual aprovada;
- `golden-pages/visual-archetypes.yaml`: contratos de herança;
- `golden-pages/page-matrix.yaml`: autorização por página/estado;
- `components/` e `storyboards/`: estados e motion;
- `schemas/`: validação.

## Ordem de autoridade

1. decisões e requisitos;
2. especificação visual da página;
3. autorização e arquétipo;
4. referência individual, quando existir;
5. painel da prancha mestra;
6. tokens, responsividade e motion;
7. inspiração.

## Regra de produção

As referências não entram no bundle. O frontend é reconstruído com HTML, CSS e SVG. Estados `authorized-derived` são plenamente implementáveis e devem ser comparados aos arquétipos e ao sistema global, não a um layout inventado.
