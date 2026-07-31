## 1. Topologia e contratos puros

- [ ] 1.1 Implementar tipos e classificador puro dos quatro modos a partir de `scoreManifest`.
- [ ] 1.2 Implementar direção, razões de fallback neutro e elegibilidade conservadora de links.
- [ ] 1.3 Cobrir topologia, links nativos e casos desconhecidos com Vitest, incluindo tabelas de todas as rotas principais.

## 2. Shell e lifecycle persistentes

- [ ] 2.1 Criar `SiteExperienceShell`, provider e camada SVG decorativa no `RootLayout` sem mudar a renderização estática.
- [ ] 2.2 Implementar máquina de estados cancelável com um destino pendente, cleanup idempotente e timeout de 1.100 ms.
- [ ] 2.3 Integrar navegação do App Router, montagem do destino e fallback `neutral` sem impedir links reais ou deep links.

## 3. Transições e continuidade

- [ ] 3.1 Implementar `adjacent-score` com âncoras reais e segmento vetorial temporário.
- [ ] 3.2 Implementar `compressed-score-jump` sem montar ou revelar páginas intermediárias.
- [ ] 3.3 Implementar `home-pivot` em fases sobrepostas sem entrada artificial da Home no histórico.
- [ ] 3.4 Implementar `neutral`, budgets de 620–820/900 ms e limpeza ao falhar.
- [ ] 3.5 Sincronizar tema, header persistente, página entrante e overlay sem flash.

## 4. Navegação acessível e movimento reduzido

- [ ] 4.1 Implementar foco pós-consolidação, scroll ao topo e restauração confiável em Back/Forward.
- [ ] 4.2 Implementar reduced motion com troca direta/crossfade de 150–200 ms e reversão por mudança da preferência.
- [ ] 4.3 Garantir teclado, sem JavaScript, links externos/download/hash/nova aba e CTA da aplicação sem bloqueio.
- [ ] 4.4 Tratar cliques concorrentes, timeline interrompida, medição ausente e callbacks obsoletos sem overlay ou foco preso.

## 5. Testes e evidências

- [ ] 5.1 Adicionar histórias e testes de componente para estados, temas, reduced motion, erro e timeout.
- [ ] 5.2 Adicionar modo determinístico e testes Playwright dos quatro modos, deep links, histórico e cliques rápidos.
- [ ] 5.3 Adicionar auditorias axe/teclado e regressões visuais nos checkpoints autorizados.
- [ ] 5.4 Validar budgets de performance, ausência de animação infinita e cleanup GSAP.

## 6. Gate da Fase 05

- [ ] 6.1 Atualizar documentação e evidências da Fase 05 com rastreabilidade para specs e ADRs.
- [ ] 6.2 Executar lint, typecheck, unidade, Storybook, E2E, motion, visual, acessibilidade, build standalone e Lighthouse.
- [ ] 6.3 Comparar visualmente com arquétipos autorizados e registrar auditorias independentes sem atualizar baselines oportunisticamente.
- [ ] 6.4 Marcar a Fase 05 concluída somente após todos os gates verdes e nenhuma pendência bloqueadora.
