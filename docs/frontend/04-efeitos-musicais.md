# Efeitos musicais

## Objetivo

Criar uma experiência musical profissional sem transformar a aplicação em jogo. Os efeitos devem reforçar contexto e feedback, não distrair.

## Princípios

- Curtos.
- Discretos.
- Decorativos.
- Sem som automático.
- Desativáveis.
- Respeitam `prefers-reduced-motion`.
- Não bloqueiam interação.

## Tipos de efeito

### Notas flutuantes na Home

Uso: hero da Home.

Comportamento:

```text
notas pequenas
opacidade baixa
movimento lento
sem loop agressivo
```

### Cortina musical de transição

Uso: troca de página.

Direções:

```text
Desktop sidebar: esquerda -> direita
Mobile bottom nav: baixo -> cima
Wizard avançar: direita -> esquerda
Wizard voltar: esquerda -> direita
```

### Rastro musical no bottom nav

Uso: troca de aba mobile.

```text
notas surgem perto do item ativo
seguem direção do movimento
sobem poucos pixels
fade em menos de 500ms
```

### Barra de progresso musical

Uso: processamento.

```text
nota sai da ponta da barra em avanços relevantes
cor acompanha gradiente roxo/azul
em 100%, pequeno acorde visual
```

### Erro musical

Uso: falhas.

```text
sustenido/bemol aparece ao lado do card
linha de pauta quebra/desafina
card vibra levemente
mensagem textual clara
```

Mensagem padrão:

```text
Ocorreu um acidente na leitura da partitura.
Não foi possível concluir a transposição deste arquivo.
```

## Efeitos por família de instrumentos

```text
Metais: brilho dourado discreto e ondas de sopro
Madeiras: linhas orgânicas e notas curvas
Cordas: traços finos simulando arco
Teclas: pequenas teclas ou piano roll
Voz: ondas sonoras suaves
Percussão melódica: pulsos rítmicos
```

## Som

Som é opt-in.

Regras:

- desligado por padrão;
- nunca tocar automaticamente antes de consentimento;
- opção clara em configurações;
- sons curtos;
- controle global de mute.

## Tecnologia

```text
Framer Motion para entrada/saída e layoutId
CSS keyframes para partículas simples
SVG para notas e pauta
Canvas apenas se necessário e com limite de partículas
Web Audio API ou Howler.js para sons opcionais
```

## Testes

- `prefers-reduced-motion` desativa efeitos não essenciais.
- Efeitos não bloqueiam clique.
- Efeitos não aparecem em excesso em navegação rápida.
- Som não toca sem opt-in.
