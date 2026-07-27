# Movimento reduzido

## Condição

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Também usar `gsap.matchMedia()` para construir e reverter timelines por preferência.

## Comportamento obrigatório

- sem pin prolongado;
- sem grande deslocamento horizontal;
- capítulos em fluxo vertical;
- pauta ondulada permanece estática;
- notas não reagem ao cursor;
- transições limitadas a opacidade curta ou removidas;
- foco e âncoras continuam funcionando;
- não esconder conteúdo aguardando timeline.

## Controle opcional

Um ajuste interno de interface pode permitir reduzir movimento mesmo quando o sistema não solicita. Caso implementado, deve ser local, sem banco e sem substituir a preferência do sistema de modo inesperado.
