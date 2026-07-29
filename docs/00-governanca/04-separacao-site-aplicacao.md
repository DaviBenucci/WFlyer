# Separação entre site e aplicativo

## Fronteira obrigatória

```text
wflyer-site
└── wflyer.com.br

app.WFlyer
└── app.wflyer.com.br
```

## O site pode conhecer

- nome público da aplicação;
- proposta de valor aprovada;
- público-alvo;
- benefícios públicos;
- fluxo geral aprovado;
- instrumentos e exemplos autorizados;
- status geral do produto;
- URL de acesso;
- amostra local determinística para demonstração visual.

## O site não pode conhecer ou importar

- estrutura de banco do aplicativo;
- APIs internas;
- OCR, OMR ou modelos de IA;
- regras reais de transposição;
- pipeline de processamento;
- filas, workers ou storage;
- confiança musical interna;
- administração, auditoria ou observabilidade do aplicativo;
- componentes de domínio do app;
- SDK ou pacote do motor musical.

## Tablet demonstrativo

O tablet do site é uma simulação local de interface. Ele pode alterar uma amostra pré-definida para demonstrar estados visuais, mas não pode chamar o aplicativo, processar arquivo ou reproduzir logicamente o motor musical.

## Compartilhamento permitido

Um pacote de marca pode ser compartilhado entre site e aplicação:

```text
@wflyer/brand
├── tokens oficiais compartilháveis
├── tipografia autorizada
├── SVGs oficiais
└── regras de uso
```

O pacote de marca não inclui componentes de navegação, motion específico do site, golden references, conteúdo, lógica do tablet ou regras do aplicativo. Sua criação exige versionamento e validação próprios.
