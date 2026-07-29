# Testes de motion e regressão visual

## Golden screenshots

Para cada página principal:

- desktop claro;
- desktop escuro;
- mobile claro;
- mobile escuro;
- reduced motion quando houver diferença visual;
- estados interativos relevantes.

## Casos de direção

- Home mostra duas partituras saindo da clave;
- Home → Aplicação desloca narrativamente para a esquerda;
- Aplicação → Como funciona mantém direção à esquerda;
- Como funciona → Benefícios mantém direção à esquerda;
- Home → Empresa desloca narrativamente para a direita;
- Empresa → Serviços → Processo → Portfólio → Contato mantém direção à direita;
- links anteriores usam direção inversa;
- Back/Forward usa direção coerente quando o histórico é conhecido;
- rotas auxiliares usam transição neutra;
- link externo do app não executa transição de capítulo completa.

## Continuidade da pauta

- âncora de saída e entrada permanecem dentro da tolerância definida;
- segmento temporário não salta verticalmente;
- linhas mantêm espaçamento;
- notas não cruzam texto ou controles;
- overlay é removido ao concluir;
- falha de overlay não impede navegação;
- Benefícios termina à esquerda com barra dupla;
- Contato termina à direita com barra dupla.

## Header

- símbolo permanece centralizado;
- compasso ativo acompanha rota;
- header não salta entre temas;
- transição não desmonta o header;
- foco e `aria-current` são atualizados;
- menu mobile fecha e devolve foco.

## Tablet

- tilt respeita limite de 6°;
- controles não se deslocam dentro da tela;
- sair do componente retorna ao repouso;
- foco reduz tilt;
- processamento e resultado são determinísticos;
- reduced motion remove tilt e deslocamentos;
- nenhum request de rede é emitido;
- mobile não cria overflow horizontal.

## Tolerância

- definir limiar por página no `.spec.yaml`;
- geometria da logo: tolerância mínima e comparação específica;
- diferenças deliberadas exigem atualização e aprovação da referência;
- não aceitar baseline novo apenas para esconder regressão;
- texto refluindo por correção editorial pode exigir nova referência.

## Testes manuais

- scroll rápido;
- trackpad;
- roda de mouse;
- teclado PageUp/PageDown;
- navegação Tab/Shift+Tab;
- resize contínuo;
- zoom 200% e 400%;
- mudança de orientação;
- dispositivos com GPU integrada;
- interrupção da transição por navegação rápida;
- aba oculta e retomada.

## Abertura da marca

- capturar frames definidos em `06-qa-animacao-entrada.md`;
- congelar timeline de maneira determinística;
- comparar lock com SVG oficial;
- validar bounding box do handoff para o header;
- testar skip, Escape, sessão, falha, aba oculta e movimento reduzido;
- confirmar que o handoff revela a Home bifurcada, não a cena histórica.
