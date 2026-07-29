# Animação de entrada da marca W_Flyer

**Identificador:** `M-010`
**Status:** proposta normativa para aprovação
**Versão:** `2.0-review`
**Data-base:** `2026-07-29`
**Escopo:** site institucional `wflyer.com.br`
**Referência de movimento:** vídeo aprovado pelo usuário em 29/07/2026
**Duração da referência:** `4,086 s`, `24 fps`, `864 × 496`, H.264
**Duração da coreografia web completa:** `5,600 s`
**Base temporal de documentação:** `60 fps`, apenas para inspeção e QA

> A execução real é baseada em tempo, não em contagem fixa de frames. O mapa de frames é uma representação determinística a 60 fps para revisão, depuração, comparação visual e testes automatizados.

---

## 1. Objetivo

A abertura deve transformar a marca W_Flyer em uma experiência institucional curta, precisa e reconhecível, sem parecer um template genérico de tecnologia, uma vinheta de jogos ou uma animação gerada de forma probabilística.

A sequência deve reproduzir a linguagem aprovada no vídeo de referência:

```text
underscore central
→ nascimento compacto do símbolo
→ expansão geométrica com contornos temporários
→ estabilização do símbolo
→ revelação horizontal do wordmark
→ pausa com o lockup completo
→ transformação da marca na interface real do site
```

A animação web não é uma cópia frame a frame do vídeo. O vídeo é a referência de direção, ritmo e hierarquia. A implementação deve corrigir imprecisões inevitáveis do vídeo e preservar integralmente a geometria oficial da marca.

---

## 2. Princípios narrativos

### 2.1 Underscore como origem

O underscore representa o ponto inicial: uma necessidade, uma ideia ou uma pessoa. Ele é o primeiro elemento visível e funciona como origem da transformação.

O underscore não deve pulsar repetidamente, emitir partículas aleatórias ou parecer um cursor de terminal. Seu brilho é curto, contido e interno.

### 2.2 Símbolo como sistema construído

Os módulos do símbolo não aparecem como uma imagem única. Eles emergem próximos ao underscore, aumentam de escala e se encaixam com pequenas diferenças de tempo.

Esse comportamento comunica:

- estrutura para criação de sites;
- modularidade para aplicações;
- convergência para integrações;
- adaptação para soluções sob medida.

Esses significados são transmitidos pelo movimento. Não devem surgir ícones de navegador, celular, código, rede, inteligência artificial ou qualquer ilustração literal.

### 2.3 “Flyer” como avanço controlado

A expansão do símbolo usa trajetória predominantemente ascendente e progressiva, mas sem asas, pássaros, aviões, foguetes, setas ou linhas de velocidade agressivas.

O avanço deve ser percebido pelo ganho de escala, pelo alinhamento dos módulos e pela redução gradual das imperfeições temporárias.

### 2.4 Aplicação musical como cadência

A relação com a aplicação musical aparece por ritmo, pausa, antecipação, encaixe e resolução. A abertura da marca não deve mostrar claves, notas, pautas ou instrumentos.

Os elementos musicais começam somente no handoff para a homepage, quando a marca já foi apresentada e a interface real assume a cena.

---

## 3. Fonte da verdade visual

### 3.1 Autoridade dos materiais

A ordem de autoridade é:

1. SVGs oficiais aprovados na futura etapa de assets;
2. lockups oficiais aprovados da identidade W_Flyer;
3. esta especificação de motion;
4. mapa de frames e timeline YAML;
5. vídeo de referência;
6. protótipos antigos.

O vídeo não possui autoridade para redesenhar a marca. Se um frame do vídeo apresentar geometria, espaçamento ou lettering diferentes do arquivo oficial, prevalece o arquivo oficial.

### 3.2 Arquivos existentes no pacote atual

O pacote documental anterior contém `wflyer-animation-base.svg` e outros SVGs. Nesta revisão, esses arquivos são considerados **referência estrutural**, não aprovação automática para produção.

