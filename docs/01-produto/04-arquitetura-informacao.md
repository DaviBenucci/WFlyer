# Arquitetura da informação

## Rotas principais

```text
/
/aplicacao-wflyer
/aplicacao-wflyer/como-funciona
/aplicacao-wflyer/beneficios
/sobre
/servicos
/processo
/portfolio
/contato
```

## Rotas de detalhe de serviço

```text
/servicos/criacao-de-sites
/servicos/criacao-de-aplicacoes
/servicos/integracoes
/servicos/solucoes-sob-medida
```

Essas rotas são ramificações locais de `/servicos`. Elas reutilizam a linguagem musical, mas não alteram a ordem da partitura institucional.

## Rotas legais

```text
/politica-de-privacidade
/politica-de-cookies
/termos-de-uso
/acessibilidade
```

## Grafo da partitura

```text
BARRA FINAL ← acesso ao app ← Benefícios ← Como funciona ← Aplicação ← HOME
                                                                    HOME → Empresa → Serviços → Processo → Portfólio → Contato → BARRA FINAL
```

### Coordenadas narrativas

- Home: `0`;
- Aplicação: `-1`;
- Como funciona: `-2`;
- Benefícios: `-3`, terminal;
- Empresa: `+1`;
- Serviços: `+2`;
- Processo: `+3`;
- Portfólio: `+4`;
- Contato: `+5`, terminal.

As coordenadas orientam transições e continuidade. Elas não devem aparecer como números para o usuário.

## Header desktop

```text
[ Aplicação | Como funciona | Benefícios | Acessar app ]
                   [ símbolo oficial W_Flyer ]
[ Empresa | Serviços | Portfólio | Contato ]
```

A composição pode reduzir espaçamentos em viewports menores, mas os dois grupos e o símbolo central devem permanecer semanticamente distintos. Cada item é visualmente um compasso e semanticamente um link real. `Processo` é um capítulo intermediário da jornada institucional, acessado por navegação anterior/próximo e CTAs; ele não adiciona um quinto rótulo ao grupo direito aprovado.

## Navegação local de capítulo

Cada página principal inclui:

- link anterior;
- link seguinte, quando houver;
- indicação do ramo;
- estado ativo no header;
- pauta de entrada e saída;
- barra final quando `terminal: true`.

## Rodapé

- lockup ou símbolo + nome conforme espaço;
- resumo institucional curto;
- links para aplicação, empresa, serviços, portfólio e contato;
- links legais;
- redes sociais somente quando URLs oficiais estiverem configuradas;
- cadência musical discreta;
- barra dupla destacada apenas nos terminais de ramo.
