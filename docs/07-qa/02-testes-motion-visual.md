# Testes de motion e regressão visual

## Casos de direção

- descer move a trilha para a esquerda;
- subir move para a direita;
- header acompanha capítulo;
- clicar no header alcança destino correto;
- resize não duplica timeline;
- voltar no histórico preserva navegação coerente.

## Golden screenshots

- desktop claro/escuro;
- mobile claro/escuro;
- header default e ativo;
- menu mobile;
- contato em erro/sucesso;
- reduced motion.

## Tolerância

- definir limiar por página;
- alterações deliberadas exigem atualização e revisão da referência;
- não aceitar baseline novo apenas para esconder regressão.

## Testes manuais

- scroll rápido;
- trackpad;
- roda de mouse;
- teclado PageUp/PageDown;
- resize contínuo;
- zoom 200%;
- dispositivos com GPU integrada.


## Abertura da marca

- capturar frames 0, 24, 54, 90, 120, 150, 173, 192, 216, 236, 252, 276 e 288;
- congelar a timeline de maneira determinística;
- comparar o frame de lock com o SVG oficial;
- validar o bounding box do handoff para o header;
- testar skip, Escape, sessão, falha, aba oculta e movimento reduzido;
- consultar `06-qa-animacao-entrada.md`.