Até a etapa de confecção e aprovação dos SVGs:

- o Codex não pode editar paths existentes;
- o Codex não pode gerar novos SVGs;
- o Codex não pode vetorizar PNGs;
- o Codex não pode criar formas substitutas com CSS;
- o Codex não pode usar texto tipográfico para imitar o wordmark;
- a implementação visual da abertura permanece bloqueada.

---

## 4. Tecnologias autorizadas

### 4.1 Stack

```text
Next.js App Router
React
TypeScript estrito
GSAP 3
@gsap/react
SVG oficial
CSS Custom Properties
HTML semântico para controles
```

`ScrollTrigger` não controla a abertura, porque a abertura é temporal e ocorre antes da narrativa da dupla partitura. Ele continua autorizado para reveals locais e interações após o handoff.

### 4.2 Responsabilidade por tecnologia

| Tecnologia | Responsabilidade |
|---|---|
| React | estado da abertura, tema, skip, sessão e montagem dos componentes |
| GSAP | timeline, transformações, máscaras, opacidade e handoff |
| `@gsap/react` | escopo, ciclo de vida e limpeza da timeline |
| SVG | geometria oficial, módulos, wordmark, máscaras e contornos |
| CSS Custom Properties | cores temáticas, contraste e intensidades não geométricas |
| Next.js | renderização da homepage atrás da abertura e carregamento do Client Component |

### 4.3 Tecnologias proibidas

```text
Vídeo no runtime
Canvas
WebGL
Three.js
React Three Fiber
Lottie
Anime.js
Motion / Framer Motion
React Spring
Lenis
bibliotecas de partículas
filtros que deformem o SVG
IA generativa no runtime
```

---

## 5. Arquitetura da cena

A homepage deve estar renderizada atrás da camada de introdução desde o primeiro paint. A abertura não carrega uma página separada e não substitui a aplicação inteira.

```text
RootLayout
└── HomePage
    ├── HomepageShell                         já renderizada
    │   ├── SiteHeader                        estado inicial oculto
    │   ├── HeroTrebleClef                    estado inicial oculto
    │   ├── WavyMusicalStaff                  estado inicial oculto
    │   ├── ApplicationHeroContent            estado inicial oculto
    │   └── CompanyHeroContent                estado inicial oculto
    │
    └── BrandIntroController                  Client Component
        ├── BrandIntroOverlay
        │   ├── IntroThemeSurface
        │   ├── IntroOfficialLogoSvg
        │   │   ├── OriginUnderscore
        │   │   ├── SymbolModules
        │   │   ├── SymbolEchoContours
        │   │   ├── OfficialWordmark
        │   │   └── WordmarkRevealMask
        │   ├── SkipIntroButton
        │   └── IntroStatusLiveRegion
        └── BrandIntroHandoff
```

### 5.1 Camadas

| Camada | Z-index conceitual | Regra |
|---|---:|---|
| homepage | 0 | renderizada e estável desde o início |
| overlay de fundo | 10 | mesma cor do fundo real da homepage |
| logo e efeitos | 20 | somente SVG oficial e duplicatas aprovadas |
| controle de pular | 30 | HTML acessível, nunca parte do SVG |

### 5.2 Fundo

O fundo do overlay e o fundo do primeiro viewport da homepage devem usar a mesma variável CSS. Não pode haver dois valores visualmente semelhantes, mas diferentes.

```css
--wf-intro-background: var(--wf-page-background);
```

Isso elimina o corte quando a camada superior perde opacidade.

---

## 6. Estado e ciclo de vida

### 6.1 Estados

```ts
type BrandIntroState =
  | "resolving-theme"
  | "waiting-assets"
  | "ready"
  | "playing"
  | "skipping"
  | "handoff"
  | "completed"
  | "failed";
```

### 6.2 Transições válidas

```text
resolving-theme → waiting-assets
waiting-assets → ready | failed
ready → playing | completed
playing → handoff | skipping | failed
skipping → handoff
handoff → completed
failed → completed
```

