# Testes frontend

## Ferramentas sugeridas

```text
Vitest
React Testing Library
Playwright
axe-core ou jest-axe
```

## Testes por página

### Home

- CTA principal navega para `/transpor`.
- CTA secundário navega para `/como-funciona`.
- Reduced motion reduz animações.

### Transpor

- Não avança sem PDF.
- Rejeita arquivo não PDF visualmente.
- Avança com PDF válido.
- Não avança sem origem/destino.
- Mostra feedback de intervalo.
- Cria job e inicia polling.

### Resultado

- Mostra artefatos quando job concluído.
- Exibe expirado quando status expired.
- Não mostra confidence score.

### Instrumentos

- Busca por alias.
- Filtro por família.
- Estado sem resultados.

### Histórico local

- Lista itens do IndexedDB.
- Limpa histórico.
- Mostra expirado/local-only.

## Acessibilidade

- Navegação por teclado.
- `aria-current` na navegação.
- Erros anunciados.
- Labels em campos.

## E2E crítico

```text
Home -> Transpor -> Upload -> Origem -> Destino -> Revisão -> Processamento mockado -> Resultado
```
