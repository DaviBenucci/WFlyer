# Estado de fechamento pré-código

**Versão:** 1.4  
**Data:** 2026-07-29  
**Estado de implementação:** `READY_FOR_IMPLEMENTATION`  
**Estado de publicação:** `READY_FOR_DEPLOYMENT_CONFIGURATION`

## Liberação concedida

O Codex está autorizado a implementar o site institucional do início ao fim usando o conjunto visual atualmente aprovado, sem aguardar a geração de uma imagem individual para cada página, tema e viewport.

A autorização visual é baseada em:

- prancha mestra aprovada para linguagem global, Home, Serviços, Portfólio, Contato e Footer;
- referência individual aprovada de Aplicação — desktop claro;
- tokens claro/escuro;
- especificação textual de cada página;
- arquétipos visuais e regras de herança em `docs/design-reference/golden-pages/visual-archetypes.yaml`;
- regras responsivas, de acessibilidade e de motion já documentadas.

O Codex deve reconstruir tudo com HTML, CSS, SVG e componentes. As imagens de referência não entram no produto.

## Decisões operacionais fechadas

- repositório: GitHub, conta `DaviBenucci`, repositório deste projeto;
- origem de hospedagem: Napoleon, aplicação Node.js conectada ao GitHub;
- borda, DNS, HTTPS, WAF e Turnstile: Cloudflare;
- não utilizar VPS ou EasyPanel;
- segredos e variáveis de automação: GitHub Actions Secrets;
- contato público e destinatário: `davi.benucci@wflyer.com.br`;
- redes públicas: Instagram `@davibenucci` e GitHub `DaviBenucci`;
- portfólio inicial: W_Flyer, MSN Distribuidora e MSN Suprimentos;
- analytics: não utilizar na versão inicial;
- homologação final: Davi Benucci.

## Limite externo

A ausência temporária dos valores reais de Turnstile, Resend ou acesso de deploy não bloqueia a implementação. O Codex deve concluir código, testes, workflows, `.env.example` e documentação. A publicação em produção somente ocorre depois que os valores forem cadastrados nos GitHub Actions Secrets e disponibilizados ao runtime da Napoleon.