Nenhum erro pode deixar o usuário preso no overlay.

### 6.3 Execução por sessão

A abertura executa apenas na homepage e uma vez por sessão de navegador.

```text
sessionStorage key: wflyer.brand-intro.completed.v1
value: "1"
```

A chave só é escrita quando:

- a timeline conclui;
- o usuário pula;
- ocorre fallback por erro;
- `prefers-reduced-motion` evita a reprodução.

Navegação interna, retorno ao topo e mudança de tema não repetem a abertura.

---

## 7. Resolução de tema

O tema deve ser conhecido antes de mostrar o primeiro frame.

Ordem:

1. preferência explicitamente salva pelo usuário;
2. `prefers-color-scheme`;
3. claro como fallback.

A abertura usa a mesma geometria em ambos os temas. Mudam apenas tokens de cor.

### 7.1 Tema claro

```text
fundo: bege institucional
logo final: variante escura oficial
underscore inicial: violeta contido
contornos temporários: marrom moderno e bronze moderado
brilho: baixa opacidade, sem dourado metálico
```

### 7.2 Tema escuro

```text
fundo: azul-marinho profundo
logo final: variante clara oficial
underscore inicial: violeta e cobalto
contornos temporários: violeta, índigo e ciano limitado
brilho: localizado, sem iluminar a viewport inteira
```

### 7.3 Troca durante a abertura

O seletor de tema não aparece enquanto o overlay está ativo. Se a preferência do sistema mudar durante a reprodução, a nova preferência é aplicada após o handoff.

---

## 8. Duração e relógio

### 8.1 Duração consolidada

| Bloco | Início | Fim | Duração |
|---|---:|---:|---:|
| apresentação da marca | 0,000 s | 4,050 s | 4,050 s |
| handoff do overlay | 4,050 s | 4,850 s | 0,800 s |
| abertura da hero | 4,250 s | 5,600 s | 1,350 s |
| sequência total até interface pronta | 0,000 s | 5,600 s | 5,600 s |

A hero começa antes do overlay desaparecer totalmente. Essa sobreposição é obrigatória para evitar a percepção de duas animações independentes.

### 8.2 Frames de referência

Base: `60 fps`.

```text
frame = round(tempo_em_segundos × 60)
```

O arquivo `06-animacao-entrada-marca.frames.csv` contém uma amostra para todos os frames entre `0` e `336`, inclusive.

---

## 9. Timeline detalhada

## Fase A — Origem estável

**Tempo:** `0,000–0,300 s`
**Frames:** `0–17`

### Frame 0

- fundo do tema já está aplicado;
- underscore oficial já está visível;
- nenhum fade de fundo;
- nenhum símbolo, palavra ou elemento da homepage aparece;
- glow em aproximadamente 25% da intensidade máxima.

### Frames 1–8

- o glow interno cresce suavemente;
- o underscore não muda de posição;
- a escala horizontal pode variar no máximo de `0,96` para `1,00`;
- não há partículas.

### Frames 9–17

- o glow retorna para uma intensidade residual;
- uma microtensão visual prepara a formação do símbolo;
- o underscore continua geometricamente idêntico ao asset oficial.

**Easing dominante:** `power2.out`.

---

## Fase B — Semente do símbolo

**Tempo:** `0,300–0,700 s`
**Frames:** `18–41`

### Frames 18–23

- os três módulos oficiais são habilitados com escala inicial reduzida;
- a composição nasce próxima ao centro do underscore;
- opacidade dos módulos sobe de `0` para aproximadamente `0,35`;
- o anchor aparece primeiro.

### Frames 24–31

- upper wing e lower wing entram com atraso curto;
- os módulos ainda permanecem separados;
- rotação individual máxima: `±2°`;
- nenhuma forma é desenhada fora da geometria oficial.

### Frames 32–41

- o símbolo se torna reconhecível em aproximadamente 42% da escala final;
- opacidade chega a `1`;
- o underscore deixa de atuar como elemento isolado e passa a ser entendido como origem da montagem.

