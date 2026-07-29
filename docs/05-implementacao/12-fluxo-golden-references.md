# Fluxo de golden references

**Status:** NORMATIVO

## 1. Objetivo

Produzir exemplos visuais individuais suficientemente claros para que o Codex implemente cada página sem inventar composição, sem recortar a prancha mestra e sem interpretar de forma inconsistente a continuidade da partitura.

## 2. Ordem de produção

1. Aplicação — escuro;
2. Como funciona — claro e escuro;
3. Benefícios — claro e escuro;
4. Empresa/Sobre — claro e escuro;
5. Processo — claro e escuro;
6. Home — versões individuais de alta resolução;
7. Serviços — versões individuais de alta resolução;
8. Portfólio — versões individuais de alta resolução;
9. Contato — versões individuais de alta resolução;
10. Footer — claro e escuro em alta resolução;
11. páginas de detalhe de serviço;
12. mobile claro/escuro de todas as páginas;
13. estados de componentes e storyboards de motion.

A página Aplicação desktop claro já possui referência aprovada.

## 3. Preparação do brief

Antes de gerar uma imagem:

- ler a especificação da página;
- conferir ramo, ordem e terminal no manifesto;
- definir viewport e tema;
- usar a prancha mestra como linguagem global;
- usar a página anterior e a seguinte para definir âncoras da pauta;
- inserir somente conteúdo permitido;
- definir quais elementos são anotação de prancha e quais pertencem ao site.

## 4. Requisitos da imagem

- uma única página por arquivo;
- sem mosaico ou recorte de várias páginas;
- resolução desktop padrão: 1536 × 1024;
- resolução mobile padrão: 390 × 844;
- header completo e legível;
- logo oficial correta;
- português legível;
- composição integral dentro do viewport;
- tema correto;
- entrada/saída da pauta identificáveis;
- sem watermark;
- sem métricas ou canais fictícios;
- sem representar screenshot como elemento final quando a tela deve ser DOM.

## 5. Spec obrigatório

Cada PNG recebe arquivo com o mesmo nome base:

```yaml
id: application-desktop-light
page_id: application
route: /aplicacao-wflyer
status: approved
approval_date: 2026-07-29
viewport:
  width: 1536
  height: 1024
theme: light
branch: application
coordinate: -1
entry_edge: right
exit_edge: left
terminal: false
source: original-generated-reference
ship_in_production: false
```

Também registrar conteúdo, componentes, motion frame, tolerância e observações.

## 6. Revisão humana

A aprovação deve verificar:

- aderência à identidade;
- clareza da hierarquia;
- coerência da página com a partitura;
- texto sem afirmações indevidas;
- logo correta;
- ausência de elementos inventados;
- espaço suficiente para implementação responsiva;
- coerência entre claro e escuro;
- possibilidade técnica de reconstrução com a stack aprovada.

O gerador de imagem ou o Codex não pode autoaprovar.

## 7. Uso pelo Codex

O Codex deve:

1. abrir PNG e spec;
2. listar componentes visíveis;
3. mapear cada elemento para componente semântico;
4. implementar estado estático;
5. capturar screenshot determinístico;
6. comparar com a referência;
7. implementar motion somente depois da correspondência estática;
8. manter a referência fora do bundle.

## 8. Atualização de referência

Uma golden reference só muda quando:

- o usuário aprova nova composição;
- uma restrição técnica/acessível exige correção;
- conteúdo factual precisa ser removido;
- a identidade oficial é atualizada.

Toda substituição exige histórico, novo checksum e revisão dos testes de regressão.
