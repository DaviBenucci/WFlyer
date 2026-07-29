# Contrato de assets da animação de entrada

**Status:** proposta para aprovação  
**Objetivo:** impedir geração redundante ou incorreta de imagens e SVGs por agentes de implementação.

## 1. Gate obrigatório

A implementação da animação permanece bloqueada até que o pacote de SVGs seja confeccionado e aprovado pelo usuário.

Estado de bloqueio:

```text
BLOCKED_ASSET_APPROVAL
```

O agente pode preparar tipos, interfaces, testes e placeholders sem representação visual. Ele não pode criar a geometria ausente.

## 2. Quantidade planejada de assets

A etapa seguinte deve buscar o menor conjunto possível.

### Obrigatório

1. `wflyer-intro-master.svg`
   - símbolo oficial dividido em três módulos;
   - wordmark oficial em paths;
   - underscore de origem;
   - máscaras de revelação;
   - dois grupos de eco referenciando a geometria oficial;
   - título e descrição acessíveis.

2. `wflyer-header-symbol.svg`
   - símbolo oficial otimizado para uso no header;
   - mesma geometria do master;
   - sem animação embutida.

### Reutilização preferencial

O `wflyer-header-symbol.svg` pode ser substituído por `<use>` ou import do símbolo contido no master se o pipeline do Next.js preservar IDs, acessibilidade, cache e ausência de duplicações. A decisão será tomada durante a confecção dos SVGs.

### Fora deste contrato

A clave de sol e a partitura ondulada pertencem à especificação da homepage. Elas não devem ser incluídas no SVG da marca apenas para reduzir a quantidade aparente de arquivos.

## 3. IDs mínimos planejados

```text
wf-intro-logo
wf-origin-underscore
wf-symbol
wf-symbol-anchor
wf-symbol-upper-wing
wf-symbol-lower-wing
wf-echo-1
wf-echo-2
wf-wordmark
wf-wordmark-underscore
wf-wordmark-clip
wf-wordmark-clip-rect
wf-ink-sweep
wf-accessibility-title
wf-accessibility-description
```

A lista é provisória até a etapa de SVG, mas o significado de cada elemento é normativo.

## 4. Regras geométricas

- nenhuma alteração na silhueta oficial;
- nenhum path aproximado;
- nenhuma expansão de stroke que deforme o símbolo;
- wordmark convertido em paths oficiais;
- viewBox ajustado sem margem arbitrária;
- todos os módulos compartilham a mesma base de coordenadas;
- ecos usam `<use>` ou duplicatas aprovadas;
- variantes claras e escuras usam `currentColor` quando tecnicamente seguro;
- gradientes, quando aprovados, ficam em defs e não alteram a geometria.

## 5. Regras para o Codex

O Codex deve:

- consumir somente assets no diretório aprovado;
- verificar a presença de todos os IDs no build/teste;
- interromper a fase se um ID estiver ausente;
- não editar SVG com regex em runtime;
- não injetar paths em JSX;
- não criar fallback visual diferente da homepage estática.

O Codex não deve:

- gerar SVG;
- copiar o path a partir de PNG;
- converter automaticamente o vídeo em vetores;
- reconstruir o wordmark com fonte;
- usar IA para “completar” um módulo;
- criar múltiplos SVGs por breakpoint;
- criar assets exclusivos para claro e escuro quando `currentColor` resolver.

## 6. Validação futura do pacote

Antes da implementação:

- comparar silhueta com PNG oficial;
- validar IDs únicos;
- validar viewBox;
- validar ausência de `<text>` no wordmark;
- validar ausência de raster embutido;
- validar contraste nos dois temas;
- validar importação no Next.js;
- validar que `<use>` e máscaras funcionam nos navegadores definidos;
- gerar checksum dos assets aprovados.

## 7. Versionamento

O pacote aprovado deve possuir versão própria:

```text
wflyer-brand-motion-assets-v1.0
```

Qualquer mudança de path ou ID exige incremento de versão e atualização da documentação de motion.