**Easing dominante:** `power3.out`.

---

## Fase C — Expansão geométrica e ecos

**Tempo:** `0,700–1,500 s`
**Frames:** `42–89`

Esta fase reproduz a característica mais importante do vídeo: o símbolo cresce enquanto contornos externos acompanham sua expansão.

### Frames 42–53

- o símbolo cresce de aproximadamente `0,42` para `0,68`;
- o primeiro eco de contorno aparece;
- o eco é uma duplicata autorizada dos módulos oficiais, sem preenchimento;
- deslocamento visual máximo do primeiro eco: `8 px` em 1920 × 1080.

### Frames 54–65

- o símbolo passa de `0,68` para `0,88`;
- o segundo eco aparece com opacidade inferior;
- deslocamento máximo do segundo eco: `14 px` em 1920 × 1080;
- os ecos não devem formar caixas, setas ou linhas aleatórias.

### Frames 66–77

- o símbolo ultrapassa discretamente a escala final;
- escala máxima autorizada: `1,10`;
- os módulos aproximam-se de suas coordenadas oficiais;
- os ecos atingem sua maior legibilidade.

### Frames 78–89

- o crescimento desacelera;
- os ecos começam a se aproximar do símbolo;
- nenhuma oscilação, bounce ou elasticidade.

**Easing dominante:** `expo.out` na expansão; `power2.inOut` nos ecos.

---

## Fase D — Lock e absorção dos contornos

**Tempo:** `1,500–2,100 s`
**Frames:** `90–125`

### Frames 90–101

- escala reduz de `1,10` para aproximadamente `1,045`;
- offsets individuais diminuem;
- os contornos convergem para os paths principais.

### Frames 102–113

- upper wing e lower wing chegam às coordenadas finais;
- rotações chegam a `0°`;
- opacidade dos ecos cai progressivamente.

### Frames 114–125

- escala chega a `1,00`;
- todos os contornos desaparecem;
- símbolo fica sólido, limpo e imóvel;
- nenhum flash, impacto ou bloom amplo.

O lock pode receber um único acento de contraste com duração máxima de `80 ms`, sem alterar o tamanho da geometria.

**Easing dominante:** `power3.out`.

---

## Fase E — Pausa do símbolo

**Tempo:** `2,100–2,500 s`
**Frames:** `126–149`

- símbolo permanece imóvel;
- a pausa permite reconhecimento antes do wordmark;
- nenhum pulso contínuo;
- o fundo não muda;
- o wordmark permanece renderizado em sua posição final, mas totalmente recortado pela máscara.

A pausa é intencional e não deve ser removida para “acelerar” a abertura.

---

## Fase F — Revelação do wordmark

**Tempo:** `2,500–3,300 s`
**Frames:** `150–197`

### Regra geométrica

O lockup final deve estar centralizado como conjunto. Para isso:

- o símbolo começa a fase ainda centralizado isoladamente;
- o símbolo move-se até sua coordenada dentro do lockup horizontal;
- o wordmark não desliza e não é digitado;
- a máscara revela o wordmark da esquerda para a direita;
- a posição final de cada letra é sempre a do SVG oficial.

### Frames 150–161

- inicia o deslocamento horizontal do símbolo para a posição do lockup;
- a faixa de transferência nasce junto ao símbolo;
- revelação do wordmark ainda abaixo de 15%.

### Frames 162–177

- máscara atravessa `W`, underscore e início de `Flyer`;
- símbolo alcança a maior parte de seu deslocamento;
- a faixa não pode parecer um feixe de laser.

### Frames 178–189

- máscara revela as letras finais;
- o underscore oficial permanece com proporção fixa;
- nenhuma letra é criada por texto HTML ou fonte instalada.

### Frames 190–197

- wordmark chega a 100%;
- faixa de transferência é absorvida;
- lockup fica perfeitamente centralizado.

**Easing dominante:** `power2.inOut` para a posição do símbolo e `none` ou `power1.inOut` para a máscara.

