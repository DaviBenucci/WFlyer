# Mapa de IDs SVG — W_Flyer

## Estrutura principal

| ID | Função | Uso sugerido |
|---|---|---|
| `wf-logo` | Grupo consolidado da marca | Escala, opacidade e entrada geral |
| `wf-symbol` | Grupo do símbolo | Entrada do símbolo, pulsação e transição |
| `wf-symbol-anchor` | Estrutura principal esquerda | Elemento de ancoragem; deve iniciar a animação |
| `wf-symbol-upper-wing` | Módulo superior direito | Deslocamento lateral e rotação curta |
| `wf-symbol-lower-wing` | Módulo inferior direito | Reconstrução, encaixe e efeito de tinta |
| `wf-wordmark` | Grupo completo do nome | Entrada posterior ao símbolo |
| `wf-wordmark-w` | Letra W | Entrada do wordmark |
| `wf-wordmark-underscore` | Underscore | Eixo de transferência e cursor visual |
| `wf-wordmark-f` | Letra F | Ponto de chegada da transferência |
| `wf-wordmark-l` | Letra l | Revelação sequencial |
| `wf-wordmark-y` | Letra y | Revelação sequencial |
| `wf-wordmark-e` | Letra e | Revelação sequencial |
| `wf-wordmark-r` | Letra r | Encerramento da revelação |

## IDs auxiliares da animação

| ID | Função |
|---|---|
| `wf-clip-symbol` | Recorte de revelação do símbolo |
| `wf-clip-symbol-rect` | Retângulo animável do símbolo |
| `wf-clip-wordmark` | Recorte de revelação do wordmark |
| `wf-clip-wordmark-rect` | Retângulo animável do wordmark |
| `wf-ink-mask` | Máscara da animação Ink Transfer |
| `wf-ink-sweep` | Faixa que percorre o wordmark |

## Regras de estabilidade

1. Não renomear os IDs sem versionamento do pacote.
2. Não aplicar transformações destrutivas aos paths no código da aplicação.
3. Animar preferencialmente os grupos; usar os paths somente em sequências detalhadas.
4. Manter `transform-box: fill-box` e `transform-origin: center` nos módulos móveis.
5. Usar `currentColor` nas versões monocromáticas para integração com CSS.
