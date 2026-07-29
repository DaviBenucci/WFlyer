# QA da animação de entrada da marca

**Identificador:** `QA-M-010`  
**Dependência:** `docs/03-motion/06-animacao-entrada-marca.md`

## 1. Estratégia

A timeline deve ser testável de forma determinística. Em ambiente de teste, ela deve aceitar pausa e `seek()` por tempo ou frame de referência.

Não validar a animação aguardando temporizadores reais em todos os testes. O modo de teste deve construir a timeline pausada e posicioná-la diretamente nos checkpoints.

## 2. Checkpoints obrigatórios

| Frame | Tempo | Estado esperado |
|---:|---:|---|
| 0 | 0,000 s | underscore isolado, fundo correto |
| 18 | 0,300 s | início dos módulos |
| 42 | 0,700 s | início da expansão |
| 66 | 1,100 s | ecos visíveis e símbolo crescendo |
| 90 | 1,500 s | início do lock |
| 126 | 2,100 s | símbolo final sem ecos |
| 150 | 2,500 s | início do wordmark |
| 180 | 3,000 s | wordmark parcialmente revelado |
| 198 | 3,300 s | lockup completo |
| 243 | 4,050 s | início do handoff |
| 267 | 4,450 s | símbolo em trânsito ao header |
| 291 | 4,850 s | overlay removido |
| 312 | 5,200 s | hero quase completa |
| 336 | 5,600 s | interface interativa |

## 3. Testes unitários

- resolução de tema;
- leitura/escrita da chave de sessão;
- seleção de reduced motion;
- máquina de estados aceita somente transições válidas;
- skip produz estado final;
- erro produz estado final;
- frame para tempo e tempo para frame;
- validação dos IDs do SVG;
- cálculo FLIP com retângulos simulados.

## 4. Testes de componente

No Storybook:

- claro e escuro;
- desktop, tablet e mobile;
- frame 0;
- frame 66;
- frame 126;
- frame 180;
- frame 198;
- handoff intermediário;
- reduced motion;
- asset ausente;
- botão de pular com foco.

## 5. Testes E2E

- abertura executa apenas na primeira visita da sessão;
- recarregar não repete;
- nova sessão repete;
- `Escape` pula;
- botão pula;
- overlay não permanece após erro;
- homepage não recebe clique antes do handoff;
- homepage recebe clique após o handoff;
- scroll é restaurado;
- tema correto é usado no primeiro paint;
- mudança de rota desmonta listeners;
- resize não deixa clone visual;
- histórico não repete a intro.

## 6. Regressão visual

Capturar screenshots determinísticos nos checkpoints. Não criar baseline usando o vídeo como imagem final. O baseline deve ser gerado somente após aprovação dos SVGs oficiais.

Tolerância maior pode ser aplicada a antialiasing de paths, mas não a:

- geometria;
- posição;
- proporção;
- spelling do wordmark;
- underscore;
- alinhamento final;
- cores do tema.

## 7. Performance

Medir:

- long tasks;
- frame drops;
- uso de memória antes e depois;
- quantidade de timelines e listeners após conclusão;
- custo da medição FLIP;
- tempo de carregamento do SVG.

Critérios iniciais:

- nenhuma long task recorrente acima de 50 ms;
- nenhum listener remanescente após conclusão;
- nenhuma timeline ativa após hero pronta;
- nenhum request tardio de asset durante `playing`;
- sem layout shift visível no handoff.

## 8. Acessibilidade

- botão com nome acessível;
- área mínima 44 × 44 px;
- foco visível;
- `Escape` funcional;
- reduced motion abaixo de 400 ms;
- sem anúncio de cada módulo;
- sem captura permanente de foco;
- conteúdo disponível sem JS;
- contraste do botão nos dois temas.

## 9. Critérios de reprovação

A animação é reprovada se:

- o símbolo ou wordmark forem redesenhados;
- houver flash entre overlay e homepage;
- o fundo mudar no corte;
- ecos parecerem linhas aleatórias;
- o wordmark for digitado letra por letra;
- o símbolo não coincidir com o target do header;
- a abertura repetir sem nova sessão;
- o usuário ficar preso no overlay;
- agentes criarem assets não aprovados;
- reduced motion executar a sequência completa.

## 10. Evidências

A fase só pode ser marcada como concluída com:

- relatório dos testes;
- screenshots dos checkpoints;
- gravação real em desktop e mobile;
- medição de performance;
- checksums dos SVGs aprovados;
- aprovação visual do usuário.