---

## Fase G — Hold do lockup oficial

**Tempo:** `3,300–4,050 s`
**Frames:** `198–242`

- logo horizontal completa permanece imóvel;
- nenhuma parte continua revelando;
- nenhuma sombra ou brilho se move;
- o frame deve corresponder ao lockup oficial no tema atual;
- a pausa mínima de leitura não pode ser menor que `600 ms`.

O usuário pode pular durante o hold; o resultado visual deve ser idêntico ao início do handoff.

---

## Fase H — Handoff da marca para o header

**Tempo:** `4,050–4,850 s`
**Frames:** `243–290`

O handoff não é um fade genérico. A marca deve se transformar em parte da interface.

### Preparação obrigatória

Antes de iniciar:

- o target real do símbolo no header existe no DOM;
- seu bounding rectangle foi medido;
- o fundo da homepage é idêntico ao overlay;
- o target do header está invisível, mas ocupa seu layout final.

### Frames 243–254

- wordmark começa a perder opacidade;
- símbolo permanece visualmente estável;
- primeira linha dos compassos do header começa a nascer do centro, atrás do overlay.

### Frames 255–266

- wordmark desaparece completamente;
- o símbolo inicia transformação FLIP para o target do header;
- o target real do header ainda permanece invisível;
- as duas partituras da Home começam a ser desenhadas em baixa opacidade.

### Frames 267–278

- símbolo reduz escala e percorre a trajetória até o header;
- não há arco exagerado; a trajetória é quase retilínea com leve elevação;
- compassos da aplicação crescem para a esquerda;
- compassos da empresa crescem para a direita.

### Frames 279–290

- símbolo animado coincide pixel a pixel com o target do header;
- target real é ativado;
- clone/elemento animado deixa de existir;
- overlay perde opacidade de `1` para `0`;
- overlay recebe `pointer-events: none` antes de ser desmontado.

**Easing dominante:** `power3.inOut`.

### Regra FLIP

Não usar coordenadas fixas para o destino. O deslocamento deve ser calculado entre:

```text
introSymbolRect → headerSymbolTargetRect
```

Isso preserva alinhamento em diferentes viewports.

---

## Fase I — Abertura da hero

**Tempo:** `4,250–5,600 s`
**Frames:** `255–336`
**Sobreposição:** começa durante o handoff.

### Frames 255–275

- linhas principais do header são desenhadas do centro para as extremidades;
- pauta ondulada da hero começa a aparecer;
- nenhuma copy ainda compete com o símbolo em movimento.

### Frames 276–300

- notas indicadoras e barras dos compassos entram;
- clave de sol narrativa da Home aparece no centro;
- escala da clave: `0,94 → 1,00`;
- rotação máxima: `1°`.

### Frames 301–324

- conteúdo da aplicação entra da esquerda;
- conteúdo institucional entra da direita;
- deslocamento máximo: `20 px`;
- botões aparecem após títulos e parágrafos.

### Frames 325–336

- indicador de scroll aparece;
- header fica interativo;
- foco, hover e âncoras são habilitados;
- timeline é concluída e limpa;
- o controle de skip não existe mais.

A partir do frame 336, o site entra no estado `interactive-ready` e a narrativa orientada por scroll pode ser criada.

---

## 10. Contrato de transformações

### 10.1 Propriedades autorizadas

```text
transform: translate, scale, rotate
opacity
stroke-dashoffset
clipPath/mask geometry já existente no SVG
CSS color/currentColor
```

### 10.2 Propriedades proibidas durante a timeline

```text
width/height de layout
left/top em animação contínua
filter: blur em grandes áreas
morphing de paths
alteração de viewBox
box-shadow animada continuamente
randomização
spring/bounce
```

### 10.3 Origens

Todos os módulos móveis devem usar:

```css
transform-box: fill-box;
transform-origin: center;
```

O grupo do lockup usa origem central do conjunto, não origem individual das letras.

---

## 11. SVG e IDs esperados

