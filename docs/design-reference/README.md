# Referências visuais

## Estrutura

- `inspiration/`: imagens fornecidas pelo usuário, somente para inspiração;
- `golden-pages/master/`: prancha visual mestra aprovada;
- `golden-pages/<page>/`: referências individuais aprovadas e seus specs;
- `golden-pages/briefs/`: briefs de geração por página;
- `components/`: estados visuais originais de componentes;
- `storyboards/`: quadros de animação e continuidade;
- `schemas/`: schemas de manifests e specs.

## Ordem de autoridade

1. decisões e requisitos textuais;
2. especificação visual da página;
3. golden reference individual aprovada;
4. prancha mestra;
5. inspiração.

A IA deve consultar simultaneamente texto, imagem, tokens, manifesto do capítulo e critérios de aceite.

## Regra de produção

- referências e inspiração não entram no bundle;
- PNG não pode ser usado como background ou interface;
- o frontend deve ser reconstruído com HTML, CSS e SVG originais;
- uma referência só é normativa com `status: approved` e `.spec.yaml`;
- o usuário é a autoridade de aprovação;
- erros de texto presentes em imagem não substituem a copy documentada.
