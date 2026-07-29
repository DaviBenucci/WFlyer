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


## Abertura da marca

A abertura completa deve ser ignorada. Não montar símbolo por deslocamento, não executar Ink Transfer, não bloquear scroll e não mover a logo até o header. Mostrar diretamente a homepage real com fade opcional de 150–200 ms. A sessão deve ser registrada como concluída para impedir tentativa posterior na mesma visita.