A etapa seguinte deve produzir ou validar um único SVG master de introdução. A arquitetura prevista é:

```text
wf-intro-logo
├── wf-origin-underscore
├── wf-symbol-stage
│   ├── wf-symbol-anchor
│   ├── wf-symbol-upper-wing
│   ├── wf-symbol-lower-wing
│   ├── wf-echo-1
│   └── wf-echo-2
├── wf-wordmark-stage
│   ├── wf-wordmark
│   ├── wf-wordmark-underscore
│   ├── wf-wordmark-clip
│   └── wf-ink-sweep
└── wf-accessibility-title
```

Os nomes finais serão aprovados na fase de SVG. O Codex não deve presumir que um ID ausente pode ser criado por código.

### 11.1 Ecos

Os ecos devem usar a mesma geometria dos módulos oficiais. Eles podem ser:

- `<use>` referenciando grupos oficiais; ou
- duplicatas explicitamente aprovadas dentro do mesmo SVG.

Não criar paths aproximados.

### 11.2 Wordmark

O wordmark deve estar convertido em paths oficiais. Não usar `<text>`, fontes externas ou CSS para reconstruí-lo.

---

## 12. Controles e acessibilidade

### 12.1 Pular introdução

- botão HTML, não SVG;
- rótulo: `Pular introdução`;
- visível por teclado desde o início;
- tecla `Escape` executa a mesma ação;
- área mínima: `44 × 44 px`;
- pular não remove a homepage nem provoca flash.

### 12.2 Leitor de tela

A animação é decorativa. A marca oficial deve possuir nome acessível somente uma vez.

- não anunciar cada módulo;
- não usar live region para progresso frame a frame;
- live region pode anunciar apenas `Conteúdo carregado` após conclusão, caso testes demonstrem necessidade;
- o foco não deve ser movido automaticamente para a hero.

### 12.3 Bloqueio de interação

Enquanto o overlay estiver ativo:

- elementos da homepage atrás não recebem clique;
- o usuário pode tabular apenas até o botão de pular, quando presente;
- scroll da página pode ficar temporariamente bloqueado sem deslocar a posição;
- ao concluir, o bloqueio é removido antes do overlay ser desmontado.

---

## 13. Movimento reduzido

Com `prefers-reduced-motion: reduce` ou preferência interna equivalente:

1. não executar montagem modular, ecos ou transferência;
2. mostrar o lockup oficial por `150–200 ms` no máximo;
3. executar handoff simples para o header ou mostrar diretamente a homepage;
4. marcar a sessão como concluída;
5. manter toda a informação disponível.

A duração total nesse modo deve ficar abaixo de `400 ms`.

---

## 14. Responsividade

### Desktop, largura ≥ 1024 px

- sequência completa;
- logo central com tamanho definido por `clamp()`;
- handoff para símbolo central do header;
- hero completa.

### Tablet, 768–1023 px

- mesma ordem;
- ecos com deslocamento reduzido em aproximadamente 25%;
- logo menor;
- handoff calculado pelo target real.

### Mobile, largura < 768 px

- símbolo e wordmark podem usar lockup compacto aprovado;
- quantidade de ecos permanece dois, mas com offsets menores;
- handoff direciona para o símbolo do header mobile;
- hero entra em fluxo vertical;
- nenhum deslocamento depende de coordenadas desktop.

Mudança de orientação durante a reprodução deve concluir a abertura imediatamente por fallback seguro ou reconstruir somente antes da fase H. Não manter transformações calculadas para uma viewport antiga.

---

## 15. Performance

### 15.1 Metas

- evitar long task superior a `50 ms` durante a abertura;
- nenhuma solicitação de rede após o início da timeline;
- SVG crítico disponível antes de `playing`;
- animações contínuas somente em `transform` e `opacity`;
- timeline criada uma única vez;
- nenhum RAF paralelo ao ticker do GSAP;
- cleanup completo após conclusão.

### 15.2 Limites de complexidade

