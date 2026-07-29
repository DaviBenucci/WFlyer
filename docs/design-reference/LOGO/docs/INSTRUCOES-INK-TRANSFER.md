# Diretrizes de animação — Ink Transfer

## Sequência recomendada

1. **Ancoragem** — `wf-symbol-anchor` entra com opacidade de 0 para 1 e deslocamento horizontal curto.
2. **Encaixe modular** — `wf-symbol-upper-wing` e `wf-symbol-lower-wing` aproximam-se em 160–240 ms, com rotação máxima de 2°.
3. **Ativação do underscore** — `wf-wordmark-underscore` surge como uma linha condensada e expande no eixo X.
4. **Transferência de tinta** — `wf-ink-sweep` percorre o conjunto da esquerda para a direita, revelando `wf-wordmark`.
5. **Estabilização** — todo o lockup realiza uma redução de escala muito discreta, entre 1,015 e 1,0.

## Parâmetros

- Duração total: 900–1.300 ms.
- Curva principal: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Rotação: no máximo 2°.
- Deslocamento: entre 8 e 24 px em desktop; proporcional no mobile.
- Evitar bounce, elasticidade e brilho excessivo.
- Respeitar `prefers-reduced-motion`; nessa condição, aplicar apenas fade de 150–200 ms.

## CSS mínimo

```css
#wf-symbol-anchor,
#wf-symbol-upper-wing,
#wf-symbol-lower-wing,
#wf-wordmark-underscore {
  transform-box: fill-box;
  transform-origin: center;
}

@media (prefers-reduced-motion: reduce) {
  #wf-logo * {
    animation: none !important;
    transition-duration: 0.2s !important;
  }
}
```

## GSAP

- Animar `wf-symbol-anchor` primeiro.
- Usar `wf-symbol-upper-wing` e `wf-symbol-lower-wing` na mesma posição da timeline, com pequeno stagger.
- Expandir `wf-wordmark-underscore` antes da máscara.
- Mover `wf-ink-sweep` de `x: -30%` para `x: 110%`.
- Finalizar revelando `wf-wordmark-r`.
