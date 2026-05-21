# Página Como funciona

## Rota

```text
/como-funciona
```

## Objetivo

Explicar o produto de maneira didática, reduzindo dúvidas sobre transposição, PDFs e limitações.

## Escopo MVP


Blocos sugeridos:

1. O que o WFlyer faz.
2. Como funciona o fluxo.
3. O que é instrumento transpositor.
4. Exemplo Piano -> Trompete Bb.
5. Quais arquivos funcionam melhor.
6. Limitações e revisão humana.
7. Privacidade e retenção.


## Componentes principais


- `ExplainerHero`
- `ProcessStepList`
- `TranspositionExampleCard`
- `RecommendedPdfTips`
- `LimitationsNotice`
- `PrivacyRetentionNotice`
- `CTAStartTransposition`


## Dados necessários


Dados estáticos e exemplos musicais:

```text
Piano -> Trompete Bb: +2 semitons
C maior -> D maior
PDFs exportados de editores musicais tendem a ter melhor resultado
Arquivos expiram em 15 dias
```


## Interações


- CTA para `/transpor`.
- Links para `/instrumentos`.
- Cards explicativos podem expandir/recolher no mobile.
- Exemplos musicais devem usar linguagem simples.


## Validações e regras de negócio


- Não prometer resultado perfeito em PDFs escaneados complexos.
- Explicar que o usuário deve conferir a prévia.
- Não revelar detalhes internos de confiança.


## Estados de tela


Estados:

```text
default
reduced-motion
offline
```

Como é majoritariamente estática, deve ser cacheável pela PWA.


## Segurança e privacidade


- Não coletar dados nesta página.
- Evitar scripts externos desnecessários.
- Política de retenção deve estar clara.


## Acessibilidade


- Conteúdo sem depender apenas de diagramas.
- Exemplos com texto claro.
- Boa hierarquia de H2/H3.
- Contraste suficiente nos cards.


## Critérios de aceite


- Usuário entende o fluxo em até 1 minuto.
- Página explica que arquivos expiram após 15 dias.
- Página orienta revisar resultado antes de uso musical real.
