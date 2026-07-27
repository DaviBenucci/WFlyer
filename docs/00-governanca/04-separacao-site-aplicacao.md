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
- status geral do produto;
- URL de acesso.

## O site não pode conhecer

- estrutura de banco do aplicativo;
- APIs internas;
- OCR, OMR ou modelos de IA;
- regras de transposição;
- pipeline de processamento;
- filas, workers ou storage;
- confiança musical interna;
- administração, auditoria ou observabilidade do aplicativo.

## Compartilhamento futuro permitido

Somente um pacote de marca poderá ser compartilhado no futuro:

```text
@wflyer/brand
├── tokens oficiais
├── tipografia
├── SVGs oficiais
└── regras de uso
```

O compartilhamento não será criado antes da aprovação da identidade.
