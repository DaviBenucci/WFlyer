# Hierarquia documental

## Camadas

1. **Governança:** define autoridade, stack e processo de mudança.
2. **Produto:** define o que o site entrega e para quem.
3. **Design e motion:** define como o conteúdo aparece, se conecta e responde.
4. **Conteúdo:** define mensagens, estrutura editorial e limites de afirmação.
5. **Implementação:** define arquitetura técnica e ordem de execução.
6. **Segurança:** define controles obrigatórios.
7. **QA:** define como comprovar a conclusão.
8. **Operação:** define atualização e resposta a falhas.
9. **Referências visuais:** registra imagens aprovadas, specs e storyboards.

## Status documental

Cada documento ou referência pode estar em um dos estados:

- `NORMATIVO`: obrigatório;
- `PROVISÓRIO`: obrigatório até substituição aprovada;
- `REFERÊNCIA`: orienta, mas não pode contrariar normas;
- `HISTÓRICO`: preservado, sem orientar implementação atual;
- `APPROVED`: referência visual individual aprovada;
- `PENDING`: referência aguardando geração ou aprovação.

## Regras

- os documentos de governança, produto, design, motion, implementação, segurança e QA são normativos, salvo indicação explícita;
- copy pode permanecer provisória mesmo quando a composição visual está aprovada;
- imagens de inspiração são referência não produtiva;
- golden reference `approved` é normativa para composição da página correspondente;
- arquivos históricos existem somente para preservar rastreabilidade;
- o nome antigo de um arquivo não altera seu status declarado no conteúdo.