- máximo de 3 módulos principais;
- máximo de 2 grupos de eco;
- máximo de 1 sweep do wordmark;
- nenhuma partícula individual;
- nenhum filtro de blur animado sobre toda a viewport;
- nenhum áudio automático.

### 15.3 Dispositivos fracos

Se a medição inicial ou preferência do usuário indicar limitação:

- remover ecos;
- reduzir a duração para aproximadamente `3,2 s`;
- manter símbolo, wordmark e handoff;
- nunca substituir por vídeo.

---

## 16. Implementação GSAP

### 16.1 Timelines separadas

```text
createBrandFormationTimeline()  0,000–4,050 s
createBrandHandoffTimeline()    4,050–4,850 s
createHeroOpeningTimeline()     4,250–5,600 s
```

Uma master timeline posiciona as três por labels. Separar funções facilita testes e não significa usar motores diferentes.

### 16.2 Labels obrigatórios

```text
intro:start          0.000
intro:seed           0.300
intro:expand         0.700
intro:lock           1.500
intro:breath         2.100
intro:wordmark       2.500
intro:hold           3.300
intro:handoff        4.050
hero:start           4.250
intro:overlay-off    4.850
hero:ready           5.600
```

### 16.3 Eases autorizados

```text
none
power1.inOut
power2.out
power2.inOut
power3.out
power3.inOut
expo.out
```

Não usar `back`, `elastic`, `bounce`, `rough` ou curvas aleatórias.

### 16.4 Limpeza

Ao concluir ou pular:

- `timeline.kill()` quando aplicável;
- remover listeners de `Escape`, resize e visibility;
- remover estilos temporários criados pelo GSAP;
- liberar scroll;
- remover overlay do DOM;
- garantir que header e hero estejam no estado final.

---

## 17. Fallbacks

### SVG ausente ou inválido

- não gerar substituto;
- registrar erro técnico sem conteúdo sensível;
- mostrar homepage imediatamente;
- marcar intro como concluída na sessão.

### Erro durante a timeline

- aplicar estado final da homepage;
- esconder overlay em até `150 ms`;
- não tentar reiniciar automaticamente.

### Aba oculta

- pausar timeline quando `document.hidden`;
- retomar sem salto se o tempo ausente for curto;
- se houver mudança de viewport ou tema incompatível, concluir por fallback.

### JavaScript indisponível

A homepage deve continuar legível. O overlay não pode depender de CSS que o mantenha visível sem hidratação.

---

## 18. Regra de não geração de assets

Até aprovação explícita da etapa de SVG:

> É proibido ao Codex, a outro agente ou a qualquer implementação criar, redesenhar, completar, simplificar, vetorizar ou substituir assets visuais da animação.

Se os assets aprovados não existirem, a tarefa deve permanecer bloqueada com o estado:

```text
BLOCKED_ASSET_APPROVAL
```

Não são soluções aceitáveis:

- criar um SVG “temporário”;
- usar divs inclinadas para imitar a logo;
- reconstruir o wordmark com fonte;
- extrair formas do vídeo;
- usar os PNGs finais como elementos móveis;
- criar ecos com contornos aproximados.

---

## 19. Critérios de aceite da documentação

A documentação estará aprovada quando o usuário confirmar:

- duração e ritmo das fases;
- permanência do hold final;
- uso dos contornos temporários;
- movimento do símbolo para o header;
- momento em que a clave e a pauta aparecem;
- comportamento claro e escuro;
- estratégia mobile e reduced motion;
- proibição de geração automática de assets;
- lista de SVGs e IDs a produzir na próxima etapa.

Somente após essa aprovação deve começar a confecção dos SVGs.

---

## 20. Entregáveis associados

```text
06-animacao-entrada-marca.md
06-animacao-entrada-marca.timeline.yaml
06-animacao-entrada-marca.frames.csv
reference-video-manifest.json
../05-implementacao/10-contrato-assets-animacao.md
../07-qa/06-qa-animacao-entrada.md
../00-governanca/06-adr-animacao-entrada-programatica.md
```
