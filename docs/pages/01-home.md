# Página Home

## Rota

```text
/ 
```

## Objetivo

Apresentar o WFlyer, comunicar a proposta de valor e levar o usuário para iniciar uma transposição sem exigir login.

## Escopo MVP


A Home deve ter três blocos principais:

1. **Hero** com chamada principal, descrição curta e CTA.
2. **Como funciona** em quatro passos: Upload -> Instrumentos -> Transposição -> Download.
3. **Conversões populares** com exemplos musicais claros.

Layout desktop:

```text
AppShell com sidebar
Hero amplo à direita
Card visual antes/depois
Bloco de passos
Conversões populares
```

Layout mobile:

```text
Topo com hero compacto
CTA principal visível sem rolagem excessiva
Cards empilhados
Bottom navigation fixa
```


## Componentes principais


- `AppShell`
- `PageContainer`
- `HeroSection`
- `PrimaryCTAButton`
- `SecondaryCTAButton`
- `HowItWorksSteps`
- `PopularConversionsGrid`
- `FloatingNotes`
- `ScoreBeforeAfterPreview`


## Dados necessários


Dados estáticos no MVP:

```text
título
subtítulo
lista de passos
conversões populares
links de CTA
```

Conversões populares sugeridas:

```text
Piano -> Trompete Bb
Piano -> Sax Alto Eb
Clarinete Bb -> Piano
Trompa F -> Piano
```


## Interações


- CTA `Começar transposição` navega para `/transpor`.
- CTA `Ver como funciona` navega para `/como-funciona`.
- Cards de conversão popular podem preencher origem/destino no wizard futuramente.
- Animações musicais devem ser sutis e respeitar `prefers-reduced-motion`.


## Validações e regras de negócio


- Não exigir login.
- Não prometer 100% de precisão.
- Usar linguagem de cautela: "Confira a prévia antes de usar em ensaio ou apresentação".
- Não exibir métricas internas de confiança.


## Estados de tela


- `default`: conteúdo carregado.
- `reduced-motion`: animações desativadas ou reduzidas.
- `offline`: Home ainda pode abrir se PWA estiver instalada; CTA de transposição deve avisar que processamento requer conexão.


## Segurança e privacidade


- Home não deve expor dados do usuário.
- Links devem apontar apenas para rotas internas conhecidas.
- Não carregar scripts externos de tracking sem política explícita.


## Acessibilidade


- H1 único.
- CTAs com nomes acessíveis.
- Contraste adequado na paleta roxo/azul.
- Animações decorativas com `aria-hidden="true"`.
- Ordem de foco lógica: CTA principal antes do secundário.


## Critérios de aceite


- Usuário consegue iniciar transposição em até 1 clique.
- Em mobile, CTA principal aparece antes da dobra ou logo após o texto principal.
- Com `prefers-reduced-motion`, as notas flutuantes não distraem.
- Lighthouse/accessibility sem violações críticas.



## Futuro

Com login, a Home pode virar landing pública e `/app` passa a ser dashboard autenticado.
