# Hierarquia documental

## Camadas

1. **Governança:** define autoridade, stack e processo de mudança.
2. **Produto:** define o que o site entrega e para quem.
3. **Design e motion:** define como o conteúdo aparece e responde.
4. **Conteúdo:** define mensagens, estrutura editorial e limites de afirmação.
5. **Implementação:** define arquitetura técnica e ordem de execução.
6. **Segurança:** define controles obrigatórios.
7. **QA:** define como comprovar a conclusão.
8. **Operação:** define atualização e resposta a falhas.

## Status documental

Cada documento pode estar em um dos estados:

- `NORMATIVO`: obrigatório;
- `PROVISÓRIO`: obrigatório até substituição aprovada;
- `REFERÊNCIA`: orienta, mas não pode contrariar normas;
- `HISTÓRICO`: preservado, sem orientar implementação atual.

Todos os documentos deste pacote são `NORMATIVO`, exceto identidade, textos e imagens explicitamente marcados como `PROVISÓRIO` ou `REFERÊNCIA`.
