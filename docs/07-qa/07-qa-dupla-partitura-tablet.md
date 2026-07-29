# QA da dupla partitura e do tablet

**Status:** NORMATIVO

## 1. Validação do manifesto

Testes unitários devem garantir:

- IDs e rotas únicos;
- Home em coordenada zero;
- coordenadas da aplicação negativas e sequenciais;
- coordenadas institucionais positivas e sequenciais;
- `previous` e `next` recíprocos;
- somente Benefícios e Contato com `terminal: true`;
- terminais com `final_barline: true`;
- páginas auxiliares com `parent_chapter` válido;
- nenhum ciclo na linha principal.

## 2. Jornadas E2E

### Aplicação

1. abrir Home;
2. focar CTA da aplicação;
3. confirmar ênfase do ramo;
4. entrar em Aplicação;
5. usar o tablet;
6. seguir para Como funciona;
7. seguir para Benefícios;
8. confirmar barra final;
9. abrir app externo sem interceptação indevida.

### Institucional

1. abrir Home;
2. entrar em Empresa;
3. avançar por Serviços, Processo e Portfólio;
4. chegar a Contato;
5. validar formulário e estados;
6. confirmar barra final;
7. voltar com histórico e direção inversa.

## 3. Deep links

Abrir diretamente cada rota e verificar:

- conteúdo imediatamente disponível;
- header ativo correto;
- pauta local no estado final;
- anterior/próximo correto;
- ausência de animação que simule todos os capítulos anteriores;
- tema aplicado antes da pintura.

## 4. Saltos e troca de ramo

- navegar de Aplicação diretamente para Benefícios e confirmar `compressed-score-jump`;
- confirmar que Como funciona não foi montada nem anunciada durante o salto;
- navegar de Benefícios para Empresa e confirmar `home-pivot`;
- confirmar que não existe segmento conectando diretamente a pauta esquerda à direita;
- confirmar que a Home não foi adicionada ao histórico como navegação intermediária;
- validar duração máxima de 900 ms em saltos e troca de ramo;
- validar que reduced motion usa troca direta/crossfade em todos esses casos.

## 5. Testes de falha

- remover GSAP: navegação convencional funciona;
- provocar erro na camada de conexão: nova rota aparece;
- exceder timeout: overlay é removido;
- clicar rapidamente em dois destinos: não deixar camada órfã;
- ocultar aba durante transição: estado final consistente ao retornar;
- desmontar tablet: listeners e observers removidos.

## 6. Tablet — rede e privacidade

- interceptar `fetch`, XHR e WebSocket durante a demonstração;
- falhar o teste se houver chamada não prevista;
- confirmar ausência de upload e `FileReader`;
- confirmar que dados escolhidos não são persistidos;
- confirmar que logs não incluem escolhas do usuário;
- confirmar que reset restaura estado inicial.

## 7. Tablet — acessibilidade

- todos os campos têm label;
- ordem de tabulação lógica;
- botão de ação informa estado ocupado;
- resultado anunciado uma vez;
- foco permanece previsível após resultado;
- contraste dos estados dentro da tela atende AA;
- tilt não interfere com foco visível;
- reduced motion mantém toda funcionalidade.

## 8. Evidências

Cada execução de aceite deve armazenar:

- relatório do manifesto;
- vídeos curtos das duas jornadas em ambiente de teste;
- screenshots dos pontos de continuidade;
- screenshots das barras finais;
- estados do tablet;
- resultado axe;
- perfil de performance;
- lista de requests emitidos pela página Aplicação.
