# Tablet interativo da página Aplicação

**Status:** NORMATIVO

## 1. Objetivo

Demonstrar de forma concreta a proposta da aplicação W_Flyer. O tablet deve parecer um objeto com profundidade, mas a tela continua sendo uma interface web real, legível, responsiva e operável.

## 2. Limite de escopo

A demonstração não implementa o aplicativo. Ela não pode:

- receber upload;
- ler PDF, JPG ou PNG;
- executar OCR/OMR;
- aplicar regras reais de transposição;
- chamar API da aplicação;
- armazenar dados;
- autenticar usuário;
- sugerir que o resultado ilustrativo possui precisão garantida.

## 3. Estrutura

```text
ApplicationDemoTablet
├── TabletShell
│   ├── TabletEdge
│   ├── TabletReflection
│   └── TabletScreen
│       ├── DemoScorePreview
│       ├── OriginInstrumentField
│       ├── OriginKeyField
│       ├── DestinationInstrumentField
│       ├── DestinationKeyField
│       ├── DemoSettings
│       ├── TransposeDemoButton
│       └── DemoStatus
└── TabletShadow
```

## 4. Estados

```ts
type DemoState =
  | "idle"
  | "configured"
  | "processing"
  | "result"
  | "reset";
```

- `idle`: amostra inicial visível;
- `configured`: usuário alterou um campo;
- `processing`: indicador curto local;
- `result`: partitura/legenda muda para variante determinística;
- `reset`: volta ao estado inicial.

## 5. Dados de demonstração

Usar conjunto local pequeno e explicitamente ilustrativo, por exemplo:

```yaml
origin:
  instrument: Piano
  key: Dó maior (C)
destination:
  instrument: Trompete em Si bemol
  key: Si bemol maior (Bb)
result_label: Demonstração ilustrativa
```

A amostra musical deve ser original ou de domínio público comprovado. Não incorporar partitura protegida sem autorização.

## 6. CSS 3D

- `perspective` no contêiner;
- `transform-style: preserve-3d` somente onde necessário;
- inclinação máxima de 6° em `rotateX` e `rotateY`;
- translação Z limitada a elementos decorativos da casca;
- tela permanece em plano legível;
- não permitir rotação livre, arraste orbital ou verso do dispositivo;
- retorno ao repouso ao sair do componente, perder foco ou ocultar a aba.

## 7. Reação ao cursor

- ativar somente com `(hover: hover) and (pointer: fine)`;
- mapear posição relativa do cursor para rotação limitada;
- usar suavização, nunca seguir instantaneamente;
- sombra e reflexo podem responder com amplitude menor;
- campos e botões não se movem em relação à tela;
- ao focar um controle, reduzir a inclinação para facilitar leitura.

## 8. Interação da tela

- campos usam elementos nativos ou componentes semanticamente equivalentes;
- botão `Transpor` é um `<button>` real;
- Enter/Space funcionam;
- estado `processing` desabilita somente a ação necessária;
- resultado é anunciado por `aria-live="polite"`;
- botão `Restaurar demonstração` fica disponível após resultado;
- nenhum campo exige precisão musical do visitante para funcionar.

## 9. Animação do resultado

- duração de processamento local: 500–900 ms;
- destacar notas afetadas por cor, contorno e pequena translação;
- não depender apenas da cor;
- não animar toda a pauta com blur;
- não executar som;
- reduced motion troca o estado diretamente.

## 10. Responsividade

### Desktop

Tablet à direita do hero, com largura aproximada de 48–56% da área útil.

### Tablet de viewport

Pode ocupar linha própria, com tilt máximo de 3° e controles ampliados.

### Mobile

- posicionar abaixo da copy;
- remover tilt por cursor;
- permitir interação vertical normal;
- preservar tamanho de toque de 44 × 44 px;
- não usar overflow horizontal.

## 11. Performance

- nenhum canvas contínuo;
- nenhum WebGL;
- nenhum listener ativo fora do viewport;
- preferir SVG simples para a amostra musical;
- evitar box-shadow recalculado por frame;
- limpar `quickTo`, listeners e observers ao desmontar.

## 12. Golden references necessárias

- tablet idle — claro;
- tablet idle — escuro;
- tablet focus/control active;
- tablet processing;
- tablet result;
- tablet reduced motion;
- tablet mobile.

A golden page da Aplicação controla a composição geral; as referências de componente controlam estados internos.
