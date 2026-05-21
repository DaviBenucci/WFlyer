# Página Instrumentos suportados

## Rota

```text
/instrumentos
```

## Objetivo

Listar instrumentos disponíveis, explicar transposição e permitir busca/filtro por família.

## Escopo MVP


Desktop:

```text
Título
Busca
Filtros por família
Tabela/lista com instrumentos
Exemplo de leitura/sonoridade
```

Mobile:

```text
Busca no topo
Chips de família horizontal
Cards de instrumentos
Detalhe expandível
```


## Componentes principais


- `InstrumentSearch`
- `InstrumentFamilyFilter`
- `InstrumentTable`
- `InstrumentCard`
- `InstrumentDetailsDrawer`
- `FamilySelectionEffect`


## Dados necessários


Modelo de instrumento:

```ts
type Instrument = {
  id: string
  name: string
  family: 'teclas' | 'metais' | 'madeiras' | 'cordas' | 'voz' | 'percussao_melodica'
  writtenToConcert: number
  aliases: string[]
  description: string
  example?: string
  supported: boolean
}
```

Exemplos iniciais:

```text
Piano: 0
Trompete Bb: -2
Clarinete Bb: -2
Sax Alto Eb: -9
Trompa F: -7
Flauta: 0
Violino: 0
```


## Interações


- Busca por nome e alias.
- Filtro por família.
- Clique em instrumento abre detalhes.
- Selecionar família dispara microinteração discreta.
- Futuramente, card pode iniciar wizard com instrumento pré-selecionado.


## Validações e regras de negócio


- Não exibir instrumentos não suportados como disponíveis.
- Mostrar aviso quando suporte for experimental.
- O `written_to_concert` é dado técnico; pode aparecer como explicação, mas com linguagem simples.


## Estados de tela


Estados:

```text
loading
loaded
empty_search
api_error
offline_cached
```


## Segurança e privacidade


- Dados de instrumentos devem vir de fonte confiável no backend ou seed controlado.
- Não permitir que parâmetros de busca gerem XSS.
- Sanitizar qualquer conteúdo administrável.


## Acessibilidade


- Busca com label claro.
- Filtros com estado selecionado textual.
- Tabela deve ser navegável por teclado.
- Cards devem manter contraste.


## Critérios de aceite


- Busca encontra instrumentos por alias.
- Filtros funcionam em desktop e mobile.
- Dados batem com contratos usados no cálculo de transposição.
- Estado sem resultado é claro.
