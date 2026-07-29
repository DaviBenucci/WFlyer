# Movimento reduzido

## Condição

```css
@media (prefers-reduced-motion: reduce) { ... }
```

Também usar `gsap.matchMedia()` para construir e reverter timelines por preferência.

## Comportamento obrigatório

- sem viagem lateral extensa entre páginas;
- troca direta ou crossfade de 150–200 ms;
- sem pin prolongado;
- sem reação de notas ao cursor;
- pauta ondulada permanece estática;
- sem tilt 3D do tablet;
- sem parallax ou reflexo móvel;
- simulação do tablet continua funcional, mas mudanças aparecem sem deslocamento animado;
- foco, links, histórico e navegação continuam funcionando;
- não esconder conteúdo aguardando timeline;
- barra final permanece visível.

## Home

- mostrar imediatamente a clave e as duas pautas;
- nenhuma linha precisa ser desenhada progressivamente;
- ênfase de ramo pode usar somente cor, sublinhado ou borda;
- CTAs permanecem equivalentes.

## Transições de rota

- não montar o segmento temporário animado;
- atualizar a rota e mover foco para o `h1` ou contêiner principal conforme estratégia de acessibilidade;
- não simular deslocamento espacial por grandes transforms;
- manter indicação textual de anterior/próximo.

## Abertura da marca

A abertura completa deve ser ignorada. Não montar símbolo por deslocamento, não executar Ink Transfer, não bloquear scroll e não mover a logo até o header. Mostrar diretamente a Home real com fade opcional de 150–200 ms. A sessão deve ser registrada como concluída para impedir tentativa posterior na mesma visita.

## Controle opcional

Um ajuste interno pode permitir reduzir movimento mesmo quando o sistema não solicita. Deve ser local, sem banco, e nunca aumentar movimento quando o sistema solicita redução.
