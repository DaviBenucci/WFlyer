# Manutenção de dependências

## Cadência

- advisories críticos: ação imediata;
- revisão de segurança: semanal;
- atualização de patches: mensal ou conforme advisory;
- atualização de minor: planejada e testada;
- atualização de major: projeto separado com ADR.

## Procedimento

1. identificar dependências afetadas;
2. confirmar fonte oficial;
3. atualizar em branch própria;
4. reconstruir lockfile;
5. executar suíte completa;
6. medir bundle e performance;
7. validar motion e formulário;
8. publicar staging;
9. aprovar e promover;
10. manter rollback.

## Proibição

Não atualizar automaticamente a stack principal sem testes ou alterar o motor de animação para acompanhar tendência de mercado.
